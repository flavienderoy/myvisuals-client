import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { WelcomeScreen } from '../components/showroom/WelcomeScreen';
import { ImmersiveGallery } from '../components/showroom/ImmersiveGallery';
import { ImageDetail } from '../components/showroom/ImageDetail';
import { useData } from '../context/DataContext';

const Showroom = () => {
    const { id } = useParams();
    const { projects } = useData();
    const [viewState, setViewState] = useState('welcome'); // 'welcome' | 'gallery' | 'detail'
    const [selectedAsset, setSelectedAsset] = useState(null);

    // Use project from URL parameter
    const project = projects.find(p => p.id === id);

    if (!project) return (
        <div className="flex items-center justify-center min-h-screen bg-mv-black">
            <div className="p-8 text-white text-center">
                <h1 className="text-2xl font-bold mb-4">Lien Expiré ou Invalide</h1>
                <p className="text-gray-400">Ce showroom n'est plus disponible.</p>
            </div>
        </div>
    );

    if (viewState === 'welcome') {
        return <WelcomeScreen onEnter={() => setViewState('gallery')} />;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <ImmersiveGallery
                project={project}
                onSelectAsset={(asset) => {
                    setSelectedAsset(asset);
                    setViewState('detail');
                }}
            />

            {viewState === 'detail' && selectedAsset && (
                <ImageDetail
                    asset={selectedAsset}
                    onClose={() => {
                        setSelectedAsset(null);
                        setViewState('gallery');
                    }}
                />
            )}
        </div>
    );
};

export default Showroom;
