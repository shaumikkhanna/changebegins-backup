# Numerical Ability: Domains & Templates Summary

**Total:** 18 domains, 94 templates (L1, L2, L3 mix)

---

## Quick Overview by Domain

| # | Domain | Templates | L1 | L2 | L3 | Notes |
|----|--------|-----------|----|----|----|----|
| A | Ratios & Proportions | 6 | 2 | 2 | 2 | Basic to allocation with constraints |
| B | Percentages & Growth | 6 | 2 | 2 | 2 | Simple % to multi-lever trade-offs |
| C | Profit/Loss/Discount | 6 | 2 | 2 | 2 | Cost-price to margin optimization |
| D | Averages & Weighted Mean | 5 | 1 | 2 | 2 | Simple to target avg with bounds |
| E | Mixtures & Allegations | 5 | 1 | 2 | 2 | Concentrations to multi-step feasibility |
| F | Simple & Compound Interest | 5 | 1 | 2 | 2 | SI to CI with deadline targets |
| G | Time & Work | 6 | 1 | 2 | 3 | Single worker to multi-person with breaks |
| H | Time–Speed–Distance | 6 | 1 | 2 | 3 | Basic motion to train/segment routing |
| I | Pipes/Tanks/Flow | 5 | 1 | 2 | 2 | Fill-empty to 3-phase scheduling |
| J | Permutations & Combinations | 4 | 1 | 2 | 1 | Basic to multi-constraint counting |
| K | Probability | 4 | 1 | 2 | 1 | Basic to decision-making under risk |
| L | Number Series & Patterns | 4 | 1 | 2 | 1 | AP/GP to choosing rules |
| M | Divisibility / HCF / LCM | 5 | 1 | 2 | 2 | Simple checks to range-based finding |
| N | Remainders / Modular | 4 | 1 | 1 | 2 | Basic to power cycles & constraints |
| O | Mensuration 2D | 4 | 1 | 1 | 2 | Area/perimeter to cost+wastage |
| P | Mensuration 3D | 4 | 1 | 1 | 2 | Volume to capacity planning |
| Q | Data Interpretation | 6 | 1 | 2 | 3 | Read+compute to sensitivity analysis |
| R | Estimation & Approximation | 4 | 1 | 1 | 2 | Rounding to robust decision-making |
| S | Resource Allocation & Constraints | 6 | — | 2 | 4 | Budget splits to lever analysis |
| **TOTAL** | | **94** | **18** | **33** | **43** | — |

---

## Detailed Template Breakdown

### A) Ratios & Proportions (6 templates)
**Purpose:** Scale ratios, allocate in proportions, manage constraints

1. **NUM_RP_L1_001** – Compute part/total from A:B
2. **NUM_RP_L1_002** – Ratio scaling/comparison
3. **NUM_RP_L2_003** – Chain ratios (A:B and B:C)
4. **NUM_RP_L2_004** – Split total into 3+ parts
5. **NUM_RP_L3_005** – Allocation under cap/floor constraints
6. **NUM_RP_L3_006** – Adjust one component & decide (feasibility)

**Parameters:** a,b,c,d (ratio parts); total (divisible by ratio sum); caps/bounds for L3

**Example (TCS Easy):** "Cement:Sand = 3:5. If 240 kg mixture, how much cement?" → 90 kg

**Example (GATE Hard):** "Allocate 2,847 units in 17:23 ratio with cap of 1,500 on one part. Feasible?" → Requires checking constraint

---

### B) Percentages & Growth (6 templates)
**Purpose:** Percentage calculations, growth scaling, multi-lever optimization

7. **NUM_PC_L1_007** – Percent of a number
8. **NUM_PC_L1_008** – Percent change (simple)
9. **NUM_PC_L2_009** – Reverse percentage (find original)
10. **NUM_PC_L2_010** – Weighted % across groups
11. **NUM_PC_L3_011** – Two-lever trade-off (price × volume)
12. **NUM_PC_L3_012** – Multi-step growth planning with target

**Parameters:** base (100–2000), p (from {5,10,12.5,15,20,...}), targets for L3

**Example (TCS Easy):** "Find 15% of 240." → 36

