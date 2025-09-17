import React, { useState } from 'react';
import { useOKR, OKR } from '@/hooks/useOKR';
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
import { Plus, Edit, Trash2 } from 'lucide-react';

const OKRManagement = () => {
  const { okrs, createOKR, updateOKR, deleteOKR } = useOKR();
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editing, setEditing] = useState<OKR | null>(null);
  const [formData, setFormData] = useState<{
    objective: string;
    keyResults: string[];
    progress: number;
    quarter: string;
    status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
    owner?: string;
  }>({
    objective: '',
    keyResults: [''],
    progress: 0,
    quarter: '',
    status: 'not_started',
    owner: '',
  });

  const resetForm = () => setFormData({ objective: '', keyResults: [''], progress: 0, quarter: '', status: 'not_started', owner: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('okr.create')) {
      toast({ title: 'Permission denied', description: "You don't have permission to create OKRs", variant: 'destructive' });
      return;
    }
    try {
      const filteredKeyResults = formData.keyResults.filter(kr => kr.trim() !== '');
      createOKR({ ...formData, keyResults: filteredKeyResults });
      toast({ title: 'OKR created', description: 'OKR has been created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to create OKR', variant: 'destructive' });
    }
  };

  const handleEdit = (rec: OKR) => {
    setEditing(rec);
    setFormData({ objective: rec.objective, keyResults: rec.keyResults.length > 0 ? rec.keyResults : [''], progress: rec.progress, quarter: rec.quarter, status: rec.status, owner: rec.owner });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('okr.update') || !editing) {
      toast({ title: 'Permission denied', description: "You don't have permission to update OKRs", variant: 'destructive' });
      return;
    }
    try {
      const filteredKeyResults = formData.keyResults.filter(kr => kr.trim() !== '');
      updateOKR(editing.id, { ...formData, keyResults: filteredKeyResults });
      toast({ title: 'OKR updated', description: 'OKR has been updated successfully' });
      setIsEditDialogOpen(false);
      setEditing(null);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to update OKR', variant: 'destructive' });
    }
  };

  const handleDelete = (id: string) => {
    if (!hasPermission('okr.delete')) {
      toast({ title: 'Permission denied', description: "You don't have permission to delete OKRs", variant: 'destructive' });
      return;
    }
    if (confirm('Are you sure you want to delete this OKR?')) {
      try {
        deleteOKR(id);
        toast({ title: 'OKR deleted', description: 'OKR has been deleted successfully' });
      } catch {
        toast({ title: 'Error', description: 'Failed to delete OKR', variant: 'destructive' });
      }
    }
  };

  const addKeyResult = () => {
    setFormData({ ...formData, keyResults: [...formData.keyResults, ''] });
  };

  const updateKeyResult = (index: number, value: string) => {
    const newKeyResults = [...formData.keyResults];
    newKeyResults[index] = value;
    setFormData({ ...formData, keyResults: newKeyResults });
  };

  const removeKeyResult = (index: number) => {
    const newKeyResults = formData.keyResults.filter((_, i) => i !== index);
    setFormData({ ...formData, keyResults: newKeyResults.length > 0 ? newKeyResults : [''] });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'not_started': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">OKR Management</h1>
          <p className="text-muted-foreground">Track and manage Objectives and Key Results</p>
        </div>
        {hasPermission('okr.create') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add OKR
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New OKR</DialogTitle>
                <DialogDescription>Add a new Objective and Key Results.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="objective">Objective</Label>
                    <Textarea id="objective" value={formData.objective} onChange={(e) => setFormData({ ...formData, objective: e.target.value })} rows={2} required />
                  </div>
                  <div className="grid gap-2">
                    <Label>Key Results</Label>
                    {formData.keyResults.map((kr, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={kr}
                          onChange={(e) => updateKeyResult(index, e.target.value)}
                          placeholder={`Key Result ${index + 1}`}
                        />
                        {formData.keyResults.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeKeyResult(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addKeyResult}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Key Result
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="progress">Progress (%)</Label>
                      <Input id="progress" type="number" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="quarter">Quarter</Label>
                      <Input id="quarter" value={formData.quarter} onChange={(e) => setFormData({ ...formData, quarter: e.target.value })} placeholder="Q1 2025" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(v: 'not_started' | 'in_progress' | 'completed' | 'cancelled') => setFormData({ ...formData, status: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not_started">Not Started</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="owner">Owner</Label>
                      <Input id="owner" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} placeholder="Team or person responsible" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Create OKR</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

            <DataTable
        data={okrs}
        searchKey="objective"
        searchPlaceholder="Search OKRs..."
        columns={[
          {
            key: 'objective',
            header: 'Objective',
            sortable: true
          },
          {
            key: 'progress',
            header: 'Progress',
            sortable: true,
            render: (item) => <span>{item.progress}%</span>,
          },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (item) => <span className="capitalize">{item.status.replace('_', ' ')}</span>,
          },
          {
            key: 'quarter',
            header: 'Quarter',
            sortable: true
          },
          {
            key: 'owner',
            header: 'Owner',
            sortable: true
          }
        ]}
        actions={(item) => (
          <div className="flex justify-end space-x-2">
            {hasPermission('okr.update') && (
              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {hasPermission('okr.delete') && (
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
            <DialogTitle>Edit OKR</DialogTitle>
            <DialogDescription>Update OKR details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-objective">Objective</Label>
                <Textarea id="edit-objective" value={formData.objective} onChange={(e) => setFormData({ ...formData, objective: e.target.value })} rows={2} required />
              </div>
              <div className="grid gap-2">
                <Label>Key Results</Label>
                {formData.keyResults.map((kr, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={kr}
                      onChange={(e) => updateKeyResult(index, e.target.value)}
                      placeholder={`Key Result ${index + 1}`}
                    />
                    {formData.keyResults.length > 1 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => removeKeyResult(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addKeyResult}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Key Result
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-progress">Progress (%)</Label>
                  <Input id="edit-progress" type="number" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-quarter">Quarter</Label>
                  <Input id="edit-quarter" value={formData.quarter} onChange={(e) => setFormData({ ...formData, quarter: e.target.value })} placeholder="Q1 2025" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={formData.status} onValueChange={(v: 'not_started' | 'in_progress' | 'completed' | 'cancelled') => setFormData({ ...formData, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_started">Not Started</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-owner">Owner</Label>
                  <Input id="edit-owner" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} placeholder="Team or person responsible" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Update OKR</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OKRManagement;
