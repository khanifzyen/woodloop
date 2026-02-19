# Output Patterns

## Markdown Templates

Use Markdown templates to enforce a consistent structure for Claude's output. Define these in `references/` and refer to them in `SKILL.md` using the placeholder syntax:

```markdown
## Output Format

Provide the analysis in the following format (see `references/analysis-template.md` for the full schema):

### Summary
[One sentence summary]

### Findings
- [Finding 1]
- [Finding 2]
```

## Data Formats (JSON/YAML)

When Claude needs to produce structured data, provide a schema or a clear example in `references/`. Specify whether the output should be returned in a code block or written to a file.

```markdown
## Data Extraction

Extract relevant fields into a JSON object matching the schema in `references/extract-schema.json`. Save the result to `output/data.json`.
```
