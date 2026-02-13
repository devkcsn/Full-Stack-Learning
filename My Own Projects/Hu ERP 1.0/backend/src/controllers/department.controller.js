import { asyncHandler } from '../middlewares/errorHandler.js';
import departmentService from '../services/department.service.js';

class DepartmentController {
  getAll = asyncHandler(async (req, res) => {
    const departments = await departmentService.getAll();
    res.json({ success: true, data: departments });
  });

  create = asyncHandler(async (req, res) => {
    const department = await departmentService.create(req.body);
    res.status(201).json({ success: true, data: department });
  });
}

export default new DepartmentController();
