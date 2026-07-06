import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, Play, Pause, Maximize } from 'lucide-react';

export const PresentationMode = ({ assets, initialIndex = 0, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showControls, setShowControls] = useState(true);

    // Auto-advance slideshow
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % assets.length);
        }, 5000); // 5 seconds per slide

        return () => clearInterval(interval);
    }, [isPlaying, assets.length]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            switch (e.key) {
                case 'ArrowRight':
                case ' ':
                    e.preventDefault();
                    setCurrentIndex((prev) => (prev + 1) % assets.length);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    setCurrentIndex((prev) => (prev - 1 + assets.length) % assets.length);
                    break;
                case 'Escape':
                    onClose();
                    break;
                case 'f':
                case 'F':
                    // Toggle fullscreen
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen();
                    } else {
                        document.exitFullscreen();
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [assets.length, onClose]);

    // Hide controls after inactivity
    useEffect(() => {
        let timeout;
        const resetTimeout = () => {
            setShowControls(true);
            clearTimeout(timeout);
            timeout = setTimeout(() => setShowControls(false), 3000);
        };

        window.addEventListener('mousemove', resetTimeout);
        resetTimeout();

        return () => {
            window.removeEventListener('mousemove', resetTimeout);
            clearTimeout(timeout);
        };
    }, []);

    const currentAsset = assets[currentIndex];

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col">
            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center relative">
                <img
                    src={currentAsset.url}
                    alt={currentAsset.name}
                    className="max-w-full max-h-full object-contain"
                />

                {/* Navigation Arrows */}
                {showControls && assets.length > 1 && (
                    <>
                        <button
                            onClick={() => setCurrentIndex((currentIndex - 1 + assets.length) % assets.length)}
                            className="absolute left-4 p-4 bg-black/50 hover:bg-black/70 rounded-full transition-all backdrop-blur-sm"
                        >
                            <ArrowLeft className="text-white" size={32} />
                        </button>
                        <button
                            onClick={() => setCurrentIndex((currentIndex + 1) % assets.length)}
                            className="absolute right-4 p-4 bg-black/50 hover:bg-black/70 rounded-full transition-all backdrop-blur-sm"
                        >
                            <ArrowRight className="text-white" size={32} />
                        </button>
                    </>
                )}
            </div>

            {/* Controls Bar */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <div className="max-w-4xl mx-auto">
                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-mv-gold transition-all duration-300"
                                style={{ width: `${((currentIndex + 1) / assets.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {/* Asset Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-white font-medium truncate">{currentAsset.name}</h3>
                            <p className="text-gray-400 text-sm">
                                {currentIndex + 1} / {assets.length}
                                {currentAsset.version && ` • ${currentAsset.version}`}
                            </p>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex items-center gap-3">
                            {/* Play/Pause */}
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                title={isPlaying ? 'Pause' : 'Play'}
                            >
                                {isPlaying ? (
                                    <Pause className="text-white" size={20} />
                                ) : (
                                    <Play className="text-white" size={20} />
                                )}
                            </button>

                            {/* Fullscreen */}
                            <button
                                onClick={() => {
                                    if (!document.fullscreenElement) {
                                        document.documentElement.requestFullscreen();
                                    } else {
                                        document.exitFullscreen();
                                    }
                                }}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                title="Plein écran (F)"
                            >
                                <Maximize className="text-white" size={20} />
                            </button>

                            {/* Close */}
                            <button
                                onClick={onClose}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                                title="Quitter (Esc)"
                            >
                                <X className="text-white" size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Keyboard Shortcuts Hint */}
                    <div className="mt-3 text-center">
                        <p className="text-xs text-gray-500">
                            ← → Naviguer • Espace Suivant • F Plein écran • Esc Quitter
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
