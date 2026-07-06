import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
    },
    exit: {
        opacity: 0,
        y: -20,
    }
};

const pageTransition = {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1], // Custom cubic bezier
};

export const PageTransition = ({ children, className = "" }) => {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            className={`w-full ${className}`}
        >
            {children}
        </motion.div>
    );
};
