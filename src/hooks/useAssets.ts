import { useState, useEffect } from 'react';

export interface Asset {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive' | 'maintenance';
  owner: string;
  createdAt: string;
  description?: string;
}

const initialAssets: Asset[] = [
  {
    id: 'asset-1',
    name: 'Laptop - MacBook Pro',
    category: 'Hardware',
    status: 'active',
    owner: 'Admin User',
    createdAt: '2024-01-10',
    description: 'Primary admin laptop',
  },
  {
    id: 'asset-2',
    name: 'GitHub Organization',
    category: 'Software',
    status: 'active',
    owner: 'Manager User',
    createdAt: '2024-01-12',
    description: 'Version control hosting',
  },
];

export const useAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('adminDashboardAssets');
    if (saved) {
      setAssets(JSON.parse(saved));
    } else {
      setAssets(initialAssets);
      localStorage.setItem('adminDashboardAssets', JSON.stringify(initialAssets));
    }
  }, []);

  const save = (next: Asset[]) => {
    setAssets(next);
    localStorage.setItem('adminDashboardAssets', JSON.stringify(next));
  };

  const createAsset = (data: Omit<Asset, 'id' | 'createdAt'>) => {
    const newAsset: Asset = {
      ...data,
      id: Math.random().toString(36).slice(2, 10),
      createdAt: new Date().toISOString().split('T')[0],
    };
    const next = [...assets, newAsset];
    save(next);
    return newAsset;
  };

  const updateAsset = (id: string, data: Partial<Asset>) => {
    const next = assets.map(a => (a.id === id ? { ...a, ...data } : a));
    save(next);
    return next.find(a => a.id === id);
  };

  const deleteAsset = (id: string) => {
    const next = assets.filter(a => a.id !== id);
    save(next);
  };

  const getAssetById = (id: string) => assets.find(a => a.id === id);

  return { assets, createAsset, updateAsset, deleteAsset, getAssetById };
};


