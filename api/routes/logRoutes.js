import express from 'express';
import { createLog } from '../controllers/logController.js';

const router = express.Router();

router.post('/', createLog);

export default router;