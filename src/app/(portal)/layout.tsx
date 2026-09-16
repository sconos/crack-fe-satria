import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function PortalGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            {children}
        </ProtectedRoute>
    );
}