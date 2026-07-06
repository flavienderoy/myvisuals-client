import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Clock, Users } from 'lucide-react';
import { calculateProjectRevenue } from '../../utils/permissions';

export const RevenueForecasting = ({ projects }) => {
    // Calculate metrics
    const activeProjects = projects.filter(p => p.status === 'in_progress');
    const completedProjects = projects.filter(p => p.status === 'completed');

    const currentRevenue = completedProjects.reduce((sum, p) => sum + calculateProjectRevenue(p), 0);
    const forecastedRevenue = activeProjects.reduce((sum, p) => sum + calculateProjectRevenue(p), 0);
    const totalForecast = currentRevenue + forecastedRevenue;

    // Monthly breakdown (mock data)
    const monthlyData = [
        { month: 'Jan', revenue: 12500, forecast: 15000 },
        { month: 'Fév', revenue: 18000, forecast: 20000 },
        { month: 'Mar', revenue: 22000, forecast: 25000 },
        { month: 'Avr', revenue: 0, forecast: 28000 },
        { month: 'Mai', revenue: 0, forecast: 30000 },
    ];

    const maxValue = Math.max(...monthlyData.map(d => Math.max(d.revenue, d.forecast)));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
                    <TrendingUp className="text-mv-gold" size={24} />
                    Prévisions Financières
                </h2>
                <p className="text-sm text-gray-400">
                    Analyse et projections de revenus
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <DollarSign className="text-green-400" size={20} />
                        </div>
                        <h3 className="text-gray-400 text-sm">Revenus Actuels</h3>
                    </div>
                    <p className="text-3xl font-mono text-white mb-1">
                        {currentRevenue.toLocaleString('fr-FR')} €
                    </p>
                    <p className="text-xs text-gray-500">
                        {completedProjects.length} projets complétés
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <TrendingUp className="text-blue-400" size={20} />
                        </div>
                        <h3 className="text-gray-400 text-sm">Prévisions</h3>
                    </div>
                    <p className="text-3xl font-mono text-white mb-1">
                        {forecastedRevenue.toLocaleString('fr-FR')} €
                    </p>
                    <p className="text-xs text-gray-500">
                        {activeProjects.length} projets en cours
                    </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-mv-gold/10 rounded-lg">
                            <BarChart3 className="text-mv-gold" size={20} />
                        </div>
                        <h3 className="text-gray-400 text-sm">Total Prévu</h3>
                    </div>
                    <p className="text-3xl font-mono text-mv-gold mb-1">
                        {totalForecast.toLocaleString('fr-FR')} €
                    </p>
                    <p className="text-xs text-green-400">
                        +{((forecastedRevenue / currentRevenue) * 100).toFixed(0)}% de croissance
                    </p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-medium mb-6">Évolution Mensuelle</h3>

                <div className="space-y-4">
                    {monthlyData.map((data, idx) => (
                        <div key={data.month}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400 w-12">{data.month}</span>
                                <div className="flex-1 flex gap-2">
                                    {/* Revenue Bar */}
                                    <div className="flex-1">
                                        <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
                                            <div
                                                className="h-full bg-green-500/30 border-r-2 border-green-400 transition-all duration-500"
                                                style={{ width: `${(data.revenue / maxValue) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    {/* Forecast Bar */}
                                    <div className="flex-1">
                                        <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500/30 border-r-2 border-blue-400 transition-all duration-500"
                                                style={{ width: `${(data.forecast / maxValue) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 w-48 justify-end text-xs font-mono">
                                    <span className="text-green-400">
                                        {data.revenue > 0 ? `${data.revenue.toLocaleString()}€` : '-'}
                                    </span>
                                    <span className="text-blue-400">
                                        {data.forecast.toLocaleString()}€
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex gap-6 mt-6 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500/30 border-r-2 border-green-400 rounded" />
                        <span className="text-xs text-gray-400">Revenus réalisés</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500/30 border-r-2 border-blue-400 rounded" />
                        <span className="text-xs text-gray-400">Prévisions</span>
                    </div>
                </div>
            </div>

            {/* Insights */}
            <div className="bg-mv-gold/10 border border-mv-gold/30 rounded-xl p-4">
                <h4 className="text-mv-gold font-medium mb-2 flex items-center gap-2">
                    <TrendingUp size={16} />
                    Insights
                </h4>
                <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Croissance prévue de {((forecastedRevenue / currentRevenue) * 100).toFixed(0)}% sur les projets en cours</li>
                    <li>• Revenu moyen par projet: {(currentRevenue / completedProjects.length || 0).toFixed(0)}€</li>
                    <li>• {activeProjects.length} projets actifs représentent {forecastedRevenue.toLocaleString()}€ de CA potentiel</li>
                </ul>
            </div>
        </div>
    );
};