**Example (GATE Hard):** "Price ↑ 20%, volume ↓ 10%. Need 15% revenue growth. Can we hit it?" → Requires math trade-off analysis

---

### C) Profit/Loss/Discount/Markup (6 templates)
**Purpose:** Cost-price relationships, discounting strategy, margin management

13. **NUM_PL_L1_013** – Profit/loss percentage
14. **NUM_PL_L1_014** – Discount price calculation
15. **NUM_PL_L2_015** – Markup + discount stacking
16. **NUM_PL_L2_016** – Compare two offers
17. **NUM_PL_L3_017** – Meet margin under cost increase + discount cap
18. **NUM_PL_L3_018** – Optimize discount for revenue+margin targets

**Parameters:** CP (cost price), MRP (marked price), discount %, margin targets for L3

**Example (TCS Easy):** "Cost ₹100, sell ₹150. Profit %?" → 50%

**Example (GATE Hard):** "Cost ↑ 12%, must keep margin ≥18%, max discount 25%. Find selling price." → Multi-constraint optimization

---

### D) Averages & Weighted Mean (5 templates)
**Purpose:** Mean calculations, weighted averaging, target averages

19. **NUM_AV_L1_019** – Simple average
20. **NUM_AV_L2_020** – Weighted average (multiple items with weights)
21. **NUM_AV_L2_021** – Replace one item & recompute average
22. **NUM_AV_L3_022** – Hit target average with minimum bounds
23. **NUM_AV_L3_023** – Adjust subgroup mean to hit overall average

**Parameters:** n (count), values, weights, target average, bounds for L3

**Example (TCS Easy):** "Scores: 45, 60, 55. Average?" → 53.3

**Example (GATE Hard):** "5 scores avg 50. Need overall avg 60 after adding 1 more. Min score required?" → 110 (requires solving for unknown)

---

### E) Mixtures & Allegations (5 templates)
**Purpose:** Concentration mixing, solution blending, multi-step extraction

24. **NUM_MA_L1_024** – Compute final concentration (two solutions mixed)
25. **NUM_MA_L2_025** – Allegation ratio (find mixing ratio for target concentration)
26. **NUM_MA_L2_026** – One-step replacement (e.g., drain & refill)
27. **NUM_MA_L3_027** – Multi-step replacement feasibility
28. **NUM_MA_L3_028** – Choose plan meeting concentration + cost targets

**Parameters:** c1,c2 (concentrations); q1,q2 (quantities); steps for multi-step replacement

**Example (TCS Easy):** "Mix 60L of 50% solution with 40L of 80%. Final concentration?" → 62%

**Example (GATE Hard):** "Remove 20% of tank, refill with water, repeat 3 times. Reach ≤10% concentration? Cost cap ₹500?" → Multi-step feasibility

---

### F) Simple & Compound Interest (5 templates)
**Purpose:** Interest calculations, loan/investment scenarios, deadline planning

29. **NUM_SI_L1_029** – Simple interest compute
30. **NUM_SI_L2_030** – SI with unknown (find P, R, or T)
31. **NUM_CI_L1_031** – Compound interest (straightforward)
32. **NUM_CI_L2_032** – CI with frequency (half-yearly, quarterly)
33. **NUM_CI_L3_033** – Compare plans to meet target by deadline (trade-off: principal vs rate vs time)

**Parameters:** P (principal), r (rate), t (time), frequency; targets/deadlines for L3

**Example (TCS Easy):** "₹1000 at 5% SI for 3 years?" → ₹1150

**Example (GATE Hard):** "₹10,000 at 8% CI annually or ₹12,000 at 6%? Which reaches ₹15,000 first?" → Multi-option comparison

---

### G) Time & Work (6 templates)
**Purpose:** Work rates, combined work, breaks/efficiency, feasibility

34. **NUM_TW_L1_034** – Single worker (A can do work in 10 days)
35. **NUM_TW_L2_035** – Combined work (A+B working together)
36. **NUM_TW_L2_036** – Different rates with start/stop times
37. **NUM_TW_L3_037** – Efficiency multipliers (A works 0.75x speed if distracted)
38. **NUM_TW_L3_038** – Multi-phase (A does 50%, then B, with cap on days)
39. **NUM_TW_L3_039** – Feasibility (can team finish within deadline given constraints?)

