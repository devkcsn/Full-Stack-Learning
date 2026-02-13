import Fee from '../models/Fee.js';

class FeeService {
  async getAll() {
    return Fee.find({ isDeleted: false, isActive: true });
  }
}

export default new FeeService();
