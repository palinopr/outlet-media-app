# src/components / ui

Generated from the current working tree on 2026-04-28 02:30:43.

- Files: 12
- File kinds: React/TSX module (12)

Each entry below documents the file path, system ownership, construction style, imports/exports when available, cross-links to tests and routes, and a concise contents summary.

## `src/components/ui/badge.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / ui
- Ownership: UI primitive / design-system components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 49
- Bytes: 1776
- Imports (internal): src/lib/utils.ts
- Imports (packages): react, class-variance-authority, radix-ui
- Imported by: src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx
- Depends on groups: src/lib
- Used by groups: src/app / admin
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx
- Routes related (direct): src/app/admin/clients/page.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx
- Exports: Badge, badgeVariants
- Symbol details: function Badge, const badgeVariants
- Defines: Badge, badgeVariants, Comp
- Contents summary: exports: Badge, badgeVariants; internal imports: 1; package imports: 3

## `src/components/ui/breadcrumb.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / ui
- Ownership: UI primitive / design-system components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 110
- Bytes: 2350
- Imports (internal): src/lib/utils.ts
- Imports (packages): react, lucide-react, radix-ui
- Imported by: src/components/admin/breadcrumbs.tsx
- Depends on groups: src/lib
- Used by groups: src/components / admin
- Route owners: src/app/admin/layout.tsx
- Exports: Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis
- Symbol details: function Breadcrumb, function BreadcrumbList, function BreadcrumbItem, function BreadcrumbLink, function BreadcrumbPage, function BreadcrumbSeparator, function BreadcrumbEllipsis
- Defines: Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis, Comp
- Contents summary: exports: Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis; internal imports: 1; package imports: 3

## `src/components/ui/button.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / ui
- Ownership: UI primitive / design-system components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 65
- Bytes: 2392
- Imports (internal): src/lib/utils.ts
- Imports (packages): react, class-variance-authority, radix-ui
- Imported by: src/app/admin/users/page.tsx, src/app/client/[slug]/components/complete-profile-modal.tsx, src/app/client/page.tsx, src/app/client/pending/page.tsx, src/components/admin/clients/assignment-manager.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/columns.tsx, src/components/admin/clients/invite-member-form.tsx, src/components/admin/clients/members-section.tsx, … (+7 more)
- Depends on groups: src/lib
- Used by groups: src/app / admin, src/app / client, src/components / admin, src/components / shared, src/components / ui
- Route owners: src/app/admin/users/page.tsx, src/app/client/page.tsx, src/app/client/pending/page.tsx, src/app/client/[slug]/layout.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/campaigns/page.tsx, … (+1 more)
- Routes related (direct): src/app/admin/users/page.tsx, src/app/client/page.tsx, src/app/client/pending/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/client/[slug]/layout.test.tsx, src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/[campaignId]/page.test.tsx, src/components/admin/users/revoke-invitation-button.test.tsx, src/app/admin/campaigns/page.test.tsx
- Exports: Button, buttonVariants
- Symbol details: function Button, const buttonVariants
- Defines: Button, buttonVariants, Comp
- Contents summary: exports: Button, buttonVariants; internal imports: 1; package imports: 3

## `src/components/ui/card.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / ui
- Ownership: UI primitive / design-system components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 93
- Bytes: 1987
- Imports (internal): src/lib/utils.ts
- Imports (packages): react
- Imported by: src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/loading.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/campaign-cards.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/loading.tsx, src/app/admin/users/page.tsx, … (+4 more)
- Depends on groups: src/lib
- Used by groups: src/app / admin, src/components / admin
- Route owners: src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/loading.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/loading.tsx, … (+2 more)
- Routes related (direct): src/app/admin/campaigns/loading.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/loading.tsx, src/app/admin/clients/page.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/dashboard/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/loading.tsx, … (+1 more)
- Tests related: src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/dashboard/page.test.tsx, src/components/admin/clients/client-detail.test.tsx
- Exports: Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent
- Symbol details: function Card, function CardHeader, function CardTitle, function CardDescription, function CardAction, function CardContent, function CardFooter
- Defines: Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter
- Contents summary: exports: Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent; internal imports: 1; package imports: 1

