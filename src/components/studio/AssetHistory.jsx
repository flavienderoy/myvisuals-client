import React from 'react';
import { Clock, Upload, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

export const AssetHistory = ({ asset }) => {
    // Mock history data - would come from audit logs in real app
    const history = [
        {
            id: 1,
            type: 'upload',
            message: 'Asset uploadé',
            user: 'Jean Dupont',
            timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
            id: 2,
            type: 'comment',
            message: 'Commentaire ajouté: "Belle composition"',
            user: 'Marie Martin',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            id: 3,
            type: 'approve',
            message: 'Asset approuvé',
            user: 'Client',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'upload': return Upload;
            case 'comment': return MessageSquare;
            case 'approve': return CheckCircle;
            case 'reject': return XCircle;
            default: return Clock;
        }
    };

    const getColor = (type) => {
        switch (type) {
            case 'upload': return 'text-blue-400';
            case 'comment': return 'text-gray-400';
            case 'approve': return 'text-green-400';
            case 'reject': return 'text-red-400';
            default: return 'text-gray-400';
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Clock size={16} className="text-mv-gold" />
                Historique
            </h3>

            <div className="space-y-3">
                {history.map((event, idx) => {
                    const Icon = getIcon(event.type);
                    const color = getColor(event.type);

                    return (
                        <div key={event.id} className="flex gap-3 relative">
                            {/* Timeline Line */}
                            {idx < history.length - 1 && (
                                <div className="absolute left-[11px] top-8 bottom-0 w-px bg-white/10" />
                            )}

                            {/* Icon */}
                            <div className={`w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 relative z-10`}>
                                <Icon className={color} size={12} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-2">
                                <p className="text-sm text-gray-300">{event.message}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-gray-500">{event.user}</span>
                                    <span className="text-xs text-gray-600">•</span>
                                    <span className="text-xs text-gray-600">{formatDate(event.timestamp)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
