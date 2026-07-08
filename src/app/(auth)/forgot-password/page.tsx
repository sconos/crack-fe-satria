// app/(auth)/forgot-password/page.tsx
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
    return (
        <AuthLayout>
            <AuthCard
                title="Reset your password"
                subtitle="We'll email you a reset link"
            >
                <ForgotPasswordForm />
                <p className="font-body text-center text-sm text-neutral">
                    <Link
                        href="/login"
                        className="text-primary hover:text-primary-dark"
                    >
                        Back to sign in
                    </Link>
                </p>
            </AuthCard>
        </AuthLayout>
    );
}
