export type EmployeeStatus = "Active" | "Inactive" | "On Leave" | "Probation";

export interface Employee {
    id: string;
    name: string;
    email: string;
    phone?: string;
    department: string;
    role: string;
    status: EmployeeStatus;
    joinDate: string;
    avatar?: string | null;
}
