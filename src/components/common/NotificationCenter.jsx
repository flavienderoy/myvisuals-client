import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff, X, Check, MessageSquare, MessageCircle, AtSign, CheckCircle, CheckCheck } from 'lucide-react';
import { notificationService } from '../../services/notificationService';

// Per-type presentation: icon, accent color, and the verb used in the sentence.
const TYPE_CONFIG = {
    annotation: { Icon: MessageSquare, color: 'text-mv-gold', bg: 'bg-mv-gold/15', ring: 'ring-mv-gold/30', verb: 'a commenté' },
    mention: { Icon: AtSign, color: 'text-mv-gold', bg: 'bg-mv-gold/15', ring: 'ring-mv-gold/30', verb: 'vous a mentionné' },
    message: { Icon: MessageCircle, color: 'text-sky-400', bg: 'bg-sky-500/15', ring: 'ring-sky-500/30', verb: 'a écrit' },
    status: { Icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/15', ring: 'ring-emerald-500/30', verb: null },
};

const initials = (name) => (name || '?').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

const relativeTime = (iso) => {
    if (!iso) return '';
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return "à l'instant";
    if (s < 3600) return `il y a ${Math.floor(s / 60)} min`;
    if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`;
    if (s < 604800) return `il y a ${Math.floor(s / 86400)} j`;
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
};

const NotificationItem = ({ notification, onMarkRead, onDismiss, onClick }) => {
    const cfg = TYPE_CONFIG[notification.type] || TYPE_CONFIG.status;
    const { Icon } = cfg;
    const actorName = notification.actor?.name || 'Quelqu\'un';
    const unread = !notification.read;

    return (
        <div
            onClick={() => onClick(notification)}
            className={`group relative flex gap-3 px-4 py-3.5 cursor-pointer transition-colors ${unread ? 'bg-mv-gold/[0.04] hover:bg-mv-gold/[0.08]' : 'hover:bg-white/[0.04]'}`}
        >
            {/* Unread accent */}
            {unread && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-mv-gold" />}

            {/* Avatar + type badge */}
            <div className="relative shrink-0">
                {notification.actor?.avatar_url ? (
                    <img src={notification.actor.avatar_url} alt={actorName} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-mv-gold to-orange-600 flex items-center justify-center text-black text-xs font-bold">
                        {initials(actorName)}
                    </div>
                )}
                <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${cfg.bg} ring-2 ring-mv-dark flex items-center justify-center`}>
                    <Icon className={`${cfg.color} w-3 h-3`} />
                </span>
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300 leading-snug">
                    <span className="font-semibold text-white">{actorName}</span>
                    {cfg.verb ? (
                        <>
                            {' '}{cfg.verb}
                            {notification.message ? <span className="text-gray-400"> : {notification.message}</span> : ''}
                        </>
                    ) : (
                        <span className="text-gray-400"> {notification.message}</span>
                    )}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-gray-500">{relativeTime(notification.created_at)}</span>
                    {notification.project?.name && (
                        <span className="text-[11px] text-gray-600 truncate">· {notification.project.name}</span>
                    )}
                </div>
            </div>

            {/* Hover actions */}
            <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {unread && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id); }}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        title="Marquer comme lu"
                        aria-label="Marquer comme lu"
                    >
                        <Check className="text-emerald-400" size={14} />
                    </button>
                )}
                <button
                    onClick={(e) => { e.stopPropagation(); onDismiss(notification.id); }}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    title="Supprimer"
                    aria-label="Supprimer"
                >
                    <X className="text-gray-500" size={14} />
                </button>
            </div>
        </div>
    );
};

export const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();
    const { notifications, setNotifications, currentUser, selectProject } = useData();

    const unreadCount = notifications.filter((n) => !n.read).length;
    const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
        } catch (e) { console.error(e); }
    };

    const dismiss = async (id) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch (e) { console.error(e); }
    };

    const markAll = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        } catch (e) { console.error(e); }
    };

    // Deep-link: comments open the image with the annotation highlighted;
    // chat messages open the project conversation.
    const handleClick = (n) => {
        if (!n.read) markAsRead(n.id);
        setIsOpen(false);
        if (n.asset_id) {
            navigate(`/assets/${n.asset_id}${n.annotation_id ? `?comment=${n.annotation_id}` : ''}`);
        } else if (n.type === 'message') {
            navigate(currentUser?.role === 'client' ? '/client/messages' : '/messages');
        } else if (n.project_id) {
            navigate('/studio');
            selectProject?.(n.project_id);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Notifications"
            >
                <Bell className="text-gray-400" size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-mv-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute left-0 top-full mt-2 w-[22rem] max-w-[calc(100vw-2rem)] bg-mv-dark border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in-down">
                        {/* Header */}
                        <div className="p-3 border-b border-white/10 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === 'all' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    Toutes
                                </button>
                                <button
                                    onClick={() => setFilter('unread')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === 'unread' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    Non lues {unreadCount > 0 && <span className="text-mv-gold">({unreadCount})</span>}
                                </button>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAll}
                                    className="ml-auto flex items-center gap-1 text-[11px] text-gray-400 hover:text-mv-gold transition-colors"
                                >
                                    <CheckCheck size={13} /> Tout lire
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[26rem] overflow-y-auto divide-y divide-white/5">
                            {filtered.length === 0 ? (
                                <div className="p-10 text-center">
                                    <BellOff className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">
                                        {filter === 'unread' ? 'Tout est à jour ✨' : 'Aucune notification'}
                                    </p>
                                </div>
                            ) : (
                                filtered.map((n) => (
                                    <NotificationItem
                                        key={n.id}
                                        notification={n}
                                        onMarkRead={markAsRead}
                                        onDismiss={dismiss}
                                        onClick={handleClick}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
