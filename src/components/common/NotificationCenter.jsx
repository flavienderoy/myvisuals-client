import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Bell, BellOff, X, Check, MessageSquare, UserCheck, Upload, AlertTriangle } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { getActivityStyle } from '../../utils/permissions';

const NotificationItem = ({ notification, onMarkRead, onDismiss, onClick }) => {
    const style = getActivityStyle(notification.type);

    const icons = {
        comment: MessageSquare,
        task_assigned: UserCheck,
        upload: Upload,
        mention: AlertTriangle,
        approve: Check,
    };

    const Icon = icons[notification.type] || Bell;

    return (
        <div
            onClick={() => onClick(notification)}
            className={`p-4 border-b border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 transition-colors cursor-pointer ${!notification.read ? 'bg-white/5 hover:bg-white/10' : 'hover:bg-white/5'}`}
        >
            <div className="flex gap-3">
                <div className={`p-2 rounded-lg ${style.bg} flex-shrink-0 h-fit`}>
                    <Icon className={`${style.color} w-4 h-4`} />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm text-white leading-relaxed">
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.created_at).toLocaleString('fr-FR')}
                    </p>
                </div>

                <div className="flex items-start gap-2">
                    {!notification.read && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onMarkRead(notification.id); }}
                            className="p-1 hover:bg-white/10 rounded transition-colors"
                            title="Marquer comme lu"
                        >
                            <Check className="text-green-400" size={14} />
                        </button>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); onDismiss(notification.id); }}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Supprimer"
                    >
                        <X className="text-gray-400" size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('all'); // 'all' | 'unread'
    const navigate = useNavigate();
    const { selectProject, notifications, setNotifications } = useData();

    const unreadCount = notifications.filter(n => !n.read).length;

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
        } catch(e) { console.error(e); }
    };

    const dismissNotification = async (id) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch(e) { console.error(e); }
    };

    const markAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch(e) { console.error(e); }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        if (notification.project_id) {
            navigate('/studio');
            selectProject(notification.project_id);
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
                <Bell className="text-gray-400" size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className="absolute left-0 top-full mt-2 w-96 bg-mv-dark border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-down">
                        {/* Header */}
                        <div className="p-4 border-b border-white/10">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-white font-medium">Notifications</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/10 rounded transition-colors"
                                >
                                    <X className="text-gray-400" size={16} />
                                </button>
                            </div>

                            {/* Filters */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === 'all'
                                        ? 'bg-mv-gold text-black'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    Toutes ({notifications.length})
                                </button>
                                <button
                                    onClick={() => setFilter('unread')}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${filter === 'unread'
                                        ? 'bg-mv-gold text-black'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    Non lues ({unreadCount})
                                </button>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="ml-auto text-xs text-mv-gold hover:text-white transition-colors"
                                    >
                                        Tout marquer comme lu
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                            {filteredNotifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <BellOff className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">
                                        {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
                                    </p>
                                </div>
                            ) : (
                                filteredNotifications.map(notification => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkRead={markAsRead}
                                        onDismiss={dismissNotification}
                                        onClick={handleNotificationClick}
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
