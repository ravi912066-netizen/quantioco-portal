import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, BookOpen, ClipboardList, Users, UserCheck,
    MessageSquare, BarChart3, User, LogOut, Zap, GraduationCap, Video
} from 'lucide-react';

const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/live', label: 'Live Classes', icon: Video },
    { to: '/admin/courses', label: 'Manage Courses', icon: BookOpen },
    { to: '/admin/assignments', label: 'Assignments', icon: ClipboardList },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/enrollment', label: 'Enrollment Requests', icon: UserCheck },
    { to: '/admin/doubts', label: 'Student Doubts', icon: MessageSquare },
    { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { to: '/admin/profile', label: 'Profile', icon: User },
];

export default function AdminSidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className="w-72 min-h-screen bg-dark-800 border-r border-white/5 flex flex-col"
        >
            {/* Logo */}
            <div className="p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl animated-gradient flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg gradient-text">Quantioco.io</h1>
                        <p className="text-xs text-gray-500">Admin Portal</p>
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className="p-4 mx-3 mt-4 glass-card">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center font-bold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div>
                        <p className="font-semibold text-sm text-white">{user?.name || 'Ravi Yadav'}</p>
                        <p className="text-xs text-primary-400">Admin Access</p>
                    </div>
                    <div className="ml-auto">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow"></div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                <p className="px-4 text-xs text-gray-600 font-semibold uppercase tracking-wider mb-3">Command Center</p>
                {navItems.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </motion.aside>
    );
}
