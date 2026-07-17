import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ChevronLeft,
    ChevronRight,
    Building2,
    MessageSquare,
    Monitor,
    Folder,
    Menu
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { NotificationCenter } from '../common/NotificationCenter';
import { UserProfileMenu } from '../common/UserProfileMenu';


export const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { currentUser, clients, currentSelection, selectGlobal, selectClient } = useData();
    const navigate = useNavigate();
    const location = useLocation();

    // State for expanded clients in the tree
    const [expandedClients, setExpandedClients] = useState({});

    const toggleClient = (clientName, e) => {
        e.stopPropagation();
        setExpandedClients(prev => ({
            ...prev,
            [clientName]: !prev[clientName]
        }));
    };

    const handleSelectGlobal = () => {
        navigate('/studio');
        selectGlobal();
    };

    const handleSelectClient = (clientName) => {
        navigate('/studio');
        selectClient(clientName);
        // Auto expand
        setExpandedClients(prev => ({ ...prev, [clientName]: true }));
    };

    // If we are strictly on /studio, we show the navigator active state
    const isStudio = location.pathname.startsWith('/studio');

    return (
        <>
            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-expanded={mobileMenuOpen}
                    aria-label="Toggle mobile menu"
                    aria-controls="sidebar-navigation"
                    className="p-2 bg-black/50 backdrop-blur-md border border-white/10 text-white rounded-lg shadow-lg hover:bg-white/10 transition-colors"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Backdrop */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                ></div>
            )}

            <nav
                id="sidebar-navigation"
                aria-label="Main Navigation"
                className={`h-screen bg-[#0a0a0a] border-r border-white/10 flex flex-col transition-all duration-300 fixed md:relative z-40 top-0 left-0
                    ${collapsed ? 'w-20' : 'w-72'}
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    aria-expanded={!collapsed}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className="absolute -right-3 top-8 w-6 h-6 bg-mv-gold text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_10px_rgba(212,175,55,0.3)] z-50"
                >
                    {collapsed ? <ChevronRight size={14} aria-hidden="true" /> : <ChevronLeft size={14} aria-hidden="true" />}
                </button>

                {/* Header: User Profile & Notifications */}
                <div className="p-4 border-b border-white/5 transition-all duration-300">
                    {!collapsed ? (
                        <div className="space-y-3">
                            {/* User Profile Section */}
                            <div className="flex items-center gap-3">
                                <UserProfileMenu />
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-white font-medium text-sm truncate">{currentUser.name}</h2>
                                    <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/5 transition-all duration-300">
                                <span className="text-xs text-gray-500 uppercase tracking-widest">Notifications</span>
                                <NotificationCenter />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <UserProfileMenu />
                            <NotificationCenter />
                        </div>
                    )}
                </div>

                {/* Main Navigation (Tree View) */}
                <div className="flex-1 overflow-y-auto scrollbar-hide py-4">

                    {/* Global Dashboard Link */}
                    <div className="px-2 mb-6">
                        <button
                            onClick={handleSelectGlobal}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group
                            ${isStudio && currentSelection?.type === 'global' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                        `}
                        >
                            <LayoutDashboard size={18} className={isStudio && currentSelection?.type === 'global' ? 'text-white' : ''} />
                            {!collapsed && <span className="text-sm font-medium">Vue d'ensemble</span>}
                        </button>

                        {/* Messagerie (same entry as the client portal, for coherence) */}
                        <NavLink to="/messages" className={({ isActive }) => `w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all mt-1 ${isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                            <MessageSquare size={18} />
                            {!collapsed && <span className="text-sm font-medium">Messagerie</span>}
                        </NavLink>
                    </div>

                    {!collapsed && (
                        <div className="px-4 mt-6">
                            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Building2 size={12} />
                                Clients
                            </div>

                            <div className="relative">
                                <button
                                    onClick={() => setExpandedClients(prev => ({ ...prev, dropdown: !prev.dropdown }))}
                                    aria-expanded={expandedClients.dropdown || false}
                                    aria-haspopup="listbox"
                                    className={`w-full flex items-center justify-between px-3 py-2.5 bg-[#141414] border border-white/10 rounded-lg hover:border-white/30 transition-colors cursor-pointer ${expandedClients.dropdown ? 'border-white/30' : ''}`}
                                >
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        {/* Selected Client Avatar or Icon */}
                                        {currentSelection?.type === 'client' ? (
                                            (() => {
                                                const selectedClient = clients.find(c => c.name === currentSelection.id);
                                                return selectedClient?.avatar ? (
                                                    <img src={selectedClient.avatar} alt={selectedClient.name} className="w-5 h-5 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-mv-gold text-black flex items-center justify-center text-[10px] font-bold">
                                                        {(currentSelection.id || '?').charAt(0)}
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <Folder size={14} className="text-mv-gold" />
                                        )}
                                        <span className="text-sm text-gray-300 truncate font-medium">
                                            {currentSelection?.type === 'client' ? currentSelection.id : 'Sélectionner un client'}
                                        </span>
                                    </div>
                                    <ChevronRight size={14} className={`text-gray-500 transition-transform ${expandedClients.dropdown ? 'rotate-90' : ''}`} />
                                </button>

                                {expandedClients.dropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#141414] border border-white/10 rounded-lg shadow-xl overflow-hidden z-50 py-1 animate-fade-in-down">
                                        {clients.map(client => (
                                            <button
                                                key={client.id}
                                                onClick={() => {
                                                    handleSelectClient(client.name);
                                                    setExpandedClients(prev => ({ ...prev, dropdown: false }));
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-3 hover:bg-white/5 transition-colors
                                                ${currentSelection?.type === 'client' && currentSelection.id === client.name ? 'text-white bg-white/5' : 'text-gray-400'}
                                            `}
                                            >

                                                {client.avatar ? (
                                                    <img src={client.avatar} alt={client.name} className="w-5 h-5 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-mv-gold text-black flex items-center justify-center text-[10px] font-bold shrink-0">
                                                        {client.name.charAt(0)}
                                                    </div>
                                                )}

                                                <span className="truncate">{client.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 transition-all duration-300 bg-black/40">
                    {!collapsed ? (
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center gap-1.5"><Monitor size={12} /> v2.4.0</span>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Monitor size={14} className="text-gray-600" />
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};
