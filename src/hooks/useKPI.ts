import { useEffect, useState } from 'react';

export interface KPI {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  status: 'on_track' | 'at_risk' | 'off_track';
  createdAt: string;
  owner?: string;
}

const initialKPIs: KPI[] = [
  {
    id: 'kpi-1',
    name: 'Customer Satisfaction',
    description: 'Average customer satisfaction score',
    target: 4.5,
    current: 4.2,
    unit: 'out of 5',
    frequency: 'monthly',
    status: 'at_risk',
    createdAt: '2025-09-01',
    owner: 'Customer Success Team',
  },
];

export const useKPI = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('adminDashboardKPIs');
    if (saved) {
      setKpis(JSON.parse(saved));
    } else {
      setKpis(initialKPIs);
      localStorage.setItem('adminDashboardKPIs', JSON.stringify(initialKPIs));
    }
  }, []);

  const save = (next: KPI[]) => {
    setKpis(next);
    localStorage.setItem('adminDashboardKPIs', JSON.stringify(next));
  };

  const createKPI = (data: Omit<KPI, 'id' | 'createdAt'>) => {
    const newRec: KPI = {
      ...data,
      id: Math.random().toString(36).slice(2, 10),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const next = [...kpis, newRec];
    save(next);
    return newRec;
  };

  const updateKPI = (id: string, data: Partial<KPI>) => {
    const next = kpis.map(r => (r.id === id ? { ...r, ...data } : r));
    save(next);
    return next.find(r => r.id === id);
  };

  const deleteKPI = (id: string) => {
    const next = kpis.filter(r => r.id !== id);
    save(next);
  };

  const getKPIBById = (id: string) => kpis.find(r => r.id === id);

  return { kpis, createKPI, updateKPI, deleteKPI, getKPIBById };
};
