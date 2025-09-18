import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Calendar, Star } from "lucide-react";
import CustomDatePicker from "../../../components/components/ui/CustomDatePicker";
import CustomTextArea from "../../../components/components/ui/CustomTextArea";
import { AuthContext } from "../../authtication/Authticate";
import { apiUrls } from "../../../components/Network/ApiEndpoint";
import { notify } from "../../../lib/notify";
import { useNavigate } from "react-router-dom";

const FeedbackSection = () => {
  // ✅ Helper function to format Date to dd-MMM-yyyy
  const formatDateToDDMMMYYYY = (date) => {
    if (!(date instanceof Date)) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const [subject, setSubject] = useState(new Date()); // ✅ always store as Date object
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apisubject, setApiSubject] = useState(null);
  const { token, userData, getCurrentPatientId, getAuthHeader } = useContext(AuthContext);
  const patientId = getCurrentPatientId();
  const navigate = useNavigate();

  // ✅ Get star color
  const getStarColor = (ratingValue, index) => {
    if (ratingValue > index) {
      switch (index + 1) {
        case 1: return "text-red-500";
        case 2: return "text-orange-500";
        case 3: return "text-yellow-400";
        case 4: return "text-green-400";
        case 5: return "text-green-500";
        default: return "text-gray-300";
      }
    }
    return "text-gray-300";
  };

  // ✅ Render stars
  const renderStars = (ratingValue) => (
    [...Array(5)].map((_, index) => (
      <Star key={index} size={16} className={`inline-block ${getStarColor(Number(ratingValue), index)}`} />
    ))
  );

  const getRatingLabel = (ratingValue) => {
    switch (Number(ratingValue)) {
      case 1: return "Very Poor";
      case 2: return "Poor";
      case 3: return "Average";
      case 4: return "Good";
      case 5: return "Excellent";
      default: return "";
    }
  };

  // ✅ Fetch feedback history
  // Fetch feedback history
  const fetchFeedbackHistory = async () => {
      try {
        if (!token) {
          console.error("No token available");
          return;
        }
        if (!patientId) {
          notify("Patient ID is missing");
          return;
        }

        const url = `${apiUrls.patientFeedbackapi}?PateintID=${encodeURIComponent(patientId)}`;
        const response = await axios.get(url, {
          headers: {
            ...getAuthHeader()
          },
        });

        if (response?.data?.status) {
          setFeedbackHistory(response.data.response);
        } else {
          console.error("Unexpected feedback response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        if (error.response?.status === 401) {
        }
      }
    };
  useEffect(() => {
    fetchFeedbackHistory();
  }, [token, userData, patientId]);

  useEffect(() => {
    fetchFeedbackHistory();
  }, [token, userData, patientId]);

  // ✅ Fetch subject (Date of Visit)
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        if (!token || !patientId) return;
        const url = `${apiUrls.patientFeedbackSubjectapi}?PatientId=${encodeURIComponent(patientId)}`;
        const response = await axios.get(url, { headers: getAuthHeader() });

        if (response?.data?.status) {
          const dateStr = response.data.response[0]?.DateOfVisit;
          if (dateStr) {
            const [day, month, year] = dateStr.split("-");
            const parsedDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
            setApiSubject(parsedDate);
            setSubject(parsedDate); // ✅ use API date if available
          }
        }
      } catch (error) {
        console.error("Error fetching subject:", error);
        if (error.response?.status === 401) navigate("/enter-mpin");
      }
    };

    fetchSubject();
  }, [token, patientId]);

  // ✅ Submit feedback
  const handleSubmitFeedback = async () => {
    if (rating === 0) return notify("Please provide a rating");
    setLoading(true);
    try {
      const remarks = description.trim() || formatDateToDDMMMYYYY(subject);
      const subjectValue = formatDateToDDMMMYYYY(subject || new Date());

      const url = `${apiUrls.patientFeedbackSaveapi}?PatientID=${encodeURIComponent(
        patientId
      )}&PatientRating=${rating}&Remarks=${encodeURIComponent(
        remarks
      )}&Subject=${encodeURIComponent(subjectValue)}`;

      const response = await axios.post(url, {}, { headers: getAuthHeader() });

      if (response?.data?.status) {
        notify(response?.data?.message || "Feedback submitted successfully", "success");
        setDescription("");
        setRating(0);
        fetchFeedbackHistory();
      } else notify("Failed to submit feedback");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      if (error.response?.status === 401) navigate("/enter-mpin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg p-4">
      <h1 className="text-xl font-semibold mb-4">We value your opinion. Please let us know how we're doing.</h1>

      {/* Feedback Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="font-medium text-lg">Submit New Feedback</h2>
        <p className="text-sm text-gray-500 mb-4">
          Use this form to submit a new complaint or share your feedback.
        </p>

        {/* Date Picker - Disabled */}
        <div className="mb-4">
          <CustomDatePicker
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={subject}
            placeHolderText="Select Date"
            icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
            minDate={new Date()}
            disabled
            readOnly
          />
        </div>

        {/* Textarea */}
        <div className="mb-4">
          <CustomTextArea
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={description}
            placeHolderText="Provide more details here..."
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="font-medium text-sm">Overall Rating</label>
          <div className="flex space-x-1 mt-2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                onClick={() => setRating(index + 1)}
                size={20}
                className={`cursor-pointer ${getStarColor(rating, index)}`}
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmitFeedback}
          disabled={loading}
          className={`w-full py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"}`}
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>

      {/* Feedback History */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="font-medium text-lg">Feedback History</h2>
        {feedbackHistory.length > 0 ? (
          feedbackHistory.map((feedback, index) => (
            <div key={index} className="mt-4">
              <div className="text-sm text-gray-700">
                <strong>{decodeURIComponent(feedback.Subjects)}</strong> - {feedback.PatientRating}/5 - {getRatingLabel(feedback.PatientRating)}
              </div>
              <div className="flex space-x-1 mt-1">{renderStars(feedback.PatientRating)}</div>
              {feedback.Remark && <div className="text-xs text-gray-500 mt-1">{decodeURIComponent(feedback.Remark)}</div>}
              <div className="text-xs text-gray-500">Submitted on: {decodeURIComponent(feedback.EnquiryDate)}</div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 mt-4">No feedback history found.</div>
        )}
      </div>
    </div>
  );
};

export default FeedbackSection;
