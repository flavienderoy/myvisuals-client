import React, { useState, useEffect, useRef } from 'react';
import { Search, Command, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

export const CommandBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);
    const { projects, clients, selectProject, selectClient } = useData();
    const navigate = useNavigate();

    // Toggle on CMD+K
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Filter results
    const filteredProjects = query ? projects.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.client.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5) : [];

    const filteredClients = query ? clients.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3) : [];

    const handleSelect = (item, type) => {
        if (type === 'project') {
            // Navigate to studio and select the project
            navigate('/studio');
            selectProject(item.id);
        } else if (type === 'client') {
            // Navigate to studio and select the client
            navigate('/studio');
            selectClient(item.name);
        }
        setIsOpen(false);
        setQuery("");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            ></div>

            {/* Command Pallette */}
            <div 
                role="dialog"
                aria-modal="true"
                aria-label="Command palette"
                className="relative w-full max-w-2xl bg-[#1A1A1A]/80 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl shadow-black overflow-hidden animate-fade-in-up"
            >
                {/* Search Header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                    <Search className="text-gray-400" size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Rechercher des projets, des clients..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        aria-label="Search projects and clients"
                        role="searchbox"
                        className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-gray-600 font-bold tracking-tight text-white"
                    />
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 text-xs text-gray-500 font-mono">
                        <span>ESC</span>
                    </div>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {!query && (
                        <div className="py-12 text-center text-gray-500">
                            <Command className="mx-auto mb-4 opacity-50" size={32} />
                            <p className="text-sm">Tapez pour rechercher...</p>
                        </div>
                    )}

                    {query && filteredProjects.length === 0 && filteredClients.length === 0 && (
                        <div className="py-8 text-center text-gray-500 text-sm">
                            Aucun résultat trouvé.
                        </div>
                    )}

                    {filteredProjects.length > 0 && (
                        <div className="mb-4">
                            <h3 className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Projets</h3>
                            {filteredProjects.map(project => (
                                <button
                                    key={project.id}
                                    onClick={() => handleSelect(project, 'project')}
                                    role="option"
                                    aria-selected="false"
                                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-white/10 group transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-mv-gold/10 text-mv-gold flex items-center justify-center">
                                            <Command size={14} />
                                        </div>
                                        <div>
                                            <div className="text-white text-sm font-medium">{project.name}</div>
                                            <div className="text-xs text-gray-500">{project.client}</div>
                                        </div>
                                    </div>
                                    <CornerDownLeft size={14} className="text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    )}

                    {filteredClients.length > 0 && (
                        <div className="mb-2">
                            <h3 className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Clients</h3>
                            {filteredClients.map(client => (
                                <button
                                    key={client.id}
                                    onClick={() => handleSelect(client, 'client')}
                                    role="option"
                                    aria-selected="false"
                                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-white/10 group transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center group-hover:bg-white/10 group-hover:text-white">
                                            {client.name.charAt(0)}
                                        </div>
                                        <div className="text-white text-sm font-medium">{client.name}</div>
                                    </div>
                                    <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Filtrer
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 bg-white/5 border-t border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300 flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><ArrowRight size={10} /> Sélectionner</span>
                        <span className="flex items-center gap-1"><CornerDownLeft size={10} /> Ouvrir</span>
                    </div>
                    <div>Visuals Studio OS v2.0</div>
                </div>
            </div>
        </div>
    );
};