## `src/components/ui/command.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / ui
- Ownership: UI primitive / design-system components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 185
- Bytes: 4818
- Imports (internal): src/lib/utils.ts, src/components/ui/dialog.tsx
- Imports (packages): react, cmdk, lucide-react
- Imported by: src/components/admin/command-palette.tsx
- Depends on groups: src/lib, src/components / ui
- Used by groups: src/components / admin
- Route owners: src/app/admin/layout.tsx
- Exports: Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator
- Symbol details: function Command, function CommandDialog, function CommandInput, function CommandList, function CommandEmpty, function CommandGroup, function CommandSeparator, function CommandItem, function CommandShortcut
- Defines: Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandSeparator, CommandItem, CommandShortcut
- Contents summary: contains `use client`; exports: Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut; internal imports: 2; package imports: 3

## `src/components/ui/dialog.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / ui
- Ownership: UI primitive / design-system components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 159
- Bytes: 4303
- Imports (internal): src/lib/utils.ts, src/components/ui/button.tsx
- Imports (packages): react, lucide-react, radix-ui
- Imported by: src/app/client/[slug]/components/complete-profile-modal.tsx, src/components/ui/command.tsx
- Depends on groups: src/lib, src/components / ui
- Used by groups: src/app / client, src/components / ui
- Route owners: src/app/client/[slug]/layout.tsx, src/app/admin/layout.tsx
- Tests related: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger
- Symbol details: function Dialog, function DialogTrigger, function DialogPortal, function DialogClose, function DialogOverlay, function DialogContent, function DialogHeader, function DialogFooter, function DialogTitle, function DialogDescription
- Defines: Dialog, DialogTrigger, DialogPortal, DialogClose, DialogOverlay, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription
- Contents summary: contains `use client`; exports: Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal; internal imports: 2; package imports: 3

## `src/components/ui/dropdown-menu.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / ui
- Ownership: UI primitive / design-system components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 258
- Bytes: 8418
- Imports (internal): src/lib/utils.ts
- Imports (packages): react, lucide-react, radix-ui
- Imported by: src/components/admin/clients/columns.tsx, src/components/admin/data-table/data-table-toolbar.tsx, src/components/admin/users/columns.tsx
- Depends on groups: src/lib
- Used by groups: src/components / admin
- Route owners: src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx, src/app/admin/campaigns/page.tsx
- Tests related: src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx
- Exports: DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut, … (+3 more)
- Symbol details: function DropdownMenu, function DropdownMenuPortal, function DropdownMenuTrigger, function DropdownMenuContent, function DropdownMenuGroup, function DropdownMenuItem, function DropdownMenuCheckboxItem, function DropdownMenuRadioGroup, function DropdownMenuRadioItem, function DropdownMenuLabel, function DropdownMenuSeparator, function DropdownMenuShortcut, function DropdownMenuSub, function DropdownMenuSubTrigger, function DropdownMenuSubContent
- Defines: DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, … (+3 more)
- Contents summary: contains `use client`; exports: DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem; internal imports: 1; package imports: 3

## `src/components/ui/input.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / ui
- Ownership: UI primitive / design-system components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 22
- Bytes: 962
- Imports (internal): src/lib/utils.ts
- Imports (packages): react
- Imported by: src/app/client/[slug]/components/complete-profile-modal.tsx, src/components/admin/clients/client-overview-tab.tsx, src/components/admin/clients/client-table.tsx, src/components/admin/clients/invite-member-form.tsx, src/components/admin/data-table/data-table-toolbar.tsx
- Depends on groups: src/lib
- Used by groups: src/app / client, src/components / admin
- Route owners: src/app/client/[slug]/layout.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/app/client/[slug]/layout.test.tsx, src/app/shell-import-smoke.test.ts, src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/page.test.tsx
- Exports: Input
- Symbol details: function Input
- Defines: Input
- Contents summary: exports: Input; internal imports: 1; package imports: 1

