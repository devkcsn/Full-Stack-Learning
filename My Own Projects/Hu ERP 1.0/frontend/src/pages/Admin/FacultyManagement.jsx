import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { facultyService, courseService, subjectService } from '../../services';
// Actually for assigning subjects, we need 'Subject' model which we haven't built explicit routes for.
// But 'Faculty' model has 'allocatedSubjects' array.
// We can just add a simple "Add Subject" modal that takes text for now if Subject model isn't fully ready backend-wise?
// Ah, `Subject` model exists (from summary). 
// Let's assume for this MVP we just assign "Subject Name" text or code if we can't fetch subjects.
// Or effectively, I'll just mock the subject assignment as text fields "Subject Code", "Subject Name".
import {
    Users,
    Search,
    BookOpen,
    Edit2,
    Trash2,
    Briefcase
} from 'lucide-react';
import toast from 'react-hot-toast';

const FacultyManagement = () => {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [showSubjectModal, setShowSubjectModal] = useState(false);

    // Fetch Faculty
    const { data: facultyData, isLoading } = useQuery({
        queryKey: ['faculty', search],
        queryFn: () => facultyService.getAll({ search })
    });

    // Mutation: Update Faculty (Allocated Subjects)
    const updateFacultyMutation = useMutation({
        mutationFn: ({ id, data }) => facultyService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['faculty']);
            toast.success('Faculty updated successfully');
            setShowSubjectModal(false);
        },
        onError: (error) => toast.error('Update failed')
    });

    // Fetch Courses for dropdown
    const { data: coursesData } = useQuery({
        queryKey: ['courses'],
        queryFn: () => courseService.getAll({ limit: 100 })
    });

    // Mutation: Delete Faculty
    const deleteFacultyMutation = useMutation({
        mutationFn: (id) => facultyService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['faculty']);
            toast.success('Faculty deleted successfully');
        },
        onError: (error) => toast.error('Failed to delete faculty')
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Faculty Management</h1>
                    <p className="text-sm text-gray-500">Manage faculty members and subject allocations</p>
                </div>
            </div>

            {/* Search */}
            <div className="mb-6 max-w-md">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search faculty..."
                        className="input pl-10 w-full"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Faculty Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty Member</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {isLoading ? (
                                <tr><td colSpan="4" className="text-center py-8">Loading...</td></tr>
                            ) : facultyData?.data?.faculty?.map((faculty) => (
                                <tr key={faculty._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                                {faculty.firstName[0]}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {faculty.firstName} {faculty.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">{faculty.employeeId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                            <Briefcase className="h-4 w-4 mr-2" />
                                            {faculty.designation}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {faculty.allocatedSubjects?.length > 0 ? (
                                                faculty.allocatedSubjects.map((sub, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700">
                                                        {sub.section ? `${sub.section} (` : ''}{sub.subject?.code || 'Sub'}{sub.section ? ')' : ''}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-xs">No subjects</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                title="Allocated Subjects"
                                                onClick={() => {
                                                    setSelectedFaculty(faculty);
                                                    setShowSubjectModal(true);
                                                }}
                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <BookOpen className="h-5 w-5" />
                                            </button>
                                            <button
                                                title="Delete"
                                                onClick={() => {
                                                    if (window.confirm('Delete this faculty member?')) {
                                                        deleteFacultyMutation.mutate(faculty._id);
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

            {/* Modal: Allocate Subject */}
            {showSubjectModal && selectedFaculty && (
                <AssignSubjectModal
                    faculty={selectedFaculty}
                    courses={coursesData?.data?.courses || []}
                    onClose={() => setShowSubjectModal(false)}
                    onSubmit={(data) => {
                        // Append to existing subjects or replace? 
                        // Usually we append, but for simplicity let's just push to the array.
                        // But we need to handle the whole array update.
                        // For now, let's assume we add one.
                        const newSubjects = [...(selectedFaculty.allocatedSubjects || []), data];
                        updateFacultyMutation.mutate({
                            id: selectedFaculty._id,
                            data: { allocatedSubjects: newSubjects }
                        });
                    }}
                />
            )}
        </div>
    );
};

const AssignSubjectModal = ({ faculty, courses, onClose, onSubmit }) => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [subjects, setSubjects] = useState([]);

    // Fetch subjects when course/sem changes
    // Ideally useQuery, but simple fetch for now is okay or passed as prop.
    // We can't use hooks conditionally easily inside this sub-component if we want dynamic fetching.
    // Let's use a simple effect or just load all subjects for the course.

    const { data: subjectsData } = useQuery({
        queryKey: ['subjects', selectedCourse, selectedSemester],
        queryFn: () => subjectService.getAll({ course: selectedCourse, semester: selectedSemester }),
        enabled: !!selectedCourse
    });

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                        Allocate Subject to {faculty.firstName}
                    </h3>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        onSubmit({
                            subject: formData.get('subject'),
                            section: formData.get('section'),
                            academicYear: formData.get('academicYear'),
                            semester: selectedSemester
                        });
                    }}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Course</label>
                                <select
                                    className="input mt-1 w-full"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    required
                                >
                                    <option value="">Select Course...</option>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Semester</label>
                                <select
                                    className="input mt-1 w-full"
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    required
                                >
                                    <option value="">Select Semester...</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                                <select name="subject" className="input mt-1 w-full" required>
                                    <option value="">Select Subject...</option>
                                    {subjectsData?.data?.data?.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Section</label>
                                <input name="section" type="text" className="input mt-1 w-full" placeholder="A, B, C..." required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Academic Year</label>
                                <input name="academicYear" type="text" className="input mt-1 w-full" defaultValue="2025-26" required />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Allocate</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FacultyManagement;
