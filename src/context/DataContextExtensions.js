// Extended DataContext with all new features
// This file contains the state management additions for advanced features

import { STORAGE_KEYS, ACTIVITY_TYPES } from '../constants';
import { activityService } from '../services/activityService';
import { moodBoardService } from '../services/moodBoardService';
import { taskService } from '../services/taskService';
import { timeEntryService } from '../services/timeEntryService';
import { smartFolderService } from '../services/smartFolderService';
import { auditLogService } from '../services/auditLogService';
import { lookService } from '../services/lookService';
import { annotationService } from '../services/annotationService';

// Local Storage fully replaced by API

/**
 * Activity Management Functions
 */
export const createActivityFunctions = (activities, setActivities, toast) => ({
    addActivity: async (activityData) => {
        try {
            const newActivity = await activityService.createActivity(activityData);
            setActivities(prev => [newActivity, ...prev]);
            return newActivity;
        } catch (e) {
            console.error(e);
        }
    },

    getActivitiesByProject: (projectId) => {
        return activities.filter(a => a.project_id === projectId || a.projectId === projectId);
    },

    getRecentActivities: (limit = 20) => {
        return activities.slice(0, limit);
    },
});

/**
 * Mood Board Management Functions
 */
export const createMoodBoardFunctions = (moodBoards, setMoodBoards, toast) => ({
    createMoodBoard: async (name, description = '') => {
        try {
            const newMoodBoard = await moodBoardService.createMoodBoard({ name, description });
            setMoodBoards(prev => [...prev, newMoodBoard]);
            toast.success(`Mood Board "${name}" créé`);
            return newMoodBoard;
        } catch (e) {
            toast.error("Erreur lors de la création du Mood Board");
        }
    },

    addToMoodBoard: async (moodBoardId, assetId) => {
        try {
            await moodBoardService.addAssetToMoodBoard(moodBoardId, assetId);
            setMoodBoards(prev => prev.map(mb =>
                mb.id === moodBoardId
                    ? { ...mb, assets: [...(mb.assets || []), assetId] }
                    : mb
            ));
            toast.success('Asset ajouté au Mood Board');
        } catch (e) {
            toast.error("Erreur lors de l'ajout au Mood Board");
        }
    },

    removeFromMoodBoard: async (moodBoardId, assetId) => {
        try {
            await moodBoardService.removeAssetFromMoodBoard(moodBoardId, assetId);
            setMoodBoards(prev => prev.map(mb =>
                mb.id === moodBoardId
                    ? { ...mb, assets: (mb.assets || []).filter(id => id !== assetId) }
                    : mb
            ));
        } catch (e) {
            toast.error("Erreur lors de la suppression de l'asset");
        }
    },

    deleteMoodBoard: async (moodBoardId) => {
        try {
            await moodBoardService.deleteMoodBoard(moodBoardId);
            setMoodBoards(prev => prev.filter(mb => mb.id !== moodBoardId));
            toast.success('Mood Board supprimé');
        } catch (e) {
            toast.error("Erreur lors de la suppression du Mood Board");
        }
    },
});

/**
 * Task Management Functions
 */
export const createTaskFunctions = (tasks, setTasks, toast, addActivity) => ({
    createTask: async (taskData) => {
        try {
            const newTask = await taskService.createTask(taskData);
            setTasks(prev => [...prev, newTask]);

            // Log activity
            addActivity({
                type: ACTIVITY_TYPES.TASK_ASSIGNED,
                project_id: taskData.projectId || taskData.project_id,
                metadata: { assetId: taskData.assetId },
                description: `Tâche assignée à ${taskData.assignedTo}: ${taskData.title}`,
            });

            toast.success('Tâche créée et assignée');
            return newTask;
        } catch (e) {
            toast.error("Erreur lors de la création de la tâche");
        }
    },

    updateTaskStatus: async (taskId, status) => {
        try {
            await taskService.updateTask(taskId, { status });
            setTasks(prev => prev.map(t =>
                t.id === taskId ? { ...t, status, updated_at: new Date().toISOString() } : t
            ));

            if (status === 'completed') {
                const task = tasks.find(t => t.id === taskId);
                if (task) {
                    addActivity({
                        type: ACTIVITY_TYPES.TASK_COMPLETED,
                        project_id: task.projectId || task.project_id,
                        description: `Tâche complétée: ${task.title}`,
                    });
                }
            }
        } catch (e) {
            toast.error("Erreur lors de la mise à jour");
        }
    },

    getTasksByProject: (projectId) => {
        return tasks.filter(t => t.projectId === projectId || t.project_id === projectId);
    },

    getTasksByUser: (userId) => {
        return tasks.filter(t => t.assignedTo === userId || t.assigned_to === userId);
    }, // Some mapping might be needed depending on the database schema
});

