import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { parse } from 'date-fns';
import CustomDatePicker from '../../../../components/components/ui/CustomDatePicker';
import CustomSelect from '../../../../components/components/ui/CustomSelect';
import CustomTextArea from '../../../../components/components/ui/CustomTextArea';
import { Button } from '../../../../components/components/ui/button';
import { DialogBox, closeIcon } from '../../../../components/components/ui/dialog';
import { AlarmClockPlus, Calendar, FileDown, Hospital } from 'lucide-react';
import Toaster, { notify } from '../../../../lib/notify';
import { AuthContext } from '../../../../app/authtication/Authticate';
import { apiUrls } from '../../../../components/Network/ApiEndpoint';
import { encryptPassword } from '../../../../components/EncyptHooks/EncryptLib';
import IsLoader from '../../../loading';
import PDFDownloader from '../../../../components/components/pdfDownloader/PdfDowloader';

// AppointmentsPage component
const AppointmentsPage = () => {
  const navigate = useNavigate();
  const { ID: centerID } = useParams();
  const { token, getAuthHeader, getCurrentPatientId, userData } = useContext(AuthContext);
  const patientid = getCurrentPatientId();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('book');
  const [departments, setDepartments] = useState([]);
  const [doctorsByDept, setDoctorsByDept] = useState({});
  const [isDoctors, setDoctors] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSlotsLoading, setTimeSlotsLoading] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [doctorNotesOpen, setDoctorNotesOpen] = useState(false);
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState('');
  const [cancelAppointmentId, setCancelAppointmentId] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [newDate, setNewDate] = useState(null);
  const [newSlot, setNewSlot] = useState(null);
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  });
  const [toDate, setToDate] = useState(new Date());
  const [appointmentRate, setAppointmentRate] = useState(null);
  const [webViewVisible, setWebViewVisible] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const iframeRef = useRef(null);

  const handleAppCancelReason = (val) => setCancelReason(val);

  // Error handler
  const handleApiError = (error) => {
    if (error.response?.status === 401) {
      navigate('/login');
    } else {
      notify(error.response?.data?.message || 'An error occurred', 'error');
    }
    console.error('API Error:', error);
  };

  // Validation for booking
  const validateBooking = () => {
    if (!selectedDepartment) return notify('Please select a department', 'warn'), false;
    if (!selectedDoctor) return notify('Please select a doctor', 'warn'), false;
    if (!selectedDate) return notify('Please select a date', 'warn'), false;
    if (!selectedSlot) return notify('Please select a time slot', 'warn'), false;
    return true;
  };

  // Convert to 24-hour format
  const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Fetch doctors
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      if (!token) return notify('No token available', 'error');
      const response = await axios.post(
        apiUrls.doctor_speciality,
        { CentreID: centerID || 1 },
        { headers: getAuthHeader() }
      );
      if (response?.data?.status && Array.isArray(response.data.response)) {
        const validDoctors = response.data.response
          .filter(doc => doc.DoctorSpecilization && doc.doctorname)
          .map(doc => ({
            id: doc.ID,
            name: doc.doctorname.trim(),
            specialization: doc.DoctorSpecilization,
            profileImg: doc.ProfileImg || null,
            centre: doc.CentreName,
          }));
        const groupedBySpecialization = validDoctors.reduce((acc, doc) => {
          (acc[doc.specialization] = acc[doc.specialization] || []).push(doc);
          return acc;
        }, {});
        setDepartments(Object.keys(groupedBySpecialization).map(dep => ({ value: dep, label: dep })));
        setDoctorsByDept(groupedBySpecialization);
        setDoctors(validDoctors);
      } else {
        notify('No doctor specialties available', 'error');
        setDoctors([]);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch time slots
  const fetchTimeSlots = async (date = selectedDate, doctorId = selectedDoctor, isReschedule = false) => {
    setTimeSlotsLoading(true);
    setTimeSlots([]);
    try {
      if (!token || !date || isNaN(new Date(date).getTime())) return notify('Invalid date or token', 'error');
      const doctor = isDoctors.find(doc => doc.id === doctorId);
      if (!doctor?.id) return notify('Selected doctor not found', 'error');
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const response = await axios.get(
        `${apiUrls.appointmentslot}?CentreID=${centerID || 1}&appdate=${formattedDate}&DoctorID=${doctor.id}`,
        { headers: getAuthHeader() }
      );
      if (response?.data?.status && Array.isArray(response.data.response)) {
        const uniqueSlots = response.data.response
          .filter((slot, index, self) => index === self.findIndex(s => s.FromTime === slot.FromTime && s.ToTime === slot.ToTime))
          .filter(slot => slot.SlotStatus !== 'Booked')
          .map(slot => ({
            value: `${slot.FromTime}-${slot.ToTime}`,
            label: `${slot.FromTime} - ${slot.ToTime} (${slot.ShiftName})`,
            fromTime: slot.FromTime,
            toTime: slot.ToTime,
            status: slot.SlotStatus,
          }));
        setTimeSlots(uniqueSlots);
        if (uniqueSlots.length === 0) notify('No available time slots', 'info');
      } else {
        notify(response.data?.message || 'No time slots available', 'info');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setTimeSlotsLoading(false);
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const encodedPatientId = encryptPassword(encryptPassword(patientid));
      const fromDateStr = fromDate.toISOString().split('T')[0];
      const toDateStr = toDate.toISOString().split('T')[0];
      const apiUrl = `${apiUrls.doctors}?patientid=${encodedPatientId}&IsTeleconsulation=0&MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D&FromDate=${fromDateStr}&Todate=${toDateStr}&DoctorID=&Status=`;
      const response = await axios.post(apiUrl, null, { headers: getAuthHeader() });
      if (response?.data?.status) {
        const [past, upcoming] = response.data.response.reduce(
          (acc, item) => {
            const appointmentDate = parse(`${item.BookingDate} ${item.BookingTime}`, 'dd-MMM-yyyy hh:mm a', new Date());
            if (isNaN(appointmentDate.getTime())) {
              console.error(`Invalid date format: ${item.BookingDate}`);
              return acc;
            }
            const appointmentData = {
              id: item.AppID,
              doctor: item.DrName,
              patientName: item.PName,
              specialty: item.DoctorSpeciality,
              appointmentDate: item.BookingDate,
              appointmentTime: item.BookingTime,
              pastappointmentTime: item.AppDateTime,
              center: item.CentreName,
              status: item.IsConform === 1 ? 'Confirmed' : 'Pending',
              cancel: item.IsCancel,
              expired: item.isExpired,
              AppID: item.AppID,
            };
            (item.IsCancel === 1 || appointmentDate < new Date() ? acc[0] : acc[1]).push(appointmentData);
            return acc;
          },
          [[], []]
        );
        setPastAppointments(past.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)));
        setUpcomingAppointments(upcoming.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)));
      } else {
        notify(response.data?.message || 'No data available', 'error');
        setPastAppointments([]);
        setUpcomingAppointments([]);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch appointment rate
  const fetchAppointmentRate = async (doctorId, centerId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrls.appointmentRate}?IsTeleconsultation=0&DoctorID=${doctorId}&CenteID=${centerId}`,
        {},
        { headers: getAuthHeader() }
      );
      if (response?.data?.status && response.data.response.length > 0) {
        setAppointmentRate(response.data.response[0]);
      } else {
        notify('Unable to fetch appointment rate', 'error');
        setAppointmentRate(null);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Save appointment
  const fetchSaveAppointment = async (referenceNo) => {
    setLoading(true);
    try {
      if (!appointmentRate?.ItemCode || !appointmentRate?.ItemID) return notify('Missing rate details', 'error');
      const doctor = isDoctors.find(doc => doc.id === selectedDoctor);
      const formattedDate = selectedDate
        ? `${String(new Date(selectedDate).getDate()).padStart(2, '0')}-${[
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        ][new Date(selectedDate).getMonth()]}-${new Date(selectedDate).getFullYear()}`
        : '';
      const body = {
        appointment_mobile: [{
          AppDate: formattedDate,
          AppType: 5,
          CenrteID: centerID || 1,
          DoctorID: doctor?.id,
          Doctor_Name: doctor?.name,
          EndTime: selectedSlot?.toTime || '',
          FromTime: selectedSlot?.fromTime || '',
          HashCode: '534',
          ItemCode: appointmentRate.ItemCode,
          ItemID: appointmentRate.ItemID,
          PAddress: userData?.Address || '',
          PAge: userData?.Age || '',
          PAmount: appointmentRate.Rate,
          PEmail: userData?.Email || '',
          PFirstName: userData?.FirstName || '',
          PGender: userData?.Gender || '',
          PLastName: userData?.LastName || '',
          PMobileno: userData?.Mobile || '',
          PTitle: userData?.Title || '',
          PatientID: patientid,
          Ratelistid: appointmentRate.RateListID || 10,
          ScheduleChargeID: appointmentRate.ScheduleChargeID || 100,
          UserID: userData?.ID || 'gRWyl7xEbEiVQ3u397J1KQ==',
          IsTeleconsulation: 0,
        }],
        appointment_mobilepaymentdetail: [{
          Adjustment: appointmentRate.Rate || 1100.0,
          ReffrenceNo: referenceNo || 'zxc12345678',
          OrderID: 'zxc123456',
        }],
      };
      const response = await axios.post(apiUrls.saveAppointment, body, { headers: getAuthHeader() });
      if (response.data?.status) {
        setSelectedAppointmentId(response.data.response?.[0]?.AppID || '');
        notify('Appointment saved successfully!', 'success');
        setShowConfirm(false);
        setWebViewVisible(false);
        setSelectedDepartment('');
        setSelectedDoctor('');
        setSelectedDate(null);
        setSelectedSlot(null);
        setTimeSlots([]);
        setAppointmentRate(null);
        fetchAppointments();
        fetchDoctors();
      } else {
        notify(response.data?.message || 'Failed to save appointment', 'error');
        setWebViewVisible(false);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle payment
  const handlePayment = async () => {
    setLoading(true);
    try {
      const patientID = patientid; // Encrypt for security
      const phoneNumber = userData?.Mobile || '';
      const amount = appointmentRate?.Rate || 0;
      const BillNo = "";
      // Replace with a valid M-Pesa API endpoint or local proxy if needed
      const url = `http://197.138.207.30/Tenwek2208/Design/OPD/MobileMpesaRequest.aspx?PatientID=${patientID}&PhoneNumber=${phoneNumber}&BillNo=${BillNo}&Amount=${amount}`;
      // Fallback to sandbox if local fails (requires Safaricom sandbox setup)
      // const url = `https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest`; // Use with proper STK Push request
      setPaymentUrl(url);
      setWebViewVisible(true);
    } catch (error) {
      notify('Failed to initiate payment', 'error');
      console.error('Payment Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle iframe navigation for payment
  const handleIframeNavigation = (event) => {
    const url = event.target.src;
    // const url = iframe.contentWindow?.location.href || iframe.src;
    console.log('Iframe URL:', url);
    if (url.includes('/MobileMpesaSuccess.aspx')) {
      const queryString = url.split('?')[1] || '';
      const params = new URLSearchParams(queryString);
      const receiptNumber = params.get('ReceiptNumber') || url.match(/ReceiptNumber=([^&]+)/)?.[1];
      if (receiptNumber) {
        fetchSaveAppointment(receiptNumber);
        setWebViewVisible(false);
      } else {
        notify('Payment successful but no receipt number found', 'warn');
        setWebViewVisible(false);
      }
    } else if (url.includes('/failure') || url.includes('payment=failed')) {
      notify('Payment failed. Please try again.', 'error');
      setWebViewVisible(false);
    }
  };



  // Reschedule appointment
  const rescheduleAppointment = async () => {
    if (!newDate || !newSlot) return notify('Select new date and time', 'warn');
    const selectedSlotData = timeSlots.find(slot => slot.fromTime === newSlot.fromTime && slot.toTime === newSlot.toTime);
    if (!selectedSlotData || selectedSlotData.status === 'Booked') return notify('Slot not available', 'error');
    setLoading(true);
    try {
      const formattedDate = new Date(newDate).toISOString().split('T')[0];
      const fromTime = convertTo24Hour(newSlot.fromTime);
      const toTime = convertTo24Hour(newSlot.toTime);
      const apiUrl = `${apiUrls.rescheduleAppointment}?fromtime=${fromTime}&totime=${toTime}&AppDate=${formattedDate}&AppID=${rescheduleAppointmentId}`;
      const response = await axios.post(apiUrl, {}, { headers: getAuthHeader() });
      if (response?.data?.status) {
        notify('Appointment rescheduled!', 'success');
        setRescheduleOpen(false);
        setNewDate(null);
        setNewSlot(null);
        setTimeSlots([]);
        fetchAppointments();
      } else {
        notify(response.data?.message || 'Reschedule failed', 'error');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel appointment
  const cancelAppointment = async () => {
    if (!cancelReason) return notify('Provide cancellation reason', 'warn');
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('mobileappid', 'gRWyl7xEbEiVQ3u397J1KQ==');
      formData.append('UserType', 'Patient');
      formData.append('AccessScreen', 'Pathology');
      const apiUrl = `${apiUrls.cancelAppointment}?appid=${cancelAppointmentId}&CancelReason=${cancelReason}`;
      const response = await axios.post(apiUrl, formData.toString(), {
        headers: { ...getAuthHeader(), 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (response?.data?.status) {
        notify('Appointment cancelled!', 'success');
        setCancelOpen(false);
        setCancelReason('');
        setCancelAppointmentId('');
        fetchAppointments();
      } else {
        notify(response.data?.message || 'Cancel failed', 'error');
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and tab changes
  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (tab === 'upcoming' || tab === 'past') fetchAppointments();
  }, [tab, fromDate, toDate]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) fetchTimeSlots();
  }, [selectedDoctor, selectedDate]);

  useEffect(() => {
    if (rescheduleOpen && newDate && rescheduleAppointmentId) {
      const appointment = upcomingAppointments.find(app => app.id === rescheduleAppointmentId);
      const doctorId = appointment ? isDoctors.find(doc => doc.name === appointment.doctor)?.id : null;
      if (doctorId) fetchTimeSlots(newDate, doctorId, true);
      else notify('Doctor not found', 'error');
    }
  }, [rescheduleOpen, newDate, rescheduleAppointmentId]);

  const handleDepartmentChange = (selected) => {
    setSelectedDepartment(selected.value);
    setDoctors(doctorsByDept[selected.value] || []);
    setSelectedDoctor('');
    setSelectedSlot(null);
    setTimeSlots([]);
  };

  const handleConfirm = async () => {
    if (validateBooking()) {
      const doctor = isDoctors.find(doc => doc.id === selectedDoctor);
      await fetchAppointmentRate(doctor.id, centerID || 1);
      setShowConfirm(true);
    }
  };

  return (
    <>
      <Toaster />
      <div className="space-y-8 p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600">Doctor Appointments</h1>
          <p className="text-gray-500">Manage your upcoming and past appointments.</p>
        </div>

        {/* Payment Dialog */}
        <DialogBox
          open={webViewVisible}
          onOpenChange={setWebViewVisible}
          title="M-Pesa Payment"
          size="lg"
          closeIcon={closeIcon}
          footer={
            <button
              className="px-3 py-1 text-sm font-medium bg-red-100 rounded hover:bg-blue-500 transition"
              onClick={() => setWebViewVisible(false)}
            >
              Back
            </button>
          }
        >
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <IsLoader isFullScreen={false} size="6" text="Loading Payment..." />
            </div>
          ) : paymentUrl ? (
            <iframe
              ref={iframeRef}
              src={paymentUrl}
              style={{ width: '100%', height: '400px', border: 'none' }}
              title="M-Pesa Payment"
              //   sandbox="allow-same-origin allow-scripts" // Add security
              onLoad={handleIframeNavigation}
              onError={() => notify('Failed to load payment', 'error')}
            />
          ) : (
            <div className="text-center text-red-500">Payment page loading failed.</div>
          )}
        </DialogBox>

        <div className="m-0">
          <div className="grid grid-cols-3 gap-2">
            {['book', 'upcoming', 'past'].map(tabName => (
              <button
                key={tabName}
                className={`py-2 shadow-md border rounded-t-md ${tab === tabName ? 'bg-blue-800 text-white font-semibold' : ''}`}
                onClick={() => setTab(tabName)}
              >
                {tabName === 'book' ? 'Book New' : tabName === 'upcoming' ? 'Upcoming' : 'Past'}
              </button>
            ))}
          </div>

          {tab === 'book' && (
            <div className="bg-white border rounded-b-lg p-4 shadow">
              {loading ? (
                <div className="text-center">
                  <IsLoader isFullScreen={false} size="6" text="Loading..." />
                </div>
              ) : showConfirm ? (
                <>
                  <div className="p-2 text-center my-2">
                    <h2 className="text-xl font-bold mb-4 text-primary">Confirm Appointment</h2>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-4">Appointment Details</h2>
                  </div>
                  <div className="space-y-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6 border p-5 rounded">
                    <p><strong>Patient:</strong> {userData?.AccountHolderName || patientid}</p>
                    <p><strong>Center:</strong> {isDoctors.find(doc => doc.id === selectedDoctor)?.centre || '—'}</p>
                    <p><strong>Doctor:</strong> {isDoctors.find(doc => doc.id === selectedDoctor)?.name || '—'}</p>
                    <p><strong>Department:</strong> {selectedDepartment || '—'}</p>
                    <p><strong>Date:</strong> {selectedDate ? new Date(selectedDate).toLocaleDateString('en-GB') : '—'}</p>
                    <p><strong>Time:</strong> {selectedSlot?.label || '—'}</p>
                    <p><strong>Item:</strong> {appointmentRate?.Item || '—'}</p>
                    <p><strong>Rate:</strong> {appointmentRate?.Rate || '—'}</p>
                    <div className="flex gap-4 mt-4">
                      <button
                        className="px-4 py-2 bg-emerald-200 rounded w-full"
                        onClick={() => setShowConfirm(false)}
                      >
                        Back
                      </button>
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded w-full"
                        onClick={handlePayment}
                        disabled={!appointmentRate?.Rate}
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="py-2 px-4 shadow-md my-2 flex justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">Book a New Appointment</h2>
                      <p className="text-xs text-cyan-500">Finding a doctor at Tenwek</p>
                    </div>
                    <div>
                      <Button className="text-white btn" onClick={() => navigate(-1)}>
                        Change Center
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-6 grid md:grid-cols-2 gap-6">
                    <CustomSelect
                      placeholder="Select a Department"
                      options={departments}
                      value={departments.find(dep => dep.value === selectedDepartment) || null}
                      onChange={handleDepartmentChange}
                    />
                    <CustomSelect
                      placeholder="Select a Doctor"
                      options={isDoctors.map(doc => ({ value: doc.id, label: doc.name }))}
                      value={selectedDoctor ? { value: selectedDoctor, label: isDoctors.find(doc => doc.id === selectedDoctor)?.name || '' } : null}
                      onChange={selectedOption => setSelectedDoctor(selectedOption.value)}
                    />
                    <CustomDatePicker
                      repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                      value={selectedDate}
                      placeHolderText="Select Date"
                      handleDate={date => setSelectedDate(date)}
                      disablePastDates={true}
                      icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
                    />
                    <CustomSelect
                      placeholder={timeSlotsLoading ? 'Loading...' : timeSlots.length === 0 ? 'No available slots' : 'Select a Time Slot'}
                      options={timeSlots}
                      value={selectedSlot ? { value: selectedSlot.value, label: selectedSlot.label } : null}
                      onChange={selectedOption => {
                        const slot = timeSlots.find(slot => slot.value === selectedOption.value);
                        if (slot.status !== 'Booked') setSelectedSlot(slot);
                        else notify('Slot not available', 'warn');
                      }}
                      isDisabled={timeSlotsLoading || timeSlots.length === 0}
                    />
                  </div>
                  <div className="flex justify-center pt-4">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded uppercase disabled:opacity-50"
                      onClick={handleConfirm}
                      disabled={loading}
                    >
                      Confirm Appointment
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {tab === 'upcoming' && (
            <div className="bg-white border rounded-b-lg p-4 shadow">
              <DialogBox
                open={rescheduleOpen}
                onOpenChange={setRescheduleOpen}
                title="Reschedule Appointment"
                size="sm"
                footer={
                  <>
                    <button
                      className="px-3 py-1 text-sm font-medium bg-red-100 rounded hover:bg-blue-500 transition"
                      onClick={() => {
                        setRescheduleOpen(false);
                        setNewDate(null);
                        setNewSlot(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1 text-sm font-medium bg-blue-300 text-white rounded hover:bg-blue-500 transition"
                      onClick={rescheduleAppointment}
                      disabled={timeSlotsLoading || timeSlots.length === 0}
                    >
                      Save
                    </button>
                  </>
                }
              >
                <div className="space-y-4">
                  <div>
                    <label>Select New Date</label>
                    <CustomDatePicker
                      repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                      value={newDate}
                      placeHolderText="Select Date"
                      handleDate={date => setNewDate(date)}
                      icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
                    />
                  </div>
                  <div>
                    <label>Select Time Slot</label>
                    <CustomSelect
                      placeholder={timeSlotsLoading ? 'Loading...' : timeSlots.length === 0 ? 'No available slots' : 'Select a Time Slot'}
                      options={timeSlots}
                      value={newSlot ? { value: `${newSlot.fromTime}-${newSlot.toTime}`, label: `${newSlot.fromTime} - ${newSlot.toTime}` } : null}
                      onChange={selectedOption => {
                        const slot = timeSlots.find(s => s.value === selectedOption.value);
                        if (slot.status !== 'Booked') setNewSlot({ fromTime: slot.fromTime, toTime: slot.toTime });
                        else notify('Slot not available', 'warn');
                      }}
                      isDisabled={timeSlotsLoading || timeSlots.length === 0}
                    />
                  </div>
                </div>
              </DialogBox>

              <DialogBox
                open={cancelOpen}
                onOpenChange={setCancelOpen}
                title="Cancel Appointment"
                size="sm"
                footer={
                  <>
                    <button
                      className="px-3 py-1 text-sm font-medium bg-red-100 rounded hover:bg-blue-500 transition"
                      onClick={() => {
                        setCancelOpen(false);
                        setCancelReason('');
                      }}
                    >
                      Back
                    </button>
                    <button
                      className="px-3 py-1 text-sm font-medium bg-blue-300 text-white rounded hover:bg-blue-500 transition"
                      onClick={cancelAppointment}
                    >
                      Cancel
                    </button>
                  </>
                }
              >
                <div className="my-3">
                  <label>Reason For Cancellation</label>
                  <CustomTextArea
                    repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                    value={cancelReason}
                    placeHolderText="Reasons..."
                    handleChange={handleAppCancelReason}
                  />
                </div>
              </DialogBox>

              <div className="py-2 px-4 shadow-md my-2">
                <h2 className="text-2xl font-bold mb-1">Upcoming Appointments</h2>
              </div>
              {loading ? (
                <div className="text-center">
                  <IsLoader isFullScreen={false} size="6" text="Loading Upcoming..." />
                </div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="text-center text-gray-500">No upcoming appointments.</div>
              ) : (
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                  {upcomingAppointments.map(app => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-primary">{app.doctor}</h3>
                          <span className="text-xs font-semibold">
                            {app.appointmentDate} at {app.appointmentTime}
                          </span>
                          <div className={`text-xs font-semibold ${app.cancel === 1 ? 'text-red-600' : 'text-green-900'}`}>
                            {app.cancel === 1 ? 'Cancelled' : app.status}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold py-3">{app.center}</div>
                        {!app.cancel && (
                          <div className="text-xs font-semibold py-3 flex gap-2">
                            <button
                              className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                              onClick={() => {
                                setRescheduleAppointmentId(app.id);
                                setRescheduleOpen(true);
                              }}
                            >
                              Reschedule
                            </button>
                            <button
                              className="px-2 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition"
                              onClick={() => {
                                setCancelAppointmentId(app.id);
                                setCancelOpen(true);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'past' && (
            <div className="bg-white border rounded-b-lg p-4 shadow">
              <DialogBox
                open={doctorNotesOpen}
                onOpenChange={setDoctorNotesOpen}
                title="Doctor Notes"
                size="xl"
                closeIcon={closeIcon}
                footer={
                  <button
                    className="px-3 py-1 text-sm font-medium bg-blue-300 text-white rounded hover:bg-blue-500 transition"
                    onClick={() => setDoctorNotesOpen(false)}
                  >
                    Close
                  </button>
                }
              >
                {/* Placeholder for doctor notes (implement API endpoint) */}
                <div className="p-4 text-center">Doctor notes loading...</div>
              </DialogBox>

              <div className="grid md:grid-cols-2 lg:grid-cols-3">
                <div className="py-2 px-4">
                  <h2 className="text-2xl font-bold mb-1">Past Appointments</h2>
                </div>
                <div className="flex gap-3">
                  <CustomDatePicker
                    repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                    value={fromDate}
                    placeHolderText="From Date"
                    handleDate={date => setFromDate(date)}
                  />
                  <CustomDatePicker
                    repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
                    value={toDate}
                    placeHolderText="To Date"
                    handleDate={date => setToDate(date)}
                  />
                </div>
              </div>
              {loading ? (
                <div className="text-center">
                  <IsLoader isFullScreen={false} size="6" text="Loading Past..." />
                </div>
              ) : pastAppointments.length === 0 ? (
                <div className="text-center text-gray-500">No past appointments.</div>
              ) : (
                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                  {pastAppointments.map(app => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="text-lg font-medium text-primary">{app.doctor}</h3>
                          <div className="text-xs font-semibold">{app.patientName}</div>
                          <span className="text-xs font-semibold">{app.pastappointmentTime}</span>
                          <div className={`text-xs font-extrabold ${app.cancel === 1 ? 'text-red-600' : 'text-green-900'}`}>
                            {app.cancel === 1 ? 'Cancelled' : app.expired === 1 ? 'Expired' : 'Completed'}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-green-600 py-4">{app.center}</div>

                        {app.cancel === 0 && (
                          <div className="text-xs font-semibold py-4 flex gap-2">
                            <a
                              href={`http://197.138.207.30/Tenwek2208/Design/CPOE/DoctorPrescription.aspx?App_ID=${app.AppID}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 p-2 border rounded-md text-sm hover:bg-gray-100 transition-colors"
                            >
                              <FileDown className="h-5 w-5 text-gray-600" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AppointmentsPage;