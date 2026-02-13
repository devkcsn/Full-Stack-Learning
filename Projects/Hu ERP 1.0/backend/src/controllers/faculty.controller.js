import { asyncHandler } from '../middlewares/errorHandler.js';
import facultyService from '../services/faculty.service.js';

class FacultyController {
  /**
   * Get all faculty
   * GET /api/v1/faculty
   */
  getAll = asyncHandler(async (req, res) => {
    const result = await facultyService.getAll(req.query);

    res.json({
      success: true,
      data: result,
    });
  });

  /**
   * Get faculty by ID
   * GET /api/v1/faculty/:id
   */
  getById = asyncHandler(async (req, res) => {
    const faculty = await facultyService.getById(req.params.id);

    res.json({
      success: true,
      data: faculty,
    });
  });

  /**
   * Update faculty
   * PUT /api/v1/faculty/:id
   */
  update = asyncHandler(async (req, res) => {
    const faculty = await facultyService.update(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Faculty updated successfully',
      data: faculty,
    });
  });

  /**
   * Delete faculty
   * DELETE /api/v1/faculty/:id
   */
  delete = asyncHandler(async (req, res) => {
    await facultyService.delete(req.params.id);

    res.json({
      success: true,
      message: 'Faculty deleted successfully',
    });
  });
}

export default new FacultyController();
