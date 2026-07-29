// English track content for StudyHub — CBSE Class 10 (2026-27)
// First Flight (prose + poetry) + Footprints Without Feet (supplementary reader)
//
// IMPORTANT: All summaries, key points, MCQs and model answers are ORIGINAL
// analytical commentary ABOUT the chapters (themes, characters, settings,
// literary devices). No copyrighted poem or story text is reproduced.
// Model answers paraphrase and analyse — they do not copy the source.

export type EngBook = "First Flight" | "Footprints";
export type EngDiff = "easy" | "medium" | "hard";

export interface ENGChapter {
  id: number;
  num: number;
  title: string;
  subj: "english";
  book: EngBook;
  author: string;
  oneshot: string[];
  keypts: string[];
  formulas: ""; // English has no formulas; kept for type compatibility
  exam: string[];
}

export interface ENGMCQ {
  id: number;
  ch: number;
  subj: "english";
  diff: EngDiff;
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}

export interface ENGQA {
  id: number;
  ch: number;
  subj: "english";
  marks: 2 | 3 | 5;
  q: string;
  a: string;
}

// ---------------------------------------------------------------------------
// CHAPTERS (17)
// ---------------------------------------------------------------------------

export const ENG_CHAPTERS: ENGChapter[] = [
  {
    id: 1,
    num: 1,
    title: "A Letter to God",
    subj: "english",
    book: "First Flight",
    author: "G.L. Fuentes",
    oneshot: [
      "A poor farmer, Lencho, writes a letter to God asking for money after a hailstorm destroys his crops.",
      "The postmaster, moved by Lencho's faith, collects money from his staff and sends it to Lencho.",
      "Lencho, receiving less than he asked for, angrily writes again calling the postal employees 'a bunch of crooks'.",
      "The story contrasts Lencho's unshakeable faith with his suspicious, cynical view of fellow humans.",
    ],
    keypts: [
      "Theme: absolute faith vs human nature — Lencho trusts God completely but distrusts people.",
      "Character: Lencho — hardworking, optimistic, deeply religious, yet naive and quick to accuse.",
      "Setting: a solitary house in a valley; the hope of rain turning to despair with the hailstorm.",
      "Irony: Lencho's letter, meant for God, is answered by humans whom he then accuses of theft.",
      "The postmaster represents kindness and the desire to preserve a man's faith.",
      "Symbol: the letter itself stands for innocence, faith and the human need to believe.",
    ],
    formulas: "",
    exam: [
      "Quote the chapter title and author in your opening line to frame the answer.",
      "Use one clearly stated theme (faith/irony) and support with two story events.",
      "Mention Lencho's character traits with the postmaster's reaction as contrast.",
    ],
  },
  {
    id: 2,
    num: 2,
    title: "Nelson Mandela: Long Walk to Freedom",
    subj: "english",
    book: "First Flight",
    author: "Nelson Rolihlahla Mandela",
    oneshot: [
      "An autobiographical account of Mandela's inauguration as South Africa's first Black President (10 May 1994).",
      "Mandela recalls the long struggle against apartheid and the sacrifice of countless freedom fighters.",
      "He speaks of the 'twin obligations' — to one's family and to one's people and country.",
      "The chapter honours the courage of patriots who gave up their lives and freedom for equality.",
    ],
    keypts: [
      "Theme: the cost of freedom, racial equality, and the triumph of justice over oppression.",
      "Setting: the Union Buildings amphitheatre, Pretoria, on inauguration day, 10 May 1994.",
      "Concept: 'twin obligations' — duty to family vs duty to people and country.",
      "Mandela acknowledges that the oppressed are also robbed of their humanity by the oppressor.",
      "Symbols: the symbolic defeat of apartheid; rainbow gatherings of South Africans united.",
      "Tone: reflective, dignified, grateful to the martyrs of the struggle.",
    ],
    formulas: "",
    exam: [
      "Open by naming the chapter, author (Nelson Mandela) and the event (10 May 1994 inauguration).",
      "Explain 'twin obligations' with one example from Mandela's own life.",
      "Conclude by linking the victory to the broader theme of human dignity and equality.",
    ],
  },
  {
    id: 3,
    num: 3,
    title: "Two Stories About Flying",
    subj: "english",
    book: "First Flight",
    author: "Liam O'Flaherty & Frederick Forsyth",
    oneshot: [
      "'His First Flight': a young seagull overcomes its fear of flying and discovers its natural ability to soar.",
      "The young bird's family encourages it; hunger drives it to dive for fish and finally fly.",
      "'The Black Aeroplane': a pilot lost in storm clouds is guided safely by a mysterious black aeroplane.",
      "The stranger pilot and his plane vanish — leaving the narrator wondering who saved him.",
    ],
    keypts: [
      "Theme (Part 1): courage, self-confidence, and the role of family in overcoming fear.",
      "Theme (Part 2): mystery, hope, and the possibility of unseen help in dark moments.",
      "Character (Part 1): the young seagull — fearful at first, then triumphant after taking the plunge.",
      "Setting (Part 2): a stormy night sky over France, with limited fuel and a faulty radio.",
      "Both stories turn on a moment of decision: to leap, and to follow a stranger.",
      "Part 2 ends with an open question — was the guide real, imagined, or supernatural?",
    ],
    formulas: "",
    exam: [
      "State clearly which of the two stories you are answering about.",
      "For Part 1, trace the seagull's fear → hunger → flight as a cause-and-effect chain.",
      "For Part 2, focus on the contrast between the storm's danger and the calm guidance of the stranger.",
    ],
  },
  {
    id: 4,
    num: 4,
    title: "From the Diary of Anne Frank",
    subj: "english",
    book: "First Flight",
    author: "Anne Frank",
    oneshot: [
      "A young Jewish girl, Anne, records her thoughts in a diary she names 'Kitty'.",
      "She feels lonely despite a loving family and a crowd of friends; she longs for one true confidante.",
      "Anne reflects on school, her maths teacher Mr Keesing, and the punishment essays he gives her.",
      "Her witty third essay, about a talking duck, finally wins Mr Keesing's good humour.",
    ],
    keypts: [
      "Theme: loneliness, the need for self-expression, and the inner life of an adolescent.",
      "Character: Anne — intelligent, talkative, witty, sensitive, and unusually self-aware for her age.",
      "Relationship: the funny conflict with Mr Keesing over her 'chatterbox' habit, ending in mutual respect.",
      "Form: diary form gives an intimate, confessional first-person voice addressed to 'Kitty'.",
      "Historical backdrop: Jewish life under Nazi rule adds poignancy to her everyday worries.",
      "Tone: light and humorous on the surface, with an undertone of longing and seriousness.",
    ],
    formulas: "",
    exam: [
      "Mention the diary form and the address to 'Kitty' to show awareness of narrative technique.",
      "Pick ONE trait of Anne (wit/loneliness/sensitivity) and support with the Mr Keesing episode.",
      "End by linking the small school incident to her larger need to be truly understood.",
    ],
  },
  {
    id: 5,
    num: 5,
    title: "Glimpses of India",
    subj: "english",
    book: "First Flight",
    author: "Lucio Rodrigues, Lokesh Abrol & Arup Kumar Datta",
    oneshot: [
      "'A Baker from Goa': nostalgic memories of traditional Goan bakers (paders) and their daily bread.",
      "'Coorg': a description of the coffee land of Karnataka, its brave people and natural beauty.",
      "'Tea from Assam': two boys visit a tea garden and learn about tea's history and culture.",
      "Together the three sketches celebrate India's regional diversity and craftsmanship.",
    ],
    keypts: [
      "Theme: India's cultural and regional diversity through food, land and livelihood.",
      "Part 1 symbols: the bamboo staff, the musical jingling thud of the baker's entry, Portuguese legacy.",
      "Part 2: Coorg's forests, coffee estates, river Kaveri, and the martial Kodava people.",
      "Part 3: Assam's tea gardens, the legend of Bodhidharma, and tea as a global drink.",
      "Each sketch blends travel description with history and local custom.",
      "Tone: warm, appreciative, and proud of regional heritage.",
    ],
    formulas: "",
    exam: [
      "Name the specific part (Goa / Coorg / Assam) before answering — markers reward precision.",
      "Give at least one concrete detail (pader, Kaveri, Rajvir/Pranjol) to show you have read the text.",
      "Close with a sentence on India's diversity as the linking theme across all three parts.",
    ],
  },
  {
    id: 6,
    num: 6,
    title: "Mijbil the Otter",
    subj: "english",
    book: "First Flight",
    author: "Gavin Maxwell",
    oneshot: [
      "The author keeps an otter, Mijbil, brought to him from the marshes of Iraq.",
      "Mijbil is playful, curious and inventive — he loves water and games with balls and marbles.",
      "The challenging flight from Basra to London tests both author and otter.",
      "In London, Mijbil surprises locals who cannot identify what kind of animal he is.",
    ],
    keypts: [
      "Theme: the bond between humans and wild animals; companionship across species.",
      "Character: Mijbil — intelligent, mischievous, attached to Maxwell, fond of water play.",
      "Setting: the Tigris marshes near Basra, the airline journey, and a flat in London.",
      "Incidents: the bath-time joy, the damaged suitcase on the flight, the schoolchildren's guesses.",
      "Tone: affectionate, observant, lightly humorous at the otter's antics.",
      "Message: wild creatures can form deep bonds but they remain essentially wild.",
    ],
    formulas: "",
    exam: [
      "Open with Maxwell's name and where Mijbil came from (Iraq marshes).",
      "Use TWO behaviours (water-play, marble game, or flight chaos) to show Mijbil's character.",
      "End with the London schoolchildren's guesses to highlight people's ignorance of otters.",
    ],
  },
  {
    id: 7,
    num: 7,
    title: "Madam Rides the Bus",
    subj: "english",
    book: "First Flight",
    author: "Vallikkannan",
    oneshot: [
      "Eight-year-old Valli loves watching the bus that travels between her village and the nearby town.",
      "She saves small coins in secret to plan her very first bus ride — alone, without anyone knowing.",
      "On the ride she is delighted by the sights, but is shaken when she sees a dead cow by the road.",
      "She returns home quietly, hiding her fear and sadness, keeping her adventure to herself.",
    ],
    keypts: [
      "Theme: childhood curiosity, independence, and the loss of innocence.",
      "Character: Valliammai (Valli) — determined, resourceful, proud, and quietly mature for her age.",
      "Planning: she saves money, gathers information from neighbours, and times her ride carefully.",
      "Contrast: the joy of the outward journey vs the sobering sight of the dead cow on return.",
      "Symbol: the bus stands for the wider world that calls to a child's imagination.",
      "Tone: gentle, observant, building from wonder to a quietly sad realisation.",
    ],
    formulas: "",
    exam: [
      "Identify Valli by name and age (eight) and state her aim (a solo bus ride).",
      "Use the saving-of-money detail to show planning and the dead-cow incident to show growth.",
      "Close on the theme of innocence meeting the reality of death.",
    ],
  },
  {
    id: 8,
    num: 8,
    title: "The Sermon at Benares",
    subj: "english",
    book: "First Flight",
    author: "Betty Renshaw",
    oneshot: [
      "After leaving his royal life, Siddhartha Gautama seeks wisdom and finally attains enlightenment under the Bodhi tree.",
      "He delivers his first sermon at Benares, teaching the nature of suffering and the path to peace.",
      "The sermon centres on the story of Kisa Gotami, who grieves for her dead son.",
      "Kisa Gotami learns, through a search for mustard seeds from a house untouched by death, that death spares no one.",
    ],
    keypts: [
      "Theme: the universality of death and the path to overcoming sorrow through understanding.",
      "The Buddha's teaching: life is short, uncertain and full of suffering; wisdom brings peace.",
      "Kisa Gotami's lesson: every household has lost someone — grief is shared, not private.",
      "Symbol: the mustard seed — small, ordinary, and impossible to find 'death-free' in any home.",
      "Setting: the Deer Park at Sarnath near Benares, where the Buddha first taught.",
      "Message: acceptance of death frees the mind from endless grief.",
    ],
    formulas: "",
    exam: [
      "Name the Buddha, the place (Benares/Sarnath) and the listener (Kisa Gotami).",
      "Tell the mustard-seed episode as the core example — it is the heart of the chapter.",
      "End with the Buddha's teaching that those who accept death find peace.",
    ],
  },
  {
    id: 9,
    num: 9,
    title: "The Proposal",
    subj: "english",
    book: "First Flight",
    author: "Anton Chekhov",
    oneshot: [
      "A one-act comedy in which Lomov visits neighbour Chubukov to propose marriage to his daughter Natalya.",
      "Before Lomov can finish proposing, the couple quarrels fiercely over the ownership of a piece of land (Oxen Meadows).",
      "A second quarrel breaks out over the superiority of their hunting dogs, Guess and Squeezer.",
      "Chubukov finally forces the two flustered neighbours together and blesses their 'engagement'.",
    ],
    keypts: [
      "Theme: the absurdity of Russian matchmaking, petty quarrels and the comedy of human ego.",
      "Characters: Lomov — nervous, hypochondriac, easily provoked; Natalya — sharp-tongued, proud; Chubukov — scheming, eager to marry off his daughter.",
      "Conflict: trivial disputes (land, dogs) overshadow the serious matter of marriage.",
      "Dramatic form: a fast-paced one-act play built on rapid dialogue and comic timing.",
      "Humour: rooted in exaggeration, repetition and the contrast between big claims and small issues.",
      "Message: behind the comedy lies a satire on property-obsessed society and shallow relationships.",
    ],
    formulas: "",
    exam: [
      "Mention that it is a one-act play by Chekhov — form matters for board marking.",
      "Pick ONE quarrel (Oxen Meadows or the dogs) and explain how it drives the comedy.",
      "End on Chekhov's satire: marriage reduced to a property deal.",
    ],
  },
  {
    id: 10,
    num: 10,
    title: "First Flight — Poetry (10 Poems)",
    subj: "english",
    book: "First Flight",
    author: "Various Poets",
    oneshot: [
      "'Dust of Snow' (Frost): a small moment — a crow shaking snow from a hemlock tree — lifts the poet's mood.",
      "'Fire and Ice' (Frost): the world may end in fire (desire) or ice (hatred) — both powerful enough to destroy.",
      "'A Tiger in the Zoo' (Leslie Norris): contrasts a caged tiger's helpless pacing with its fierce life in the wild.",
      "'How to Tell Wild Animals' (Carolyn Wells): a humorous list-poem offering silly ways to identify wild beasts.",
      "'The Ball Poem' (John Berryman): a boy's first loss — his ball — teaches him about loss and responsibility.",
      "'Amanda!' (Robin Klein): a child nagged by her mother escapes into daydreams of freedom as a mermaid, an orphan and Rapunzel.",
      "'The Trees' (Adrienne Rich): trees that have been kept indoors strain to break free and return to the forest.",
      "'Fog' (Carl Sandburg): a short poem comparing fog to a silent cat that comes, sits, and moves on.",
      "'The Tale of Custard the Dragon' (Ogden Nash): a comic ballad where the 'cowardly' dragon is the one who saves the day.",
      "'For Anne Gregory' (W.B. Yeats): only God, the poem says, loves us for ourselves alone — not for our looks.",
    ],
    keypts: [
      "Recurring themes: nature's quiet power, freedom vs captivity, and the inner life of children.",
      "Literary devices: metaphor (fire/ice, fog/cat, dragon), contrast (zoo/wild), repetition, and rhyme.",
      "'Dust of Snow' uses a 'crow' and 'hemlock' — symbols usually of ill omen — to bring unexpected joy.",
      "'A Tiger in the Zoo' contrasts the silent rage of the caged animal with its free life in the jungle.",
      "'The Ball Poem' turns a tiny loss into a lesson on the inevitability of loss in life.",
      "'Amanda!' shows how constant nagging crushes a child's spirit and fuels escapism.",
      "'For Anne Gregory' makes a philosophical point: true love is rare, for most love is tied to appearance.",
    ],
    formulas: "",
    exam: [
      "Always name the poem and poet in your first sentence.",
      "Quote device + meaning — e.g., 'fog as cat = silent, unhurried movement'.",
      "For value-based questions, link the poem's message to a real-life situation in one line.",
    ],
  },
  {
    id: 11,
    num: 11,
    title: "A Triumph of Surgery",
    subj: "english",
    book: "Footprints",
    author: "James Herriot",
    oneshot: [
      "Mrs Pumphrey, a rich and over-indulgent dog owner, brings her pampered Tricki to the vet, terribly ill from overeating.",
      "The narrator, Dr Herriot, takes Tricki into his hospital and puts him on a strict, plain diet.",
      "Surrounded by other dogs, Tricki recovers through play and proper food, becoming active and fit.",
      "Mrs Pumphrey, believing Tricki is dying, sends luxuries — but the dog returns home healthy, a 'triumph of surgery'.",
    ],
    keypts: [
      "Theme: the dangers of over-indulgence, and how sensible care beats foolish pampering.",
      "Characters: Mrs Pumphrey — affectionate but irresponsible; Dr Herriot — practical and firm.",
      "Irony: the 'surgery' is no surgery at all — just diet, discipline and companionship.",
      "Symbol: the changing Tricki — from a sausage-like, listless blob to a sleek, energetic dog.",
      "Humour: Mrs Pumphrey's exaggerated gifts of eggs, wine and brandy 'for the patient'.",
      "Message: love without discipline harms; genuine care sets healthy limits.",
    ],
    formulas: "",
    exam: [
      "State that the 'triumph' is ironic — it was diet and play, not surgery, that cured Tricki.",
      "Contrast Mrs Pumphrey's indulgence with Dr Herriot's firmness.",
      "End with the lesson: love must be balanced with sensible discipline.",
    ],
  },
  {
    id: 12,
    num: 12,
    title: "The Thief's Story",
    subj: "english",
    book: "Footprints",
    author: "Ruskin Bond",
    oneshot: [
      "A young, experienced thief befriends Anil, a trusting young writer, and starts living with him.",
      "Anil teaches the thief to cook, write his name, and add numbers — gifts far greater than money.",
      "One night the thief steals Anil's savings and flees to the railway station, but his conscience stops him.",
      "He returns the money secretly and, the next morning, is rewarded with a fifty-rupee note and the offer of regular payment.",
    ],
    keypts: [
      "Theme: trust, conscience, and the possibility of redemption through education.",
      "Characters: the thief (narrator) — skilled but morally torn; Anil — kind, forgiving, optimistic.",
      "Conflict: the thief's habit of stealing vs his growing respect for Anil and desire to learn.",
      "Climax: at the railway station, the thief realises that literacy is worth more than stolen cash.",
      "Irony: by returning the money, the thief earns more than he had stolen.",
      "Message: trust can reform even a hardened wrongdoer; learning changes lives.",
    ],
    formulas: "",
    exam: [
      "Identify the narrator as a young thief and Anil as a trusting writer.",
      "Highlight the moment of conscience on the platform as the turning point.",
      "Close on the theme that education and trust can transform a person.",
    ],
  },
  {
    id: 13,
    num: 13,
    title: "The Midnight Visitor",
    subj: "english",
    book: "Footprints",
    author: "Robert Arthur",
    oneshot: [
      "Ausable, a secret agent, returns to his hotel room with a young writer, Fowler, expecting a dull evening.",
      "Instead, a rival agent, Max, armed with a pistol, is waiting in the room to snatch a secret report.",
      "Ausable calmly invents a story about a balcony outside the window and an imaginary police caller.",
      "When the waiter knocks, Max — believing it is the police — leaps to the non-existent balcony and falls to his doom.",
    ],
    keypts: [
      "Theme: presence of mind and intelligence can defeat brute force and weapons.",
      "Characters: Ausable — fat, calm, sharp-witted; Max — dangerous but gullible; Fowler — surprised observer.",
      "Setting: a small sixth-floor French hotel room with no balcony — the key to Ausable's trick.",
      "Twist: the 'balcony' is pure invention; the knocking is only a waiter bringing drinks.",
      "Tension: built by Max's gun and the ticking clock of an expected 'police' arrival.",
      "Message: a cool head and a quick story are more powerful than a pistol.",
    ],
    formulas: "",
    exam: [
      "Name Ausable as the clever agent and Max as the armed rival.",
      "Explain the TWO lies Ausable uses — the balcony and the expected police — and how Max falls for both.",
      "End with the irony: Max kills himself, so to speak, by believing a story rather than fighting.",
    ],
  },
  {
    id: 14,
    num: 14,
    title: "A Question of Trust",
    subj: "english",
    book: "Footprints",
    author: "Victor Canning",
    oneshot: [
      "Horace Danby, a respectable lock-maker, secretly robs one house every year to fund his rare-book hobby.",
      "At Shotover Grange he is caught by a young woman claiming to be the owner's wife, who tricks him into opening the safe.",
      "Trusting her, Horace opens the safe without gloves and leaves — only to be arrested three days later.",
      "The woman was another thief; Horace's own profession of trust was used against him.",
    ],
    keypts: [
      "Theme: trust can be a weapon, and even clever criminals can be outwitted.",
      "Character: Horace Danby — careful, polite, allergic to flowers, but morally weak; respectable on the surface.",
      "The young woman — calm, smart, dishonest; a thief disguised as the lady of the house.",
      "Irony: a thief is robbed by another thief; trust, normally a virtue, becomes his downfall.",
      "Symbol: the flowers Horace is allergic to — they cause him to remove his gloves and leave fingerprints.",
      "Message: crime does not pay, and over-confidence is dangerous.",
    ],
    formulas: "",
    exam: [
      "Identify Horace as a part-time thief and the young woman as a fellow thief in disguise.",
      "Explain how she gains his trust and tricks him into opening the safe.",
      "End with the irony: a thief trusting a thief — and getting caught for it.",
    ],
  },
  {
    id: 15,
    num: 15,
    title: "Footprints without Feet",
    subj: "english",
    book: "Footprints",
    author: "H.G. Wells",
    oneshot: [
      "A brilliant scientist, Griffin, discovers a drug that makes the human body invisible.",
      "He sets his landlord's house on fire and wanders London unseen, stealing clothes, food and money to survive.",
      "He enters a shop, a theatrical store and finally the house of a clergyman, robbing each.",
      "Tracked down by the village boys and a dog, Griffin's invisibility becomes a curse rather than a gift.",
    ],
    keypts: [
      "Theme: science without morality is destructive; power without conscience corrupts.",
      "Character: Griffin — brilliant but lawless, violent, selfish, using his discovery for crime.",
      "Setting: wintery London, the shop, the clergyman's house, and the village of Iping.",
      "Symbol: the 'footprints without feet' — proof of invisible presence, both wonder and threat.",
      "Irony: invisibility, which could have served humanity, only isolates and ruins Griffin.",
      "Message: knowledge must be guided by ethics; misuse of power brings its own downfall.",
    ],
    formulas: "",
    exam: [
      "Name Griffin as a scientist who becomes invisible and turns to crime.",
      "Use TWO incidents (the fire, the clergyman's robbery) to show his lawlessness.",
      "End with the moral: science without conscience is dangerous.",
    ],
  },
  {
    id: 16,
    num: 16,
    title: "The Making of a Scientist",
    subj: "english",
    book: "Footprints",
    author: "Robert W. Peterson",
    oneshot: [
      "A young Richard Ebright collects butterflies with his mother's encouragement and reads widely about science.",
      "Inspired by Dr Urquhart's book, he tags butterflies and starts real experiments on gold spots and monarchs.",
      "A high-school project on the purpose of the twelve gold spots on a monarch pupa wins him recognition.",
      "His later work on cell DNA eventually helps him grow into a leading scientist.",
    ],
    keypts: [
      "Theme: curiosity, hard work and the right encouragement shape a scientist.",
      "Character: Richard Ebright — competitive, bright, methodical, driven by curiosity.",
      "Influences: his mother (buying him instruments, travel), Dr Urquhart (open projects), and good teachers.",
      "Method: tagging butterflies → gold-spots experiment → DNA work — a steady climb from hobby to science.",
      "Setting: small-town Reading, Pennsylvania; science fairs as the proving ground.",
      "Message: brilliance alone is not enough — it must meet opportunity and effort.",
    ],
    formulas: "",
    exam: [
      "Name Richard Ebright and his hometown/inspiration (Dr Urquhart's book).",
      "Trace ONE chain: tagging → gold spots → DNA work — to show steady scientific growth.",
      "End with the role of his mother and mentors in 'making' the scientist.",
    ],
  },
  {
    id: 17,
    num: 17,
    title: "The Necklace",
    subj: "english",
    book: "Footprints",
    author: "Guy de Maupassant",
    oneshot: [
      "Mathilde Loisel, born into a middle-class family, longs endlessly for wealth and high society.",
      "Borrowing a diamond necklace from her rich friend Mme Forestier, she attends a glamorous ball and shines.",
      "Losing the necklace, the Loisels spend ten years in poverty to repay the loans for a replacement.",
      "At the end, Mme Forestier reveals the original necklace was a cheap fake — a cruel twist of fate.",
    ],
    keypts: [
      "Theme: vanity, materialism, and the destructive power of discontent.",
      "Character: Mathilde — vain, dissatisfied, dreamy of luxury; her husband — patient, sacrificing, content.",
      "Irony: a ten-year struggle to repay a fortune, for a necklace worth only a few hundred francs.",
      "Setting: 19th-century Paris, from a shabby flat to a grand ball and back to garret poverty.",
      "Symbol: the necklace — false appearance, hollow values, the price of vanity.",
      "Message: honesty and contentment are worth more than borrowed glitter.",
    ],
    formulas: "",
    exam: [
      "Name Mathilde Loisel and her husband, and the borrowed necklace as the central object.",
      "Trace the cause-and-effect chain: borrow → lose → replace → repay for ten years.",
      "End with Maupassant's twist and its message about vanity and honesty.",
    ],
  },
];

