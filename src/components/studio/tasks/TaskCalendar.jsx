import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock } from 'lucide-react';

export const TaskCalendar = ({ tasks, projects, onTaskClick }) => {
    // This is a simple list view grouped by date for MVP. 
    // A real calendar grid would require a library like react-big-calendar or a custom grid.
    
    // Group tasks by due date
    const tasksByDate = tasks.reduce((acc, task) => {
        const dateStr = task.due_date ? task.due_date.split('T')[0] : 'Sans date';
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(task);
        return acc;
    }, {});

    // Sort dates (latest to earliest for MVP, or keep string sort)
    const sortedDates = Object.keys(tasksByDate).sort((a, b) => {
        if (a === 'Sans date') return 1;
        if (b === 'Sans date') return -1;
        return new Date(a) - new Date(b); // chronological
    });

    return (
        <div className="bg-white/5 rounded-xl border border-white/5 p-6 min-h-[500px]">
            <h3 className="text-lg font-medium text-white mb-6">Vue Calendrier (Échéances)</h3>
            
            <div className="space-y-8">
                {sortedDates.map(date => (
                    <div key={date} className="relative">
                        <div className="sticky top-0 bg-[#0f0f0f] py-2 z-10 flex items-center gap-4 mb-4">
                            <h4 className="text-mv-gold font-bold text-lg">
                                {date === 'Sans date' ? date : new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </h4>
                            <div className="h-px bg-white/10 flex-1"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-4">
                            {tasksByDate[date].map(task => (
                                <motion.div 
                                    layoutId={`cal-${task.id}`}
                                    key={task.id}
                                    onClick={() => onTaskClick?.(task)}
                                    className={`p-4 rounded-lg border cursor-pointer ${task.status === 'done' ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 bg-[#1a1a1a]'} hover:border-white/30 transition-colors`}
                                >
                                    <div className="flex justify-end items-start mb-2">
                                        {task.status === 'done' && <CheckCircle2 size={16} className="text-green-500" />}
                                    </div>
                                    <h5 className={`text-sm font-medium ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-white'}`}>
                                        {task.title}
                                    </h5>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
                
                {sortedDates.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                        Aucune tâche trouvée.
                    </div>
                )}
            </div>
        </div>
    );
};
