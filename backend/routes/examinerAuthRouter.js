import express from 'express';

const router = express.Router();

import {examinerLogin,examinerSignup,examinerLogout} from '../controller/examinerAuthController.js'

router.post('/login',examinerLogin);
router.post('/signup',examinerSignup);
router.post('/logout',examinerLogout);
export default router;