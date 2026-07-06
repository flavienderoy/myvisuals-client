/**
 * Tests — ImageUploader Component
 * Verifies drag-and-drop, file selection, and UI behavior
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageUploader } from '../ImageUploader';

describe('ImageUploader Component', () => {
    const onUpload = vi.fn();

    it('should render the upload instructions', () => {
        render(<ImageUploader onUpload={onUpload} />);
        expect(screen.getByText('Glisser-déposer des images')).toBeInTheDocument();
        expect(screen.getByText('ou cliquer pour parcourir')).toBeInTheDocument();
    });

    it('should have a hidden file input', () => {
        const { container } = render(<ImageUploader onUpload={onUpload} />);
        const input = container.querySelector('input[type="file"]');
        expect(input).toBeInTheDocument();
        expect(input.className).toContain('hidden');
    });

    it('should accept only image files', () => {
        const { container } = render(<ImageUploader onUpload={onUpload} />);
        const input = container.querySelector('input[type="file"]');
        expect(input.getAttribute('accept')).toBe('image/*');
    });

    it('should accept multiple files', () => {
        const { container } = render(<ImageUploader onUpload={onUpload} />);
        const input = container.querySelector('input[type="file"]');
        expect(input.hasAttribute('multiple')).toBe(true);
    });

    it('should show drag-over visual state', () => {
        const { container } = render(<ImageUploader onUpload={onUpload} />);
        const dropZone = container.firstChild;

        fireEvent.dragOver(dropZone, {
            preventDefault: () => {},
            dataTransfer: { files: [] },
        });

        expect(dropZone.className).toContain('border-mv-gold');
    });

    it('should reset drag state on drag leave', () => {
        const { container } = render(<ImageUploader onUpload={onUpload} />);
        const dropZone = container.firstChild;

        fireEvent.dragOver(dropZone, {
            preventDefault: () => {},
            dataTransfer: { files: [] },
        });

        fireEvent.dragLeave(dropZone);

        expect(dropZone.className).not.toContain('border-mv-gold');
    });

    it('should have a dashed border style', () => {
        const { container } = render(<ImageUploader onUpload={onUpload} />);
        const dropZone = container.firstChild;
        expect(dropZone.className).toContain('border-dashed');
    });
});
