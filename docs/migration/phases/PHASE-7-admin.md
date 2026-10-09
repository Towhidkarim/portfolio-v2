# Phase 7: Admin panel

## Goal
The routed admin from `../09-admin-panel.md`: shell, overview, projects table with reorder, one project form with live preview, inbox master-detail, command palette, all with server-side auth, optimistic updates and cache purging.

## Depends on
Phases 2, 5 and 6.

## Read first
`../09-admin-panel.md` (the full spec), `../03-design-system.md` (components, tokens), `../06-data-d1.md` (queries), `../08-media-r2.md`, `../05-rendering-and-cache.md` (purge mapping), `../01-current-state.md` (what the old dashboard did).

## Pending research to resolve first
**R-21** decisions: drag-and-drop library, admin visual style confirmation. **R-09** for adding shadcn `table`, `command`, `dropdown-menu`, `popover`, `checkbox`. R-05 resolved earlier.

## Steps
1. - [ ] Admin shell (`admin.tsx` layout): sidebar/bottom tab bar, user block, theme toggle, sign out, QueryClient provider, Toaster, skip link, `noindex`, `Cache-Control: private, no-store`.
2. - [ ] Admin server functions in `src/server/fns/admin-projects.ts` and `admin-mails.ts` (each begins with `requireAdmin()`, zod-validated inputs, typed results): `listProjects`, `getProject`, `createProject`, `updateProject`, `setProjectEnabled`, `reorderProjects`, `deleteProject`, `listMails`, `getMail`, `markMailRead`, `archiveMail`, `deleteMail`, `countUnread`, `refreshLiveSite`. Every public-content write calls `purgeForProject` (Phase 5) and returns `{ purge: { local, global } }` so the UI can warn.
3. - [ ] Overview page: stat cards, recent messages, recently edited projects, `Refresh live site` button.
4. - [ ] Projects table: search, status filter, pagination in the query key, thumbnail, tags, status switch (optimistic), drag reorder with keyboard alternative, row actions always visible, delete confirm.
5. - [ ] `ProjectForm` (new/edit) with the shared zod schema, tag input, `ImageDropzone`, live preview card (reuse the public `ProjectCard`), dirty-state guard, toasts (`Saved. Live site updated.` / warning if purge failed).
6. - [ ] Inbox: list + detail, filters, read on select, archive, delete, reply mailto, keyboard shortcuts, mobile two-screen flow, empty and error states.
7. - [ ] Command palette and shortcut help dialog.
8. - [ ] Loading skeletons everywhere; error boundaries per route; 403/401 handling that redirects to `/login` with a `redirect` param.
9. - [ ] Tests: server function authorisation (no session, non-admin, admin), reorder atomicity, delete cleans the image object, purge mapping called with the right paths (stub the purge), inbox state transitions.
10. - [ ] Responsive and accessibility pass at 1280 and 390; Lighthouse accessibility 95+ on each screen; keyboard-only walkthrough of the whole flow.

## Files
Created: `src/routes/admin.*.tsx`, `src/components/admin/*`, `src/server/fns/admin-*.ts`, tests. Changed: Phase 2 placeholder `/admin` page replaced. Deleted: none (legacy parked).

## Acceptance criteria
All six acceptance checks in `09-admin-panel.md`, plus:
- Creating a project with an uploaded image then loading `/` shows it immediately (cache purged, `x-edge-cache` MISS then HIT).
- Every admin server function returns an auth error when called with no session (script that enumerates and calls them).
- Reorder via drag persists and matches the public order; keyboard reorder works.
- No leftover references to `legacy/**` from `src/`.
- Typecheck, lint, build pass; admin route chunks are not loaded on public pages (check the build manifest).

## Verification
```
bun run dev   # sign in with the seeded admin
bun run test
node scripts/check-admin-auth.mjs    # calls each server function unauthenticated, expects 401/redirect
npx lighthouse http://localhost:<port>/admin/projects --only-categories=accessibility
```

## Out of scope
Soft delete/undo, multi-user roles, analytics, settings page beyond sign out.

## Rollback
Admin is isolated under `/admin`; revert the phase commits.

## Deviations
(none yet)

## Handoff
(template in `00-agent-protocol.md`)
