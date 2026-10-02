// ===== Science question-bank expansion =====
//
// Additional MCQs, short answers, and long answers merged into the main
// MCQS / SHORT_QA / LONG_QA exports in study-data.ts.
//
// Why this file exists rather than appending to study-data.ts directly:
// that file is ~440KB and a single malformed edit inside a 4000-line array
// literal is very hard to recover from. Keeping additions in their own
// file means the base bank is never touched, and the merge point is one
// readable line at the bottom of study-data.ts.
//
// ID SCHEME: everything here uses ids from 5000 upward. The base bank's
// highest id is 4012 (MCQS), so 5000+ can never collide, and any id >= 5000
// is immediately recognisable as expansion content.
//
// DIFFICULTY BIAS: the base bank was 41% easy / 52% medium / 7% hard, which
// starved the adaptive engine — `pickAdaptiveQuestion` would ask for "hard",
// find nothing, and silently fall back to medium while still showing the
// student a "Hard" badge. This pack is deliberately weighted toward hard so
// the top tier is actually reachable in every chapter.

import type { MCQ, QA } from "./study-data";

export const EXTRA_MCQS: MCQ[] = [
  // ---------------------------------------------------------------------
  // Ch 1 — Chemical Reactions & Equations
  // ---------------------------------------------------------------------
  {
    id: 5001, ch: 1, subj: "chem", diff: "easy",
    q: "Which observation would NOT by itself confirm that a chemical reaction has taken place?",
    opts: ["A precipitate forms", "A gas is evolved", "The mixture becomes warmer", "The liquid is stirred and becomes cloudy only while stirring"],
    ans: 3,
    exp: "Cloudiness that appears only while stirring and settles again afterwards is a physical dispersion, not a new substance forming. Precipitates, gas evolution, and temperature change all signal that bonds have been broken and remade.",
  },
  {
    id: 5002, ch: 1, subj: "chem", diff: "medium",
    q: "In the equation 3Fe + 4H₂O → Fe₃O₄ + 4H₂, which statement is correct?",
    opts: ["Iron is reduced and water is oxidised", "Iron is oxidised and water is reduced", "Only oxidation occurs", "Neither oxidation nor reduction occurs"],
    ans: 1,
    exp: "Iron gains oxygen to form Fe₃O₄ — that is oxidation. Water loses oxygen and releases H₂ — that is reduction. Both happen at once, which is what makes this a redox reaction. Note steam is required; iron does not react with cold water.",
  },
  {
    id: 5003, ch: 1, subj: "chem", diff: "hard",
    q: "A student writes: Fe + H₂SO₄ → FeSO₄ + H₂. On balancing by mass, the equation is already balanced. Yet the teacher marks it incomplete. The most likely reason is:",
    opts: ["The equation is chemically wrong", "Physical states of reactants and products have not been indicated", "Iron cannot displace hydrogen", "FeSO₄ does not exist"],
    ans: 1,
    exp: "The equation is both chemically correct and balanced. What is missing is the state symbols — Fe(s) + H₂SO₄(aq) → FeSO₄(aq) + H₂(g). CBSE marking schemes routinely deduct for omitted states and for missing the upward arrow on evolved gases.",
  },
  {
    id: 5004, ch: 1, subj: "chem", diff: "hard",
    q: "Silver chloride is stored in dark-coloured bottles, while silver nitrate is stored in ordinary bottles but away from sunlight. The best explanation for treating them differently is:",
    opts: ["AgCl is more expensive than AgNO₃", "AgCl undergoes photolytic decomposition much more readily, so it needs stronger light exclusion", "AgNO₃ is not affected by light at all", "AgCl reacts with glass"],
    ans: 1,
    exp: "Both decompose in light, but AgCl does so rapidly and visibly (turning grey as silver metal forms), which is why it needs an amber bottle rather than just a dark shelf. This graded response to the same hazard is what the question is testing — not a simple 'light is bad' rule.",
  },
  {
    id: 5005, ch: 1, subj: "chem", diff: "medium",
    q: "Chips packets are flushed with nitrogen rather than simply sealed tightly. The reason nitrogen is chosen specifically is that it:",
    opts: ["Is heavier than oxygen and settles at the bottom", "Is chemically unreactive and displaces the oxygen that causes rancidity", "Reacts with the fat to preserve it", "Absorbs moisture from the packet"],
    ans: 1,
    exp: "Sealing alone traps oxygen inside with the food. Nitrogen is used because it is inert — it pushes the oxygen out without itself reacting with the fats. Removing oxygen removes the reactant that drives oxidative rancidity.",
  },
  {
    id: 5006, ch: 1, subj: "chem", diff: "hard",
    q: "When copper powder is heated strongly in air, a black substance forms. On passing hydrogen gas over this hot black substance, the original reddish-brown colour returns. The black substance and the second reaction are:",
    opts: ["CuO; reduction of CuO by H₂", "Cu₂S; oxidation of Cu₂S", "CuCO₃; thermal decomposition", "Cu(OH)₂; neutralisation"],
    ans: 0,
    exp: "2Cu + O₂ → 2CuO (black). Then CuO + H₂ → Cu + H₂O, where CuO loses oxygen (reduced) and H₂ gains it (oxidised). This paired experiment is a board favourite because it demonstrates oxidation and reduction as reverse processes on the same substance.",
  },
  {
    id: 5007, ch: 1, subj: "chem", diff: "medium", pyq: true,
    q: "Assertion (A): The white silver chloride turns grey in sunlight. Reason (R): Silver chloride decomposes into silver and chlorine in the presence of sunlight.",
    opts: ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is NOT the correct explanation of A", "A is true, R is false", "A is false, R is true"],
    ans: 0,
    exp: "2AgCl →(sunlight) 2Ag + Cl₂. The grey colour is finely divided silver metal deposited as the compound breaks apart, so R is exactly why A happens. This photolytic decomposition is the basis of traditional black-and-white photography.",
  },
  {
    id: 5008, ch: 1, subj: "chem", diff: "hard",
    q: "Which of these reactions is a decomposition reaction that is also exothermic?",
    opts: ["CaCO₃ →(heat) CaO + CO₂", "2H₂O →(electricity) 2H₂ + O₂", "Decomposition of hydrogen peroxide into water and oxygen", "2AgBr →(light) 2Ag + Br₂"],
    ans: 2,
    exp: "Most decompositions absorb energy, which is why students over-generalise that all of them are endothermic. Hydrogen peroxide decomposing (2H₂O₂ → 2H₂O + O₂) actually releases heat — the container warms noticeably. The other three all require continuous heat, electricity, or light input.",
  },

  // ---------------------------------------------------------------------
  // Ch 2 — Acids, Bases & Salts
  // ---------------------------------------------------------------------
  {
    id: 5009, ch: 2, subj: "chem", diff: "easy",
    q: "Which of the following is an olfactory indicator?",
    opts: ["Litmus", "Onion", "Methyl orange", "Phenolphthalein"],
    ans: 1,
    exp: "Olfactory indicators change smell rather than colour. Onion loses its characteristic smell in a base but retains it in an acid. Vanilla essence and clove oil behave similarly, and they are used specifically so visually impaired students can perform acid-base tests.",
  },
  {
    id: 5010, ch: 2, subj: "chem", diff: "medium",
    q: "Dry HCl gas does not turn dry blue litmus paper red, but adding a drop of water makes it turn red immediately. This shows that:",
    opts: ["Litmus paper only works when wet", "Acids show acidic behaviour only when they ionise in water to give H⁺ ions", "HCl gas is not an acid", "Water is itself an acid"],
    ans: 1,
    exp: "Acidity is caused by H⁺ (strictly H₃O⁺) ions, and HCl can only release them once water is present to ionise it. Without water there are no free H⁺ ions, so no acidic behaviour is shown. This single experiment is why the definition of an acid specifies 'in aqueous solution'.",
  },
  {
    id: 5011, ch: 2, subj: "chem", diff: "hard",
    q: "Equal volumes of pH 3 and pH 5 solutions of the same acid are compared. The pH 3 solution has a hydrogen ion concentration that is:",
    opts: ["2 times greater", "20 times greater", "100 times greater", "1000 times greater"],
    ans: 2,
    exp: "The pH scale is logarithmic — each whole unit is a factor of 10. A difference of 2 pH units means 10² = 100 times the H⁺ concentration. Students who answer '2 times' have missed that the scale is not linear, which is the exact misconception this question targets.",
  },
  {
    id: 5012, ch: 2, subj: "chem", diff: "hard",
    q: "Concentrated sulphuric acid must always be added slowly to water, never water to acid. The reason is that:",
    opts: ["Water is denser than acid", "The dilution is highly exothermic, and adding water to acid can make it splash and boil violently", "Acid reacts with water to make a gas", "The reaction is endothermic and freezes the container"],
    ans: 1,
    exp: "Diluting concentrated H₂SO₄ releases a large amount of heat. Adding acid to a large volume of water lets that heat disperse through the water. Adding a little water to a large volume of acid concentrates the heat at the surface, which can boil the water instantly and spray concentrated acid out of the container.",
  },
  {
    id: 5013, ch: 2, subj: "chem", diff: "medium",
    q: "Bleaching powder is prepared by the action of chlorine on:",
    opts: ["Dry slaked lime, Ca(OH)₂", "Quicklime, CaO", "Limestone, CaCO₃", "Gypsum, CaSO₄·2H₂O"],
    ans: 0,
    exp: "Ca(OH)₂ + Cl₂ → CaOCl₂ + H₂O. The lime must be dry slaked lime, not quicklime or limestone. Bleaching powder is used for disinfecting drinking water, bleaching cotton and paper, and as an oxidising agent in industry.",
  },
  {
    id: 5014, ch: 2, subj: "chem", diff: "hard", pyq: true,
    q: "A farmer finds that the crop yield in a particular field is falling. Testing shows the soil pH is 4.5. Which treatment is most appropriate, and why?",
    opts: ["Add ammonium sulphate, because it is a fertiliser", "Add quicklime or slaked lime, because the soil is acidic and needs a base to raise pH toward neutral", "Add dilute hydrochloric acid to balance it", "Add more water to dilute the acidity permanently"],
    ans: 1,
    exp: "pH 4.5 means the soil is distinctly acidic; most crops need pH near neutral. Basic compounds like quicklime (CaO), slaked lime (Ca(OH)₂) or chalk neutralise the excess acid. Adding water only dilutes temporarily, and ammonium sulphate would make the soil more acidic still.",
  },
  {
    id: 5015, ch: 2, subj: "chem", diff: "medium",
    q: "Washing soda is obtained from baking soda by:",
    opts: ["Dissolving it in water and evaporating", "Heating it to get sodium carbonate, then recrystallising with water", "Adding hydrochloric acid to it", "Passing chlorine gas through it"],
    ans: 1,
    exp: "2NaHCO₃ →(heat) Na₂CO₃ + H₂O + CO₂, then Na₂CO₃ + 10H₂O → Na₂CO₃·10H₂O. Note that washing soda contains 10 water molecules of crystallisation yet is a dry solid — a point that regularly confuses students.",
  },
  {
    id: 5016, ch: 2, subj: "chem", diff: "hard",
    q: "Plaster of Paris must be stored in a moisture-proof container. The chemistry behind this requirement is:",
    opts: ["It dissolves in water to form a solution", "It reacts with water to form gypsum and sets into a hard solid mass", "It evaporates when damp", "Moisture converts it into quicklime"],
    ans: 1,
    exp: "CaSO₄·½H₂O + 1½H₂O → CaSO₄·2H₂O. Even atmospheric moisture is enough to start this hydration, turning the powder into a useless hard lump inside the container. The same reaction is what makes it useful for plaster casts once you actually want it to set.",
  },

  // ---------------------------------------------------------------------
  // Ch 3 — Metals & Non-Metals
  // ---------------------------------------------------------------------
  {
    id: 5017, ch: 3, subj: "chem", diff: "easy",
    q: "Which non-metal is lustrous?",
    opts: ["Sulphur", "Iodine", "Phosphorus", "Carbon (as coal)"],
    ans: 1,
    exp: "Iodine is the standard exception to the rule that non-metals are dull — its crystals have a distinct metallic sheen. Graphite is the exception for conductivity, and diamond for hardness and melting point. Board questions often ask for these three exceptions together.",
  },
  {
    id: 5018, ch: 3, subj: "chem", diff: "medium",
    q: "Aluminium does not corrode as readily as iron despite being more reactive. This is because aluminium:",
    opts: ["Is less dense than iron", "Forms a thin, tough, adherent oxide layer that seals the metal underneath", "Does not react with oxygen at all", "Is always alloyed with gold"],
    ans: 1,
    exp: "Al₂O₃ forms instantly on the surface, is impermeable, and sticks firmly, so it protects the aluminium below. Rust (Fe₂O₃·xH₂O), by contrast, is flaky and porous — it falls away and exposes fresh iron, so corrosion keeps going. Anodising deliberately thickens aluminium's protective layer.",
  },
  {
    id: 5019, ch: 3, subj: "chem", diff: "hard",
    q: "Three metals X, Y, Z are tested. X displaces Y from its salt solution. Z displaces X from its salt solution. Y does not displace Z. The correct order of decreasing reactivity is:",
    opts: ["X > Y > Z", "Z > X > Y", "Y > X > Z", "Z > Y > X"],
    ans: 1,
    exp: "X displaces Y, so X > Y. Z displaces X, so Z > X. Combining: Z > X > Y, and this is consistent with Y failing to displace Z. Chaining displacement results into a single ordering is a standard reasoning task in board papers.",
  },
  {
    id: 5020, ch: 3, subj: "chem", diff: "hard",
    q: "During the electrolytic refining of copper, the impure copper is made the anode and pure copper the cathode. If the electrodes were accidentally swapped, the result would be:",
    opts: ["Purification would proceed faster", "Pure copper would dissolve and impurities would deposit on the impure block — the opposite of refining", "No current would flow at all", "The electrolyte would decompose into hydrogen and oxygen"],
    ans: 1,
    exp: "Oxidation (dissolving) always happens at the anode and reduction (deposition) at the cathode. Swapping them means the pure copper dissolves into solution while copper deposits onto the impure block, degrading rather than refining. This tests whether the student understands the electrode roles or has merely memorised the setup.",
  },
  {
    id: 5021, ch: 3, subj: "chem", diff: "medium",
    q: "Ionic compounds conduct electricity when molten or dissolved, but not in the solid state, because:",
    opts: ["Solids have no ions", "In the solid state ions are held rigidly in the lattice and cannot move freely", "Melting creates new electrons", "Solid ionic compounds are covalent"],
    ans: 1,
    exp: "Conduction requires mobile charge carriers. The ions exist in the solid too, but they are locked in fixed lattice positions. Melting or dissolving breaks the lattice apart so the ions can migrate toward the electrodes and carry current.",
  },
  {
    id: 5022, ch: 3, subj: "chem", diff: "hard",
    q: "Roasting and calcination are both used before reducing an ore to metal. The key difference is that:",
    opts: ["Roasting is used for carbonate ores and calcination for sulphide ores", "Roasting heats sulphide ores strongly in the presence of excess air; calcination heats carbonate ores in limited or no air", "Roasting uses electricity and calcination uses coke", "They are two names for the same process"],
    ans: 1,
    exp: "Roasting (sulphides, excess air): 2ZnS + 3O₂ → 2ZnO + 2SO₂. Calcination (carbonates, limited air): ZnCO₃ → ZnO + CO₂. Both convert the ore to the oxide, because oxides are what carbon and electrolysis can actually reduce. Students very often reverse which process goes with which ore type.",
  },
  {
    id: 5023, ch: 3, subj: "chem", diff: "medium", pyq: true,
    q: "An iron nail is dipped in copper sulphate solution and left for an hour. The expected observations are:",
    opts: ["The blue solution turns green and a reddish-brown layer coats the nail", "The blue solution becomes colourless and the nail dissolves completely", "No change occurs", "The solution turns yellow and a gas is evolved"],
    ans: 0,
    exp: "Fe + CuSO₄ → FeSO₄ + Cu. Iron is more reactive than copper, so it displaces it. Copper deposits on the nail as a reddish-brown coating, and the blue Cu²⁺ solution is replaced by pale green Fe²⁺ solution. This exact activity appears repeatedly in board practical-based questions.",
  },

  // ---------------------------------------------------------------------
  // Ch 4 — Carbon & Its Compounds
  // ---------------------------------------------------------------------
  {
    id: 5024, ch: 4, subj: "chem", diff: "easy",
    q: "The number of covalent bonds in a molecule of ethane (C₂H₆) is:",
    opts: ["6", "7", "8", "5"],
    ans: 1,
    exp: "Six C–H bonds plus one C–C bond gives 7 covalent bonds. Counting bonds in simple structures is a common one-mark question; drawing the structure first rather than guessing from the formula avoids the usual error of forgetting the C–C bond.",
  },
  {
    id: 5025, ch: 4, subj: "chem", diff: "medium",
    q: "Ethanol and ethanoic acid can be distinguished in the laboratory by adding:",
    opts: ["Water to both", "Sodium hydrogencarbonate — brisk effervescence occurs only with ethanoic acid", "Litmus solution, which turns red with both", "Bromine water, which decolourises with both"],
    ans: 1,
    exp: "NaHCO₃ reacts with the carboxylic acid group to release CO₂ with visible fizzing: CH₃COOH + NaHCO₃ → CH₃COONa + H₂O + CO₂. Ethanol, having only an –OH group, shows no reaction. This is the standard distinguishing test in CBSE practicals.",
  },
  {
    id: 5026, ch: 4, subj: "chem", diff: "hard",
    q: "A cooking gas burner produces a sooty yellow flame instead of a clean blue one. The most likely cause and remedy are:",
    opts: ["The gas is unsaturated; switch cylinders", "The air holes are blocked, causing incomplete combustion; clean the holes to restore the oxygen supply", "The gas pressure is too high; reduce it", "The burner is too cold; preheat it"],
    ans: 1,
    exp: "Saturated hydrocarbons in LPG burn blue when oxygen is plentiful. A yellow sooty flame means incomplete combustion from insufficient oxygen — almost always blocked air holes. The soot is unburnt carbon, which also wastes fuel and blackens vessels.",
  },
  {
    id: 5027, ch: 4, subj: "chem", diff: "hard",
    q: "Both ethanol and ethanoic acid react with sodium metal to release hydrogen gas. This shows that:",
    opts: ["Both are acids of equal strength", "Both contain a hydrogen atom attached to oxygen that sodium can displace", "Ethanol is a stronger acid than ethanoic acid", "Neither contains oxygen"],
    ans: 1,
    exp: "Sodium displaces the hydrogen of an –OH group, which both compounds possess. It does NOT follow that both are acids — ethanol does not turn litmus red or react with NaHCO₃. The sodium test is a test for the –OH group, not for acidity, and conflating the two is the trap here.",
  },
  {
    id: 5028, ch: 4, subj: "chem", diff: "medium",
    q: "Vegetable oils are healthier than animal fats mainly because vegetable oils:",
    opts: ["Contain more saturated hydrocarbon chains", "Contain unsaturated chains with double bonds", "Contain no carbon", "Have higher melting points"],
    ans: 1,
    exp: "Unsaturated fatty acid chains (with C=C bonds) are generally considered healthier than the saturated chains dominant in animal fats. This is also why hydrogenating vegetable oil into vanaspati, which removes those double bonds, reduces its health advantage.",
  },
  {
    id: 5029, ch: 4, subj: "chem", diff: "hard",
    q: "The number of structural isomers possible for C₅H₁₂ is:",
    opts: ["2", "3", "4", "5"],
    ans: 1,
    exp: "Pentane has three isomers: n-pentane (straight chain), iso-pentane (2-methylbutane), and neo-pentane (2,2-dimethylpropane). C₄H₁₀ has 2 and C₆H₁₄ has 5. Systematically shortening the main chain and moving the branch, rather than guessing, is the reliable method.",
  },
  {
    id: 5030, ch: 4, subj: "chem", diff: "medium",
    q: "Detergents are preferred over soaps for washing clothes in hard water because the calcium and magnesium salts of detergents are:",
    opts: ["Insoluble and form scum", "Soluble in water, so no scum forms and cleaning continues", "Volatile and evaporate", "Converted into soap"],
    ans: 1,
    exp: "The sulphonate group in detergents forms soluble salts with Ca²⁺ and Mg²⁺, unlike the carboxylate group in soaps which forms insoluble scum. The trade-off is that many detergents resist biodegradation and contribute to water pollution.",
  },

  // ---------------------------------------------------------------------
  // Ch 5 — Periodic Classification
  // ---------------------------------------------------------------------
  {
    id: 5031, ch: 5, subj: "chem", diff: "easy",
    q: "An element has the electronic configuration 2, 8, 7. Its position in the Modern Periodic Table is:",
    opts: ["Period 3, Group 17", "Period 7, Group 3", "Period 2, Group 7", "Period 3, Group 7"],
    ans: 0,
    exp: "The number of shells (3) gives the period. For p-block elements the group is 10 + number of valence electrons = 10 + 7 = 17. This element is chlorine. Answering 'Group 7' is the standard slip — that was Mendeleev's numbering, not the modern 18-group system.",
  },
  {
    id: 5032, ch: 5, subj: "chem", diff: "hard",
    q: "Newlands' Law of Octaves failed beyond calcium mainly because:",
    opts: ["He used atomic number instead of atomic mass", "Only 56 elements were known and he assumed no more existed, leaving no gaps for undiscovered ones", "He placed hydrogen in Group 17", "Calcium is radioactive"],
    ans: 1,
    exp: "Newlands forced every known element into his scheme, sometimes cramming two into one slot, because he assumed the 56 known elements were all that existed. Mendeleev's crucial improvement was the willingness to leave gaps — which is precisely why his table survived new discoveries and Newlands' did not.",
  },
  {
    id: 5033, ch: 5, subj: "chem", diff: "hard",
    q: "Atomic radius generally decreases across a period, yet noble gas atomic radii are often listed as larger than the halogen before them. The reason is that:",
    opts: ["Noble gases gain extra electrons", "Noble gas radii are measured as van der Waals radii, not covalent radii, since they form no bonds", "Noble gases are in a different period", "The measurement is simply an error"],
    ans: 1,
    exp: "Covalent radius is measured from bonded atoms, but noble gases do not normally bond, so their size is quoted as a van der Waals radius, which is inherently larger. The apparent anomaly is a difference in measurement convention, not a break in the periodic trend.",
  },
  {
    id: 5034, ch: 5, subj: "chem", diff: "medium",
    q: "Which pair of elements would you expect to have the most similar chemical properties?",
    opts: ["Sodium (Z=11) and Magnesium (Z=12)", "Sodium (Z=11) and Potassium (Z=19)", "Chlorine (Z=17) and Argon (Z=18)", "Carbon (Z=6) and Nitrogen (Z=7)"],
    ans: 1,
    exp: "Na (2,8,1) and K (2,8,8,1) both have one valence electron, so both are Group 1 alkali metals with near-identical chemistry. Chemical similarity follows valence electron count, which means group membership — not simply being adjacent by atomic number.",
  },
  {
    id: 5035, ch: 5, subj: "chem", diff: "hard", pyq: true,
    q: "Elements A, B, C have atomic numbers 9, 17 and 35. Which statement about them is correct?",
    opts: ["They belong to the same period and their reactivity increases down the list", "They belong to the same group, and their atomic size increases from A to C while reactivity decreases", "A is a metal and C is a non-metal", "All three are noble gases"],
    ans: 1,
    exp: "Z = 9, 17, 35 are fluorine, chlorine and bromine — all Group 17 halogens in successive periods. Going down the group, each gains a shell so atomic size increases, and the outer electrons are further from the nucleus so the tendency to gain an electron (reactivity for a non-metal) decreases.",
  },
  {
    id: 5036, ch: 5, subj: "chem", diff: "medium",
    q: "Mendeleev placed cobalt (58.9) BEFORE nickel (58.7) despite cobalt having a higher atomic mass. In the Modern Periodic Table this ordering is:",
    opts: ["Reversed, because mass is the correct criterion", "Retained and justified, because Co (Z=27) genuinely comes before Ni (Z=28) by atomic number", "Considered an unresolved anomaly", "Irrelevant, as both are in different periods"],
    ans: 1,
    exp: "Mendeleev made this placement on the basis of chemical properties, against his own mass-ordering rule. Moseley's atomic number criterion later showed his instinct was right — Co (27) does precede Ni (28). Every such anomaly in Mendeleev's table dissolves once atomic number replaces atomic mass.",
  },

  // ---------------------------------------------------------------------
  // Ch 6 — Life Processes
  // ---------------------------------------------------------------------
  {
    id: 5037, ch: 6, subj: "bio", diff: "easy",
    q: "The opening and closing of a stoma is controlled by:",
    opts: ["Chlorophyll concentration", "The swelling and shrinking of guard cells as water moves in and out", "Root pressure alone", "The thickness of the cuticle"],
    ans: 1,
    exp: "When water enters the guard cells they swell and bow outward, opening the pore. When water leaves they shrink and the pore closes. Stomata close at night to conserve water, since photosynthesis (and hence the need for CO₂ intake) has stopped.",
  },
  {
    id: 5038, ch: 6, subj: "bio", diff: "hard",
    q: "In the human kidney, glucose appears in the initial filtrate but is absent from normal urine. This is because glucose is:",
    opts: ["Too large to be filtered at the glomerulus", "Completely reabsorbed in the tubule by selective reabsorption", "Destroyed by enzymes in the collecting duct", "Converted into urea before excretion"],
    ans: 1,
    exp: "Glucose is small enough to be filtered freely, so it IS present in the filtrate. Healthy tubules then reabsorb all of it back into the blood. Glucose in urine indicates the blood glucose was so high that the reabsorption mechanism was saturated — which is why a urine sugar test screens for diabetes.",
  },
  {
    id: 5039, ch: 6, subj: "bio", diff: "hard",
    q: "Fish have a two-chambered heart and single circulation, while birds and mammals have four chambers and double circulation. The functional reason for this difference is that:",
    opts: ["Fish are smaller than birds", "Warm-blooded animals need a high, steady oxygen supply, which requires completely separating oxygenated from deoxygenated blood", "Fish do not need oxygen", "Four chambers reduce the animal's body weight"],
    ans: 1,
    exp: "Maintaining constant body temperature demands a high metabolic rate and therefore efficient oxygen delivery. Complete separation of the two blood streams ensures tissues receive fully oxygenated blood at high pressure. Fish, being cold-blooded, can tolerate the lower efficiency of single circulation.",
  },
  {
    id: 5040, ch: 6, subj: "bio", diff: "medium",
    q: "The correct sequence of blood flow starting from the right ventricle is:",
    opts: ["Right ventricle → aorta → body → right atrium", "Right ventricle → pulmonary artery → lungs → pulmonary vein → left atrium", "Right ventricle → left ventricle → lungs → right atrium", "Right ventricle → vena cava → lungs → left atrium"],
    ans: 1,
    exp: "The right ventricle pumps deoxygenated blood to the lungs through the pulmonary artery. It returns oxygenated through the pulmonary vein to the left atrium. This is the one place where an artery carries deoxygenated blood and a vein carries oxygenated blood.",
  },
  {
    id: 5041, ch: 6, subj: "bio", diff: "hard",
    q: "A person's small intestine is surgically shortened. The most immediate consequence would be:",
    opts: ["Inability to swallow food", "Reduced absorption of digested nutrients because of decreased surface area", "Failure of the heart to pump", "Immediate loss of the ability to breathe"],
    ans: 1,
    exp: "The small intestine is the main site of absorption, and its villi and microvilli provide the enormous surface area that makes absorption efficient. Shortening it directly removes absorptive surface, so nutrients pass through partly unabsorbed even though digestion itself may still occur.",
  },
  {
    id: 5042, ch: 6, subj: "bio", diff: "medium",
    q: "The rings of cartilage present in the trachea function to:",
    opts: ["Warm the incoming air", "Prevent the air passage from collapsing when air pressure inside drops", "Filter dust particles", "Produce sound"],
    ans: 1,
    exp: "As air is drawn in, pressure inside the trachea falls below atmospheric pressure. Without support the soft tube would collapse inward. The C-shaped cartilage rings hold it permanently open, and their incomplete shape leaves room for the oesophagus behind to expand during swallowing.",
  },
  {
    id: 5043, ch: 6, subj: "bio", diff: "hard", pyq: true,
    q: "An athlete running a sprint develops muscle cramps, but a person walking at the same distance does not. The biological explanation is that:",
    opts: ["Sprinting uses more glucose than walking", "Sprinting outpaces oxygen supply, so muscles respire anaerobically and accumulate lactic acid", "Walking produces more ATP per glucose molecule", "Cramps are caused by loss of carbon dioxide"],
    ans: 1,
    exp: "During a sprint, oxygen delivery cannot keep up with demand, so muscles switch to anaerobic respiration: glucose → lactic acid + 2 ATP. The accumulating lactic acid causes cramping. Walking stays within the aerobic capacity, yielding 38 ATP per glucose with no lactic acid build-up.",
  },

  // ---------------------------------------------------------------------
  // Ch 7 — Control & Coordination
  // ---------------------------------------------------------------------
  {
    id: 5044, ch: 7, subj: "bio", diff: "easy",
    q: "The movement of a plant shoot towards light is called:",
    opts: ["Geotropism", "Phototropism", "Hydrotropism", "Chemotropism"],
    ans: 1,
    exp: "Phototropism is directional growth in response to light, and shoots show a positive response. It is driven by auxin accumulating on the shaded side, where it causes faster cell elongation, bending the shoot toward the light.",
  },
  {
    id: 5045, ch: 7, subj: "bio", diff: "hard",
    q: "A person suffers damage to the cerebellum. The most likely symptom is:",
    opts: ["Inability to remember names", "Loss of balance and jerky, poorly coordinated movement", "Complete stoppage of breathing", "Loss of the sense of smell"],
    ans: 1,
    exp: "The cerebellum governs precision, balance and posture. Damage produces ataxia — the person can still move, but the movements are clumsy and unbalanced. Memory loss points to the cerebrum, and breathing failure to the medulla, so the question tests region-to-function mapping.",
  },
  {
    id: 5046, ch: 7, subj: "bio", diff: "hard",
    q: "In a reflex action, the brain does receive information about the stimulus. The reason the response still counts as a reflex is that:",
    opts: ["The brain is not involved at any stage", "The motor response is initiated by the spinal cord before the brain processes the signal", "The signal never reaches the brain", "Reflexes only occur during sleep"],
    ans: 1,
    exp: "The spinal cord relays the signal directly from sensory to motor neuron and triggers the response. The information travels to the brain in parallel, which is why you consciously feel pain a moment AFTER your hand has already moved. The defining feature is where the decision is made, not whether the brain is informed.",
  },
  {
    id: 5047, ch: 7, subj: "bio", diff: "medium",
    q: "Which plant hormone is responsible for inhibiting growth and causing wilting of leaves?",
    opts: ["Auxin", "Gibberellin", "Cytokinin", "Abscisic acid"],
    ans: 3,
    exp: "Abscisic acid is the main growth inhibitor — it promotes dormancy, closes stomata under water stress, and causes leaf wilting and fall. Auxin, gibberellin and cytokinin are all growth promoters, so ABA is the odd one out in this group.",
  },
  {
    id: 5048, ch: 7, subj: "bio", diff: "hard",
    q: "Iodised salt is promoted as a public health measure. The biochemical reason is that iodine is:",
    opts: ["A hormone itself that controls metabolism", "An essential raw material the thyroid needs to synthesise thyroxine", "A stimulant of the pituitary gland", "Required to produce insulin"],
    ans: 1,
    exp: "Thyroxine molecules contain iodine atoms, so without dietary iodine the thyroid cannot manufacture the hormone at all. The gland then enlarges as it works harder trying to compensate, producing goitre. Iodine is the substrate, not the hormone.",
  },
  {
    id: 5049, ch: 7, subj: "bio", diff: "medium", pyq: true,
    q: "Assertion (A): Nerve impulses cannot travel backwards across a synapse. Reason (R): Neurotransmitter vesicles are present only on the pre-synaptic side and receptors only on the post-synaptic side.",
    opts: ["Both A and R are true, and R is the correct explanation of A", "Both A and R are true, but R is NOT the correct explanation of A", "A is true, R is false", "A is false, R is true"],
    ans: 0,
    exp: "The one-way nature of synaptic transmission follows directly from this structural asymmetry — only one side can release the chemical signal and only the other side can detect it. R is precisely the mechanism that makes A true.",
  },

  // ---------------------------------------------------------------------
  // Ch 8 — How Do Organisms Reproduce
  // ---------------------------------------------------------------------
  {
    id: 5050, ch: 8, subj: "bio", diff: "easy",
    q: "Spore formation as a mode of asexual reproduction is seen in:",
    opts: ["Hydra", "Rhizopus (bread mould)", "Planaria", "Amoeba"],
    ans: 1,
    exp: "Rhizopus produces sporangia on upright hyphae that release thousands of spores. The thick spore walls resist drying and unfavourable conditions, so the organism can wait out bad periods and germinate when moisture returns.",
  },
  {
    id: 5051, ch: 8, subj: "bio", diff: "hard",
    q: "Planaria cut into several pieces regenerates into several complete organisms, but a human cannot regenerate an amputated arm. The reason is that:",
    opts: ["Humans have no cells capable of dividing", "Planaria has abundant specialised regenerative cells that can differentiate into every tissue type, which humans lack in that form", "Human cells are larger", "Regeneration only works in water"],
    ans: 1,
    exp: "Regeneration in Planaria depends on a reserve of unspecialised cells that can proliferate and differentiate into every organ in the correct sequence. Complex organisms like humans have largely lost this capacity. Note that regeneration is not the same as reproduction — it is not how Planaria normally reproduces.",
  },
  {
    id: 5052, ch: 8, subj: "bio", diff: "hard",
    q: "In double fertilisation, the endosperm is triploid (3n) while the zygote is diploid (2n). This difference arises because:",
    opts: ["The endosperm is formed from three male gametes", "One male gamete fuses with the egg, and the other fuses with two polar nuclei", "The endosperm divides three times before the zygote", "The ovule contributes three nuclei to the zygote"],
    ans: 1,
    exp: "Male gamete (n) + egg (n) = zygote (2n). Male gamete (n) + two polar nuclei (n + n) = endosperm (3n). The endosperm's extra set comes from the second polar nucleus, not from extra male gametes — this ploidy arithmetic is exactly what board questions probe.",
  },
  {
    id: 5053, ch: 8, subj: "bio", diff: "medium",
    q: "Which contraceptive method also offers protection against sexually transmitted infections?",
    opts: ["Oral contraceptive pills", "Barrier methods such as condoms", "Copper-T (IUD)", "Surgical methods such as vasectomy"],
    ans: 1,
    exp: "Barrier methods physically prevent contact between body fluids, so they block pathogen transmission as well as sperm. Hormonal, intrauterine and surgical methods prevent pregnancy only and provide no protection against infection — a distinction with real public-health significance.",
  },
  {
    id: 5054, ch: 8, subj: "bio", diff: "hard",
    q: "A gardener grafts a branch of a high-yielding mango variety onto the rootstock of a disease-resistant variety. The resulting fruit will:",
    opts: ["Be a genetic blend of both varieties", "Match the grafted branch (scion), since fruit develops from the scion's own tissue", "Match the rootstock variety", "Be sterile and produce no fruit"],
    ans: 1,
    exp: "Grafting joins two plants but does not mix their genetic material. The scion keeps producing its own fruit type while drawing water and minerals through the rootstock's roots. This lets growers combine desirable fruit with a hardy root system in one plant.",
  },
  {
    id: 5055, ch: 8, subj: "bio", diff: "medium", pyq: true,
    q: "The main function of the seminal vesicles and prostate gland is to:",
    opts: ["Produce sperm cells", "Add fluid that nourishes sperm and makes their transport easier", "Store the fertilised egg", "Produce the hormone oestrogen"],
    ans: 1,
    exp: "Sperm are produced in the testes. The seminal vesicles and prostate contribute secretions that nourish the sperm, provide a transport medium, and together with the sperm form semen. Board questions often check that students separate sperm PRODUCTION from sperm SUPPORT.",
  },

  // ---------------------------------------------------------------------
  // Ch 9 — Heredity & Evolution
  // ---------------------------------------------------------------------
  {
    id: 5056, ch: 9, subj: "bio", diff: "medium",
    q: "Mendel chose the garden pea partly because it has:",
    opts: ["A very long life cycle allowing careful study", "Clearly contrasting traits, short life cycle, and flowers that normally self-pollinate but can be cross-pollinated by hand",  "Only one observable trait", "No seeds"],
    ans: 1,
    exp: "Each of these features mattered: contrasting traits gave unambiguous data, a short life cycle gave many generations quickly, and controllable pollination let him decide exactly which plants crossed. His experimental design, not luck, is why the ratios came out so cleanly.",
  },
  {
    id: 5057, ch: 9, subj: "bio", diff: "hard",
    q: "A man with blood group AB marries a woman with blood group O. Which blood group is impossible among their children?",
    opts: ["A", "B", "AB", "Both A and B are impossible"],
    ans: 2,
    exp: "The father contributes either I^A or I^B; the mother can only contribute i. Children are therefore I^A i (group A) or I^B i (group B). Group AB requires both I^A and I^B, and the mother has neither, so AB is impossible — as is O, since every child receives a dominant allele from the father.",
  },
  {
    id: 5058, ch: 9, subj: "bio", diff: "hard",
    q: "Vestigial organs such as the human appendix are used as evidence for evolution because they:",
    opts: ["Perform an important function in humans today", "Are reduced, functionless remnants of organs that were useful in ancestral species", "Appear only in adults", "Are found exclusively in humans"],
    ans: 1,
    exp: "A vestigial organ is structurally present but has lost its original function. Its persistence makes no sense under independent creation of each species, but is exactly what descent with modification predicts — an inherited structure gradually reduced once it stopped being needed.",
  },
  {
    id: 5059, ch: 9, subj: "bio", diff: "hard",
    q: "In a population of beetles, a random mutation produces green colour on green leaves where all others are red. Over generations green beetles dominate. The correct evolutionary description is:",
    opts: ["The beetles chose to become green to hide better", "The mutation arose randomly, and selection pressure from predators made it advantageous, so its frequency rose", "Green colour was an acquired trait passed to offspring", "The environment directly altered beetle DNA to make it green"],
    ans: 1,
    exp: "Variation appears first and randomly; the environment then filters it. The beetles did not respond to a need, and no organism acquired greenness during its lifetime. Separating 'mutation is random, selection is not' from the intuitive but wrong 'organisms adapt on purpose' is the heart of this chapter.",
  },
  {
    id: 5060, ch: 9, subj: "bio", diff: "medium",
    q: "Two pea plants both showing the tall phenotype are crossed and 25% of their offspring are dwarf. The genotypes of the parents must be:",
    opts: ["TT × TT", "TT × Tt", "Tt × Tt", "Tt × tt"],
    ans: 2,
    exp: "Dwarf offspring (tt) require a recessive allele from each parent, so both parents carry t. Since both parents are tall, both must be Tt. A Tt × Tt cross gives exactly 1 TT : 2 Tt : 1 tt, which is 25% dwarf.",
  },
  {
    id: 5061, ch: 9, subj: "bio", diff: "hard", pyq: true,
    q: "A fossil found in a deeper layer of undisturbed sedimentary rock compared to another is generally interpreted as:",
    opts: ["Younger, because deeper layers are formed later", "Older, because sediment layers are deposited on top of earlier ones over time", "The same age, since depth is unrelated to time", "Impossible to date by any method"],
    ans: 1,
    exp: "In undisturbed strata, each new layer settles above the previous one, so depth correlates with age. This relative dating can be combined with radioactive dating of the fossil's carbon or the surrounding rock for an absolute estimate. The word 'undisturbed' matters — geological folding can invert layers.",
  },

  // ---------------------------------------------------------------------
  // Ch 10 — Light: Reflection & Refraction
  // ---------------------------------------------------------------------
  {
    id: 5062, ch: 10, subj: "phy", diff: "medium",
    q: "An object is placed at the centre of curvature of a concave mirror of focal length 12 cm. The image distance is:",
    opts: ["−12 cm", "−24 cm", "−36 cm", "+24 cm"],
    ans: 1,
    exp: "At C, u = −2f = −24 cm. Using 1/v + 1/u = 1/f: 1/v = 1/(−12) − 1/(−24) = −2/24 + 1/24 = −1/24, so v = −24 cm. The image forms at C itself, same size and inverted (m = −1).",
  },
  {
    id: 5063, ch: 10, subj: "phy", diff: "hard",
    q: "A convex lens of focal length 15 cm forms an image the same size as the object. The object distance is:",
    opts: ["15 cm", "30 cm", "45 cm", "7.5 cm"],
    ans: 1,
    exp: "A convex lens gives a same-size real image only when the object sits at 2F. Here 2f = 30 cm. Checking: u = −30, 1/v = 1/15 + 1/(−30) = 1/30, so v = +30 and m = v/u = −1 — same size, inverted, real.",
  },
  {
    id: 5064, ch: 10, subj: "phy", diff: "hard",
    q: "The refractive index of water is 1.33 and of glass is 1.50. The refractive index of glass with respect to water is:",
    opts: ["0.887", "1.128", "1.995", "2.83"],
    ans: 1,
    exp: "n(glass w.r.t. water) = n_glass / n_water = 1.50 / 1.33 ≈ 1.128. Relative refractive index is always the ratio of the two absolute values, and the value being greater than 1 tells you glass is the denser of the pair — light slows further on entering it from water.",
  },
  {
    id: 5065, ch: 10, subj: "phy", diff: "medium",
    q: "A ray of light strikes a plane mirror at an angle of 30° to the mirror surface. The angle of reflection is:",
    opts: ["30°", "60°", "90°", "15°"],
    ans: 1,
    exp: "Angles in reflection are always measured from the NORMAL, not the surface. A 30° angle to the surface means 60° to the normal, so the angle of incidence is 60° and the angle of reflection is 60°. This wording trap appears in board papers every few years.",
  },
  {
    id: 5066, ch: 10, subj: "phy", diff: "hard",
    q: "A magnification of −3 is produced by a concave mirror. The image is:",
    opts: ["Virtual, erect and three times larger", "Real, inverted and three times larger", "Real, erect and one-third the size", "Virtual, inverted and one-third the size"],
    ans: 1,
    exp: "The negative sign means real and inverted; magnitude 3 means three times the object size. Reading both parts of the magnification separately — sign for nature, magnitude for size — turns an apparently tricky question into a two-second one.",
  },
  {
    id: 5067, ch: 10, subj: "phy", diff: "hard",
    q: "Light passes through a rectangular glass slab. Compared to the incident ray, the emergent ray is:",
    opts: ["Bent towards the normal permanently", "Parallel to the incident ray but laterally displaced", "Perpendicular to the incident ray", "Reflected back along the same path"],
    ans: 1,
    exp: "Refraction at the first surface bends the ray toward the normal; refraction at the second surface bends it away by an equal amount, since the two surfaces are parallel. The directions cancel, leaving the emergent ray parallel to the original but shifted sideways — the lateral displacement.",
  },
  {
    id: 5068, ch: 10, subj: "phy", diff: "medium",
    q: "Two lenses of power +3 D and +2 D are placed in contact. The focal length of the combination is:",
    opts: ["20 cm", "25 cm", "50 cm", "5 cm"],
    ans: 0,
    exp: "P_total = 3 + 2 = +5 D. f = 1/P = 1/5 m = 0.20 m = 20 cm. Powers add directly for lenses in contact, which is exactly why opticians work in dioptres rather than focal lengths.",
  },

  // ---------------------------------------------------------------------
  // Ch 11 — Human Eye & The Colourful World
  // ---------------------------------------------------------------------
  {
    id: 5069, ch: 11, subj: "phy", diff: "medium",
    q: "The change in focal length of the eye lens to focus on objects at different distances is brought about by:",
    opts: ["Movement of the retina backwards and forwards", "Contraction and relaxation of the ciliary muscles changing the lens curvature", "Widening and narrowing of the pupil", "Changes in the refractive index of the vitreous humour"],
    ans: 1,
    exp: "The retina's position is fixed, so the eye must change the lens instead. Ciliary muscles contract to make the lens more convex for near objects and relax to flatten it for distant ones. The pupil controls how much light enters, not where the image forms.",
  },
  {
    id: 5070, ch: 11, subj: "phy", diff: "hard",
    q: "A person's far point is 200 cm. The power of the corrective lens needed is:",
    opts: ["+0.5 D", "−0.5 D", "+2 D", "−2 D"],
    ans: 1,
    exp: "This is myopia — the lens must form the image of an infinitely distant object at the person's far point, so v = −200 cm = −2 m and u = infinity. Then 1/f = 1/v = −1/2, giving f = −2 m and P = 1/f = −0.5 D. The negative sign confirms a diverging concave lens.",
  },
  {
    id: 5071, ch: 11, subj: "phy", diff: "hard",
    q: "In outer space an astronaut sees the sky as dark black even though the Sun is shining. The reason is:",
    opts: ["The Sun is too far away in space", "There is no atmosphere to scatter sunlight, so no scattered light reaches the eye from other directions", "Space absorbs all blue light", "The astronaut's visor blocks blue light"],
    ans: 1,
    exp: "The sky is blue on Earth only because atmospheric molecules scatter sunlight toward the observer from every direction. With no atmosphere there is no scattering medium, so apart from looking directly at a light source the sky appears black. This is the cleanest confirmation that the blue sky is a scattering effect.",
  },
  {
    id: 5072, ch: 11, subj: "phy", diff: "medium",
    q: "White light is passed through a prism and the emergent spectrum is passed through an identical inverted prism. The result is:",
    opts: ["A wider spectrum", "White light is recombined", "Only red light emerges", "The light is totally internally reflected"],
    ans: 1,
    exp: "The second prism deviates each colour by an equal and opposite amount, reversing the dispersion. Newton's two-prism experiment showed that the prism does not add colour to white light — it separates colours that were already present.",
  },
  {
    id: 5073, ch: 11, subj: "phy", diff: "hard",
    q: "Danger signals are red rather than violet. The physics reason is that red light:",
    opts: ["Is the brightest colour to the human eye", "Has the longest wavelength and is scattered least, so it travels furthest through fog and rain", "Travels faster than other colours in air", "Is the only colour that passes through glass"],
    ans: 1,
    exp: "Scattering is proportional to 1/λ⁴, so long-wavelength red is scattered far less than short-wavelength violet. In fog, rain or dust, red light therefore penetrates furthest and stays visible from a distance — exactly what a warning signal needs.",
  },
  {
    id: 5074, ch: 11, subj: "phy", diff: "hard", pyq: true,
    q: "The Sun is visible for a few minutes before actual sunrise and after actual sunset. This is caused by:",
    opts: ["Reflection from clouds", "Atmospheric refraction, which bends sunlight so the Sun appears higher than its true position", "Dispersion of white light", "Total internal reflection inside the eye"],
    ans: 1,
    exp: "Air density decreases with altitude, so sunlight travelling through the atmosphere bends gradually toward the denser layers. This lifts the Sun's apparent position above the horizon while it is still geometrically below it, advancing sunrise and delaying sunset by roughly two minutes each.",
  },

  // ---------------------------------------------------------------------
  // Ch 12 — Electricity
  // ---------------------------------------------------------------------
  {
    id: 5075, ch: 12, subj: "phy", diff: "medium",
    q: "A wire of resistance R is stretched so that its length doubles while its volume stays constant. The new resistance is:",
    opts: ["2R", "4R", "R/2", "R/4"],
    ans: 1,
    exp: "Constant volume means doubling the length halves the cross-sectional area. Since R = ρL/A, doubling L multiplies by 2 and halving A multiplies by 2 again, giving 4R. Forgetting that the area also changes is the usual error here.",
  },
  {
    id: 5076, ch: 12, subj: "phy", diff: "hard",
    q: "Two resistors of 3 Ω and 6 Ω are connected in parallel across a 12 V supply. The current drawn from the supply is:",
    opts: ["2 A", "4 A", "6 A", "1.33 A"],
    ans: 2,
    exp: "1/R = 1/3 + 1/6 = 3/6, so R = 2 Ω. Then I = V/R = 12/2 = 6 A. Cross-check by branches: 12/3 = 4 A and 12/6 = 2 A, totalling 6 A — the branch currents adding up is a useful way to confirm parallel answers.",
  },
  {
    id: 5077, ch: 12, subj: "phy", diff: "hard",
    q: "An electric heater and a television are both plugged into household sockets. The heater is rated 2000 W and the TV 100 W. Compared with the TV, the heater's resistance is:",
    opts: ["20 times larger", "20 times smaller", "The same, since both use 220 V", "400 times larger"],
    ans: 1,
    exp: "R = V²/P at the same supply voltage, so resistance is inversely proportional to power. 2000/100 = 20, meaning the heater's resistance is 20 times SMALLER. Low resistance draws high current at fixed voltage, which is exactly why heaters need thicker wiring and higher-rated fuses.",
  },
  {
    id: 5078, ch: 12, subj: "phy", diff: "medium",
    q: "Fuse wire is always connected in the live wire rather than the neutral wire because:",
    opts: ["Neutral wire carries no current", "If the fuse blows in the live wire, the appliance is fully disconnected from the dangerous high potential", "Fuse wire only melts at high voltage", "The neutral wire is thicker"],
    ans: 1,
    exp: "A fuse in the neutral would break the circuit but leave the appliance still connected to 220 V through the live wire — touching it could still give a fatal shock. Placing the fuse in the live wire cuts the connection to the high potential itself.",
  },
  {
    id: 5079, ch: 12, subj: "phy", diff: "hard",
    q: "A 1.5 kW geyser is used for 2 hours daily for 30 days. At ₹6 per unit, the monthly cost is:",
    opts: ["₹360", "₹540", "₹180", "₹900"],
    ans: 1,
    exp: "Energy per day = 1.5 kW × 2 h = 3 kWh. Monthly = 3 × 30 = 90 kWh = 90 units. Cost = 90 × 6 = ₹540. Keeping power in kilowatts and time in hours gives kWh directly, avoiding conversion mistakes with joules.",
  },
  {
    id: 5080, ch: 12, subj: "phy", diff: "hard",
    q: "Three identical bulbs are connected in series to a battery. If one bulb is replaced with one of higher resistance, the brightness of the other two will:",
    opts: ["Increase", "Decrease, because the total resistance rises and the shared current falls", "Stay exactly the same", "Drop to zero"],
    ans: 1,
    exp: "In series the same current flows through all components. Raising total resistance reduces that current (I = V/R), and since P = I²R for each unchanged bulb, a smaller current means less power and dimmer light. The replaced bulb itself, with larger R, actually glows brighter.",
  },
  {
    id: 5081, ch: 12, subj: "phy", diff: "medium", pyq: true,
    q: "The resistance of a conductor depends on all of the following EXCEPT:",
    opts: ["Its length", "Its cross-sectional area", "The material it is made of", "The potential difference applied across it"],
    ans: 3,
    exp: "R = ρL/A depends only on geometry and material (plus temperature). Applying more voltage to an ohmic conductor increases the current proportionally, leaving R unchanged — that constancy is precisely what Ohm's law asserts.",
  },

  // ---------------------------------------------------------------------
  // Ch 13 — Magnetic Effects of Electric Current
  // ---------------------------------------------------------------------
  {
    id: 5082, ch: 13, subj: "phy", diff: "easy",
    q: "Magnetic field lines never intersect each other because:",
    opts: ["They are drawn only outside the magnet", "At the point of intersection the compass needle would have to point in two directions at once", "They repel each other electrically", "Intersection would destroy the magnet"],
    ans: 1,
    exp: "A field line shows the direction the north pole of a compass needle points at that location. Since the needle can only settle in one direction at any point, two lines can never cross there — the field has a single well-defined direction everywhere.",
  },
  {
    id: 5083, ch: 13, subj: "phy", diff: "hard",
    q: "A current-carrying conductor is placed in a magnetic field parallel to the field direction. The force experienced by the conductor is:",
    opts: ["Maximum", "Zero", "Half the maximum value", "Reversed in direction"],
    ans: 1,
    exp: "F = BIL sin θ. When the current is parallel to the field, θ = 0° and sin 0° = 0, so the force vanishes. The force is maximum at θ = 90°, which is why motor coils are arranged perpendicular to the field.",
  },
  {
    id: 5084, ch: 13, subj: "phy", diff: "hard",
    q: "In a DC motor, the split-ring commutator's function is to:",
    opts: ["Increase the magnetic field strength", "Reverse the current direction in the coil every half rotation so the torque keeps acting the same way", "Convert AC into DC before it enters the coil", "Reduce friction on the axle"],
    ans: 1,
    exp: "Without the commutator the coil would rotate half a turn, then the torque would reverse and push it back, causing it to oscillate. Reversing the current at the right instant keeps the force always turning the coil in one direction, giving continuous rotation.",
  },
  {
    id: 5085, ch: 13, subj: "phy", diff: "medium",
    q: "Inside a long current-carrying solenoid, the magnetic field is:",
    opts: ["Zero everywhere", "Uniform and parallel to the axis", "Strongest at the centre and zero at the ends", "Circular around the axis"],
    ans: 1,
    exp: "The field inside a long solenoid is uniform in both magnitude and direction, running parallel to the axis — the same pattern as inside a bar magnet. This uniformity is why solenoids are used wherever a controlled, predictable field is needed.",
  },
  {
    id: 5086, ch: 13, subj: "phy", diff: "hard",
    q: "A magnet is held stationary inside a closed coil of wire. The induced current in the coil is:",
    opts: ["Maximum, because the field is strongest", "Zero, because the magnetic flux is not changing", "Constant and non-zero", "Alternating at 50 Hz"],
    ans: 1,
    exp: "Faraday's law says an EMF is induced by a CHANGING flux, not by the mere presence of a field. A stationary magnet produces constant flux, so no EMF and no current. Motion — or a changing current in a nearby coil — is essential, which is also why transformers cannot run on DC.",
  },
  {
    id: 5087, ch: 13, subj: "phy", diff: "hard", pyq: true,
    q: "The earth wire in a domestic circuit is connected to the metal body of appliances. Its protective function depends on the earth wire having:",
    opts: ["Very high resistance so current cannot pass", "Very low resistance, providing an easy path for leakage current to flow to the ground instead of through a person", "The same resistance as the live wire", "No connection to the ground at all"],
    ans: 1,
    exp: "If a live wire touches the metal casing, the earth wire's low resistance offers a far easier route to ground than a human body does. The large current that flows also blows the fuse, disconnecting the appliance. High resistance would defeat the entire purpose.",
  },

  // ---------------------------------------------------------------------
  // Ch 14 — Our Environment
  // ---------------------------------------------------------------------
  {
    id: 5088, ch: 14, subj: "bio", diff: "medium",
    q: "In the food chain Grass → Insect → Frog → Snake → Hawk, the hawk occupies which trophic level?",
    opts: ["Second", "Third", "Fourth", "Fifth"],
    ans: 3,
    exp: "Producers are level 1 (grass), insects level 2, frogs level 3, snakes level 4 and hawks level 5. Counting from the producer rather than from the first animal is the reliable method; starting the count at the insect is the usual mistake.",
  },
  {
    id: 5089, ch: 14, subj: "bio", diff: "hard",
    q: "An ecosystem is sprayed with a persistent pesticide. The organisms likely to carry the highest concentration in their tissues are:",
    opts: ["Producers, since they are sprayed directly", "Primary consumers", "Top carnivores, due to biomagnification up the food chain", "Decomposers, since they break everything down"],
    ans: 2,
    exp: "Each predator consumes many prey, and non-biodegradable, fat-soluble pesticides accumulate rather than being excreted. Concentration therefore multiplies at every step, leaving top carnivores worst affected — even though they were never sprayed directly.",
  },
  {
    id: 5090, ch: 14, subj: "bio", diff: "hard",
    q: "An artificial ecosystem such as an aquarium requires regular cleaning and feeding, while a natural pond does not. The fundamental reason is that:",
    opts: ["Aquarium water is chemically different", "The aquarium is an incomplete ecosystem lacking the full complement of decomposers and balanced trophic levels needed to recycle nutrients", "Fish in aquariums eat more", "Natural ponds receive no sunlight"],
    ans: 1,
    exp: "A natural pond has producers, consumers and decomposers in balance, so waste is broken down and nutrients are recycled continuously. An aquarium lacks that complete cycle, so waste accumulates and food must be supplied — human intervention substitutes for the missing components.",
  },
  {
    id: 5091, ch: 14, subj: "bio", diff: "medium",
    q: "Of the 3 Rs, 'Reduce' is placed first because:",
    opts: ["It is the easiest to do", "Preventing waste from being generated at all is more effective than managing it afterwards", "Recycling is illegal in some places", "Reusing damages products"],
    ans: 1,
    exp: "Recycling still consumes energy, water and transport, and reuse eventually ends in disposal. Not creating the waste in the first place avoids every downstream cost, which is why the three are deliberately ordered Reduce, then Reuse, then Recycle.",
  },
  {
    id: 5092, ch: 14, subj: "bio", diff: "hard",
    q: "The ozone layer protects life on Earth, yet ozone at ground level is classified as a pollutant. This apparent contradiction is resolved by noting that:",
    opts: ["The two are chemically different molecules", "Ozone is beneficial in the stratosphere where it absorbs UV, but harmful at ground level where it damages lung tissue and plants", "Ground-level ozone is artificial and stratospheric ozone is natural", "Only stratospheric ozone is real ozone"],
    ans: 1,
    exp: "It is the same molecule, O₃, and its effect depends entirely on altitude. High up it filters harmful ultraviolet radiation before it reaches us; at the surface it is a reactive irritant and a component of photochemical smog. 'Good up high, bad nearby' captures it.",
  },
  {
    id: 5093, ch: 14, subj: "bio", diff: "hard", pyq: true,
    q: "If all decomposers were suddenly removed from an ecosystem, the most serious long-term consequence would be:",
    opts: ["An immediate increase in the number of producers", "Dead organic matter would accumulate and nutrients would stay locked in it, so producers would eventually starve and the ecosystem would collapse", "Only carnivores would be affected", "Nothing, since producers make their own food from sunlight"],
    ans: 1,
    exp: "Producers make their own food but still require mineral nutrients from soil. Decomposers are what return nitrogen, phosphorus and potassium to the soil from dead matter. Without them the nutrient cycle breaks, so the collapse begins at the bottom of the food chain and works upward.",
  },
];

