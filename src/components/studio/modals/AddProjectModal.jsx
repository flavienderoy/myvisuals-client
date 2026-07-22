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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Nouveau Dossier Projet"
            subtitle="Créez un nouvel espace de production rattaché à une entreprise client."
            maxWidth="max-w-2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                        Nom du Projet <span className="text-mv-gold">*</span>
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold focus:ring-1 focus:ring-mv-gold/30 transition-all font-medium text-base shadow-inner"
                        placeholder="Ex: Campagne Automne-Hiver 2026"
                        autoFocus
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                        Entreprise Client <span className="text-mv-gold">*</span>
                    </label>
                    {clients.length === 0 ? (
                        <div className="p-4 bg-white/[0.02] border border-white/10 rounded-xl text-sm text-gray-400 flex items-center justify-between">
                            <span>Aucune entreprise disponible. Créez d'abord une entreprise client.</span>
                        </div>
                    ) : (
                        <div className="relative">
                            <select
                                value={clientId}
                                onChange={(e) => setClientId(e.target.value)}
                                disabled={locked}
                                className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-mv-gold focus:ring-1 focus:ring-mv-gold/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed appearance-none font-medium text-base cursor-pointer"
                            >
                                <option value="" disabled className="bg-zinc-900 text-gray-400">Sélectionner une entreprise client…</option>
                                {clients.map((c) => (
                                    <option key={c.id} value={c.id} className="bg-zinc-900 text-white py-2">
                                        {c.name} {c.inviteStatus === 'accepted' ? '✓ (Compte actif)' : c.email ? '✉ (Invité)' : ''}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                ▾
                            </div>
                        </div>
                    )}
                    {renderClientStatus()}
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors rounded-xl"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={!name.trim() || !clientId}
                        className="px-7 py-3 bg-mv-gold text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(212,175,55,0.2)] active:scale-95"
                    >
                        Créer le Projet
                    </button>
                </div>
            </form>
        </Modal>

    );
};
