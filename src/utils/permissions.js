// Utility functions for permissions and access control

import { PERMISSION_LEVELS, USER_ROLES } from '../constants';

/**
 * Check if user has required permission level
 */
export const hasPermission = (userRole, requiredLevel) => {
    const hierarchy = {
        [USER_ROLES.VIEWER]: 0,
        [USER_ROLES.CLIENT]: 1,
        [USER_ROLES.MEMBER]: 2,
        [USER_ROLES.ADMIN]: 3,
        [USER_ROLES.OWNER]: 4,
    };

    const permissionHierarchy = {
        [PERMISSION_LEVELS.NONE]: 0,
        [PERMISSION_LEVELS.VIEW]: 1,
        [PERMISSION_LEVELS.COMMENT]: 2,
        [PERMISSION_LEVELS.EDIT]: 3,
        [PERMISSION_LEVELS.ADMIN]: 4,
    };

    return hierarchy[userRole] >= permissionHierarchy[requiredLevel];
};

/**
 * Check if user can perform action on resource
 */
export const canPerformAction = (user, resource, action) => {
    // Owner can do anything
    if (user.role === USER_ROLES.OWNER) return true;

    // Check resource-specific permissions
    const userPermission = resource.permissions?.[user.id];

    switch (action) {
        case 'view':
            return userPermission >= PERMISSION_LEVELS.VIEW;
        case 'comment':
            return userPermission >= PERMISSION_LEVELS.COMMENT;
        case 'edit':
        case 'upload':
        case 'delete':
            return userPermission >= PERMISSION_LEVELS.EDIT;
        case 'manage':
            return userPermission >= PERMISSION_LEVELS.ADMIN;
        default:
            return false;
    }
};

/**
 * Get permission label
 */
export const getPermissionLabel = (level) => {
    const labels = {
        [PERMISSION_LEVELS.NONE]: 'Aucun accès',
        [PERMISSION_LEVELS.VIEW]: 'Lecture seule',
        [PERMISSION_LEVELS.COMMENT]: 'Commenter',
        [PERMISSION_LEVELS.EDIT]: 'Éditer',
        [PERMISSION_LEVELS.ADMIN]: 'Administrateur',
    };
    return labels[level] || 'Inconnu';
};

/**
 * Get role label
 */
export const getRoleLabel = (role) => {
    const labels = {
        [USER_ROLES.OWNER]: 'Propriétaire',
        [USER_ROLES.ADMIN]: 'Administrateur',
        [USER_ROLES.MEMBER]: 'Membre',
        [USER_ROLES.CLIENT]: 'Client',
        [USER_ROLES.VIEWER]: 'Observateur',
    };
    return labels[role] || 'Inconnu';
};

/**
 * Check if asset is favorited by user
 */
export const isFavorited = (asset, userId) => {
    return asset.favorites?.includes(userId) || false;
};

/**
 * Format time duration (minutes to human readable)
 */
export const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

/**
 * Get activity icon and color
 */
export const getActivityStyle = (type) => {
    const styles = {
        upload: { color: 'text-blue-400', bg: 'bg-blue-500/10' },
        comment: { color: 'text-gray-400', bg: 'bg-gray-500/10' },
        approve: { color: 'text-green-400', bg: 'bg-green-500/10' },
        reject: { color: 'text-red-400', bg: 'bg-red-500/10' },
        task_assigned: { color: 'text-orange-400', bg: 'bg-orange-500/10' },
        task_completed: { color: 'text-green-400', bg: 'bg-green-500/10' },
        mention: { color: 'text-mv-gold', bg: 'bg-mv-gold/10' },
        project_created: { color: 'text-purple-400', bg: 'bg-purple-500/10' },
        client_added: { color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    };
    return styles[type] || { color: 'text-gray-400', bg: 'bg-gray-500/10' };
};

/**
 * Parse mentions from text (@username)
 */
export const parseMentions = (text) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
        mentions.push(match[1]);
    }

    return mentions;
};

/**
 * Highlight mentions in text
 */
export const highlightMentions = (text) => {
    return text.replace(/@(\w+)/g, '<span class="text-mv-gold font-medium">@$1</span>');
};
