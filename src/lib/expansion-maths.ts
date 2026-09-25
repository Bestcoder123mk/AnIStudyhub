// ===== Mathematics question-bank expansion =====
//
// Merged into MATHS_MCQS / MATHS_SHORT_QA / MATHS_LONG_QA in maths-data.ts.
// IDs run from 5000 upward (base bank tops out at 2019), so no collisions.
//
// THREE GAPS THIS PACK TARGETS:
//
// 1. STATISTICS AND PROBABILITY HAD NO SHORT ANSWERS AT ALL. Both chapters
//    carried MCQs and a single long answer each and nothing in between,
//    which is the worst possible shape for two chapters that are almost
//    entirely procedural — students need worked 2-3 mark practice most of
//    all there.
//
// 2. NO LONG ANSWERS for Polynomials, Pair of Linear Equations, or
//    Coordinate Geometry. Every chapter now has at least one.
//
// 3. THINNEST TRACK OVERALL relative to board weight — 96 questions for an
//    80-mark paper across 13 chapters.
//
// All questions are ORIGINAL, written in CBSE board-pattern style. Every
// numerical answer here has been worked through rather than asserted, and
// the solutions show the working rather than just the result, since in
// Maths the method is what carries the marks.

import type { MATHSMCQ, MATHSQA } from "./maths-data";

