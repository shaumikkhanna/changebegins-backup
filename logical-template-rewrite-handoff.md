# Handoff: Logical Question Generation Harness

## Current Goal

The project is testing whether the upgraded logical reasoning template contracts produce better ChangeBegins aptitude questions than the older prompt flow.

The important design choice is:

- use `llm-ready-logical-template-contracts.md` as the new reasoning source of truth
- keep the visible output close to the old ChangeBegins / n8n question shape
- test locally and manually before touching the production pipeline

## Key Files

- `llm-ready-logical-template-contracts.md`
  - Canonical upgraded logical template contract file.
  - Covers 61 logical templates across domains A-K.
  - Defines global rules, domain rules, template contracts, forbidden patterns, validator checks, example skeletons, distractor rules, and final self-check.

- `tools/logical-template-harness.js`
  - Local zero-dependency Node harness.
  - Reads the contract file fresh every run.
  - Extracts a focused contract for one `templateId`.
  - Removes the contract file's native `Required Output Format` section so it does not conflict with the temporary ChangeBegins-style JSON wrapper.
  - Builds generation and validation prompts.
  - Supports JSON output for programmatic use and ChatGPT-friendly text output for manual testing.

- `tools/logical-generate-prompt.js`
  - Minimal stdout-only wrapper for quick generation testing.
  - Assumes `build`, generation mode, `--count 3`, and `--context non-engineering`.
  - Prints a compact system prompt and user prompt, with no explanatory wrapper text and no file output.
  - Use `--full` to print the original rich harness generation prompt.
  - Use `--validation` to print a compact validation prompt.
  - Use `--validation --full` to print the rich harness validation prompt.
  - Automatically appends `generated_questions/rejections/<templateId>.md` as known failures to avoid when that file exists.

- `tools/repair-generated-json.js`
  - Stdin/stdout helper for generated items that are logically fine but use smart quotes.
  - Replaces smart quotes with ASCII quotes, parses the result, and prints formatted valid JSON.

- `temporary-logical-question-generation-workflow.md`
  - Practical workflow for generating and validating questions locally.

- `seeded-aptitude-item-prompt-spec.md`
  - Older seeded aptitude prompt package.
  - Useful historical reference for output shape and difficulty discipline.

- `n8n-verbal-question-prompt-chunker.js`
  - Older n8n-style verbal prompt chunker.
  - Not the main logical harness, but useful as reference for how prompt chunks were being created.

- `changebegins-stuff/logical-ability-domains-and-templates-summary.md`
  - Older logical domain/template summary.
  - Useful for quick browsing, no longer the logical contract source.

- `generated_questions/1.json`
  - Scratch generated output from the temporary testing flow.
  - Treat as unvalidated evidence, not a golden sample; some items are expected to fail until they pass the validation loop.

## What The Harness Does

Given a template ID such as `LOG_OR_L3_028`, the harness extracts:

1. Global Generation Rules
2. Global Option and Distractor Design Rules
3. Selected domain rules
4. Selected template contract
5. Final Self-Check

The harness intentionally strips the contract file's native `Required Output Format` block from the focused contract. The contract file's schema uses fields such as `template_id`, `question`, and `correct_option`, while this temporary testing flow asks for the older ChangeBegins-style fields below. Keeping both schemas in the same generation prompt creates mixed-format output.

It then wraps that focused contract in a prompt that asks the LLM to return old-platform-style fields:

- `questionText`
- `options`
- `correctAnswer`
- `explanation`
- `tags`
- `estimatedTime`
- `templateId`

The upgraded quality information is preserved under `metadata`:

- `difficulty_level`
- `reasoning_operators`
- `answer_mode`
- `correct_answer`
- `option_rationales`
- `validation_notes`

This means the system has the old output skeleton but the new logical brain.

## Commands

List templates:

```sh
node tools/logical-template-harness.js list
```

Inspect one focused contract:

```sh
node tools/logical-template-harness.js contract LOG_OR_L3_028
```

Build programmatic JSON prompt bundle:

```sh
node tools/logical-template-harness.js build LOG_OR_L3_028 --count 3 --context non-engineering --out /tmp/logical-prompt.json
```

