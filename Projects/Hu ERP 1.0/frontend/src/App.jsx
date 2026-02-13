import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import store from './store/store';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import VerifyEmail from './pages/Auth/VerifyEmail';
import Landing from './pages/Landing';
import StudentDashboard from './pages/Student/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';
import StudentManagement from './pages/Admin/StudentManagement';
import CourseManagement from './pages/Admin/CourseManagement';
import FacultyManagement from './pages/Admin/FacultyManagement';
import SubjectManagement from './pages/Admin/SubjectManagement';
import FacultyDashboard from './pages/Faculty/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Create query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: '#363636',
                                color: '#fff',
                            },
                            success: {
                                duration: 3000,
                                iconTheme: {
                                    primary: '#10b981',
                                    secondary: '#fff',
                                },
                            },
                            error: {
                                duration: 4000,
                                iconTheme: {
                                    primary: '#ef4444',
                                    secondary: '#fff',
                                },
                            },
                        }}
                    />

                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/verify-email" element={<VerifyEmail />} />

                        {/* Student Routes */}
                        <Route
                            path="/student/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['STUDENT']}>
                                    <StudentDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Faculty Routes */}
                        <Route
                            path="/faculty/dashboard"
                            element={
                                <ProtectedRoute allowedRoles={['FACULTY']}>
                                    <FacultyDashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin/*"
                            element={
                                <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                                    <Routes>
                                        <Route path="/dashboard" element={<AdminDashboard />} />
                                        <Route path="/students" element={<StudentManagement />} />
                                        <Route path="/courses" element={<CourseManagement />} />
                                        <Route path="/faculty" element={<FacultyManagement />} />
                                        <Route path="/subjects" element={<SubjectManagement />} />
                                    </Routes>
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 Not Found */}
                        <Route
                            path="*"
                            element={
                                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                                    <div className="text-center">
                                        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
                                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
                                            Page not found
                                        </p>
                                    </div>
                                </div>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </Provider>
    );
}

export default App;
