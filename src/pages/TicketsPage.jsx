import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Ticket, Search, CheckCircle, Clock, MessageSquare,
    CornerDownRight, ExternalLink, Loader2, RotateCcw,
    Filter, ArrowUpDown,
} from 'lucide-react';
import { annotationService } from '../services/annotationService';
import { useToast } from '../hooks/useToast';
import { LuxuryTitle } from '../components/common/LuxuryTitle';

const formatDate = (iso) => {
    if (!iso) return '';
    try {
        return new Date(iso).toLocaleDateString('fr-FR', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
        });
    } catch { return ''; }
};

const TABS = [
    { key: 'all', label: 'Tous', icon: Ticket },
    { key: 'open', label: 'Non résolus', icon: Clock },
    { key: 'resolved', label: 'Résolus', icon: CheckCircle },
];

const SORT_OPTIONS = [
    { key: 'newest', label: 'Plus récents' },
    { key: 'oldest', label: 'Plus anciens' },
    { key: 'most_replies', label: 'Plus de réponses' },
];

const TicketsPage = () => {
    const navigate = useNavigate();
    const toast = useToast();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [actionLoading, setActionLoading] = useState(null); // ticket id being actioned

    const loadTickets = useCallback(async () => {
        try {
            setLoading(true);
            const data = await annotationService.getTickets();
            setTickets(data || []);
        } catch {
            toast.error('Impossible de charger les tickets');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadTickets(); }, [loadTickets]);

    // Filter & sort
    const filteredTickets = useMemo(() => {
        let result = [...tickets];

        // Tab filter
        if (activeTab === 'open') result = result.filter(t => t.status !== 'resolved');
        if (activeTab === 'resolved') result = result.filter(t => t.status === 'resolved');

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(t =>
                t.content?.toLowerCase().includes(q) ||
                t.author?.name?.toLowerCase().includes(q) ||
                t.asset_name?.toLowerCase().includes(q) ||
                t.project_name?.toLowerCase().includes(q)
            );
        }

        // Sort
        switch (sortBy) {
            case 'oldest':
                result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            case 'most_replies':
                result.sort((a, b) => (b.reply_count || 0) - (a.reply_count || 0));
                break;
            default: // newest
                result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        return result;
    }, [tickets, activeTab, searchQuery, sortBy]);

    // Tab counts
    const counts = useMemo(() => ({
        all: tickets.length,
        open: tickets.filter(t => t.status !== 'resolved').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
    }), [tickets]);

    const handleResolve = async (ticketId) => {
        setActionLoading(ticketId);
        try {
            const updated = await annotationService.resolveAnnotation(ticketId);
            setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, ...updated } : t));
            toast.success('Ticket résolu');
        } catch {
            toast.error('Impossible de résoudre le ticket');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReopen = async (ticketId) => {
        setActionLoading(ticketId);
        try {
            const updated = await annotationService.reopenAnnotation(ticketId);
            setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, ...updated } : t));
            toast.success('Ticket rouvert');
        } catch {
            toast.error('Impossible de rouvrir le ticket');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <LuxuryTitle text="Tickets" size="text-3xl" className="text-white mb-2" />
                    <p className="text-gray-500 text-sm">
                        Gérez et suivez les retours et annotations de vos visuels.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Stats */}
                    <div className="flex items-center gap-4 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03]">
                        <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-mv-gold" />
                            <span className="font-bold text-white tabular-nums">{counts.open}</span> ouvert{counts.open !== 1 ? 's' : ''}
                        </span>
                        <span className="w-px h-4 bg-white/10" />
                        <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="font-bold text-white tabular-nums">{counts.resolved}</span> résolu{counts.resolved !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabs + Search + Sort */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                {/* Tabs */}
                <div className="flex gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/8">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                                    isActive
                                        ? 'bg-mv-gold/10 text-mv-gold border border-mv-gold/20'
                                        : 'text-gray-500 hover:text-white border border-transparent'
                                }`}
                            >
                                <Icon size={13} />
                                {tab.label}
                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] tabular-nums ${
                                    isActive ? 'bg-mv-gold/20 text-mv-gold' : 'bg-white/8 text-gray-500'
                                }`}>
                                    {counts[tab.key]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search + Sort */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher…"
                            className="pl-9 pr-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold/40 focus:ring-1 focus:ring-mv-gold/10 transition-all w-52"
                        />
                    </div>

                    {/* Sort dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSortMenu(!showSortMenu)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-xs text-gray-400 hover:text-white hover:border-white/20 transition-colors"
                        >
                            <ArrowUpDown size={13} />
                            Trier
                        </button>
                        {showSortMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                                <div className="absolute right-0 top-full mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 py-1 min-w-[160px] animate-fade-in-down">
                                    {SORT_OPTIONS.map(opt => (
                                        <button
                                            key={opt.key}
                                            onClick={() => { setSortBy(opt.key); setShowSortMenu(false); }}
                                            className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                                                sortBy === opt.key ? 'text-mv-gold bg-mv-gold/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Ticket list */}
            {loading ? (
                <div className="flex items-center justify-center py-20 text-gray-500 gap-3">
                    <Loader2 className="animate-spin" size={20} /> Chargement des tickets…
                </div>
            ) : filteredTickets.length === 0 ? (
                <div className="text-center py-20">
                    <Ticket size={36} className="mx-auto text-gray-700 mb-4" />
                    <p className="text-gray-400 text-sm">
                        {searchQuery ? 'Aucun ticket ne correspond à votre recherche.' : "Aucun ticket pour l'instant."}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                        Les tickets sont créés lorsque quelqu{"'"}un annote un visuel.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredTickets.map((ticket) => {
                        const isResolved = ticket.status === 'resolved';
                        const isActioning = actionLoading === ticket.id;
                        return (
                            <div
                                key={ticket.id}
                                className={`group rounded-2xl border transition-all duration-200 hover:border-white/20 ${
                                    isResolved ? 'border-white/8 bg-white/[0.02]' : 'border-white/10 bg-white/[0.03]'
                                }`}
                            >
                                <div className="flex items-start gap-4 p-4">
                                    {/* Thumbnail */}
                                    {ticket.asset_url ? (
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/8">
                                            <img
                                                src={ticket.asset_url}
                                                alt={ticket.asset_name || 'Visual'}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                                            <Ticket size={20} className="text-gray-600" />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {/* Status badge */}
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                                                isResolved
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                    : 'bg-mv-gold/10 text-mv-gold border-mv-gold/20'
                                            }`}>
                                                {isResolved ? <CheckCircle size={9} /> : <Clock size={9} />}
                                                {isResolved ? 'Résolu' : 'Ouvert'}
                                            </span>
                                            {/* Project + Asset breadcrumb */}
                                            <span className="text-[10px] text-gray-600 truncate">
                                                {ticket.project_name && `${ticket.project_name}`}
                                                {ticket.project_name && ticket.asset_name && ' · '}
                                                {ticket.asset_name}
                                            </span>
                                        </div>

                                        <p className={`text-sm leading-relaxed line-clamp-2 ${isResolved ? 'text-gray-500' : 'text-gray-200'}`}>
                                            {ticket.content}
                                        </p>

                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="text-[11px] text-gray-500">
                                                <span className="font-medium text-gray-400">{ticket.author?.name || 'Utilisateur'}</span>
                                                {' · '}
                                                {formatDate(ticket.created_at)}
                                            </span>
                                            {ticket.reply_count > 0 && (
                                                <span className="flex items-center gap-1 text-[11px] text-gray-600">
                                                    <CornerDownRight size={10} />
                                                    {ticket.reply_count} réponse{ticket.reply_count > 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {/* View in asset viewer */}
                                        <button
                                            onClick={() => navigate(`/assets/${ticket.asset_id}`)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-medium text-gray-400 hover:text-white hover:border-white/25 transition-all"
                                        >
                                            <ExternalLink size={11} />
                                            Voir
                                        </button>

                                        {/* Resolve / Reopen */}
                                        {isResolved ? (
                                            <button
                                                onClick={() => handleReopen(ticket.id)}
                                                disabled={isActioning}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-medium text-gray-400 hover:text-white hover:border-white/25 transition-all disabled:opacity-40"
                                            >
                                                {isActioning ? <Loader2 size={11} className="animate-spin" /> : <RotateCcw size={11} />}
                                                Rouvrir
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleResolve(ticket.id)}
                                                disabled={isActioning}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-[11px] font-medium text-green-400 hover:bg-green-500/20 transition-all disabled:opacity-40"
                                            >
                                                {isActioning ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle size={11} />}
                                                Résoudre
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TicketsPage;
