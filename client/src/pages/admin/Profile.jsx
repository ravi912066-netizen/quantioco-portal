import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Save, Key, Camera, Layout } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';

const PRESET_AVATARS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sheba',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jude',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily'
];

export default function AdminProfile() {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        avatar: user?.avatar || ''
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await API.put('/users/me', formData);
            updateUser(res.data);
            toast.success('Admin Profile Updated!');
        } catch (err) {
            toast.error('Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Command <span className="text-primary-500">Profile</span></h1>
                    <p className="text-gray-400 mt-2 text-xs font-bold uppercase tracking-widest opacity-60">System Administrator Identity</p>
                </div>
                <div className="badge bg-primary-600 text-white font-black text-[10px] uppercase tracking-widest px-6 py-2 shadow-glow">
                    Root Access Granted
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-10 space-y-8">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-2"><Layout className="w-4 h-4" /> Personal Information</h3>

                        <div className="space-y-4 mb-6">
                            <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest flex items-center gap-1.5"><Camera className="w-3 h-3" /> Select Profile Photo</label>
                            <div className="flex flex-wrap gap-4">
                                {PRESET_AVATARS.map((avatarUrl, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setFormData({ ...formData, avatar: avatarUrl })}
                                        className={`w-16 h-16 rounded-2xl p-1 overflow-hidden transition-all ${formData.avatar === avatarUrl ? 'border-2 border-primary-500 shadow-glow' : 'border border-white/10 opacity-50 hover:opacity-100'}`}
                                    >
                                        <div className="w-full h-full bg-dark-800 rounded-xl overflow-hidden">
                                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest flex items-center gap-1.5"><User className="w-3 h-3" /> Full Name</label>
                                <input className="input-field py-3.5 text-sm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email Address</label>
                                <input className="input-field py-3.5 text-sm opacity-50 bg-black/40" readOnly value={user?.email} />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest flex items-center gap-1.5"><Camera className="w-3 h-3" /> Custom Avatar URL</label>
                                <input className="input-field py-3.5 text-sm" value={formData.avatar} onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} />
                            </div>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="btn-primary px-12 uppercase font-black tracking-widest text-xs flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Update Identity'}
                        </button>
                    </div>

                    <div className="glass-card p-10 space-y-8 bg-red-500/5 border-red-500/10">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-400 mb-6 flex items-center gap-2"><Shield className="w-4 h-4" /> Security Terminal</h3>
                        <button className="btn-secondary border-red-500/20 text-red-400 hover:bg-red-500 flex items-center gap-2 px-8 uppercase font-black text-xs tracking-widest">
                            <Key className="w-4 h-4" /> Reset Master Password
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-10 flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-3xl p-1 animated-gradient mb-6 relative group">
                            <div className="w-full h-full bg-dark-900 rounded-[1.4rem] overflow-hidden flex items-center justify-center">
                                {formData.avatar ? (
                                    <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-gray-600" />
                                )}
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{formData.name}</h2>
                        <p className="text-primary-500 text-xs font-black uppercase tracking-[0.2em] mt-2 mb-6">Supreme Commander</p>

                        <div className="w-full h-px bg-white/5 my-6"></div>

                        <div className="w-full flex justify-between items-center text-left">
                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Status</span>
                            <span className="text-[10px] font-black uppercase text-green-400 tracking-widest px-3 py-1 bg-green-500/10 rounded-full">Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
