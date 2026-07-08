import { Card, CardContent } from "@/components/ui/Card";

export function ProfileDocumentsTab() {
    return (
        <Card>
            <CardContent className="flex flex-col items-center gap-1 py-16 text-center">
                <p className="text-sm font-medium text-primary-dark">
                    Documents coming soon
                </p>
                <p className="max-w-sm text-sm text-neutral">
                    Contracts, ID uploads, and signed forms will show up here
                    once document storage is connected.
                </p>
            </CardContent>
        </Card>
    );
}
