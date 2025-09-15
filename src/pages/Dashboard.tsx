import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, BarChart3, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Users",
      value: "24",
      description: "Active users in the system",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Roles",
      value: "5",
      description: "Different user roles",
      icon: Shield,
      color: "text-green-600",
    },
    {
      title: "Permissions",
      value: "11",
      description: "System permissions",
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      title: "Settings",
      value: "8",
      description: "Configuration options",
      icon: Settings,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}
          </p>
        </div>
        <Badge variant="secondary" className="capitalize">
          {user?.role}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="rounded-lg border p-3 text-sm">
              <div className="font-medium">User Management</div>
              <div className="text-muted-foreground">Create, edit, and manage user accounts</div>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <div className="font-medium">Role Management</div>
              <div className="text-muted-foreground">Configure roles and permissions</div>
            </div>
            <div className="rounded-lg border p-3 text-sm">
              <div className="font-medium">System Settings</div>
              <div className="text-muted-foreground">Configure system-wide settings</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Authentication</span>
              <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">User Sessions</span>
              <Badge variant="secondary">3 Active</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Security Level</span>
              <Badge variant="default" className="bg-blue-100 text-blue-800">High</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Last Backup</span>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;