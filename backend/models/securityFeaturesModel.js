import mongoose from 'mongoose';

const SecurityFeaturesSchema = new mongoose.Schema({
  tabSwitchLimit: { type: Number, default: 3 }, 
  faceVerification: { type: Boolean, default: true },
  livenessDetection: { type: Boolean, default: true },
  multipleFaceDetection: { type: Boolean, default: true },
  smartDeviceDetection: { type: Boolean, default: true },
  noiseDetection: { type: Boolean, default: true },
}, { _id: false });

export default SecurityFeaturesSchema;
