import { lesson, idea, analogy, formula, example, trap, check, type ConceptLesson } from "@/lib/concepts-core";

// Class 10 CBSE Maths — concept lessons. Chapter ids follow MATHS_CHAPTERS.
export const MATHS_CONCEPTS: ConceptLesson[] = [
  lesson("maths", 1, 7, "Two tools run this chapter: a division rule that finds HCFs, and the fact that every number has exactly one prime fingerprint.", [
    idea("Euclid's division lemma", "For positive integers a and b there are unique q and r with a = bq + r and 0 ≤ r < b. It is just long division written as an equation: 17 = 5 × 3 + 2. Repeat it on (divisor, remainder) until the remainder is 0 — the last divisor is the HCF."),
    example("HCF of 135 and 225 by Euclid's algorithm", "Divide the bigger number by the smaller, then keep going with the remainders.", ["225 = 135 × 1 + 90", "135 = 90 × 1 + 45", "90 = 45 × 2 + 0 — the remainder is 0, so stop", "HCF(135, 225) = 45"]),
    idea("The Fundamental Theorem of Arithmetic", "Every composite number is a product of primes, and that product is unique apart from order. Primes are the 'atoms' of numbers. Use them to read off HCF (smallest power of each common prime) and LCM (greatest power of every prime that appears)."),
    example("HCF and LCM of 12 and 18", "Write both as prime products first.", ["12 = 2² × 3 and 18 = 2 × 3²", "HCF = 2¹ × 3¹ = 6 (smallest powers of the common primes)", "LCM = 2² × 3² = 36 (greatest powers of all primes)", "Check: 6 × 36 = 216 = 12 × 18 ✓"]),
    idea("Irrational numbers", "An irrational number cannot be written as p/q with q ≠ 0 (√2, √3, π). To prove √2 is irrational, assume √2 = p/q in lowest terms. Then p² = 2q², so p is even, p = 2k, which makes q even too — both even contradicts 'lowest terms'. Also: a non-zero rational plus or times an irrational is irrational."),
    trap("HCF × LCM = product — but only for two numbers", "The identity HCF × LCM = a × b holds for two numbers only. For three numbers it fails, so don't use it there. And a terminating decimal is always rational."),
    check("What is the HCF of 96 and 404?", ["2", "4", "8", "12"], 1, "96 = 2⁵ × 3 and 404 = 2² × 101. The common prime is 2, smallest power 2², so HCF = 4."),
  ], ["a = bq + r with 0 ≤ r < b; Euclid's algorithm ends when the remainder is 0.", "HCF takes smallest prime powers, LCM greatest; HCF × LCM = a × b for two numbers.", "To prove irrationality, assume p/q in lowest terms and reach a contradiction."]),

  lesson("maths", 2, 6, "A polynomial's zeros and its coefficients are linked — you can build a polynomial from its zeros without solving anything.", [
    idea("Zeros of a polynomial", "A zero of p(x) is a value k with p(k) = 0 — geometrically, where the graph meets the x-axis. A polynomial of degree n has at most n zeros: a line has 1, a parabola up to 2, a cubic up to 3."),
    formula("Zeros ↔ coefficients", ["Quadratic ax² + bx + c with zeros α, β:  α + β = −b/a  and  αβ = c/a", "So the polynomial is k[x² − (α+β)x + αβ]", "Cubic ax³ + bx² + cx + d:  Σα = −b/a,  Σαβ = c/a,  αβγ = −d/a"]),
    example("Build a quadratic with zeros 3 and −2", "You only need the sum and the product of the zeros.", ["Sum = 3 + (−2) = 1", "Product = 3 × (−2) = −6", "Polynomial: x² − (1)x + (−6) = x² − x − 6"]),
    analogy("Reading the parabola", "If a > 0 the parabola opens upward, if a < 0 downward. The number of times it crosses the x-axis (0, 1 or 2) is the number of real zeros — a quick sanity check on any answer."),
    trap("The sign of the sum", "Sum of zeros is −b/a — with a minus sign. For x² + 7x + 10 the sum is −7, not 7. The product c/a keeps its sign."),
    check("If α and β are the zeros of x² + 7x + 10, what is α + β?", ["7", "−7", "10", "−10"], 1, "α + β = −b/a = −7/1 = −7. (The zeros are −2 and −5, which indeed add to −7.)"),
  ], ["Zeros are where p(x) = 0 — the x-intercepts of the graph.", "Sum = −b/a, product = c/a for a quadratic.", "Degree n means at most n zeros."]),

  lesson("maths", 3, 8, "Two lines either meet once, never, or are the same line — and you can tell which before solving anything.", [
    idea("Each equation is a line", "a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0 are two straight lines. A solution is a point on both lines — where they cross."),
    formula("Decide the case from the ratios", ["a₁/a₂ ≠ b₁/b₂  →  lines intersect: exactly one solution (consistent)", "a₁/a₂ = b₁/b₂ = c₁/c₂  →  coincident lines: infinitely many solutions (consistent)", "a₁/a₂ = b₁/b₂ ≠ c₁/c₂  →  parallel lines: no solution (inconsistent)"]),
    example("Solve x + y = 14 and x − y = 4 (elimination)", "Add the equations so y cancels.", ["Add: (x + y) + (x − y) = 14 + 4, so 2x = 18 and x = 9", "Substitute in x + y = 14: y = 14 − 9 = 5", "Check in the second: 9 − 5 = 4 ✓"]),
    example("A word problem: two numbers sum to 40 and differ by 12", "Translate to equations before doing anything else.", ["Let the numbers be x and y: x + y = 40 and x − y = 12", "Adding: 2x = 52, so x = 26", "Then y = 40 − 26 = 14. The numbers are 26 and 14."]),
    trap("Compare ratios first, and get the form right", "Bring every equation to the form ax + by + c = 0 before comparing ratios — a misplaced constant flips your conclusion. Checking consistency first saves you from 'solving' a pair that has no solution."),
    check("2x + 3y = 5 and 4x + 6y = 10 represent lines that are…", ["intersecting at one point", "parallel", "coincident", "perpendicular"], 2, "2/4 = 3/6 = 5/10 = 1/2. All three ratios are equal, so the lines coincide and there are infinitely many solutions."),
  ], ["Solutions are intersection points of the two lines.", "Ratios of coefficients tell you: one, none, or infinitely many solutions.", "Substitution and elimination both work; check by plugging back."]),

  lesson("maths", 4, 8, "One expression — the discriminant — tells you how many real roots a quadratic has before you solve it.", [
    idea("What a quadratic equation is", "ax² + bx + c = 0 with a ≠ 0. Its roots are the values of x that satisfy it — at most two real ones. Three ways to find them: factorising, completing the square, or the formula."),
    formula("Formula and discriminant", ["x = [−b ± √(b² − 4ac)] / 2a", "Discriminant D = b² − 4ac", "D > 0: two distinct real roots   D = 0: two equal real roots   D < 0: no real roots"]),
    example("Solve 2x² − 7x + 3 = 0 by splitting the middle term", "Find two numbers that multiply to 2 × 3 = 6 and add to −7.", ["Those numbers are −6 and −1: 2x² − 6x − x + 3 = 0", "Factor by grouping: 2x(x − 3) − 1(x − 3) = 0", "(2x − 1)(x − 3) = 0, so x = 1/2 or x = 3"]),
    example("Solve x² + 4x + 1 = 0 with the formula", "It doesn't factorise, so use D.", ["a = 1, b = 4, c = 1: D = 16 − 4 = 12", "x = (−4 ± √12) / 2 = (−4 ± 2√3) / 2", "x = −2 + √3 or x = −2 − √3"]),
    trap("Standard form and the ± sign", "Move everything to one side so the equation equals 0 before reading a, b, c. And never drop the ± — it gives two roots, not one."),
    check("The nature of the roots of 3x² − 4√3x + 4 = 0 is…", ["two distinct real roots", "two equal real roots", "no real roots", "cannot be determined"], 1, "D = (−4√3)² − 4(3)(4) = 48 − 48 = 0, so the roots are real and equal."),
  ], ["Roots come from factorising or x = [−b ± √D]/2a.", "D = b² − 4ac decides: two, one repeated, or no real roots.", "Always write the equation in standard form first."]),

  lesson("maths", 5, 7, "An AP adds the same amount every step — which means any term, and any sum, is one formula away.", [
    idea("What makes a sequence an AP", "Each term is the previous plus a fixed common difference d: a, a + d, a + 2d, … Find d by subtracting consecutive terms (a₂ − a₁). d can be negative (a decreasing AP) or zero."),
    formula("The two formulas", ["nth term:  aₙ = a + (n − 1)d", "Sum of n terms:  Sₙ = n/2 [2a + (n − 1)d]", "If you know the last term l:  Sₙ = n/2 (a + l)"]),
    example("Which term of 3, 8, 13, … is 78?", "Identify a and d, then solve aₙ = 78.", ["a = 3, d = 8 − 3 = 5", "3 + (n − 1)5 = 78, so (n − 1)5 = 75", "n − 1 = 15, so n = 16 — the 16th term"]),
    example("Sum of the first 20 terms of 1, 4, 7, …", "Use the sum formula with n = 20.", ["a = 1, d = 3, n = 20", "S₂₀ = 20/2 [2(1) + 19 × 3] = 10 × 59", "S₂₀ = 590"]),
    trap("n counts terms, not the gap", "n is how many terms you are using; d is the step between them. Confusing 'term number' with 'value' is the most common slip."),
    check("What is the 10th term of the AP 2, 7, 12, …?", ["42", "47", "52", "57"], 1, "a = 2, d = 5: a₁₀ = 2 + 9 × 5 = 47."),
  ], ["Common difference d = aₙ₊₁ − aₙ.", "aₙ = a + (n − 1)d.", "Sₙ = n/2 [2a + (n − 1)d] or n/2 (a + l)."]),

  lesson("maths", 6, 9, "Similar triangles share a shape, so their sides scale together — that single idea solves most of this chapter.", [
    idea("Similarity", "Two triangles are similar if corresponding angles are equal and corresponding sides are in the same ratio. You rarely need all of it — AA (two equal angles), SSS (sides proportional) or SAS (one equal angle between proportional sides) is enough."),
    idea("Basic Proportionality (Thales) Theorem", "A line drawn parallel to one side of a triangle divides the other two sides in the same ratio: if DE ∥ BC then AD/DB = AE/EC. The converse is also true, and it is how you prove lines are parallel."),
    formula("Results to know", ["Area of similar triangles: the ratio of areas = (ratio of corresponding sides)²", "Pythagoras: in a right triangle, hypotenuse² = sum of the squares of the other two sides", "Converse: if c² = a² + b², the triangle is right-angled"]),
    example("Using BPT", "In △ABC, DE ∥ BC with AD = 3, DB = 6, AE = 2. Find EC.", ["By BPT: AD/DB = AE/EC", "3/6 = 2/EC", "EC = 2 × 6 / 3 = 4"]),
    example("Using the area theorem", "Two similar triangles have corresponding sides in the ratio 2 : 3. Compare their areas.", ["Area ratio = (2/3)²", "= 4/9", "So the areas are in the ratio 4 : 9"]),
    trap("Squares and correspondence", "Area ratio uses the SQUARE of the side ratio — not the ratio itself. And write similarity in matching order: △ABC ~ △PQR means A ↔ P, B ↔ Q, C ↔ R."),
    check("The sides of two similar triangles are in the ratio 4 : 9. The ratio of their areas is…", ["4 : 9", "2 : 3", "16 : 81", "8 : 18"], 2, "Areas are in the ratio of the squares of the corresponding sides: 4² : 9² = 16 : 81."),
  ], ["AA, SSS or SAS proves similarity.", "Line parallel to a side ⇒ the other two sides are divided proportionally (BPT).", "Area ratio = (side ratio)²."]),

  lesson("maths", 7, 7, "Coordinates turn geometry into arithmetic: distances, midpoints and areas all come from a few formulas.", [
    formula("The four formulas", ["Distance: d = √[(x₂ − x₁)² + (y₂ − y₁)²]", "Midpoint: ((x₁ + x₂)/2, (y₁ + y₂)/2)", "Section formula (divides in m : n internally): ((m x₂ + n x₁)/(m + n), (m y₂ + n y₁)/(m + n))", "Area of triangle: ½ |x₁(y₂ − y₃) + x₂(y₃ − y₁) + x₃(y₁ − y₂)|"]),
    example("Distance between (2, 3) and (6, 6)", "Subtract coordinates, square, add, root.", ["Δx = 4, Δy = 3", "d = √(16 + 9) = √25", "d = 5"]),
    example("Divide the line joining (1, 2) and (7, 8) in the ratio 2 : 1", "Use the section formula with m = 2, n = 1.", ["x = (2 × 7 + 1 × 1)/3 = 15/3 = 5", "y = (2 × 8 + 1 × 2)/3 = 18/3 = 6", "The point is (5, 6)"]),
    idea("Collinear points", "Three points are collinear (lie on one line) exactly when the area of the triangle they form is zero — or when two of the distances add up to the third."),
    trap("Which coordinate gets m?", "In m : n, the ratio multiplies the OTHER end's coordinates: m goes with (x₂, y₂) and n with (x₁, y₁). Mixing these up gives the mirror-image point."),
    check("The midpoint of the segment joining (−2, 4) and (6, −2) is…", ["(2, 1)", "(4, 2)", "(2, 3)", "(−4, 1)"], 0, "Midpoint = ((−2 + 6)/2, (4 + (−2))/2) = (2, 1)."),
  ], ["Distance formula comes from Pythagoras.", "Section formula: m pairs with the far end's coordinates.", "Area = 0 ⇒ the three points are collinear."]),
];

