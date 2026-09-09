"use client";

import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

function ResetPasswordContent() {
    return (
        <AuthLayout>
            <AuthCard
                title="Set a new password"
                subtitle="Choose a new password for your account."
            >
                <ResetPasswordForm />
            </AuthCard>
        </AuthLayout>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordContent />
        </Suspense>
    );
}