/**
 * Smart Folders Management Functions
 */
export const createSmartFolderFunctions = (smartFolders, setSmartFolders, toast) => ({
    createSmartFolder: async (name, filters) => {
        try {
            const newFolder = await smartFolderService.createSmartFolder({ name, filters });
            setSmartFolders(prev => [newFolder, ...prev]);
            toast.success(`Dossier intelligent "${name}" créé`);
            return newFolder;
        } catch(e) { toast.error("Erreur de création du dossier intelligent"); }
    },

    deleteSmartFolder: async (folderId) => {
        try {
            await smartFolderService.deleteSmartFolder(folderId);
            setSmartFolders(prev => prev.filter(f => f.id !== folderId));
            toast.success('Dossier supprimé');
        } catch(e) { toast.error("Erreur de suppression du dossier"); }
    },
});

/**
 * Time Tracking Functions
 */
export const createTimeTrackingFunctions = (timeEntries, setTimeEntries, toast) => ({
    addTimeEntry: async (entryData) => {
        try {
            const newEntry = await timeEntryService.createTimeEntry(entryData);
            setTimeEntries(prev => [...prev, newEntry]);
            return newEntry;
        } catch (e) {
            toast.error("Erreur lors de l'ajout du temps");
        }
    },

    getTimeByProject: (projectId) => {
        return timeEntries
            .filter(e => e.projectId === projectId || e.project_id === projectId)
            .reduce((sum, e) => sum + (e.duration || 0), 0);
    },
});

/**
 * Audit Log Functions
 */
export const createAuditLogFunctions = (auditLogs, setAuditLogs) => ({
    logAction: async (action, resourceType, resourceId, details = {}) => {
        try {
            const newLog = await auditLogService.logAction({ action, resource_type: resourceType, resource_id: resourceId, details });
            setAuditLogs(prev => [newLog, ...prev]);
        } catch(e) { console.error("Could not log action", e); }
    },

    getLogsByResource: (resourceType, resourceId) => {
        return auditLogs.filter(log =>
            log.resource_type === resourceType && log.resource_id === resourceId
        );
    },
});

/**
 * Look Management Functions
 */
export const createLookFunctions = (looks, setLooks, toast) => ({
    createLook: async (projectId, lookData) => {
        try {
            const newLook = await lookService.createLook(projectId, lookData);
            setLooks(prev => [...prev, newLook]);
            toast.success('Look créé avec succès');
            return newLook;
        } catch (e) {
            toast.error("Erreur lors de la création du look");
        }
    },
    updateLook: async (id, updateData) => {
        try {
            const updatedLook = await lookService.updateLook(id, updateData);
            setLooks(prev => prev.map(l => l.id === id ? { ...l, ...updatedLook } : l));
            return updatedLook;
        } catch (e) {
            toast.error("Erreur de mise à jour du look");
        }
    },
    deleteLook: async (id) => {
        try {
            await lookService.deleteLook(id);
            setLooks(prev => prev.filter(l => l.id !== id));
            toast.success('Look supprimé');
        } catch (e) {
            toast.error("Erreur de suppression du look");
        }
    },
    reorderLooks: async (reorderedLooks) => {
        try {
            setLooks(reorderedLooks); // Optimistic UI
            await lookService.reorderLooks(reorderedLooks.map(l => ({ id: l.id, position: l.position })));
        } catch (e) {
            toast.error("Erreur de réorganisation");
        }
    }
});

/**
 * Annotation Management Functions
 */
export const createAnnotationFunctions = (annotations, setAnnotations, toast) => ({
    createAnnotation: async (annotationData) => {
        try {
            const newAnnotation = await annotationService.createAnnotation(annotationData);
            setAnnotations(prev => [...prev, newAnnotation]);
            return newAnnotation;
        } catch (e) {
            toast.error("Erreur d'ajout d'annotation");
        }
    },
    updateAnnotation: async (id, updateData) => {
        try {
            const updated = await annotationService.updateAnnotation(id, updateData);
            setAnnotations(prev => prev.map(a => a.id === id ? { ...a, ...updated } : a));
            return updated;
        } catch (e) {
            toast.error("Erreur de mise à jour");
        }
    },
    deleteAnnotation: async (id) => {
        try {
            await annotationService.deleteAnnotation(id);
            setAnnotations(prev => prev.filter(a => a.id !== id));
        } catch (e) {
            toast.error("Erreur de suppression");
        }
    }
});

