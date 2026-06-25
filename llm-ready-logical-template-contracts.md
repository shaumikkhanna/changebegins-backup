# LLM-Ready Logical Reasoning Template Contracts: Domains A-K

Use this file directly as generation guidance for logical reasoning questions. The LLM's job is to instantiate the selected template, not to invent the difficulty.

For every generation request, first select or receive a `template_id`. Then obey the corresponding contract exactly.

---

## Global Generation Rules

### The LLM Must Preserve

- `template_id`
- `domain`
- `difficulty_level`
- required `reasoning_operators`
- answer mode
- number of correct answers
- logical structure
- validator expectations

### The LLM May Vary

- names, labels, objects, and non-essential surface context
- order of options
- natural language wording
- harmless story dressing
- numeric values within the allowed bounds

### The LLM Must Not Do

- Do not increase difficulty by adding more entities, bigger numbers, or longer wording alone.
- Do not introduce external knowledge.
- Do not use ambiguous words such as `usually`, `probably`, `near`, `many`, `few`, or `around` unless the template defines them.
- Do not create multiple defensible answers unless the answer mode explicitly asks for all possible answers.
- Do not use a reasoning operator that is not listed in the selected template.
- Do not make the explanation rely on assumptions not stated in the question.
- Do not hide an extra rule in the surface context.

### Required Output Format

Return every generated item in this structure:

```json
{
	"template_id": "",
	"domain": "",
	"difficulty_level": "",
	"reasoning_operators": [],
	"answer_mode": "",
	"question": "",
	"options": {
		"A": "",
		"B": "",
		"C": "",
		"D": ""
	},
	"correct_option": "",
	"correct_answer": "",
	"explanation": "",
	"option_rationales": {
		"A": "",
		"B": "",
		"C": "",
		"D": ""
	},
	"validation_notes": {
		"unique_answer": true,
		"no_external_knowledge": true,
		"difficulty_source": ""
	}
}
```

If the question is not multiple choice, still provide four options unless the calling pipeline explicitly says otherwise.

### Option and Distractor Design Rules

Every wrong option must represent a meaningful mistake a test-taker might make. Do not use random, silly, obviously impossible, or unrelated distractors.

For every generated question:

- Include exactly one correct option.
- Include three wrong options based on three different error types.
- Keep all options similar in length, format, and plausibility.
- Do not make the correct option the only precise or formally worded option.
- Do not use options such as `all of the above`, `none of the above`, `cannot say`, or `data insufficient` unless the selected answer mode explicitly permits them.
- Do not create distractors that are true under a different interpretation of an ambiguous question. Fix the question instead.
- Do not create two distractors from the same mistake pattern unless the template explicitly asks for close numerical distractors.
- The `option_rationales` field must explain why each option is correct or what mistake produces it.

Use this distractor taxonomy:

| Distractor Type       | Meaning                                                                           |
| --------------------- | --------------------------------------------------------------------------------- |
| `NEAR_MISS`           | Almost correct, but one step, term, relation, or condition is mishandled          |
| `PARTIAL_REASONING`   | Uses only part of the information and ignores a needed constraint                 |
| `WRONG_OPERATOR`      | Applies the wrong rule type, relation, quantifier, or transformation              |
| `REVERSAL_ERROR`      | Reverses direction, order, implication, class inclusion, or analogy relation      |
| `OVERGENERALIZATION`  | Treats `some` as `all`, possibility as certainty, or one example as a rule        |
| `UNDERGENERALIZATION` | Fails to chain information that must be combined                                  |
| `ARITHMETIC_SLIP`     | Makes a small calculation/projection error after choosing the right rule          |
| `SURFACE_MATCH`       | Matches visible wording or familiar association while missing the formal relation |

At least two wrong options should be plausible to a student who has partially understood the question. At least one wrong option should catch the most common misconception for that template.

---

# Domain A: Series & Pattern Reasoning

## Domain Purpose

Test whether the student can infer a rule governing an ordered sequence and use that rule to identify a missing, next, future, or governing term.

## Domain Operators

| Operator                  | Meaning                                                  |
| ------------------------- | -------------------------------------------------------- |
| `CONSTANT_STEP`           | Same addition or subtraction applied each time           |
| `CONSTANT_RATIO`          | Same multiplication or division applied each time        |
| `CYCLIC_TOKEN`            | Fixed repeating token cycle                              |
| `ALTERNATING_RULES`       | Two simple rules alternate by odd/even position          |
| `POSITION_DEPENDENT_STEP` | Difference or transformation depends on term index       |
| `COMPOSED_STEP`           | Same two-operation transformation repeats                |
| `RULE_VALIDATION`         | Student must select or validate a rule against all terms |
| `MULTI_STEP_PROJECTION`   | Student must project more than one term ahead            |

## Domain-Wide Rules

- Difficulty must come from rule structure, not arithmetic burden.
- The intended rule must be explicitly nameable.
- Exactly one answer choice must be correct.
- Avoid advanced math unless the selected template explicitly allows it.
- Sequence values should usually remain between `-100` and `300`.

## Domain Option Rules

Series distractors must be generated from plausible rule mistakes:

- `ARITHMETIC_SLIP`: correct rule, but one small calculation error.
- `WRONG_OPERATOR`: use multiplication instead of addition, addition instead of multiplication, or constant step instead of position-dependent step.
- `PARTIAL_REASONING`: use only the first two transitions and ignore later terms.
- `REVERSAL_ERROR`: apply the change in the wrong direction.
- `NEAR_MISS`: give the immediate next term when the question asks for a later future term.

Avoid options that are far outside the scale of the sequence unless the wrong rule naturally produces them.

---

## LOG_SR_L1_001: Single Visible Rule Series

```yaml
domain: Series & Pattern Reasoning
difficulty_level: L1
answer_mode: NEXT_TERM or MISSING_TERM
required_operators:
    - exactly one of: CONSTANT_STEP, CONSTANT_RATIO
sequence_length: 4-6 visible terms
allowed_values:
    additive_step: 1-12
    multiplicative_ratio: 2, 3, or 4
```

### Contract

Generate a sequence where every adjacent transition uses the same operation. The rule must be obvious after checking two transitions.

### Allowed Variations

- addition, subtraction, multiplication, or division
- final missing term or one simple internal missing term
- numeric surface wording

### Forbidden

- long arithmetic

### Validator Must Check

- all adjacent differences or ratios are constant
- exactly one option equals the expected term
- no distractor fits a comparably simple alternate rule

### Example Skeleton

```text
Sequence: 7, 11, 15, 19, ?
Rule: add 4 each time.
Answer: 23
```

---

## LOG_SR_L1_002: Simple Alternating or Cyclic Pattern

```yaml
domain: Series & Pattern Reasoning
difficulty_level: L1
answer_mode: NEXT_TERM or MISSING_TERM
required_operators:
    - CYCLIC_TOKEN
cycle_length: 2-3
visible_cycles:
    NEXT_TERM: at least 2 full visible cycles before answer point
    MISSING_TERM: enough visible terms before and/or after the blank to make the cycle unique
```

### Contract

Generate a directly visible repeating cycle. The answer must be determined only by position in the cycle.

### Allowed Variations

- letters, simple numbers, symbols, colors, or shape names
- cycle length 2 or 3
- missing term at the end or inside the pattern

### Forbidden

- arithmetic transformations
- alphabet jumps
- semantic/category knowledge
- similar-looking symbols that create ambiguity

### Validator Must Check

- token cycle repeats consistently
- answer follows from cycle index
- for `NEXT_TERM`, at least two full cycles are visible before the answer point
- for internal `MISSING_TERM`, the blank may appear before two full cycles if visible terms on both sides make the cycle unique
- distractors are plausible tokens but wrong for that position

### Example Skeleton

```text
Sequence: Red, Blue, Red, Blue, Red, ?
Rule: repeat Red-Blue.
Answer: Blue
```

---

## LOG_SR_L2_003: Two-Layer Numeric or Symbolic Series

```yaml
domain: Series & Pattern Reasoning
difficulty_level: L2
answer_mode: NEXT_TERM or MISSING_TERM
required_operators:
    - ALTERNATING_RULES
sequence_length: 5-7 visible terms
rule_count: exactly 2
alternation_basis: odd/even positions only
```

### Contract

Generate a sequence where odd-position terms follow one simple rule and even-position terms follow another simple rule. The student must split the sequence by position.

### Allowed Variations

- addition, subtraction, multiplication by 2 or 3, or clean division by 2
- simple ordered-symbol progressions, such as letters moving forward or backward by 1 position
- missing term in odd or even position
- numeric or simple symbolic terms

### Forbidden

- more than two rules
- irregular alternation
- rule changes halfway through
- a single L1 rule that explains the full sequence

### Validator Must Check

- odd-position subsequence follows one rule
- even-position subsequence follows another rule
- symbolic subsequences may use simple ordered progression, such as A-B-C or X-W-V, if the order is stated or culturally standard and no external semantic knowledge is needed
- missing term is derived from the correct subsequence
- no simpler single rule explains the whole sequence

### Example Skeleton

```text
Sequence: 3, 20, 6, 16, 9, 12, ?
Rule: odd positions add 3; even positions subtract 4.
Answer: 12
```

---

## LOG_SR_L2_004: Alternating Operations With Position-Based Rule

```yaml
domain: Series & Pattern Reasoning
difficulty_level: L2
answer_mode: NEXT_TERM
required_operators:
    - exactly one of: ALTERNATING_RULES, POSITION_DEPENDENT_STEP, COMPOSED_STEP
sequence_length: 5-7 visible terms
```

### Contract

Generate a sequence whose transition pattern is simple but not L1. The rule may alternate, depend on position, or repeat a fixed two-operation transformation.

### Allowed Variations

- increasing differences such as `+2, +4, +6, +8`
- alternating operations such as `+3, x2, +3, x2`
- composed operation such as `x2 + 1` repeated

### Forbidden

- combining multiple L2 operators unless explicitly requested
- hidden exceptions
- arithmetic-heavy values
- multiple reasonable continuations

### Validator Must Check

- declared operator explains every transition
- next term is unique
- sequence is not explainable by an L1 rule

### Example Skeleton

```text
Sequence: 4, 6, 10, 16, 24, ?
Rule: add consecutive even numbers: +2, +4, +6, +8, then +10.
Answer: 34
```

---

## LOG_SR_L3_005: Choose Rule Consistent With All Terms

```yaml
domain: Series & Pattern Reasoning
difficulty_level: L3
answer_mode: RULE_SELECTION
required_operators:
    - RULE_VALIDATION
optional_operators:
    - POSITION_DEPENDENT_STEP
sequence_length: 5-7 visible terms
options: exactly 4 candidate rules
correct_rules: exactly 1
```

### Contract

Generate a sequence and four candidate rules. Exactly one rule must fit every visible term. Wrong options should look plausible from part of the sequence but fail somewhere.

### Allowed Variations

- verbal rule descriptions or simple formulas
- arithmetic, position-dependent, or simple polynomial-style rules
- plausible distractor rules

### Forbidden

- two rules that both fit all terms
- distractors that are obviously unrelated
- asking for the next term instead of rule selection
- advanced notation beyond the exam level

### Validator Must Check

- correct rule fits all visible terms
- each distractor fails at least one visible term
- exactly one rule is valid
- full-sequence validation is required

### Example Skeleton

```text
Sequence: 2, 5, 10, 17, 26
Correct rule: nth term is n^2 + 1.
```

---

## LOG_SR_L3_006: Predict Future Term After Validating Rule

```yaml
domain: Series & Pattern Reasoning
difficulty_level: L3
answer_mode: FUTURE_TERM
required_operators:
    - RULE_VALIDATION
    - MULTI_STEP_PROJECTION
sequence_length: 5-7 visible terms
projection_distance: exactly 2 steps beyond final visible term
options: exactly 4
```

### Contract

Generate a sequence where the student must infer or validate the rule, then project beyond the immediate next term. Do not state the rule in the question stem.

Use this construction recipe exactly:

1. Choose a small integer constant `c` from 1 to 9.
2. Generate exactly six visible terms using `term(n) = n^2 + c` for `n = 1` through `6`.
3. Ask: "What is the 8th term in the sequence?"
4. Compute the immediate next term separately: `term(7) = 49 + c`. This must be a `NEAR_MISS` distractor, not the correct answer.
5. Compute the correct projected term: `term(8) = 64 + c`.
6. Include `term(8)` as exactly one option, and align `correctAnswer`, `metadata.correct_answer`, explanation, and option rationales to that same value.
7. Use the other two distractors for plausible arithmetic or rule mistakes, not random values.

### Allowed Variations

- ask for the 8th term after showing exactly six visible terms
- include answer choices that reflect common errors
- use the formula-based square-plus-constant rule from the construction recipe

### Forbidden

- stating the rule in the question stem
- wording the target as "after two more steps"; ask for the numbered 8th term instead
- asking only for the immediate next term
- tedious arithmetic
- ambiguous rule selection
- multiple correct projections
- omitting the correct projected term from the options
- keying the immediate next term as the correct answer
- mismatch between `correctAnswer`, `metadata.correct_answer`, explanation, and option rationales
- self-correction text such as `Wait`, `Actually`, `Correction`, or question-marked computations in the explanation

### Validator Must Check

- intended rule fits all visible terms
- question stem does not reveal the rule
- requested term is the 8th term, not the immediate next 7th term
- projection is correct
- exactly one option matches
- the immediate next 7th term appears only as a distractor
- all answer fields and rationales agree on the same correct projected value
- explanation is final and clean, with no self-correction text

### Example Skeleton

```text
Sequence: 4, 7, 12, 19, 28, 39
Question target: 8th term.
Rule used in explanation: nth term is n^2 + 3.
Answer: 67
```

---

# Domain B: Analogies & Classification

## Domain Purpose

Test whether the student can identify relationships between items, compare attributes, and classify items using explicit or inferable rules.

## Domain Operators

