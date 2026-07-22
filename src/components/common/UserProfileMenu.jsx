import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { User, LogOut, ChevronDown } from 'lucide-react';

export const UserProfileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { currentUser } = useData();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
        setIsOpen(false);
    };

    const handleLogout = () => {
        // In real app: clear auth tokens, etc.
        navigate('/login');
    };

    return (
        <div className="relative">
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-label="User profile menu"
                className="flex items-center gap-2 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
                {currentUser.avatar ? (
                    <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-7 h-7 rounded-full object-cover border border-white/20"
                    />
                ) : (
                    <div className="w-7 h-7 rounded-full bg-mv-gold text-black flex items-center justify-center text-xs font-bold">
                        {currentUser.name.charAt(0)}
                    </div>
                )}
                <ChevronDown
                    className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    size={14}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu Panel */}
                    <div 
                        role="menu"
                        aria-orientation="vertical"
                        className="absolute left-0 top-full mt-2 w-56 bg-mv-dark border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-down"
                    >
                        {/* User Info */}
                        <div className="p-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                {currentUser.avatar ? (
                                    <img
                                        src={currentUser.avatar}
                                        alt={currentUser.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-mv-gold text-black flex items-center justify-center text-sm font-bold">
                                        {currentUser.name.charAt(0)}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">{currentUser.name}</p>
                                    <p className="text-gray-500 text-xs truncate">{currentUser.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            <button
                                onClick={handleProfileClick}
                                role="menuitem"
                                className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-3"
                            >
                                <User size={16} className="text-mv-gold" />
                                Mon Profil
                            </button>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-white/10 py-2">
                            <button
                                onClick={handleLogout}
                                role="menuitem"
                                className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-3"
                            >
                                <LogOut size={16} />
                                Déconnexion
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
