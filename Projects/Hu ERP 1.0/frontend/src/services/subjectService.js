import api from './api';

export const subjectService = {
  getAll: (params) => api.get('/subjects', { params }),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post('/subjects', data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
  
  // Faculty assignment
  assignFaculty: (subjectId, data) => api.post(`/subjects/${subjectId}/assign-faculty`, data),
  unassignFaculty: (subjectId, facultyId) => api.delete(`/subjects/${subjectId}/unassign-faculty/${facultyId}`),
  
  // Student enrollment
  getEnrolledStudents: (subjectId) => api.get(`/subjects/${subjectId}/students`),
  enrollStudents: (subjectId, data) => api.post(`/subjects/${subjectId}/enroll-students`, data),
  unenrollStudent: (subjectId, studentId) => api.delete(`/subjects/${subjectId}/unenroll-student/${studentId}`),
};
