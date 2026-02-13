import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectService } from '../../services/subjectService';
import { facultyService, studentService, departmentService, courseService } from '../../services';
import toast from 'react-hot-toast';
import {
    BookOpen,
    Users,
    UserPlus,
    UserMinus,
    Plus,
    Search,
    ChevronDown,
    ChevronUp,
    Loader2
} from 'lucide-react';

const SubjectManagement = () => {
    const queryClient = useQueryClient();
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [showAssignFacultyModal, setShowAssignFacultyModal] = useState(false);
    const [showEnrollStudentsModal, setShowEnrollStudentsModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch subjects
    const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: () => subjectService.getAll(),
    });

    // Fetch faculty list
    const { data: facultyData } = useQuery({
        queryKey: ['faculty'],
        queryFn: () => facultyService.getAll(),
    });

    // Fetch students list
    const { data: studentsData } = useQuery({
        queryKey: ['students'],
        queryFn: () => studentService.getAll(),
    });

    // Fetch enrolled students for selected subject
    const { data: enrolledStudentsData, refetch: refetchEnrolled } = useQuery({
        queryKey: ['enrolledStudents', selectedSubject?._id],
        queryFn: () => subjectService.getEnrolledStudents(selectedSubject._id),
        enabled: !!selectedSubject?._id,
    });

    // Mutations
    const assignFacultyMutation = useMutation({
        mutationFn: ({ subjectId, data }) => subjectService.assignFaculty(subjectId, data),
        onSuccess: () => {
            toast.success('Faculty assigned successfully');
            queryClient.invalidateQueries(['subjects']);
            setShowAssignFacultyModal(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to assign faculty');
        },
    });

    const unassignFacultyMutation = useMutation({
        mutationFn: ({ subjectId, facultyId }) => subjectService.unassignFaculty(subjectId, facultyId),
        onSuccess: () => {
            toast.success('Faculty unassigned successfully');
            queryClient.invalidateQueries(['subjects']);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to unassign faculty');
        },
    });

    const enrollStudentsMutation = useMutation({
        mutationFn: ({ subjectId, data }) => subjectService.enrollStudents(subjectId, data),
        onSuccess: (data) => {
            toast.success(data.message || 'Students enrolled successfully');
            refetchEnrolled();
            setShowEnrollStudentsModal(false);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to enroll students');
        },
    });

    const unenrollStudentMutation = useMutation({
        mutationFn: ({ subjectId, studentId }) => subjectService.unenrollStudent(subjectId, studentId),
        onSuccess: () => {
            toast.success('Student unenrolled successfully');
            refetchEnrolled();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to unenroll student');
        },
    });

    const subjects = subjectsData?.data || [];
    const faculty = facultyData?.data || [];
    const students = studentsData?.data || [];
    const enrolledStudents = enrolledStudentsData?.data || [];

    const filteredSubjects = subjects.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAssignFaculty = (facultyId) => {
        if (!selectedSubject) return;
        assignFacultyMutation.mutate({
            subjectId: selectedSubject._id,
            data: { facultyId, academicYear: new Date().getFullYear().toString() },
        });
    };

    const handleUnassignFaculty = (subjectId, facultyId) => {
        unassignFacultyMutation.mutate({ subjectId, facultyId });
    };

    const handleEnrollStudents = (studentIds) => {
        if (!selectedSubject) return;
        enrollStudentsMutation.mutate({
            subjectId: selectedSubject._id,
            data: { studentIds, academicYear: new Date().getFullYear().toString() },
        });
    };

    const handleUnenrollStudent = (studentId) => {
        if (!selectedSubject) return;
        unenrollStudentMutation.mutate({ subjectId: selectedSubject._id, studentId });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                                Subject Management
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Assign faculty and enroll students in subjects
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search subjects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Subjects List */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Subjects ({filteredSubjects.length})
                            </h2>
                        </div>
                        <div className="card-body p-0 max-h-[600px] overflow-y-auto">
                            {subjectsLoading ? (
                                <div className="p-8 text-center">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600" />
                                </div>
                            ) : filteredSubjects.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No subjects found
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredSubjects.map((subject) => (
                                        <div
                                            key={subject._id}
                                            className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedSubject?._id === subject._id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                                                }`}
                                            onClick={() => setSelectedSubject(subject)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-medium text-gray-900 dark:text-white">
                                                        {subject.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {subject.code} • Semester {subject.semester} • {subject.credits} credits
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {subject.department?.name} | {subject.course?.name}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
                                                        {subject.facultyAssigned?.length || 0} Faculty
                                                    </span>
                                                </div>
                                            </div>
                                            {subject.facultyAssigned?.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {subject.facultyAssigned.map((fa, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                                                        >
                                                            {fa.faculty?.firstName} {fa.faculty?.lastName}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleUnassignFaculty(subject._id, fa.faculty._id);
                                                                }}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected Subject Details */}
                    <div className="space-y-6">
                        {selectedSubject ? (
                            <>
                                {/* Subject Info */}
                                <div className="card">
                                    <div className="card-header">
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {selectedSubject.name}
                                        </h2>
                                    </div>
                                    <div className="card-body">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500">Code:</span>{' '}
                                                <span className="font-medium">{selectedSubject.code}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Semester:</span>{' '}
                                                <span className="font-medium">{selectedSubject.semester}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Credits:</span>{' '}
                                                <span className="font-medium">{selectedSubject.credits}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Type:</span>{' '}
                                                <span className="font-medium">{selectedSubject.type}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => setShowAssignFacultyModal(true)}
                                                className="btn btn-primary text-sm"
                                            >
                                                <UserPlus className="h-4 w-4 mr-1" />
                                                Assign Faculty
                                            </button>
                                            <button
                                                onClick={() => setShowEnrollStudentsModal(true)}
                                                className="btn btn-secondary text-sm"
                                            >
                                                <Users className="h-4 w-4 mr-1" />
                                                Enroll Students
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Enrolled Students */}
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            Enrolled Students ({enrolledStudents.length})
                                        </h3>
                                    </div>
                                    <div className="card-body p-0 max-h-[300px] overflow-y-auto">
                                        {enrolledStudents.length === 0 ? (
                                            <div className="p-4 text-center text-gray-500">
                                                No students enrolled
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                                {enrolledStudents.map((student) => (
                                                    <div key={student._id} className="p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800">
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                                {student.firstName} {student.lastName}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {student.enrollmentNumber}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => handleUnenrollStudent(student._id)}
                                                            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                                        >
                                                            <UserMinus className="h-4 w-4" />
                                                            Unenroll
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="card">
                                <div className="card-body text-center py-12 text-gray-500">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>Select a subject to manage faculty and enrollments</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Assign Faculty Modal */}
            {showAssignFacultyModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
                        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Assign Faculty</h3>
                            <button onClick={() => setShowAssignFacultyModal(false)} className="text-gray-500 hover:text-gray-700">×</button>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            {faculty.length === 0 ? (
                                <p className="text-center text-gray-500">No faculty available</p>
                            ) : (
                                <div className="space-y-2">
                                    {faculty.map((f) => {
                                        const isAssigned = selectedSubject?.facultyAssigned?.some(
                                            fa => fa.faculty?._id === f._id
                                        );
                                        return (
                                            <button
                                                key={f._id}
                                                disabled={isAssigned}
                                                onClick={() => handleAssignFaculty(f._id)}
                                                className={`w-full p-3 text-left rounded-lg border transition-colors ${isAssigned
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'hover:bg-primary-50 hover:border-primary-500'
                                                    }`}
                                            >
                                                <p className="font-medium">{f.firstName} {f.lastName}</p>
                                                <p className="text-sm text-gray-500">{f.employeeId} • {f.department?.name}</p>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Enroll Students Modal */}
            {showEnrollStudentsModal && (
                <EnrollStudentsModal
                    students={students}
                    enrolledStudentIds={enrolledStudents.map(s => s._id)}
                    onEnroll={handleEnrollStudents}
                    onClose={() => setShowEnrollStudentsModal(false)}
                />
            )}
        </div>
    );
};

// Separate component for student enrollment modal
const EnrollStudentsModal = ({ students, enrolledStudentIds, onEnroll, onClose }) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [search, setSearch] = useState('');

    const availableStudents = students.filter(s => !enrolledStudentIds.includes(s._id));
    const filteredStudents = availableStudents.filter(s =>
        `${s.firstName} ${s.lastName} ${s.enrollmentNumber}`.toLowerCase().includes(search.toLowerCase())
    );

    const toggleStudent = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Enroll Students</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
                    </div>
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input text-sm"
                    />
                </div>
                <div className="p-4 max-h-[50vh] overflow-y-auto">
                    {filteredStudents.length === 0 ? (
                        <p className="text-center text-gray-500">No students available</p>
                    ) : (
                        <div className="space-y-2">
                            {filteredStudents.map((s) => (
                                <label
                                    key={s._id}
                                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${selectedIds.includes(s._id)
                                            ? 'bg-primary-50 border-primary-500'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(s._id)}
                                        onChange={() => toggleStudent(s._id)}
                                        className="mr-3"
                                    />
                                    <div>
                                        <p className="font-medium text-sm">{s.firstName} {s.lastName}</p>
                                        <p className="text-xs text-gray-500">{s.enrollmentNumber}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                <div className="p-4 border-t dark:border-gray-700 flex justify-end gap-2">
                    <button onClick={onClose} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button
                        onClick={() => onEnroll(selectedIds)}
                        disabled={selectedIds.length === 0}
                        className="btn btn-primary"
                    >
                        Enroll {selectedIds.length} Students
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubjectManagement;
