"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!isLoading && user) {
            router.replace(user.role === "EMPLOYEE" ? "/portal" : "/dashboard");
        }
    }, [user, isLoading, router]);

    if (isLoading) return null;
    if (user) return null;

    return <>{children}</>;
}