"use client";

import * as React from "react";
import Link from "next/link";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { validateEmail, validatePassword } from "@/lib/validation";

interface LoginValues {
    email: string;
    password: string;
}

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

export function LoginForm() {
    const [values, setValues] = React.useState<LoginValues>({
        email: "",
        password: "",
    });
    const [errors, setErrors] = React.useState<LoginErrors>({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    function handleChange(field: keyof LoginValues, value: string) {
        setValues((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function validate(): boolean {
        const next: LoginErrors = {
            email: validateEmail(values.email),
            password: validatePassword(values.password),
        };
        setErrors(next);
        return !next.email && !next.password;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            // TODO: replace with real auth call
            await new Promise((resolve) => setTimeout(resolve, 800));
            toast.success("Welcome back!");
        } catch {
            toast.error("Couldn't sign in. Check your email and password.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

            <div className="flex justify-end">
                <Link
                    href="/forgot-password"
                    className="font-body text-sm text-primary hover:text-primary-dark"
                >
                    Forgot password?
                </Link>
            </div>

            <Button type="submit" loading={isSubmitting} className="mt-1">
                Sign in
            </Button>
        </form>
    );
}
