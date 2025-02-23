import express from 'express';
const router=express.Router();

import exmanierAuthRouter from '../routes/examinerAuthRouter.js';
import studentAuthRouter from '../routes/studentAuthRouter.js'

router.use('/examiner',exmanierAuthRouter);
router.use('/student',studentAuthRouter);


export default router;