// ---------------------------------------------------------------------------
// MCQs (~30)
// ---------------------------------------------------------------------------

export const ENG_MCQS: ENGMCQ[] = [
  // Ch 1 — A Letter to God
  {
    id: 1, ch: 1, subj: "english", diff: "easy",
    q: "In 'A Letter to God', what destroys Lencho's corn field?",
    opts: ["A severe drought", "A hailstorm", "A swarm of locusts", "A flood"],
    ans: 1,
    exp: "A sudden hailstorm, which Lencho at first mistook for welcome rain, completely destroys his ripe corn crop and leaves the family facing ruin.",
  },
  {
    id: 2, ch: 1, subj: "english", diff: "medium",
    q: "What is the central irony of 'A Letter to God'?",
    opts: [
      "Lencho cannot read his own letter",
      "The postmaster steals the money",
      "Humans help Lencho but he accuses them of being crooks",
      "The letter never reaches anyone",
    ],
    ans: 2,
    exp: "The postmaster and staff collect money to honour Lencho's faith, yet Lencho, receiving less than he asked for, brands the postal employees as thieves — the very people who secretly helped him.",
  },
  // Ch 2 — Mandela
  {
    id: 3, ch: 2, subj: "english", diff: "easy",
    q: "On which date did Nelson Mandela become President of South Africa?",
    opts: ["10 May 1994", "27 April 1994", "16 June 1976", "11 February 1990"],
    ans: 0,
    exp: "Mandela's inauguration as the first Black President of South Africa took place on 10 May 1994 in Pretoria.",
  },
  {
    id: 4, ch: 2, subj: "english", diff: "medium",
    q: "According to Mandela, what are the 'twin obligations' every person has?",
    opts: [
      "Obligations to God and to the king",
      "Obligations to one's family and to one's people and country",
      "Obligations to work and to rest",
      "Obligations to the past and to the future",
    ],
    ans: 1,
    exp: "Mandela writes that in South Africa, a Black man had to choose between his duty to his family and his duty to his people and country — the 'twin obligations'.",
  },
  // Ch 3 — Two Stories About Flying
  {
    id: 5, ch: 3, subj: "english", diff: "easy",
    q: "In 'His First Flight', what finally pushes the young seagull to fly?",
    opts: [
      "Fear of the sea",
      "Hunger and the mother's offer of fish",
      "An approaching storm",
      "The father's scolding",
    ],
    ans: 1,
    exp: "The young bird, starving, dives for the fish held by its mother — and in that moment discovers it can fly.",
  },
  {
    id: 6, ch: 3, subj: "english", diff: "medium",
    q: "In 'The Black Aeroplane', the narrator's own aeroplane had how many engines?",
    opts: ["One", "Two", "Four", "Six"],
    ans: 1,
    exp: "The narrator flew an old Dakota aeroplane with two engines, which he was flying back to England from France.",
  },
  // Ch 4 — Anne Frank
  {
    id: 7, ch: 4, subj: "english", diff: "easy",
    q: "What name does Anne give to her diary?",
    opts: ["Margot", "Kitty", "Catty", "Minnie"],
    ans: 1,
    exp: "Anne addresses her diary entries to 'Kitty', treating the diary as a close friend and confidante.",
  },
  {
    id: 8, ch: 4, subj: "english", diff: "medium",
    q: "Why does Mr Keesing assign Anne extra essays?",
    opts: [
      "For poor homework",
      "Because she talks too much in class",
      "For coming late",
      "For failing a maths test",
    ],
    ans: 1,
    exp: "Mr Keesing, her maths teacher, punishes Anne's continuous talking by making her write essays such as 'A Chatterbox'.",
  },
  // Ch 5 — Glimpses of India
  {
    id: 9, ch: 5, subj: "english", diff: "easy",
    q: "What are the traditional bakers of Goa called?",
    opts: ["Paders", "Masons", "Pilots", "Pongas"],
    ans: 0,
    exp: "The Portuguese-era bakers of Goa are locally known as 'paders', a name still in use for them.",
  },
  {
    id: 10, ch: 5, subj: "english", diff: "medium",
    q: "In 'Coorg', the people of the region are believed to descend from which two groups?",
    opts: [
      "Greeks and Arabs",
      "Greeks or Kurds and Arabs",
      "Portuguese and Persians",
      "Tamils and Sinhalas",
    ],
    ans: 1,
    exp: "Coorgi tradition holds that the people are of Greek or Kurdish descent (through Alexander's army) intermarried with Arabs.",
  },
  {
    id: 11, ch: 5, subj: "english", diff: "easy",
    q: "In 'Tea from Assam', who is Pranjol's friend from Delhi?",
    opts: ["Rajvir", "Ramesh", "Rahim", "Ravi"],
    ans: 0,
    exp: "Pranjol's school friend Rajvir travels with him to Assam to visit his tea-garden estate.",
  },
  // Ch 6 — Mijbil the Otter
  {
    id: 12, ch: 6, subj: "english", diff: "easy",
    q: "Where did the author's friend suggest he keep an otter instead of a dog?",
    opts: ["The Tigris marshes, Iraq", "The Nile, Egypt", "The Amazon basin", "The Ganga delta"],
    ans: 0,
    exp: "Maxwell's friend in Iraq suggested that, since he lived in the Tigris marshes, he should keep an otter rather than a dog.",
  },
  {
    id: 13, ch: 6, subj: "english", diff: "medium",
    q: "What does Mijbil invent as a game with his toys?",
    opts: [
      "Juggling balls on his belly",
      "A ball-and-marble game played on the floor",
      "Stacking pebbles",
      "Throwing stones at the window",
    ],
    ans: 1,
    exp: "Mijbil would place a ball on the high back of a sofa, drop it, catch it, and toss it — turning it into an improvised game of skill.",
  },
  // Ch 7 — Madam Rides the Bus
  {
    id: 14, ch: 7, subj: "english", diff: "easy",
    q: "How old is Valli in 'Madam Rides the Bus'?",
    opts: ["Six", "Eight", "Ten", "Twelve"],
    ans: 1,
    exp: "Valliammai, called Valli, is an eight-year-old girl who is fascinated by the bus that runs past her village.",
  },
  {
    id: 15, ch: 7, subj: "english", diff: "medium",
    q: "What sight on the return journey frightens and saddens Valli?",
    opts: [
      "A dead cow lying by the road",
      "A bus accident",
      "A storm breaking out",
      "A child being scolded",
    ],
    ans: 0,
    exp: "Valli had laughed at the same cow running on the way to town; on her way back, she sees it dead — a sobering encounter with death.",
  },
  // Ch 8 — Sermon at Benares
  {
    id: 16, ch: 8, subj: "english", diff: "easy",
    q: "What did Kisa Gotami ask for, that the Buddha told her to find from a house where no one had died?",
    opts: ["Mustard seeds", "Rice grains", "A pinch of salt", "A piece of cloth"],
    ans: 0,
    exp: "The Buddha asked Kisa Gotami to bring mustard seeds — but only from a house that had never lost a loved one. She could find none.",
  },
  {
    id: 17, ch: 8, subj: "english", diff: "medium",
    q: "According to the Buddha's first sermon, what ultimately frees a person from sorrow?",
    opts: [
      "Wealth and offerings",
      "The acceptance that death is universal",
      "Long prayers",
      "Retiring to a forest",
    ],
    ans: 1,
    exp: "The Buddha teaches that once one accepts death as inevitable and universal, the mind is freed from grief and finds peace.",
  },
  // Ch 9 — The Proposal
  {
    id: 18, ch: 9, subj: "english", diff: "easy",
    q: "Whom does Lomov come to propose marriage to in 'The Proposal'?",
    opts: ["Natalya Stepanovna", "Aunt Natasha", "Mrs Pumphrey", "Mme Forestier"],
    ans: 0,
    exp: "Lomov arrives at the home of his neighbour Stepan Chubukov to propose to his daughter, Natalya Stepanovna.",
  },
  {
    id: 19, ch: 9, subj: "english", diff: "medium",
    q: "What do Lomov and Natalya first quarrel about?",
    opts: [
      "The ownership of Oxen Meadows",
      "The price of champagne",
      "The breed of horses",
      "A wedding date",
    ],
    ans: 0,
    exp: "Even before Lomov can finish proposing, the two quarrel bitterly over who owns the strip of land called Oxen Meadows.",
  },
  // Ch 10 — Poetry
  {
    id: 20, ch: 10, subj: "english", diff: "easy",
    q: "In 'Dust of Snow', what bird shakes down snow on the poet?",
    opts: ["A crow", "A raven", "A magpie", "A sparrow"],
    ans: 0,
    exp: "A crow, shaking off the snow from a hemlock tree, accidentally scatters it on the poet — and his mood lifts.",
  },
  {
    id: 21, ch: 10, subj: "english", diff: "medium",
    q: "In 'Fire and Ice', what do 'fire' and 'ice' respectively symbolise?",
    opts: [
      "Sun and moon",
      "Desire and hatred",
      "Summer and winter",
      "Anger and fear",
    ],
    ans: 1,
    exp: "Frost uses 'fire' as a symbol of human desire and 'ice' as a symbol of cold hatred — either, he says, could end the world.",
  },
  {
    id: 22, ch: 10, subj: "english", diff: "medium",
    q: "In 'A Tiger in the Zoo', where does the poet imagine the tiger should truly be?",
    opts: [
      "Lurking in the shadow of the long grass near the jungle's edge",
      "Sleeping in a city zoo",
      "Locked in a circus cage",
      "Pacing a marble palace",
    ],
    ans: 0,
    exp: "The poet imagines the tiger not in a cage but in its natural wild home — quietly stalking through tall grass near a water hole, hunting deer, and frightening villagers who live at the edge of the jungle.",
  },
  {
    id: 23, ch: 10, subj: "english", diff: "easy",
    q: "In 'The Ball Poem', what does the loss of the ball teach the boy?",
    opts: [
      "To ask his parents for a new ball",
      "To accept loss as a part of life and learn responsibility",
      "To stop playing games",
      "To fight with other children",
    ],
    ans: 1,
    exp: "Berryman uses the small loss of a ball to show the boy that some losses can never be undone — they must simply be accepted as a part of growing up and living.",
  },
  {
    id: 24, ch: 10, subj: "english", diff: "medium",
    q: "What three personas does Amanda daydream about in 'Amanda!'?",
    opts: [
      "Mermaid, orphan, Rapunzel",
      "Pirate, princess, fairy",
      "Cinderella, mermaid, queen",
      "Dancer, singer, painter",
    ],
    ans: 0,
    exp: "To escape her mother's constant nagging, Amanda slips into daydreams of being a mermaid in the sea, an orphan roaming free, and Rapunzel in her tower.",
  },
  {
    id: 25, ch: 10, subj: "english", diff: "medium",
    q: "In 'The Tale of Custard the Dragon', who actually fights and kills the pirate?",
    opts: [
      "The dog, Mustard",
      "The kitten, Ink",
      "The mouse, Blink",
      "Custard, the dragon",
    ],
    ans: 3,
    exp: "Despite being teased as a coward, it is Custard the dragon who swallows the pirate — the others all run away in fear.",
  },
  {
    id: 26, ch: 10, subj: "english", diff: "easy",
    q: "In 'For Anne Gregory', what does the poet say only God can do?",
    opts: [
      "Love Anne for her yellow hair",
      "Love her for herself alone, not for her looks",
      "Make her hair turn golden",
      "Forgive her faults",
    ],
    ans: 1,
    exp: "Yeats says that while young men may love Anne for her yellow hair, only God — 'His loving mood' — would love her for herself alone.",
  },
  // Ch 11 — Triumph of Surgery
  {
    id: 27, ch: 11, subj: "english", diff: "easy",
    q: "What is the name of Mrs Pumphrey's dog in 'A Triumph of Surgery'?",
    opts: ["Tricki", "Woof", "Bruno", "Roger"],
    ans: 0,
    exp: "Mrs Pumphrey's over-pampered pet dog is named Tricki — short for Tricki Woo.",
  },
  {
    id: 28, ch: 11, subj: "english", diff: "medium",
    q: "What treatment actually cures Tricki?",
    opts: [
      "Costly surgery",
      "Special injections",
      "A strict plain diet, exercise and play with other dogs",
      "Brandy and wine sent by Mrs Pumphrey",
    ],
    ans: 2,
    exp: "Dr Herriot gives Tricki no medical treatment — only controlled food, water and free play with the other dogs, which restores his health.",
  },
  // Ch 12 — Thief's Story
  {
    id: 29, ch: 12, subj: "english", diff: "easy",
    q: "What does Anil teach the young thief to do?",
    opts: [
      "Cook, write his name and add numbers",
      "Steal more cleverly",
      "Drive a car",
      "Play the harmonium",
    ],
    ans: 0,
    exp: "Anil, who is a writer, teaches the thief to cook, to write his name, and to add numbers — the start of a more honest life.",
  },
  {
    id: 30, ch: 12, subj: "english", diff: "medium",
    q: "Why does the thief return Anil's money at the end of 'The Thief's Story'?",
    opts: [
      "He is caught by the police",
      "He realises learning to read and write is worth more than the stolen money",
      "Anil wakes up and catches him",
      "He wants Anil to give him a reward",
    ],
    ans: 1,
    exp: "On the platform, the thief realises that if he flees with the money he will lose the chance to learn — and education matters more to him than the cash.",
  },
  // Ch 13 — Midnight Visitor
  {
    id: 31, ch: 13, subj: "english", diff: "easy",
    q: "Who is the secret agent protagonist in 'The Midnight Visitor'?",
    opts: ["Ausable", "Max", "Fowler", "Horace"],
    ans: 0,
    exp: "Ausable, an overweight but sharp-witted secret agent, is the central character who outsmarts his rival Max.",
  },
  {
    id: 32, ch: 13, subj: "english", diff: "medium",
    q: "How does Ausable trick Max into jumping out of the window?",
    opts: [
      "By telling him there is a balcony that does not exist",
      "By throwing hot tea on him",
      "By hiding a gun under the pillow",
      "By calling the real police",
    ],
    ans: 0,
    exp: "Ausable calmly claims his room has a balcony outside the window — a complete lie — and when a knock comes, Max jumps to the non-existent balcony and falls six floors.",
  },
  // Ch 14 — Question of Trust
  {
    id: 33, ch: 14, subj: "english", diff: "easy",
    q: "What is Horace Danby's secret hobby funded by his yearly robberies?",
    opts: [
      "Collecting rare and expensive books",
      "Buying paintings",
      "Racing horses",
      "Travelling abroad",
    ],
    ans: 0,
    exp: "Horace Danby, a respectable lock-maker, robs one safe a year to pay for his expensive love of rare books.",
  },
  {
    id: 34, ch: 14, subj: "english", diff: "medium",
    q: "Who actually was the woman Horace met at Shotover Grange?",
    opts: [
      "The owner's wife",
      "A fellow thief disguised as the lady of the house",
      "A police officer in disguise",
      "Horace's own sister",
    ],
    ans: 1,
    exp: "The charming young woman was not the owner's wife at all — she was another thief, who used Horace's skills to rob the safe and left him holding the blame.",
  },
  // Ch 15 — Footprints without Feet
  {
    id: 35, ch: 15, subj: "english", diff: "easy",
    q: "What does Griffin discover that allows him to become invisible?",
    opts: [
      "A special drug",
      "A magic cloak",
      "A hypnotic chant",
      "A special diet",
    ],
    ans: 0,
    exp: "Griffin, a brilliant scientist, discovers rare drugs that make the human body transparent — and so invisible to others.",
  },
  {
    id: 36, ch: 15, subj: "english", diff: "medium",
    q: "Why does Griffin set his landlord's house on fire?",
    opts: [
      "To test a theory",
      "Because the landlord tried to evict him",
      "To hide his papers and escape unpaid rent",
      "By accident, while cooking",
    ],
    ans: 2,
    exp: "Angry at his landlord and desperate to escape unseen, Griffin burns down the house — and so begins his life of crime as an invisible man.",
  },
  // Ch 16 — Making of a Scientist
  {
    id: 37, ch: 16, subj: "english", diff: "easy",
    q: "What does young Richard Ebright first collect as a hobby?",
    opts: ["Butterflies", "Stamps", "Coins", "Rocks"],
    ans: 0,
    exp: "Ebright begins by collecting butterflies — a hobby his mother encourages, and which later grows into serious scientific research.",
  },
  {
    id: 38, ch: 16, subj: "english", diff: "medium",
    q: "What is the purpose of the twelve gold spots on a monarch pupa, as Ebright discovers?",
    opts: [
      "They have no purpose",
      "They are a kind of breathing device for the pupa",
      "They attract mates",
      "They scare away birds",
    ],
    ans: 1,
    exp: "Through experiments, Ebright shows that the tiny gold spots on a monarch pupa are not decoration — they form a hormone necessary for the butterfly's growth and development.",
  },
  // Ch 17 — The Necklace
  {
    id: 39, ch: 17, subj: "english", diff: "easy",
    q: "Whom does Mathilde Loisel borrow the necklace from?",
    opts: ["Mme Forestier", "Mme Loisel", "Mme Henri", "Mme Georges"],
    ans: 0,
    exp: "Mathilde borrows a sparkling diamond necklace from her wealthy school friend, Mme Jeanne Forestier.",
  },
  {
    id: 40, ch: 17, subj: "english", diff: "medium",
    q: "What is the final twist in 'The Necklace'?",
    opts: [
      "Mathilde finds the necklace in her own house",
      "Mme Forestier reveals the original necklace was a cheap fake",
      "Mathilde becomes rich after ten years",
      "The necklace was never lost at all",
    ],
    ans: 1,
    exp: "After ten years of poverty to repay the replacement, Mathilde learns from Mme Forestier that the original necklace was made of paste — worth at most five hundred francs.",
  },
];