## `src/components/ui/sheet.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / ui
- Ownership: UI primitive / design-system components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 144
- Bytes: 4188
- Imports (internal): src/lib/utils.ts
- Imports (packages): react, lucide-react, radix-ui
- Imported by: src/components/admin/mobile-sidebar.tsx
- Depends on groups: src/lib
- Used by groups: src/components / admin
- Route owners: src/app/admin/layout.tsx
- Exports: Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription
- Symbol details: function Sheet, function SheetTrigger, function SheetClose, function SheetPortal, function SheetOverlay, function SheetContent, function SheetHeader, function SheetFooter, function SheetTitle, function SheetDescription
- Defines: Sheet, SheetTrigger, SheetClose, SheetPortal, SheetOverlay, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription
- Contents summary: contains `use client`; exports: Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription; internal imports: 1; package imports: 3

## `src/components/ui/skeleton.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / ui
- Ownership: UI primitive / design-system components
- Type: React/TSX module
- Construction: component/UI-oriented module
- Lines: 14
- Bytes: 276
- Imports (internal): src/lib/utils.ts
- Imported by: src/app/admin/campaigns/loading.tsx, src/app/admin/clients/loading.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/users/loading.tsx, src/components/client/loading-skeleton.tsx
- Depends on groups: src/lib
- Used by groups: src/app / admin, src/components / client
- Route owners: src/app/admin/campaigns/loading.tsx, src/app/admin/clients/loading.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/users/loading.tsx, src/app/client/[slug]/campaign/[campaignId]/loading.tsx, src/app/client/[slug]/campaigns/loading.tsx, src/app/client/[slug]/loading.tsx
- Routes related (direct): src/app/admin/campaigns/loading.tsx, src/app/admin/clients/loading.tsx, src/app/admin/dashboard/loading.tsx, src/app/admin/users/loading.tsx
- Exports: Skeleton
- Symbol details: function Skeleton
- Defines: Skeleton
- Contents summary: exports: Skeleton; internal imports: 1

## `src/components/ui/table.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / ui
- Ownership: UI primitive / design-system components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 117
- Bytes: 2448
- Imports (internal): src/lib/utils.ts
- Imports (packages): react
- Imported by: src/components/admin/clients/campaigns-section.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/data-table/data-table.tsx
- Depends on groups: src/lib
- Used by groups: src/components / admin
- Route owners: src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/users/page.tsx
- Tests related: src/components/admin/clients/client-detail.test.tsx, src/app/admin/campaigns/page.test.tsx, src/app/shell-import-smoke.test.ts
- Exports: Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption
- Symbol details: function Table, function TableHeader, function TableBody, function TableFooter, function TableRow, function TableHead, function TableCell, function TableCaption
- Defines: Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption
- Contents summary: contains `use client`; exports: Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption; internal imports: 1; package imports: 1

## `src/components/ui/tooltip.tsx`
- Status: tracked-clean
- System: web
- Group: src/components / ui
- Ownership: UI primitive / design-system components
- Type: React/TSX module
- Construction: component/UI-oriented module, contains `use client`
- Lines: 58
- Bytes: 1830
- Imports (internal): src/lib/utils.ts
- Imports (packages): react, radix-ui
- Imported by: src/components/admin/nav-links.tsx
- Depends on groups: src/lib
- Used by groups: src/components / admin
- Route owners: src/app/admin/layout.tsx
- Exports: Tooltip, TooltipTrigger, TooltipContent, TooltipProvider
- Symbol details: function TooltipProvider, function Tooltip, function TooltipTrigger, function TooltipContent
- Defines: TooltipProvider, Tooltip, TooltipTrigger, TooltipContent
- Contents summary: contains `use client`; exports: Tooltip, TooltipTrigger, TooltipContent, TooltipProvider; internal imports: 1; package imports: 2
