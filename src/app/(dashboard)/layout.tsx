// (dashboard)/layout.tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["ADMIN", "HR"]}>
            {children}
        </ProtectedRoute>
    );
}