import React, { useEffect, useRef, useState } from 'react';
import {
    X, Send, CheckCircle, RotateCcw, CornerDownRight,
    Loader2, MessageSquare, Clock, ListPlus,
} from 'lucide-react';

const formatDate = (iso) => {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleDateString('fr-FR', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
        });
    } catch { return ''; }
};

/**
 * AnnotationPopup — Webflow-style floating popup anchored to an annotation pin.
 *
 * Props:
 *  - thread: { id, content, author, created_at, status, replies: [] }
 *  - pinIndex: number displayed on the pin (1-based)
 *  - anchorPosition: { x (%), y (%) } — pin position on canvas
 *  - canvasRef: ref to the canvas container for positioning calculations
 *  - onReply: (parentId, text) => Promise
 *  - onResolve: (id) => Promise
 *  - onReopen: (id) => Promise
 *  - onClose: () => void
 *  - isNewDraft: boolean — if true, show a composer instead of a thread
 *  - draftText / onDraftTextChange / onSubmitDraft / draftPosting — for new annotations
 */
const AnnotationPopup = ({
    thread,
    pinIndex,
    anchorPosition,
    canvasRef,
    viewVersion,
    onReply,
    onResolve,
    onReopen,
    onCreateTask,
    onClose,
    isNewDraft = false,
    draftText = '',
    onDraftTextChange,
    onSubmitDraft,
    draftPosting = false,
    projectMembers = [],
}) => {
    const popupRef = useRef(null);
    const replyInputRef = useRef(null);
    const draftInputRef = useRef(null);
    const [replyText, setReplyText] = useState('');
    const [replyPosting, setReplyPosting] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [resolving, setResolving] = useState(false);
    const [taskBusy, setTaskBusy] = useState(false);
    const [taskDone, setTaskDone] = useState(false);
    const [showTaskMenu, setShowTaskMenu] = useState(false);
    const [popupStyle, setPopupStyle] = useState({});

    // Mentions state for UI popover
    const [mentionQuery, setMentionQuery] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    const [activeInput, setActiveInput] = useState(null); // 'draft' | 'reply'

    // Format mentions in text
    const formatContent = (text) => {
        if (!text) return null;
        return text.split(/(@\S+)/g).map((part, idx) => 
            part.startsWith('@') 
                ? <span key={idx} className="text-mv-gold font-bold bg-mv-gold/10 px-1 py-0.5 rounded mr-0.5">{part}</span> 
                : part
        );
    };

    // Position the popup in SCREEN space (position: fixed) so it stays a normal
    // size and correctly placed even when the canvas is zoomed/panned.
    useEffect(() => {
        if (!canvasRef?.current || !popupRef.current) return;

        const canvas = canvasRef.current.getBoundingClientRect();
        const popupRect = popupRef.current.getBoundingClientRect();

        // Pin position in screen coordinates (canvas rect already reflects zoom/pan)
        const pinScreenX = canvas.left + (anchorPosition.x / 100) * canvas.width;
        const pinScreenY = canvas.top + (anchorPosition.y / 100) * canvas.height;

        const OFFSET = 20;
        const POPUP_WIDTH = Math.min(360, window.innerWidth - 32);

        // Prefer the right of the pin; flip left if it would overflow the viewport
        let left = pinScreenX + OFFSET;
        if (left + POPUP_WIDTH > window.innerWidth - 8) left = pinScreenX - OFFSET - POPUP_WIDTH;
        left = Math.max(8, Math.min(left, window.innerWidth - POPUP_WIDTH - 8));

        let top = pinScreenY - 20;
        top = Math.max(8, Math.min(top, window.innerHeight - popupRect.height - 8));

        setPopupStyle({ left: `${left}px`, top: `${top}px`, width: `${POPUP_WIDTH}px` });
    }, [anchorPosition, canvasRef, viewVersion]);

    // Auto-focus draft input
    useEffect(() => {
        if (isNewDraft) {
            setTimeout(() => draftInputRef.current?.focus(), 100);
        }
    }, [isNewDraft]);

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    // Handle typing to detect mentions
    const handleTyping = (text, type, setter) => {
        setter(text);
        setActiveInput(type);
        
        const words = text.split(/\s/);
        const lastWord = words[words.length - 1];
        if (lastWord.startsWith('@')) {
            setMentionQuery(lastWord.slice(1).toLowerCase());
            setShowMentions(true);
        } else {
            setShowMentions(false);
        }
    };

    const insertMention = (member) => {
        const textToUpdate = activeInput === 'draft' ? draftText : replyText;
        const words = textToUpdate.split(/\s/);
        words.pop();
        const newText = words.join(' ') + (words.length > 0 ? ' ' : '') + `@${member.name} `;
        
        if (activeInput === 'draft') onDraftTextChange(newText);
        else setReplyText(newText);
        
        setShowMentions(false);
        if (activeInput === 'draft') draftInputRef.current?.focus();
        else replyInputRef.current?.focus();
    };

    const handleReply = async () => {
        if (!replyText.trim() || replyPosting) return;
        setReplyPosting(true);
        try {
            await onReply(thread.id, replyText.trim());
            setReplyText('');
            setShowReplyInput(false);
        } catch { /* toast handled upstream */ }
        finally { setReplyPosting(false); }
    };

    const handleResolve = async () => {
        setResolving(true);
        try {
            await onResolve(thread.id);
        } catch { /* handled upstream */ }
        finally { setResolving(false); }
    };

    const handleReopen = async () => {
        setResolving(true);
        try {
            await onReopen(thread.id);
        } catch { /* handled upstream */ }
        finally { setResolving(false); }
    };

    const doCreateTask = async (assigneeId = null) => {
        if (!onCreateTask || taskBusy || taskDone) return;
        setTaskBusy(true);
        setShowTaskMenu(false);
        try {
            await onCreateTask(thread, assigneeId);
            setTaskDone(true);
        } catch { /* handled upstream */ }
        finally { setTaskBusy(false); }
    };

    const isResolved = thread?.status === 'resolved';

    return (
        <div
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}
            className="fixed z-50 animate-popup-in"
            style={popupStyle}
        >
            <div className="bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(212,175,55,0.08)] overflow-hidden">

                {/* ====== NEW DRAFT MODE ====== */}
                {isNewDraft ? (
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-mv-gold text-black flex items-center justify-center text-[10px] font-bold animate-annotation-pulse">
                                    +
                                </span>
                                <span className="text-xs font-bold text-mv-gold uppercase tracking-widest">
                                    Nouveau commentaire
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                                aria-label="Fermer"
                            >
                                <X size={14} />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <input
                                ref={draftInputRef}
                                type="text"
                                value={draftText}
                                onChange={(e) => handleTyping(e.target.value, 'draft', onDraftTextChange)}
                                onKeyDown={(e) => { if (e.key === 'Enter') onSubmitDraft(); }}
                                placeholder="Décrivez votre retour…"
                                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold/50 focus:ring-1 focus:ring-mv-gold/20 transition-all"
                            />
                            <button
                                onClick={onSubmitDraft}
                                disabled={!draftText.trim() || draftPosting}
                                className="px-3.5 rounded-xl bg-mv-gold text-black font-bold disabled:opacity-30 hover:bg-white transition-all duration-200 flex items-center"
                                aria-label="Envoyer"
                            >
                                {draftPosting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ====== THREAD VIEW MODE ====== */
                    <>
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${isResolved ? 'bg-green-500 text-white' : 'bg-mv-gold text-black'}`}>
                                    {pinIndex}
                                </span>
                                <span className="text-xs font-bold text-white truncate">
                                    {thread.author?.name || 'Utilisateur'}
                                </span>
                                <span className="text-[10px] text-gray-600 shrink-0">
                                    {formatDate(thread.created_at)}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                {/* Status badge */}
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-all ${
                                    isResolved
                                        ? 'bg-green-500/10 text-green-400 border-green-500/25'
                                        : 'bg-mv-gold/10 text-mv-gold border-mv-gold/25'
                                }`}>
                                    {isResolved ? <CheckCircle size={9} /> : <Clock size={9} />}
                                    {isResolved ? 'Résolu' : 'Ouvert'}
                                </span>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                                    aria-label="Fermer"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="max-h-[280px] overflow-y-auto">
                            {/* Root message */}
                            <div className="px-4 py-3">
                                <p className="text-sm text-gray-200 leading-relaxed">{formatContent(thread.content)}</p>
                            </div>

                            {/* Replies */}
                            {thread.replies && thread.replies.length > 0 && (
                                <div className="border-t border-white/5">
                                    {thread.replies.map((rep) => (
                                        <div key={rep.id} className="px-4 py-2.5 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                            <div className="flex items-center gap-2 mb-1">
                                                <CornerDownRight size={10} className="text-gray-600 shrink-0" />
                                                <span className="text-[11px] font-bold text-gray-300">
                                                    {rep.author?.name || 'Utilisateur'}
                                                </span>
                                                <span className="text-[10px] text-gray-600 ml-auto">
                                                    {formatDate(rep.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-[14px] text-white leading-relaxed font-medium">
                                                {formatContent(rep.content)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer — Reply + Actions */}
                        <div className="px-4 py-3 border-t border-white/8 bg-black/20 space-y-2.5">
                            {/* Reply */}
                            {showReplyInput ? (
                                <div className="flex gap-2">
                                    <input
                                        ref={replyInputRef}
                                        type="text"
                                        autoFocus
                                        value={replyText}
                                        onChange={(e) => handleTyping(e.target.value, 'reply', setReplyText)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleReply(); }}
                                        placeholder="Répondre…"
                                        className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold/50 transition-all"
                                    />
                                    <button
                                        onClick={handleReply}
                                        disabled={!replyText.trim() || replyPosting}
                                        className="px-2.5 rounded-lg bg-mv-gold text-black disabled:opacity-30 hover:bg-white transition-colors"
                                        aria-label="Envoyer la réponse"
                                    >
                                        {replyPosting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                                    </button>
                                    <button
                                        onClick={() => { setShowReplyInput(false); setReplyText(''); }}
                                        className="px-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                                        aria-label="Annuler"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setShowReplyInput(true)}
                                            className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 hover:text-mv-gold transition-colors"
                                        >
                                            <MessageSquare size={12} />
                                            Répondre
                                            {thread.replies && thread.replies.length > 0 && (
                                                <span className="px-1.5 py-0.5 rounded-full bg-white/8 text-[9px] text-gray-400 tabular-nums">
                                                    {thread.replies.length}
                                                </span>
                                            )}
                                        </button>

                                        {/* Send to Kanban — with assignee picker */}
                                        {onCreateTask && (
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowTaskMenu((v) => !v)}
                                                    disabled={taskBusy || taskDone}
                                                    title="Créer une tâche dans le tableau à partir de ce retour"
                                                    className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${taskDone ? 'text-green-400' : 'text-gray-500 hover:text-mv-gold'}`}
                                                >
                                                    {taskBusy ? <Loader2 size={12} className="animate-spin" /> : taskDone ? <CheckCircle size={12} /> : <ListPlus size={12} />}
                                                    {taskDone ? 'Dans le tableau' : 'Tâche'}
                                                </button>
                                                {showTaskMenu && !taskDone && (
                                                    <>
                                                        <div className="fixed inset-0 z-40" onClick={() => setShowTaskMenu(false)} />
                                                        <div className="absolute bottom-full mb-2 left-0 w-52 max-h-56 overflow-y-auto bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 py-1">
                                                            <p className="px-3 py-1.5 text-[10px] text-gray-500 uppercase tracking-widest">Assigner la tâche à</p>
                                                            <button onClick={() => doCreateTask(null)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5">
                                                                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">—</span>
                                                                Sans assignation
                                                            </button>
                                                            {(projectMembers || []).map((m) => (
                                                                <button key={m.id} onClick={() => doCreateTask(m.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5">
                                                                    {m.avatar_url
                                                                        ? <img src={m.avatar_url} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                                                                        : <span className="w-6 h-6 rounded-full bg-mv-gold flex items-center justify-center text-black text-[10px] font-bold">{m.name?.[0]?.toUpperCase()}</span>}
                                                                    <span className="truncate">{m.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Resolve / Reopen */}
                                    {isResolved ? (
                                        <button
                                            onClick={handleReopen}
                                            disabled={resolving}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-medium text-gray-400 hover:text-white hover:border-white/25 transition-all disabled:opacity-40"
                                        >
                                            {resolving ? <Loader2 size={11} className="animate-spin" /> : <RotateCcw size={11} />}
                                            Rouvrir
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleResolve}
                                            disabled={resolving}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-[11px] font-medium text-green-400 hover:bg-green-500/20 hover:text-green-300 transition-all disabled:opacity-40"
                                        >
                                            {resolving ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle size={11} />}
                                            Résoudre
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
                
                {/* Mentions Popover */}
                {showMentions && projectMembers && projectMembers.length > 0 && (
                    <div className="bg-[#1a1a1a] border-t border-white/10 overflow-hidden max-h-40 overflow-y-auto">
                        {projectMembers.filter(m => m.name?.toLowerCase().includes(mentionQuery)).map(m => (
                            <button 
                                key={m.id}
                                onClick={() => insertMention(m)}
                                className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center gap-3 transition-colors"
                            >
                                {m.avatar_url ? (
                                    <img src={m.avatar_url} alt={m.name} className="w-5 h-5 rounded-full object-cover border border-white/10" />
                                ) : (
                                    <div className="w-5 h-5 rounded-full bg-mv-gold flex items-center justify-center text-black text-[9px] font-bold">
                                        {m.name?.[0]?.toUpperCase()}
                                    </div>
                                )}
                                <span className="text-[13px] text-white font-medium">{m.name}</span>
                                {m.type === 'client' && <span className="ml-auto text-[9px] text-mv-gold uppercase font-bold bg-mv-gold/10 px-1.5 rounded">Client</span>}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnotationPopup;
