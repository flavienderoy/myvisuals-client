// Design System Constants
export const COLORS = {
    MV_BLACK: '#000000',
    MV_DARK: '#1A1A1A',
    MV_GOLD: '#D4AF37',
    MV_WHITE: '#F5F5F5',
};

// Component Sizes
export const SIZES = {
    SIDEBAR_WIDTH: 280, // px
    COMMAND_BAR_WIDTH: 64, // px
    PROJECT_CARD_WIDTH: 26, // rem
    MOBILE_PROJECT_CARD_WIDTH: '85vw',
    MAX_CONTENT_WIDTH: 1280, // px (max-w-7xl)
};

// Z-Index Layers
export const Z_INDEX = {
    BASE: 0,
    DROPDOWN: 10,
    STICKY: 20,
    OVERLAY: 30,
    MODAL: 40,
    POPOVER: 50,
    TOAST: 100,
    COMMAND_BAR: 100,
};

// Animation Durations (ms)
export const ANIMATION = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    LOADER: 2000,
};

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
};

// Limits
export const LIMITS = {
    MAX_SEARCH_RESULTS: 5,
    MAX_CLIENT_RESULTS: 3,
    MAX_FILE_SIZE_MB: 10,
    DEBOUNCE_DELAY: 300,
};

// Status Types
export const STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    APPROVED: 'approved',
    REJECTED: 'rejected',
};

// Asset Types
export const ASSET_TYPES = {
    RAW: 'raw',
    EDITED: 'edited',
    FINAL: 'final',
};

// Local Storage Keys
export const STORAGE_KEYS = {
    CURRENT_USER: 'visuals_currentUser',
    PROJECTS: 'visuals_projects',
    CLIENTS: 'visuals_clients',
    ACTIVITIES: 'visuals_activities',
    MOOD_BOARDS: 'visuals_moodBoards',
    TASKS: 'visuals_tasks',
    SMART_FOLDERS: 'visuals_smartFolders',
    TIME_ENTRIES: 'visuals_timeEntries',
    PERMISSIONS: 'visuals_permissions',
    AUDIT_LOGS: 'visuals_auditLogs',
};

// Activity Types
export const ACTIVITY_TYPES = {
    UPLOAD: 'upload',
    COMMENT: 'comment',
    APPROVE: 'approve',
    REJECT: 'reject',
    TASK_ASSIGNED: 'task_assigned',
    TASK_COMPLETED: 'task_completed',
    MENTION: 'mention',
    PROJECT_CREATED: 'project_created',
    CLIENT_ADDED: 'client_added',
};

// Task Priorities
export const TASK_PRIORITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    URGENT: 'urgent',
};

// Task Status
export const TASK_STATUS = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

// Approval Status
export const APPROVAL_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CHANGES_REQUESTED: 'changes_requested',
};

// Permission Levels
export const PERMISSION_LEVELS = {
    NONE: 'none',
    VIEW: 'view',
    COMMENT: 'comment',
    EDIT: 'edit',
    ADMIN: 'admin',
};

// User Roles
export const USER_ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    MEMBER: 'member',
    CLIENT: 'client',
    VIEWER: 'viewer',
};
