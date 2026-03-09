# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# First-time setup (install deps, generate Prisma client, run migrations)
npm run setup

# Development server (uses Turbopack + node-compat shim)
npm run dev

# Run all tests
npm test

# Run a single test file
npx vitest run src/lib/__tests__/file-system.test.ts

# Lint
npm run lint

# Reset the database
npm run db:reset

# After schema changes, run migrations
npx prisma migrate dev
```

## Architecture

### Overview
UIGen is a Next.js 15 App Router app where users chat with Claude to generate React components. The AI uses tools to write files into an in-memory virtual file system, which is then compiled in the browser for live preview.

### Data Flow
1. **Chat** (`/api/chat/route.ts`) — User messages + serialized VFS are sent to the API. The server reconstructs the VFS, calls `streamText` with `str_replace_editor` and `file_manager` tools, and streams the response back.
2. **Tool calls** — As the AI streams tool calls, `ChatContext` intercepts them via `onToolCall` and calls `handleToolCall` in `FileSystemContext`, which mutates the in-memory VFS.
3. **Preview** — `PreviewFrame` watches `refreshTrigger` from `FileSystemContext`. On each change it calls `createImportMap` which uses Babel standalone to transpile all JSX/TSX files to blob URLs, then injects an import map into an iframe's `srcdoc`.
4. **Persistence** — On stream finish, the chat API saves `messages` (JSON) and `data` (serialized VFS) to the `Project` model in SQLite via Prisma. This only happens for authenticated users with a `projectId`.

### Key Abstractions

**`VirtualFileSystem`** (`src/lib/file-system.ts`) — In-memory tree of `FileNode` objects. All file operations (create, read, update, delete, rename, str-replace, insert) happen here. Serializes/deserializes to plain objects for API transport and DB storage.

**`FileSystemContext`** (`src/lib/contexts/file-system-context.tsx`) — React context wrapping `VirtualFileSystem`. Exposes mutation functions and a `refreshTrigger` counter that increments on every FS change. `handleToolCall` maps AI tool calls to FS operations.

**`ChatContext`** (`src/lib/contexts/chat-context.tsx`) — Wraps Vercel AI SDK's `useChat`, wires `onToolCall` to `FileSystemContext.handleToolCall`, and sends the serialized FS with every request body.

**`PreviewFrame`** (`src/components/preview/PreviewFrame.tsx`) — Watches `refreshTrigger`, runs `createImportMap` + `createPreviewHTML` to build a self-contained HTML string, and sets it as `iframe.srcdoc`. Third-party imports resolve to `esm.sh`.

**`jsx-transformer.ts`** (`src/lib/transform/jsx-transformer.ts`) — Client-side Babel transform pipeline. Transpiles each file, creates blob URLs, builds an ES import map. Missing local imports get placeholder modules; missing npm packages resolve to `esm.sh/<package>`.

**AI Tools** (`src/lib/tools/`) — `str_replace_editor` supports `create`, `str_replace`, and `insert` commands on the server-side VFS. `file_manager` supports `rename` and `delete`.

**Provider** (`src/lib/provider.ts`) — Returns `anthropic("claude-haiku-4-5")` when `ANTHROPIC_API_KEY` is set, otherwise falls back to `MockLanguageModel` which streams static canned responses.

### Auth
JWT-based auth stored in an httpOnly cookie (`auth-token`). `src/lib/auth.ts` handles session creation/verification using `jose`. Passwords hashed with `bcrypt`. Middleware (`src/middleware.ts`) protects routes. Anonymous users can use the app without auth; their work is tracked in `sessionStorage` via `anon-work-tracker.ts`.

### Layout
`MainContent` (`src/app/main-content.tsx`) is the root component: it wraps everything in `FileSystemProvider` → `ChatProvider`, then renders a resizable split pane (chat left, preview/code right). The code view shows `FileTree` + `CodeEditor` (Monaco).

### Database Schema
The database schema is defined in `prisma/schema.prisma`. Reference it whenever you need to understand the structure of data stored in the database.

### Environment
- `ANTHROPIC_API_KEY` — optional; app works without it using mock responses
- `JWT_SECRET` — optional; defaults to `"development-secret-key"`
- Database: SQLite at `prisma/dev.db`
- Prisma client output: `src/generated/prisma/`

### Testing
Tests use Vitest + jsdom + React Testing Library. Test files are colocated in `__tests__/` directories next to the code they test.

## Code Style
- Comments: use sparingly, only for complex/non-obvious logic, always in English.
