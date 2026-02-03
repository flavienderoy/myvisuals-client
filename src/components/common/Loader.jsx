import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Loader = ({ onComplete }) => {
    const text = "MyVisuals";
    // Using state to trigger re-renders with new random targets
    const [targetWeights, setTargetWeights] = useState(Array(text.length).fill(100));
    const [targetItalics, setTargetItalics] = useState(Array(text.length).fill(false));

    useEffect(() => {
        // interval to pick new random weights and italics
        const interval = setInterval(() => {
            setTargetWeights(prev => prev.map(() => {
                // Snapping to available static weights for better result with static font files
                const weights = [100, 300, 400, 500, 700, 900];
                return weights[Math.floor(Math.random() * weights.length)];
            }));
            setTargetItalics(prev => prev.map(() => Math.random() > 0.7));
        }, 600);

        // End loader
        const timer = setTimeout(() => {
            clearInterval(interval);
            onComplete();
        }, 3500);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-mv-black flex items-center justify-center font-sans">
            <div className="flex text-6xl md:text-9xl tracking-tighter">
                {text.split('').map((char, i) => (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            fontWeight: targetWeights[i],
                            fontStyle: targetItalics[i] ? 'italic' : 'normal'
                        }}
                        transition={{
                            duration: 0.5,
                            ease: "easeInOut"
                        }}
                        className="text-white inline-block transition-all"
                    >
                        {char}
                    </motion.span>
                ))}
            </div>

            <div className="absolute bottom-10 text-xs text-gray-500 font-mono">
                Loading Assets...
            </div>
        </div>
    );
};
