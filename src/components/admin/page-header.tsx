import type { ReactNode } from "react";

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    children?: ReactNode; // For badges, actions or extra controls
}

export function AdminPageHeader({ title, description, children }: AdminPageHeaderProps) {
    return (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 sm:mb-8">
            <div className="min-w-0 flex-1">
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
                {description && (
                    <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground sm:text-sm">
                        {description}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex shrink-0 items-center gap-2">
                    {children}
                </div>
            )}
        </div>
    );
}
