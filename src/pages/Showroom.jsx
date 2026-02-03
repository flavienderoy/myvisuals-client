import React, { useState } from 'react';
import { WelcomeScreen } from '../components/showroom/WelcomeScreen';
import { ImmersiveGallery } from '../components/showroom/ImmersiveGallery';
import { AssetDetail } from '../components/studio/AssetDetail';
import database from '../data/database.json';

const Showroom = () => {
    const [viewState, setViewState] = useState('welcome'); // 'welcome' | 'gallery' | 'detail'
    const [selectedAsset, setSelectedAsset] = useState(null);
    const project = database.projects[0]; // Demo: Use first project

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
                <AssetDetail
                    asset={selectedAsset}
                    onClose={() => {
                        setSelectedAsset(null);
                        setViewState('gallery');
                    }}
                    authorName="Client"
                />
            )}
        </div>
    );
};

export default Showroom;
