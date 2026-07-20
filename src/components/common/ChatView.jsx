import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Send, Loader2, MessageSquare, Paperclip, FileText, Download, X, Check, CheckCheck,
    SmilePlus, Reply, Plus, Search, Hash, Users, FolderOpen, ArrowLeft, UserPlus, Eye,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { conversationService } from '../../services/conversationService';
import { messageService } from '../../services/messageService';
import { useToast } from '../../hooks/useToast';
import { supabase } from '../../supabaseClient';

const EMOJIS = ['👍', '👎', '❤️', '🔥', '✅'];

const initials = (name) => (name || '?').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
const formatTime = (iso) => {
    if (!iso) return '';
    try {
        const d = new Date(iso);
        return d.toDateString() === new Date().toDateString()
            ? d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            : d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
};
const formatBytes = (b) => {
    if (!b) return '';
    const k = 1024, s = ['o', 'Ko', 'Mo', 'Go'], i = Math.floor(Math.log(b) / Math.log(k));
    return `${parseFloat((b / Math.pow(k, i)).toFixed(1))} ${s[i]}`;
};

const Avatar = ({ src, name, size = 32 }) => (
    src ? (
        <img src={src} alt={name || ''} style={{ width: size, height: size }} className="rounded-full object-cover border border-white/10 shrink-0" />
    ) : (
        <div style={{ width: size, height: size }} className="rounded-full bg-gradient-to-br from-mv-gold to-orange-600 flex items-center justify-center text-black font-bold shrink-0">
            <span style={{ fontSize: size * 0.4 }}>{initials(name)}</span>
        </div>
    )
);

// Display metadata for a conversation from the current user's point of view
const useConversationMeta = (convo, myId) => useMemo(() => {
    if (!convo) return { name: '', subtitle: '', kind: 'group' };
    if (convo.type === 'direct') {
        const other = (convo.participants || []).map((p) => p.profile).find((p) => p && p.id !== myId);
        return { name: other?.name || 'Direct', subtitle: 'Message direct', kind: 'direct', avatar: other?.avatar_url, avatarName: other?.name };
    }
    if (convo.type === 'project') {
        return { name: convo.project?.name || 'Projet', subtitle: 'Canal du projet', kind: 'project' };
    }
    return { name: convo.title || 'Groupe', subtitle: `${(convo.participants || []).length} participants`, kind: 'group' };
}, [convo, myId]);

const ConversationRow = ({ convo, active, myId, onClick }) => {
    const meta = useConversationMeta(convo, myId);
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-3 py-2.5 flex items-center gap-3 rounded-lg transition-colors ${active ? 'bg-white/10' : 'hover:bg-white/5'}`}
        >
            {meta.kind === 'direct'
                ? <Avatar src={meta.avatar} name={meta.avatarName} size={38} />
                : (
                    <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0 ${meta.kind === 'project' ? 'bg-mv-gold/15 text-mv-gold' : 'bg-white/10 text-gray-300'}`}>
                        {meta.kind === 'project' ? <FolderOpen size={17} /> : <Hash size={17} />}
                    </div>
                )}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium truncate flex-1 ${convo.unread > 0 ? 'text-white' : 'text-gray-300'}`}>{meta.name}</p>
                    {convo.lastMessage && <span className="text-[10px] text-gray-600 shrink-0">{formatTime(convo.lastMessage.created_at)}</span>}
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-[11px] text-gray-500 truncate flex-1">{convo.lastMessage?.preview || meta.subtitle}</p>
                    {convo.unread > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1 bg-mv-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                            {convo.unread > 9 ? '9+' : convo.unread}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
};

export const ChatView = ({ fullPage = false }) => {
    const { currentUser } = useData();
    const toast = useToast();
    const myId = currentUser?.id;
    const isClient = currentUser?.role === 'client';

    const [conversations, setConversations] = useState([]);
    const [loadingList, setLoadingList] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [mobilePane, setMobilePane] = useState('list'); // list | thread (mobile)

    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [activeReactionId, setActiveReactionId] = useState(null);
    const [typingUsers, setTypingUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [newOpen, setNewOpen] = useState(false);

    // mentions
    const [mentionQuery, setMentionQuery] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    const [mentions, setMentions] = useState([]);

    const fileInputRef = useRef(null);
    const bottomRef = useRef(null);
    const channelRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const messagesContainerRef = useRef(null);

    // Scroll to a specific message and highlight it with a gold glow
    const scrollToMessage = useCallback((messageId) => {
        const el = document.getElementById(`cmsg-${messageId}`);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.animation = 'none';
        // Force reflow to restart animation
        void el.offsetHeight;
        el.style.animation = 'message-glow 1.5s ease-out';
        el.style.borderRadius = '12px';
        setTimeout(() => { el.style.animation = ''; }, 1600);
    }, []);

    const selected = conversations.find((c) => c.id === selectedId) || null;
    const selectedMeta = useConversationMeta(selected, myId);
    const members = useMemo(() => (selected?.participants || []).map((p) => p.profile).filter((p) => p && p.id !== myId), [selected, myId]);

    const loadList = useCallback(async (autoselect = false) => {
        try {
            const data = await conversationService.list();
            setConversations(Array.isArray(data) ? data : []);
            if (autoselect && !selectedId && data.length) setSelectedId(data[0].id);
        } catch {
            setConversations([]);
        } finally {
            setLoadingList(false);
        }
    }, [selectedId]);

    useEffect(() => { loadList(true); }, [loadList]);

    // Live unread: bump the rail when a message lands in a conversation that
    // isn't currently open (the open one is handled by its own subscription).
    const conversationsRef = useRef(conversations);
    const selectedIdRef = useRef(selectedId);
    useEffect(() => { conversationsRef.current = conversations; }, [conversations]);
    useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);
    useEffect(() => {
        if (!myId) return;
        const ch = supabase.channel('messages-global')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
                const m = payload.new;
                if (!m || m.sender_id === myId || m.conversation_id === selectedIdRef.current) return;
                if (!conversationsRef.current.some((c) => c.id === m.conversation_id)) return;
                setConversations((prev) => {
                    const idx = prev.findIndex((c) => c.id === m.conversation_id);
                    if (idx === -1) return prev;
                    const preview = (m.content || (m.file_name ? '📎 Pièce jointe' : '')).slice(0, 60);
                    const bumped = { ...prev[idx], unread: (prev[idx].unread || 0) + 1, updated_at: m.created_at, lastMessage: { content: m.content, created_at: m.created_at, preview } };
                    return [bumped, ...prev.filter((_, i) => i !== idx)];
                });
            })
            .subscribe();
        return () => supabase.removeChannel(ch);
    }, [myId]);

    // Load messages + realtime for the selected conversation
    useEffect(() => {
        if (!selectedId || !myId) return;
        let mounted = true;
        setLoadingMsgs(true);
        setReplyingTo(null); setAttachment(null); setText(''); setTypingUsers([]);

        conversationService.getMessages(selectedId)
            .then((data) => { if (mounted) setMessages(Array.isArray(data) ? data : []); })
            .catch(() => { if (mounted) setMessages([]); })
            .finally(() => { if (mounted) setLoadingMsgs(false); });

        conversationService.markRead(selectedId).then(() => {
            setConversations((prev) => prev.map((c) => (c.id === selectedId ? { ...c, unread: 0 } : c)));
        }).catch(() => {});

        const channel = supabase.channel(`conversation:${selectedId}`, { config: { presence: { key: myId } } });
        channel
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedId}` }, (payload) => {
                const m = payload.new;
                if (m.sender_id === myId) return; // already added optimistically
                const sender = (selected?.participants || []).map((p) => p.profile).find((p) => p?.id === m.sender_id) || null;
                setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, { ...m, sender }]));
                conversationService.markRead(selectedId).catch(() => {});
            })
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const typing = Object.values(state).flat().filter((p) => p.typing && p.user_id !== myId).map((p) => p.name);
                setTypingUsers([...new Set(typing)]);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') await channel.track({ user_id: myId, name: currentUser?.name, typing: false });
            });
        channelRef.current = channel;

        return () => { mounted = false; if (channelRef.current) supabase.removeChannel(channelRef.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedId, myId]);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typingUsers]);

    const onType = (e) => {
        const val = e.target.value;
        setText(val);
        const before = val.slice(0, e.target.selectionStart);
        const lastWord = before.split(/\s/).pop();
        if (lastWord.startsWith('@')) { setMentionQuery(lastWord.slice(1).toLowerCase()); setShowMentions(true); }
        else setShowMentions(false);

        if (channelRef.current) {
            channelRef.current.track({ user_id: myId, name: currentUser?.name, typing: true });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => channelRef.current?.track({ user_id: myId, name: currentUser?.name, typing: false }), 2000);
        }
    };

    const handleSend = async () => {
        const content = text.trim();
        if ((!content && !attachment) || !selectedId || sending) return;
        setSending(true);
        try {
            let fileData = null;
            if (attachment) {
                const ext = attachment.name.split('.').pop();
                const path = `${selectedId}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
                const { error: upErr } = await supabase.storage.from('message_attachments').upload(path, attachment, { upsert: false });
                if (upErr) throw new Error('upload');
                const { data: urlData } = supabase.storage.from('message_attachments').getPublicUrl(path);
                fileData = { file_url: urlData.publicUrl, file_name: attachment.name, file_size: attachment.size, file_type: attachment.type };
            }
            const sent = await conversationService.sendMessage(selectedId, {
                content: content || null, reply_to_id: replyingTo?.id || null, mentions, ...fileData,
            });
            setMessages((prev) => [...prev, { ...sent, sender: { id: myId, name: currentUser?.name, avatar_url: currentUser?.avatar } }]);
            setText(''); setAttachment(null); setReplyingTo(null); setMentions([]); setShowMentions(false);
            channelRef.current?.track({ user_id: myId, name: currentUser?.name, typing: false });
            loadList();
        } catch {
            toast.error("Impossible d'envoyer le message");
        } finally {
            setSending(false);
        }
    };

    const handleReaction = async (messageId, emoji) => {
        try {
            const updated = await messageService.toggleReaction(messageId, emoji);
            setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, reactions: updated.reactions } : m)));
        } catch {
            toast.error('Réaction impossible');
        }
    };

    const grouped = useMemo(() => {
        const q = search.trim().toLowerCase();
        const nameOf = (c) => (c.type === 'direct'
            ? (c.participants || []).map((p) => p.profile).find((p) => p && p.id !== myId)?.name
            : c.type === 'project' ? c.project?.name : c.title) || '';
        const filtered = conversations
            .map((c) => ({ c, name: nameOf(c) }))
            .filter(({ name }) => !q || name.toLowerCase().includes(q));
        return {
            projects: filtered.filter(({ c }) => c.type === 'project'),
            groups: filtered.filter(({ c }) => c.type === 'group'),
            directs: filtered.filter(({ c }) => c.type === 'direct'),
        };
    }, [conversations, search, myId]);

    const openConversation = (id) => { setSelectedId(id); setMobilePane('thread'); };

    return (
        <div className={`flex overflow-hidden ${fullPage ? 'h-full w-full' : 'h-[calc(100dvh-14rem)] min-h-[440px] bg-white/[0.03] border border-white/10 rounded-2xl'}`}>
            {/* ===== Rail ===== */}
            <aside className={`w-full md:w-80 shrink-0 border-r border-white/10 flex flex-col min-h-0 ${fullPage ? 'bg-[#0a0a0a]' : 'bg-black/20'} ${mobilePane === 'thread' ? 'hidden md:flex' : 'flex'}`}>
                <div className={`shrink-0 border-b border-white/10 ${fullPage ? 'px-5 pt-6 pb-4 space-y-4' : 'p-3 space-y-3'}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            {fullPage && <h1 className="text-xl font-bold text-white tracking-tight">Messagerie</h1>}
                            {!fullPage && <h3 className="text-sm font-bold text-white">Messages</h3>}
                            {fullPage && <p className="text-xs text-gray-500 mt-0.5">Projets, groupes et messages directs</p>}
                        </div>
                        <button onClick={() => setNewOpen(true)} className={`rounded-lg bg-mv-gold text-black flex items-center justify-center hover:bg-white transition-colors ${fullPage ? 'w-9 h-9' : 'w-8 h-8'}`} aria-label="Nouvelle conversation">
                            <Plus size={17} />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2.5 focus-within:border-mv-gold/30 transition-colors">
                        <Search size={14} className="text-gray-500" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-4">
                    {loadingList ? (
                        <div className="flex items-center justify-center py-10 text-gray-500 gap-2 text-sm"><Loader2 size={16} className="animate-spin" /> Chargement…</div>
                    ) : conversations.length === 0 ? (
                        <div className="text-center py-16 px-6">
                            <MessageSquare size={26} className="text-gray-700 mx-auto mb-3" />
                            <p className="text-sm text-gray-500">Aucune conversation.</p>
                            <button onClick={() => setNewOpen(true)} className="mt-3 text-xs text-mv-gold hover:text-white transition-colors">Démarrer une conversation</button>
                        </div>
                    ) : (
                        <>
                            {[['Projets', grouped.projects], ['Groupes', grouped.groups], ['Directs', grouped.directs]].map(([label, list]) => (
                                list.length > 0 && (
                                    <div key={label}>
                                        <p className="px-2 mb-1 text-[10px] font-bold text-gray-600 uppercase tracking-widest">{label}</p>
                                        <div className="space-y-0.5">
                                            {list.map(({ c }) => (
                                                <ConversationRow key={c.id} convo={c} active={c.id === selectedId} myId={myId} onClick={() => openConversation(c.id)} />
                                            ))}
                                        </div>
                                    </div>
                                )
                            ))}
                        </>
                    )}
                </div>
            </aside>

            {/* ===== Thread ===== */}
            <section className={`flex-1 flex-col min-w-0 relative ${fullPage ? 'bg-[#060606]' : ''} ${mobilePane === 'thread' ? 'flex' : 'hidden md:flex'}`}>
                {!selected ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
                            <MessageSquare size={28} className="text-gray-600" />
                        </div>
                        <p className="text-base font-semibold text-gray-400 mb-1">Aucune conversation sélectionnée</p>
                        <p className="text-sm text-gray-600">Choisissez une conversation dans la liste<br/>ou démarrez-en une nouvelle.</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className={`px-5 py-3.5 border-b border-white/[0.06] shrink-0 flex items-center gap-3 ${fullPage ? 'bg-[#0a0a0a]/80 backdrop-blur-xl' : 'bg-black/40'}`}>
                            <button onClick={() => setMobilePane('list')} className="md:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-white/10 text-gray-400" aria-label="Retour"><ArrowLeft size={18} /></button>
                            {selectedMeta.kind === 'direct'
                                ? <Avatar src={selectedMeta.avatar} name={selectedMeta.avatarName} size={36} />
                                : <div className={`w-[36px] h-[36px] rounded-full flex items-center justify-center ${selectedMeta.kind === 'project' ? 'bg-mv-gold/15 text-mv-gold' : 'bg-white/10 text-gray-300'}`}>{selectedMeta.kind === 'project' ? <FolderOpen size={16} /> : <Hash size={16} />}</div>}
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-white truncate">{selectedMeta.name}</p>
                                <p className="text-[11px] text-gray-500 truncate">
                                    {selected.type === 'direct' ? 'Message direct' : (selected.participants || []).map((p) => p.profile?.name).filter(Boolean).slice(0, 4).join(', ')}
                                </p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {loadingMsgs ? (
                                <div className="flex items-center justify-center py-10 text-gray-500 gap-2 text-sm"><Loader2 size={16} className="animate-spin" /> Chargement…</div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                                    <MessageSquare size={26} className="text-gray-700 mb-3" />
                                    <p className="text-sm text-gray-500">Aucun message.</p>
                                    <p className="text-xs text-gray-600 mt-1">Écrivez le premier message ci-dessous.</p>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    {messages.map((msg, i) => {
                                        const isMine = msg.sender_id === myId;
                                        const prev = messages[i - 1], next = messages[i + 1];
                                        const firstOfGroup = !(prev && prev.sender_id === msg.sender_id && (new Date(msg.created_at) - new Date(prev.created_at) < 60000));
                                        const lastOfGroup = !(next && next.sender_id === msg.sender_id && (new Date(next.created_at) - new Date(msg.created_at) < 60000));
                                        const senderName = isMine ? (currentUser?.name || 'Moi') : (msg.sender?.name || 'Interlocuteur');
                                        const senderAvatar = isMine ? currentUser?.avatar : msg.sender?.avatar_url;
                                        const isImage = msg.file_type?.startsWith('image/');
                                        const reactionsObj = msg.reactions || {};
                                        const reactionCounts = {}; const myReactions = [];
                                        Object.entries(reactionsObj).forEach(([uid, emoji]) => { if (uid === myId) myReactions.push(emoji); reactionCounts[emoji] = (reactionCounts[emoji] || 0) + 1; });
                                        const repliedMsg = msg.reply_to_id ? messages.find((m) => m.id === msg.reply_to_id) : null;

                                        return (
                                            <div key={msg.id} id={`cmsg-${msg.id}`} className={`group flex items-start gap-3 ${isMine ? 'flex-row-reverse' : ''} ${firstOfGroup ? 'mt-5' : 'mt-0.5'} rounded-lg`}>
                                                <div className="w-8 shrink-0 flex justify-center mt-0.5">{firstOfGroup ? <Avatar src={senderAvatar} name={senderName} size={32} /> : <div className="w-8" />}</div>
                                                <div className={`flex flex-col max-w-[80%] relative ${isMine ? 'items-end' : 'items-start'}`}>
                                                    {firstOfGroup && (
                                                        <div className={`flex items-baseline gap-2 mb-1 px-1 ${isMine ? 'flex-row-reverse' : ''}`}>
                                                            <span className="text-[12px] font-bold text-gray-300">{senderName}</span>
                                                            <span className="text-[10px] text-gray-500">{formatTime(msg.created_at)}</span>
                                                        </div>
                                                    )}
                                                    <div className={`relative group/bubble flex items-center gap-2 w-full ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center gap-1 z-20 ${isMine ? '-left-2 -translate-x-full' : '-right-2 translate-x-full'}`}>
                                                            <button onClick={() => setActiveReactionId(activeReactionId === msg.id ? null : msg.id)} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center" title="Réagir"><SmilePlus size={14} /></button>
                                                            <button onClick={() => setReplyingTo(msg)} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center" title="Répondre"><Reply size={14} /></button>
                                                        </div>
                                                        {activeReactionId === msg.id && (
                                                            <>
                                                                <div className="fixed inset-0 z-20" onClick={() => setActiveReactionId(null)} />
                                                                <div className={`absolute top-0 -translate-y-[120%] backdrop-blur-md bg-black/70 border border-white/10 rounded-full px-2 py-1 flex items-center gap-1 z-30 shadow-2xl ${isMine ? 'right-0' : 'left-0'}`}>
                                                                    {EMOJIS.map((emoji) => (
                                                                        <button key={emoji} onClick={() => { handleReaction(msg.id, emoji); setActiveReactionId(null); }} className={`w-8 h-8 text-base hover:scale-125 transition-transform rounded-full ${myReactions.includes(emoji) ? 'bg-white/20' : 'hover:bg-white/10'}`}>{emoji}</button>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}
                                                        <div className={`p-1 flex flex-col ${isMine ? `bg-mv-gold text-black rounded-l-xl rounded-tr-xl ${!lastOfGroup ? 'rounded-br-sm' : 'rounded-br-xl'}` : `bg-[#1e1e1e] border border-white/5 text-white rounded-r-xl rounded-tl-xl ${!lastOfGroup ? 'rounded-bl-sm' : 'rounded-bl-xl'}`}`}>
                                                            {repliedMsg && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); scrollToMessage(repliedMsg.id); }}
                                                                    className={`mb-1.5 px-2.5 py-1.5 rounded-md border-l-2 text-xs truncate max-w-full text-left cursor-pointer hover:opacity-80 transition-opacity ${isMine ? 'bg-black/10 border-black/30 text-black/80' : 'bg-black/20 border-white/20 text-gray-300'}`}
                                                                >
                                                                    <span className="font-bold mr-1">{repliedMsg.sender_id === myId ? 'Moi' : repliedMsg.sender?.name}</span>
                                                                    <span className="opacity-80">{repliedMsg.content || (repliedMsg.file_name ? 'Fichier joint' : '')}</span>
                                                                </button>
                                                            )}
                                                            {msg.file_url && (
                                                                <div className={`overflow-hidden rounded-lg ${msg.content ? 'mb-1.5' : ''}`}>
                                                                    {isImage ? (
                                                                        <a href={msg.file_url} target="_blank" rel="noreferrer"><img src={msg.file_url} alt={msg.file_name} className="max-h-64 object-contain rounded-lg hover:opacity-90 transition-opacity" /></a>
                                                                    ) : (
                                                                        <a href={msg.file_url} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-3 rounded-lg ${isMine ? 'bg-black/10 hover:bg-black/20 text-black' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                                                                            <div className={`p-2 rounded-md shrink-0 ${isMine ? 'bg-black/20' : 'bg-white/10'}`}><FileText size={18} /></div>
                                                                            <div className="min-w-0 pr-4"><p className="text-sm font-bold truncate">{msg.file_name}</p><p className={`text-[10px] ${isMine ? 'text-black/70' : 'text-gray-400'}`}>{formatBytes(msg.file_size)}</p></div>
                                                                            <Download size={14} className="ml-auto opacity-70" />
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            )}
                                                            {msg.content && (
                                                                <div className="px-2 py-1 text-[13px] leading-relaxed whitespace-pre-wrap break-words">
                                                                    {msg.content.split(/(@\S+)/g).map((part, idx) => part.startsWith('@')
                                                                        ? <span key={idx} className="text-mv-gold font-bold bg-mv-gold/10 px-1 py-0.5 rounded mr-0.5">{part}</span>
                                                                        : part)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {(Object.keys(reactionCounts).length > 0 || (lastOfGroup && isMine)) && (
                                                        <div className={`flex flex-wrap items-center gap-1.5 mt-0.5 w-full ${isMine ? 'justify-end pr-1' : 'justify-start pl-1'}`}>
                                                            {Object.entries(reactionCounts).map(([emoji, count]) => (
                                                                <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className={`text-[11px] px-1.5 py-0.5 rounded-full border flex items-center gap-1 ${myReactions.includes(emoji) ? 'bg-mv-gold/20 border-mv-gold/30 text-white' : 'bg-[#1a1a1a] border-white/10 text-gray-400 hover:text-white'}`}>{emoji} <span className="opacity-70 text-[10px]">{count > 1 ? count : ''}</span></button>
                                                            ))}
                                                            {lastOfGroup && isMine && (
                                                                <span className={`flex items-center gap-0.5 text-[10px] ml-1 ${(msg.read_by || []).length > 0 ? 'text-mv-gold' : 'text-gray-500'}`} title={(msg.read_by || []).length > 0 ? 'Lu' : 'Envoyé'}>
                                                                    {(msg.read_by || []).length > 0 ? <CheckCheck size={13} /> : <Check size={13} />}
                                                                    {(msg.read_by || []).length > 0 && <Eye size={11} className="opacity-60" />}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {typingUsers.length > 0 && (
                                        <div className="flex items-center gap-3 mt-4">
                                            <div className="w-8 shrink-0" />
                                            <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                                                {[0, 150, 300].map((d) => <span key={d} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                                            </div>
                                            <span className="text-[11px] text-gray-500">{typingUsers.join(', ')} {typingUsers.length > 1 ? 'écrivent' : 'écrit'}…</span>
                                        </div>
                                    )}
                                    <div ref={bottomRef} className="h-2" />
                                </div>
                            )}
                        </div>

                        {/* Composer */}
                        <div className={`p-3 border-t border-white/[0.06] shrink-0 ${fullPage ? 'bg-[#0a0a0a] px-5 py-4' : 'bg-[#0a0a0a]'}`}>
                            {replyingTo && (
                                <div className="mb-2 flex items-center gap-3 p-2.5 bg-white/5 border border-white/10 rounded-lg">
                                    <Reply size={14} className="text-gray-300" />
                                    <div className="min-w-0 flex-1 border-l-2 border-mv-gold/50 pl-2">
                                        <p className="text-[11px] font-bold text-gray-400">Réponse à {replyingTo.sender_id === myId ? 'vous-même' : replyingTo.sender?.name}</p>
                                        <p className="text-xs text-gray-300 truncate">{replyingTo.content || (replyingTo.file_name ? 'Fichier joint' : '')}</p>
                                    </div>
                                    <button onClick={() => setReplyingTo(null)} className="p-1 rounded-md hover:bg-white/10 text-gray-400"><X size={14} /></button>
                                </div>
                            )}
                            {attachment && (
                                <div className="mb-2 flex items-center gap-3 p-2.5 bg-white/5 border border-white/10 rounded-lg">
                                    <div className="p-1.5 bg-mv-gold/10 text-mv-gold rounded-md"><Paperclip size={14} /></div>
                                    <div className="min-w-0 flex-1"><p className="text-xs font-medium text-white truncate">{attachment.name}</p><p className="text-[10px] text-gray-500">{formatBytes(attachment.size)}</p></div>
                                    <button onClick={() => setAttachment(null)} className="p-1 rounded-md hover:bg-white/10 text-gray-400"><X size={14} /></button>
                                </div>
                            )}
                            <div className="flex items-end gap-2">
                                <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if (f && f.size <= 20 * 1024 * 1024) setAttachment(f); else if (f) toast.error('Fichier trop volumineux (20 Mo max)'); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="hidden" />
                                <button onClick={() => fileInputRef.current?.click()} className="p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 shrink-0" aria-label="Joindre"><Paperclip size={20} /></button>
                                <div className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl flex items-center focus-within:border-mv-gold/50 relative">
                                    <textarea
                                        value={text} onChange={onType}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                        placeholder="Tapez votre message…" rows={Math.min(5, text.split('\n').length)}
                                        className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none resize-none max-h-32 scrollbar-hide" style={{ minHeight: '46px' }}
                                    />
                                    {showMentions && members.length > 0 && (
                                        <div className="absolute bottom-full mb-2 left-0 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                                            {members.filter((m) => m.name?.toLowerCase().includes(mentionQuery)).map((m) => (
                                                <button key={m.id} onClick={() => { const w = text.split(/\s/); w.pop(); setText(`${w.join(' ')}${w.length ? ' ' : ''}@${m.name} `); setShowMentions(false); if (!mentions.includes(m.id)) setMentions([...mentions, m.id]); }} className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center gap-3">
                                                    <Avatar src={m.avatar_url} name={m.name} size={24} /><span className="text-sm text-white font-medium">{m.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button onClick={handleSend} disabled={(!text.trim() && !attachment) || sending} className="p-3 rounded-xl bg-mv-gold text-black hover:bg-white disabled:opacity-40 shrink-0" aria-label="Envoyer">
                                    {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </section>

            {newOpen && (
                <NewConversationModal
                    isClient={isClient}
                    onClose={() => setNewOpen(false)}
                    onCreated={async (id) => { setNewOpen(false); await loadList(); setSelectedId(id); setMobilePane('thread'); }}
                    toast={toast}
                />
            )}
        </div>
    );
};

// ===== New conversation (DM or group) =====
const NewConversationModal = ({ isClient, onClose, onCreated, toast }) => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState('direct'); // direct | group
    const [picked, setPicked] = useState([]);
    const [title, setTitle] = useState('');
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        conversationService.contacts().then(setContacts).catch(() => setContacts([])).finally(() => setLoading(false));
    }, []);

    const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

    const submit = async () => {
        setBusy(true);
        try {
            if (mode === 'direct') {
                if (picked.length !== 1) { toast.error('Choisissez une personne'); setBusy(false); return; }
                const { id } = await conversationService.direct(picked[0]);
                onCreated(id);
            } else {
                if (!picked.length) { toast.error('Choisissez au moins un participant'); setBusy(false); return; }
                const convo = await conversationService.createGroup({ title: title.trim() || 'Nouveau groupe', participantIds: picked });
                onCreated(convo.id);
            }
        } catch {
            toast.error('Création impossible');
            setBusy(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div className="w-full max-w-md bg-mv-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                    <h3 className="text-white font-bold">Nouvelle conversation</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400"><X size={16} /></button>
                </div>

                {!isClient && (
                    <div className="p-3 flex gap-2 border-b border-white/10">
                        <button onClick={() => { setMode('direct'); setPicked([]); }} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'direct' ? 'bg-mv-gold text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}><UserPlus size={15} /> Message direct</button>
                        <button onClick={() => setMode('group')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${mode === 'group' ? 'bg-mv-gold text-black' : 'bg-white/5 text-gray-400 hover:text-white'}`}><Users size={15} /> Groupe</button>
                    </div>
                )}

                {mode === 'group' && !isClient && (
                    <div className="p-3 border-b border-white/10">
                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nom du groupe (ex : Retouches campagne)" className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold/50" />
                    </div>
                )}

                <div className="max-h-72 overflow-y-auto p-2">
                    {loading ? (
                        <div className="flex items-center justify-center py-8 text-gray-500 gap-2 text-sm"><Loader2 size={16} className="animate-spin" /> Chargement…</div>
                    ) : contacts.length === 0 ? (
                        <p className="text-center text-sm text-gray-500 py-8">Aucun contact disponible.</p>
                    ) : (
                        contacts.map((c) => (
                            <button key={c.id} onClick={() => (mode === 'direct' ? setPicked([c.id]) : toggle(c.id))} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${picked.includes(c.id) ? 'bg-mv-gold/10' : 'hover:bg-white/5'}`}>
                                <Avatar src={c.avatar_url} name={c.name} size={34} />
                                <div className="flex-1 text-left min-w-0">
                                    <p className="text-sm text-white font-medium truncate">{c.name || 'Sans nom'}</p>
                                    <p className="text-[11px] text-gray-500">{c.role === 'client' ? 'Client' : 'Studio'}</p>
                                </div>
                                {picked.includes(c.id) && <Check size={16} className="text-mv-gold shrink-0" />}
                            </button>
                        ))
                    )}
                </div>

                <div className="p-3 border-t border-white/10 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Annuler</button>
                    <button onClick={submit} disabled={busy || !picked.length} className="px-5 py-2 rounded-lg bg-mv-gold text-black font-bold text-sm hover:bg-white transition-colors disabled:opacity-50">
                        {busy ? <Loader2 size={16} className="animate-spin" /> : (mode === 'direct' ? 'Démarrer' : 'Créer le groupe')}
                    </button>
                </div>
            </div>
        </div>
    );
};
