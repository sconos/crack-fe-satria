export type EmployeeStatus = "Active" | "Inactive" | "On Leave" | "Probation";
export type EmploymentType = "Full-time" | "Part-time" | "Contract";

export interface Employee {
    id: string;
    employeeId?: string;
    name: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    nationalId?: string;
    address?: string;
    department: string;
    role: string;
    employmentType?: EmploymentType;
    manager?: string;
    workLocation?: string;
    status: EmployeeStatus;
    joinDate: string;
    avatar?: string | null;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
}