// Demo data generator for new features
import { ACTIVITY_TYPES, TASK_PRIORITY, TASK_STATUS } from '../constants';

export const generateDemoActivities = () => {
    const now = Date.now();
    return [
        {
            id: 'act_1',
            type: ACTIVITY_TYPES.UPLOAD,
            message: 'Jean Dupont a uploadé 5 nouveaux assets',
            timestamp: new Date(now - 3600000).toISOString(), // 1h ago
            projectId: 'proj_1',
        },
        {
            id: 'act_2',
            type: ACTIVITY_TYPES.COMMENT,
            message: 'Marie Martin a commenté sur Photo_Campagne_001.jpg',
            timestamp: new Date(now - 7200000).toISOString(), // 2h ago
            projectId: 'proj_2',
        },
        {
            id: 'act_3',
            type: ACTIVITY_TYPES.APPROVE,
            message: 'Client Vogue Paris a approuvé le projet "Summer Collection"',
            timestamp: new Date(now - 14400000).toISOString(), // 4h ago
            projectId: 'proj_3',
        },
        {
            id: 'act_4',
            type: ACTIVITY_TYPES.TASK_ASSIGNED,
            message: 'Nouvelle tâche assignée: Retoucher les couleurs',
            timestamp: new Date(now - 21600000).toISOString(), // 6h ago
            projectId: 'proj_1',
        },
        {
            id: 'act_5',
            type: ACTIVITY_TYPES.PROJECT_CREATED,
            message: 'Nouveau projet créé: "Architectural Digest - Spring 2026"',
            timestamp: new Date(now - 86400000).toISOString(), // 1 day ago
        },
        {
            id: 'act_6',
            type: ACTIVITY_TYPES.MENTION,
            message: 'Pierre Durand vous a mentionné dans un commentaire',
            timestamp: new Date(now - 172800000).toISOString(), // 2 days ago
            projectId: 'proj_2',
        },
    ];
};

export const generateDemoTasks = () => {
    return [
        {
            id: 'task_1',
            title: 'Retoucher l\'exposition des photos',
            description: 'Ajuster la luminosité et le contraste sur les 10 photos principales',
            assignedTo: 'Sophie Bernard',
            projectId: 'proj_1',
            priority: TASK_PRIORITY.HIGH,
            status: TASK_STATUS.IN_PROGRESS,
            deadline: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days
            createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            id: 'task_2',
            title: 'Validation client',
            description: 'Envoyer la sélection finale au client pour approbation',
            assignedTo: 'Jean Dupont',
            projectId: 'proj_2',
            priority: TASK_PRIORITY.URGENT,
            status: TASK_STATUS.PENDING,
            deadline: new Date(Date.now() + 86400000).toISOString(), // tomorrow
            createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
    ];
};

export const initializeDemoData = (addActivity, createTask) => {
    // Check if demo data already exists
    const existingActivities = localStorage.getItem('visuals_activities');
    const existingTasks = localStorage.getItem('visuals_tasks');

    if (!existingActivities || JSON.parse(existingActivities).length === 0) {
        const activities = generateDemoActivities();
        localStorage.setItem('visuals_activities', JSON.stringify(activities));
    }

    if (!existingTasks || JSON.parse(existingTasks).length === 0) {
        const tasks = generateDemoTasks();
        localStorage.setItem('visuals_tasks', JSON.stringify(tasks));
    }
};
