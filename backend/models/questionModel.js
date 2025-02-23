import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  marks: { type: Number, required: true },
  type: { type: String, enum: ['MCQ', 'Short Answer', 'Essay'], required: true },
});

export default QuestionSchema;
