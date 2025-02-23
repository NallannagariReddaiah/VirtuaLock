import express from 'express';

const router = express.Router();

import {studentLogin,studentSignup,studentLogout} from '../controller/studentAuthController.js';

router.post('/login',studentLogin);
router.post('/signup',studentSignup);
router.post('/logout',studentLogout);
export default router;