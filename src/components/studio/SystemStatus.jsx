import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { LuxuryTitle } from '../common/LuxuryTitle';
import { Activity, Server, Database, Shield, Radio, Cpu, HardDrive, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const MetricCard = ({ title, value, unit, change, trend = 'up', icon: Icon }) => (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-mv-gold/30 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/5 rounded-lg text-mv-gold">
                <Icon size={20} />
            </div>
            {change && (
                <span className={`text-xs font-mono px-2 py-1 rounded-full ${trend === 'up' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                    {change}
                </span>
            )}
        </div>
        <div>
            <span className="text-gray-400 text-sm font-medium uppercase tracking-wider block mb-1">{title}</span>
            <div className="flex items-end gap-2">
                <span className="text-3xl font-bold tracking-tight text-white">{value}</span>
                {unit && <span className="text-sm text-gray-500 mb-1">{unit}</span>}
            </div>
        </div>
    </div>
);

const ServiceStatus = ({ name, status, uptime, latency }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
        <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${status === 'operational' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
                <h4 className="text-white font-medium">{name}</h4>
                <span className="text-xs text-gray-500 font-mono">Uptime: {uptime}</span>
            </div>
        </div>
        <div className="text-right">
            <div className={`px-2 py-1 rounded text-xs font-mono ${status === 'operational' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {status === 'operational' ? 'Operational' : 'Down'}
            </div>
            <span className="text-xs text-gray-600 block mt-1">{latency}ms</span>
        </div>
    </div>
);

const LogEntry = ({ time, level, service, message }) => (
    <div className="grid grid-cols-12 gap-4 py-3 border-b border-white/10 hover:border-white/30 transition-all duration-300 text-xs font-mono hover:bg-white/5 transition-colors px-2">
        <div className="col-span-2 text-gray-500">{time}</div>
        <div className="col-span-1">
            <span className={`px-1.5 py-0.5 rounded ${level === 'INFO' ? 'bg-blue-500/10 text-blue-400' :
                level === 'WARN' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-red-500/10 text-red-400'
                }`}>
                {level}
            </span>
        </div>
        <div className="col-span-2 text-mv-gold">{service}</div>
        <div className="col-span-7 text-gray-300 truncate">{message}</div>
    </div>
);

export const SystemStatus = () => {
    const { watermarkSettings, setWatermarkSettings } = useData();
    const [watermarkForm, setWatermarkForm] = useState({ 
        text: watermarkSettings?.text || '', 
        opacity: watermarkSettings?.opacity || 30 
    });

    useEffect(() => {
        if (watermarkSettings) {
            setWatermarkForm(watermarkSettings);
        }
    }, [watermarkSettings]);

    // Mock Data simulating real-time monitoring
    const [cpuLoad, setCpuLoad] = useState([45, 48, 42, 55, 61, 49, 45, 50, 52, 48]);

    // Simple mock animation for CPU graph
    useEffect(() => {
        const interval = setInterval(() => {
            setCpuLoad(prev => [...prev.slice(1), Math.floor(Math.random() * 30) + 30]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const logs = [
        { time: '10:42:05', level: 'INFO', service: 'AUTH_SVC', message: 'User login success: admin@myvisuals.co' },
        { time: '10:41:58', level: 'INFO', service: 'IMG_PROC', message: 'Thumbnail generation completed (Asset #882)' },
        { time: '10:38:12', level: 'WARN', service: 'DB_MAIN', message: 'Query execution time > 200ms' },
        { time: '10:35:44', level: 'INFO', service: 'API_GATE', message: 'Incoming traffic spike detected (+15%)' },
        { time: '10:30:00', level: 'INFO', service: 'CRON', message: 'Backup routine started' },
        { time: '10:28:15', level: 'ERROR', service: 'MAIL_SVC', message: 'SMTP Connection timeout (Retry 1/3)' },
        { time: '10:15:22', level: 'INFO', service: 'STORAGE', message: 'S3 Bucket integrity check passed' },
    ];

    return (
        <div className="min-h-screen bg-mv-black p-8 pt-24 animate-fade-in space-y-8">
            <div className="flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <LuxuryTitle text="Supervision Système" size="text-4xl" className="text-white" />
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-xs font-medium text-green-400 uppercase tracking-wide">Système Stable</span>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">Monitoring temps réel des infrastructures MyVisuals</p>
                </div>
                <div className="text-right hidden md:block">
                    <div className="text-2xl font-mono text-white">v2.4.0-rc1</div>
                    <div className="text-xs text-gray-500">Build: 20260203-A8F</div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Temps de Réponse"
                    value="42"
                    unit="ms"
                    change="-12%"
                    trend="up"
                    icon={Activity}
                />
                <MetricCard
                    title="Uptime (30j)"
                    value="99.98"
                    unit="%"
                    icon={Server}
                />
                <MetricCard
                    title="Utilisateurs Actifs"
                    value="128"
                    change="+5"
                    trend="up"
                    icon={Radio}
                />
                <MetricCard
                    title="Charge Serveur"
                    value={cpuLoad[cpuLoad.length - 1]}
                    unit="%"
                    change="+2%"
                    trend="down"
                    icon={Cpu}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Graph Area (Simulated) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* CPU Graph Container */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white font-medium flex items-center gap-2">
                                <Cpu size={16} className="text-mv-gold" />
                                Utilisation Processeur
                            </h3>
                            <div className="flex gap-2">
                                <span className="w-3 h-3 rounded-full bg-mv-gold"></span>
                                <span className="text-xs text-gray-400">Cluster A</span>
                            </div>
                        </div>

                        {/* CSS-only Bar Chart */}
                        <div className="h-64 flex items-end justify-between gap-2 px-4 py-2 bg-black/20 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-300 relative overflow-hidden">
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                                <div className="border-t border-white/30 w-full h-0"></div>
                                <div className="border-t border-white/30 w-full h-0"></div>
                                <div className="border-t border-white/30 w-full h-0"></div>
                                <div className="border-t border-white/30 w-full h-0"></div>
                            </div>

                            {cpuLoad.map((val, i) => (
                                <div
                                    key={i}
                                    className="w-full bg-gradient-to-t from-mv-gold/20 to-mv-gold rounded-t-sm transition-all duration-500 ease-out"
                                    style={{ height: `${val}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Logs Table */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-medium flex items-center gap-2">
                                <AlertTriangle size={16} className="text-gray-400" />
                                Logs Système (Derniers événements)
                            </h3>
                            <button className="text-xs text-mv-gold hover:underline">Voir tout</button>
                        </div>
                        <div className="bg-black/20 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden">
                            <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-white/10 bg-white/5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <div className="col-span-2">Heure</div>
                                <div className="col-span-1">Niveau</div>
                                <div className="col-span-2">Service</div>
                                <div className="col-span-7">Message</div>
                            </div>
                            <div className="max-h-64 overflow-y-auto custom-scrollbar">
                                {logs.map((log, i) => (
                                    <LogEntry key={i} {...log} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Status & Health */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-white font-medium mb-6 flex items-center gap-2">
                            <Shield size={16} className="text-mv-gold" />
                            État des Services
                        </h3>
                        <div className="space-y-3">
                            <ServiceStatus name="API Gateway" status="operational" uptime="14j 2h" latency="24" />
                            <ServiceStatus name="Database (PostgreSQL)" status="operational" uptime="45j 12h" latency="12" />
                            <ServiceStatus name="Object Storage (S3)" status="operational" uptime="99.9%" latency="145" />
                            <ServiceStatus name="Auth Provider" status="operational" uptime="99.9%" latency="42" />
                            <ServiceStatus name="CDN Delivery" status="operational" uptime="100%" latency="8" />
                            <ServiceStatus name="Image Processor" status="operational" uptime="14j 2h" latency="320" />
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                            <HardDrive size={16} className="text-gray-400" />
                            Espace Disque
                        </h3>
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-mv-gold bg-mv-gold/10">
                                        Occupé
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-white">
                                        72%
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-white/10">
                                <div style={{ width: "72%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-mv-gold"></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>3.2 TB utilsés</span>
                                <span>Total: 5 TB</span>
                            </div>
                        </div>
                    </div>

                    {/* Watermark Settings */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                            <Shield size={16} className="text-mv-gold" />
                            Paramètres du Filigrane
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Texte du filigrane</label>
                                <input 
                                    type="text" 
                                    value={watermarkForm.text}
                                    onChange={(e) => setWatermarkForm({...watermarkForm, text: e.target.value})}
                                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-mv-gold focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Opacité ({watermarkForm.opacity}%)</label>
                                <input 
                                    type="range" 
                                    min="0" max="100" 
                                    value={watermarkForm.opacity}
                                    onChange={(e) => setWatermarkForm({...watermarkForm, opacity: parseInt(e.target.value)})}
                                    className="w-full accent-mv-gold"
                                />
                            </div>
                            <button 
                                onClick={() => setWatermarkSettings(watermarkForm)}
                                className="w-full bg-mv-gold/10 text-mv-gold border border-mv-gold/20 py-2 rounded font-medium hover:bg-mv-gold hover:text-black transition-colors text-sm"
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