| Operator                  | Meaning                                                    |
| ------------------------- | ---------------------------------------------------------- |
| `DIRECT_RELATION`         | One clear relation connects pair or class                  |
| `CATEGORY_MEMBERSHIP`     | Item belongs to a broader category                         |
| `SINGLE_ATTRIBUTE_ODDITY` | One item differs by one visible attribute                  |
| `DUAL_RELATION`           | Two relations must both hold                               |
| `COMPETING_ATTRIBUTES`    | Multiple plausible attributes must be compared             |
| `HIDDEN_STRUCTURAL_RULE`  | Rule is not the most obvious attribute but is still formal |
| `DISTRACTOR_CONTROL`      | Options include plausible but invalid relation matches     |

## Domain-Wide Rules

- Use relationships that do not require niche world knowledge.
- Prefer formal, observable, or commonly known relations.
- The correct answer must be based on the stated or visible item properties.
- Difficulty must come from number/type of attributes, not obscure vocabulary.
- Avoid culturally specific examples unless the pipeline explicitly targets that context.

## Domain Option Rules

Analogy and classification distractors must reflect plausible relation mistakes:

- `SURFACE_MATCH`: shares an obvious surface category but not the intended relation.
- `PARTIAL_REASONING`: satisfies one attribute in a multi-attribute item but fails another.
- `REVERSAL_ERROR`: reverses the analogy relation, such as category-to-member instead of member-to-category.
- `WRONG_OPERATOR`: uses a different relation type, such as function instead of location.
- `OVERGENERALIZATION`: chooses an item that broadly fits the theme but not the precise rule.

For analogy questions, at least one distractor should match the source item on a visible attribute while failing the relation. For odd-one-out questions, distractors should be items that could look odd under a rejected attribute, but only one option may be defensible under the stated/intended rule.

---

## LOG_AN_L1_007: Direct Analogy

```yaml
domain: Analogies & Classification
difficulty_level: L1
answer_mode: COMPLETE_ANALOGY
required_operators:
    - DIRECT_RELATION
relation_count: exactly 1
options: exactly 4
```

### Contract

Generate an analogy of the form `A is to B as C is to ?` where one clear relation maps both pairs.

### Allowed Relations

- object to category
- part to whole
- tool to function
- worker to workplace
- synonym or antonym using simple words

### Forbidden

- more than one required relationship
- obscure vocabulary
- subjective associations
- options that could be defended under a different relation

### Validator Must Check

- relation between A and B is explicit and common
- same relation maps C to exactly one option
- no option fits a different equally plausible relation

### Example Skeleton

```text
Bird : Nest :: Bee : ?
Relation: creature to typical dwelling.
Answer: Hive
```

---

## LOG_AN_L1_008: Odd-One-Out With Single Attribute

```yaml
domain: Analogies & Classification
difficulty_level: L1
answer_mode: ODD_ONE_OUT
required_operators:
    - SINGLE_ATTRIBUTE_ODDITY
item_count: 4
differentiating_attributes: exactly 1
```

### Contract

Generate four items where three share one visible/simple attribute and one does not.

### Allowed Attributes

- simple divisibility
- shape sides
- broad category
- simple word property such as starts with same letter

### Forbidden

- multiple possible odd items
- hidden or obscure property
- attribute requiring specialist knowledge
- all items sharing the obvious attribute while only a subtle fact differs

### Validator Must Check

- exactly three items share the intended attribute
- exactly one item lacks it
- no second attribute creates another defensible odd item

### Example Skeleton

```text
Items: 12, 18, 24, 25
Shared attribute: divisible by 6.
Odd item: 25
```

---

## LOG_AN_L2_009: Multi-Attribute Analogy

```yaml
domain: Analogies & Classification
difficulty_level: L2
answer_mode: COMPLETE_ANALOGY
required_operators:
    - DUAL_RELATION
    - DISTRACTOR_CONTROL
relation_count: exactly 2
options: exactly 4
```

### Contract

Generate an analogy where the correct option must satisfy two relations, not just one.

### Allowed Relation Pairings

- category + function
- part-whole + location
- sequence position + category
- symbol transformation + attribute preservation

### Forbidden

- relations that depend on trivia
- options where one distractor satisfies both relations
- requiring three or more relationships
- ambiguous relation priority

### Validator Must Check

- A:B pair demonstrates two relations
- C:correct option preserves both relations
- each distractor fails at least one relation
- at least one distractor should satisfy only one relation

### Example Skeleton

```text
Spoon : Cutlery :: Hammer : ?
Relations: item belongs to a tool/category group and is used for a common function.
Correct answer: Tool
```

The final generated item should make both relations necessary; do not let one relation alone solve it.

---

## LOG_AN_L2_010: Classification With Competing Attributes

```yaml
domain: Analogies & Classification
difficulty_level: L2
answer_mode: ODD_ONE_OUT or GROUP_MATCH
required_operators:
    - COMPETING_ATTRIBUTES
    - DISTRACTOR_CONTROL
item_count: 4-5
relevant_attributes: exactly 2
```

### Contract

Generate a classification item where multiple attributes are visible, but only the intended attribute combination determines the answer.

### Allowed Attribute Types

- divisibility by an odd number plus parity
- shape type plus fill/outline
- word length plus starting/ending letter
- category plus function

### Forbidden

- arbitrary hidden facts
- more than two relevant attributes
- an answer that depends on taste or convention
- options where two items are equally odd
- the answer being the only option having a different parity to the others
- explanation text that corrects itself, mentions a different option, or refers to an option not actually present

### Validator Must Check

- all items can be evaluated on both attributes
- exactly one item fails the intended attribute combination
- competing attributes do not produce another valid answer
- for numeric parity/divisibility items, the divisor is odd so parity is an independent second attribute
- explanation, correctAnswer, correct_answer, options, and option_rationales all refer to the same actual option

### Example Skeleton

```text
Question: Which option is the odd one out? The intended group consists of items that are writing tools and are used for making marks on paper.
Options: Pencil, Pen, Marker, Eraser
Answer: Eraser
Explanation: Pencil, Pen, and Marker are writing tools used to make marks on paper. Eraser is related to writing but removes marks instead of making them.
```

---

## LOG_AN_L3_011: Analogy Based on Hidden Formal Rule

```yaml
domain: Analogies & Classification
difficulty_level: L3
answer_mode: COMPLETE_ANALOGY or ODD_ONE_OUT
required_operators:
    - HIDDEN_STRUCTURAL_RULE
    - DISTRACTOR_CONTROL
rule_count: exactly 1 hidden formal rule
options: exactly 4
```

### Contract

Generate an analogy or classification item where the correct rule is not the most obvious surface relation but is still formal, checkable, and fair.

### Allowed Hidden Rules

- letter-position transformation using simple alphabet positions
- shape transformation such as sides plus rotation
- word structure such as first-last letter relation

### Forbidden

- trivia
- cultural associations
- advanced mathematics
- digit-sum, factor-count, or divisibility hidden rules
- rules that are merely clever but not discoverable
- multiple hidden rules producing different answers
- explanation text that corrects itself, changes the rule mid-explanation, or mentions a better rule after rejecting the first one
- odd-one-out options where the explanation initially claims a false property about an option
- palindrome or word-structure odd-one-out sets where the correct answer is also the only option with a different first letter, last letter, word length, or obvious surface cue

### Validator Must Check

- hidden rule applies to all given examples
- exactly one option satisfies the rule
- distractors satisfy obvious but incorrect surface relations
- explanation reveals a fair solving path
- explanation, correctAnswer, correct_answer, options, and option_rationales all use the same single hidden rule
- every stated property of every option is true
- for palindrome or word-structure odd-one-out items, surface cues such as first letter, last letter, and word length do not create another defensible odd item

### Example Skeleton

```text
MOP : POP :: RAT : ?
Rule: replace the first letter with the last letter; keep the middle and last letters unchanged.
Options: TAR, TAT, PAT, RAP
Answer: TAT
```

---

# Domain C: Logical Deductions

## Domain Purpose

Test whether the student can evaluate conclusions from statements using strict logical validity, not real-world plausibility.

## Domain Operators

| Operator               | Meaning                                               |
| ---------------------- | ----------------------------------------------------- |
| `DIRECT_INFERENCE`     | One premise directly supports conclusion              |
| `TWO_PREMISE_CHAIN`    | Conclusion follows by combining two premises          |
| `NEGATION_HANDLING`    | Student must handle `not`, `no`, or exclusion         |
| `QUANTIFIER_HANDLING`  | Student must interpret all/some/no/only               |
| `INVALID_ELIMINATION`  | Student must reject unsupported conclusions           |
| `MUST_FOLLOW`          | Conclusion must be true in all valid interpretations  |
| `POSSIBILITY_CHECK`    | Student checks whether an outcome can be true         |
| `COMBINED_CONSTRAINTS` | Multiple statements jointly constrain possible worlds |

## Domain-Wide Rules

- Treat statements as formal premises, even if they conflict with real-world knowledge.
- Do not use uncertain wording.
- Use simple entity labels or neutral categories.
- Prefer artificial or non-obvious category relationships so the student must reason from the premises rather than real-world knowledge.
- It is acceptable to use abstract predicates such as `happy`, `tagged`, `approved`, or `marked` with concrete categories, as long as the relationship is stated formally.
- Every conclusion must be evaluated only from the given statements.
- Distinguish clearly between `must be true`, `could be true`, `cannot be true`, and `cannot be determined`.

## Domain Option Rules

Logical deduction distractors must represent formal reasoning errors:

- `OVERGENERALIZATION`: treats `some` as `all`.
- `REVERSAL_ERROR`: reverses an implication or class inclusion.
- `UNDERGENERALIZATION`: fails to combine two premises that must be chained.
- `PARTIAL_REASONING`: uses one premise while ignoring another.
- `WRONG_OPERATOR`: treats `could be true` as `must be true`, or `unsupported` as `false`.
- `SURFACE_MATCH`: chooses a conclusion that sounds realistic but is not entailed.

For conclusion options, make each option a complete logical claim. Wrong options should usually be unsupported, contradicted, or modal-confused; the rationale must state which of those it is.

---

## LOG_LD_L1_012: Simple True/False Deduction

```yaml
domain: Logical Deductions
difficulty_level: L1
answer_mode: TRUE_FALSE
required_operators:
    - DIRECT_INFERENCE
premise_count: 1-2
conclusion_count: 1
options: exactly 4 truth-evaluation labels
```

### Contract

Generate a direct deduction where the conclusion follows immediately or is immediately contradicted.

Because the platform uses four options, present one conclusion and ask for its status. The four options should be truth-evaluation labels, with exactly one correct label:

- `True`
- `False`
- `Cannot be determined`
- one clearly invalid/confused evaluation such as `Sometimes True and sometimes False` or `True only in real life`

The correct answer must be either `True` or `False`; the other labels are distractors for modal confusion or real-world reasoning.

### Allowed Forms

- All A are B. X is A. Therefore X is B.
- No A are B. X is A. Therefore X is not B.
- If A then B. A occurred. Therefore B occurred.

### Forbidden

- `some` statements
- nested negation
- conclusions requiring multiple possible-world checks
- real-world assumptions
- answer options that are four different conclusions instead of four truth-evaluation labels
- making `Cannot be determined` the correct answer for this L1 template

### Validator Must Check

- conclusion is directly entailed or directly contradicted
- answer is unambiguous true/false
- no external knowledge is needed
- options are truth-evaluation labels, not competing conclusions
- `Cannot be determined` and any invalid/confused label are distractors, not the correct answer

### Example Skeleton

```text
Premises: No squares are happy. Shape X is a square.
Conclusion: Shape X is not happy.
Question: Based only on the statements, is the conclusion true or false?
Options: True, False, Cannot be determined, True only in real life
Answer: True
```

---

## LOG_LD_L1_013: Identify Valid Conclusion From Straightforward Premises

```yaml
domain: Logical Deductions
difficulty_level: L1
answer_mode: VALID_CONCLUSION
required_operators:
    - DIRECT_INFERENCE
premise_count: 2
options: exactly 4
valid_options: exactly 1
```

### Contract

Generate two straightforward premises and four possible conclusions. Exactly one conclusion must follow directly.

### Allowed Forms

- universal class inclusion
- direct membership
- simple if-then application

### Forbidden

- `some`/`only` unless explicitly simple
- negative distractors that require subtle reasoning
- multiple valid conclusions
- options that are true in the real world but unsupported by premises
- distractors that restate, weaken, or are logically entailed by the valid conclusion
- `only if` distractors when the premise already states the same implication

### Validator Must Check

- exactly one option follows from premises
- distractors are unsupported or contradicted
- explanation references only premises
- no distractor is equivalent to, weaker than, or directly entailed by the correct option
- if an option uses `only if`, verify its direction; `A only if B` means `if A then B`

### Example Skeleton

```text
Premises: All tablets are devices. All devices need charging.
Valid conclusion: All tablets need charging.
```

---

## LOG_LD_L2_014: Select Correct Inference From Multiple Statements

```yaml
domain: Logical Deductions
difficulty_level: L2
answer_mode: VALID_CONCLUSION
required_operators:
    - TWO_PREMISE_CHAIN
    - QUANTIFIER_HANDLING
premise_count: 2-3
options: exactly 4
valid_options: exactly 1
```

### Contract

Generate a deduction item where the correct conclusion requires combining at least two statements.

### Allowed Forms

- All A are B; all B are C; therefore all A are C.
- Some A are B; all B are C; therefore some A are C.
- No A are B; all C are A; therefore no C are B.

### Forbidden

- conclusion copied almost verbatim from a premise
- conclusions requiring more than one valid answer
- ambiguous use of `some`
- real-world plausibility as a distractor

### Validator Must Check

- correct option follows by chaining premises
- no other option must follow
- quantifiers are used correctly

### Example Skeleton

```text
Premises: Some books are manuals. All manuals are documents.
Conclusion that follows: Some books are documents.
```

---

## LOG_LD_L2_015: Eliminate Invalid Conclusions

