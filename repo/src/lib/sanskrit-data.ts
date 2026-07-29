// Original CBSE-pattern Sanskrit (Shemushi + Vyakaranvidhi) content for Class 10
// Aligned to NCERT 2026-27 syllabus structure. All shlokas are public-domain
// traditional verses (Bhagavadgita, Panchatantra, Hitopadesha, Subhashitas)
// or original compositions. No NCERT textbook text reproduced verbatim.

export type SKTSubject = "sanskrit";
export type SKTDiff = "easy" | "medium" | "hard";

export interface SKTChapter {
  id: number;
  num: string;
  title: string;
  subj: "sanskrit";
  oneshot: string[];
  keypts: string[];
  formulas: string; // multi-line Key Grammar notes
  exam: string[];
}

export interface SKTMCQ {
  id: number;
  ch: number;
  subj: "sanskrit";
  diff: SKTDiff;
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}

export interface SKTQA {
  id: number;
  ch: number;
  subj: "sanskrit";
  marks: 2 | 3 | 5;
  q: string;
  a: string;
}

export interface SKTTranslationEx {
  id: number;
  sanskrit: string;
  hint: string;
}

// ============================================================
// SKT_CHAPTERS — 12 Shemushi chapters
// ============================================================
export const SKT_CHAPTERS: SKTChapter[] = [
  {
    id: 1,
    num: "Ch 1",
    title: "शुचिपर्यावरणम्",
    subj: "sanskrit",
    oneshot: [
      "Theme: importance of a clean, pure environment for human well-being (शुचि = clean, पर्यावरणम् = environment).",
      "Pollution of air, water and soil is caused by human negligence — वायु:, जलम्, भूमि: च दूषिताः।",
      "Trees and rivers are called the 'friends of life' — वृक्षाः जलम् च जीवनस्य मित्रे।",
      "Call to action: plant trees, avoid plastic, keep surroundings clean — वृक्षारोपणम् कुरुत, प्लास्टिकं वर्जयत।",
    ],
    keypts: [
      "शुचि (shuchi) — purity / cleanliness; पर्यावरणम् (paryāvaraṇam) — surroundings, environment.",
      "Key nouns: वायु: (air), जलम् (water), भूमि: (earth), आकाश: (sky), अग्नि: (fire) — the पञ्चमहाभूतानि.",
      "Verbs of action: रोपयति (plants), वर्जयति (avoids), रक्षति (protects), दूषयति (pollutes).",
      "Moral: प्रकृति: माता अस्माकम् (Nature is our mother) — तां रक्षणीया।",
      "Grammar focus: तृतीया विभक्ति (instrumental) — वृक्षै: (by trees), जलेन (by water).",
    ],
    formulas: `Key Grammar — Chapter 1 (शुचिपर्यावरणम्)
─────────────────────────────────────────
सन्धि: (Sandhi)
  • शुचि + पर्यावरणम् = शुचिपर्यावरणम्  (इ-विसर्ग-सन्धि / इ->इ, visarga drops)
  • वायु + अपि = वायुरपि  (उ-विसर्ग → र्, उत्व-सन्धि)
  • परि + आवरणम् = पर्यावरणम्  (इ-आ → य-आ, यण्-सन्धि)

शब्दरूप: वृक्ष (पुंलिङ्ग, ending in अ)
  एकवचनम्: वृक्ष:, वृक्षम्, वृक्षेण, वृक्षाय, वृक्षात्, वृक्षस्य, वृक्षे
  बहुवचनम्: वृक्षा:, वृक्षान्, वृक्षै:, वृक्षेभ्य:, वृक्षेभ्य:, वृक्षाणाम्, वृक्षेषु

धातुरूप: रक्ष् (to protect) — लट् लकार (present)
  रक्षामि, रक्षाव:, रक्षाम:
  रक्षसि, रक्षथ:, रक्षथ
  रक्षति, रक्षत:, रक्षन्ति

समास: (Compound)
  • पञ्चमहाभूतानि = पञ्च महान्ति भूतानि (कर्मधारय: + उपपद-तत्पुरुष:)
  • वृक्षारोपणम् = वृक्षाणां रोपणम् (षष्ठी-तत्पुरुष:)`,
    exam: [
      "Translate 2-3 simple sentences on environment into Sanskrit using वृक्ष/जल/वायु vocabulary.",
      "Identify sandhi in 'पर्यावरणम्' and 'वायुरपि' — board-favourite.",
      "Write 5 lines on 'पर्यावरण-रक्षणम्' using लट्-लकार (present tense) verbs.",
    ],
  },
  {
    id: 2,
    num: "Ch 2",
    title: "स्पृशति पाणिना...",
    subj: "sanskrit",
    oneshot: [
      "Theme: hand-hygiene and health — स्पृशति पाणिना = 'touches with the hand'.",
      "Washing hands with soap prevents disease — मलजन्ताः रोगाः पाणिभ्याम् आगच्छन्ति।",
      "Cleanliness is half of health — आयुर्वेदः कथयति — 'स्वच्छता आरोग्यस्य अर्धम्'.",
      "Daily routine (दिनचर्या) includes bath, brushing, nail-care — स्नानं, दन्तधावनं, नखसंरक्षणं च।",
    ],
    keypts: [
      "स्पृशति (sparśati) — touches; पाणिना (pāṇinā) — with the hand (तृतीया विभक्ति, एकवचनम्).",
      "रोग: (disease), आरोग्यम् (health), स्वच्छता (cleanliness), साबुनम् (soap), जलम् (water).",
      "Verbs: धावति (washes), स्पृशति (touches), रक्षति (protects), आगच्छति (comes).",
      "Proverb: स्वस्थशरीरे सुखं वसति — happiness dwells in a healthy body.",
      "Grammar focus: करण-कारकम् (instrumental case) — पाणिना, साबुनेन, जलेन.",
    ],
    formulas: `Key Grammar — Chapter 2 (स्पृशति पाणिना)
─────────────────────────────────────────
सन्धि:
  • पाणि + ना = पाणिना  (इ-ण् → इन् + आ, इ-आ सन्धि with ण् at junction — actually पाणिन्-शब्द)
  • स्व + अस्थ = स्वास्थ  (अ-अ → आ, वृद्धि-सन्धि)
  • आयु: + वेद: = आयुर्वेद:  (अ-विसर्ग → र्, visarga-sandhi)

शब्दरूप: पाणिन् (पुंलिङ्ग, ending in इन्)
  एकवचनम्: पाणि:, पाणिनं, पाणिना, पाणिने, पाणिन:, पाणिन:, पाणिनि
  बहुवचनम्: पाणिन:, पाणिन:, पाणिभि:, पाणिभ्य:, पाणिभ्य:, पाणिनाम्, पाणिषु

धातुरूप: स्पृश् (to touch) — लट् लकार
  स्पृशामि, स्पृशाव:, स्पृशाम:
  स्पृशसि, स्पृशथ:, स्पृशथ
  स्पृशति, स्पृशत:, स्पृशन्ति

कारकम्: करण-कारकम् → तृतीया विभक्ति:
  पाणिना (with hand), साबुनेन (with soap), जलेन (with water), करेण (with hand)

समास: दन्तधावनम् = दन्तानां धावनम् (षष्ठी-तत्पुरुष:)`,
    exam: [
      "Translate a short paragraph on hygiene into English/Sanskrit (board-favourite).",
      "Give 5 forms of 'पाणिन्' in singular — singular paradigm is often asked.",
      "Identify करण-कारकम् in a sentence — पाणिना, साबुनेन are key.",
    ],
  },
  {
    id: 3,
    num: "Ch 3",
    title: "गोदोहनम्",
    subj: "sanskrit",
    oneshot: [
      "Theme: the rural Indian scene of milking a cow at dawn — गो: (cow) + दोहनम् (milking).",
      "The cow is revered as 'गोमाता' — provider of milk, ghee, curd — क्षीरम्, घृतम्, दधि च।",
      "Village life revolves around agriculture and cattle — ग्रामे कृषि: पशुपालनं च मुख्ये।",
      "Lesson: respect for animals and dignity of labour — पशूनां प्रति दया भवेत्।",
    ],
    keypts: [
      "गो: (cow, in सम्बोधन/षष्ठी), दोहनम् (milking), क्षीरम् (milk), ग्राम: (village).",
      "गोमाता (gaurmata — cow mother), गोपाल: (cowherd), गोशाला (cowshed).",
      "Verbs: दुग्धं (milk, n.) — धातु: दुह् (to milk); गच्छति (goes), क्षीरते (yields milk).",
      "Time words: प्रात:, सायम्, मध्याह्ने, रात्रौ (at dawn, evening, noon, night).",
      "Grammar focus: सप्तमी विभक्ति (locative) — ग्रामे (in village), गोशालायाम् (in cowshed).",
    ],
    formulas: `Key Grammar — Chapter 3 (गोदोहनम्)
─────────────────────────────────────────
सन्धि:
  • गो + दोहनम् = गोदोहनम्  (ओ-द → ओ-द, no change; junction consonant smooth)
  • गो + माता = गोमाता  (ओ-म → ओ-म, avargīya — direct junction)
  • पशु + पालनम् = पशुपालनम्  (उ-प → उ-प, no change)

शब्दरूप: गो: (स्त्रीलिङ्ग, irregular noun)
  एकवचनम्: गौ, गाम्, गया/गोभ्याम्, गवे/गोभ्याम्, गो:, गो:, गौ/गोषु
  बहुवचनम्: गाव:, गा:, गोभि:, गोभ्य:, गोभ्य:, गोनाम्, गोषु

धातुरूप: दुह् (to milk) — लट् लकार (परस्मैपदम्)
  दोग्धि (3rd sing.), दुग्धम् (milk — past passive participle)
  दुह्मि, दुह्व:, दुह्म:
  दोक्षि, दुह्थ:, दुह्थ
  दोग्धि, दुग्ध:, दुग्धन् / दुहन्ति

विभक्ति: सप्तमी (Locative — 'in/at')
  ग्रामे (in village), गोशालायाम् (in cowshed), क्षेत्रे (in field)

समास: गोदोहनम् = गो: दोहनम् (षष्ठी-तत्पुरुष:)`,
    exam: [
      "Write 5 lines on 'ग्रामजीवनम्' (village life) using सप्तमी-विभक्ति.",
      "Translate: 'गोमाता क्षीरं यच्छति' — explain the case of 'गोमाता'.",
      "Sandhi-vigrah of 'गोदोहनम्' and 'गोमाता' — frequent board question.",
    ],
  },
  {
    id: 4,
    num: "Ch 4",
    title: "शिशुलालनम्",
    subj: "sanskrit",
    oneshot: [
      "Theme: nurturing and caring for a young child — शिशु: (infant) + लालनम् (nurturing).",
      "A child learns through play, love, and imitation — शिशु: क्रीडया शिक्षते, प्रेम्णा वर्धते।",
      "Mother's lullaby (लालन-गीतम्) shapes early character — मातु: गीतं शिशो: मनः सुधरति।",
      "Lesson: childhood is the foundation of life — बाल्यम् जीवनस्य मूलम्।",
    ],
    keypts: [
      "शिशु: (infant), बालक: (boy), बालिका (girl), लालनम् (nurturing), क्रीडा (play).",
      "माता (mother), पिता (father), जननी (mother — formal), जनक: (father — formal).",
      "Verbs: क्रीडति (plays), वर्धते (grows), शिक्षते (learns), स्वपिति (sleeps).",
      "Proverb: बाल्यात् शिक्षणम् — 'education begins in childhood'.",
      "Grammar focus: सम्बोधन-विभक्ति (vocative) — हे शिशे! हे बालक! हे मात:!",
    ],
    formulas: `Key Grammar — Chapter 4 (शिशुलालनम्)
─────────────────────────────────────────
सन्धि:
  • शिशु + लालनम् = शिशुलालनम्  (उ-ल → उ-ल, smooth junction)
  • बाल + यम् = बाल्यम्  (अ-य → अ-य; 'बाल' + 'य' with ल्-य व्यञ्जन)
  • क्रीड + आ = क्रीडा  (अ-आ → आ, वृद्धि-सन्धि)

शब्दरूप: बालक (पुंलिङ्ग, ending in अ)
  एकवचनम्: बालक:, बालकम्, बालकेन, बालकाय, बालकात्, बालकस्य, बालके, हे बालक
  द्विवचनम्: बालकौ, बालकौ, बालकाभ्याम्, बालकाभ्याम्, बालकाभ्याम्, बालकयो:, बालकयो:, हे बालकौ
  बहुवचनम्: बालका:, बालकान्, बालकै:, बालकेभ्य:, बालकेभ्य:, बालकानाम्, बालकेषु, हे बालका:

धातुरूप: क्रीड् (to play) — लट् लकार
  क्रीडामि, क्रीडाव:, क्रीडाम:
  क्रीडसि, क्रीडथ:, क्रीडथ
  क्रीडति, क्रीडत:, क्रीडन्ति

सम्बोधन-विभक्ति (Vocative):
  हे शिशे! (O child! — अ-ending noun, सम्बोधन-एकवचनम्)
  हे बालक! (O boy!) — हे बालकौ (O two boys!) — हे बालका: (O boys!)

समास: लालन-गीतम् = लालनस्य गीतम् (षष्ठी-तत्पुरुष:)`,
    exam: [
      "Conjugate 'क्रीड्' in लट्-लकार (all 9 forms) — board-favourite.",
      "Translate: 'हे बालक! पठ' — identify सम्बोधन-विभक्ति.",
      "Explain the theme of शिशुलालनम् in 3-4 Sanskrit sentences.",
    ],
  },
  {
    id: 5,
    num: "Ch 5",
    title: "जननी तु गुरुः",
    subj: "sanskrit",
    oneshot: [
      "Theme: the mother is the first guru (teacher) of a child — जननी (mother) तु (indeed) गुरु: (guru).",
      "A mother's love, sacrifice and values shape the child's character — मातु: प्रेम त्याग: च बालकं सुसंस्कृतम् कुरुतः।",
      "Even great warriors and sages bowed to their mothers — युधिष्ठिर:, राम:, श्रीकृष्ण: च मातृभक्ता: आसन्।",
      "Lesson: मातृदेवो भव — 'let the mother be a god unto you' (तैत्तिरीय-उपनिषद्).",
    ],
    keypts: [
      "जननी (jananī — mother), गुरु: (guru — teacher), माता (mātā), शिष्य: (student).",
      "प्रेम (love), त्याग: (sacrifice), संस्कार: (values), सेवा (service), भक्ति: (devotion).",
      "Verbs: भव (be! — imperative of भू), कुरुत: (two of them do), आसन् (they were).",
      "Proverb (तैत्तिरीय-उपनिषद्): मातृदेवो भव · पितृदेवो भव · आचार्यदेवो भव।",
      "Grammar focus: लोट्-लकार (imperative mood) — भव (be!), पठ (read!), गच्छ (go!).",
    ],
    formulas: `Key Grammar — Chapter 5 (जननी तु गुरु:)
─────────────────────────────────────────
सन्धि:
  • जननी + तु = जननी तु  (ई-त → ई-त, no sandhi — vowels and consonants of different vargas don't merge)
  • मातृ + देव: = मातृदेव:  (ऋ-द → ऋ-द, no change; ऋ is treated as consonant-vowel)
  • आचार्य + देव: = आचार्यदेव:  (अ-द → अ-द, smooth)

शब्दरूप: मातृ (स्त्रीलिङ्ग, ending in ऋ — मातृ)
  एकवचनम्: माता, मातरम्, मात्रा, मात्रे, मातु:, मातु:, मातरि
  बहुवचनम्: मातर:, मातृ:, मातृभि:, मातृभ्य:, मातृभ्य:, मातृणाम्, मातृषु

धातुरूप: भू (to be) — लोट् लकार (Imperative — 'let/be!')
  भवानि/भव, भवाव, भवाम
  भव, भवतम्, भवत
  भवतु, भवताम्, भवन्तु

समास: मातृभक्ति: = मातुः भक्ति: (षष्ठी-तत्पुरुष:)
  मातृदेव: = माता एव देव: (अव्ययीभाव: / कर्मधारय:)

उपनिषद्-वाक्यम्:
  मातृदेवो भव  = माता देव: भव (माता becomes your deity) — कर्मधारय-समास:`,
    exam: [
      "Conjugate 'भू' in लोट्-लकार (imperative) — very common board question.",
      "Explain the meaning of 'मातृदेवो भव' with sandhi-vigrah.",
      "Write 5 forms of 'मातृ' shabda in singular — paradigm is asked.",
    ],
  },
  {
    id: 6,
    num: "Ch 6",
    title: "सूक्तिस्तबकः",
    subj: "sanskrit",
    oneshot: [
      "Theme: a bouquet (स्तबक:) of wise sayings (सूक्ति:) — subhashita literature.",
      "Subhashitas teach dharma, morality, friendship, and good conduct in 1-2 lines.",
      "Famous themes: time-management, truth, gratitude, choice of friends.",
      "Lesson: सुभाषितं सुजनस्य वाणी — the wise person's speech is itself a subhashita.",
    ],
    keypts: [
      "सूक्ति: (sūkti — wise saying), स्तबक: (stabaka — bouquet), सुभाषितम् (subhāṣita).",
      "Common subhashita subjects: काल: (time), मित्रम् (friend), सत्यम् (truth), विद्या (knowledge).",
      "Famous source texts: नीतिशतकम् (भर्तृहरि:), पञ्चतन्त्रम्, हितोपदेश:, वैराग्यशतकम्.",
      "Key verbs: वदति (says), गच्छति (goes), तिष्ठति (stays), जयति (wins).",
      "Grammar focus: उपपद-समासा: and बहुव्रीहि-समासा: — common in subhashitas.",
    ],
    formulas: `Key Grammar — Chapter 6 (सूक्तिस्तबकः)
─────────────────────────────────────────
सन्धि:
  • सूक्ति + स्तबक: = सूक्तिस्तबक:  (इ-स → इ-स, with visarga → 'इस्')
  • सु + भाषितम् = सुभाषितम्  (उ-भ → उ-भ; सु is उपसर्ग: prefix)
  • सु + उक्ति: = सूक्ति:  (उ-उ → ऊ, वृद्धि-सन्धि)

शब्दरूप: सखि (पुंलिङ्ग, ending in इ — 'friend')
  एकवचनम्: सखा, सखायम्/सखि, सखिना, सखिने, सख्यु:, सख्यु:, सख्यौ/सखरि
  बहुवचनम्: सखाय:, सखीन्, सखिभि:, सखिभ्य:, सखिभ्य:, सखिनाम्, सखिषु

धातुरूप: वद् (to speak) — लट् लकार
  वदामि, वदाव:, वदाम:  /  वदसि, वदथ:, वदथ  /  वदति, वदत:, वदन्ति

समासा: (Compounds — board-favourite):
  • बहुव्रीहि:: दशानन: = दश आननानि यस्य स: (one whose faces are ten — Ravana)
  • बहुव्रीहि:: नीलकण्ठ: = नील: कण्ठ: यस्य स: (Shiva, who has a blue throat)
  • कर्मधारय:: नीलोत्पलम् = नीलम् उत्पलम् (a blue lotus)
  • तत्पुरुष:: राजपुरुष: = राज्ञः पुरुष: (the king's man)
  • द्वन्द्व:: मातापितरौ = माता च पिता च (mother and father)
  • अव्ययीभाव:: यथाशक्ति = यथा शक्ति (according to ability)

सुभाषितम् (sample — public-domain):
  विद्या ददाति विनयम्, विनयाद् याति पात्रताम्।
  पात्रत्वाद् धनमाप्नोति, धनाद् धर्मं ततः सुखम्॥
  (Knowledge gives humility; humility, worthiness; worthiness, wealth;
   wealth, righteousness; and righteousness, happiness.)`,
    exam: [
      "Identify समास-प्रकार: for: दशानन:, नीलकण्ठ:, मातापितरौ — board-favourite.",
      "Translate a 2-line subhashita into English/Hindi and explain its moral.",
      "Sandhi-vigrah of 'सूक्तिस्तबक:' and 'सुभाषितम्'.",
    ],
  },
  {
    id: 7,
    num: "Ch 7",
    title: "भारतमहिमा",
    subj: "sanskrit",
    oneshot: [
      "Theme: the glory of India (भारत-महिमा) — its culture, rivers, mountains and sages.",
      "India's sacred rivers — गङ्गा, यमुना, सरस्वती, नर्मदा, गोदावरी, कावेरी — purify the land.",
      "The Himalayas crown the north — हिमालय: भारतस्य मुकुटम् इव।",
      "Lesson: a nation is known by its culture — संस्कृति: राष्ट्रस्य आत्मा।",
    ],
    keypts: [
      "भारतम् (India), महिमा (glory), संस्कृति: (culture), राष्ट्रम् (nation), आत्मा (soul).",
      "Rivers: गङ्गा (Ganga), यमुना (Yamuna), सरस्वती (Saraswati), नर्मदा (Narmada).",
      "Mountains: हिमालय: (Himalayas), विन्ध्य: (Vindhyas), सह्याद्रि: (Western Ghats).",
      "Sages: वशिष्ठ:, विश्वामित्र:, अगस्त्य:, व्यास: — preservers of the Vedas.",
      "Grammar focus: सप्तमी-विभक्ति (locative) — भारते (in India), हिमालये (in Himalaya).",
    ],
    formulas: `Key Grammar — Chapter 7 (भारतमहिमा)
─────────────────────────────────────────
सन्धि:
  • भारत + महिमा = भारतमहिमा  (त-म → त-म, smooth junction)
  • सं + स्कृति: = संस्कृति:  (अनुस्वार-सन्धि, सम् + स्कृति)
  • राष्ट्र + आत्मा = राष्ट्रात्मा  (अ-आ → आ, वृद्धि-सन्धि)

शब्दरूप: नदी (स्त्रीलिङ्ग, ending in ई — 'river')
  एकवचनम्: नदी, नदीम्, नद्या, नद्यै, नद्या:, नद्या:, नद्याम्
  बहुवचनम्: नद्य:, नदी:, नदीभि:, नदीभ्य:, नदीभ्य:, नदीनाम्, नदीषु

धातुरूप: पवित्री-करोति (purifies) — derived from कृ (to do)
  करोमि, कुर्व:, कुर्म:  /  करोषि, कुरुथ:, कुरुथ  /  करोति, कुरुत:, कुर्वन्ति

विभक्ति: सप्तमी (Locative — 'in/at')
  भारते (in India), हिमालये (in Himalaya), गङ्गायाम् (in the Ganga), नद्याम् (in the river)

समास: भारतमहिमा = भारतस्य महिमा (षष्ठी-तत्पुरुष:)
  सह्याद्रि: = सह्यस्य आद्रि: (षष्ठी-तत्पुरुष:)

विशेषण-विशेष्यम् (adjective-noun agreement):
  पवित्रा गङ्गा (holy Ganga — स्त्रीलिङ्ग, प्रथमा)
  पवित्रे जले (in holy water — नपुंसकलिङ्ग, सप्तमी)
  पवित्र: हिमालय: (holy Himalaya — पुंलिङ्ग, प्रथमा)`,
    exam: [
      "List 5 Indian rivers and mountains in Sanskrit (1-mark MCQ-friendly).",
      "Translate: 'भारते सप्त नद्यः प्रसिद्धाः' — explain the case of 'भारते'.",
      "Conjugate 'कृ' (to do) in लट्-लकार — board-favourite.",
    ],
  },
  {
    id: 8,
    num: "Ch 8",
    title: "पर्यावरणम्",
    subj: "sanskrit",
    oneshot: [
      "Theme: environment (पर्यावरणम्) — air, water, soil, flora, fauna as an interdependent web.",
      "Five elements (पञ्चमहाभूतानि) — पृथ्वी, आप:, तेज:, वायु:, आकाश: — sustain life.",
      "Pollution (प्रदूषणम्) disturbs this balance — वायुदूषणं, जलदूषणं, भूमि-दूषणं च।",
      "Lesson: प्रकृतिं रक्ष, मानवं रक्ष — protect nature, protect humanity.",
    ],
    keypts: [
      "पर्यावरणम् (environment), प्रदूषणम् (pollution), प्रकृति: (nature), सन्तुलनम् (balance).",
      "Five elements: पृथ्वी (earth), आप:/जलम् (water), तेज:/अग्नि: (fire), वायु: (air), आकाश: (space).",
      "Causes of pollution: वाहनानि (vehicles), कलकारखानानि (factories), प्लास्टिकम् (plastic).",
      "Solutions: वृक्षारोपणम् (tree plantation), पुनर्चक्रीकरणम् (recycling), जनजागरणम् (awareness).",
      "Grammar focus: कर्तरि-प्रयोग: (active) vs कर्मणि-प्रयोग: (passive) voice.",
    ],
    formulas: `Key Grammar — Chapter 8 (पर्यावरणम्)
─────────────────────────────────────────
सन्धि:
  • परि + आवरणम् = पर्यावरणम्  (इ-आ → य-आ, यण्-सन्धि)
  • प्र + उषणम् = प्रोषणम् (no — प्रदूषणम् = प्र + दूषणम्, prefix प्र)
  • पञ्च + महा + भूतानि = पञ्चमहाभूतानि  (compound — see समास)

शब्दरूप: जल (नपुंसकलिङ्ग, ending in अ)
  एकवचनम्: जलम्, जलम्, जलेन, जलाय, जलात्, जलस्य, जले
  बहुवचनम्: जलानि, जलानि, जलै:, जलेभ्य:, जलेभ्य:, जलानाम्, जलेषु

धातुरूप: रक्ष् (to protect) — कर्तरि (active) and कर्मणि (passive)
  कर्तरि: रक्षामि / रक्षसि / रक्षति (I/you/he protect)
  कर्मणि: रक्ष्यते (is protected) — लट् कर्मणि-प्रयोग:
  • वृक्षा: रक्ष्यन्ते (trees are protected — बहुवचनम् कर्मणि)
  • जलं रक्ष्यते (water is protected — एकवचनम् कर्मणि)

वाच्यम् (Voice):
  कर्तरि:  मानव: प्रकृतिं रक्षति  (Human protects nature)
  कर्मणि:  प्रकृति: मानवेन रक्ष्यते  (Nature is protected by the human)

समास:
  • पञ्चमहाभूतानि = पञ्च महान्ति भूतानि (कर्मधारय: + उपपद-तत्पुरुष:)
  • वायुदूषणम् = वायोः दूषणम् (षष्ठी-तत्पुरुष:)
  • वृक्षारोपणम् = वृक्षाणाम् रोपणम् (षष्ठी-तत्पुरुष:)`,
    exam: [
      "Convert an active Sanskrit sentence to passive (कर्मणि-प्रयोग:) — board-favourite.",
      "Identify समास-प्रकार: of 'वायुदूषणम्' and 'वृक्षारोपणम्'.",
      "Write 5 lines on 'पर्यावरण-रक्षणम्' using कर्मणि-प्रयोग:.",
    ],
  },
  {
    id: 9,
    num: "Ch 9",
    title: "वाङ्मनसोर्मयूखः",
    subj: "sanskrit",
    oneshot: [
      "Theme: speech (वाक्) and mind (मनस्) are the twin rays (मयूख:) of consciousness.",
      "Words spoken thoughtfully heal; words spoken carelessly wound — वाचं मनसा शास्ति य: स सुधी:।",
      "Control of speech (वाग्निग्रह:) and control of mind (मनोनिग्रह:) are yogic disciplines.",
      "Lesson: यद् वदसि तत् कुरु — 'do as you say'; speech and action must align.",
    ],
    keypts: [
      "वाक् (vāk — speech), मनस् (manas — mind), मयूख: (mayūkha — ray), युग्मम् (pair).",
      "शब्द: (word), अर्थ: (meaning), भाव: (emotion), सत्यम् (truth), असत्यम् (untruth).",
      "Verbs: वदति (speaks), चिन्तयति (thinks), शृणोति (hears), पश्यति (sees), करोति (does).",
      "Proverb: वाग्मित्वं न पणितव्यम् — speech is not to be traded (i.e., don't misuse words).",
      "Grammar focus: सप्तमी-विभक्ति and तृतीया-विभक्ति contrasts — मनसा (with mind), वाचा (with speech).",
    ],
    formulas: `Key Grammar — Chapter 9 (वाङ्मनसोर्मयूखः)
─────────────────────────────────────────
सन्धि:
  • वाक् + मनसो: + मयूख: = वाङ्मनसोर्मयूख:
    - वाक् + म = वाङ्म (क् → ङ् before म, by च-ज-वर्ण substitution)
    - मनस् + ओ: = मनसो: (ऋ/स्-ending, षष्ठी-द्विवचनम्)
  • मनस् + निग्रह: = मनोनिग्रह:  (स्-न → ओ-न by visarga-sandhi: स्/र् → ओ)
  • वाक् + अग्नि + ग्रह: = वाग्निग्रह:  (क्-अ → ग्-अ, झलां जशोऽतः)

शब्दरूप: वाच् (स्त्रीलिङ्ग, ending in च् — 'speech')
  एकवचनम्: वाक्, वाचम्, वाचा, वाचे, वाच:, वाच:, वाचि
  बहुवचनम्: वाच:, वाच:, वाग्भि:, वाग्भ्य:, वाग्भ्य:, वाचाम्, वाक्षु

शब्दरूप: मनस् (नपुंसकलिङ्ग, ending in स् — 'mind' — from मन्-धातु)
  एकवचनम्: मन:, मन:, मनसा, मनसे, मनस:, मनस:, मनसि
  बहुवचनम्: मनांसि, मनांसि, मनोभि:, मनोभ्य:, मनोभ्य:, मनसाम्, मनःसु

धातुरूप: चिन्त् (to think) — लट् लकार
  चिन्तयामि, चिन्तयाव:, चिन्तयाम:  /  चिन्तयसि, चिन्तयथ:, चिन्तयथ  /  चिन्तयति, चिन्तयत:, चिन्तयन्ति

विभक्ति: तृतीया (Instrumental — 'with/by')
  मनसा (with mind), वाचा (with speech), बुद्ध्या (with intellect)

समास:
  • वाग्निग्रह: = वाचः निग्रह: (षष्ठी-तत्पुरुष:)
  • मनोनिग्रह: = मनसः निग्रह: (षष्ठी-तत्पुरुष:)
  • वाङ्मनसोर्मयूख: = वाचः मनसोः च मयूखः (द्वन्द्व + षष्ठी-तत्पुरुष:)`,
    exam: [
      "Sandhi-vigrah of 'वाङ्मनसोर्मयूख:' — high-yield board question.",
      "Conjugate 'चिन्त्' (to think) in लट्-लकार.",
      "Write 5 forms of 'मनस्' (mind) noun — paradigm is asked.",
    ],
  },
  {
    id: 10,
    num: "Ch 10",
    title: "अनया अकृतम्",
    subj: "sanskrit",
    oneshot: [
      "Theme: heroism and capability of women — 'अनया अकृतम्' = 'has she not done it?' (rhetorical).",
      "Indian tradition honours women of valour — लक्ष्मीबाई, राणी चेन्नम्मा, अहल्याबाई, सरोजिनी नायडु."
    ],
    keypts: [
      "अनया (anayā — by her, तृतीया-एकवचनम् of इदम्), अकृतम् (akṛtam — was not done).",
      "Heroines: राणी लक्ष्मीबाई (Rani Lakshmibai), राणी चेन्नम्मा, अहल्याबाई होल्कर, सावित्रीबाई फुले.",
      "Values: शौर्यम् (valour), धैर्यम् (courage), त्याग: (sacrifice), नेतृत्वम् (leadership).",
      "Verbs: अकरोत् (she did — लङ्-लकार), क्रियते (is being done — कर्मणि).",
      "Grammar focus: इदम्-शब्दस्य तृतीया-विभक्ति: — अनेन (by this, पुं), अनया (by this, स्त्री), अनेन (by this, नपुंसक).",
    ],
    formulas: `Key Grammar — Chapter 10 (अनया अकृतम्)
─────────────────────────────────────────
सन्धि:
  • अनया अकृतम् — no sandhi (compound word boundaries)
  • अ + कृतम् = अकृतम्  (नञ्-उपसर्ग: prefix 'अ' = 'not')
  • सरोज + इनी = सरोजिनी  (ज्-इ → ज्-इ; इनी-प्रत्यय: female suffix)

शब्दरूप: इदम् (सर्वनाम-शब्द:, 'this')
  पुंलिङ्ग:  अयम्, इमम्, अनेन, अस्मै, अस्मात्, अस्य, अस्मिन्
  स्त्रीलिङ्ग:  इयम्, इमाम्, अनया, अस्यै, अस्याः, अस्याः, अस्याम्
  नपुंसकम्:  इदम्, इदम्, अनेन, अस्मै, अस्मात्, अस्य, अस्मिन्

धातुरूप: कृ (to do) — लङ् लकार (Past / Imperfect)
  अकर्षम्, अकुर्वाव, अकुर्म  /  अकर्षी:, अकुरुतम्, अकुरुत  /  अकरोत्, अकुरुताम्, अकुर्वन्
  • 3rd-person singular: अकरोत् (he/she did)
  • कर्मणि-प्रयोग:: अक्रियत (was done), अकृतम् (was done — alternative form)

उपपद-लकार: (प्रथम पुरुष, एकवचनम्):
  लट्:  करोति  (does)
  लङ्:  अकरोत्  (did)
  लृट्:  करिष्यति  (will do)
  लोट्:  करोतु  (let him/her do)

समास:
  • नेतृत्वम् = नेतॄणाम् स्थिति:/भाव: (षष्ठी-तत्पुरुष:)
  • स्त्रीशिक्षणम् = स्त्रीणां शिक्षणम् (षष्ठी-तत्पुरुष:)`,
    exam: [
      "Give तृतीया-विभक्ति forms of 'इदम्' (अयम्/इयम्/इदम्) — board-favourite.",
      "Conjugate 'कृ' in लङ्-लकार — past tense.",
      "Identify the नञ्-उपसर्ग: in 'अकृतम्', 'अधर्म:', 'असत्यम्'.",
    ],
  },
  {
    id: 11,
    num: "Ch 11",
    title: "परिश्रमः",
    subj: "sanskrit",
    oneshot: [
      "Theme: hard work (परिश्रम:) is the seed of success — श्रम एव जयते (labour alone triumphs).",
      "The farmer, the artisan, the soldier, the scholar — all noble professions thrive on effort.",
      "Idleness (आलस्यम्) is the enemy of progress; आलस्यं हि श्रियः शत्रुः (laziness is the foe of prosperity).",
      "Lesson: उद्यमेन हि सिद्ध्यन्ति कार्याणि — 'effort alone accomplishes tasks' (Hitopadesha).",
    ],
    keypts: [
      "परिश्रम: (pariśrama — labour), श्रम: (śrama — effort), आलस्यम् (ālasya — laziness).",
      "कृषक: (farmer), शिल्पी (artisan), योद्धा (soldier), विप्र: (scholar), वणिक् (merchant).",
      "Verbs: करोति (does), श्राम्यति (labours), जयति (wins), सिद्ध्यति (succeeds).",
      "Proverb (Hitopadesha): उद्यमेन हि सिद्ध्यन्ति कार्याणि न मनोरथै:।",
      "Grammar focus: तृतीया-विभक्ति with -सह / -विना / -निर्मित — श्रमेण (by effort), परिश्रमेण।",
    ],
    formulas: `Key Grammar — Chapter 11 (परिश्रमः)
─────────────────────────────────────────
सन्धि:
  • परि + श्रम: = परिश्रम:  (इ-श → इ-श, prefix परि smooth)
  • आ + लस्यम् = आलस्यम्  (आ-अ → आ, वृद्धि-सन्धि)
  • श्रम + एव = श्रम एव  (अ-ए → अ-ए, no sandhi; avargīya-varga)

शब्दरूप: कृषक (पुंलिङ्ग, ending in अ — 'farmer')
  एकवचनम्: कृषक:, कृषकम्, कृषकेन, कृषकाय, कृषकात्, कृषकस्य, कृषके
  बहुवचनम्: कृषका:, कृषकान्, कृषकै:, कृषकेभ्य:, कृषकेभ्य:, कृषकानाम्, कृषकेषु

धातुरूप: जय् (to win) — लट् लकार
  जयामि, जयाव:, जयाम:  /  जयसि, जयथ:, जयथ  /  जयति, जयत:, जयन्ति

लकार-परिचय: (Verb moods — same root, same person):
  कृ-धातु:, प्रथम-पुरुष, एकवचनम्:
  • लट् (present):       करोति
  • लङ् (past):          अकरोत्
  • लृट् (future):       करिष्यति
  • लोट् (imperative):   करोतु
  • विधि-लिङ्ग् (potential): कुर्यात्

समास:
  • मनोरथै: = मनसः रथै: (षष्ठी-तत्पुरुष: — 'chariots of the mind' = mere wishes)
  • परिश्रमफलम् = परिश्रमस्य फलम् (षष्ठी-तत्पुरुष:)

सुभाषितम् (Hitopadesha, public-domain):
  उद्यमेन हि सिद्ध्यन्ति कार्याणि न मनोरथैः।
  न हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः॥
  (Tasks are accomplished by effort, not by mere wishes;
   deer do not walk into the mouth of a sleeping lion.)`,
    exam: [
      "Conjugate 'जय्' in लट्-लकार — board-favourite.",
      "Identify the समास-प्रकार: of 'मनोरथै:' and 'परिश्रमफलम्'.",
      "Translate the Hitopadesha subhashita above into English.",
    ],
  },
  {
    id: 12,
    num: "Ch 12",
    title: "विश्वबन्धुत्वम्",
    subj: "sanskrit",
    oneshot: [
      "Theme: universal brotherhood — विश्वम् (world) + बन्धुत्वम् (brotherhood/kinship).",
      "The Vedic call 'वसुधैव कुटुम्बकम्' — 'the whole world is one family' (ऋग्वेद/Maha Upanishad).",
      "Differences of caste, country and creed are superficial — भेदभाव: अज्ञानम्।",
      "Lesson: अहं ब्रह्मास्मि, तत्त्वमसि — the same Self dwells in all (Chandogya Upanishad).",
    ],
    keypts: [
      "विश्वम् (viśvam — world), बन्धुत्वम् (bandhutvam — brotherhood), कुटुम्बम् (kuṭumbam — family).",
      "वसुधा (vasudhā — earth), एक: (one), समता (equality), भ्रातृत्वम् (fraternity).",
      "Verbs: भव (be!), वसति (dwells), जानाति (knows), पश्यति (sees).",
      "Famous verse: अयं निज: परो वेति गणना लघुचेतसाम् ... वसुधैव कुटुम्बकम् (Mahopaniṣad).",
      "Grammar focus: समास-प्रकार: + चतुर्थी-विभक्ति — वसुधैव (vasudhā + eva).",
    ],
    formulas: `Key Grammar — Chapter 12 (विश्वबन्धुत्वम्)
─────────────────────────────────────────
सन्धि:
  • विश्व + बन्धुत्वम् = विश्वबन्धुत्वम्  (अ-ब → अ-ब, smooth)
  • वसुधा + एव = वसुधैव  (आ-ए → ऐ, वृद्धि-सन्धि — आ+ए=ऐ)
  • कुटुम्ब + कम् = कुटुम्बकम्  (अ-क → अ-क, with क-प्रत्यय for 'कम्' = state of)

शब्दरूप: विश्वम् / जगत् (नपुंसकलिङ्ग, ending in अ/त् — 'world')
  विश्वम्:  विश्वम्, विश्वम्, विश्वेण, विश्वाय, विश्वात्, विश्वस्य, विश्वे
  बहुवचनम्: विश्वानि, विश्वानि, विश्वै:, विश्वेभ्य:, विश्वेभ्य:, विश्वानाम्, विश्वेषु

धातुरूप: वस् (to dwell) — लट् लकार
  वसामि, वसाव:, वसाम:  /  वससि, वसथ:, वसथ  /  वसति, वसत:, वसन्ति

विभक्ति: चतुर्थी (Dative — 'for/to')
  विश्वाय (for the world), कुटुम्बाय (for the family), सर्वाय (for all — note: सर्व is सर्वनाम)

समास:
  • विश्वबन्धुत्वम् = विश्वस्य बन्धुत्वम् (षष्ठी-तत्पुरुष:)
  • वसुधैव कुटुम्बकम् = वसुधा एव कुटुम्बकम् (अव्ययीभाव: with एव अव्ययम्)
  • भेदभाव: = भेदस्य भाव: (षष्ठी-तत्पुरुष:)

सुभाषितम् (Mahopaniṣad 6.71-73 — public-domain):
  अयं निजः परो वेति गणना लघुचेतसाम्।
  उदारचरितानां तु वसुधैव कुटुम्बकम्॥
  (Small-minded people count 'this one is mine, that one is alien';
   to the large-hearted, the whole world is one family.)`,
    exam: [
      "Translate the 'वसुधैव कुटुम्बकम्' verse into English — board-favourite.",
      "Sandhi-vigrah of 'वसुधैव' and 'विश्वबन्धुत्वम्'.",
      "Write 5 lines on 'विश्वबन्धुत्वम्' using चतुर्थी-विभक्ति.",
    ],
  },
];

