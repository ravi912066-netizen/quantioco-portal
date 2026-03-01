import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Zap, Target, Star, Crown, ChevronRight, MessageSquare, Search, Award } from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';
import API from '../../api/axios';

const PodiumItem = ({ user, rank, delay }) => {
    const isFirst = rank === 1;
    const height = isFirst ? 'h-[220px]' : rank === 2 ? 'h-[180px]' : 'h-[150px]';
    const color = isFirst ? '#ffd700' : rank === 2 ? '#c0c0c0' : '#cd7f32';

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6 }}
            className="flex flex-col items-center group relative mt-auto"
        >
            <div className="relative mb-6">
                <div
                    className="w-24 h-24 rounded-full p-1.5 relative overflow-hidden group-hover:scale-110 transition-transform duration-500"
                    style={{ background: `linear-gradient(45deg, ${color}, transparent)` }}
                >
                    <div className="w-full h-full rounded-full bg-dark-900 flex items-center justify-center font-black text-2xl border-4 border-dark-900 border-opacity-50 text-white relative z-10">
                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-full" /> : user.name.charAt(0)}
                    </div>
                    {isFirst && <div className="absolute inset-0 animated-gradient blur-xl opacity-30 animate-pulse-slow"></div>}
                </div>
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-lg flex items-center justify-center border-2 border-dark-900 shadow-xl z-20 ${isFirst ? 'bg-yellow-500 text-black' : rank === 2 ? 'bg-gray-400 text-dark-900' : 'bg-orange-600 text-white'}`}>
                    {isFirst ? <Crown className="w-4 h-4 fill-current" /> : <span className="text-xs font-black">{rank}</span>}
                </div>
            </div>

            <div className="text-center mb-6">
                <p className="font-black text-white text-lg tracking-tight uppercase group-hover:text-primary-400 transition-colors">{user.name}</p>
                <div className="flex items-center justify-center gap-1 text-yellow-500 font-bold text-sm">
                    <Zap className="w-3.5 h-3.5 fill-current" /> {user.xp} XP
                </div>
            </div>

            <div className={`w-32 rounded-t-3xl backdrop-blur-md border border-white/5 relative ${height}`} style={{ background: `linear-gradient(180deg, ${color}22, #0f0f20)` }}>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-10 font-black text-6xl text-white">{rank}</div>
            </div>
        </motion.div>
    );
};

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await API.get('/users/leaderboard');
                setLeaderboard(res.data);
            } catch (err) {
                // Fallback demo data
                setLeaderboard([
                    { name: 'Ravi Yadav', xp: 2900, rank: 1, problemsSolved: 156, streak: 15 },
                    { name: 'Hardik Manish Wahi', xp: 2760, rank: 2, problemsSolved: 142, streak: 12 },
                    { name: 'Dhruvil Shah', xp: 2700, rank: 3, problemsSolved: 138, streak: 20 },
                    { name: 'Naveen Kumar', xp: 2500, rank: 4, problemsSolved: 120, streak: 10 },
                    { name: 'Pratik Sharma', xp: 2450, rank: 5, problemsSolved: 115, streak: 8 }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const topThree = leaderboard.slice(0, 3);
    const others = leaderboard.slice(3);

    // In podium display: [2nd, 1st, 3rd]
    const displayPodium = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

    return (
        <StudentLayout>
            <div className="text-center mb-16 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl opacity-50"></div>
                <div className="badge bg-white/5 text-gray-400 uppercase tracking-widest text-[10px] font-black border border-white/5 py-1.5 px-4 mb-4">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()} ARENA RANKINGS
                </div>
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">Global <span className="gradient-text">Hall of Fame</span> 🏆</h1>
                <p className="text-gray-500 max-w-xl mx-auto font-medium">Climb the leaderboard by solving complex missions, tracking problems, and staying consistent.</p>
            </div>

            {/* Podium Section */}
            <div className="flex flex-wrap justify-center items-end gap-0 md:gap-8 mb-20 max-w-4xl mx-auto px-4">
                {displayPodium.map((user, i) => {
                    // Mapping index [0, 1, 2] which is [2nd, 1st, 3rd] to correct rank
                    const rankMap = [2, 1, 3];
                    return <PodiumItem key={user.name} user={user} rank={rankMap[i]} delay={i * 0.2} />;
                })}
            </div>

            {/* Stats Booster Card (Inspiration from Ref 3) */}
            <div className="glass-card p-1 animated-gradient mb-12 max-w-5xl mx-auto">
                <div className="bg-dark-900 rounded-xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5">
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-2xl font-black text-white mb-2">Increase your XP to climb higher!</h3>
                        <p className="text-gray-500 text-sm">Solve arena questions, participate in contests, and complete missions to earn elite status.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="btn-primary py-4 px-10 text-xs font-black uppercase tracking-widest shadow-glow">Solve Assignments</button>
                        <button className="btn-secondary py-4 px-10 text-xs font-black uppercase tracking-widest">Go to Arena</button>
                    </div>
                </div>
            </div>

            {/* Ranking Table */}
            <div className="glass-card max-w-5xl mx-auto overflow-hidden mb-20">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="text-xs font-black tracking-widest text-gray-500 uppercase">Ranking Table</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                        <input className="bg-dark-900 border border-white/5 rounded-lg pl-9 py-2 text-[10px] w-48 text-white focus:outline-none" placeholder="Find cadet..." />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-dark-800 text-[10px] font-black uppercase tracking-widest text-gray-600 border-b border-white/5">
                            <tr>
                                <th className="px-8 py-4">Name</th>
                                <th className="px-8 py-4 text-center">Solved</th>
                                <th className="px-8 py-4 text-center">Streak</th>
                                <th className="px-8 py-4 text-center">XP Points</th>
                                <th className="px-8 py-4 text-right">Rank Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leaderboard.map((user, i) => (
                                <tr key={i} className={`hover:bg-primary-500/5 transition-all group ${i === 0 ? 'bg-yellow-500/5' : ''}`}>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-primary-400 group-hover:scale-110 transition-transform overflow-hidden">
                                                {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors uppercase tracking-tight">{user.name}</p>
                                                <p className="text-[10px] text-gray-600 uppercase font-black tracking-tighter mt-0.5 flex items-center gap-1">
                                                    <Award className="w-3 h-3" /> Cadet Class A
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-sm font-bold text-gray-400">{user.problemsSolved || 0}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex items-center justify-center gap-1.5 text-orange-400">
                                            <TrendingUp className="w-4 h-4" />
                                            <span className="text-sm font-bold">{user.streak || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex items-center justify-center gap-1.5 text-yellow-500">
                                            <Zap className="w-4 h-4 fill-current" />
                                            <span className="text-sm font-black">{user.xp}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className={`text-lg font-black ${i < 3 ? 'gradient-text' : 'text-gray-500'}`}>{i + 1}</span>
                                            <div className={`w-1.5 h-6 rounded-full ${i < 3 ? 'animated-gradient' : 'bg-white/5'}`}></div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </StudentLayout>
    );
}