```yaml
domain: Logical Deductions
difficulty_level: L2
answer_mode: INVALID_CONCLUSION or DOES_NOT_FOLLOW
required_operators:
    - INVALID_ELIMINATION
    - QUANTIFIER_HANDLING
premise_count: 2-3
conclusion_count: 3-4
```

### Contract

Generate a question where the student must identify which conclusion does not follow or which set of conclusions is valid.

### Allowed Forms

- all/some/no class statements
- one direct valid conclusion and several tempting invalid ones
- conclusion-set options such as `Only I follows`, `Only II follows`

### Forbidden

- more than one intended invalid answer when asking for a single invalid conclusion
- conclusion wording that changes the meaning subtly by accident
- unsupported conclusions that are obviously unrelated

### Validator Must Check

- each conclusion is independently evaluated
- answer key matches the validity of all conclusions
- unsupported does not mean contradicted unless explicitly stated

### Example Skeleton

```text
Premises: All roses are flowers. Some flowers fade quickly.
Invalid conclusion: Some roses fade quickly.
Reason: possible, but not guaranteed.
```

---

## LOG_LD_L3_016: Determine Which Conclusion Must Follow

```yaml
domain: Logical Deductions
difficulty_level: L3
answer_mode: MUST_FOLLOW
required_operators:
    - MUST_FOLLOW
    - QUANTIFIER_HANDLING
    - NEGATION_HANDLING
premise_count: 3-4
options: exactly 4
valid_options: exactly 1
```

### Contract

Generate a strict-logic item where the student must choose the conclusion true in every interpretation satisfying the premises.

### Allowed Forms

- combinations of all/some/no
- negative universal statements
- membership plus class constraints
- conclusion options mixing must/could/cannot claims

### Forbidden

- relying on diagrams that permit multiple correct options
- treating `some` as `all`
- treating possibility as necessity
- ambiguous conclusion wording

### Validator Must Check

- correct option is true in all models
- wrong options are either false in at least one model or unsupported
- exactly one option is a must-follow conclusion

### Example Skeleton

```text
Premises: All A are B. No B are C. Some D are A.
Must follow: Some D are not C.
```

---

## LOG_LD_L3_017: Feasibility Under Combined Statements

```yaml
domain: Logical Deductions
difficulty_level: L3
answer_mode: POSSIBLE_IMPOSSIBLE or COULD_BE_TRUE
required_operators:
    - POSSIBILITY_CHECK
    - COMBINED_CONSTRAINTS
premise_count: 3-4
options: exactly 4
```

### Contract

Generate a question asking whether a proposed situation is possible under all given statements.

For `COULD_BE_TRUE` items, possible means true in at least one satisfying model. A statement that is forced by the premises still qualifies as something that could be true.

### Allowed Forms

- class-membership constraints
- exclusion constraints
- some/all/no combinations
- one proposed entity membership to test

### Forbidden

- impossible premise sets unless the question explicitly tests inconsistency
- multiple options with the same status
- vague possibility wording
- hidden assumptions about actual categories

### Validator Must Check

- premises are jointly satisfiable
- proposed outcome is classified correctly as possible, impossible, must be true, or cannot be determined
- explanation uses a model or contradiction argument
- for `COULD_BE_TRUE`, do not reject an option merely because it is also entailed by the premises; must-true statements are still possible

### Example Skeleton

```text
Premises: All Daxes are marked. No marked things are Zins. Item Q is a Dax.
Question: Which proposed situation could be true under all the statements?
Answer: Item Q is marked.
Reason: The premises force Q to be marked, so the situation is possible under all statements.
```

---

# Domain D: Syllogisms

## Domain Purpose

Test formal reasoning from categorical statements, especially the distinction between necessary conclusions, possible conclusions, and invalid conclusions.

## Domain Operators

| Operator                    | Meaning                                      |
| --------------------------- | -------------------------------------------- |
| `UNIVERSAL_CHAIN`           | All A are B; all B are C                     |
| `NEGATIVE_RELATION`         | No A are B or some A are not B               |
| `PARTICULAR_RELATION`       | Some A are B                                 |
| `CONCLUSION_SET_EVALUATION` | Evaluate multiple numbered conclusions       |
| `MUST_VS_COULD`             | Distinguish necessary truth from possibility |
| `VENN_MODEL_CHECK`          | Use model-based validity checking            |

## Domain-Wide Rules

- Interpret categorical statements formally.
- Do not import real-world knowledge.
- Use neutral category labels when possible.
- Avoid accidental conversion errors unless they are intended distractors.
- Remember that universal negative statements convert validly: `No A are B` is equivalent to `No B are A`.
- Ensure exactly one answer choice is correct.

## Domain Option Rules

Syllogism distractors must be based on common categorical-logic mistakes:

- `REVERSAL_ERROR`: invalid conversion, such as treating `All A are B` as `All B are A`.
- `OVERGENERALIZATION`: treating `Some A are B` as `All A are B`.
- `WRONG_OPERATOR`: confusing `no`, `some not`, and `not all`.
- `PARTIAL_REASONING`: using only two premises when three are needed.
- `MUST_VS_COULD_ERROR`: presenting a possible conclusion as necessary.
- `SURFACE_MATCH`: using real-world plausibility instead of formal validity.

When using numbered conclusions, at least one conclusion should be a tempting invalid conversion or possibility/necessity confusion. The option set must correspond exactly to the truth status of the numbered conclusions.

---

## LOG_SY_L1_018: Basic Syllogism

```yaml
domain: Syllogisms
difficulty_level: L1
answer_mode: TRUE_FALSE or VALID_CONCLUSION
required_operators:
    - UNIVERSAL_CHAIN
premise_count: 2
conclusion_count: 1
```

### Contract

Generate a basic universal syllogism where the conclusion follows by transitive class inclusion.

### Allowed Forms

- All A are B. All B are C. Therefore all A are C.
- All X are Y. Z is X. Therefore Z is Y.

### Forbidden

- `some`, `no`, or `only`
- negative conclusions
- multiple conclusion evaluation
- real-world assumptions

### Validator Must Check

- conclusion follows by universal chaining
- answer is direct and unambiguous

### Example Skeleton

```text
All sparrows are birds. All birds are animals. Therefore all sparrows are animals.
```

---

## LOG_SY_L1_019: Syllogism With Simple Negation

```yaml
domain: Syllogisms
difficulty_level: L1
answer_mode: TRUE_FALSE or VALID_CONCLUSION
required_operators:
    - NEGATIVE_RELATION
premise_count: 2
conclusion_count: 1
```

### Contract

Generate a simple syllogism with one negative relation.

### Allowed Forms

- No A are B. All C are A. Therefore no C are B.
- All A are B. No B are C. Therefore no A are C.

### Forbidden

- multiple negations
- `some are not` unless the conclusion is direct
- possibility questions
- ambiguous category overlap
- distractors that are converse forms of true universal negative conclusions
- option rationales that reject a logically equivalent negative statement because it is not the intended direct wording

### Validator Must Check

- negative relation is applied correctly
- conclusion is entailed or contradicted clearly
- exactly one option is entailed by the premises
- no distractor is a converse or restatement of an entailed universal negative conclusion

### Example Skeleton

```text
No reptiles are mammals. All snakes are reptiles. Therefore no snakes are mammals.
```

---

## LOG_SY_L2_020: Multi-Statement Syllogism

```yaml
domain: Syllogisms
difficulty_level: L2
answer_mode: VALID_CONCLUSION
required_operators:
    - UNIVERSAL_CHAIN
    - exactly one of: NEGATIVE_RELATION, PARTICULAR_RELATION
premise_count: 3
options: exactly 4
valid_options: exactly 1
```

### Contract

Generate a syllogism requiring three premises to evaluate the valid conclusion.

### Allowed Forms

- all/all/no chains
- some/all chains
- class inclusion plus exclusion

### Forbidden

- four or more premises
- multiple valid conclusions
- hidden conversion of `some A are B` into `some B are A` unless the level explicitly expects it and the answer remains unambiguous
- real-world category assumptions

### Validator Must Check

- all three premises are relevant or at least one distractor tests ignoring a premise
- exactly one conclusion follows
- quantifier and negation handling is correct

### Example Skeleton

```text
Some A are B. All B are C. No C are D.
Valid conclusion: Some A are not D.
```

---

## LOG_SY_L2_021: Syllogism With Conclusion Set

```yaml
domain: Syllogisms
difficulty_level: L2
answer_mode: CONCLUSION_SET
required_operators:
    - CONCLUSION_SET_EVALUATION
    - VENN_MODEL_CHECK
premise_count: 2-3
numbered_conclusions: 2-3
options: exactly 4
```

### Contract

Generate premises and numbered conclusions. The student must choose which conclusions follow.

### Required Option Style

Use one of these formats:

```text
A. Only I follows
B. Only II follows
C. Both I and II follow
D. Neither I nor II follows
```

or equivalent for three conclusions.

### Forbidden

- conclusion sets where two option labels are equivalent
- more than three conclusions
- ambiguous conclusion phrasing
- conclusions that rely on real-world facts

### Validator Must Check

- each numbered conclusion is evaluated independently
- option key exactly matches the valid conclusion set
- there is exactly one correct option label

### Example Skeleton

```text
Premises: All A are B. Some B are C.
Conclusions:
I. Some A are C.
II. Some B are A.
Answer: Neither follows, unless supported by additional premises.
```

---

## LOG_SY_L3_022: Must-Be-True vs Could-Be-True

```yaml
domain: Syllogisms
difficulty_level: L3
answer_mode: MUST_COULD_CANNOT
required_operators:
    - MUST_VS_COULD
    - VENN_MODEL_CHECK
    - at least one of: NEGATIVE_RELATION, PARTICULAR_RELATION
premise_count: 3-4
options: exactly 4
```

### Contract

Generate a syllogism where the main difficulty is distinguishing what must be true from what could be true or cannot be true.

For this template, `could be true` means true in at least one valid model. A claim that is true in every valid model still qualifies as something that could be true.

### Allowed Claim Types

- must be true
- could be true
- cannot be true
- cannot be determined

### Forbidden

- treating possible overlap as guaranteed overlap
- treating absence of evidence as impossibility
- inconsistent premises
- more than one correct modal classification

### Validator Must Check

- premises are jointly satisfiable
- correct option has the intended modal status
- all wrong options fail under at least one valid model
- explanation distinguishes necessity from possibility
- do not reject a `could be true` answer merely because it is also entailed by the premises; must-true statements are still possible

### Example Skeleton

```text
Premises: Some engineers are artists. All artists are planners. No planners are careless.
Must be true: Some engineers are not careless.
Could be true but not guaranteed: Some planners are engineers.
```

---

# Domain E: Ordering & Sequencing

## Domain Purpose

Test whether the student can infer relative order, exact position, rank, or feasibility from ordering constraints.

## Domain Operators

| Operator                       | Meaning                                                              |
| ------------------------------ | -------------------------------------------------------------------- |
| `TRANSITIVE_ORDER`             | A before B and B before C imply A before C                           |
| `DIRECT_RANKING`               | Rank follows directly from stated comparisons                        |
| `FIXED_POSITION`               | One entity has an exact or excluded position                         |
| `ADJACENCY`                    | Two entities are adjacent, immediately before/after, or not adjacent |
| `END_POSITION`                 | Entity is or is not at an end                                        |
| `MULTI_CONSTRAINT_INTEGRATION` | Multiple constraints must be combined                                |
| `FEASIBILITY_CHECK`            | Student checks whether an arrangement can exist                      |
| `UNIQUE_POSITION`              | Student deduces one exact position or complete order                 |

## Domain-Wide Rules

- Define the ordering dimension clearly: left-to-right, first-to-last, tallest-to-shortest, earliest-to-latest, or front-to-back.
- Do not mix ordering dimensions in the same question.
- Avoid vague words such as `near`, `beside`, `ahead`, or `behind` unless direction is defined.
- Difficulty must come from constraint interaction, not from using more names alone.
- If the answer asks for exact order or exact position, the constraints must imply it uniquely.
- For arrangement-option questions, verify every answer option against every stated constraint before finalizing.
- The explanation or option rationales must identify the specific constraint violated by each wrong arrangement.
- For linear arrangements, two entities are adjacent only when their positions differ by exactly 1. If one or more entities are between them, they are not adjacent.

## Domain Option Rules

Ordering distractors must represent plausible arrangement mistakes:

- `REVERSAL_ERROR`: reverses before/after, taller/shorter, left/right, or first/last.
- `PARTIAL_REASONING`: satisfies some constraints but ignores one.
- `NEAR_MISS`: swaps adjacent entities in an otherwise valid order.
- `WRONG_OPERATOR`: treats `not adjacent` as `not before`, or `before` as `immediately before`.
- `UNDERGENERALIZATION`: fails to apply transitive chaining.
- `FEASIBILITY_ERROR`: accepts an arrangement that violates one constraint or rejects a valid one.

For full-order options, every wrong option should satisfy at least one constraint but fail at least one other constraint. Avoid obviously scrambled orders.

For valid-arrangement questions, do not rely on intuition about the intended answer. Build an option audit: mark each option as valid or invalid and name the violated rule for every invalid option. If more than one option is valid, regenerate the constraints or options.

When auditing adjacency, assign each entity a numeric position in the option first. Check `immediately before` as `position(A) + 1 = position(B)` and `not adjacent` as `abs(position(A) - position(B)) > 1`.

---

## LOG_OR_L1_023: Simple Linear Ordering

```yaml
domain: Ordering & Sequencing
difficulty_level: L1
answer_mode: EXACT_ORDER or DIRECT_RANK
required_operators:
    - TRANSITIVE_ORDER
entity_count: 3-4
constraint_count: 2-3
options: exactly 4
```

### Contract

Generate a simple linear ordering question where the answer follows by direct transitive comparison.

### Allowed Forms

- A is taller than B; B is taller than C.
- A finished before B; B finished before C.
- A is ranked higher than B; B is ranked higher than C.

### Forbidden

- adjacency constraints
- conditional constraints
- excluded positions
- multiple possible correct orders
- unclear direction of the ordering dimension

