import React from 'react';
import { useData } from '../../../context/DataContext';
import { Clock, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

export const TaskBoard = ({ tasks, projects, onTaskClick }) => {
    const { updateTaskStatus } = useData();

    const columns = [
        { id: 'todo', title: 'À faire', color: 'bg-gray-500/20 text-gray-400 border-gray-500/20' },
        { id: 'in_progress', title: 'En cours', color: 'bg-blue-500/20 text-blue-400 border-blue-500/20' },
        { id: 'done', title: 'Terminé', color: 'bg-green-500/20 text-green-400 border-green-500/20' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-250px)] overflow-hidden">
            {columns.map(col => {
                const columnTasks = tasks.filter(t => t.status === col.id);

                return (
                    <div key={col.id} className="flex flex-col h-full bg-white/5 rounded-xl border border-white/5 overflow-hidden">
                        <div className={`px-4 py-3 border-b flex items-center justify-between ${col.color}`}>
                            <span className="font-semibold text-sm">{col.title}</span>
                            <span className="text-xs bg-black/50 px-2 py-0.5 rounded-full">{columnTasks.length}</span>
                        </div>

                        <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-hide">
                            {columnTasks.map(task => (
                                <motion.div 
                                    layoutId={`task-${task.id}`}
                                    key={task.id}
                                    onClick={() => onTaskClick?.(task)}
                                    className="bg-[#1a1a1a] p-4 rounded-lg border border-white/5 shadow-md cursor-pointer hover:border-white/20 transition-colors"
                                >
                                    <div className="flex justify-end items-start mb-2">
                                        {/* Simple action to move tasks for now */}
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                updateTaskStatus(task.id, col.id === 'todo' ? 'in_progress' : col.id === 'in_progress' ? 'done' : 'todo');
                                            }}
                                            className="text-gray-500 hover:text-white"
                                        >
                                            {col.id === 'done' ? <CheckCircle2 size={16} className="text-green-400" /> : <Circle size={16} />}
                                        </button>
                                    </div>
                                    <h4 className="text-sm font-medium text-white mb-2">{task.title}</h4>
                                    {task.description && (
                                        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="flex items-center gap-1"><Clock size={12}/> {task.due_date ? new Date(task.due_date).toLocaleDateString('fr-FR') : 'Pas de date'}</span>
                                        <span className={`px-2 py-0.5 rounded-full capitalize ${task.priority === 'high' ? 'bg-red-500/20 text-red-400' : task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                            {task.priority || 'medium'}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