**Parameters:** TA, TB (time for A, B alone), efficiency factors (0.75, 1.25, etc.), deadlines for L3

**Example (TCS Easy):** "A does work in 10 days, B in 15 days. Together?" → 6 days

**Example (GATE Hard):** "A,B,C can do work. A leaves after 2 days. B leaves 3 days before end. C works throughout. Total time?" → Multi-phase optimization

---

### H) Time–Speed–Distance (6 templates)
**Purpose:** Motion problems, train crossing, relative speed, routing

40. **NUM_TSD_L1_040** – Basic distance = speed × time
41. **NUM_TSD_L2_041** – Relative speed (two objects moving)
42. **NUM_TSD_L2_042** – Train crossing (length matters)
43. **NUM_TSD_L3_043** – Multi-segment routing (A→B→C with stops/delays)
44. **NUM_TSD_L3_044** – Feasibility to reach destination given caps
45. **NUM_TSD_L3_045** – Optimize speed to hit arrival window

**Parameters:** distances, speeds, train lengths, stops, time windows for L3

**Example (TCS Easy):** "Speed 60 km/h. Distance 180 km. Time?" → 3 hours

**Example (GATE Hard):** "Train A (100m long) @ 50 km/h. Train B (150m) @ 40 km/h, opposite direction. Cross time?" → Requires relative speed + length

---

### I) Pipes/Tanks/Flow (5 templates)
**Purpose:** Fill-empty rates, simultaneous inflow-outflow, scheduling

46. **NUM_PT_L1_046** – Pipe fills in X hours, empties in Y. Both open?
47. **NUM_PT_L2_047** – Multiple inlets/outlets with rates
48. **NUM_PT_L2_048** – Two-phase (fill first, then drain + refill)
49. **NUM_PT_L3_049** – Three-phase scheduling with capacity bounds
50. **NUM_PT_L3_050** – Optimize schedule to minimize time/cost

**Parameters:** Tf (fill time), Te (empty time), rates; capacity, deadline for L3

**Example (TCS Easy):** "Tank fills in 4 hrs, empties in 6 hrs. Both open?" → 12 hours to fill

**Example (GATE Hard):** "Pipe A (4h), Pipe B (6h), Drain C (8h). Fill first 2h, then A+B+C. How long total to fill?" → Multi-phase planning

---

### J) Permutations & Combinations (4 templates)
**Purpose:** Counting arrangements, selections with restrictions

50. **NUM_PN_L1_050** – nPr or nCr (basic)
51. **NUM_PN_L2_051** – Choose P vs C (decision-making)
52. **NUM_PN_L2_052** – Restricted arrangements (e.g., men sit together)
53. **NUM_PN_L3_053** – Multi-constraint counting (find arrangement count)

