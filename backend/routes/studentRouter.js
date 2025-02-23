import express from "express";
import studentProtectRoute  from "../middleware/studentProtectRoute.js";
import {
    submitAnswer,
    getQuestionsForStudent,
    viewExamResultsByQuestion,
    getEnrolledExams,
    getPublicExams,
    getStudentProfile,
    updateMe,
    getStudentExams,
    getQuestionsStatus,
    getSelectedOption
} from "../controller/studentController.js";

const router = express.Router();
router.post("/submit-answer", studentProtectRoute, submitAnswer);
router.get("/exam/:examId", studentProtectRoute, getQuestionsForStudent);
router.post("/exam-results", studentProtectRoute, viewExamResultsByQuestion);
router.post("/enrolled-exams", studentProtectRoute, getEnrolledExams);
router.get("/public-exams",studentProtectRoute, getPublicExams);
router.get("/getMe",studentProtectRoute,getStudentProfile);
router.put("/updateMe", studentProtectRoute, updateMe);
router.get('/exams',studentProtectRoute,getStudentExams);
router.get('/questions-status/:examId',studentProtectRoute,getQuestionsStatus)
router.get('/selected-option/:questionId',studentProtectRoute,getSelectedOption);

export default router;
