import React, { useState } from 'react';
import { useRoles, Role, availablePermissions } from '@/hooks/useRoles';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Shield } from 'lucide-react';

const RoleManagement = () => {
  const { roles, createRole, updateRole, deleteRole } = useRoles();
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: [],
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('roles.create')) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to create roles",
        variant: "destructive",
      });
      return;
    }

    try {
      createRole(formData);
      toast({
        title: "Role created",
        description: "Role has been created successfully",
      });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('roles.update') || !editingRole) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to update roles",
        variant: "destructive",
      });
      return;
    }

    try {
      updateRole(editingRole.id, formData);
      toast({
        title: "Role updated",
        description: "Role has been updated successfully",
      });
      setIsEditDialogOpen(false);
      setEditingRole(null);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (roleId: string) => {
    if (!hasPermission('roles.delete')) {
      toast({
        title: "Permission denied",
        description: "You don't have permission to delete roles",
        variant: "destructive",
      });
      return;
    }

    if (confirm('Are you sure you want to delete this role?')) {
      try {
        deleteRole(roleId);
        toast({
          title: "Role deleted",
          description: "Role has been deleted successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete role",
          variant: "destructive",
        });
      }
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission],
      });
    } else {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p !== permission),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Manage roles and their permissions
          </p>
        </div>
        {hasPermission('roles.create') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Create a new role with specific permissions.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Role Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {availablePermissions.map((permission) => (
                        <div key={permission} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission}
                            checked={formData.permissions.includes(permission)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission, checked as boolean)
                            }
                          />
                          <Label htmlFor={permission} className="text-sm">
                            {permission}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Role</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  {hasPermission('roles.update') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {hasPermission('roles.delete') && !['admin', 'manager', 'user'].includes(role.id) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(role.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm font-medium">Permissions ({role.permissions.length})</div>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 4).map((permission) => (
                    <Badge key={permission} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                  {role.permissions.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{role.permissions.length - 4} more
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Created: {role.createdAt}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role information and permissions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Role Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${permission}`}
                        checked={formData.permissions.includes(permission)}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission, checked as boolean)
                        }
                      />
                      <Label htmlFor={`edit-${permission}`} className="text-sm">
                        {permission}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Role</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleManagement;