import bcrypt from 'bcrypt';
import studentSchema from '../models/studentModel.js';
import generateToken from '../lib/utils/generateToken.js'

export const studentSignup = async (req, res) => {6
    try {
        const { username, email, mobileNumber, password } = req.body;
        // Validate input fields
        if (!username || !email || !mobileNumber || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Validate mobile number (Assuming 10-digit number)
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobileNumber)) {
            return res.status(400).json({ error: "Invalid mobile number" });
        }

        // Validate password (Minimum 6 characters)
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // Check if student already exists
        const existingStudent = await studentSchema.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ error: "Student already exists with this email" });
        }

        // Hash the passwor

        // Create new student
        const newStudent = new studentSchema({
            username,
            email,
            mobileNumber,
            password,
        });
        console.log(newStudent.password);
        await newStudent.save();
        generateToken(newStudent._id,"student",res);
        res.status(201).json({
            message: "Signup successful",
            student: {
                id: newStudent._id,
                username: newStudent.username,
                email: newStudent.email,
                mobileNumber: newStudent.mobileNumber,
            },
        });

    } catch (error) {
        console.error("Error during student signup:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if student existsdd
        const student = await studentSchema.findOne({ email });
        if (!student) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        // Generate JWT token
        generateToken(student._id,"student",res);

        res.status(200).json({
            message: "Login successful",
            student: {
                id: student._id,
                name: student.username,
                email: student.email,
                role: "Student",
            },
        });

    } catch (error) {
        console.error("Error during student login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const studentLogout = async (req, res) => {
    try {
        // Clear the JWT cookie
        res.cookie('jwt', '', {
            httpOnly: true,
            expires: new Date(0), // Set the cookie to expire immediately
            secure: process.env.NODE_ENV === 'production', // Secure in production
            sameSite: 'Strict',
        });

        res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};