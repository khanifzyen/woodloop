# project
- Use `todo_write` with detailed task breakdown before implementing features. Confidence: 0.75
- Next.js middleware file is named `proxy.ts` (not `middleware.ts`) for this project — Next.js 16+ uses the "proxy" convention and middleware is deprecated. Confidence: 0.75
- Discuss business logic decisions and UI placement with the user first before implementing — when the user says "jawab dulu jangan coding" or asks for opinion first, provide analysis/options verbally before writing code. Confidence: 0.78
- Use `use` hook from React to unwrap Next.js App Router `params: Promise<>` in page components. Confidence: 0.80
- Create a dedicated `.ts` file for PocketBase subscription hooks rather than inlining realtime logic in components. Confidence: 0.70
- Extract notification hooks into a separate file (`use-notifications.ts`) with re-exports from the original file for backward compatibility. Confidence: 0.70
