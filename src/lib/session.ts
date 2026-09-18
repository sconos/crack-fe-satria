// src/lib/session.ts
export const SESSION_HINT_COOKIE = "has_session";
export const ROLE_HINT_COOKIE = "user_role";

export type AuthRole = "ADMIN" | "HR" | "EMPLOYEE";

export function homePathForRole(role: string | null): string {
    return role === "EMPLOYEE" ? "/portal" : "/dashboard";
}