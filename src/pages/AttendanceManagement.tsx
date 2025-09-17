import React, { useState } from 'react';
import { useAttendance, AttendanceRecord } from '@/hooks/useAttendance';
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
import { Plus, Edit, Trash2, Users, CheckCircle, Calendar, Heart } from 'lucide-react';

const AttendanceManagement = () => {
  const { attendance, createAttendance, updateAttendance, deleteAttendance } = useAttendance();
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AttendanceRecord | null>(null);
  const [formData, setFormData] = useState<{
    employeeName: string;
    employeeEmail: string;
    date: string;
    checkIn: string;
    checkOut: string;
    status: 'present' | 'absent' | 'late' | 'on_leave' | 'sick';
    notes?: string;
  }>({
    employeeName: '',
    employeeEmail: '',
    date: '',
    checkIn: '',
    checkOut: '',
    status: 'present',
    notes: '',
  });

  const resetForm = () => setFormData({ employeeName: '', employeeEmail: '', date: '', checkIn: '', checkOut: '', status: 'present', notes: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('attendance.create')) {
      toast({ title: 'Permission denied', description: "You don't have permission to create attendance records", variant: 'destructive' });
      return;
    }
    try {
      createAttendance(formData);
      toast({ title: 'Attendance record created', description: 'Record has been created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to create attendance record', variant: 'destructive' });
    }
  };

  const handleEdit = (rec: AttendanceRecord) => {
    setEditing(rec);
    setFormData({ employeeName: rec.employeeName, employeeEmail: rec.employeeEmail, date: rec.date, checkIn: rec.checkIn, checkOut: rec.checkOut, status: rec.status, notes: rec.notes });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('attendance.update') || !editing) {
      toast({ title: 'Permission denied', description: "You don't have permission to update attendance records", variant: 'destructive' });
      return;
    }
    try {
      updateAttendance(editing.id, formData);
      toast({ title: 'Attendance record updated', description: 'Record has been updated successfully' });
      setIsEditDialogOpen(false);
      setEditing(null);
      resetForm();
    } catch {
      toast({ title: 'Error', description: 'Failed to update attendance record', variant: 'destructive' });
    }
  };

  const handleDelete = (id: string) => {
    if (!hasPermission('attendance.delete')) {
      toast({ title: 'Permission denied', description: "You don't have permission to delete attendance records", variant: 'destructive' });
      return;
    }
    if (confirm('Are you sure you want to delete this attendance record?')) {
      try {
        deleteAttendance(id);
        toast({ title: 'Attendance record deleted', description: 'Record has been deleted successfully' });
      } catch {
        toast({ title: 'Error', description: 'Failed to delete attendance record', variant: 'destructive' });
      }
    }
  };

  // Calculate statistics
  const stats = React.useMemo(() => {
    const uniqueEmployees = new Set(attendance.map(record => record.employeeName)).size;
    const presentCount = attendance.filter(record => record.status === 'present').length;
    const onLeaveCount = attendance.filter(record => record.status === 'on_leave').length;
    const sickCount = attendance.filter(record => record.status === 'sick').length;
    
    return {
      totalEmployees: uniqueEmployees,
      presentCount,
      onLeaveCount,
      sickCount,
    };
  }, [attendance]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-muted-foreground">Track and manage attendance</p>
        </div>
        {hasPermission('attendance.create') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Attendance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Attendance</DialogTitle>
                <DialogDescription>Add a new attendance record.</DialogDescription>
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
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="checkIn">Check In</Label>
                      <Input id="checkIn" type="time" value={formData.checkIn} onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="checkOut">Check Out</Label>
                      <Input id="checkOut" type="time" value={formData.checkOut} onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })} required />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(v: 'present' | 'absent' | 'late' | 'on_leave' | 'sick') => setFormData({ ...formData, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="on_leave">On Leave</SelectItem>
                        <SelectItem value="sick">Sick</SelectItem>
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
                  <Button type="submit">Create Attendance</Button>
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
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Unique employees tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presentCount}</div>
            <p className="text-xs text-muted-foreground">
              Currently present
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onLeaveCount}</div>
            <p className="text-xs text-muted-foreground">
              On approved leave
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sick Leave</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sickCount}</div>
            <p className="text-xs text-muted-foreground">
              On sick leave
            </p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={attendance}
        searchKey="employeeName"
        searchPlaceholder="Search attendance records..."
        columns={[
          {
            key: 'employeeName',
            header: 'Employee',
            sortable: true
          },
          {
            key: 'date',
            header: 'Date',
            sortable: true
          },
          {
            key: 'checkIn',
            header: 'Check In',
            sortable: true
          },
          {
            key: 'checkOut',
            header: 'Check Out',
            sortable: true
          },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (item) => (r) => <span className="capitalize">{r.status.replace('_', ' ')}</span>,
          },
          {
            key: 'createdAt',
            header: 'Created',
            sortable: true
          }
        ]}
        actions={(item) => (
          <div className="flex justify-end space-x-2">
            {hasPermission('attendance.update') && (
              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {hasPermission('attendance.delete') && (
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
            <DialogTitle>Edit Attendance</DialogTitle>
            <DialogDescription>Update attendance details.</DialogDescription>
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
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input id="edit-date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-checkIn">Check In</Label>
                  <Input id="edit-checkIn" type="time" value={formData.checkIn} onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-checkOut">Check Out</Label>
                  <Input id="edit-checkOut" type="time" value={formData.checkOut} onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })} required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(v: 'present' | 'absent' | 'late' | 'on_leave' | 'sick') => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                    <SelectItem value="sick">Sick</SelectItem>
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
              <Button type="submit">Update Attendance</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendanceManagement;


