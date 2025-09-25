import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { Calendar, Star } from "lucide-react";
import CustomDatePicker from "../../../components/components/ui/CustomDatePicker";
import CustomTextArea from "../../../components/components/ui/CustomTextArea";
import { AuthContext } from "../../authtication/Authticate";
import { apiUrls } from "../../../components/Network/ApiEndpoint";
import Toaster, { notify } from "../../../lib/notify";
import { useNavigate } from "react-router-dom";
import IsLoader from "../../loading";

const FeedbackSection = () => {
  const formatDateToDDMMMYYYY = (date) => {
    if (!date || !(date instanceof Date)) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}${month}${year}`;
  };

  const [state, setState] = useState({
    remarks: "",
    rating: 0,
    feedbackHistory: [],
    loadingSubmit: false,
    loadingHistory: false,
    apisubject: ""
  });

  const { token, userData, getCurrentPatientId, getAuthHeader } = useContext(AuthContext);
  const patientId = getCurrentPatientId();
  const navigate = useNavigate();

  const updateState = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

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
    updateState("loadingHistory", true);
    try {
      if (!token) {
        notify("Authentication required", "error");
        return;
      }
      if (!patientId) {
        notify("Patient ID is missing", "error");
        return;
      }

      const response = await axios.get(`${apiUrls.patientFeedbackapi}?PateintID=${patientId}`,
        {
          headers: getAuthHeader()
        });

      if (response?.data?.status) {
        updateState("feedbackHistory", response.data.response);
      } else {
        notify("Failed to fetch feedback history", "error");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/");
      } else {
        notify("Error fetching feedback history", "error");
      }
    } finally {
      updateState("loadingHistory", false);
    }
  };

  useEffect(() => {
    fetchFeedbackHistory();
  }, [token, userData, patientId]);

  // Fetch subject
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
          updateState("apisubject", response.data.response[0].DateOfVisit);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/enter-mpin");
        }
      }
    };

    fetchSubject();
  }, [token, patientId]);

  // Submit feedback
  const handleSubmitFeedback = async () => {
    if (state.rating === 0) {
      notify("Please provide a rating", "error");
      return;
    }
    updateState("loadingSubmit", true);
    try {
      const abc = state.remarks.trim() ? state.remarks : state.apisubject;

      const response = await axios.post(
        `${apiUrls.patientFeedbackSaveapi}?PateintID=${patientId}&PatientRating=${state.rating}&Remarks=${state.apisubject}&Subject=${abc}`,
        {},
        { headers: getAuthHeader() }
      );

      if (response?.data?.status) {
        notify(response?.data?.message || "Feedback submitted successfully", "success");
        setState((prev) => ({
          ...prev,
          remarks: "",
          rating: 0
        }));
        fetchFeedbackHistory();
      } else {
        notify("Failed to submit feedback", "error");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/enter-mpin");
      } else {
        notify(error.response?.data?.message || "Error submitting feedback", "error");
      }
    } finally {
      updateState("loadingSubmit", false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg p-4">
      <h1 className="text-xl font-semibold mb-4">We value your opinion. Please let us know how we're doing.</h1>
      <Toaster />

      {/* Submit new feedback */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 ">
        <h2 className="font-medium text-lg">Submit New Feedback</h2>
        <p className="text-sm text-gray-500 mb-4">
          Use this form to submit a new complaint or share your feedback.
        </p>

        <div className="mb-4">
          <CustomDatePicker
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={formatDateToDDMMMYYYY(new Date())}
            placeHolderText="Select Date"
            icon={<Calendar className="absolute right-3 top-2 text-gray-500 pointer-events-none" />}
            minDate={new Date()}
            disabled
            readOnly
          />
        </div>

        <div className="mb-4">
          <CustomTextArea
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            name="remarks"
            value={state.remarks}
            placeHolderText="Provide more details here..."
            handleChange={(val) => updateState("remarks", val)}
          />
        </div>

        <div className="mb-4">
          <label className="font-medium text-sm">Overall Rating</label>
          <div className="flex space-x-1 mt-2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                onClick={() => updateState("rating", index + 1)}
                size={20}
                className={`cursor-pointer ${getStarColor(state.rating, index)}`}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmitFeedback}
          disabled={state.loadingSubmit}
          className={`w-full py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${state.loadingSubmit ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
            }`}
        >
          {state.loadingSubmit ? (
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

      {/* Feedback history */}
      <div
        className={`bg-white p-4 rounded-lg shadow-md ${state.feedbackHistory.length > 5 ? "h-100 overflow-y-scroll smooth" : ""
          }`}
      >
        <h2 className="font-medium text-lg">Feedback History</h2>

        {state.loadingHistory ? (
          <div className="flex justify-center items-center py-6">
            <IsLoader isFullScreen={false} />
          </div>
        ) : state.feedbackHistory.length > 0 ? (
          state.feedbackHistory.map((feedback, index) => (
            <div key={index} className="mt-4 border-b pb-4 last:border-b-0">
              <div className="text-sm text-gray-700">
                <strong>{decodeURIComponent(feedback.Subjects)}</strong> -{" "}
                {feedback.PatientRating}/5 - {getRatingLabel(feedback.PatientRating)}
              </div>
              <div className="flex space-x-1 mt-1">
                {renderStars(feedback.PatientRating)}
              </div>
              <div className="text-xs text-gray-500 font-semibold py-2">
                Submitted on: {decodeURIComponent(feedback.EnquiryDate)}
              </div>
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
