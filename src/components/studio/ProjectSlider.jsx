import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, UploadCloud } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

export const ProjectCard = ({ project, onClick, className = "" }) => {
    return (
        <div
            onClick={onClick}
            className={`group relative bg-mv-dark border border-white/5 hover:border-mv-gold/50 transition-all duration-300 rounded-lg overflow-hidden cursor-pointer h-full ${className}`}
        >
            <div className="aspect-video relative overflow-hidden">
                <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-mv-black/90 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                    <h3 className="font-medium text-lg text-white">{project.name}</h3>
                </div>
                <div className="absolute top-4 right-4">
                    {project.status === 'in_progress' && (
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs rounded uppercase tracking-wide">
                            <Clock size={12} /> En Cours
                        </span>
                    )}
                    {project.status === 'completed' && (
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded uppercase tracking-wide">
                            <CheckCircle size={12} /> Terminé
                        </span>
                    )}
                    {project.status === 'pending' && (
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-500/10 border border-gray-500/20 text-gray-400 text-xs rounded uppercase tracking-wide">
                            <Clock size={12} /> En Attente
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <UploadCloud size={14} />
                    <span>{project.assets.length} Fichiers</span>
                </div>
                <div className="text-xs text-gray-500 font-mono">Réf : {project.id}</div>
            </div>
        </div>
    );
};

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
                className="w-full !overflow-visible"
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
            <div className={`absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-mv-black/90 to-transparent pointer-events-none transition-opacity duration-300 z-10 ${isEnd ? 'opacity-0' : 'opacity-100'}`}></div>

            {/* Gradient Overlay Left */}
            <div className={`absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-mv-black/90 to-transparent pointer-events-none transition-opacity duration-300 z-10 ${isBeginning ? 'opacity-0' : 'opacity-100'}`}></div>

            {/* Navigation Buttons */}
            <div className={`absolute top-1/2 -translate-y-1/2 left-0 z-20 pl-4 transition-opacity duration-300 ${isBeginning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <button
                    onClick={() => swiperRef.current?.slidePrev()}
                    className="w-10 h-10 rounded-full bg-mv-black/80 border border-white/10 text-white flex items-center justify-center hover:bg-mv-gold hover:text-black hover:border-mv-gold transition-all shadow-lg backdrop-blur-sm"
                >
                    <ChevronLeft size={20} />
                </button>
            </div>

            <div className={`absolute top-1/2 -translate-y-1/2 right-0 z-20 pr-4 transition-opacity duration-300 ${isEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <button
                    onClick={() => swiperRef.current?.slideNext()}
                    className="w-10 h-10 rounded-full bg-mv-black/80 border border-white/10 text-white flex items-center justify-center hover:bg-mv-gold hover:text-black hover:border-mv-gold transition-all shadow-lg backdrop-blur-sm"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};
