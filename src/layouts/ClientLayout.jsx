import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, FolderOpen, MessageSquare, Download, ChevronLeft, ChevronRight, Monitor, Menu } from 'lucide-react';
import { useData } from '../context/DataContext';
import { NotificationCenter } from '../components/common/NotificationCenter';
import { UserProfileMenu } from '../components/common/UserProfileMenu';

export const ClientLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { currentUser } = useData();
    const location = useLocation();

    return (
        <div className="flex w-full h-screen bg-mv-black text-white font-sans overflow-hidden">
            {/* Mobile Menu Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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

            {/* Sidebar matching Studio's Sidebar exact structure */}
            <div
                className={`h-screen bg-[#0a0a0a] border-r border-white/10 flex flex-col transition-all duration-300 fixed md:relative z-40 top-0 left-0
                    ${collapsed ? 'w-20' : 'w-72'}
                    ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-8 w-6 h-6 bg-mv-gold text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_10px_rgba(212,175,55,0.3)] z-50"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Header: User Profile & Notifications */}
                <div className="p-4 border-b border-white/5">
                    {!collapsed ? (
                        <div className="space-y-3">
                            {/* User Profile Section */}
                            <div className="flex items-center gap-3">
                                <UserProfileMenu />
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-white font-medium text-sm truncate">{currentUser.name}</h2>
                                    <p className="text-xs text-gray-500 truncate">{currentUser.role === 'client' ? 'Compte Client' : 'Admin Vue Client'}</p>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
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

                {/* Navigation */}
                <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-hide">
                    <NavLink
                        to="/client/dashboard"
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all group ${isActive
                                ? 'bg-white/10 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <Home size={18} className={location.pathname === '/client/dashboard' ? 'text-mv-gold' : ''} />
                        {!collapsed && <span className="text-sm font-medium">Tableau de Bord</span>}
                    </NavLink>

                    <NavLink
                        to="/client/projects"
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all group ${isActive
                                ? 'bg-white/10 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <FolderOpen size={18} className={location.pathname === '/client/projects' ? 'text-mv-gold' : ''} />
                        {!collapsed && <span className="text-sm font-medium">Mes Projets</span>}
                    </NavLink>

                    <NavLink
                        to="/client/downloads"
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all group ${isActive
                                ? 'bg-white/10 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <Download size={18} className={location.pathname === '/client/downloads' ? 'text-mv-gold' : ''} />
                        {!collapsed && <span className="text-sm font-medium">Téléchargements</span>}
                    </NavLink>

                    <NavLink
                        to="/client/messages"
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all group ${isActive
                                ? 'bg-white/10 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <MessageSquare size={18} className={location.pathname === '/client/messages' ? 'text-mv-gold' : ''} />
                        {!collapsed && <span className="text-sm font-medium">Messagerie</span>}
                    </NavLink>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-black/40">
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
            </div>

            {/* Main Content Area mapping exactly MainLayout's main tag */}
            <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden relative scrollbar-hide">
                <div className="relative z-10 w-full min-h-screen">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
