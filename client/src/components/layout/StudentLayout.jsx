import { motion } from 'framer-motion';
import StudentSidebar from './StudentSidebar';

export default function StudentLayout({ children }) {
    return (
        <div className="flex bg-dark-900 min-h-screen">
            <StudentSidebar />
            <main className="flex-1 overflow-y-auto h-screen p-8">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="max-w-7xl mx-auto"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
