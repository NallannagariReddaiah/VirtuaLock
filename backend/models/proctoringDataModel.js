import mongoose from 'mongoose';

const ProctoringDataSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  detectedFaces: { type: Number, default: 1 },
  unauthorizedDeviceDetected: { type: Boolean, default: false },
  tabSwitchCount: { type: Number, default: 0 },
  noiseLevel: { type: Number, default: 0 }, // Tracks noise level
  noiseAlerts: { type: Number, default: 0 }, // Counts noise violations
  status: { 
    type: String, 
    enum: ['normal', 'warning', 'cheating', 'auto-submitted'], 
    default: 'normal' 
  },
  logs: [
    {
      timestamp: { type: Date, default: Date.now },
      event: { type: String },
    },
  ],
}, { _id: false });

export default ProctoringDataSchema;
