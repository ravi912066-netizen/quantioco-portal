import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, FileText, ChevronRight, Lock,
    CheckCircle2, Clock, Share2, MessageSquare, Plus, Video, Code, Award, QrCode, Trash2, Edit2, ExternalLink
} from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function CourseDetail() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [activeLecture, setActiveLecture] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [submittedTasks, setSubmittedTasks] = useState([]);
    const [showDoubtModal, setShowDoubtModal] = useState(false);
    const [doubtText, setDoubtText] = useState('');
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrollmentRequested, setEnrollmentRequested] = useState(false);
    const [activeTab, setActiveTab] = useState('Overview');

    // Admin specific modala state
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [activeTargetLectureId, setActiveTargetLectureId] = useState(null); // For connecting assignment to lecture
    const [showLectureModal, setShowLectureModal] = useState(false);
    const [lectureForm, setLectureForm] = useState({ title: '', videoUrl: '', duration: '' });
    const [assignmentForm, setAssignmentForm] = useState({ title: '', description: '', xpReward: 20, deadline: '', problemUrl: '' });

    const { user, updateUser } = useAuth();

    const fetchCourseData = async () => {
        try {
            const [courseRes, assignRes, subRes] = await Promise.all([
                API.get(`/courses/${id}`),
                API.get('/assignments'),
                user?.role === 'student' ? API.get('/assignments/submissions/me') : { data: [] }
            ]);
            const cData = courseRes.data;
            setCourse(cData);

            // Filter assignments for this course by course name or ID
            setAssignments(assignRes.data.filter(a => a.course === cData.name || a.course === cData._id));
            setSubmittedTasks(subRes.data.map(s => s.assignment?._id));

            if (user?.role === 'admin' || user?.enrolledCourses?.includes(cData._id)) {
                setIsEnrolled(true);
                if (cData.lectures?.length > 0 && !activeLecture) {
                    setActiveLecture(cData.lectures[0]);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user) fetchCourseData();
    }, [id, user]);

    const handleAskDoubt = async () => {
        try {
            await API.post('/doubts', { question: doubtText, course: course.name });
            toast.success('Your doubt has been submitted to mentors!');
            setShowDoubtModal(false);
            setDoubtText('');
        } catch (err) {
            toast.error('Failed to submit doubt');
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...assignmentForm,
                course: course.name,
                lectureId: activeTargetLectureId || null
            };
            const res = await API.post('/assignments', payload);
            setAssignments([res.data, ...assignments]);
            toast.success('Assignment created successfully!');
            setShowAssignmentModal(false);
            setActiveTargetLectureId(null);
            setAssignmentForm({ title: '', description: '', xpReward: 20, deadline: '', problemUrl: '' });
        } catch (err) {
            toast.error('Failed to create assignment');
        }
    };

    const handleCreateLecture = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/courses/${course._id}/lectures`, lectureForm);
            fetchCourseData();
            toast.success('Lecture added!');
            setShowLectureModal(false);
            setLectureForm({ title: '', videoUrl: '', duration: '' });
        } catch (err) {
            toast.error('Failed to add lecture');
        }
    };

    const handleDeleteLecture = async (lectureId) => {
        if (!window.confirm('Are you sure you want to delete this lecture?')) return;
        try {
            await API.delete(`/courses/${course._id}/lectures/${lectureId}`);
            fetchCourseData();
            if (activeLecture?._id === lectureId) setActiveLecture(null);
            toast.success('Lecture removed');
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const handleUpiPayment = async () => {
        try {
            await API.post('/payments/enroll', { courseId: course._id, amount: course.price });
            setIsEnrolled(true);
            toast.success('Payment received! Course unlocked instantly. 🚀');
            if (course.lectures?.length > 0) setActiveLecture(course.lectures[0]);
            updateUser({ ...user, enrolledCourses: [...(user.enrolledCourses || []), course._id] });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Payment initiation failed');
        }
    };

    const handleFreeEnrollment = async () => {
        try {
            await API.post(`/courses/${course._id}/enroll`);
            setIsEnrolled(true);
            toast.success('Course unlocked instantly for free!');
            if (course.lectures?.length > 0) setActiveLecture(course.lectures[0]);
            updateUser({ ...user, enrolledCourses: [...(user.enrolledCourses || []), course._id] });
        } catch (err) {
            toast.error('Failed to enroll');
        }
    };

    const openAssignmentModalForLecture = (lectureId) => {
        setActiveTargetLectureId(lectureId);
        setShowAssignmentModal(true);
    };

    if (!course) return <div className="min-h-screen bg-dark-900 flex items-center justify-center"><div className="skeleton w-64 h-64"></div></div>;

    // Payment Required View
    if (!isEnrolled && user?.role !== 'admin') {
        const upiId = "7379078059@ybl";
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${upiId}&pn=Ravi%20Yadav&am=${course.price}&cu=INR`;

        return (
            <StudentLayout>
                <div className="max-w-2xl mx-auto mt-10">
                    <div className="glass-card p-10 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>

                        <div className="mb-8">
                            <span className="badge bg-primary-500/20 text-primary-400 font-black uppercase tracking-widest text-[10px] mb-4 border border-primary-500/30">Restricted Access</span>
                            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">{course.name}</h1>
                            <p className="text-gray-400">Unlock full access to lectures, assignments, and mentorship.</p>
                        </div>

                        {enrollmentRequested ? (
                            <div className="bg-green-500/10 border-2 border-green-500/30 p-8 rounded-3xl mb-8 flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Request Transmitted!</h3>
                                <p className="text-gray-400 text-sm">Waiting for Admin to verify your UPI payment and grant access.</p>
                            </div>
                        ) : course.price === 0 || !course.price ? (
                            <div className="bg-primary-500/10 border border-primary-500/30 p-8 rounded-3xl mb-8 flex flex-col items-center">
                                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">100% Free Access</h3>
                                <p className="text-gray-400 text-sm mb-6">This course is currently available for free. Jump right in!</p>
                                <button onClick={handleFreeEnrollment} className="btn-primary w-full h-14 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-[0.2em] shadow-glow">
                                    Start Learning Now <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="bg-black/40 border border-white/5 p-8 rounded-3xl mb-8 flex flex-col items-center">
                                <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                                    <QrCode className="w-5 h-5 text-primary-400" /> UPI Payment Processing
                                </h3>
                                <div className="p-4 bg-white rounded-2xl mb-6 shadow-glow shadow-primary-500/20">
                                    <img src={qrUrl} alt="UPI QR Code" className="w-48 h-48" />
                                </div>
                                <div className="text-center mb-6">
                                    <p className="text-xl font-black text-white mb-1">₹{course.price}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Scan with GPay/PhonePe to pay</p>
                                </div>
                                <button onClick={handleUpiPayment} className="btn-primary w-full h-14 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-[0.2em]">
                                    I Have Paid via UPI <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <div className="grid grid-cols-3 gap-4 text-left border-t border-white/5 pt-8">
                            <div className="space-y-1">
                                <div className="text-primary-400"><Play className="w-4 h-4" /></div>
                                <p className="text-xs font-bold text-white uppercase">HD Lectures</p>
                                <p className="text-[10px] text-gray-500">Full access to curriculum</p>
                            </div>
                            <div className="space-y-1">
                                <div className="text-purple-400"><Code className="w-4 h-4" /></div>
                                <p className="text-xs font-bold text-white uppercase">Assignments</p>
                                <p className="text-[10px] text-gray-500">Live code submissions</p>
                            </div>
                            <div className="space-y-1">
                                <div className="text-yellow-400"><Award className="w-4 h-4" /></div>
                                <p className="text-xs font-bold text-white uppercase">Certification</p>
                                <p className="text-[10px] text-gray-500">Upon completion</p>
                            </div>
                        </div>
                    </div>
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout>
            <div className="flex flex-col gap-6">

                {/* Header Information */}
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{course.name}</h1>
                    <p className="text-gray-400 text-sm max-w-3xl">{course.description}</p>
                </div>

                {/* Main Navigation Tabs */}
                <div className="flex gap-2 border-b border-white/5 pb-1 overflow-x-auto">
                    {['Overview', 'Lectures', 'Assignments', 'Quizzes', 'Contests', 'Community'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap rounded-t-lg ${activeTab === tab ? 'bg-primary-500/10 text-primary-400 border-b-2 border-primary-500' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div>
                    {activeTab === 'Overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 glass-card p-8">
                                <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Course Briefing</h2>
                                <p className="text-gray-400 leading-relaxed text-sm mb-6">{course.description}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-dark-800 border border-white/5 p-4 rounded-xl">
                                        <div className="text-primary-400 mb-2"><Play className="w-5 h-5" /></div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Lectures</p>
                                        <p className="text-lg font-black text-white">{course.lectures?.length || 0}</p>
                                    </div>
                                    <div className="bg-dark-800 border border-white/5 p-4 rounded-xl">
                                        <div className="text-purple-400 mb-2"><Code className="w-5 h-5" /></div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Assignments</p>
                                        <p className="text-lg font-black text-white">{assignments.length}</p>
                                    </div>
                                    <div className="bg-dark-800 border border-white/5 p-4 rounded-xl">
                                        <div className="text-yellow-400 mb-2"><Award className="w-5 h-5" /></div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">XP Bounty</p>
                                        <p className="text-lg font-black text-white">{assignments.reduce((sum, a) => sum + (a.xpReward || 0), 0)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-1 space-y-6">
                                <div className="glass-card p-6 border-white/5">
                                    <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">Instructor Info</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center font-bold text-primary-400 border border-primary-500/30">
                                            {course.instructor?.charAt(0) || 'I'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{course.instructor || 'Lead Instructor'}</p>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest">Master Engineer</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Lectures' && (
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="lg:w-1/3 space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Curriculum ({course.lectures?.length || 0})</h3>
                                    {user?.role === 'admin' && (
                                        <button onClick={() => setShowLectureModal(true)} className="btn-secondary text-[10px] py-1 px-3">
                                            + Add Lecture
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[700px] overflow-y-auto space-y-2 pr-2">
                                    {course.lectures?.map((lecture, i) => {
                                        const lectureAssignments = assignments.filter(a => a.lectureId === lecture._id);
                                        return (
                                            <div key={lecture._id} className={`glass-card overflow-hidden border transition-all ${activeLecture?._id === lecture._id ? 'border-primary-500 shadow-glow shadow-primary-500/10' : 'border-white/5 hover:border-white/20'}`}>
                                                <div className="p-4 cursor-pointer" onClick={() => setActiveLecture(lecture)}>
                                                    <div className="flex items-start gap-4">
                                                        <div className={`mt-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 ${activeLecture?._id === lecture._id ? 'border-primary-500 text-primary-400 bg-primary-500/10' : 'border-gray-700 text-gray-500'}`}>
                                                            <span className="text-[10px] font-bold">{i + 1}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm font-bold truncate leading-tight mb-1 ${activeLecture?._id === lecture._id ? 'text-primary-400' : 'text-gray-300'}`}>
                                                                {lecture.title}
                                                            </p>
                                                            <div className="flex items-center gap-3 text-[10px] uppercase font-bold text-gray-500">
                                                                <span className="flex items-center gap-1"><Play className="w-3 h-3 text-primary-400/70" /> {lecture.duration || 'Video'}</span>
                                                                {lectureAssignments.length > 0 && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span className="flex items-center gap-1"><Code className="w-3 h-3 text-purple-400/70" /> {lectureAssignments.length} Tasks</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {user?.role === 'admin' && (
                                                            <div className="flex gap-1 ml-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteLecture(lecture._id); }} className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"><Trash2 className="w-3 h-3" /></button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {(!course.lectures || course.lectures.length === 0) && (
                                        <div className="p-8 text-center glass-card border-dashed">
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">No lectures deployed yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="lg:w-2/3 flex flex-col gap-6">
                                {activeLecture ? (
                                    <>
                                        <div className="glass-card overflow-hidden bg-black border-white/5 relative aspect-video">
                                            {activeLecture.videoUrl ? (
                                                <iframe
                                                    className="w-full h-full"
                                                    src={activeLecture.videoUrl.replace('watch?v=', 'embed/')}
                                                    title="video player"
                                                    allowFullScreen></iframe>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Waiting for Content Stream...</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Lecture Specific Assignments */}
                                        <div className="glass-card p-6 border-white/5">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-lg font-black text-white uppercase tracking-tighter">Mission Objectives</h3>
                                                {user?.role === 'admin' && (
                                                    <button onClick={() => openAssignmentModalForLecture(activeLecture._id)} className="btn-primary text-[10px] py-1.5 px-3 flex items-center gap-1">
                                                        <Plus className="w-3 h-3" /> Drop Assignment
                                                    </button>
                                                )}
                                            </div>

                                            <div className="space-y-3">
                                                {assignments.filter(a => a.lectureId === activeLecture._id).map((a, idx) => (
                                                    <div key={a._id} className="p-4 bg-dark-800 border border-white/5 rounded-xl flex justify-between items-center group">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-black text-xs border border-purple-500/20">
                                                                {idx + 1}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-white font-bold text-sm">{a.title}</h4>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">{a.xpReward} XP Reward</span>
                                                                    {submittedTasks.includes(a._id) && (
                                                                        <span className="text-[10px] text-green-400 font-black tracking-widest uppercase bg-green-500/20 px-2 py-0.5 rounded border border-green-500/30">Submitted</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <a href="/assignments" className="badge bg-primary-500 text-white font-black uppercase tracking-widest hover:scale-105 transition-transform text-[10px]">
                                                                {submittedTasks.includes(a._id) ? 'View Lab' : 'Start Task'}
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                                {assignments.filter(a => a.lectureId === activeLecture._id).length === 0 && (
                                                    <div className="p-6 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">No mandatory tasks for this lecture.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="glass-card p-12 text-center h-[500px] flex flex-col items-center justify-center">
                                        <Play className="w-16 h-16 text-gray-700 mb-4" />
                                        <h3 className="text-xl font-bold text-gray-400 mb-2">No Active Lecture</h3>
                                        <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Select a lecture from the curriculum to begin</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Assignments' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                <div>
                                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">All Course Assignments</h2>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Global view of all pending and completed missions</p>
                                </div>
                                {user?.role === 'admin' && (
                                    <button onClick={() => { setActiveTargetLectureId(null); setShowAssignmentModal(true); }} className="btn-primary text-xs flex items-center gap-2">
                                        <Plus className="w-4 h-4" /> Global Assignment
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {assignments.map(a => {
                                    const linkedLec = course.lectures?.find(l => l._id === a.lectureId);
                                    return (
                                        <div key={a._id} className="glass-card p-6 flex flex-col group hover:border-primary-500/30 transition-all border-white/5 bg-dark-800">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                                                    <Code className="w-5 h-5" />
                                                </div>
                                                {submittedTasks.includes(a._id) && (
                                                    <span className="text-[10px] text-green-400 font-black tracking-widest uppercase bg-green-500/10 px-2 py-1 rounded border border-green-500/20"><CheckCircle2 className="w-3 h-3 inline mr-1" /> Done</span>
                                                )}
                                            </div>
                                            <h4 className="text-lg font-bold text-white mb-2 leading-tight">{a.title}</h4>

                                            {linkedLec && (
                                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-1 opacity-80">
                                                    <Video className="w-3 h-3" /> {linkedLec.title.slice(0, 25)}...
                                                </p>
                                            )}
                                            {!linkedLec && (
                                                <p className="text-[10px] text-primary-400 uppercase tracking-widest font-bold mb-4 flex items-center gap-1 opacity-80">
                                                    General Course Task
                                                </p>
                                            )}

                                            <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-xs text-yellow-500 font-black uppercase tracking-widest">{a.xpReward} XP</span>
                                                <a href="/assignments" className="text-xs font-bold text-primary-400 hover:text-primary-300 uppercase tracking-widest flex items-center gap-1">
                                                    Open Lab <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                                {assignments.length === 0 && (
                                    <div className="md:col-span-2 lg:col-span-3 py-16 text-center glass-card border-dashed bg-white/5">
                                        <Code className="w-12 h-12 mx-auto mb-4 opacity-50 text-gray-500" />
                                        <p className="font-bold uppercase tracking-widest text-xs text-gray-500">No active assignments discovered.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Quizzes' && (
                        <div className="py-16 text-center flex flex-col items-center justify-center glass-card border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all duration-700"></div>
                            <CheckCircle2 className="w-16 h-16 text-green-500 mb-6 relative z-10 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 relative z-10">Module Quizzes</h3>
                            <p className="text-gray-400 text-sm max-w-md mb-8 relative z-10">Test your knowledge with rapid-fire questions, secure bonus XP, and check your retention.</p>
                            <button className="bg-green-500 hover:bg-green-400 text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm shadow-glow shadow-green-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 relative z-10">
                                Start Next Quiz <Play className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {activeTab === 'Contests' && (
                        <div className="py-16 text-center flex flex-col items-center justify-center glass-card border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all duration-700"></div>
                            <Award className="w-16 h-16 text-yellow-500 mb-6 relative z-10 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 relative z-10">Combat Contests</h3>
                            <p className="text-gray-400 text-sm max-w-md mb-8 relative z-10">Compete globally against other cadets, earn rank points, and dominate the leaderboard.</p>
                            <a href="/contests" className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-xl font-black uppercase tracking-widest text-sm shadow-glow shadow-yellow-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 relative z-10">
                                View Battlegrounds <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>
                    )}

                    {activeTab === 'Community' && (
                        <div className="glass-card p-6 border-white/5 text-center py-20 bg-dark-800">
                            <MessageSquare className="w-12 h-12 text-primary-500 mx-auto mb-6 opacity-80" />
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Mentorship Network</h3>
                            <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">Discuss topics with enrolled cadets, clear doubts, and collaborate on projects.</p>
                            <button onClick={() => setShowDoubtModal(true)} className="btn-primary flex items-center gap-2 mx-auto">
                                <Plus className="w-4 h-4" /> Create Post
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showDoubtModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card-dark w-full max-w-lg p-8 relative">
                            <button onClick={() => setShowDoubtModal(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"><Plus className="w-5 h-5 rotate-45" /></button>
                            <h2 className="text-xl font-black uppercase tracking-tighter mb-2 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-primary-400" /> Ask mentors a doubt</h2>
                            <p className="text-gray-500 text-xs mb-6 uppercase tracking-widest font-bold">You will receive an answer within 4 hours.</p>
                            <textarea
                                className="input-field min-h-[150px] mb-6 text-sm"
                                placeholder="Describe your issue in detail..."
                                onChange={(e) => setDoubtText(e.target.value)}
                            ></textarea>
                            <button onClick={handleAskDoubt} className="btn-primary w-full">Send Doubt</button>
                        </motion.div>
                    </div>
                )}

                {showLectureModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card-dark w-full max-w-lg p-8 relative">
                            <button onClick={() => setShowLectureModal(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"><Plus className="w-5 h-5 rotate-45" /></button>
                            <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2"><Video className="w-5 h-5 text-primary-400" /> Deploy Lecture</h2>
                            <form onSubmit={handleCreateLecture} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Lecture Title</label>
                                    <input required className="input-field w-full text-sm" value={lectureForm.title} onChange={e => setLectureForm({ ...lectureForm, title: e.target.value })} placeholder="e.g. Arrays and Hashing" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">YouTube Video URL</label>
                                    <input required className="input-field w-full text-sm" value={lectureForm.videoUrl} onChange={e => setLectureForm({ ...lectureForm, videoUrl: e.target.value })} placeholder="e.g. https://www.youtube.com/watch?v=..." />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Duration</label>
                                    <input required className="input-field w-full text-sm" value={lectureForm.duration} onChange={e => setLectureForm({ ...lectureForm, duration: e.target.value })} placeholder="e.g. 45:00" />
                                </div>
                                <button type="submit" className="btn-primary w-full mt-4 py-3">Deploy Lecture</button>
                            </form>
                        </motion.div>
                    </div>
                )}

                {showAssignmentModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm shadow-2xl">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="glass-card-dark w-full max-w-lg p-8 relative">
                            <button onClick={() => setShowAssignmentModal(false)} className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"><Plus className="w-5 h-5 rotate-45" /></button>
                            <h2 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                                <Code className="w-5 h-5 text-primary-500" />
                                {activeTargetLectureId ? 'Module Assignment' : 'Course Assignment'}
                            </h2>
                            <form onSubmit={handleCreateAssignment} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Title</label>
                                    <input required className="input-field w-full" value={assignmentForm.title} onChange={e => setAssignmentForm({ ...assignmentForm, title: e.target.value })} placeholder="Mastering DFS" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
                                    <textarea required className="input-field w-full min-h-[100px]" value={assignmentForm.description} onChange={e => setAssignmentForm({ ...assignmentForm, description: e.target.value })}></textarea>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Problem Link (Optional)</label>
                                    <input className="input-field w-full" placeholder="e.g., LeetCode URL" value={assignmentForm.problemUrl} onChange={e => setAssignmentForm({ ...assignmentForm, problemUrl: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">XP Reward</label>
                                        <input type="number" required className="input-field w-full" value={assignmentForm.xpReward} onChange={e => setAssignmentForm({ ...assignmentForm, xpReward: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Deadline</label>
                                        <input type="date" required className="input-field w-full" value={assignmentForm.deadline} onChange={e => setAssignmentForm({ ...assignmentForm, deadline: e.target.value })} />
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary w-full mt-4">Publish Target</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </StudentLayout>
    );
}
