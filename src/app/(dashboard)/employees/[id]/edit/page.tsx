import { notFound } from "next/navigation";
import { EditEmployeeClient } from "./EditEmployeeClient";
import type { Employee } from "@/types/employee";

const mockEmployees: Employee[] = [
    {
        id: "1",
        name: "Satria Wijaya",
        email: "satria@koru.com",
        phone: "+62 812 3456 7890",
        department: "Engineering",
        role: "Frontend Developer",
        status: "Active",
        joinDate: "2024-01-15",
    },
    {
        id: "2",
        name: "Jane Doe",
        email: "jane@koru.com",
        department: "Human Resources",
        role: "HR Manager",
        status: "On Leave",
        joinDate: "2023-06-01",
    },
    {
        id: "3",
        name: "Budi Santoso",
        email: "budi@koru.com",
        department: "Engineering",
        role: "Backend Developer",
        status: "Probation",
        joinDate: "2024-11-01",
    },
    {
        id: "4",
        name: "Rina Hartati",
        email: "rina@koru.com",
        department: "Sales",
        role: "Sales Executive",
        status: "Inactive",
        joinDate: "2022-03-20",
    },
];

export default async function EditEmployeePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const employee = mockEmployees.find((e) => e.id === id);
    if (!employee) return notFound();

    return <EditEmployeeClient employee={employee} />;
}
