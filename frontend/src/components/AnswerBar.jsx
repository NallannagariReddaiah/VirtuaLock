import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaPen, FaRegEdit } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";


const AnswerBar = ({questionId,questionType, options ,selectFlag,setSelectFlag}) => {
  const {examId} = useParams();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [localAnswer, setLocalAnswer] = useState(""); 
  const [saveTimer, setSaveTimer] = useState(null); 
  useEffect(() => {
    selectedOption(); 
  }, [questionId]);
  
  useEffect(() => {
    // Clear timer when component unmounts or question changes
    return () => {
      if (saveTimer) clearTimeout(saveTimer);
    };
  }, [questionId, saveTimer]);
  const selectedOption = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/student/selected-option/${questionId}`, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.option != null) {
        setSelectedAnswer(response.data.option);
        setLocalAnswer(response.data.option);
      }
      else{
        setSelectedAnswer("");
        setLocalAnswer("");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const saveAnswer = async (answer) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/student/submit-answer",
        {
          examId: examId,
          questionId: questionId,
          answer: answer,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setSelectedAnswer(answer);
        setSelectFlag(!selectFlag)
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  const handleAnswerChange = (answer) => {
    setLocalAnswer(answer);
  
    // Clear previous timer if any
    if (saveTimer) clearTimeout(saveTimer);
  
    // Set a new timer for 1 minute (60000 ms)
    const newTimer = setTimeout(() => {
      saveAnswer(answer);
    }, 60000);
  
    setSaveTimer(newTimer);
  };
  return (
    <div className="answer-container">
    <div className="answer-box">
      <h4 className="answer-heading">
        {questionType === "MCQ" ? (
          <FaCheckCircle className="answer-icon" />
        ) : (
          <FaPen className="answer-icon" />
        )}
        Your Answer
      </h4>

      {questionType === "MCQ" ? (
        <div className="mcq-options">
          {options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${selectedAnswer === option ? "selected" : ""}`}
              onClick={() =>  saveAnswer(option)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-answer">
          <FaRegEdit className="text-icon" />
          <textarea
            className="answer-input"
            placeholder="Type your answer here..."
            value={localAnswer}
            onChange={(e) => handleAnswerChange(e.target.value)}
          ></textarea>
        </div>
      )}
    </div>

      <style>{`
        .answer-container {
          position:fixed;
          right:0;
          top:0;
          width: 43.25vw;
          height: 100vh;
          padding-top: 20px;
          overflow-y: auto;
          background: #f1f3f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .answer-box {
          width: 90%;
          height:90%;
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .answer-heading {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          color: #333;
          margin-bottom: 15px;
        }
        .answer-icon {
          font-size: 24px;
          color: #007bff;
        }
        .mcq-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .option-button {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.3s ease;
          background: #e9ecef;
          color: #333;
        }
        .option-button:hover {
          background: #dee2e6;
        }
        .selected {
          background: #007bff;
          color: white;
          font-weight: bold;
        }
        .text-answer {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: flex-start;
        }
        .text-icon {
          font-size: 20px;
          color: #6c757d;
        }
        .answer-input {
          width: 100%;
          height: 500px; /* Increased height */
          padding: 15px;
          border-radius: 8px;
          border: 2px solid #ccc;
          font-size: 16px;
          resize: none;
          outline: none;
          background: white; /* Removed full coverage */
          transition: border 0.3s ease;
        }
        .answer-input:focus {
          border: 2px solid #007bff;
        }
      `}</style>
    </div>
  );
};
export default AnswerBar;