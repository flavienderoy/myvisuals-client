import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Before/After version comparator with a draggable divider.
 * The "before" image is sized to the container width so it stays pixel-aligned
 * with the "after" image as the divider moves (no drift / squish).
 */
export const DiffComparator = ({ beforeImage, afterImage, beforeLabel = 'Avant', afterLabel = 'Après' }) => {
    const [pos, setPos] = useState(50);
    const [width, setWidth] = useState(0);
    const [dragging, setDragging] = useState(false);
    const containerRef = useRef(null);

    // Measure the container so the clipped "before" image can match its width
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const update = () => setWidth(el.clientWidth);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const setFromClientX = useCallback((clientX) => {
        const el = containerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setPos((x / rect.width) * 100);
    }, []);

    // Track the pointer globally while dragging (so it keeps up outside the box)
    useEffect(() => {
        if (!dragging) return;
        const move = (e) => setFromClientX(e.clientX);
        const up = () => setDragging(false);
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
        return () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
        };
    }, [dragging, setFromClientX]);

    const onKeyDown = (e) => {
        if (e.key === 'ArrowLeft') { setPos((p) => Math.max(0, p - 2)); e.preventDefault(); }
        else if (e.key === 'ArrowRight') { setPos((p) => Math.min(100, p + 2)); e.preventDefault(); }
        else if (e.key === 'Home') { setPos(0); e.preventDefault(); }
        else if (e.key === 'End') { setPos(100); e.preventDefault(); }
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video select-none rounded-xl overflow-hidden bg-[#0a0a0a] border border-white/10 shadow-2xl group cursor-ew-resize"
            onMouseDown={(e) => { setDragging(true); setFromClientX(e.clientX); }}
            onTouchStart={(e) => { setDragging(true); setFromClientX(e.touches[0].clientX); }}
            onTouchMove={(e) => setFromClientX(e.touches[0].clientX)}
            onTouchEnd={() => setDragging(false)}
        >
            {/* After (full) */}
            <img src={afterImage} alt={afterLabel} draggable={false} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
            <span className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-white/15 text-[10px] font-bold uppercase tracking-[0.15em] text-white pointer-events-none">
                {afterLabel}
            </span>

            {/* Before (clipped, aligned to the container width) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${pos}%` }}>
                <img
                    src={beforeImage}
                    alt={beforeLabel}
                    draggable={false}
                    style={{ width: width ? `${width}px` : '100%' }}
                    className="absolute inset-y-0 left-0 h-full object-contain max-w-none"
                />
                <span className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-mv-gold text-black text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap">
                    {beforeLabel}
                </span>
            </div>

            {/* Divider + handle */}
            <div className="absolute top-0 bottom-0 z-30 pointer-events-none" style={{ left: `${pos}%` }}>
                <div className="absolute inset-y-0 -translate-x-1/2 w-[2px] bg-white/90 shadow-[0_0_14px_rgba(0,0,0,0.7)]" />
                <button
                    type="button"
                    role="slider"
                    aria-label="Comparer les versions avant / après"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(pos)}
                    onKeyDown={onKeyDown}
                    onMouseDown={(e) => { e.stopPropagation(); setDragging(true); }}
                    onTouchStart={(e) => { e.stopPropagation(); setDragging(true); }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-xl pointer-events-auto cursor-ew-resize ring-1 ring-black/10 transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-mv-gold/60 motion-reduce:transition-none"
                >
                    <ChevronLeft size={15} className="-mr-1" />
                    <ChevronRight size={15} className="-ml-1" />
                </button>
            </div>

            {/* Hint (fades on hover) */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10 text-[10px] text-gray-300 opacity-80 group-hover:opacity-0 transition-opacity pointer-events-none motion-reduce:transition-none">
                Glissez pour comparer
            </div>
        </div>
    );
};
