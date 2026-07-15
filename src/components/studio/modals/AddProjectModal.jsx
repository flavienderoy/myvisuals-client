import React, { useState, useEffect } from 'react';
import { Modal } from '../../common/Modal';
import { useData } from '../../../context/DataContext';
import { MailCheck, Mail, UserX } from 'lucide-react';

export const AddProjectModal = ({ isOpen, onClose, initialClient = '', initialClientId = '' }) => {
    const { addProject, clients } = useData();
    const [name, setName] = useState('');
    const [clientId, setClientId] = useState('');

    // Resolve the initial selection from an explicit id, or by matching a name
    useEffect(() => {
        if (initialClientId) {
            setClientId(initialClientId);
        } else if (initialClient) {
            const match = clients.find((c) => c.name === initialClient);
            setClientId(match?.id || '');
        } else {
            setClientId('');
        }
    }, [initialClient, initialClientId, isOpen, clients]);

    const selectedClient = clients.find((c) => c.id === clientId);
    const locked = Boolean(initialClientId || initialClient);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !clientId) return;

        addProject({
            name,
            clientId,
            description: '',
            date: new Date().toISOString().split('T')[0],
        });

        setName('');
        if (!locked) setClientId('');
        onClose();
    };

    // Small badge describing whether the client is linked to a real account
    const renderClientStatus = () => {
        if (!selectedClient) return null;
        if (selectedClient.inviteStatus === 'accepted') {
            return (
                <div className="flex items-center gap-2 text-xs text-emerald-400 mt-2">
                    <MailCheck size={14} /> Compte client lié — le client verra ce projet dans son espace.
                </div>
            );
        }
        if (selectedClient.email) {
            return (
                <div className="flex items-center gap-2 text-xs text-mv-gold mt-2">
                    <Mail size={14} /> Invitation en attente ({selectedClient.email}) — visible dès qu'il l'accepte.
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                <UserX size={14} /> Aucun email d'invitation — ce client n'a pas d'accès au portail.
            </div>
        );
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
                    {clients.length === 0 ? (
                        <p className="text-sm text-gray-500 bg-black/20 border border-white/10 rounded-lg px-4 py-3">
                            Aucun client. Créez d'abord une entreprise pour lui rattacher un projet.
                        </p>
                    ) : (
                        <select
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            disabled={locked}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mv-gold/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed appearance-none"
                        >
                            <option value="" disabled>Sélectionner un client…</option>
                            {clients.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                    {c.inviteStatus === 'accepted' ? ' ✓ (lié)' : c.email ? ' ✉ (invité)' : ''}
                                </option>
                            ))}
                        </select>
                    )}
                    {renderClientStatus()}
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
                        disabled={!name.trim() || !clientId}
                        className="px-6 py-2 bg-mv-gold text-black font-medium rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Créer le dossier
                    </button>
                </div>
            </form>
        </Modal>
    );
};
