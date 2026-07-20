import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { useData } from '../../../context/DataContext';

export const AddSmartFolderModal = ({ isOpen, onClose, currentFilters, currentSearch }) => {
    const [name, setName] = useState('');
    const { createSmartFolder } = useData();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        const filters = {
            search: currentSearch,
            status: currentFilters.status || [],
            client: currentFilters.client || []
        };

        await createSmartFolder(name, filters);
        setName('');
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                >
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Sauvegarder en Smart Folder</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Nom du dossier intelligent
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="ex: Projets en cours de validation"
                                className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mv-gold transition-colors"
                                required
                            />
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">Filtres qui seront sauvegardés :</h4>
                            <ul className="text-sm text-gray-300 space-y-1">
                                <li><strong>Recherche :</strong> {currentSearch || <em>Aucune</em>}</li>
                                <li><strong>Statuts :</strong> {currentFilters.status?.length ? currentFilters.status.join(', ') : <em>Tous</em>}</li>
                                <li><strong>Clients :</strong> {currentFilters.client?.length ? currentFilters.client.join(', ') : <em>Tous</em>}</li>
                            </ul>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 text-sm font-medium text-black bg-mv-gold hover:bg-white rounded-full transition-colors flex items-center gap-2"
                            >
                                <Save size={16} />
                                Sauvegarder
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
