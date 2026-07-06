import { describe, it, expect } from 'vitest';
import { useToast } from '../useToast';
import { renderHook } from '@testing-library/react';

describe('useToast', () => {
    it('should return all toast methods', () => {
        const { result } = renderHook(() => useToast());

        expect(result.current).toHaveProperty('success');
        expect(result.current).toHaveProperty('error');
        expect(result.current).toHaveProperty('loading');
        expect(result.current).toHaveProperty('dismiss');
        expect(result.current).toHaveProperty('promise');
    });

    it('should return functions for each method', () => {
        const { result } = renderHook(() => useToast());

        expect(typeof result.current.success).toBe('function');
        expect(typeof result.current.error).toBe('function');
        expect(typeof result.current.loading).toBe('function');
        expect(typeof result.current.dismiss).toBe('function');
        expect(typeof result.current.promise).toBe('function');
    });

    it('should not throw when calling success', () => {
        const { result } = renderHook(() => useToast());

        expect(() => result.current.success('Test message')).not.toThrow();
    });

    it('should not throw when calling error', () => {
        const { result } = renderHook(() => useToast());

        expect(() => result.current.error('Error message')).not.toThrow();
    });
});
