import { useState, useEffect } from 'react';

export interface Contract {
  id: string;
  title: string;
  party: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'draft';
  type: 'employee' | 'freelance' | 'internship' | 'vendor';
  createdAt: string;
  notes?: string;
}

const initialContracts: Contract[] = [
  {
    id: 'c-1',
    title: 'Employee Contract - John Doe',
    party: 'John Doe',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    status: 'active',
    type: 'employee',
    createdAt: '2024-01-02',
    notes: 'Full-time employee contract',
  },
  {
    id: 'c-2',
    title: 'Freelance Design Work',
    party: 'Jane Smith',
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    status: 'active',
    type: 'freelance',
    createdAt: '2024-05-15',
    notes: 'UI/UX design project',
  },
  {
    id: 'c-3',
    title: 'Internship Program',
    party: 'Mike Johnson',
    startDate: '2024-09-01',
    endDate: '2024-12-31',
    status: 'active',
    type: 'internship',
    createdAt: '2024-08-15',
    notes: 'Software development internship',
  },
  {
    id: 'c-4',
    title: 'Vendor Service Agreement',
    party: 'Tech Solutions Ltd.',
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    status: 'active',
    type: 'vendor',
    createdAt: '2024-02-15',
    notes: 'IT support services',
  },
];

export const useContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('adminDashboardContracts');
    if (saved) {
      setContracts(JSON.parse(saved));
    } else {
      setContracts(initialContracts);
      localStorage.setItem('adminDashboardContracts', JSON.stringify(initialContracts));
    }
  }, []);

  const save = (next: Contract[]) => {
    setContracts(next);
    localStorage.setItem('adminDashboardContracts', JSON.stringify(next));
  };

  const createContract = (data: Omit<Contract, 'id' | 'createdAt'>) => {
    const newContract: Contract = {
      ...data,
      id: Math.random().toString(36).slice(2, 10),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const next = [...contracts, newContract];
    save(next);
    return newContract;
  };

  const updateContract = (id: string, data: Partial<Contract>) => {
    const next = contracts.map(c => (c.id === id ? { ...c, ...data } : c));
    save(next);
    return next.find(c => c.id === id);
  };

  const deleteContract = (id: string) => {
    const next = contracts.filter(c => c.id !== id);
    save(next);
  };

  const getContractById = (id: string) => contracts.find(c => c.id === id);

  return { contracts, createContract, updateContract, deleteContract, getContractById };
};


