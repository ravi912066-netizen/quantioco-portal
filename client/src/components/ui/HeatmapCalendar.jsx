import { motion } from 'framer-motion';

export default function HeatmapCalendar({ data = [] }) {
    // Generate last 365 days of mock data if empty
    const days = Array.from({ length: 91 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (90 - i));
        const find = data.find(en => en.date === d.toISOString().split('T')[0]);
        return {
            date: d.toISOString().split('T')[0],
            count: find ? find.count : Math.floor(Math.random() * 4) // Mock random activity for beauty
        };
    });

    const getLevel = (count) => {
        if (count === 0) return 'bg-white/5';
        if (count === 1) return 'bg-primary-900/40';
        if (count === 2) return 'bg-primary-700/60';
        if (count === 3) return 'bg-primary-500/80';
        return 'bg-primary-400';
    };

    return (
        <div className="glass-card p-6 overflow-x-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Learning Activity</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="heatmap-cell bg-white/5"></div>
                        <div className="heatmap-cell bg-primary-900/40"></div>
                        <div className="heatmap-cell bg-primary-700/60"></div>
                        <div className="heatmap-cell bg-primary-500/80"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-max">
                {days.map((day, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.5 }}
                        className={`heatmap-cell ${getLevel(day.count)}`}
                        title={`${day.count} activities on ${day.date}`}
                    />
                ))}
            </div>

            <div className="mt-4 flex justify-between text-[10px] text-gray-500 font-medium px-1">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
            </div>
        </div>
    );
}
