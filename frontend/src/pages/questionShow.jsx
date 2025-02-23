import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, ListGroup, Card } from "react-bootstrap";
import { FaCircle, FaCheckCircle } from "react-icons/fa";
import QuestionSidebar from "../components/questionSideBar.jsx";
import QuestionDisplay from "../components/questionBar.jsx";
import AnswerBar from "../components/AnswerBar.jsx";
import { useParams } from "react-router-dom";
const sampleQuestions = {
  "questions": [
    {
      "id":"1",
      "questionText": "What is the capital of France?",
      "options": ["Berlin", "Madrid", "Paris", "Rome"],
      "correctAnswer": "Paris",
      "marks": 5,
      "type": "MCQ",
      "answered":"unanswered",
    },
    {
      "id":"2",
      "questionText": "Who discovered gravity?",
      "options": [],
      "correctAnswer": "Isaac Newton",
      "marks": 3,
      "type": "Short Answer",
      "answered":"unanswered",
    },
    {
      "id":"3",
      "questionText": "Explain the impact of World War II on global politics.",
      "options": [],
      "correctAnswer": "N/A",
      "marks": 10,
      "type": "Essay",
      "answered":"unanswered",
    },
    {
      "id":"4",
      "questionText": "Which of the following is a programming language?",
      "options": ["HTML", "CSS", "JavaScript", "XML"],
      "correctAnswer": "JavaScript",
      "marks": 4,
      "type": "MCQ",
      "answered":"unanswered",
    }
  ]
}
const questionShow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [qid,setQid] = useState(1);
  const [selectFlag,setSelectFlag] = useState(false);
  const [question,setQuestion] = useState(null);
  const [questionLength,setQuestionLength]=useState(0)
  const handleAnswerSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };
  const navContainerStyle = {
    display: "flex",
    position:"relative",
    top:"20rem",
    right:"4rem",
};

const buttonStyle = {
    padding: "12px 24px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.3s ease-in-out",
    zIndex: 1000,
    margin:"30px",
    hover:{
      backgroundColor: "#3674B5"
    }
};

buttonStyle[":hover"] = {
    backgroundColor: "#3674B5",
};
const decreaseQuestionId=()=>
{
  if(qid>1){
    setQid(qid-1);
  }
}
const increaseQuestionId=()=>
{
  if(qid<sampleQuestions.questions.length){
    setQid(qid+1);
  }
}
const fetchQuestionById=async ()=>{
  try{
    const {examId}=useParams();
    const response = await axios.get(api/student/next-question,{
      examId:examId,
      currentQuestionIndex:qid-1,
    },
      {
        withCredintials:true,
      }
    )
    setQuestion(response.question);
  }catch(e){
    console.log(e);
  }
}
const getQuestionLength =async (req,res)=>{
  try{
    const {examId}=useParams();
    const response = await axios.get(api/student/questio-questions-length,{
      examId:examId,
    },{
      withCredintials:true,
    })
  }catch(err){
    console.log(err);
  }
}
useEffect(()=>{
fetchQuestionById();
},[qid,selectFlag])

  return (
    <>
      <div>
        <QuestionSidebar setQid={setQid} questions={sampleQuestions.questions}/>
        <div
          style={{ display: "flex", flexDirection: "row", width: "100%" }}
        >
          <QuestionDisplay questionData ={{text:sampleQuestions.questions[qid-1].questionText,marks:sampleQuestions.questions[qid-1].marks}}/>

          {/* Navigation Buttons */}
          <div style={navContainerStyle}>
            <button style={buttonStyle} onClick={decreaseQuestionId}>
              <span style={{ marginRight: "8px" }}>←</span> Prev
            </button>
            <button style={buttonStyle} onClick={increaseQuestionId}>
              Next <span style={{ marginLeft: "8px" }}>→</span>
            </button>
          </div>
        </div>

        <AnswerBar questionType={sampleQuestions.questions[qid-1].type} options={sampleQuestions.questions[qid-1].options} selectedFlag={selectFlag} setSelectFlag={setSelectFlag}/>
      </div>
    </>
  );
};

export default questionShow;