import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Modal = ({ isOpen, onClose, title, subtitle, children, maxWidth = "max-w-xl", className = "" }) => {
    const modalRef = useRef(null);
    const previousFocusRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement;
            document.body.style.overflow = 'hidden';

            setTimeout(() => {
                modalRef.current?.focus();
            }, 100);

            const handleEscape = (e) => {
                if (e.key === 'Escape') onClose();
            };
            document.addEventListener('keydown', handleEscape);

            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = 'unset';
                previousFocusRef.current?.focus();
            };
        }
    }, [isOpen, onClose]);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl"
                        onClick={onClose}
                    />

                    {/* Modal Content Container */}
                    <motion.div
                        ref={modalRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-title"
                        tabIndex={-1}
                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 12 }}
                        transition={{ type: "spring", damping: 26, stiffness: 320 }}
                        className={`relative w-full ${maxWidth} bg-[#0e0e10]/95 border border-white/10 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden focus:outline-none backdrop-blur-2xl ${className}`}
                    >
                        {/* Top subtle luxury gold gradient highlight */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-mv-gold/50 to-transparent"></div>

                        {/* Header */}
                        <div className="flex items-start justify-between px-8 pt-8 pb-6 border-b border-white/10">
                            <div>
                                <h3 id="modal-title" className="text-2xl font-bold tracking-tight text-white">{title}</h3>
                                {subtitle && <p className="text-xs text-gray-400 mt-1 font-medium">{subtitle}</p>}
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Fermer la modale"
                                className="p-2.5 text-gray-400 hover:text-white transition-all rounded-full hover:bg-white/10 active:scale-95 -mr-2"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-8">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

