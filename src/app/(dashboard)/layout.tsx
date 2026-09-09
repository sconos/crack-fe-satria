import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export default function DashboardGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["ADMIN", "HR", "SUPERVISOR", "MANAGER"]}>
            <DashboardLayout>{children}</DashboardLayout>
        </ProtectedRoute>
    );
}