import React from 'react';
import { DollarSign, HardDrive, Activity, TrendingUp } from 'lucide-react';

export const KPIWidgets = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Revenue Tracker */}
            <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl p-6 group">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white/5 border border-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                        <DollarSign size={20} />
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
                        <TrendingUp size={12} /> +12%
                    </span>
                </div>

                <div>
                    <p className="text-gray-500 text-xs uppercase tracking-widest font-medium mb-1">Revenu en attente</p>
                    <h3 className="text-3xl font-normal tracking-tight text-white">42 500 €</h3>
                    <p className="text-xs text-gray-600 mt-2">Basé sur 5 projets en cours</p>
                </div>
            </div>

            {/* Workload Chart (Simplified) */}
            <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl p-6 group">
                <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-white/5 border border-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                        <Activity size={20} />
                    </div>
                </div>

                <div>
                    <p className="text-gray-500 text-xs uppercase tracking-widest font-medium mb-3">Charge de travail</p>
                    <div className="flex items-end gap-2 h-16">
                        {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                            <div key={i} className="flex-1 bg-white/5 rounded-t-sm relative group/bar hover:bg-white/10 transition-colors">
                                <div
                                    style={{ height: `${h}%` }}
                                    className="absolute bottom-0 left-0 right-0 bg-white/30 rounded-t-sm group-hover/bar:bg-white/60 transition-colors"
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Storage Health */}
            <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl p-6 group">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-white/5 border border-white/5 rounded-lg text-gray-400 group-hover:text-white transition-colors">
                        <HardDrive size={20} />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-gray-500 text-xs uppercase tracking-widest font-medium">Cloud Storage</p>
                        <span className="text-white font-mono text-xs">42.5 GB</span>
                    </div>

                    <div className="h-1.5 bg-white/10 rounded-none overflow-hidden mb-4">
                        <div className="h-full bg-white w-[42%] relative">
                        </div>
                    </div>

                    <div className="flex gap-4 text-[10px] text-gray-500 font-mono">
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-white"></div> RAW</span>
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-white/50"></div> FINAL</span>
                        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-white/10"></div> FREE</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
