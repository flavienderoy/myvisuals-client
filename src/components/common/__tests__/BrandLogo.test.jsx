/**
 * Tests — BrandLogo Component
 * Verifies rendering, SVG structure, and brand text
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BrandLogo from '../BrandLogo';

describe('BrandLogo Component', () => {
    it('should render the brand name "myvisuals"', () => {
        render(<BrandLogo />);
        expect(screen.getByText('my')).toBeInTheDocument();
        expect(screen.getByText('visuals')).toBeInTheDocument();
    });

    it('should render an SVG logo element', () => {
        const { container } = render(<BrandLogo />);
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
    });

    it('should apply custom className', () => {
        const { container } = render(<BrandLogo className="h-12" />);
        const wrapper = container.firstChild;
        expect(wrapper.className).toContain('h-12');
    });

    it('should have default className "h-8"', () => {
        const { container } = render(<BrandLogo />);
        const wrapper = container.firstChild;
        expect(wrapper.className).toContain('h-8');
    });

    it('should have SVG with gradient definitions', () => {
        const { container } = render(<BrandLogo />);
        const gradients = container.querySelectorAll('linearGradient');
        expect(gradients.length).toBeGreaterThanOrEqual(2);
    });

    it('should have the golden accent color on "visuals"', () => {
        render(<BrandLogo />);
        const visualsSpan = screen.getByText('visuals');
        expect(visualsSpan.className).toContain('text-[#D4AF37]');
    });
});
