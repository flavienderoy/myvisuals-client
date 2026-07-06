import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { FileText, Plus, Trash2, Download, Send } from 'lucide-react';
import { QUOTE_STATUS } from '../../constants';

const QuoteItem = ({ item, onRemove, onChange }) => {
    return (
        <div className="flex gap-3 items-start p-3 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex-1 grid grid-cols-3 gap-3">
                <input
                    type="text"
                    value={item.description}
                    onChange={(e) => onChange({ ...item, description: e.target.value })}
                    placeholder="Description"
                    className="col-span-2 px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-mv-gold"
                />
                <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => onChange({ ...item, amount: parseFloat(e.target.value) || 0 })}
                    placeholder="Montant €"
                    className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-mv-gold"
                />
            </div>
            <button
                onClick={onRemove}
                className="p-2 hover:bg-red-500/20 rounded transition-colors"
            >
                <Trash2 className="text-red-400" size={16} />
            </button>
        </div>
    );
};

export const QuoteBuilder = ({ projectId, clientId, onClose }) => {
    const { createQuote } = useData();
    const [quoteData, setQuoteData] = useState({
        title: '',
        clientId,
        projectId,
        items: [{ id: '1', description: '', amount: 0 }],
        notes: '',
    });

    const addItem = () => {
        setQuoteData({
            ...quoteData,
            items: [...quoteData.items, { id: Date.now().toString(), description: '', amount: 0 }],
        });
    };

    const removeItem = (id) => {
        setQuoteData({
            ...quoteData,
            items: quoteData.items.filter(item => item.id !== id),
        });
    };

    const updateItem = (id, updatedItem) => {
        setQuoteData({
            ...quoteData,
            items: quoteData.items.map(item => item.id === id ? updatedItem : item),
        });
    };

    const total = quoteData.items.reduce((sum, item) => sum + item.amount, 0);
    const tva = total * 0.20; // 20% TVA
    const totalTTC = total + tva;

    const handleSave = (status) => {
        createQuote({
            ...quoteData,
            status,
            total: totalTTC,
        });
        onClose();
    };

    const handleExportPDF = () => {
        // Simulate PDF generation
        console.log('Generating PDF for quote:', quoteData);
        alert('Fonctionnalité PDF disponible avec backend complet');
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Créer un Devis">
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Titre du devis *
                    </label>
                    <input
                        type="text"
                        value={quoteData.title}
                        onChange={(e) => setQuoteData({ ...quoteData, title: e.target.value })}
                        placeholder="Ex: Shooting Campagne Été 2026"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold transition-colors"
                        autoFocus
                    />
                </div>

                {/* Items */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-400">
                            Prestations
                        </label>
                        <button
                            onClick={addItem}
                            className="text-sm text-mv-gold hover:text-white transition-colors flex items-center gap-1"
                        >
                            <Plus size={14} />
                            Ajouter
                        </button>
                    </div>
                    <div className="space-y-2">
                        {quoteData.items.map(item => (
                            <QuoteItem
                                key={item.id}
                                item={item}
                                onRemove={() => removeItem(item.id)}
                                onChange={(updated) => updateItem(item.id, updated)}
                            />
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Notes / Conditions
                    </label>
                    <textarea
                        value={quoteData.notes}
                        onChange={(e) => setQuoteData({ ...quoteData, notes: e.target.value })}
                        placeholder="Conditions de paiement, délais, etc..."
                        rows={3}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold transition-colors resize-none"
                    />
                </div>

                {/* Total */}
                <div className="bg-mv-gold/10 border border-mv-gold/30 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Sous-total HT</span>
                        <span className="text-white font-mono">{total.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">TVA (20%)</span>
                        <span className="text-white font-mono">{tva.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-lg font-medium pt-2 border-t border-mv-gold/30">
                        <span className="text-mv-gold">Total TTC</span>
                        <span className="text-mv-gold font-mono">{totalTTC.toFixed(2)} €</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Download size={16} />
                        PDF
                    </button>
                    <button
                        onClick={() => handleSave(QUOTE_STATUS.DRAFT)}
                        className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg transition-colors"
                    >
                        Sauvegarder brouillon
                    </button>
                    <button
                        onClick={() => handleSave(QUOTE_STATUS.SENT)}
                        disabled={!quoteData.title.trim()}
                        className="flex-1 px-4 py-2 bg-mv-gold hover:bg-white text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={16} />
                        Envoyer
                    </button>
                </div>
            </div>
        </Modal>
    );
};

// Quote List Component
export const QuoteList = ({ clientId }) => {
    const { quotes, getQuotesByClient } = useData();
    const [showBuilder, setShowBuilder] = useState(false);

    const clientQuotes = clientId ? getQuotesByClient(clientId) : quotes;

    const statusColors = {
        [QUOTE_STATUS.DRAFT]: 'bg-gray-500/10 text-gray-400',
        [QUOTE_STATUS.SENT]: 'bg-blue-500/10 text-blue-400',
        [QUOTE_STATUS.ACCEPTED]: 'bg-green-500/10 text-green-400',
        [QUOTE_STATUS.REJECTED]: 'bg-red-500/10 text-red-400',
        [QUOTE_STATUS.EXPIRED]: 'bg-orange-500/10 text-orange-400',
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-white font-medium flex items-center gap-2">
                    <FileText className="text-mv-gold" size={16} />
                    Devis ({clientQuotes.length})
                </h3>
                <button
                    onClick={() => setShowBuilder(true)}
                    className="text-sm text-mv-gold hover:text-white transition-colors flex items-center gap-1"
                >
                    <Plus size={14} />
                    Nouveau devis
                </button>
            </div>

            {clientQuotes.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun devis</p>
            ) : (
                <div className="space-y-2">
                    {clientQuotes.map(quote => (
                        <div key={quote.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="text-white text-sm font-medium">{quote.title}</h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[quote.status]}`}>
                                    {quote.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">
                                    {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                                </span>
                                <span className="text-mv-gold font-mono font-medium">
                                    {quote.total.toFixed(2)} €
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showBuilder && (
                <QuoteBuilder
                    clientId={clientId}
                    onClose={() => setShowBuilder(false)}
                />
            )}
        </div>
    );
};
