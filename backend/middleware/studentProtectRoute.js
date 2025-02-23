import jwt from 'jsonwebtoken';
import studentSchema from '../models/studentModel.js';

const studentProtectRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt;
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'student') {
            return res.status(403).json({ Unauthorized: "Access restricted to students only" });
        }

        const student = await studentSchema.findById(decoded.userId);
        if (!student) {
            return res.status(401).json({ Unauthorized: "Invalid student credentials" });
        }
        req.user = student;
        next();

    } catch (err) {
        console.error("Error occurred at student protect route:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default studentProtectRoute;
