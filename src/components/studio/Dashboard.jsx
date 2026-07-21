import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { LuxuryTitle } from '../common/LuxuryTitle';
import { Search, Plus, FolderOpen, Clock, AlertCircle, Users, FolderHeart, ChevronDown, FolderPlus, Building2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ProjectCard, ProjectSlider } from './ProjectSlider';
import { FilterMenu } from './FilterMenu';
import { AddClientModal } from './modals/AddClientModal';
import { AddProjectModal } from './modals/AddProjectModal';
import { ActivityFeed } from './ActivityFeed';
import { SmartFolderList } from './SmartFolderList';
import { AddSmartFolderModal } from './modals/AddSmartFolderModal';


export const Dashboard = () => {
    const { projects, clients, currentUser, selectProject } = useData();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState({
        status: [],
        client: []
    });

    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isSmartFolderModalOpen, setIsSmartFolderModalOpen] = useState(false);
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
    const [selectedClientForProject, setSelectedClientForProject] = useState("");
    const createMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
                setIsCreateMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const openProjectModal = useCallback((clientName = "") => {
        setSelectedClientForProject(clientName);
        setIsProjectModalOpen(true);
    }, []);

    const handleApplySmartFolder = (filters) => {
        setSearchQuery(filters.search || "");
        setActiveFilters({
            status: filters.status || [],
            client: filters.client || []
        });
    };


    // Real operational counters (no mock revenue)
    const stats = useMemo(() => {
        const allAssets = projects.flatMap(p => p.assets || []);
        return {
            activeProjects: projects.filter(p => p.status === 'in_progress').length,
            pendingApprovals: allAssets.filter(a => a.status === 'pending').length,
            needsReview: allAssets.filter(a => a.status === 'needs_review').length,
            clients: clients.length,
        };
    }, [projects, clients]);

    // Extract unique clients for the filter (based on available data)
    // We use the full 'clients' list from context for the dropdown
    const availableClients = clients.map(c => c.name).sort();

    // Filter projects based on search query AND active filters (memoized)
    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const query = searchQuery.toLowerCase();

            // 1. Search Query
            const matchesSearch = project.name.toLowerCase().includes(query) ||
                project.client.toLowerCase().includes(query);

            // 2. Status Filter (if any selected)
            const matchesStatus = activeFilters.status.length === 0 ||
                activeFilters.status.includes(project.status);

            // 3. Client Filter (if any selected)
            const matchesClient = activeFilters.client.length === 0 ||
                activeFilters.client.includes(project.client);

            return matchesSearch && matchesStatus && matchesClient;
        });
    }, [projects, searchQuery, activeFilters]);

    // We want to display ALL clients that match the filter/search, even if they have no projects
    // But we only show clients that contain projects matching the *other* filters (status).
    // Let's simplify: Iterate all known clients.
    // Logic: Show Client Section IF:
    // 1. The Client Name matches Search Query
    // 2. OR The Client has projects that match the Search Query & Filters.

    const clientSections = clients.map(client => {
        const clientProjects = filteredProjects.filter(p => p.client === client.name);

        // Check if we should show this client section
        // 1. If user is specifically filtering by THIS client, show it.
        // 2. If user is searching and matches Client Name, show it (even if 0 projects)
        // 3. If client has matching projects, show it.
        // 4. If no filters/search at all, show everything (even empty clients).

        const hasMatchingProjects = clientProjects.length > 0;
        const nameMatchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
        const isClientSelected = activeFilters.client.includes(client.name);
        const noFiltersActive = searchQuery === "" && activeFilters.status.length === 0 && activeFilters.client.length === 0;

        const shouldShow = hasMatchingProjects || (searchQuery && nameMatchesSearch) || isClientSelected || noFiltersActive;

        return shouldShow ? { client, projects: clientProjects } : null;
    }).filter(Boolean);

    return (
        <div className="space-y-12 animate-fade-in overflow-hidden p-8">
            {/* Header Title & Unified Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2 border-b border-white/10">
                <div>
                    <LuxuryTitle text="Tableau de Bord" size="text-4xl" className="mb-2 text-white" />
                    <p className="text-gray-400 text-sm">Re-bonjour, <span className="text-white font-medium">{currentUser.name}</span>.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    {/* Integrated Search & Filter Control Capsule */}
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-1.5 backdrop-blur-xl shadow-lg">
                        {/* Search Input */}
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent py-1 pl-8 pr-3 text-xs text-white focus:outline-none placeholder:text-gray-500"
                            />
                        </div>

                        <div className="h-4 w-px bg-white/10"></div>

                        {/* Filter Menu */}
                        <FilterMenu
                            availableClients={availableClients}
                            activeFilters={activeFilters}
                            onFilterChange={setActiveFilters}
                        />

                        {/* Smart Folder Saver */}
                        <button
                            onClick={() => setIsSmartFolderModalOpen(true)}
                            className="p-1.5 text-gray-400 hover:text-mv-gold hover:bg-white/10 rounded-full transition-all"
                            title="Sauvegarder en Smart Folder"
                        >
                            <FolderHeart size={15} />
                        </button>
                    </div>

                    {/* Single Gold Creation CTA with Dropdown */}
                    <div className="relative" ref={createMenuRef}>
                        <button
                            onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-mv-gold hover:bg-white text-black font-bold rounded-full text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
                        >
                            <Plus size={16} />
                            <span>Nouveau</span>
                            <ChevronDown size={13} className={`transition-transform duration-200 ${isCreateMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isCreateMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#0c0c0c]/95 border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-2xl animate-fade-in-up py-1.5">
                                <button
                                    onClick={() => {
                                        setIsCreateMenuOpen(false);
                                        openProjectModal();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-xs text-white hover:bg-mv-gold hover:text-black transition-colors text-left group"
                                >
                                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-black/10 text-mv-gold group-hover:text-black transition-colors">
                                        <FolderPlus size={16} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">Nouveau Projet</div>
                                        <div className="text-[11px] text-gray-400 group-hover:text-black/70">Créer un espace projet</div>
                                    </div>
                                </button>

                                <div className="my-1 border-t border-white/10"></div>

                                <button
                                    onClick={() => {
                                        setIsCreateMenuOpen(false);
                                        setIsClientModalOpen(true);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-xs text-white hover:bg-mv-gold hover:text-black transition-colors text-left group"
                                >
                                    <div className="p-2 rounded-lg bg-white/5 group-hover:bg-black/10 text-mv-gold group-hover:text-black transition-colors">
                                        <Building2 size={16} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">Nouvelle Entreprise</div>
                                        <div className="text-[11px] text-gray-400 group-hover:text-black/70">Ajouter une entreprise client</div>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            <SmartFolderList onApplyFolder={handleApplySmartFolder} />

            {/* Operational counters — real data, no vanity metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="p-2.5 rounded-lg bg-white/5 text-mv-gold"><FolderOpen size={20} /></div>
                    <div>
                        <div className="text-2xl font-bold text-white tabular-nums">{stats.activeProjects}</div>
                        <div className="text-xs text-gray-500">Projets en cours</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="p-2.5 rounded-lg bg-white/5 text-gray-300"><Clock size={20} /></div>
                    <div>
                        <div className="text-2xl font-bold text-white tabular-nums">{stats.pendingApprovals}</div>
                        <div className="text-xs text-gray-500">Visuels en attente de validation</div>
                    </div>
                </div>
                <div className={`flex items-center gap-4 rounded-xl p-5 border ${stats.needsReview > 0 ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/5 border-white/10'}`}>
                    <div className={`p-2.5 rounded-lg ${stats.needsReview > 0 ? 'bg-orange-500/10 text-orange-400' : 'bg-white/5 text-gray-500'}`}><AlertCircle size={20} /></div>
                    <div>
                        <div className={`text-2xl font-bold tabular-nums ${stats.needsReview > 0 ? 'text-orange-400' : 'text-white'}`}>{stats.needsReview}</div>
                        <div className="text-xs text-gray-500">Retouches demandées</div>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="p-2.5 rounded-lg bg-white/5 text-gray-300"><Users size={20} /></div>
                    <div>
                        <div className="text-2xl font-bold text-white tabular-nums">{stats.clients}</div>
                        <div className="text-xs text-gray-500">Clients</div>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-3">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Portefeuille Clients</h2>
                    {(searchQuery || activeFilters.status.length > 0 || activeFilters.client.length > 0) && (
                        <span className="text-xs text-mv-gold">
                            {filteredProjects.length} résultats trouvés
                        </span>
                    )}
                </div>

                {clientSections.length > 0 ? (
                    <div className="space-y-16">
                        {clientSections.map(({ client, projects }) => {
                            const isSlider = projects.length > 3;

                            return (
                                <div key={client.id} className="animate-fade-in-up">
                                    <div className="mb-6 flex items-center gap-4 group">
                                        <div className="w-2 h-2 rounded-full bg-mv-gold"></div>
                                        {/* Avatar display in Dashboard title */}
                                        {client.logo ? (
                                            <img
                                                src={client.logo}
                                                alt={client.name}
                                                className="w-10 h-10 rounded-lg object-cover border border-white/10"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mv-gold to-orange-600 flex items-center justify-center text-black font-bold text-sm shadow-md">
                                                {client.name.charAt(0)}
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-medium text-white group-hover:text-mv-gold transition-colors">
                                            {client.name}
                                        </h3>
                                        <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
                                        <button
                                            onClick={() => openProjectModal(client.name)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-3 py-1.5 bg-mv-gold/10 hover:bg-mv-gold/20 border border-mv-gold/30 rounded-full text-mv-gold text-xs font-medium"
                                        >
                                            <Plus size={14} />
                                            Nouveau Projet
                                        </button>
                                    </div>

                                    {projects.length > 0 ? (
                                        isSlider ? (
                                            <ProjectSlider projects={projects} onSelectProject={selectProject} />
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {projects.map(project => (
                                                    <ProjectCard
                                                        key={project.id}
                                                        project={project}
                                                        onClick={() => selectProject(project.id)}
                                                    />

                                                ))}
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                                            <p className="text-gray-500 text-sm">Aucun projet pour ce client</p>
                                            <button
                                                onClick={() => openProjectModal(client.name)}
                                                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-mv-gold/10 hover:bg-mv-gold/20 border border-mv-gold/30 rounded-full text-mv-gold text-sm font-medium transition-colors"
                                            >
                                                <Plus size={16} />
                                                Créer le premier projet
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-20 text-center text-gray-500">
                        <p className="text-lg">Aucun projet ne correspond à vos filtres.</p>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setActiveFilters({ status: [], client: [] });
                            }}
                            className="mt-4 text-sm text-mv-gold hover:underline"
                        >
                            Tout effacer
                        </button>
                    </div>
                )}
            </div>

            {/* Activity — secondary, below the portfolio */}
            <div className="pt-4 border-t border-white/10">
                <ActivityFeed limit={5} showFilters={false} />
            </div>

            <AddClientModal
                isOpen={isClientModalOpen}
                onClose={() => setIsClientModalOpen(false)}
            />
            <AddSmartFolderModal 
                isOpen={isSmartFolderModalOpen}
                onClose={() => setIsSmartFolderModalOpen(false)}
                currentFilters={activeFilters}
                currentSearch={searchQuery}
            />
            <AddProjectModal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                initialClient={selectedClientForProject}
            />
        </div>
    );
};
