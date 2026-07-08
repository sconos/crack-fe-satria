// app/(auth)/login/page.tsx
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
    return (
        <AuthLayout>
            <AuthCard
                title="Welcome back"
                subtitle="Sign in to your Kuro account"
                footer={
                    <>
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="text-primary hover:text-primary-dark"
                        >
                            Sign up
                        </Link>
                    </>
                }
            >
                <LoginForm />
            </AuthCard>
        </AuthLayout>
    );
}
