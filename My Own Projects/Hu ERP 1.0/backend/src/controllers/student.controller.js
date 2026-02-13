import { asyncHandler } from '../middlewares/errorHandler.js';
import studentService from '../services/student.service.js';

class StudentController {
  /**
   * Get all students
   * GET /api/v1/students
   */
  getAll = asyncHandler(async (req, res) => {
    const result = await studentService.getAll(req.query);

    res.json({
      success: true,
      data: result,
    });
  });

  /**
   * Get student by ID
   * GET /api/v1/students/:id
   */
  getById = asyncHandler(async (req, res) => {
    const student = await studentService.getById(req.params.id);

    res.json({
      success: true,
      data: student,
    });
  });

  /**
   * Update student
   * PUT /api/v1/students/:id
   */
  update = asyncHandler(async (req, res) => {
    const student = await studentService.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  });

  /**
   * Delete student
   * DELETE /api/v1/students/:id
   */
  delete = asyncHandler(async (req, res) => {
    await studentService.delete(req.params.id);

    res.json({
      success: true,
      message: 'Student deleted successfully',
    });
  });
}

export default new StudentController();
