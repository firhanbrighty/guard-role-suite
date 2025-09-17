import React, { useState } from 'react';
import { usePayrolls, PayrollRecord } from '@/hooks/usePayrolls';
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
import { Plus, Edit, Trash2 } from 'lucide-react';

const PayrollManagement = () => {
  const { payrolls, createPayroll, updatePayroll, deletePayroll } = usePayrolls();
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PayrollRecord | null>(null);
  const [formData, setFormData] = useState<{
    employeeName: string;
    employeeEmail: string;
    period: string;
    grossPay: number;
    deductions: number;
    status: 'pending' | 'paid' | 'failed';
    notes?: string;
  }>({
    employeeName: '',
    employeeEmail: '',
    period: '',
    grossPay: 0,
    deductions: 0,
    status: 'pending',
    notes: '',
  });

  const resetForm = () => setFormData({ employeeName: '', employeeEmail: '', period: '', grossPay: 0, deductions: 0, status: 'pending', notes: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('payroll.create')) {
      toast({ title: 'Permission denied', description: "You don't have permission to create payroll records", variant: 'destructive' });
      return;
    }
    try {
      createPayroll(formData);
      toast({ title: 'Payroll record created', description: 'Record has been created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to create payroll record', variant: 'destructive' });
    }
  };

  const handleEdit = (rec: PayrollRecord) => {
    setEditing(rec);
    setFormData({ employeeName: rec.employeeName, employeeEmail: rec.employeeEmail, period: rec.period, grossPay: rec.grossPay, deductions: rec.deductions, status: rec.status, notes: rec.notes });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('payroll.update') || !editing) {
      toast({ title: 'Permission denied', description: "You don't have permission to update payroll records", variant: 'destructive' });
      return;
    }
    try {
      updatePayroll(editing.id, formData);
      toast({ title: 'Payroll record updated', description: 'Record has been updated successfully' });
      setIsEditDialogOpen(false);
      setEditing(null);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to update payroll record', variant: 'destructive' });
    }
  };

  const handleDelete = (id: string) => {
    if (!hasPermission('payroll.delete')) {
      toast({ title: 'Permission denied', description: "You don't have permission to delete payroll records", variant: 'destructive' });
      return;
    }
    if (confirm('Are you sure you want to delete this payroll record?')) {
      try {
        deletePayroll(id);
        toast({ title: 'Payroll record deleted', description: 'Record has been deleted successfully' });
      } catch {
        toast({ title: 'Error', description: 'Failed to delete payroll record', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Manage payroll records and payments</p>
        </div>
        {hasPermission('payroll.create') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Payroll Record</DialogTitle>
                <DialogDescription>Add a new payroll record.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="employeeName">Employee Name</Label>
                    <Input id="employeeName" value={formData.employeeName} onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="employeeEmail">Employee Email</Label>
                    <Input id="employeeEmail" type="email" value={formData.employeeEmail} onChange={(e) => setFormData({ ...formData, employeeEmail: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="period">Period (YYYY-MM)</Label>
                    <Input id="period" placeholder="2025-09" value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="grossPay">Gross Pay</Label>
                      <Input id="grossPay" type="number" step="0.01" value={formData.grossPay} onChange={(e) => setFormData({ ...formData, grossPay: Number(e.target.value) })} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="deductions">Deductions</Label>
                      <Input id="deductions" type="number" step="0.01" value={formData.deductions} onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })} required />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(v: 'pending' | 'paid' | 'failed') => setFormData({ ...formData, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
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
                  <Button type="submit">Create Record</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

            <DataTable
        data={payrolls}
        searchKey="employeeName"
        searchPlaceholder="Search payroll records..."
        columns={[
          {
            key: 'employeeName',
            header: 'Employee',
            sortable: true
          },
          {
            key: 'amount',
            header: 'Amount',
            sortable: true
          },
          {
            key: 'period',
            header: 'Period',
            sortable: true
          },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (item) => (p) => <span className="capitalize">{p.status}</span>,
          },
          {
            key: 'createdAt',
            header: 'Created',
            sortable: true
          }
        ]}
        actions={(item) => (
          <div className="flex justify-end space-x-2">
            {hasPermission('payroll.update') && (
              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {hasPermission('payroll.delete') && (
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
            <DialogTitle>Edit Payroll Record</DialogTitle>
            <DialogDescription>Update payroll details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-employeeName">Employee Name</Label>
                <Input id="edit-employeeName" value={formData.employeeName} onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-employeeEmail">Employee Email</Label>
                <Input id="edit-employeeEmail" type="email" value={formData.employeeEmail} onChange={(e) => setFormData({ ...formData, employeeEmail: e.target.value })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-period">Period (YYYY-MM)</Label>
                <Input id="edit-period" value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-grossPay">Gross Pay</Label>
                  <Input id="edit-grossPay" type="number" step="0.01" value={formData.grossPay} onChange={(e) => setFormData({ ...formData, grossPay: Number(e.target.value) })} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-deductions">Deductions</Label>
                  <Input id="edit-deductions" type="number" step="0.01" value={formData.deductions} onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })} required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(v: 'pending' | 'paid' | 'failed') => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
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
              <Button type="submit">Update Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayrollManagement;


