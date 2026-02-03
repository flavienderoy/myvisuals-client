import React from 'react';
import { ShieldCheck, Database, LayoutGrid, Image as ImageIcon } from 'lucide-react';

const Header = ({ currentView, setView }) => {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-mv-black/90 backdrop-blur-md border-b border-mv-dark z-50 flex items-center justify-between px-6">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-mv-gold rounded-sm flex items-center justify-center font-bold text-mv-black">MV</div>
                <span className="font-medium tracking-widest text-sm">MYVISUALS</span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
                <button
                    onClick={() => setView('studio')}
                    className={`text-sm tracking-wide transition-colors ${currentView === 'studio' ? 'text-mv-gold' : 'text-gray-400 hover:text-white'}`}
                >
                    STUDIO
                </button>
                <button
                    onClick={() => setView('showroom')}
                    className={`text-sm tracking-wide transition-colors ${currentView === 'showroom' ? 'text-mv-gold' : 'text-gray-400 hover:text-white'}`}
                >
                    SHOWROOM
                </button>
            </nav>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-green-500 border border-green-900/30 bg-green-900/10 px-2 py-1 rounded">
                    <ShieldCheck size={12} />
                    <span>AES-256</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-mv-dark border border-mv-gold/30"></div>
            </div>
        </header>
    );
};

const Footer = () => {
    return (
        <footer className="py-8 border-t border-mv-dark bg-mv-black text-center md:text-left">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-xs text-gray-500">
                    &copy; 2026 MyVisuals. RNCP 39583 Demo.
                </div>
                <div className="flex gap-6 text-xs text-gray-500">
                    <a href="#" className="hover:text-mv-gold transition-colors">Mentions Légales</a>
                    <a href="#" className="hover:text-mv-gold transition-colors">Gestion des données (RGPD)</a>
                    <a href="#" className="hover:text-mv-gold transition-colors">Politique de Cookies</a>
                </div>
            </div>
        </footer>
    );
};

export const MainLayout = ({ children, currentView, setView }) => {
    return (
        <div className="min-h-screen bg-mv-black text-mv-white flex flex-col">
            <Header currentView={currentView} setView={setView} />
            <main className="flex-1 pt-16">
                {children}
            </main>
            <Footer />
        </div>
    );
};