// ============================================================
// SKT_MCQS — ~30 MCQs (Shemushi + grammar)
// ============================================================
export const SKT_MCQS: SKTMCQ[] = [
  {
    id: 1, ch: 1, subj: "sanskrit", diff: "easy",
    q: "'शुचिपर्यावरणम्' इति किम्?",
    opts: ["पवित्रं पर्यावरणम्", "दूषितम् पर्यावरणम्", "विशालम् पर्यावरणम्", "नूतनम् पर्यावरणम्"],
    ans: 0,
    exp: "शुचिः = पवित्रम्/स्वच्छम् (pure/clean); शुचिपर्यावरणम् = a clean environment. The chapter title literally means 'a pure environment'.",
  },
  {
    id: 2, ch: 1, subj: "sanskrit", diff: "medium",
    q: "'परि + आवरणम्' इति सन्धि: कीदृश:?",
    opts: ["वृद्धि-सन्धि:", "यण्-सन्धि:", "गुण-सन्धि:", "विसर्ग-सन्धि:"],
    ans: 1,
    exp: "इ + आ → य + आ (यण्-सन्धि:). Hence 'परि + आवरणम्' becomes 'पर्यावरणम्'. The इ becomes य् before the vowel आ.",
  },
  {
    id: 3, ch: 1, subj: "sanskrit", diff: "medium",
    q: "'वृक्ष' इति शब्दस्य तृतीया-विभक्ति: एकवचनम् किम्?",
    opts: ["वृक्षः", "वृक्षम्", "वृक्षेण", "वृक्षाय"],
    ans: 2,
    exp: "तृतीया-विभक्ति: (instrumental — 'by/with') of अ-ending पुंलिङ्ग 'वृक्ष' in एकवचनम् is 'वृक्षेण' (by the tree).",
  },
  {
    id: 4, ch: 2, subj: "sanskrit", diff: "medium",
    q: "'स्पृशति पाणिना' इति वाक्ये 'पाणिना' किं कारकम्?",
    opts: ["कर्ता", "कर्म", "करणम्", "अपादानम्"],
    ans: 2,
    exp: "'पाणिना' = with the hand (instrumental, तृतीया-विभक्ति:). It answers 'with what?' — hence करण-कारकम्.",
  },
  {
    id: 5, ch: 2, subj: "sanskrit", diff: "easy",
    q: "'स्व + अस्थ' सन्धि: किम्?",
    opts: ["स्वास्थ", "स्वस्थ", "सुअस्थ", "स्वोस्थ"],
    ans: 0,
    exp: "अ + अ → आ (वृद्धि-सन्धि:). 'स्व + अस्थ' becomes 'स्वास्थ' — giving स्वास्थ्यम् (health).",
  },
  {
    id: 6, ch: 2, subj: "sanskrit", diff: "hard",
    q: "'पाणिन्' इति शब्दस्य तृतीया-एकवचनम् किम्?",
    opts: ["पाणिना", "पाणिनम्", "पाणिने", "पाणिभिः"],
    ans: 0,
    exp: "'पाणिन्' (पुंलिङ्ग, ending in इन्) takes तृतीया-एकवचनम् as 'पाणिना' (with the hand). The न्-ending nouns behave like सखि/अतिथि in some forms, but पाणिन् keeps 'ना' in instrumental.",
  },
  {
    id: 7, ch: 3, subj: "sanskrit", diff: "medium",
    q: "'गोदोहनम्' इति समासस्य विग्रह: किम्?",
    opts: ["गोः दोहनम्", "गावः दोहनम्", "गोभिः दोहनम्", "गोमाता दोहनम्"],
    ans: 0,
    exp: "षष्ठी-तत्पुरुष-समास: — 'गोः (of the cow) दोहनम् (milking)' = the milking of the cow.",
  },
  {
    id: 8, ch: 3, subj: "sanskrit", diff: "hard",
    q: "'गो:' (cow) इति शब्दस्य प्रथमा-बहुवचनम् किम्?",
    opts: ["गावः", "गाम्", "गोः", "गोनाम्"],
    ans: 0,
    exp: "'गो:' (स्त्रीलिङ्ग, irregular) takes प्रथमा-बहुवचनम् as 'गावः' (cows). Nominative plural: गौ (one) → गावः (many).",
  },
  {
    id: 9, ch: 3, subj: "sanskrit", diff: "medium",
    q: "'ग्रामे कृषक: क्षेत्रं गच्छति' — 'ग्रामे' किं विभक्ति:?",
    opts: ["प्रथमा", "सप्तमी", "तृतीया", "पञ्चमी"],
    ans: 1,
    exp: "'ग्रामे' = in the village (locative). सप्तमी-विभक्ति: ('in/at') with ए-प्रत्यय:.",
  },
  {
    id: 10, ch: 4, subj: "sanskrit", diff: "easy",
    q: "'क्रीड्' धातोः लट्-लकारे प्रथम-पुरुष-एकवचनम् किम्?",
    opts: ["क्रीडामि", "क्रीडसि", "क्रीडति", "क्रीडन्ति"],
    ans: 2,
    exp: "लट्-लकार: (present tense). प्रथम-पुरुष-एकवचनम् (3rd-person singular): क्रीडति (he/she plays). क्रीडामि = I play; क्रीडसि = you play; क्रीडन्ति = they play.",
  },
  {
    id: 11, ch: 4, subj: "sanskrit", diff: "medium",
    q: "'हे बालक! पठ' — अत्र 'हे बालक' किं विभक्ति:?",
    opts: ["प्रथमा", "सम्बोधन", "तृतीया", "चतुर्थी"],
    ans: 1,
    exp: "'हे बालक!' is सम्बोधन-विभक्ति: (vocative — addressing the boy). Note: vocative has its own paradigm — हे बालक / हे बालकौ / हे बालकाः.",
  },
  {
    id: 12, ch: 4, subj: "sanskrit", diff: "medium",
    q: "'बालक' शब्दस्य प्रथमा-बहुवचनम् किम्?",
    opts: ["बालकौ", "बालकम्", "बालकाः", "बालकेन"],
    ans: 2,
    exp: "'बालक' (पुंलिङ्ग, ending in अ) takes प्रथमा-बहुवचनम् as 'बालकाः' (boys). The suffix is 'जस्' → 'आः'.",
  },
  {
    id: 13, ch: 5, subj: "sanskrit", diff: "medium",
    q: "'भू' धातोः लोट्-लकारे (imperative) प्रथम-पुरुष-एकवचनम् किम्?",
    opts: ["भवति", "भव", "भवतु", "भवन्तु"],
    ans: 2,
    exp: "लोट्-लकार: (imperative). प्रथम-पुरुष-एकवचनम्: 'भवतु' (let him/her be). 'भव' = you be! (2nd person sing.); 'भवन्तु' = let them be! (3rd person plural).",
  },
  {
    id: 14, ch: 5, subj: "sanskrit", diff: "hard",
    q: "'मातृदेवो भव' — अत्र 'मातृदेव:' इति कः समास:?",
    opts: ["षष्ठी-तत्पुरुष:", "कर्मधारय:", "बहुव्रीहि:", "अव्ययीभाव:"],
    ans: 1,
    exp: "कर्मधारय-समास: (appositional). माता एव देव: — the mother herself is the deity. Both nouns refer to the same entity (mother = deity), which is the hallmark of कर्मधारय.",
  },
  {
    id: 15, ch: 5, subj: "sanskrit", diff: "medium",
    q: "'मातृ' इति शब्दस्य तृतीया-एकवचनम् किम्?",
    opts: ["माता", "मातरम्", "मात्रा", "मातृभिः"],
    ans: 2,
    exp: "'मातृ' (स्त्रीलिङ्ग, ending in ऋ) takes तृतीया-एकवचनम् as 'मात्रा' (by the mother). Note: ऋ-ending nouns take 'आ' in instrumental singular.",
  },
  {
    id: 16, ch: 6, subj: "sanskrit", diff: "hard",
    q: "'दशानन:' इति समासस्य विग्रह: कः?",
    opts: ["दश आननानि यस्य सः", "दशानाम् आननानाम्", "दशभिः आननैः", "आननस्य दश"],
    ans: 0,
    exp: "बहुव्रीहि-समास: — 'दश आननानि (ten faces) यस्य सः (whose he is)' = the ten-faced one (Ravana). बहुव्रीहि: gives an adjective (one who has X) by combining two nouns.",
  },
  {
    id: 17, ch: 6, subj: "sanskrit", diff: "medium",
    q: "'मातापितरौ' इति कः समास:?",
    opts: ["द्वन्द्व:", "कर्मधारय:", "षष्ठी-तत्पुरुष:", "बहुव्रीहि:"],
    ans: 0,
    exp: "द्वन्द्व-समास: (copulative compound) — both members are equally important. माता च पिता च = मातापितरौ (mother and father). Note the dual ending 'औ' on the last member.",
  },
  {
    id: 18, ch: 6, subj: "sanskrit", diff: "easy",
    q: "'विद्या ददाति विनयम्' — अस्य अर्थ: कः?",
    opts: ["Knowledge gives humility", "Knowledge gives wealth", "Knowledge gives pain", "Knowledge gives power"],
    ans: 0,
    exp: "विद्या (knowledge) ददाति (gives) विनयम् (humility). The famous subhashita says knowledge bestows humility.",
  },
  {
    id: 19, ch: 7, subj: "sanskrit", diff: "medium",
    q: "'नदी' शब्दस्य सप्तमी-एकवचनम् किम्?",
    opts: ["नदी", "नदीम्", "नद्याम्", "नदीभिः"],
    ans: 2,
    exp: "'नदी' (स्त्रीलिङ्ग, ending in ई) takes सप्तमी-एकवचनम् as 'नद्याम्' (in the river). The ई is gunated to या before the locative suffix.",
  },
  {
    id: 20, ch: 7, subj: "sanskrit", diff: "easy",
    q: "भारते प्रसिद्धा: नद्य: के?",
    opts: ["गङ्गा, यमुना, सरस्वती", "नील, गोदावरी, टैम्स", "सिन्धु, नर्मदा, वोल्गा", "कावेरी, गङ्गा, नाइल"],
    ans: 0,
    exp: "गङ्गा, यमुना, सरस्वती are the sacred rivers of India (mentioned in the Vedic त्रिवेणी-सङ्गम: tradition).",
  },
  {
    id: 21, ch: 7, subj: "sanskrit", diff: "medium",
    q: "'कृ' धातोः लट्-लकारे प्रथम-पुरुष-एकवचनम् किम्?",
    opts: ["करोमि", "करोषि", "करोति", "कुर्वन्ति"],
    ans: 2,
    exp: "कृ is a आदिविध्यादितन्त root. लट्-लकार: 3rd-person singular: करोति (he/she does). करोमि = I do; करोषि = you do; कुर्वन्ति = they do.",
  },
  {
    id: 22, ch: 8, subj: "sanskrit", diff: "hard",
    q: "'मानवः प्रकृतिं रक्षति' — अस्य कर्मणि-प्रयोग: किम्?",
    opts: ["प्रकृतिः मानवेन रक्ष्यते", "प्रकृतिः मानवः रक्षति", "मानवः प्रकृत्या रक्ष्यते", "रक्ष्यते मानवः प्रकृतिम्"],
    ans: 0,
    exp: "कर्मणि-प्रयोग: (passive): कर्ता becomes तृतीया (मानवः → मानवेन), कर्म becomes प्रथमा (प्रकृतिम् → प्रकृतिः), verb becomes त-प्रत्यय: (रक्ष्यते).",
  },
  {
    id: 23, ch: 8, subj: "sanskrit", diff: "easy",
    q: "पञ्चमहाभूतानि कानि?",
    opts: ["पृथ्वी, आप:, तेज:, वायु:, आकाश:", "गङ्गा, यमुना, सरस्वती, नर्मदा, कावेरी", "सत्यम्, शिवम्, सुन्दरम्, शिवम्, शान्तम्", "वायु:, अग्निः, जलम्, आकाश:, मनः"],
    ans: 0,
    exp: "पृथ्वी (earth), आप: (water), तेज: (fire), वायु: (air), आकाश: (space) — the five great elements (पञ्चमहाभूतानि).",
  },
  {
    id: 24, ch: 9, subj: "sanskrit", diff: "hard",
    q: "'वाङ्मनसोर्मयूख:' — अत्र 'वाक् + म' सन्धि: कः?",
    opts: ["क् → ङ् (ङमोऽनुस्वारः)", "क् → ग् (झलां जशोऽतः)", "क् → क् (no change)", "क् → च्"],
    ans: 0,
    exp: "By the rule 'ङमो ह्रस्व-अचि च', the क् of वाक् becomes ङ् before the म of मनसोः — yielding वाङ्म. This is the anusvara rule.",
  },
  {
    id: 25, ch: 9, subj: "sanskrit", diff: "medium",
    q: "'मनस्' शब्दस्य तृतीया-एकवचनम् किम्?",
    opts: ["मनः", "मनसा", "मनसे", "मनोभिः"],
    ans: 1,
    exp: "'मनस्' (नपुंसकलिङ्ग, ending in स् / अस्-आदि:) takes तृतीया-एकवचनम् as 'मनसा' (with/by the mind). Note: the स् is preserved before the 'आ' suffix.",
  },
  {
    id: 26, ch: 10, subj: "sanskrit", diff: "medium",
    q: "'अनया' इति किं शब्दस्य रूपम्?",
    opts: ["इदम् (स्त्रीलिङ्ग-तृतीया-एकवचनम्)", "इदम् (पुंलिङ्ग-तृतीया-एकवचनम्)", "तत् (स्त्रीलिङ्ग-तृतीया-एकवचनम्)", "एतत् (नपुंसक-तृतीया-एकवचनम्)"],
    ans: 0,
    exp: "'अनया' = इदम् (this, स्त्रीलिङ्ग) in तृतीया-एकवचनम् (by this woman/thing). पुंलिङ्ग: अनेन; नपुंसकम्: अनेन (same form, different gender).",
  },
  {
    id: 27, ch: 10, subj: "sanskrit", diff: "hard",
    q: "'कृ' धातोः लङ्-लकारे (past) प्रथम-पुरुष-एकवचनम् किम्?",
    opts: ["अकर्षम्", "अकर्षीः", "अकरोत्", "अकुर्वन्"],
    ans: 2,
    exp: "लङ्-लकार: (imperfect past). प्रथम-पुरुष-एकवचनम्: 'अकरोत्' (he/she did). अकर्षम् = I did; अकर्षीः = you did; अकुर्वन् = they did.",
  },
  {
    id: 28, ch: 11, subj: "sanskrit", diff: "easy",
    q: "'उद्यमेन हि सिद्ध्यन्ति कार्याणि' — अस्य अर्थ: कः?",
    opts: ["Tasks succeed by effort", "Tasks succeed by luck", "Tasks fail by effort", "Tasks are impossible"],
    ans: 0,
    exp: "उद्यमेन (by effort) हि (indeed) सिद्ध्यन्ति (succeed) कार्याणि (tasks). The Hitopadesha subhashita says tasks are accomplished by effort.",
  },
  {
    id: 29, ch: 11, subj: "sanskrit", diff: "medium",
    q: "'जय्' धातोः लट्-लकारे प्रथम-पुरुष-बहुवचनम् किम्?",
    opts: ["जयामि", "जयति", "जयन्ति", "जयन्तु"],
    ans: 2,
    exp: "लट्-लकार: 3rd-person plural: 'जयन्ति' (they win). जयामि = I win; जयति = he wins; जयन्तु = let them win (लोट्).",
  },
  {
    id: 30, ch: 12, subj: "sanskrit", diff: "medium",
    q: "'वसुधा + एव' सन्धि: कः?",
    opts: ["वसुधैव (वृद्धि-सन्धि:)", "वसुधेव (गुण-सन्धि:)", "वसुधाव (अ-व-सन्धि:)", "वसुधायेव (यण्-सन्धि:)"],
    ans: 0,
    exp: "आ + ए → ऐ (वृद्धि-सन्धि:). 'वसुधा + एव' becomes 'वसुधैव'. The आ lengthens to ऐ before the ए of एव.",
  },
];

