import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "../css/Feedback.css";
const FeedbackForm = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [feedback, setFeedback] = useState("");

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        toast.info("Please login for submitting feedback");
        return;
      }
      const feedbackData = { feedback };
      if (userEmail) {
        feedbackData.userEmail = userEmail;
      }

      const response = await axios.post(
        process.env.REACT_APP_API_URL + "feedback/addFeedback",
        feedbackData
      );
      console.log("Feedback submitted:", response);
      setIsFormVisible(false);
      if (response.status === 201) {
        toast.success("Success");
        setFeedback("");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
    }
  };
  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains("feedback-modal")) {
      setIsFormVisible(false);
    }
  };

  return (
    <div>
      {/* Button to Open Feedback Modal */}
      <button className="feedback-button" onClick={toggleFormVisibility}>
        Leave Feedback
      </button>

      {/* Feedback Modal */}
      {isFormVisible && (
        <div className="feedback-modal" onClick={handleBackgroundClick}>
          <div className="feedback-form-container">
            {/* Close Button */}
            <button
              className="close-button"
              title="close"
              onClick={toggleFormVisibility}
            >
              &times;
            </button>

            {/* Feedback Form */}
            <form onSubmit={handleSubmit}>
              <label htmlFor="feedback">Your Feedback:</label>
              <textarea
                id="feedback"
                name="feedback"
                rows="4"
                cols="50"
                value={feedback}
                onChange={handleChange}
                placeholder="Enter your feedback here..."
                required
              ></textarea>
              <button type="submit" value="Submit">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
