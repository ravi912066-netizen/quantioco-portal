import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    User, Mail, Building, Send, Save, Download,
    Share2, ShieldCheck, Zap, Target, Flame, GraduationCap, Github, Twitter
} from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';

const PRESET_AVATARS = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sheba',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jude',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max'
];

export default function StudentProfile() {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        institution: user?.institution || '',
        cfHandle: user?.cfHandle || '',
        discordHandle: user?.discordHandle || '',
        avatar: user?.avatar || ''
    });

    const cardRef = useRef(null);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await API.put('/users/me', formData);
            updateUser(res.data);
            toast.success('Battle Profile Updated! 🛡️');
        } catch (err) {
            toast.error('Update failed');
        } finally {
            setLoading(false);
        }
    };

    const downloadCard = async () => {
        if (!cardRef.current) return;
        const canvas = await html2canvas(cardRef.current, {
            backgroundColor: null,
            scale: 2
        });
        const link = document.createElement('a');
        link.download = `${user?.name || 'cadet'}_profile_card.png`;
        link.href = canvas.toDataURL();
        link.click();
        toast.success('Elite Card Downloaded! 🎴');
    };

    return (
        <StudentLayout>
            <div className="flex flex-col lg:flex-row gap-12 items-start mb-20">
                {/* Profile Settings */}
                <div className="flex-1 space-y-8">
                    <div className="mb-4">
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Cadet <span className="gradient-text">Configuration</span> ⚙️</h1>
                        <p className="text-gray-500 mt-2 font-medium">Customize your digital presence in the Quantioco ecosystem.</p>
                    </div>

                    <div className="glass-card p-10 space-y-8">
                        <div className="space-y-4 mb-6">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-1.5"><User className="w-3 h-3" /> Select Profile Avatar</label>
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
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-1.5"><User className="w-3 h-3" /> Full Name</label>
                                <input className="input-field py-3.5 text-sm" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2 opacity-50 cursor-not-allowed">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email Address</label>
                                <input readOnly className="input-field py-3.5 text-sm bg-black/20" value={formData.email} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-1.5"><Building className="w-3 h-3" /> Educational Institution</label>
                                <input className="input-field py-3.5 text-sm" placeholder="e.g. Stanford University" value={formData.institution} onChange={(e) => setFormData({ ...formData, institution: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Codeforces Handle</label>
                                <input className="input-field py-3.5 text-sm" placeholder="e.g. tourister" value={formData.cfHandle} onChange={(e) => setFormData({ ...formData, cfHandle: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-1.5"><Send className="w-3 h-3" /> Discord Identifier</label>
                                <input className="input-field py-3.5 text-sm" placeholder="e.g. alex#1234" value={formData.discordHandle} onChange={(e) => setFormData({ ...formData, discordHandle: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-1.5"><User className="w-3 h-3" /> Profile Avatar URL</label>
                                <input className="input-field py-3.5 text-sm" placeholder="https://..." value={formData.avatar} onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} />
                            </div>
                        </div>
                        <div className="flex pt-6">
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="btn-primary w-full md:w-auto px-12 uppercase font-black tracking-widest text-xs flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" /> {loading ? 'Compiling Changes...' : 'Save Configuration'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Share Card & Preview */}
                <div className="w-full lg:w-[420px] space-y-8 sticky top-8">
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <Share2 className="w-6 h-6 text-primary-500" /> Digital <span className="gradient-text">License</span>
                    </h3>

                    {/* Progress Card Component */}
                    <div
                        ref={cardRef}
                        className="relative overflow-hidden rounded-[40px] p-1 animated-gradient shadow-2xl shadow-primary-500/20"
                        style={{ width: '380px', height: '520px' }}
                    >
                        <div className="w-full h-full bg-[#0a0a15] rounded-[39px] p-8 flex flex-col relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl opacity-40"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl opacity-30"></div>
                            <div className="absolute top-[20%] right-[-10%] opacity-5">
                                <ShieldCheck className="w-64 h-64" />
                            </div>

                            {/* Top Badge */}
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                        <GraduationCap className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white italic tracking-tighter uppercase opacity-60">QuantioCo</p>
                                        <p className="text-[12px] font-black text-primary-400 uppercase tracking-widest leading-none">Elite Cadet</p>
                                    </div>
                                </div>
                                <div className="badge bg-green-500 text-black font-black text-[8px] uppercase tracking-widest px-3 py-1 scale-110">
                                    LVL {Math.floor(user?.xp / 100) || 1}
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex flex-col items-center mb-10 relative z-10">
                                <div className="w-32 h-32 rounded-[2.5rem] p-1.5 animated-gradient mb-4 shadow-glow shadow-primary-500/30">
                                    <div className="w-full h-full rounded-[2.2rem] bg-dark-900 border-4 border-dark-900 overflow-hidden">
                                        {user?.avatar ? (
                                            <img src={user.avatar} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-black text-4xl text-white uppercase">{user?.name?.charAt(0)}</div>
                                        )}
                                    </div>
                                </div>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter text-center">{user?.name}</h4>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{user?.institution || 'Quantioco Engineering Fleet'}</p>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <div className="flex items-center gap-2 text-yellow-500 mb-1">
                                        <Zap className="w-4 h-4 fill-current" />
                                        <span className="text-[9px] font-black uppercase">Battle XP</span>
                                    </div>
                                    <p className="text-xl font-black text-white">{user?.xp || 0}</p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <div className="flex items-center gap-2 text-primary-400 mb-1">
                                        <Target className="w-4 h-4" />
                                        <span className="text-[9px] font-black uppercase">Solved Items</span>
                                    </div>
                                    <p className="text-xl font-black text-white">{user?.problemsSolved || 156}</p>
                                </div>
                                <div className="col-span-2 bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                            <Flame className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-black uppercase text-gray-500 leading-none">Activity Streak</span>
                                            <p className="text-lg font-black text-white">{user?.streak || 15} Days</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[9px] font-black uppercase text-gray-500 block leading-none mb-1">Status</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-green-400 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">Active</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer metadata */}
                            <div className="mt-auto flex justify-between items-end border-t border-white/5 pt-6 opacity-30">
                                <div className="flex gap-3">
                                    <Github className="w-4 h-4 text-white" />
                                    <Twitter className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-white uppercase tracking-widest">Verify ID</p>
                                    <p className="text-[8px] font-medium text-gray-600">QNT-LICENSE-88392-A</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={downloadCard}
                            className="btn-primary flex-1 flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest"
                        >
                            <Download className="w-4 h-4" /> Download card
                        </button>
                        <button className="btn-secondary flex-1 flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-widest">
                            <Share2 className="w-4 h-4" /> Share link
                        </button>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}