// ============================================================
// SKT_SHORT_QA — ~16 short-answer questions (2-3 marks)
// ============================================================
export const SKT_SHORT_QA: SKTQA[] = [
  {
    id: 1, ch: 1, subj: "sanskrit", marks: 2,
    q: "अनूद्यताम् — 'वृक्षा: जलं च जीवनस्य मित्रे।' (Translate into English)",
    a: "Trees and water are the friends of life.\n\nहिंदी: वृक्ष और जल जीवन के मित्र हैं।\n\nGrammar note: 'जीवनस्य' = of life (षष्ठी-विभक्ति:); 'मित्रे' is द्विवचनम् (dual — two friends). The verb is omitted (nominal sentence).",
  },
  {
    id: 2, ch: 1, subj: "sanskrit", marks: 2,
    q: "सन्धिविग्रहः कुरुत — 'वायुरपि'।",
    a: "वायुरपि = वायु: + अपि (विसर्ग-सन्धि:).\n\nRule: 'खरवसानयोर्विसर्जनीयः' — before a hard consonant (खर् = क-वर्ग + प-वर्ग) the visarga becomes ओ/रु/रू. Here वायु: + अपि → वायुरपि (the र् is inserted because of the following अ).\n\nMeaning: 'Air too' / 'Even air'.",
  },
  {
    id: 3, ch: 2, subj: "sanskrit", marks: 2,
    q: "सन्धिविग्रहः कुरुत — 'आयुर्वेदः'।",
    a: "आयुर्वेद: = आयु: + वेद: (विसर्ग-सन्धि:).\n\nRule: Before a soft consonant (घ-ढ-ध-भ-etc.) the visarga of an अ-ending base becomes ओ → and then to र् if the next word begins with a vowel/ voiced consonant. Here आयु: + वेद: → आयुर्वेद:.\n\nMeaning: 'the Veda of life' — Ayurveda, the science of long life.",
  },
  {
    id: 4, ch: 3, subj: "sanskrit", marks: 3,
    q: "'गोदोहनम्' इति पाठ्यांशस्य प्रसङ्गे ग्रामजीवनस्य महत्त्वं लिखत (3 वाक्यैः)।",
    a: "ग्रामजीवनम् भारतीयसंस्कृतेः मूलम् अस्ति।\n1. ग्रामे कृषि: पशुपालनं च मुख्ये जीवनोपाये। (Agriculture and cattle-rearing are the chief means of livelihood in villages.)\n2. गोमाता क्षीरं यच्छति — तेन बालाः पुष्टाः भवन्ति। (The cow gives milk; thereby children grow strong.)\n3. ग्रामे प्रकृतिः शुद्धा, वायु: शुद्ध:, जलम् अमृतम् इव। (In villages nature is pure, the air is clean, the water is like nectar.)\n\nहिंदी: गाँव भारतीय संस्कृति का मूल हैं — कृषि और पशुपालन वहाँ के मुख्य जीवन-साधन हैं।",
  },
  {
    id: 5, ch: 4, subj: "sanskrit", marks: 2,
    q: "'बाल्यम् जीवनस्य मूलम्' — अनूद्यताम् (translate)।",
    a: "Childhood is the foundation of life.\n\nहिंदी: बालपन जीवन की नींव होती है।\n\nGrammar: 'बाल्यम्' (childhood — abstract noun from बाल, formed with य-प्रत्यय); 'जीवनस्य' (of life — षष्ठी); 'मूलम्' (root/foundation, प्रथमा-एकवचनम्).",
  },
  {
    id: 6, ch: 5, subj: "sanskrit", marks: 2,
    q: "'मातृदेवो भव' — सन्धिविग्रहः तत्त्वञ्च व्याख्यात (explain with sandhi-split and meaning)।",
    a: "सन्धिविग्रह: — मातृदेवो भव = माता + देव: + भव\n• मातृ + देव: = मातृदेव: — actually माता एव देव: (कर्मधारय-समास:, 'mother herself is the deity')\n• देव: + उ = देवो (विसर्ग-सन्धि: — अ/आ → visarga becomes ओ before voiced)\n\nMeaning: 'Let the mother be (a god) unto you.' (तैत्तिरीय-उपनिषद्)\n\nहिंदी: माता को देवता के समान मानो।\n\nMoral: A mother's love and care are divine; honouring her is the first duty of a child.",
  },
  {
    id: 7, ch: 6, subj: "sanskrit", marks: 2,
    q: "'विद्या ददाति विनयम्' — अनूद्यताम् + भावम् लिखत।",
    a: "Translation: Knowledge bestows humility.\nहिंदी: विद्या विनय देती है।\n\nभाव: (Theme): True learning makes a person humble. The more one knows, the more one realises how little one knows — and therefore the more modest one becomes. A truly educated person is never arrogant.",
  },
  {
    id: 8, ch: 6, subj: "sanskrit", marks: 3,
    q: "'नीलकण्ठ:' इति समासस्य विग्रहः तत्प्रकारञ्च लिखत।",
    a: "विग्रह: — नील: कण्ठ: यस्य स: (He whose throat is blue).\nसमास-प्रकार: — बहुव्रीहि-समास:।\n\nExplanation: 'बहुव्रीहि:' (lit. 'much-rice') is a compound where two nouns combine to form an adjective describing a third (unnamed) entity. Here, 'नील' (blue) + 'कण्ठ' (throat) describe Lord Shiva, who swallowed the कालकूट-विष (poison) during the churning of the ocean; his throat turned blue.\n\nहिंदी: नीलकंठ = नीला कंठ जिसका हो, वह (शिव)। बहुव्रीहि-समास:।",
  },
  {
    id: 9, ch: 7, subj: "sanskrit", marks: 2,
    q: "भारते प्रसिद्धाः पञ्च नद्यः संस्कृतेन लिखत।",
    a: "भारते प्रसिद्धाः पञ्च नद्यः:\n1. गङ्गा (Ganga)\n2. यमुना (Yamuna)\n3. सरस्वती (Saraswati — now subterranean, part of त्रिवेणी-सङ्गम: at Prayag)\n4. नर्मदा (Narmada — flows westward)\n5. गोदावरी (Godavari — 'दक्षिण गङ्गा')\n\n(Other accepted answers: कावेरी, कृष्णा, ब्रह्मपुत्र:, सिन्धु:.)\n\nहिंदी: भारत की पाँच प्रसिद्ध नदियाँ — गंगा, यमुना, सरस्वती, नर्मदा, गोदावरी।",
  },
  {
    id: 10, ch: 8, subj: "sanskrit", marks: 3,
    q: "'मानवः प्रकृतिं रक्षति' — अस्य कर्मणि-प्रयोगं कुरुत।",
    a: "कर्तरि (active):  मानवः प्रकृतिं रक्षति  (The human protects nature)\nकर्मणि (passive): प्रकृतिः मानवेन रक्ष्यते  (Nature is protected by the human)\n\nनियमा: (Rules):\n1. कर्ता (मानवः) becomes तृतीया-विभक्ति: (मानवेन — 'by the human').\n2. कर्म (प्रकृतिम्) becomes प्रथमा-विभक्ति: (प्रकृतिः — 'nature', now subject).\n3. Verb takes त-प्रत्यय: (रक्ष् + ते → रक्ष्यते, agrees with कर्म in number and person).\n\nहिंदी: कर्मणि-प्रयोग: — प्रकृति मानव द्वारा रक्षित होती है।",
  },
  {
    id: 11, ch: 9, subj: "sanskrit", marks: 3,
    q: "'वाङ्मनसोर्मयूख:' — सन्धिविग्रहं कुरुत।",
    a: "सन्धिविग्रह: — वाङ्मनसोर्मयूख: = वाक् + मनसोः + मयूख:\n\nत्रयः सन्धयः:\n1. वाक् + म = वाङ्म (क् → ङ् — by the rule 'ङमो ह्रस्वाचि', the क् becomes ङ् before म). This is अनुस्वार-सन्धि:.\n2. मनस् + ओः (षष्ठी-द्विवचनम् of मनस्) = मनसोः (the स् remains; visarga-sandhi is not triggered).\n3. मनसोः + मयूख: — junction of ओः and म; smooth, no further change.\n\nMeaning: 'The rays of speech and mind' — i.e., words and thoughts are the twin beams of consciousness.",
  },
  {
    id: 12, ch: 10, subj: "sanskrit", marks: 2,
    q: "'अनया अकृतम्' — अनूद्यताम् + व्याख्यात।",
    a: "Translation: 'Was it not done by her?' / 'She has done it!' (rhetorical — affirming her capability).\nहिंदी: क्या उसने यह नहीं किया? (अर्थात् — उसने अवश्यं कृतम्!)\n\nव्याख्या:\n• 'अनया' = by her (इदम्-सर्वनाम-शब्द: in तृतीया-एकवचनम्, स्त्रीलिङ्ग).\n• 'अकृतम्' = was not done (कृ-धातु:, कर्मणि-प्रयोग:, लङ्-लकार:, with नञ्-उपसर्ग: 'अ' = not).\n\nTheme of the chapter: rhetorical praise of womanhood — her valour and capability.",
  },
  {
    id: 13, ch: 11, subj: "sanskrit", marks: 3,
    q: "'उद्यमेन हि सिद्ध्यन्ति कार्याणि न मनोरथैः' — अनूद्यताम् + भावम् लिखत।",
    a: "Translation: Tasks are accomplished indeed by effort, not by mere wishes (lit. 'by chariots of the mind').\nहिंदी: कार्य परिश्रम से ही सिद्ध होते हैं, केवल मनोरथों से नहीं।\n\nभाव: (Theme — from Hitopadesha): Wishing alone achieves nothing — only sustained effort (उद्यम:) brings tasks to fruition. A person must act, not merely dream.\n\nGrammar notes:\n• 'उद्यमेन' = by effort (तृतीया-एकवचनम्).  • 'हि' = indeed (अव्ययम्).  • 'सिद्ध्यन्ति' = succeed (कर्मणि/कर्तरि लट्-लकार: 3rd person plural).  • 'मनोरथैः' = by chariots of the mind (मनसः रथैः — षष्ठी-तत्पुरुष-समास:, तृतीया-बहुवचनम्).",
  },
  {
    id: 14, ch: 12, subj: "sanskrit", marks: 3,
    q: "'वसुधैव कुटुम्बकम्' — अनूद्यताम् + सन्धिविग्रहं भावञ्च लिखत।",
    a: "Translation: The whole earth is indeed one family.\nहिंदी: सारी पृथ्वी ही एक कुटुम्ब है।\n\nसन्धिविग्रह: — वसुधैव = वसुधा + एव (वृद्धि-सन्धि: — आ + ए → ऐ)\n\nभाव: (Theme): The Mahopaniṣad verse teaches विश्वबन्धुत्वम् (universal brotherhood). Narrow-minded people divide the world into 'mine' and 'others' (अयं निजः परो वेति); the large-hearted see all of humanity as one family. Nationality, caste and creed are superficial — the आत्मन् (Self) is the same in all.\n\nSource: महोपनिषद् 6.71–73.",
  },
  {
    id: 15, ch: 4, subj: "sanskrit", marks: 2,
    q: "'क्रीड्' धातोः लट्-लकारे प्रथम-पुरुष-बहुवचनम् लिखत।",
    a: "क्रीड्-धातु:, लट्-लकार:, प्रथम-पुरुष-बहुवचनम् — 'क्रीडन्ति' (they play).\n\nपरिपूर्ण-रूपम् (full paradigm for context):\n  प्रथम-पुरुष:  क्रीडति (sing.)  क्रीडतः (dual)  क्रीडन्ति (plural)\n  मध्यम-पुरुष:  क्रीडसि           क्रीडथः            क्रीडथ\n  उत्तम-पुरुष:   क्रीडामि           क्रीडावः           क्रीडामः\n\nहिंदी: 'क्रीड्' धातु का लट्-लकार, प्रथम पुरुष, बहुवचन — 'क्रीडन्ति' (वे खेलते हैं)।",
  },
  {
    id: 16, ch: 6, subj: "sanskrit", marks: 2,
    q: "'यथाशक्ति' इति कः समास:? विग्रहञ्च लिखत।",
    a: "समास-प्रकार: — अव्ययीभाव-समास:।\nविग्रह: — यथा शक्ति (according to ability / as per one's strength).\n\nExplanation: When a अव्ययम् (indeclinable — like यथा, तत्, प्रति, आ, निर्) is placed before a noun to form a compound, the result is an अव्ययीभाव-समास:. The first member governs the second.\n\nOther examples: यथाविधि (यथा विधि:), यथाकामम् (यथा कामम्), प्रतिदिनम् (प्रति दिनम्), आकाशम् (आ काशम्).\n\nहिंदी: 'यथाशक्ति' — अव्ययीभाव-समास:; विग्रह: 'यथा शक्ति' (शक्ति के अनुसार)।",
  },
];

