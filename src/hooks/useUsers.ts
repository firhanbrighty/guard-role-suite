import { useState, useEffect } from 'react';
import { User } from '@/contexts/AuthContext';

export interface UserWithoutPassword extends User {
  status: 'active' | 'inactive';
  division?: string;
  organization?: string;
  position?: string;
  department?: string;
}

// Mock users data with localStorage persistence
const initialUsers: UserWithoutPassword[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01',
    status: 'active',
    division: 'IT Division',
    organization: 'Head Office',
    position: 'System Administrator',
    department: 'Information Technology',
  },
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Manager User',
    role: 'manager',
    createdAt: '2024-01-02',
    status: 'active',
    division: 'Operations Division',
    organization: 'Regional Office',
    position: 'Operations Manager',
    department: 'Operations',
  },
  {
    id: '3',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    createdAt: '2024-01-03',
    status: 'active',
    division: 'HR Division',
    organization: 'Head Office',
    position: 'HR Specialist',
    department: 'Human Resources',
  },
  {
    id: '4',
    email: 'finance@example.com',
    name: 'Finance User',
    role: 'user',
    createdAt: '2024-01-04',
    status: 'active',
    division: 'Finance Division',
    organization: 'Head Office',
    position: 'Financial Analyst',
    department: 'Finance',
  },
  {
    id: '5',
    email: 'marketing@example.com',
    name: 'Marketing User',
    role: 'user',
    createdAt: '2024-01-05',
    status: 'inactive',
    division: 'Marketing Division',
    organization: 'Branch Office',
    position: 'Marketing Coordinator',
    department: 'Marketing',
  },
];

export const useUsers = () => {
  const [users, setUsers] = useState<UserWithoutPassword[]>([]);

  useEffect(() => {
    // Load users from localStorage or use initial data
    const savedUsers = localStorage.getItem('adminDashboardUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('adminDashboardUsers', JSON.stringify(initialUsers));
    }
  }, []);

  const saveUsers = (newUsers: UserWithoutPassword[]) => {
    setUsers(newUsers);
    localStorage.setItem('adminDashboardUsers', JSON.stringify(newUsers));
  };

  const createUser = (userData: Omit<UserWithoutPassword, 'id' | 'createdAt'>) => {
    const newUser: UserWithoutPassword = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const newUsers = [...users, newUser];
    saveUsers(newUsers);
    return newUser;
  };

  const updateUser = (id: string, userData: Partial<UserWithoutPassword>) => {
    const newUsers = users.map(user =>
      user.id === id ? { ...user, ...userData } : user
    );
    saveUsers(newUsers);
    return newUsers.find(u => u.id === id);
  };

  const deleteUser = (id: string) => {
    const newUsers = users.filter(user => user.id !== id);
    saveUsers(newUsers);
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  return {
    users,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
  };
};