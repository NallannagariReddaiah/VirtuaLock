import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLogin from './auth/studentLogin.jsx';
import ExaminerLogin from './auth/examinerLogin.jsx';
import StudentSignup from './auth/studentSignup.jsx';
import ExaminerSignup from './auth/examinerSignup.jsx';
import ExamForm from './pages/examForm.jsx';
import Navbar from './navbar'; //
import AddQuestions from './pages/addQuestions.jsx';
import ExamList from './pages/examList.jsx';
import FaceDetection from './pages/faceDetection.jsx';
import ExamPage from './components/examPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/examiner/login" element={<ExaminerLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/examiner/signup" element={<ExaminerSignup />} />
        <Route path="/examiner/exam" element={<ExamForm />} />
        <Route path="/examiner/exam/addquestions/:examId" element={<AddQuestions />} />
        <Route path="/student/examlist" element={<ExamList />} />
        <Route path="/face-detection/:examId" element={<FaceDetection />} />
        <Route path="/student/examlist/exam/:examId" element={<ExamPage />} />
      </Routes>
    </Router>
  );
}

export default App;


