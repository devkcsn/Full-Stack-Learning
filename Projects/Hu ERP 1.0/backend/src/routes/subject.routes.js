import express from 'express';
import subjectController from '../controllers/subject.controller.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Public (authenticated) routes
router.get('/', subjectController.getAll);
router.get('/:id', subjectController.getById);
router.get('/:id/students', subjectController.getEnrolledStudents);

// Admin only routes
router.post(
  '/',
  authorize('ADMIN', 'SUPER_ADMIN'),
  subjectController.create
);

router.put(
  '/:id',
  authorize('ADMIN', 'SUPER_ADMIN'),
  subjectController.update
);

router.delete(
  '/:id',
  authorize('ADMIN', 'SUPER_ADMIN'),
  subjectController.delete
);

// Faculty assignment routes (Admin only)
router.post(
  '/:id/assign-faculty',
  authorize('ADMIN', 'SUPER_ADMIN'),
  subjectController.assignFaculty
);

router.delete(
  '/:id/unassign-faculty/:facultyId',
  authorize('ADMIN', 'SUPER_ADMIN'),
  subjectController.unassignFaculty
);

// Student enrollment routes (Admin only)
router.post(
  '/:id/enroll-students',
  authorize('ADMIN', 'SUPER_ADMIN'),
  subjectController.enrollStudents
);

router.delete(
  '/:id/unenroll-student/:studentId',
  authorize('ADMIN', 'SUPER_ADMIN'),
  subjectController.unenrollStudent
);

export default router;

