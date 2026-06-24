# Logical Ability: Domains & Templates Summary

**Total:** 11 domains, 61 templates (L1, L2, L3 mix)

---

## Quick Overview by Domain

| # | Domain | Templates | L1 | L2 | L3 | Notes |
|----|--------|-----------|----|----|----|----|
| A | Series & Pattern Reasoning | 6 | 2 | 2 | 2 | Single rule → Multi-rule patterns |
| B | Analogies & Classification | 5 | 2 | 2 | 1 | Direct analogy → Hidden rule relationships |
| C | Logical Deductions | 6 | 2 | 2 | 2 | True/false → Multi-statement feasibility |
| D | Syllogisms | 5 | 2 | 2 | 1 | Basic syllogism → Must-be-true vs could-be-true |
| E | Ordering & Sequencing | 6 | 2 | 2 | 2 | Linear order → Multi-constraint positioning |
| F | Grouping & Assignment | 6 | 2 | 2 | 2 | Simple groups → Multi-constraint feasibility |
| G | Conditional Reasoning | 5 | 2 | 2 | 1 | If-then logic → Chained conditionals |
| H | Binary Logic & Truth/Lie | 4 | 1 | 2 | 1 | One truth-one lie → Deducing consistent world |
| I | Direction & Spatial Reasoning | 4 | 2 | 1 | 1 | Simple direction → Multi-path consistency |
| J | Input–Output / Rule Transformation | 4 | 1 | 2 | 1 | One-step → Infer rule and apply |
| K | Raven's Matrices & Inductive Reasoning | 10 | 3 | 3 | 4 | Single shape rule → Multi-constraint matrices |
| **TOTAL** | | **61** | **21** | **22** | **18** | — |

---

## Detailed Template Breakdown

### A) Series & Pattern Reasoning (6 templates)
**Purpose:** Identify rules in sequences, predict next terms, recognize patterns

1. **LOG_SR_L1_001** – Single visible rule series (e.g., 2, 4, 6, 8, ?)
2. **LOG_SR_L1_002** – Alternating pattern series (e.g., A, B, A, B, A, ?)
3. **LOG_SR_L2_003** – Two-layer numeric or symbolic series (e.g., +2, ×3, +2, ×3)
4. **LOG_SR_L2_004** – Alternating operations with position-based rule
5. **LOG_SR_L3_005** – Choose rule consistent with all terms (identify from options)
6. **LOG_SR_L3_006** – Predict future term after validating rule

**Parameters:** start value, rule type (arithmetic, geometric, alternating), complexity level

**Example (TCS Easy):** "Series: 5, 10, 15, 20, ?. Next term?" → 25 (obvious +5 rule)

**Example (GATE Hard):** "Series: 2, 5, 10, 17, 26, ?. Which rule? A) n²+1, B) n²+2, C) 2n+1, D) n+3. Predict next?" → Requires identifying pattern (n²+1) and extending

---

### B) Analogies & Classification (5 templates)
**Purpose:** Identify relationships, classify by attributes, find odd-one-out

7. **LOG_AN_L1_007** – Direct analogy (A:B :: C:?)
8. **LOG_AN_L1_008** – Odd-one-out (single attribute differentiates)
9. **LOG_AN_L2_009** – Multi-attribute analogy (multiple relationships)
10. **LOG_AN_L2_010** – Classification with competing attributes (not all items fit one rule)
11. **LOG_AN_L3_011** – Analogy based on hidden rule (not immediately obvious)

**Parameters:** item sets, relationship types, attribute complexity

**Example (TCS Easy):** "Dog:Animal :: Rose:? A) Plant, B) Flower, C) Color, D) Green" → Plant (direct hierarchy)

**Example (GATE Hard):** "Find odd-one-out: A) 24, B) 32, C) 40, D) 50. Attributes: divisible by 8 (A,B,C), but also even (all). Hidden rule: divisible by 8 AND sum of digits divisible by 3 (only A,B,C)?" → Multi-attribute evaluation

---

### C) Logical Deductions (Statements & Conclusions) (6 templates)
**Purpose:** Evaluate logical validity, draw conclusions, test feasibility

12. **LOG_LD_L1_012** – Simple true/false deduction (one statement, obvious conclusion)
13. **LOG_LD_L1_013** – Identify valid conclusion (from straightforward premises)
14. **LOG_LD_L2_014** – Select correct inference from multiple statements
15. **LOG_LD_L2_015** – Eliminate invalid conclusions
16. **LOG_LD_L3_016** – Determine which conclusion MUST follow (strict logic)
17. **LOG_LD_L3_017** – Feasibility under combined statements (is outcome possible?)

