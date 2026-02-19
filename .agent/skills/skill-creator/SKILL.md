name: skill-creator
description: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.
license: Complete terms in LICENSE.txt

# Skill Creator

This skill provides guidance for creating effective skills.

## About Skills

Skills are modular, self-contained packages that extend Claude's capabilities by providing
specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific
domains or tasks—they transform Claude from a general-purpose agent into a specialized agent
equipped with procedural knowledge that no model can fully possess.

### What Skills Provide

1.  **Domain-Specific Knowledge**: Curated information that may not be present in the model's
    training data or that requires precise, up-to-date detail.
2.  **Structured Workflows**: Guidance on how to approach complex tasks using multiple steps
    or tools.
3.  **Tool Integrations**: Definitions of available tools and instructions on how to use them
    effectively.

---

## When to Create a Skill

A skill is appropriate when:
-   **Knowledge Gap**: The task requires specialized, private, or highly technical knowledge
    that Claude might not know or might hallucinate.
-   **Complexity**: The task involves a complex multi-step process that is difficult to represent
    in a single prompt.
-   **Repeatability**: The task is one that you (or others) will perform frequently.
-   **Consistency**: You want Claude to follow a specific style, format, or set of rules every time.

---

## Core Principles

For a skill to be effective, it should follow these principles:

1.  **Be Explicit, Not Implicit**: Tell Claude exactly what to do and how to do it. Don't assume
    it will know the "right" way.
2.  **Focus on "How", Not Just "What"**: Provide procedural knowledge (steps, workflows) in
    addition to declarative knowledge (facts, definitions).
3.  **Use Examples (Few-Shot Prompting)**: Provide 1-3 high-quality examples of inputs and
    desired outputs. This is the single most effective way to guide Claude's behavior.
4.  **Keep it Focused**: A skill should do one thing well. Avoid "multi-purpose" skills that try
    to cover too many unrelated domains.
5.  **Prefer Documentation Over Prompts**: Whenever possible, provide knowledge in the form of
    reference files (`references/`) rather than bloating `SKILL.md` with long lists of facts.
6.  **Avoid Redundancy**: Don't repeat information. If something is defined in a tool's
    description, don't repeat it in `SKILL.md` unless you are providing specific usage guidance.
7.  **No Extra Files**: A skill should only contain essential files that directly support its functionality. Do NOT create extraneous documentation or auxiliary files, including:
    - `README.md`
    - `INSTALLATION_GUIDE.md`\n    - `QUICK_REFERENCE.md`
    - `CHANGELOG.md`
    - etc.

---

## Skill Anatomy

A skill is a directory (e.g., `skill-creator/`) with the following structure:

```text
skill-name/
├── SKILL.md                 # REQUIRED: The core definition of the skill
├── LICENSE.txt              # REQUIRED: Licensing information
├── references/              # OPTIONAL: Reference documentation, schemas, etc.
│   └── doc1.md
└── scripts/                 # OPTIONAL: Helper scripts for the skill
    └── script1.py
```

### 1. `SKILL.md` (Required)

`SKILL.md` is the "brain" of the skill. It MUST include a frontmatter section and a clearly
structured set of instructions.

#### Frontmatter (Required)
The top of `SKILL.md` must contain a YAML-like block:

```yaml
name: [skill-slug]          # Must match the directory name (kebab-case)
description: [one-sentence] # Clear, concise summary of what the skill does
license: [license-name]     # e.g., "MIT", "Apache-2.0", "Proprietary"
```

#### Instructions (Required)
The rest of `SKILL.md` should use Markdown headers to organize instructions.

### 2. `LICENSE.txt` (Required)

All skills must include a `LICENSE.txt` file containing the full text of the license under
which the skill is distributed.

### 3. `references/` (Optional)

Use this directory for large blocks of static information that would clutter `SKILL.md`. Claude can
read these files on demand. Examples include:
-   API specifications
-   Coding style guides
-   Database schemas
-   Templates
-   Detailed process maps

### 4. `scripts/` (Optional)

Use this directory for scripts that automate parts of the skill's workflow. Examples include:
-   Data formatting scripts
-   Validation scripts
-   Environment setup scripts

---

## The Workflow for Creating a Skill

When a user asks to create a new skill:

1.  **Gather Requirements**: Ask the user for the name, purpose, and any existing knowledge
    or tools they want to include.
2.  **Define the Structure**: Create the directory and basic `SKILL.md` with frontmatter.
3.  **Draft Instructions**: Write the core instructions, focusing on procedural steps.
