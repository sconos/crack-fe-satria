"use client";

import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import type { Employee } from "@/types/employee";

interface EmployeePickerFieldProps {
    label: string;
    htmlFor: string;
    employees: Employee[];
    excludeIds?: Set<string>;
    value: string;
    onChange: (id: string) => void;
    placeholder?: string;
    helperText?: string;
    error?: string;
}

export function EmployeePickerField({
    label,
    htmlFor,
    employees,
    excludeIds,
    value,
    onChange,
    placeholder = "Unassigned",
    helperText,
    error,
}: EmployeePickerFieldProps) {
    const options = excludeIds
        ? employees.filter((e) => !excludeIds.has(e.id))
        : employees;

    return (
        <FormField
            label={label}
            htmlFor={htmlFor}
            helperText={helperText}
            error={error}
        >
            <Select
                id={htmlFor}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                error={!!error}
            >
                {options.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                        {emp.name}
                        {emp.role ? ` — ${emp.role}` : ""}
                    </option>
                ))}
            </Select>
        </FormField>
    );
}