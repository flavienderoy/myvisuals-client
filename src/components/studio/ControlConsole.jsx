import React, { useState } from 'react';
import { Settings, Share2, Link as LinkIcon, Download } from 'lucide-react';

export const ControlConsole = ({ onGenerateLink }) => {
    const [watermark, setWatermark] = useState(true);

    return (
        <div className="bg-mv-dark border border-white/10 hover:border-white/30 transition-all duration-300 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
                <Settings size={18} className="text-mv-gold" />
                <h3 className="text-lg font-bold tracking-tight text-white">Console de Contrôle</h3>
            </div>

            <div className="space-y-6">
                {/* Watermark Toggle */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm text-white">Dynamic Watermark</div>
                        <div className="text-xs text-gray-500">Apply safety layer on client view</div>
                    </div>
                    <button
                        onClick={() => setWatermark(!watermark)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${watermark ? 'bg-mv-gold' : 'bg-gray-700'}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${watermark ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>

                <div className="h-px bg-white/5"></div>

                {/* Export Formats */}
                <div>
                    <div className="text-sm text-white mb-3">Export Targets</div>
                    <div className="flex gap-2">
                        {['WEB', 'INSTAGRAM', 'PRINT HQ'].map(fmt => (
                            <button key={fmt} className="px-3 py-1.5 border border-white/10 hover:border-mv-gold text-xs text-gray-400 hover:text-white rounded transition-colors">
                                {fmt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-white/5"></div>

                {/* Magic Link */}
                <button
                    onClick={onGenerateLink}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white py-3 rounded flex items-center justify-center gap-2 transition-all"
                >
                    <LinkIcon size={16} className="text-mv-gold" />
                    <span className="text-sm tracking-wide">Generate Secure Client Link</span>
                </button>
            </div>
        </div>
    );
};
