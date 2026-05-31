# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# project
- Use `todo_write` with detailed task breakdown before implementing features. Confidence: 0.75
- Discuss business logic decisions and UI placement with the user first before implementing — when the user says "jawab saja jangan coding" or asks for opinion first, provide analysis/options verbally before writing code. Confidence: 0.72
- Use `use` hook from React to unwrap Next.js App Router `params: Promise<>` in page components. Confidence: 0.80
- Create a dedicated `.ts` file for PocketBase subscription hooks rather than inlining realtime logic in components. Confidence: 0.70
- Extract notification hooks into a separate file (`use-notifications.ts`) with re-exports from the original file for backward compatibility. Confidence: 0.70

# deployment
- Use Docker-based deployment with images hosted on GHCR.io and deployed to a VPS. Confidence: 0.65

# project
- Use localStorage for cart items rather than a PocketBase collection — cart is temporary session data that doesn't need cross-device sync or realtime updates. Confidence: 0.60
- Validate prices server-side on checkout (in PB hooks) to prevent client-side price manipulation — ensure the price stored in the listing/order_detail is fetched from the actual listing record, not from the client's request body. Confidence: 0.70
- Update `docs/07-skema.md` with schema changes and create migration files when modifying PocketBase collection schemas — document schema changes before implementing. Confidence: 0.73
- Run migration scripts after editing/creating them (e.g., `node migration/file.js`) to apply schema changes to PocketBase — fields defined in migration files don't exist in PocketBase until the migration is actually executed. Confidence: 0.75

# testing
- Write unit tests that verify hook function names, query keys, and structure rather than testing async behavior directly. Confidence: 0.70

# ui-layout
- In supplier inventory forms (new/edit), place Volume, Satuan, and Stok in a single 3-column grid (`grid-cols-3`) with equal width, ordered as Volume, Satuan, then Stok. Make sure SelectTrigger has `w-full` for consistent sizing. Confidence: 0.72

# git
- After completing code changes, stage all files (`git add .`), commit with a descriptive label, and push to remote. Confidence: 0.78

# project
- Use array fields (like `photos[]`) rather than single-value fields for file uploads in PocketBase, to support multiple file uploads consistently. Confidence: 0.70
- Keep select option values in their original form without translating to more formal Indonesian (e.g., keep "perhutani", "hutan rakyat", "log", "square" as-is per user's "tidak usah ditranslate gpp" preference). Confidence: 0.65

# agent-browser
- When running agent-browser for web testing, target the local dev server at `localhost:3001` instead of production URLs. Confidence: 0.70

# navigation
- Place profile page links in the top-right navbar avatar dropdown, not in the sidebar navigation. Profile is accessed via the existing top menu (avatar dropdown with profile + logout), not as a dedicated sidebar link. Confidence: 0.70
- Use role-specific profile pages (e.g., `/supplier/profile`) instead of a shared generic `/profile` page. Delete the old shared page and use the role-specific route. Confidence: 0.70
- In sidebar footer, place the Changelog link inline on the same line as the version text ("WoodLoop {version} Changelog"), not on a separate line above the version. Confidence: 0.65
