import express from 'express';
import attendanceController from '../controllers/attendance.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Faculty routes
router.post(
  '/mark',
  authorize('FACULTY', 'ADMIN', 'SUPER_ADMIN'),
  attendanceController.markAttendance
);

router.put(
  '/:id',
  authorize('FACULTY', 'ADMIN', 'SUPER_ADMIN'),
  attendanceController.updateAttendance
);

router.get(
  '/today',
  authorize('FACULTY', 'ADMIN', 'SUPER_ADMIN'),
  attendanceController.getTodayForFaculty
);

// Get attendance by subject (Faculty, Admin)
router.get(
  '/subject/:subjectId',
  authorize('FACULTY', 'ADMIN', 'SUPER_ADMIN'),
  attendanceController.getBySubject
);

// Get attendance by student (Student can view own, Admin/Faculty can view any)
router.get(
  '/student/:studentId',
  authorize('STUDENT', 'FACULTY', 'ADMIN', 'SUPER_ADMIN'),
  attendanceController.getByStudent
);

export default router;
