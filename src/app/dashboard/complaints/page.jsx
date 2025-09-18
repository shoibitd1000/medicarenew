import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Calendar, Star } from "lucide-react";
import CustomDatePicker from "../../../components/components/ui/CustomDatePicker";
import CustomTextArea from "../../../components/components/ui/CustomTextArea";
import { AuthContext } from "../../authtication/Authticate";
import { apiUrls } from "../../../components/Network/ApiEndpoint";
import { notify } from "../../../lib/notify";
import { useNavigate } from "react-router-dom";
import { encryptPassword } from "../../../components/EncyptHooks/EncryptLib";

const FeedbackSection = () => {
  const formatDateToDDMMMYYYY = (date) => {
    if (!date || !(date instanceof Date)) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}${month}${year}`; // e.g., 18Sep2025
  };

  const [remarks, setRemarks] = useState("");

  const [rating, setRating] = useState(0);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apisubject, setApiSubject] = useState("");
  const { token, userData, getCurrentPatientId, getAuthHeader } = useContext(AuthContext);
  const patientId = getCurrentPatientId();
  const navigate = useNavigate();

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

  const renderStars = (ratingValue) => (
    [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`inline-block ${getStarColor(Number(ratingValue), index)}`}
        aria-label={`Star ${index + 1}`}
      />
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

  const fetchFeedbackHistory = async () => {
    try {
      if (!token) {
        console.error("No token available");
        notify("Authentication required", "error");
        return;
      }
      if (!patientId) {
        notify("Patient ID is missing", "error");
        return;
      }

      const url = `${apiUrls.patientFeedbackapi}?PateintID=${encodeURIComponent(patientId)}`;
      const response = await axios.get(url, {
        headers: getAuthHeader(),
      });

      if (response?.data?.status) {
        setFeedbackHistory(response.data.response);
      } else {
        console.error("Unexpected feedback response:", response.data);
        notify("Failed to fetch feedback history", "error");
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      if (error.response?.status === 401) {
        navigate("/enter-mpin");
      } else {
        notify("Error fetching feedback history", "error");
      }
    }
  };

  useEffect(() => {
    fetchFeedbackHistory();
  }, [token, userData, patientId]);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        if (!token || !patientId) {
          notify("Authentication or patient ID missing", "error");
          return;
        }
        const url = `${apiUrls.patientFeedbackSubjectapi}?PatientId=${encodeURIComponent(patientId)}`;
        const response = await axios.get(url, { headers: getAuthHeader() });

        if (response?.data?.status && response.data.response[0]?.DateOfVisit) {
          setApiSubject(response.data.response[0].DateOfVisit);
        } else {
          console.error("Unexpected subject response:", response.data);
        }
      } catch (error) {
        console.error("Error fetching subject:", error);
        if (error.response?.status === 401) {
          navigate("/enter-mpin");
        }
      }
    };

    fetchSubject();
  }, [token, patientId]);
  const handleReamarks = (val) => {
    setRemarks(val)
  }
  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      notify("Please provide a rating", "error");
      return;
    }
    setLoading(true);
    try {
      const subjectValue = apisubject || formatDateToDDMMMYYYY(new Date());
      const abc = remarks.trim() ? remarks : apisubject;
      const url = `${apiUrls.patientFeedbackSaveapi}?PatientId=${encryptPassword(patientId)}&PatientRating=${rating}&Remarks=${encryptPassword(abc)}&Subject=${encryptPassword(subjectValue)}`;



      const response = await axios.post(url, {}, { headers: getAuthHeader() });

      if (response?.data?.status) {
        notify(response?.data?.message || "Feedback submitted successfully", "success");
        setRemarks("");
        setRating(0);
        fetchFeedbackHistory();
      } else {
        notify("Failed to submit feedback", "error");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      if (error.response?.status === 401) {
        navigate("/enter-mpin");
      } else {
        notify(error.response?.data?.message || "Error submitting feedback", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg p-4">
      <h1 className="text-xl font-semibold mb-4">We value your opinion. Please let us know how we're doing.</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-4 ">
        <h2 className="font-medium text-lg">Submit New Feedback</h2>
        <p className="text-sm text-gray-500 mb-4">
          Use this form to submit a new complaint or share your feedback.
        </p>

        <div className="mb-4">
          <CustomDatePicker
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={apisubject || formatDateToDDMMMYYYY(new Date())}
            placeHolderText="Select Date"
            icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
            minDate={new Date()}
            disabled={true}
            readOnly
            aria-label="Submission date (read-only)"
          />
        </div>

        <div className="mb-4">
          <CustomTextArea
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            name="remarks"
            value={remarks}
            placeHolderText="Provide more details here..."
            handleChange={handleReamarks}
            aria-required="true"
          />
        </div>

        <div className="mb-4">
          <label className="font-medium text-sm" id="rating-label">Overall Rating</label>
          <div className="flex space-x-1 mt-2" role="radiogroup" aria-labelledby="rating-label">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                onClick={() => setRating(index + 1)}
                size={20}
                className={`cursor-pointer ${getStarColor(rating, index)}`}
                role="radio"
                aria-checked={rating === index + 1}
                aria-label={`Rate ${index + 1} star${index + 1 === 1 ? "" : "s"}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmitFeedback}
          disabled={loading}
          aria-busy={loading}
          className={`w-full py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Feedback"
          )}
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md h-100 overflow-y-scroll">
        <h2 className="font-medium text-lg">Feedback History</h2>
        {feedbackHistory.length > 0 ? (
          feedbackHistory.map((feedback, index) => (
            <div key={index} className="mt-4 border-b pb-4 last:border-b-0">
              <div className="text-sm text-gray-700">
                <strong>{decodeURIComponent(feedback.Subjects)}</strong> - {feedback.PatientRating}/5 -{" "}
                {getRatingLabel(feedback.PatientRating)}
              </div>
              <div className="flex space-x-1 mt-1">{renderStars(feedback.PatientRating)}</div>
              {feedback.Remark && (
                <div className="text-xs text-gray-500 mt-1">{decodeURIComponent(feedback.Remark)}</div>
              )}
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