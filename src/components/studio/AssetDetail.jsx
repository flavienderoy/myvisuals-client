import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Layers, MessageSquare, Check, Trash2, SplitSquareHorizontal, CheckCircle } from 'lucide-react';
import { LuxuryTitle } from '../common/LuxuryTitle';
import { WatermarkOverlay } from '../common/WatermarkOverlay';
import { assetService } from '../../services/assetService';

// --- Annotation Marker Component ---
const AnnotationMarker = ({ x, y, isNew, onClick, isSelected }) => (
    <div
        onClick={onClick}
        className={`absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center cursor-pointer group z-20 transition-all duration-300 ${isSelected ? 'scale-125' : 'scale-100 hover:scale-110'}`}
        style={{ left: `${x}%`, top: `${y}%` }}
    >
        {/* Pulsing Ring (Modern Aesthetic) */}
        <div className={`absolute inset-0 rounded-full border border-mv-gold/50 ${isNew ? 'animate-ping' : ''}`}></div>
        <div className={`absolute inset-1 rounded-full border border-mv-gold/80 ${isSelected ? 'bg-mv-gold/20' : 'bg-black/20'} backdrop-blur-sm`}></div>

        {/* Center Dot */}
        <div className="w-1.5 h-1.5 bg-mv-gold rounded-full shadow-sm"></div>

        {/* Connecting Line (Decorative) */}
        {!isNew && (
            <div className="absolute top-full left-1/2 w-px h-8 bg-gradient-to-b from-mv-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        )}
    </div>
);

// --- Comparison Slider Component ---
const ComparisonSlider = ({ beforeImage, afterImage }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderPosition(percentage);
    };

    const handleTouchMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderPosition(percentage);
    };

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full cursor-col-resize select-none overflow-hidden"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            {/* After Image (Base) */}
            <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />

            {/* Before Image (Clipped) */}
            <div
                className="absolute inset-0 w-full h-full overflow-hidden border-r border-mv-gold/50 bg-mv-dark/50"
                style={{ width: `${sliderPosition}%` }}
            >
                <img src={beforeImage} alt="Before" className="absolute inset-0 w-[100vw] h-full object-contain max-w-none pointer-events-none" style={{ width: containerRef.current?.offsetWidth }} />
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-px bg-mv-gold cursor-col-resize z-10 flex items-center justify-center"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="w-8 h-8 bg-black/50 backdrop-blur border border-white/30 rounded-full flex items-center justify-center shadow-lg">
                    <SplitSquareHorizontal size={14} className="text-white" />
                </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 backdrop-blur rounded text-[10px] uppercase tracking-widest text-white border border-white/10 pointer-events-none">
                Version Précédente
            </div>
            <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 backdrop-blur rounded text-[10px] uppercase tracking-widest text-mv-gold border border-mv-gold/30 pointer-events-none">
                Version Actuelle
            </div>
        </div>
    );
};


