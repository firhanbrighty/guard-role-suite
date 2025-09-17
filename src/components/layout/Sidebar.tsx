import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Home, Users, Shield, Skull, Boxes, FileText, FilePenLine, Ticket, Mail, ChevronDown, Target, Clock, Rocket } from 'lucide-react';

const navigationTop = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    permission: 'dashboard.access',
  },
  {
    name: 'Asset Management',
    href: '/dashboard/assets',
    icon: Boxes,
    permission: 'assets.read',
  },
  {
    name: 'Payroll',
    href: '/dashboard/payroll',
    icon: FileText,
    permission: 'payroll.read',
  },
  // {
  //   name: 'Settings',
  //   href: '/dashboard/settings',
  //   icon: Settings,
  //   permission: 'settings.manage',
  // },
];

export const AppSidebar = () => {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const userMgmtPaths = useMemo(() => ['/dashboard/users','/dashboard/roles','/dashboard/contracts','/dashboard/emails'], []);
  const ticketMgmtPaths = useMemo(() => ['/dashboard/tickets','/dashboard/change-requests'], []);
  const performanceMgmtPaths = useMemo(() => ['/dashboard/kpi','/dashboard/okr'], []);
  const [userMgmtOpen, setUserMgmtOpen] = useState(userMgmtPaths.includes(location.pathname));
  const [ticketMgmtOpen, setTicketMgmtOpen] = useState(ticketMgmtPaths.includes(location.pathname));
  const [performanceMgmtOpen, setPerformanceMgmtOpen] = useState(performanceMgmtPaths.includes(location.pathname));

  useEffect(() => {
    // Auto-expand when navigating into one of the submenu routes
    if (userMgmtPaths.includes(location.pathname)) {
      setUserMgmtOpen(true);
    }
    if (ticketMgmtPaths.includes(location.pathname)) {
      setTicketMgmtOpen(true);
    }
    if (performanceMgmtPaths.includes(location.pathname)) {
      setPerformanceMgmtOpen(true);
    }
  }, [location.pathname, userMgmtPaths, ticketMgmtPaths, performanceMgmtPaths]);

  const filteredTop = navigationTop.filter(item => hasPermission(item.permission));
  const canSeeUserMgmt = (
    hasPermission('users.read') ||
    hasPermission('roles.read') ||
    hasPermission('contracts.read') ||
    hasPermission('emails.read')
  );
  const attendanceNav = hasPermission('attendance.read') ? [
    {
      name: 'Attendance',
      href: '/dashboard/attendance',
      icon: Clock,
      permission: 'attendance.read',
    }
  ] : [];
  const canSeeTicketMgmt = (
    hasPermission('tickets.read') ||
    hasPermission('changeRequests.read')
  );
  const canSeePerformanceMgmt = (
    hasPermission('kpi.read') ||
    hasPermission('okr.read')
  );

  return (
    <Sidebar className="bg-[#32aaff] text-white">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-white">
            <Skull className="h-12 w-12" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">HRIS</h2>
          </div>
        </div>
      </SidebarHeader>

      {/* <SidebarHeader className="p-2">
        <div className="flex items-center justify-center">
          <img 
            src="/assets/logohris.png" 
            alt="HRIS Logo" 
            className="h-[8em] w-[8em] object-contain"
          />
        </div>
      </SidebarHeader> */}

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/50">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[...filteredTop, ...attendanceNav].map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} className="text-white hover:bg-white/10 hover:text-white data-[active=true]:bg-white/20 data-[active=true]:text-white">
                      <Link to={item.href} className="flex items-center space-x-1 text-white">
                        <item.icon className="h-4 w-4 text-white" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {canSeeUserMgmt && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={userMgmtPaths.includes(location.pathname)}
                    onClick={() => setUserMgmtOpen((v) => !v)}
                    className="text-white hover:text-white hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white data-[active=true]:text-white"
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Users className="h-4 w-4 text-white" />
                        <span>User Management</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${userMgmtOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </SidebarMenuButton>
                  {userMgmtOpen && (
                  <SidebarMenuSub>
                    {hasPermission('roles.read') && (
                      <SidebarMenuSubItem>
                         <SidebarMenuSubButton asChild isActive={location.pathname === '/dashboard/roles'} className="text-white hover:text-white hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white">
                          <Link to="/dashboard/roles" className="flex items-center space-x-2 text-white">
                            <div className="flex h-6 w-6 items-center justify-center rounded text-white">
                              <Shield className="h-4 w-4" />
                            </div>
                            <span>RBAC</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                    {hasPermission('users.read') && (
                      <SidebarMenuSubItem>
                         <SidebarMenuSubButton asChild isActive={location.pathname === '/dashboard/users'} className="text-white hover:text-white hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white">
                          <Link to="/dashboard/users" className="flex items-center space-x-2 text-white">
                            <div className="flex h-6 w-6 items-center justify-center rounded text-white">
                              <Users className="h-4 w-4" />
                            </div>
                            <span>Users</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                    {hasPermission('contracts.read') && (
                      <SidebarMenuSubItem>
                         <SidebarMenuSubButton asChild isActive={location.pathname === '/dashboard/contracts'} className="text-white hover:text-white hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white">
                          <Link to="/dashboard/contracts" className="flex items-center space-x-2 text-white">
                            <div className="flex h-6 w-6 items-center justify-center rounded text-white">
                              <FileText className="h-4 w-4" />
                            </div>
                            <span>Contract</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                    {hasPermission('emails.read') && (
                      <SidebarMenuSubItem>
                         <SidebarMenuSubButton asChild isActive={location.pathname === '/dashboard/emails'} className="text-white hover:text-white hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white">
                          <Link to="/dashboard/emails" className="flex items-center space-x-2 text-white">
                            <div className="flex h-6 w-6 items-center justify-center rounded text-white">
                              <Mail className="h-4 w-4" />
                            </div>
                            <span>Email</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              )}

              {canSeeTicketMgmt && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={ticketMgmtPaths.includes(location.pathname)}
                    onClick={() => setTicketMgmtOpen((v) => !v)}
                    className="text-white hover:text-white hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white"
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Ticket className="h-4 w-4 text-white" />
                        <span>Ticket Management</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform ${ticketMgmtOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </SidebarMenuButton>
                  {ticketMgmtOpen && (
                  <SidebarMenuSub>
                    {hasPermission('tickets.read') && (
                      <SidebarMenuSubItem>
                         <SidebarMenuSubButton asChild isActive={location.pathname === '/dashboard/tickets'} className="text-white hover:text-white hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white">
                          <Link to="/dashboard/tickets" className="flex items-center space-x-2 text-white">
                            <div className="flex h-6 w-6 items-center justify-center rounded text-white">
                              <Ticket className="h-4 w-4" />
                            </div>
                            <span>Ticket</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                    {hasPermission('changeRequests.read') && (
                      <SidebarMenuSubItem>
                         <SidebarMenuSubButton asChild isActive={location.pathname === '/dashboard/change-requests'} className="text-white hover:text-white hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white">
                          <Link to="/dashboard/change-requests" className="flex items-center space-x-2 text-white">
                            <div className="flex h-6 w-6 items-center justify-center rounded text-white">
                              <FilePenLine className="h-4 w-4" />
                            </div>
                            <span>Change Request</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              )}

              {canSeePerformanceMgmt && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setPerformanceMgmtOpen(!performanceMgmtOpen)}
                    isActive={performanceMgmtOpen}
                    className="flex items-center justify-between text-white hover:bg-white/10 hover:text-white data-[active=true]:bg-white/20 data-[active=true]:text-white"
                  >
                    <div className="flex items-center space-x-3">
                      <Rocket className="h-4 w-4 text-white" />
                      <span>Performance</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${performanceMgmtOpen ? 'rotate-180' : ''}`} />
                  </SidebarMenuButton>
                  {performanceMgmtOpen && (
                  <SidebarMenuSub>
                    {hasPermission('kpi.read') && (
                      <SidebarMenuSubItem>
                         <SidebarMenuSubButton asChild isActive={location.pathname === '/dashboard/kpi'} className="text-white hover:text-white hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white">
                          <Link to="/dashboard/kpi" className="flex items-center space-x-2 text-white">
                            <div className="flex h-6 w-6 items-center justify-center rounded text-white">
                              <Target className="h-4 w-4" />
                            </div>
                            <span>KPI</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                    {hasPermission('okr.read') && (
                      <SidebarMenuSubItem>
                         <SidebarMenuSubButton asChild isActive={location.pathname === '/dashboard/okr'} className="text-white hover:text-white hover:bg-white/10 data-[active=true]:bg-white/20 data-[active=true]:text-white">
                          <Link to="/dashboard/okr" className="flex items-center space-x-2 text-white">
                            <div className="flex h-6 w-6 items-center justify-center rounded text-white">
                              <Target className="h-4 w-4" />
                            </div>
                            <span>OKR</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user?.name?.slice(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{user?.name}</p>
              <p className="text-xs text-white/70 capitalize">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Logout"
            className="h-8 w-8 text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};