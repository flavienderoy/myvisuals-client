import React, { useState, useRef, useEffect } from 'react';
import { Filter, X, Check, ChevronDown } from 'lucide-react';

export const FilterMenu = ({ activeFilters, onFilterChange, availableClients }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleFilter = (category, value) => {
        const currentCategoryValues = activeFilters[category] || [];
        const newCategoryValues = currentCategoryValues.includes(value)
            ? currentCategoryValues.filter(v => v !== value)
            : [...currentCategoryValues, value];

        onFilterChange({
            ...activeFilters,
            [category]: newCategoryValues
        });
    };

    const clearFilters = () => {
        onFilterChange({ status: [], client: [] });
    };

    const activeFilterCount = (activeFilters.status?.length || 0) + (activeFilters.client?.length || 0);

    const statusOptions = [
        { value: 'in_progress', label: 'En Cours' },
        { value: 'completed', label: 'Terminé' },
        { value: 'pending', label: 'En Attente' }
    ];

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-xs font-medium ${isOpen || activeFilterCount > 0
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
            >
                <Filter size={14} className={activeFilterCount > 0 ? "text-mv-gold" : ""} />
                <span>Filtrer</span>
                {activeFilterCount > 0 && (
                    <span className="flex items-center justify-center w-4 h-4 bg-mv-gold text-black text-[10px] font-bold rounded-full">
                        {activeFilterCount}
                    </span>
                )}
                <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>


            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-3 w-72 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 animate-fade-in-up origin-top-left overflow-hidden">
                    <div className="p-4 space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-white/10 hover:border-white/30 transition-all duration-300">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Filtres Actifs</span>
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-xs text-mv-gold hover:underline flex items-center gap-1"
                                >
                                    <X size={10} /> Tout effacer
                                </button>
                            )}
                        </div>

                        {/* Status Category */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-white">Statut du Projet</h4>
                            <div className="space-y-2">
                                {statusOptions.map((option) => (
                                    <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${activeFilters.status.includes(option.value)
                                            ? 'bg-mv-gold border-mv-gold'
                                            : 'border-white/20 group-hover:border-white/40'
                                            }`}>
                                            {activeFilters.status.includes(option.value) && <Check size={10} className="text-black" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={activeFilters.status.includes(option.value)}
                                            onChange={() => toggleFilter('status', option.value)}
                                        />
                                        <span className={`text-sm ${activeFilters.status.includes(option.value) ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Client Category */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium text-white">Client</h4>
                            <div className="max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent space-y-2">
                                {availableClients.map((client) => (
                                    <label key={client} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${activeFilters.client.includes(client)
                                            ? 'bg-mv-gold border-mv-gold'
                                            : 'border-white/20 group-hover:border-white/40'
                                            }`}>
                                            {activeFilters.client.includes(client) && <Check size={10} className="text-black" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={activeFilters.client.includes(client)}
                                            onChange={() => toggleFilter('client', client)}
                                        />
                                        <span className={`text-sm truncate ${activeFilters.client.includes(client) ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                            {client}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