// ============================================================
// SKT_LONG_QA — ~8 long-answer questions (5 marks)
// ============================================================
export const SKT_LONG_QA: SKTQA[] = [
  {
    id: 1, ch: 1, subj: "sanskrit", marks: 5,
    q: "'शुचिपर्यावरणम्' इति पाठ्यांशस्य भावम् आधारीकृत्य पर्यावरण-रक्षणस्य पञ्च उपायाः संस्कृतेन लिखत। (5 marks — write 5 measures for environment protection based on the chapter)",
    a: "शुचिपर्यावरणम् इति पाठ्यांशस्य मूलभूतं भावम् अस्ति — प्रकृति: अस्माकम् माता; तां रक्षणीया। पर्यावरण-रक्षणस्य पञ्च उपायाः:\n\n1. वृक्षारोपणम् — वृक्षा: वायुम् शुद्धं कुर्वन्ति, वृष्टिं च जनयन्ति। अतः प्रतिवर्षं बहून् वृक्षान् रोपयेम। (Plant trees — they purify air and cause rain. So plant many trees every year.)\n\n2. प्लास्टिक-वर्जनम् — प्लास्टिकम् भूमिं दूषयति, जलं च विषाक्तं करोति। अतः प्लास्टिक-पात्राणि न उपयुञ्जीत। (Avoid plastic — it pollutes soil and poisons water. So do not use plastic vessels.)\n\n3. जल-रक्षणम् — जलम् जीवनम्। नदीषु, तडागेषु च अशुद्धं जलं न क्षेप्तव्यम्। वृष्टि-जलं सङ्गृह्णीय। (Conserve water — water is life. Don't throw dirty water into rivers/ponds. Harvest rainwater.)\n\n4. वायु-शुद्धिः — वाहनानाम् अतिप्रयोगः वायुं दूषयति। पादयानेन (cycle) गच्छेत्, सार्वजनिक-यानेन च प्रयाणं कुर्यात्। (Purify air — excessive use of vehicles pollutes the air. Use cycles and public transport.)\n\n5. जनजागरणम् — पर्यावरण-विषये जनेभ्यः ज्ञानं दद्यात्। विद्यालयेषु, ग्रामेषु च शिबिराणि आयोजयेत्। (Spread awareness — educate people about the environment. Organise camps in schools and villages.)\n\nनिष्कर्ष: — 'प्रकृतिं रक्ष, मानवं रक्ष' इति। (Conclusion — protect nature, protect humanity.)\n\nहिंदी-सारांश: पर्यावरण सुरक्षा के पाँच उपाय — वृक्षारोपण, प्लास्टिक-वर्जन, जल-संरक्षण, वायु-शुद्धि, और जन-जागरण।",
  },
  {
    id: 2, ch: 5, subj: "sanskrit", marks: 5,
    q: "'मातृदेवो भव' इति उपनिषद्-वाक्यम् आधारीकृत्य मातुः महत्त्वम् पञ्च वाक्यैः लिखत। (5 marks — write 5 sentences on the importance of the mother, based on the Upanishadic verse 'मातृदेवो भव')",
    a: "'मातृदेवो भव' — तैत्तिरीय-उपनिषदः श्रुति:। अस्य भावार्थः — माता एव प्रथमं देवता; तां देववत् पूजनीयम्। मातुः महत्त्वम् पञ्च वाक्यैः:\n\n1. माता शिशोः प्रथमा गुरुः — सा एव बालकं वदति, चलति, पठति च शिक्षयति। (The mother is the child's first teacher — she alone teaches the child to speak, walk and read.)\n\n2. मातुः स्नेहः निःस्वार्थः भवति — सा आत्मनः सुखं त्यक्त्वा शिशोः पालनं करोति। (A mother's love is selfless — she sacrifices her own happiness to nurture her child.)\n\n3. मातुः संस्काराः बालकस्य चरित्रं निर्मान्ति — यथा माता, तथा बालः। (A mother's values shape the child's character — as the mother, so the child.)\n\n4. माता सत्यम्, धर्मम्, दयाम् च शिक्षयति — एतेन बालकः उत्तमः नागरिकः भवति। (The mother teaches truth, righteousness and compassion — thereby the child becomes a good citizen.)\n\n5. भारतीय-इतिहासे युधिष्ठिरः, रामः, श्रीकृष्णः, शिवाजी च — सर्वे मातृभक्त्या एव महान्तः अभवन्। (In Indian history, Yudhishthira, Rama, Krishna and Shivaji — all became great through devotion to their mothers.)\n\nनिष्कर्ष: — मातृभक्तिः जीवनस्य मूलम्; माता तु सच्चिदानन्द-स्वरूपिणी। (Conclusion — devotion to the mother is the root of life; the mother is verily the embodiment of truth-consciousness-bliss.)\n\nहिंदी-सारांश: माँ बालक की पहली गुरु है, उसका प्रेम निःस्वार्थ है, उसके संस्कार बालक के चरित्र को बनाते हैं, वह सत्य-धर्म-दया सिखाती है, और इतिहास के सभी महापुरुष मातृभक्त थे।",
  },
  {
    id: 3, ch: 6, subj: "sanskrit", marks: 5,
    q: "'विद्या ददाति विनयम्, विनयाद् याति पात्रताम्। पात्रत्वाद् धनमाप्नोति, धनाद् धर्मं ततः सुखम्' — अस्य सुभाषितस्य विस्तृत-व्याख्यां कुरुत। (5 marks — explain this subhashita in detail)",
    a: "सुभाषित-विस्तृत-व्याख्यानम्:\n\nप्रथम-पाद: — 'विद्या ददाति विनयम्' (Knowledge bestows humility)\nसत्यं विद्या विनयम् अर्थात् विनम्रतां ददाति। यः विद्वान् सः विनम्रः। अज्ञः एव गर्वी भवति, विद्वान् तु जानाति यत् ज्ञानं सीमितम्। (True knowledge gives humility. The wise are humble. Only the ignorant are proud; the wise know that knowledge is limited.)\n\nद्वितीय-पाद: — 'विनयाद् याति पात्रताम्' (From humility comes worthiness)\nविनयात् = विनयेन (from humility). विनम्रः जनः सर्वैः सम्मानितः भवति। तस्य योग्यता (पात्रता) सर्वैः अभिज्ञायते। (From humility comes worthiness — a humble person is respected by all; his capability is recognised.)\n\nतृतीय-पाद: — 'पात्रत्वाद् धनमाप्नोति' (From worthiness, one attains wealth)\nयोग्यः जनः धनम् अर्जयति — न केवलम् अधर्मेण, किन्तु श्रमेण, योग्यतया च। (A worthy person earns wealth — not through unrighteousness, but through effort and capability.)\n\nचतुर्थ-पाद: — 'धनाद् धर्मं ततः सुखम्' (From wealth, righteousness; and from righteousness, happiness)\nधनेन धर्मः क्रियते — दानम्, यज्ञः, सेवा च। धर्मात् सुखम् भवति — न तु अधर्मेण। सुखम् इति अर्थ: आत्मिकं सन्तोषम्, न केवलम् इन्द्रिय-सुखम्। (With wealth, righteousness is practised — charity, sacrifice, service. From righteousness comes happiness — not from unrighteousness. 'Happiness' here means inner contentment, not mere sensory pleasure.)\n\nभाव: (Theme): क्रम-बद्धा सिद्धान्तः — विद्या → विनयः → पात्रता → धनम् → धर्मः → सुखम्। सुखस्य मूलम् विद्या एव। धनम् अन्तिमं साधनम् न; धर्मः एव अन्तिमं लक्ष्यम्।\n\nहिंदी-सार: विद्या → विनय → योग्यता → धन → धर्म → सुख। अर्थात् — सुख का मूल कारण धर्म है, धर्म का धन, धन का योग्यता, योग्यता का विनय, और विनय का मूल विद्या है।",
  },
  {
    id: 4, ch: 8, subj: "sanskrit", marks: 5,
    q: "'कर्तरि-प्रयोग:' तथा 'कर्मणि-प्रयोग:' इति उभयोः लकारयोः उदाहरणैः भेदं स्पष्टं कुरुत। (5 marks — explain the difference between active and passive voice with examples)",
    a: "वाच्य-भेद: — कर्तरि, कर्मणि, भावे च (इति त्रिविधः)। अत्र कर्तरि-प्रयोगः + कर्मणि-प्रयोगः उदाहरणैः विवृतः।\n\nI. कर्तरि-प्रयोग: (Active voice)\nलक्षणम् — कर्ता प्रथमा-विभक्त्या तिष्ठति; क्रियापदम् कर्तरि अनुसरति; कर्म (यदि अस्ति) द्वितीया-विभक्त्या भवति।\n  • रामः गच्छति। (Rama goes.)\n  • बालकः पुस्तकम् पठति। (The boy reads a book.)\n  • माता शिशुं लालयति। (The mother nurtures the child.)\n  • कृषकः क्षेत्रे गोदोग्धि। (The farmer milks the cow in the field.)\n  • विद्या विनयं ददाति। (Knowledge gives humility.)\n\nII. कर्मणि-प्रयोग: (Passive voice)\nलक्षणम् — कर्म प्रथमा-विभक्त्या तिष्ठति (subject-भवति); कर्ता तृतीया-विभक्त्या भवति; क्रियापदं 'त-प्रत्यय:' (कर्मणि-प्रत्ययः) युक्तम्।\n  • रामेण गम्यते। (Going is done by Rama. / It is gone by Rama.)\n  • पुस्तकम् बालकेन पठ्यते। (A book is read by the boy.)\n  • शिशुः मात्रा लाल्यते। (The child is nurtured by the mother.)\n  • क्षेत्रे कृषकेन गोदुग्ध्यते। (The cow is milked by the farmer in the field.)\n  • विनयः विद्यया दीयते। (Humility is given by knowledge.)\n\nIII. नियमा: (Rules)\n1. कर्ता प्रथमा → तृतीया (रामः → रामेण, माता → मात्रा).\n2. कर्म द्वितीया → प्रथमा (पुस्तकम् → पुस्तकम् [same], शिशुम् → शिशुः).\n3. क्रियापदम् लट्-लकारे: 'त-प्रत्यय:' (य, त, अन). Example: पठ् + य + ते → पठ्यते.\n4. क्रिया कर्मणा सह वचन-पुरुष-लिङ्ग-अनुसरणं करोति।\n\nIV. प्रयोजनम् (Purpose)\nकर्तरि: — कर्तरि रुचि: (when the doer is the focus).\nकर्मणि: — कर्मणि रुचि: (when the action/object is the focus, doer unknown or unimportant).\n\nहिंदी-सार: कर्तरि में कर्ता का प्रधान्य, कर्मणि में कर्म का। कर्ता प्रथमा से तृतीया, कर्म द्वितीया से प्रथमा, क्रिया कर्म-अनुसारी।",
  },
  {
    id: 5, ch: 9, subj: "sanskrit", marks: 5,
    q: "'वाङ्मनसोर्मयूख:' इति पाठ्यांशस्य भावम् अधिकृत्य वाक्-मनसोः सम्बन्धं पञ्च वाक्यैः लिखत। (5 marks — write 5 sentences on the relationship between speech and mind)",
    a: "'वाङ्मनसोर्मयूख:' इति पाठ्यांशस्य मूलभूतं भावम् — वाक् (speech) मनस् (mind) च चेतनायाः द्वे मयूखे (twin rays)। एतयोः सम्बन्धः पञ्च वाक्यैः:\n\n1. मनसि यद् भवति तद् वाचा अभिव्यक्तं भवति — वाक् मनसः प्रतिबिम्बम्। (Whatever is in the mind is expressed through speech — speech is the mirror of the mind.)\n\n2. शुद्ध-मनसः वाक् शुद्धा भवति; दूषित-मनसः वाक् दूषिता। (Pure mind → pure speech; polluted mind → polluted speech.)\n\n3. मनः विना वाक् शून्या; वाक् विना मनः अभिव्यक्तुम् असमर्थम्। उभे अन्योन्याश्रिते। (Without mind, speech is empty; without speech, mind cannot express. They are mutually dependent.)\n\n4. महर्षिः पतञ्जलिः कथयति — 'वाक्-मनसोः निग्रहः एव योगः'। (The sage Patanjali says — control of speech and mind is itself yoga.)\n\n5. यद् वदसि तत् कुरु, यद् करोषि तत् वद — एतदेव वाक्-मनसोः साम्यम्, एतदेव सत्यम्। (Say what you do, do what you say — this is the harmony of speech and mind, this is truth.)\n\nनिष्कर्ष: — वाक्-मनसोः साम्यम् एव साधु-जीवनस्य मूलम्। (Conclusion — harmony of speech and mind is the root of a virtuous life.)\n\nहिंदी-सार: वाणी मन का दर्पण है — शुद्ध मन से शुद्ध वाणी, दूषित मन से दूषित वाणी। वाणी और मन एक-दूसरे के पूरक हैं। पतञ्जलि के अनुसार दोनों का निग्रह ही योग है। 'जो कहो वही करो' — यही वाक्-मनः साम्यम्।",
  },
  {
    id: 6, ch: 10, subj: "sanskrit", marks: 5,
    q: "'अनया अकृतम्' इति पाठ्यांशस्य भावम् आधारीकृत्य भारतीय-इतिहासस्य तिस्रः वीराः नार्यः संस्कृतेन परिचयेन सह लिखत। (5 marks — write about 3 brave women of Indian history in Sanskrit)",
    a: "'अनया अकृतम्' — भावः — नारीणां पराक्रमः, बुद्धिः, त्यागः च अनेकधा इतिहासे प्रमाणितः। तिस्रः वीराः नार्यः:\n\n1. राणी लक्ष्मीबाई (झाँसी-राणी)\nमराठा-राज्ञी। 1857 ई. स्वाधीनता-सङ्ग्रामे अङ्ग्रेजैः सह युद्धम् अकरोत्। पुत्रं पृष्ठे बद्ध्वा अश्वारोहिणी सैन्यं नेतुम् अगच्छत्। 'मेरा झाँसी नहीं दूँगी' इति तस्याः कथनम् प्रसिद्धम्। ग्वालियर-क्षेत्रे वीरगतिम् अप्राप्नोत्। (Maratha queen. Fought the British in the 1857 freedom struggle. Tied her son on her back and led the cavalry. Famous for 'I shall not give up Jhansi'. Attained martyrdom at Gwalior.)\n\n2. राणी चेन्नम्मा (कित्तूर-राणी)\nकर्णाटकस्य कित्तूर-राज्ञी। 1824 ई. ब्रिटिश्-ईस्ट्-इण्डिया-कम्पन्या सह युद्धम् अकरोत्। तस्याः प्रथमं स्वाधीनता-सङ्ग्रामस्य आरम्भः इति मन्यते। सा सत्य-धर्म-रक्षणाय स्वजीवनम् अर्पितवती। (Queen of Kittur, Karnataka. Fought the British East India Company in 1824. Considered the beginning of the first freedom struggle. Sacrificed her life to defend truth and righteousness.)\n\n3. अहल्याबाई होल्कर (मालवा-राज्ञी)\nमालवा-राज्ञी (18वीं शताब्दी). सा धर्म-न्याय-प्रिया राज्ञी आसीत्। अनेकानि मन्दिराणि, धर्मशालाः, पाठशालाः च अनिर्मितवती। तस्याः शासन-कालः 'स्वर्ण-युगम्' इति ख्यातः। स्त्री-शिक्षणस्य प्रचारम् अकरोत्। (Queen of Malwa, 18th century. A righteous queen. Built many temples, rest-houses and schools. Her reign is known as the 'golden age'. Promoted women's education.)\n\nनिष्कर्ष: — भारतीय-इतिहासे नारीणां योगदानम् असीमम्। राणी लक्ष्मीबाई, राणी चेन्नम्मा, अहल्याबाई च — एताः त्रयः वीराः नार्यः भारतस्य गौरवम्। (Conclusion — women's contribution to Indian history is boundless. These three heroines are the glory of India.)\n\nहिंदी-सार: भारतीय इतिहास की तीन वीर नारियाँ — रानी लक्ष्मीबाई (1857), रानी चेन्नम्मा (1824), अहल्याबाई होल्कर (18वीं शताब्दी)। इन्होंने पराक्रम, न्याय और शिक्षा से भारत को गौरवान्वित किया।",
  },
  {
    id: 7, ch: 11, subj: "sanskrit", marks: 5,
    q: "'उद्यमेन हि सिद्ध्यन्ति कार्याणि न मनोरथैः। न हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः' — अस्य हितोपदेश-सुभाषितस्य विस्तृत-व्याख्यां कुरुत। (5 marks — explain this Hitopadesha subhashita)",
    a: "हितोपदेश-सुभाषित-विस्तृत-व्याख्यानम्:\n\nस्रोतः — हितोपदेश:, प्रस्तावना (public-domain, traditional).\n\nपाद-पाठ:\n1. 'उद्यमेन हि सिद्ध्यन्ति कार्याणि न मनोरथैः' — कार्याणि उद्यमेण एव सिद्ध्यन्ति, न तु केवलम् मनोरथैः।\n2. 'न हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः' — सुप्तस्य (sleeping) सिंहस्य (lion's) मुखे (into the mouth) मृगाः (deer) न प्रविशन्ति (do not enter).\n\nविस्तृत-भावः (Detailed meaning):\n\nप्रथमोऽर्धः (First half — direct teaching):\nउद्यमः (effort, industrious action) एव कार्याणि सफलानि करोति। केवलम् मनसि कल्पिताः इच्छाः (mere mental wishes) न किमपि साधयन्ति। विचारः आवश्यकः, किन्तु विचारः एव क्रियाशीलः भवेत् — अन्यथा सः मनोरथः एव तिष्ठति।\n\nद्वितीयोऽर्धः (Second half — famous analogy):\nयथा सिंहः सुप्तः (sleeping) अस्ति चेत्, मृगाः (deer) स्वयमेव तस्य मुखे न प्रविशन्ति — सिंहः उत्थितः सन् एव शिकारम् कर्तुम् अर्हति — तथा मनुष्यः अपि उत्थितः, प्रयत्नशीलः सन् एव लक्ष्यं प्राप्नोति। बैठिकः जनः कदापि न सफलताम् अनुभवति।\n\nअलङ्कारः (Figure of speech — दृष्टान्त-अलङ्कारः):\nअत्र 'सुप्त-सिंह-मृग' दृष्टान्तः दत्तः। सिंहः = प्रयत्नशीलः मनुष्यः; मृगाः = लक्ष्य-s; सुप्तः = आलस्य-स्थितिः। दृष्टान्तेन भावः स्पष्टः भवति।\n\nव्याकरण-नोट्स्:\n• 'उद्यमेन' — तृतीया-विभक्ति:, 'by effort'.\n• 'हि' — अव्ययम्, 'indeed' (emphasis).\n• 'सिद्ध्यन्ति' — सिध्-धातु:, लट्-लकार:, कर्तरि-प्रयोग:, प्रथम-पुरुष-बहुवचनम्.\n• 'मनोरथैः' — मनसः रथैः (षष्ठी-तत्पुरुष-समास:, तृतीया-बहुवचनम्).\n• 'सुप्तस्य' — स्वप्-धातोः कृदन्त-रूपम् (past-passive-participle).\n\nआधुनिक-प्रासङ्गिकता (Modern relevance):\nअद्य अपि एतत् सुभाषितम् प्रासङ्गिकम् — विद्यार्थिनः परीक्षायाः सम्मुखे भयम् अनुभवन्ति, किन्तु केवलम् इच्छया परीक्षा न उत्तीर्यते — केवलम् परिश्रमेण। व्यापारी, क्रीडकः, वैज्ञानिकः — सर्वे उद्यमेण एव सिद्धिम् अप्राप्नुवन्।\n\nहिंदी-सार: कार्य परिश्रम से सिद्ध होते हैं, केवल मनोरथों से नहीं — जैसे सोते हुए शेर के मुँह में हिरण स्वयं नहीं आते। परिश्रम ही सफलता की कुंजी है।",
  },
  {
    id: 8, ch: 12, subj: "sanskrit", marks: 5,
    q: "'वसुधैव कुटुम्बकम्' — इति महोपनिषद्-वाक्यम् आधारीकृत्य विश्वबन्धुत्वस्य महत्त्वं पञ्च वाक्यैः लिखत। (5 marks — write 5 sentences on the importance of universal brotherhood based on 'वसुधैव कुटुम्बकम्')",
    a: "'वसुधैव कुटुम्बकम्' — महोपनिषदः (6.71–73) श्रुतिः। अस्य भावः — इयं वसुधा (पृथ्वी) एव कुटुम्बम् (one family); भेदभावः अज्ञानम्। विश्वबन्धुत्वस्य महत्त्वम् पञ्च वाक्यैः:\n\n1. सर्वे मनुष्याः एकस्य परमात्मनः अंशाः — अतः भेदभावः अज्ञानम्। (All humans are parts of one Supreme Self — hence discrimination is ignorance.)\n\n2. भेदभावः — जाति-धर्म-देश-भाषा-वर्ण-आधारितः — लघु-चेतसाम् एव भवति; उदार-चरितानाम् तु सर्वे बन्धवः। (Discrimination based on caste, religion, country, language, colour — belongs only to the small-minded; for the large-hearted all are kinsmen.)\n\n3. विश्वबन्धुत्वेन युद्धानि न्यूनानि भवन्ति, शान्तिः च वर्धते — यथा द्वितीयं महायुद्धम् अनन्तरम् विश्व-संस्थाः संस्थापिताः। (With universal brotherhood, wars decrease and peace grows — as global institutions were established after World War II.)\n\n4. पर्यावरण-रक्षणम्, दारिद्र्य-निवारणम्, रोग-निवारणम् च — इति विश्व-समस्याः एकस्मिन् देशे केवलम् न समाधातुं शक्यन्ते; सर्व-देशानाम् सहयोगः आवश्यकः। (Environmental protection, poverty alleviation, disease control — these global problems cannot be solved by one country alone; cooperation of all nations is required.)\n\n5. भारतीय-संस्कृतेः मूल-मन्त्रः — 'सहनाववतु, सह नौ भुनक्तु, सह वीर्यं करवावहै' (तैत्तिरीय-उपनिषद्) — एकस्य भावः एव विश्वबन्धुत्वम्। (The root-mantra of Indian culture — 'May we protect together, may we enjoy together, may we act with vigour together' — expresses the same universal brotherhood.)\n\nनिष्कर्ष: — 'अयं निजः परो वेति' इति गणना त्यज्यताम्; 'उदार-चरितानां तु वसुधैव कुटुम्बकम्' इति भावः आत्मसात् क्रियताम्। (Conclusion — abandon the counting of 'mine vs alien'; embrace the truth that for the large-hearted, the whole world is one family.)\n\nहिंदी-सार: सभी मनुष्य एक परमात्मा के अंश हैं — भेदभाव अज्ञान है। विश्वबन्धुत्व से युद्ध घटते हैं, शांति बढ़ती है, वैश्विक समस्याएँ सुलझती हैं। भारतीय संस्कृति का मूल-मन्त्र — 'सह नौ भुनक्तु' — इसी भाव को व्यक्त करता है।",
  },
];

