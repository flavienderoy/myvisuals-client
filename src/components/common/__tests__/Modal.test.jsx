/**
 * Tests — Modal Component
 * Verifies rendering, accessibility, keyboard interactions, and portal behavior
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Modal } from '../Modal';

describe('Modal Component', () => {
    const onClose = vi.fn();

    beforeEach(() => {
        onClose.mockClear();
    });

    afterEach(() => {
        document.body.style.overflow = '';
    });

    it('should not render when isOpen is false', () => {
        render(<Modal isOpen={false} onClose={onClose} title="Test" />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
        render(<Modal isOpen={true} onClose={onClose} title="Test Modal" />);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should display the title', () => {
        render(<Modal isOpen={true} onClose={onClose} title="Mon Titre" />);
        expect(screen.getByText('Mon Titre')).toBeInTheDocument();
    });

    it('should render children content', () => {
        render(
            <Modal isOpen={true} onClose={onClose} title="Test">
                <p>Contenu de test</p>
            </Modal>
        );
        expect(screen.getByText('Contenu de test')).toBeInTheDocument();
    });

    it('should have aria-modal attribute', () => {
        render(<Modal isOpen={true} onClose={onClose} title="Test" />);
        expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby pointing to the title', () => {
        render(<Modal isOpen={true} onClose={onClose} title="Test" />);
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
        expect(screen.getByText('Test').id).toBe('modal-title');
    });

    it('should call onClose when close button is clicked', () => {
        render(<Modal isOpen={true} onClose={onClose} title="Test" />);
        const closeButton = screen.getByLabelText('Fermer la modale');
        fireEvent.click(closeButton);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when Escape key is pressed', () => {
        render(<Modal isOpen={true} onClose={onClose} title="Test" />);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
        render(<Modal isOpen={true} onClose={onClose} title="Test" />);
        // The backdrop is the first child div with bg-black/60
        const backdrop = document.querySelector('.bg-black\\/60');
        if (backdrop) fireEvent.click(backdrop);
        expect(onClose).toHaveBeenCalled();
    });

    it('should prevent body scroll when open', () => {
        render(<Modal isOpen={true} onClose={onClose} title="Test" />);
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('should have a close button with aria-label', () => {
        render(<Modal isOpen={true} onClose={onClose} title="Test" />);
        expect(screen.getByLabelText('Fermer la modale')).toBeInTheDocument();
    });
});
