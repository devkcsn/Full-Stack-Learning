import { asyncHandler } from '../middlewares/errorHandler.js';
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import Subject from '../models/Subject.js';
import Faculty from '../models/Faculty.js';

class AttendanceController {
  /**
   * Mark attendance for a class (bulk)
   * POST /api/v1/attendance/mark
   */
  markAttendance = asyncHandler(async (req, res) => {
    const { subjectId, date, session, period, academicYear, semester, attendanceData } = req.body;
    // attendanceData: [{ studentId, status, remarks }]

    // Get faculty from authenticated user
    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) {
      return res.status(403).json({ success: false, message: 'Faculty profile not found' });
    }

    // Verify faculty is assigned to this subject
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const isAssigned = subject.facultyAssigned.some(
      fa => fa.faculty.toString() === faculty._id.toString()
    );
    if (!isAssigned && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'You are not assigned to this subject' });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const results = [];
    const errors = [];

    for (const item of attendanceData) {
      try {
        // Check if attendance already exists for this student, subject, date, session
        const existing = await Attendance.findOne({
          student: item.studentId,
          subject: subjectId,
          date: attendanceDate,
          session: session || 'MORNING',
        });

        if (existing) {
          // Update existing attendance
          existing.status = item.status;
          existing.remarks = item.remarks;
          existing.markedAt = new Date();
          await existing.save();
          results.push({ studentId: item.studentId, action: 'updated' });
        } else {
          // Create new attendance
          await Attendance.create({
            student: item.studentId,
            subject: subjectId,
            faculty: faculty._id,
            date: attendanceDate,
            status: item.status,
            session: session || 'MORNING',
            period,
            remarks: item.remarks,
            semester,
            academicYear,
          });
          results.push({ studentId: item.studentId, action: 'created' });
        }
      } catch (error) {
        errors.push({ studentId: item.studentId, error: error.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `Attendance marked for ${results.length} students`,
      data: { results, errors },
    });
  });

  /**
   * Update attendance (same day only)
   * PUT /api/v1/attendance/:id
   */
  updateAttendance = asyncHandler(async (req, res) => {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    // Same-day validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const markedDate = new Date(attendance.markedAt);
    markedDate.setHours(0, 0, 0, 0);

    if (today.getTime() !== markedDate.getTime()) {
      return res.status(400).json({
        success: false,
        message: 'Attendance can only be updated on the same day it was marked',
      });
    }

    // Update allowed fields
    const { status, remarks } = req.body;
    if (status) attendance.status = status;
    if (remarks !== undefined) attendance.remarks = remarks;
    attendance.markedAt = new Date();

    await attendance.save();

    res.json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance,
    });
  });

  /**
   * Get attendance for a subject
   * GET /api/v1/attendance/subject/:subjectId
   */
  getBySubject = asyncHandler(async (req, res) => {
    const { subjectId } = req.params;
    const { date, startDate, endDate, session } = req.query;

    const query = { subject: subjectId };

    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const nextDay = new Date(d);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: d, $lt: nextDay };
    } else if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (session) query.session = session;

    const attendance = await Attendance.find(query)
      .populate('student', 'firstName lastName enrollmentNumber')
      .populate('faculty', 'firstName lastName')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  });

  /**
   * Get attendance for a student
   * GET /api/v1/attendance/student/:studentId
   */
  getByStudent = asyncHandler(async (req, res) => {
    const { studentId } = req.params;
    const { subjectId, semester, academicYear } = req.query;

    const query = { student: studentId };
    if (subjectId) query.subject = subjectId;
    if (semester) query.semester = parseInt(semester);
    if (academicYear) query.academicYear = academicYear;

    const attendance = await Attendance.find(query)
      .populate('subject', 'name code')
      .populate('faculty', 'firstName lastName')
      .sort({ date: -1 });

    // Calculate summary
    const summary = {
      total: attendance.length,
      present: attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length,
      absent: attendance.filter(a => a.status === 'ABSENT').length,
      onLeave: attendance.filter(a => a.status === 'ON_LEAVE').length,
    };
    summary.percentage = summary.total > 0 
      ? ((summary.present / summary.total) * 100).toFixed(2) 
      : 0;

    res.json({
      success: true,
      summary,
      data: attendance,
    });
  });

  /**
   * Get today's attendance for faculty's subjects
   * GET /api/v1/attendance/today
   */
  getTodayForFaculty = asyncHandler(async (req, res) => {
    const faculty = await Faculty.findOne({ user: req.user.id });
    if (!faculty) {
      return res.status(404).json({ success: false, message: 'Faculty profile not found' });
    }

    const subjectIds = faculty.allocatedSubjects.map(s => s.subject);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.find({
      subject: { $in: subjectIds },
      date: { $gte: today, $lt: tomorrow },
    })
      .populate('student', 'firstName lastName enrollmentNumber')
      .populate('subject', 'name code');

    res.json({
      success: true,
      data: attendance,
    });
  });
}

export default new AttendanceController();
