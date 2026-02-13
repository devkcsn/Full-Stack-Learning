import express from 'express';
import feeController from '../controllers/fee.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', feeController.getAll);

export default router;
