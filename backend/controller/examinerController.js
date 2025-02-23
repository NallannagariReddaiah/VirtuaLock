import Exam from '../models/examModel.js';
import Student from '../models/studentModel.js';
import xlsx from 'xlsx';
import StudentAnswer from '../models/studentAnswerModel.js';
import Question from '../models/questionModel.js';
import Examiner from '../models/examinerModel.js';

export const createExam = async (req, res) => {
    try {
        const { title, description, duration, startTime, endTime, examType } = req.body;

        if (!title || !duration || !startTime || !endTime || !examType) {
            return res.status(400).json({ error: "All required fields must be provided" });
        }
        const examiner = req.user._id;
        if (!['public', 'private'].includes(examType)) {
            return res.status(400).json({ error: "Invalid examType. Must be 'public' or 'private'" });
        }

        const newExam = new Exam({
            title,
            description,
            examiner,
            duration,
            startTime,
            endTime,
            examType,
            students: [],
            questions: [], 
        });

        await newExam.save();

        res.status(201).json({ message: "Exam created successfully", exam: newExam });

    } catch (error) {
        console.error("Error creating exam:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const addQuestions = async (req, res) => {
    try {
        const { examId, questions } = req.body;
        if (!examId || !questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: "Exam ID and questions are required" });
        }

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }
        questions.forEach((q) => {
            const { questionText, correctAnswer, marks, type, options } = q;
    
            
            if (!questionText || !correctAnswer || !marks || !type) {
                throw new Error("Question text, answer, marks, and type are required");
            }
    
            
            if (!["MCQ", "Short Answer", "Essay"].includes(type)) {
                throw new Error("Invalid question type");
            }
    
           
            if (type === "MCQ" && (!options || options.length < 2)) {
                throw new Error("MCQs must have at least two options");
            }
    
            const question = {
                questionText,
                correctAnswer,
                marks,
                type,
                options: type === "MCQ" ? options : []
            };
            exam.questions.push(question);
        });
    
        await exam.save();
        res.status(200).json({ message: "Questions added successfully", exam });
    } catch (error) {
        console.error("Error adding questions:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
    
};
export const addQuestionsFromExcel= async (req, res) => {
    try {
        const { examId } = req.body;
        const file = req.file;

        if (!examId || !file) {
            return res.status(400).json({ error: "Exam ID and Excel file are required" });
        }

        // Read the uploaded Excel file
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet data to JSON
        const data = xlsx.utils.sheet_to_json(sheet);

        // Check if the Excel has valid data
        if (data.length === 0) {
            return res.status(400).json({ error: "Excel file contains no questions" });
        }

        // Validate each question in the Excel data
        for (const question of data) {
            if (!question.questionText || !question.correctAnswer || !question.marks || !question.type) {
                return res.status(400).json({ error: "Each question must have text, answer, marks, and type" });
            }

            if (!["MCQ", "Short Answer", "Essay"].includes(question.type)) {
                return res.status(400).json({ error: "Invalid question type in Excel file" });
            }

            // If MCQ, validate options
            if (question.type === "MCQ" && (!question.options || question.options.length < 2)) {
                return res.status(400).json({ error: "MCQs must have at least two options" });
            }
        }

        // Find the exam
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }

        // Add questions to exam
        const questions = data.map((question) => ({
            questionText: question.questionText,
            correctAnswer: question.correctAnswer,
            marks: question.marks,
            type: question.type,
            options: question.type === "MCQ" ? question.options : []
        }));

        exam.questions.push(...questions);
        await exam.save();

        res.status(200).json({ message: "Questions added successfully", exam });
    } catch (error) {
        console.error("Error adding questions from Excel:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const addStudentsFromExcel = async (req, res) => {
    try {
        const { examId } = req.body;
        
        if (!examId || !req.file) {
            return res.status(400).json({ error: "Exam ID and Excel file are required" });
        }

        // Read the uploaded Excel file
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert sheet data to JSON
        const data = xlsx.utils.sheet_to_json(sheet);

        // Extract usernames from Excel (assuming 'Username' is a column)
        const usernames = data.map(row => row.Username?.trim()).filter(Boolean);

        if (usernames.length === 0) {
            return res.status(400).json({ error: "No valid usernames found in the Excel file" });
        }

        // Find students in the database
        const students = await Student.find({ username: { $in: usernames } });

        if (students.length === 0) {
            return res.status(404).json({ error: "No matching students found in the database" });
        }

        // Fetch the exam
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }

        // Get existing student IDs in the exam
        const existingStudentIds = exam.students.map(s => s.student.toString());

        // Filter new students
        const newStudents = students
            .filter(student => !existingStudentIds.includes(student._id.toString()))
            .map(student => ({
                student: student._id,
                status: "pending",
                cheatingFlags: 0,
                finalScore: 0
            }));

        if (newStudents.length === 0) {
            return res.status(400).json({ error: "All students are already added to this exam" });
        }

        // Add new students to exam
        exam.students.push(...newStudents);
        await exam.save();

        res.status(200).json({
            message: `${newStudents.length} students added successfully from Excel`,
            exam
        });

    } catch (error) {
        console.error("Error adding students from Excel:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const addStudent = async (req, res) => {
    try {
        const { examId, username } = req.body;

        if (!examId || !username) {
            return res.status(400).json({ error: "Exam ID and Username are required" });
        }

        // Find student by username
        const student = await Student.findOne({ username: username.trim() });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Find the exam
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }

        // Check if student is already added
        const isAlreadyAdded = exam.students.some(s => s.student.toString() === student._id.toString());
        if (isAlreadyAdded) {
            return res.status(400).json({ error: "Student is already added to this exam" });
        }

        // Add student to exam
        exam.students.push({
            student: student._id,
            status: "pending",
            cheatingFlags: 0,
            finalScore: 0
        });

        await exam.save();

        res.status(200).json({
            message: `Student ${username} added successfully to the exam`,
            exam
        });

    } catch (error) {
        console.error("Error adding student manually:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const getStudentAnswerForQuestion = async (req, res) => {
    try {
        const { examId, studentUsername, questionIndex } = req.params;

        // Validate inputs
        if (!examId || !studentUsername || questionIndex === undefined) {
            return res.status(400).json({ error: "Exam ID, Student Username, and Question Index are required" });
        }

        // Find the student
        const student = await Student.findOne({ username: studentUsername });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Find the exam and populate questions
        const exam = await Exam.findById(examId).populate('questions');
        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }

        // Check if student is registered for the exam
        const isStudentInExam = exam.students.some(s => s.student.toString() === student._id.toString());
        if (!isStudentInExam) {
            return res.status(403).json({ error: "Student is not registered for this exam" });
        }

        // Get the total number of questions
        const totalQuestions = exam.questions.length;
        if (questionIndex < 0 || questionIndex >= totalQuestions) {
            return res.status(400).json({ error: "Invalid question index" });
        }

        // Get the specific question
        const question = exam.questions[questionIndex];

        // Get the student's answer for this question
        const studentAnswer = await StudentAnswer.findOne({
            exam: examId,
            student: student._id,
            question: question._id
        });

        // Prepare response
        const responseData = {
            questionIndex,
            totalQuestions,
            questionId: question._id,
            questionText: question.questionText,
            options: question.options || [],
            correctAnswer: question.correctAnswer,
            studentAnswer: studentAnswer ? studentAnswer.answer : null,
            isCorrect: studentAnswer ? studentAnswer.isCorrect : false,
            marksAwarded: studentAnswer ? studentAnswer.marksAwarded : null,
            totalMarks: question.marks,
            type: question.type
        };

        res.status(200).json(responseData);

    } catch (error) {
        console.error("Error fetching student answer for question:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const assignMarksToTheoryQuestion = async (req, res) => {
    try {
        const { examId, studentUsername, questionId, marksAwarded } = req.body;

        // Validate input
        if (!examId || !studentUsername || !questionId || marksAwarded === undefined) {
            return res.status(400).json({ error: "Exam ID, Student Username, Question ID, and Marks Awarded are required" });
        }

        // Find the student
        const student = await Student.findOne({ username: studentUsername });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Find the exam
        const exam = await Exam.findById(examId).populate('questions');
        if (!exam) {
            return res.status(404).json({ error: "Exam not found" });
        }

        // Check if the student is registered for the exam
        const isStudentInExam = exam.students.some(s => s.student.toString() === student._id.toString());
        if (!isStudentInExam) {
            return res.status(403).json({ error: "Student is not registered for this exam" });
        }

        // Find the question in the exam
        const question = exam.questions.find(q => q._id.toString() === questionId);
        if (!question) {
            return res.status(404).json({ error: "Question not found in this exam" });
        }

        // Ensure it's a theory-based question
        if (!["Short Answer", "Essay"].includes(question.type)) {
            return res.status(400).json({ error: "Only theory questions can be manually graded" });
        }

        // Find the student's answer for this question
        let studentAnswer = await StudentAnswer.findOne({
            exam: examId,
            student: student._id,
            question: question._id
        });

        if (!studentAnswer) {
            return res.status(404).json({ error: "Student has not answered this question" });
        }

        // Assign marks manually
        studentAnswer.marksAwarded = marksAwarded;
        await studentAnswer.save();

        res.status(200).json({ message: "Marks assigned successfully", studentAnswer });

    } catch (error) {
        console.error("Error assigning marks to theory question:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getExaminerProfile = async (req, res) => {
  try {
    const examiner = await Examiner.findById(req.user.id).select("-password"); // Exclude password for security

    if (!examiner) {
      return res.status(404).json({ message: "Examiner not found" });
    }

    res.status(200).json(examiner);
  } catch (error) {
    console.error("Error fetching examiner profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