### Validator Must Check

- constraints form one simple chain
- correct order or rank follows uniquely
- distractors represent reversal, skipped relation, or adjacent swap errors

### Example Skeleton

```text
A is older than B. B is older than C.
Question: Who is the oldest?
Answer: A
```

---

## LOG_OR_L1_024: Ranking From Direct Relations

```yaml
domain: Ordering & Sequencing
difficulty_level: L1
answer_mode: POSITION_OR_RANK
required_operators:
    - DIRECT_RANKING
entity_count: 3-5
constraint_count: 2-3
options: exactly 4
```

### Contract

Generate a ranking question where the student identifies one entity's relative rank from straightforward comparisons.

### Allowed Forms

- highest/lowest
- first/last
- immediately known middle rank in a 3-entity chain
- direct comparison among scores, heights, times, or positions

### Forbidden

- hidden ties
- ambiguous rank language
- more than one possible rank for the asked entity
- using actual numeric scores unless the logic, not arithmetic, is the focus
- presenting a tie/status option as correct unless ties are explicitly stated

### Validator Must Check

- asked rank is uniquely determined
- exactly one option is defensible
- wrong options may include ordinal ranks or plausible status misconceptions such as `Equal 1st`, as long as the premises clearly rule them out
- wrong options correspond to reversal, off-by-one rank, ignored comparison, or assuming an unstated tie

### Example Skeleton

```text
Mira scored higher than Dev. Dev scored higher than Sana. Who ranked second among the three?
Answer: Dev
```

---

## LOG_OR_L2_025: Ordering With Single Additional Constraint

```yaml
domain: Ordering & Sequencing
difficulty_level: L2
answer_mode: MUST_BE_TRUE or POSITION_OR_RANK
required_operators:
    - TRANSITIVE_ORDER
    - exactly one of: FIXED_POSITION, END_POSITION
entity_count: 4-5
constraint_count: 3-4
options: exactly 4
```

### Contract

Generate an ordering item where a basic order chain must be combined with one positional constraint.

### Allowed Forms

- A before B and C before B, plus D is not first.
- A after B, C before A, plus B is not last.
- One entity has a fixed position in a short row.

### Forbidden

- adjacency constraints
- more than one additional complication
- exact full-order question unless uniqueness is guaranteed
- constraints that do not affect the answer

### Validator Must Check

- positional constraint is necessary to answer
- correct answer is uniquely supported
- each wrong option violates order, position, or both

### Example Skeleton

```text
Five runners finished a race. A finished before B. C finished before B. D finished first.
Question: Which statement must be true?
Answer: B did not finish first.
```

---

## LOG_OR_L2_026: Ordering With Exclusion Constraint

```yaml
domain: Ordering & Sequencing
difficulty_level: L2
answer_mode: VALID_ARRANGEMENT
required_operators:
    - ADJACENCY
    - exactly one of: TRANSITIVE_ORDER, END_POSITION
entity_count: exactly 4
constraint_count: exactly 3
options: exactly 4
```

### Contract

Generate an ordering item where the student must choose the only valid left-to-right arrangement. Use exactly four entities, exactly three constraints, and exactly four full-arrangement options.

Use this construction process:

1. First choose the correct full arrangement.
2. Write three constraints that the correct arrangement satisfies:
   - one immediate before/after or not-adjacent rule
   - one simple before/after rule
   - one end-position or non-end-position rule
3. Create three wrong options by changing the correct arrangement so that each wrong option violates at least one named rule.
4. Audit all four options against all three rules before returning.

### Allowed Forms

- one immediate before/after rule plus one before/after rule plus one end-position rule
- one not-adjacent rule plus one before/after rule plus one end-position rule

### Forbidden

- vague adjacency wording
- circular seating unless the question explicitly defines circular adjacency
- asking which arrangement cannot be true
- more or fewer than four entities
- more or fewer than three constraints
- options that are not complete left-to-right arrangements
- multiple valid answers
- no valid answer
- hidden assumptions about direction
- explanations that acknowledge another option is valid
- incorrect option rationales that cite the wrong pair for an adjacency or non-adjacency rule

### Validator Must Check

- adjacency relation is defined precisely
- exactly four entities and exactly three constraints are used
- every option is a complete left-to-right arrangement of the same four entities
- the correct option satisfies all constraints
- every wrong option violates at least one named constraint
- every option is checked against every stated constraint
- exactly one option is valid
- explanation and option rationales name the actual violated constraint for each wrong option

### Example Skeleton

```text
Four files are arranged left to right. Rules: B is immediately before D. A is left of C. D is at the right end.
Question: Which arrangement from left to right is valid?
Valid answer: B, D, A, C
Wrong options must each violate at least one named rule.
```

---

## LOG_OR_L3_027: Multi-Constraint Ordering Feasibility

```yaml
domain: Ordering & Sequencing
difficulty_level: L3
answer_mode: VALID_ARRANGEMENT
required_operators:
    - MULTI_CONSTRAINT_INTEGRATION
    - FEASIBILITY_CHECK
    - at least two of: TRANSITIVE_ORDER, ADJACENCY, END_POSITION, FIXED_POSITION
entity_count: exactly 5
constraint_count: exactly 4
options: exactly 4
```

### Contract

Generate a feasibility question where the student must choose the only valid full left-to-right arrangement from four candidate arrangements. Use exactly five entities, exactly four constraints, and exactly four full-arrangement options.

Use this construction process:

1. First choose the correct full arrangement.
2. Write four constraints that the correct arrangement satisfies:
   - one immediate before/after or not-adjacent rule
   - one simple before/after rule
   - one end-position or non-end-position rule
   - one additional fixed-position, before/after, or adjacency rule
3. Create three wrong options by changing the correct arrangement so that each wrong option violates at least one named rule.
4. Audit all four options against all four rules before returning.

### Allowed Forms

- row arrangements
- race finishing order
- schedule order
- shelf order

### Forbidden

- inconsistent premise set unless the question asks for inconsistency
- asking which arrangement is impossible or cannot be true
- more or fewer than five entities
- more or fewer than four constraints
- options that are not complete left-to-right arrangements
- constraints that are redundant and do not affect feasibility
- more than one valid option
- no valid option
- explanations that acknowledge another option is valid
- incorrect option rationales that cite the wrong constraint or misread an arrangement

### Validator Must Check

- all premises are jointly satisfiable
- exactly five entities and exactly four constraints are used
- every option is a complete left-to-right arrangement of the same five entities
- the correct option satisfies all constraints
- every wrong option violates at least one named constraint
- every option is checked against every stated constraint
- exactly one option is valid
- explanation and option rationales name the actual violated constraint for each wrong option

### Example Skeleton

```text
Five people stand in a row. Rules: K is immediately before M. L is left of O. N is at the right end. O is not adjacent to M.
Question: Which arrangement from left to right is valid?
Valid answer: K, M, L, O, N
Wrong options must each violate at least one named rule.
```

---

## LOG_OR_L3_028: Deduce Exact Position

```yaml
domain: Ordering & Sequencing
difficulty_level: L3
answer_mode: EXACT_POSITION or COMPLETE_ORDER
required_operators:
    - UNIQUE_POSITION
    - MULTI_CONSTRAINT_INTEGRATION
    - at least two of: TRANSITIVE_ORDER, ADJACENCY, FIXED_POSITION, END_POSITION
entity_count: 5-6
constraint_count: 4-5
options: exactly 4
```

### Contract

Generate a question where the constraints imply one exact position for a target entity or one complete valid order.

### Allowed Forms

- determine who is third
- determine the exact position of one entity
- choose the only complete order satisfying all rules

### Forbidden

- asking for exact position if multiple positions are possible
- adding constraints that do not help prove the answer or eliminate any option
- ambiguous left/right or before/after wording

### Validator Must Check

- target position or full order is unique
- each constraint either helps prove the correct answer or eliminates at least one wrong option
- do not require every constraint to be individually necessary for uniqueness after removing it
- for complete-order option questions, every wrong option violates at least one stated constraint and every stated constraint is relevant to at least one option-level distinction
- wrong options reflect near-miss swaps, ignored constraints, or reversal errors

### Example Skeleton

```text
Five books are placed left to right. A is immediately left of B. C is not at an end. D is right of B. E is left of A.
Question: Which book is in the middle?
```

---

# Domain F: Grouping & Assignment

## Domain Purpose

Test whether the student can assign entities to groups, roles, slots, or categories while satisfying capacity, inclusion, exclusion, and uniqueness constraints.

## Domain Operators

| Operator            | Meaning                                                |
| ------------------- | ------------------------------------------------------ |
| `SIMPLE_PARTITION`  | Split items into groups with stated sizes              |
| `ONE_TO_ONE_MATCH`  | Match each entity to exactly one role/item             |
| `CAPACITY_LIMIT`    | Group or category has min/max/exact size               |
| `INCLUSION_RULE`    | Two entities must be together or share an assignment   |
| `EXCLUSION_RULE`    | Two entities cannot be together or share an assignment |
| `ROLE_CONSTRAINT`   | Entity can or cannot take a role/category              |
| `FEASIBILITY_CHECK` | Determine whether an assignment is possible            |
| `UNIQUE_ASSIGNMENT` | Exactly one assignment satisfies all constraints       |

## Domain-Wide Rules

- State group sizes or role counts explicitly.
- Define whether groups are labeled or unlabeled.
- Define whether each entity must be assigned exactly once.
- Difficulty must come from constraint interaction, not from large item counts.
- Avoid real-world suitability assumptions unless stated as formal constraints.

## Domain Option Rules

Grouping distractors must represent plausible constraint mistakes:

- `PARTIAL_REASONING`: satisfies capacity but ignores inclusion/exclusion.
- `NEAR_MISS`: swaps one entity between otherwise valid groups.
- `WRONG_OPERATOR`: treats `must be with` as `cannot be with`, or max capacity as exact capacity.
- `OVERGENERALIZATION`: assumes unstated group balance or role suitability.
- `FEASIBILITY_ERROR`: selects an assignment that violates one hidden-in-plain-sight constraint.

For assignment options, every wrong option should be structurally plausible: correct number of entities/roles, but at least one constraint violation.

---

## LOG_GR_L1_029: Simple Grouping

```yaml
domain: Grouping & Assignment
difficulty_level: L1
answer_mode: COUNT_GROUPINGS or VALID_GROUPING
required_operators:
    - SIMPLE_PARTITION
item_count: 4-6
group_count: 2-3
constraints: group sizes only
options: exactly 4
```

### Contract

Generate a simple grouping question involving partitioning items into groups of stated sizes, without extra inclusion or exclusion rules.

### Allowed Forms

- pair 4 items into 2 pairs
- split 6 items into 2 groups of 3
- choose a valid grouping with exact sizes

### Forbidden

- compatibility constraints
- labeled/unlabeled ambiguity
- requiring advanced counting formulas
- hidden ordering inside groups

### Validator Must Check

- group size rules are clear
- count or valid grouping is correct
- wrong options reflect overcounting, undercounting, or invalid group size

### Example Skeleton

```text
Four people A, B, C, D must be divided into two pairs.
Question: How many different pairings are possible?
Answer: 3
```

---

## LOG_GR_L1_030: One-to-One Assignment

```yaml
domain: Grouping & Assignment
difficulty_level: L1
answer_mode: VALID_ASSIGNMENT or INFERRED_MATCH
required_operators:
    - ONE_TO_ONE_MATCH
entity_count: 3-4
role_count: same as entity_count
constraint_count: 1-2
options: exactly 4
```

### Contract

Generate a direct matching question where each entity gets exactly one role and each role is used exactly once.

The asked match must be inferred from one-to-one use and constraints. Do not ask for a match that is explicitly stated in the stem.

### Allowed Forms

- people to roles
- objects to boxes
- students to subjects
- workers to shifts

### Forbidden

- one-to-many assignment
- unstated role reuse
- more than two constraints
- multiple valid answers for the asked match
- asking "Which role/box contains X?" when the stem already states X's role/box
- distractors that are only alternate labels rather than plausible assignment mistakes

### Validator Must Check

- assignment cardinality is explicit
- correct match is inferred from one-to-one assignment, not copied from a stated fact
- wrong options violate one-to-one use or a stated constraint
- the stem does not explicitly state the exact asked match

### Example Skeleton

```text
A, B, and C each choose one of Math, Art, and Music. A does not choose Art. B chooses Music.
Question: Which subject can A choose if C chooses Art?
Answer: Math
```

---

## LOG_GR_L2_031: Grouping With Capacity Constraint

```yaml
domain: Grouping & Assignment
difficulty_level: L2
answer_mode: VALID_GROUPING or POSSIBLE_ASSIGNMENT
required_operators:
    - CAPACITY_LIMIT
    - SIMPLE_PARTITION
item_count: 5-7
group_count: 2-3
constraint_count: 2-3
options: exactly 4
```

### Contract

Generate a grouping question where group capacity limits must be respected along with basic assignment.

Every answer option must assign every listed item exactly once. Wrong options should be complete assignments that violate only capacity limits, not omissions, duplicates, or wrong total item count.

### Allowed Forms

- at most/at least/exactly capacity
- all items assigned exactly once
- labeled groups such as Team 1 and Team 2

### Forbidden

- ambiguous group labels
- capacity wording that conflicts with total item count
- redundant capacity wording such as `at least 2 and exactly 3` for the same group
- inclusion/exclusion rules unless explicitly added
- options with wrong total item count
- options that omit an item
- options that assign an item more than once

### Validator Must Check

- capacity limits are satisfiable
- correct option respects all capacities
- every option assigns every item exactly once
- wrong options preserve complete assignment but fail at least one capacity limit
- capacity wording is clean and non-redundant

### Example Skeleton

```text
Six tasks must be assigned to Teams X and Y. X can take at most 4 tasks, and Y must take at least 2.
Question: Which distribution is possible?
```

---

## LOG_GR_L2_032: Grouping With Inclusion/Exclusion Rules

