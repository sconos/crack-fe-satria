"use client";

import * as React from "react";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { toast } from "@/components/ui/Toast";
import { validateEmail } from "@/lib/validation";

export function ForgotPasswordForm() {
    const [email, setEmail] = React.useState("");
    const [error, setError] = React.useState<string | undefined>();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [sent, setSent] = React.useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const emailError = validateEmail(email);
        setError(emailError);
        if (emailError) return;

        setIsSubmitting(true);
        try {
            // TODO: replace with real password reset call
            await new Promise((resolve) => setTimeout(resolve, 800));
            setSent(true);
        } catch {
            toast.error("Couldn't send reset link. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (sent) {
        return (
            <Alert variant="success" title="Check your email">
                If an account exists for that email, we&apos;ve sent a reset
                link.
            </Alert>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FormField label="Email" htmlFor="email" required error={error}>
                <Input
                    id="email"
                    type="email"
                    error={!!error}
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError(undefined);
                    }}
                />
            </FormField>

            <Button type="submit" loading={isSubmitting} className="mt-1">
                Send reset link
            </Button>
        </form>
    );
}
