import React, { useState } from 'react';
import { useChangeRequests, ChangeRequest } from '@/hooks/useChangeRequests';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, Clock, Play, Eye, CheckCircle } from 'lucide-react';

const ChangeRequestManagement = () => {
  const { changeRequests, createChangeRequest, updateChangeRequest, deleteChangeRequest } = useChangeRequests();
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ChangeRequest | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    requester: string;
    impact: 'low' | 'medium' | 'high';
    status: 'pending' | 'on_process' | 'review' | 'completed';
    description?: string;
  }>({
    title: '',
    requester: '',
    impact: 'medium',
    status: 'pending',
    description: '',
  });

  const resetForm = () => setFormData({ title: '', requester: '', impact: 'medium', status: 'pending', description: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('changeRequests.create')) {
      toast({ title: 'Permission denied', description: "You don't have permission to create change requests", variant: 'destructive' });
      return;
    }
    try {
      createChangeRequest(formData);
      toast({ title: 'Change request created', description: 'Change request has been created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to create change request', variant: 'destructive' });
    }
  };

  const handleEdit = (rec: ChangeRequest) => {
    setEditing(rec);
    setFormData({ title: rec.title, requester: rec.requester, impact: rec.impact, status: rec.status, description: rec.description });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('changeRequests.update') || !editing) {
      toast({ title: 'Permission denied', description: "You don't have permission to update change requests", variant: 'destructive' });
      return;
    }
    try {
      updateChangeRequest(editing.id, formData);
      toast({ title: 'Change request updated', description: 'Change request has been updated successfully' });
      setIsEditDialogOpen(false);
      setEditing(null);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to update change request', variant: 'destructive' });
    }
  };

  const handleDelete = (id: string) => {
    if (!hasPermission('changeRequests.delete')) {
      toast({ title: 'Permission denied', description: "You don't have permission to delete change requests", variant: 'destructive' });
      return;
    }
    if (confirm('Are you sure you want to delete this change request?')) {
      try {
        deleteChangeRequest(id);
        toast({ title: 'Change request deleted', description: 'Change request has been deleted successfully' });
      } catch {
        toast({ title: 'Error', description: 'Failed to delete change request', variant: 'destructive' });
      }
    }
  };

  // Calculate statistics
  const stats = React.useMemo(() => {
    const pendingCount = changeRequests.filter(cr => cr.status === 'pending').length;
    const onProcessCount = changeRequests.filter(cr => cr.status === 'on_process').length;
    const reviewCount = changeRequests.filter(cr => cr.status === 'review').length;
    const completedCount = changeRequests.filter(cr => cr.status === 'completed').length;
    
    return {
      pendingCount,
      onProcessCount,
      reviewCount,
      completedCount,
    };
  }, [changeRequests]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Change Request Management</h1>
          <p className="text-muted-foreground">Propose and track changes</p>
        </div>
        {hasPermission('changeRequests.create') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Change Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Change Request</DialogTitle>
                <DialogDescription>Add a new change request.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="requester">Requester</Label>
                    <Input id="requester" type="email" value={formData.requester} onChange={(e) => setFormData({ ...formData, requester: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="impact">Impact</Label>
                    <Select value={formData.impact} onValueChange={(v: 'low' | 'medium' | 'high') => setFormData({ ...formData, impact: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(v: 'pending' | 'on_process' | 'review' | 'completed') => setFormData({ ...formData, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="on_process">On Process</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={6} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Change Request</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Change requests waiting for action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Process</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onProcessCount}</div>
            <p className="text-xs text-muted-foreground">
              Change requests being implemented
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviewCount}</div>
            <p className="text-xs text-muted-foreground">
              Change requests under review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedCount}</div>
            <p className="text-xs text-muted-foreground">
              Successfully completed change requests
            </p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={changeRequests}
        searchKey="title"
        searchPlaceholder="Search change requests..."
        columns={[
          {
            key: 'title',
            header: 'Title',
            sortable: true
          },
          {
            key: 'priority',
            header: 'Priority',
            sortable: true,
            render: (item) => (cr) => <span className="capitalize">{cr.priority}</span>,
          },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (item) => (cr) => <span className="capitalize">{cr.status}</span>,
          },
          {
            key: 'requester',
            header: 'Requester',
            sortable: true
          },
          {
            key: 'createdAt',
            header: 'Created',
            sortable: true
          }
        ]}
        actions={(item) => (
          <div className="flex justify-end space-x-2">
            {hasPermission('changeRequests.update') && (
              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {hasPermission('changeRequests.delete') && (
              <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Change Request</DialogTitle>
            <DialogDescription>Update change request details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-requester">Requester</Label>
                <Input id="edit-requester" type="email" value={formData.requester} onChange={(e) => setFormData({ ...formData, requester: e.target.value })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-impact">Impact</Label>
                <Select value={formData.impact} onValueChange={(v: 'low' | 'medium' | 'high') => setFormData({ ...formData, impact: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(v: 'pending' | 'on_process' | 'review' | 'completed') => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="on_process">On Process</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={6} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Update Change Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangeRequestManagement;


