/**
 * Tests — LuxuryTitle Component
 * Verifies rendering, custom text, size prop, and heading semantics
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LuxuryTitle } from '../LuxuryTitle';

describe('LuxuryTitle Component', () => {
    it('should render the text content', () => {
        render(<LuxuryTitle text="Mes Projets" />);
        expect(screen.getByText('Mes Projets')).toBeInTheDocument();
    });

    it('should render as an h1 element', () => {
        render(<LuxuryTitle text="Dashboard" />);
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
        expect(heading.textContent).toBe('Dashboard');
    });

    it('should apply default size classes', () => {
        render(<LuxuryTitle text="Test" />);
        const heading = screen.getByRole('heading');
        expect(heading.className).toContain('text-4xl');
        expect(heading.className).toContain('md:text-5xl');
    });

    it('should apply custom size class', () => {
        render(<LuxuryTitle text="Test" size="text-2xl" />);
        const heading = screen.getByRole('heading');
        expect(heading.className).toContain('text-2xl');
    });

    it('should apply custom className', () => {
        render(<LuxuryTitle text="Test" className="mb-8" />);
        const heading = screen.getByRole('heading');
        expect(heading.className).toContain('mb-8');
    });

    it('should have white text color', () => {
        render(<LuxuryTitle text="Test" />);
        const heading = screen.getByRole('heading');
        expect(heading.className).toContain('text-white');
    });

    it('should have bold font weight', () => {
        render(<LuxuryTitle text="Test" />);
        const heading = screen.getByRole('heading');
        expect(heading.className).toContain('font-bold');
    });
});
