import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DialogBox } from "../../../components/components/ui/dialog";
import CustomTextArea from "../../../components/components/ui/CustomTextArea";
import { Mail } from "lucide-react";
import { AuthContext } from "../../authtication/Authticate";
import { apiUrls } from "../../../components/Network/ApiEndpoint";
import { encryptPassword } from "../../../components/EncyptHooks/EncryptLib";
import Toaster, { notify } from "../../../lib/notify";
import IsLoader from "../../loading";

export default function SendMessagePage() {
  const navigate = useNavigate();
  const { token, getCurrentPatientId, getAuthHeader } = useContext(AuthContext);
  const patientid = getCurrentPatientId();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDoctorMobile, setSelectedDoctorMobile] = useState("");

  useEffect(() => {
    if (token && patientid) {
      fetchAppointments();
    } else {
      notify("Authentication required.", "error");
      navigate("/enter-mpin");
    }
  }, [token, patientid]);

  // Convert time to 24-hour format
  const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "PM" && hours !== "12") hours = parseInt(hours) + 12;
    if (modifier === "AM" && hours === "12") hours = "00";
    return `${hours}:${minutes}`;
  };

  // Parse appointment date
  const parseAppointmentDate = (bookingDate, bookingTime) => {
    const dateParts = bookingDate.split("-");
    const day = parseInt(dateParts[0], 10);
    const monthStr = dateParts[1];
    const year = parseInt(dateParts[2], 10);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames.indexOf(monthStr);

    if (month === -1) {
      console.error(`Invalid month format in BookingDate: ${bookingDate}`);
      return null;
    }

    const [hours, minutes] = convertTo24Hour(bookingTime).split(":");
    return new Date(year, month, day, hours, minutes);
  };

  // Fetch message delivery statuses for all doctor mobile numbers
  const fetchMessageDeliveryStatuses = async (doctorMobiles) => {
    const deliveryMap = {};
    const batchSize = 5; // Limit concurrent requests to avoid overwhelming the server

    try {
      const encodedPatientId = encryptPassword(patientid);
      for (let i = 0; i < doctorMobiles.length; i += batchSize) {
        const batch = doctorMobiles.slice(i, i + batchSize);
        const promises = batch.map(async (mobile) => {
          try {
            const response = await axios.get(
              `${apiUrls.viewMessageapi}?PatientID=${encodedPatientId}&MobileNumber=${mobile}`,
              { headers: getAuthHeader() }
            );
            return {
              mobile,
              isDelivered:
                response?.data?.status === true &&
                response.data.response.some((obj) => obj.IsDelivered === "0"),
            };
          } catch (error) {
            console.error(`Error checking delivery for ${mobile}:`, error);
            return { mobile, isDelivered: false };
          }
        });

        const results = await Promise.all(promises);
        results.forEach(({ mobile, isDelivered }) => {
          deliveryMap[mobile] = isDelivered;
        });
      }
    } catch (error) {
      console.error("Error fetching message delivery statuses:", error);
      notify("Failed to check message delivery statuses.", "error");
    }

    return deliveryMap;
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const encodedPatientId = encryptPassword(patientid);
      const response = await axios.post(
        `${apiUrls.doctors}?patientid=${encodedPatientId}&IsTeleconsulation=0&MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D&FromDate=&ToDate=&DoctorID=&Status=`,
        {},
        { headers: getAuthHeader() }
      );

      if (response?.data?.status !== true) {
        setPastAppointments([]);
        notify("No past appointments found.", "info");
        return;
      }

      const past = [];
      const doctorMobiles = new Set();

      response.data.response.forEach((item) => {
        const appointmentDate = parseAppointmentDate(item.BookingDate, item.BookingTime);
        if (!appointmentDate) return;

        const appointmentData = {
          id: `${item.App_ID}`,
          doctor: item.DrName,
          PName: item.PName,
          specialty: item.DoctorSpeciality,
          dateTime: `${item.BookingDate} at ${item.BookingTime}`,
          center: item.CentreName,
          status: item.IsConform === 1 ? "Confirmed" : "Pending",
          doctorId: item.DoctorId,
          doctorMobile: item.DoctorMobile,
          appointmentDate,
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const appointmentOnlyDate = new Date(appointmentDate);
        appointmentOnlyDate.setHours(0, 0, 0, 0);

        if (appointmentOnlyDate.getTime() < today.getTime()) {
          past.push(appointmentData);
          doctorMobiles.add(item.DoctorMobile);
        }
      });

      // Sort appointments by date (latest first)
      past.sort((a, b) => b.appointmentDate - a.appointmentDate);

      // Fetch delivery statuses for all doctor mobiles
      const deliveryMap = await fetchMessageDeliveryStatuses([...doctorMobiles]);

      // Update appointments with delivery status
      const updatedAppointments = past.map((appointment) => ({
        ...appointment,
        isDelivered: deliveryMap[appointment.doctorMobile] || false,
      }));

      setPastAppointments(updatedAppointments);
    } catch (error) {
      console.error("Fetch appointments error:", error.response?.status, error.response?.data);
      if (error.response?.status === 401) {
        notify("Session expired. Please log in again.", "error");
        navigate("/enter-mpin");
      } else {
        notify("Failed to fetch appointments.", "error");
      }
      setPastAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessageToDoctor = async () => {
    if (!description.trim()) {
      notify("Please enter a message.", "error");
      return;
    }

    if (!patientid ) {
      notify("Patiend Id is Missing.", "error");
      return;
    }
    if (!selectedDoctorId ) {
      notify("Doctor Id is Missing.", "error");
      return;
    }
    if (!selectedDoctorMobile ) {
      notify("Contact No is Missing.", "error");
      return;
    }

    setLoading(true);
    try {
      const encodedPatientId = encryptPassword(patientid);
      const encodedMessage = encryptPassword(description);
      const response = await axios.post(
        `${apiUrls.sendMessageapi}?PatientID=${encodedPatientId}&doctorId=${selectedDoctorId}&doctorMobileNumber=${selectedDoctorMobile}&SMStext=${encodedMessage}&MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D`,
        {},
        { headers: getAuthHeader() }
      );

      if (response?.data?.status === true) {
        notify(response?.data?.message || "Message sent successfully.", "success");
        setDescription("");
        setIsOpenDialog(false);
        // Optimistically update isDelivered
        setPastAppointments((prev) =>
          prev.map((appointment) =>
            appointment.doctorMobile === selectedDoctorMobile
              ? { ...appointment, isDelivered: true }
              : appointment
          )
        );
      } else {
        notify(response?.data?.message || "Failed to send message.", "error");
      }
    } catch (error) {
      console.error("Send message error:", error.response?.data);
      notify("An error occurred while sending the message.", "error");
    } finally {
      setLoading(false);
    }
  };

  const AppointmentRow = ({ item, onSelect }) => (
    <div className="p-4 shadow-sm hover:shadow-md transition bg-white rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-md font-extrabold text-blue-600">{item.doctor}</span>
        <span className="text-xs font-bold text-gray-600">{item.center}</span>
      </div>
      <div className="text-[10px] py-[2px] font-medium text-gray-700">{item.PName}</div>
      <div className="text-[10px] py-[2px] font-medium text-gray-700">{item.dateTime}</div>
      <div className="flex justify-between items-center">
        <div
          className={`text-[10px] py-[2px] font-extrabold capitalize ${
            item.status === "Confirmed" ? "text-green-500" : "text-gray-400"
          }`}
        >
          {item.status}
        </div>
        <button
          className={`text-xs font-bold ${
            item.isDelivered ? "text-gray-400 cursor-not-allowed" : "text-blue-500 hover:text-blue-700"
          }`}
          onClick={() => onSelect(item)}
          disabled={item.isDelivered}
        >
          {item.isDelivered ? "Message Sent" : "Send Message"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-4">
      <Toaster />
      <div className="text-center">
        <Mail className="h-12 w-12 mx-auto text-blue-600 bg-white border rounded-lg shadow-md p-2" />
        <h1 className="text-3xl font-bold text-blue-600 mt-2">Your Past Appointments</h1>
        <p className="text-gray-500">Send a message to your doctor</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="space-y-6 p-6">
            <h2 className="text-2xl font-bold text-blue-600 text-center">Past Appointments</h2>
            {loading ? (
              <div className="flex justify-center items-center">
                <IsLoader isFullScreen={false} size="6" />
              </div>
            ) : pastAppointments.length > 0 ? (
              <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                {pastAppointments.map((item) => (
                  <AppointmentRow
                    key={item.id}
                    item={item}
                    onSelect={(item) => {
                      setSelectedDoctorId(item.doctorId);
                      setSelectedDoctorMobile(item.doctorMobile);
                      setIsOpenDialog(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">No past appointments found.</div>
            )}
          </div>
        </div>
      </div>

      <DialogBox
        open={isOpenDialog}
        onOpenChange={(open) => {
          setIsOpenDialog(open);
          if (!open) setDescription("");
        }}
        title="Send Message"
        description="You can send only one message to your selected doctor."
        size="lg"
        footer={
          <>
            <button
              className={`px-4 py-2 text-sm font-medium rounded transition ${
                loading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              onClick={sendMessageToDoctor}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
            <button
              className="px-4 py-2 text-sm font-medium bg-red-100 rounded hover:bg-red-200 transition text-gray-700"
              onClick={() => {
                setIsOpenDialog(false);
                setDescription("");
              }}
            >
              Cancel
            </button>
          </>
        }
      >
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Type Your Message</label>
          <CustomTextArea
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500 rounded-lg p-2"
            value={description}
            handleChange={setDescription}
            placeHolderText="Send a message to your doctor."
          />
        </div>
      </DialogBox>
    </div>
  );
}