import { useEffect, useState } from 'react';

export interface OKR {
  id: string;
  objective: string;
  keyResults: string[];
  progress: number; // 0-100
  quarter: string; // Q1 2025, Q2 2025, etc.
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  owner?: string;
}

const initialOKRs: OKR[] = [
  {
    id: 'okr-1',
    objective: 'Improve User Experience',
    keyResults: [
      'Reduce page load time by 50%',
      'Achieve 95% user satisfaction score',
      'Decrease support tickets by 30%'
    ],
    progress: 65,
    quarter: 'Q3 2025',
    status: 'in_progress',
    createdAt: '2025-09-01',
    owner: 'Product Team',
  },
];

export const useOKR = () => {
  const [okrs, setOkrs] = useState<OKR[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('adminDashboardOKRs');
    if (saved) {
      setOkrs(JSON.parse(saved));
    } else {
      setOkrs(initialOKRs);
      localStorage.setItem('adminDashboardOKRs', JSON.stringify(initialOKRs));
    }
  }, []);

  const save = (next: OKR[]) => {
    setOkrs(next);
    localStorage.setItem('adminDashboardOKRs', JSON.stringify(next));
  };

  const createOKR = (data: Omit<OKR, 'id' | 'createdAt'>) => {
    const newRec: OKR = {
      ...data,
      id: Math.random().toString(36).slice(2, 10),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const next = [...okrs, newRec];
    save(next);
    return newRec;
  };

  const updateOKR = (id: string, data: Partial<OKR>) => {
    const next = okrs.map(r => (r.id === id ? { ...r, ...data } : r));
    save(next);
    return next.find(r => r.id === id);
  };

  const deleteOKR = (id: string) => {
    const next = okrs.filter(r => r.id !== id);
    save(next);
  };

  const getOKRById = (id: string) => okrs.find(r => r.id === id);

  return { okrs, createOKR, updateOKR, deleteOKR, getOKRById };
};
