import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useParams } from "react-router-dom";
import axios from "axios";


const Sidebar = ({ questions, setQid ,selectFlag}) => {
  const {examId} = useParams();
  const [answeredQuestions,setAnsweredQuestions] = useState([]);
  const fetchQuestionsStatus = async () => {
    try{
        const response = await axios.get(`http://localhost:5000/api/student/questions-status/${examId}`,{
          withCredentials:true
        })
        console.log(response)
        if(response.status==200){
          setAnsweredQuestions(response.data.questionStatus);
        }
    }catch(err){
      console.log(err);
    }
  }
useEffect(()=>{
  fetchQuestionsStatus();
},[selectFlag])
  return (
    <div className="sidebar">
      <Card className="sidebar-card p-3">
        <h5 className="text-center text-white mb-3">Questions</h5>
        <div className="question-list">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`question-box ${answeredQuestions[index]?.answered ? "answered" : "unanswered"}`}
              onClick={() => setQid(index)}
            >
              {answeredQuestions[index]? <FaCheckCircle className="icon" /> : <FaTimesCircle className="icon" />}
              <span>{index + 1}</span>
            </button>
          ))}
        </div>
      </Card>

      <style jsx>{`
        .sidebar {
          margin-right:50px;
          position: fixed;
          left: 0;
          top: 60px; /* Adjust this value based on your navbar height */
          height: calc(100vh - 60px); /* Adjust based on navbar height */
          width: 14.5%; /* Reduced width */
          background: #2c2f33;
          padding-top: 20px;
          overflow-y: auto; /* Make sidebar scrollable */
        }
        .sidebar-card {
          width: 100%;
          background: #2c2f33;
          border: none;
        }
        .question-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr); /* 3 questions per row */
          gap: 10px;
          padding-right: 10px; /* To ensure scrollbar doesn't cover content */
        }
        .question-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px; /* Reduced width */
          height: 50px; /* Reduced height */
          border-radius: 8px;
          font-weight: bold;
          font-size: 16px; /* Adjusted font size */
          color: white;
          cursor: pointer;
          border: none;
          outline: none;
          transition: background 0.3s ease;
        }
        .answered {
          background: #28a745;
        }
        .unanswered {
          background: #dc3545;
        }
        .icon {
          margin-right: 5px;
          font-size: 16px; /* Adjusted icon size */
        }
        .question-box:hover {
          background: rgba(0, 0, 0, 0.3); /* Hover effect for better interactivity */
        }
      `}</style>
    </div>
  );
};

export default Sidebar;