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

- `tools/logical-generate-prompt-bundle.js`
  - Builds one large JSON object for all logical templates.
  - Each key is a template ID, e.g. `LOG_GR_L3_034`.
  - Each value is the compact generation prompt for exactly 1 question.
  - Supports `--out`, `--context`, `--spec`, `--no-rejections`, and `--rejections`.

- `tools/repair-generated-json.js`
  - Stdin/stdout helper for generated items that are logically fine but use smart quotes.
  - Replaces smart quotes with ASCII quotes, parses the result, and prints formatted valid JSON.

- `temporary-logical-question-generation-workflow.md`
  - Historical workflow note from the earlier pass.
  - Not currently present in the workspace; the active quick workflow is now in `tools/logical-generate-prompt.js` plus this handoff.

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

- `generated_questions/rejections/<templateId>.md`
  - Template-specific failure notes automatically included by `tools/logical-generate-prompt.js`.
  - Keep these notes short and pattern-based.
  - Use them for repeated generator or validator failures before deciding whether the canonical contract itself needs a change.

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

Build a JSON bundle of compact 1-question prompts for every template:

```sh
node tools/logical-generate-prompt-bundle.js --out /tmp/logical-prompt-bundle.json
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

## Current Manual Loop

1. Pick one `templateId`.
2. Generate the compact prompt:

```sh
node tools/logical-generate-prompt.js LOG_OR_L2_026
```

3. Paste the prompt into ChatGPT and generate 3 items.
4. If the output has smart quotes or minor JSON formatting problems, repair it:

```sh
node tools/repair-generated-json.js < generated-output.json
```

5. Generate the compact validation prompt:

```sh
node tools/logical-generate-prompt.js LOG_OR_L2_026 --validation
```

6. Paste the generated JSON into the validation prompt.
7. Classify failures:
   - Bad generated item: add a short note to `generated_questions/rejections/<templateId>.md`.
   - False-positive validator or unclear rule: update `llm-ready-logical-template-contracts.md`.
   - Repeated structural generation error: make the template more restrictive, usually with a construction recipe.

Do not treat repairable smart quotes as validation failures. The validator prompt explicitly says recoverable serialization issues should not fail otherwise valid reasoning.

## Context Option

Use `--context non-engineering` for general aptitude-style settings such as people, books, schedules, objects, or events.

Use `--context engineering` for STEM/workplace-engineering settings such as modules, machines, lab steps, sensors, components, or technical teams.

Context should change only the surface story, not the reasoning structure.

## Current Contract Decisions

- The compact prompt is the default. Use `--full` only when debugging prompt content.
- Validation is compact by default. Use `--validation --full` only when comparing against the rich judge prompt.
- Core contract retrieval remains deterministic; do not use fuzzy retrieval for the selected template contract.
- Rejection notes are lightweight retrieval. They are automatically appended only for the selected template.
- For `COULD_BE_TRUE` in `LOG_LD_L3_017` and `LOG_SY_L3_022`, the current project decision is broad: a must-true statement still counts as something that could be true.
- For ordering valid-arrangement templates, prefer restrictive construction recipes over flexible possible/impossible wording. Build the valid arrangement first, then create wrong options by controlled violations.
- For generated item validation, quote/JSON cleanup belongs to `tools/repair-generated-json.js`; reasoning validators should focus on item logic unless formatting prevents understanding.

## Recent Template Fix Ledger

- `LOG_SR_L1_002`
  - Internal missing-term cycles do not need two full cycles before the blank if visible terms before/after make the cycle unique.
  - Prefer non-symbol cycles when symbol JSON quoting keeps failing.

- `LOG_SR_L2_003`
  - Simple ordered-symbol two-layer series are valid, such as `A, X, B, W, C, V, ?`.
  - Do not reject letter sequences merely because they are not numeric.

- `LOG_SR_L3_006`
  - Now rigid: exactly six visible terms from `term(n) = n^2 + c`, ask for the 8th term, and do not reveal the rule in the stem.
  - The 7th term is a near-miss distractor; the 8th term must appear exactly once and align across key, metadata, explanation, and rationales.
  - Explanations must be final and clean with no self-correction text.

- `LOG_AN_L2_010`
  - Parity plus divisibility must use divisibility by an odd number; divisibility by an even number overlaps with parity.
  - Added checks against self-correction text and mismatched correct option/explanation.
  - Example skeleton is the writing-tool/mark-on-paper item.

- `LOG_AN_L3_011`
  - Digit-sum, factor-count, and divisibility hidden rules are disallowed.
  - Example skeleton is `MOP : POP :: RAT : ?`, answer `TAT`.
  - Palindrome/word-structure odd-one-out items must avoid surface cues such as one different first letter.

- `LOG_LD_L1_012`
  - Four options must be truth-evaluation labels.
  - Correct answer must be `True` or `False`; `Cannot be determined` is a distractor for this L1 direct-deduction template.
  - Logical deduction domain now prefers artificial/non-obvious premises, e.g. `No squares are happy`.

- `LOG_LD_L1_013`
  - Distractors cannot be restatements, weaker forms, or entailed variants of the correct conclusion.
  - `A only if B` means `if A then B`; do not use equivalent `only if` statements as distractors.

- `LOG_LD_L3_017`
  - Broad `could be true`: must-true statements still count as possible.
  - Removed the earlier possible-but-not-forced restriction.

- `LOG_SY_L1_019`
  - Universal negatives convert validly: `No A are B` equals `No B are A`.
  - Converse universal negatives cannot be used as distractors.

- `LOG_SY_L3_022`
  - Broad `could be true`, matching `LOG_LD_L3_017`: if a claim is entailed, it still could be true.
  - Removed the earlier possible-but-not-guaranteed restriction.

- `LOG_OR_L1_024`
  - Rank distractors may include plausible status phrases like `Equal 1st`.
  - Validator should check whether exactly one option is defensible, not whether all option wording uses the same convention.

- Ordering domain-wide
  - For linear arrangements, adjacent means positions differ by exactly 1.
  - `immediately before` means `position(A) + 1 = position(B)`.
  - `not adjacent` means `abs(position(A) - position(B)) > 1`.
  - Arrangement-option questions require auditing every option against every rule.

- `LOG_OR_L2_026`
  - Now rigid: only `VALID_ARRANGEMENT`.
  - Exactly 4 entities, exactly 3 constraints, exactly 4 full left-to-right arrangement options.
  - Build valid arrangement first; wrong options must violate named rules.

- `LOG_OR_L3_027`
  - Now rigid: only `VALID_ARRANGEMENT`.
  - Exactly 5 entities, exactly 4 constraints, exactly 4 full left-to-right arrangement options.
  - Same build-valid-first and option-audit recipe as `LOG_OR_L2_026`.

- `LOG_OR_L3_028`
  - Do not require every constraint to be individually necessary after removal.
  - A constraint is acceptable if it helps prove the answer or eliminates at least one wrong option.

- `LOG_GR_L1_030`
  - Changed from `DIRECT_MATCH` to `INFERRED_MATCH`.
  - Do not ask for a match explicitly stated in the stem.

- `LOG_GR_L2_031`
  - Every option must assign every listed item exactly once.
  - Wrong options must preserve completeness and fail only capacity limits.
  - No redundant capacity wording such as `at least 2 and exactly 3`.

- `LOG_GR_L2_032`
  - For valid-grouping questions, build one correct complete grouping first, then create wrong complete groupings that violate at least one stated rule.
  - Audit every option against capacity and together/apart rules; exactly one option may satisfy all rules.
  - A together-pair can be valid in either labeled group if capacity is satisfied; do not treat the intended group placement as an extra hidden rule.

- `LOG_GR_L3_033`
  - Now rigid: only `VALID_GROUPING` with exactly 8 entities, 3 labeled groups sized 3/3/2, and exactly four non-capacity constraints.
  - Required constraint mix: same-group, apart/different-group, must-be-in-group, and cannot-be-in-group.
  - Wrong-option plan: one same-group violation, one must-be-in-group violation, and one apart/cannot-be-in-group violation; every wrong rationale must name at least one actual primary violated constraint.
  - Do not fail an otherwise unique item just because a wrong option has additional unstated violations; exhaustive violation listing is not required.
  - Audit all options against all capacity, inclusion, exclusion, and role constraints; a different grouping is still valid if it satisfies every stated rule.

- `LOG_GR_L3_034`
  - Rigid logic but shuffled surface: exactly 5 entities, 5 explicitly ordered roles, and 5 constraints that force a unique complete assignment.
  - Internal construction uses slots `P/Q/R/S/T`, variable anchor `k` from 1-4, and an explicit anchor table; surface names, role labels, constraint order, option order, and correct letter must vary.
  - The anchor table must be followed exactly. For example, if `k = 4`, `R` is assigned to `R2`, so the `R` exclusion must be `not R1 or R3`; excluding `R2` makes the item unsatisfiable.
  - Wrong-option plan: one immediate-after violation, one `R` exclusion violation, and one `S before R` or `T not middle remaining role` violation; every wrong rationale must name the violated constraint.
  - Rationale incompleteness is a repair note, not fatal, if exactly one option is valid and no rationale claims a distractor is valid.

- `LOG_CR_L2_037`
  - Now forward-chain only: positive starting fact triggers a two- or three-link conditional chain.
  - Removed contrapositive / `not C therefore not A` forms because the required operator is only `CONDITIONAL_CHAIN`, not `MODUS_TOLLENS`.
  - Wrong options should target partial chains, reversal errors, or unsupported conclusions.

- `LOG_BL_L1_040`
  - Now uses a rigid asymmetric two-person recipe to avoid symmetric cross-claim failures.
  - A says "A and B are different types"; B says "A is a liar"; the unique answer is A truth-teller and B liar.
  - Audit both possible one-truth-one-lie assignments; avoid cross-accusations where both swapped assignments survive or no assignment survives.

- `LOG_BL_L2_041`
  - Now rigid: exactly four mutually exclusive possibilities, exactly four ordinary statements, and exactly two true statements.
  - Avoid self-referential `Statement N is true/false` systems; use the fixed 0/1/2/3 truth-count split so only one selection gives exactly two true statements.
  - Correct true statement set is Statements 1 and 2; explanations should audit all four possibilities.

- `LOG_BL_L2_042`
  - Now two-person only with exactly one conditional claim and one non-conditional claim.
  - Avoid third-person status references unless a stronger template governs all statuses.
  - Audit all four assignments; wrong options are exhaustive assignments and do not need distinct misconception categories if each rationale names the exact statement conflict.
  - Metadata should include `TRUTH_TELLER_LIAR`, `CONDITIONAL_CLAIM`, `STATEMENT_CONSISTENCY`, `CASE_SPLIT`, and `UNIQUE_WORLD`.

- `LOG_BL_L3_043`
  - Now rigid: exactly three people, exactly one liar, and exactly three non-conditional claims.
  - Required recipe: A says "B is a liar"; B says "A is a liar"; C says "B is a truth-teller".
  - Unique world is A liar, B truth-teller, C truth-teller; audit all four options and reject any explanation that selects a contradicted option.

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
