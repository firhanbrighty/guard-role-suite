import React, { useState } from 'react';
import { useContracts, Contract } from '@/hooks/useContracts';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Edit, Trash2, Users, Clock, Briefcase, GraduationCap } from 'lucide-react';

const ContractManagement = () => {
  const { contracts, createContract, updateContract, deleteContract } = useContracts();
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    party: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'expired' | 'draft';
    type: 'employee' | 'freelance' | 'internship' | 'vendor';
    notes?: string;
  }>({
    title: '',
    party: '',
    startDate: '',
    endDate: '',
    status: 'draft',
    type: 'employee',
    notes: '',
  });

  const resetForm = () => setFormData({ title: '', party: '', startDate: '', endDate: '', status: 'draft', type: 'employee', notes: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('contracts.create')) {
      toast({ title: 'Permission denied', description: "You don't have permission to create contracts", variant: 'destructive' });
      return;
    }
    try {
      createContract(formData);
      toast({ title: 'Contract created', description: 'Contract has been created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to create contract', variant: 'destructive' });
    }
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setFormData({ title: contract.title, party: contract.party, startDate: contract.startDate, endDate: contract.endDate, status: contract.status, type: contract.type, notes: contract.notes });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('contracts.update') || !editingContract) {
      toast({ title: 'Permission denied', description: "You don't have permission to update contracts", variant: 'destructive' });
      return;
    }
    try {
      updateContract(editingContract.id, formData);
      toast({ title: 'Contract updated', description: 'Contract has been updated successfully' });
      setIsEditDialogOpen(false);
      setEditingContract(null);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to update contract', variant: 'destructive' });
    }
  };

  const handleDelete = (id: string) => {
    if (!hasPermission('contracts.delete')) {
      toast({ title: 'Permission denied', description: "You don't have permission to delete contracts", variant: 'destructive' });
      return;
    }
    if (confirm('Are you sure you want to delete this contract?')) {
      try {
        deleteContract(id);
        toast({ title: 'Contract deleted', description: 'Contract has been deleted successfully' });
      } catch {
        toast({ title: 'Error', description: 'Failed to delete contract', variant: 'destructive' });
      }
    }
  };

  // Calculate statistics
  const stats = React.useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const employeeCount = contracts.filter(contract => contract.type === 'employee' && contract.status === 'active').length;
    const expiringSoonCount = contracts.filter(contract => {
      const endDate = new Date(contract.endDate);
      return contract.status === 'active' && endDate <= thirtyDaysFromNow && endDate >= now;
    }).length;
    const freelanceCount = contracts.filter(contract => contract.type === 'freelance' && contract.status === 'active').length;
    const internshipCount = contracts.filter(contract => contract.type === 'internship' && contract.status === 'active').length;
    
    return {
      employeeCount,
      expiringSoonCount,
      freelanceCount,
      internshipCount,
    };
  }, [contracts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contract Management</h1>
          <p className="text-muted-foreground">Manage legal contracts lifecycle</p>
        </div>
        {hasPermission('contracts.create') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Contract
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Contract</DialogTitle>
                <DialogDescription>Add a new contract.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="party">Party</Label>
                    <Input id="party" value={formData.party} onChange={(e) => setFormData({ ...formData, party: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="start">Start Date</Label>
                      <Input id="start" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="end">End Date</Label>
                      <Input id="end" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(v: 'active' | 'expired' | 'draft') => setFormData({ ...formData, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(v: 'employee' | 'freelance' | 'internship' | 'vendor') => setFormData({ ...formData, type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="vendor">Vendor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Contract</Button>
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
            <CardTitle className="text-sm font-medium">Employee Contracts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employeeCount}</div>
            <p className="text-xs text-muted-foreground">
              Active employee contracts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringSoonCount}</div>
            <p className="text-xs text-muted-foreground">
              Contracts expiring in 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Freelance</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.freelanceCount}</div>
            <p className="text-xs text-muted-foreground">
              Active freelance contracts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Internships</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.internshipCount}</div>
            <p className="text-xs text-muted-foreground">
              Active internship contracts
            </p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={contracts}
        searchKey="title"
        searchPlaceholder="Search contracts..."
        columns={[
          {
            key: 'title',
            header: 'Title',
            sortable: true,
          },
          {
            key: 'party',
            header: 'Party',
            sortable: true,
          },
          {
            key: 'dates',
            header: 'Dates',
            render: (c) => `${c.startDate} - ${c.endDate}`,
          },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (c) => (
              <Badge variant={c.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                {c.status}
              </Badge>
            ),
          },
          {
            key: 'type',
            header: 'Type',
            sortable: true,
            render: (c) => (
              <Badge variant="outline" className="capitalize">
                {c.type}
              </Badge>
            ),
          },
          {
            key: 'createdAt',
            header: 'Created',
            sortable: true,
          },
        ]}
        actions={(c) => (
          <div className="flex justify-end space-x-2">
            {hasPermission('contracts.update') && (
              <Button variant="outline" size="sm" onClick={() => handleEdit(c)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {hasPermission('contracts.delete') && (
              <Button variant="outline" size="sm" onClick={() => handleDelete(c.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Contract</DialogTitle>
            <DialogDescription>Update contract details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input id="edit-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-party">Party</Label>
                <Input id="edit-party" value={formData.party} onChange={(e) => setFormData({ ...formData, party: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-start">Start Date</Label>
                  <Input id="edit-start" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-end">End Date</Label>
                  <Input id="edit-end" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(v: 'active' | 'expired' | 'draft') => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select value={formData.type} onValueChange={(v: 'employee' | 'freelance' | 'internship' | 'vendor') => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea id="edit-notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Update Contract</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractManagement;


