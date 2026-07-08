import { Bell, Menu } from "lucide-react";

interface PortalTopbarProps {
    title?: string;
    onMenuClick?: () => void;
}

function PortalTopbar({ title, onMenuClick }: PortalTopbarProps) {
    return (
        <header className="flex h-14 items-center justify-between border-b border-neutral/15 bg-base-white px-4 lg:px-6">
            <div className="flex items-center gap-3">
                {/* Hamburger — mobile only */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="rounded-lg p-1.5 text-neutral hover:bg-primary-tint hover:text-primary-dark lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <p className="font-heading text-sm font-semibold text-primary-dark">
                    {title}
                </p>
            </div>
            <button
                type="button"
                className="rounded-lg p-1.5 text-neutral transition-colors hover:bg-primary-tint hover:text-primary-dark"
            >
                <Bell className="h-5 w-5" />
            </button>
        </header>
    );
}

export { PortalTopbar };
