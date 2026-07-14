import { describe, it, expect } from 'vitest';
import {
    STATUS,
    ASSET_TYPES,
    USER_ROLES,
    TASK_STATUS,
    TASK_PRIORITY,
    APPROVAL_STATUS,
    PERMISSION_LEVELS,
    ACTIVITY_TYPES,
    COLORS,
    SIZES,
    Z_INDEX,
    ANIMATION,
    BREAKPOINTS,
    LIMITS,
    STORAGE_KEYS,
} from './constants';

describe('Constants', () => {
    describe('STATUS', () => {
        it('should define all project statuses', () => {
            expect(STATUS.PENDING).toBe('pending');
            expect(STATUS.IN_PROGRESS).toBe('in_progress');
            expect(STATUS.COMPLETED).toBe('completed');
            expect(STATUS.APPROVED).toBe('approved');
            expect(STATUS.REJECTED).toBe('rejected');
        });
    });

    describe('ASSET_TYPES', () => {
        it('should define all asset types', () => {
            expect(ASSET_TYPES.RAW).toBe('raw');
            expect(ASSET_TYPES.EDITED).toBe('edited');
            expect(ASSET_TYPES.FINAL).toBe('final');
        });
    });

    describe('USER_ROLES', () => {
        it('should define all user roles', () => {
            expect(USER_ROLES.OWNER).toBe('owner');
            expect(USER_ROLES.ADMIN).toBe('admin');
            expect(USER_ROLES.MEMBER).toBe('member');
            expect(USER_ROLES.CLIENT).toBe('client');
            expect(USER_ROLES.VIEWER).toBe('viewer');
        });
    });

    describe('TASK_STATUS', () => {
        it('should define all task statuses', () => {
            expect(TASK_STATUS.PENDING).toBe('pending');
            expect(TASK_STATUS.IN_PROGRESS).toBe('in_progress');
            expect(TASK_STATUS.COMPLETED).toBe('completed');
            expect(TASK_STATUS.CANCELLED).toBe('cancelled');
        });
    });

    describe('TASK_PRIORITY', () => {
        it('should define all task priorities', () => {
            expect(TASK_PRIORITY.LOW).toBe('low');
            expect(TASK_PRIORITY.MEDIUM).toBe('medium');
            expect(TASK_PRIORITY.HIGH).toBe('high');
            expect(TASK_PRIORITY.URGENT).toBe('urgent');
        });
    });

    describe('APPROVAL_STATUS', () => {
        it('should define all approval statuses', () => {
            expect(APPROVAL_STATUS.PENDING).toBe('pending');
            expect(APPROVAL_STATUS.APPROVED).toBe('approved');
            expect(APPROVAL_STATUS.REJECTED).toBe('rejected');
            expect(APPROVAL_STATUS.CHANGES_REQUESTED).toBe('changes_requested');
        });
    });

    describe('PERMISSION_LEVELS', () => {
        it('should define all permission levels', () => {
            expect(PERMISSION_LEVELS.NONE).toBe('none');
            expect(PERMISSION_LEVELS.VIEW).toBe('view');
            expect(PERMISSION_LEVELS.COMMENT).toBe('comment');
            expect(PERMISSION_LEVELS.EDIT).toBe('edit');
            expect(PERMISSION_LEVELS.ADMIN).toBe('admin');
        });
    });

    describe('COLORS', () => {
        it('should define the design system colors', () => {
            expect(COLORS.MV_BLACK).toBe('#000000');
            expect(COLORS.MV_DARK).toBe('#1A1A1A');
            expect(COLORS.MV_GOLD).toBe('#D4AF37');
            expect(COLORS.MV_WHITE).toBe('#F5F5F5');
        });
    });

    describe('SIZES', () => {
        it('should define component sizes', () => {
            expect(SIZES.SIDEBAR_WIDTH).toBe(280);
            expect(SIZES.COMMAND_BAR_WIDTH).toBe(64);
            expect(typeof SIZES.MAX_CONTENT_WIDTH).toBe('number');
        });
    });

    describe('LIMITS', () => {
        it('should define application limits', () => {
            expect(LIMITS.MAX_FILE_SIZE_MB).toBe(10);
            expect(LIMITS.DEBOUNCE_DELAY).toBe(300);
            expect(typeof LIMITS.MAX_SEARCH_RESULTS).toBe('number');
        });
    });

    describe('STORAGE_KEYS', () => {
        it('should prefix all keys with visuals_', () => {
            Object.values(STORAGE_KEYS).forEach(key => {
                expect(key).toMatch(/^visuals_/);
            });
        });
    });

    describe('ACTIVITY_TYPES', () => {
        it('should define at least 5 activity types', () => {
            const values = Object.values(ACTIVITY_TYPES);
            expect(values.length).toBeGreaterThanOrEqual(5);
        });
    });
});
