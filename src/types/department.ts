export type DepartmentStatus = "active" | "inactive";

export type Department = {
    id: string;
    name: string;
    code: string;
    description?: string;
    parentId: string | null;
    headId: string | null;
    headName: string | null;
    headInitials: string | null;
    employeeCount: number;
    location?: string;
    status: DepartmentStatus;
};

export type DepartmentTreeNode = Department & {
    children: DepartmentTreeNode[];
};