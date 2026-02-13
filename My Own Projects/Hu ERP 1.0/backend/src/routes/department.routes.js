import express from 'express';
import departmentController from '../controllers/department.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);
router.get('/', departmentController.getAll);
router.post('/', departmentController.create);

export default router;
