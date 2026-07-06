import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import { useData } from '../../../context/DataContext';

export const AddProjectModal = ({ isOpen, onClose, initialClient = '' }) => {
    const { addProject, clients } = useData();
    const [name, setName] = useState('');
    const [client, setClient] = useState(initialClient);

    useEffect(() => {
        setClient(initialClient);
    }, [initialClient, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !client.trim()) return;

        addProject({
            name,
            client,
            description: '',
            date: new Date().toISOString().split('T')[0]
        });

        setName('');
        if (!initialClient) setClient(''); // Reset client only if not pre-filled
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nouveau Dossier Projet">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Nom du projet</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mv-gold/50 transition-colors"
                        placeholder="Ex: Campagne Été 2026"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">Client (Entreprise)</label>
                    <div className="relative">
                        <input
                            list="clients-list"
                            type="text"
                            value={client}
                            onChange={(e) => setClient(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mv-gold/50 transition-colors"
                            placeholder="Sélectionner ou saisir..."
                        />
                        <datalist id="clients-list">
                            {clients.map(c => (
                                <option key={c.id} value={c.name} />
                            ))}
                        </datalist>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={!name.trim() || !client.trim()}
                        className="px-6 py-2 bg-mv-gold text-black font-medium rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Créer le dossier
                    </button>
                </div>
            </form>
        </Modal>
    );
};