Build ChatGPT generation prompt only:

```sh
node tools/logical-template-harness.js build LOG_OR_L3_028 --count 3 --context non-engineering --format chatgpt-generate --out /tmp/logical-generate-prompt.txt
```

Print a minimal generation prompt to stdout:

```sh
node tools/logical-generate-prompt.js LOG_OR_L3_028
```

Print the full generation prompt to stdout:

```sh
node tools/logical-generate-prompt.js LOG_OR_L3_028 --full
```

Print a minimal validation prompt to stdout:

```sh
node tools/logical-generate-prompt.js LOG_OR_L3_028 --validation
```

Print the full validation prompt to stdout:

```sh
node tools/logical-generate-prompt.js LOG_OR_L3_028 --validation --full
```

Repair smart quotes in generated JSON before validation:

```sh
node tools/repair-generated-json.js < generated-output.json
```

Build ChatGPT validation prompt only:

```sh
node tools/logical-template-harness.js build LOG_OR_L3_028 --context non-engineering --format chatgpt-validate --out /tmp/logical-validate-prompt.txt
```

The older combined ChatGPT format still exists:

```sh
node tools/logical-template-harness.js build LOG_OR_L3_028 --format chatgpt --out /tmp/logical-chatgpt-prompt.txt
```

## Context Option

Use `--context non-engineering` for general aptitude-style settings such as people, books, schedules, objects, or events.

Use `--context engineering` for STEM/workplace-engineering settings such as modules, machines, lab steps, sensors, components, or technical teams.

Context should change only the surface story, not the reasoning structure.

## Why This Is Better Than The Older Flow

- The old system used broad summaries and general prompt rules.
- The new system uses explicit per-template contracts.
- Difficulty is controlled by reasoning operators, not by making wording longer or adding more names.
- Distractors are required to be diagnostic and tied to named mistake types.
- The focused prompt avoids feeding the entire contract file to the LLM.
- The output remains compatible with the old ChangeBegins-style JSON shape.
- The validation prompt creates a reject/regenerate loop for weak questions.

## How To Demonstrate Quality Improvement

Generate matched old-vs-new samples using the same domain/template mix, then score them with a rubric.

Suggested metrics:

- template adherence
- exactly one defensible answer
- distractor quality
- explanation quality
- difficulty control
- ambiguity risk
- platform readiness
- fatal issue count

Suggested comparison artifact:

```text
evaluation/
  old-samples.json
  new-samples.json
  rubric.md
  judge-results-old.json
  judge-results-new.json
  comparison-summary.md
```

## RAG Direction

The current harness is not a full RAG system. It is deterministic contract retrieval and prompt assembly:

```text
templateId -> exact parser -> focused contract -> prompt
```

That is correct for core rules because the selected template contract must be exact.

If adding RAG, use it as support:

```text
exact contract retrieval
+ semantic retrieval of examples, rejected cases, reviewer feedback, and failure notes
```

Best next RAG-like step:

1. Keep deterministic contract slicing.
2. Add template-specific examples by exact `templateId`.
3. Add approved and rejected examples.
4. Later add vector search over cross-template failure patterns and human feedback.

Do not use fuzzy semantic retrieval for the core template contract.

## Next Useful Improvements

1. Add exact example retrieval by `templateId`.
2. Create an evaluation folder with old/new sample comparisons.
3. Add a neutral judge prompt for before/after scoring.
4. Add deterministic validators for high-value domains:
   - series solver
   - syllogism/model checker
   - ordering/grouping CSP solver
   - conditional truth-table checker
5. Add optional RAG support for approved examples, rejected examples, failure notes, and reviewer comments.
6. Split generated samples into `scratch`, `rejected`, and `approved` folders once the validation loop is stable.
7. Convert repeated validation failures into short template-specific notes in `generated_questions/rejections/<templateId>.md`; the simple prompt wrapper includes them automatically.

## Caveat

The contract file is a strong specification, but it does not replace validation. The best temporary flow is:

```text
focused contract -> generation -> validation/judge -> reject or accept
```
