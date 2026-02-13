import express from 'express';
import dashboardController from '../controllers/dashboard.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/stats', authorize('ADMIN', 'SUPER_ADMIN'), dashboardController.getStats);

export default router;
