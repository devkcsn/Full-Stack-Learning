import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentService, courseService, paymentService, feeService } from '../../services';
import {
    Users,
    Search,
    Filter,
    MoreVertical,
    BookOpen,
    CreditCard,
    Trash2,
    AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const StudentManagement = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [showFeeModal, setShowFeeModal] = useState(false);

    // Fetch Students
    const { data: studentsData, isLoading } = useQuery({
        queryKey: ['students', search],
        queryFn: () => studentService.getAll({ search })
    });

    // Fetch Courses (for dropdown)
    const { data: coursesData } = useQuery({
        queryKey: ['courses'],
        queryFn: () => courseService.getAll({ limit: 100 })
    });

    // Mutation: Update Student (Assign Course)
    const updateStudentMutation = useMutation({
        mutationFn: ({ id, data }) => studentService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['students']);
            toast.success('Student updated successfully');
            setShowCourseModal(false);
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Update failed')
    });

    // Mutation: Create Fee Request
    const createFeeMutation = useMutation({
        mutationFn: (data) => paymentService.create(data),
        onSuccess: () => {
            toast.success('Fee request created successfully');
            setShowFeeModal(false);
        },
        onError: (error) => toast.error(error.response?.data?.message || 'Failed to create fee request')
    });

    // Mutation: Delete Student
    const deleteStudentMutation = useMutation({
        mutationFn: (id) => studentService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['students']);
            toast.success('Student deleted successfully');
        },
        onError: (error) => toast.error('Failed to delete student')
    });

    // Fetch Fees (for dropdown)
    const { data: feesData } = useQuery({
        queryKey: ['fees'],
        queryFn: () => feeService.getAll()
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Management</h1>
                    <p className="text-sm text-gray-500">Manage students, assign courses, and pending fees</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or enrollment number..."
                        className="input pl-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="btn btn-secondary">
                    <Filter className="h-5 w-5 mr-2" />
                    Filters
                </button>
            </div>

            {/* Students Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {isLoading ? (
                                <tr><td colSpan="4" className="text-center py-8">Loading...</td></tr>
                            ) : studentsData?.data?.students?.map((student) => (
                                <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                                {student.firstName[0]}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {student.firstName} {student.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">{student.user?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.course ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {student.course?.name || 'Not Enrolled'}
                                        </span>
                                        {student.course && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {student.batch ? `Batch: ${student.batch}` : ''}
                                                {student.batch && student.section ? ' • ' : ''}
                                                {student.section ? `Sec: ${student.section}` : ''}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                title="Assign Course"
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setShowCourseModal(true);
                                                }}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <BookOpen className="h-5 w-5" />
                                            </button>
                                            <button
                                                title="Create Fee Request"
                                                onClick={() => {
                                                    setSelectedStudent(student);
                                                    setShowFeeModal(true);
                                                }}
                                                className="p-1 text-green-600 hover:bg-green-50 rounded"
                                            >
                                                <CreditCard className="h-5 w-5" />
                                            </button>
                                            <button
                                                title="Delete Student"
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete this student?')) {
                                                        deleteStudentMutation.mutate(student._id);
                                                    }
                                                }}
                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal: Assign Course */}
            {showCourseModal && selectedStudent && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowCourseModal(false)}></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                                Assign Course to {selectedStudent.firstName}
                            </h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                updateStudentMutation.mutate({
                                    id: selectedStudent._id,
                                    data: {
                                        course: formData.get('courseId'),
                                        batch: formData.get('batch'),
                                        section: formData.get('section')
                                    }
                                });
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Course</label>
                                        <select name="courseId" className="input mt-1 w-full" required defaultValue={selectedStudent.course?._id || ''}>
                                            <option value="">Select a course...</option>
                                            {coursesData?.data?.courses?.map(course => (
                                                <option key={course._id} value={course._id}>{course.name} ({course.code})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Batch</label>
                                        <input
                                            name="batch"
                                            type="text"
                                            className="input mt-1 w-full"
                                            placeholder="e.g., 2023-2027"
                                            defaultValue={selectedStudent.batch || ''}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Section</label>
                                        <input
                                            name="section"
                                            type="text"
                                            className="input mt-1 w-full"
                                            placeholder="e.g., A"
                                            defaultValue={selectedStudent.section || ''}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button type="button" onClick={() => setShowCourseModal(false)} className="btn btn-secondary">Cancel</button>
                                        <button type="submit" className="btn btn-primary">Assign</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Fee Request */}
            {showFeeModal && selectedStudent && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black opacity-30" onClick={() => setShowFeeModal(false)}></div>
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                                Create Pending Fee Request
                            </h3>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                createFeeMutation.mutate({
                                    studentId: selectedStudent._id,
                                    feeId: formData.get('feeId'),
                                    amount: Number(formData.get('amount')),
                                    semester: Number(formData.get('semester')),
                                    academicYear: '2025-26', // Keep hardcoded or make input if needed
                                    remarks: 'Pending Fee Request'
                                });
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Fee Structure</label>
                                        <select name="feeId" className="input mt-1 w-full" required>
                                            <option value="">Select Fee Structure...</option>
                                            {feesData?.data?.data?.map(fee => (
                                                <option key={fee._id} value={fee._id}>
                                                    Sem {fee.semester} ({fee.academicYear}) - ₹{(fee.totalAmount || 0).toLocaleString()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
                                        <input name="amount" type="number" className="input mt-1 w-full" required placeholder="50000" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Semester</label>
                                        <input name="semester" type="number" min="1" max="8" className="input mt-1 w-full" required defaultValue="1" />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button type="button" onClick={() => setShowFeeModal(false)} className="btn btn-secondary">Cancel</button>
                                        <button type="submit" className="btn btn-primary">Create Request</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
