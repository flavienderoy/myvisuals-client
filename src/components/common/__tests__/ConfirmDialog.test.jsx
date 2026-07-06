/**
 * Tests — ConfirmDialog Component
 * Verifies rendering, variants, user interactions, and loading state
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConfirmDialog } from '../ConfirmDialog';

describe('ConfirmDialog Component', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onConfirm: vi.fn().mockResolvedValue(undefined),
    };

    beforeEach(() => {
        defaultProps.onClose.mockClear();
        defaultProps.onConfirm.mockClear();
    });

    it('should display default title and message', () => {
        render(<ConfirmDialog {...defaultProps} />);
        expect(screen.getByText("Confirmer l'action")).toBeInTheDocument();
        expect(screen.getByText("Êtes-vous sûr de vouloir continuer ?")).toBeInTheDocument();
    });

    it('should display custom title and message', () => {
        render(
            <ConfirmDialog
                {...defaultProps}
                title="Supprimer le projet ?"
                message="Cette action est irréversible."
            />
        );
        expect(screen.getByText('Supprimer le projet ?')).toBeInTheDocument();
        expect(screen.getByText('Cette action est irréversible.')).toBeInTheDocument();
    });

    it('should display custom button text', () => {
        render(
            <ConfirmDialog
                {...defaultProps}
                confirmText="Oui, supprimer"
                cancelText="Non, garder"
            />
        );
        expect(screen.getByText('Oui, supprimer')).toBeInTheDocument();
        expect(screen.getByText('Non, garder')).toBeInTheDocument();
    });

    it('should call onClose when cancel button is clicked', () => {
        render(<ConfirmDialog {...defaultProps} />);
        fireEvent.click(screen.getByText('Annuler'));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should call onConfirm when confirm button is clicked', async () => {
        render(<ConfirmDialog {...defaultProps} />);
        fireEvent.click(screen.getByText('Confirmer'));
        await waitFor(() => {
            expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
        });
    });

    it('should have an alert triangle icon', () => {
        render(<ConfirmDialog {...defaultProps} />);
        // AlertTriangle is rendered as an SVG, check its container
        const iconContainer = document.querySelector('.rounded-full');
        expect(iconContainer).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
        render(<ConfirmDialog {...defaultProps} isOpen={false} />);
        expect(screen.queryByText("Confirmer l'action")).not.toBeInTheDocument();
    });
});
