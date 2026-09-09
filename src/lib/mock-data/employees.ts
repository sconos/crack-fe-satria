// lib/mock-data/employees.ts
import type { Employee } from "@/types/employee";

export const employees: Employee[] = [
    { id: "1", name: "Satria Wijaya", email: "satria@koru.com", department: "Engineering", role: "Frontend Developer", status: "Active", joinDate: "2024-01-15", manager: "Budi Santoso" },
    { id: "2", name: "Jane Doe", email: "jane@koru.com", department: "Executive Office", role: "CEO", status: "Active", joinDate: "2023-06-01" },
    { id: "3", name: "Budi Santoso", email: "budi@koru.com", department: "Engineering", role: "Engineering Head", status: "Active", joinDate: "2024-11-01", manager: "Jane Doe" },
    { id: "4", name: "Rina Hartati", email: "rina@koru.com", department: "Sales", role: "Sales Head", status: "Active", joinDate: "2022-03-20", manager: "Jane Doe" },
];

export function getEmployeeById(id: string): Employee | undefined {
    return employees.find((e) => e.id === id);
}