export const EXTRA_MATHS_MCQS: MATHSMCQ[] = [
  // ------------------- Ch 1 — Real Numbers -------------------
  {
    id: 5001, ch: 1, subj: "maths", diff: "medium",
    q: "If HCF(96, 404) = 4, then LCM(96, 404) is:",
    opts: ["9696", "2424", "4848", "38784"],
    ans: 0,
    exp: "HCF × LCM = product of the two numbers. So LCM = (96 × 404)/4 = 96 × 101 = 9696. This relation only holds for TWO numbers — it does not extend to three, which is a common trap in follow-up questions.",
  },
  {
    id: 5002, ch: 1, subj: "maths", diff: "hard",
    q: "For any natural number n, the number 6ⁿ can never end with the digit:",
    opts: ["2", "4", "6", "0"],
    ans: 3,
    exp: "A number ends in 0 only if it is divisible by 10 = 2 × 5, so its prime factorisation must contain a 5. But 6ⁿ = (2 × 3)ⁿ = 2ⁿ × 3ⁿ, which contains only the primes 2 and 3. By the Fundamental Theorem of Arithmetic the factorisation is unique, so no 5 can ever appear and 6ⁿ can never end in 0.",
  },
  {
    id: 5003, ch: 1, subj: "maths", diff: "hard",
    q: "The smallest number which when divided by 12, 15 and 18 leaves remainder 5 in each case is:",
    opts: ["185", "180", "175", "90"],
    ans: 0,
    exp: "A number leaving the same remainder 5 must be (a common multiple) + 5. LCM(12, 15, 18): 12 = 2²·3, 15 = 3·5, 18 = 2·3². LCM = 2²·3²·5 = 180. Smallest such number = 180 + 5 = 185.",
  },
  {
    id: 5004, ch: 1, subj: "maths", diff: "medium", pyq: true,
    q: "The decimal expansion of 13/3125 will terminate after how many decimal places?",
    opts: ["3", "4", "5", "It does not terminate"],
    ans: 2,
    exp: "3125 = 5⁵, which is of the form 2ᵐ5ⁿ, so the expansion terminates. Multiplying numerator and denominator by 2⁵ gives 13 × 32 / 10⁵ = 416/100000 = 0.00416 — terminating after 5 places. In general, the number of places equals max(m, n).",
  },

  // ------------------- Ch 2 — Polynomials -------------------
  {
    id: 5005, ch: 2, subj: "maths", diff: "medium",
    q: "A quadratic polynomial whose zeroes are 2 and −3 is:",
    opts: ["x² + x − 6", "x² − x − 6", "x² + x + 6", "x² − x + 6"],
    ans: 0,
    exp: "Sum of zeroes = 2 + (−3) = −1. Product = 2 × (−3) = −6. The polynomial is x² − (sum)x + product = x² − (−1)x + (−6) = x² + x − 6. Quick check: substituting x = 2 gives 4 + 2 − 6 = 0. ✓",
  },
  {
    id: 5006, ch: 2, subj: "maths", diff: "hard",
    q: "If the zeroes of x² − 5x + k differ by 1, then the value of k is:",
    opts: ["4", "5", "6", "7"],
    ans: 2,
    exp: "Let the zeroes be α and β with α + β = 5 and α − β = 1. Adding the two equations: 2α = 6, so α = 3 and β = 2. Then k = product = αβ = 6. Verify: x² − 5x + 6 = (x − 2)(x − 3), and the zeroes 2 and 3 do differ by 1. ✓",
  },
  {
    id: 5007, ch: 2, subj: "maths", diff: "hard",
    q: "If α and β are zeroes of the polynomial x² − 6x + 8, then the value of 1/α + 1/β is:",
    opts: ["3/4", "4/3", "6/8", "8/6"],
    ans: 0,
    exp: "1/α + 1/β = (α + β)/(αβ). Here α + β = −(−6)/1 = 6 and αβ = 8/1 = 8. So the value is 6/8 = 3/4. Rewriting the expression in terms of sum and product first avoids having to find the individual zeroes at all.",
  },
  {
    id: 5008, ch: 2, subj: "maths", diff: "medium",
    q: "The graph of a polynomial p(x) cuts the x-axis at exactly 3 points and touches it at 1 point. The number of zeroes of p(x) is:",
    opts: ["3", "4", "5", "7"],
    ans: 1,
    exp: "Every point where the graph meets the x-axis — whether it crosses or merely touches — corresponds to a zero. There are 3 + 1 = 4 such points, so p(x) has 4 zeroes. A touching point represents a repeated zero, but it is still counted as one distinct zero here.",
  },

  // ------------------- Ch 3 — Pair of Linear Equations -------------------
  {
    id: 5009, ch: 3, subj: "maths", diff: "hard",
    q: "For which value of k does the pair kx + 3y = k − 3 and 12x + ky = k have NO solution?",
    opts: ["k = 6", "k = −6", "k = ±6", "k = 0"],
    ans: 1,
    exp: "No solution requires a₁/a₂ = b₁/b₂ ≠ c₁/c₂. From k/12 = 3/k we get k² = 36, so k = ±6. Now test each: for k = 6, c₁/c₂ = 3/6 = 1/2 which EQUALS a₁/a₂ = 1/2 — that gives infinitely many solutions, not none. For k = −6, a₁/a₂ = b₁/b₂ = −1/2 but c₁/c₂ = −9/−6 = 3/2, so the ratios differ. Answer: k = −6. Checking the third ratio is exactly what separates this from a routine question.",
  },
  {
    id: 5010, ch: 3, subj: "maths", diff: "medium",
    q: "The pair of equations 3x + 4y = 12 and 6x + 8y = 24 represents:",
    opts: ["Intersecting lines with a unique solution", "Coincident lines with infinitely many solutions", "Parallel lines with no solution", "Perpendicular lines"],
    ans: 1,
    exp: "a₁/a₂ = 3/6 = 1/2, b₁/b₂ = 4/8 = 1/2, c₁/c₂ = 12/24 = 1/2. All three ratios are equal, so the lines are coincident — the second equation is simply twice the first, describing the same line. Every point on it is a solution.",
  },
  {
    id: 5011, ch: 3, subj: "maths", diff: "hard",
    q: "The sum of the digits of a two-digit number is 9. If 27 is added to the number, the digits are reversed. The number is:",
    opts: ["36", "45", "54", "63"],
    ans: 0,
    exp: "Let the number be 10x + y with x + y = 9. Reversing gives 10y + x, and (10x + y) + 27 = 10y + x, so 9x − 9y = −27, giving x − y = −3. Solving x + y = 9 with x − y = −3: 2x = 6, x = 3, y = 6. The number is 36. Check: 36 + 27 = 63, which is 36 reversed. ✓",
  },
  {
    id: 5012, ch: 3, subj: "maths", diff: "medium", pyq: true,
    q: "If x = a and y = b is the solution of x + y = 5 and 2x − 3y = 4, then the values of a and b are:",
    opts: ["a = 3, b = 2", "a = 2, b = 3", "a = 19/5, b = 6/5", "a = 4, b = 1"],
    ans: 2,
    exp: "From x + y = 5, y = 5 − x. Substituting: 2x − 3(5 − x) = 4 → 2x − 15 + 3x = 4 → 5x = 19 → x = 19/5. Then y = 5 − 19/5 = 6/5. The tempting answer a = 3, b = 2 satisfies the first equation but gives 2(3) − 3(2) = 0 ≠ 4, so it fails the second — always check BOTH equations.",
  },

  // ------------------- Ch 4 — Quadratic Equations -------------------
  {
    id: 5013, ch: 4, subj: "maths", diff: "hard",
    q: "If the equation kx² − 2kx + 6 = 0 has equal roots, then the value of k (k ≠ 0) is:",
    opts: ["0", "6", "3", "−6"],
    ans: 1,
    exp: "Equal roots means D = 0. Here a = k, b = −2k, c = 6, so D = 4k² − 24k = 0 → 4k(k − 6) = 0 → k = 0 or k = 6. But k = 0 would make the equation linear, not quadratic, so it is rejected. Answer: k = 6. Discarding the degenerate root is part of the required reasoning.",
  },
  {
    id: 5014, ch: 4, subj: "maths", diff: "medium",
    q: "The roots of the quadratic equation 2x² − 5x + 3 = 0 are:",
    opts: ["1 and 3/2", "−1 and −3/2", "2 and 3", "1/2 and 3"],
    ans: 0,
    exp: "D = 25 − 4(2)(3) = 25 − 24 = 1. So x = (5 ± 1)/4, giving x = 6/4 = 3/2 and x = 4/4 = 1. Check by factorising: 2x² − 2x − 3x + 3 = 2x(x − 1) − 3(x − 1) = (2x − 3)(x − 1). ✓",
  },
  {
    id: 5015, ch: 4, subj: "maths", diff: "hard",
    q: "A train travels 360 km at a uniform speed. If the speed had been 5 km/h more, it would have taken 1 hour less. The original speed is:",
    opts: ["30 km/h", "40 km/h", "45 km/h", "50 km/h"],
    ans: 1,
    exp: "Let the speed be x km/h. Then 360/x − 360/(x + 5) = 1. Multiplying through: 360(x + 5) − 360x = x(x + 5) → 1800 = x² + 5x → x² + 5x − 1800 = 0. Factorising: (x + 45)(x − 40) = 0, so x = 40 (rejecting the negative root, since speed cannot be negative). Check: 360/40 = 9 h and 360/45 = 8 h — a difference of 1 h. ✓",
  },
  {
    id: 5016, ch: 4, subj: "maths", diff: "medium",
    q: "The quadratic equation x² + 4x + 5 = 0 has:",
    opts: ["Two distinct real roots", "Two equal real roots", "No real roots", "More than two roots"],
    ans: 2,
    exp: "D = 16 − 4(1)(5) = 16 − 20 = −4. Since D < 0, there are no real roots — the parabola lies entirely above the x-axis and never crosses it. Computing the discriminant answers the nature question without solving the equation at all.",
  },

  // ------------------- Ch 5 — Arithmetic Progressions -------------------
  {
    id: 5017, ch: 5, subj: "maths", diff: "medium",
    q: "Which term of the AP 21, 18, 15, ... is −81?",
    opts: ["30th", "32nd", "35th", "36th"],
    ans: 2,
    exp: "a = 21, d = 18 − 21 = −3. Using aₙ = a + (n − 1)d: −81 = 21 + (n − 1)(−3) → −102 = −3(n − 1) → n − 1 = 34 → n = 35. A negative common difference is the only thing that makes this different from a routine term-finding question.",
  },
  {
    id: 5018, ch: 5, subj: "maths", diff: "hard",
    q: "How many two-digit numbers are divisible by 3?",
    opts: ["29", "30", "31", "33"],
    ans: 1,
    exp: "The two-digit multiples of 3 form the AP 12, 15, 18, ..., 99 with a = 12, d = 3, aₙ = 99. So 99 = 12 + (n − 1)3 → 87 = 3(n − 1) → n − 1 = 29 → n = 30. Forgetting the '+1' and answering 29 is the classic error — counting gaps rather than terms.",
  },
  {
    id: 5019, ch: 5, subj: "maths", diff: "hard",
    q: "If the sum of the first n terms of an AP is Sₙ = 3n² + 5n, then its common difference is:",
    opts: ["3", "5", "6", "8"],
    ans: 2,
    exp: "The nth term is aₙ = Sₙ − Sₙ₋₁. Here Sₙ₋₁ = 3(n−1)² + 5(n−1) = 3n² − 6n + 3 + 5n − 5 = 3n² − n − 2. So aₙ = (3n² + 5n) − (3n² − n − 2) = 6n + 2. Since aₙ is linear in n with coefficient 6, the common difference is 6. (Check: a₁ = 8, a₂ = 14, difference 6. ✓)",
  },
  {
    id: 5020, ch: 5, subj: "maths", diff: "medium", pyq: true,
    q: "The sum of the first 20 terms of the AP 5, 8, 11, 14, ... is:",
    opts: ["610", "640", "670", "700"],
    ans: 2,
    exp: "a = 5, d = 3, n = 20. Sₙ = n/2 [2a + (n − 1)d] = 10 [10 + 19 × 3] = 10 [10 + 57] = 10 × 67 = 670. Alternatively a₂₀ = 5 + 19(3) = 62, so S = 20/2 (5 + 62) = 10 × 67 = 670. ✓",
  },

  // ------------------- Ch 6 — Triangles -------------------
  {
    id: 5021, ch: 6, subj: "maths", diff: "medium",
    q: "In △ABC, DE ∥ BC with D on AB and E on AC. If AD = 2 cm, DB = 3 cm and AE = 4 cm, then EC is:",
    opts: ["5 cm", "6 cm", "7 cm", "8 cm"],
    ans: 1,
    exp: "By the Basic Proportionality Theorem (Thales), AD/DB = AE/EC. So 2/3 = 4/EC → EC = 6 cm. Note the ratio uses AD/DB, not AD/AB — using the whole side instead of the remaining segment is the standard mistake here.",
  },
  {
    id: 5022, ch: 6, subj: "maths", diff: "hard",
    q: "The areas of two similar triangles are 64 cm² and 121 cm². If a side of the first triangle is 8 cm, the corresponding side of the second is:",
    opts: ["9 cm", "10 cm", "11 cm", "15.125 cm"],
    ans: 2,
    exp: "For similar triangles, ratio of areas = (ratio of corresponding sides)². So 64/121 = (8/x)² → 8/11 = 8/x → x = 11 cm. Answering 15.125 means the ratio of areas was applied directly to the sides without taking the square root — the most frequent error in this topic.",
  },
  {
    id: 5023, ch: 6, subj: "maths", diff: "hard",
    q: "In △ABC, right-angled at B, if AB = 6 cm and BC = 8 cm, then the length of the perpendicular from B to AC is:",
    opts: ["4.8 cm", "5 cm", "5.6 cm", "6 cm"],
    ans: 0,
    exp: "First AC = √(36 + 64) = 10 cm. Now compute the area two ways: (1/2)(6)(8) = 24 cm², and also (1/2)(AC)(h) = (1/2)(10)h = 5h. Equating: 5h = 24 → h = 4.8 cm. Using the area as a bridge between two different base–height pairs is a technique worth remembering.",
  },
  {
    id: 5024, ch: 6, subj: "maths", diff: "medium",
    q: "Two triangles are similar if:",
    opts: ["Their areas are equal", "Their corresponding angles are equal and corresponding sides are in the same ratio", "Their perimeters are equal", "They have one equal side"],
    ans: 1,
    exp: "Similarity requires both conditions together — equiangular AND proportional sides. In practice, establishing one implies the other for triangles, which is why the AA criterion alone is sufficient. Equal areas or perimeters say nothing about shape: a long thin triangle and a near-equilateral one can share either.",
  },

  // ------------------- Ch 7 — Coordinate Geometry -------------------
  {
    id: 5025, ch: 7, subj: "maths", diff: "medium",
    q: "The distance between the points (3, 4) and (−3, −4) is:",
    opts: ["5 units", "10 units", "√14 units", "14 units"],
    ans: 1,
    exp: "d = √[(−3 − 3)² + (−4 − 4)²] = √[36 + 64] = √100 = 10 units. Note that both points lie on a line through the origin, and each is 5 units from it — so the answer 5 comes from finding only half the distance.",
  },
  {
    id: 5026, ch: 7, subj: "maths", diff: "hard",
    q: "The point on the x-axis which is equidistant from (2, −5) and (−2, 9) is:",
    opts: ["(−7, 0)", "(7, 0)", "(0, −7)", "(−2, 0)"],
    ans: 0,
    exp: "Any point on the x-axis has the form (x, 0). Equating squared distances: (x − 2)² + 25 = (x + 2)² + 81 → x² − 4x + 29 = x² + 4x + 85 → −8x = 56 → x = −7. The point is (−7, 0). Squaring both sides at the start avoids working with square roots entirely.",
  },
  {
    id: 5027, ch: 7, subj: "maths", diff: "hard",
    q: "The coordinates of the point which divides the line joining (1, 6) and (4, 3) internally in the ratio 1 : 2 are:",
    opts: ["(2, 5)", "(3, 4)", "(2.5, 4.5)", "(5, 2)"],
    ans: 0,
    exp: "By the section formula, the point is ((m x₂ + n x₁)/(m + n), (m y₂ + n y₁)/(m + n)) with m : n = 1 : 2. This gives ((1×4 + 2×1)/3, (1×3 + 2×6)/3) = (6/3, 15/3) = (2, 5). Note the ratio m : n pairs m with the SECOND point — swapping them gives (3, 4), which is the distractor.",
  },
  {
    id: 5028, ch: 7, subj: "maths", diff: "medium",
    q: "If (a, 3) is the midpoint of the line segment joining (−4, 5) and (2, b), then the values of a and b are:",
    opts: ["a = −1, b = 1", "a = 1, b = −1", "a = −1, b = 5", "a = −3, b = 1"],
    ans: 0,
    exp: "Midpoint = ((x₁ + x₂)/2, (y₁ + y₂)/2). So a = (−4 + 2)/2 = −1, and 3 = (5 + b)/2 → 6 = 5 + b → b = 1. Answer: a = −1, b = 1.",
  },

  // ------------------- Ch 8 — Some Applications of Trigonometry -------------------
  {
    id: 5029, ch: 8, subj: "maths", diff: "medium",
    q: "A tower is 30 m high. The length of its shadow when the Sun's angle of elevation is 60° is:",
    opts: ["10√3 m", "30√3 m", "15 m", "60 m"],
    ans: 0,
    exp: "tan 60° = height/shadow → √3 = 30/x → x = 30/√3 = 10√3 ≈ 17.3 m. A higher elevation angle gives a SHORTER shadow, so an answer larger than 30 m should look wrong immediately — a useful sanity check before computing.",
  },
  {
    id: 5030, ch: 8, subj: "maths", diff: "hard",
    q: "From the top of a 60 m high building, the angle of depression of a car on the ground is 30°. The distance of the car from the base of the building is:",
    opts: ["30√3 m", "60√3 m", "20√3 m", "60 m"],
    ans: 1,
    exp: "The angle of depression from the top equals the angle of elevation from the car (alternate angles with the horizontal). So tan 30° = 60/x → 1/√3 = 60/x → x = 60√3 ≈ 103.9 m. Converting depression to elevation is the step that makes the right-angled triangle usable.",
  },
  {
    id: 5031, ch: 8, subj: "maths", diff: "hard",
    q: "A ladder 10 m long leans against a wall, making an angle of 60° with the ground. The height it reaches on the wall is:",
    opts: ["5 m", "5√3 m", "10√3 m", "20/√3 m"],
    ans: 1,
    exp: "The ladder is the HYPOTENUSE, not a side, so sine is needed rather than tangent: sin 60° = height/10 → height = 10 × (√3/2) = 5√3 ≈ 8.66 m. Choosing tan here is the standard error; identifying which side the given length represents comes before choosing the ratio.",
  },
  {
    id: 5032, ch: 8, subj: "maths", diff: "medium", pyq: true,
    q: "The angle of elevation of the top of a tower from a point 30 m away from its base is 30°. The height of the tower is:",
    opts: ["10√3 m", "30√3 m", "15√3 m", "30 m"],
    ans: 0,
    exp: "tan 30° = h/30 → 1/√3 = h/30 → h = 30/√3 = 10√3 ≈ 17.3 m. A quick check: at 30° the height must be well under the 30 m horizontal distance, and 17.3 m fits — 30√3 ≈ 52 m would require an elevation above 45°.",
  },

  // ------------------- Ch 9 — Circles -------------------
  {
    id: 5033, ch: 9, subj: "maths", diff: "medium",
    q: "The length of the tangent drawn from a point 13 cm away from the centre of a circle of radius 5 cm is:",
    opts: ["8 cm", "12 cm", "18 cm", "√194 cm"],
    ans: 1,
    exp: "The tangent is perpendicular to the radius at the point of contact, so radius, tangent and the line to the external point form a right-angled triangle with the 13 cm line as hypotenuse. Length = √(13² − 5²) = √(169 − 25) = √144 = 12 cm.",
  },
  {
    id: 5034, ch: 9, subj: "maths", diff: "hard",
    q: "Two concentric circles have radii 5 cm and 3 cm. The length of the chord of the larger circle which touches the smaller circle is:",
    opts: ["4 cm", "6 cm", "8 cm", "10 cm"],
    ans: 2,
    exp: "The chord is tangent to the smaller circle, so the perpendicular from the common centre to the chord has length 3 cm — and that perpendicular bisects the chord. Half the chord = √(5² − 3²) = √16 = 4 cm, so the full chord = 8 cm. Forgetting to double is what makes 4 cm the main distractor.",
  },
  {
    id: 5035, ch: 9, subj: "maths", diff: "hard",
    q: "A quadrilateral ABCD is drawn to circumscribe a circle. If AB = 6 cm, BC = 7 cm and CD = 4 cm, then AD is:",
    opts: ["3 cm", "4 cm", "5 cm", "9 cm"],
    ans: 0,
    exp: "For any quadrilateral circumscribing a circle, AB + CD = BC + AD. This follows because the two tangents from each vertex are equal in length. So 6 + 4 = 7 + AD → AD = 3 cm.",
  },
  {
    id: 5036, ch: 9, subj: "maths", diff: "medium",
    q: "The number of tangents that can be drawn to a circle from a point lying INSIDE it is:",
    opts: ["0", "1", "2", "Infinitely many"],
    ans: 0,
    exp: "Any line through an interior point must cut the circle at two points, so it is a secant, never a tangent. The full rule: 0 tangents from an interior point, exactly 1 from a point on the circle, and exactly 2 from an exterior point.",
  },

  // ------------------- Ch 10 — Areas Related to Circles -------------------
  {
    id: 5037, ch: 10, subj: "maths", diff: "medium",
    q: "The area of a sector of a circle of radius 6 cm with central angle 60° is (take π = 22/7):",
    opts: ["132/7 cm²", "66/7 cm²", "264/7 cm²", "36 cm²"],
    ans: 0,
    exp: "Area of sector = (θ/360) × πr² = (60/360) × (22/7) × 36 = (1/6) × 792/7 = 132/7 ≈ 18.86 cm². The fraction θ/360 is simply the share of the full circle the sector occupies.",
  },
  {
    id: 5038, ch: 10, subj: "maths", diff: "hard",
    q: "The perimeter of a quadrant of a circle of radius 14 cm is (take π = 22/7):",
    opts: ["22 cm", "44 cm", "50 cm", "72 cm"],
    ans: 2,
    exp: "The perimeter of a quadrant is two radii PLUS the arc, not the arc alone. Arc = (1/4) × 2 × (22/7) × 14 = 22 cm. Perimeter = 14 + 14 + 22 = 50 cm. Answering 22 means only the curved part was counted — a boundary must be closed.",
  },
  {
    id: 5039, ch: 10, subj: "maths", diff: "hard",
    q: "A circular ring has outer radius 14 cm and inner radius 7 cm. Its area is (take π = 22/7):",
    opts: ["154 cm²", "462 cm²", "616 cm²", "770 cm²"],
    ans: 1,
    exp: "Area of ring = π(R² − r²) = (22/7)(196 − 49) = (22/7)(147) = 22 × 21 = 462 cm². Subtracting the radii first and then squaring — giving π(7²) = 154 — is the standard mistake, since R² − r² is not (R − r)².",
  },
  {
    id: 5040, ch: 10, subj: "maths", diff: "medium",
    q: "If the circumference and the area of a circle are numerically equal, then the radius of the circle is:",
    opts: ["1 unit", "2 units", "π units", "4 units"],
    ans: 1,
    exp: "Setting 2πr = πr² and dividing both sides by πr (valid since r ≠ 0) gives 2 = r. Note this is a statement about NUMERICAL values only — circumference is measured in units and area in square units, so they are not physically comparable quantities.",
  },

  // ------------------- Ch 11 — Surface Areas and Volumes -------------------
  {
    id: 5041, ch: 11, subj: "maths", diff: "hard",
    q: "A solid metallic sphere of radius 3 cm is melted and recast into a cone of base radius 3 cm. The height of the cone is:",
    opts: ["6 cm", "9 cm", "12 cm", "4 cm"],
    ans: 2,
    exp: "Recasting conserves volume. Sphere: (4/3)π(3)³ = 36π. Cone: (1/3)π(3)²h = 3πh. Equating: 3πh = 36π → h = 12 cm. In every 'melted and recast' problem, volume is the quantity that stays constant — surface area does not.",
  },
  {
    id: 5042, ch: 11, subj: "maths", diff: "medium",
    q: "The total surface area of a solid hemisphere of radius 7 cm is (take π = 22/7):",
    opts: ["154 cm²", "308 cm²", "462 cm²", "616 cm²"],
    ans: 2,
    exp: "TSA of a solid hemisphere = curved surface + flat circular base = 2πr² + πr² = 3πr² = 3 × (22/7) × 49 = 462 cm². Answering 308 gives only the curved surface (2πr²) and forgets the flat face — the distinction between CSA and TSA is the whole point of the question.",
  },
  {
    id: 5043, ch: 11, subj: "maths", diff: "hard",
    q: "The largest sphere that can be carved out of a cube of side 4 cm has volume:",
    opts: ["32π/3 cm³", "64π/3 cm³", "16π/3 cm³", "256π/3 cm³"],
    ans: 0,
    exp: "The largest inscribed sphere has diameter equal to the cube's side, so diameter = 4 cm and radius = 2 cm. Volume = (4/3)π(2)³ = 32π/3 ≈ 33.5 cm³. Taking the radius as 4 instead of 2 gives 256π/3, the main distractor.",
  },
  {
    id: 5044, ch: 11, subj: "maths", diff: "medium",
    q: "Two cubes each of volume 27 cm³ are joined end to end. The surface area of the resulting cuboid is:",
    opts: ["54 cm²", "72 cm²", "90 cm²", "108 cm²"],
    ans: 2,
    exp: "Each cube has side ∛27 = 3 cm. The cuboid formed is 6 × 3 × 3 cm. Surface area = 2(lb + bh + hl) = 2(18 + 9 + 18) = 2(45) = 90 cm². Note this is LESS than 2 × 54 = 108, because two faces are lost at the join — a useful check.",
  },

  // ------------------- Ch 12 — Statistics -------------------
  {
    id: 5045, ch: 12, subj: "maths", diff: "medium",
    q: "If the mean of a distribution is 25 and the median is 24, then using the empirical relationship the mode is:",
    opts: ["20", "22", "23", "26"],
    ans: 1,
    exp: "The empirical relation is 3 Median = Mode + 2 Mean. So Mode = 3(24) − 2(25) = 72 − 50 = 22. This relation is approximate and applies to moderately skewed distributions — it is used when one of the three measures cannot be computed directly from the data available.",
  },
  {
    id: 5046, ch: 12, subj: "maths", diff: "hard",
    q: "For the class intervals 0–10, 10–20, 20–30, 30–40 with frequencies 5, 8, 12, 5, the median class is:",
    opts: ["0–10", "10–20", "20–30", "30–40"],
    ans: 2,
    exp: "Total n = 30, so n/2 = 15. Cumulative frequencies run 5, 13, 25, 30. The first cumulative frequency to reach or exceed 15 is 25, which belongs to the class 20–30. So 20–30 is the median class. Note the median class is identified from n/2, NOT from the largest frequency — that would give the MODAL class, which happens to be the same here by coincidence.",
  },
  {
    id: 5047, ch: 12, subj: "maths", diff: "hard",
    q: "In the formula for median of grouped data, Median = l + [(n/2 − cf)/f] × h, the term 'cf' stands for:",
    opts: ["The cumulative frequency of the median class", "The cumulative frequency of the class PRECEDING the median class", "The total frequency", "The frequency of the median class"],
    ans: 1,
    exp: "cf is the cumulative frequency of the class immediately BEFORE the median class — it represents how many observations have already been accounted for before entering the median class. Using the median class's own cumulative frequency instead is one of the most common sources of lost marks in this chapter.",
  },
  {
    id: 5048, ch: 12, subj: "maths", diff: "medium",
    q: "While computing the mean of grouped data by the direct method, we assume that the frequency of each class is:",
    opts: ["Evenly distributed across the whole class", "Centred at the class marks", "Centred at the upper limit", "Centred at the lower limit"],
    ans: 1,
    exp: "Each class is represented by its class mark (the midpoint of its limits), and the entire frequency of that class is treated as if concentrated there. This is precisely why the mean of grouped data is an approximation — the original individual values are no longer available.",
  },
  {
    id: 5049, ch: 12, subj: "maths", diff: "hard",
    q: "The mean of 20 observations is 15. If one observation, 24, is wrongly recorded as 42, the correct mean is:",
    opts: ["14.1", "14.5", "15.9", "16.2"],
    ans: 0,
    exp: "Incorrect total = 20 × 15 = 300. Removing the wrong value and inserting the right one: correct total = 300 − 42 + 24 = 282. Correct mean = 282/20 = 14.1. The mean must FALL because the recorded value was too large, which rules out both 15.9 and 16.2 before any arithmetic.",
  },

  // ------------------- Ch 13 — Probability -------------------
  {
    id: 5050, ch: 13, subj: "maths", diff: "medium",
    q: "A die is thrown once. The probability of getting a prime number is:",
    opts: ["1/6", "1/3", "1/2", "2/3"],
    ans: 2,
    exp: "The primes on a die are 2, 3 and 5 — three outcomes out of six. P = 3/6 = 1/2. Note that 1 is NOT prime, which is the point of the question; including it would give 4/6 = 2/3, the main distractor.",
  },
  {
    id: 5051, ch: 13, subj: "maths", diff: "hard",
    q: "Two dice are thrown together. The probability that the sum of the numbers appearing is 8 is:",
    opts: ["5/36", "1/6", "1/9", "7/36"],
    ans: 0,
    exp: "The total number of outcomes is 6 × 6 = 36. Favourable pairs summing to 8 are (2,6), (3,5), (4,4), (5,3), (6,2) — five in all. P = 5/36. Counting (2,6) and (6,2) as one outcome is the usual error; with two distinguishable dice they are different outcomes.",
  },
  {
    id: 5052, ch: 13, subj: "maths", diff: "medium",
    q: "One card is drawn from a well-shuffled deck of 52 cards. The probability of getting a red king is:",
    opts: ["1/52", "1/26", "1/13", "2/13"],
    ans: 1,
    exp: "There are 4 kings in a deck, of which 2 are red (hearts and diamonds). P = 2/52 = 1/26. Answering 1/13 counts all four kings and ignores the colour condition.",
  },
  {
    id: 5053, ch: 13, subj: "maths", diff: "hard",
    q: "A bag contains 3 red, 5 black and 4 white balls. One ball is drawn at random. The probability that it is NEITHER red NOR white is:",
    opts: ["1/3", "5/12", "7/12", "1/4"],
    ans: 1,
    exp: "Total balls = 3 + 5 + 4 = 12. 'Neither red nor white' leaves only the black balls, of which there are 5. P = 5/12. Translating the negative wording into the single remaining category first is faster and safer than computing 1 − P(red or white).",
  },
  {
    id: 5054, ch: 13, subj: "maths", diff: "medium", pyq: true,
    q: "If P(E) = 0.05, then the probability of 'not E' is:",
    opts: ["0.05", "0.5", "0.95", "1.05"],
    ans: 2,
    exp: "P(E) + P(not E) = 1, so P(not E) = 1 − 0.05 = 0.95. E and 'not E' are complementary events — one of them must occur, and they cannot both occur, so their probabilities always sum to exactly 1.",
  },
];

