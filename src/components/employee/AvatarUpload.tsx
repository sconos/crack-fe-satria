"use client";

import * as React from "react";
import { Camera, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/util";
import { uploadMyAvatar, removeMyAvatar } from "@/lib/api/employees";
import { ApiError } from "@/lib/api/client";

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
    onChange: (avatarUrl: string | null) => void;
}) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [preview, setPreview] = React.useState<string | null>(value ?? null);
    const [error, setError] = React.useState<string | null>(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const [lastSyncedValue, setLastSyncedValue] = React.useState(value ?? null);
    
    if ((value ?? null) !== lastSyncedValue) {
        setLastSyncedValue(value ?? null);
        setPreview(value ?? null);
    }
    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
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
        setIsUploading(true);
        try {
            const updated = await uploadMyAvatar(file);
            setPreview(updated.avatar ?? null);
            onChange(updated.avatar ?? null);
        } catch (err) {
            setError(
                err instanceof ApiError
                    ? err.message
                    : "Couldn't upload that image. Try again.",
            );
        } finally {
            setIsUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    async function handleRemove() {
        setError(null);
        setIsUploading(true);
        try {
            const updated = await removeMyAvatar();
            setPreview(updated.avatar ?? null);
            onChange(updated.avatar ?? null);
        } catch (err) {
            setError(
                err instanceof ApiError
                    ? err.message
                    : "Couldn't remove that image. Try again.",
            );
        } finally {
            setIsUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
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

                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-primary-dark/40">
                        <Loader2 className="h-5 w-5 animate-spin text-base-white" />
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={isUploading}
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-base-white shadow-sm transition-colors hover:bg-primary-dark disabled:opacity-50"
                    aria-label="Change photo"
                >
                    <Camera className="h-3.5 w-3.5" />
                </button>

                {preview && (
                    <button
                        type="button"
                        onClick={handleRemove}
                        disabled={isUploading}
                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-base-white shadow-sm transition-colors hover:bg-danger/90 disabled:opacity-50"
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
                disabled={isUploading}
            />

            {error && (
                <p className={cn("font-body text-xs text-danger")}>{error}</p>
            )}
        </div>
    );
}