```yaml
domain: Grouping & Assignment
difficulty_level: L2
answer_mode: VALID_GROUPING or CANNOT_BE_TOGETHER
required_operators:
    - exactly one of: INCLUSION_RULE, EXCLUSION_RULE
    - CAPACITY_LIMIT
item_count: 5-7
group_count: 2-3
constraint_count: 2-3
options: exactly 4
```

### Contract

Generate a grouping item where the student must combine group size/capacity with one together/apart rule.

For `VALID_GROUPING` questions, use this construction process:

1. First choose the correct complete grouping.
2. Write one capacity/size rule and one together/apart rule that the correct grouping satisfies.
3. Create three wrong complete groupings. Each wrong option must assign every listed item exactly once, but must violate at least one named rule.
4. Audit all four options against both the capacity rule and the together/apart rule before returning. If more than one option satisfies both rules, regenerate one of the options.

Important audit rule: if two entities must be together, they may be together in any labeled group whose size/capacity is satisfied. Do not mark an option wrong merely because the together-pair appears in a different group from the intended correct option.

### Allowed Forms

- A and B must be in the same group.
- C and D cannot be in the same group.
- E must be assigned to Group 1.

### Forbidden

- multiple inclusion/exclusion interactions
- unspecified whether groups are labeled
- more than one correct grouping when asking for the valid grouping
- any wrong option that also satisfies all capacity and together/apart rules
- treating a together-pair in the smaller/larger group as invalid when that group has the required size
- options that omit an item or assign an item more than once
- role suitability assumptions

### Validator Must Check

- together/apart rule is applied correctly
- capacity and assignment completeness are satisfied
- every option assigns every listed item exactly once
- wrong options represent ignored capacity, ignored inclusion, or ignored exclusion
- every option is checked against every stated rule
- exactly one option satisfies both capacity and together/apart rules
- if a together-pair appears in a non-correct option, verify whether that option is still valid before rejecting it

### Example Skeleton

```text
Six students are split into two teams of three. A and B must be together. C cannot be with A.
Question: Which team containing A is possible?
```

---

## LOG_GR_L3_033: Feasible Grouping Under Multiple Constraints

```yaml
domain: Grouping & Assignment
difficulty_level: L3
answer_mode: VALID_GROUPING
required_operators:
    - FEASIBILITY_CHECK
    - CAPACITY_LIMIT
    - INCLUSION_RULE
    - EXCLUSION_RULE
    - ROLE_CONSTRAINT
item_count: exactly 8
group_count: exactly 3
constraint_count: exactly 4 non-capacity constraints, plus exact group sizes
options: exactly 4
```

### Contract

Generate a valid-grouping question where multiple grouping constraints interact. Use exactly eight entities, exactly three labeled groups, and exact group sizes of 3, 3, and 2.

Use this construction process:

1. First choose one correct complete grouping that satisfies the exact group sizes.
2. Write exactly four non-capacity constraints that the correct grouping satisfies:
   - one same-group constraint
   - one apart/different-group constraint
   - one must-be-in-a-specific-group constraint
   - one cannot-be-in-a-specific-group constraint
3. Create three wrong complete groupings:
   - one wrong option must violate the same-group constraint
   - one wrong option must violate the must-be-in-a-specific-group constraint
   - one wrong option must violate either the apart/different-group constraint or the cannot-be-in-a-specific-group constraint
4. Every option must assign all eight entities exactly once. Prefer wrong options that preserve the 3/3/2 group sizes, unless the intended violation is a capacity violation explicitly named in the rationale.
5. Audit all four options against every stated constraint before returning. If more than one option satisfies all constraints, regenerate one of the options.
6. In `metadata.option_rationales`, every wrong option must name at least one actual violated constraint as the primary violation. A wrong option may violate more than one constraint; it is acceptable for the rationale to name only the primary violation as long as it is true. No wrong-option rationale may say or imply that the option satisfies all constraints.

Important audit rule: a grouping can be valid even when pairs or fixed-role entities appear in a different valid location than the intended answer. Reject an option only for violating a stated constraint, not for differing from the chosen correct grouping.

### Allowed Forms

- teams with exact sizes
- people assigned to rooms, shifts, or committees
- compatibility and incompatibility rules combined with fixed-group rules

### Forbidden

- unsatisfiable premise set unless testing inconsistency
- asking whether a grouping is feasible or infeasible instead of asking for the valid grouping
- constraints that duplicate each other
- large brute-force assignments
- more or fewer than eight entities
- more or fewer than three labeled groups
- group sizes other than exact 3, 3, and 2
- more or fewer than four non-capacity constraints
- more than one valid option
- no valid option
- options that omit an item or assign an item more than once
- any wrong option that satisfies all stated constraints
- treating a different but constraint-satisfying grouping as invalid
- option rationales that acknowledge a distractor as valid or satisfying all constraints

### Validator Must Check

- premises are jointly satisfiable
- exactly eight entities, three labeled groups, and exact group sizes of 3, 3, and 2 are used
- exactly four non-capacity constraints are used: one same-group, one apart/different-group, one must-be-in-specific-group, and one cannot-be-in-specific-group
- each wrong option violates at least one specific constraint
- every option assigns every listed item exactly once
- every option is checked against every stated capacity, inclusion, exclusion, and role constraint
- exactly one option satisfies all stated constraints
- option rationales do not acknowledge a wrong option as satisfying all constraints
- wrong-option rationales name at least one actual violated constraint; do not fail an otherwise valid item only because a wrong option has additional unstated violations

### Example Skeleton

```text
Eight people form two teams of four. A and B must be together. C and D must be apart. E cannot be with A. F must be with C.
Question: Which team containing C is feasible?
```

---

## LOG_GR_L3_034: Unique Valid Assignment

```yaml
domain: Grouping & Assignment
difficulty_level: L3
answer_mode: UNIQUE_ASSIGNMENT
required_operators:
    - UNIQUE_ASSIGNMENT
    - ONE_TO_ONE_MATCH
    - ROLE_CONSTRAINT
    - EXCLUSION_RULE
entity_count: exactly 5
role_count: exactly 5 ordered roles
constraint_count: exactly 5
options: exactly 4
```

### Contract

Generate an assignment puzzle where exactly one complete assignment satisfies all constraints. Use exactly five entities and exactly five ordered roles. The role order must be explicitly stated in the stem.

Use this construction recipe exactly, but randomize the surface names, role labels, anchor position, option order, and constraint order:

1. Choose five ordered roles `R1, R2, R3, R4, R5`.
2. Choose five surface entities and randomly map them to internal slots `P`, `Q`, `R`, `S`, and `T`. Do not expose these slot letters unless they are also the chosen surface names.
3. Choose an anchor position `k` from 1, 2, 3, or 4.
4. Build the unique correct assignment with this structure:
   - `P -> Rk`
   - `Q -> R(k+1)`
   - Let the three remaining roles in increasing order be `U1`, `U2`, and `U3`.
   - `R -> U2`
   - `S -> U1`
   - `T -> U3`
5. Before writing the stem, instantiate this anchor table and use only the row for the chosen `k`:

| Chosen `k` | `P` fixed role | `Q` immediate-after role | `R` correct role | `R` exclusion must be | `S` correct role | `T` correct role | `T` exclusion must be |
| ---------- | -------------- | ------------------------ | ---------------- | --------------------- | ---------------- | ---------------- | --------------------- |
| 1          | `R1`           | `R2`                     | `R4`             | not `R3` or `R5`      | `R3`             | `R5`             | not `R4`              |
| 2          | `R2`           | `R3`                     | `R4`             | not `R1` or `R5`      | `R1`             | `R5`             | not `R4`              |
| 3          | `R3`           | `R4`                     | `R2`             | not `R1` or `R5`      | `R1`             | `R5`             | not `R2`              |
| 4          | `R4`           | `R5`                     | `R2`             | not `R1` or `R3`      | `R1`             | `R3`             | not `R2`              |

6. Write these five constraints using the surface names:
   - `P` is assigned to `Rk`.
   - `Q` is assigned to the role immediately after `P`'s role in the stated role order.
   - `R` is not assigned to the two excluded roles shown in the table row. This exclusion must leave `R`'s correct role allowed.
   - `S` is assigned to a role before `R`'s role in the stated role order.
   - `T` is not assigned to the excluded role shown in the table row. This exclusion must leave `T`'s correct role allowed.
7. Shuffle the visible order of the five constraints.
8. Create four complete one-to-one assignment options:
   - one option is the unique correct assignment
   - one wrong option must violate the immediate-after constraint
   - one wrong option must violate the `R` exclusion constraint
   - one wrong option must violate the `S before R` or `T` exclusion constraint
9. Shuffle the answer options so the correct answer is not predictably option A. Across a batch of three generated items, use at least two different correct option letters.
10. Audit the intended correct option against all five constraints before returning. If it violates even one constraint, regenerate the item.
11. Audit all four options against all five constraints before returning. If more than one option satisfies all constraints, regenerate the wrong options.
12. In `metadata.option_rationales`, every wrong option should name an actual violated constraint. Rationale incompleteness or extra unstated violations should be treated as a repair note, not a fatal validation failure, unless the rationale claims a wrong option satisfies all constraints.

### Allowed Forms

- people to roles
- tasks to days
- items to boxes
- students to subjects
- ordered roles such as days, boxes, ranked slots, stations, or alphabetically listed categories

### Forbidden

- multiple valid complete assignments
- more or fewer than five entities
- more or fewer than five roles
- roles without an explicitly stated order
- using the same surface names, role labels, anchor position, constraint order, or correct option letter for every item in a batch
- exposing the internal slot recipe instead of presenting natural surface names
- relying on unstated preferences
- constraints that can be ignored without changing the answer
- options that fail simple one-to-one assignment before testing logic
- any wrong option that satisfies all stated constraints
- option rationales that reject an option using unstated uniqueness assumptions instead of a named violated constraint
- option rationales that acknowledge a distractor as valid or satisfying all constraints
- exclusion constraints that exclude the intended correct role for that entity
- anchor table mismatches, such as choosing `k = 4` but writing `R is not R2 or R3` when the table requires `R is not R1 or R3`

### Validator Must Check

- exactly one assignment satisfies all constraints
- exactly five entities and five ordered roles are used
- role order is explicitly stated
- the constraints follow the required recipe and force the unique assignment
- for the chosen anchor row, the fixed role, immediate-after role, `R` exclusions, `S before R`, and `T` exclusion match the table
- surface names, role labels, anchor position, constraint order, and option order are varied; the correct option is not always A
- every option is a complete one-to-one assignment
- every wrong option violates at least one named constraint
- wrong-option rationales should name an actual violated constraint, but do not fail an otherwise unique item solely for incomplete rationales or additional unstated violations
- no wrong-option rationale acknowledges a distractor as valid or satisfying all constraints

### Example Skeleton

```text
Five people are assigned to five ordered days Monday through Friday. Choose an internal anchor position and shuffled surface names before writing the item.
Question: Which complete assignment is valid?
Valid answer must follow the internal slot recipe, but the visible names, roles, constraint order, and option letter must be shuffled.
```

---

# Domain G: Conditional Reasoning

## Domain Purpose

Test whether the student can reason with if-then statements, necessary/sufficient conditions, chains, exceptions, and feasibility under condition sets.

## Domain Operators

| Operator                    | Meaning                                                    |
| --------------------------- | ---------------------------------------------------------- |
| `MODUS_PONENS`              | If A then B; A; therefore B                                |
| `MODUS_TOLLENS`             | If A then B; not B; therefore not A                        |
| `NECESSARY_SUFFICIENT`      | Distinguish condition from result                          |
| `CONDITIONAL_CHAIN`         | If A then B; if B then C                                   |
| `EXCEPTION_RULE`            | If A then B except when C                                  |
| `AFFIRMING_CONSEQUENT_TRAP` | Invalidly infer A from B                                   |
| `DENYING_ANTECEDENT_TRAP`   | Invalidly infer not B from not A                           |
| `SCENARIO_FEASIBILITY`      | Test whether a truth assignment can satisfy all conditions |

## Domain-Wide Rules

- Use formal conditional wording.
- Do not rely on causal real-world plausibility.
- State exceptions precisely.
- Distinguish `if`, `only if`, `if and only if`, and `unless`.
- Difficulty must come from conditional structure, not sentence length.

## Domain Option Rules

Conditional distractors must target classic conditional mistakes:

- `REVERSAL_ERROR`: affirms the consequent.
- `WRONG_OPERATOR`: denies the antecedent.
- `UNDERGENERALIZATION`: fails to chain implications.
- `OVERGENERALIZATION`: ignores exceptions or treats sufficient as necessary.
- `PARTIAL_REASONING`: uses one conditional but ignores another.
- `MUST_VS_COULD_ERROR`: treats possible truth assignment as forced.

At least one wrong option should reflect affirming the consequent or denying the antecedent when the template involves direct if-then reasoning.

---

## LOG_CR_L1_035: Direct If-Then Reasoning

```yaml
domain: Conditional Reasoning
difficulty_level: L1
answer_mode: TRUE_FALSE or VALID_CONCLUSION
required_operators:
    - MODUS_PONENS
condition_count: 1
fact_count: 1
options: exactly 4
```

### Contract

Generate a direct conditional reasoning item where the fact triggers the condition.

### Allowed Forms

- If A happens, then B happens. A happened. Therefore B happened.
- If an item has property X, then it has property Y. This item has X. Therefore it has Y.

### Forbidden

- reverse inference
- exceptions
- chains
- necessary/sufficient ambiguity

### Validator Must Check

- antecedent is affirmed
- consequent follows directly
- wrong options include reversal or unsupported alternatives without becoming defensible

### Example Skeleton

```text
If a card is red, it is placed in Box 1. This card is red.
Valid conclusion: It is placed in Box 1.
```

---

## LOG_CR_L1_036: Necessary vs Sufficient Conditions

```yaml
domain: Conditional Reasoning
difficulty_level: L1
answer_mode: VALID_CONCLUSION or CONDITION_CLASSIFICATION
required_operators:
    - NECESSARY_SUFFICIENT
condition_count: 1
options: exactly 4
```