// =====================================================================
// SHORT ANSWERS (2 and 3 mark)
// =====================================================================
// Statistics and Probability previously had ZERO short answers between
// them — the two chapters where worked 2-3 mark practice matters most,
// since both are almost entirely procedural.

export const EXTRA_MATHS_SHORT_QA: MATHSQA[] = [
  {
    id: 5001, ch: 1, subj: "maths", marks: 3,
    q: "Prove that √5 is irrational.",
    a: "PROOF BY CONTRADICTION:\n\nAssume, to the contrary, that √5 is RATIONAL.\n\nThen √5 = p/q, where p and q are integers, q ≠ 0, and p and q are coprime (have no common factor other than 1).\n\nStep 1: Squaring both sides\n5 = p²/q²\n⟹ 5q² = p²   ... (i)\n\nStep 2: Deduce that 5 divides p\nFrom (i), p² is divisible by 5.\nBy the theorem 'if a prime divides a², then it divides a', it follows that 5 divides p.\n\nStep 3: Write p = 5m\nLet p = 5m for some integer m.\nSubstituting in (i): 5q² = (5m)² = 25m²\n⟹ q² = 5m²   ... (ii)\n\nStep 4: Deduce that 5 divides q\nFrom (ii), q² is divisible by 5, so by the same theorem, 5 divides q.\n\nStep 5: The contradiction\n5 divides p AND 5 divides q.\nSo 5 is a common factor of p and q.\n\nBut we assumed p and q are coprime — they have NO common factor other than 1.\n\nThis is a contradiction.\n\nCONCLUSION:\nOur assumption that √5 is rational must be false.\nTherefore √5 is IRRATIONAL. ∎\n\nNOTE: The same argument works for the square root of any prime. It breaks down for √4 exactly where it should — 4 is not prime, so the theorem in Step 2 does not apply.",
  },
  {
    id: 5002, ch: 1, subj: "maths", marks: 2,
    q: "Find the HCF and LCM of 6, 72 and 120 using the prime factorisation method.",
    a: "PRIME FACTORISATION:\n6 = 2 × 3\n72 = 2³ × 3²\n120 = 2³ × 3 × 5\n\nHCF — take the LOWEST power of each COMMON prime:\nCommon primes: 2 and 3\nLowest power of 2 = 2¹\nLowest power of 3 = 3¹\nHCF = 2 × 3 = 6\n\nLCM — take the HIGHEST power of EVERY prime that appears:\nHighest power of 2 = 2³\nHighest power of 3 = 3²\nHighest power of 5 = 5¹\nLCM = 8 × 9 × 5 = 360\n\nANSWER: HCF = 6, LCM = 360\n\nA WARNING: The relation HCF × LCM = product of the numbers holds only for TWO numbers. Here 6 × 360 = 2160, while 6 × 72 × 120 = 51,840 — so the relation does NOT extend to three numbers.",
  },
  {
    id: 5003, ch: 2, subj: "maths", marks: 3,
    q: "Find the zeroes of the quadratic polynomial 4x² − 4x − 3 and verify the relationship between the zeroes and the coefficients.",
    a: "FINDING THE ZEROES — by splitting the middle term:\n\n4x² − 4x − 3 = 0\n\nWe need two numbers whose product is 4 × (−3) = −12 and whose sum is −4.\nThose numbers are −6 and +2.\n\n4x² − 6x + 2x − 3 = 0\n2x(2x − 3) + 1(2x − 3) = 0\n(2x − 3)(2x + 1) = 0\n\nSo x = 3/2 or x = −1/2.\n\nZEROES: α = 3/2, β = −1/2\n\nVERIFICATION:\n\nHere a = 4, b = −4, c = −3.\n\nSum of zeroes:\nα + β = 3/2 + (−1/2) = 2/2 = 1\n−b/a = −(−4)/4 = 4/4 = 1 ✓\n\nProduct of zeroes:\nαβ = (3/2)(−1/2) = −3/4\nc/a = −3/4 ✓\n\nBoth relationships are verified.\n\nWHY THESE RELATIONS HOLD: If α and β are the zeroes, then ax² + bx + c = a(x − α)(x − β) = a[x² − (α + β)x + αβ]. Comparing coefficients gives b = −a(α + β) and c = aαβ directly.",
  },
  {
    id: 5004, ch: 3, subj: "maths", marks: 3,
    q: "Solve the following pair of equations by the elimination method: 3x + 4y = 10 and 2x − 2y = 2.",
    a: "GIVEN:\n3x + 4y = 10   ... (i)\n2x − 2y = 2    ... (ii)\n\nSTEP 1: Make the coefficients of y equal in magnitude.\nMultiply (ii) by 2:\n4x − 4y = 4    ... (iii)\n\nSTEP 2: Add (i) and (iii) to eliminate y.\n(3x + 4y) + (4x − 4y) = 10 + 4\n7x = 14\nx = 2\n\nSTEP 3: Substitute x = 2 into (ii).\n2(2) − 2y = 2\n4 − 2y = 2\n−2y = −2\ny = 1\n\nANSWER: x = 2, y = 1\n\nVERIFICATION — check in BOTH original equations:\n(i): 3(2) + 4(1) = 6 + 4 = 10 ✓\n(ii): 2(2) − 2(1) = 4 − 2 = 2 ✓\n\nWHY ADD RATHER THAN SUBTRACT: The y-terms were +4y and −4y — opposite in sign, so adding cancels them. If both signs had been the same, we would subtract instead. Checking the signs before deciding avoids the most common slip in this method.",
  },
  {
    id: 5005, ch: 3, subj: "maths", marks: 3,
    q: "The coach of a cricket team buys 7 bats and 6 balls for ₹3800. Later she buys 3 bats and 5 balls for ₹1750. Find the cost of each bat and each ball.",
    a: "SETTING UP:\nLet the cost of one bat = ₹x and one ball = ₹y.\n\n7x + 6y = 3800   ... (i)\n3x + 5y = 1750   ... (ii)\n\nSTEP 1: Eliminate x. Multiply (i) by 3 and (ii) by 7.\n21x + 18y = 11400   ... (iii)\n21x + 35y = 12250   ... (iv)\n\nSTEP 2: Subtract (iii) from (iv).\n(21x + 35y) − (21x + 18y) = 12250 − 11400\n17y = 850\ny = 50\n\nSTEP 3: Substitute y = 50 into (ii).\n3x + 5(50) = 1750\n3x + 250 = 1750\n3x = 1500\nx = 500\n\nANSWER: Each bat costs ₹500 and each ball costs ₹50.\n\nVERIFICATION:\n(i): 7(500) + 6(50) = 3500 + 300 = ₹3800 ✓\n(ii): 3(500) + 5(50) = 1500 + 250 = ₹1750 ✓\n\nNOTE ON METHOD: Defining the variables explicitly in the first line is worth doing even when it seems obvious — board marking schemes award a mark for it, and it prevents confusion later about which variable is which.",
  },
  {
    id: 5006, ch: 4, subj: "maths", marks: 3,
    q: "Find the value of k for which the quadratic equation 2x² + kx + 3 = 0 has two equal real roots, and find those roots.",
    a: "CONDITION FOR EQUAL ROOTS:\nThe discriminant must be zero: D = b² − 4ac = 0\n\nHere a = 2, b = k, c = 3.\n\nk² − 4(2)(3) = 0\nk² − 24 = 0\nk² = 24\nk = ±2√6\n\nSO: k = 2√6 or k = −2√6\n\nFINDING THE ROOTS:\nWhen D = 0, both roots are equal to −b/2a.\n\nCASE 1 — k = 2√6:\nRoot = −2√6 / (2 × 2) = −2√6/4 = −√6/2\n\nCASE 2 — k = −2√6:\nRoot = −(−2√6) / 4 = 2√6/4 = √6/2\n\nANSWER:\nk = 2√6 gives a repeated root of −√6/2\nk = −2√6 gives a repeated root of √6/2\n\nWHY BOTH SIGNS ARE VALID: The equation k² = 24 has two solutions, and there is nothing in the problem restricting k to positive values. Giving only k = 2√6 loses marks — unless the question explicitly says k > 0, both must be stated.",
  },
  {
    id: 5007, ch: 4, subj: "maths", marks: 3,
    q: "The sum of two numbers is 27 and their product is 182. Find the numbers.",
    a: "SETTING UP:\nLet one number be x. Then the other is 27 − x.\n\nGiven their product is 182:\nx(27 − x) = 182\n27x − x² = 182\nx² − 27x + 182 = 0\n\nSOLVING by splitting the middle term:\nWe need two numbers whose product is 182 and whose sum is 27.\n182 = 13 × 14, and 13 + 14 = 27. ✓\n\nx² − 13x − 14x + 182 = 0\nx(x − 13) − 14(x − 13) = 0\n(x − 13)(x − 14) = 0\n\nx = 13 or x = 14\n\nANSWER: The numbers are 13 and 14.\n\nNOTE: Both roots give the same PAIR of numbers — if x = 13 then the other is 14, and if x = 14 then the other is 13. This is not two different answers but one answer arrived at from either starting point, and it is worth saying so explicitly rather than presenting them as separate solutions.\n\nVERIFICATION: 13 + 14 = 27 ✓ and 13 × 14 = 182 ✓",
  },
  {
    id: 5008, ch: 5, subj: "maths", marks: 3,
    q: "Find the sum of all three-digit numbers which are divisible by 7.",
    a: "IDENTIFYING THE AP:\nThe smallest three-digit multiple of 7: 7 × 15 = 105\nThe largest three-digit multiple of 7: 7 × 142 = 994 (since 7 × 143 = 1001, which is four digits)\n\nSo the AP is 105, 112, 119, ..., 994 with a = 105 and d = 7.\n\nSTEP 1: Find the number of terms.\naₙ = a + (n − 1)d\n994 = 105 + (n − 1)7\n889 = 7(n − 1)\nn − 1 = 127\nn = 128\n\nSTEP 2: Find the sum.\nSₙ = n/2 (a + aₙ)\nS₁₂₈ = 128/2 × (105 + 994)\nS₁₂₈ = 64 × 1099\nS₁₂₈ = 70,336\n\nANSWER: The sum is 70,336.\n\nCHECK ON THE TERM COUNT: The multiples run from 7 × 15 to 7 × 142, so there are 142 − 15 + 1 = 128 terms. ✓ This second route is a useful independent check, since miscounting n is the most common error in this type of question.",
  },
  {
    id: 5009, ch: 5, subj: "maths", marks: 2,
    q: "The 17th term of an AP exceeds its 10th term by 7. Find the common difference.",
    a: "GIVEN: a₁₇ − a₁₀ = 7\n\nUsing aₙ = a + (n − 1)d:\na₁₇ = a + 16d\na₁₀ = a + 9d\n\nSUBSTITUTING:\n(a + 16d) − (a + 9d) = 7\na + 16d − a − 9d = 7\n7d = 7\nd = 1\n\nANSWER: The common difference is 1.\n\nTHE USEFUL SHORTCUT:\nNotice that a cancelled completely. In general, aₘ − aₙ = (m − n)d. Here 17 − 10 = 7 terms apart, so 7d = 7 and d = 1 immediately.\n\nThis also explains why the first term a cannot be determined from the information given — the difference between two terms depends only on d, never on a.",
  },
  {
    id: 5010, ch: 6, subj: "maths", marks: 3,
    q: "State and prove the Basic Proportionality Theorem (Thales' Theorem).",
    a: "STATEMENT:\nIf a line is drawn parallel to one side of a triangle to intersect the other two sides at distinct points, then the other two sides are divided in the same ratio.\n\nGIVEN: △ABC with DE ∥ BC, where D lies on AB and E lies on AC.\nTO PROVE: AD/DB = AE/EC\n\nCONSTRUCTION: Join BE and CD. Draw EM ⊥ AB and DN ⊥ AC.\n\nPROOF:\n\nStep 1 — Express the ratio using areas.\nar(△ADE)/ar(△DBE) = [(1/2) × AD × EM] / [(1/2) × DB × EM] = AD/DB\n(The two triangles share the same height EM from vertex E.)\n\nStep 2 — Do the same on the other side.\nar(△ADE)/ar(△DEC) = [(1/2) × AE × DN] / [(1/2) × EC × DN] = AE/EC\n(These two share the same height DN from vertex D.)\n\nStep 3 — The key observation.\n△DBE and △DEC lie on the SAME base DE and BETWEEN the same parallels DE and BC.\nTherefore ar(△DBE) = ar(△DEC).\n\nStep 4 — Combine.\nSince the two denominators are equal and both fractions have the same numerator ar(△ADE):\nAD/DB = AE/EC ∎\n\nWHY THE PARALLEL CONDITION IS ESSENTIAL: Step 3 is the only place DE ∥ BC is used, and the entire proof rests on it. Without the parallel condition the two triangles need not have equal areas, and the result fails.",
  },
  {
    id: 5011, ch: 6, subj: "maths", marks: 3,
    q: "In △ABC, AD is the bisector of ∠A meeting BC at D. If AB = 10 cm, AC = 14 cm and BC = 6 cm, find BD and DC.",
    a: "THEOREM USED — the Angle Bisector Theorem:\nThe internal bisector of an angle of a triangle divides the opposite side in the ratio of the sides containing the angle.\n\nSo BD/DC = AB/AC\n\nSUBSTITUTING:\nBD/DC = 10/14 = 5/7\n\nLet BD = 5k and DC = 7k.\n\nSince D lies on BC:\nBD + DC = BC\n5k + 7k = 6\n12k = 6\nk = 0.5\n\nTHEREFORE:\nBD = 5(0.5) = 2.5 cm\nDC = 7(0.5) = 3.5 cm\n\nANSWER: BD = 2.5 cm and DC = 3.5 cm\n\nVERIFICATION:\nBD + DC = 2.5 + 3.5 = 6 cm = BC ✓\nBD/DC = 2.5/3.5 = 5/7 = 10/14 = AB/AC ✓\n\nNOTE ON METHOD: Introducing the parameter k converts a ratio into actual lengths in one step. Trying to work directly with fractions of 6 is possible but far more error-prone.",
  },
  {
    id: 5012, ch: 7, subj: "maths", marks: 3,
    q: "Show that the points A(1, 7), B(4, 2), C(−1, −1) and D(−4, 4) are the vertices of a square.",
    a: "STRATEGY: A quadrilateral is a square if all four sides are equal AND both diagonals are equal. (Equal sides alone would only prove a rhombus.)\n\nSTEP 1 — Find the four sides.\n\nAB = √[(4−1)² + (2−7)²] = √[9 + 25] = √34\nBC = √[(−1−4)² + (−1−2)²] = √[25 + 9] = √34\nCD = √[(−4+1)² + (4+1)²] = √[9 + 25] = √34\nDA = √[(1+4)² + (7−4)²] = √[25 + 9] = √34\n\nAll four sides are equal: AB = BC = CD = DA = √34 ✓\n\nSTEP 2 — Find the two diagonals.\n\nAC = √[(−1−1)² + (−1−7)²] = √[4 + 64] = √68\nBD = √[(−4−4)² + (4−2)²] = √[64 + 4] = √68\n\nBoth diagonals are equal: AC = BD = √68 ✓\n\nCONCLUSION:\nAll four sides are equal and both diagonals are equal.\nTherefore ABCD is a SQUARE. ∎\n\nA USEFUL CROSS-CHECK: In a square, diagonal² = 2 × side². Here 68 = 2 × 34 ✓ — which confirms the answer independently.\n\nWHY BOTH CONDITIONS ARE NEEDED: A rhombus also has four equal sides but unequal diagonals; a rectangle has equal diagonals but unequal adjacent sides. Only a square has both properties together, so checking one alone is insufficient.",
  },
  {
    id: 5013, ch: 7, subj: "maths", marks: 2,
    q: "Find the ratio in which the line segment joining A(1, −5) and B(−4, 5) is divided by the x-axis. Also find the coordinates of the point of division.",
    a: "KEY IDEA: Any point on the x-axis has y-coordinate 0. We use this condition to find the ratio.\n\nLet the x-axis divide AB in the ratio k : 1 at point P.\n\nBy the section formula, the y-coordinate of P is:\ny = (k(5) + 1(−5)) / (k + 1) = (5k − 5)/(k + 1)\n\nSince P lies on the x-axis, y = 0:\n(5k − 5)/(k + 1) = 0\n5k − 5 = 0\nk = 1\n\nSO THE RATIO IS 1 : 1 — the x-axis bisects AB.\n\nFINDING THE COORDINATES:\nx = (1(−4) + 1(1)) / (1 + 1) = −3/2\ny = 0 (by construction)\n\nANSWER: The ratio is 1 : 1, and the point of division is (−3/2, 0).\n\nWHY k : 1 RATHER THAN m : n: Using a single unknown k reduces the problem to one equation in one variable. Since the ratio is what matters and not the individual values, fixing the second part as 1 loses no generality.",
  },
  {
    id: 5014, ch: 8, subj: "maths", marks: 3,
    q: "The angle of elevation of the top of a tower from a point on the ground is 30°. On walking 20 m towards the tower, the angle becomes 60°. Find the height of the tower.",
    a: "SETTING UP:\nLet the height of the tower be h metres and let the foot of the tower be at B.\nLet the nearer point be C (where the angle is 60°) and the farther point be D (where the angle is 30°).\nLet BC = x metres. Then BD = x + 20 metres.\n\nFROM THE NEARER POINT (60°):\ntan 60° = h/x\n√3 = h/x\nh = √3 x   ... (i)\n\nFROM THE FARTHER POINT (30°):\ntan 30° = h/(x + 20)\n1/√3 = h/(x + 20)\nh√3 = x + 20   ... (ii)\n\nSOLVING: Substitute (i) into (ii).\n(√3 x)(√3) = x + 20\n3x = x + 20\n2x = 20\nx = 10\n\nFinding h from (i):\nh = √3 × 10 = 10√3\n\nANSWER: The height of the tower is 10√3 ≈ 17.32 metres.\n\nVERIFICATION:\nFrom 10 m away: tan θ = 17.32/10 = 1.732 = √3, so θ = 60° ✓\nFrom 30 m away: tan θ = 17.32/30 = 0.577 = 1/√3, so θ = 30° ✓\n\nNOTE ON SETUP: The larger angle always corresponds to the NEARER point. Assigning them the wrong way round gives a negative distance, which is the immediate signal that the diagram was mislabelled.",
  },
  {
    id: 5015, ch: 9, subj: "maths", marks: 3,
    q: "Prove that the lengths of tangents drawn from an external point to a circle are equal.",
    a: "GIVEN: A circle with centre O, an external point P, and two tangents PA and PB touching the circle at A and B.\n\nTO PROVE: PA = PB\n\nCONSTRUCTION: Join OA, OB and OP.\n\nPROOF:\n\nStep 1 — Identify the right angles.\nOA ⊥ PA and OB ⊥ PB\n(A tangent at any point of a circle is perpendicular to the radius through the point of contact.)\n\nSo ∠OAP = ∠OBP = 90°.\n\nStep 2 — Compare △OAP and △OBP.\n\nOA = OB          (radii of the same circle)\nOP = OP          (common hypotenuse)\n∠OAP = ∠OBP = 90°\n\nStep 3 — Apply the congruence criterion.\nBy RHS (Right angle – Hypotenuse – Side) congruence:\n△OAP ≅ △OBP\n\nStep 4 — Conclude.\nBy CPCT (Corresponding Parts of Congruent Triangles):\nPA = PB ∎\n\nAN ADDITIONAL RESULT FROM THE SAME PROOF:\nSince the triangles are congruent, ∠OPA = ∠OPB — meaning OP bisects the angle between the two tangents. This corollary is frequently required in follow-up questions, so it is worth stating alongside the main result.\n\nWHY RHS AND NOT SAS: The equal angle (90°) is not included between the two known equal sides OA and OP — it lies opposite OP. SAS therefore does not apply, and RHS is the correct criterion.",
  },
  {
    id: 5016, ch: 10, subj: "maths", marks: 3,
    q: "A chord of a circle of radius 10 cm subtends a right angle at the centre. Find the area of the corresponding minor segment. (Use π = 3.14)",
    a: "GIVEN: r = 10 cm, θ = 90°\n\nKEY IDEA: Area of segment = Area of sector − Area of triangle\n\nSTEP 1 — Area of the sector.\nArea = (θ/360) × πr²\n= (90/360) × 3.14 × 100\n= (1/4) × 314\n= 78.5 cm²\n\nSTEP 2 — Area of the triangle.\nThe two radii form the two perpendicular sides of a right-angled triangle at the centre.\nArea = (1/2) × base × height = (1/2) × 10 × 10 = 50 cm²\n\nSTEP 3 — Area of the minor segment.\nArea = 78.5 − 50 = 28.5 cm²\n\nANSWER: The area of the minor segment is 28.5 cm².\n\nBONUS — the major segment:\nArea of circle = 3.14 × 100 = 314 cm²\nMajor segment = 314 − 28.5 = 285.5 cm²\n\nWHY THE SUBTRACTION WORKS: The sector is bounded by two radii and the arc. The segment is bounded by the CHORD and the arc. The difference between them is exactly the triangle formed by the two radii and the chord — so subtracting it converts one into the other.",
  },
  {
    id: 5017, ch: 11, subj: "maths", marks: 3,
    q: "A solid is in the shape of a cone mounted on a hemisphere, both having the same radius 7 cm. If the total height of the solid is 21 cm, find its volume. (Use π = 22/7)",
    a: "GIVEN:\nRadius of hemisphere = radius of cone = r = 7 cm\nTotal height of solid = 21 cm\n\nSTEP 1 — Find the height of the cone.\nThe hemisphere contributes a height equal to its radius.\nHeight of cone = Total height − radius of hemisphere\nh = 21 − 7 = 14 cm\n\nSTEP 2 — Volume of the hemisphere.\nV₁ = (2/3)πr³\n= (2/3) × (22/7) × 343\n= (2/3) × 22 × 49\n= 2156/3 cm³\n\nSTEP 3 — Volume of the cone.\nV₂ = (1/3)πr²h\n= (1/3) × (22/7) × 49 × 14\n= (1/3) × 22 × 7 × 14\n= 2156/3 cm³\n\nSTEP 4 — Total volume.\nV = V₁ + V₂ = 2156/3 + 2156/3 = 4312/3 ≈ 1437.33 cm³\n\nANSWER: The volume of the solid is 4312/3 ≈ 1437.33 cm³\n\nTHE STEP THAT COSTS MARKS: Step 1. It is tempting to use 21 cm as the cone's height, but the hemisphere occupies the bottom 7 cm of the total. Drawing the figure and marking both parts before computing prevents this.\n\nAN INTERESTING OBSERVATION: The two volumes came out identical here. That happens precisely when h = 2r for the cone, since (1/3)πr²(2r) = (2/3)πr³ — a neat coincidence built into the numbers of this question.",
  },
  {
    id: 5018, ch: 12, subj: "maths", marks: 3,
    q: "Find the mean of the following distribution using the direct method:\nClass: 0–10, 10–20, 20–30, 30–40, 40–50\nFrequency: 5, 8, 15, 16, 6",
    a: "METHOD: Mean = Σfᵢxᵢ / Σfᵢ, where xᵢ is the class mark (midpoint).\n\nTABLE:\n\nClass | fᵢ | xᵢ (class mark) | fᵢxᵢ\n0–10  |  5 |  5 |   25\n10–20 |  8 | 15 |  120\n20–30 | 15 | 25 |  375\n30–40 | 16 | 35 |  560\n40–50 |  6 | 45 |  270\n\nΣfᵢ = 5 + 8 + 15 + 16 + 6 = 50\nΣfᵢxᵢ = 25 + 120 + 375 + 560 + 270 = 1350\n\nCALCULATION:\nMean = Σfᵢxᵢ / Σfᵢ = 1350/50 = 27\n\nANSWER: The mean is 27.\n\nHOW THE CLASS MARK IS FOUND:\nxᵢ = (lower limit + upper limit)/2\nFor 0–10: (0 + 10)/2 = 5\nFor 10–20: (10 + 20)/2 = 15, and so on.\n\nA SANITY CHECK: The mean must lie within the range of the data, and closer to the classes with the highest frequencies. The heaviest frequencies are at 20–30 and 30–40, so a mean of 27 sitting between them is exactly what we should expect.\n\nWHY THIS IS AN APPROXIMATION: Using the class mark assumes every observation in a class sits at its midpoint. The true individual values are unknown once data has been grouped, so the grouped mean will generally differ slightly from the mean of the raw data.",
  },
  {
    id: 5019, ch: 12, subj: "maths", marks: 3,
    q: "Find the median of the following data:\nClass: 0–10, 10–20, 20–30, 30–40, 40–50\nFrequency: 5, 3, 10, 6, 6",
    a: "FORMULA:\nMedian = l + [(n/2 − cf)/f] × h\n\nwhere l = lower limit of median class, n = total frequency, cf = cumulative frequency of the class BEFORE the median class, f = frequency of the median class, h = class width.\n\nSTEP 1 — Build the cumulative frequency table.\n\nClass | f | Cumulative frequency\n0–10  |  5 |  5\n10–20 |  3 |  8\n20–30 | 10 | 18\n30–40 |  6 | 24\n40–50 |  6 | 30\n\nSTEP 2 — Locate the median class.\nn = 30, so n/2 = 15.\nThe first cumulative frequency to reach or exceed 15 is 18, which belongs to the class 20–30.\n\nMEDIAN CLASS = 20–30\n\nSTEP 3 — Identify the values.\nl = 20\nn/2 = 15\ncf = 8   (cumulative frequency of 10–20, the class BEFORE the median class)\nf = 10   (frequency of the median class itself)\nh = 10\n\nSTEP 4 — Substitute.\nMedian = 20 + [(15 − 8)/10] × 10\n= 20 + (7/10) × 10\n= 20 + 7\n= 27\n\nANSWER: The median is 27.\n\nTHE MOST COMMON ERROR: Using cf = 18 (the median class's own cumulative frequency) instead of cf = 8. The cf in this formula always refers to the class BEFORE — it counts how many observations were already passed before entering the median class.\n\nA CHECK: The median must lie inside the median class, and 27 does lie between 20 and 30. ✓",
  },
  {
    id: 5020, ch: 12, subj: "maths", marks: 3,
    q: "Find the mode of the following distribution:\nClass: 10–20, 20–30, 30–40, 40–50, 50–60\nFrequency: 4, 8, 10, 12, 6",
    a: "FORMULA:\nMode = l + [(f₁ − f₀)/(2f₁ − f₀ − f₂)] × h\n\nwhere l = lower limit of modal class, f₁ = frequency of modal class, f₀ = frequency of the class BEFORE it, f₂ = frequency of the class AFTER it, h = class width.\n\nSTEP 1 — Identify the modal class.\nThe highest frequency is 12, belonging to the class 40–50.\n\nMODAL CLASS = 40–50\n\nSTEP 2 — Identify the values.\nl = 40\nf₁ = 12   (modal class)\nf₀ = 10   (class before: 30–40)\nf₂ = 6    (class after: 50–60)\nh = 10\n\nSTEP 3 — Substitute.\nMode = 40 + [(12 − 10)/(2(12) − 10 − 6)] × 10\n= 40 + [2/(24 − 16)] × 10\n= 40 + (2/8) × 10\n= 40 + 2.5\n= 42.5\n\nANSWER: The mode is 42.5.\n\nWHAT THE FORMULA IS DOING: The modal class is the interval containing the most observations, but the mode need not sit at its midpoint. The fraction compares how much the modal frequency exceeds the class before it against the total 'excess' over both neighbours, then shifts the mode within the class accordingly — toward whichever neighbour has the higher frequency.\n\nA CHECK: The mode must lie within the modal class, and 42.5 lies between 40 and 50. ✓ Here it sits below the midpoint 45, which is correct because the preceding class (10) is heavier than the following one (6), pulling the mode leftward.",
  },
  {
    id: 5021, ch: 13, subj: "maths", marks: 3,
    q: "A box contains 90 discs numbered 1 to 90. One disc is drawn at random. Find the probability that it bears (i) a two-digit number, (ii) a perfect square number, (iii) a number divisible by 5.",
    a: "TOTAL OUTCOMES: 90 (the discs numbered 1 to 90)\n\n(i) A TWO-DIGIT NUMBER\n\nTwo-digit numbers run from 10 to 90.\nCount = 90 − 10 + 1 = 81\n\nP(two-digit) = 81/90 = 9/10\n\n(ii) A PERFECT SQUARE\n\nPerfect squares from 1 to 90:\n1, 4, 9, 16, 25, 36, 49, 64, 81\n(The next would be 100, which exceeds 90.)\nCount = 9\n\nP(perfect square) = 9/90 = 1/10\n\n(iii) A NUMBER DIVISIBLE BY 5\n\nMultiples of 5 from 1 to 90: 5, 10, 15, ..., 90\nCount = 90/5 = 18\n\nP(divisible by 5) = 18/90 = 1/5\n\nANSWERS: (i) 9/10  (ii) 1/10  (iii) 1/5\n\nNOTE ON COUNTING: For part (i), using 90 − 10 = 80 is the standard slip. When counting whole numbers in an inclusive range, the count is (last − first + 1) — the '+1' is needed because both endpoints are included.\n\nA SANITY CHECK: Every probability came out between 0 and 1, and the most likely event (a two-digit number, at 9/10) is intuitively the one that should be most likely. ✓",
  },
  {
    id: 5022, ch: 13, subj: "maths", marks: 3,
    q: "Two dice are thrown simultaneously. Find the probability of getting (i) the same number on both dice, (ii) a sum greater than 9, (iii) a product that is an even number.",
    a: "TOTAL OUTCOMES: 6 × 6 = 36\n(Each die is distinguishable, so (1,2) and (2,1) are different outcomes.)\n\n(i) THE SAME NUMBER ON BOTH DICE\n\nFavourable outcomes: (1,1), (2,2), (3,3), (4,4), (5,5), (6,6)\nCount = 6\n\nP(same number) = 6/36 = 1/6\n\n(ii) A SUM GREATER THAN 9\n\nThis means a sum of 10, 11 or 12.\n\nSum = 10: (4,6), (5,5), (6,4) → 3 outcomes\nSum = 11: (5,6), (6,5) → 2 outcomes\nSum = 12: (6,6) → 1 outcome\n\nCount = 3 + 2 + 1 = 6\n\nP(sum > 9) = 6/36 = 1/6\n\n(iii) AN EVEN PRODUCT\n\nEasier to find the complement. A product is ODD only when BOTH numbers are odd.\nOdd numbers on a die: 1, 3, 5 → 3 choices per die\nOutcomes with both odd = 3 × 3 = 9\n\nP(odd product) = 9/36 = 1/4\nP(even product) = 1 − 1/4 = 3/4\n\nANSWERS: (i) 1/6  (ii) 1/6  (iii) 3/4\n\nWHY THE COMPLEMENT WAS USED IN (iii): Listing all outcomes with an even product would mean counting 27 cases. Counting the 9 odd-product cases and subtracting from 1 is far quicker and far less error-prone — whenever the favourable set is much larger than its complement, work with the complement instead.\n\nNOTE ON 'GREATER THAN 9': This excludes 9 itself. If the question had said 'at least 9' or '9 or more', the four outcomes summing to 9 would also count.",
  },
  {
    id: 5023, ch: 13, subj: "maths", marks: 2,
    q: "A game consists of tossing a coin 3 times. Find the probability of getting exactly two heads.",
    a: "LISTING THE SAMPLE SPACE:\nEach toss has 2 outcomes, so the total is 2³ = 8.\n\nAll possible outcomes:\nHHH, HHT, HTH, HTT, THH, THT, TTH, TTT\n\nFAVOURABLE OUTCOMES — exactly two heads:\nHHT, HTH, THH\nCount = 3\n\nP(exactly two heads) = 3/8\n\nANSWER: 3/8\n\nWHY ORDER MATTERS: HHT, HTH and THH are three DIFFERENT outcomes, even though all three contain two heads and one tail. Treating them as a single outcome would give the wrong total and the wrong probability.\n\nNOTE ON 'EXACTLY': This excludes HHH, which has three heads. Had the question asked for 'at least two heads', HHH would also count, giving 4/8 = 1/2.",
  },
];

