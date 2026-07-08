export function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateEmail(value: string): string | undefined {
    if (!value.trim()) return "Email is required";
    if (!isValidEmail(value)) return "Enter a valid email";
    return undefined;
}

export function validatePassword(value: string): string | undefined {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return undefined;
}

export function validateRequired(
    value: string,
    fieldName: string,
): string | undefined {
    if (!value.trim()) return `${fieldName} is required`;
    return undefined;
}
