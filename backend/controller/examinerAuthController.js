import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import examinerSchema from '../models/examinerModel.js';
import generateToken from '../lib/utils/generateToken.js';

export const  examinerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const examiner = await examinerSchema.findOne({ email });
        if (!examiner) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, examiner.password);
        console.log(password)
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        generateToken(examiner._id,"examiner",res);
        res.status(200).json({
            message: "Login successful",
            examiner: {
                id: examiner._id,
                name: examiner.name,
                email: examiner.email,
                role: examiner.role,
            },
        });

    } catch (error) {
        console.error("Error during examiner login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const examinerSignup = async (req, res) => {
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

        // Check if examiner already exists
        const existingExaminer = await examinerSchema.findOne({ email });
        if (existingExaminer) {
            return res.status(400).json({ error: "Examiner already exists with this email" });
        }

        // Hash the password

        // Create new examiner
        const newExaminer = new examinerSchema({
            username,
            email,
            mobileNumber,
            password,
            status: "pending", // Default status until admin approval
        });

        await newExaminer.save();
        generateToken(newExaminer._id,"examiner",res);

        res.status(201).json({
            message: "Signup successful, waiting for admin approval",
            examiner: {
                id: newExaminer._id,
                username: newExaminer.username,
                email: newExaminer.email,
                mobileNumber: newExaminer.mobileNumber,
                status: newExaminer.status,
            },
        });

    } catch (error) {
        console.error("Error during examiner signup:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const examinerLogout = async (req, res) => {
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