MATHS_CONCEPTS.push(
  lesson("maths", 14, 8, "Trigonometry is just ratios of sides in a right triangle — learn the three, then the standard values and one identity.", [
    idea("The three ratios", "For an acute angle θ in a right triangle: sin θ = opposite/hypotenuse, cos θ = adjacent/hypotenuse, tan θ = opposite/adjacent. Their reciprocals are cosec, sec and cot. 'SOH-CAH-TOA' is the memory trick. The ratios depend only on the angle, not on how big the triangle is."),
    formula("Standard angles", ["sin: 0°, 30°, 45°, 60°, 90° → 0, 1/2, 1/√2, √3/2, 1", "cos: the same list in reverse → 1, √3/2, 1/√2, 1/2, 0", "tan: 0, 1/√3, 1, √3, not defined (at 90°)"]),
    formula("Identities", ["sin²θ + cos²θ = 1", "1 + tan²θ = sec²θ    and    1 + cot²θ = cosec²θ", "Complementary angles: sin(90° − θ) = cos θ,  tan(90° − θ) = cot θ"]),
    example("If sin A = 3/5, find cos A and tan A", "Draw the triangle: opposite 3, hypotenuse 5.", ["Adjacent = √(5² − 3²) = √16 = 4", "cos A = 4/5", "tan A = 3/4"]),
    example("Evaluate sin 30° cos 60° + sin 60° cos 30°", "Substitute the standard values.", ["= (1/2)(1/2) + (√3/2)(√3/2)", "= 1/4 + 3/4", "= 1"]),
    trap("Undefined and scale", "tan 90° is not defined, and sin or cos can never exceed 1. Remember the ratios are about the angle — doubling the triangle changes nothing."),
    check("sin² 60° + cos² 60° equals…", ["0", "1/2", "1", "√3"], 2, "For any angle sin²θ + cos²θ = 1. (Check: 3/4 + 1/4 = 1.)"),
  ], ["sin = O/H, cos = A/H, tan = O/A.", "Learn the table for 0°, 30°, 45°, 60°, 90°.", "sin²θ + cos²θ = 1 is the master identity."]),

  lesson("maths", 8, 7, "Height-and-distance problems are one right triangle in disguise — draw it, pick the ratio, solve.", [
    idea("Angles of elevation and depression", "Angle of elevation: how far you tilt your eyes UP from the horizontal to see something. Angle of depression: how far you look DOWN from the horizontal. The depression angle from a tower top equals the elevation angle from the ground point (alternate angles)."),
    idea("A method that always works", "1) Draw the figure and mark the right angle. 2) Label the known angle and side, and the unknown. 3) Choose the ratio linking them — tan joins height and horizontal distance, sin/cos involve the slanted line. 4) Solve."),
    example("Height of a tower", "From a point 30 m from the foot of a tower, the angle of elevation of its top is 60°.", ["tan 60° = height / 30", "height = 30 × √3 = 30√3 m", "≈ 51.96 m"]),
    example("Distance from a building", "The angle of elevation of the top of a 20 m building from a point on the ground is 45°.", ["tan 45° = 20 / distance", "1 = 20 / distance", "distance = 20 m"]),
    trap("Measure from the horizontal", "Both angles are measured from the HORIZONTAL line, never from the vertical. Sketch before you calculate."),
    check("A 10 m ladder makes 60° with the ground. How high up the wall does it reach?", ["5 m", "5√3 m", "10√3 m", "10/√3 m"], 1, "The ladder is the hypotenuse and the height is opposite the 60° angle: height = 10 sin 60° = 10 × √3/2 = 5√3 m."),
  ], ["Elevation looks up, depression looks down — both from the horizontal.", "Draw the right triangle first.", "tan links height and horizontal distance."]),

  lesson("maths", 9, 6, "A tangent touches a circle at exactly one point — and that single fact gives you right angles and equal lengths.", [
    idea("Tangent facts", "A tangent meets the circle at exactly one point (the point of contact). The radius to that point is perpendicular to the tangent. From an external point you can draw exactly two tangents, and they are equal in length."),
    example("Length of a tangent", "P is 13 cm from the centre O of a circle of radius 5 cm. Find the tangent length PT.", ["OT ⟂ PT, so triangle OTP is right-angled at T", "PT² = OP² − OT² = 169 − 25 = 144", "PT = 12 cm"]),
    example("Angle between tangents", "Tangents PA and PB meet at P with ∠APB = 80°. Find ∠AOB.", ["∠OAP = ∠OBP = 90° (radius ⟂ tangent)", "Angles of quadrilateral OAPB add to 360°", "∠AOB = 360° − 90° − 90° − 80° = 100°"]),
    trap("Don't add the radius", "Tangent length comes from Pythagoras with the radius as one leg: PT = √(OP² − r²). It is never OP − r."),
    check("A point is 13 cm from the centre of a circle of radius 5 cm. The tangent length is…", ["8 cm", "12 cm", "13 cm", "18 cm"], 1, "PT = √(13² − 5²) = √144 = 12 cm."),
  ], ["Radius ⟂ tangent at the point of contact.", "Two tangents from one external point are equal.", "Tangent length = √(OP² − r²)."]),

  lesson("maths", 10, 6, "Arcs, sectors and segments are just 'a fraction of a circle' — the fraction is the angle over 360°.", [
    formula("The formulas", ["Circumference 2πr, area πr²", "Arc length = (θ/360°) × 2πr", "Area of sector = (θ/360°) × πr²", "Area of segment = area of sector − area of triangle", "Ring (annulus) area = π(R² − r²)"]),
    example("Area of a sector", "Radius 14 cm, angle 90° (use π = 22/7).", ["Fraction of the circle = 90/360 = 1/4", "Area = 1/4 × 22/7 × 14 × 14", "= 154 cm²"]),
    example("Length of an arc", "Radius 21 cm, angle 60°.", ["Fraction = 60/360 = 1/6", "Arc = 1/6 × 2 × 22/7 × 21", "= 22 cm"]),
    trap("Fraction first, units second", "Always form θ/360 first. Areas are in square units, lengths in plain units — don't mix them up."),
    check("Area of a sector of angle 60° in a circle of radius 6 cm (π = 22/7) is…", ["132/7 cm²", "66/7 cm²", "264/7 cm²", "22 cm²"], 0, "1/6 × 22/7 × 36 = 792/42 = 132/7 ≈ 18.86 cm²."),
  ], ["Sector and arc are the fraction θ/360 of the area and circumference.", "Segment = sector − triangle.", "Ring = π(R² − r²)."]),

  lesson("maths", 11, 7, "Every solid has an area formula and a volume formula — and when a solid is melted, its volume is conserved, not its surface.", [
    formula("Surface areas and volumes", ["Cuboid: TSA 2(lb + bh + hl), V = lbh   Cube: 6a², a³", "Cylinder: CSA 2πrh, TSA 2πr(r + h), V = πr²h", "Cone: CSA πrl, TSA πr(r + l), V = ⅓πr²h, with l² = r² + h²", "Sphere: 4πr², V = 4⁄3πr³   Hemisphere: CSA 2πr², TSA 3πr², V = 2⁄3πr³"]),
    idea("Combined solids and recasting", "For a toy made of a cone on a hemisphere, add the visible curved surfaces (not the joined faces). When a solid is melted and recast into others, the TOTAL VOLUME stays the same — set volume = volume and solve."),
    example("Melting a sphere into smaller spheres", "A solid sphere of radius 6 cm is melted into spheres of radius 2 cm. How many?", ["Volume of big sphere = 4/3 π × 6³", "Volume of each small sphere = 4/3 π × 2³", "Number = 6³ / 2³ = 216 / 8 = 27"]),
    trap("Slant height vs height", "In a cone, CSA uses the slant height l, volume uses the vertical height h — and l = √(r² + h²). Also: volume is conserved when melting, surface area is not."),
    check("A cone has base radius 3 cm and height 4 cm. Its slant height is…", ["3 cm", "4 cm", "5 cm", "7 cm"], 2, "l = √(r² + h²) = √(9 + 16) = 5 cm."),
  ], ["Learn the CSA, TSA and volume of each solid.", "Combined solids: add only the exposed surfaces.", "Recasting conserves volume."]),

  lesson("maths", 12, 7, "Mean, median and mode summarise a whole table of data in one number each — here is how to get them from grouped data.", [
    formula("Three averages for grouped data", ["Mean = Σfx / Σf  (x = class mark, the midpoint of each class)", "Median = l + [(n/2 − cf) / f] × h   (median class: first with cumulative frequency ≥ n/2)", "Mode = l + [(f₁ − f₀) / (2f₁ − f₀ − f₂)] × h   (modal class has the highest frequency)", "Empirical relation: Mode = 3 Median − 2 Mean"]),
    example("Mean of grouped data", "Classes 0–10, 10–20, 20–30 with frequencies 5, 8, 7.", ["Class marks x: 5, 15, 25", "Σfx = 5×5 + 8×15 + 7×25 = 25 + 120 + 175 = 320", "Σf = 20, so mean = 320 / 20 = 16"]),
    example("Mode of grouped data", "Modal class 20–30 with f₁ = 12, f₀ = 8, f₂ = 6.", ["l = 20, h = 10", "Mode = 20 + (12 − 8) / (24 − 8 − 6) × 10", "= 20 + 4/10 × 10 = 24"]),
    trap("Continuous classes", "The formulas need continuous classes (no gaps). Find the median class from CUMULATIVE frequency, not the biggest frequency."),
    check("If median = 20 and mean = 22, the mode by the empirical relation is…", ["14", "16", "18", "24"], 1, "Mode = 3(20) − 2(22) = 60 − 44 = 16."),
  ], ["Mean uses class marks; median uses cumulative frequency; mode uses the modal class.", "Mode = 3 Median − 2 Mean.", "Make classes continuous first."]),

  lesson("maths", 13, 6, "Probability measures how likely something is, on a scale from impossible (0) to certain (1).", [
    idea("The definition", "P(E) = (number of favourable outcomes) / (total number of equally likely outcomes). So 0 ≤ P(E) ≤ 1, a sure event has probability 1, an impossible event 0, and P(E) + P(not E) = 1."),
    example("A die and a deck", "Find P(prime on a die) and P(king from a deck).", ["Primes on a die: 2, 3, 5 — 3 outcomes out of 6, so P = 1/2", "A deck has 4 kings among 52 cards, so P(king) = 4/52 = 1/13", "Two coins: P(at least one head) = 3/4, since only TT fails"]),
    trap("Equally likely and counting", "Only count outcomes that are equally likely, and list the sample space systematically. A probability can never be negative or greater than 1."),
    check("A bag has 3 red and 5 blue balls. The probability of drawing a red ball is…", ["3/5", "5/8", "3/8", "1/8"], 2, "Favourable = 3, total = 3 + 5 = 8, so P = 3/8."),
  ], ["P(E) = favourable / total.", "0 ≤ P ≤ 1 and P(E) + P(not E) = 1.", "List the sample space carefully."]),
);
