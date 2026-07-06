import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Shield, User, Lock, Eye, Edit, Trash2 } from 'lucide-react';
import { PERMISSION_LEVELS, USER_ROLES, getPermissionLabel, getRoleLabel } from '../../utils/permissions';

const UserPermissionRow = ({ user, permission, onUpdate, onRemove }) => {
    const permissionOptions = Object.values(PERMISSION_LEVELS);
    const roleOptions = Object.values(USER_ROLES);

    return (
        <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-mv-gold/20 flex items-center justify-center flex-shrink-0">
                <User className="text-mv-gold" size={20} />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.name}</p>
                <p className="text-gray-500 text-xs">{user.email}</p>
            </div>

            <select
                value={permission.role}
                onChange={(e) => onUpdate({ ...permission, role: e.target.value })}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-mv-gold"
            >
                {roleOptions.map(role => (
                    <option key={role} value={role}>
                        {getRoleLabel(role)}
                    </option>
                ))}
            </select>

            <select
                value={permission.level}
                onChange={(e) => onUpdate({ ...permission, level: e.target.value })}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-white text-sm focus:outline-none focus:border-mv-gold"
            >
                {permissionOptions.map(level => (
                    <option key={level} value={level}>
                        {getPermissionLabel(level)}
                    </option>
                ))}
            </select>

            <button
                onClick={onRemove}
                className="p-2 hover:bg-red-500/20 rounded transition-colors"
            >
                <Trash2 className="text-red-400" size={16} />
            </button>
        </div>
    );
};

export const PermissionsManager = ({ projectId }) => {
    const { permissions, setPermissions } = useData();

    // Mock users for this project
    const [projectPermissions, setProjectPermissions] = useState([
        { userId: '1', name: 'Jean Dupont', email: 'jean@example.com', role: USER_ROLES.OWNER, level: PERMISSION_LEVELS.ADMIN },
        { userId: '2', name: 'Marie Martin', email: 'marie@example.com', role: USER_ROLES.MEMBER, level: PERMISSION_LEVELS.EDIT },
        { userId: '3', name: 'Client ABC', email: 'client@example.com', role: USER_ROLES.CLIENT, level: PERMISSION_LEVELS.VIEW },
    ]);

    const [showAddUser, setShowAddUser] = useState(false);
    const [newUserEmail, setNewUserEmail] = useState('');

    const updatePermission = (userId, updatedPermission) => {
        setProjectPermissions(prev => prev.map(p =>
            p.userId === userId ? { ...p, ...updatedPermission } : p
        ));
    };

    const removePermission = (userId) => {
        setProjectPermissions(prev => prev.filter(p => p.userId !== userId));
    };

    const addUser = () => {
        if (!newUserEmail.trim()) return;

        const newUser = {
            userId: Date.now().toString(),
            name: newUserEmail.split('@')[0],
            email: newUserEmail,
            role: USER_ROLES.VIEWER,
            level: PERMISSION_LEVELS.VIEW,
        };

        setProjectPermissions(prev => [...prev, newUser]);
        setNewUserEmail('');
        setShowAddUser(false);
    };

    const permissionIcons = {
        [PERMISSION_LEVELS.NONE]: Lock,
        [PERMISSION_LEVELS.VIEW]: Eye,
        [PERMISSION_LEVELS.COMMENT]: Shield,
        [PERMISSION_LEVELS.EDIT]: Edit,
        [PERMISSION_LEVELS.ADMIN]: Shield,
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-white font-medium mb-1 flex items-center gap-2">
                    <Shield className="text-mv-gold" size={20} />
                    Gestion des Permissions
                </h3>
                <p className="text-sm text-gray-400">
                    Contrôlez qui peut accéder et modifier ce projet
                </p>
            </div>

            {/* Permission Levels Legend */}
            <div className="bg-black/20 border border-white/10 hover:border-white/30 transition-all duration-300 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-3">Niveaux de permission :</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {Object.values(PERMISSION_LEVELS).map(level => {
                        const Icon = permissionIcons[level];
                        return (
                            <div key={level} className="flex items-center gap-2">
                                <Icon className="text-gray-600" size={14} />
                                <span className="text-xs text-gray-400">
                                    {getPermissionLabel(level)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Users List */}
            <div className="space-y-2">
                {projectPermissions.map(permission => (
                    <UserPermissionRow
                        key={permission.userId}
                        user={permission}
                        permission={permission}
                        onUpdate={(updated) => updatePermission(permission.userId, updated)}
                        onRemove={() => removePermission(permission.userId)}
                    />
                ))}
            </div>

            {/* Add User */}
            {showAddUser ? (
                <div className="flex gap-2">
                    <input
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addUser()}
                        placeholder="email@example.com"
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-mv-gold transition-colors"
                        autoFocus
                    />
                    <button
                        onClick={addUser}
                        className="px-4 py-2 bg-mv-gold hover:bg-white text-black font-medium rounded-lg transition-colors"
                    >
                        Ajouter
                    </button>
                    <button
                        onClick={() => {
                            setShowAddUser(false);
                            setNewUserEmail('');
                        }}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors"
                    >
                        Annuler
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setShowAddUser(true)}
                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 border-dashed text-gray-400 hover:text-white rounded-lg transition-colors"
                >
                    + Inviter un utilisateur
                </button>
            )}

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-400 text-xs">
                    <strong>Note:</strong> Les modifications de permissions prennent effet immédiatement.
                    Les utilisateurs recevront une notification par email.
                </p>
            </div>
        </div>
    );
};
