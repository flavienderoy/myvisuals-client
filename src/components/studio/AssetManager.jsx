import React, { useState } from 'react';
import { UploadCloud, FileImage, ShieldCheck, Check } from 'lucide-react';

export const AssetManager = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleUpload = () => {
        setUploading(true);
        let curr = 0;
        const interval = setInterval(() => {
            curr += 5;
            setProgress(curr);
            if (curr >= 100) {
                clearInterval(interval);
                setTimeout(() => setUploading(false), 1000);
            }
        }, 100);
    };

    return (
        <div className="bg-mv-dark border border-white/10 hover:border-white/30 transition-all duration-300 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold tracking-tight text-white">Asset Manager</h3>
                <div className="flex items-center gap-2 text-xs text-green-500 bg-green-900/10 border border-green-900/30 px-2 py-1 rounded">
                    <ShieldCheck size={14} />
                    <span>Encryption AES-256 Active</span>
                </div>
            </div>

            <div
                onClick={handleUpload}
                className="border-2 border-dashed border-white/10 hover:border-mv-gold/50 hover:bg-white/5 transition-all duration-300 rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer group"
            >
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <UploadCloud className="text-gray-400 group-hover:text-mv-gold" />
                </div>
                <p className="text-sm text-gray-400">Drag & drop high-res visuals here</p>
                <p className="text-xs text-gray-600 mt-2">Supports RAW, TIFF, PNG (Max 5GB)</p>
            </div>

            {uploading && (
                <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white">Uploading...</span>
                        <span className="text-mv-gold">{progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-mv-gold transition-all duration-100"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {!uploading && progress === 100 && (
                <div className="mt-4 flex items-center gap-2 text-green-500 text-sm animate-fade-in">
                    <Check size={16} />
                    <span>Upload Completed Successfully</span>
                </div>
            )}
        </div>
    );
};
