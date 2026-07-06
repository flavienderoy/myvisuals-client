import React from 'react';
import { Activity, HardDrive } from 'lucide-react';

export const MonitoringWidget = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                        <Activity size={24} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Santé du Système</div>
                        <div className="text-2xl font-normal tracking-tight text-white">99.9%</div>
                    </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors group">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                        <HardDrive size={24} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Stockage (S3)</div>
                        <div className="text-2xl font-normal tracking-tight text-white">45 GB <span className="text-sm text-gray-500">/ 100 GB</span></div>
                        <div className="w-32 h-1 bg-white/10 rounded-none mt-2 overflow-hidden">
                            <div className="h-full bg-white w-[45%]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
