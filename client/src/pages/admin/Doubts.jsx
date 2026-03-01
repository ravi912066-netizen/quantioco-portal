import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, CheckCircle, Clock, User, Reply, Search, X, ShieldAlert } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function StudentDoubts() {
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoubt, setSelectedDoubt] = useState(null);
    const [answer, setAnswer] = useState('');

    const fetchDoubts = async () => {
        try {
            const res = await API.get('/doubts');
            setDoubts(res.data);
        } catch (err) { } finally { setLoading(false); }
    };

    useEffect(() => { fetchDoubts(); }, []);

    const handleResolve = async () => {
        if (!answer) return toast.error('Please provide an answer');
        try {
            await API.put(`/doubts/${selectedDoubt._id}/resolve`, { answer });
            toast.success('Doubt resolved and cadet notified!');
            setSelectedDoubt(null);
            setAnswer('');
            fetchDoubts();
        } catch (err) {
            toast.error('Resolution failed');
        }
    };

    return (
        <AdminLayout>
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Doubt <span className="text-primary-500">Nexus</span></h1>
                    <p className="text-gray-400 mt-2 text-xs font-bold uppercase tracking-widest opacity-60">Mentor Response Terminal</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unresolved: {doubts.filter(d => !d.resolved).length}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doubts.map((doubt) => (
                    <motion.div
                        layout
                        key={doubt._id}
                        className={`glass-card p-6 flex flex-col group relative overflow-hidden transition-all ${doubt.resolved ? 'opacity-60 border-green-500/20' : 'border-primary-500/20 hover:border-primary-500/40'}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-lg ${doubt.resolved ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                    {doubt.resolved ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                </div>
                                <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{doubt.course || 'General'}</span>
                            </div>
                            {!doubt.resolved && <span className="badge bg-primary-600 text-white text-[8px] animate-bounce">Priority</span>}
                        </div>

                        <p className="text-white font-bold text-sm mb-6 line-clamp-3 group-hover:text-primary-300 transition-colors uppercase tracking-tight">{doubt.question}</p>

                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-primary-400 border border-white/10">S</div>
                                <span className="text-[10px] font-bold text-gray-500">{doubt.student?.name || 'Cadet'}</span>
                            </div>
                            {doubt.resolved ? (
                                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Resolved</span>
                            ) : (
                                <button
                                    onClick={() => setSelectedDoubt(doubt)}
                                    className="p-2 px-4 rounded-lg bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest hover:shadow-glow transition-all"
                                >
                                    Respond
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedDoubt && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card-dark w-full max-w-2xl p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black uppercase tracking-tighter">Draft <span className="text-primary-500">Resolution</span></h2>
                                <button onClick={() => setSelectedDoubt(null)} className="p-2 hover:bg-white/10 rounded-full"><X className="w-6 h-6" /></button>
                            </div>

                            <div className="bg-white/5 p-6 rounded-2xl mb-8 border border-white/5">
                                <div className="flex items-center gap-2 mb-3 text-gray-500">
                                    <User className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Question from Cadet</span>
                                </div>
                                <p className="text-white font-medium italic">"{selectedDoubt.question}"</p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-2"><Reply className="w-4 h-4" /> Professional Guidance</label>
                                <textarea
                                    className="input-field min-h-[200px] text-sm"
                                    placeholder="Provide a detailed solution or hint..."
                                    onChange={(e) => setAnswer(e.target.value)}
                                ></textarea>
                            </div>

                            <div className="pt-8 flex gap-4">
                                <button onClick={handleResolve} className="btn-primary flex-1 uppercase font-black text-xs tracking-widest py-3 font-bold">Transmit Solution</button>
                                <button onClick={() => setSelectedDoubt(null)} className="btn-secondary flex-1 uppercase font-black text-xs tracking-widest py-3">Close</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
}