**Parameters:** statement count (2–4), complexity (negations, quantifiers), conclusion set

**Example (TCS Easy):** "All engineers are problem-solvers. Raj is an engineer. Conclusion: Raj is a problem-solver?" → True (direct application)

**Example (GATE Hard):** "Some A are not B. All B are C. No C are D. Can X be both A and D? A) Must be true, B) Must be false, C) Cannot determine, D) Possibly" → Requires building mental model of constraints

---

### D) Syllogisms (5 templates)
**Purpose:** Evaluate logical syllogisms, distinguish necessary vs possible conclusions

18. **LOG_SY_L1_018** – Basic syllogism (All X are Y, All Y are Z → All X are Z)
19. **LOG_SY_L1_019** – Syllogism with negation (All/No/Some patterns)
20. **LOG_SY_L2_020** – Multi-statement syllogism (3+ premises)
21. **LOG_SY_L2_021** – Syllogism with conclusion set (pick valid conclusion)
22. **LOG_SY_L3_022** – Must-be-true vs could-be-true (distinction critical)

**Parameters:** statement types (universal, particular, negative), conclusion options

**Example (TCS Easy):** "All birds have wings. All eagles are birds. All eagles have wings?" → True

**Example (GATE Hard):** "Some engineers are MBA holders. All MBA holders are professionals. Some professionals are from Mumbai. Which must be true? A) Some engineers are professionals, B) Some professionals are engineers, C) Some MBA holders are from Mumbai, D) None necessarily follow" → Requires careful logical evaluation

---

### E) Ordering & Sequencing (6 templates)
**Purpose:** Rank items, determine sequences, resolve ordering constraints

23. **LOG_OR_L1_023** – Simple linear ordering (A taller than B, B taller than C → rank)
24. **LOG_OR_L1_024** – Ranking from relations (direct inference)
25. **LOG_OR_L2_025** – Ordering with single constraint (A before B, but C also before B)
26. **LOG_OR_L2_026** – Ordering with exclusion constraint (A not adjacent to B)
27. **LOG_OR_L3_027** – Multi-constraint ordering feasibility (multiple rules apply)
28. **LOG_OR_L3_028** – Deduce exact position (determine where X sits among 5 people)

**Parameters:** item count (3–6), constraint count (1–4), constraint types (before/after, adjacent, etc.)

**Example (TCS Easy):** "A taller than B. B taller than C. Rank A, B, C from tallest to shortest?" → A, B, C

**Example (GATE Hard):** "5 people sit in a row. A before B, B before C. D not adjacent to E. E not adjacent to A. A not at ends. Determine exact order?" → Multi-constraint puzzle requiring systematic solving

---

### F) Grouping & Assignment (6 templates)
**Purpose:** Form groups, assign items to categories, manage capacity constraints

29. **LOG_GR_L1_029** – Simple grouping (distribute 6 items into 2 groups of 3)
30. **LOG_GR_L1_030** – One-to-one assignment (match 4 people to 4 roles)
31. **LOG_GR_L2_031** – Grouping with capacity constraint (max 3 per group)
32. **LOG_GR_L2_032** – Grouping with inclusion/exclusion rules (X must be with Y, Z cannot be with Y)
33. **LOG_GR_L3_033** – Feasible grouping under multiple constraints
34. **LOG_GR_L3_034** – Unique valid assignment (only one solution satisfies all rules)

**Parameters:** items/people count (4–8), group count (2–4), rule count (1–4)

**Example (TCS Easy):** "4 people: A, B, C, D. Pair them. How many ways?" → 3 ways (AB+CD, AC+BD, AD+BC)

**Example (GATE Hard):** "8 people form 2 teams of 4. A&B must be together. C&D must be apart. E cannot be with A. Form valid team. How many solutions?" → Constraint satisfaction problem

---

### G) Conditional Reasoning (5 templates)
**Purpose:** Evaluate if-then logic, necessary vs sufficient conditions, chained conditionals

35. **LOG_CR_L1_035** – Direct if-then reasoning (If A then B. A is true → B is true)
36. **LOG_CR_L1_036** – Necessary vs sufficient conditions (distinguish clearly)
37. **LOG_CR_L2_037** – Chained conditional reasoning (If A then B. If B then C. A true → C true?)
38. **LOG_CR_L2_038** – Condition with exception (If A then B, except when C)
39. **LOG_CR_L3_039** – Scenario feasibility under conditions (Is this outcome possible?)

