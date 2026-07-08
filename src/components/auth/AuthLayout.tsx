// components/auth/AuthLayout.tsx
import * as React from "react";
import Image from "next/image";

function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-primary-tint px-4 py-12">
            <div className="flex w-full flex-col items-center">
                <Image
                    src="/logo.png"
                    alt="Koru HRM"
                    width={180}
                    height={245}
                    priority
                />
                {children}
            </div>
        </div>
    );
}

export { AuthLayout };
