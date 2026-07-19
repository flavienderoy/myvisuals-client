import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { getActivityStyle } from '../../utils/permissions';
import { ACTIVITY_TYPES } from '../../constants';
import { Upload, MessageSquare, CheckCircle, XCircle, UserCheck, FolderPlus, Building2, AtSign, Clock } from 'lucide-react';

const activityIcons = {
    [ACTIVITY_TYPES.UPLOAD]: Upload,
    [ACTIVITY_TYPES.COMMENT]: MessageSquare,
    [ACTIVITY_TYPES.APPROVE]: CheckCircle,
    [ACTIVITY_TYPES.REJECT]: XCircle,
    [ACTIVITY_TYPES.TASK_ASSIGNED]: UserCheck,
    [ACTIVITY_TYPES.TASK_COMPLETED]: CheckCircle,
    [ACTIVITY_TYPES.MENTION]: AtSign,
    [ACTIVITY_TYPES.PROJECT_CREATED]: FolderPlus,
    [ACTIVITY_TYPES.CLIENT_ADDED]: Building2,
};

const ActivityItem = ({ activity }) => {
    const style = getActivityStyle(activity.type);
    const Icon = activityIcons[activity.type] || Clock;

    const timeAgo = (timestamp) => {
        const now = new Date();
        const then = new Date(timestamp);
        const seconds = Math.floor((now - then) / 1000);

        if (seconds < 60) return 'À l\'instant';
        if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)}min`;
        if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
        return `Il y a ${Math.floor(seconds / 86400)}j`;
    };

    return (
        <div className="flex gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors group">
            <div className={`p-2 rounded-lg ${style.bg} flex-shrink-0 h-fit`}>
                <Icon className={`${style.color} w-4 h-4`} />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 leading-relaxed">
                    <span className="font-semibold text-white">{activity.actor?.name || 'Quelqu\'un'}</span>{' '}
                    {activity.description}
                </p>
                <span className="text-xs text-gray-500">{timeAgo(activity.created_at)}</span>
            </div>
        </div>
    );
};

export const ActivityFeed = ({ projectId = null, limit = 20, showFilters = true }) => {
    const { activities, projects } = useData();
    const [filter, setFilter] = useState('all');

    const filteredActivities = useMemo(() => {
        let filtered = activities;

        // Filter by project if specified
        if (projectId) {
            filtered = filtered.filter(a => a.projectId === projectId);
        }

        // Filter by type
        if (filter !== 'all') {
            filtered = filtered.filter(a => a.type === filter);
        }

        return filtered.slice(0, limit);
    }, [activities, projectId, filter, limit]);

    const filterOptions = [
        { value: 'all', label: 'Tout', count: activities.length },
        { value: ACTIVITY_TYPES.UPLOAD, label: 'Uploads', count: activities.filter(a => a.type === ACTIVITY_TYPES.UPLOAD).length },
        { value: ACTIVITY_TYPES.COMMENT, label: 'Commentaires', count: activities.filter(a => a.type === ACTIVITY_TYPES.COMMENT).length },
        { value: ACTIVITY_TYPES.APPROVE, label: 'Approbations', count: activities.filter(a => a.type === ACTIVITY_TYPES.APPROVE).length },
        { value: ACTIVITY_TYPES.TASK_ASSIGNED, label: 'Tâches', count: activities.filter(a => a.type === ACTIVITY_TYPES.TASK_ASSIGNED).length },
    ];

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium flex items-center gap-2">
                        <Clock size={16} className="text-mv-gold" />
                        Activité Récente
                    </h3>
                    <span className="text-xs text-gray-500 font-mono">
                        {filteredActivities.length} événement{filteredActivities.length > 1 ? 's' : ''}
                    </span>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="flex gap-2 flex-wrap">
                        {filterOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => setFilter(option.value)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === option.value
                                        ? 'bg-mv-gold text-black'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                {option.label}
                                {option.count > 0 && (
                                    <span className="ml-1.5 opacity-60">({option.count})</span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Activity List */}
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {filteredActivities.length === 0 ? (
                    <div className="p-8 text-center">
                        <Clock className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Aucune activité récente</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {filteredActivities.map(activity => (
                            <ActivityItem key={activity.id} activity={activity} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
