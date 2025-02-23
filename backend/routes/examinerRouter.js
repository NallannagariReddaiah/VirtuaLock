import express from 'express';
import multer from 'multer'; // Import multer
import examinerProtectRoute from '../middleware/examinerProtectRoute.js';
import { createExam, addStudent, addQuestions, getStudentAnswerForQuestion, assignMarksToTheoryQuestion, getExaminerProfile } from '../controller/examinerController.js';

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where the files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Filename pattern
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/create-exam', examinerProtectRoute, createExam);
// router.post('/add-students-excel', examinerProtectRoute, upload.single('file'), addStudentsFromExcel);
// router.post('/add-questions-excel', examinerProtectRoute, upload.single('file'), addQuestionsFromExcel);
router.post('/add-questions', examinerProtectRoute, addQuestions);
router.post('/add-students', examinerProtectRoute, addStudent);
router.get('/get-student-res/:studName', examinerProtectRoute, getStudentAnswerForQuestion);
router.post('/assign-marks', examinerProtectRoute, assignMarksToTheoryQuestion);
router.get('/getMe',examinerProtectRoute,getExaminerProfile)

export default router;
