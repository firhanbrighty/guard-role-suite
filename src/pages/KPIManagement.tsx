import React, { useState } from 'react';
import { useKPI, KPI } from '@/hooks/useKPI';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { DataTable, Column } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Target } from 'lucide-react';

const KPIManagement = () => {
  const { kpis, createKPI, updateKPI, deleteKPI } = useKPI();
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editing, setEditing] = useState<KPI | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    target: number;
    current: number;
    unit: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    status: 'on_track' | 'at_risk' | 'off_track';
    owner?: string;
  }>({
    name: '',
    description: '',
    target: 0,
    current: 0,
    unit: '',
    frequency: 'monthly',
    status: 'on_track',
    owner: '',
  });

  const resetForm = () => setFormData({ name: '', description: '', target: 0, current: 0, unit: '', frequency: 'monthly', status: 'on_track', owner: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('kpi.create')) {
      toast({ title: 'Permission denied', description: "You don't have permission to create KPIs", variant: 'destructive' });
      return;
    }
    try {
      createKPI(formData);
      toast({ title: 'KPI created', description: 'KPI has been created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to create KPI', variant: 'destructive' });
    }
  };

  const handleEdit = (rec: KPI) => {
    setEditing(rec);
    setFormData({ name: rec.name, description: rec.description, target: rec.target, current: rec.current, unit: rec.unit, frequency: rec.frequency, status: rec.status, owner: rec.owner });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('kpi.update') || !editing) {
      toast({ title: 'Permission denied', description: "You don't have permission to update KPIs", variant: 'destructive' });
      return;
    }
    try {
      updateKPI(editing.id, formData);
      toast({ title: 'KPI updated', description: 'KPI has been updated successfully' });
      setIsEditDialogOpen(false);
      setEditing(null);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to update KPI', variant: 'destructive' });
    }
  };

  const handleDelete = (id: string) => {
    if (!hasPermission('kpi.delete')) {
      toast({ title: 'Permission denied', description: "You don't have permission to delete KPIs", variant: 'destructive' });
      return;
    }
    if (confirm('Are you sure you want to delete this KPI?')) {
      try {
        deleteKPI(id);
        toast({ title: 'KPI deleted', description: 'KPI has been deleted successfully' });
      } catch {
        toast({ title: 'Error', description: 'Failed to delete KPI', variant: 'destructive' });
      }
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'default';
      case 'at_risk': return 'secondary';
      case 'off_track': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">KPI Management</h1>
          <p className="text-muted-foreground">Track and manage Key Performance Indicators</p>
        </div>
        {hasPermission('kpi.create') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add KPI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New KPI</DialogTitle>
                <DialogDescription>Add a new Key Performance Indicator.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">KPI Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="target">Target Value</Label>
                      <Input id="target" type="number" step="0.01" value={formData.target} onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="current">Current Value</Label>
                      <Input id="current" type="number" step="0.01" value={formData.current} onChange={(e) => setFormData({ ...formData, current: Number(e.target.value) })} required />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input id="unit" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="e.g., %, $, users" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select value={formData.frequency} onValueChange={(v: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly') => setFormData({ ...formData, frequency: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(v: 'on_track' | 'at_risk' | 'off_track') => setFormData({ ...formData, status: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="on_track">On Track</SelectItem>
                          <SelectItem value="at_risk">At Risk</SelectItem>
                          <SelectItem value="off_track">Off Track</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="owner">Owner</Label>
                    <Input id="owner" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} placeholder="Team or person responsible" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Create KPI</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

            <DataTable
        data={kpis}
        searchKey="name"
        searchPlaceholder="Search KPIs..."
        columns={[
          {
            key: 'name',
            header: 'KPI Name',
            sortable: true
          },
          {
            key: 'target',
            header: 'Target',
            sortable: true
          },
          {
            key: 'current',
            header: 'Current',
            sortable: true
          },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (item) => (r) => <span className="capitalize">{r.status.replace('_', ' ')}</span>,
          },
          {
            key: 'frequency',
            header: 'Frequency',
            sortable: true,
            render: (item) => (r) => <span className="capitalize">{r.frequency}</span>,
          },
          {
            key: 'owner',
            header: 'Owner',
            sortable: true
          }
        ]}
        actions={(item) => (
          <div className="flex justify-end space-x-2">
            {hasPermission('kpi.update') && (
              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {hasPermission('kpi.delete') && (
              <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit KPI</DialogTitle>
            <DialogDescription>Update KPI details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">KPI Name</Label>
                <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-target">Target Value</Label>
                  <Input id="edit-target" type="number" step="0.01" value={formData.target} onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-current">Current Value</Label>
                  <Input id="edit-current" type="number" step="0.01" value={formData.current} onChange={(e) => setFormData({ ...formData, current: Number(e.target.value) })} required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-unit">Unit</Label>
                <Input id="edit-unit" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} placeholder="e.g., %, $, users" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-frequency">Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(v: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly') => setFormData({ ...formData, frequency: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={formData.status} onValueChange={(v: 'on_track' | 'at_risk' | 'off_track') => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on_track">On Track</SelectItem>
                      <SelectItem value="at_risk">At Risk</SelectItem>
                      <SelectItem value="off_track">Off Track</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-owner">Owner</Label>
                <Input id="edit-owner" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} placeholder="Team or person responsible" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Update KPI</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KPIManagement;