// ============================================================
// SKT_TRANSLATION_EX — ~15 translation exercises (try these)
// ============================================================
export const SKT_TRANSLATION_EX: SKTTranslationEx[] = [
  {
    id: 1,
    sanskrit: "विद्या ददाति विनयम्, विनयाद् याति पात्रताम्।",
    hint: "Famous subhashita. Vocabulary: विद्या (knowledge), ददाति (gives), विनयम् (humility), पात्रताम् (worthiness). Note सन्धि in 'विनयाद्'.",
  },
  {
    id: 2,
    sanskrit: "उद्यमेन हि सिद्ध्यन्ति कार्याणि न मनोरथैः।",
    hint: "Hitopadesha. उद्यमेन (by effort), हि (indeed), सिद्ध्यन्ति (succeed), कार्याणि (tasks), मनोरथैः (by mere wishes). मनोरथ = मनसः रथः (षष्ठी-तत्पुरुष).",
  },
  {
    id: 3,
    sanskrit: "अहं ब्रह्मास्मि।",
    hint: "Brihadaranyaka Upanishad. Simple but profound. अहम् (I), ब्रह्म (Brahman/the Absolute), अस्मि (am). Note: ब्रह्म + अस्मि — sandhi?",
  },
  {
    id: 4,
    sanskrit: "तत्त्वमसि।",
    hint: "Chandogya Upanishad (महावाक्यम्). Tat-tvam-asi. 'That thou art' — the identity of the individual Self (त्वम्) and the Absolute (तत्). Sandhi-vigrah needed.",
  },
  {
    id: 5,
    sanskrit: "वसुधैव कुटुम्बकम्।",
    hint: "Mahopaniṣad 6.72. वसुधा (the earth) + एव (indeed) = वसुधैव (वृद्धि-सन्धि: आ+ए→ऐ). कुटुम्बकम् (one family). Theme: विश्वबन्धुत्वम्.",
  },
  {
    id: 6,
    sanskrit: "सत्यमेव जयते।",
    hint: "Mundaka Upanishad (also India's national motto). सत्यम् (truth) + एव (alone) = सत्यमेव. जयते (triumphs — कर्मणि/भावे-प्रयोग:).",
  },
  {
    id: 7,
    sanskrit: "अहिंसा परमो धर्मः।",
    hint: "Mahabharata. अहिंसा (non-violence), परमः (supreme), धर्मः (righteousness). Theme: virtue of non-harming.",
  },
  {
    id: 8,
    sanskrit: "योगः कर्मसु कौशलम्।",
    hint: "Bhagavadgita 2.50. योगः (yoga / equanimity), कर्मसु (in actions — सप्तमी-बहुवचनम्), कौशलम् (skill / efficiency). 'Yoga is skill in action.'",
  },
  {
    id: 9,
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    hint: "Bhagavadgita 2.47. कर्मणि (in action), एव (alone), अधिकारः (right), ते (your), मा (do not), फलेषु (in fruits), कदाचन (ever). Famous 'Nishkama Karma' verse.",
  },
  {
    id: 10,
    sanskrit: "वाङ्मनसोर्मयूखः।",
    hint: "Shemushi chapter 9 title. वाक् (speech) + मनसोः (of speech and mind — द्विवचनम्) + मयूखः (ray). Sandhi: क्→ङ् before म.",
  },
  {
    id: 11,
    sanskrit: "मातृदेवो भव, पितृदेवो भव, आचार्यदेवो भव।",
    hint: "Taittiriya Upanishad. मातृ (mother) + देवः (deity) = मातृदेवः (कर्मधारय). भव (be!). 'Revere mother, father, teacher as divinities.'",
  },
  {
    id: 12,
    sanskrit: "अयं निजः परो वेति गणना लघुचेतसाम्।",
    hint: "Mahopaniṣad 6.71. अयम् (this), निजः (one's own), परः (other), वा (or), इति (thus) — गणना (counting), लघु-चेतसाम् (of the small-minded).",
  },
  {
    id: 13,
    sanskrit: "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।",
    hint: "Bhagavadgita 4.38. न (not), हि (indeed), ज्ञानेन (by knowledge — तृतीया), सदृशम् (equal/comparable), पवित्रम् (purifier), इह (here), विद्यते (exists).",
  },
  {
    id: 14,
    sanskrit: "उदारचरितानां तु वसुधैव कुटुम्बकम्।",
    hint: "Mahopaniṣad 6.73 (second half). उदार-चरितानाम् (of the large-hearted — षष्ठी-बहुवचनम्), तु (but), वसुधा एव कुटुम्बकम्. Theme: brotherhood.",
  },
  {
    id: 15,
    sanskrit: "परोपकारः पुण्याय, पापाय परपीडनम्।",
    hint: "Hitopadesha-style maxim. पर-उपकारः (helping others), पुण्याय (for merit), पर-पीडनम् (harming others), पापाय (for sin). 'Helping others brings merit; harming others brings sin.'",
  },
];

