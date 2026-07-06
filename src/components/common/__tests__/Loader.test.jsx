/**
 * Tests — Loader Component
 * Verifies rendering of loader characters and completion callback
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Loader } from '../Loader';

describe('Loader Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should render the brand characters', () => {
        const onComplete = vi.fn();
        render(<Loader onComplete={onComplete} />);
        
        const chars = ['M', 'y', 'V', 'i', 's', 'u', 'a', 'l', 's'];
        chars.forEach(char => {
            const elements = screen.getAllByText(char);
            expect(elements.length).toBeGreaterThan(0);
        });
    });

    it('should render the loading text', () => {
        render(<Loader onComplete={vi.fn()} />);
        expect(screen.getByText('Loading Assets...')).toBeInTheDocument();
    });

    it('should call onComplete after 3500ms', () => {
        const onComplete = vi.fn();
        render(<Loader onComplete={onComplete} />);
        
        expect(onComplete).not.toHaveBeenCalled();
        
        act(() => {
            vi.advanceTimersByTime(3500);
        });
        
        expect(onComplete).toHaveBeenCalledTimes(1);
    });
});
