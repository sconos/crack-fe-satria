// components/ui/StatCard.tsx
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/util";

export function StatCard({
    label,
    value,
    accent,
}: {
    label: string;
    value: string | number;
    accent: string;
}) {
    return (
        <Card className={cn("border-l-4", accent)}>
            <CardContent>
                <p className="font-heading text-2xl font-bold text-primary-dark">
                    {value}
                </p>
                <p className="mt-1 text-xs text-neutral">{label}</p>
            </CardContent>
        </Card>
    );
}