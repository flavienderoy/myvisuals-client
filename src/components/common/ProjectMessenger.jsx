import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Send, Loader2, MessageSquare, FolderOpen, Paperclip, FileText, Download, X, Check, CheckCheck, SmilePlus, Reply } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { messageService } from '../../services/messageService';
import { projectService } from '../../services/projectService';
import { useToast } from '../../hooks/useToast';
import { supabase } from '../../supabaseClient';

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

const initials = (name) => (name || '?').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

const Avatar = ({ src, name, size = 32 }) => (
    src ? (
        <img src={src} alt={name || ''} style={{ width: size, height: size }} className="rounded-full object-cover border border-white/10 shrink-0" />
    ) : (
        <div
            style={{ width: size, height: size }}
            className="rounded-full bg-gradient-to-br from-mv-gold to-orange-600 flex items-center justify-center text-black font-bold shrink-0"
        >
            <span style={{ fontSize: size * 0.4 }}>{initials(name)}</span>
        </div>
    )
);

export const ProjectMessenger = () => {
    const { projects, currentUser } = useData();
    const toast = useToast();

    const [selectedId, setSelectedId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [reads, setReads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    
    // Feature: Reply to message
    const [replyingTo, setReplyingTo] = useState(null);

    // File attachment states
    const [attachment, setAttachment] = useState(null);
    const fileInputRef = useRef(null);

    // Typing indicator
    const [typingUsers, setTypingUsers] = useState([]);
    const channelRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    const bottomRef = useRef(null);
    const containerRef = useRef(null);

    const EMOJIS = ['👍', '👎', '❤️', '🔥', '✅'];
    const [activeReactionId, setActiveReactionId] = useState(null);

    // Mentions
    const [projectMembers, setProjectMembers] = useState([]);
    const [mentionQuery, setMentionQuery] = useState('');
    const [showMentions, setShowMentions] = useState(false);
    const [mentions, setMentions] = useState([]);

    // Default to the first project
    useEffect(() => {
        if (!selectedId && projects.length > 0) setSelectedId(projects[0].id);
        if (selectedId) {
            projectService.getProjectMembers(selectedId).then(setProjectMembers).catch(() => {});
            setMentions([]);
            setShowMentions(false);
            setMentionQuery('');
        }
    }, [projects, selectedId]);

    const loadMessages = useCallback(async (projectId) => {
        setLoading(true);
        try {
            const data = await messageService.getMessages(projectId);
            const msgs = data.messages || data; // backward compatibility
            const rd = data.reads || [];
            setMessages(Array.isArray(msgs) ? msgs : []);
            setReads(rd);

            await messageService.markAsRead(projectId);
        } catch {
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Scroll to bottom logic
    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleScroll = async () => {
        if (!containerRef.current || !selectedId) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isBottom = scrollHeight - scrollTop - clientHeight < 50;
        if (isBottom) {
            try { await messageService.markAsRead(selectedId); } catch { /* ignore */ }
        }
    };

    useEffect(() => {
        if (!selectedId || !currentUser) return;

        loadMessages(selectedId);
        setAttachment(null);
        setText('');
        setReplyingTo(null);
        setTypingUsers([]);

        const channel = supabase.channel(`project:${selectedId}`, {
            config: { presence: { key: currentUser.id } }
        });

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const typing = Object.values(state)
                    .flat()
                    .filter(p => p.typing && p.user_id !== currentUser.id)
                    .map(p => p.name);
                setTypingUsers([...new Set(typing)]);
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ user_id: currentUser.id, name: currentUser.name, typing: false });
                }
            });

        channelRef.current = channel;

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
            }
        };
    }, [selectedId, loadMessages, currentUser]);

    useEffect(() => {
        scrollToBottom();
        if (selectedId) {
            messageService.markAsRead(selectedId).catch(() => {});
        }
    }, [messages, selectedId]);

    const handleTyping = (e) => {
        const val = e.target.value;
        setText(val);
        
        // Mentions detection
        const cursorPosition = e.target.selectionStart;
        const textBeforeCursor = val.slice(0, cursorPosition);
        const words = textBeforeCursor.split(/\s/);
        const lastWord = words[words.length - 1];
        
        if (lastWord.startsWith('@')) {
            setMentionQuery(lastWord.slice(1).toLowerCase());
            setShowMentions(true);
        } else {
            setShowMentions(false);
        }

        if (!channelRef.current) return;

        channelRef.current.track({ user_id: currentUser.id, name: currentUser.name, typing: true });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            channelRef.current?.track({ user_id: currentUser.id, name: currentUser.name, typing: false });
        }, 2000);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 20 * 1024 * 1024) {
            toast.error("Le fichier est trop volumineux (20 Mo max)");
            return;
        }
        setAttachment(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSend = async () => {
        const content = text.trim();
        if ((!content && !attachment) || !selectedId || sending) return;
        
        setSending(true);
        try {
            let fileData = null;

            if (attachment) {
                const ext = attachment.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
                const filePath = `${selectedId}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('message_attachments')
                    .upload(filePath, attachment, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) throw new Error("Erreur lors de l'envoi du fichier");

                const { data: urlData } = supabase.storage
                    .from('message_attachments')
                    .getPublicUrl(filePath);

                fileData = {
                    file_url: urlData.publicUrl,
                    file_name: attachment.name,
                    file_size: attachment.size,
                    file_type: attachment.type
                };
            }

            const payload = {
                content: content || null,
                reply_to_id: replyingTo?.id || null,
                mentions: mentions,
                ...fileData
            };

            const sent = await messageService.sendMessage(selectedId, payload);

            setMessages((prev) => [...prev, { ...sent, sender: { name: currentUser?.name, avatar_url: currentUser?.avatar } }]);
            setText('');
            setAttachment(null);
            setReplyingTo(null);
            setMentions([]);
            
            channelRef.current?.track({ user_id: currentUser.id, name: currentUser.name, typing: false });
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        } catch (e) {
            console.error(e);
            toast.error("Impossible d'envoyer le message");
        } finally {
            setSending(false);
        }
    };

    const handleReaction = async (messageId, emoji) => {
        try {
            const updatedMessage = await messageService.toggleReaction(messageId, emoji);
            setMessages(prev => prev.map(m => m.id === messageId ? { ...m, reactions: updatedMessage.reactions } : m));
        } catch (error) {
            toast.error("Erreur lors de l'ajout de la réaction");
        }
    };

    const scrollToMessage = (msgId) => {
        const el = document.getElementById(`msg-${msgId}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('bg-white/10');
            setTimeout(() => el.classList.remove('bg-white/10'), 1500);
        }
    };

    const formatBytes = (bytes) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const selectedProject = projects.find((p) => p.id === selectedId);

    const otherRead = reads.find(r => r.user_id !== currentUser?.id);
    const lastReadAt = otherRead ? new Date(otherRead.last_read_at) : null;
    
    const myMessages = messages.filter(m => m.sender_id === currentUser?.id);
    const lastMyMessage = myMessages[myMessages.length - 1];

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
            <aside className="w-56 md:w-72 shrink-0 border-r border-white/10 flex flex-col min-h-0 bg-black/20">
                <div className="p-4 border-b border-white/10 shrink-0">
                    <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Conversations</h3>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {projects.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setSelectedId(p.id)}
                            className={`w-full text-left px-4 py-3.5 flex items-center gap-3 border-b border-white/5 transition-colors ${selectedId === p.id ? 'bg-white/10' : 'hover:bg-white/5'}`}
                        >
                            <div className={`relative p-2 rounded-lg shrink-0 ${selectedId === p.id ? 'bg-mv-gold/15 text-mv-gold' : 'bg-white/5 text-gray-500'}`}>
                                <FolderOpen size={16} />
                                {p.has_unread && selectedId !== p.id && (
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black"></span>
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={`text-sm font-medium truncate flex justify-between items-center ${selectedId === p.id ? 'text-white' : p.has_unread ? 'text-white' : 'text-gray-300'}`}>
                                    {p.name}
                                </p>
                                <p className="text-[11px] text-gray-500 truncate">{p.client}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Thread */}
            <section className="flex-1 flex flex-col min-w-0 relative">
                <div className="px-5 py-3.5 border-b border-white/10 shrink-0 flex items-center justify-between bg-black/40">
                    <div>
                        <p className="text-sm font-bold text-white truncate">{selectedProject?.name}</p>
                        <p className="text-[11px] text-gray-500">Échangez sur ce projet — visible par le studio et le client.</p>
                    </div>
                </div>

                <div 
                    ref={containerRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-5"
                >
                    <div className="space-y-1.5">
                        {loading ? (
                            <div className="flex items-center justify-center py-10 text-gray-500 gap-2 text-sm">
                                <Loader2 size={16} className="animate-spin" /> Chargement…
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                                <MessageSquare size={26} className="text-gray-700 mb-3" />
                                <p className="text-sm text-gray-500">Aucun message pour l'instant.</p>
                                <p className="text-xs text-gray-600 mt-1">Écrivez le premier message ci-dessous.</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => {
                                const isMine = msg.sender_id === currentUser?.id;
                                const prev = messages[i - 1];
                                const next = messages[i + 1];

                                // Teams-like grouping logic: same sender AND less than 60 seconds apart
                                const isSameSenderAsPrev = prev && prev.sender_id === msg.sender_id;
                                const isWithin1MinFromPrev = prev && (new Date(msg.created_at) - new Date(prev.created_at) < 60000);
                                const firstOfGroup = !(isSameSenderAsPrev && isWithin1MinFromPrev);

                                const isSameSenderAsNext = next && next.sender_id === msg.sender_id;
                                const isWithin1MinFromNext = next && (new Date(next.created_at) - new Date(msg.created_at) < 60000);
                                const lastOfGroup = !(isSameSenderAsNext && isWithin1MinFromNext);

                                const senderName = isMine ? (currentUser?.name || 'Moi') : (msg.sender?.name || 'Interlocuteur');
                                const senderAvatar = isMine ? currentUser?.avatar : msg.sender?.avatar_url;
                                const isImage = msg.file_type?.startsWith('image/');
                                
                                const reactionsObj = msg.reactions || {};
                                const reactionCounts = {};
                                const myReactions = [];
                                Object.entries(reactionsObj).forEach(([uid, emoji]) => {
                                    if (uid === currentUser?.id) myReactions.push(emoji);
                                    reactionCounts[emoji] = (reactionCounts[emoji] || 0) + 1;
                                });

                                // Find replied message content
                                const repliedMsg = msg.reply_to_id ? messages.find(m => m.id === msg.reply_to_id) : null;

                                return (
                                    <div 
                                        key={msg.id} 
                                        id={`msg-${msg.id}`}
                                        className={`group flex items-start gap-3 ${isMine ? 'flex-row-reverse' : ''} ${firstOfGroup ? 'mt-5' : 'mt-0.5'} transition-colors duration-500 rounded-lg`}
                                    >
                                        <div className="w-8 shrink-0 flex justify-center mt-0.5">
                                            {firstOfGroup ? <Avatar src={senderAvatar} name={senderName} size={32} /> : <div className="w-8" />}
                                        </div>
                                        <div className={`flex flex-col max-w-[80%] relative ${isMine ? 'items-end' : 'items-start'}`}>
                                            {firstOfGroup && (
                                                <div className={`flex items-baseline gap-2 mb-1 px-1 ${isMine ? 'flex-row-reverse' : ''}`}>
                                                    <span className="text-[12px] font-bold text-gray-300">{senderName}</span>
                                                    <span className="text-[10px] text-gray-500">{formatTime(msg.created_at)}</span>
                                                </div>
                                            )}

                                            <div className={`relative group/bubble flex items-center gap-2 w-full ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                
                                                {/* Action Bar (Hover) */}
                                                <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center gap-1 z-20 ${isMine ? '-left-2 -translate-x-full' : '-right-2 translate-x-full'}`}>
                                                    <button
                                                        onClick={() => setActiveReactionId(activeReactionId === msg.id ? null : msg.id)}
                                                        className="flex items-center justify-center w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                                                        title="Réagir"
                                                    >
                                                        <SmilePlus size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => setReplyingTo(msg)}
                                                        className="flex items-center justify-center w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                                                        title="Répondre"
                                                    >
                                                        <Reply size={14} />
                                                    </button>
                                                </div>

                                                {/* Reaction Popover (Click) */}
                                                {activeReactionId === msg.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-20" onClick={() => setActiveReactionId(null)} />
                                                        <div className={`absolute top-0 -translate-y-[120%] backdrop-blur-md bg-black/70 border border-white/10 rounded-full px-2 py-1 flex items-center gap-1 z-30 shadow-2xl animate-fade-in ${isMine ? 'right-0' : 'left-0'}`}>
                                                            {EMOJIS.map(emoji => (
                                                                <button
                                                                    key={emoji}
                                                                    onClick={() => {
                                                                        handleReaction(msg.id, emoji);
                                                                        setActiveReactionId(null);
                                                                    }}
                                                                    className={`flex items-center justify-center w-8 h-8 text-base hover:scale-125 transition-transform rounded-full ${myReactions.includes(emoji) ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                                                >
                                                                    {emoji}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}

                                                {/* Bubble Body */}
                                                <div
                                                    className={`p-1 flex flex-col ${isMine
                                                        ? `bg-mv-gold text-black rounded-l-xl rounded-tr-xl ${!lastOfGroup ? 'rounded-br-sm' : 'rounded-br-xl'}`
                                                        : `bg-[#1e1e1e] border border-white/5 text-white rounded-r-xl rounded-tl-xl ${!lastOfGroup ? 'rounded-bl-sm' : 'rounded-bl-xl'}`
                                                        }`}
                                                >
                                                    {/* Quoted Message (Reply) */}
                                                    {repliedMsg && (
                                                        <button 
                                                            onClick={() => scrollToMessage(repliedMsg.id)}
                                                            className={`mb-1.5 px-2.5 py-1.5 text-left rounded-md border-l-2 text-xs truncate max-w-full hover:opacity-80 transition-opacity ${isMine ? 'bg-black/10 border-black/30 text-black/80' : 'bg-black/20 border-white/20 text-gray-300'}`}
                                                        >
                                                            <span className="font-bold mr-1">{repliedMsg.sender_id === currentUser?.id ? 'Moi' : repliedMsg.sender?.name}</span>
                                                            <span className="opacity-80">{repliedMsg.content || (repliedMsg.file_name ? 'Fichier joint' : '')}</span>
                                                        </button>
                                                    )}

                                                    {/* File Attachment Rendering */}
                                                    {msg.file_url && (
                                                        <div className={`overflow-hidden rounded-lg ${msg.content ? 'mb-1.5' : ''}`}>
                                                            {isImage ? (
                                                                <a href={msg.file_url} target="_blank" rel="noreferrer">
                                                                    <img src={msg.file_url} alt={msg.file_name} className="max-h-64 object-contain rounded-lg hover:opacity-90 transition-opacity" />
                                                                </a>
                                                            ) : (
                                                                <a 
                                                                    href={msg.file_url} 
                                                                    target="_blank" 
                                                                    rel="noreferrer"
                                                                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isMine ? 'bg-black/10 hover:bg-black/20 text-black' : 'bg-white/5 hover:bg-white/10 text-white'}`}
                                                                >
                                                                    <div className={`p-2 rounded-md shrink-0 ${isMine ? 'bg-black/20' : 'bg-white/10'}`}>
                                                                        <FileText size={18} />
                                                                    </div>
                                                                    <div className="min-w-0 pr-4">
                                                                        <p className="text-sm font-bold truncate">{msg.file_name}</p>
                                                                        <p className={`text-[10px] ${isMine ? 'text-black/70' : 'text-gray-400'}`}>{formatBytes(msg.file_size)}</p>
                                                                    </div>
                                                                    <Download size={14} className="ml-auto opacity-70" />
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    {/* Text Content */}
                                                    {msg.content && (
                                                        <div className={`px-2 py-1 text-[13px] leading-relaxed whitespace-pre-wrap break-words ${(!msg.file_url && !repliedMsg) ? 'pt-1.5 pb-1.5' : ''}`}>
                                                            {msg.content.split(/(@\S+)/g).map((part, idx) => 
                                                                part.startsWith('@') 
                                                                    ? <span key={idx} className="text-mv-gold font-bold bg-mv-gold/10 px-1 py-0.5 rounded mr-0.5">{part}</span> 
                                                                    : part
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Reactions Badges & Read Receipts Container */}
                                            <div className={`flex flex-wrap items-center gap-1.5 mt-0.5 w-full ${isMine ? 'justify-end pr-1' : 'justify-start pl-1'}`}>
                                                {/* Reactions */}
                                                {Object.keys(reactionCounts).length > 0 && (
                                                    <div className="flex flex-wrap gap-1 z-10 -translate-y-1.5">
                                                        {Object.entries(reactionCounts).map(([emoji, count]) => (
                                                            <button 
                                                                key={emoji}
                                                                onClick={() => handleReaction(msg.id, emoji)}
                                                                className={`text-[11px] px-1.5 py-0.5 rounded-full border shadow-sm flex items-center gap-1 ${myReactions.includes(emoji) ? 'bg-mv-gold/20 border-mv-gold/30 text-white' : 'bg-[#1a1a1a] border-white/10 text-gray-400 hover:text-white'}`}
                                                            >
                                                                {emoji} <span className="opacity-70 text-[10px] font-medium">{count > 1 ? count : ''}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Read Receipts */}
                                                {lastOfGroup && isMine && lastMyMessage?.id === msg.id && (
                                                    <div className="text-mv-gold opacity-90 mb-1 ml-1 flex items-center">
                                                        {lastReadAt && new Date(msg.created_at) <= lastReadAt ? (
                                                            <span title="Vu"><CheckCheck size={14} /></span>
                                                        ) : (
                                                            <span title="Envoyé" className="opacity-50"><Check size={14} /></span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        
                        {/* Teams-like Typing Indicator */}
                        {typingUsers.length > 0 && (
                            <div className="flex items-start gap-3 mt-4 animate-fade-in">
                                <div className="w-8 shrink-0" />
                                <div className="bg-[#1e1e1e] border border-white/5 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span className="text-[11px] text-gray-500 font-medium mt-auto mb-1">
                                    {typingUsers.join(', ')} {typingUsers.length > 1 ? 'écrivent' : 'écrit'}...
                                </span>
                            </div>
                        )}
                        <div ref={bottomRef} className="h-4" />
                    </div>
                </div>

                {/* Composer */}
                <div className="p-4 bg-[#0a0a0a] border-t border-white/10 shrink-0 z-20">
                    
                    {/* Reply Bar */}
                    {replyingTo && (
                        <div className="mb-2 flex items-center gap-3 p-2.5 bg-white/5 border border-white/10 rounded-lg animate-fade-in">
                            <div className="p-1.5 bg-white/10 text-gray-300 rounded-md">
                                <Reply size={14} />
                            </div>
                            <div className="min-w-0 flex-1 border-l-2 border-mv-gold/50 pl-2">
                                <p className="text-[11px] font-bold text-gray-400">Réponse à {replyingTo.sender_id === currentUser?.id ? 'vous-même' : replyingTo.sender?.name}</p>
                                <p className="text-xs text-gray-300 truncate">{replyingTo.content || (replyingTo.file_name ? 'Fichier joint' : '')}</p>
                            </div>
                            <button 
                                onClick={() => setReplyingTo(null)}
                                className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    {/* Attachment preview */}
                    {attachment && (
                        <div className="mb-2 flex items-center gap-3 p-2.5 bg-white/5 border border-white/10 rounded-lg animate-fade-in">
                            <div className="p-1.5 bg-mv-gold/10 text-mv-gold rounded-md">
                                {attachment.type.startsWith('image/') ? <Paperclip size={14} /> : <FileText size={14} />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-medium text-white truncate">{attachment.name}</p>
                                <p className="text-[10px] text-gray-500">{formatBytes(attachment.size)}</p>
                            </div>
                            <button 
                                onClick={() => setAttachment(null)}
                                className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    <div className="flex items-end gap-2">
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={sending}
                            className="p-3 mb-0.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 disabled:opacity-50"
                            aria-label="Joindre un fichier"
                        >
                            <Paperclip size={20} />
                        </button>
                        <div className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl flex items-center focus-within:border-mv-gold/50 transition-colors relative shadow-inner">
                            <textarea
                                value={text}
                                onChange={handleTyping}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                placeholder="Tapez votre message..."
                                rows={Math.min(5, text.split('\n').length)}
                                className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none resize-none max-h-32 scrollbar-hide"
                                style={{ minHeight: '46px' }}
                            />
                            
                            {/* Mentions Popover */}
                            {showMentions && projectMembers.length > 0 && (
                                <div className="absolute bottom-full mb-2 left-0 w-64 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                                    {projectMembers.filter(m => m.name?.toLowerCase().includes(mentionQuery)).map(m => (
                                        <button 
                                            key={m.id}
                                            onClick={() => {
                                                const words = text.split(/\s/);
                                                words.pop();
                                                const newText = words.join(' ') + (words.length > 0 ? ' ' : '') + `@${m.name} `;
                                                setText(newText);
                                                setShowMentions(false);
                                                if (!mentions.includes(m.id)) {
                                                    setMentions([...mentions, m.id]);
                                                }
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-white/5 flex items-center gap-3 transition-colors"
                                        >
                                            <Avatar src={m.avatar_url} name={m.name} size={24} />
                                            <span className="text-sm text-white font-medium">{m.name}</span>
                                            {m.type === 'client' && <span className="ml-auto text-[10px] text-mv-gold uppercase font-bold bg-mv-gold/10 px-1.5 rounded">Client</span>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={(!text.trim() && !attachment) || sending}
                            aria-label="Envoyer le message"
                            className="p-3 mb-0.5 rounded-xl bg-mv-gold text-black hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-lg"
                        >
                            {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};
