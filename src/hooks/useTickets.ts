import { useEffect, useState } from 'react';

export interface Ticket {
  id: string;
  title: string;
  requester: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'on_process' | 'review' | 'completed';
  createdAt: string;
  description?: string;
}

const initialTickets: Ticket[] = [
  {
    id: 't-1',
    title: 'Cannot login',
    requester: 'user@example.com',
    priority: 'high',
    status: 'pending',
    createdAt: '2025-09-01',
    description: 'User cannot login with correct password',
  },
  {
    id: 't-2',
    title: 'Database optimization',
    requester: 'admin@example.com',
    priority: 'medium',
    status: 'on_process',
    createdAt: '2025-09-02',
    description: 'Optimize database queries for better performance',
  },
  {
    id: 't-3',
    title: 'UI Design Review',
    requester: 'designer@example.com',
    priority: 'low',
    status: 'review',
    createdAt: '2025-09-03',
    description: 'Review new UI design mockups',
  },
  {
    id: 't-4',
    title: 'Bug Fix - Payment Gateway',
    requester: 'dev@example.com',
    priority: 'high',
    status: 'completed',
    createdAt: '2025-09-04',
    description: 'Fixed payment gateway integration issue',
  },
];

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('adminDashboardTickets');
    if (saved) {
      setTickets(JSON.parse(saved));
    } else {
      setTickets(initialTickets);
      localStorage.setItem('adminDashboardTickets', JSON.stringify(initialTickets));
    }
  }, []);

  const save = (next: Ticket[]) => {
    setTickets(next);
    localStorage.setItem('adminDashboardTickets', JSON.stringify(next));
  };

  const createTicket = (data: Omit<Ticket, 'id' | 'createdAt'>) => {
    const newRec: Ticket = {
      ...data,
      id: Math.random().toString(36).slice(2, 10),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const next = [...tickets, newRec];
    save(next);
    return newRec;
  };

  const updateTicket = (id: string, data: Partial<Ticket>) => {
    const next = tickets.map(r => (r.id === id ? { ...r, ...data } : r));
    save(next);
    return next.find(r => r.id === id);
  };

  const deleteTicket = (id: string) => {
    const next = tickets.filter(r => r.id !== id);
    save(next);
  };

  const getTicketById = (id: string) => tickets.find(r => r.id === id);

  return { tickets, createTicket, updateTicket, deleteTicket, getTicketById };
};