**Parameters:** condition count (1–4), chain length (1–3), exception rules

**Example (TCS Easy):** "If it rains, the match is cancelled. It rained. Conclusion: Match is cancelled?" → True (direct application)

**Example (GATE Hard):** "If A then B. If B then C. If C then D. NOT D. What can we conclude? A) NOT C, B) NOT B, C) NOT A, D) All of the above" → Requires logical contraposition

---

### H) Binary Logic & Truth/Lie (4 templates)
**Purpose:** Identify liars/truth-tellers, deduce consistent scenarios

40. **LOG_BL_L1_040** – One truth-one lie (two people, one always lies, one always tells truth)
41. **LOG_BL_L2_041** – Fixed number of true statements (3 statements, exactly 2 are true)
42. **LOG_BL_L2_042** – Truth/lie with conditional claims (statements contain if-then)
43. **LOG_BL_L3_043** – Deduce internally consistent world (determine who lies given constraints)

**Parameters:** person count (2–4), truth-lie mix, statement count (2–4)

**Example (TCS Easy):** "Two people: Truth-teller and Liar. Truth-teller: 'I'm honest.' Liar: 'I'm honest.' Who says what?" → Both claim honesty (truth-teller always true, liar always lies)

**Example (GATE Hard):** "3 people: A, B, C. A says 'B and C are truth-tellers.' B says 'A and C are liars.' C says 'Either I'm a truth-teller OR A is a liar.' Deduce who is what?" → Complex constraint satisfaction

---

### I) Direction & Spatial Reasoning (4 templates)
**Purpose:** Track movement, relative positions, spatial relationships

44. **LOG_SP_L1_044** – Simple directional movement (North 5m, East 3m. Net direction?)
45. **LOG_SP_L1_045** – Final direction after turns (Start facing North, turn left, turn right, final direction?)
46. **LOG_SP_L2_046** – Relative positions (A sits to the right of B. C sits opposite A. Where is C relative to B?)
47. **LOG_SP_L3_047** – Multi-path spatial consistency (If A goes path 1 and B goes path 2, do they meet?)

**Parameters:** grid size (3×3 to 5×5), movement instructions (count: 3–6), direction changes

**Example (TCS Easy):** "North 4 steps, East 3 steps. Distance from start?" → 5 steps (3-4-5 triangle)

**Example (GATE Hard):** "Start at center, go North 2, West 3, South 1. Then turn to face direction where East is your right. Go forward 2 steps. Final position?" → Requires tracking orientation and position simultaneously

---

### J) Input–Output / Rule Transformation (4 templates)
**Purpose:** Identify transformation rules, apply rules to new inputs

48. **LOG_IO_L1_048** – One-step transformation (Input: 5 → Output: 10. Rule: multiply by 2)
49. **LOG_IO_L2_049** – Multi-step fixed rule (Input: 7 → Step 1: ×2=14 → Step 2: +3=17)
50. **LOG_IO_L2_050** – Conditional transformation rule (If input is even, ×2; if odd, +3)
51. **LOG_IO_L3_051** – Infer rule and apply (Given 5 examples, identify rule, apply to new input)

**Parameters:** rule complexity (arithmetic, conditional, multi-step), input-output pairs (3–5)

**Example (TCS Easy):** "Rule: triple the number and subtract 1. Input: 4. Output?" → 11

**Example (GATE Hard):** "Given: 2→5, 3→10, 4→17, 5→26, 6→37. Identify rule. Apply to 7?" → Rule is (n²+1), so 7→50. Requires pattern recognition

---

### K) Raven's Progressive Matrices & Inductive Reasoning (10 templates)
**Purpose:** Assess abstract, non-verbal reasoning, visual pattern induction

These are context-free, purely abstract visual reasoning tasks.

#### L1 – Single-rule induction (3 templates)

52. **LOG_RM_L1_052** – Shape count progression (e.g., 1 shape, 2 shapes, 3 shapes, ?)
53. **LOG_RM_L1_053** – Rotation or orientation progression (shape rotates 90° each step)
54. **LOG_RM_L1_054** – Add/remove element rule (square → square+triangle → square+triangle+circle)

**Example:** 2×2 matrix with 3 cells filled. Missing cell should have how many shapes? → Count in row/column to identify pattern

#### L2 – Dual-rule induction (3 templates)

