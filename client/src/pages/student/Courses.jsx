import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, PlayCircle, BookOpen, Clock, Star, Zap } from 'lucide-react';
import StudentLayout from '../../components/layout/StudentLayout';
import API from '../../api/axios';
import { Link } from 'react-router-dom';

export default function StudentCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await API.get('/courses');
                setCourses(res.data);
            } catch (err) {
                // Fallback for demo
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <StudentLayout>
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tighter">Explore <span className="gradient-text">Mastery</span> 🚀</h1>
                    <p className="text-gray-400 mt-2">Pick your next skill and start your journey towards excellence.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input className="input-field pl-10 h-10 w-64 text-sm" placeholder="Search domains..." />
                    </div>
                    <button className="p-2 px-4 rounded-xl border border-white/5 bg-white/5 text-gray-400 hover:text-white transition-all flex items-center gap-2 text-sm">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <div key={i} className="h-80 skeleton"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <motion.div
                            layout
                            key={course._id}
                            whileHover={{ y: -10 }}
                            className="glass-card group overflow-hidden border-transparent hover:border-primary-500/30 transition-all"
                        >
                            <div className="h-44 relative overflow-hidden">
                                <img
                                    src={course.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="badge bg-black/60 backdrop-blur-md text-[10px] uppercase font-black text-primary-400 border border-primary-500/20 px-3">
                                        {course.category}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <Link to={`/courses/${course._id}`} className="flex-1 text-center bg-white text-black py-2 rounded-lg font-bold text-xs uppercase cursor-pointer hover:bg-primary-500 hover:text-white transition-all">
                                        Enroll Now
                                    </Link>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 rounded-full border border-dark-900 bg-primary-600 flex items-center justify-center text-[8px] text-white">S</div>)}
                                    </div>
                                    <span>+124 Students enrolled</span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors line-clamp-1">{course.name}</h3>

                                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <PlayCircle className="w-4 h-4 text-primary-500" />
                                        <span>12 Lectures</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Clock className="w-4 h-4 text-purple-500" />
                                        <span>24 Hours</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-yellow-500 font-bold ml-auto">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        <span>4.8</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </StudentLayout>
    );
}
