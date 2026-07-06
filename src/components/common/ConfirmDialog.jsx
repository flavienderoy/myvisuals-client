import React, { useState, useCallback } from 'react';
import { Modal } from '../common/Modal';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmer l'action",
    message = "Êtes-vous sûr de vouloir continuer ?",
    confirmText = "Confirmer",
    cancelText = "Annuler",
    variant = "danger" // 'danger' | 'warning' | 'info'
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = useCallback(async () => {
        setIsLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Confirmation error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [onConfirm, onClose]);

    const variantStyles = {
        danger: {
            icon: 'text-red-500',
            iconBg: 'bg-red-500/10 border-red-500/30',
            button: 'bg-red-500 hover:bg-red-600 text-white'
        },
        warning: {
            icon: 'text-orange-500',
            iconBg: 'bg-orange-500/10 border-orange-500/30',
            button: 'bg-orange-500 hover:bg-orange-600 text-white'
        },
        info: {
            icon: 'text-mv-gold',
            iconBg: 'bg-mv-gold/10 border-mv-gold/30',
            button: 'bg-mv-gold hover:bg-white text-black'
        }
    };

    const styles = variantStyles[variant];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="text-center">
                <div className={`w-16 h-16 ${styles.iconBg} border rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <AlertTriangle className={styles.icon} size={32} />
                </div>

                <h3 id="modal-title" className="text-xl font-medium text-white mb-2">{title}</h3>
                <p id="modal-desc" className="text-gray-400 text-sm mb-6">{message}</p>

                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`px-6 py-2 ${styles.button} font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Chargement...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
