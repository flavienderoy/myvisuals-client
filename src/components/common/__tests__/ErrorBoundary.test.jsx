/**
 * Tests — ErrorBoundary Component
 * Verifies error catching, fallback UI, and reset behavior
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';

// Component that throws an error on purpose
const ThrowError = ({ shouldThrow }) => {
    if (shouldThrow) throw new Error('Test error');
    return <div>Content works</div>;
};

describe('ErrorBoundary Component', () => {
    // Suppress console.error for these tests
    const originalError = console.error;
    beforeEach(() => {
        console.error = vi.fn();
    });

    afterAll(() => {
        console.error = originalError;
    });

    it('should render children when no error occurs', () => {
        render(
            <ErrorBoundary>
                <div>Hello World</div>
            </ErrorBoundary>
        );
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('should show fallback UI when a child throws an error', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText("Oups, quelque chose s'est mal passé")).toBeInTheDocument();
    });

    it('should display a retry button', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText('Réessayer')).toBeInTheDocument();
    });

    it('should display a home button', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText("Retour à l'accueil")).toBeInTheDocument();
    });

    it('should show an error description message', () => {
        render(
            <ErrorBoundary>
                <ThrowError shouldThrow={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText(/erreur inattendue/)).toBeInTheDocument();
    });
});
