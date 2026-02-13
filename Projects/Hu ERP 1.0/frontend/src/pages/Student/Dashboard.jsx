import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { attendanceService } from '../../services';
import {
    BookOpen,
    Calendar,
    Award,
    Users,
    Bell,
    CheckCircle,
    XCircle,
    Clock,
    Loader2
} from 'lucide-react';

const StudentDashboard = () => {
    const { user, profile } = useAuth();

    // Get enrolled subjects from profile
    const enrolledSubjects = profile?.enrolledSubjects || [];

    // Fetch attendance data for this student
    const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
        queryKey: ['studentAttendance', profile?._id],
        queryFn: () => attendanceService.getByStudent(profile._id),
        enabled: !!profile?._id,
    });

    const attendance = attendanceData?.data || [];
    const attendanceSummary = attendanceData?.summary || { total: 0, present: 0, absent: 0, percentage: 0 };

    // Stats based on real profile data
    const stats = [
        {
            name: 'Attendance',
            value: attendanceSummary.total > 0 ? `${attendanceSummary.percentage}%` : (profile?.attendance ? `${profile.attendance}%` : '--'),
            change: `${attendanceSummary.present}/${attendanceSummary.total} classes`,
            icon: Calendar,
            color: 'primary',
        },
        {
            name: 'CGPA',
            value: profile?.cgpa || '--',
            change: '',
            icon: Award,
            color: 'success',
        },
        {
            name: 'Semester',
            value: profile?.currentSemester || '--',
            change: 'Current',
            icon: BookOpen,
            color: 'secondary',
        },
        {
            name: 'Enrolled Subjects',
            value: enrolledSubjects.length,
            change: '',
            icon: Users,
            color: 'warning',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                                Welcome back,{' '}
                                {profile?.firstName || user?.email?.split('@')[0]}! 👋
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {profile?.enrollmentNumber && `Enrollment: ${profile.enrollmentNumber}`}
                                {profile?.department?.name && ` | ${profile.department.name}`}
                                {profile?.course?.name && ` | ${profile.course.name}`}
                            </p>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                            <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    {stats.map((stat) => (
                        <div key={stat.name} className="card animate-fade-in">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            {stat.name}
                                        </p>
                                        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                                            {stat.value}
                                        </p>
                                        {stat.change && (
                                            <p className="mt-2 text-sm text-gray-500 font-medium">
                                                {stat.change}
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Enrolled Subjects */}
                    <div className="lg:col-span-2 card">
                        <div className="card-header">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                My Subjects
                            </h2>
                        </div>
                        <div className="card-body p-0 max-h-[400px] overflow-y-auto">
                            {enrolledSubjects.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No subjects enrolled yet.</p>
                                    <p className="text-sm mt-1">Contact admin to enroll in subjects.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {enrolledSubjects.map((enrollment, idx) => (
                                        <div key={idx} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {enrollment.subject?.name || 'Subject'}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {enrollment.subject?.code || ''} • Semester {enrollment.semester}
                                                    </p>
                                                </div>
                                                <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                                                    {enrollment.academicYear}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Attendance Summary */}
                    <div className="card">
                        <div className="card-header">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Recent Attendance
                            </h2>
                        </div>
                        <div className="card-body p-0 max-h-[350px] overflow-y-auto">
                            {attendanceLoading ? (
                                <div className="p-8 text-center">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary-600" />
                                </div>
                            ) : attendance.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No attendance records yet.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {attendance.slice(0, 10).map((record) => (
                                        <div key={record._id} className="p-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-sm text-gray-900 dark:text-white">
                                                    {record.subject?.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(record.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${record.status === 'PRESENT'
                                                    ? 'bg-green-100 text-green-700'
                                                    : record.status === 'ABSENT'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {record.status === 'PRESENT' && <CheckCircle className="h-3 w-3" />}
                                                {record.status === 'ABSENT' && <XCircle className="h-3 w-3" />}
                                                {record.status === 'LATE' && <Clock className="h-3 w-3" />}
                                                {record.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="mt-6 card">
                    <div className="card-header">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Profile Information
                        </h2>
                    </div>
                    <div className="card-body">
                        {profile ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {profile.firstName} {profile.lastName}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="font-medium text-gray-900 dark:text-white truncate">
                                        {user?.email}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Enrollment Number</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {profile.enrollmentNumber || 'Not assigned'}
                                    </p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {profile.department?.name || 'Not assigned'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <p>No profile information available.</p>
                                <p className="text-sm mt-2">Please contact admin to set up your student profile.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
