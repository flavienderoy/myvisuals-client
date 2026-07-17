import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '../hooks/useToast';
import { useAuth } from './AuthContext';
import { projectService } from '../services/projectService';
import { clientService } from '../services/clientService';
import { taskService } from '../services/taskService';
import { moodBoardService } from '../services/moodBoardService';
import { activityService } from '../services/activityService';
import { assetService } from '../services/assetService';
import { notificationService } from '../services/notificationService';
import { messageService } from '../services/messageService';
import { profileService } from '../services/profileService';
import { smartFolderService } from '../services/smartFolderService';
import { watermarkService } from '../services/watermarkService';
import { timeEntryService } from '../services/timeEntryService';
import { auditLogService } from '../services/auditLogService';
import { permissionService } from '../services/permissionService';
import { supabase } from '../supabaseClient';

import {
    createActivityFunctions,
    createMoodBoardFunctions,
    createTaskFunctions,
    createSmartFolderFunctions,
    createTimeTrackingFunctions,
    createAuditLogFunctions,
    createLookFunctions,
    createAnnotationFunctions
} from './DataContextExtensions';
import { STORAGE_KEYS } from '../constants';

const DataContext = createContext();

export const useData = () => {
    return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
    const toast = useToast();
    const { user } = useAuth(); // Auth context state

    const [currentUser, setCurrentUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    // Advanced states (all Migrated to API)
    const [activities, setActivities] = useState([]);
    const [moodBoards, setMoodBoards] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [timeEntries, setTimeEntries] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [smartFolders, setSmartFolders] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [looks, setLooks] = useState([]);
    const [annotations, setAnnotations] = useState([]);
    const [watermarkSettings, setWatermarkSettings] = useState({ text: 'MyVisuals • PREVIEW', opacity: 30 });

    // Supabase Realtime Subscriptions
    useEffect(() => {
        if (!user) return;

        const activitySub = supabase
          .channel('public:activities')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activities' }, payload => {
            setActivities(prev => [payload.new, ...prev]);
          })
          .subscribe();

        const notificationSub = supabase
          .channel('public:notifications')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
            setNotifications(prev => [payload.new, ...prev]);
            toast.info(`Nouvelle notification : ${payload.new.message}`);
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications' }, payload => {
            setNotifications(prev => prev.map(n => n.id === payload.new.id ? payload.new : n));
          })
          .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'notifications' }, payload => {
            setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
          })
          .subscribe();

        const messageSub = supabase
          .channel('public:messages')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
            setMessages(prev => [payload.new, ...prev]);
          })
          .subscribe();

        return () => {
            supabase.removeChannel(activitySub);
            supabase.removeChannel(notificationSub);
            supabase.removeChannel(messageSub);
        };
    }, [user]);

    // Load Real API Data
    const loadCoreData = useCallback(async () => {
        if (!user) {
            setProjects([]);
            setClients([]);
            setCurrentUser(null);
            setLoadingData(false);
            return;
        }

        try {
            setLoadingData(true);
            const [
                fetchedProjects, 
                fetchedClients,
                fetchedTasks,
                fetchedMoodBoards,
                fetchedTimeEntries,
                fetchedNotifications,
                fetchedSmartFolders,
                fetchedPermissions,
                fetchedAuditLogs
            ] = await Promise.all([
                projectService.getProjects(),
                clientService.getClients(),
                taskService.getTasks().catch(() => []),
                moodBoardService.getMoodBoards().catch(() => []),
                timeEntryService.getTimeEntries().catch(() => []),
                notificationService.getNotifications().catch(() => []),
                smartFolderService.getSmartFolders().catch(() => []),
                permissionService.getPermissions().catch(() => []),
                auditLogService.getAuditLogs().catch(() => [])
            ]);

            setTasks(fetchedTasks || []);
            setMoodBoards(fetchedMoodBoards || []);
            setTimeEntries(fetchedTimeEntries || []);
            setNotifications(fetchedNotifications || []);
            setSmartFolders(fetchedSmartFolders || []);
            setPermissions(fetchedPermissions || []);
            setAuditLogs(fetchedAuditLogs || []);

            // Also load watermark settings if possible
            try {
                const settingsInfo = await watermarkService.getSettings();
                if (settingsInfo) setWatermarkSettings(settingsInfo);
            } catch(e) { }

            // Fetch activities and messages for all fetched projects
            try {
                const activitiesPromises = (fetchedProjects || []).map(p => activityService.getActivities(p.id).catch(() => []));
                const messagesPromises = (fetchedProjects || []).map(p => messageService.getMessages(p.id).catch(() => []));
                const [allActivitiesArrays, allMessagesArrays] = await Promise.all([
                    Promise.all(activitiesPromises),
                    Promise.all(messagesPromises)
                ]);
                setActivities(allActivitiesArrays.flat());
                setMessages(allMessagesArrays.flat());
            } catch (err) {
                console.warn("Could not fetch activities/messages", err);
                setActivities([]);
                setMessages([]);
            }

            // Fetch assets for every project (so studio & client see them on load)
            let assetsByProject = {};
            try {
                const results = await Promise.all(
                    (fetchedProjects || []).map(async (p) => {
                        const res = await assetService.getAssets(p.id).catch(() => []);
                        return [p.id, Array.isArray(res) ? res : res.data || []];
                    })
                );
                assetsByProject = Object.fromEntries(results);
            } catch (err) {
                console.warn("Could not fetch assets", err);
            }

            // Enrich the current user with their profile row (avatar, name, org)
            let profile = null;
            try {
                profile = await profileService.getProfile();
            } catch {
                profile = null;
            }
            setCurrentUser({
                id: user.id,
                name: profile?.name || user.user_metadata?.name || 'User',
                email: user.email,
                role: user.user_metadata?.role || 'client',
                avatar: profile?.avatar_url || null,
                organization: profile?.organization || null,
            });

            // Map API data to standard UI format to avoid breaking components
            const mappedClients = fetchedClients.map(c => ({
                id: c.id,
                name: c.name,
                description: c.description || '',
                logo: c.logo_url || c.avatar_url,
                email: c.email || null,
                inviteStatus: c.invite_status || null,
            }));

            const mappedProjects = fetchedProjects.map(p => ({
                id: p.id,
                name: p.name,
                description: p.description || '',
                client: p.client?.name || 'Sans client',
                client_id: p.client_id,
                status: p.status,
                date: p.date,
                owner_id: p.owner_id,
                // UI mappings arrays:
                looks: p.looks || [],
                assets: assetsByProject[p.id] || p.assets || [],
            }));

            setClients(mappedClients);
            setProjects(mappedProjects);
        } catch (error) {
            console.error("Failed to load core data:", error);
            toast.error("Erreur de connexion au serveur");
        } finally {
            setLoadingData(false);
        }
    }, [user]);

    // Re-fetch when user changes
    useEffect(() => {
        loadCoreData();
    }, [loadCoreData]);

    // --- Actions ---

    const addClient = async (clientName, description, avatar = null, email = null) => {
        try {
            const newApiObj = await clientService.createClient({ name: clientName, description, avatar_url: avatar, email });
            const newClient = { id: newApiObj.id, name: newApiObj.name, description: newApiObj.description, logo: newApiObj.avatar_url, email: newApiObj.email, inviteStatus: newApiObj.invite_status };
            setClients(prev => [...prev, newClient]);
            toast.success(email ? `Invitation envoyée à ${email}` : `Entreprise "${clientName}" créée`);
            return newClient;
        } catch(e) {
            toast.error("Impossible de créer l'entreprise");
        }
    };

    const addProject = async (projectData) => {
        try {
            // Prefer an explicit client id (robust); fall back to name resolution
            let clientId = projectData.clientId || null;
            if (!clientId && projectData.client) {
                const existing = clients.find(c => c.name === projectData.client);
                if (existing) {
                    clientId = existing.id;
                } else {
                    const c = await addClient(projectData.client, "");
                    if(c) clientId = c.id;
                }
            }

            const newApiObj = await projectService.createProject({
                name: projectData.name,
                description: projectData.summary || '',
                date: projectData.date || new Date().toISOString().split('T')[0],
                status: projectData.status || 'pending',
                client_id: clientId
            });

            const newProj = {
                id: newApiObj.id,
                name: newApiObj.name,
                description: newApiObj.description,
                client: newApiObj.client?.name || projectData.client || clients.find(c => c.id === clientId)?.name || 'Sans client',
                client_id: newApiObj.client_id || clientId,
                status: newApiObj.status,
                date: newApiObj.date,
                looks: [],
                assets: []
            };

            setProjects(prev => [newProj, ...prev]);
            toast.success("Projet créé !");
            return newProj;
        } catch(e) {
            toast.error("Erreur création projet");
        }
    };

    const updateProject = async (projectId, updates) => {
        try {
            // translate local updates to api updates
            const apiUpdates = { 
                name: updates.name, 
                status: updates.status, 
                description: updates.description || updates.summary 
            };
            const updated = await projectService.updateProject(projectId, apiUpdates);
            
            setProjects(prev => prev.map(p => {
                if (p.id === projectId) return { ...p, ...updates };
                return p;
            }));
            toast.success("Projet mis à jour");
        } catch(e) {
            toast.error("Erreur de mise à jour");
        }
    };

    const addAsset = async (projectId, assetData) => {
        try {
            const { file, name } = assetData;
            // Upload to API
            const newApiObj = await assetService.createAsset(projectId, file, { name });

            // Ensure the project state correctly reflects the new asset
            setProjects(prev => prev.map(p => {
                if (p.id === projectId) {
                    return { ...p, assets: [...(p.assets || []), newApiObj] };
                }
                return p;
            }));

            toast.success("Image téléchargée avec succès !");
            return newApiObj;
        } catch (e) {
            console.error("Erreur addAsset:", e);
            toast.error("Échec de l'upload de l'image");
        }
    };

    // Patch a single asset in local state (e.g. after approve/reject in the viewer)
    const patchAsset = (assetId, patch) => {
        setProjects(prev => prev.map(p => ({
            ...p,
            assets: (p.assets || []).map(a => a.id === assetId ? { ...a, ...patch } : a),
        })));
    };

    const resetData = () => {
        // Obsolete
        loadCoreData();
    };

    // --- Navigation / Selection State ---
    const [currentSelection, setCurrentSelection] = useState({ type: 'global', id: null });
    const selectGlobal = () => setCurrentSelection({ type: 'global', id: null });
    const selectClient = (clientName) => setCurrentSelection({ type: 'client', id: clientName });
    const selectProject = (projectId) => setCurrentSelection({ type: 'project', id: projectId });

    // --- Extensions ---
    const activityFunctions = createActivityFunctions(activities, setActivities, toast);
    const moodBoardFunctions = createMoodBoardFunctions(moodBoards, setMoodBoards, toast);
    const taskFunctions = createTaskFunctions(tasks, setTasks, toast, activityFunctions.addActivity);
    const smartFolderFunctions = createSmartFolderFunctions(smartFolders, setSmartFolders, toast);
    const timeTrackingFunctions = createTimeTrackingFunctions(timeEntries, setTimeEntries, toast);
    const auditLogFunctions = createAuditLogFunctions(auditLogs, setAuditLogs);
    const lookFunctions = createLookFunctions(looks, setLooks, toast);
    const annotationFunctions = createAnnotationFunctions(annotations, setAnnotations, toast);

    const value = {
        notifications,
        setNotifications,
        messages,
        setMessages,
        currentUser: currentUser || { name: 'Invité' },
        projects,
        clients,
        loadingData,
        addClient,
        addProject,
        updateProject,
        addAsset,
        patchAsset,
        resetData,
        refreshData: loadCoreData,

        currentSelection,
        selectGlobal,
        selectClient,
        selectProject,

        activities, ...activityFunctions,
        moodBoards, ...moodBoardFunctions,
        tasks, ...taskFunctions,
        smartFolders, ...smartFolderFunctions,
        timeEntries, ...timeTrackingFunctions,
        permissions, setPermissions,
        auditLogs, ...auditLogFunctions,
        looks, ...lookFunctions,
        annotations, ...annotationFunctions,
        watermarkSettings, setWatermarkSettings,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
