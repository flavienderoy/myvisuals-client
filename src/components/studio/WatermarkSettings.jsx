import React, { useState } from 'react';
import { Droplet, Type, Sliders, Eye } from 'lucide-react';

export const WatermarkSettings = ({ onSave }) => {
    const [settings, setSettings] = useState({
        enabled: true,
        text: 'VISUALS.CO',
        opacity: 30,
        position: 'center',
        size: 'medium',
        color: '#FFFFFF',
    });

    const positions = [
        { value: 'top-left', label: 'Haut Gauche' },
        { value: 'top-right', label: 'Haut Droite' },
        { value: 'center', label: 'Centre' },
        { value: 'bottom-left', label: 'Bas Gauche' },
        { value: 'bottom-right', label: 'Bas Droite' },
    ];

    const sizes = [
        { value: 'small', label: 'Petit' },
        { value: 'medium', label: 'Moyen' },
        { value: 'large', label: 'Grand' },
    ];

    const handleSave = () => {
        onSave(settings);
    };

    const getPreviewStyle = () => {
        const baseStyle = {
            opacity: settings.opacity / 100,
            color: settings.color,
        };

        const sizeMap = {
            small: '1rem',
            medium: '1.5rem',
            large: '2rem',
        };

        const positionMap = {
            'top-left': { top: '10%', left: '10%' },
            'top-right': { top: '10%', right: '10%' },
            'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
            'bottom-left': { bottom: '10%', left: '10%' },
            'bottom-right': { bottom: '10%', right: '10%' },
        };

        return {
            ...baseStyle,
            fontSize: sizeMap[settings.size],
            ...positionMap[settings.position],
        };
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-white font-medium mb-1 flex items-center gap-2">
                    <Droplet className="text-mv-gold" size={20} />
                    Paramètres du Watermark
                </h3>
                <p className="text-sm text-gray-400">
                    Personnalisez le filigrane sur vos images
                </p>
            </div>

            {/* Enable/Disable */}
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                <div>
                    <p className="text-white text-sm font-medium">Activer le watermark</p>
                    <p className="text-gray-500 text-xs">Appliqué automatiquement à tous les assets</p>
                </div>
                <button
                    onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
                    className={`relative w-14 h-7 rounded-full transition-colors ${settings.enabled ? 'bg-mv-gold' : 'bg-white/20'
                        }`}
                >
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.enabled ? 'translate-x-7' : ''
                        }`} />
                </button>
            </div>

            {settings.enabled && (
                <>
                    {/* Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                            <Type size={14} />
                            Texte
                        </label>
                        <input
                            type="text"
                            value={settings.text}
                            onChange={(e) => setSettings({ ...settings, text: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-mv-gold transition-colors"
                        />
                    </div>

                    {/* Opacity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                            <Sliders size={14} />
                            Opacité: {settings.opacity}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={settings.opacity}
                            onChange={(e) => setSettings({ ...settings, opacity: parseInt(e.target.value) })}
                            className="w-full accent-mv-gold"
                        />
                    </div>

                    {/* Position */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Position
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {positions.map(pos => (
                                <button
                                    key={pos.value}
                                    onClick={() => setSettings({ ...settings, position: pos.value })}
                                    className={`px-4 py-2 rounded-lg border transition-all ${settings.position === pos.value
                                            ? 'bg-mv-gold/10 border-mv-gold text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {pos.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Taille
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {sizes.map(size => (
                                <button
                                    key={size.value}
                                    onClick={() => setSettings({ ...settings, size: size.value })}
                                    className={`px-4 py-2 rounded-lg border transition-all ${settings.size === size.value
                                            ? 'bg-mv-gold/10 border-mv-gold text-white'
                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {size.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Couleur
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={settings.color}
                                onChange={(e) => setSettings({ ...settings, color: e.target.value })}
                                className="w-12 h-12 rounded-lg cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.color}
                                onChange={(e) => setSettings({ ...settings, color: e.target.value })}
                                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono focus:outline-none focus:border-mv-gold transition-colors"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                            <Eye size={14} />
                            Aperçu
                        </label>
                        <div className="relative h-48 bg-gradient-to-br from-gray-900 to-black rounded-lg overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800')] bg-cover bg-center opacity-50" />
                            <div
                                className="absolute font-bold tracking-wider"
                                style={getPreviewStyle()}
                            >
                                {settings.text}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Save Button */}
            <button
                onClick={handleSave}
                className="w-full px-4 py-3 bg-mv-gold hover:bg-white text-black font-medium rounded-lg transition-colors"
            >
                Enregistrer les paramètres
            </button>
        </div>
    );
};
