import express from 'express';
const router = express.Router();
import { translateAndDefine } from '../controllers/dictionaryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.post('/translate', translateAndDefine);

export default router;