export const SKT_DEEP_DIVE: Record<number, string[]> = {
  1: [
    "This chapter frames environmental care not as a modern, borrowed concern but as something Sanskrit literature has always treated as a moral duty — trees and rivers are called 'friends of life' (जीवनस्य मित्रे) rather than just resources, which signals a relationship of respect and reciprocity, not ownership.",
    "Notice the grammatical pattern in lines like वायु:, जलम्, भूमि: च दूषिताः — the passive construction (दूषिताः, 'have been polluted') deliberately places the blame on human negligence as the implied agent, even without naming a specific culprit; the chapter's moral force comes from that quiet accusation.",
    "The call to action at the end (वृक्षारोपणम् कुरुत, प्लास्टिकं वर्जयत — imperative forms 'plant', 'avoid') shifts the lesson from description to instruction, which is typical of how these thematic Sanskrit passages work: establish the problem, then close with a directly actionable, memorable command.",
  ],
  2: [
    "The title itself is a small grammatical lesson: स्पृशति (touches) is a present-tense verb form built from the root स्पृश्, and पाणिना is the instrumental case ('with the hand') — so the phrase demonstrates how Sanskrit expresses 'the means by which an action happens' using the instrumental case rather than a preposition like English 'with'.",
    "The proverb-style line स्वच्छता आरोग्यस्य अर्धम् ('cleanliness is half of health') uses the genitive case (आरोग्यस्य, 'of health') to express possession/relation, a construction worth noticing because it recurs constantly across these thematic chapters whenever a text wants to state a general truth compactly.",
    "The daily-routine vocabulary (स्नानं, दन्तधावनं, नखसंरक्षणं) is grouped as a list of neuter nouns describing a दिनचर्या (daily regimen) — this reflects the older Ayurvedic idea that hygiene isn't incidental but a structured, daily discipline, which is why the chapter presents it as a routine rather than a one-time instruction.",
  ],
  3: [
    "गोदोहनम् (literally 'cow-milking') is a compound word combining गो: (cow) and दोहनम् (the act of milking) — recognising this kind of compound (समास) is a useful general skill, since a large share of Sanskrit vocabulary in these chapters is built by joining two simpler words rather than being a separate word to memorise from scratch.",
    "Calling the cow गोमाता ('mother-cow') isn't just affectionate language — it reflects a cultural framing found throughout classical Sanskrit texts where the cow is honoured for sustaining human life (through क्षीरम् milk, घृतम् ghee, दधि curd) the way a mother sustains a child, which is why the chapter treats milking as a scene of reverence rather than mere farm labour.",
    "The chapter's closing lesson — respect for animals and dignity of labour — connects this rural scene to a broader value found across the Sanskrit syllabus: physical, everyday work (farming, herding) is presented as noble, not lesser, which is a theme that reappears explicitly in परिश्रमः (Chapter 11) as well.",
  ],
  4: [
    "शिशुलालनम् combines शिशु: (infant) with लालनम् (nurturing/fondling) — like गोदोहनम् in Chapter 3, recognising this as a compound built from two familiar roots makes the vocabulary far easier to retain than treating it as one opaque word.",
    "The line शिशु: क्रीडया शिक्षते ('the child learns through play') uses the instrumental case again (क्रीडया, 'by/through play') to express the *means* of learning — a grammatical pattern worth watching for throughout the syllabus, since Sanskrit frequently expresses 'how' something happens through the instrumental rather than a separate connecting word.",
    "The chapter's core idea — that early nurturing, especially a mother's lullaby (लालन-गीतम्), shapes a child's character — sets up the very next chapter's theme (जननी तु गुरुः, 'the mother is the first guru') almost as a direct continuation: this chapter shows *how* nurturing happens, the next explains *why* it matters so much.",
  ],
  5: [
    "The title's structure is worth parsing carefully: जननी (mother) तु (indeed/emphatically) गुरुः (teacher) — the particle तु isn't decorative, it's doing real emphatic work, asserting the mother's role against an implicit assumption that 'guru' means a formal teacher. The line is making an argument, not just a statement.",
    "That the chapter cites Yudhishthira, Rama, and Krishna as examples of great figures who were devoted to their mothers (मातृभक्ता:) is a common technique in these thematic texts: abstract moral claims are grounded in familiar epic figures everyone already knows, making the lesson feel proven by example rather than merely asserted.",
    "The closing line मातृदेवो भव ('let the mother be as a god to you') is a direct quotation from the Taittiriya Upanishad — recognising when a chapter is quoting a much older source, rather than composing an original line, helps you understand why the phrasing sounds more formal and compressed than the surrounding descriptive Sanskrit.",
  ],
  6: [
    "A सूक्ति is a short, quotable saying — the chapter's title स्तबकः ('bouquet' or 'cluster') is itself a metaphor: the individual subhashitas are being described as flowers gathered into one bunch, which tells you to expect a collection of unrelated one- or two-line verses rather than one continuous narrative.",
    "Each subhashita packs a complete moral idea into just one or two lines, which is why they're written in very compressed grammar — dropping words an English sentence would need (like 'is' or connecting particles) is normal here, and the skill this chapter builds is inferring the full sense from a deliberately terse verse.",
    "The recurring themes (time-management, truth, gratitude, choosing friends wisely) aren't random — subhashita literature historically functioned as portable, memorable moral education, meant to be quoted in daily life and passed down orally, which is why these verses are built to be short enough to remember rather than to explain themselves fully.",
  ],
  7: [
    "भारत-महिमा ('the glory of India') builds its praise almost entirely through geography and nature — sacred rivers (गङ्गा, यमुना, सरस्वती, नर्मदा, गोदावरी, कावेरी) and the Himalayas — rather than through kings or conquests, which reflects a specific way classical Sanskrit literature often defines a nation's identity: through the land itself as something sacred, not just through political history.",
    "The metaphor हिमालय: भारतस्य मुकुटम् इव ('the Himalayas are like a crown of India') uses the comparative particle इव ('like/as') to build a simile — spotting इव (or इति for reported speech, used elsewhere in the syllabus) is one of the most useful small grammatical markers to recognise quickly while reading Sanskrit prose, since it signals 'this is a comparison, not a literal claim'.",
    "The closing line संस्कृति: राष्ट्रस्य आत्मा ('culture is the soul of a nation') makes the chapter's real argument explicit: physical geography (rivers, mountains) matters in this text only because it has shaped and sustained a culture, and it's that culture — not the land alone — that the chapter ultimately wants you to take pride in.",
  ],
  8: [
    "पर्यावरणम् returns to the environmental theme of Chapter 1 but grounds it in a specific classical framework: the पञ्चमहाभूतानि, the five great elements (पृथ्वी earth, आप: water, तेज: fire, वायु: air, आकाश: space) that classical Indian thought considered the building blocks of the physical world — pollution, in this framing, isn't just 'bad for nature', it's a disturbance of a five-part cosmic balance.",
    "Notice how the three pollution terms are built the same way — वायुदूषणं, जलदूषणं, भूमि-दूषणं — each combining an element (air/water/land) with दूषणम् (pollution/corruption); once you recognise दूषणम् as the recurring second half of the compound, you can decode new pollution-related vocabulary without needing to memorise each term separately.",
    "The closing line प्रकृतिं रक्ष, मानवं रक्ष ('protect nature, protect humanity') places the two protections side by side rather than treating them as separate goals — the implicit argument is that protecting nature *is* protecting humanity, since humans are presented as fully embedded within, not separate from, the five-element system the chapter opened with.",
  ],
  9: [
    "The title's metaphor is doing real conceptual work: वाक् (speech) and मनस् (mind) are called मयूखौ ('twin rays') of consciousness — meaning they're presented as two beams from the same single source, which is why the chapter treats controlling your words and controlling your thoughts as fundamentally the same discipline, not two separate skills.",
    "The line वाचं मनसा शास्ति य: स सुधी: ('one who governs speech with the mind is wise') again uses the instrumental case (मनसा, 'by/with the mind') to show the *means* of self-control — the same grammatical pattern seen in earlier chapters (क्रीडया in Ch.4, पाणिना in Ch.2), reinforcing how central the instrumental case is for expressing 'the tool or method' throughout this syllabus.",
    "यद् वदसि तत् कुरु ('do what you say') closes the chapter with a practical ethical demand rather than a purely philosophical one — the chapter moves from an abstract idea (speech and mind as twin forces) to a concrete standard of personal integrity (your actions should match your words), which is a common shape for these thematic chapters: idea, then explanation, then a livable rule.",
  ],
  10: [
    "The rhetorical question in the title — अनया अकृतम्? ('has she not done it?') — is itself the chapter's argument in miniature: rather than stating outright 'women are capable of great deeds', the text poses it as a question expecting an obvious 'no, she certainly has done it', which is a persuasive technique (a rhetorical question implying its own answer) worth recognising when it appears elsewhere too.",
    "By naming specific historical women — Lakshmibai, Rani Chennamma, Ahalyabai, Sarojini Naidu — spanning different eras and different kinds of achievement (military leadership, administration, poetry and politics), the chapter builds its case for women's valour through breadth of example rather than a single figure, making the claim feel general rather than exceptional.",
    "This chapter sits naturally alongside जननी तु गुरुः (Ch.5) as part of a broader thread across the syllabus honouring women's roles — but where Chapter 5 focuses specifically on motherhood as moral guidance, this chapter widens the lens to leadership, courage, and public achievement, showing two different but complementary ways the syllabus frames women's contributions.",
  ],
  11: [
    "परिश्रमः opens with a compact maxim — श्रम एव जयते ('labour alone triumphs') — that uses एव ('alone/only', an emphatic particle) to rule out shortcuts explicitly: the claim isn't 'labour helps', it's 'labour is the *only* thing that truly wins', which is a stronger, more absolute claim than it might first appear in translation.",
    "That the chapter lists the farmer, artisan, soldier, and scholar together as equally noble is a deliberate levelling move — it argues that dignity comes from effort itself, not from the prestige of the profession, echoing the same respect-for-labour theme already introduced through the cow-milking scene in गोदोहनम् (Ch.3).",
    "आलस्यं हि श्रियः शत्रुः ('laziness is indeed the enemy of prosperity') pairs with the closing line from the Hitopadesha, उद्यमेन हि सिद्ध्यन्ति कार्याणि ('tasks are accomplished only through effort') — together these two lines frame effort and laziness as direct opposites in a single moral equation, success on one side, failure guaranteed on the other, with no neutral middle ground offered.",
  ],
  12: [
    "विश्वबन्धुत्वम् builds its case from the top down — starting with the grandest possible claim, वसुधैव कुटुम्बकम् ('the whole earth is one family', drawn from the Rig Veda / Maha Upanishad tradition), and then narrowing to the practical implication that caste, country, and creed are 'superficial' (भेदभाव: अज्ञानम् — literally, 'discrimination is ignorance'). The structure moves from cosmic principle to social conclusion.",
    "Calling division 'अज्ञानम्' (ignorance) rather than simply 'wrong' is a specific philosophical move worth noticing: it frames prejudice not as a moral failing to be punished but as a failure of understanding to be corrected — which fits the chapter's closing line, अहं ब्रह्मास्मि, तत्त्वमसि ('I am Brahman', 'that thou art'), both classical Upanishadic statements asserting that the same universal Self underlies every individual.",
    "This chapter functions as a fitting close to the syllabus's recurring ethical thread — respect for nature (Ch.1, 8), for labour (Ch.3, 11), for elders and women (Ch.5, 10) — by grounding all of it in one unifying claim: if the same Self dwells in all beings, then every other lesson about respect and care follows naturally from that single metaphysical premise.",
  ],
};
