import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3, TrendingUp, Users, BookOpen,
    Award, Download, Filter, Calendar, Zap, Target
} from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../api/axios';

export default function AdminReports() {
    const [stats, setStats] = useState({
        revenue: 125400,
        students: 1240,
        courses: 18,
        completions: 450
    });

    return (
        <AdminLayout>
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Strategic <span className="text-primary-500">Intelligence</span></h1>
                    <p className="text-gray-400 mt-2 text-xs font-bold uppercase tracking-widest opacity-60">Fleet Performance Analytics</p>
                </div>
                <button className="btn-secondary flex items-center gap-2 text-[10px] font-black uppercase tracking-widest py-2.5 px-6">
                    <Download className="w-4 h-4" /> Export Data
                </button>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="glass-card p-8 border-primary-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-primary-500/10 text-primary-400 border border-primary-500/20"><TrendingUp className="w-6 h-6" /></div>
                        <span className="text-green-400 text-[10px] font-black">+24%</span>
                    </div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Revenue</p>
                    <p className="text-3xl font-black text-white">₹{stats.revenue.toLocaleString()}</p>
                </div>
                <div className="glass-card p-8 border-purple-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20"><Users className="w-6 h-6" /></div>
                        <span className="text-green-400 text-[10px] font-black">+12%</span>
                    </div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Active Cadets</p>
                    <p className="text-3xl font-black text-white">{stats.students.toLocaleString()}</p>
                </div>
                <div className="glass-card p-8 border-blue-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20"><BookOpen className="w-6 h-6" /></div>
                        <span className="text-gray-500 text-[10px] font-black">Stable</span>
                    </div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Live Courses</p>
                    <p className="text-3xl font-black text-white">{stats.courses}</p>
                </div>
                <div className="glass-card p-8 border-yellow-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"><Award className="w-6 h-6" /></div>
                        <span className="text-green-400 text-[10px] font-black">+8%</span>
                    </div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Mission Completions</p>
                    <p className="text-3xl font-black text-white">{stats.completions}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                <div className="lg:col-span-2 glass-card p-10 h-[400px] flex flex-col items-center justify-center border-dashed">
                    <BarChart3 className="w-16 h-16 text-gray-800 mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Analytics Visualization Terminal</p>
                    <p className="text-gray-700 text-[10px] mt-2 italic">Connect chart.js or reentry for live data streams</p>
                </div>
                <div className="glass-card p-8 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">Top Performing Domains</h3>
                    {[
                        { label: 'Fullstack Web', val: 85, color: 'bg-primary-500' },
                        { label: 'Data Structures', val: 72, color: 'bg-purple-500' },
                        { label: 'Cloud Architecture', val: 45, color: 'bg-blue-500' },
                        { label: 'UI/UX Design', val: 38, color: 'bg-yellow-500' }
                    ].map(d => (
                        <div key={d.label} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                                <span className="text-gray-400">{d.label}</span>
                                <span className="text-white">{d.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className={`h-full ${d.color} shadow-glow`} style={{ width: `${d.val}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
