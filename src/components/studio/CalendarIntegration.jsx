import React, { useState } from 'react';
import { Calendar, Clock, Download, ExternalLink } from 'lucide-react';

export const CalendarIntegration = ({ projects }) => {
    const [selectedCalendar, setSelectedCalendar] = useState('google');

    // Generate calendar events from projects
    const generateCalendarEvents = () => {
        return projects
            .filter(p => p.deadline)
            .map(p => ({
                title: `[Visuals.co] ${p.name}`,
                description: `Projet: ${p.name}\nClient: ${p.client}\nStatut: ${p.status}`,
                start: new Date(p.deadline),
                end: new Date(p.deadline),
                location: 'Visuals.co',
            }));
    };

    const exportToGoogleCalendar = () => {
        const events = generateCalendarEvents();

        // In real app: would use Google Calendar API
        // For now: simulate export
        console.log('Exporting to Google Calendar:', events);

        // Create .ics file (simplified)
        const icsContent = generateICS(events);
        downloadICS(icsContent, 'visuals-deadlines.ics');
    };

    const generateICS = (events) => {
        const lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Visuals.co//Calendar//EN',
            'CALSCALE:GREGORIAN',
        ];

        events.forEach(event => {
            const start = event.start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            const end = event.end.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

            lines.push('BEGIN:VEVENT');
            lines.push(`DTSTART:${start}`);
            lines.push(`DTEND:${end}`);
            lines.push(`SUMMARY:${event.title}`);
            lines.push(`DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`);
            lines.push(`LOCATION:${event.location}`);
            lines.push('END:VEVENT');
        });

        lines.push('END:VCALENDAR');
        return lines.join('\r\n');
    };

    const downloadICS = (content, filename) => {
        const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    const upcomingDeadlines = projects
        .filter(p => p.deadline && new Date(p.deadline) > new Date())
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5);

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-white font-medium mb-1 flex items-center gap-2">
                    <Calendar className="text-mv-gold" size={20} />
                    Intégration Calendrier
                </h3>
                <p className="text-sm text-gray-400">
                    Synchronisez vos deadlines avec votre calendrier
                </p>
            </div>

            {/* Calendar Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                    Choisir un calendrier
                </label>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setSelectedCalendar('google')}
                        className={`p-4 rounded-lg border transition-all ${selectedCalendar === 'google'
                                ? 'bg-mv-gold/10 border-mv-gold text-white'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <div className="text-center">
                            <Calendar className="mx-auto mb-2" size={24} />
                            <p className="text-sm font-medium">Google Calendar</p>
                        </div>
                    </button>
                    <button
                        onClick={() => setSelectedCalendar('outlook')}
                        className={`p-4 rounded-lg border transition-all ${selectedCalendar === 'outlook'
                                ? 'bg-mv-gold/10 border-mv-gold text-white'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        <div className="text-center">
                            <Calendar className="mx-auto mb-2" size={24} />
                            <p className="text-sm font-medium">Outlook</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Upcoming Deadlines */}
            <div>
                <h4 className="text-white text-sm font-medium mb-3">
                    Prochaines deadlines ({upcomingDeadlines.length})
                </h4>
                {upcomingDeadlines.length === 0 ? (
                    <p className="text-gray-500 text-sm">Aucune deadline à venir</p>
                ) : (
                    <div className="space-y-2">
                        {upcomingDeadlines.map(project => (
                            <div
                                key={project.id}
                                className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">
                                        {project.name}
                                    </p>
                                    <p className="text-gray-500 text-xs">{project.client}</p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Clock size={12} />
                                    <span>
                                        {new Date(project.deadline).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Export Button */}
            <div className="pt-4 border-t border-white/10">
                <button
                    onClick={exportToGoogleCalendar}
                    className="w-full px-4 py-3 bg-mv-gold hover:bg-white text-black font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <Download size={16} />
                    Exporter les deadlines (.ics)
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                    Fichier compatible avec Google Calendar, Outlook, Apple Calendar
                </p>
            </div>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-400 text-xs">
                    <strong>Note:</strong> L'intégration complète nécessite un backend.
                    Pour l'instant, vous pouvez exporter un fichier .ics à importer manuellement.
                </p>
            </div>
        </div>
    );
};
