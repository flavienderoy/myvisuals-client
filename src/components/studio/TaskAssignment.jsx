import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { UserCheck, Calendar, AlertCircle, Plus } from 'lucide-react';
import { TASK_PRIORITY, TASK_STATUS } from '../../constants';

export const TaskAssignment = ({ projectId, assetId, onClose }) => {
    const { createTask, tasks, currentUser } = useData();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedTo: '',
        deadline: '',
        priority: TASK_PRIORITY.MEDIUM,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        createTask({
            ...formData,
            projectId,
            assetId,
        });

        onClose();
    };

    const priorityColors = {
        [TASK_PRIORITY.LOW]: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
        [TASK_PRIORITY.MEDIUM]: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        [TASK_PRIORITY.HIGH]: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        [TASK_PRIORITY.URGENT]: 'bg-red-500/10 text-red-400 border-red-500/30',
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Assigner une Tâche">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Titre de la tâche *
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: Retoucher l'exposition"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold transition-colors"
                        required
                        autoFocus
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Détails de la tâche..."
                        rows={3}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold transition-colors resize-none"
                    />
                </div>

                {/* Assigned To */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Assigner à *
                    </label>
                    <input
                        type="text"
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        placeholder="Nom de l'utilisateur"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold transition-colors"
                        required
                    />
                </div>

                {/* Priority & Deadline */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Priorité
                        </label>
                        <select
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-mv-gold transition-colors"
                        >
                            <option value={TASK_PRIORITY.LOW}>Basse</option>
                            <option value={TASK_PRIORITY.MEDIUM}>Moyenne</option>
                            <option value={TASK_PRIORITY.HIGH}>Haute</option>
                            <option value={TASK_PRIORITY.URGENT}>Urgente</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Deadline
                        </label>
                        <input
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-mv-gold transition-colors"
                        />
                    </div>
                </div>

                {/* Priority Preview */}
                <div className={`p-3 rounded-lg border ${priorityColors[formData.priority]}`}>
                    <div className="flex items-center gap-2">
                        <AlertCircle size={16} />
                        <span className="text-sm font-medium">
                            Priorité: {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-mv-gold hover:bg-white text-black font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                        <UserCheck size={16} />
                        Assigner
                    </button>
                </div>
            </form>
        </Modal>
    );
};

// Task List Component
export const TaskList = ({ projectId }) => {
    const { tasks, updateTaskStatus } = useData();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const projectTasks = tasks.filter(t => t.projectId === projectId);

    const statusColors = {
        [TASK_STATUS.PENDING]: 'bg-gray-500/10 text-gray-400',
        [TASK_STATUS.IN_PROGRESS]: 'bg-blue-500/10 text-blue-400',
        [TASK_STATUS.COMPLETED]: 'bg-green-500/10 text-green-400',
        [TASK_STATUS.CANCELLED]: 'bg-red-500/10 text-red-400',
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Tâches ({projectTasks.length})</h3>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-sm text-mv-gold hover:text-white transition-colors flex items-center gap-1"
                >
                    <Plus size={14} />
                    Nouvelle tâche
                </button>
            </div>

            {projectTasks.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucune tâche</p>
            ) : (
                <div className="space-y-2">
                    {projectTasks.map(task => (
                        <div key={task.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="text-white text-sm font-medium">{task.title}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[task.status]}`}>
                                    {task.status}
                                </span>
                            </div>
                            {task.description && (
                                <p className="text-gray-400 text-xs mb-2">{task.description}</p>
                            )}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span>→ {task.assignedTo}</span>
                                {task.deadline && (
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(task.deadline).toLocaleDateString('fr-FR')}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCreateModal && (
                <TaskAssignment
                    projectId={projectId}
                    onClose={() => setShowCreateModal(false)}
                />
            )}
        </div>
    );
};
