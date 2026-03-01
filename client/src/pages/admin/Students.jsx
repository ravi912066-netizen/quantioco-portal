import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Search, MoreVertical, Mail, Phone, Calendar, ArrowUpRight, Filter, Video, PlusCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../api/axios';

export default function Students() {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedCourseId, setSelectedCourseId] = useState('');

    const handle1on1Call = async (studentName) => {
        try {
            await API.post('/live-classes', { title: `1-on-1 Session with ${studentName}` });
            toast.success('Private room created! Redirecting...');
            navigate('/admin/live');
        } catch (err) {
            toast.error('Failed to create private room');
        }
    };

    const handleApprove = async (id) => {
        try {
            await API.put(`/users/${id}/approve`);
            setStudents(students.map(s => s._id === id ? { ...s, isApproved: true } : s));
            toast.success('Cadet Access Approved!');
        } catch (err) {
            toast.error('Approval failed');
        }
    };

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const [res, coursesRes] = await Promise.all([
                    API.get('/users/students'),
                    API.get('/courses')
                ]);
                setStudents(res.data);
                setCourses(coursesRes.data);
            } catch (err) {
                toast.error('Failed to load students');
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleManualEnroll = async (e) => {
        e.preventDefault();
        try {
            await API.post('/payments/enrollments/manual', {
                userId: selectedStudent._id,
                courseId: selectedCourseId
            });
            toast.success(`Student successfully enrolled!`);
            setShowEnrollModal(false);
            // Optionally refresh student data here
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to enroll student');
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white">Cadet Directory</h1>
                    <p className="text-gray-400 mt-1 uppercase text-xs tracking-widest font-bold opacity-60">Fleet Oversight / Students</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input className="input-field pl-10 h-10 w-64 text-sm" placeholder="Search cadets..." />
                    </div>
                    <button className="p-2 px-4 rounded-xl border border-white/5 bg-white/5 text-gray-400 hover:text-white transition-all flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10 uppercase font-bold text-[10px] text-gray-400 tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Full Name</th>
                                <th className="px-8 py-5">Contact Intel</th>
                                <th className="px-8 py-5">Battle XP</th>
                                <th className="px-8 py-5 text-center">Enrolled Date</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {students.map((s, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white">
                                                {s.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">{s.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Fleet Cadet</p>
                                                    {!s.isApproved && <span className="bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-yellow-500/30">Pending</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                <Mail className="w-3 h-3" /> {s.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Phone className="w-3 h-3" /> {s.phone || 'N/A'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black text-white">{s.xp} XP</span>
                                            <div className="flex items-center gap-0.5 text-green-400">
                                                <ArrowUpRight className="w-3 h-3" />
                                                <span className="text-[10px] font-bold">+12%</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(s.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {!s.isApproved ? (
                                                <button
                                                    onClick={() => handleApprove(s._id)}
                                                    className="px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest border border-green-500/30"
                                                >
                                                    Approve Access
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => { setSelectedStudent(s); setShowEnrollModal(true); }}
                                                        className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-all"
                                                        title="Enroll in Course"
                                                    >
                                                        <PlusCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handle1on1Call(s.name)}
                                                        className="p-2 bg-primary-500/10 text-primary-400 hover:bg-primary-500 hover:text-white rounded-lg transition-all"
                                                        title="Initiate 1-on-1 Video Call"
                                                    >
                                                        <Video className="w-5 h-5" />
                                                    </button>
                                                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Manual Enroll Modal */}
            {showEnrollModal && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-card-dark w-full max-w-md p-8"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Enroll Cadet</h2>
                            <button onClick={() => setShowEnrollModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">Select a course to manually enroll <strong className="text-white">{selectedStudent.name}</strong>.</p>

                        <form onSubmit={handleManualEnroll} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Select Course</label>
                                <select
                                    required
                                    className="input-field w-full appearance-none"
                                    value={selectedCourseId}
                                    onChange={(e) => setSelectedCourseId(e.target.value)}
                                >
                                    <option value="" disabled>-- Choose Course --</option>
                                    {courses.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="btn-primary w-full mt-4">Grant Access</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AdminLayout>
    );
}
