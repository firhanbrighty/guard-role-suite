import { useEffect, useState } from 'react';

export interface ChangeRequest {
  id: string;
  title: string;
  requester: string;
  impact: 'low' | 'medium' | 'high';
  status: 'pending' | 'on_process' | 'review' | 'completed';
  createdAt: string;
  description?: string;
}

const initialChangeRequests: ChangeRequest[] = [
  {
    id: 'cr-1',
    title: 'Increase password length',
    requester: 'manager@example.com',
    impact: 'medium',
    status: 'pending',
    createdAt: '2025-09-02',
    description: 'Change minimum from 8 to 12 characters',
  },
  {
    id: 'cr-2',
    title: 'Database migration',
    requester: 'admin@example.com',
    impact: 'high',
    status: 'on_process',
    createdAt: '2025-09-03',
    description: 'Migrate database to new version',
  },
  {
    id: 'cr-3',
    title: 'UI/UX improvements',
    requester: 'designer@example.com',
    impact: 'low',
    status: 'review',
    createdAt: '2025-09-04',
    description: 'Review and approve new UI design changes',
  },
  {
    id: 'cr-4',
    title: 'Security patch deployment',
    requester: 'security@example.com',
    impact: 'high',
    status: 'completed',
    createdAt: '2025-09-05',
    description: 'Deploy critical security patches',
  },
];

export const useChangeRequests = () => {
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('adminDashboardChangeRequests');
    if (saved) {
      setChangeRequests(JSON.parse(saved));
    } else {
      setChangeRequests(initialChangeRequests);
      localStorage.setItem('adminDashboardChangeRequests', JSON.stringify(initialChangeRequests));
    }
  }, []);

  const save = (next: ChangeRequest[]) => {
    setChangeRequests(next);
    localStorage.setItem('adminDashboardChangeRequests', JSON.stringify(next));
  };

  const createChangeRequest = (data: Omit<ChangeRequest, 'id' | 'createdAt'>) => {
    const newRec: ChangeRequest = {
      ...data,
      id: Math.random().toString(36).slice(2, 10),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const next = [...changeRequests, newRec];
    save(next);
    return newRec;
  };

  const updateChangeRequest = (id: string, data: Partial<ChangeRequest>) => {
    const next = changeRequests.map(r => (r.id === id ? { ...r, ...data } : r));
    save(next);
    return next.find(r => r.id === id);
  };

  const deleteChangeRequest = (id: string) => {
    const next = changeRequests.filter(r => r.id !== id);
    save(next);
  };

  const getChangeRequestById = (id: string) => changeRequests.find(r => r.id === id);

  return { changeRequests, createChangeRequest, updateChangeRequest, deleteChangeRequest, getChangeRequestById };
};


