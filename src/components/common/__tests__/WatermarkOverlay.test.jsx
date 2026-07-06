/**
 * Tests — WatermarkOverlay Component
 * Verifies watermark rendering, repeating pattern, and context usage
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WatermarkOverlay } from '../WatermarkOverlay';

// Mock the context
vi.mock('../../../context/DataContext', () => ({
    useData: vi.fn()
}));

import { useData } from '../../../context/DataContext';

describe('WatermarkOverlay Component', () => {
    it('should render default watermark text', () => {
        useData.mockReturnValue({ watermarkSettings: null });
        render(<WatermarkOverlay />);
        const elements = screen.getAllByText('MyVisuals • PREVIEW');
        expect(elements.length).toBe(20);
    });

    it('should render custom watermark text from context', () => {
        useData.mockReturnValue({ 
            watermarkSettings: { text: 'CONFIDENTIAL', opacity: 50 } 
        });
        render(<WatermarkOverlay />);
        const elements = screen.getAllByText('CONFIDENTIAL');
        expect(elements.length).toBe(20);
    });

    it('should apply opacity from context', () => {
        useData.mockReturnValue({ 
            watermarkSettings: { text: 'TEST', opacity: 75 } 
        });
        const { container } = render(<WatermarkOverlay />);
        const wrapper = container.firstChild;
        expect(wrapper.style.opacity).toBe('0.75');
    });

    it('should use default opacity 30 if none provided', () => {
        useData.mockReturnValue({ watermarkSettings: null });
        const { container } = render(<WatermarkOverlay />);
        const wrapper = container.firstChild;
        expect(wrapper.style.opacity).toBe('0.3');
    });
});
