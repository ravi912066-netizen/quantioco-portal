import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    ClipboardList, CheckCircle2, Terminal, Code,
    Send, ExternalLink, Award, FileText, ChevronRight, Clock, AlertTriangle
} from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function StudentAssignments() {
    const [tasks, setTasks] = useState([]);
    const [activeTask, setActiveTask] = useState(null);
    const [code, setCode] = useState('');
    const [link, setLink] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submittedTasks, setSubmittedTasks] = useState([]);

    const fetchData = async () => {
        try {
            const [res, subRes] = await Promise.all([
                API.get('/assignments'),
                API.get('/assignments/submissions/me')
            ]);
            setTasks(res.data);
            setTasks(res.data);
            if (res.data.length > 0) {
                handleTaskSelect(res.data[0]);
            }
            setSubmittedTasks(subRes.data.map(s => s.assignment?._id));
        } catch (err) {
            // Handle
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleTaskSelect = async (task) => {
        setActiveTask(task);
        try {
            await API.put(`/assignments/${task._id}/attempt`);
        } catch (err) {
            // Ignore if already attempting
        }
    };

    const handleFileUpload = (e) => {
        const f = e.target.files[0];
        if (f) {
            if (f.size > 5 * 1024 * 1024) {
                toast.error("File must be less than 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFile(reader.result);
                toast.success("File attached successfully!");
            };
            reader.readAsDataURL(f);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code && !link && !file) return toast.error('Please provide a solution (Code, Link, or File)');
        setLoading(true);
        try {
            await API.post(`/assignments/${activeTask._id}/submit`, { code, solutionLink: link, solutionFile: file });
            toast.success('Assignment submitted! XP awarded.');
            setCode('');
            setLink('');
            setFile(null);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Submission failed');
        } finally {
            setLoading(false);
        }
    };

    const isSubmitted = submittedTasks.includes(activeTask?._id);

    return (
        <StudentLayout>
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Coding <span className="gradient-text">Missions</span> ⚔️</h1>
                    <p className="text-gray-400 mt-2">Solve industry-level problems and level up your engineering skills.</p>
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/5 font-bold uppercase text-[10px] tracking-widest text-gray-500">
                    <div className="px-4 py-2 border-r border-white/5 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div> SOLVED: {submittedTasks.length}
                    </div>
                    <div className="px-4 py-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div> PENDING: {tasks.length - submittedTasks.length}
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar: Task List */}
                <aside className="w-full lg:w-[380px] space-y-4">
                    {tasks.map((task) => {
                        const done = submittedTasks.includes(task._id);
                        return (
                            <button
                                key={task._id}
                                onClick={() => handleTaskSelect(task)}
                                className={`w-full text-left glass-card p-5 group flex items-start gap-4 transition-all duration-300 ${activeTask?._id === task._id ? 'border-primary-500/50 shadow-glow shadow-primary-500/10' : 'hover:border-white/10'}`}
                            >
                                <div className={`mt-1 p-2.5 rounded-xl border shrink-0 transition-colors ${done ? 'bg-green-500/10 border-green-500/20 text-green-500' : activeTask?._id === task._id ? 'bg-primary-500 text-white' : 'bg-white/5 border-white/5 text-gray-500 group-hover:text-primary-400'}`}>
                                    {done ? <CheckCircle2 className="w-5 h-5" /> : <ClipboardList className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="badge bg-white/5 text-gray-400 text-[9px] uppercase tracking-tighter font-black border border-white/5">{task.course}</span>
                                        <div className="flex gap-2">
                                            {task.deadline && (
                                                <span className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${new Date() > new Date(task.deadline) ? 'text-red-400' : 'text-primary-400'}`}>
                                                    <Clock className="w-2.5 h-2.5" />
                                                    {new Date(task.deadline).toLocaleDateString()}
                                                </span>
                                            )}
                                            {done && <span className="text-[10px] text-green-400 font-black uppercase">Completed</span>}
                                        </div>
                                    </div>
                                    <h3 className={`font-bold truncate ${activeTask?._id === task._id ? 'text-white text-lg' : 'text-gray-400 text-base group-hover:text-gray-200'}`}>{task.title}</h3>
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className="flex items-center gap-1 text-[10px] text-yellow-500 font-black uppercase"><Award className="w-3 h-3" /> {task.xpReward} XP</span>
                                        <span className="flex items-center gap-1 text-[10px] text-gray-600 font-black uppercase"><CheckCircle2 className="w-3 h-3 text-primary-400" /> Coding</span>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </aside>

                {/* Task Detail and Form */}
                <div className="flex-1">
                    {activeTask ? (
                        <motion.div
                            key={activeTask._id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-8"
                        >
                            <div className="glass-card p-10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <ClipboardList className="w-32 h-32" />
                                </div>
                                <div className="flex justify-between items-start relative z-10 mb-8">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-primary-500/20 text-green-500 border border-white/5">
                                        <Terminal className="w-8 h-8" />
                                    </div>
                                    <div className="flex gap-3">
                                        {activeTask.problemUrl && (
                                            <a href={activeTask.problemUrl} target="_blank" className="btn-secondary flex items-center gap-2 py-2 text-xs uppercase font-bold">
                                                Problem Link <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                        {activeTask.docUrl && (
                                            <a href={activeTask.docUrl} target="_blank" className="btn-secondary flex items-center gap-2 py-2 text-xs uppercase font-bold">
                                                Resources <FileText className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    {activeTask.deadline && (
                                        <div className={`mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-widest ${new Date() > new Date(activeTask.deadline) ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-primary-500/10 border-primary-500/20 text-primary-400'}`}>
                                            {new Date() > new Date(activeTask.deadline) ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                            {new Date() > new Date(activeTask.deadline) ? 'Overdue - Passed Deadline' : `Due by ${new Date(activeTask.deadline).toLocaleString()}`}
                                        </div>
                                    )}
                                    <h2 className="text-3xl font-black text-white mb-4">{activeTask.title}</h2>
                                    <p className="text-gray-400 leading-relaxed max-w-2xl">{activeTask.description}</p>
                                </div>
                            </div>

                            {/* Submission UI matching Reference 4 */}
                            <div className="glass-card p-10">
                                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                                    <h3 className="text-xl font-bold flex items-center gap-3">
                                        <Code className="w-6 h-6 text-primary-400" /> Submit Your Solution
                                    </h3>
                                    {isSubmitted && <span className="px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-black uppercase border border-green-500/30">Already Submitted ✅</span>}
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Solution Code</label>
                                        <textarea
                                            disabled={isSubmitted}
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className="code-textarea h-[300px]"
                                            placeholder="Paste your source code here (e.g. C++, Java, Python, JavaScript)..."
                                        ></textarea>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500">Live Preview Link (Optional)</label>
                                        <input
                                            disabled={isSubmitted}
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            className="input-field py-4"
                                            placeholder="e.g. GitHub URL, Netlify preview, or CodeSandbox link"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-500">File Attachment (Optional)</label>
                                        <input
                                            disabled={isSubmitted}
                                            type="file"
                                            onChange={handleFileUpload}
                                            className="input-field py-3 text-sm"
                                        />
                                        {file && <span className="text-xs text-green-400 font-bold ml-2">File Ready</span>}
                                    </div>

                                    <button
                                        disabled={loading || isSubmitted}
                                        className={`btn-primary w-full py-4 uppercase font-black tracking-widest flex items-center justify-center gap-3 transition-all ${isSubmitted ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                    >
                                        {loading ? 'Transmitting...' : isSubmitted ? 'Task Accomplished' : (
                                            <><Send className="w-5 h-5" /> Submit Work</>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-[500px] glass-card flex flex-col items-center justify-center border-dashed">
                            <Terminal className="w-16 h-16 text-gray-700 mb-4" />
                            <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">Awaiting active mission...</p>
                        </div>
                    )}
                </div>
            </div>
        </StudentLayout >
    );
}
