import React, { useState } from 'react';
import { useAssets, Asset } from '@/hooks/useAssets';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AssetManagement = () => {
  const { assets, createAsset, updateAsset, deleteAsset } = useAssets();
  const { hasPermission } = useAuth();
  const { toast } = useToast();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    status: 'active' | 'inactive' | 'maintenance';
    owner: string;
    description?: string;
  }>({
    name: '',
    category: '',
    status: 'active',
    owner: '',
    description: '',
  });

  const resetForm = () => {
    setFormData({ name: '', category: '', status: 'active', owner: '', description: '' });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('assets.create')) {
      toast({ title: 'Permission denied', description: "You don't have permission to create assets", variant: 'destructive' });
      return;
    }
    try {
      createAsset(formData);
      toast({ title: 'Asset created', description: 'Asset has been created successfully' });
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create asset', variant: 'destructive' });
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({ name: asset.name, category: asset.category, status: asset.status, owner: asset.owner, description: asset.description });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('assets.update') || !editingAsset) {
      toast({ title: 'Permission denied', description: "You don't have permission to update assets", variant: 'destructive' });
      return;
    }
    try {
      updateAsset(editingAsset.id, formData);
      toast({ title: 'Asset updated', description: 'Asset has been updated successfully' });
      setIsEditDialogOpen(false);
      setEditingAsset(null);
      resetForm();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update asset', variant: 'destructive' });
    }
  };

  const handleDelete = (id: string) => {
    if (!hasPermission('assets.delete')) {
      toast({ title: 'Permission denied', description: "You don't have permission to delete assets", variant: 'destructive' });
      return;
    }
    if (confirm('Are you sure you want to delete this asset?')) {
      try {
        deleteAsset(id);
        toast({ title: 'Asset deleted', description: 'Asset has been deleted successfully' });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete asset', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Asset Management</h1>
          <p className="text-muted-foreground">Manage assets across categories and owners</p>
        </div>
        {hasPermission('assets.create') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Asset</DialogTitle>
                <DialogDescription>Add a new asset with details.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'maintenance') => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="owner">Owner</Label>
                    <Input id="owner" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Asset</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <DataTable
        data={assets}
        searchKey="name"
        searchPlaceholder="Search assets..."
        columns={[
          {
            key: 'name',
            header: 'Name',
            sortable: true,
          },
          {
            key: 'category',
            header: 'Category',
            sortable: true,
          },
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (asset) => (
              <Badge variant={asset.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                {asset.status}
              </Badge>
            ),
          },
          {
            key: 'owner',
            header: 'Owner',
            sortable: true,
          },
          {
            key: 'createdAt',
            header: 'Created',
            sortable: true,
          },
        ]}
        actions={(asset) => (
          <div className="flex justify-end space-x-2">
            {hasPermission('assets.update') && (
              <Button variant="outline" size="sm" onClick={() => handleEdit(asset)}>
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {hasPermission('assets.delete') && (
              <Button variant="outline" size="sm" onClick={() => handleDelete(asset.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>Update asset details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input id="edit-category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'maintenance') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-owner">Owner</Label>
                <Input id="edit-owner" value={formData.owner} onChange={(e) => setFormData({ ...formData, owner: e.target.value })} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Update Asset</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssetManagement;


