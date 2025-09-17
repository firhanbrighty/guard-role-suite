import { useEffect, useState } from 'react';

export interface AttendanceRecord {
  id: string;
  employeeName: string;
  employeeEmail: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:mm
  checkOut: string; // HH:mm
  status: 'present' | 'absent' | 'late' | 'on_leave' | 'sick';
  createdAt: string;
  notes?: string;
}

const initialAttendance: AttendanceRecord[] = [
  {
    id: 'a-1',
    employeeName: 'Admin User',
    employeeEmail: 'admin@example.com',
    date: '2025-09-05',
    checkIn: '09:05',
    checkOut: '17:10',
    status: 'late',
    createdAt: '2025-09-05',
    notes: 'Traffic delay',
  },
];

export const useAttendance = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('adminDashboardAttendance');
    if (saved) {
      setAttendance(JSON.parse(saved));
    } else {
      setAttendance(initialAttendance);
      localStorage.setItem('adminDashboardAttendance', JSON.stringify(initialAttendance));
    }
  }, []);

  const save = (next: AttendanceRecord[]) => {
    setAttendance(next);
    localStorage.setItem('adminDashboardAttendance', JSON.stringify(next));
  };

  const createAttendance = (data: Omit<AttendanceRecord, 'id' | 'createdAt'>) => {
    const newRec: AttendanceRecord = {
      ...data,
      id: Math.random().toString(36).slice(2, 10),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const next = [...attendance, newRec];
    save(next);
    return newRec;
  };

  const updateAttendance = (id: string, data: Partial<AttendanceRecord>) => {
    const next = attendance.map(r => (r.id === id ? { ...r, ...data } : r));
    save(next);
    return next.find(r => r.id === id);
  };

  const deleteAttendance = (id: string) => {
    const next = attendance.filter(r => r.id !== id);
    save(next);
  };

  const getAttendanceById = (id: string) => attendance.find(r => r.id === id);

  return { attendance, createAttendance, updateAttendance, deleteAttendance, getAttendanceById };
};


