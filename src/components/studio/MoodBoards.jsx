import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Layers, Plus, Trash2, Share2, Lock, Unlock, Image as ImageIcon } from 'lucide-react';
import { Modal } from '../common/Modal';

const MoodBoardCard = ({ moodBoard, onClick, onDelete }) => {
    const assetCount = moodBoard.assets.length;

    return (
        <div
            onClick={() => onClick(moodBoard)}
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-mv-gold/30 transition-all cursor-pointer group relative overflow-hidden"
        >
            {/* Preview Grid */}
            <div className="grid grid-cols-2 gap-1 mb-3 h-32 rounded-lg overflow-hidden bg-black/20">
                {moodBoard.assets.slice(0, 4).map((assetId, idx) => (
                    <div key={idx} className="bg-white/5 flex items-center justify-center">
                        <ImageIcon className="text-gray-700" size={20} />
                    </div>
                ))}
                {assetCount === 0 && (
                    <div className="col-span-2 flex items-center justify-center">
                        <Layers className="text-gray-700" size={32} />
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <h4 className="text-white font-medium truncate">{moodBoard.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {assetCount} asset{assetCount > 1 ? 's' : ''}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {moodBoard.isPublic ? (
                        <Unlock className="text-green-400 w-4 h-4" />
                    ) : (
                        <Lock className="text-gray-600 w-4 h-4" />
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(moodBoard.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                    >
                        <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                </div>
            </div>

            {moodBoard.description && (
                <p className="text-xs text-gray-600 mt-2 line-clamp-2">{moodBoard.description}</p>
            )}
        </div>
    );
};

export const MoodBoards = () => {
    const { moodBoards, createMoodBoard, deleteMoodBoard } = useData();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedMoodBoard, setSelectedMoodBoard] = useState(null);
    const [newMoodBoardName, setNewMoodBoardName] = useState('');
    const [newMoodBoardDesc, setNewMoodBoardDesc] = useState('');

    const handleCreate = () => {
        if (!newMoodBoardName.trim()) return;

        createMoodBoard(newMoodBoardName, newMoodBoardDesc);
        setNewMoodBoardName('');
        setNewMoodBoardDesc('');
        setIsCreateModalOpen(false);
    };

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
                            <Layers className="text-mv-gold" size={24} />
                            Mood Boards
                        </h2>
                        <p className="text-sm text-gray-400">
                            Organisez vos assets en collections thématiques
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-mv-gold hover:bg-white text-black font-medium rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        Nouveau Mood Board
                    </button>
                </div>

                {/* Mood Boards Grid */}
                {moodBoards.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 border-dashed rounded-xl p-12 text-center">
                        <Layers className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                        <h3 className="text-white font-medium mb-2">Aucun Mood Board</h3>
                        <p className="text-gray-500 text-sm mb-4">
                            Créez des collections pour organiser vos meilleurs assets
                        </p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 bg-mv-gold hover:bg-white text-black font-medium rounded-lg transition-colors inline-flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Créer mon premier Mood Board
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {moodBoards.map(moodBoard => (
                            <MoodBoardCard
                                key={moodBoard.id}
                                moodBoard={moodBoard}
                                onClick={setSelectedMoodBoard}
                                onDelete={deleteMoodBoard}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setNewMoodBoardName('');
                    setNewMoodBoardDesc('');
                }}
                title="Nouveau Mood Board"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Nom *
                        </label>
                        <input
                            type="text"
                            value={newMoodBoardName}
                            onChange={(e) => setNewMoodBoardName(e.target.value)}
                            placeholder="Ex: Campagne Été 2026"
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold transition-colors"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Description (optionnel)
                        </label>
                        <textarea
                            value={newMoodBoardDesc}
                            onChange={(e) => setNewMoodBoardDesc(e.target.value)}
                            placeholder="Décrivez l'objectif de cette collection..."
                            rows={3}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold transition-colors resize-none"
                        />
                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                        <button
                            onClick={() => {
                                setIsCreateModalOpen(false);
                                setNewMoodBoardName('');
                                setNewMoodBoardDesc('');
                            }}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!newMoodBoardName.trim()}
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
