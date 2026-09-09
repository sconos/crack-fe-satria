import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/util";

export function PayrollStatCard({
    label,
    value,
    sub,
    accent,
}: {
    label: string;
    value: string | number;
    sub?: string;
    accent: string; // e.g. "border-l-success", "border-l-secondary"
}) {
    return (
        <Card className={cn("border-l-4", accent)}>
            <CardContent>
                <p className="text-xs text-neutral">{label}</p>
                <p className="font-heading mt-1 text-xl font-bold text-primary-dark">
                    {value}
                </p>
                {sub && (
                    <p className="font-body mt-0.5 text-xs text-neutral">
                        {sub}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
