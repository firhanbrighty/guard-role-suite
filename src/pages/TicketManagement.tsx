import React, { useState } from 'react';
import { useTickets, Ticket } from '@/hooks/useTickets';
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

const TicketManagement = () => {
  const { tickets, createTicket, updateTicket, deleteTicket } = useTickets();
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Ticket | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    requester: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'on_process' | 'review' | 'completed';
    description?: string;
  }>({
    title: '',
    requester: '',
    priority: 'medium',
    status: 'pending',
    description: '',
  });

  const resetForm = () => setFormData({ title: '', requester: '', priority: 'medium', status: 'pending', description: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('tickets.create')) {
      toast({ title: 'Permission denied', description: "You don't have permission to create tickets", variant: 'destructive' });
      return;
    }
    try {
      createTicket(formData);
      toast({ title: 'Ticket created', description: 'Ticket has been created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to create ticket', variant: 'destructive' });
    }
  };

  const handleEdit = (rec: Ticket) => {
    setEditing(rec);
    setFormData({ title: rec.title, requester: rec.requester, priority: rec.priority, status: rec.status, description: rec.description });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('tickets.update') || !editing) {
      toast({ title: 'Permission denied', description: "You don't have permission to update tickets", variant: 'destructive' });
      return;
    }
    try {
      updateTicket(editing.id, formData);
      toast({ title: 'Ticket updated', description: 'Ticket has been updated successfully' });
      setIsEditDialogOpen(false);
      setEditing(null);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to update ticket', variant: 'destructive' });
    }
  };

  const handleDelete = (id: string) => {
    if (!hasPermission('tickets.delete')) {
      toast({ title: 'Permission denied', description: "You don't have permission to delete tickets", variant: 'destructive' });
      return;
    }
    if (confirm('Are you sure you want to delete this ticket?')) {
      try {
        deleteTicket(id);
        toast({ title: 'Ticket deleted', description: 'Ticket has been deleted successfully' });
      } catch {
        toast({ title: 'Error', description: 'Failed to delete ticket', variant: 'destructive' });
      }
    }
  };

  // Calculate statistics
  const stats = React.useMemo(() => {
    const pendingCount = tickets.filter(ticket => ticket.status === 'pending').length;
    const onProcessCount = tickets.filter(ticket => ticket.status === 'on_process').length;
    const reviewCount = tickets.filter(ticket => ticket.status === 'review').length;
    const completedCount = tickets.filter(ticket => ticket.status === 'completed').length;
    
    return {
      pendingCount,
      onProcessCount,
      reviewCount,
      completedCount,
    };
  }, [tickets]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ticket Management</h1>
          <p className="text-muted-foreground">Track and manage support tickets</p>
        </div>
        {hasPermission('tickets.create') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Ticket</DialogTitle>
                <DialogDescription>Add a new support ticket.</DialogDescription>
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
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={formData.priority} onValueChange={(v: 'low' | 'medium' | 'high') => setFormData({ ...formData, priority: v })}>
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
                  <Button type="submit">Create Ticket</Button>
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
              Tickets waiting for action
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
              Tickets being worked on
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
              Tickets under review
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
              Successfully completed tickets
            </p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={tickets}
        searchKey="title"
        searchPlaceholder="Search tickets..."
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
            render: (item) => (t) => <span className="capitalize">{t.priority}</span>,
          },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (item) => (t) => <span className="capitalize">{t.status}</span>,
          },
          {
            key: 'assignee',
            header: 'Assignee',
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
            {hasPermission('tickets.update') && (
              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {hasPermission('tickets.delete') && (
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
            <DialogTitle>Edit Ticket</DialogTitle>
            <DialogDescription>Update ticket details.</DialogDescription>
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
                <Label htmlFor="edit-priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(v: 'low' | 'medium' | 'high') => setFormData({ ...formData, priority: v })}>
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
              <Button type="submit">Update Ticket</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TicketManagement;


