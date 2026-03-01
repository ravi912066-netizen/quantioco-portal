import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Zap, Book, Trophy, Target, Play,
    ChevronRight, Calendar, ArrowUpRight, Flame
} from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';
import HeatmapCalendar from '../../components/ui/HeatmapCalendar';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const DashboardCard = ({ title, value, sub, icon: Icon, color }) => (
    <div className="stat-card">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="bg-white/5 p-1 rounded-lg">
                <ArrowUpRight className="w-4 h-4 text-gray-500" />
            </div>
        </div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-bold text-white">{value}</p>
            {sub && <span className="text-xs text-gray-400">{sub}</span>}
        </div>
    </div>
);

export default function StudentDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        enrolledCourses: 4,
        assignmentsDone: 12,
        xp: 2900,
        streak: 15,
        problemsSolved: 156
    });

    return (
        <StudentLayout>
            <div className="mb-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 mb-2"
                >
                    <span className="px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-xs font-bold border border-primary-500/20">
                        PRO LEARNER
                    </span>
                    <span className="text-gray-500 text-sm">•</span>
                    <span className="text-gray-400 text-sm">Target: Batch 2026</span>
                </motion.div>
                <h1 className="text-4xl font-bold text-white">Hello, <span className="gradient-text">{user?.name}</span>! 🔥</h1>
                <p className="text-gray-400 mt-2">You're in the top 5% of learners this week. Keep pushing!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <DashboardCard title="Total XP" value={user?.xp || stats.xp} sub="LVL 14" icon={Zap} color="yellow" />
                <DashboardCard title="Solved Items" value={stats.problemsSolved} sub="Problems" icon={Target} color="primary" />
                <DashboardCard title="Current Streak" value={stats.streak} sub="Days" icon={Flame} color="orange" />
                <DashboardCard title="Courses" value={stats.enrolledCourses} sub="Active" icon={Book} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Heatmap Section */}
                    <HeatmapCalendar />

                    {/* Continue Learning */}
                    <div className="glass-card p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Play className="w-5 h-5 text-green-400" /> Continue Learning
                            </h3>
                            <button className="text-sm text-primary-400 font-medium flex items-center gap-1 hover:underline">
                                View all <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {[
                                { title: 'Full Stack Development', lesson: 'React Hooks Deep Dive', progress: 65, color: 'primary' },
                                { title: 'DSA Mastery Program', lesson: 'Dynamic Programming - Part 2', progress: 42, color: 'purple' }
                            ].map((course, i) => (
                                <div key={i} className="group p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-primary-300 transition-colors uppercase text-xs tracking-widest opacity-60 mb-1">
                                                {course.title}
                                            </h4>
                                            <p className="text-lg font-semibold text-white">{course.lesson}</p>
                                        </div>
                                        <div className={`p-3 rounded-lg bg-${course.color}-500/20 text-${course.color}-400`}>
                                            <Play className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-dark-600 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${course.progress}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full bg-${course.color}-500 shadow-glow shadow-${course.color}-500/50`}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
                                        <span>{course.progress}% Complete</span>
                                        <span>12 / 24 Lessons</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Contest Tracker Summary */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-red-500" /> Upcoming Contests
                        </h3>
                        <div className="space-y-4">
                            {[
                                { platform: 'Codeforces', name: 'Codeforces Round 920', time: 'Today, 20:05', badge: 'cf-badge' },
                                { platform: 'LeetCode', name: 'Weekly Contest 380', time: 'Sun, 08:00', badge: 'lc-badge' },
                                { platform: 'CodeChef', name: 'Starters 115', time: 'Wed, 20:00', badge: 'cc-badge' }
                            ].map((c, i) => (
                                <div key={i} className="flex flex-col gap-1 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                    <span className={`badge w-fit ${c.badge}`}>{c.platform}</span>
                                    <p className="text-sm font-semibold text-white truncate mt-1">{c.name}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                        {c.time}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-wider">
                            Open Contest Calendar
                        </button>
                    </div>

                    {/* Quick Stats / Leaderboard Preview */}
                    <div className="glass-card p-6 animated-gradient bg-opacity-10 border-none relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10">
                            <Trophy className="w-5 h-5 text-yellow-400" /> Leaderboard
                        </h3>
                        <p className="text-sm opacity-80 mb-6 relative z-10">You're currently ranked <span className="font-bold">#42</span> in the global ranking.</p>
                        <div className="space-y-3 relative z-10">
                            {[
                                { name: 'Ravi Yadav', xp: 2900, rank: 1 },
                                { name: 'Hardik Mani...', xp: 2760, rank: 2 }
                            ].map((u, i) => (
                                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-black/20 backdrop-blur-sm">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-gray-400">#{u.rank}</span>
                                        <span className="text-sm font-medium">{u.name}</span>
                                    </div>
                                    <span className="text-xs font-bold text-yellow-400">{u.xp} XP</span>
                                </div>
                            ))}
                        </div>
                        <button className="btn-primary w-full mt-6 text-xs uppercase tracking-widest relative z-10">
                            View Leaderboard
                        </button>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
