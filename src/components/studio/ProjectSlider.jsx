import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, UploadCloud } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

// Memoized to prevent unnecessary re-renders when parent updates
export const ProjectCard = React.memo(({ project, onClick, className = "" }) => {
    const assets = project.assets || [];
    const hasAssets = assets.length > 0;
    const approvedCount = assets.filter(a => a.status === 'approved').length;
    const approvedPct = hasAssets ? Math.round((approvedCount / assets.length) * 100) : 0;

    return (
        <div
            onClick={onClick}
            className={`group relative bg-white/5 border border-white/10 hover:border-mv-gold/40 transition-all duration-300 rounded-lg overflow-hidden cursor-pointer h-full ${className}`}
        >
            {/* Illustration square — always a branded DA gradient (like the avatar fallback) */}
            <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-mv-gold/25 via-mv-black to-mv-black">
                {/* Soft gold glow, echoing the avatar placeholder */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(212,175,55,0.30),transparent_60%)] group-hover:opacity-90 transition-opacity duration-500"></div>
                {/* Monogram watermark */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl font-bold text-white/[0.07] select-none uppercase tracking-tight">
                        {project.name?.charAt(0) || 'P'}
                    </span>
                </div>
                {/* Bottom fade for title legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-mv-black/80 to-transparent"></div>

                {/* Title */}
                <div className="absolute bottom-4 left-4 z-20 right-4">
                    <h3 className="font-medium text-lg text-white leading-tight drop-shadow-md truncate">{project.name}</h3>
                </div>

                {/* Status badge — the only badge on the cover */}
                <div className="absolute top-4 right-4 z-20">
                    {project.status === 'in_progress' && (
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-200 text-xs rounded uppercase tracking-wide backdrop-blur-md">
                            <Clock size={12} /> En Cours
                        </span>
                    )}
                    {project.status === 'completed' && (
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 border border-green-500/30 text-green-200 text-xs rounded uppercase tracking-wide backdrop-blur-md">
                            <CheckCircle size={12} /> Délivré
                        </span>
                    )}
                    {project.status === 'pending' && (
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-500/20 border border-gray-500/30 text-gray-300 text-xs rounded uppercase tracking-wide backdrop-blur-md">
                            <Clock size={12} /> En Attente
                        </span>
                    )}
                </div>
            </div>

            {/* Footer: file count + real validation progress */}
            <div className="p-4 flex items-center justify-between gap-4 border-t border-white/10 relative z-20 bg-white/5">
                <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
                    <UploadCloud size={14} />
                    <span className="tabular-nums">{assets.length} fichier{assets.length > 1 ? 's' : ''}</span>
                </div>
                {hasAssets && (
                    <div className="flex items-center gap-2 min-w-0" title={`${approvedCount} visuel${approvedCount > 1 ? 's' : ''} validé${approvedCount > 1 ? 's' : ''} sur ${assets.length}`}>
                        <div className="w-16 h-1 bg-white/15 rounded-full overflow-hidden shrink-0">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${approvedPct === 100 ? 'bg-green-500' : 'bg-mv-gold'}`}
                                style={{ width: `${approvedPct}%` }}
                            ></div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono tabular-nums shrink-0">{approvedCount}/{assets.length} validés</span>
                    </div>
                )}
            </div>
        </div>
    );
});

export const ProjectSlider = ({ projects, onSelectProject }) => {
    const swiperRef = useRef(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const updateNavigation = (swiper) => {
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    return (
        <div className="relative group/slider">
            <Swiper
                modules={[FreeMode, Navigation]}
                spaceBetween={24}
                slidesPerView={'auto'}
                freeMode={true}
                grabCursor={true}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    updateNavigation(swiper);
                }}
                onSlideChange={(swiper) => updateNavigation(swiper)}
                onReachEnd={() => setIsEnd(true)}
                onReachBeginning={() => setIsBeginning(true)}
                onFromEdge={() => {
                    // Slight delay to ensure isBeginning/isEnd are updated correctly when leaving edge
                    if (swiperRef.current) updateNavigation(swiperRef.current);
                }}
                className="w-full"
            >
                {projects.map(project => (
                    <SwiperSlide key={project.id} className="!w-[85vw] md:!w-[26rem]">
                        <ProjectCard
                            project={project}
                            onClick={() => onSelectProject && onSelectProject(project.id)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Gradient Overlay Right */}
            <div className={`absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-mv-black/90 to-transparent pointer-events-none transition-opacity duration-300 z-50 ${isEnd ? 'opacity-0' : 'opacity-100'}`}></div>

            {/* Gradient Overlay Left */}
            <div className={`absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-mv-black/90 to-transparent pointer-events-none transition-opacity duration-300 z-50 ${isBeginning ? 'opacity-0' : 'opacity-100'}`}></div>

            {/* Navigation Buttons */}
            <div className={`absolute top-1/2 -translate-y-1/2 left-0 z-20 pl-4 transition-opacity duration-300 ${isBeginning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="w-10 h-10 rounded-full bg-mv-black/80 border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all shadow-lg backdrop-blur-sm"
                >
                    <ChevronLeft size={20} />
                </button>
            </div>

            <div className={`absolute top-1/2 -translate-y-1/2 right-0 z-20 pr-4 transition-opacity duration-300 ${isEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className="w-10 h-10 rounded-full bg-mv-black/80 border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all shadow-lg backdrop-blur-sm"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};
