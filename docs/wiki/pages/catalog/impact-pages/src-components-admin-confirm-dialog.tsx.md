# Impact: src/components/admin/confirm-dialog.tsx

Generated from the current working tree on 2026-04-10 15:42:38.

- Category: Shared components
- Impact score: 32
- Ownership: shared admin UI components
- Feature module: none
- Route owners: src/app/admin/campaigns/[campaignId]/page.tsx, src/app/admin/settings/page.tsx, src/app/admin/users/page.tsx, src/app/admin/clients/page.tsx, src/app/admin/clients/[id]/page.tsx, src/app/admin/campaigns/page.tsx
- Imported by: src/components/admin/campaigns/campaign-cells.tsx, src/components/admin/clients/columns.tsx, src/components/admin/clients/members-section.tsx, src/components/admin/users/columns.tsx, src/components/admin/users/revoke-invitation-button.tsx
- Tests related: src/components/admin/users/revoke-invitation-button.test.tsx, src/components/admin/clients/client-detail.test.tsx, src/app/shell-import-smoke.test.ts, src/app/admin/campaigns/page.test.tsx
- DB objects: none
- Env vars: none
- Mutation symbols: none
- Auth signals: none
- Behavior signals: client component/module
- Depends on groups: src/components / ui
- Used by groups: src/components / admin
- Summary: contains `use client`; exports: ConfirmDialog; internal imports: 1; package imports: 2
