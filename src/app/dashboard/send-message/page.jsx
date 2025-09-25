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

  // single state for everything
  const [state, setState] = useState({
    isOpenDialog: false,
    pastAppointments: [],
    loading: false,
    description: "",
    selectedDoctorId: "",
    selectedDoctorMobile: "",
  });

  // update helper
  const updateState = (updates) =>
    setState((prev) => ({ ...prev, ...updates }));

  useEffect(() => {
    if (token && patientid) {
      fetchAppointments();
    } else {
      notify("Authentication required.", "error");
      navigate("/enter-mpin");
    }
  }, [token, patientid]);

  const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    if (modifier === "PM" && hours !== "12") hours = parseInt(hours) + 12;
    if (modifier === "AM" && hours === "12") hours = "00";
    return `${hours}:${minutes}`;
  };

  const parseAppointmentDate = (bookingDate, bookingTime) => {
    const dateParts = bookingDate.split("-");
    const day = parseInt(dateParts[0], 10);
    const monthStr = dateParts[1];
    const year = parseInt(dateParts[2], 10);

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];
    const month = monthNames.indexOf(monthStr);
    if (month === -1) return null;

    const [hours, minutes] = convertTo24Hour(bookingTime).split(":");
    return new Date(year, month, day, hours, minutes);
  };

  const fetchMessageDeliveryStatuses = async (doctorMobiles) => {
    const deliveryMap = {};
    const batchSize = 5;

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
          } catch {
            return { mobile, isDelivered: false };
          }
        });

        const results = await Promise.all(promises);
        results.forEach(({ mobile, isDelivered }) => {
          deliveryMap[mobile] = isDelivered;
        });
      }
    } catch {
      notify("Failed to check message delivery statuses.", "error");
    }

    return deliveryMap;
  };

  const fetchAppointments = async () => {
    updateState({ loading: true });
    try {
      const encodedPatientId = encryptPassword(patientid);
      const response = await axios.post(
        `${apiUrls.doctors}?patientid=${encodedPatientId}&IsTeleconsulation=0&MobileAppID=gRWyl7xEbEiVQ3u397J1KQ%3D%3D&FromDate=&ToDate=&DoctorID=&Status=`,
        {},
        { headers: getAuthHeader() }
      );

      if (response?.data?.status !== true) {
        updateState({ pastAppointments: [] });
        notify("No past appointments found.", "info");
        return;
      }

      const past = [];
      const doctorMobiles = new Set();

      response.data.response.forEach((item) => {
        const appointmentDate = parseAppointmentDate(item.BookingDate, item.BookingTime);
        if (!appointmentDate) return;

        const appointmentData = {
          id: item.App_ID,
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

      past.sort((a, b) => b.appointmentDate - a.appointmentDate);

      const deliveryMap = await fetchMessageDeliveryStatuses([...doctorMobiles]);
      const updatedAppointments = past.map((a) => ({
        ...a,
        isDelivered: deliveryMap[a.doctorMobile] || false,
      }));

      updateState({ pastAppointments: updatedAppointments });
    } catch (error) {
      if (error.response?.status === 401) {
        notify("Session expired. Please log in again.", "error");
        navigate("/enter-mpin");
      } else {
        notify("Failed to fetch appointments.", "error");
      }
      updateState({ pastAppointments: [] });
    } finally {
      updateState({ loading: false });
    }
  };

  const sendMessageToDoctor = async () => {
    const { description, selectedDoctorId, selectedDoctorMobile } = state;
    if (!description.trim()) return notify("Please enter a message.", "error");
    if (!patientid) return notify("Patient Id is Missing.", "error");
    if (!selectedDoctorId) return notify("Doctor Id is Missing.", "error");
    if (!selectedDoctorMobile) return notify("Contact No is Missing.", "error");

    updateState({ loading: true });
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
        updateState({
          description: "",
          isOpenDialog: false,
          pastAppointments: state.pastAppointments.map((a) =>
            a.doctorMobile === selectedDoctorMobile ? { ...a, isDelivered: true } : a
          ),
        });
      } else {
        notify(response?.data?.message || "Failed to send message.", "error");
      }
    } catch {
      notify("An error occurred while sending the message.", "error");
    } finally {
      updateState({ loading: false });
    }
  };

  const AppointmentRow = ({ item, onSelect }) => (
    <div className="p-4 shadow-lg hover:shadow-md transition bg-white rounded-lg">
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
          onClick={() =>
            onSelect(item)
          }
          disabled={item.isDelivered}
        >
          {item.isDelivered ? "Message Sent" : "Send Message"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-5 p-2">
      <Toaster />
      <div className="text-center">
        <Mail className="h-12 w-12 mx-auto text-blue-600 bg-white border rounded-lg shadow-md p-2" />
        <h1 className="text-3xl font-bold text-blue-600 mt-2">Your Past Appointments</h1>
        <p className="text-gray-500">Send a message to your doctor</p>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="space-y-6 p-6">
            <h2 className="text-2xl font-bold text-blue-600 text-center">Past Appointments</h2>
            {state.loading ? (
              <div className="flex justify-center items-center">
                <IsLoader isFullScreen={false} size="6" />
              </div>
            ) : state.pastAppointments.length > 0 ? (
              <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {state.pastAppointments.map((item) => (
                  <AppointmentRow
                    key={item.id}
                    item={item}
                    onSelect={(item) => {
                      updateState({
                        selectedDoctorId: item.doctorId,
                        selectedDoctorMobile: item.doctorMobile,
                        isOpenDialog: true,
                      });
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
        open={state.isOpenDialog}
        onOpenChange={(open) => {
          updateState({ isOpenDialog: open });
          if (!open) updateState({ description: "" });
        }}
        title="Send Message"
        description="You can send only one message to your selected doctor."
        size="lg"
        footer={
          <>
            <button
              className={`px-4 py-2 text-sm font-medium rounded transition ${
                state.loading ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              onClick={sendMessageToDoctor}
              disabled={state.loading}
            >
              {state.loading ? "Sending..." : "Send Message"}
            </button>
            <button
              className="px-4 py-2 text-sm font-medium bg-red-100 rounded hover:bg-red-200 transition text-gray-700"
              onClick={() => {
                updateState({ isOpenDialog: false, description: "" });
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
            value={state.description}
            handleChange={(val) => updateState({ description: val })}
            placeHolderText="Send a message to your doctor."
          />
        </div>
      </DialogBox>
    </div>
  );
}
