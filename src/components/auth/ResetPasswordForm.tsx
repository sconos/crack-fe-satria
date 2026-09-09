"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { toast } from "@/components/ui/Toast";
import { validatePassword } from "@/lib/validation";

interface ResetPasswordValues {
    password: string;
    confirmPassword: string;
}

type ResetPasswordErrors = Partial<Record<keyof ResetPasswordValues, string>>;

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [values, setValues] = React.useState<ResetPasswordValues>({
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = React.useState<ResetPasswordErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    function handleChange(field: keyof ResetPasswordValues, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function validate(): boolean {
        const next: ResetPasswordErrors = {
            password: validatePassword(values.password),
            confirmPassword: !values.confirmPassword
                ? "Please confirm your password"
                : values.confirmPassword !== values.password
                  ? "Passwords don't match"
                  : undefined,
        };
        setErrors(next);
        return !next.password && !next.confirmPassword;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            // TODO: replace with a real POST /auth/reset-password call,
            // sending { token, password: values.password }
            await new Promise((resolve) => setTimeout(resolve, 800));
            setSuccess(true);
        } catch {
            toast.error("Couldn't reset your password. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!token) {
        return (
            <Alert variant="danger" title="Invalid or expired link">
                This password reset link is missing or no longer valid.
                Request a new one from the{" "}
                <Link href="/forgot-password" className="underline">
                    forgot password
                </Link>{" "}
                page.
            </Alert>
        );
    }

    if (success) {
        return (
            <div className="flex flex-col gap-4">
                <Alert variant="success" title="Password updated">
                    You can now sign in with your new password.
                </Alert>
                <Button onClick={() => router.push("/login")}>
                    Go to login
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField
                label="New password"
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
                label="Confirm new password"
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
                Reset password
            </Button>
        </form>
    );
}