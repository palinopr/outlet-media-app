import type { ReactNode } from "react";

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    children?: ReactNode; // For badges, actions or extra controls
}

export function AdminPageHeader({ title, description, children }: AdminPageHeaderProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 sm:mb-8">
            <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h1>
                {description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 hidden sm:block">
                        {description}
                    </p>
                )}
            </div>
            {children && (
                <div className="flex items-center gap-2 shrink-0">
                    {children}
                </div>
            )}
        </div>
    );
}
