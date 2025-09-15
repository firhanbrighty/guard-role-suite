import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Manager User',
    role: 'manager',
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    createdAt: '2024-01-03',
  },
];

// Mock credentials (in real app, this would be handled by backend)
const mockCredentials = {
  'admin@example.com': 'admin123',
  'manager@example.com': 'manager123',
  'user@example.com': 'user123',
};

// Role permissions
const rolePermissions = {
  admin: ['users.create', 'users.read', 'users.update', 'users.delete', 'roles.create', 'roles.read', 'roles.update', 'roles.delete'],
  manager: ['users.read', 'users.update', 'roles.read'],
  user: ['users.read'],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('adminDashboardUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    if (mockCredentials[email as keyof typeof mockCredentials] === password) {
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('adminDashboardUser', JSON.stringify(foundUser));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminDashboardUser');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const permissions = rolePermissions[user.role as keyof typeof rolePermissions] || [];
    return permissions.includes(permission);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};