### Contract

Generate a question that tests whether the student distinguishes a sufficient condition from a necessary condition.

### Allowed Forms

- A is sufficient for B: If A, then B.
- B is necessary for A: A only if B.
- Direct classification of what follows and what does not.

### Forbidden

- multiple conditions
- exception rules
- biconditional unless explicitly stated
- ambiguous everyday wording

### Validator Must Check

- conditional direction is correct
- wrong options include converse/inverse mistakes
- explanation states necessary/sufficient relation explicitly

### Example Skeleton

```text
Entry is allowed only if a pass is shown.
Valid conclusion: If entry is allowed, then a pass was shown.
```

---

## LOG_CR_L2_037: Chained Conditional Reasoning

```yaml
domain: Conditional Reasoning
difficulty_level: L2
answer_mode: VALID_CONCLUSION
required_operators:
    - CONDITIONAL_CHAIN
condition_count: 2-3
chain_length: 2-3 links
options: exactly 4
```

### Contract

Generate a conditional chain where the correct conclusion requires linking two or three if-then statements.

This template is forward-chain only. The stem must give a positive starting fact that triggers the first conditional, and the correct answer must be the final positive consequence of the chain.

### Allowed Forms

- If A then B. If B then C. A. Therefore C.
- If A then B. If B then C. If C then D. A. Therefore D.

### Forbidden

- contrapositive reasoning
- `not C, therefore not A` chain forms
- negative starting facts such as `not logged`, `not approved`, or `not completed`
- conclusions that require `MODUS_TOLLENS`
- exceptions
- broken chain with missing link
- more than three links
- multiple valid answer choices

### Validator Must Check

- chain is valid in the forward direction from the positive starting fact
- correct conclusion follows from all required links
- no contrapositive, inverse, or negative-chain reasoning is needed for the correct answer
- wrong options reflect partial-chain reasoning, reversal errors, or unsupported conclusions

### Example Skeleton

```text
If P is true, Q is true. If Q is true, R is true. P is true.
Valid conclusion: R is true.
```

---

## LOG_CR_L2_038: Condition With Exception

```yaml
domain: Conditional Reasoning
difficulty_level: L2
answer_mode: VALID_CONCLUSION or OUTCOME_DETERMINATION
required_operators:
    - EXCEPTION_RULE
condition_count: 1
exception_count: 1
fact_count: 1-2
options: exactly 4
```

### Contract

Generate a conditional question where the usual outcome follows unless a stated exception applies.

### Allowed Forms

- If A then B, except when C.
- If A and not C, then B.
- A occurs, and C does or does not occur.

### Forbidden

- multiple exceptions
- vague exception wording
- exceptions that override each other
- unstated default assumptions

### Validator Must Check

- exception status is stated clearly
- correct answer reflects whether exception blocks the usual rule
- wrong options include ignoring the exception or overapplying it

### Example Skeleton

```text
If a request is urgent, it is reviewed today, except when the reviewer is absent. The request is urgent and the reviewer is absent.
Conclusion: It is not guaranteed to be reviewed today.
```

---

## LOG_CR_L3_039: Scenario Feasibility Under Conditions

```yaml
domain: Conditional Reasoning
difficulty_level: L3
answer_mode: POSSIBLE_IMPOSSIBLE or MUST_COULD_CANNOT
required_operators:
    - SCENARIO_FEASIBILITY
    - at least two of: CONDITIONAL_CHAIN, MODUS_TOLLENS, EXCEPTION_RULE, NECESSARY_SUFFICIENT
condition_count: 3-4
options: exactly 4
```

### Contract

Generate a feasibility question where the student must determine whether a proposed scenario can satisfy all conditional statements.

### Allowed Forms

- chained conditionals plus a negated outcome
- necessary condition plus exception
- multiple rules constraining a truth assignment

### Forbidden

- inconsistent rule set unless testing inconsistency
- more than one option with the same requested status
- causal assumptions
- hidden biconditionals

### Validator Must Check

- conditions are jointly satisfiable
- proposed scenario is correctly classified
- wrong options reflect converse/inverse errors, ignored exception, or incomplete chaining

### Example Skeleton

```text
If A then B. If B then C. If D then not C. A is true.
Question: Can D also be true?
Answer: No, because A forces C, while D would force not C.
```

---

# Domain H: Binary Logic & Truth/Lie

## Domain Purpose

Test whether the student can infer a consistent assignment of truth-tellers, liars, or statement truth values from constrained claims.

## Domain Operators

| Operator                | Meaning                                           |
| ----------------------- | ------------------------------------------------- |
| `TRUTH_TELLER_LIAR`     | Some people always tell truth or always lie       |
| `FIXED_TRUE_COUNT`      | Exactly N statements are true                     |
| `STATEMENT_CONSISTENCY` | Claims must be evaluated together                 |
| `CONDITIONAL_CLAIM`     | A statement itself contains if-then logic         |
| `SELF_REFERENCE_LIGHT`  | A claim refers to speaker status without paradox  |
| `CASE_SPLIT`            | Student tests possible assignments                |
| `UNIQUE_WORLD`          | Exactly one truth assignment satisfies all claims |

## Domain-Wide Rules

- Define truth-teller/liar behavior explicitly.
- Avoid paradoxical self-reference.
- Ensure the premise set is satisfiable.
- Difficulty must come from consistency checking, not confusing wording.
- If asking who is what, the assignment must be unique.

## Domain Option Rules

Truth/lie distractors must represent plausible consistency mistakes:

- `PARTIAL_REASONING`: makes one statement true/false correctly but ignores another.
- `REVERSAL_ERROR`: swaps truth-teller and liar roles.
- `WRONG_OPERATOR`: treats `exactly two true` as `at least two true`.
- `NEAR_MISS`: one person's status differs from the unique consistent world.
- `OVERGENERALIZATION`: assumes a speaker always lies without proving it.
- `CONDITIONAL_ERROR`: mishandles truth value of an if-then claim.

For assignment options, each wrong option should satisfy at least one statement but fail the full consistency check.

---

## LOG_BL_L1_040: One Truth-One Lie

```yaml
domain: Binary Logic & Truth/Lie
difficulty_level: L1
answer_mode: IDENTIFY_SPEAKER_TYPE or VALID_ASSIGNMENT
required_operators:
    - TRUTH_TELLER_LIAR
person_count: 2
truth_liar_mix: exactly one truth-teller and one liar
statement_count: 2
options: exactly 4
```

### Contract

Generate a two-person truth/lie item with exactly one truth-teller and one liar. The answer should follow by testing the two possible assignments.

Use this construction recipe exactly:

1. State that exactly one of A and B is a truth-teller and the other is a liar.
2. A says: "A and B are different types."
3. B says: "A is a liar."
4. The unique consistent assignment is A truth-teller and B liar.
5. Audit both possible assignments:
   - If A is truth-teller and B is liar, A's statement is true and B's statement is false.
   - If A is liar and B is truth-teller, A's statement is true, so A cannot be a liar.

### Allowed Forms

- A makes one claim about A or B.
- B makes one claim about A or B.
- One claim may be simple self-description if it does not create paradox.
- A may make the premise-entailed claim that A and B are different types; this is the preferred L1 anchor.

### Forbidden

- both people same type
- more than two statements
- conditional claims
- paradoxical statements such as `I am lying`
- symmetric cross-accusations such as A says "B is a liar" and B says "A is a liar"
- symmetric cross-claims that make both swapped assignments valid
- statement pairs that make no assignment valid
- explanations that acknowledge both assignments as possible

### Validator Must Check

- exactly one assignment satisfies both statements
- both possible one-truth-one-lie assignments are explicitly audited
- correct option identifies the truth-teller/liar statuses
- wrong options represent swapped or inconsistent assignments
- the swapped assignment fails because at least one speaker's truth/lie behavior conflicts with their statement truth value

### Example Skeleton

```text
A says, "A and B are different types." B says, "A is a liar."
Given exactly one truth-teller and one liar, identify each person.
Answer: A is the truth-teller and B is the liar.
```

---

## LOG_BL_L2_041: Fixed Number of True Statements

```yaml
domain: Binary Logic & Truth/Lie
difficulty_level: L2
answer_mode: TRUE_STATEMENT_SET
required_operators:
    - FIXED_TRUE_COUNT
    - STATEMENT_CONSISTENCY
statement_count: exactly 4
true_count: exactly 2
options: exactly 4
```

### Contract

Generate a question with four statements and the condition that exactly two statements are true. The student must identify the true statement set.

Use this construction recipe exactly:

1. State that exactly one of four mutually exclusive possibilities `P`, `Q`, `R`, and `S` is selected.
2. State that exactly two of the following four statements are true.
3. Use these four statement forms with surface names substituted:
   - Statement 1: The selected possibility is not `P`.
   - Statement 2: The selected possibility is either `R` or `S`.
   - Statement 3: The selected possibility is `S`.
   - Statement 4: The selected possibility is both `P` and `Q`.
4. The unique consistent selection is `R`, making exactly Statements 1 and 2 true.
5. Options must be four statement sets, with the correct option saying exactly Statements 1 and 2 are true.
6. Audit all four possible selections before returning:
   - `P` makes zero statements true.
   - `Q` makes only Statement 1 true.
   - `R` makes Statements 1 and 2 true.
   - `S` makes Statements 1, 2, and 3 true.

### Allowed Forms

- exactly two of the following statements are true
- exactly one option, card, box, item, or label is selected
- four ordinary claims about the selected possibility

### Forbidden

- unclear whether statements are independent
- more or fewer than four statements
- any true count other than exactly two
- self-referential statements such as `Statement 2 is false` or `Statement 4 is true`
- exactly-one or exactly-three true-count variants
- truth/liar speaker variants
- multiple statement sets satisfying the true count
- impossible true-count condition
- options that identify a selected possibility instead of the set of true statements
- explanations that do not audit all four possible selections

### Validator Must Check

- exactly one option matches the stated true count
- exactly four mutually exclusive possibilities are used
- exactly four statements are used
- exactly two statements are true under the unique consistent selection
- truth values are internally consistent
- wrong options have too many or too few true statements
- explanation audits all four possible selections or otherwise proves the 0/1/2/3 true-count split

### Example Skeleton

```text
Exactly one of cards P, Q, R, and S is selected. Exactly two of these statements are true:
1. The selected card is not P.
2. The selected card is either R or S.
3. The selected card is S.
4. The selected card is both P and Q.
Question: Which statements are true?
Answer: Statements 1 and 2.
```

---

## LOG_BL_L2_042: Truth/Lie With Conditional Claims

```yaml
domain: Binary Logic & Truth/Lie
difficulty_level: L2
answer_mode: VALID_ASSIGNMENT
required_operators:
    - TRUTH_TELLER_LIAR
    - CONDITIONAL_CLAIM
    - STATEMENT_CONSISTENCY
    - CASE_SPLIT
    - UNIQUE_WORLD
person_count: exactly 2
statement_count: exactly 2
options: exactly 4
```

### Contract

Generate a two-person truth/lie item where one statement contains a conditional claim and exactly one complete assignment is consistent.

Use this construction recipe exactly:

1. State that A and B are each either truthful or lying.
2. A says: "If B is truthful, then I am lying."
3. B says: "A is lying."
4. Ask which complete assignment is consistent.
5. Use exactly four assignment options: both truthful, A truthful/B lying, A lying/B truthful, both lying.
6. The unique correct assignment is A truthful and B lying.
7. Audit all four options before returning:
   - both truthful: A's conditional is false, so A cannot be truthful.
   - A truthful/B lying: A's conditional is true because the antecedent is false, and B's statement is false, so this assignment is consistent.
   - A lying/B truthful: A's conditional is true, so A cannot be lying.
   - both lying: A's conditional is true, so A cannot be lying.
8. Include a formal option audit in the explanation or metadata.

### Allowed Forms

- A says, "If B is truthful, then I am lying."
- B makes one non-conditional claim about A or B.
- complete assignments for A and B only
- two-person assignment options with one conditional claim and one non-conditional claim

### Forbidden

- three-person items for this template
- references to a third person's truth status
- paradoxical conditionals
- more than one nested conditional
- ambiguous truth status of the conditional
- multiple consistent assignments when asking for one assignment
- rationales that say a conditional is true or false without evaluating antecedent and consequent

### Validator Must Check

- conditional truth values are evaluated formally
- exactly two people and exactly two statements are used
- exactly one answer option is a consistent complete assignment
- all four possible assignments are audited
- wrong options are the other three complete assignments and may share the same broad error family
- every wrong-option rationale names the exact statement that conflicts with the proposed assignment
- do not fail the rigid recipe merely because more than one wrong option conflicts with A's conditional; exhaustive assignment coverage is more important than distinct distractor categories here

### Example Skeleton

```text
A says, "If B is truthful, then I am lying." B says, "A is lying."
Question: Which assignment is consistent?
Answer: A is truthful and B is lying.
```

---

## LOG_BL_L3_043: Deduce Internally Consistent World

```yaml
domain: Binary Logic & Truth/Lie
difficulty_level: L3
answer_mode: UNIQUE_WORLD
required_operators:
    - TRUTH_TELLER_LIAR
    - FIXED_TRUE_COUNT
    - UNIQUE_WORLD
    - CASE_SPLIT
person_count: exactly 3
statement_count: exactly 3
truth_liar_mix: exactly one liar
options: exactly 4
```

### Contract

Generate a truth/lie puzzle where the student must deduce the unique internally consistent assignment of statuses. Use exactly three people and state that exactly one is a liar.

Use this construction recipe exactly:

1. State that A, B, and C are each either truth-tellers or liars, and exactly one of them is a liar.
2. A says: "B is a liar."
3. B says: "A is a liar."
4. C says: "B is a truth-teller."
5. Ask which assignment is the unique internally consistent world.
6. The unique correct assignment is A liar, B truth-teller, C truth-teller.
7. Use exactly four options:
   - A liar, B truth-teller, C truth-teller
   - A truth-teller, B liar, C truth-teller
   - A truth-teller, B truth-teller, C liar
   - A truth-teller, B truth-teller, C truth-teller
