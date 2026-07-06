import React from 'react';
import { LuxuryTitle } from '../../components/common/LuxuryTitle';
import { MessageSquare, Send, Paperclip, CheckCircle } from 'lucide-react';

const ClientMessages = () => {
    const mockConversation = [
        { id: 1, sender: 'agency', name: 'Flavien (Studio)', text: 'Bonjour ! Les premiers rendus de la campagne Automne sont disponibles dans votre espace de livraison. Qu\'en pensez-vous ?', time: '10:30', isRead: true },
        { id: 2, sender: 'client', name: 'Vous', text: 'C\'est superbe ! J\'ai laissé un commentaire sur la version 2 de la vidéo pour ajuster la colorimétrie de la scène finale.', time: '11:15', isRead: true },
        { id: 3, sender: 'agency', name: 'Flavien (Studio)', text: 'Bien reçu. Notre étalonneur est dessus. Nous vous enverrons la V3 d\'ici la fin de journée.', time: '11:20', isRead: true },
    ];

    return (
        <div className="max-w-7xl mx-auto px-10 py-12 space-y-12 animate-fade-in h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex flex-col flex-shrink-0">
                <LuxuryTitle text="Messagerie Centrale" size="text-4xl" className="text-white mb-3" />
                <p className="text-gray-400 text-lg">Communiquez en direct avec votre équipe dédiée.</p>
            </div>

            <div className="flex-1 bg-[#1A1A1A]/50 border border-white/10 rounded-xl overflow-hidden flex flex-col min-h-0">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-mv-gold text-black flex items-center justify-center font-bold">
                        F
                    </div>
                    <div>
                        <p className="text-white font-medium">Flavien (Direction Artistique)</p>
                        <p className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> En ligne
                        </p>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {mockConversation.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] ${msg.sender === 'client' ? 'bg-[#D4AF37] text-black rounded-l-2xl rounded-tr-2xl' : 'bg-white/10 text-white rounded-r-2xl rounded-tl-2xl'} p-4 relative`}>
                                {msg.sender === 'agency' && <p className="text-xs text-gray-400 mb-1 font-medium">{msg.name}</p>}
                                <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                                <div className={`flex items-center justify-end gap-1 mt-2 text-[10px] ${msg.sender === 'client' ? 'text-black/60' : 'text-gray-500'}`}>
                                    <span>{msg.time}</span>
                                    {msg.sender === 'client' && <CheckCircle size={10} />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-black/40">
                    <div className="flex items-center gap-2">
                        <button className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <Paperclip size={20} />
                        </button>
                        <input
                            type="text"
                            placeholder="Écrivez votre message..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
                        />
                        <button className="p-3 bg-[#D4AF37] text-black hover:bg-white rounded-lg transition-colors flex items-center justify-center shadow-lg">
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientMessages;
