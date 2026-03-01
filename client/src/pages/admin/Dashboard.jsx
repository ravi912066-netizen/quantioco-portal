import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, BookOpen, ClipboardList, Zap, Plus,
    TrendingUp, ArrowUpRight, BarChart3, Clock
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="stat-card group">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6" />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-green-400 text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4" />
                    {trend}%
                </div>
            )}
        </div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
);

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        students: 0,
        courses: 0,
        assignments: 0,
        platformXP: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/users/admin/stats');
                setStats(res.data);
            } catch (err) {
                // Mock data for demo
                setStats({ students: 247, courses: 12, assignments: 89, platformXP: 12500 });
            }
        };
        fetchStats();
    }, []);

    return (
        <AdminLayout>
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-white">Welcome back, <span className="gradient-text">{user?.name || 'Ravi Yadav'}</span>! 👋</h1>
                    <p className="text-gray-400 mt-2">Shape the future of learning with innovative courses.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <div className="flex items-center gap-2 text-green-400 text-sm mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        System Live
                    </div>
                </div>
            </div>

            {/* Hero Banner Card */}
            <div className="relative overflow-hidden rounded-3xl mb-10 group h-48">
                <div className="absolute inset-0 animated-gradient opacity-90 transition-transform duration-700 group-hover:scale-105"></div>
                <div className="flex items-center justify-between p-10 h-full relative z-10">
                    <div className="text-white">
                        <h2 className="text-3xl font-bold mb-2">94% Satisfaction Rate</h2>
                        <p className="opacity-80 max-w-md">Our learners are seeing incredible results. Add new content to keep the momentum going!</p>
                    </div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="hidden lg:flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20"
                    >
                        <div className="p-3 bg-white text-primary-600 rounded-xl shadow-lg">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs opacity-70">Weekly Growth</p>
                            <p className="text-xl font-bold">+12% this week</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Total Students" value={stats.students} icon={Users} color="primary" trend="12" />
                <StatCard title="Active Courses" value={stats.courses} icon={BookOpen} color="purple" trend="2" />
                <StatCard title="Certificates Issued" value={stats.assignments} icon={ClipboardList} color="green" trend="23" />
                <StatCard title="Average Completion" value="94%" icon={Zap} color="orange" trend="5" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="lg:col-span-2 glass-card p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary-400" /> Quick Actions
                        </h3>
                        <span className="text-xs text-primary-400 hover:underline cursor-pointer">View all history</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className="flex items-center justify-between p-6 rounded-2xl bg-primary-600/10 border border-primary-500/20 hover:bg-primary-600/20 transition-all text-left group">
                            <div>
                                <p className="font-bold text-white mb-1 group-hover:text-primary-300">Create Course</p>
                                <p className="text-xs text-gray-500">Build your next learning experience</p>
                            </div>
                            <div className="p-2 bg-primary-500 rounded-lg shadow-glow shadow-primary-500/50">
                                <Plus className="w-5 h-5 text-white" />
                            </div>
                        </button>
                        <button className="flex items-center justify-between p-6 rounded-2xl bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600/20 transition-all text-left group">
                            <div>
                                <p className="font-bold text-white mb-1 group-hover:text-purple-300">Edit course</p>
                                <p className="text-xs text-gray-500">Modify existing content</p>
                            </div>
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                        </button>
                    </div>
                </div>

                {/* System Health / Recent Activity */}
                <div className="glass-card p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-400" /> Recent Activity
                    </h3>
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="w-2 h-2 rounded-full bg-primary-500 mt-2 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-medium text-white">Course "Python for Devs" updated</p>
                                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
                        View Activity Logs
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}