// =====================================================================
// SHORT ANSWERS (2 and 3 mark)
// =====================================================================
// The base bank ran 48 two-mark against 14 three-mark questions. Mock
// tests draw Section B (2 marks) and Section C (3 marks) from this same
// pool, so the three-mark side was badly under-supplied — this pack
// deliberately skews toward 3-mark answers to balance it.

export const EXTRA_SHORT_QA: QA[] = [
  {
    id: 5001, ch: 1, subj: "chem", marks: 3,
    q: "Balance the following equation and identify the type of reaction: Fe + H₂O → Fe₃O₄ + H₂. Explain why iron does not react with cold water.",
    a: "BALANCED EQUATION:\n3Fe + 4H₂O(steam) → Fe₃O₄ + 4H₂\n\nTYPE: Displacement reaction (and also a redox reaction — iron is oxidised by gaining oxygen, water is reduced by losing it).\n\nWHY NOT COLD WATER:\nIron sits in the middle of the reactivity series. It is not reactive enough to displace hydrogen from cold water — that requires a highly reactive metal such as sodium or potassium. Iron needs the extra energy supplied by steam at high temperature before the reaction will proceed.\n\nThis graded behaviour is a useful reactivity test in itself: K and Na react with cold water, Mg with hot water, and Fe, Al and Zn only with steam.",
  },
  {
    id: 5002, ch: 1, subj: "chem", marks: 3,
    q: "A shiny brown solid X is heated in air and turns into a black substance Y. When Y is heated with hydrogen gas, X is obtained back. Identify X and Y, write both equations, and name the type of each reaction.",
    a: "X = Copper (Cu), shiny reddish-brown\nY = Copper(II) oxide (CuO), black\n\nEQUATION 1: 2Cu + O₂ →(heat) 2CuO\nType: Combination reaction. Copper gains oxygen, so copper is OXIDISED.\n\nEQUATION 2: CuO + H₂ →(heat) Cu + H₂O\nType: Displacement / redox reaction. CuO loses oxygen, so it is REDUCED; H₂ gains oxygen, so hydrogen is OXIDISED.\n\nKEY POINT: The same element runs through oxidation in one reaction and reduction in the reverse. This pair is the standard demonstration that oxidation and reduction are opposite processes rather than properties of a particular substance.",
  },
  {
    id: 5003, ch: 2, subj: "chem", marks: 3,
    q: "What is meant by 'water of crystallisation'? Describe an experiment using copper sulphate crystals to demonstrate it, giving the observations.",
    a: "DEFINITION:\nWater of crystallisation is the fixed number of water molecules chemically bound within one formula unit of a salt's crystal structure. It gives crystals their shape and often their colour, and it is present in a definite ratio (unlike surface moisture).\n\nEXPERIMENT:\n1. Take a few blue crystals of copper sulphate in a dry boiling tube.\n2. Heat gently over a flame.\n3. Observe the colour and the walls of the tube.\n4. Allow to cool, then add a few drops of water to the residue.\n\nOBSERVATIONS:\n• On heating, the blue crystals turn into a white powder.\n• Droplets of water collect on the cooler upper walls of the tube.\n• On adding water back, the white powder turns blue again and the tube becomes warm.\n\nEQUATION: CuSO₄·5H₂O →(heat) CuSO₄ + 5H₂O\n\nCONCLUSION: The blue colour comes from the bound water, not from copper sulphate itself. Since the change reverses on adding water, the water was chemically incorporated into the crystal.",
  },
  {
    id: 5004, ch: 2, subj: "chem", marks: 2,
    q: "Why does distilled water not conduct electricity while rainwater does?",
    a: "Electrical conduction in a liquid requires free-moving IONS to carry charge.\n\nDISTILLED WATER: Pure H₂O ionises only to an extremely small extent, so it contains almost no free ions and is effectively a non-conductor.\n\nRAINWATER: While falling, rain dissolves atmospheric gases — particularly carbon dioxide, which forms carbonic acid:\nCO₂ + H₂O → H₂CO₃ → H⁺ + HCO₃⁻\n\nThese dissolved ions make rainwater a weak conductor. The same reason explains why rainwater is naturally slightly acidic (pH ≈ 5.6) even without pollution.",
  },
  {
    id: 5005, ch: 3, subj: "chem", marks: 3,
    q: "What are amphoteric oxides? Write balanced equations showing how aluminium oxide reacts with both an acid and a base.",
    a: "DEFINITION:\nAmphoteric oxides are metal oxides that react with BOTH acids and bases to form salt and water. They sit at the boundary between clearly metallic (basic) and clearly non-metallic (acidic) oxides.\n\nWITH AN ACID (behaving as a base):\nAl₂O₃ + 6HCl → 2AlCl₃ + 3H₂O\n\nWITH A BASE (behaving as an acid):\nAl₂O₃ + 2NaOH → 2NaAlO₂ (sodium aluminate) + H₂O\n\nOTHER EXAMPLES: ZnO, PbO, SnO — and the corresponding metals Al, Zn, Pb, Sn are described as amphoteric metals.\n\nWHY IT MATTERS: This dual behaviour is a direct consequence of these elements' position near the metal/non-metal dividing line in the periodic table — neither strongly electron-donating nor strongly electron-accepting.",
  },
  {
    id: 5006, ch: 3, subj: "chem", marks: 3,
    q: "Explain, with equations, how a highly reactive metal such as sodium is extracted, and why the method used for iron would not work.",
    a: "EXTRACTION OF SODIUM — ELECTROLYTIC REDUCTION:\nMolten sodium chloride is electrolysed (Downs process):\n\nAt cathode: Na⁺ + e⁻ → Na (sodium metal collected)\nAt anode: 2Cl⁻ → Cl₂ + 2e⁻ (chlorine gas released)\nOverall: 2NaCl(molten) →(electrolysis) 2Na + Cl₂\n\nWHY CARBON REDUCTION FAILS:\nIron is extracted by reducing its oxide with carbon monoxide in a blast furnace:\nFe₂O₃ + 3CO → 2Fe + 3CO₂\n\nThis works only because iron is BELOW carbon in the reactivity series, so carbon can pull oxygen away from it. Sodium is far ABOVE carbon — it holds its oxygen (or chlorine) more strongly than carbon does, so carbon cannot displace it at any practical temperature.\n\nGENERAL RULE: The extraction method follows directly from position in the reactivity series — electrolysis for the most reactive metals, carbon reduction for moderately reactive ones, and simple heating for the least reactive.",
  },
  {
    id: 5007, ch: 4, subj: "chem", marks: 3,
    q: "What is a homologous series? List three characteristics, and write the first four members of the alcohol series with their formulas.",
    a: "DEFINITION:\nA homologous series is a family of organic compounds containing the same functional group, in which each successive member differs from the previous one by a –CH₂– unit.\n\nTHREE CHARACTERISTICS:\n1. All members share the same general formula (alcohols: CₙH₂ₙ₊₁OH).\n2. Chemical properties are similar throughout, since the functional group is unchanged.\n3. Physical properties (melting point, boiling point, density) change gradually and predictably as the chain lengthens.\n\nFIRST FOUR ALCOHOLS:\n• Methanol — CH₃OH\n• Ethanol — C₂H₅OH\n• Propanol — C₃H₇OH\n• Butanol — C₄H₉OH\n\nEach differs from the next by CH₂, a mass difference of 14 u.\n\nWHY IT IS USEFUL: Knowing one member's chemistry effectively gives you the whole series, which is what makes organic chemistry learnable despite millions of known compounds.",
  },
  {
    id: 5008, ch: 4, subj: "chem", marks: 2,
    q: "Explain why carbon forms a very large number of compounds compared with other elements.",
    a: "Two properties of carbon combine to produce this:\n\n1. CATENATION — carbon atoms bond strongly to one another, forming long straight chains, branched chains and closed rings of essentially unlimited length. Carbon–carbon bonds are unusually strong and stable, so these structures survive. Silicon can catenate too, but its chains are far weaker and break easily.\n\n2. TETRAVALENCY — each carbon atom has four valence electrons and forms four covalent bonds, so every carbon in a chain still has spare bonding positions for hydrogen, oxygen, nitrogen, halogens and so on.\n\nTogether these allow an enormous number of distinct skeletons, each of which can carry many different functional groups — which is why over ten million carbon compounds are known.",
  },
  {
    id: 5009, ch: 5, subj: "chem", marks: 3,
    q: "An element X has atomic number 20. Write its electronic configuration, state its period and group, predict whether it is a metal or non-metal, and write the formula of its oxide.",
    a: "ELECTRONIC CONFIGURATION:\nZ = 20 → 2, 8, 8, 2\n\nPOSITION:\n• Number of shells = 4 → Period 4\n• Valence electrons = 2 → Group 2\n(The element is calcium.)\n\nMETAL OR NON-METAL:\nIt is a METAL. With only 2 valence electrons it loses them readily to reach a stable octet, forming Ca²⁺. Ease of electron loss is exactly what defines metallic character, and it increases down a group and decreases across a period.\n\nFORMULA OF OXIDE:\nCa²⁺ and O²⁻ combine in a 1:1 ratio → CaO\n\nNATURE OF OXIDE: Basic, as expected of a metal oxide. It reacts with water to give an alkali:\nCaO + H₂O → Ca(OH)₂",
  },
  {
    id: 5010, ch: 6, subj: "bio", marks: 3,
    q: "Explain the process of transport of water in tall trees. Why does this not require an active pump like the heart?",
    a: "MECHANISM — TRANSPIRATION PULL:\n1. Water evaporates from the surface of mesophyll cells and leaves the leaf through stomata as water vapour (transpiration).\n2. This loss creates a negative pressure (suction) in the leaf's xylem vessels.\n3. Because water molecules attract each other strongly (cohesion) and cling to the xylem walls (adhesion), the water column does not break — the pull is transmitted continuously downward.\n4. Water is drawn up from the roots to replace what was lost, forming an unbroken column from root to leaf.\n\nROOT PRESSURE also contributes, but mainly at night and only over short heights.\n\nWHY NO PUMP IS NEEDED:\nThe energy driving the process comes from the SUN, which evaporates the water — not from the plant's own metabolism. The plant does not spend ATP lifting water; it simply provides continuous pipework (xylem) and controls the rate by opening and closing stomata. This passive design is what allows trees to move water a hundred metres upward without any muscular organ.",
  },
  {
    id: 5011, ch: 6, subj: "bio", marks: 3,
    q: "Compare the nutritional strategies of Amoeba, a tapeworm, and bread mould, naming each type and explaining how each obtains food.",
    a: "1. AMOEBA — HOLOZOIC NUTRITION\nThe organism engulfs a solid food particle by extending pseudopodia around it, forming a food vacuole. Enzymes are secreted into the vacuole, digestion happens internally, nutrients diffuse into the cytoplasm, and undigested waste is expelled at the cell surface.\n\n2. TAPEWORM — PARASITIC NUTRITION\nIt lives inside the host's intestine and has no digestive system of its own. It absorbs already-digested nutrients directly across its body surface, harming the host in the process. Its body is highly reduced because the host performs the digestion for it.\n\n3. BREAD MOULD (Rhizopus) — SAPROPHYTIC NUTRITION\nIt secretes digestive enzymes OUTSIDE its body onto the dead organic matter, digests the food externally, then absorbs the soluble products through its hyphae.\n\nKEY CONTRAST: Amoeba digests inside itself, the mould digests outside itself, and the tapeworm lets someone else do the digesting entirely.",
  },
  {
    id: 5012, ch: 7, subj: "bio", marks: 3,
    q: "Draw (describe) the pathway of a reflex arc and explain why reflex actions evolved to bypass the brain.",
    a: "PATHWAY OF A REFLEX ARC:\nReceptor (e.g. heat receptor in the skin)\n→ Sensory (afferent) neuron\n→ Spinal cord, where a relay neuron connects directly to the motor neuron\n→ Motor (efferent) neuron\n→ Effector (the muscle that contracts and withdraws the hand)\n\nWHY IT BYPASSES THE BRAIN:\n1. SPEED — routing the signal through the spinal cord saves the time a trip to the brain and back would take. In a situation like touching a hot vessel, even a few hundredths of a second determines the severity of the burn.\n\n2. RELIABILITY — the response does not depend on the person noticing, deciding, or being distracted. It happens the same way every time.\n\n3. EVOLUTIONARY CONTEXT — complex thinking brains appeared relatively late. Faster, simpler reflex circuitry was already present and worked, so it was retained rather than replaced.\n\nIMPORTANT: The brain IS informed — it receives the signal in parallel, which is why you feel the pain a moment after your hand has already moved. The brain is bypassed for the DECISION, not for the information.",
  },
  {
    id: 5013, ch: 8, subj: "bio", marks: 3,
    q: "What is meant by 'reproduction is linked to the stability of a species rather than the survival of an individual'? Explain with reference to variation.",
    a: "WHY REPRODUCTION IS NOT NEEDED FOR INDIVIDUAL SURVIVAL:\nAn individual organism can live a complete, healthy life without reproducing. Unlike nutrition or respiration, reproduction contributes nothing to keeping that particular organism alive.\n\nWHAT IT DOES INSTEAD:\nReproduction maintains the SPECIES across time. Individuals die; the species persists only if new individuals are produced to replace them.\n\nTHE ROLE OF VARIATION:\nDNA copying during reproduction is remarkably accurate but not perfect. These small variations mean offspring are not exact copies.\n\nWhy that matters: if conditions change — a new disease, a temperature shift, a new predator — a population of identical individuals would either all survive or all perish together. A varied population is far more likely to contain some individuals whose particular traits let them survive the new conditions, and those individuals carry the species forward.\n\nCONCLUSION: Variation is the species' insurance policy against an unpredictable future, which is why sexual reproduction — slower and more costly than asexual — has persisted so widely.",
  },
  {
    id: 5014, ch: 9, subj: "bio", marks: 3,
    q: "A pea plant showing the tall phenotype is crossed with a dwarf plant. Explain how the result tells you the genotype of the tall parent, and show both possible outcomes.",
    a: "This is a TEST CROSS — crossing an organism of unknown genotype with a homozygous recessive (tt) to reveal what it carries.\n\nCASE 1 — If the tall parent is TT:\nTT × tt → all offspring Tt\nRESULT: 100% tall, no dwarf offspring at all.\n\nCASE 2 — If the tall parent is Tt:\nTt × tt → gametes T, t from one parent; t, t from the other\nOffspring: Tt, Tt, tt, tt\nRESULT: 1 tall : 1 dwarf (50% dwarf).\n\nHOW TO READ THE RESULT:\n• If any dwarf offspring appear, the tall parent MUST have carried a recessive t allele, so it is Tt.\n• If all offspring are tall, the tall parent is almost certainly TT (with a reasonable sample size).\n\nWHY THE DWARF PARENT IS USED: Because tt can only ever contribute t, whatever phenotype appears in the offspring is determined entirely by what the unknown parent contributed — the recessive parent acts as a clean 'window' into the unknown genotype.",
  },
  {
    id: 5015, ch: 10, subj: "phy", marks: 3,
    q: "An object 5 cm tall is placed 20 cm in front of a concave mirror of focal length 15 cm. Find the position, nature and size of the image.",
    a: "GIVEN: h = 5 cm, u = −20 cm, f = −15 cm (concave mirror)\n\nMIRROR FORMULA: 1/v + 1/u = 1/f\n1/v = 1/f − 1/u = 1/(−15) − 1/(−20)\n1/v = −1/15 + 1/20\n\nLCM of 15 and 20 is 60:\n1/v = −4/60 + 3/60 = −1/60\nv = −60 cm\n\nMAGNIFICATION: m = −v/u = −(−60)/(−20) = −3\n\nIMAGE HEIGHT: h' = m × h = −3 × 5 = −15 cm\n\nCONCLUSION:\n• Position: 60 cm in front of the mirror (same side as object, since v is negative)\n• Nature: REAL and INVERTED (m is negative, h' is negative)\n• Size: MAGNIFIED — 15 cm tall, three times the object\n\nCHECK AGAINST THEORY: The object at 20 cm lies between F (15 cm) and C (30 cm). Theory says the image should then form beyond C and be real, inverted and magnified — and v = 60 cm is indeed beyond C. The numerical result and the ray-diagram rule agree.",
  },
  {
    id: 5016, ch: 10, subj: "phy", marks: 2,
    q: "State the conditions necessary for total internal reflection and give one everyday application.",
    a: "TWO CONDITIONS — BOTH must hold simultaneously:\n1. Light must travel from an optically DENSER medium into an optically RARER medium (for example glass to air, or water to air).\n2. The angle of incidence in the denser medium must be GREATER than the critical angle for that pair of media.\n\nIf either condition fails, ordinary refraction occurs instead and light passes out of the medium.\n\nAPPLICATION — OPTICAL FIBRES:\nLight entering the fibre's core strikes the core–cladding boundary at an angle above the critical angle at every bounce, so it is totally internally reflected along the whole length with almost no loss. This is how telephone and internet signals travel long distances, and how endoscopes carry images out of the human body.\n\nOTHER EXAMPLES: The brilliance of a cut diamond (critical angle only about 24°, so light bounces many times inside before escaping), and mirages on hot roads.",
  },
  {
    id: 5017, ch: 11, subj: "phy", marks: 3,
    q: "A person cannot see objects nearer than 100 cm clearly. Identify the defect, calculate the power of the lens required to read at the normal near point of 25 cm, and state the type of lens.",
    a: "DEFECT: Hypermetropia (long-sightedness). The near point has moved from the normal 25 cm out to 100 cm.\n\nWHAT THE LENS MUST DO: Take an object placed at 25 cm and form a virtual image of it at 100 cm, where the eye can actually focus.\n\nGIVEN: u = −25 cm, v = −100 cm (virtual image, same side as object)\n\nLENS FORMULA: 1/v − 1/u = 1/f\n1/f = 1/(−100) − 1/(−25)\n1/f = −1/100 + 1/25\n1/f = −1/100 + 4/100 = 3/100\nf = +100/3 cm = +33.3 cm = +0.333 m\n\nPOWER: P = 1/f (in metres) = 1/0.333 = +3 D\n\nANSWER: A CONVEX (converging) lens of power +3 D.\n\nWHY CONVEX: The hypermetropic eye does not converge light strongly enough, so the image would form behind the retina. A converging lens adds the missing convergence before light enters the eye. The positive sign of the power confirms this.",
  },
  {
    id: 5018, ch: 12, subj: "phy", marks: 3,
    q: "Two resistors of 4 Ω and 6 Ω are connected first in series and then in parallel across a 12 V battery. Calculate the total current in each case and state which arrangement draws more power.",
    a: "SERIES ARRANGEMENT:\nR = R₁ + R₂ = 4 + 6 = 10 Ω\nI = V/R = 12/10 = 1.2 A\nPower P = VI = 12 × 1.2 = 14.4 W\n\nPARALLEL ARRANGEMENT:\n1/R = 1/4 + 1/6 = 3/12 + 2/12 = 5/12\nR = 12/5 = 2.4 Ω\nI = V/R = 12/2.4 = 5 A\nPower P = VI = 12 × 5 = 60 W\n\nCOMPARISON:\nThe PARALLEL arrangement draws more current (5 A vs 1.2 A) and dissipates far more power (60 W vs 14.4 W).\n\nWHY: For a fixed supply voltage, parallel connection always gives a LOWER total resistance than either individual resistor, so more current is drawn and more power is consumed (P = V²/R). This is precisely why household wiring is parallel — each appliance gets the full 220 V and operates at its rated power — and why adding too many appliances to one circuit can overload it.",
  },
  {
    id: 5019, ch: 13, subj: "phy", marks: 3,
    q: "Describe an experiment to demonstrate electromagnetic induction, stating the observations that prove an EMF is produced only by a CHANGING magnetic field.",
    a: "APPARATUS: A coil of insulated copper wire connected to a galvanometer, and a bar magnet.\n\nPROCEDURE AND OBSERVATIONS:\n\n1. Push the magnet's north pole quickly INTO the coil.\n→ The galvanometer needle deflects to one side.\n\n2. HOLD the magnet stationary inside the coil.\n→ The needle returns to zero. No current flows.\n\n3. Pull the magnet OUT of the coil.\n→ The needle deflects to the OPPOSITE side.\n\n4. Move the magnet faster.\n→ The deflection is larger.\n\n5. Keep the magnet still and move the COIL instead.\n→ Deflection occurs again, in the corresponding direction.\n\nWHAT THIS PROVES:\nStep 2 is the decisive one. The magnetic field is at its strongest with the magnet inside the coil, yet no current flows — so it is not the presence of a field that induces an EMF, but the CHANGE in the magnetic flux linked with the coil.\n\nStep 4 shows the magnitude of the induced EMF depends on the RATE of that change, and step 5 shows only relative motion matters, not which object moves.\n\nThis is Faraday's law, and it explains directly why a transformer cannot work on steady DC.",
  },
  {
    id: 5020, ch: 14, subj: "bio", marks: 3,
    q: "Why is the flow of energy in an ecosystem described as unidirectional, while nutrients are said to cycle? Explain the difference.",
    a: "ENERGY — UNIDIRECTIONAL FLOW:\nEnergy enters the ecosystem from the Sun and is captured by producers. At each transfer up the food chain, roughly 90% is lost as heat through respiration, movement, excretion and undigested matter.\n\nThat heat radiates into the environment and CANNOT be recaptured by any organism — no living thing can convert ambient heat back into chemical energy. So energy makes a one-way journey: Sun → producers → consumers → heat lost to space.\n\nThis is a direct consequence of the second law of thermodynamics, and it is why energy must be continuously resupplied by the Sun.\n\nNUTRIENTS — CYCLICAL FLOW:\nMatter such as carbon, nitrogen, phosphorus and water is not destroyed when organisms die. Decomposers break down dead bodies and waste into simple inorganic forms which return to the soil, water and air. Producers absorb them and build them into living tissue again.\n\nThe same carbon atom can pass through countless organisms over geological time.\n\nTHE ESSENTIAL DIFFERENCE:\nThe Earth is effectively a CLOSED system for matter (very little enters or leaves) but an OPEN system for energy (constant solar input, constant heat loss). Matter must therefore be recycled; energy cannot be.",
  },
];

