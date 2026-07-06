import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export const ImageUploader = ({ onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        processFiles(files);
    };

    const processFiles = (files) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        imageFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                onUpload({
                    file,
                    url: e.target.result,
                    name: file.name
                });
            };
            reader.readAsDataURL(file);
        });
    };

    return (
        <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                ${isDragging ? 'border-mv-gold bg-mv-gold/10' : 'border-white/10 hover:border-white/30 bg-white/5'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
                accept="image/*"
            />

            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 text-white">
                <Upload size={24} />
            </div>

            <h3 className="text-white font-medium mb-1">Glisser-déposer des images</h3>
            <p className="text-gray-500 text-sm">ou cliquer pour parcourir</p>
        </div>
    );
};
