"use client";

import * as React from "react";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/util";

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AvatarUpload({
    name,
    value,
    onChange,
}: {
    name: string;
    value?: string | null;
    onChange: (dataUrl: string | null) => void;
}) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [preview, setPreview] = React.useState<string | null>(value ?? null);
    const [error, setError] = React.useState<string | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please choose an image file.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setError("Image must be under 2MB.");
            return;
        }

        setError(null);
        const url = URL.createObjectURL(file);
        setPreview(url);
        onChange(url);
    }

    function handleRemove() {
        setPreview(null);
        onChange(null);
        if (inputRef.current) inputRef.current.value = "";
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative">
                {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={preview}
                        alt={name}
                        className="h-20 w-20 rounded-full object-cover ring-1 ring-inset ring-primary/10"
                    />
                ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-tint font-heading text-lg font-semibold text-primary-dark ring-1 ring-inset ring-primary/10">
                        {getInitials(name || "?")}
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-base-white shadow-sm transition-colors hover:bg-primary-dark"
                    aria-label="Change photo"
                >
                    <Camera className="h-3.5 w-3.5" />
                </button>

                {preview && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-base-white shadow-sm transition-colors hover:bg-danger/90"
                        aria-label="Remove photo"
                    >
                        <X className="h-3 w-3" />
                    </button>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {error && (
                <p className={cn("font-body text-xs text-danger")}>{error}</p>
            )}
        </div>
    );
}