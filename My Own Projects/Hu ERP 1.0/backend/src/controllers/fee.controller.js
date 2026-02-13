import { asyncHandler } from '../middlewares/errorHandler.js';
import feeService from '../services/fee.service.js';

class FeeController {
  getAll = asyncHandler(async (req, res) => {
    const fees = await feeService.getAll();
    res.json({
      success: true,
      data: fees,
    });
  });
}

export default new FeeController();
