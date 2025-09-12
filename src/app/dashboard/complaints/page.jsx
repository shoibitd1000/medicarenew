import React, { useState } from "react";

import CustomTextArea from "../../../components/components/ui/CustomTextArea";
import CustomInput from "../../../components/components/ui/CustomInput";
import { Star } from "lucide-react";
import DatePicker from "react-datepicker";

const FeedbackSection = () => {
  const [subject, setSubject] = useState("12-Sep-2025");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackHistory, setFeedbackHistory] = useState([
    {
      date: "12-Sep-2025",
      rating: 5,
      comments: "5/5 - Excellent",
      additionalInfo: "NA",
    },
  ]);

  const handleRatingClick = (index) => {
    setRating(index + 1);
  };

  const handleSubmitFeedback = () => {
    const newFeedback = {
      date: subject,
      rating: rating,
      comments: `${rating}/5 - ${rating === 5 ? "Excellent" : "Good"}`,
      additionalInfo: description || "NA",
    };
    setFeedbackHistory([newFeedback, ...feedbackHistory]);
    setSubject("12-Sep-2025");
    setDescription("");tion
    setRating(0);  };

  return (
    <div className="max-w-4xl mx-auto mt-6 bg-white shadow-md rounded-lg p-4">
      <div className="header mb-4">
        <h1 className="text-xl font-semibold">We value your opinion. Please let us know how we're doing.</h1>
      </div>

      <div className="feedback-form bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="font-medium text-lg">Submit New Feedback</h2>
        <p className="text-sm text-gray-500 mb-4">Use this form to submit a new complaint or share your feedback.</p>

        <div className="mb-4">
          <DatePicker
            id="subject"
            type="date"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
          />
        </div>

        <div className="mb-4">
          <CustomTextArea
            repClass="w-full focus:outline-none focus:ring focus:ring-blue-500"
            value={description}
            placeHolderText="Provide more details here..."
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="font-medium text-sm">Overall Rating</label>
          <div className="rating flex space-x-1 mt-2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                onClick={() => handleRatingClick(index)}
                color={rating > index ? "gold" : "gray"}
                size={25}
                className="cursor-pointer"
              />
            ))}
          </div>
        </div>

        <div>
          <button
            onClick={handleSubmitFeedback}
            className="w-full bg-blue-500 text-white py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Submit Feedback
          </button>
        </div>
      </div>

      <div className="feedback-history mt-6 bg-white p-4 rounded-lg shadow-md">
        <h2 className="font-medium text-lg">Feedback History</h2>
        {feedbackHistory.map((feedback, index) => (
          <div key={index} className="feedback-item mt-4">
            <div className="text-sm text-gray-700">
              <strong>{feedback.date}</strong> - {feedback.comments}
            </div>
            <div className="text-xs text-gray-500">{feedback.additionalInfo}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackSection;
