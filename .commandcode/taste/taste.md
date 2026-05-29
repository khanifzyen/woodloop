# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# project
- Use `todo_write` with detailed task breakdown before implementing features. Confidence: 0.75
- Use `use` hook from React to unwrap Next.js App Router `params: Promise<>` in page components. Confidence: 0.80
- Create a dedicated `.ts` file for PocketBase subscription hooks rather than inlining realtime logic in components. Confidence: 0.70
- Extract notification hooks into a separate file (`use-notifications.ts`) with re-exports from the original file for backward compatibility. Confidence: 0.70

# deployment
- Use Docker-based deployment with images hosted on GHCR.io and deployed to a VPS. Confidence: 0.65

# project
- Run migration scripts after editing/creating them (e.g., `node migration/file.js`) to apply schema changes to PocketBase. Confidence: 0.70

# testing
- Write unit tests that verify hook function names, query keys, and structure rather than testing async behavior directly. Confidence: 0.70

# git
- After completing code changes, stage all files (`git add .`), commit with a descriptive label, and push to remote. Confidence: 0.70

