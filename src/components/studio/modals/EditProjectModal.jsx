import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import { useData } from '../../../context/DataContext';

export const EditProjectModal = ({ isOpen, onClose, project }) => {
    const { updateProject, clients } = useData();

    const [name, setName] = useState('');
    const [client, setClient] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [date, setDate] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        if (project && isOpen) {
            setName(project.name || '');
            setClient(project.client || '');
            setDescription(project.description || '');
            setStatus(project.status || 'in_progress');
            setDate(project.date || '');
            setPrice(project.price || '');
        }
    }, [project, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !client.trim()) return;

        updateProject(project.id, {
            name,
            client,
            description,
            status,
            date,
            price
        });

        onClose();
    };

    if (!project) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Éditer le projet">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Nom du projet</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mv-gold/50 transition-colors"
                            placeholder="Nom du projet"
                            required
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
                                required
                            />
                            <datalist id="clients-list">
                                {clients.map(c => (
                                    <option key={c.id} value={c.name} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Statut</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mv-gold/50 transition-colors"
                        >
                            <option value="pending">En attente (Pending)</option>
                            <option value="in_progress">En cours (In Progress)</option>
                            <option value="completed">Terminé (Completed)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Date d'Échéance</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mv-gold/50 transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">Montant du Devis (€)</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mv-gold/50 transition-colors"
                        placeholder="Ex: 4500"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">Brief & Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mv-gold/50 transition-colors min-h-[120px]"
                        placeholder="Rédigez le brief créatif ici..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-white/10 mt-6">
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
                        Enregistrer les modifications
                    </button>
                </div>
            </form>
        </Modal>
    );
};
