import React, { useState, useRef, useEffect } from 'react';
import { AtSign } from 'lucide-react';

export const MentionInput = ({ value, onChange, placeholder = "Tapez @ pour mentionner...", users = [] }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mentionQuery, setMentionQuery] = useState('');
    const inputRef = useRef(null);

    // Mock users if none provided
    const defaultUsers = users.length > 0 ? users : [
        { id: '1', name: 'Jean Dupont', role: 'Photographe' },
        { id: '2', name: 'Marie Martin', role: 'Directrice Artistique' },
        { id: '3', name: 'Pierre Durand', role: 'Client' },
        { id: '4', name: 'Sophie Bernard', role: 'Retoucheuse' },
    ];

    useEffect(() => {
        // Detect @ mentions
        const lastAtIndex = value.lastIndexOf('@');
        if (lastAtIndex !== -1) {
            const textAfterAt = value.slice(lastAtIndex + 1);
            const spaceIndex = textAfterAt.indexOf(' ');
            const query = spaceIndex === -1 ? textAfterAt : textAfterAt.slice(0, spaceIndex);

            if (query.length >= 0 && spaceIndex === -1) {
                setMentionQuery(query);
                const filtered = defaultUsers.filter(u =>
                    u.name.toLowerCase().includes(query.toLowerCase())
                );
                setSuggestions(filtered);
                setShowSuggestions(filtered.length > 0);
                setSelectedIndex(0);
            } else {
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
        }
    }, [value]);

    const insertMention = (user) => {
        const lastAtIndex = value.lastIndexOf('@');
        const beforeMention = value.slice(0, lastAtIndex);
        const newValue = beforeMention + `@${user.name} `;
        onChange(newValue);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % suggestions.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
                break;
            case 'Enter':
            case 'Tab':
                if (suggestions.length > 0) {
                    e.preventDefault();
                    insertMention(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
        }
    };

    return (
        <div className="relative">
            <div className="relative">
                <textarea
                    ref={inputRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={3}
                    className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold transition-colors resize-none"
                />
                <AtSign className="absolute left-3 top-3 text-gray-600" size={16} />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
                <div className="absolute z-50 w-full mt-1 bg-mv-dark border border-white/10 rounded-lg shadow-2xl overflow-hidden">
                    <div className="max-h-48 overflow-y-auto">
                        {suggestions.map((user, idx) => (
                            <button
                                key={user.id}
                                onClick={() => insertMention(user)}
                                className={`w-full px-4 py-2 text-left transition-colors ${idx === selectedIndex
                                        ? 'bg-mv-gold/20 border-l-2 border-mv-gold'
                                        : 'hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-mv-gold/20 flex items-center justify-center">
                                        <span className="text-mv-gold text-sm font-medium">
                                            {user.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">{user.name}</p>
                                        <p className="text-gray-500 text-xs">{user.role}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="px-3 py-2 bg-black/20 border-t border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300">
                        <p className="text-xs text-gray-500">
                            ↑↓ pour naviguer • Entrée pour sélectionner
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
