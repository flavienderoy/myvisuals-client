import React from 'react';
import { useData } from '../../context/DataContext';
import { Shield, Clock, User, FileText, AlertTriangle } from 'lucide-react';

const LogEntry = ({ log }) => {
    const getIcon = (action) => {
        switch (action) {
            case 'create': return FileText;
            case 'update': return FileText;
            case 'delete': return AlertTriangle;
            case 'access': return Shield;
            default: return Clock;
        }
    };

    const getColor = (action) => {
        switch (action) {
            case 'create': return 'text-green-400 bg-green-500/10';
            case 'update': return 'text-blue-400 bg-blue-500/10';
            case 'delete': return 'text-red-400 bg-red-500/10';
            case 'access': return 'text-gray-400 bg-gray-500/10';
            default: return 'text-gray-400 bg-gray-500/10';
        }
    };

    const Icon = getIcon(log.action);
    const colorClass = getColor(log.action);

    return (
        <div className="flex gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors">
            <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0 h-fit`}>
                <Icon size={16} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                    <p className="text-sm text-white">
                        <span className="font-medium">{log.action}</span> • {log.resourceType}
                    </p>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {new Date(log.timestamp).toLocaleString('fr-FR')}
                    </span>
                </div>

                {log.userId && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User size={12} />
                        <span>{log.userId}</span>
                    </div>
                )}

                {log.details && (
                    <p className="text-xs text-gray-600 mt-1">
                        {JSON.stringify(log.details)}
                    </p>
                )}
            </div>
        </div>
    );
};

export const AuditLogs = ({ resourceType, resourceId, limit = 50 }) => {
    const { auditLogs, getLogsByResource } = useData();

    const logs = resourceType && resourceId
        ? getLogsByResource(resourceType, resourceId)
        : auditLogs.slice(0, limit);

    const [filter, setFilter] = React.useState('all');

    const filteredLogs = filter === 'all'
        ? logs
        : logs.filter(log => log.action === filter);

    const actionCounts = {
        all: logs.length,
        create: logs.filter(l => l.action === 'create').length,
        update: logs.filter(l => l.action === 'update').length,
        delete: logs.filter(l => l.action === 'delete').length,
        access: logs.filter(l => l.action === 'access').length,
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium flex items-center gap-2">
                        <Shield className="text-mv-gold" size={16} />
                        Journal d'Audit
                    </h3>
                    <span className="text-xs text-gray-500 font-mono">
                        {filteredLogs.length} entrée{filteredLogs.length > 1 ? 's' : ''}
                    </span>
                </div>

                {/* Filters */}
                <div className="flex gap-2 flex-wrap">
                    {Object.entries(actionCounts).map(([action, count]) => (
                        <button
                            key={action}
                            onClick={() => setFilter(action)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === action
                                    ? 'bg-mv-gold text-black'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                            {count > 0 && (
                                <span className="ml-1.5 opacity-60">({count})</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Logs List */}
            <div className="max-h-96 overflow-y-auto">
                {filteredLogs.length === 0 ? (
                    <div className="p-8 text-center">
                        <Shield className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Aucune entrée d'audit</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {filteredLogs.map(log => (
                            <LogEntry key={log.id} log={log} />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="p-3 border-t border-white/10 bg-black/20">
                <p className="text-xs text-gray-500 text-center">
                    Les logs sont conservés pendant 90 jours • Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
                </p>
            </div>
        </div>
    );
};
