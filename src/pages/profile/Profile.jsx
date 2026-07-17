import React, { useEffect, useRef, useState } from 'react';
import { User, Mail, Camera, Check, LogOut, Loader2, Building2, ShieldAlert } from 'lucide-react';
import { LuxuryTitle } from '../../components/common/LuxuryTitle';
import { PageTransition } from '../../components/common/PageTransition';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/profileService';
import { useToast } from '../../hooks/useToast';

const initials = (name) => (name || '?').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

const Profile = () => {
    const { currentUser, refreshData } = useData();
    const { signOut } = useAuth();
    const toast = useToast();
    const fileRef = useRef(null);

    const [name, setName] = useState('');
    const [organization, setOrganization] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const email = currentUser?.email || '';
    const role = currentUser?.role === 'client' ? 'Client' : 'Studio';

    useEffect(() => {
        (async () => {
            try {
                const p = await profileService.getProfile();
                setName(p.name || '');
                setOrganization(p.organization || '');
                setAvatar(p.avatar_url || null);
            } catch {
                setName(currentUser?.name || '');
                setAvatar(currentUser?.avatar || null);
            } finally {
                setLoading(false);
            }
        })();
    }, [currentUser]);

    const handleAvatarChange = async (file) => {
        if (!file) return;
        setUploading(true);
        try {
            const updated = await profileService.uploadAvatar(file);
            setAvatar(updated.avatar_url);
            toast.success('Photo de profil mise à jour');
            refreshData?.();
        } catch {
            toast.error("Échec de l'envoi de la photo");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) return toast.error('Le nom ne peut pas être vide');
        setSaving(true);
        try {
            await profileService.updateProfile({ name: name.trim(), organization: organization.trim() || null });
            toast.success('Profil enregistré');
            refreshData?.();
        } catch {
            toast.error("Impossible d'enregistrer le profil");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await profileService.deleteAccount?.();
            toast.success('Compte supprimé');
            signOut();
        } catch {
            toast.error('Suppression impossible');
        }
    };

    if (loading) {
        return (
            <PageTransition>
                <div className="h-[60vh] flex items-center justify-center text-gray-500 gap-3">
                    <Loader2 className="animate-spin" size={20} /> Chargement du profil…
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <LuxuryTitle text="Mon Profil" size="text-3xl" className="text-white mb-2" />
                        <p className="text-gray-400">Gérez vos informations et votre photo de profil.</p>
                    </div>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-2 text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors text-sm uppercase tracking-widest font-bold"
                    >
                        <LogOut size={16} /> Déconnexion
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Avatar card */}
                    <div className="col-span-1">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center shadow-lg">
                            <button
                                type="button"
                                onClick={() => fileRef.current?.click()}
                                className="relative inline-block mb-4 group"
                                aria-label="Changer la photo de profil"
                            >
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-mv-gold to-mv-black p-[2px]">
                                    {avatar ? (
                                        <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-mv-black flex items-center justify-center text-2xl font-bold text-white uppercase">
                                            {initials(name)}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    {uploading ? <Loader2 size={20} className="animate-spin text-white" /> : <Camera size={20} className="text-white" />}
                                </div>
                            </button>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleAvatarChange(e.target.files?.[0])}
                            />
                            <h3 className="text-white font-medium text-lg">{name || 'Sans nom'}</h3>
                            <p className="text-gray-500 text-sm mb-4 truncate">{email}</p>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-mv-gold/10 border border-mv-gold/20 rounded-full text-mv-gold text-xs font-bold uppercase tracking-wider">
                                {role}
                            </div>
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg">
                            <h4 className="flex items-center gap-2 text-white font-medium mb-6">
                                <User size={18} className="text-mv-gold" /> Informations personnelles
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase tracking-widest">Nom complet</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-9 pr-3 text-white text-sm focus:border-mv-gold/50 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase tracking-widest">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                        <input
                                            type="email"
                                            value={email}
                                            disabled
                                            className="w-full bg-black/10 border border-white/5 rounded-lg py-3 pl-9 pr-3 text-gray-500 text-sm outline-none cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                {role === 'Studio' && (
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs text-gray-400 uppercase tracking-widest">Studio / Organisation</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                                            <input
                                                type="text"
                                                value={organization}
                                                onChange={(e) => setOrganization(e.target.value)}
                                                placeholder="Nom de votre studio (apparaît dans le filigrane et les invitations)"
                                                className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-9 pr-3 text-white text-sm focus:border-mv-gold/50 outline-none placeholder-gray-600"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-mv-gold text-black font-bold rounded-lg hover:bg-white transition-colors disabled:opacity-60"
                                >
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                    Enregistrer
                                </button>
                            </div>
                        </div>

                        {/* Danger zone — RGPD erasure */}
                        <div className="bg-red-500/[0.04] border border-red-500/20 p-6 rounded-2xl">
                            <h4 className="flex items-center gap-2 text-red-400 font-medium mb-2">
                                <ShieldAlert size={18} /> Supprimer mon compte
                            </h4>
                            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                                Efface définitivement votre compte, vos projets et vos fichiers (droit à l'effacement — RGPD). Action irréversible.
                            </p>
                            {confirmDelete ? (
                                <div className="flex items-center gap-3">
                                    <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 transition-colors">
                                        Confirmer la suppression
                                    </button>
                                    <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                                        Annuler
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setConfirmDelete(true)}
                                    className="px-4 py-2 border border-red-500/40 text-red-400 text-sm font-medium rounded-lg hover:bg-red-500/10 transition-colors"
                                >
                                    Supprimer mon compte
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Profile;