8. Audit all four options before returning:
   - A liar/B truth-teller/C truth-teller: A's statement is false, B's statement is true, and C's statement is true.
   - B liar option: C's statement is false even though C is assigned truth-teller.
   - C liar option: A's statement is false even though A is assigned truth-teller.
   - all-truthful option: violates the exactly-one-liar rule and makes A's statement false.

### Allowed Forms

- three speakers with claims about each other
- exactly one liar
- complete status assignment options

### Forbidden

- paradoxes
- no-solution or multiple-solution setups
- nested self-reference
- conditionals
- self-reference
- more or fewer than three speakers
- more or fewer than three statements
- any truth-count rule other than exactly one liar
- explanations that identify a contradiction and still select that contradicted option
- relying on personalities or real-world plausibility

### Validator Must Check

- exactly one complete assignment satisfies all statements
- exactly three people, exactly three statements, and exactly one liar are used
- every wrong option fails at least one statement or true-count constraint
- explanation shows a case split or contradiction elimination for all four options
- the selected correct option has each truth-teller making a true statement and the liar making a false statement

### Example Skeleton

```text
Three people A, B, C each either always tell the truth or always lie. Exactly one is a liar.
A says, "B is a liar." B says, "A is a liar." C says, "B is a truth-teller."
Question: Which assignment is the unique internally consistent world?
Answer: A is the liar; B and C are truth-tellers.
```

---

# Domain I: Direction & Spatial Reasoning

## Domain Purpose

Test whether the student can track movement, orientation, relative position, distance, or spatial consistency using explicitly stated spatial rules.

## Domain Operators

| Operator               | Meaning                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `VECTOR_MOVEMENT`      | Track north/south/east/west displacement                   |
| `NET_DISTANCE`         | Compute final distance or direction from start             |
| `ORIENTATION_TURN`     | Track facing direction after left/right turns              |
| `RELATIVE_POSITION`    | Infer where one entity is relative to another              |
| `OPPOSITE_OR_ADJACENT` | Use opposite/left/right/adjacent relationships in a layout |
| `MULTI_PATH_TRACKING`  | Compare two or more movement paths                         |
| `SPATIAL_FEASIBILITY`  | Determine whether paths/positions can coincide             |

## Domain-Wide Rules

- Define the coordinate convention explicitly: North is up, East is right.
- Define whether `left` and `right` mean the viewer's left/right or a person's facing direction.
- Do not mix absolute directions and facing-relative directions unless the template requires orientation tracking.
- Keep distances small and arithmetic secondary.
- Difficulty must come from spatial tracking, not from large numbers.

## Domain Option Rules

Spatial distractors must represent plausible tracking mistakes:

- `REVERSAL_ERROR`: swaps left/right, north/south, east/west, or clockwise/counterclockwise.
- `PARTIAL_REASONING`: tracks only one leg of movement or one person.
- `ARITHMETIC_SLIP`: uses correct path but wrong distance arithmetic.
- `WRONG_OPERATOR`: gives path length instead of net distance, or final facing instead of final position.
- `NEAR_MISS`: correct quadrant but wrong exact direction/distance.
- `ORIENTATION_ERROR`: treats relative turn as absolute direction.

For direction options, use consistent formats such as `North-East`, `South-West`, `5 units`, or `(x, y)`. Do not mix incompatible option types unless the question asks for classification.

---

## LOG_SP_L1_044: Simple Directional Movement

```yaml
domain: Direction & Spatial Reasoning
difficulty_level: L1
answer_mode: NET_DIRECTION or NET_DISTANCE
required_operators:
    - VECTOR_MOVEMENT
    - optionally: NET_DISTANCE
movement_count: 2-3
grid_size: 3x3 to 5x5 conceptual grid
options: exactly 4
```

### Contract

Generate a simple movement question using absolute directions. The student tracks final displacement from the starting point.

### Allowed Forms

- move North/South/East/West by small integer distances
- ask final direction from start
- ask straight-line distance only when using simple triples such as 3-4-5 or 5-12-13

### Forbidden

- facing direction turns
- relative left/right movement
- diagonal movements unless final direction is asked
- large or awkward distance calculations

### Validator Must Check

- final displacement is correct
- direction or distance answer matches the asked mode
- distractors reflect path length, reversed axis, or arithmetic slip

### Example Skeleton

```text
A person walks 4 units North and 3 units East.
Question: What is the shortest distance from the starting point?
Answer: 5 units
```

---

## LOG_SP_L1_045: Final Direction After Turns

```yaml
domain: Direction & Spatial Reasoning
difficulty_level: L1
answer_mode: FINAL_FACING_DIRECTION
required_operators:
    - ORIENTATION_TURN
turn_count: 2-4
movement_distance: optional and irrelevant to facing unless stated
options: exactly 4
```

### Contract

Generate a question where the student tracks facing direction after a small number of left/right turns.

### Allowed Forms

- start facing North/East/South/West
- turn left/right by 90 degrees
- optionally turn around by 180 degrees

### Forbidden

- asking final position
- combining movement displacement with turn tracking
- ambiguous left/right reference
- more than four turns

### Validator Must Check

- final facing direction is correct
- movement distances, if present, do not affect answer unless explicitly asked
- wrong options reflect missed turn, reversed turn, or final-position confusion

### Example Skeleton

```text
A person faces North, turns right, then left, then left.
Question: Which direction is the person facing?
Answer: West
```

---

## LOG_SP_L2_046: Relative Positions

```yaml
domain: Direction & Spatial Reasoning
difficulty_level: L2
answer_mode: RELATIVE_DIRECTION or POSITION_RELATION
required_operators:
    - RELATIVE_POSITION
    - optionally: OPPOSITE_OR_ADJACENT
entity_count: 3-5
constraint_count: 2-4
options: exactly 4
```

### Contract

Generate a spatial relation question where the student infers one entity's position relative to another from two or more stated relations.

### Allowed Forms

- A is north/east/south/west of B
- C is opposite A in a seating/layout arrangement
- A is to the left/right of B, with perspective defined
- grid or table layout with named entities

### Forbidden

- undefined perspective for left/right
- circular seating without defining opposite/adjacent
- multiple valid relative positions
- more than one spatial convention

### Validator Must Check

- all relations can be placed consistently
- asked relation is uniquely determined
- wrong options reflect reversal, partial placement, or perspective error

### Example Skeleton

```text
A is north of B. C is east of A.
Question: In which direction is C from B?
Answer: North-East
```

---

## LOG_SP_L3_047: Multi-Path Spatial Consistency

```yaml
domain: Direction & Spatial Reasoning
difficulty_level: L3
answer_mode: MEET_DO_NOT_MEET or FINAL_POSITION_COMPARISON
required_operators:
    - MULTI_PATH_TRACKING
    - SPATIAL_FEASIBILITY
    - at least one of: VECTOR_MOVEMENT, ORIENTATION_TURN, RELATIVE_POSITION
path_count: 2
movement_count_per_path: 3-5
options: exactly 4
```

### Contract

Generate a spatial consistency question comparing two paths or tracking one path with orientation changes to determine final relation.

### Allowed Forms

- two people start at known positions and move
- one person follows two alternative paths
- determine whether two endpoints coincide
- determine relative final position between two movers

### Forbidden

- unclear starting coordinates
- simultaneous movement assumptions unless stated
- large grids
- more than two paths
- ambiguous turn perspective

### Validator Must Check

- each path's endpoint is computed correctly
- comparison status is unique
- wrong options reflect one-path-only tracking, axis reversal, or orientation mistake

### Example Skeleton

```text
P starts at (0,0), moves North 2 and East 3. Q starts at (5,1), moves West 2 and North 1.
Question: Do P and Q end at the same point?
```

---

# Domain J: Input-Output / Rule Transformation

## Domain Purpose

Test whether the student can apply, combine, or infer transformation rules that convert inputs into outputs.

## Domain Operators

| Operator                | Meaning                                             |
| ----------------------- | --------------------------------------------------- |
| `ONE_STEP_TRANSFORM`    | Apply one stated operation                          |
| `MULTI_STEP_FIXED_RULE` | Apply two or three stated operations in fixed order |
| `ORDER_OF_OPERATIONS`   | Correct output depends on operation order           |
| `CONDITIONAL_TRANSFORM` | Rule branch depends on input property               |
| `RULE_INFERENCE`        | Infer rule from examples                            |
| `APPLY_TO_NEW_INPUT`    | Apply inferred rule to unseen input                 |
| `DISTRACTOR_RULE_TEST`  | Reject plausible but wrong rules                    |

## Domain-Wide Rules

- State whether the rule is given or must be inferred.
- Keep arithmetic small enough that reasoning is central.
- If multiple steps exist, their order must be explicit or inferable.
- If using conditions, define the branch condition precisely.
- Difficulty must come from transformation structure, not tedious calculation.

## Domain Option Rules

Input-output distractors must represent plausible transformation errors:

- `ARITHMETIC_SLIP`: correct rule but small calculation mistake.
- `WRONG_OPERATOR`: adds instead of multiplies, subtracts instead of divides, etc.
- `ORDER_ERROR`: applies correct steps in the wrong order.
- `PARTIAL_REASONING`: performs only one step of a multi-step rule.
- `CONDITIONAL_ERROR`: applies the wrong branch of a conditional rule.
- `OVERFIT_RULE`: infers a rule that fits some examples but fails all examples.

For inferred-rule questions, at least one distractor must come from a rule that fits the first two examples but fails later examples.

---

## LOG_IO_L1_048: One-Step Transformation

```yaml
domain: Input-Output / Rule Transformation
difficulty_level: L1
answer_mode: OUTPUT_VALUE
required_operators:
    - ONE_STEP_TRANSFORM
input_count: 1
operation_count: 1
options: exactly 4
```

### Contract

Generate a question where a stated one-step rule is applied to one input.

### Allowed Operations

- add/subtract 1-20
- multiply by 2-5
- divide by 2, 3, 4, or 5 when integral
- simple letter shift by 1-3 positions if explicitly stated

### Forbidden

- hidden second operation
- conditional branch
- inferred rule
- large arithmetic

### Validator Must Check

- rule is applied once
- correct output is unique
- wrong options reflect arithmetic slip or wrong single operator

### Example Skeleton

```text
Rule: Multiply the input by 3 and stop.
Input: 6
Answer: 18
```

---

## LOG_IO_L2_049: Multi-Step Fixed Rule

```yaml
domain: Input-Output / Rule Transformation
difficulty_level: L2
answer_mode: OUTPUT_VALUE
required_operators:
    - MULTI_STEP_FIXED_RULE
    - ORDER_OF_OPERATIONS
input_count: 1
operation_count: 2-3
options: exactly 4
```

### Contract

Generate a question where a stated fixed sequence of operations must be applied in order.

### Allowed Forms

- multiply, then add/subtract
- add/subtract, then multiply
- two arithmetic steps plus one simple final adjustment

### Forbidden

- conditional rules
- inferred rules
- more than three operations
- ambiguous order of operations

### Validator Must Check

- correct output follows exact operation order
- wrong options include reversed order, one-step-only, and arithmetic-slip results
- no option is defensible under normal arithmetic precedence if the rule states step order

### Example Skeleton

```text
Rule: Double the input, then add 5.
Input: 7
Answer: 19
```

---

## LOG_IO_L2_050: Conditional Transformation Rule

```yaml
domain: Input-Output / Rule Transformation
difficulty_level: L2
answer_mode: OUTPUT_VALUE or RULE_BRANCH
required_operators:
    - CONDITIONAL_TRANSFORM
input_count: 1-2
branch_count: exactly 2
options: exactly 4
```

### Contract

Generate a rule where the operation depends on a clear property of the input.

### Allowed Conditions

- even vs odd
- greater than/less than a stated threshold
- starts with/ends with a stated letter
- contains/does not contain a stated symbol

### Forbidden

- overlapping branches
- missing branch for some inputs
- more than two branches
- condition based on external knowledge

### Validator Must Check

- input belongs to exactly one branch
- correct branch operation is applied
- wrong options include wrong-branch and arithmetic-slip results

### Example Skeleton

```text
Rule: If the input is even, multiply it by 2. If it is odd, add 5.
Input: 9
Answer: 14
```

---

## LOG_IO_L3_051: Infer Rule and Apply

```yaml
domain: Input-Output / Rule Transformation
difficulty_level: L3
answer_mode: INFERRED_OUTPUT or RULE_SELECTION_AND_OUTPUT
required_operators:
    - RULE_INFERENCE
    - APPLY_TO_NEW_INPUT
    - DISTRACTOR_RULE_TEST
example_pair_count: 4-5
new_input_count: 1
options: exactly 4
```

### Contract

Generate examples of input-output pairs from one consistent rule, then ask the student to apply the inferred rule to a new input.

### Allowed Rule Families

- `n^2 + c` with small constant
- `an + b` with small integer coefficients
- two-step arithmetic rule
- simple digit rule such as digit sum plus constant, only for two-digit inputs

### Forbidden

- multiple rules fitting all examples but producing different outputs
- obscure number theory
- large arithmetic
- too few examples to disambiguate the rule

### Validator Must Check

- intended rule fits all examples
- at least one distractor rule fits early examples but fails later ones
- exactly one output for the new input is correct
- explanation shows why the inferred rule is preferred by all examples, not just first pair

### Example Skeleton

```text
Given: 2 -> 5, 3 -> 10, 4 -> 17, 5 -> 26
Rule: input squared plus 1.
Question: What is the output for 6?
Answer: 37
```

---

# Domain K: Raven's Matrices & Inductive Reasoning

## Domain Purpose

Test abstract visual rule induction using structured shape, count, position, orientation, fill, and overlay transformations.

## Domain Output Requirement

Because this pipeline uses text, represent visual cells using structured descriptions. Do not rely on vague phrases like `a complicated shape`.

Use this cell schema inside the question whenever possible:

