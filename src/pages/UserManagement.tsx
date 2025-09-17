import React, { useState } from 'react';
import { useUsers, UserWithoutPassword } from '@/hooks/useUsers';
import { useRoles } from '@/hooks/useRoles';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

const UserManagement = () => {
  const { users, createUser, updateUser, deleteUser } = useUsers();
  const { roles } = useRoles();
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithoutPassword | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    status: 'active' as 'active' | 'inactive',
    division: '',
    organization: '',
    position: '',
    department: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
      status: 'active',
      division: '',
      organization: '',
      position: '',
      department: '',
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('users.create')) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to create users",
        variant: "destructive",
      });
      return;
    }

    try {
      createUser(formData);
      toast({
        title: "User created",
        description: "User has been created successfully",
      });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (user: UserWithoutPassword) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      division: user.division || '',
      organization: user.organization || '',
      position: user.position || '',
      department: user.department || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('users.update') || !editingUser) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to update users",
        variant: "destructive",
      });
      return;
    }

    try {
      updateUser(editingUser.id, formData);
      toast({
        title: "User updated",
        description: "User has been updated successfully",
      });
      setIsEditDialogOpen(false);
      setEditingUser(null);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (userId: string) => {
    if (!hasPermission('users.delete')) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to delete users",
        variant: "destructive",
      });
      return;
    }

    if (confirm('Are you sure you want to delete this user?')) {
      try {
        deleteUser(userId);
        toast({
          title: "User deleted",
          description: "User has been deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user accounts and their roles
          </p>
        </div>
        {hasPermission('users.create') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system with appropriate role and permissions.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="division">Division</Label>
                    <Input
                      id="division"
                      value={formData.division}
                      onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                      placeholder="e.g., IT Division"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g., Head Office"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="e.g., System Administrator"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="e.g., Information Technology"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create User</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <DataTable
        data={users}
        searchKey="name"
        searchPlaceholder="Search users..."
        columns={[
          {
            key: 'name',
            header: 'Name',
            sortable: true,
          },
          {
            key: 'email',
            header: 'Email',
            sortable: true,
          },
          {
            key: 'role',
            header: 'Role',
            sortable: true,
            render: (user) => (
              <Badge variant="secondary" className="capitalize">
                {user.role}
              </Badge>
            ),
          },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (user) => (
              <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                {user.status}
              </Badge>
            ),
          },
          {
            key: 'division',
            header: 'Division',
            sortable: true,
            render: (user) => user.division || '-',
          },
          {
            key: 'organization',
            header: 'Organization',
            sortable: true,
            render: (user) => user.organization || '-',
          },
          {
            key: 'position',
            header: 'Position',
            sortable: true,
            render: (user) => user.position || '-',
          },
          {
            key: 'department',
            header: 'Department',
            sortable: true,
            render: (user) => user.department || '-',
          },
          {
            key: 'createdAt',
            header: 'Created',
            sortable: true,
          },
        ]}
        actions={(user) => (
          <div className="flex justify-end space-x-2">
            {hasPermission('users.update') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(user)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {hasPermission('users.delete') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(user.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and role assignments.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-division">Division</Label>
                <Input
                  id="edit-division"
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  placeholder="e.g., IT Division"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-organization">Organization</Label>
                <Input
                  id="edit-organization"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="e.g., Head Office"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g., System Administrator"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., Information Technology"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;