export const AssetDetail = ({ asset, onClose, authorName = "Moi" }) => {

    const formatAnnotation = (note) => ({
        id: note.id,
        x: note.x_position ?? note.x,
        y: note.y_position ?? note.y,
        text: note.content ?? note.text,
        author: typeof note.author === 'object' ? (note.author?.name || authorName) : (note.author ?? authorName),
        timestamp: note.timestamp,
        replies: note.replies || []
    });

    const [annotations, setAnnotations] = useState((asset.annotations || []).map(formatAnnotation));
    const [isComparing, setIsComparing] = useState(false);
    const [selectedAnnotationId, setSelectedAnnotationId] = useState(null);
    const [tempAnnotation, setTempAnnotation] = useState(null);
    const [commentText, setCommentText] = useState("");

    const versions = asset.versions || [];
    const currentVersion = versions[versions.length - 1]; // Latest
    const previousVersion = versions.length > 1 ? versions[versions.length - 2] : null;

    const [replyText, setReplyText] = useState("");

    const handleImageClick = (e) => {
        if (isComparing) return;
        if (tempAnnotation) {
            setTempAnnotation(null); // Cancel creation if clicking elsewhere
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setTempAnnotation({ x, y });
        setSelectedAnnotationId(null);
        setCommentText("");
    };

    const handleSaveAnnotation = async () => {
        if (!commentText.trim()) return;
        try {
            const newApiNote = await assetService.addAnnotation(asset.id, {
                content: commentText,
                x_position: tempAnnotation.x,
                y_position: tempAnnotation.y,
                timestamp: new Date().toISOString()
            });
            const newNote = formatAnnotation(newApiNote);
            setAnnotations([...annotations, newNote]);
            setTempAnnotation(null);
            setCommentText("");
        } catch (e) {
            console.error("Erreur annotation:", e);
        }
    };

    const handleSendReply = (noteId) => {
        if (!replyText.trim()) return;

        const updatedAnnotations = annotations.map(note => {
            if (note.id === noteId) {
                return {
                    ...note,
                    replies: [
                        ...(note.replies || []),
                        {
                            id: `reply_${Date.now()}`,
                            text: replyText,
                            author: authorName,
                            timestamp: new Date().toISOString()
                        }
                    ]
                };
            }
            return note;
        });

        setAnnotations(updatedAnnotations);
        setReplyText("");
    };

    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return createPortal(
        <div className="fixed inset-0 z-[100] bg-mv-black/95 backdrop-blur-md flex flex-col animate-fade-in">
            {/* Toolbar */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-mv-black/50">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                    <div>
                        <h2 className="text-white font-medium">{asset.name}</h2>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-mono uppercase">v{versions.length}</span>
                            <span>•</span>
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {previousVersion && (
                        <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
                            <button
                                onClick={() => setIsComparing(false)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${!isComparing ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                Vue Unique
                            </button>
                            <button
                                onClick={() => setIsComparing(true)}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${isComparing ? 'bg-mv-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                <SplitSquareHorizontal size={12} />
                                <span>Comparer (v{versions.length - 1} vs v{versions.length})</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Image Canvas */}
                <div className="flex-1 relative bg-[#0a0a0a] flex items-center justify-center p-8 overflow-hidden group/canvas">
                    <div className="relative w-full h-full max-w-5xl max-h-[80vh] aspect-auto">

                        {isComparing && previousVersion ? (
                            <>
                                <ComparisonSlider
                                    beforeImage={previousVersion.url}
                                    afterImage={currentVersion.url}
                                />
                                {/* UX Hint for Slider */}
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none bg-black/60 backdrop-blur px-3 py-1 rounded text-[10px] text-white uppercase tracking-widest border border-white/10 animate-pulse">
                                    &larr; Glisser pour Comparer &rarr;
                                </div>
                            </>
                        ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Base Image */}
                                <div
                                    className="relative w-full h-full flex items-center justify-center"
                                    onContextMenu={(e) => e.preventDefault()}
                                >
                                    <div className="absolute inset-0 z-20" /> {/* Transparent Shield Layer */}
                                    <WatermarkOverlay />
                                    <img
                                        src={currentVersion.url}
                                        alt="Asset"
                                        className="max-w-full max-h-full object-contain shadow-2xl pointer-events-none select-none"
                                        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
                                        draggable="false"
                                    />

                                    {/* Click Handler on wrapper (via the transparent shield essentially) */}
                                    <div
                                        className="absolute inset-0 z-30 cursor-crosshair"
                                        onClick={handleImageClick}
                                    ></div>
                                </div>

                                {/* Annotation Hint Overlay (Visible on Hover) */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover/canvas:opacity-100 transition-opacity duration-300 z-40">
                                    <div className="bg-mv-gold/90 text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-black border border-white/10 hover:border-white/30 transition-all duration-3000 animate-ping"></div>
                                        Cliquez n'importe où pour annoter
                                    </div>
                                </div>

                                <div
                                    className="absolute inset-0"
                                    onClick={handleImageClick}
                                >
                                    {/* Existing Annotations */}
                                    {annotations.map(note => (
                                        <div key={note.id}>
                                            <AnnotationMarker
                                                x={note.x}
                                                y={note.y}
                                                isSelected={selectedAnnotationId === note.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedAnnotationId(note.id);
                                                }}
                                            />

                                            {/* Interactive Thread Popover (On Image) */}
                                            {selectedAnnotationId === note.id && (
                                                <div
                                                    className="absolute z-40 w-72 flex flex-col rounded-lg bg-mv-dark/95 backdrop-blur border border-mv-gold/30 shadow-2xl animate-fade-in-up"
                                                    style={{
                                                        // Smart positioning: if marker is on right half, show panel on left
                                                        left: note.x > 50 ? `calc(${note.x}% - 300px)` : `calc(${note.x}% + 40px)`,
                                                        top: `calc(${note.y}% - 12px)`,
                                                        maxHeight: '300px'
                                                    }}
                                                    onClick={(e) => e.stopPropagation()} // Prevent closing when interacting
                                                >
                                                    {/* Header */}
                                                    <div className="p-3 border-b border-white/10 flex items-center justify-between">
                                                        <span className="text-[10px] uppercase font-bold text-mv-gold tracking-widest">{note.author}</span>
                                                        <span className="text-[10px] text-gray-500 font-mono">{new Date(note.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>

                                                    {/* Thread Content */}
                                                    <div className="p-3 overflow-y-auto custom-scrollbar flex-1">
                                                        {/* Main Message */}
                                                        <p className="text-sm text-white leading-relaxed font-bold tracking-tight text-white mb-3">{note.text}</p>

                                                        {/* Replies */}
                                                        {note.replies && note.replies.length > 0 && (
                                                            <div className="space-y-3 mt-3 pl-3 border-l border-white/10">
                                                                {note.replies.map(reply => (
                                                                    <div key={reply.id} className="animate-fade-in">
                                                                        <div className="flex items-center justify-between mb-1">
                                                                            <span className="text-[10px] font-bold text-gray-400">{reply.author}</span>
                                                                            <span className="text-[10px] text-gray-600">{new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                        </div>
                                                                        <p className="text-xs text-gray-300">{reply.text}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Reply Input */}
                                                    <div className="p-2 border-t border-white/10 bg-black/20 rounded-b-lg">
                                                        <div className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                className="flex-1 bg-transparent text-xs text-white placeholder-gray-600 focus:outline-none"
                                                                placeholder="Répondre..."
                                                                value={replyText}
                                                                onChange={(e) => setReplyText(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') handleSendReply(note.id);
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() => handleSendReply(note.id)}
                                                                className="text-xs font-bold text-mv-gold hover:text-white transition-colors uppercase"
                                                            >
                                                                Envoyer
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Temp Annotation (Being created) */}
                                    {tempAnnotation && (
                                        <AnnotationMarker
                                            x={tempAnnotation.x}
                                            y={tempAnnotation.y}
                                            isNew={true}
                                            isSelected={true}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                    </div>{/* Annotation Input Popover (Float near click) */}
                    {tempAnnotation && (
                        <div
                            className="absolute z-30 bg-mv-dark border border-white/10 rounded-lg p-3 shadow-2xl w-64 animate-fade-in-up"
                            style={{
                                // Smart positioning: if marker is on right half, show panel on left
                                left: tempAnnotation.x > 50 ? `calc(${tempAnnotation.x}% - 280px)` : `calc(${tempAnnotation.x}% + 40px)`,
                                top: `calc(${tempAnnotation.y}% - 20px)`
                            }}
                        >
                            <div className="text-xs text-mv-gold uppercase tracking-widest mb-2 font-bold">Nouveau Commentaire</div>
                            <textarea
                                autoFocus
                                className="w-full bg-black/20 text-white text-sm p-2 rounded border border-white/10 hover:border-white/30 transition-all duration-300 focus:border-white/50 outline-none resize-none mb-2"
                                rows={3}
                                placeholder="Écrivez votre commentaire..."
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                            ></textarea>
                            <div className="flex justify-between items-center">
                                <button onClick={() => setTempAnnotation(null)} className="text-xs text-gray-500 hover:text-white">Annuler</button>
                                <button onClick={handleSaveAnnotation} className="px-3 py-1 bg-mv-gold text-black text-xs font-bold rounded hover:bg-white transition-colors">Enregistrer</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar (Comments List) */}
                <div className="w-80 border-l border-white/10 bg-mv-dark/50 flex flex-col backdrop-blur-sm">
                    <div className="p-4 border-b border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                            <MessageSquare size={16} className="text-mv-gold" />
                            <h3 className="text-white font-medium">Commentaires</h3>
                        </div>
                        <p className="text-xs text-gray-500">{annotations.length} notes sur cette version</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {annotations.length === 0 ? (
                            <div className="text-center text-gray-600 text-sm mt-10 italic">
                                Cliquez sur l'image pour ajouter un commentaire.
                            </div>
                        ) : (
                            annotations.map(note => (
                                <div
                                    key={note.id}
                                    className={`p-3 rounded border transition-all cursor-pointer ${selectedAnnotationId === note.id ? 'bg-white/5 border-white/50' : 'bg-transparent border-white/10 hover:border-white/30 transition-all duration-300'}`}
                                    onClick={() => setSelectedAnnotationId(note.id)}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-gray-400">{note.author}</span>
                                        <span className="text-[10px] text-gray-600">{new Date(note.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-sm text-gray-300">{note.text}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Validation Bar (Only for Client) */}
            {authorName === "Client" && (
                <div className="h-20 border-t border-white/10 bg-mv-black/80 backdrop-blur flex items-center justify-between px-8 shrink-0 z-50">
                    <div className="flex items-center gap-4">
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Décision</div>
                        <div className="h-8 w-px bg-white/10"></div>

                        {asset.status === 'approved' ? (
                            <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle size={20} />
                                <span className="font-bold">Approuvé pour livraison</span>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <button className="px-6 py-2 rounded-full border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors uppercase text-xs font-bold tracking-wider">
                                    Rejeter
                                </button>
                                <button className="px-6 py-2 rounded-full bg-mv-gold text-black hover:bg-white transition-colors uppercase text-xs font-bold tracking-wider flex items-center gap-2">
                                    <Check size={16} />
                                    Approuver
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="text-xs text-gray-600">
                        En approuvant, vous validez la version finale de cet asset.
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
};
