import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { Folder, Plus, Trash2, Filter } from 'lucide-react';

const SmartFolderCard = ({ folder, onDelete, onApply }) => {
    const filterCount = Object.keys(folder.filters).length;

    return (
        <div
            onClick={() => onApply(folder)}
            className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-mv-gold/30 transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Folder className="text-mv-gold w-5 h-5" />
                    <h4 className="text-white font-medium">{folder.name}</h4>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(folder.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                >
                    <Trash2 className="w-4 h-4 text-red-400" />
                </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {folder.filters.status && folder.filters.status.length > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-full">
                        Statut: {folder.filters.status.join(', ')}
                    </span>
                )}
                {folder.filters.client && folder.filters.client.length > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full">
                        Client: {folder.filters.client.join(', ')}
                    </span>
                )}
                {filterCount === 0 && (
                    <span className="text-xs text-gray-500">Aucun filtre</span>
                )}
            </div>

            <p className="text-xs text-gray-600 mt-2">
                Créé le {new Date(folder.createdAt).toLocaleDateString('fr-FR')}
            </p>
        </div>
    );
};

export const SmartFolders = ({ currentFilters, onApplyFilters }) => {
    const { smartFolders, createSmartFolder, deleteSmartFolder } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [folderName, setFolderName] = useState('');

    const handleCreate = () => {
        if (!folderName.trim()) return;

        createSmartFolder(folderName, currentFilters);
        setFolderName('');
        setIsModalOpen(false);
    };

    const handleApply = (folder) => {
        onApplyFilters(folder.filters);
    };

    return (
        <>
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium flex items-center gap-2">
                        <Filter size={16} className="text-mv-gold" />
                        Dossiers Intelligents
                    </h3>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-mv-gold hover:bg-white text-black rounded-lg text-sm font-medium transition-colors"
                    >
                        <Plus size={14} />
                        Nouveau
                    </button>
                </div>

                {/* Folders Grid */}
                {smartFolders.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 border-dashed rounded-lg p-8 text-center">
                        <Folder className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm mb-2">Aucun dossier intelligent</p>
                        <p className="text-gray-600 text-xs">
                            Sauvegardez vos filtres favoris pour y accéder rapidement
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {smartFolders.map(folder => (
                            <SmartFolderCard
                                key={folder.id}
                                folder={folder}
                                onDelete={deleteSmartFolder}
                                onApply={handleApply}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setFolderName('');
                }}
                title="Nouveau Dossier Intelligent"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Nom du dossier
                        </label>
                        <input
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            placeholder="Ex: Projets urgents"
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold transition-colors"
                            autoFocus
                        />
                    </div>

                    {/* Current Filters Preview */}
                    <div className="bg-black/20 border border-white/10 hover:border-white/30 transition-all duration-300 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-2">Filtres actuels :</p>
                        <div className="flex flex-wrap gap-1.5">
                            {currentFilters.status && currentFilters.status.length > 0 && (
                                <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full">
                                    Statut: {currentFilters.status.join(', ')}
                                </span>
                            )}
                            {currentFilters.client && currentFilters.client.length > 0 && (
                                <span className="text-xs px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full">
                                    Client: {currentFilters.client.join(', ')}
                                </span>
                            )}
                            {(!currentFilters.status || currentFilters.status.length === 0) &&
                                (!currentFilters.client || currentFilters.client.length === 0) && (
                                    <span className="text-xs text-gray-600">Aucun filtre actif</span>
                                )}
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                setFolderName('');
                            }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!folderName.trim()}
                            className="px-4 py-2 bg-mv-gold hover:bg-white text-black font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Créer
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
