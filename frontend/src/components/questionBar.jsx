import React from "react";
import { FaQuestionCircle } from "react-icons/fa";

const QuestionDisplay = ({questionData }) => {
  // Sample question

  return (
    <div className="question-container">
      {questionData && (
        <div className="question-boxs">
          <FaQuestionCircle className="question-icon" />
          <p className="question-text">{questionData.questionText}</p>
          <span className="question-marks">{questionData.marks} Marks</span>
        </div>
      )}
      <style jsx>{`
        .question-container {
          position: fixed;
          padding:10px;
          left:15%; /* Adjusted to match the sidebar width */
          top: 60px; /* Adjust this value based on your navbar height */
          width: calc(100% - 58%); /* Adjusted to match the sidebar width */
          height: calc(100vh - 60px); /* Adjust based on navbar height */
          padding-top:20px;
          overflow-y: auto; /* Independent scrolling */
          background: white; /* Light background */
          display: flex;
          justify-content: flex-start; /* Align content to the top */
          align-items: flex-start; /* Align content to the top */
        }
        .question-boxs {
          width: 100%; /* Take full width of the container */
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          font-size: 18px;
          font-weight: bold;
        }
        .question-icon {
          font-size: 24px;
          color: #007bff;
          margin-bottom: 5px;
        }
        .question-text {
          margin-left: 10px;
          word-wrap: break-word; /* Ensure long text wraps */
          width: 100%; /* Take full width */
          text-align:left;
        }
        .question-marks {
          align-self: flex-end; /* Align marks to the right */
          font-size: 16px;
          color: #28a745;
          font-weight: bold;
          margin-top: 10px; /* Add some space above the marks */
        }
      `}</style>
    </div>
  );
};

export default QuestionDisplay;