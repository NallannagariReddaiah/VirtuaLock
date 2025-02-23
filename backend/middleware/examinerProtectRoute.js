import jwt from 'jsonwebtoken';
import examinerSchema from '../models/examinerModel.js';

const examinerProtectRoute = async (req, res, next) => {
    try {
        const token = req.cookies?.jwt;
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'examiner') {
            return res.status(403).json({ Unauthorized: "Access restricted to examiners only" });
        }
        const examiner = await examinerSchema.findById(decoded.userId);
        if (!examiner) {
            return res.status(401).json({ Unauthorized: "Invalid examiner credentials" });
        }
        req.user = examiner;
        next();

    } catch (err) {
        console.error("Error occurred at examiner protect route:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default examinerProtectRoute;
