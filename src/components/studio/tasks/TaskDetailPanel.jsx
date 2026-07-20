import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, AlertCircle, Save, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useData } from '../../../context/DataContext';

export const TaskDetailPanel = ({ task, onClose }) => {
    const { updateTask, deleteTask } = useData();
    const [isEditing, setIsEditing] = useState(false);
    
    // Local state for edits
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('medium');
    const [status, setStatus] = useState('todo');

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setDueDate(task.due_date || '');
            setPriority(task.priority || 'medium');
            setStatus(task.status || 'todo');
            setIsEditing(false);
        }
    }, [task]);

    if (!task) return null;

    const handleSave = async () => {
        try {
            await updateTask(task.id, {
                title,
                description,
                due_date: dueDate || null,
                priority,
                status
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
            try {
                await deleteTask(task.id);
                onClose();
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    const toggleStatus = async () => {
        const newStatus = status === 'todo' ? 'in_progress' : status === 'in_progress' ? 'done' : 'todo';
        setStatus(newStatus);
        try {
            await updateTask(task.id, { status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex justify-end">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Panel */}
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-md h-full bg-[#0a0a0a] border-l border-white/10 shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={toggleStatus}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                {status === 'done' ? <CheckCircle2 size={24} className="text-green-500" /> : <Circle size={24} />}
                            </button>
                            <span className="text-xs font-mono uppercase tracking-widest text-mv-gold px-2 py-1 bg-mv-gold/10 rounded-full">
                                {status.replace('_', ' ')}
                            </span>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
                        {/* Title & Desc */}
                        <div className="space-y-4">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full bg-transparent text-2xl font-bold text-white placeholder-gray-600 focus:outline-none border-b border-white/20 pb-2 focus:border-mv-gold"
                                    placeholder="Titre de la tâche..."
                                />
                            ) : (
                                <h2 className="text-2xl font-bold text-white">{title}</h2>
                            )}

                            {isEditing ? (
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-mv-gold resize-none min-h-[120px]"
                                    placeholder="Ajouter une description..."
                                />
                            ) : (
                                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                                    {description || <span className="italic text-gray-600">Aucune description</span>}
                                </p>
                            )}
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Date */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 uppercase tracking-widest">
                                    <CalendarIcon size={14} /> Échéance
                                </div>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={e => setDueDate(e.target.value)}
                                        className="w-full bg-transparent text-white focus:outline-none text-sm"
                                    />
                                ) : (
                                    <div className="text-sm text-white font-medium">
                                        {dueDate ? new Date(dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Aucune'}
                                    </div>
                                )}
                            </div>

                            {/* Priority */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 uppercase tracking-widest">
                                    <AlertCircle size={14} /> Priorité
                                </div>
                                {isEditing ? (
                                    <select
                                        value={priority}
                                        onChange={e => setPriority(e.target.value)}
                                        className="w-full bg-transparent text-white focus:outline-none text-sm cursor-pointer"
                                    >
                                        <option value="low" className="bg-[#1a1a1a]">Basse</option>
                                        <option value="medium" className="bg-[#1a1a1a]">Moyenne</option>
                                        <option value="high" className="bg-[#1a1a1a]">Haute</option>
                                    </select>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${
                                            priority === 'high' ? 'bg-red-500' :
                                            priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                        }`} />
                                        <span className="text-sm text-white font-medium capitalize">{priority}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Created At Info */}
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock size={12} />
                            <span>Créée le {new Date(task.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-white/10 bg-black/20 flex justify-between items-center">
                        <button
                            onClick={handleDelete}
                            className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                            title="Supprimer la tâche"
                        >
                            <Trash2 size={18} />
                        </button>

                        {isEditing ? (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-sm text-white hover:bg-white/10 rounded-full transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-5 py-2 bg-mv-gold text-black text-sm font-bold rounded-full hover:bg-white transition-colors"
                                >
                                    <Save size={16} /> Enregistrer
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full transition-colors border border-white/10"
                            >
                                Modifier
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
