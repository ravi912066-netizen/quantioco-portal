import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, UserX, Clock, Search, BookOpen, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

export default function EnrollmentRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await API.get('/payments/enrollments/pending');
                setRequests(res.data);
            } catch (err) {
                setRequests([
                    { _id: '1', user: { name: 'Hardik Manish Wahi', email: 'hardik@example.com' }, course: { name: 'DSA Mastery' }, amount: 499, status: 'Pending', createdAt: new Date() }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const handleAction = async (id, action) => {
        try {
            await API.post(`/payments/enrollments/${id}/${action}`);
            toast.success(`Request ${action === 'approve' ? 'Approved' : 'Rejected'}`);
            setRequests(requests.filter(r => r._id !== id));
        } catch (err) {
            toast.error('Operation failed');
        }
    };

    return (
        <AdminLayout>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Enrollment <span className="text-primary-500">Queue</span></h1>
                <p className="text-gray-400 mt-2 text-xs font-bold uppercase tracking-widest opacity-60">Manual Verification Center</p>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <tr>
                                <th className="px-8 py-5">Applicant</th>
                                <th className="px-8 py-5">Target Course</th>
                                <th className="px-8 py-5">Amount</th>
                                <th className="px-8 py-5 text-center">Submitted At</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {requests.length > 0 ? requests.map((r) => (
                                <tr key={r._id} className="hover:bg-white/5 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary-600/20 text-primary-400 flex items-center justify-center font-bold text-xs uppercase tracking-tighter">{r.user?.name?.charAt(0)}</div>
                                            <div>
                                                <p className="text-sm font-bold text-white uppercase tracking-tight">{r.user?.name}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{r.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-purple-400" />
                                            <span className="text-sm font-bold text-gray-300 uppercase tracking-tighter">{r.course?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-black text-white">₹{r.amount}</td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(r.createdAt).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleAction(r._id, 'approve')} className="p-2.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white transition-all">
                                                <UserCheck className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleAction(r._id, 'reject')} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                                                <UserX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <AlertCircle className="w-12 h-12 text-gray-700" />
                                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No pending enrollments in queue.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
