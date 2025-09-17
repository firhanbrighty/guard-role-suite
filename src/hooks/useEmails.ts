import { useState, useEffect } from 'react';

export interface EmailAccount {
  id: string;
  address: string;
  provider: string;
  status: 'active' | 'inactive';
  description?: string;
  createdAt: string;
}

const initialEmailAccounts: EmailAccount[] = [
  {
    id: 'ea-1',
    address: 'noreply@example.com',
    provider: 'Gmail',
    status: 'active',
    description: 'Default outbound address',
    createdAt: '2024-01-05',
  },
  {
    id: 'ea-2',
    address: 'support@example.com',
    provider: 'AWS SES',
    status: 'inactive',
    description: 'Support inbox (paused)',
    createdAt: '2024-02-10',
  },
];

export const useEmails = () => {
  const [emails, setEmails] = useState<EmailAccount[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('adminDashboardEmailAccounts');
    if (saved) {
      setEmails(JSON.parse(saved));
    } else {
      setEmails(initialEmailAccounts);
      localStorage.setItem('adminDashboardEmailAccounts', JSON.stringify(initialEmailAccounts));
    }
  }, []);

  const save = (next: EmailAccount[]) => {
    setEmails(next);
    localStorage.setItem('adminDashboardEmailAccounts', JSON.stringify(next));
  };

  const createEmail = (data: Omit<EmailAccount, 'id' | 'createdAt'>) => {
    const newEmail: EmailAccount = {
      ...data,
      id: Math.random().toString(36).slice(2, 10),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const next = [...emails, newEmail];
    save(next);
    return newEmail;
  };

  const updateEmail = (id: string, data: Partial<EmailAccount>) => {
    const next = emails.map(e => (e.id === id ? { ...e, ...data } : e));
    save(next);
    return next.find(e => e.id === id);
  };

  const deleteEmail = (id: string) => {
    const next = emails.filter(e => e.id !== id);
    save(next);
  };

  const getEmailById = (id: string) => emails.find(e => e.id === id);

  return { emails, createEmail, updateEmail, deleteEmail, getEmailById };
};


