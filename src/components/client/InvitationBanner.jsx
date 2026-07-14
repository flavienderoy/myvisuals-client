import React, { useEffect, useState } from 'react';
import { MailCheck, Loader2, Sparkles } from 'lucide-react';
import { clientService } from '../../services/clientService';
import { useData } from '../../context/DataContext';
import { useToast } from '../../hooks/useToast';

/**
 * Prominent banner shown in the client portal when the logged-in user has
 * pending studio invitations addressed to their email. Accepting links their
 * account to the studio's client record so their projects appear.
 */
export const InvitationBanner = () => {
    const { refreshData } = useData();
    const toast = useToast();
    const [invitations, setInvitations] = useState([]);
    const [acceptingId, setAcceptingId] = useState(null);

    const loadInvitations = async () => {
        try {
            const data = await clientService.getInvitations();
            setInvitations(Array.isArray(data) ? data : []);
        } catch {
            setInvitations([]);
        }
    };

    useEffect(() => {
        loadInvitations();
    }, []);

    const handleAccept = async (invitation) => {
        setAcceptingId(invitation.id);
        try {
            await clientService.acceptInvitation(invitation.id);
            toast.success('Invitation acceptée — vos projets sont disponibles');
            setInvitations((prev) => prev.filter((i) => i.id !== invitation.id));
            await refreshData?.();
        } catch (e) {
            toast.error(e?.response?.data?.error || "Impossible d'accepter l'invitation");
        } finally {
            setAcceptingId(null);
        }
    };

    if (invitations.length === 0) return null;

    return (
        <div className="space-y-4 mb-8">
            {invitations.map((invitation) => {
                const studioName = invitation.owner?.organization || invitation.owner?.name || 'Un studio';
                return (
                    <div
                        key={invitation.id}
                        className="relative overflow-hidden rounded-2xl border border-mv-gold/40 bg-gradient-to-r from-mv-gold/15 via-mv-gold/5 to-transparent p-6 md:p-8 shadow-[0_0_40px_rgba(212,175,55,0.15)] animate-fade-in-up"
                    >
                        <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
                            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-mv-gold/20 border border-mv-gold/40 shrink-0">
                                <Sparkles className="text-mv-gold" size={26} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                                    {studioName} vous invite à rejoindre vos projets
                                </h3>
                                <p className="text-sm text-gray-300">
                                    Acceptez l'invitation pour accéder à vos visuels, valider vos livrables et télécharger vos fichiers.
                                </p>
                            </div>
                            <button
                                onClick={() => handleAccept(invitation)}
                                disabled={acceptingId === invitation.id}
                                className="flex items-center justify-center gap-2 bg-mv-gold text-black font-bold uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-70 shrink-0"
                            >
                                {acceptingId === invitation.id ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <MailCheck size={18} />
                                )}
                                Accepter
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
