import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const studentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique:true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    mobileNumber:{
      type:String,
      required:true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      default: 'student', // Can be 'admin' or 'examiner'
    },
    enrolledExams: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
    }],
    profilePicture: {
      type: String, 
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);

export default Student;
