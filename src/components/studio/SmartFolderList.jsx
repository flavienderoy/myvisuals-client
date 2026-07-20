import React, { useState } from 'react';
import { FolderHeart, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const SmartFolderList = ({ onApplyFolder }) => {
    const { smartFolders, deleteSmartFolder } = useData();

    if (!smartFolders || smartFolders.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-3 mt-4">
            {smartFolders.map(folder => (
                <div 
                    key={folder.id} 
                    className="flex items-center gap-2 bg-[#1a1a1a] border border-mv-gold/20 hover:border-mv-gold/50 transition-colors rounded-full pl-3 pr-1 py-1 cursor-pointer group"
                >
                    <div 
                        className="flex items-center gap-2"
                        onClick={() => onApplyFolder(folder.filters)}
                    >
                        <FolderHeart size={14} className="text-mv-gold" />
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{folder.name}</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteSmartFolder(folder.id);
                        }}
                        className="p-1 text-gray-500 hover:text-red-400 rounded-full hover:bg-white/10 transition-colors"
                        title="Supprimer"
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}
        </div>
    );
};
