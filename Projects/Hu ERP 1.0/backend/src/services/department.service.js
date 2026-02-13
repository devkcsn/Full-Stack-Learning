import Department from '../models/Department.js';
import { NotFoundError } from '../utils/errors.js';

class DepartmentService {
  async getAll() {
    return Department.find().sort({ name: 1 });
  }

  async create(data) {
    return Department.create(data);
  }

  async getById(id) {
    const department = await Department.findById(id);
    if (!department) throw new NotFoundError('Department not found');
    return department;
  }
}

export default new DepartmentService();
