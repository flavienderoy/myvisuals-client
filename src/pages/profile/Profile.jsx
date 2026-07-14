import React, { useState } from 'react';
import { User, Mail, Bell, Shield, Check, LogOut } from 'lucide-react';
import { LuxuryTitle } from '../../components/common/LuxuryTitle';
import database from '../../data/database.json';
import { PageTransition } from '../../components/common/PageTransition';

const Profile = () => {
    const user = database.currentUser;
    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState('fr');

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <LuxuryTitle text="Mon Profil" size="text-3xl" className="text-white mb-2" />
                        <p className="text-gray-400">Gérez vos préférences et votre abonnement.</p>
                    </div>
                    <button
                        onClick={() => window.location.href = "/login"}
                        className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors text-sm uppercase tracking-widest font-bold"
                    >
                        <LogOut size={16} /> Déconnexion
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Avatar & Main Info */}
                    <div className="col-span-1">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center shadow-lg">
                            <div className="relative inline-block mb-4">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-mv-gold to-mv-black p-[2px]">
                                    <div className="w-full h-full rounded-full bg-mv-black flex items-center justify-center text-2xl font-bold text-white uppercase">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-mv-dark"></div>
                            </div>
                            <h3 className="text-white font-medium text-lg">{user.name}</h3>
                            <p className="text-gray-500 text-sm mb-4">{user.role}</p>

                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-mv-gold/10 border border-mv-gold/20 rounded-full text-mv-gold text-xs font-bold uppercase tracking-wider">
                                <Shield size={12} /> Abonnement Pro
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Settings Forms */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        {/* Personal Info */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg">
                            <h4 className="flex items-center gap-2 text-white font-medium mb-6">
                                <User size={18} className="text-mv-gold" /> Informations Personnelles
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase tracking-widest">Nom Complet</label>
                                    <input type="text" defaultValue={user.name} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-mv-gold/50 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase tracking-widest">Email</label>
                                    <input type="email" defaultValue={user.email} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-mv-gold/50 outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl opacity-60 pointer-events-none grayscale shadow-lg">
                            <h4 className="flex items-center gap-2 text-white font-medium mb-4">
                                <Bell size={18} className="text-mv-gold" /> Préférences (Bientôt)
                            </h4>
                            <p className="text-xs text-gray-500">Gérez vos notifications et l'esthétique de votre interface.</p>
                        </div>

                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Profile;
