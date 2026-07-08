// components/auth/AuthCard.tsx
import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";

interface AuthCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
    return (
        <Card className="w-full max-w-md">
            <CardContent className="flex flex-col gap-6 px-8 py-10">
                <div className="flex flex-col gap-1 text-center">
                    <h1 className="font-heading text-2xl font-bold text-primary-dark">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="font-body text-sm text-neutral">
                            {subtitle}
                        </p>
                    )}
                </div>
                {children}
                {footer && (
                    <div className="font-body text-center text-sm text-neutral">
                        {footer}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export { AuthCard };
