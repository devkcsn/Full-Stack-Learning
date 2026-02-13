import { Link } from 'react-router-dom';
import {
    BookOpen,
    Users,
    Award,
    ArrowRight,
    CheckCircle2,
    GraduationCap
} from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <div className="bg-primary-600 p-2 rounded-lg">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <span className="ml-3 text-xl font-display font-bold text-gray-900 dark:text-white">
                                Haridwar University
                            </span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">
                                Features
                            </a>
                            <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">
                                About
                            </a>
                            <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">
                                Contact
                            </a>
                            <Link to="/login" className="btn btn-primary">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 dark:text-white tracking-tight mb-8 animate-fade-in">
                        Manage Your University <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                            With Excellence
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-10 animate-slide-up">
                        A comprehensive ERP solution designed for modern education. Streamline administration,
                        enhance learning, and empower your campus community.
                    </p>
                    <div className="flex justify-center gap-4 animate-slide-up">
                        <Link to="/login" className="btn btn-primary px-8 py-4 text-lg rounded-full">
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <a href="#features" className="btn btn-secondary px-8 py-4 text-lg rounded-full">
                            Learn More
                        </a>
                    </div>
                </div>

                {/* Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-300/20 rounded-full blur-3xl"></div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-24 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl font-display font-bold text-gray-900 dark:text-white">
                            Everything you need to run your campus
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Users,
                                title: "Student Management",
                                desc: "Complete lifecycle management from admission to alumni. Track attendance, grades, and performance."
                            },
                            {
                                icon: BookOpen,
                                title: "Academic Planning",
                                desc: "Efficient course scheduling, curriculum management, and resource allocation for all departments."
                            },
                            {
                                icon: Award,
                                title: "Examination & Results",
                                desc: "Secure examination processes, automated grading systems, and instant result publication."
                            }
                        ].map((feature, index) => (
                            <div key={index} className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-6">
                                    <feature.icon className="h-7 w-7 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-20 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Students", value: "10,000+" },
                            { label: "Faculty", value: "500+" },
                            { label: "Courses", value: "100+" },
                            { label: "Years of Excellence", value: "25+" }
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-4xl font-display font-bold text-primary-600 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center mb-6">
                                <GraduationCap className="h-8 w-8 text-primary-400" />
                                <span className="ml-3 text-xl font-display font-bold">
                                    Haridwar University
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Empowering the featured generation through excellence in education and technology.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li><Link to="/login" className="hover:text-white transition-colors">Student Login</Link></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Faculty Login</Link></li>
                                <li><Link to="/login" className="hover:text-white transition-colors">Admin Portal</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6">Contact</h4>
                            <ul className="space-y-4 text-gray-400">
                                <li>Haridwar, Uttarakhand</li>
                                <li>info@haridwaruniversity.edu</li>
                                <li>+91 123 456 7890</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary-500 w-full"
                                />
                                <button className="bg-primary-600 px-4 py-2 rounded-r-lg hover:bg-primary-700">
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                        © 2024 Haridwar University. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
