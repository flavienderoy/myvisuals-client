import React, { useState, useRef } from 'react';
import { Modal } from '../../common/Modal';
import { useData } from '../../../context/DataContext';
import { Upload, X } from 'lucide-react';

export const AddClientModal = ({ isOpen, onClose }) => {
    const { addClient } = useData();
    const [name, setName] = useState('');
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

        addClient(name, description, avatar);

        // Reset form
        setName('');
        setDescription('');
        setAvatar(null);
        if (fileInputRef.current) fileInputRef.current.value = '';

        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Ajouter une Entreprise">
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Image Upload Selection */}
                <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 transition-colors ${avatar ? 'border-mv-gold' : 'border-white/10 hover:border-white/30 bg-black/20'}`}>
                            {avatar ? (
                                <img src={avatar} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Upload className="text-gray-400 group-hover:text-white transition-colors" size={32} />
                            )}
                        </div>

                        {avatar && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                                className="absolute -top-1 -right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}

                        <div className="absolute inset-x-0 -bottom-6 text-center">
                            <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                                {avatar ? 'Modifier le logo' : 'Ajouter un logo'}
                            </span>
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                <div className="pt-2">
                    <label className="block text-sm text-gray-400 mb-2">Nom de l'entreprise</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mv-gold/50 transition-colors"
                        placeholder="Ex: Maison Éclat"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">Description (Optionnel)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mv-gold/50 transition-colors h-24 resize-none"
                        placeholder="Notes sur le client..."
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={!name.trim()}
                        className="px-6 py-2 bg-mv-gold text-black font-medium rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Créer
                    </button>
                </div>
            </form>
        </Modal>
    );
};
