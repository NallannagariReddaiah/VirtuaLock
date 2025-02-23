import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import QuestionSideBar from "./questionSideBar";
import QuestionBar from "./questionBar";
import AnswerBar from "./AnswerBar";

const ExamPage = () => {
  const { examId } = useParams(); // Get examId from URL
  const [exam, setExam] = useState(null); // Stores exam details
  const [questions, setQuestions] = useState([]); // Stores questions
  const [selectedQid, setSelectedQid] = useState(0); // Index of selected question
  const [selectFlag, setSelectFlag] = useState(false); // Used to track answer changes
  // Fetch exam details and questions
  const fetchExamData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/student/exam/${examId}`, { withCredentials: true });
      console.log(response.data);
      setExam(response.data);
      setQuestions(response.data.questions || []); // Ensure questions is always an array
    } catch (error) {
      console.error("Error fetching exam:", error);
    }
  };
  useEffect(() => {
    fetchExamData();
  }, [examId,selectFlag]);

  const handleAnswerSelect = (questionIndex, isAnswered) => {
    setAnsweredQuestions((prev) => ({ ...prev, [questionIndex]: isAnswered }));
  };
  // Prevent rendering if questions are empty
  if (!exam || questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="exam-container">
      {/* Question Sidebar */}
      <QuestionSideBar questions={questions} setQid={setSelectedQid} selectFlag={selectFlag}/>

      {/* Question Display */}
      <QuestionBar questionData={questions[selectedQid] || {}} />

      {/* Answer Bar */}
      <AnswerBar 
        selectFlag={selectFlag}
        setSelectFlag={setSelectFlag}
        questionId={questions[selectedQid]?._id}
        questionType={questions[selectedQid]?.type} 
        options={questions[selectedQid]?.options || []} 
        onAnswerSelect={(isAnswered) => handleAnswerSelect(selectedQid, isAnswered)}
      />
    </div>
  );
};

export default ExamPage;