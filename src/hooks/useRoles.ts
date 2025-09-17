import { useState, useEffect } from 'react';

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
}

// Available permissions in the system
export const availablePermissions = [
  'users.create',
  'users.read', 
  'users.update',
  'users.delete',
  'roles.create',
  'roles.read',
  'roles.update', 
  'roles.delete',
  'dashboard.access',
  'assets.create',
  'assets.read',
  'assets.update',
  'assets.delete',
  'contracts.create',
  'contracts.read',
  'contracts.update',
  'contracts.delete',
  'emails.create',
  'emails.read',
  'emails.update',
  'emails.delete',
  'payroll.create',
  'payroll.read',
  'payroll.update',
  'payroll.delete',
  'tickets.create',
  'tickets.read',
  'tickets.update',
  'tickets.delete',
  'changeRequests.create',
  'changeRequests.read',
  'changeRequests.update',
  'changeRequests.delete',
  'attendance.create',
  'attendance.read',
  'attendance.update',
  'attendance.delete',
  'kpi.create',
  'kpi.read',
  'kpi.update',
  'kpi.delete',
  'okr.create',
  'okr.read',
  'okr.update',
  'okr.delete',
  'reports.view',
  'settings.manage',
];

// Mock roles data
const initialRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access with all permissions',
    permissions: availablePermissions,
    createdAt: '2024-01-01',
  },
  {
    id: 'manager',
    name: 'Manager',
    description: 'Can manage users and view reports',
    permissions: ['users.read', 'users.update', 'roles.read', 'dashboard.access', 'reports.view'],
    createdAt: '2024-01-01',
  },
  {
    id: 'user',
    name: 'User',
    description: 'Basic user with limited access',
    permissions: ['users.read', 'dashboard.access'],
    createdAt: '2024-01-01',
  },
];

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    // Load roles from localStorage or use initial data
    const savedRoles = localStorage.getItem('adminDashboardRoles');
    if (savedRoles) {
      setRoles(JSON.parse(savedRoles));
    } else {
      setRoles(initialRoles);
      localStorage.setItem('adminDashboardRoles', JSON.stringify(initialRoles));
    }
  }, []);

  const saveRoles = (newRoles: Role[]) => {
    setRoles(newRoles);
    localStorage.setItem('adminDashboardRoles', JSON.stringify(newRoles));
  };

  const createRole = (roleData: Omit<Role, 'id' | 'createdAt'>) => {
    const newRole: Role = {
      ...roleData,
      id: roleData.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const newRoles = [...roles, newRole];
    saveRoles(newRoles);
    return newRole;
  };

  const updateRole = (id: string, roleData: Partial<Role>) => {
    const newRoles = roles.map(role =>
      role.id === id ? { ...role, ...roleData } : role
    );
    saveRoles(newRoles);
    return newRoles.find(r => r.id === id);
  };

  const deleteRole = (id: string) => {
    // Prevent deletion of system roles
    if (['admin', 'manager', 'user'].includes(id)) {
      throw new Error('Cannot delete system roles');
    }
    const newRoles = roles.filter(role => role.id !== id);
    saveRoles(newRoles);
  };

  const getRoleById = (id: string) => {
    return roles.find(role => role.id === id);
  };

  return {
    roles,
    createRole,
    updateRole,
    deleteRole,
    getRoleById,
    availablePermissions,
  };
};