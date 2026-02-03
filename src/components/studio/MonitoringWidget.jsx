import React from 'react';
import { Activity, HardDrive } from 'lucide-react';

export const MonitoringWidget = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-mv-dark border border-white/5 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-900/20 rounded-full text-green-500">
                        <Activity size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Santé du Système</div>
                        <div className="text-xl font-medium text-white">99.9%</div>
                    </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            </div>

            <div className="bg-mv-dark border border-white/5 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-900/20 rounded-full text-blue-500">
                        <HardDrive size={20} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wider">Stockage (S3)</div>
                        <div className="text-xl font-medium text-white">45 GB / 100 GB</div>
                        <div className="w-24 h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-blue-500 w-[45%]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
