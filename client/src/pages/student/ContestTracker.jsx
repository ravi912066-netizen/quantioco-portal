import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink, Filter, Search, Info, Trophy, LayoutGrid, List } from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';

export default function ContestTracker() {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we'd fetch from Kontests API or similar
        // For demo, we provide high-quality mock data
        setTimeout(() => {
            setContests([
                { platform: 'Codeforces', name: 'Codeforces Round 920 (Div. 2)', start: 'Today, 20:05', duration: '2h', badge: 'cf-badge', url: 'https://codeforces.com/contests' },
                { platform: 'LeetCode', name: 'Weekly Contest 380', start: 'Sun, 08:00', duration: '1h 30m', badge: 'lc-badge', url: 'https://leetcode.com/contest' },
                { platform: 'CodeChef', name: 'Starters 115 (Rated for all)', start: 'Wednesday, 20:00', duration: '2h', badge: 'cc-badge', url: 'https://www.codechef.com/contests' },
                { platform: 'AtCoder', name: 'AtCoder Beginner Contest 336', start: 'Saturday, 17:30', duration: '1h 40m', badge: 'at-badge', url: 'https://atcoder.jp/contests' },
                { platform: 'LeetCode', name: 'Biweekly Contest 122', start: 'Jan 20, 20:00', duration: '1h 30m', badge: 'lc-badge', url: 'https://leetcode.com/contest' },
                { platform: 'Codeforces', name: 'Educational Codeforces Round 161', start: 'Jan 18, 20:05', duration: '2h', badge: 'cf-badge', url: 'https://codeforces.com/contests' },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <StudentLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <div className="badge bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 mb-2 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> {contests.length} ACTIVE EVENTS DETECTED
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Global <span className="gradient-text">Arena</span> Calender 🗓️</h1>
                    <p className="text-gray-500 mt-2 font-medium max-w-xl text-sm leading-relaxed">Stay ahead in the competitive landscape. Track upcoming contests across all major platforms in one place.</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-3 glass-card hover:border-primary-500/30 transition-all text-gray-400 hover:text-white"><LayoutGrid className="w-5 h-5" /></button>
                    <button className="p-3 glass-card hover:border-primary-500/30 transition-all text-gray-400 hover:text-white"><List className="w-5 h-5" /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-20">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-44 rounded-2xl skeleton"></div>)
                ) : (
                    contests.map((c, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={i}
                            className="glass-card p-6 flex flex-col group hover:border-primary-500/20 transition-all cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Trophy className="w-20 h-20" />
                            </div>

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <span className={`badge px-4 py-1.5 text-[10px] uppercase font-black tracking-widest border ${c.badge}`}>
                                    {c.platform}
                                </span>
                                <div className="bg-white/5 p-2 rounded-xl group-hover:bg-primary-500 group-hover:text-white transition-all">
                                    <Clock className="w-4 h-4" />
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-white group-hover:text-primary-300 transition-colors uppercase tracking-tight mb-6 line-clamp-1 truncate pr-8">
                                {c.name}
                            </h3>

                            <div className="mt-auto pt-6 border-t border-white/5 flex items-end justify-between relative z-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Starting at</p>
                                    <p className="text-sm font-bold text-white flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary-500" /> {c.start}
                                    </p>
                                </div>
                                <a
                                    href={c.url}
                                    target="_blank"
                                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 hover:shadow-glow transition-all border border-white/10 text-primary-400 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                                >
                                    Register <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Info Card */}
            <div className="glass-card p-10 flex flex-col md:flex-row items-center gap-10 bg-primary-600/5 max-w-5xl mx-auto mb-20">
                <div className="w-20 h-20 rounded-3xl bg-primary-500/10 text-primary-500 flex items-center justify-center shrink-0 border border-primary-500/20">
                    <Info className="w-10 h-10" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Automated Contest Synchronization</h4>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">Our system automatically fetches coding contests from major platforms every 15 minutes. Ensure your profile handles (Codeforces, LeetCode) are updated in settings, as we will use them to track your contest performance and award extra XP automatically.</p>
                </div>
                <button className="btn-secondary whitespace-nowrap py-3 px-8 text-xs font-black uppercase tracking-widest">Setup Handles</button>
            </div>
        </StudentLayout>
    );
}
