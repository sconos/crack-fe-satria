// app/(auth)/login/page.tsx
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <AuthLayout>
            <AuthCard
                title="Welcome back"
                subtitle="Sign in to your Koru account"
            >
                <LoginForm />
            </AuthCard>
        </AuthLayout>
    );
}