// ---------------------------------------------------------------------------
// SHORT Q&A (~20) — 2 & 3 marks
// ---------------------------------------------------------------------------

export const ENG_SHORT_QA: ENGQA[] = [
  {
    id: 1, ch: 1, subj: "english", marks: 2,
    q: "Why did Lencho write a letter to God? What did he ask for?",
    a: "Lencho, a poor farmer, watched a sudden hailstorm destroy his entire corn crop, leaving his family facing starvation. Having firm faith that God would help him, he wrote a letter addressed to God asking for a hundred pesos so that he could sow his fields again and feed his family until the next harvest. His letter, simple and direct, shows both his unshakeable belief and his innocence — he genuinely expected God to send the money.",
  },
  {
    id: 2, ch: 1, subj: "english", marks: 3,
    q: "Why did the postmaster send money to Lencho? Why did Lencho call the postal employees 'a bunch of crooks'?",
    a: "The postmaster, deeply moved by Lencho's extraordinary faith in God, did not want that faith broken. He himself contributed part of his salary and collected the rest from his friends and employees, sending Lencho a portion of the requested sum under God's name. Lencho, however, was certain God could not have sent less than a hundred pesos; he concluded that the postal employees must have stolen the difference. Ironically, the very people who tried to preserve his faith became the target of his accusation.",
  },
  {
    id: 3, ch: 2, subj: "english", marks: 2,
    q: "What were the 'twin obligations' that Mandela spoke of?",
    a: "According to Nelson Mandela, every person has two sets of obligations — one towards his family, parents, wife and children, and the other towards his people, community and country. In a free and peaceful society, these obligations can be fulfilled together; but under apartheid in South Africa, a Black man was forced to choose between them. Mandela himself had to sacrifice his family life for the larger duty to his oppressed people.",
  },
  {
    id: 4, ch: 2, subj: "english", marks: 3,
    q: "What does Mandela mean when he says that the oppressed and the oppressor alike are robbed of their humanity?",
    a: "Mandela believes that apartheid damaged both sides of the divide. The oppressed Black people were obviously robbed of their dignity, freedom and basic rights, treated as inferior in their own land. But the oppressor, too, was a prisoner of hatred, prejudice and fear — locked behind the bars of his own narrowness. True freedom, Mandela argues, is not only for the chains to be removed from the oppressed but also for the oppressor to be freed from his own inhumanity.",
  },
  {
    id: 5, ch: 3, subj: "english", marks: 2,
    q: "Why was the young seagull afraid to fly? How did it finally fly?",
    a: "The young seagull was afraid that its small wings would not support its body, and the vast expanse of the sea below frightened it. Even when its parents and siblings flew away, it stayed alone on the ledge, growing weak with hunger. Finally, the mother flew up with a piece of fish in her beak but stopped just out of reach. Maddened by hunger, the young bird dived for the fish — and in that instant discovered that it could fly.",
  },
  {
    id: 6, ch: 3, subj: "english", marks: 3,
    q: "Why was the narrator of 'The Black Aeroplane' frightened? Who helped him and how?",
    a: "The narrator, flying his old Dakota aeroplane from France to England, suddenly found himself surrounded by huge black storm clouds. His compass was dead, the radio had failed, and fuel was running low; he had no idea where he was. Out of the darkness another aeroplane appeared, its lights blinking, and its pilot waved him to follow. The stranger guided him safely out of the storm towards an airstrip — and then mysteriously vanished, leaving the narrator wondering who had saved him.",
  },
  {
    id: 7, ch: 4, subj: "english", marks: 2,
    q: "Why did Anne Frank think she could confide in her diary more than in people?",
    a: "Anne felt that she had loving parents, a sister and about thirty friends, yet no one with whom she could truly share her inner thoughts. People were either too busy or not interested in her deeper feelings. She believed that paper has more patience than people, and that a diary would not judge, interrupt or laugh at her. By addressing her diary as 'Kitty', she turned it into a true, silent friend.",
  },
  {
    id: 8, ch: 4, subj: "english", marks: 3,
    q: "How did Anne Frank make fun of Mr Keesing? What was its result?",
    a: "Mr Keesing, Anne's maths teacher, punished her constant talking by making her write essays — first 'A Chatterbox', then 'Quack, Quack, Quack, Said Mistress Chatterbox'. In her third essay, written in verse, Anne invented a story about a mother duck and a father swan who bit their chatterbox duckling to death because a teacher complained. Amused by her wit, Mr Keesing read the poem to the class and never assigned her extra work again — he had learned to laugh at himself.",
  },
  {
    id: 9, ch: 5, subj: "english", marks: 2,
    q: "What did the baker mean to the people of Goa in the author's childhood?",
    a: "In the author's childhood in Goa, the baker was an essential and much-loved figure. His daily visits with a jingling thud of his bamboo staff announced the arrival of fresh bread. Marriages and festivals were impossible without his loaves, bolinhas and cakes. The baker, called a 'pader', was a friend, supplier and even a financial helper who kept accounts on a wall in pencil.",
  },
  {
    id: 10, ch: 5, subj: "english", marks: 3,
    q: "Describe the natural beauty and the people of Coorg as shown in 'Glimpses of India'.",
    a: "Coorg, the smallest district of Karnataka, lies between Mysore and Mangalore and is famous for its rainforests, spices and coffee plantations. Rolling hillsides are covered with evergreen trees, and the river Kaveri obtains its water from these hills. The Kodava people are fiercely independent, brave and martial; many serve in the army. They are believed to be of Greek or Arab descent, a theory supported by their distinct dress and culture.",
  },
  {
    id: 11, ch: 6, subj: "english", marks: 2,
    q: "How did Mijbil behave on the first night at the author's flat in London?",
    a: "On the very first night, Mijbil escaped from the box and appeared in the bedroom. He spent the night exploring every corner, sniffing curiously and then settling to sleep on the author's bed. By morning he had grown confident enough to climb on to the author's body, clearly beginning to treat him as a companion. The otter's playful curiosity showed from the start.",
  },
  {
    id: 12, ch: 7, subj: "english", marks: 2,
    q: "How did Valli plan her bus ride so that no one would find out?",
    a: "Valli, an eight-year-old girl, planned her bus ride with great care. She saved every coin she could, resisting the temptation to buy peppermints and toys. She listened closely to neighbours who had taken the bus, gathering details of the route, distance and fare. When her mother was asleep in the afternoon, she slipped out quietly, took the bus to the town, and returned before anyone knew.",
  },
  {
    id: 13, ch: 7, subj: "english", marks: 3,
    q: "Why was Valli silent on the return journey? What did the sight of the dead cow teach her?",
    a: "On the outward journey, Valli had laughed aloud at a cow running in the middle of the road with its tail in the air. On the way back, she saw the same cow lying dead by the roadside, covered in blood. The shock of this sight silenced her completely. She realised, for the first time, the reality of death, and the loss of her innocence; she no longer found the journey exciting, and refused to look out of the window.",
  },
  {
    id: 14, ch: 8, subj: "english", marks: 2,
    q: "Why was Kisa Gotami sad? What did the Buddha ask her to do?",
    a: "Kisa Gotami's only son had died, and in her grief she went from house to house asking for medicine to bring him back to life. The Buddha, to teach her the truth about death, asked her to bring a handful of mustard seeds — but only from a house where no one had ever died. Kisa went from door to door but could not find a single such home, and slowly understood that death spares no family.",
  },
  {
    id: 15, ch: 8, subj: "english", marks: 3,
    q: "What lesson did Kisa Gotami learn from her search? What does the Buddha teach about sorrow?",
    a: "Through her fruitless search for mustard seeds from a 'death-free' house, Kisa Gotami realised that death is universal — every family has lost a loved one. Her grief, which had seemed unique and unbearable, was shared by all of humanity. The Buddha taught that life is short and full of suffering; those who try to escape sorrow only increase it, while those who accept the truth of death are freed from grief and find peace of mind.",
  },
  {
    id: 16, ch: 9, subj: "english", marks: 2,
    q: "Why did Lomov visit Chubukov in 'The Proposal'? How did Chubukov react at first?",
    a: "Lomov, a young and nervous neighbour, came to Chubukov's house to ask for his daughter Natalya's hand in marriage. At first Chubukov, seeing Lomov in his evening clothes, thought he had come to borrow money and was relieved when he understood the true purpose. He warmly welcomed the proposal, called Lomov his 'angel', and went at once to fetch Natalya.",
  },
  {
    id: 17, ch: 10, subj: "english", marks: 2,
    q: "How does the poet of 'Dust of Snow' turn a moment of sadness into one of joy?",
    a: "The poet, in a sad and bitter mood, stands beneath a hemlock tree when a crow shakes loose a small shower of snow on him. This tiny, unexpected event — involving creatures usually seen as inauspicious — changes his mood completely. He realises that he has saved the rest of his day from being wasted in regret, showing how small moments of nature can uplift the human spirit.",
  },
  {
    id: 18, ch: 10, subj: "english", marks: 3,
    q: "What is the central theme of 'The Ball Poem'? What does the boy learn from losing his ball?",
    a: "'The Ball Poem' by John Berryman uses the simple loss of a ball to introduce the deeper theme of loss and the meaning of responsibility. As the boy watches his ball bounce away into the harbour, the poet explains that no one can buy back the exact same ball — losses are irreplaceable. Through this small experience, the boy learns to stand up to the loss that life will repeatedly bring; he is learning that some losses must simply be accepted as part of growing up.",
  },
  {
    id: 19, ch: 11, subj: "english", marks: 2,
    q: "Why was Tricki taken to the surgery? How did Dr Herriot treat him?",
    a: "Tricki, Mrs Pumphrey's over-fed pet dog, had become hugely fat, listless and unwell because of rich food and lack of exercise. Dr Herriot took him into his hospital and put him on a strict plain diet with plenty of water. Tricki was also allowed to play and run with the other dogs in the yard, and within a fortnight he had recovered fully — without any medicine or surgery.",
  },
  {
    id: 20, ch: 17, subj: "english", marks: 3,
    q: "How did the loss of the necklace change the Loisels' life? What is the irony at the end?",
    a: "After losing Mme Forestier's diamond necklace, the Loisels borrow thirty-six thousand francs to buy a replacement and return it. To repay the huge debt, they dismiss their maid, move to a smaller attic, and spend ten long years doing all their own work, gradually ageing and growing rough and shabby. The bitter irony is revealed at the end when Mme Forestier casually tells Mathilde that the original necklace was a cheap fake worth at most five hundred francs.",
  },
];

