import mongoose from 'mongoose';
import SecurityFeaturesSchema from './securityFeaturesModel.js';
import QuestionSchema from './questionModel.js';
import ProctoringDataSchema from './proctoringDataModel.js';

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    examiner: { type: mongoose.Schema.Types.ObjectId, ref: 'Examiner', required: true },
    students: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        profileImg:{type:String,default:""},
        registered:{type:Boolean,default:false},
        status: { 
          type: String, 
          enum: ['pending', 'in-progress', 'submitted', 'flagged', 'auto-submitted'], 
          default: 'pending' 
        },
        cheatingFlags: { type: Number, default: 0 },
        finalScore: { type: Number, default: 0 },
      },
    ],
    questions: [QuestionSchema], // Reference to Question Sub-schema
    duration: { type: Number, required: true }, 
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    securityFeatures: SecurityFeaturesSchema, // Embedded Security Schema
    proctoringData: [ProctoringDataSchema], // Proctoring Data Sub-schema
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
    examType:{type:String,
    enum:['public','private'],default:'public'},
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