**Parameters:** n, r, constraints (items that must/can't be together)

**Example (TCS Easy):** "Arrange 5 people in a line?" → 5! = 120

**Example (GATE Hard):** "7 people: 4 men, 3 women. Arrangements where no 2 men adjacent?" → Complex constraint counting

---

### K) Probability (4 templates)
**Purpose:** Event probability, conditional probability, decision under uncertainty

54. **NUM_PR_L1_054** – Basic probability (favorable/total)
55. **NUM_PR_L2_055** – Complement/at least one
56. **NUM_PR_L2_056** – With/without replacement (drawing balls from bag)
57. **NUM_PR_L3_057** – Decision under risk (expected value)

**Parameters:** total outcomes, favorable, event probabilities, decision options for L3

**Example (TCS Easy):** "Bag: 3 red, 2 blue balls. Draw 1. P(red)?" → 3/5

**Example (GATE Hard):** "Draw without replacement. P(first red, second blue)? Evaluate risk for strategy A vs B." → Multi-step conditional + optimization

---

### L) Number Series & Patterns (4 templates)
**Purpose:** Sequence reasoning, rule identification

58. **NUM_NS_L1_058** – AP/GP next term
59. **NUM_NS_L2_059** – Mixed operations series (e.g., +2, ×3, +2, ×3,...)
60. **NUM_NS_L2_060** – Alternating series with two rules
61. **NUM_NS_L3_061** – Identify rule from options, then predict next

**Parameters:** start value, step/multiplier, rule variations for L3

**Example (TCS Easy):** "2, 4, 8, 16,... Next?" → 32 (GP with r=2)

**Example (GATE Hard):** "2, 5, 10, 17, 26,... Which rule fits? Predict next?" → Requires identifying pattern (n²+1) then extending

---

### M) Divisibility / HCF / LCM (5 templates)
**Purpose:** Number properties, greatest common divisor, least common multiple

62. **NUM_DV_L1_062** – Check divisibility
63. **NUM_DV_L2_063** – Apply LCM/HCF (e.g., find smallest number divisible by 6, 8, 12)
64. **NUM_DV_L2_064** – Prime factorization reasoning
65. **NUM_DV_L3_065** – Find number in range [X, Y] satisfying constraints
66. **NUM_DV_L3_066** – Optimize (find min/max meeting constraints)

**Parameters:** range [a,b], divisibility constraints, optimization criteria for L3

**Example (TCS Easy):** "Is 144 divisible by 12?" → Yes (144/12=12)

**Example (GATE Hard):** "Find smallest number in [1000,2000] divisible by 6, 8, 12, remainder 2 when divided by 5?" → Multi-constraint search

---

### N) Remainders / Modular Reasoning (4 templates)
**Purpose:** Modular arithmetic, remainder cycles, Chinese Remainder Theorem (light)

67. **NUM_RM_L1_067** – Simple remainder (e.g., 23÷5 = 4R3)
68. **NUM_RM_L2_068** – Remainder cycles (e.g., 7^1, 7^2, 7^3,... mod 10 pattern)
69. **NUM_RM_L2_069** – Combined remainders (lite: 2 constraints)
70. **NUM_RM_L3_070** – Choose candidate from options meeting remainder constraints

**Parameters:** base, exponent, modulus, remainder targets for L3

**Example (TCS Easy):** "23 mod 5?" → 3

**Example (GATE Hard):** "Units digit of 7^205? Find N where N≡2(mod 3), N≡3(mod 5), N<100?" → Modular pattern + constraint solving

---

### O) Mensuration 2D (4 templates)
**Purpose:** Area, perimeter, composite shapes, optimization with cost

71. **NUM_MS2_L1_071** – Area/perimeter of basic shapes
72. **NUM_MS2_L2_072** – Composite/missing dimension
73. **NUM_MS2_L3_073** – Optimize under constraint (e.g., max area with perimeter cap)
74. **NUM_MS2_L3_074** – Cost calculation with wastage + budget cap

**Parameters:** dimensions, π (stated), rate, wastage %, cap for L3

**Example (TCS Easy):** "Circle with radius 7. Area?" → 154 (using π=22/7)

**Example (GATE Hard):** "Design rectangle with perimeter 100. Cost ₹100/m². Wastage 15%. Budget ₹2000. Maximize area?" → Multi-constraint optimization

---

### P) Mensuration 3D (4 templates)
**Purpose:** Volume, surface area, hollow shapes, capacity planning

75. **NUM_MS3_L1_075** – Volume/surface area of basic solids
76. **NUM_MS3_L2_076** – Hollow/composite solids (sphere in cube, etc.)
77. **NUM_MS3_L3_077** – Capacity planning with efficiency factor
78. **NUM_MS3_L3_078** – Material cost under constraints

**Parameters:** dimensions, inner/outer sizes, efficiency %, rate, cap for L3

**Example (TCS Easy):** "Cube edge 5. Volume?" → 125

**Example (GATE Hard):** "Cylindrical tank 1m radius. Fill to 80% with 70% efficiency pump. Cost ₹50/hour. Deadline 10 hours. Feasible?" → Multi-constraint feasibility

---

### Q) Data Interpretation (6 templates)
**Purpose:** Table/chart reading, multi-step derived metrics, decision-making from data

79. **NUM_DI_L1_079** – Read table + compute
80. **NUM_DI_L2_080** – Multi-step derived metric (e.g., revenue = price × quantity)
81. **NUM_DI_L2_081** – Infer missing value from totals
82. **NUM_DI_L3_082** – Decision under constraint (best option from 4)
83. **NUM_DI_L3_083** – Sensitivity (rank by impact if one metric changes)
84. **NUM_DI_L3_084** – Feasibility to hit KPI (e.g., "Can we reach ₹10M revenue?")

**Parameters:** table structure (4–8 rows, 3–5 cols), metrics, constraints for L3

**Example (TCS Easy):** "Table: 5 quarters revenue. Q2 = ₹50M. Q3 = ₹60M. Total?" → Sum directly

**Example (GATE Hard):** "Multi-metric table. Rank options A,B,C,D by ability to reach ₹500M revenue within budget ₹200K & 12 months?" → Complex multi-variable decision

---

### R) Estimation & Approximation (4 templates)
**Purpose:** Rounding, bounds-based reasoning, robust decision-making

85. **NUM_EST_L1_085** – Rounding compute
86. **NUM_EST_L2_086** – Use bounds to choose option
87. **NUM_EST_L2_087** – Approximate % or ratio
88. **NUM_EST_L3_088** – Robust decision (evaluate option stability across ranges)

**Parameters:** precision level, option ranges, decision criteria for L3

**Example (TCS Easy):** "Round 47.6 to nearest 10?" → 50

**Example (GATE Hard):** "Cost ∈[₹100–150], Demand ∈[1000–1500]. Which option A,B,C, D is robust across all scenarios?" → Multi-scenario evaluation

---

### S) Resource Allocation & Constraints (6 templates)
**Purpose:** Budget allocation, capacity splitting, multi-constraint feasibility, trade-off analysis

89. **NUM_AL_L2_089** – Allocate budget with min/max bounds on items
90. **NUM_AL_L2_090** – Capacity split (e.g., warehouse space between product lines)
91. **NUM_AL_L3_091** – Feasibility under multi-constraint
92. **NUM_AL_L3_092** – Trade-off (speed vs cost, quality vs price)
93. **NUM_AL_L3_093** – Pick option satisfying all constraints
94. **NUM_AL_L3_094** – Lever analysis (what change helps most?)

**Parameters:** budget, items with costs/benefits, constraints (min/max), targets for L3

**Example (TCS Easy):** "Budget ₹100K. Item A costs ₹30K, B ₹20K. Allocate." → Multiple valid solutions

**Example (GATE Hard):** "Allocate ₹500K across 4 projects. Min ₹80K each, max ₹150K each. Hit target ROI ₹50M. Which allocation?" → Multi-constraint integer optimization

---

## Parameter Envelope Examples

### Non-Engineering (TCS Easy)
- **Ratios:** a,b ∈ [2..9], total ≤500
- **Percentages:** base ∈ [100..1000], p ∈ {5,10,15,20,25,30}
- **Time & Work:** TA, TB ∈ [4..24] (no fractional days)
- **DI:** Tables 4–6 rows, simple totals, no hidden tricks

### Engineering (GATE/GMAT)
- **Ratios:** a,b ∈ [10..99], total ∈ [1000..5000], with capacity constraints
- **Percentages:** Levers (price + volume), non-linear targets
- **Time & Work:** Multi-phase, efficiency factors (0.5, 0.75, 1.25, 1.5), feasibility checks
- **DI:** Tables 6–8 rows, multi-metric, sensitivity analysis, decision-making

---

## Summary Stats

| Metric | Value |
|--------|-------|
| **Total Templates** | 94 |
| **L1 Templates** | 18 (~19%) |
| **L2 Templates** | 33 (~35%) |
| **L3 Templates** | 43 (~46%) |
| **Domains** | 18 |
| **Est. Questions/Month** | 800 (40% of 2,000) |
| **Monthly Distribution** | 40% L1, 45% L2, 15% L3 |
| **Context Split** | 60% Engineering, 40% Non-Eng |

---

## How They Map to n8n Pipeline

**Template Storage:** All 94 templates stored as immutable JSON in n8n configuration

**Parameter Envelopes:** Associated with each template; sampled deterministically per month

**Context Variants:** Same template → 2 envelopes (Non-Eng easy, Eng hard)

**Monthly Generation:** 
- Pick 40% numerical from these 94 templates
- Sample parameters monthly (different seed each month → 70% new params)
- Keep template structure frozen → consistent quality/difficulty
- Rotate contexts to avoid repetition

---

**Ready to implement? Use this as your template reference during n8n setup.** 🎯
