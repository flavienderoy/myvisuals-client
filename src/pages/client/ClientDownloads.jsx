import React from 'react';
import { LuxuryTitle } from '../../components/common/LuxuryTitle';
import { Download, FileImage, FileVideo, FileArchive, Search, Clock } from 'lucide-react';

const ClientDownloads = () => {
    const mockDownloads = [
        { id: 1, name: "Campagne_Automne_PackWeb.zip", type: "archive", size: "145 MB", date: "12 Mars 2026", project: "Campagne Automne" },
        { id: 2, name: "Master_Cut_V3.mp4", type: "video", size: "2.1 GB", date: "10 Mars 2026", project: "Launch Video" },
        { id: 3, name: "Cover_Social_HD.png", type: "image", size: "4.2 MB", date: "08 Mars 2026", project: "Campagne Automne" },
        { id: 4, name: "Moodboard_Validation.pdf", type: "document", size: "12 MB", date: "01 Mars 2026", project: "Shooting Hiver" },
    ];

    const getIcon = (type) => {
        switch (type) {
            case 'video': return <FileVideo size={24} className="text-blue-400" />;
            case 'archive': return <FileArchive size={24} className="text-mv-gold" />;
            case 'image': return <FileImage size={24} className="text-green-400" />;
            default: return <Download size={24} className="text-gray-400" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-10 py-12 space-y-12 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <LuxuryTitle text="Téléchargements" size="text-4xl" className="text-white mb-3" />
                    <p className="text-gray-400 text-lg">Retrouvez l'historique de tous vos fichiers livrés.</p>
                </div>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-full md:w-64 focus-within:border-white/30 transition-colors">
                    <Search size={16} className="text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Rechercher un fichier..."
                        className="bg-transparent border-none text-sm text-white placeholder:text-gray-600 outline-none w-full"
                    />
                </div>
            </div>

            <div className="bg-[#1A1A1A]/50 border border-white/10 rounded-xl overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 text-xs text-gray-500 font-medium uppercase tracking-widest">
                    <div className="col-span-6">Nom du fichier</div>
                    <div className="col-span-3">Projet</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1 text-right">Taille</div>
                </div>

                <div className="divide-y divide-white/5">
                    {mockDownloads.map((file) => (
                        <div key={file.id} className="group grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="col-span-6 flex items-center gap-4">
                                <div className="p-3 bg-black/50 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
                                    {getIcon(file.type)}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white font-medium truncate group-hover:text-mv-gold transition-colors">{file.name}</p>
                                    <p className="text-xs text-gray-500 md:hidden mt-0.5">{file.project} • {file.date}</p>
                                </div>
                            </div>
                            <div className="col-span-3 hidden md:block text-sm text-gray-400">{file.project}</div>
                            <div className="col-span-2 hidden md:flex items-center gap-2 text-sm text-gray-400">
                                <Clock size={14} className="text-gray-500" />
                                {file.date}
                            </div>
                            <div className="col-span-1 flex justify-between md:justify-end items-center text-sm font-medium">
                                <span className="md:hidden text-gray-500">Taille:</span>
                                <span className="text-white/70">{file.size}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClientDownloads;
