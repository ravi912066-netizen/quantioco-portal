import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Code2, Bookmark, CheckCircle,
    Trash2, ExternalLink, Filter, ChevronDown, MoreVertical, X, Award
} from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function ProblemTracker() {
    const [problems, setProblems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ solved: 0, total: 0 });

    const [form, setForm] = useState({
        problemName: '', platform: 'LeetCode', difficulty: 'Medium',
        problemUrl: '', status: 'Todo', notes: '', concept: ''
    });

    const fetchProblems = async () => {
        try {
            const res = await API.get('/problems');
            setProblems(res.data);
            const solved = res.data.filter(p => p.status === 'Solved').length;
            setStats({ solved, total: res.data.length });
        } catch (err) {
            // Mock for demo
        }
    };

    useEffect(() => { fetchProblems(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/problems', form);
            toast.success('Problem added to tracker!');
            setShowModal(false);
            fetchProblems();
        } catch (err) {
            toast.error('Failed to add problem');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (problem) => {
        const newStatus = problem.status === 'Solved' ? 'Todo' : 'Solved';
        try {
            await API.put(`/problems/${problem._id}`, { status: newStatus });
            toast.success(newStatus === 'Solved' ? 'Mission Accomplished! +5 XP' : 'Status Reset');
            fetchProblems();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const toggleBookmark = async (problem) => {
        try {
            await API.put(`/problems/${problem._id}`, { bookmarked: !problem.bookmarked });
            fetchProblems();
        } catch (err) { }
    };

    const deleteProblem = async (id) => {
        if (!confirm('Are you sure you want to remove this problem?')) return;
        try {
            await API.delete(`/problems/${id}`);
            toast.success('Problem removed');
            fetchProblems();
        } catch (err) { }
    };

    const getDifficultyColor = (diff) => {
        if (diff === 'Easy') return 'text-green-400 bg-green-500/10 border-green-500/20';
        if (diff === 'Medium') return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
        return 'text-red-400 bg-red-500/10 border-red-500/20';
    };

    return (
        <StudentLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Combat <span className="gradient-text">Log</span> ⚔️</h1>
                    <p className="text-gray-400 mt-2 uppercase text-[10px] font-black tracking-widest opacity-60">Personal Coding Activity Tracker (TLE Style)</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-none glass-card px-6 py-2 flex items-center justify-center gap-3 border-green-500/20">
                        <div className="p-2 rounded-lg bg-green-500/10 text-green-500"><CheckCircle className="w-4 h-4" /></div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase">Solved missions</p>
                            <p className="text-xl font-black text-white">{stats.solved}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Mission
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input className="input-field pl-12 h-11 text-sm bg-white/5 border-white/5" placeholder="Search by name, platform, or concept..." />
                </div>
                <div className="flex gap-2">
                    {['All Platforms', 'Difficulty', 'Solved Status'].map(f => (
                        <button key={f} className="px-4 py-2 glass-card text-xs font-bold text-gray-400 hover:text-white flex items-center gap-2 border-white/5">
                            {f} <ChevronDown className="w-3 h-3" />
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-white/5 border-b border-white/10 uppercase font-black text-[10px] text-gray-500 tracking-widest">
                            <tr>
                                <th className="px-6 py-5">#</th>
                                <th className="px-6 py-5">Problem Mission</th>
                                <th className="px-6 py-5">Platform</th>
                                <th className="px-6 py-5">Complexity</th>
                                <th className="px-6 py-5 text-center">Outcome</th>
                                <th className="px-6 py-5 text-center">Intel</th>
                                <th className="px-6 py-5 text-right flex items-center justify-end gap-1"><Bookmark className="w-3 h-3" /> Bookmark</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {problems.length > 0 ? problems.map((p, i) => (
                                <tr key={p._id} className="hover:bg-white/5 transition-all group">
                                    <td className="px-6 py-5 text-xs text-gray-600 font-bold">{i + 1}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <a href={p.problemUrl} target="_blank" className="text-sm font-bold text-white hover:text-primary-400 transition-colors flex items-center gap-2">
                                                {p.problemName} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                            {p.concept && <span className="badge bg-white/5 text-gray-500 border-white/5 text-[9px] uppercase">{p.concept}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`badge uppercase text-[10px] ${p.platform === 'LeetCode' ? 'lc-badge' : p.platform === 'Codeforces' ? 'cf-badge' : 'bg-white/5 text-gray-400'}`}>
                                            {p.platform}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`badge border text-[10px] uppercase font-bold ${getDifficultyColor(p.difficulty)}`}>
                                            {p.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <button
                                            onClick={() => toggleStatus(p)}
                                            className={`text-[10px] font-black px-4 py-1.5 rounded-lg border uppercase transition-all ${p.status === 'Solved' ? 'bg-green-500 border-green-500 text-white shadow-glow shadow-green-500/30' : 'bg-white/5 border-white/10 text-gray-500 hover:border-primary-500/50 hover:text-primary-400 cursor-pointer'}`}
                                        >
                                            {p.status === 'Solved' ? 'Solved' : 'Pending'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-primary-400 flex items-center justify-center mx-auto transition-colors border border-transparent hover:border-white/5">
                                            <FileText className="w-4 h-4" />
                                        </button>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                onClick={() => toggleBookmark(p)}
                                                className={`p-1.5 transition-colors ${p.bookmarked ? 'text-yellow-500 animate-pulse' : 'text-gray-700 hover:text-yellow-500 hover:scale-125 transition-transform'}`}>
                                                <Bookmark className={`w-5 h-5 ${p.bookmarked ? 'fill-current' : ''}`} />
                                            </button>
                                            <button
                                                onClick={() => deleteProblem(p._id)}
                                                className="p-1.5 text-gray-700 hover:text-red-500 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-32 text-center">
                                        <div className="flex flex-col items-center justify-center h-full gap-4">
                                            <Code2 className="w-16 h-16 text-gray-800" />
                                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Awaiting mission data...</p>
                                            <button onClick={() => setShowModal(true)} className="btn-secondary text-xs uppercase font-bold py-2">Add My First Problem</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card-dark w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                                <h2 className="text-2xl font-black uppercase tracking-tighter">Add <span className="gradient-text">New Mission</span> ⚔️</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Problem Name</label>
                                        <input required className="input-field" placeholder="3Sum, Reverse Linked List..." onChange={(e) => setForm({ ...form, problemName: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Mission Deck (Platform)</label>
                                        <select className="input-field" onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                                            <option>LeetCode</option>
                                            <option>Codeforces</option>
                                            <option>CodeChef</option>
                                            <option>AtCoder</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Hazard Level (Difficulty)</label>
                                        <select className="input-field" onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                                            <option>Easy</option>
                                            <option selected>Medium</option>
                                            <option>Hard</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Mission Target (URL)</label>
                                        <input className="input-field" placeholder="https://leetcode.com/problems/..." onChange={(e) => setForm({ ...form, problemUrl: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Intel Target (Concept)</label>
                                        <input className="input-field py-3 text-sm" placeholder="Graphs, DP..." onChange={(e) => setForm({ ...form, concept: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Current Phase (Status)</label>
                                        <select className="input-field py-3 text-sm" onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                            <option value="Todo">Todo</option>
                                            <option value="Solved">Solved</option>
                                            <option value="Attempted">Attempted</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="pt-4 flex gap-4">
                                    <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Logging Intel...' : 'Finalize Log'}</button>
                                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </StudentLayout>
    );
}
