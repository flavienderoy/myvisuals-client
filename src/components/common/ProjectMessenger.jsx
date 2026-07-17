import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Send, Loader2, MessageSquare, FolderOpen } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { messageService } from '../../services/messageService';
import { useToast } from '../../hooks/useToast';

const formatTime = (iso) => {
    if (!iso) return '';
    try {
        const d = new Date(iso);
        const today = new Date();
        const sameDay = d.toDateString() === today.toDateString();
        return sameDay
            ? d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            : d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
};

/**
 * Real per-project messaging thread, shared by the studio and the client
 * portal. Left: project list. Right: thread + composer (wired to the API).
 */
export const ProjectMessenger = () => {
    const { projects, currentUser } = useData();
    const toast = useToast();

    const [selectedId, setSelectedId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const bottomRef = useRef(null);

    // Default to the first project
    useEffect(() => {
        if (!selectedId && projects.length > 0) setSelectedId(projects[0].id);
    }, [projects, selectedId]);

    const loadMessages = useCallback(async (projectId) => {
        setLoading(true);
        try {
            const data = await messageService.getMessages(projectId);
            setMessages(Array.isArray(data) ? data : []);
        } catch {
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selectedId) loadMessages(selectedId);
    }, [selectedId, loadMessages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        const content = text.trim();
        if (!content || !selectedId || sending) return;
        setSending(true);
        try {
            const sent = await messageService.sendMessage(selectedId, content);
            setMessages((prev) => [...prev, { ...sent, sender: { name: currentUser?.name } }]);
            setText('');
        } catch {
            toast.error("Impossible d'envoyer le message");
        } finally {
            setSending(false);
        }
    };

    const selectedProject = projects.find((p) => p.id === selectedId);

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 bg-white/5 rounded-xl border border-white/10 text-center px-6">
                <MessageSquare size={28} className="text-gray-700 mb-3" />
                <p className="text-sm text-gray-500">Aucun projet, donc pas encore de conversation.</p>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100dvh-16rem)] min-h-[420px] bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
            {/* Project list */}
            <aside className="w-56 md:w-72 shrink-0 border-r border-white/10 overflow-y-auto scrollbar-hide">
                <div className="p-4 border-b border-white/10">
                    <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Conversations</h3>
                </div>
                {projects.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setSelectedId(p.id)}
                        className={`w-full text-left px-4 py-3.5 flex items-center gap-3 border-b border-white/5 transition-colors ${selectedId === p.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                    >
                        <div className={`p-2 rounded-lg shrink-0 ${selectedId === p.id ? 'bg-mv-gold/15 text-mv-gold' : 'bg-white/5 text-gray-500'}`}>
                            <FolderOpen size={16} />
                        </div>
                        <div className="min-w-0">
                            <p className={`text-sm font-medium truncate ${selectedId === p.id ? 'text-white' : 'text-gray-300'}`}>{p.name}</p>
                            <p className="text-[11px] text-gray-500 truncate">{p.client}</p>
                        </div>
                    </button>
                ))}
            </aside>

            {/* Thread */}
            <section className="flex-1 flex flex-col min-w-0">
                <div className="px-5 py-3.5 border-b border-white/10 shrink-0">
                    <p className="text-sm font-bold text-white truncate">{selectedProject?.name}</p>
                    <p className="text-[11px] text-gray-500">Échangez sur ce projet — visible par le studio et le client.</p>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-full text-gray-500 gap-2 text-sm">
                            <Loader2 size={16} className="animate-spin" /> Chargement…
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                            <MessageSquare size={26} className="text-gray-700 mb-3" />
                            <p className="text-sm text-gray-500">Aucun message pour l'instant.</p>
                            <p className="text-xs text-gray-600 mt-1">Écrivez le premier message ci-dessous.</p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isMine = msg.sender_id === currentUser?.id;
                            return (
                                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] p-3.5 ${isMine ? 'bg-mv-gold text-black rounded-l-2xl rounded-tr-2xl' : 'bg-white/10 text-white rounded-r-2xl rounded-tl-2xl'}`}>
                                        {!isMine && (
                                            <p className="text-[11px] text-mv-gold mb-1 font-bold">{msg.sender?.name || 'Interlocuteur'}</p>
                                        )}
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                                        <p className={`text-[10px] mt-1.5 text-right ${isMine ? 'text-black/50' : 'text-gray-500'}`}>
                                            {formatTime(msg.created_at)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Composer */}
                <div className="p-4 border-t border-white/10 shrink-0">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSend(); }}
                            placeholder="Écrivez votre message…"
                            className="flex-1 bg-black/30 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold/60 transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!text.trim() || sending}
                            aria-label="Envoyer le message"
                            className="px-4 rounded-xl bg-mv-gold text-black hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {sending ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};