// ---------------------------------------------------------------------------
// LONG Q&A (~10) — 5 marks
// ---------------------------------------------------------------------------

export const ENG_LONG_QA: ENGQA[] = [
  {
    id: 1, ch: 1, subj: "english", marks: 5,
    q: "'Faith is a strength, but blind faith can also be a weakness.' Discuss this statement with reference to 'A Letter to God'.",
    a: "G.L. Fuentes's story 'A Letter to God' presents faith in two contrasting lights. Lencho, a poor farmer, has unshakeable faith in God. When a hailstorm destroys his entire corn crop, he writes a letter to God asking for a hundred pesos, certain that God will answer. This faith is touching and gives him hope in a moment of complete ruin — clearly a strength. The postmaster, moved by such simple belief, collects money from his staff and sends it to Lencho under God's name, showing how one person's faith can inspire kindness in others.\n\nYet the same faith also becomes a weakness. When Lencho receives less than the requested amount, he does not doubt God for a moment; instead, he assumes the postal employees have stolen the difference and calls them 'a bunch of crooks' in a second letter. He cannot imagine that God would send less than asked, so he suspects the very humans who helped him. His blind faith blinds him to reality and to gratitude.\n\nThe story thus shows that faith is a powerful virtue, but when it is closed to reason, it can lead to injustice. True faith should make a person more trusting and generous, not suspicious of others. Fuentes leaves us with the gentle irony that the men Lencho accuses are the real instruments of God's help.",
  },
  {
    id: 2, ch: 2, subj: "english", marks: 5,
    q: "Describe the events of 10 May 1994 as given in 'Nelson Mandela: Long Walk to Freedom'. What does Mandela say about the struggle for freedom?",
    a: "On 10 May 1994, Nelson Mandela was inaugurated as the first Black President of South Africa at the Union Buildings amphitheatre in Pretoria. It was the largest gathering of international leaders on South African soil. The day symbolised the political triumph of the long struggle against apartheid. Mandela describes how, after centuries of white domination, a Black man stood at the head of the nation, while the army, until recently loyal to the apartheid state, saluted him. The once-oppressed and once-oppressors now sat together under one sky.\n\nMandela reflects that this victory did not come easily. He speaks of the suffering of his people under the policy of apartheid — of poverty, of broken families, of the countless freedom fighters who gave their lives or were imprisoned on Robben Island and elsewhere. He pays tribute to men like Oliver Tambo, Walter Sisulu and others whose sacrifice made the day possible.\n\nMandela also explains his idea of the 'twin obligations' — to one's family and to one's people and country — and confesses that under apartheid, he could not fulfil both. He chose the path of his people, and in doing so, lost the everyday joys of fatherhood. He ends with the broader lesson that true freedom is not just for the oppressed; the oppressor, too, must be freed from hatred. The chapter is a moving meditation on courage, sacrifice and the meaning of liberty.",
  },
  {
    id: 3, ch: 3, subj: "english", marks: 5,
    q: "Compare and contrast the two stories in 'Two Stories About Flying'. What common lesson do they offer?",
    a: "'Two Stories About Flying' brings together two unrelated tales — 'His First Flight' by Liam O'Flaherty and 'The Black Aeroplane' by Frederick Forsyth — both of which centre on a moment of flight and a moment of decision.\n\nIn 'His First Flight', a young seagull is too afraid to fly. Even as its parents, brothers and sister soar away, it stays alone on the ledge, frightened that its small wings will not hold it. It is only when hunger becomes unbearable and its mother offers a fish just out of reach that the bird dives — and discovers it can fly. The lesson is that fear is overcome only by taking the first step; the support of family and the call of nature together give the young bird courage.\n\nIn 'The Black Aeroplane', the narrator, flying his old Dakota aeroplane from France to England, is caught in a huge storm with a dead compass, a failed radio and falling fuel. Out of the darkness another aeroplane appears and guides him safely out of the storm. The stranger pilot then vanishes, leaving the narrator wondering whether he was saved by a fellow airman or by some unseen power. The lesson here is of hope and trust in moments of darkness — a faith that even in the worst conditions, help may appear.\n\nThe two stories share the common theme of courage and trust: the young seagull must trust its wings, and the lost pilot must trust the stranger. Both tales suggest that taking a leap of faith — whether into the air or into the unknown — is what brings safety and growth. The first is grounded in real life; the second hints at mystery; yet both celebrate the human (and animal) spirit.",
  },
  {
    id: 4, ch: 7, subj: "english", marks: 5,
    q: "Vallikkannan's 'Madam Rides the Bus' is a story of childhood curiosity meeting the reality of death. Discuss.",
    a: "'Madam Rides the Bus' by Vallikkannan tells the story of eight-year-old Valliammai — Valli — who is fascinated by the bus that travels each hour between her village and the nearby town. Watching from her doorway, she gathers every detail: the fare, the journey time, the sights on the way. Quietly she saves coins, resists the temptation to buy peppermints and toys, and one afternoon slips out while her mother sleeps, taking her very first bus ride alone.\n\nOn the outward journey, Valli is pure joy. She watches the running countryside, the canal, the palm trees, the distant train. She even laughs out loud when a frightened cow runs in the middle of the road with its tail in the air. The bus ride is her window to the wider world, and her careful planning shows how determined and self-possessed a child can be.\n\nThe journey home, however, brings a sobering discovery. The same cow that had amused her now lies dead by the roadside, covered in blood. The sight fills Valli with sadness and fear; she refuses to look out of the window, loses all interest in the bus, and returns home in silence, hiding the experience from her mother. Through this single event, the child meets, for the first time, the reality of death.\n\nThe story thus traces Valli's growth from innocent curiosity to a quiet understanding of life and death. It shows that even small adventures carry the seeds of larger lessons, and that a single journey can leave a child a little wiser, a little sadder, and a little more grown up.",
  },
  {
    id: 5, ch: 9, subj: "english", marks: 5,
    q: "Anton Chekhov's 'The Proposal' is a great comedy but also a sharp social satire. Discuss.",
    a: "Anton Chekhov's one-act play 'The Proposal' works on two levels at once. On the surface it is a sparkling comedy; underneath it is a satire on the property-minded Russian society of the late nineteenth century.\n\nAs comedy, the play moves at a furious pace. Lomov, a nervous and quarrelsome neighbour, arrives at Chubukov's house to propose marriage to his daughter Natalya. But before he can complete his proposal, the two quarrel fiercely over the ownership of a small strip of land called Oxen Meadows. The quarrel is so bitter that Lomov feels faint and staggers out. Brought back by Chubukov, the couple immediately falls into a second quarrel — this time over whose hunting dog is superior, Lomov's Guess or Natalya's Squeezer. The characters shout, swoon and faint, even as the question of marriage is all but forgotten. Chubukov finally pushes the dazed pair together and blesses their 'engagement', only for the quarrelling to begin again at once.\n\nThe humour arises from exaggeration, comic timing and the absurd contrast between the seriousness of marriage and the pettiness of the disputes. The audience laughs at Lomov's hypochondria, at Natalya's sharp tongue and at Chubukov's desperation to marry off his daughter.\n\nYet beneath the laughter lies sharp satire. Chekhov is mocking a society in which marriage is not the union of two hearts but a contract over land and animals. Love does not enter the discussion; only ownership and prestige do. The play shows how, in a world obsessed with property, even the most personal of human relationships becomes a quarrel over goods. Thus 'The Proposal' is at once a great comedy and a sharp critique of the society that produced it.",
  },
  {
    id: 6, ch: 10, subj: "english", marks: 5,
    q: "Discuss the theme of freedom versus captivity as presented in 'A Tiger in the Zoo' and 'The Trees'.",
    a: "The theme of freedom versus captivity runs powerfully through two Class 10 poems — 'A Tiger in the Zoo' by Leslie Norris and 'The Trees' by Adrienne Rich — though the two poets treat it in very different ways.\n\nIn 'A Tiger in the Zoo', the poet contrasts the life of a caged tiger with what its life should be in the wild. In the zoo, the magnificent animal paces in narrow steps behind iron bars, ignoring the visitors who come to stare. Its eyes hold a quiet, suppressed rage. The poet then imagines the tiger in its natural home — quietly stalking through tall grass near a water hole, hunting deer, and frightening the villagers living at the jungle's edge. The contrast makes the cruelty of captivity clear: the zoo has reduced a free, powerful creature to a helpless prisoner. The poem is a protest against the imprisonment of wild animals for human entertainment.\n\nIn 'The Trees', Adrienne Rich uses the symbol of trees kept indoors in pots. These trees, the poet says, have always been inside; now they are slowly moving out into the empty forest. Their roots struggle to free themselves from the cracks in the veranda floor, their leaves strain towards the glass, and at last they stumble out into the night. The forest, empty all these years, will be full of trees by morning. The poem uses this striking image as a metaphor for the freedom of women and of all those who have been confined within the four walls of custom and tradition. Rich shows freedom not as a gift but as something to be claimed, slowly and painfully.\n\nBoth poems thus show that captivity — whether of a wild animal or of a forest of trees — is unnatural and ultimately temporary. Freedom is the natural state of every living being, and the poems celebrate its slow but certain return.",
  },
  {
    id: 7, ch: 11, subj: "english", marks: 5,
    q: "Mrs Pumphrey's love for Tricki was real but harmful. Discuss with reference to 'A Triumph of Surgery'.",
    a: "In James Herriot's 'A Triumph of Surgery', Mrs Pumphrey is shown as a wealthy, affectionate and deeply attached dog owner. Her love for her pet Tricki is genuine and touching — she worries about him, fusses over his health and showers him with luxuries. Yet her love is also harmful, because it is given without the discipline that an animal needs.\n\nMrs Pumphrey overfeeds Tricki with rich food such as malt, cod-liver oil, bowls of Horlicks and extra snacks between meals. She rarely lets him exercise, fearing he would tire himself. As a result, Tricki becomes hugely fat, listless and unwell, with no interest in anything — not even in food. Her love, given blindly, has actually made her pet sick.\n\nDr Herriot, the veterinary surgeon, takes a different path. He takes Tricki into his hospital and gives him no medicines at all. He simply feeds him a strict, plain diet, lets him drink water, and allows him to play and run with the other dogs in the yard. Slowly Tricki regains energy, becomes fit and active, and is transformed from a sausage-like blob into a sleek, healthy dog. The cure, ironically, is not surgery but discipline.\n\nThe story thus shows that love without limits is not love at all. Mrs Pumphrey means well, but her indulgence hurts Tricki. Genuine care — like Herriot's — means giving what is good, not what is wanted. The 'triumph of surgery' is, in truth, a triumph of sensible, disciplined affection over foolish pampering. The chapter gently reminds the reader that those who love — whether pets, children or anyone else — must also learn to say 'no'.",
  },
  {
    id: 8, ch: 12, subj: "english", marks: 5,
    q: "How does Ruskin Bond, in 'The Thief's Story', show that trust and education can transform a person?",
    a: "Ruskin Bond's 'The Thief's Story' is a quiet, powerful tale of reform. The narrator is a young and experienced thief, only fifteen years old, who befriends Anil, a young and trusting writer, with the clear intention of robbing him. Yet the relationship that follows slowly changes him in ways he had not expected.\n\nAnil is kind and generous. He takes the boy in, gives him food, teaches him to cook, and — most importantly — begins to teach him to write his name, to add numbers, and to read whole sentences. The thief realises that this skill, once learnt, would open a different life for him — a life far more valuable than any stolen money. Anil trusts him completely, never suspecting his true nature, and that trust works quietly on the boy's conscience.\n\nThe conflict reaches its peak when the thief steals Anil's savings one night and reaches the railway station to flee. But on the platform, he cannot bring himself to board the train. He thinks of Anil's kindness, of the gift of literacy that has been offered to him, and realises that the money would be useless if he lost the chance to learn. In a moment of conscience, he returns and slips the money back under the mattress. The next morning, Anil says nothing about the theft, but gives the boy a fifty-rupee note and promises him a regular payment — a small, silent acknowledgement of what has happened.\n\nThe story thus shows that trust, even when it seems foolish, can reform a person more surely than punishment. And education — the simple ability to read and write — is shown to be worth far more than money. Bond suggests that kindness and knowledge, given freely, can change even a hardened thief.",
  },
  {
    id: 9, ch: 15, subj: "english", marks: 5,
    q: "Griffin's brilliance as a scientist is matched by his lawlessness as a man. Discuss with reference to 'Footprints without Feet'.",
    a: "H.G. Wells's 'Footprints without Feet' presents the tragic story of Griffin, a brilliant scientist who discovers a rare drug that can make the human body invisible. The discovery itself is a mark of his genius — few could have achieved what he did. Yet Griffin uses this extraordinary power not for the good of humanity, but for crime and violence, and so becomes a cautionary figure.\n\nFrom the very first, Griffin's lawlessness is clear. When his landlord tries to evict him, Griffin sets the house on fire and escapes unseen. He wanders the cold streets of London without clothes, money or shelter, breaking into shops and stores to feed and clothe himself. At a theatrical company he steals dark glasses, a false nose and a bandaged face to hide his invisibility. He then enters the quiet village of Iping, rents a room, and when his money runs out, he robs the clergyman's house of all its gold. He even attacks the shopkeeper and the clergyman without a second thought.\n\nGriffin's actions show that brilliance without morality is dangerous. He has the mind of a scientist but the heart of a criminal. He treats other people only as obstacles or as sources of money; he is violent, selfish and without any sense of right and wrong. Wells shows that knowledge, when cut off from conscience, becomes a curse rather than a blessing. Griffin's invisibility, which could have served science or medicine, only isolates and ruins him.\n\nThe story ends with Griffin being hunted by the villagers and a dog, his 'miracle' turning against him. Wells thus warns the reader that science must always be guided by ethics; without moral sense, even the greatest discovery can lead only to downfall.",
  },
  {
    id: 10, ch: 17, subj: "english", marks: 5,
    q: "Maupassant's 'The Necklace' shows that vanity and dishonesty bring ruin. Discuss.",
    a: "Guy de Maupassant's 'The Necklace' is one of the most famous short stories in world literature, a sharp indictment of vanity, materialism and dishonesty. The heroine, Mathilde Loisel, is born into a middle-class family but dreams endlessly of wealth, jewels, fine dinners and the admiration of high society. Dissatisfied with her gentle, contented husband and her simple life, she longs for what she cannot have.\n\nWhen the Loisels are invited to a grand ball at the Minister's residence, Mathilde borrows a sparkling diamond necklace from her wealthy friend Mme Forestier to complete her appearance. At the ball she shines — admired, envied, the very picture of elegance. But on returning home, she discovers that the necklace is lost. Rather than confess the truth to Mme Forestier, the couple decide to replace it secretly. They borrow thirty-six thousand francs, buy a similar necklace, and return it without a word. To repay the enormous debt, they dismiss their maid, move into a garret, and labour for ten long years, gradually ageing and growing rough.\n\nAt the end of those ten years, Mathilde meets Mme Forestier by chance and proudly confesses the truth. Mme Forestier, deeply moved, reveals the cruel twist: the original necklace was a cheap fake, worth at most five hundred francs. Ten years of poverty, suffering and lost youth had been paid for an ornament of paste.\n\nThe story thus shows the ruinous power of vanity. Mathilde's love of show and her longing to appear rich push her into dishonesty; her dishonesty, in turn, locks her into a lifetime of misery. Had she simply told Mme Forestier the truth on the very first day, her suffering could have been avoided. Maupassant teaches that honesty and contentment are worth far more than borrowed glitter, and that vanity, once fed, can destroy a life.",
  },
];

