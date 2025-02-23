import mongoose from "mongoose";

const studentAnswerSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
    marksAwarded: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Create a pre-save hook to check if the answer is correct and calculate marks
studentAnswerSchema.pre("save", async function (next) {
  try {
    const exam = await this.model("Exam").findById(this.exam);
    const examQuestion = exam.questions.find(
      (q) => q._id.toString() === this.question.toString()
    );

    if (examQuestion && this.answer === examQuestion.correctAnswer) {
      this.isCorrect = true;
      this.marksAwarded = examQuestion.marks;
    }

    next();
  } catch (err) {
    next(err);
  }
});

const StudentAnswer = mongoose.model("StudentAnswer", studentAnswerSchema);

export default StudentAnswer;
