import React, { useState } from 'react';
import { useEmails } from '@/hooks/useEmails';
import type { EmailAccount } from '@/hooks/useEmails';
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
import { Plus, Edit, Trash2 } from 'lucide-react';

const EmailManagement = () => {
  const { emails, createEmail, updateEmail, deleteEmail } = useEmails();
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<EmailAccount | null>(null);
  const [formData, setFormData] = useState<{
    address: string;
    provider: string;
    status: 'active' | 'inactive';
    description?: string;
  }>({
    address: '',
    provider: '',
    status: 'active',
    description: '',
  });

  const resetForm = () => setFormData({ address: '', provider: '', status: 'active', description: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('emails.create')) {
      toast({ title: 'Permission denied', description: "You don't have permission to create emails", variant: 'destructive' });
      return;
    }
    try {
      createEmail(formData);
      toast({ title: 'Email account created', description: 'Account has been created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to create email account', variant: 'destructive' });
    }
  };

  const handleEdit = (email: EmailAccount) => {
    setEditingEmail(email);
    setFormData({ address: email.address, provider: email.provider, status: email.status, description: email.description });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('emails.update') || !editingEmail) {
      toast({ title: 'Permission denied', description: "You don't have permission to update emails", variant: 'destructive' });
      return;
    }
    try {
      updateEmail(editingEmail.id, formData);
      toast({ title: 'Email account updated', description: 'Account has been updated successfully' });
      setIsEditDialogOpen(false);
      setEditingEmail(null);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to update email account', variant: 'destructive' });
    }
  };

  const handleDelete = (id: string) => {
    if (!hasPermission('emails.delete')) {
      toast({ title: 'Permission denied', description: "You don't have permission to delete emails", variant: 'destructive' });
      return;
    }
    if (confirm('Are you sure you want to delete this account?')) {
      try {
        deleteEmail(id);
        toast({ title: 'Email account deleted', description: 'Account has been deleted successfully' });
      } catch {
        toast({ title: 'Error', description: 'Failed to delete email account', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Email Accounts</h1>
          <p className="text-muted-foreground">Manage outbound and inbound email accounts</p>
        </div>
        {hasPermission('emails.create') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Email Account</DialogTitle>
                <DialogDescription>Add a new email account configuration.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="address">Email Address</Label>
                    <Input id="address" type="email" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Input id="provider" value={formData.provider} onChange={(e) => setFormData({ ...formData, provider: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Account</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <DataTable
        data={emails}
        searchKey="address"
        searchPlaceholder="Search email accounts..."
        columns={[
          {
            key: 'address',
            header: 'Address',
            sortable: true,
          },
          {
            key: 'provider',
            header: 'Provider',
            sortable: true,
          },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (t) => <span className="capitalize">{t.status}</span>,
          },
          {
            key: 'createdAt',
            header: 'Created',
            sortable: true,
          },
        ]}
        actions={(t) => (
          <div className="flex justify-end space-x-2">
            {hasPermission('emails.update') && (
              <Button variant="outline" size="sm" onClick={() => handleEdit(t)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {hasPermission('emails.delete') && (
              <Button variant="outline" size="sm" onClick={() => handleDelete(t.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Email Account</DialogTitle>
            <DialogDescription>Update email account details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Email Address</Label>
                <Input id="edit-address" type="email" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-provider">Provider</Label>
                <Input id="edit-provider" value={formData.provider} onChange={(e) => setFormData({ ...formData, provider: e.target.value })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Input id="edit-status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Update Account</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailManagement;


