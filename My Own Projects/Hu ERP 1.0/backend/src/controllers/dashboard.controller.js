import Student from '../models/Student.js';
import Faculty from '../models/Faculty.js';
import Course from '../models/Course.js';
import Payment from '../models/Payment.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

class DashboardController {
  getStats = asyncHandler(async (req, res) => {
    const [
      totalStudents,
      totalFaculty,
      activeCourses,
      payments
    ] = await Promise.all([
      Student.countDocuments({ isDeleted: false }),
      Faculty.countDocuments({ isDeleted: false }),
      Course.countDocuments({ isDeleted: false, isActive: true }),
      Payment.find({ status: 'SUCCESS' }).select('amount') // Simple implementation for total revenue or similar if needed. Or just count.
    ]);

    // Calculate something like attendance rate or revenue?
    // For now, let's just return the counts requested by the UI.
    // UI has: Total Students, Faculty Members, Active Courses, Attendance Rate (Mock for now or 0)

    res.json({
      success: true,
      data: {
        totalStudents,
        totalFaculty,
        activeCourses,
        attendanceRate: 0, // Placeholder as we don't have attendance module yet
      }
    });
  });
}

export default new DashboardController();
