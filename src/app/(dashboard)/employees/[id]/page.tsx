import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmployeeProfileClient } from "@/components/employee/EmployeeProfileClient";
import type {
    EmployeeProfile,
    LeaveBalance,
    LeaveHistoryItem,
} from "@/types/employee-profile";

// TODO: replace with a real fetch keyed by params.id
const mockEmployeeProfiles: EmployeeProfile[] = [
    {
        id: "1",
        name: "Satria Wijaya",
        email: "satria@koru.com",
        department: "Engineering",
        role: "Frontend Developer",
        status: "Active",
        joinDate: "2024-01-15",
        phone: "+62 812-3456-7890",
        address: "Jl. Sunset Road No. 88, Denpasar, Bali",
        manager: "Elang Nararya",
        employmentType: "Full-time",
        workLocation: "Bali (Hybrid)",
        emergencyContactName: "Sari Wijaya",
        emergencyContactPhone: "+62 812-1111-2222",
    },
    {
        id: "2",
        name: "Jane Doe",
        email: "jane@koru.com",
        department: "Human Resources",
        role: "HR Manager",
        status: "On Leave",
        joinDate: "2023-06-01",
        phone: "+62 813-2345-6789",
        address: "Jl. Kebon Jeruk No. 12, Jakarta",
        manager: "—",
        employmentType: "Full-time",
        workLocation: "Jakarta (On-site)",
        emergencyContactName: "Mark Doe",
        emergencyContactPhone: "+62 813-9999-8888",
    },
    {
        id: "3",
        name: "Budi Santoso",
        email: "budi@koru.com",
        department: "Engineering",
        role: "Backend Developer",
        status: "Probation",
        joinDate: "2024-11-01",
        phone: "+62 815-4567-8901",
        address: "Jl. Diponegoro No. 5, Surabaya",
        manager: "Elang Nararya",
        employmentType: "Full-time",
        workLocation: "Surabaya (Remote)",
        emergencyContactName: "Wati Santoso",
        emergencyContactPhone: "+62 815-7777-6666",
    },
    {
        id: "4",
        name: "Rina Hartati",
        email: "rina@koru.com",
        department: "Sales",
        role: "Sales Executive",
        status: "Inactive",
        joinDate: "2022-03-20",
        phone: "+62 817-5678-9012",
        address: "Jl. Gatot Subroto No. 3, Bandung",
        manager: "—",
        employmentType: "Contract",
        workLocation: "Bandung (On-site)",
        emergencyContactName: "Agus Hartati",
        emergencyContactPhone: "+62 817-3333-4444",
    },
];

const mockLeaveBalances: LeaveBalance[] = [
    { type: "Annual leave", used: 6, total: 12 },
    { type: "Sick leave", used: 2, total: 10 },
    { type: "Unpaid leave", used: 0, total: 5 },
];

const mockLeaveHistory: LeaveHistoryItem[] = [
    {
        id: "l1",
        type: "Annual leave",
        range: "Jun 20 – Jun 21",
        days: 2,
        status: "Approved",
    },
    {
        id: "l2",
        type: "Sick leave",
        range: "May 14",
        days: 1,
        status: "Approved",
    },
    {
        id: "l3",
        type: "Annual leave",
        range: "Jul 8 – Jul 10",
        days: 3,
        status: "Pending",
    },
];

export default async function EmployeeProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const employee = mockEmployeeProfiles.find((e) => e.id === id);

    if (!employee) {
        return (
            <DashboardLayout title="Employee not found">
                <div className="flex flex-col gap-6">
                    <PageHeader
                        title="Employee not found"
                        description="This person may have been removed, or the link is out of date."
                    />
                    <Link href="/employees">
                        <Button variant="outline">Back to employees</Button>
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <EmployeeProfileClient
            employee={employee}
            leaveBalances={mockLeaveBalances}
            leaveHistory={mockLeaveHistory}
        />
    );
}
