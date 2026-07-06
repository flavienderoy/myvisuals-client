import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Clock, Play, Pause, Square } from 'lucide-react';
import { formatDuration } from '../../utils/permissions';

export const TimeTracker = ({ projectId }) => {
    const { addTimeEntry, getTimeByProject } = useData();
    const [isTracking, setIsTracking] = useState(false);
    const [currentSession, setCurrentSession] = useState(0);
    const [description, setDescription] = useState('');

    const totalTime = getTimeByProject(projectId);

    useEffect(() => {
        let interval;
        if (isTracking) {
            interval = setInterval(() => {
                setCurrentSession(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTracking]);

    const startTracking = () => {
        setIsTracking(true);
        setCurrentSession(0);
    };

    const pauseTracking = () => {
        setIsTracking(false);
    };

    const stopTracking = () => {
        if (currentSession > 0) {
            addTimeEntry({
                projectId,
                duration: currentSession,
                description: description || 'Session de travail',
            });
        }
        setIsTracking(false);
        setCurrentSession(0);
        setDescription('');
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
            {/* Header */}
            <div>
                <h3 className="text-white font-medium mb-1 flex items-center gap-2">
                    <Clock className="text-mv-gold" size={20} />
                    Suivi du Temps
                </h3>
                <p className="text-sm text-gray-400">
                    Total: {formatDuration(totalTime)}
                </p>
            </div>

            {/* Current Session */}
            <div className="bg-black/20 border border-white/10 hover:border-white/30 transition-all duration-300 rounded-lg p-6 text-center">
                <div className="text-5xl font-mono text-mv-gold mb-4">
                    {formatDuration(currentSession)}
                </div>

                {isTracking && (
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Que faites-vous ?"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-center placeholder-gray-600 focus:outline-none focus:border-mv-gold transition-colors mb-4"
                    />
                )}

                {/* Controls */}
                <div className="flex gap-3 justify-center">
                    {!isTracking ? (
                        <button
                            onClick={startTracking}
                            className="px-6 py-3 bg-mv-gold hover:bg-white text-black font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Play size={16} />
                            Démarrer
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={pauseTracking}
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Pause size={16} />
                                Pause
                            </button>
                            <button
                                onClick={stopTracking}
                                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Square size={16} />
                                Arrêter
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Aujourd'hui</p>
                    <p className="text-lg font-mono text-white">
                        {formatDuration(currentSession)}
                    </p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">Cette semaine</p>
                    <p className="text-lg font-mono text-white">
                        {formatDuration(totalTime)}
                    </p>
                </div>
            </div>
        </div>
    );
};
