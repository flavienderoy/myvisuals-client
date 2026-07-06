import React, { useState, useRef, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';

export const DiffComparator = ({ beforeImage, afterImage }) => {
    const [sliderChecked, setSliderChecked] = useState(50);
    const containerRef = useRef(null);
    const isDragging = useRef(false);

    const handleMouseDown = () => {
        isDragging.current = true;
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;

        setSliderChecked(percentage);
    };

    // Touch support
    const handleTouchMove = (e) => {
        if (!isDragging.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderChecked(percentage);
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    return (
        <div
            className="relative w-full aspect-video select-none rounded-lg overflow-hidden cursor-ew-resize group"
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchStart={handleMouseDown}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
        >
            {/* After Image (Background) */}
            <div className="absolute inset-0">
                <img src={afterImage} alt="After" className="w-full h-full object-contain bg-black" />
                <span className="absolute top-4 right-4 text-xs font-bold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-md">APRÈS</span>
            </div>

            {/* Before Image (Foreground - Clipped) */}
            <div
                className="absolute inset-0 overflow-hidden border-r-2 border-white/50"
                style={{ width: `${sliderChecked}%` }}
            >
                <img src={beforeImage} alt="Before" className="w-full h-full object-contain bg-black" />
                <span className="absolute top-4 left-4 text-xs font-bold text-white bg-black/50 px-2 py-1 rounded backdrop-blur-md">AVANT</span>
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-md"
                style={{ left: `${sliderChecked}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md transform transition-transform group-hover:scale-110">
                    <MoveHorizontal size={16} className="text-black" />
                </div>
            </div>
        </div>
    );
};
