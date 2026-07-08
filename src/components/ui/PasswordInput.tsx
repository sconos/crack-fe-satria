"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input, type InputProps } from "./Input";

export type PasswordInputProps = Omit<InputProps, "type" | "rightIcon">;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    (props, ref) => {
        const [visible, setVisible] = React.useState(false);

        return (
            <Input
                ref={ref}
                type={visible ? "text" : "password"}
                rightIcon={
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setVisible((v) => !v)}
                        className="text-neutral hover:text-primary-dark"
                        aria-label={visible ? "Hide password" : "Show password"}
                    >
                        {visible ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                }
                {...props}
            />
        );
    },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