// =====================================================================
// LONG ANSWERS (4 and 5 mark)
// =====================================================================
// Base bank coverage was thin at the tail: Ch 11, 12, 13 and 14 had only
// one long answer each, despite Electricity and Magnetic Effects together
// being among the heaviest-weighted physics chapters in the paper.

export const EXTRA_LONG_QA: QA[] = [
  {
    id: 5001, ch: 1, subj: "chem", marks: 5, pyq: true,
    q: "(a) What is meant by a balanced chemical equation and why must equations be balanced? (b) Balance: Fe₂O₃ + C → Fe + CO₂. (c) Explain, with one example each, how a combination reaction can be exothermic and a decomposition reaction can be endothermic.",
    a: "(a) BALANCED CHEMICAL EQUATION:\nAn equation in which the number of atoms of each element is equal on both the reactant and product sides.\n\nWHY BALANCING IS NECESSARY:\nThe Law of Conservation of Mass states that mass can neither be created nor destroyed in a chemical reaction. A chemical reaction only REARRANGES existing atoms into new combinations — it never makes new atoms or destroys existing ones.\n\nAn unbalanced equation would imply atoms appearing from nowhere or vanishing, which contradicts this law. Balancing is therefore not a formality; it is atom-by-atom bookkeeping that keeps the equation physically meaningful. It is also what makes quantitative calculations possible, since the coefficients give the actual ratios in which substances react.\n\n(b) BALANCING Fe₂O₃ + C → Fe + CO₂:\n\nStep 1 — Count atoms as written:\nLeft: Fe = 2, O = 3, C = 1\nRight: Fe = 1, O = 2, C = 1\n\nStep 2 — Balance Fe by placing 2 before Fe on the right:\nFe₂O₃ + C → 2Fe + CO₂\n\nStep 3 — Balance O. Left has 3, right has 2. LCM is 6, so use 2Fe₂O₃ (6 O) and 3CO₂ (6 O):\n2Fe₂O₃ + C → 2Fe + 3CO₂\n\nStep 4 — Rebalance Fe: left now has 4, so use 4Fe:\n2Fe₂O₃ + C → 4Fe + 3CO₂\n\nStep 5 — Balance C: right has 3, so use 3C:\n2Fe₂O₃ + 3C → 4Fe + 3CO₂\n\nFINAL CHECK: Fe = 4 both sides ✓ | O = 6 both sides ✓ | C = 3 both sides ✓\n\n(c) ENERGY CHANGES:\n\nEXOTHERMIC COMBINATION — Quicklime and water:\nCaO + H₂O → Ca(OH)₂ + heat\nThe container becomes noticeably hot. Energy is released because the bonds formed in the product are more stable (lower in energy) than those broken in the reactants, and the surplus escapes as heat.\n\nENDOTHERMIC DECOMPOSITION — Limestone:\nCaCO₃ →(heat) CaO + CO₂\nHeating must be continuous; remove the flame and the reaction stops. Energy is absorbed because breaking the strong bonds holding the compound together costs more energy than is recovered from the bonds formed.\n\nTHE GENERAL PATTERN:\nCombination reactions tend to be exothermic because forming bonds releases energy, while decomposition reactions tend to be endothermic because breaking bonds requires it. This is a tendency, not an absolute rule — hydrogen peroxide decomposing into water and oxygen is exothermic.",
  },
  {
    id: 5002, ch: 2, subj: "chem", marks: 5,
    q: "(a) What is the pH scale and what does it measure? (b) Explain three real-life situations where pH plays a decisive role, giving the chemistry in each. (c) Why is it dangerous for blood pH to shift even slightly?",
    a: "(a) THE pH SCALE:\npH is a numerical scale running from 0 to 14 that measures the concentration of hydrogen ions (H⁺) in a solution.\n\n• pH < 7 → acidic (excess H⁺)\n• pH = 7 → neutral ([H⁺] = [OH⁻])\n• pH > 7 → basic/alkaline (excess OH⁻)\n\nCRITICAL POINT: The scale is LOGARITHMIC. Each whole unit represents a tenfold change in H⁺ concentration. A solution of pH 3 is not slightly more acidic than pH 5 — it is 100 times more acidic. This is why small-sounding pH changes can have large effects.\n\n(b) THREE REAL-LIFE SITUATIONS:\n\n1. TOOTH DECAY\nThe enamel covering teeth is made of calcium phosphate, the hardest substance in the body. It does not dissolve in water, but it does corrode when the mouth's pH falls below 5.5.\n\nBacteria in the mouth break down trapped sugar and food particles, producing acids. Once pH drops past 5.5, enamel begins to demineralise and cavities form.\n\nRemedy: Toothpastes are mildly BASIC. Brushing neutralises the excess acid and brings the mouth pH back above the danger threshold. This also explains why brushing after sugary food matters more than brushing at a fixed time.\n\n2. SOIL pH AND AGRICULTURE\nMost crops grow well only within a narrow pH range near neutral. Outside it, plants cannot absorb certain minerals from the soil even when those minerals are present.\n\n• Acidic soil → treated with quicklime (CaO), slaked lime (Ca(OH)₂) or chalk to raise pH.\n• Alkaline soil → treated with organic matter or gypsum to lower pH.\n\nFarmers test soil pH before choosing a treatment, since adding the wrong one makes the problem worse.\n\n3. SELF-DEFENCE IN NATURE\nA bee sting injects an acidic fluid (containing methanoic acid), producing pain and irritation. Rubbing a mild base such as baking soda on the area neutralises the acid and relieves the pain.\n\nA nettle sting also injects methanoic acid, and the traditional remedy — rubbing a dock leaf on it — works on the same neutralisation principle.\n\n(c) WHY BLOOD pH IS SO CRITICAL:\nHuman blood is maintained between pH 7.35 and 7.45 — a remarkably narrow window.\n\nEnzymes, which catalyse essentially every reaction in the body, have precisely folded three-dimensional shapes held together partly by charge interactions. Changing the H⁺ concentration disturbs these charges and alters the enzyme's shape, so it no longer fits its substrate and stops working.\n\nBecause the scale is logarithmic, a drop from 7.4 to 7.0 — which looks small — actually means roughly a 2.5-fold rise in H⁺ concentration. This is enough to disrupt oxygen transport by haemoglobin, nerve signalling, and heart rhythm, and it can be fatal.\n\nThe body defends this range continuously using buffer systems in the blood, the lungs (by adjusting CO₂ exhaled) and the kidneys (by adjusting H⁺ excretion).",
  },
  {
    id: 5003, ch: 3, subj: "chem", marks: 5,
    q: "(a) Explain, with equations, the three main steps in extracting a metal from its ore. (b) Why is the extraction method different for metals at the top, middle and bottom of the reactivity series? (c) Describe how corrosion of iron is prevented by two different methods, explaining the principle of each.",
    a: "(a) THE THREE MAIN STEPS:\n\nSTEP 1 — CONCENTRATION OF THE ORE\nOre as mined contains large amounts of rocky impurity called gangue. This must be removed first, by methods chosen to suit the physical difference between ore and gangue — washing, froth flotation, magnetic separation, or leaching.\n\nSTEP 2 — CONVERSION TO THE OXIDE\nThis step exists because oxides are the form that can actually be reduced to metal.\n\nRoasting (for sulphide ores, in excess air):\n2ZnS + 3O₂ → 2ZnO + 2SO₂\n\nCalcination (for carbonate ores, in limited air):\nZnCO₃ → ZnO + CO₂\n\nSTEP 3 — REDUCTION OF THE OXIDE TO METAL\nZnO + C → Zn + CO\n\nThis is followed by REFINING, usually electrolytic, to obtain metal of high purity.\n\n(b) WHY THE METHOD DEPENDS ON REACTIVITY:\nThe reactivity series is essentially a ranking of how tightly a metal holds on to its electrons — and therefore how hard it is to pull its compound apart.\n\nTOP OF THE SERIES (K, Na, Ca, Mg, Al):\nThese hold their oxygen or chlorine extremely strongly. No chemical reducing agent — including carbon — is powerful enough, because carbon itself is lower in the series and cannot take oxygen away from a metal that wants it more.\nMethod: ELECTROLYTIC REDUCTION, which supplies electrons directly.\n2Al₂O₃ →(electrolysis, molten with cryolite) 4Al + 3O₂\n\nMIDDLE OF THE SERIES (Zn, Fe, Pb):\nThese are held less strongly, and carbon — being above them in reducing power at high temperature — can strip the oxygen away.\nMethod: REDUCTION WITH CARBON or carbon monoxide.\nFe₂O₃ + 3CO → 2Fe + 3CO₂\n\nBOTTOM OF THE SERIES (Cu, Hg, Ag, Au):\nThese barely form compounds at all, so they are often found native. Where they do form compounds, simple heating suffices.\n2HgS + 3O₂ → 2HgO + 2SO₂, then 2HgO →(heat) 2Hg + O₂\n\nTHE UNIFYING IDEA: The extraction method is not an arbitrary industrial choice — it is read directly off the metal's position in the reactivity series.\n\n(c) TWO METHODS OF PREVENTING CORROSION:\n\nMETHOD 1 — GALVANISATION (sacrificial protection)\nIron is coated with a thin layer of zinc.\n\nPrinciple: Zinc is MORE reactive than iron, so it oxidises preferentially. The crucial advantage over ordinary paint is that even if the coating is scratched and the iron is exposed, the zinc continues to corrode in preference to the iron. The protection is electrochemical, not merely a physical barrier — which is why galvanised iron survives scratches that would let a painted surface rust.\n\nMETHOD 2 — ALLOYING (stainless steel)\nIron is mixed with chromium and nickel.\n\nPrinciple: Chromium forms an extremely thin, tough, transparent and self-repairing layer of chromium oxide on the surface. This layer is impermeable and adheres firmly, sealing the metal beneath. If it is damaged, exposed chromium immediately reforms it.\n\nThe contrast with rust is instructive: Fe₂O₃·xH₂O is flaky and porous, so it falls off and exposes fresh iron, allowing corrosion to continue indefinitely. Chromium oxide and aluminium oxide are protective for exactly the opposite reason.\n\nOTHER METHODS: painting, oiling, greasing (physical barriers) and electroplating (a barrier plus, in some cases, sacrificial action).",
  },
  {
    id: 5004, ch: 4, subj: "chem", marks: 5,
    q: "(a) Explain the structure of a soap molecule and describe how it cleans a greasy cloth. (b) Why do soaps fail in hard water, and how do detergents overcome this? (c) Discuss one environmental trade-off involved in using detergents.",
    a: "(a) STRUCTURE AND CLEANSING ACTION:\n\nSTRUCTURE OF A SOAP MOLECULE:\nA soap molecule (for example sodium stearate, C₁₇H₃₅COONa) has two chemically opposite ends:\n\n• A long HYDROCARBON TAIL — non-polar, water-repelling (hydrophobic), but readily dissolves in oil and grease.\n• An ionic HEAD (–COO⁻Na⁺) — polar, strongly attracted to water (hydrophilic), but will not mix with oil.\n\nThis dual nature is the whole basis of cleaning. Grease will not dissolve in water, and water alone cannot lift it off cloth. The soap molecule is able to grip both at once.\n\nCLEANSING ACTION — STEP BY STEP:\n1. When soap is dissolved and the cloth is agitated, the hydrocarbon tails penetrate the grease droplet while the ionic heads stay in the surrounding water.\n\n2. Many soap molecules surround one droplet, forming a spherical cluster called a MICELLE — grease trapped at the centre, ionic heads facing outward.\n\n3. Because the outside of every micelle is negatively charged, micelles REPEL one another and stay dispersed rather than clumping back together. The dirt is now suspended in the water as a colloid.\n\n4. Agitation (rubbing, scrubbing, the washing machine drum) is essential — it dislodges the grease from the fabric so micelles can form around it.\n\n5. Rinsing carries the micelles away, taking the grease with them.\n\n(b) HARD WATER AND DETERGENTS:\n\nWHY SOAP FAILS IN HARD WATER:\nHard water contains dissolved calcium and magnesium ions. Soap reacts with them:\n2C₁₇H₃₅COONa + Ca²⁺ → (C₁₇H₃₅COO)₂Ca↓ + 2Na⁺\n\nThe calcium and magnesium salts of fatty acids are INSOLUBLE. They precipitate out as a greyish curd called SCUM, which:\n• wastes soap, since it is consumed forming scum instead of micelles,\n• sticks to fabric and skin, leaving a residue,\n• produces very little lather until all the Ca²⁺ and Mg²⁺ have been used up.\n\nHOW DETERGENTS SOLVE IT:\nDetergents are sodium salts of long-chain benzene sulphonic acids or alkyl sulphates — the ionic head is –SO₃⁻Na⁺ rather than –COO⁻Na⁺.\n\nThe calcium and magnesium salts of sulphonic acids REMAIN SOLUBLE in water. No precipitate forms, so detergent molecules stay available to build micelles and cleaning proceeds normally even in hard water.\n\nThe cleansing MECHANISM is identical — same tail, same micelle formation. Only the head group has been changed, and that single change solves the hard-water problem.\n\n(c) THE ENVIRONMENTAL TRADE-OFF:\n\nSoaps are made from natural fats and oils and are readily broken down by microorganisms in water — they are biodegradable.\n\nMany early synthetic detergents had highly BRANCHED hydrocarbon chains. Bacteria could not break these down efficiently, so detergent residues persisted in rivers and lakes, producing long-lasting foam, reducing oxygen transfer at the water surface, and harming aquatic life.\n\nDetergents also commonly contain PHOSPHATES as builders. Phosphates act as nutrients in water bodies and trigger EUTROPHICATION — explosive algal growth that blocks light, then dies and decomposes, consuming dissolved oxygen and suffocating fish.\n\nTHE BALANCED VIEW:\nDetergents genuinely solved a real problem, and modern formulations increasingly use straight-chain, biodegradable molecules and reduced phosphate content. But the episode illustrates a recurring pattern in applied chemistry: a solution optimised for one property (hard-water performance) introduced a cost along a dimension nobody was measuring at the time (biodegradability). Judging a technology requires looking at its whole life cycle, not only the problem it was designed to solve.",
  },
  {
    id: 5005, ch: 6, subj: "bio", marks: 5, pyq: true,
    q: "(a) Describe the structure of the human heart and trace the complete path of blood through it. (b) Explain why mammals and birds require a four-chambered heart. (c) What are the differences between arteries, veins and capillaries?",
    a: "(a) STRUCTURE AND BLOOD PATH:\n\nSTRUCTURE:\nThe human heart is a muscular organ with FOUR chambers:\n• Two upper chambers — the right and left ATRIA (thin-walled, receiving chambers)\n• Two lower chambers — the right and left VENTRICLES (thick-walled, pumping chambers)\n\nThe left ventricle has the thickest wall of all, since it must pump blood to the entire body, whereas the right ventricle pumps only to the nearby lungs.\n\nVALVES prevent backflow: between each atrium and ventricle, and at the exit of each ventricle. The familiar 'lub-dub' heartbeat is the sound of these valves closing.\n\nA muscular wall called the SEPTUM completely separates the right side from the left, so oxygenated and deoxygenated blood never mix.\n\nPATH OF BLOOD — THE COMPLETE CIRCUIT:\n\nPULMONARY CIRCULATION:\n1. Deoxygenated blood from the body enters the RIGHT ATRIUM through the vena cava.\n2. It passes into the RIGHT VENTRICLE.\n3. The right ventricle pumps it through the PULMONARY ARTERY to the LUNGS.\n4. In the lungs, CO₂ is released and O₂ is absorbed.\n5. Oxygenated blood returns through the PULMONARY VEINS to the LEFT ATRIUM.\n\nSYSTEMIC CIRCULATION:\n6. Blood passes into the LEFT VENTRICLE.\n7. The left ventricle pumps it through the AORTA to the whole body.\n8. Tissues absorb O₂ and release CO₂.\n9. Deoxygenated blood returns via the vena cava to the right atrium, completing the circuit.\n\nNOTE THE EXCEPTION: The pulmonary artery is the one artery carrying deoxygenated blood, and the pulmonary veins are the one set of veins carrying oxygenated blood. Arteries and veins are defined by DIRECTION relative to the heart, not by oxygen content.\n\n(b) WHY A FOUR-CHAMBERED HEART:\n\nThe blood passes through the heart TWICE for each complete circuit of the body — this is DOUBLE CIRCULATION.\n\nBirds and mammals are WARM-BLOODED: they maintain a constant body temperature regardless of the environment. Doing so requires a consistently high metabolic rate, which in turn requires a large and steady oxygen supply to every tissue.\n\nComplete separation of the two blood streams achieves this in two ways:\n\n1. MAXIMUM OXYGEN CONTENT — tissues receive fully oxygenated blood with no dilution by returning deoxygenated blood.\n\n2. INDEPENDENT PRESSURE CONTROL — the systemic circuit can be run at high pressure to reach the whole body, while the pulmonary circuit runs at lower pressure, protecting the delicate lung capillaries. A single pump could not do both.\n\nBY CONTRAST:\n• FISH have a two-chambered heart and single circulation. Blood passes through the heart once per circuit and travels to the body directly from the gills at reduced pressure. This is adequate because fish are cold-blooded and have lower oxygen demands.\n• AMPHIBIANS AND MOST REPTILES have three chambers, where some mixing occurs. This is a workable compromise for animals that do not need to maintain body temperature.\n\nTHE PRINCIPLE: The number of heart chambers across the animal kingdom tracks metabolic demand — it is a design response to how much oxygen the body needs per unit time.\n\n(c) ARTERIES, VEINS AND CAPILLARIES:\n\nARTERIES:\n• Carry blood AWAY from the heart\n• Thick, muscular, highly elastic walls to withstand high pumping pressure\n• Narrow lumen (internal cavity)\n• No valves (except at the exit of the heart) — high pressure keeps blood moving forward\n• Usually carry oxygenated blood (exception: pulmonary artery)\n\nVEINS:\n• Carry blood TOWARDS the heart\n• Thin walls with less muscle and elastic tissue, since pressure is low\n• Wide lumen\n• VALVES present along their length to prevent backflow — essential because blood in the legs must travel upward against gravity at low pressure\n• Usually carry deoxygenated blood (exception: pulmonary veins)\n\nCAPILLARIES:\n• Connect arteries to veins and form dense networks within tissues\n• Walls just ONE cell thick — the thinnest possible barrier\n• This extreme thinness is the entire point: it allows rapid diffusion of oxygen, carbon dioxide, nutrients and wastes between blood and body cells\n• So narrow that red blood cells often pass through in single file, which maximises contact with the wall and slows flow for efficient exchange\n\nTHE FUNCTIONAL LOGIC: Arteries are built for pressure, veins for return flow against gravity, and capillaries for exchange. Each structure follows directly from the job it performs.",
  },
  {
    id: 5006, ch: 7, subj: "bio", marks: 5,
    q: "(a) Compare nervous and hormonal coordination in humans on at least four points. (b) Explain with examples how plants coordinate without any nervous system. (c) Why does the body need both systems rather than just one?",
    a: "(a) NERVOUS VERSUS HORMONAL COORDINATION:\n\n1. NATURE OF THE SIGNAL\n• Nervous: An electrical impulse travelling along neurons, becoming chemical only briefly at synapses.\n• Hormonal: A chemical messenger released into the bloodstream.\n\n2. SPEED OF TRANSMISSION\n• Nervous: Extremely fast — milliseconds. A reflex completes before you consciously register the stimulus.\n• Hormonal: Slow — seconds to hours, since hormones must be secreted, circulate, and reach target cells.\n\n3. DURATION OF EFFECT\n• Nervous: Very brief. The impulse passes and the effect ends almost immediately.\n• Hormonal: Long-lasting — from minutes to years. Growth hormone and the hormones driving puberty act over a substantial part of a lifetime.\n\n4. TARGET AND SPECIFICITY\n• Nervous: Precisely targeted. The impulse travels a defined neural pathway to a specific muscle or gland.\n• Hormonal: Broadcast through the whole bloodstream, but only cells carrying the matching receptor respond. Thyroxine, for example, reaches every cell yet affects metabolism throughout the body.\n\n5. TRANSMISSION ROUTE\n• Nervous: Along neurons.\n• Hormonal: Through blood.\n\n(b) COORDINATION IN PLANTS:\n\nPlants have no neurons, no brain and no muscles, yet they coordinate their responses effectively — entirely through CHEMICALS and GROWTH.\n\nMECHANISM 1 — TROPIC MOVEMENTS (directional, growth-based)\n\nPhototropism: A shoot bends towards light. The mechanism is unequal distribution of the hormone AUXIN — it accumulates on the shaded side, where it causes cells to elongate more. The uneven elongation bends the shoot toward the light. Note that no cell moves; the plant simply grows unevenly.\n\nGeotropism: Roots grow downward (positive geotropism) and shoots upward (negative geotropism) in response to gravity.\n\nHydrotropism: Roots grow towards a water source.\n\nChemotropism: The pollen tube grows down the style towards the ovule.\n\nMECHANISM 2 — NASTIC MOVEMENTS (non-directional, turgor-based)\n\nThe touch-me-not plant (Mimosa pudica) folds its leaves within seconds of being touched. Here nothing grows — the plant rapidly moves WATER out of specific cells at the base of each leaflet, which lose turgor and collapse, folding the leaf.\n\nThis is a genuinely fast plant response, and it works by changing cell water content rather than by growth.\n\nPLANT HORMONES:\n• Auxin — cell elongation, phototropism\n• Gibberellin — stem growth, seed germination\n• Cytokinin — cell division; abundant in rapidly dividing regions such as fruits and seeds\n• Abscisic acid — the inhibitor: promotes dormancy, closes stomata under water stress, causes wilting and leaf fall\n\n(c) WHY BOTH SYSTEMS ARE NEEDED:\n\nThe two systems solve the same problem — coordinating the body — but on completely different timescales, and neither could do the other's job.\n\nWHY THE NERVOUS SYSTEM ALONE IS INSUFFICIENT:\nNerve impulses are fast but fleeting. They cannot sustain a process lasting weeks or years. Growth from childhood to adulthood, the changes of puberty, and the maintenance of a steady metabolic rate all require a signal that persists — something no burst of electrical impulses can provide.\n\nThe nervous system also reaches only tissues it is wired to. Regulating every cell's metabolic rate simultaneously would require an impossible density of neurons; a hormone in the bloodstream reaches all of them automatically.\n\nWHY HORMONES ALONE ARE INSUFFICIENT:\nHormones are far too slow for emergencies. Withdrawing your hand from a hot object must happen in milliseconds. A hormonal signal would need seconds at minimum to be secreted, circulate and act — by which time serious injury would already have occurred.\n\nHormones also lack fine spatial precision. Signalling one specific muscle to contract by a precise amount — as when writing or catching a ball — needs targeted neural wiring, not a chemical broadcast.\n\nHOW THEY WORK TOGETHER:\nAdrenaline is a good illustration. A frightening sight is detected and processed by the NERVOUS system in milliseconds, which signals the adrenal gland to release adrenaline. The HORMONE then sustains the raised heart rate, breathing rate and blood glucose for minutes afterwards.\n\nFast detection and slow sustained response — each system doing what it is built for.",
  },
  {
    id: 5007, ch: 9, subj: "bio", marks: 5,
    q: "(a) Explain how sex is determined in human beings, using a cross diagram. (b) Why is it scientifically incorrect to blame the mother for the sex of a child? (c) Explain how speciation can occur in a population, listing the factors involved.",
    a: "(a) SEX DETERMINATION IN HUMANS:\n\nHumans have 23 pairs of chromosomes — 22 pairs of AUTOSOMES plus one pair of SEX CHROMOSOMES.\n\n• FEMALES have two X chromosomes (XX)\n• MALES have one X and one Y chromosome (XY)\n\nGAMETE FORMATION:\nDuring meiosis, chromosome pairs separate and each gamete receives one of each pair.\n\nMOTHER (XX): Both chromosomes are X, so EVERY egg she produces carries an X chromosome. There is no other possibility.\n\nFATHER (XY): The pair separates, so half his sperm carry X and half carry Y.\n\nTHE CROSS:\n\n                 Mother's eggs\n                   X        X\nFather's    X    [XX]     [XX]     → daughters\nsperm       Y    [XY]     [XY]     → sons\n\nRESULT: 2 XX : 2 XY = 50% girls : 50% boys.\n\nThe probability is 50:50 for EACH pregnancy independently. Having three daughters already does not make a son more likely next time — each fertilisation is an independent event, much like each toss of a coin.\n\n(b) WHY THE MOTHER CANNOT DETERMINE THE CHILD'S SEX:\n\nThis follows directly from the biology above and is worth stating plainly.\n\nThe mother is XX. Every egg she can possibly produce carries an X chromosome. She has no Y chromosome anywhere in her body to contribute, so she cannot influence the outcome in either direction — whatever she contributes is always X.\n\nThe sex of the child depends entirely on whether the fertilising SPERM carried an X or a Y. That is determined by the father's chromosomes and by which of millions of sperm reaches the egg first.\n\nTHE SOCIAL SIGNIFICANCE:\nIn many societies, women have been blamed, mistreated, or abandoned for 'failing' to produce a son. This is not merely unjust — it is factually impossible. The biology is unambiguous, and NCERT includes this point deliberately, because a scientific fact here directly contradicts a harmful social belief.\n\n(c) SPECIATION:\n\nSpeciation is the process by which one species splits into two, such that members of the two groups can no longer interbreed to produce fertile offspring.\n\nHOW IT HAPPENS — A WORKED SEQUENCE:\n\n1. A single interbreeding population exists, with normal variation among individuals.\n\n2. GEOGRAPHICAL ISOLATION occurs — a river changes course, a mountain range rises, a population colonises a distant island. The population is now split into two sub-populations that no longer interbreed.\n\n3. Gene flow between them STOPS. Any new variation arising in one group can no longer spread to the other.\n\n4. Each sub-population accumulates its own changes:\n   • New MUTATIONS arise randomly and independently in each group.\n   • GENETIC DRIFT causes random changes in gene frequency, which has a particularly strong effect in small populations.\n   • NATURAL SELECTION acts differently on each group, since the two environments are not identical.\n\n5. Over many generations the two groups diverge substantially in their genetic makeup.\n\n6. Eventually the differences are great enough that even if the barrier is removed and the groups meet again, they can no longer interbreed successfully. Speciation is complete.\n\nFACTORS INVOLVED:\n• Geographical isolation (the usual trigger)\n• Genetic drift (random change, strongest in small populations)\n• Natural selection under differing environmental pressures\n• Accumulation of mutations over time\n• Reproductive isolation as the end result — including differences in mating behaviour, breeding season, or chromosome incompatibility\n\nAN IMPORTANT LIMITATION:\nGeographical isolation cannot cause speciation in a self-pollinating plant population, because such plants do not depend on exchanging genetic material with others in the first place. The barrier would block something that was not happening anyway. This exception is worth remembering, since it tests whether the mechanism is understood rather than memorised.",
  },
  {
    id: 5008, ch: 11, subj: "phy", marks: 5,
    q: "(a) With the help of a description of the ray diagram, explain myopia and hypermetropia — their causes and corrections. (b) A student has a far point of 80 cm and a near point of 40 cm. What lenses does he need? (c) Explain why the eye lens is made of flexible material rather than glass.",
    a: "(a) THE TWO DEFECTS:\n\nMYOPIA (SHORT-SIGHTEDNESS)\n\nSymptom: Distant objects appear blurred; near objects are seen clearly.\n\nWhat happens optically: Light from a distant object is converged too strongly and comes to a focus BEFORE reaching the retina. The rays then diverge again, so by the time they land on the retina the image is a blur circle rather than a point.\n\nCauses:\n1. The eyeball has grown too long from front to back, so the retina sits behind the focal point.\n2. The eye lens has excessive curvature, so its converging power is too high.\n\nCorrection: A CONCAVE (diverging) lens of NEGATIVE power.\n\nHow it works: The concave lens diverges the incoming parallel rays slightly before they enter the eye. The eye's own lens then converges them, but starting from a diverging beam the focus now falls further back — exactly on the retina.\n\nRay diagram description: Parallel rays from infinity strike the concave lens and spread apart. They now appear to come from the person's FAR POINT. The eye can focus rays from its far point, so a sharp image forms on the retina.\n\nHYPERMETROPIA (LONG-SIGHTEDNESS)\n\nSymptom: Near objects appear blurred; distant objects are seen clearly.\n\nWhat happens optically: Light from a nearby object is not converged strongly enough, so it would come to a focus BEHIND the retina. The retina intercepts the rays before they have converged, again producing a blur.\n\nCauses:\n1. The eyeball is too short from front to back.\n2. The eye lens is too flat, so its converging power is insufficient.\n\nCorrection: A CONVEX (converging) lens of POSITIVE power.\n\nHow it works: The convex lens adds the missing convergence before light enters the eye, bringing the focus forward onto the retina.\n\nRay diagram description: Rays from an object at 25 cm strike the convex lens and converge. They now appear to come from the person's NEAR POINT, which the eye can focus, so a sharp image forms on the retina.\n\n(b) THE STUDENT'S PRESCRIPTION:\n\nThis student has BOTH defects — a far point that is not at infinity and a near point beyond the normal 25 cm. He therefore needs BIFOCAL lenses.\n\nFOR DISTANT VISION (correcting myopia):\nThe lens must image an object at infinity at his far point of 80 cm.\nu = infinity, v = −80 cm = −0.8 m\n1/f = 1/v − 1/u = 1/(−0.8) − 0 = −1.25\nP = −1.25 D → a CONCAVE lens.\n\nFOR NEAR VISION (correcting hypermetropia):\nThe lens must image an object at 25 cm at his near point of 40 cm.\nu = −25 cm, v = −40 cm\n1/f = 1/(−40) − 1/(−25) = −1/40 + 1/25\nLCM of 40 and 25 is 200:\n1/f = −5/200 + 8/200 = 3/200\nf = 200/3 cm = 66.7 cm = 0.667 m\nP = 1/0.667 = +1.5 D → a CONVEX lens.\n\nPRESCRIPTION: Bifocals with the upper portion −1.25 D (concave, for distance) and the lower portion +1.5 D (convex, for reading). The reading segment is placed at the bottom because the eyes naturally look downward when reading.\n\n(c) WHY THE EYE LENS IS FLEXIBLE:\n\nA camera focuses by MOVING its lens closer to or further from the film or sensor, changing the image distance while the lens itself stays the same.\n\nThe eye cannot do this. The retina is fixed to the back of the eyeball, so the image distance is permanently set at roughly 2.5 cm. The focal length must therefore change instead.\n\nThis is only possible with a flexible lens:\n• For NEAR objects, the ciliary muscles CONTRACT. This releases tension on the suspensory ligaments, allowing the lens to bulge into a more convex shape. Focal length decreases, power increases.\n• For DISTANT objects, the ciliary muscles RELAX. The ligaments pull the lens flatter. Focal length increases, power decreases.\n\nThis ability is called the POWER OF ACCOMMODATION, and a rigid glass lens could not provide it — the eye would be permanently focused at one distance only.\n\nTHE CONSEQUENCE OF AGEING:\nWith age the lens gradually hardens and the ciliary muscles weaken. The lens can no longer bulge sufficiently for close focus, so the near point recedes — reading material must be held further and further away. This is PRESBYOPIA.\n\nIt is important to note that presbyopia has a different cause from hypermetropia: hypermetropia is a problem of eyeball or lens SHAPE, while presbyopia is a loss of FLEXIBILITY. This is why presbyopia can occur in someone who was myopic all their life, leaving them needing bifocals — a correction for each problem.",
  },
  {
    id: 5009, ch: 12, subj: "phy", marks: 5, pyq: true,
    q: "(a) State Ohm's law and describe an experiment to verify it. (b) Draw (describe) and explain the V–I graph for an ohmic conductor. (c) Explain why household appliances are connected in parallel and not in series, using at least three arguments.",
    a: "(a) OHM'S LAW AND ITS VERIFICATION:\n\nSTATEMENT:\nThe potential difference across the ends of a conductor is directly proportional to the current flowing through it, provided the temperature and other physical conditions remain constant.\n\nV ∝ I, therefore V = IR, where R is the resistance in ohms (Ω).\n\nEXPERIMENT TO VERIFY:\n\nApparatus: A nichrome wire (the resistor under test), a battery of several cells, an ammeter, a voltmeter, a plug key, and connecting wires.\n\nCircuit connections:\n• The resistance wire, ammeter, battery and key in SERIES (an ammeter must carry the full current, and it has very low resistance so as not to disturb the circuit).\n• The voltmeter in PARALLEL across the resistance wire (it must measure the potential difference across it, and has very high resistance so it draws almost no current).\n\nProcedure:\n1. Close the key with one cell in the circuit. Record the ammeter reading (I) and the voltmeter reading (V).\n2. Repeat with two cells, three cells, and four cells, recording I and V each time.\n3. Calculate the ratio V/I for every reading.\n\nOBSERVATION:\nAs more cells are added, both V and I increase — and the ratio V/I remains essentially CONSTANT across all readings.\n\nCONCLUSION:\nSince V/I is constant, V is directly proportional to I. Ohm's law is verified, and the constant value equals the resistance R of the wire.\n\nPRECAUTION: Readings must be taken quickly and the key opened between readings. Prolonged current flow heats the wire, and since resistance of a metal rises with temperature, the ratio would drift — the very condition Ohm's law excludes.\n\n(b) THE V–I GRAPH:\n\nDESCRIPTION:\nPlotting V on the y-axis against I on the x-axis gives a STRAIGHT LINE PASSING THROUGH THE ORIGIN.\n\nWHY IT IS A STRAIGHT LINE:\nV = IR is of the form y = mx, the equation of a straight line with gradient m and zero intercept.\n\nWHY IT PASSES THROUGH THE ORIGIN:\nWhen V = 0 there is no driving force, so I = 0. There can be no current without a potential difference.\n\nWHAT THE SLOPE MEANS:\nSlope = V/I = R, the resistance of the conductor.\n• A STEEPER line means larger resistance (more voltage needed per unit current).\n• A SHALLOWER line means smaller resistance.\n\nThis makes the graph a practical way of measuring resistance: plot several readings and take the gradient of the best-fit line, which averages out random errors in individual measurements.\n\nNON-OHMIC CONDUCTORS:\nMaterials such as semiconductor diodes, filament bulbs at high temperature, and electrolytes give CURVED V–I graphs. Their resistance is not constant, so Ohm's law does not describe them. Ohm's law is a useful description of certain materials under certain conditions, not a universal law of nature.\n\n(c) WHY HOUSEHOLD WIRING IS PARALLEL:\n\nARGUMENT 1 — EACH APPLIANCE RECEIVES THE FULL VOLTAGE\n\nIn a parallel circuit, every branch has the same potential difference across it — the full 220 V supply.\n\nThis matters because appliances are MANUFACTURED for a specific voltage. A bulb rated '100 W, 220 V' only produces 100 W of light at exactly 220 V.\n\nIn series, the supply voltage would divide between appliances. Running a bulb and a heater in series might give the bulb only 60 V — it would glow dimly and uselessly, and the heater would barely warm.\n\nWorse, the voltage each appliance received would change every time another appliance was switched on or off elsewhere in the house, since that alters the total resistance and hence the distribution.\n\nARGUMENT 2 — INDEPENDENT OPERATION\n\nIn series, the same current must pass through every component. If any one appliance fails or is switched off, the circuit breaks and EVERYTHING in the house stops working.\n\nThis would make normal life impossible — switching off a bedroom light would turn off the refrigerator, and one fused bulb would black out the entire house.\n\nIn parallel, each appliance has its own independent path. Switching off or failure in one branch leaves all others unaffected. This is also why each room can have its own switches.\n\nARGUMENT 3 — LOWER TOTAL RESISTANCE AND ADEQUATE CURRENT\n\nIn series, resistances ADD: R = R₁ + R₂ + R₃ + ... So each appliance added makes the total resistance larger and the current smaller, leaving every appliance progressively starved of power.\n\nIn parallel, total resistance is LESS than the smallest individual resistance. Each appliance draws exactly the current it needs (I = V/R for its own branch), independent of what else is connected.\n\nA FOURTH CONSIDERATION — SAFETY AND MAINTENANCE:\nParallel wiring allows a fuse or MCB to be placed in each individual circuit, so a fault in one appliance disconnects only that circuit. It also allows faulty appliances to be isolated and repaired without shutting down the rest of the house.\n\nTHE TRADE-OFF:\nParallel wiring draws more total current, which is precisely why household circuits need appropriately rated fuses and MCBs — and why plugging too many high-power appliances into one socket can overload the circuit and start a fire.",
  },
  {
    id: 5010, ch: 13, subj: "phy", marks: 5,
    q: "(a) Describe the construction and working of an electric motor, explaining the role of each component. (b) What is the function of the split-ring commutator? (c) Explain how an AC generator differs from a motor in both construction and energy conversion.",
    a: "(a) THE ELECTRIC MOTOR:\n\nPRINCIPLE:\nWhen a current-carrying conductor is placed in a magnetic field, it experiences a mechanical force (F = BIL sin θ), the direction of which is given by Fleming's Left-Hand Rule.\n\nCONSTRUCTION AND THE ROLE OF EACH PART:\n\n1. ARMATURE COIL (ABCD)\nA rectangular coil of insulated copper wire wound on a soft iron core. This is the part that rotates. The soft iron core concentrates the magnetic field lines through the coil, substantially increasing the force and therefore the torque.\n\n2. PERMANENT MAGNETS (N and S poles)\nThese provide a strong, uniform magnetic field in which the coil sits. The coil is positioned so that its sides AB and CD lie perpendicular to the field, since F = BIL sin θ is maximum at θ = 90°.\n\n3. SPLIT-RING COMMUTATOR (two half-rings, R₁ and R₂)\nA single metal ring cut into two halves, insulated from one another, each connected to one end of the coil. It rotates with the coil. Its function is explained in part (b).\n\n4. CARBON BRUSHES (B₁ and B₂)\nStationary contacts pressing against the commutator halves, connecting the rotating coil to the external battery. Carbon is chosen because it conducts well, is self-lubricating, and wears away in preference to the more expensive commutator — a cheap, replaceable sacrificial component.\n\n5. BATTERY\nSupplies the direct current through the brushes to the coil.\n\nWORKING — STEP BY STEP:\n\n1. Current enters through brush B₁, flows through the coil in the direction A → B → C → D, and leaves through B₂.\n\n2. Applying Fleming's Left-Hand Rule to arm AB, the force acts DOWNWARD. Applying it to arm CD, where the current direction is opposite, the force acts UPWARD.\n\n3. These two equal and opposite forces act on opposite sides of the axis, so they do not cancel — they form a COUPLE, producing a turning effect (torque). The coil rotates.\n\n4. After half a rotation, arm AB has moved to where CD was and vice versa. At this instant the commutator halves swap their contact with the brushes, reversing the current direction in the coil.\n\n5. Because the current has reversed just as the arms changed sides, the force on each arm is again in the direction that continues the same rotation. The coil keeps turning in one direction.\n\n(b) THE FUNCTION OF THE SPLIT-RING COMMUTATOR:\n\nThe commutator REVERSES THE DIRECTION OF CURRENT in the coil after every half rotation.\n\nWHY THIS IS ESSENTIAL:\n\nConsider what would happen with a plain continuous ring instead. The coil rotates half a turn. Arm AB is now on the side where CD used to be — but the current direction in the coil is unchanged, so the force on AB is now in the direction that pushes it BACK.\n\nThe torque would reverse every half turn, and the coil would simply oscillate back and forth about its starting position rather than rotate.\n\nBy reversing the current at exactly the moment the arms change sides, the commutator ensures the torque always acts the same way round. Rotation becomes continuous and unidirectional.\n\nA USEFUL WAY TO SEE IT: The commutator is an automatic mechanical switch, triggered by the rotation itself, with perfect timing built into its geometry. There is no separate timing mechanism — the same rotation that creates the problem also operates the solution.\n\n(c) THE AC GENERATOR — DIFFERENCES FROM THE MOTOR:\n\nENERGY CONVERSION — THE FUNDAMENTAL DIFFERENCE:\n• MOTOR: Electrical energy → Mechanical energy. Current is supplied; rotation is produced.\n• GENERATOR: Mechanical energy → Electrical energy. Rotation is supplied; current is produced.\n\nThey are the same device running in opposite directions, which is why their construction is so similar.\n\nDIFFERENCE IN PRINCIPLE:\n• MOTOR: Force on a current-carrying conductor in a magnetic field. Direction given by Fleming's LEFT-Hand Rule.\n• GENERATOR: Electromagnetic induction — a changing magnetic flux through the coil induces an EMF (Faraday's law). Direction given by Fleming's RIGHT-Hand Rule.\n\nThe existence of a matched left-hand and right-hand rule is a direct consequence of the two devices being inverses of each other.\n\nDIFFERENCE IN CONSTRUCTION — SLIP RINGS INSTEAD OF A SPLIT RING:\n\nThis is the key structural difference. An AC generator uses TWO SEPARATE COMPLETE RINGS (slip rings), each permanently connected to one end of the coil.\n\nBecause each end of the coil always stays connected to the same brush, no reversal is imposed on the output. The naturally alternating EMF produced by the rotating coil reaches the external circuit unchanged — hence ALTERNATING current.\n\n(A DC generator, by contrast, uses a split-ring commutator exactly like a motor, which flips the connections every half turn and converts the alternating EMF into a one-directional output.)\n\nWHY THE OUTPUT ALTERNATES:\nAs the coil rotates through one complete turn:\n• Coil in the plane parallel to the field → rate of flux change is maximum → EMF is maximum.\n• Coil perpendicular to the field → rate of flux change is momentarily zero → EMF is zero.\n• Continuing past this point, the arms have swapped sides relative to the field, so the induced EMF is in the OPPOSITE direction → EMF rises to maximum the other way.\n• Returning to the start, EMF passes through zero again.\n\nOne complete rotation therefore produces one full AC cycle: 0 → +max → 0 → −max → 0.\n\nIn India the generator turns 50 times per second, giving the standard 50 Hz supply frequency.\n\nA CLOSING OBSERVATION:\nThe entire electrical grid rests on this symmetry. Generators in power stations convert the mechanical energy of steam or falling water into electrical energy, and motors in homes and factories convert it back into mechanical energy. The same physics, running in both directions.",
  },
];
