import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import RoleManagement from "./pages/RoleManagement";
import AssetManagement from "./pages/AssetManagement";
import ContractManagement from "./pages/ContractManagement";
import EmailManagement from "./pages/EmailManagement";
import PayrollManagement from "./pages/PayrollManagement";
import TicketManagement from "./pages/TicketManagement";
import ChangeRequestManagement from "./pages/ChangeRequestManagement";
import AttendanceManagement from "./pages/AttendanceManagement";
import KPIManagement from "./pages/KPIManagement";
import OKRManagement from "./pages/OKRManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredPermission="dashboard.access">
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/users"
              element={
                <ProtectedRoute requiredPermission="users.read">
                  <DashboardLayout>
                    <UserManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/roles"
              element={
                <ProtectedRoute requiredPermission="roles.read">
                  <DashboardLayout>
                    <RoleManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/contracts"
              element={
                <ProtectedRoute requiredPermission="contracts.read">
                  <DashboardLayout>
                    <ContractManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/emails"
              element={
                <ProtectedRoute requiredPermission="emails.read">
                  <DashboardLayout>
                    <EmailManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/payroll"
              element={
                <ProtectedRoute requiredPermission="payroll.read">
                  <DashboardLayout>
                    <PayrollManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/tickets"
              element={
                <ProtectedRoute requiredPermission="tickets.read">
                  <DashboardLayout>
                    <TicketManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/change-requests"
              element={
                <ProtectedRoute requiredPermission="changeRequests.read">
                  <DashboardLayout>
                    <ChangeRequestManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/attendance"
              element={
                <ProtectedRoute requiredPermission="attendance.read">
                  <DashboardLayout>
                    <AttendanceManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/kpi"
              element={
                <ProtectedRoute requiredPermission="kpi.read">
                  <DashboardLayout>
                    <KPIManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/okr"
              element={
                <ProtectedRoute requiredPermission="okr.read">
                  <DashboardLayout>
                    <OKRManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/assets"
              element={
                <ProtectedRoute requiredPermission="assets.read">
                  <DashboardLayout>
                    <AssetManagement />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