55. **LOG_RM_L2_055** – Row rule + column rule (each row has increasing count, each column rotates)
56. **LOG_RM_L2_056** – Transformation + position dependency (shape changes AND moves across cells)
57. **LOG_RM_L2_057** – Overlay / XOR-style visual logic (layers combine, certain pixels stay)

**Example:** 3×3 matrix. Row pattern: shapes increase. Column pattern: shapes rotate. Missing cell at (3,3) must satisfy both → Requires tracking two independent rules

#### L3 – Multi-constraint matrices (4 templates)

58. **LOG_RM_L3_058** – Three-axis consistency (rows, columns, AND diagonals all have rules)
59. **LOG_RM_L3_059** – Eliminate partially fitting rules (options A, B, C each satisfy only some rules)
60. **LOG_RM_L3_060** – Feasibility: which option can complete the matrix (satisfies all row/col/diagonal rules)
61. **LOG_RM_L3_061** – Uniqueness: only one option satisfies all constraints (others break at least one rule)

**Example (GATE Hard):** 3×3 Raven matrix where:
- Rows: 1st has 1, 2, 3 shapes; 2nd has 2, 3, 4; 3rd has 3, 4, ?
- Cols: 1st all filled; 2nd all outlined; 3rd alternates
- Diagonals: shapes rotate 45° each step

Only one option fits all constraints → Pure abstract reasoning, no language, minimal cultural bias

---

## Parameter Envelopes (Structural, Not Numeric)

### Non-Engineering (TCS Easy)
- **Entity count:** 3–5 (people, items, rules)
- **Constraint count:** 1–2 (simple, independent)
- **Statement complexity:** Single negation max, clear quantifiers (All/Some/No)
- **Example:** "All engineers work hard. Raj is an engineer. Does Raj work hard?" → Direct deduction

### Engineering (GATE/GMAT Hard)
- **Entity count:** 5–8 (people, items, complex relationships)
- **Constraint count:** 3–4 (interlinked constraints)
- **Statement complexity:** Multiple negations, nested logic, exceptions
- **Example:** "Some engineers don't work hard. All hard-workers get promoted. Can an engineer avoid promotion?" → Requires careful logical evaluation

---

## Summary Stats

| Metric | Value |
|--------|-------|
| **Total Templates** | 61 |
| **L1 Templates** | 21 (~34%) |
| **L2 Templates** | 22 (~36%) |
| **L3 Templates** | 18 (~30%) |
| **Domains** | 11 |
| **Est. Questions/Month** | 700 (35% of 2,000) |
| **Monthly Distribution** | 40% L1, 45% L2, 15% L3 |
| **Raven Matrices** | 10 templates (context-free, cultural bias minimized) |

---

## How They Map to n8n Pipeline

**Template Storage:** All 61 templates stored as immutable JSON

**Parameter Envelopes:** Structural constraints (entity count, rule complexity, statement types)

**Context Variants:** Same template → 2 envelopes (Non-Eng easy, Eng hard)

**Monthly Generation:**
- Pick 35% logical from these 61 templates
- Sample structural parameters monthly (different rule combinations, statement variations)
- Keep template structure frozen → consistent quality/difficulty
- Rotate contexts to avoid repetition

---

## Verification Logic (Logical Ability)

**For Deduction/Syllogism/Conditional:**
- Rule engine checks: Can conclusion be derived from statements?
- Detect: Multiple valid conclusions (ambiguous) → reject
- Validate: Exactly one conclusion logically follows

**For Series/Pattern:**
- Rule matcher identifies pattern
- Predicts next term
- Checks if answer is unique and mathematically sound

**For Ordering/Grouping:**
- Constraint solver (CSP) tests: Does solution satisfy all constraints?
- Detect: Infeasible ordering → reject
- Validate: Only one valid ordering/grouping exists

**For Raven Matrices:**
- Visual rule extractor identifies transformations (rotation, scaling, position, overlay)
- Checks: Do all row/column/diagonal rules align?
- Validates: Only one option satisfies all constraints

---

## Key Differences from Numerical Ability

| Aspect | Numerical | Logical |
|--------|-----------|---------|
| **Parameters** | Numeric (ranges) | Structural (entities, constraints) |
| **Verification** | Math solver (SymPy) | Rule/constraint engine (logic rules) |
| **Ambiguity** | Multiple correct answers | Multiple interpretations |
| **Context** | Deeply changes (numbers) | Lightly changes (nouns, relationships) |
| **Raven Matrices** | None | 10 templates (integral) |

---

**Ready to implement? Use this as your template reference during n8n setup.** 🎯
