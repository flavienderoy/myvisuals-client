/**
 * Tests — PageTransition Component
 * Verifies motion wrapper rendering and initial state
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PageTransition } from '../PageTransition';

describe('PageTransition Component', () => {
    it('should render children elements', () => {
        const { getByText } = render(
            <PageTransition>
                <div>Test Content</div>
            </PageTransition>
        );
        expect(getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
        const { container } = render(
            <PageTransition className="custom-test-class">
                <div>Content</div>
            </PageTransition>
        );
        const wrapper = container.firstChild;
        expect(wrapper.className).toContain('custom-test-class');
    });

    it('should render a motion div structure', () => {
        const { container } = render(
            <PageTransition>
                <div>Content</div>
            </PageTransition>
        );
        const wrapper = container.firstChild;
        // The framer-motion div has style attributes applied internally
        expect(wrapper.nodeName.toLowerCase()).toBe('div');
        expect(wrapper.className).toContain('w-full');
    });
});