// =====================================================================
// LONG ANSWERS (4 and 5 mark)
// =====================================================================
// Polynomials, Pair of Linear Equations and Coordinate Geometry had no
// long-answer coverage at all before this pack.

export const EXTRA_MATHS_LONG_QA: MATHSQA[] = [
  {
    id: 5001, ch: 2, subj: "maths", marks: 5, pyq: true,
    q: "If α and β are the zeroes of the polynomial p(x) = 2x² − 4x + 5, find the value of (i) α² + β², (ii) 1/α + 1/β, (iii) (α − β)², (iv) α³ + β³. Hence write a quadratic polynomial whose zeroes are α² and β².",
    a: "FINDING THE BASIC RELATIONS:\n\nFor p(x) = 2x² − 4x + 5, we have a = 2, b = −4, c = 5.\n\nSum of zeroes:   α + β = −b/a = 4/2 = 2\nProduct of zeroes: αβ = c/a = 5/2\n\nThe whole question is now answered from these two numbers — the individual zeroes are never needed (and in fact are not real here, since D = 16 − 40 = −24 < 0).\n\n(i) α² + β²\n\nUse the identity (α + β)² = α² + β² + 2αβ\n\nα² + β² = (α + β)² − 2αβ\n= (2)² − 2(5/2)\n= 4 − 5\n= −1\n\n(ii) 1/α + 1/β\n\n1/α + 1/β = (β + α)/(αβ)\n= 2 / (5/2)\n= 2 × 2/5\n= 4/5\n\n(iii) (α − β)²\n\nUse (α − β)² = (α + β)² − 4αβ\n\n= (2)² − 4(5/2)\n= 4 − 10\n= −6\n\n(iv) α³ + β³\n\nUse the identity α³ + β³ = (α + β)³ − 3αβ(α + β)\n\n= (2)³ − 3(5/2)(2)\n= 8 − 15\n= −7\n\nBUILDING THE NEW POLYNOMIAL:\n\nWe need a quadratic whose zeroes are α² and β².\n\nSum of new zeroes = α² + β² = −1   (from part (i))\n\nProduct of new zeroes = α²β² = (αβ)² = (5/2)² = 25/4\n\nThe polynomial is:\nx² − (sum)x + product\n= x² − (−1)x + 25/4\n= x² + x + 25/4\n\nMultiplying throughout by 4 to clear the fraction (which does not change the zeroes):\n\n4x² + 4x + 25\n\nANSWER: A required polynomial is 4x² + 4x + 25 (or any non-zero multiple of it).\n\nA NOTE ON THE NEGATIVE RESULTS:\n\nParts (i) and (iii) gave negative values, which looks impossible — a sum of squares and a square are normally non-negative.\n\nThe explanation is that this polynomial has D = b² − 4ac = 16 − 40 = −24 < 0, so α and β are not real numbers. For non-real zeroes, α² + β² and (α − β)² are perfectly entitled to be negative.\n\nThis is worth noticing rather than assuming an arithmetic error has been made. The identities used are algebraic and remain valid whether or not the zeroes are real, which is exactly why this approach works.\n\nTHE GENERAL LESSON:\nEvery part of this question was solved WITHOUT finding α and β individually. Whenever a question asks for a symmetric expression in the zeroes, express it in terms of (α + β) and αβ first — it is faster, and it works even when the zeroes cannot be written down.",
  },
  {
    id: 5002, ch: 3, subj: "maths", marks: 5,
    q: "A boat goes 30 km upstream and 44 km downstream in 10 hours. In 13 hours it can go 40 km upstream and 55 km downstream. Determine the speed of the stream and that of the boat in still water.",
    a: "SETTING UP THE VARIABLES:\n\nLet the speed of the boat in still water = x km/h\nLet the speed of the stream = y km/h\n\nUPSTREAM the boat moves against the current, so effective speed = (x − y) km/h\nDOWNSTREAM the boat moves with the current, so effective speed = (x + y) km/h\n\nUsing Time = Distance / Speed:\n\nEQUATION 1 (10 hours):\n30/(x − y) + 44/(x + y) = 10\n\nEQUATION 2 (13 hours):\n40/(x − y) + 55/(x + y) = 13\n\nTHE SUBSTITUTION THAT MAKES THIS SOLVABLE:\n\nThese are not linear equations as they stand. Let:\n1/(x − y) = u\n1/(x + y) = v\n\nThe system becomes linear:\n30u + 44v = 10   ... (i)\n40u + 55v = 13   ... (ii)\n\nSOLVING THE LINEAR SYSTEM:\n\nMultiply (i) by 4 and (ii) by 3 to match the u-coefficients:\n120u + 176v = 40   ... (iii)\n120u + 165v = 39   ... (iv)\n\nSubtract (iv) from (iii):\n11v = 1\nv = 1/11\n\nSubstitute v = 1/11 into (i):\n30u + 44(1/11) = 10\n30u + 4 = 10\n30u = 6\nu = 1/5\n\nRETURNING TO x AND y:\n\nFrom u = 1/(x − y) = 1/5:\nx − y = 5   ... (v)\n\nFrom v = 1/(x + y) = 1/11:\nx + y = 11   ... (vi)\n\nAdding (v) and (vi):\n2x = 16\nx = 8\n\nSubstituting into (vi):\n8 + y = 11\ny = 3\n\nANSWER:\nSpeed of the boat in still water = 8 km/h\nSpeed of the stream = 3 km/h\n\nVERIFICATION:\n\nUpstream speed = 8 − 3 = 5 km/h\nDownstream speed = 8 + 3 = 11 km/h\n\nCheck against the first condition:\n30/5 + 44/11 = 6 + 4 = 10 hours ✓\n\nCheck against the second condition:\n40/5 + 55/11 = 8 + 5 = 13 hours ✓\n\nBoth conditions are satisfied.\n\nWHY THE SUBSTITUTION WAS NECESSARY:\n\nThe original equations have the unknowns in the DENOMINATORS, which makes them non-linear. Clearing the denominators directly would produce messy second-degree terms.\n\nSubstituting u and v converts the problem into an ordinary pair of linear equations, which can be solved by elimination in a few lines. This 'reducible to linear form' technique appears regularly in board papers — typically in boat-and-stream, work-and-time, or train-speed problems.\n\nA PRACTICAL CHECK ON THE ANSWER: The stream speed must be less than the boat speed, otherwise the boat could never travel upstream at all. Here 3 < 8, so the answer is physically sensible. If the working had produced y > x, that would be an immediate signal of an error.",
  },
  {
    id: 5003, ch: 7, subj: "maths", marks: 5,
    q: "(a) Find the ratio in which the point P(−3, k) divides the line segment joining A(−5, −4) and B(−2, 3). Also find the value of k. (b) Show that the points (3, 0), (6, 4) and (−1, 3) are the vertices of a right-angled isosceles triangle.",
    a: "PART (a) — FINDING THE RATIO AND k\n\nLet P divide AB in the ratio m : n.\n\nBy the section formula, the x-coordinate of P is:\nx = (m(x₂) + n(x₁)) / (m + n)\n\nSubstituting x = −3, x₁ = −5, x₂ = −2:\n−3 = (m(−2) + n(−5)) / (m + n)\n\nCross-multiplying:\n−3(m + n) = −2m − 5n\n−3m − 3n = −2m − 5n\n−3m + 2m = −5n + 3n\n−m = −2n\nm = 2n\n\nSo m : n = 2 : 1\n\nTHE RATIO IS 2 : 1\n\nNow find k using the y-coordinate:\nk = (m(y₂) + n(y₁)) / (m + n)\n= (2(3) + 1(−4)) / (2 + 1)\n= (6 − 4)/3\n= 2/3\n\nANSWER TO (a): The ratio is 2 : 1 and k = 2/3.\n\nVERIFICATION: Check the x-coordinate with these values.\nx = (2(−2) + 1(−5))/3 = (−4 − 5)/3 = −9/3 = −3 ✓\n\nPART (b) — THE RIGHT-ANGLED ISOSCELES TRIANGLE\n\nLet A(3, 0), B(6, 4) and C(−1, 3).\n\nSTEP 1 — Find the three side lengths using the distance formula.\n\nAB = √[(6 − 3)² + (4 − 0)²]\n= √[9 + 16]\n= √25 = 5\n\nBC = √[(−1 − 6)² + (3 − 4)²]\n= √[49 + 1]\n= √50\n\nCA = √[(3 − (−1))² + (0 − 3)²]\n= √[16 + 9]\n= √25 = 5\n\nSTEP 2 — Test for isosceles.\n\nAB = CA = 5\n\nTwo sides are equal, so the triangle is ISOSCELES. ✓\n\nSTEP 3 — Test for right-angled using the converse of Pythagoras.\n\nThe longest side is BC = √50, so if there is a right angle it must be at A (opposite BC).\n\nAB² + CA² = 25 + 25 = 50\nBC² = (√50)² = 50\n\nSince AB² + CA² = BC², by the converse of the Pythagoras theorem the triangle is RIGHT-ANGLED at A. ✓\n\nCONCLUSION:\nThe triangle has two equal sides (AB = CA = 5) and satisfies the Pythagoras relation with the right angle at A.\n\nTherefore the points (3, 0), (6, 4) and (−1, 3) are the vertices of a RIGHT-ANGLED ISOSCELES TRIANGLE. ∎\n\nTWO POINTS OF METHOD WORTH NOTING:\n\n1. WHY THE LONGEST SIDE IS IDENTIFIED FIRST. In the converse of Pythagoras, the hypotenuse must be the longest side, and the right angle lies opposite it. Testing the wrong pairing (say AB² + BC² = CA²) would give 25 + 50 = 75 ≠ 25 and wrongly suggest there is no right angle.\n\n2. WHY √50 WAS NOT SIMPLIFIED. Leaving BC as √50 rather than converting to 5√2 makes the squaring step in Step 3 immediate. Simplifying surds is useful for presenting a final length, but not when the value is about to be squared.\n\nA CROSS-CHECK: For a right-angled isosceles triangle, the hypotenuse should equal side × √2. Here 5√2 = √50 ✓, which confirms both properties simultaneously.",
  },
  {
    id: 5004, ch: 12, subj: "maths", marks: 5,
    q: "The following table gives the daily income of 50 workers of a factory. Find the mean, median and mode of the distribution, and verify the empirical relationship between them.\nDaily income (₹): 100–120, 120–140, 140–160, 160–180, 180–200\nNumber of workers: 12, 14, 8, 6, 10",
    a: "PART 1 — THE MEAN (direct method)\n\nClass      | fᵢ | xᵢ  | fᵢxᵢ\n100–120    | 12 | 110 | 1320\n120–140    | 14 | 130 | 1820\n140–160    |  8 | 150 | 1200\n160–180    |  6 | 170 | 1020\n180–200    | 10 | 190 | 1900\n\nΣfᵢ = 12 + 14 + 8 + 6 + 10 = 50\nΣfᵢxᵢ = 1320 + 1820 + 1200 + 1020 + 1900 = 7260\n\nMean = Σfᵢxᵢ / Σfᵢ = 7260/50 = 145.2\n\nMEAN = ₹145.20\n\nPART 2 — THE MEDIAN\n\nBuild the cumulative frequency column:\n\nClass      | f  | cf\n100–120    | 12 | 12\n120–140    | 14 | 26\n140–160    |  8 | 34\n160–180    |  6 | 40\n180–200    | 10 | 50\n\nn = 50, so n/2 = 25.\n\nThe first cumulative frequency to reach or exceed 25 is 26, belonging to the class 120–140.\n\nMEDIAN CLASS = 120–140\n\nValues:\nl = 120\nn/2 = 25\ncf = 12   (cumulative frequency of the class BEFORE the median class)\nf = 14    (frequency of the median class)\nh = 20\n\nMedian = l + [(n/2 − cf)/f] × h\n= 120 + [(25 − 12)/14] × 20\n= 120 + (13/14) × 20\n= 120 + 260/14\n= 120 + 18.571\n= 138.571\n\nMEDIAN ≈ ₹138.57\n\nPART 3 — THE MODE\n\nThe highest frequency is 14, belonging to the class 120–140.\n\nMODAL CLASS = 120–140\n\nValues:\nl = 120\nf₁ = 14   (modal class)\nf₀ = 12   (class before: 100–120)\nf₂ = 8    (class after: 140–160)\nh = 20\n\nMode = l + [(f₁ − f₀)/(2f₁ − f₀ − f₂)] × h\n= 120 + [(14 − 12)/(28 − 12 − 8)] × 20\n= 120 + [2/8] × 20\n= 120 + 5\n= 125\n\nMODE = ₹125\n\nPART 4 — VERIFYING THE EMPIRICAL RELATIONSHIP\n\nThe empirical relationship states:\n3 Median = Mode + 2 Mean\n\nLEFT-HAND SIDE:\n3 × 138.571 = 415.71\n\nRIGHT-HAND SIDE:\nMode + 2 Mean = 125 + 2(145.2) = 125 + 290.4 = 415.4\n\nCOMPARISON:\nLHS = 415.71\nRHS = 415.40\n\nThe two sides agree to within about 0.3, which is well inside the tolerance expected of this relation.\n\nTHE RELATIONSHIP IS VERIFIED. ✓\n\nWHY THE AGREEMENT IS NOT EXACT:\n\nThe relation 3 Median = Mode + 2 Mean is EMPIRICAL, not algebraic. It was derived from observation of many moderately skewed distributions, not proved from first principles.\n\nIt holds exactly only for a perfectly symmetric distribution, where mean, median and mode coincide. For real data with some skew, it gives a close approximation rather than an identity — so a small discrepancy is expected and is not an arithmetic error.\n\nWHAT THE THREE MEASURES TELL US TOGETHER:\n\nMode (₹125) < Median (₹138.57) < Mean (₹145.20)\n\nThis ordering indicates a POSITIVELY SKEWED distribution — most workers earn toward the lower end, but a group of higher earners (the 10 workers in the 180–200 class) pulls the mean upward.\n\nThis is why the mean alone can mislead when reporting income. The median, at ₹138.57, is a better description of what a typical worker in this factory actually earns, because it is not dragged upward by the high-earning tail. The same reasoning is why economists generally report median rather than mean household income.",
  },
  {
    id: 5005, ch: 13, subj: "maths", marks: 5,
    q: "A bag contains 5 red balls, 8 white balls and 7 black balls. One ball is drawn at random. Find the probability that it is (i) red, (ii) not black, (iii) either red or white, (iv) neither red nor white. (v) If 5 more black balls are added, by how much does the probability of drawing a black ball increase?",
    a: "SETTING UP:\n\nRed balls = 5\nWhite balls = 8\nBlack balls = 7\nTOTAL = 5 + 8 + 7 = 20\n\n(i) PROBABILITY OF DRAWING A RED BALL\n\nFavourable outcomes = 5\nP(red) = 5/20 = 1/4 = 0.25\n\n(ii) PROBABILITY OF NOT BLACK\n\nMETHOD 1 — using the complement:\nP(black) = 7/20\nP(not black) = 1 − 7/20 = 13/20\n\nMETHOD 2 — counting directly:\nNot black means red or white = 5 + 8 = 13\nP(not black) = 13/20\n\nBoth methods agree. P(not black) = 13/20 = 0.65\n\n(iii) PROBABILITY OF EITHER RED OR WHITE\n\nFavourable = 5 + 8 = 13\nP(red or white) = 13/20\n\nNote this is the same as part (ii), and necessarily so — since there are only three colours, 'not black' and 'red or white' describe exactly the same set of outcomes. Recognising this saves recalculating.\n\n(iv) PROBABILITY OF NEITHER RED NOR WHITE\n\n'Neither red nor white' leaves only the black balls.\nFavourable = 7\nP(neither red nor white) = 7/20 = 0.35\n\nCHECK: Parts (iii) and (iv) describe complementary events, so their probabilities must sum to 1.\n13/20 + 7/20 = 20/20 = 1 ✓\n\n(v) ADDING 5 MORE BLACK BALLS\n\nBEFORE:\nBlack = 7, Total = 20\nP(black) = 7/20 = 0.35\n\nAFTER adding 5 black balls:\nBlack = 7 + 5 = 12\nTotal = 20 + 5 = 25\n(Note that the TOTAL increases too — this is the step most often missed.)\nP(black) = 12/25 = 0.48\n\nINCREASE:\n= 12/25 − 7/20\n\nTaking the LCM of 25 and 20, which is 100:\n= 48/100 − 35/100\n= 13/100\n= 0.13\n\nANSWER TO (v): The probability of drawing a black ball increases by 13/100, that is by 0.13.\n\nSUMMARY OF ANSWERS:\n(i) 1/4\n(ii) 13/20\n(iii) 13/20\n(iv) 7/20\n(v) increases by 13/100\n\nTHREE POINTS OF METHOD:\n\n1. THE TOTAL CHANGES TOO. In part (v), adding 5 black balls changes both the numerator AND the denominator. Computing 12/20 instead of 12/25 is the single most common error in this style of question.\n\n2. NEGATIVE WORDING. Phrases like 'not black' and 'neither red nor white' are easier to handle by first identifying which balls actually qualify, rather than by manipulating the wording. In a three-colour problem, every such phrase reduces to one or two colours.\n\n3. USE COMPLEMENTS AS A CHECK. Whenever two events between them cover every possibility, their probabilities must sum to exactly 1. This gives a free check on the arithmetic, as in the verification after part (iv).\n\nA CLOSING OBSERVATION: Adding 5 black balls raised P(black) from 0.35 to 0.48 — a substantial jump, but less than the 7/20 → 12/20 = 0.60 one might expect from looking only at the black balls. The reason is that the extra balls enlarge the pool everyone is drawn from, which dilutes the effect. This is the same reason why adding a few members to a small group changes its composition more than adding the same number to a large one.",
  },
];
