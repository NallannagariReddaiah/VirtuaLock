import Exam from "../models/examModel.js";
import StudentAnswer from "../models/studentAnswerModel.js";
import Student from "../models/studentModel.js";

export const submitAnswer = async (req, res) => {
  try {
    const { examId, questionId, answer } = req.body;
    const studentId = req.user._id;
    if (!studentId || !examId || !questionId || !answer) {
      return res
        .status(400)
        .json({
          error: "Student ID, Exam ID, Question ID, and Answer are required",
        });
    }
  
    // Check if the exam exists
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }
  
    // Check if the question exists in the exam
    const question = exam.questions.find(
      (q) => q._id.toString() === questionId.toString()
    );
    if (!question) {
      return res.status(404).json({ error: "Question not found in this exam" });
    }
  
    // Check if an answer already exists for this student and question
    let studentAnswer = await StudentAnswer.findOne({
      student: studentId,
      question: questionId,
    });
  
    if (studentAnswer) {
      // If it exists, update the answer
      studentAnswer.answer = answer;
      await studentAnswer.save();
      return res
        .status(200)
        .json({ message: "Answer updated successfully", studentAnswer });
    } else {
      // If it doesn't exist, create a new answer entry
      studentAnswer = new StudentAnswer({
        student: studentId,
        exam: examId,
        question: questionId,
        answer,
      });
      await studentAnswer.save();
  
      return res
        .status(200)
        .json({ message: "Answer submitted successfully", studentAnswer });
    }
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  
};
export const getQuestionsForStudent = async (req, res) => {
  try {
    const {examId} = req.params;

    // Validate input
    if (!examId) {
      return res.status(400).json({
        error: "Exam ID should be provided",
      });
    }

    // Find the student
    const studId=req.user._id;
    const student = await Student.findById(studId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find the exam
    const exam = await Exam.findById(examId).populate("questions");
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // Ensure the student is part of the exam
    // const isStudentInExam = exam.students.some(
    //   (s) => s.student.toString() === student._id.toString()
    // );
    // if (!isStudentInExam) {
    //   return res
    //     .status(403)
    //     .json({ error: "Student is not registered for this exam" });
    // }

    // Ensure the exam has started
    const currentTime = new Date();
    // if (currentTime < new Date(exam.startTime)) {
    //   return res.status(403).json({ error: "Exam has not started yet" });
    // }

    // Check if exam is completed
    if (currentTime > new Date(exam.endTime)) {
      return res.status(403).json({ error: "Exam has ended" });
    }

    // Fetch all questions assigned to the exam
    const questions = exam.questions.map((question) => ({
      _id: question._id,
      questionText: question.questionText,
      type: question.type,
      marks: question.marks,
      options: question.type === "MCQ" ? question.options : [], // Show options only for MCQ
    }));

    res.status(200).json({ message: "Questions retrieved", questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const viewExamResultsByQuestion = async (req, res) => {
  try {
    const { examId, questionId } = req.body;

    // Validate input
    if (!examId || !questionId) {
      return res
        .status(400)
        .json({
          error: "Exam ID and Question ID are required",
        });
    }

    // Find the student
    const studId=req.user._id;
    const student = await Student.findById(studId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find the exam
    const exam = await Exam.findById(examId).populate("questions");
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    // Ensure the student is part of the exam
    const isStudentInExam = exam.students.some(
      (s) => s.student.toString() === student._id.toString()
    );
    if (!isStudentInExam) {
      return res
        .status(403)
        .json({ error: "Student is not registered for this exam" });
    }

    // Ensure the exam has ended
    const currentTime = new Date();
    if (currentTime < new Date(exam.endTime)) {
      return res
        .status(403)
        .json({ error: "Exam results are not yet available" });
    }

    // Find the requested question
    const question = exam.questions.find(
      (q) => q._id.toString() === questionId
    );
    if (!question) {
      return res.status(404).json({ error: "Question not found in this exam" });
    }

    // Find student's answer for this question
    const studentAnswer = await StudentAnswer.findOne({
      examId,
      studentId: student._id,
      questionId,
    });

    // Determine next question ID if available
    const questionIndex = exam.questions.findIndex(
      (q) => q._id.toString() === questionId
    );
    const nextQuestionId =
      questionIndex + 1 < exam.questions.length
        ? exam.questions[questionIndex + 1]._id
        : null;

    res.status(200).json({
      message: "Exam result retrieved successfully",
      student: studentUsername,
      examTitle: exam.title,
      question: {
        questionText: question.questionText,
        type: question.type,
        marks: question.marks,
        options: question.type === "MCQ" ? question.options : [], // Include options only for MCQs
        correctAnswer: question.correctAnswer,
        studentAnswer: studentAnswer ? studentAnswer.answer : "Not Attempted",
        obtainedMarks: studentAnswer ? studentAnswer.obtainedMarks : 0,
      },
      nextQuestionId, // Provide next question ID for navigation
    });
  } catch (error) {
    console.error("Error fetching exam results:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getEnrolledExams = async (req, res) => {
  try {
    const { studentUsername } = req.body;

    // Validate input
    if (!studentUsername) {
      return res.status(400).json({ error: "Student username is required" });
    }

    // Find the student by username
    const student = await Student.findOne({ username: studentUsername });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find exams where the student is enrolled
    const exams = await Exam.find({ "students.student": student._id })
      .populate("examiner", "username email") // Get examiner details
      .select("title description startTime endTime duration status examType"); // Select relevant fields

    // If no exams found
    if (!exams.length) {
      return res
        .status(404)
        .json({ message: "No exams found for this student" });
    }

    res.status(200).json({
      message: "Enrolled exams retrieved successfully",
      student: student.username,
      exams,
    });
  } catch (error) {
    console.error("Error fetching enrolled exams:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getPublicExams = async (req, res) => {
  try {
    // Fetch all exams with examType "public"
    const publicExams = await Exam.find({
      examType: "public",
      status: { $ne: "completed" },
    })
      .populate("examiner", "username email") // Get examiner details
      .select("title description startTime endTime duration status");

    // If no public exams found
    if (!publicExams.length) {
      return res
        .status(404)
        .json({ message: "No public exams available at the moment" });
    }

    res.status(200).json({
      message: "Public exams retrieved successfully",
      exams: publicExams,
    });
  } catch (error) {
    console.error("Error fetching public exams:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .select("-password") // Exclude password for security
      .populate("enrolledExams", "title startTime endTime"); // Populate enrolled exams with essential details
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    student.role="student"
    res.status(200).json(student);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
export const getQuestionsStatus = async (req, res) => {
  // For knowing the question status i must know the student, examId also answer as well
  try{
    const { examId } = req.params;
    const studId = req.user._id;
    if (!examId || !studId) {
      return res
        .status(400)
        .json({ required: "ExamId and studentUsername are required" });
    }
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ notFound: "Exam not found" });
    }
    // const isStudentInExam = exam.students.some(
    //   (s) => s.student.toString() === studId.toString()
    // );
    // if (!isStudentInExam) {
    //   return res
    //     .status(403)
    //     .json({ error: "Student is not registered for this exam" });
    // }
    const studentAnswers = await StudentAnswer.find({
      exam: examId,
      student: studId,
    });
  
    // Convert answers to a Set for quick lookup
    const answeredQuestions = new Set(
      studentAnswers.map((ans) => ans.question.toString())
    );
  
    // Prepare the response
    const response = exam.questions.map((question) => ({
      questionId: question._id,
      answered: answeredQuestions.has(question._id.toString())
        ? true
        : false
    }));
    return res.status(200).json({questionStatus:response});
  }
  catch(err){
    console.log(`Error occured at getQuestionstatus - ${err}`);
  }
};
export const updateMe = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find user by ID
    let user = await Student.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { username, email, mobileNumber} = req.body;
    if (username) user.username = username;
    if (email) user.email = email;
    if (mobileNumber) user.mobileNumber = mobileNumber;

    // Save changes
    await user.save();

    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
export const getStudentExams = async (req, res) => {
  try {
    const userId  = req.user._id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const publicExams = await Exam.find({ examType:'public'});

    const studentExams = await Exam.find({ 
      students: { $elemMatch: { userId } }
    });

    // Combine and remove duplicates
    const allExams = [...publicExams, ...studentExams];
    const uniqueExams = Array.from(new Set(allExams.map(exam => exam._id.toString())))
      .map(id => allExams.find(exam => exam._id.toString() === id));

    res.status(200).json({ exams: uniqueExams });
  } catch (err) {
    console.error("Error fetching student exams:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const getSelectedOption = async (req, res) => {
  try {
    const { questionId } = req.params;
    const studentId = req.user._id;

    if (!questionId || !studentId) {
      return res.status(400).json({ error: "Question ID and Student ID are required" });
    }

    // Find the student's answer for the given question
    const studentAnswer = await StudentAnswer.findOne({
      question: questionId,
      student: studentId,
    });

    if (studentAnswer) {
      // Return the selected option name if the answer exists
      return res.status(200).json({ option: studentAnswer.answer });
    } else {
      // If no answer is found, return null
      return res.status(200).json({ option: null });
    }
  } catch (err) {
    console.error(`Error in getSelectedOption: ${err}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