export const ENG_DEEP_DIVE: Record<number, string[]> = {
  1: [
    "The story hinges on dramatic irony: Lencho believes only God can help him, never suspecting that 'God's help' actually came from the postmaster and his staff pooling their own money out of pity. The reader knows the truth the whole time Lencho doesn't, which is exactly what makes his angry, ungrateful second letter — accusing the post office employees of stealing part of 'his' money — land as both funny and quietly tragic.",
    "Lopez y Fuentes is making a sharp point about the gap between faith in the abstract and trust in real people: Lencho's faith in God is total and unshaken even after a hailstorm destroys everything, yet his faith in actual human beings is so thin that he assumes the humans who helped him must be thieves. The story asks you to notice that irony rather than just follow the plot.",
    "The postmaster's decision to organise a collection is the story's real moral centre, even though he's a minor character — he's moved not by obligation but by the purity of Lencho's belief, and his generosity costs him something (he gives part of his own salary) precisely because he wants to preserve, not shatter, a poor farmer's faith. That he's rewarded with an accusation of theft is the story's final, bittersweet irony.",
  ],
  2: [
    "Mandela structures the passage around a single symbolic moment — his own presidential inauguration — and then deliberately widens the lens outward from that personal triumph to the collective struggle of thousands of unnamed South Africans who never lived to see it. This move (from 'I' to 'we') is a hallmark of Mandela's rhetorical style: even his greatest personal achievement is framed as belonging to a movement, not to him alone.",
    "The idea of 'twin obligations' — to family and to one's people — is the emotional core of the extract, and it's worth noticing that Mandela doesn't resolve the tension neatly; he's honest that pursuing freedom for millions meant sacrificing time and closeness with his own family. That honesty is what elevates the passage above simple triumphalism into something more reflective.",
    "Mandela's description of freedom is layered, not singular: he distinguishes the freedom to simply live decently (which South Africa's Black population never had) from freedom in a fuller sense — freedom for the oppressor too, since he argues the oppressor is also 'imprisoned' by the hatred and fear that apartheid required. This reframing (freedom as something that liberates both sides) is central to why the extract is remembered as a statement of reconciliation, not just victory.",
  ],
  3: [
    "'His First Flight' works as an extended metaphor for any first attempt at something frightening: the young seagull's fear isn't really about flying, it's about the risk of failure and the unknown, and the story's resolution — he only flies because hunger finally overrides fear — makes a quiet point about how necessity, more than courage, often pushes us past our limits.",
    "'The Black Aeroplane' builds its tension through mystery rather than plot complexity: the pilot narrator never learns who or what saved him, and the story deliberately leaves open whether the black aeroplane was a real pilot, a ghost, or a hallucination born of exhaustion and fear. That ambiguity is the point — the story is less about aviation and more about how people reach for the inexplicable when facing mortal danger.",
    "Reading the two stories side by side, both are 'first flight' stories in different senses — one literal (a bird learning to fly), one about surviving a genuinely dangerous flight through a storm — and both use the sky as a space where a character is stripped of ordinary support and has to rely on something within (instinct, faith, or an unexplained guide) to get through.",
  ],
  4: [
    "Anne's diary works because it's addressed to 'Kitty' as if to a real, trusted friend — this framing device lets her be far more honest than she could be with the people actually around her, which is the whole reason the extract feels so intimate. Her loneliness 'despite having loving parents and a crowd of friends' is a very deliberate distinction the text draws: surrounded by people isn't the same as having someone she can be fully herself with.",
    "The essay-punishment subplot (three essays for talking too much in class) is comic on the surface but reveals something about Anne's character underneath: rather than being cowed by punishment, she turns it into an opportunity for wit, eventually winning over her strict teacher Mr Keesing with a clever essay written from a duckling's point of view. It's a small victory that shows her resilience and intelligence even within a fairly ordinary, restrictive school setting.",
    "It's worth remembering while reading this extract that Anne Frank was in hiding from the Nazis at the time she wrote it, even though this particular excerpt focuses on ordinary school-day concerns — the contrast between the diary's everyday tone and its historical context is part of why it remains so widely read: it shows a teenager being a teenager, in circumstances the reader knows were anything but ordinary.",
  ],
  5: [
    "The three sketches in 'Glimpses of India' — the Goan baker, Coorg, and Assam's tea gardens — are grouped together because each captures a different facet of Indian regional identity through everyday, unglamorous detail rather than grand history: bread-making, coffee-growing, tea-picking. The chapter's implicit argument is that India's diversity is best understood through these small, local, lived traditions, not just through its famous monuments or events.",
    "'A Baker from Goa' is really an elegy for a vanishing tradition — the essay's nostalgic tone signals that the pader (traditional baker) and his way of life are fading even as the essay describes them, which gives what could be a simple description an undercurrent of loss.",
    "'Coorg' and 'Tea from Assam' both use a similar structure: a description of the land's natural beauty paired with the people who live and work there, suggesting that in each region, geography and human culture are inseparable — the coffee, the tea, the food, and the people's temperament are all shown as products of the same place.",
  ],
  6: [
    "The author (Gavin Maxwell) deliberately writes about Mijbil almost as he would a human character — with a distinct personality, sense of humour, and individual quirks — rather than treating him as a generic 'pet'. This choice is what makes the essay work: readers connect with Mijbil not because otters are inherently endearing, but because the writing insists on his specific, individual character.",
    "The flight from Basra to London is the essay's real narrative climax, and it works by putting both author and otter under stress in an unfamiliar, confined setting — the humour and tension of that sequence come from watching a wild, water-loving creature try to cope with an environment (an aeroplane cabin) about as far from his natural habitat as possible.",
    "The reactions of Londoners who can't identify what kind of animal Mijbil is serve a subtle purpose: they highlight just how unfamiliar and exotic this creature is outside its natural context, which indirectly emphasises how remarkable it is that the author has formed such a close, easy relationship with him.",
  ],
  7: [
    "Valli's fascination with the bus, and her secret saving of coins for months, is really a story about a child's yearning for independence and experience in a very restricted, small-village life — the bus ride is a small adventure in absolute terms, but an enormous act of self-assertion for an eight-year-old who has almost no autonomy otherwise.",
    "The turning point of the story — Valli seeing a dead cow by the roadside — deliberately punctures the fantasy she'd built up around the journey. Sudarshan Sanyal uses this moment to remind the reader (and Valli) that the wider world isn't just wonder and excitement; it contains loss and unpleasantness too, and part of growing up is absorbing that without losing your sense of self.",
    "That Valli hides both her fear and her adventure from the adults around her afterward is the story's quiet final note: rather than needing to share the experience to validate it, she keeps it entirely her own, which is arguably the story's real theme — that self-reliance, once tasted, doesn't need an audience.",
  ],
  8: [
    "The frame of the sermon — Kisa Gotami searching house to house for a mustard seed 'from a family that has never known death' — is a teaching device, not a literal quest: the Buddha knows in advance she'll fail to find such a house, and the point is for her to discover for herself, through direct experience rather than being told, that death is universal and not a punishment singling her out.",
    "This teaching method (guided experience rather than direct instruction) reflects a core idea in Buddhist thought presented in the chapter: understanding that comes from insight is more transformative than understanding that's simply handed to you as a fact. Kisa Gotami's grief doesn't disappear because someone tells her 'everyone dies' — it transforms because she personally confirms it, house by house.",
    "The sermon's larger message — that suffering is part of the human condition and clinging to what's impermanent causes pain — connects Kisa Gotami's personal loss to a universal teaching. The story works as a specific, emotionally grounded illustration of an abstract philosophical idea, which is exactly why it's the example chosen to open the Buddha's teaching in this chapter.",
  ],
  9: [
    "Chekhov structures 'The Proposal' as pure farce: Lomov comes to propose marriage — arguably the most significant conversation two people can have — and is derailed not once but twice by absurdly petty disputes (a strip of land neither really needs, whose dog is faster). The comedy comes from the mismatch between the seriousness of the occasion and the triviality of what actually consumes the characters' energy.",
    "All three characters (Lomov, Natalya, Chubukov) are drawn as excitable and self-important in almost identical ways, which is part of the joke — nobody is more 'reasonable' than anyone else, so the audience isn't meant to take sides in the land or dog disputes, just enjoy watching thin-skinned people escalate over nothing.",
    "The ending — Chubukov forcing the couple together mid-argument and declaring them engaged — is deliberately anticlimactic and slightly absurd: even their 'happy ending' happens by accident, in the middle of yet another quarrel, which is Chekhov's final joke about how little the actual proposal mattered compared to the surrounding chaos.",
  ],
  10: [
    "'Dust of Snow' works through understatement — a tiny, almost trivial event (snow falling off a branch) changes the speaker's entire mood — and Frost's point is that meaning and comfort can come from the smallest, most ordinary moments in nature, not just grand ones. The crow, often a symbol of ill omen, is deliberately recast here as the bringer of a small unexpected gift.",
    "'Fire and Ice' condenses a huge question (how might the world end) into just nine lines by using fire and ice as symbols: fire stands for destructive desire and passion, ice for equally destructive hatred and coldness. Frost's twist is that both, seemingly opposite, are equally capable of ending everything — the poem's brevity itself reinforces how casually devastating either force can be.",
    "'A Tiger in the Zoo' builds its emotional force through contrast: each stanza alternates between the tiger's caged, watched, diminished present and imagined glimpses of the power and freedom it should have in the wild. The poem doesn't need to state its argument about captivity directly — the juxtaposition of images does the work. 'How to Tell Wild Animals' takes the opposite tone entirely, using absurd mock-instructions (a lion will definitely eat you first, so you'll know) as a parody of overly serious nature guidebooks. 'The Ball Poem' uses the loss of a literal toy to explore a much larger idea — that learning to bear loss, quietly and alone, is part of growing up, and that a parent stepping in to 'fix' the loss would rob the child of that lesson.",
  ],
  11: [
    "James Herriot builds the story's humour around a very deliberate contrast: Mrs Pumphrey's excessive, misguided love for Tricki (feeding him rich food, indulging every whim) is precisely what's making the dog sick, while the plain, disciplined regime at the veterinary hospital — exactly the opposite of indulgence — is what cures him. The story is gently satirising over-pampering as a form of neglect disguised as love.",
    "The title 'A Triumph of Surgery' is ironic — there's no actual surgery in the story at all. Tricki recovers purely through diet and exercise, and the title's irony pokes fun at Mrs Pumphrey's assumption that anything serious enough to worry about must require something as dramatic as surgery, when the real cure was simply removing the excess she herself had created.",
    "Tricki thriving among the other hospital dogs — eating from a shared bowl, playing and exercising with them — makes a quieter point about the value of a normal, social environment over isolated, over-attended luxury; the story suggests dogs (and by extension, perhaps children) can suffer from too much individual attention just as much as from too little.",
  ],
  12: [
    "Ruskin Bond builds the story around a genuine moral turning point rather than an external one: nothing forces the thief to return the stolen money — no one has caught him, no police are involved — his conscience alone, newly awakened by Anil's unexpected trust and kindness, makes him change course. The story is really about how being trusted (perhaps for the first time) can reshape someone's sense of who they are.",
    "The specific things Anil teaches the thief — cooking, writing his own name, doing sums — matter because they're not charity in the usual sense; they're skills that give the thief real, lasting value and independence, which is part of why the thief comes to see Anil differently from anyone he's stolen from before. Stealing from someone who's actually invested in your future feels different from stealing from a stranger.",
    "The ending, where Anil rewards the thief with money and the offer of regular pay rather than confronting him about the theft, suggests Anil may have suspected all along — his generosity reads less as naivety and more as a deliberate second chance, which reframes the entire story as being as much about Anil's quiet wisdom as the thief's redemption.",
  ],
  13: [
    "The story's suspense depends entirely on Ausable's calm improvisation under real danger — with an armed rival agent in his room, he invents an entirely fictional balcony and an imaginary secret police caller, and the tension comes from watching whether Max will believe an increasingly elaborate lie with no time to verify it.",
    "What makes Ausable different from the reader's expectation of a 'secret agent' is explicitly set up early in the story — Fowler is disappointed that Ausable seems ordinary, unglamorous, nothing like a spy in fiction. That deliberate subversion pays off in the climax: Ausable's real skill isn't gadgets or gunplay, it's quick, convincing improvisation, which is a quieter and more believable kind of heroism than the genre usually offers.",
    "Max's fatal mistake — leaping onto a balcony that doesn't exist — only makes sense because the story has carefully established that Max has no way to check Ausable's claim himself in the moment; the entire plan works by exploiting Max's own fear and need to act fast, turning his aggression into the tool of his own downfall.",
  ],
  14: [
    "Horace Danby's introduction as a mild, respectable, elderly locksmith who happens to rob exactly one house a year is a deliberate contradiction the story wants you to notice — his crime is oddly disciplined and almost genteel, funding a harmless hobby (rare books) rather than any lavish or desperate need, which makes him easy to sympathise with even though he's a thief.",
    "The title 'A Question of Trust' cuts two ways, and that double meaning is the story's real cleverness: Horace has to trust the woman at Shotover Grange (believing her claim to be the homeowner) to get the safe combination, while the story is simultaneously commenting on how his entire profession as a locksmith — a job built around being trusted with people's most valuable possessions — is what makes him vulnerable to being deceived by someone playing the exact same trust-based con he himself has built a career around.",
    "The final reveal — that the woman was herself a thief, using Horace as an unwitting tool to open a safe she couldn't open herself — completes the story's central irony: a professional trust-breaker (the burglar) is undone by trusting the wrong person, which is a fate the story implies he should have been better positioned than most to see coming.",
  ],
  15: [
    "H. G. Wells builds Griffin's invisibility as a curse rather than a gift almost immediately, and that inversion is the chapter's central idea: everything invisibility should make easy (moving unseen, taking what he wants) instead isolates him completely — he can't be clothed, can't be warm, can't be recognised or helped by anyone, and every human contact becomes a threat of discovery rather than a comfort.",
    "The chapter is deliberately structured as a chase, with Griffin's actions escalating from petty theft (clothes, food) to genuine menace, which shifts the reader's sympathy away from him over the course of the narrative — what starts as a scientific curiosity becomes something closer to a threat that an ordinary village community, with nothing more than boys and a dog, is eventually able to corner.",
    "That an 'ordinary' dog can track and expose Griffin despite his invisibility is the story's pointed irony: Griffin's scientific triumph over sight itself is defeated by something as basic and undramatic as smell — a reminder that outsmarting one human sense doesn't make you undetectable altogether.",
  ],
  16: [
    "The essay traces a very specific, repeatable arc worth noticing: curiosity (collecting butterflies as a child) becomes structured inquiry (tagging butterflies, testing a real hypothesis) becomes a genuine scientific contribution (the gold-spots research) — the chapter is less about one gifted child and more a case study in how scientific habits of mind actually develop, step by step, from ordinary childhood interest.",
    "Ebright's mother is a quietly important figure in the narrative: rather than pushing him toward achievement, she supports his interests by giving him resources (a book, encouragement) at the right moments without directing the outcome — the essay implies that this kind of open-ended support, not pressure, is what let his curiosity develop into real scientific skill.",
    "The specific detail that his high-school project on monarch butterfly pupae (not a university lab) won him national recognition matters because it undercuts the idea that serious science requires formal credentials before it can begin — the chapter's implicit argument is that rigorous curiosity, applied early and seriously, is itself a kind of scientific training.",
  ],
  17: [
    "Maupassant sets up Mathilde's central flaw precisely: she isn't poor in any absolute sense (she has a comfortable middle-class life, a devoted husband) but she suffers because she measures herself against a wealth and status she doesn't have, which makes her unhappiness self-inflicted rather than circumstantial — the story is a study in the corrosive effect of constant comparison and unmet aspiration.",
    "The borrowed necklace is the story's central irony made physical: Mathilde borrows the *symbol* of wealth to feel wealthy for one night, and the ten years of real poverty she and her husband endure to replace it are the exact opposite of what she was chasing — genuine, grinding hardship in pursuit of an illusion of glamour.",
    "The final twist — that the original necklace was fake and worth almost nothing — is devastating specifically because it retroactively makes the Loisels' entire decade of suffering pointless; Maupassant's point isn't just 'be careful what you wish for', it's that Mathilde's whole value system (judging worth by appearance) was hollow from the very beginning, symbolised by a necklace that looked precious but never was.",
  ],
};
