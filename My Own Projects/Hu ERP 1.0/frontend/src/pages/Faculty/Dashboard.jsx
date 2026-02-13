import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { attendanceService } from '../../services';
import { subjectService } from '../../services/subjectService';
import toast from 'react-hot-toast';
import {
    Users,
    Calendar,
    Clock,
    CheckSquare,
    FileText,
    Bell,
    BookOpen,
    Check,
    X,
    Loader2
} from 'lucide-react';

const FacultyDashboard = () => {
    const { user, profile } = useAuth();
    const queryClient = useQueryClient();
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);

    // Fetch subjects - filter for faculty's allocated subjects
    const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: () => subjectService.getAll(),
    });

    // Get the subjects assigned to this faculty
    const allocatedSubjects = profile?.allocatedSubjects || [];
    const allocatedSubjectIds = allocatedSubjects.map(as => as.subject?.toString() || as.subject);

    const mySubjects = (subjectsData?.data || []).filter(s =>
        allocatedSubjectIds.includes(s._id)
    );

    // Stats based on real profile data
    const stats = [
        {
            name: 'My Subjects',
            value: mySubjects.length || allocatedSubjects.length,
            period: 'Assigned',
            icon: BookOpen,
            color: 'primary',
        },
        {
            name: 'Department',
            value: profile?.department?.code || '--',
            period: profile?.department?.name || '',
            icon: Users,
            color: 'success',
        },
        {
            name: 'Designation',
            value: profile?.designation || '--',
            period: '',
            icon: Clock,
            color: 'warning',
        },
        {
            name: 'Status',
            value: profile?.status || (user?.isActive ? 'Active' : 'Inactive'),
            period: '',
            icon: CheckSquare,
            color: profile?.status === 'ACTIVE' || user?.isActive ? 'success' : 'warning',
        },
    ];

    const handleMarkAttendance = (subject) => {
        setSelectedSubject(subject);
        setShowAttendanceModal(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                                Faculty Dashboard
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                                <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                            </button>
                            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                                {user?.email?.[0].toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Hello, Prof. {profile?.firstName || user?.email?.split('@')[0]}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Welcome to the Faculty Portal.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.name} className="card hover:shadow-md transition-shadow">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {stat.name}
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </p>
                                        {stat.period && (
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                {stat.period}
                                            </p>
                                        )}
                                    </div>
                                    <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                                        <stat.icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* My Subjects - Attendance */}
                    <div className="lg:col-span-2 card">
                        <div className="card-header">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                My Subjects
                            </h3>
                        </div>
                        <div className="card-body p-0">
                            {subjectsLoading ? (
                                <div className="p-8 text-center">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600" />
                                </div>
                            ) : mySubjects.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No subjects assigned yet.</p>
                                    <p className="text-sm mt-1">Contact admin to get subjects assigned.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {mySubjects.map((subject) => (
                                        <div key={subject._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {subject.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {subject.code} • Semester {subject.semester} • {subject.credits} credits
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleMarkAttendance(subject)}
                                                    className="btn btn-primary text-sm"
                                                >
                                                    <CheckSquare className="h-4 w-4 mr-1" />
                                                    Mark Attendance
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Profile & Quick Actions */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="card">
                            <div className="card-header">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Profile
                                </h3>
                            </div>
                            <div className="card-body space-y-3">
                                {profile ? (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Name</span>
                                            <span className="font-medium text-sm">{profile.firstName} {profile.lastName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Employee ID</span>
                                            <span className="font-medium text-sm">{profile.employeeId || '--'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Department</span>
                                            <span className="font-medium text-sm">{profile.department?.name || '--'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500 text-sm">Email</span>
                                            <span className="font-medium text-sm truncate max-w-[150px]">{user?.email}</span>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-center text-gray-500 text-sm">Profile not configured</p>
                                )}
                            </div>
                        </div>

                        {/* Notice Card */}
                        <div className="card bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                            <div className="card-body">
                                <h3 className="font-bold text-lg mb-2">Attendance Note</h3>
                                <p className="text-primary-100 text-sm">
                                    You can mark and update attendance only on the same day. Once the day passes, attendance records are locked.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Modal */}
            {showAttendanceModal && selectedSubject && (
                <AttendanceModal
                    subject={selectedSubject}
                    facultyId={profile?._id}
                    onClose={() => {
                        setShowAttendanceModal(false);
                        setSelectedSubject(null);
                    }}
                />
            )}
        </div>
    );
};

// Attendance Modal Component
const AttendanceModal = ({ subject, facultyId, onClose }) => {
    const queryClient = useQueryClient();
    const [attendanceData, setAttendanceData] = useState({});

    // Fetch enrolled students for this subject
    const { data: studentsData, isLoading } = useQuery({
        queryKey: ['enrolledStudents', subject._id],
        queryFn: () => subjectService.getEnrolledStudents(subject._id),
    });

    // Mark attendance mutation
    const markAttendanceMutation = useMutation({
        mutationFn: (data) => attendanceService.markAttendance(data),
        onSuccess: (response) => {
            toast.success(response.message || 'Attendance marked successfully');
            queryClient.invalidateQueries(['attendance']);
            onClose();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to mark attendance');
        },
    });

    const students = studentsData?.data || [];

    const handleStatusChange = (studentId, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], status },
        }));
    };

    const handleSubmit = () => {
        const today = new Date();
        const attendanceList = Object.entries(attendanceData).map(([studentId, data]) => ({
            studentId,
            status: data.status || 'PRESENT',
            remarks: data.remarks || '',
        }));

        // Mark all remaining students as present if not set
        students.forEach(student => {
            if (!attendanceData[student._id]) {
                attendanceList.push({
                    studentId: student._id,
                    status: 'PRESENT',
                    remarks: '',
                });
            }
        });

        markAttendanceMutation.mutate({
            subjectId: subject._id,
            date: today.toISOString(),
            session: 'MORNING',
            academicYear: today.getFullYear().toString(),
            semester: subject.semester,
            attendanceData: attendanceList,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold">Mark Attendance</h3>
                            <p className="text-sm text-gray-500">{subject.name} ({subject.code})</p>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                        Date: {new Date().toLocaleDateString()}
                    </p>
                </div>

                <div className="p-4 max-h-[55vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600" />
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No students enrolled in this subject</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-500 font-medium px-2 mb-3">
                                <span>Student</span>
                                <span>Status</span>
                            </div>
                            {students.map((student) => (
                                <div
                                    key={student._id}
                                    className="flex justify-between items-center p-3 rounded-lg border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {student.firstName} {student.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">{student.enrollmentNumber}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {['PRESENT', 'ABSENT', 'LATE'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(student._id, status)}
                                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${(attendanceData[student._id]?.status || 'PRESENT') === status
                                                        ? status === 'PRESENT'
                                                            ? 'bg-green-500 text-white'
                                                            : status === 'ABSENT'
                                                                ? 'bg-red-500 text-white'
                                                                : 'bg-yellow-500 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                {status === 'PRESENT' && <Check className="h-3 w-3 inline mr-1" />}
                                                {status === 'ABSENT' && <X className="h-3 w-3 inline mr-1" />}
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 border-t dark:border-gray-700 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        {students.length} students
                    </p>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={markAttendanceMutation.isLoading || students.length === 0}
                            className="btn btn-primary"
                        >
                            {markAttendanceMutation.isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Submit Attendance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyDashboard;
