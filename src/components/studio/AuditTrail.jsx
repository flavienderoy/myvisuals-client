import React from 'react';
import { FileText, Upload, MessageSquare, CheckCircle, XCircle, FolderPlus } from 'lucide-react';
import { useData } from '../../context/DataContext';

const ICONS = {
    upload: <Upload size={13} className="text-sky-400" />,
    comment: <MessageSquare size={13} className="text-gray-400" />,
    approve: <CheckCircle size={13} className="text-emerald-400" />,
    reject: <XCircle size={13} className="text-orange-400" />,
    project_created: <FolderPlus size={13} className="text-purple-400" />,
};

const timeAgo = (iso) => {
    if (!iso) return '';
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return "à l'instant";
    if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
    if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
    if (s < 604800) return `il y a ${Math.floor(s / 86400)} j`;
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
};

export const AuditTrail = ({ projectId }) => {
    const { activities, projects } = useData();

    const logs = (activities || [])
        .filter((a) => !projectId || a.project_id === projectId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 12);

    return (
        <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl p-8 h-full">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FileText size={16} /> Journal d'activités
            </h3>

            {logs.length === 0 ? (
                <p className="text-sm text-gray-600">Aucune activité pour l'instant. Les uploads, validations et commentaires apparaîtront ici.</p>
            ) : (
                <div className="space-y-6 relative">
                    <div className="absolute left-2 top-2 bottom-2 w-px bg-white/10" />
                    {logs.map((log) => (
                        <div key={log.id} className="relative pl-8 group">
                            <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-mv-black border border-white/20 flex items-center justify-center group-hover:border-mv-gold transition-colors z-10">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 group-hover:bg-mv-gold transition-colors" />
                            </div>
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm text-white leading-snug">
                                        <span className="text-mv-gold font-medium">{log.actor?.name || 'Quelqu\'un'}</span>{' '}
                                        <span className="text-gray-400">{log.description}</span>
                                    </p>
                                    {!projectId && (
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            sur <span className="text-gray-300 font-medium">{projects?.find(p => p.id === log.project_id)?.name || 'Projet inconnu'}</span>
                                        </p>
                                    )}
                                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-600">
                                        {ICONS[log.type] || <FileText size={13} className="text-gray-500" />}
                                        <span className="uppercase tracking-wider">{(log.type || '').replace('_', ' ')}</span>
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-600 shrink-0">{timeAgo(log.created_at)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
