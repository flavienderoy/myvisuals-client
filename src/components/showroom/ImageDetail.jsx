import React, { useState } from 'react';
import { X, MessageSquare, CreditCard, Check, ShieldCheck, Download } from 'lucide-react';

const PaymentModal = ({ onClose, onPaid }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in">
            <div className="bg-mv-dark border border-mv-gold p-8 rounded-lg max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20} /></button>

                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-mv-gold text-black rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-2xl font-light text-white mb-2">Secure Payment</h3>
                    <p className="text-gray-400 text-sm">Unlock full resolution download.</p>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="p-4 border border-white/10 rounded bg-black/20 flex justify-between items-center">
                        <span className="text-sm text-gray-300">Total Amount</span>
                        <span className="text-xl font-bold text-white">€150.00</span>
                    </div>
                    <div className="text-xs text-center text-gray-500">
                        <span className="flex items-center justify-center gap-2"><Lock size={10} /> Encrypted via Stripe</span>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setTimeout(onPaid, 1500); // Simulate processing
                    }}
                    className="w-full py-4 bg-mv-gold text-black font-bold uppercase tracking-widest hover:bg-white transition-colors"
                >
                    Pay & Download
                </button>
            </div>
        </div>
    );
};

export const ImageDetail = ({ asset, onClose }) => {
    const [annotations, setAnnotations] = useState(asset.annotations || []);
    const [showPayment, setShowPayment] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const version = asset.versions.find(v => v.isLatest) || asset.versions[0];

    const handleImageClick = (e) => {
        if (isPaid) return; // No annotations after payment? Or maybe yes. Let's keep it simple.

        // Calculate relative coordinates
        const rect = e.target.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setAnnotations([...annotations, { x, y, text: "New comment..." }]);
    };

    return (
        <div className="fixed inset-0 z-40 bg-black flex animate-fade-in">
            {/* Main Image Area */}
            <div className="flex-1 relative bg-mv-black flex items-center justify-center overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-6 left-6 z-50 p-2 bg-black/50 text-white hover:text-mv-gold rounded-full transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="relative max-h-[90vh] max-w-[90vw]">
                    <img
                        src={version.url}
                        className="max-h-[90vh] object-contain cursor-crosshair"
                        onClick={handleImageClick}
                    />

                    {/* Annotations */}
                    {annotations.map((ann, i) => (
                        <div
                            key={i}
                            className="absolute group"
                            style={{ left: `${ann.x}%`, top: `${ann.y}%`, transform: 'translate(-50%, -50%)' }}
                        >
                            <div className="w-4 h-4 bg-mv-gold rounded-full border-2 border-black shadow-lg cursor-pointer hover:scale-125 transition-transform"></div>
                            <div className="absolute top-6 left-0 bg-white text-black text-xs p-2 rounded w-32 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                {ann.text}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-black/50 px-4 py-2 rounded-full backdrop-blur">
                    Click anywhere to add annotation
                </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 bg-mv-dark border-l border-white/5 p-6 flex flex-col">
                <h2 className="text-xl font-light text-white mb-1">{asset.name}</h2>
                <div className="text-xs text-mv-gold mb-6">{asset.versions.length} Versions</div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">Feedback</h3>
                    {annotations.length === 0 && <p className="text-gray-600 text-sm italic">No feedback yet.</p>}
                    {annotations.map((ann, i) => (
                        <div key={i} className="flex gap-3 text-sm text-gray-300">
                            <div className="mt-1 text-mv-gold"><MessageSquare size={14} /></div>
                            <div>{ann.text}</div>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    {isPaid ? (
                        <button className="w-full py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded flex items-center justify-center gap-2 transition-colors">
                            <Download size={18} /> Download High-Res
                        </button>
                    ) : (
                        <>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded font-medium transition-colors">
                                Validate Selection
                            </button>
                            <button
                                onClick={() => setShowPayment(true)}
                                className="w-full py-3 bg-mv-gold hover:bg-white text-black font-bold uppercase tracking-wide rounded transition-colors flex items-center justify-center gap-2"
                            >
                                <CreditCard size={16} /> Pay to Download
                            </button>
                        </>
                    )}
                </div>
            </div>

            {showPayment && (
                <PaymentModal
                    onClose={() => setShowPayment(false)}
                    onPaid={() => {
                        setIsPaid(true);
                        setShowPayment(false);
                    }}
                />
            )}
        </div>
    );
};