```json
{
	"shapes": [
		{
			"type": "circle|square|triangle|diamond|line|arrow",
			"count": 1,
			"fill": "filled|outline|striped",
			"orientation_degrees": 0,
			"position": "center|top|bottom|left|right|top-left|top-right|bottom-left|bottom-right"
		}
	]
}
```

For answer options, describe each candidate cell with the same schema or a compact equivalent. The correct option must be uniquely determined by the matrix rules.

## Domain Operators

| Operator                  | Meaning                                                  |
| ------------------------- | -------------------------------------------------------- |
| `COUNT_PROGRESSION`       | Number of shapes increases/decreases by row/column       |
| `ROTATION_PROGRESSION`    | Shape orientation changes by fixed degrees               |
| `ADD_REMOVE_ELEMENT`      | Elements are added or removed systematically             |
| `ROW_RULE`                | A rule applies across each row                           |
| `COLUMN_RULE`             | A rule applies down each column                          |
| `POSITION_SHIFT`          | Shape position changes systematically                    |
| `FILL_TRANSFORM`          | Fill state changes systematically                        |
| `SHAPE_TRANSFORM`         | Shape type changes in a defined cycle                    |
| `OVERLAY_XOR`             | Visual layers combine; shared elements cancel or persist |
| `DIAGONAL_RULE`           | Rule applies along one or both diagonals                 |
| `PARTIAL_FIT_ELIMINATION` | Wrong options satisfy only some rules                    |
| `UNIQUENESS_CHECK`        | Exactly one option satisfies all constraints             |

## Domain-Wide Rules

- Keep visual vocabulary small: circle, square, triangle, diamond, line, arrow.
- Use at most three shape attributes per template unless L3 explicitly requires more.
- State matrix size: 2x2 for L1, 3x3 for L2/L3 unless otherwise requested.
- Missing cell should usually be bottom-right for clarity.
- Difficulty must come from number and interaction of visual rules, not visual clutter.
- Avoid color as the only rule unless the rendering system reliably supports it; prefer fill, count, position, or orientation.

## Domain Option Rules

Raven distractors must be partial rule matches:

- `PARTIAL_REASONING`: satisfies row rule but violates column rule, or vice versa.
- `NEAR_MISS`: correct shape but wrong count, fill, position, or orientation.
- `WRONG_OPERATOR`: rotates when the rule shifts position, or changes shape when the rule changes fill.
- `REVERSAL_ERROR`: applies progression in the wrong direction.
- `OVERLAY_ERROR`: keeps an element that should cancel or removes one that should persist.
- `UNIQUENESS_ERROR`: option satisfies a local pattern but fails global consistency.

For L2/L3, each wrong option should satisfy at least one matrix rule and fail at least one matrix rule. Avoid random visual options.

---

## LOG_RM_L1_052: Shape Count Progression

```yaml
domain: Raven's Matrices & Inductive Reasoning
difficulty_level: L1
answer_mode: MISSING_CELL
required_operators:
    - COUNT_PROGRESSION
matrix_size: 2x2 or 1x4 sequence
attribute_count: 1
options: exactly 4
```

### Contract

Generate a simple visual pattern where only the number of identical shapes changes systematically.

### Allowed Forms

- row count increases by 1
- column count increases by 1
- simple sequence 1, 2, 3, ?

### Forbidden

- simultaneous shape type changes
- rotation, fill, or position changes
- count jumps larger than 2
- multiple possible count rules

### Validator Must Check

- count progression is consistent
- correct option has the required count
- distractors use nearby counts such as one too many or one too few

### Example Skeleton

```text
Cells show 1 circle, 2 circles, 3 circles, and a missing cell.
Rule: count increases by 1.
Answer: 4 circles.
```

---

## LOG_RM_L1_053: Rotation or Orientation Progression

```yaml
domain: Raven's Matrices & Inductive Reasoning
difficulty_level: L1
answer_mode: MISSING_CELL
required_operators:
    - ROTATION_PROGRESSION
matrix_size: 2x2 or 1x4 sequence
rotation_step: 45, 90, or 180 degrees
options: exactly 4
```

### Contract

Generate a simple visual item where one shape rotates by a fixed amount each step.

### Allowed Forms

- arrow rotates 90 degrees clockwise
- triangle orientation rotates 90 or 180 degrees
- line rotates 45 or 90 degrees

### Forbidden

- count changes
- fill changes
- irregular rotation
- ambiguous symmetric shapes where rotation is invisible

### Validator Must Check

- rotation step is consistent
- shape orientation is visually distinguishable
- distractors include wrong-direction and off-by-one rotation errors

### Example Skeleton

```text
Arrow points up, right, down, ?
Rule: rotate 90 degrees clockwise.
Answer: arrow points left.
```

---

## LOG_RM_L1_054: Add/Remove Element Rule

```yaml
domain: Raven's Matrices & Inductive Reasoning
difficulty_level: L1
answer_mode: MISSING_CELL
required_operators:
    - ADD_REMOVE_ELEMENT
matrix_size: 2x2 or 1x4 sequence
element_change_per_step: add or remove exactly 1 element
options: exactly 4
```

### Contract

Generate a visual pattern where one element is added or removed at each step.

### Allowed Forms

- square -> square+circle -> square+circle+triangle
- three elements -> two elements -> one element
- fixed order of added/removed elements

### Forbidden

- changing existing elements while adding/removing
- adding/removing more than one element at a time
- ambiguous element order
- cluttered cells

### Validator Must Check

- exactly one element changes per step
- correct option contains the required element set
- distractors omit a required element, add an extra element, or replace the wrong element

### Example Skeleton

```text
Cell 1: square. Cell 2: square+circle. Cell 3: square+circle+triangle. Cell 4: ?
Answer: square+circle+triangle+diamond, if diamond is the stated next element.
```

---

## LOG_RM_L2_055: Row Rule Plus Column Rule

```yaml
domain: Raven's Matrices & Inductive Reasoning
difficulty_level: L2
answer_mode: MISSING_CELL
required_operators:
    - ROW_RULE
    - COLUMN_RULE
matrix_size: 3x3
rule_count: exactly 2
options: exactly 4
```

### Contract

Generate a 3x3 matrix where one rule applies across rows and a different independent rule applies down columns.

### Allowed Rule Pairings

- row count progression plus column fill transform
- row shape cycle plus column rotation
- row position shift plus column count progression

### Forbidden

- diagonal rules
- more than two rules
- rules that conflict in the missing cell
- options that satisfy neither rule

### Validator Must Check

- row rule determines one attribute of missing cell
- column rule determines another attribute
- correct option satisfies both
- wrong options satisfy row-only, column-only, or neither due to a plausible mistake

### Example Skeleton

```text
Rows: count increases left to right.
Columns: fill changes from outline to filled to outline.
Missing cell must satisfy both row count and column fill.
```

---

## LOG_RM_L2_056: Transformation Plus Position Dependency

```yaml
domain: Raven's Matrices & Inductive Reasoning
difficulty_level: L2
answer_mode: MISSING_CELL
required_operators:
    - POSITION_SHIFT
    - exactly one of: SHAPE_TRANSFORM, FILL_TRANSFORM, ROTATION_PROGRESSION
matrix_size: 3x3
rule_count: exactly 2
options: exactly 4
```

### Contract

Generate a 3x3 matrix where a visual element changes position systematically while another attribute transforms.

### Allowed Forms

- shape moves left-to-right while rotating
- shape moves clockwise around cell positions while fill alternates
- shape position depends on row/column index while shape type cycles

### Forbidden

- more than one moving element unless all move identically
- diagonal rules
- unclear position labels
- options that can be interpreted visually in multiple ways

### Validator Must Check

- position rule is consistent
- second transformation is independent and consistent
- correct option satisfies both attributes
- wrong options include correct position/wrong transform and wrong position/correct transform

### Example Skeleton

```text
Across each row, a triangle moves left, center, right.
Down each column, it changes from outline to filled to outline.
Missing cell must have the row position and column fill.
```

---

## LOG_RM_L2_057: Overlay / XOR-Style Visual Logic

```yaml
domain: Raven's Matrices & Inductive Reasoning
difficulty_level: L2
answer_mode: MISSING_CELL
required_operators:
    - OVERLAY_XOR
matrix_size: 2x2 or 3x3
overlay_rule: union, intersection, or xor
options: exactly 4
```

### Contract

Generate a visual logic item where cells combine according to a stated or inferable overlay rule.

### Allowed Forms

- third cell in each row is union of first two
- third cell keeps only common elements
- third cell uses XOR: elements present in both disappear, elements present in one remain

### Forbidden

- using overlay rule and additional transformation unless explicitly requested
- too many elements
- ambiguous overlap
- options that differ only by tiny visual details

### Validator Must Check

- overlay rule is applied consistently
- correct option contains exactly the resulting element set
- wrong options reflect union/intersection/XOR confusion

### Example Skeleton

```text
In each row, the third cell contains elements that appear in exactly one of the first two cells.
Row 3 first two cells determine the missing third cell by XOR.
```

---

## LOG_RM_L3_058: Three-Axis Consistency

```yaml
domain: Raven's Matrices & Inductive Reasoning
difficulty_level: L3
answer_mode: MISSING_CELL
required_operators:
    - ROW_RULE
    - COLUMN_RULE
    - DIAGONAL_RULE
    - UNIQUENESS_CHECK
matrix_size: 3x3
rule_count: exactly 3
options: exactly 4
```

### Contract

Generate a 3x3 matrix where the missing cell must satisfy row, column, and diagonal rules.

### Allowed Rule Combinations

- row count, column fill, diagonal rotation
- row shape cycle, column position shift, diagonal count
- row add/remove, column rotation, diagonal fill

### Forbidden

- rule conflicts
- more than three rule axes
- visual clutter
- options that can be eliminated without considering all three axes

### Validator Must Check

- all three rules are consistent over visible cells
- correct option satisfies all three
- each wrong option satisfies exactly one or two rules but not all

### Example Skeleton

```text
Rows determine count. Columns determine fill. Main diagonal determines orientation.
Missing bottom-right cell must satisfy count, fill, and orientation.
```

---

## LOG_RM_L3_059: Eliminate Partially Fitting Rules

```yaml
domain: Raven's Matrices & Inductive Reasoning
difficulty_level: L3
answer_mode: BEST_COMPLETION
required_operators:
    - PARTIAL_FIT_ELIMINATION
    - at least two of: ROW_RULE, COLUMN_RULE, POSITION_SHIFT, FILL_TRANSFORM, ROTATION_PROGRESSION
matrix_size: 3x3
options: exactly 4
```

### Contract

Generate a matrix where several options appear plausible because they satisfy part of the pattern, but only one satisfies every required rule.

### Allowed Forms

- option A satisfies row rule only
- option B satisfies column rule only
- option C satisfies local sequence but fails global pattern
- option D satisfies all rules

### Forbidden

- obviously unrelated options
- two options satisfying all rules
- rules that require subjective visual judgment
- more than three simultaneous attributes

### Validator Must Check

- correct option is the only full fit
- each distractor has a named partial fit
- explanation explicitly eliminates distractors by rule failure

### Example Skeleton

```text
The missing cell must have the correct count from the row and correct position from the column.
Wrong options each match only count or only position.
```

---

## LOG_RM_L3_060: Feasibility Completion

```yaml
domain: Raven's Matrices & Inductive Reasoning
difficulty_level: L3
answer_mode: FEASIBLE_COMPLETION
required_operators:
    - UNIQUENESS_CHECK
    - PARTIAL_FIT_ELIMINATION
    - at least two of: ROW_RULE, COLUMN_RULE, DIAGONAL_RULE, OVERLAY_XOR
matrix_size: 3x3
options: exactly 4
```

### Contract

Generate a matrix and ask which option can complete it while satisfying all visible rules.

### Allowed Forms

- row/column consistency
- row/column plus diagonal consistency
- overlay rule plus attribute progression

### Forbidden

- no valid option
- multiple valid options
- options that differ only cosmetically
- hidden rules not visible in the matrix

### Validator Must Check

- matrix rules are identifiable from visible cells
- exactly one option can complete the matrix
- wrong options violate at least one named axis/rule

### Example Skeleton

```text
Rows use overlay union; columns rotate the resulting shape 90 degrees.
Question: Which option can complete the matrix?
```

---

## LOG_RM_L3_061: Uniqueness Under All Constraints

```yaml
domain: Raven's Matrices & Inductive Reasoning
difficulty_level: L3
answer_mode: UNIQUE_COMPLETION
required_operators:
    - UNIQUENESS_CHECK
    - at least three of: ROW_RULE, COLUMN_RULE, DIAGONAL_RULE, POSITION_SHIFT, FILL_TRANSFORM, SHAPE_TRANSFORM, ROTATION_PROGRESSION
matrix_size: 3x3
options: exactly 4
```

### Contract

Generate a matrix where only one option satisfies all constraints, and each other option breaks exactly one or two constraints.

### Allowed Forms

- three independent visual attributes determine the missing cell
- one option correct, three near-miss options
- explicit structured descriptions of cells and options

### Forbidden

- using four or more independent attributes
- relying on color alone
- ambiguous visual descriptions
- random distractors
- multiple options satisfying all constraints

### Validator Must Check

- visible matrix supports all stated/inferable rules
- correct option is uniquely determined
- each wrong option has a specific failure reason
- explanation identifies every rule used

### Example Skeleton

```text
Rows determine shape type. Columns determine position. Diagonal determines fill.
Only one option has the correct shape, position, and fill.
```

---

## Final Self-Check Before Returning Any Generated Question

Before returning the final generated item, silently verify:

1. The selected `template_id` is obeyed.
2. The listed `reasoning_operators` are exactly the operators used.
3. The generated difficulty matches the template level.
4. There is exactly one correct option.
5. Each wrong option represents a distinct meaningful mistake.
6. The `option_rationales` explain every option.
7. The explanation proves the answer from the question only.
8. No forbidden pattern appears.
9. The surface context changes wording without changing the reasoning structure.

If any check fails, regenerate the item before returning it.
