# Admin panel

Rebuild of `/dashboard` as a routed admin. Auth stays Better Auth (see `07`). Style follows the design tokens (`03`); the admin uses the same teal accent and components, in a calmer layout. Use TanStack Query here only (loaders prefetch with `ensureQueryData`).

> **Owner decision R-21:** admin visuals follow the new portfolio design (assumed). Confirm if a different look is wanted.

## Problems being fixed (from the old code)

Placeholder chrome ("Logo Here", "Bottom", "Side Menu"); empty Home tab; tabs in local state (no URL/back button); `ViewProjects` pagination state unused and the query key ignores the page; settings gear `opacity-0` until hover (invisible on touch); `AddProject` and `ProjectSettings` duplicate one form (241 + 308 lines); priority is a hand-typed number; inbox is read once with no read state, delete or reply; every action clears Redis by hand; desktop-only layout.

## Routes

| Route | Screen |
| --- | --- |
| `/admin` | Overview |
| `/admin/projects` | Projects table |
| `/admin/projects/new` | New project |
| `/admin/projects/$id` | Edit project |
| `/admin/inbox` | Inbox (master-detail); `?filter=unread|archived`, `?id=` selected message |
| (later) `/admin/settings` | Account, sign out everywhere |

`admin.tsx` is the layout route: `beforeLoad` runs `requireAdmin` (server and client), renders the shell, provides the QueryClient (created per request on the server, singleton on the client), mounts `<Toaster />`.

## Shell

- Left sidebar 248 px: brand `<Towhid/Karim>` with an `Admin` mono tag, nav items Overview, Projects, Inbox (with unread count badge), then at the bottom the user (name, email), `View site` link (new tab), theme toggle, `Sign out`.
- Top bar on mobile: menu button, page title. Below 768 px the sidebar becomes a bottom tab bar (Overview, Projects, Inbox, More) with 44 px targets.
- Command palette (`Ctrl/Cmd+K`) built with shadcn `Command` (cmdk): "Go to Projects", "New project", "Open Inbox", "Sign out", plus project search. Keyboard shortcuts `g p`, `g i`, `n` documented in a `?` dialog.
- `main` has `id="main"`; skip link on top; `h1` per page.

## Overview (`/admin`)

Cards: Unread messages (count, link), Projects (enabled / total), Last saved (relative time of the last project change), a "Live site" card with a link and a button `Refresh live site` that calls the purge server function (useful if a purge failed). Below: the five most recent messages and the last three edited projects.

## Projects table (`/admin/projects`)

- Toolbar: search input (debounced 250 ms, `?q=`), status filter (All / Live / Hidden), `New project` primary button.
- Table (sortable by display order only; order is edited by drag): drag handle, thumbnail 56x40, name + summary line, tags (first 3 + count), status switch (`Live`/`Hidden`, optimistic), actions (`Edit`, `View on site`, overflow menu with `Delete`). Row click opens edit. Actions always visible.
- Reorder by drag and drop (`@dnd-kit` or native pointer events, R-21 library choice): optimistic update, then `reorderProjects` server function with the full ordered id list, assigning `displayIndex = (n - i) * 10`. Keyboard alternative: `Move up` / `Move down` buttons in the overflow menu.
- Pagination: 10 per page, `?page=`, server-side, the page number is part of the query key.
- Empty state: "No projects yet" with a New project button. Error state with Retry.
- Delete: confirm dialog (`AlertDialog`) naming the project; on confirm delete row, cleanup image, purge cache, toast with no undo (soft delete is out of scope).

## Project form (new and edit share one component)

Single `ProjectForm` using react-hook-form + the shared zod `ProjectSchema`. Two-column layout on desktop: form fields left, sticky **live preview** of the public project card right (updates as you type).

Fields: Name, Summary (counter 10 to 512), Description (textarea with counter 10 to 2048, plain text with line breaks), Tags (chip input: Enter or comma adds, Backspace removes, suggestions from existing tags), Demo link, Source link, Image (`ImageDropzone`), Visibility switch (Live / Hidden). Display order is not a field (set by drag; new projects go to the top).

Behaviour: dirty tracking with a "Discard changes?" prompt on navigation; `Save` and `Save and view site`; inline field errors (`aria-invalid`, `aria-describedby`); on success toast `Saved. Live site updated.` and the purge runs; if the purge call fails toast a warning `Saved. Live site refresh pending.` (see `05`). Autosave is not required.

## Inbox (`/admin/inbox`)

Master-detail: list left (sender name, first line, relative time, unread dot), message right (full text, sender email as `mailto:` link, received time, actions `Reply` (mailto with subject `Re: ...`), `Mark unread/read`, `Archive`/`Unarchive`, `Delete`). Tabs/filters: Inbox (default), Unread, Archived. Selecting a message marks it read (optimistic). Keyboard: `j`/`k` move, `e` archive, `#` delete, `u` toggle unread. Mobile: list screen then detail screen with a back button. 20 per page. Empty state "No messages".

## Data access

All through `createServerFn` modules in `src/server/fns/` (every function starts with `await requireAdmin()`), validated with zod at the boundary, returning plain serialisable data and typed errors. Query keys: `['admin','projects',{q,status,page}]`, `['admin','project',id]`, `['admin','mails',{filter,page}]`, `['admin','counts']`. Mutations invalidate the matching keys; optimistic updates for status switch, reorder, mark read/archive with rollback on error.

## Schema additions

`mail.readAt`, `mail.archivedAt` (see `06`). No publish-state table: saves purge the cache directly.

## Components to build (`src/components/admin/`)

`admin-shell.tsx`, `command-palette.tsx`, `stat-card.tsx`, `projects-table.tsx`, `project-row.tsx`, `project-form.tsx`, `project-preview.tsx`, `tag-input.tsx`, `image-dropzone.tsx`, `inbox-list.tsx`, `inbox-message.tsx`, `confirm-dialog.tsx`. Reuse shadcn primitives (add `table`, `command`, `dropdown-menu`, `popover`, `checkbox` as needed via the shadcn CLI in the Vite setup, R-09).

## Accessibility and UX checklist

Real buttons and links; table has `<caption class="sr-only">`; switches have labels; dialogs trap focus and return it; toasts are announced (`aria-live`); all actions visible without hover; 44 px touch targets; drag has a keyboard alternative; loading uses skeletons not spinners; forms keep user input on error.

## Acceptance checks

1. Deep links work (`/admin/projects/<id>` loads after login; back button behaves).
2. Creating, editing, reordering, hiding and deleting a project each update the public home page immediately (cache purged) and leave no orphan R2 object.
3. Inbox read/unread/archive/delete persist across reload.
4. Fully usable at 390 px width with the bottom tab bar.
5. Lighthouse accessibility score 95 or higher on each admin screen.
6. Every server function rejects calls without an admin session.
