import { useEffect, useState } from 'react';

export interface PayrollRecord {
  id: string;
  employeeName: string;
  employeeEmail: string;
  period: string; // e.g., 2025-09
  grossPay: number;
  deductions: number;
  netPay: number;
  status: 'pending' | 'paid' | 'failed';
  createdAt: string;
  notes?: string;
}

const initialPayrolls: PayrollRecord[] = [
  {
    id: 'p-1',
    employeeName: 'Admin User',
    employeeEmail: 'admin@example.com',
    period: '2025-08',
    grossPay: 5000,
    deductions: 500,
    netPay: 4500,
    status: 'paid',
    createdAt: '2025-08-31',
    notes: 'Monthly salary',
  },
];

export const usePayrolls = () => {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('adminDashboardPayrolls');
    if (saved) {
      setPayrolls(JSON.parse(saved));
    } else {
      setPayrolls(initialPayrolls);
      localStorage.setItem('adminDashboardPayrolls', JSON.stringify(initialPayrolls));
    }
  }, []);

  const save = (next: PayrollRecord[]) => {
    setPayrolls(next);
    localStorage.setItem('adminDashboardPayrolls', JSON.stringify(next));
  };

  const createPayroll = (data: Omit<PayrollRecord, 'id' | 'createdAt' | 'netPay'>) => {
    const netPay = Number((data.grossPay - data.deductions).toFixed(2));
    const newRec: PayrollRecord = {
      ...data,
      netPay,
      id: Math.random().toString(36).slice(2, 10),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const next = [...payrolls, newRec];
    save(next);
    return newRec;
  };

  const updatePayroll = (id: string, data: Partial<PayrollRecord>) => {
    const next = payrolls.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, ...data } as PayrollRecord;
      if (data.grossPay !== undefined || data.deductions !== undefined) {
        updated.netPay = Number(((data.grossPay ?? updated.grossPay) - (data.deductions ?? updated.deductions)).toFixed(2));
      }
      return updated;
    });
    save(next);
    return next.find(r => r.id === id);
  };

  const deletePayroll = (id: string) => {
    const next = payrolls.filter(r => r.id !== id);
    save(next);
  };

  const getPayrollById = (id: string) => payrolls.find(r => r.id === id);

  return { payrolls, createPayroll, updatePayroll, deletePayroll, getPayrollById };
};


