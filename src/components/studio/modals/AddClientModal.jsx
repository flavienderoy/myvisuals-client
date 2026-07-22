import React, { useState, useRef } from 'react';
import { Modal } from '../../common/Modal';
import { useData } from '../../../context/DataContext';
import { Upload, X } from 'lucide-react';

export const AddClientModal = ({ isOpen, onClose }) => {
    const { addClient } = useData();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [description, setDescription] = useState('');
    const [avatar, setAvatar] = useState(null); // Base64 string for storage
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setAvatar(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        addClient(name, description, avatar, email.trim() || null);

        // Reset form
        setName('');
        setEmail('');
        setDescription('');
        setAvatar(null);
        if (fileInputRef.current) fileInputRef.current.value = '';

        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Nouvelle Entreprise Client"
            subtitle="Enregistrez une entreprise client et configurez ses accès au portail."
            maxWidth="max-w-2xl"
        >
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Logo Upload Section */}
                <div className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-dashed border-white/15 rounded-2xl">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className={`w-28 h-28 rounded-2xl flex items-center justify-center overflow-hidden border-2 transition-all shadow-xl ${avatar ? 'border-mv-gold ring-4 ring-mv-gold/20' : 'border-white/15 hover:border-mv-gold/50 bg-black/40'}`}>
                            {avatar ? (
                                <img src={avatar} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex flex-col items-center text-center gap-1.5 p-2">
                                    <Upload className="text-gray-400 group-hover:text-mv-gold transition-colors" size={28} />
                                    <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider group-hover:text-gray-300">Logo</span>
                                </div>
                            )}
                        </div>

                        {avatar && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-transform active:scale-90"
                                title="Supprimer la photo"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <span className="text-xs text-gray-400 mt-3 font-medium">
                        {avatar ? 'Cliquez pour modifier le logo (PNG, JPG)' : 'Format recommandé : 512x512px (PNG, JPG)'}
                    </span>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            Nom de l'entreprise <span className="text-mv-gold">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold focus:ring-1 focus:ring-mv-gold/30 transition-all font-medium text-base shadow-inner"
                            placeholder="Ex: Maison Éclat"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            Email d'invitation <span className="text-gray-500 font-normal">(Optionnel)</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold focus:ring-1 focus:ring-mv-gold/30 transition-all font-medium text-base shadow-inner"
                            placeholder="contact@maisoneclat.com"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                        Description & Remarques <span className="text-gray-500 font-normal">(Optionnel)</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/15 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold focus:ring-1 focus:ring-mv-gold/30 transition-all font-medium text-sm h-28 resize-none shadow-inner"
                        placeholder="Notes internes, contacts clés, préférences de livraison..."
                    />
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
                        disabled={!name.trim()}
                        className="px-7 py-3 bg-mv-gold text-black font-bold text-xs uppercase tracking-wider rounded-full hover:bg-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(212,175,55,0.2)] active:scale-95"
                    >
                        Créer l'entreprise
                    </button>
                </div>
            </form>
        </Modal>

    );
};
