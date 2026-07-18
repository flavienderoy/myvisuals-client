import React, { useState, useEffect } from 'react';
import { Users, Mail, Shield, UserX, Loader2, Plus } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { teamService } from '../../services/teamService';
import { useToast } from '../../hooks/useToast';

export const TeamSettings = () => {
    const { currentUser } = useData();
    const toast = useToast();
    
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInvite, setShowInvite] = useState(false);
    
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [inviting, setInviting] = useState(false);

    // Only the owner can manage the team
    const isOwner = currentUser?.studio?.isOwner;

    useEffect(() => {
        loadTeam();
    }, []);

    const loadTeam = async () => {
        try {
            setLoading(true);
            const data = await teamService.getTeamMembers();
            setMembers(data);
        } catch (e) {
            toast.error("Impossible de charger l'équipe");
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            setInviting(true);
            const newMember = await teamService.inviteMember({ email, role });
            setMembers([...members, newMember]);
            setShowInvite(false);
            setEmail('');
            setRole('member');
            toast.success("Membre ajouté à l'équipe !");
        } catch (e) {
            toast.error(e.response?.data?.error || "Erreur lors de l'ajout");
        } finally {
            setInviting(false);
        }
    };

    const handleRemove = async (id) => {
        if (!confirm("Retirer cet utilisateur de l'équipe ?")) return;
        try {
            await teamService.removeMember(id);
            setMembers(members.filter(m => m.id !== id));
            toast.success("Membre retiré");
        } catch (e) {
            toast.error("Erreur lors du retrait");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 text-mv-gold">
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Users className="text-mv-gold" />
                        Mon Équipe Studio
                    </h1>
                    <p className="text-gray-400">Gérez les membres de votre studio et leurs accès aux projets.</p>
                </div>
                { (isOwner || currentUser?.studio?.role === 'admin') && (
                    <button 
                        onClick={() => setShowInvite(true)}
                        className="bg-mv-gold text-black px-4 py-2.5 rounded-lg font-bold hover:bg-white transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                    >
                        <Plus size={18} />
                        Ajouter un membre
                    </button>
                )}
            </div>

            {/* Invite Modal */}
            {showInvite && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#141414] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-4">Ajouter à l'équipe</h2>
                        <p className="text-sm text-gray-400 mb-6">L'utilisateur doit déjà avoir un compte sur Visuals.co pour être ajouté à votre espace.</p>
                        
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email du collaborateur</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold/50 transition-colors"
                                        placeholder="freelance@email.com"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Rôle</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                    <select 
                                        value={role}
                                        onChange={e => setRole(e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-mv-gold/50 transition-colors appearance-none"
                                    >
                                        <option value="member">Membre (Accès Projets)</option>
                                        <option value="admin">Admin (Gestion d'équipe)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 pt-2">
                                <button 
                                    type="button"
                                    onClick={() => setShowInvite(false)}
                                    className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button 
                                    type="submit"
                                    disabled={inviting || !email}
                                    className="flex-1 py-2.5 rounded-lg bg-mv-gold text-black font-bold hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {inviting ? <Loader2 size={18} className="animate-spin" /> : 'Ajouter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Members List */}
            <div className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-[#0a0a0a]">
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Utilisateur</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Rôle</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Statut</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {members.map(member => (
                            <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {member.user?.avatar_url ? (
                                            <img src={member.user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-bold border border-white/10">
                                                {member.user?.name?.charAt(0) || member.user?.email?.charAt(0) || '?'}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-white">{member.user?.name || 'Utilisateur inconnu'}</p>
                                            <p className="text-xs text-gray-500">{member.user?.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide
                                        ${member.role === 'owner' ? 'bg-mv-gold/10 text-mv-gold border border-mv-gold/20' : 
                                          member.role === 'admin' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                                          'bg-white/5 text-gray-400 border border-white/10'}
                                    `}>
                                        {member.role === 'owner' ? 'Propriétaire' : member.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs text-green-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                                        Actif
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {member.role !== 'owner' && (isOwner || currentUser?.studio?.role === 'admin') && (
                                        <button 
                                            onClick={() => handleRemove(member.id)}
                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Retirer de l'équipe"
                                        >
                                            <UserX size={18} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {members.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">
                        Aucun membre dans l'équipe.
                    </div>
                )}
            </div>
        </div>
    );
};
