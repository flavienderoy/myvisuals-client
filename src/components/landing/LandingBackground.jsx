import React from 'react';

const LandingBackground = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050200]">

            {/* 1. Base Grid Layer (Architectural precision) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(212,175,55,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(212,175,55,0.03)_1px,transparent_1px)] bg-[size:100px_100px] opacity-70"></div>

            {/* Dark Gold Mesh - Composantes radiales */}

            {/* Lumière principale directionnelle venant du haut droit */}
            <div
                className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vh] rounded-full mix-blend-screen opacity-15"
                style={{
                    background: 'radial-gradient(circle at center, #D4AF37 0%, transparent 70%)',
                    filter: 'blur(250px)',
                    transform: 'translate3d(0,0,0)'
                }}
            ></div>

            {/* Halo secondaire diffus pour étendre la lumière vers le centre */}
            <div
                className="absolute top-[10%] right-[10%] w-[100vw] h-[100vh] rounded-full mix-blend-screen opacity-10"
                style={{
                    background: 'radial-gradient(circle at center, #D4AF37 0%, transparent 60%)',
                    filter: 'blur(300px)',
                    transform: 'translate3d(0,0,0)'
                }}
            ></div>

            {/* Troisième halo plus faible pour équilibrer, côté gauche */}
            <div
                className="absolute top-[30%] left-[-20%] w-[70vw] h-[70vh] rounded-full mix-blend-screen opacity-5"
                style={{
                    background: 'radial-gradient(circle at center, #D4AF37 0%, transparent 70%)',
                    filter: 'blur(280px)',
                    transform: 'translate3d(0,0,0)'
                }}
            ></div>

            {/* Vignette effect to keep edges dark and focus the light organically */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,2,0,0.85)_100%)] pointer-events-none"></div>

            {/* Noise texture for metallic satin finish & banding prevention */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    opacity: 0.02,
                    mixBlendMode: 'overlay',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                }}
            ></div>

        </div>
    );
};

export default LandingBackground;
