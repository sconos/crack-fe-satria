// app/(auth)/register/page.tsx
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <AuthLayout>
            <AuthCard
                title="Create your account"
                subtitle="Get started with Kuro"
                footer={
                    <>
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-primary hover:text-primary-dark"
                        >
                            Sign in
                        </Link>
                    </>
                }
            >
                <RegisterForm />
            </AuthCard>
        </AuthLayout>
    );
}
