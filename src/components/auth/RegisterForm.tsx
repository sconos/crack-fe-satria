"use client";

import * as React from "react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import {
    validateEmail,
    validatePassword,
    validateRequired,
} from "@/lib/validation";

interface RegisterValues {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

type RegisterErrors = Partial<Record<keyof RegisterValues, string>>;

export function RegisterForm() {
    const [values, setValues] = React.useState<RegisterValues>({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = React.useState<RegisterErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    function handleChange(field: keyof RegisterValues, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function validate(): boolean {
        const next: RegisterErrors = {
            fullName: validateRequired(values.fullName, "Full name"),
            email: validateEmail(values.email),
            password: validatePassword(values.password),
            confirmPassword: !values.confirmPassword
                ? "Please confirm your password"
                : values.confirmPassword !== values.password
                  ? "Passwords don't match"
                  : undefined,
        };
        setErrors(next);
        return Object.values(next).every((v) => !v);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            // TODO: replace with real register call
            await new Promise((resolve) => setTimeout(resolve, 800));
            toast.success("Account created — welcome to Koru HRM!");
        } catch {
            toast.error("Couldn't create your account. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
                label="Full name"
                htmlFor="fullName"
                required
                error={errors.fullName}
            >
                <Input
                    id="fullName"
                    error={!!errors.fullName}
                    value={values.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                />
            </FormField>

            <FormField
                label="Email"
                htmlFor="email"
                required
                error={errors.email}
            >
                <Input
                    id="email"
                    type="email"
                    error={!!errors.email}
                    value={values.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                />
            </FormField>

            <FormField
                label="Password"
                htmlFor="password"
                required
                error={errors.password}
            >
                <PasswordInput
                    id="password"
                    error={!!errors.password}
                    value={values.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                />
            </FormField>

            <FormField
                label="Confirm password"
                htmlFor="confirmPassword"
                required
                error={errors.confirmPassword}
            >
                <PasswordInput
                    id="confirmPassword"
                    error={!!errors.confirmPassword}
                    value={values.confirmPassword}
                    onChange={(e) =>
                        handleChange("confirmPassword", e.target.value)
                    }
                />
            </FormField>

            <Button type="submit" loading={isSubmitting} className="mt-1">
                Create account
            </Button>
        </form>
    );
}
