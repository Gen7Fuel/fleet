# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install          # install dependencies
bun run --hot src/index.ts  # start dev server with hot reload (localhost:3000)
```

No lint or test scripts are configured.

## Architecture

Minimal [Hono](https://hono.dev/) web server written in TypeScript, run with Bun.

- `src/index.ts` — sole entry point; defines routes and starts the server
- TypeScript strict mode enabled, JSX configured via `hono/jsx` (`jsxImportSource: "hono/jsx"` in tsconfig)
- Bun is both the package manager and the runtime (use `bun` not `npm`/`node`)
