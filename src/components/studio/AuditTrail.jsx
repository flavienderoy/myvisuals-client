import React from 'react';
import { User, FileText, CheckCircle, Upload } from 'lucide-react';

export const AuditTrail = () => {
    const logs = [
        { id: 1, user: 'Sarah Connor', action: 'uploaded_assets', detail: 'Added 5 new images to Look 01', time: '10 min ago' },
        { id: 2, user: 'Client', action: 'approved_asset', detail: 'Approved ME_Spring_002', time: '1 hour ago' },
        { id: 3, user: 'Client', action: 'commented', detail: 'Requested changes on ME_Spring_001', time: '1 hour ago' },
        { id: 4, user: 'Sarah Connor', action: 'viewed', detail: 'Viewed project dashboard', time: '3 hours ago' }
    ];

    const getIcon = (action) => {
        switch (action) {
            case 'uploaded_assets': return <Upload size={14} className="text-blue-400" />;
            case 'approved_asset': return <CheckCircle size={14} className="text-green-400" />;
            default: return <FileText size={14} className="text-gray-400" />;
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl p-8 h-full">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FileText size={16} /> Journal d'Activités
            </h3>

            <div className="space-y-6 relative">
                {/* Vertical Line */}
                <div className="absolute left-2 top-2 bottom-2 w-px bg-white/10"></div>

                {logs.map(log => (
                    <div key={log.id} className="relative pl-8 group">
                        {/* Dot */}
                        <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-mv-black border border-white/20 flex items-center justify-center group-hover:border-mv-gold transition-colors z-10">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 group-hover:bg-mv-gold transition-colors"></div>
                        </div>

                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-white font-medium flex items-center gap-2">
                                    <span className="text-mv-gold">{log.user}</span>
                                    <span className="text-gray-500 font-normal text-xs">{log.detail}</span>
                                </p>
                                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-600">
                                    {getIcon(log.action)}
                                    <span className="uppercase tracking-wider">{log.action.replace('_', ' ')}</span>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-600 font-mono">{log.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
