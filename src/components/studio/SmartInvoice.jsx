import React from 'react';
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const SmartInvoice = () => {
    const items = [
        { desc: 'Shooting Journée Complète', qty: 1, price: 2500 },
        { desc: 'Retouches Haut de Gamme', qty: 25, price: 80 },
        { desc: 'Cession de droits (2 ans)', qty: 1, price: 500 }
    ];

    const total = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
    const tax = total * 0.20;

    const generatePDF = () => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(22);
        doc.text('FACTURE', 14, 20);
        doc.setFontSize(12);
        doc.text('Visuals.co', 14, 30);
        doc.text('Date: ' + new Date().toLocaleDateString('fr-FR'), 14, 38);
        doc.text('Statut: Brouillon', 14, 46);

        // Table
        const tableColumn = ["Description", "Quantité", "Prix Unitaire", "Total"];
        const tableRows = [];

        items.forEach(item => {
            const rowData = [
                item.desc,
                item.qty.toString(),
                item.price + " €",
                (item.qty * item.price) + " €"
            ];
            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 60,
            theme: 'grid',
            headStyles: { fillColor: [20, 20, 20] },
        });

        // Totals
        const finalY = doc.lastAutoTable.finalY || 60;
        doc.setFontSize(12);
        doc.text(`Sous-total: ${total} €`, 140, finalY + 10);
        doc.text(`TVA (20%): ${tax} €`, 140, finalY + 20);
        doc.setFontSize(14);
        doc.text(`Total TTC: ${total + tax} €`, 140, finalY + 30);

        doc.save('facture_brouillon.pdf');
    };

    return (
        <div className="bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <FileText size={16} /> Facturation Automatique
                </h3>
                <span className="bg-orange-500/10 text-orange-500 text-xs px-2 py-1 rounded border border-orange-500/20 uppercase tracking-wider">
                    Brouillon
                </span>
            </div>

            <div className="space-y-4 mb-6">
                {items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b border-white/10 hover:border-white/30 transition-all duration-300 last:border-0">
                        <div className="text-gray-300">
                            {item.desc}
                            <div className="text-xs text-gray-600">Qté: {item.qty}</div>
                        </div>
                        <div className="text-white font-mono">{item.qty * item.price} €</div>
                    </div>
                ))}
            </div>

            <div className="bg-white/5 rounded-lg p-4 mb-6 space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Sous-total</span>
                    <span>{total} €</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                    <span>TVA (20%)</span>
                    <span>{tax} €</span>
                </div>
                <div className="flex justify-between text-lg text-white font-bold pt-2 border-t border-white/10">
                    <span>Total TTC</span>
                    <span className="text-mv-gold">{total + tax} €</span>
                </div>
            </div>

            <button 
                onClick={generatePDF}
                className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors"
            >
                <Download size={14} />
                Générer la Facture
            </button>
        </div>
    );
};
