import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, User, MessageSquare } from 'lucide-react';
import { APPROVAL_STATUS } from '../../constants';

export const ApprovalWorkflow = ({ asset, onApprove, onReject }) => {
    const [comment, setComment] = useState('');
    const [showCommentBox, setShowCommentBox] = useState(false);

    // Mock approval levels - would come from project settings
    const approvalLevels = [
        { level: 1, role: 'Créateur', approver: 'Jean Dupont', status: APPROVAL_STATUS.APPROVED, timestamp: new Date(Date.now() - 86400000) },
        { level: 2, role: 'Directeur Artistique', approver: 'Marie Martin', status: APPROVAL_STATUS.PENDING },
        { level: 3, role: 'Client', approver: 'Client Final', status: APPROVAL_STATUS.PENDING },
    ];

    const currentLevel = approvalLevels.find(l => l.status === APPROVAL_STATUS.PENDING);

    const handleApprove = () => {
        onApprove(comment);
        setComment('');
        setShowCommentBox(false);
    };

    const handleReject = () => {
        if (!comment.trim()) {
            setShowCommentBox(true);
            return;
        }
        onReject(comment);
        setComment('');
        setShowCommentBox(false);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case APPROVAL_STATUS.APPROVED:
                return <CheckCircle className="text-green-400" size={16} />;
            case APPROVAL_STATUS.REJECTED:
                return <XCircle className="text-red-400" size={16} />;
            case APPROVAL_STATUS.PENDING:
                return <Clock className="text-gray-500" size={16} />;
            default:
                return <Clock className="text-gray-500" size={16} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case APPROVAL_STATUS.APPROVED:
                return 'bg-green-500/10 border-green-500/30 text-green-400';
            case APPROVAL_STATUS.REJECTED:
                return 'bg-red-500/10 border-red-500/30 text-red-400';
            case APPROVAL_STATUS.PENDING:
                return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
            default:
                return 'bg-gray-500/10 border-gray-500/30 text-gray-400';
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-white font-medium mb-1">Workflow d'Approbation</h3>
                <p className="text-sm text-gray-400">
                    Niveau {currentLevel?.level || 'Final'} / {approvalLevels.length}
                </p>
            </div>

            {/* Approval Levels */}
            <div className="space-y-3">
                {approvalLevels.map((level, idx) => (
                    <div key={level.level} className="relative">
                        {/* Connector Line */}
                        {idx < approvalLevels.length - 1 && (
                            <div className="absolute left-[11px] top-8 bottom-0 w-px bg-white/10" />
                        )}

                        <div className={`border rounded-lg p-4 ${getStatusColor(level.status)}`}>
                            <div className="flex items-start gap-3">
                                {/* Icon */}
                                <div className="mt-0.5 relative z-10">
                                    {getStatusIcon(level.status)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">
                                            Niveau {level.level}: {level.role}
                                        </span>
                                        <span className="text-xs opacity-60">
                                            {level.status === APPROVAL_STATUS.APPROVED && level.timestamp
                                                ? new Date(level.timestamp).toLocaleDateString('fr-FR')
                                                : level.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs opacity-80">
                                        <User size={12} />
                                        <span>{level.approver}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Current Level Actions */}
            {currentLevel && (
                <div className="border-t border-white/10 pt-4 space-y-3">
                    <p className="text-sm text-gray-400">
                        En attente de validation par <span className="text-white font-medium">{currentLevel.approver}</span>
                    </p>

                    {/* Comment Box */}
                    {showCommentBox && (
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Commentaire {!comment.trim() && '(requis pour refuser)'}
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Ajoutez un commentaire..."
                                rows={3}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold transition-colors resize-none"
                                autoFocus
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleReject}
                            className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <XCircle size={16} />
                            Refuser
                        </button>
                        <button
                            onClick={() => setShowCommentBox(!showCommentBox)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors"
                        >
                            <MessageSquare size={16} />
                        </button>
                        <button
                            onClick={handleApprove}
                            className="flex-1 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <CheckCircle size={16} />
                            Approuver
                        </button>
                    </div>
                </div>
            )}

            {/* All Approved */}
            {!currentLevel && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                    <CheckCircle className="text-green-400 w-8 h-8 mx-auto mb-2" />
                    <p className="text-green-400 font-medium">Toutes les approbations validées !</p>
                    <p className="text-xs text-green-400/60 mt-1">Cet asset est prêt pour la livraison</p>
                </div>
            )}
        </div>
    );
};
