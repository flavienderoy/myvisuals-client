import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, UploadCloud } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

// Memoized to prevent unnecessary re-renders when parent updates
export const ProjectCard = React.memo(({ project, onClick, className = "" }) => {
    // Determine if we have a secondary image to show (for split view)
    const hasAssets = project.assets && project.assets.length > 0;

    // Primary Image (Thumbnail) - Will be clipped if there is a secondary image
    // Secondary Image (First Asset) - Will be the background
    const secondaryImage = hasAssets
        ? (project.assets[0].versions?.[0]?.url || project.assets[0].url)
        : null;

    return (
        <div
            onClick={onClick}
            className={`group relative bg-white/5 border border-white/10 hover:border-white/30 transition-all duration-300 rounded-lg overflow-hidden cursor-pointer h-full ${className}`}
        >
            <div className="aspect-video relative overflow-hidden bg-mv-black">
                {/* Secondary Image (Background / Right Side) */}
                {hasAssets && secondaryImage && (
                    <div className="absolute inset-0">
                        <img
                            src={secondaryImage}
                            alt="Project Update"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 ease-out grayscale hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-mv-black/90 to-transparent"></div>
                    </div>
                )}

                {/* Primary Image (Foreground / Left Side / Clipped) */}
                <div
                    className={`absolute inset-0 transition-all duration-500 z-10 ${hasAssets ? 'w-full h-full' : ''}`}
                    style={hasAssets ? { clipPath: 'polygon(0 0, 65% 0, 40% 100%, 0% 100%)' } : {}}
                >
                    <img
                        src={project.thumbnail}
                        alt={project.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ease-out ${hasAssets ? 'group-hover:scale-110' : 'group-hover:scale-105'} opacity-90 group-hover:opacity-100`}
                    />
                    {/* Overlay for text readability on primary image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-mv-black/90 to-transparent"></div>
                </div>

                {/* Separator Line (Only if split) */}
                {hasAssets && (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                            <line
                                x1="65" y1="0"
                                x2="40" y2="100"
                                stroke="#FFFFFF" // white
                                strokeWidth="0.5"
                                vectorEffect="non-scaling-stroke"
                                strokeOpacity="0.2"
                            />
                        </svg>
                    </div>
                )}

                {/* Content Overlay */}
                <div className="absolute bottom-4 left-4 z-30 max-w-[65%]">
                    <h3 className="font-medium text-lg text-white leading-tight drop-shadow-md">{project.name}</h3>
                </div>

                {/* Badges */}
                <div className="absolute top-4 right-4 z-30 flex flex-col items-end gap-2">
                    {/* Status Badge */}
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

                    {/* Approval Rate Badge (Mocked or Real) */}
                    {hasAssets && (
                        <div className="px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded flex items-center gap-2">
                            <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-mv-gold w-[75%]"></div>
                            </div>
                            <span className="text-[10px] text-white font-mono">75% OK</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 flex items-center justify-between border-t border-white/10 hover:border-white/30 transition-all duration-300 relative z-30 bg-white/5">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <UploadCloud size={14} />
                    <span>{project.assets?.length || 0} Fichiers</span>
                </div>
                <div className="text-xs text-gray-500 font-mono">Réf : {project.id}</div>
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
