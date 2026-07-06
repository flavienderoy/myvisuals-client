import React from 'react';

export const ShowroomLayout = ({ children }) => {
    return (
        <div className="w-full h-screen bg-mv-black text-white font-sans overflow-hidden flex flex-col">
            <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden relative scrollbar-hide">
                {/* Ambient Light specific to Showroom */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mv-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                </div>

                <div className="relative z-10 w-full min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
};
