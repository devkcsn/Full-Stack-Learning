import Subject from '../models/Subject.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

const subjectController = {
  // Get all subjects with optional filters
  getAll: async (req, res, next) => {
    try {
      const { search, course, semester, department } = req.query;
      const query = { isDeleted: false };

      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }

      if (course) {
        query.course = course;
      }
      
      if (semester) {
        query.semester = semester;
      }

      if (department) {
        query.department = department;
      }

      const subjects = await Subject.find(query)
        .populate('course', 'name code')
        .populate('department', 'name code')
        .populate('facultyAssigned.faculty', 'firstName lastName employeeId')
        .sort({ name: 1 });

      res.status(200).json({
        success: true,
        count: subjects.length,
        data: subjects,
      });
    } catch (error) {
      next(error);
    }
  },

  // Get subject by ID
  getById: async (req, res, next) => {
    try {
      const subject = await Subject.findById(req.params.id)
        .populate('course', 'name code')
        .populate('department', 'name code')
        .populate('facultyAssigned.faculty', 'firstName lastName employeeId');

      if (!subject) {
        throw new NotFoundError('Subject not found');
      }

      res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  },

  // Create new subject
  create: async (req, res, next) => {
    try {
        const subject = await Subject.create(req.body);
        
        res.status(201).json({
            success: true,
            data: subject
        });
    } catch (error) {
        next(error);
    }
  },

  // Update subject
  update: async (req, res, next) => {
      try {
          const subject = await Subject.findByIdAndUpdate(
              req.params.id,
              req.body,
              { new: true, runValidators: true }
          );

          if (!subject) {
              throw new NotFoundError('Subject not found');
          }

          res.status(200).json({
              success: true,
              data: subject
          });
      } catch (error) {
          next(error);
      }
  },

  // Delete subject
  delete: async (req, res, next) => {
      try {
          const subject = await Subject.findById(req.params.id);

          if (!subject) {
              throw new NotFoundError('Subject not found');
          }

          // Soft delete
          subject.isDeleted = true;
          await subject.save();

          res.status(200).json({
              success: true,
              message: 'Subject deleted successfully'
          });
      } catch (error) {
          next(error);
      }
  },

  // Assign faculty to subject
  assignFaculty: async (req, res, next) => {
    try {
      const { facultyId, section, academicYear } = req.body;
      const subject = await Subject.findById(req.params.id);

      if (!subject) {
        throw new NotFoundError('Subject not found');
      }

      const faculty = await Faculty.findById(facultyId);
      if (!faculty) {
        throw new NotFoundError('Faculty not found');
      }

      // Check if already assigned
      const alreadyAssigned = subject.facultyAssigned.some(
        fa => fa.faculty.toString() === facultyId
      );
      if (alreadyAssigned) {
        throw new BadRequestError('Faculty is already assigned to this subject');
      }

      // Add to subject's facultyAssigned
      subject.facultyAssigned.push({
        faculty: facultyId,
        section: section || 'A',
        academicYear: academicYear || new Date().getFullYear().toString(),
      });
      await subject.save();

      // Add to faculty's allocatedSubjects
      faculty.allocatedSubjects.push({
        subject: subject._id,
        semester: subject.semester,
        academicYear: academicYear || new Date().getFullYear().toString(),
        section: section || 'A',
      });
      await faculty.save();

      res.status(200).json({
        success: true,
        message: 'Faculty assigned to subject successfully',
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  },

  // Unassign faculty from subject
  unassignFaculty: async (req, res, next) => {
    try {
      const { facultyId } = req.params;
      const subject = await Subject.findById(req.params.id);

      if (!subject) {
        throw new NotFoundError('Subject not found');
      }

      // Remove from subject's facultyAssigned
      subject.facultyAssigned = subject.facultyAssigned.filter(
        fa => fa.faculty.toString() !== facultyId
      );
      await subject.save();

      // Remove from faculty's allocatedSubjects
      const faculty = await Faculty.findById(facultyId);
      if (faculty) {
        faculty.allocatedSubjects = faculty.allocatedSubjects.filter(
          as => as.subject.toString() !== subject._id.toString()
        );
        await faculty.save();
      }

      res.status(200).json({
        success: true,
        message: 'Faculty unassigned from subject successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Enroll students in subject (bulk)
  enrollStudents: async (req, res, next) => {
    try {
      const { studentIds, academicYear } = req.body;
      const subject = await Subject.findById(req.params.id);

      if (!subject) {
        throw new NotFoundError('Subject not found');
      }

      const results = [];
      const errors = [];

      for (const studentId of studentIds) {
        try {
          const student = await Student.findById(studentId);
          if (!student) {
            errors.push({ studentId, error: 'Student not found' });
            continue;
          }

          // Check if already enrolled
          const alreadyEnrolled = student.enrolledSubjects.some(
            es => es.subject.toString() === subject._id.toString()
          );
          if (alreadyEnrolled) {
            errors.push({ studentId, error: 'Already enrolled' });
            continue;
          }

          // Add to student's enrolledSubjects
          student.enrolledSubjects.push({
            subject: subject._id,
            semester: subject.semester,
            academicYear: academicYear || new Date().getFullYear().toString(),
          });
          await student.save();
          results.push({ studentId, status: 'enrolled' });
        } catch (err) {
          errors.push({ studentId, error: err.message });
        }
      }

      res.status(200).json({
        success: true,
        message: `Enrolled ${results.length} students`,
        data: { results, errors },
      });
    } catch (error) {
      next(error);
    }
  },

  // Unenroll student from subject
  unenrollStudent: async (req, res, next) => {
    try {
      const { studentId } = req.params;
      const subject = await Subject.findById(req.params.id);

      if (!subject) {
        throw new NotFoundError('Subject not found');
      }

      const student = await Student.findById(studentId);
      if (!student) {
        throw new NotFoundError('Student not found');
      }

      // Remove from student's enrolledSubjects
      student.enrolledSubjects = student.enrolledSubjects.filter(
        es => es.subject.toString() !== subject._id.toString()
      );
      await student.save();

      res.status(200).json({
        success: true,
        message: 'Student unenrolled from subject successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  // Get enrolled students for a subject
  getEnrolledStudents: async (req, res, next) => {
    try {
      const subject = await Subject.findById(req.params.id);
      if (!subject) {
        throw new NotFoundError('Subject not found');
      }

      const students = await Student.find({
        'enrolledSubjects.subject': subject._id,
      }).select('firstName lastName enrollmentNumber currentSemester');

      res.status(200).json({
        success: true,
        count: students.length,
        data: students,
      });
    } catch (error) {
      next(error);
    }
  },
};

export default subjectController;

