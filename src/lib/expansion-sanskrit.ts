// ===== Sanskrit question-bank expansion =====
//
// Merged into SKT_MCQS / SKT_SHORT_QA / SKT_LONG_QA in sanskrit-data.ts.
// IDs run from 5000 upward (base bank tops out at 2012).
//
// THE GAP THIS PACK TARGETS:
//
// Chapters 8 through 12 carried only two MCQs each, and the whole track had
// 42 MCQs against 12 chapters — the thinnest coverage of any subject. Short
// and long answers were similarly sparse (18 and 8 respectively).
//
// WEIGHTING TOWARD VYAKARANA:
//
// The base file already notes that grammar and vocabulary items are lower
// risk for accuracy than chapter-narrative recall, and this pack follows
// that judgement deliberately. Sandhi, samasa, pratyaya, karaka and vachya
// are rule-governed — a question about whether सु + आगतम् gives स्वागतम्
// has one defensible answer that does not depend on any particular edition
// of a textbook. That makes these items both safer and, for board purposes,
// higher-yield: the Vyakaranvidhi section is a substantial and highly
// predictable part of the paper.
//
// All shlokas referenced are public-domain traditional verses. No NCERT
// textbook text is reproduced verbatim.

import type { SKTMCQ, SKTQA } from "./sanskrit-data";

export const EXTRA_SKT_MCQS: SKTMCQ[] = [
  // ---------------- सन्धि (Sandhi) ----------------
  {
    id: 5001, ch: 1, subj: "sanskrit", diff: "easy",
    q: "'विद्या + आलयः' इति सन्धिः कः?",
    opts: ["विद्यालयः", "विद्यअलयः", "विद्यायलयः", "विद्यैलयः"],
    ans: 0,
    exp: "दीर्घसन्धिः (savarna dirgha sandhi). When a + ā (or any two similar vowels) meet, they combine into the corresponding long vowel: आ + आ → आ. So विद्या + आलयः = विद्यालयः, 'a place of learning'. The same rule gives हिम + आलयः = हिमालयः.",
  },
  {
    id: 5002, ch: 1, subj: "sanskrit", diff: "medium",
    q: "'सूर्य + उदयः' अस्य सन्धिपदम् अस्ति —",
    opts: ["सूर्यउदयः", "सूर्योदयः", "सूर्यौदयः", "सूर्यूदयः"],
    ans: 1,
    exp: "गुणसन्धिः (guna sandhi). When अ/आ is followed by उ/ऊ, the result is ओ. So सूर्य + उदयः = सूर्योदयः (sunrise). The companion rules in the same family: अ + इ → ए (देव + इन्द्रः = देवेन्द्रः) and अ + ऋ → अर् (देव + ऋषिः = देवर्षिः).",
  },
  {
    id: 5003, ch: 2, subj: "sanskrit", diff: "hard",
    q: "'सु + आगतम्' इत्यस्य सन्धिः कः, कश्च सन्धिभेदः?",
    opts: ["सुआगतम् — दीर्घसन्धिः", "स्वागतम् — यण्सन्धिः", "सौगतम् — वृद्धिसन्धिः", "सोआगतम् — गुणसन्धिः"],
    ans: 1,
    exp: "यण्सन्धिः (yan sandhi). When इ/उ/ऋ is followed by a DISSIMILAR vowel, it becomes the corresponding semivowel: इ→य्, उ→व्, ऋ→र्. Here उ + आ → व् + आ = वा, giving स्वागतम् ('welcome'). Similarly अति + अन्तम् = अत्यन्तम् and मातृ + आदेशः = मात्रादेशः.",
  },
  {
    id: 5004, ch: 2, subj: "sanskrit", diff: "hard",
    q: "'तथा + एव' इत्यस्य सन्धिरूपं किम्?",
    opts: ["तथाएव", "तथैव", "तथेव", "तथयेव"],
    ans: 1,
    exp: "वृद्धिसन्धिः (vriddhi sandhi). When अ/आ is followed by ए/ऐ the result is ऐ, and when followed by ओ/औ the result is औ. So तथा + एव = तथैव ('in just that way'). Compare एक + एकम् = एकैकम् and महा + औषधम् = महौषधम्.",
  },
  {
    id: 5005, ch: 3, subj: "sanskrit", diff: "medium",
    q: "'सत् + जनः' इत्यस्य सन्धिः अस्ति —",
    opts: ["सत्जनः", "सज्जनः", "सद्जनः", "सन्जनः"],
    ans: 1,
    exp: "श्चुत्वसन्धिः (a व्यञ्जनसन्धि). When a त्-varga consonant meets a च्-varga consonant, the त्-varga letter changes to the corresponding च्-varga letter. Here त् before ज् becomes ज्, giving सज्जनः ('a good person'). The same rule produces तत् + च = तच्च.",
  },
  {
    id: 5006, ch: 3, subj: "sanskrit", diff: "hard",
    q: "'वाक् + ईशः' इत्यस्य सन्धिपदं किम्?",
    opts: ["वाकीशः", "वागीशः", "वाक्ईशः", "वाङीशः"],
    ans: 1,
    exp: "जश्त्वसन्धिः. A hard unaspirated consonant at the end of a word becomes its soft (voiced) counterpart before a vowel or a soft consonant: क्→ग्, च्→ज्, ट्→ड्, त्→द्, प्→ब्. Here क् before the vowel ई becomes ग्, giving वागीशः ('lord of speech'). Compare दिक् + अम्बरः = दिगम्बरः.",
  },
  {
    id: 5007, ch: 4, subj: "sanskrit", diff: "hard",
    q: "'निः + चयः' इत्यस्य सन्धिः कः?",
    opts: ["निःचयः", "निश्चयः", "निष्चयः", "निर्चयः"],
    ans: 1,
    exp: "विसर्गसन्धिः. A visarga followed by च् or छ् becomes श्. So निः + चयः = निश्चयः ('certainty, decision'). The parallel rules: visarga before ट्/ठ् becomes ष् (निः + ठुरः → निष्ठुरः) and before त्/थ् becomes स् (निः + तारः → निस्तारः).",
  },
  {
    id: 5008, ch: 4, subj: "sanskrit", diff: "medium",
    q: "'रामः + अपि' इत्यस्य सन्धिरूपम् अस्ति —",
    opts: ["रामःअपि", "रामोऽपि", "रामअपि", "रामायपि"],
    ans: 1,
    exp: "विसर्गसन्धिः (उत्वम्). When अः is followed by अ, the visarga becomes ओ and the following अ is elided, marked by the avagraha sign ऽ. So रामः + अपि = रामोऽपि. If the following vowel is anything OTHER than अ, the visarga simply drops: रामः + इति = राम इति.",
  },

  // ---------------- प्रत्यय (Pratyaya) ----------------
  {
    id: 5009, ch: 5, subj: "sanskrit", diff: "easy",
    q: "'गम्' धातोः 'क्त्वा' प्रत्यये रूपं किम्?",
    opts: ["गमित्वा", "गत्वा", "गच्छित्वा", "आगत्य"],
    ans: 1,
    exp: "गम् + क्त्वा = गत्वा ('having gone'). The क्त्वा suffix indicates a completed prior action and is used when the verb carries NO prefix (उपसर्ग). Compare पठ् + क्त्वा = पठित्वा, कृ + क्त्वा = कृत्वा, दृश् + क्त्वा = दृष्ट्वा.",
  },
  {
    id: 5010, ch: 5, subj: "sanskrit", diff: "hard",
    q: "'आ + गम्' इत्यत्र क्त्वा-प्रत्ययस्य स्थाने कः प्रत्ययः भवति, किं च रूपम्?",
    opts: ["क्त्वा — आगत्वा", "ल्यप् — आगत्य", "तुमुन् — आगन्तुम्", "शतृ — आगच्छन्"],
    ans: 1,
    exp: "This is the key rule pairing क्त्वा with ल्यप्. When the root carries a prefix (उपसर्ग), क्त्वा is REPLACED by ल्यप्, which appears as -य. So आ + गम् + ल्यप् = आगत्य ('having come'). Compare प्र + नम् → प्रणम्य and वि + हस् → विहस्य. Writing आगत्वा is the single most common error in this topic.",
  },
  {
    id: 5011, ch: 6, subj: "sanskrit", diff: "medium",
    q: "'पठ्' धातोः 'तुमुन्' प्रत्यये रूपं किम्?",
    opts: ["पठित्वा", "पठितुम्", "पठनीयम्", "पठन्"],
    ans: 1,
    exp: "पठ् + तुमुन् = पठितुम् ('in order to read / to read'). तुमुन् forms the infinitive and expresses purpose — सः पठितुम् गच्छति, 'he goes in order to read'. Compare गम् + तुमुन् = गन्तुम्, कृ + तुमुन् = कर्तुम्, दा + तुमुन् = दातुम्.",
  },
  {
    id: 5012, ch: 6, subj: "sanskrit", diff: "hard",
    q: "'बुद्धि + मतुप्' इत्यस्य पुंलिङ्गे प्रथमा-एकवचने रूपं किम्?",
    opts: ["बुद्धिमत्", "बुद्धिमान्", "बुद्धिवान्", "बुद्धिमती"],
    ans: 1,
    exp: "मतुप् denotes possession ('having'). After a word ending in इ or उ the suffix keeps its म्, giving बुद्धिमान् ('intelligent, one possessing intellect'). After अ/आ the म् becomes व्: बल + मतुप् = बलवान्, धन + मतुप् = धनवान्. The feminine of बुद्धिमान् is बुद्धिमती.",
  },
  {
    id: 5013, ch: 7, subj: "sanskrit", diff: "hard",
    q: "'पठ् + तव्यत्' इत्यस्य रूपं किम्, कश्च अर्थः?",
    opts: ["पठितः — read", "पठितव्यम् — should be read", "पठन् — reading", "पठितुम् — to read"],
    ans: 1,
    exp: "पठ् + तव्यत् = पठितव्यम् ('ought to be read / should be read'). तव्यत् and अनीयर् both express obligation and both give the same sense: पठनीयम् is the अनीयर् form of the same root. Both are used in the passive construction — छात्रेण पुस्तकं पठितव्यम्, 'the book should be read by the student'.",
  },
  {
    id: 5014, ch: 7, subj: "sanskrit", diff: "medium",
    q: "'गच्छ् + शतृ' इत्यस्य पुंलिङ्गे रूपं किम्?",
    opts: ["गत्वा", "गच्छन्", "गन्तुम्", "गतः"],
    ans: 1,
    exp: "शतृ forms the present participle for परस्मैपद roots: गच्छ् + शतृ = गच्छन् ('going, while going'). The feminine is गच्छन्ती. For आत्मनेपद roots the corresponding suffix is शानच्, as in सेव् + शानच् = सेवमानः. Both describe an action happening at the same time as the main verb.",
  },
  {
    id: 5015, ch: 8, subj: "sanskrit", diff: "hard",
    q: "'कृ' धातोः 'क्त' प्रत्यये पुंलिङ्गे प्रथमा-एकवचने रूपं किम्?",
    opts: ["करणम्", "कृतः", "कर्तव्यम्", "कुर्वन्"],
    ans: 1,
    exp: "कृ + क्त = कृतः ('done, made'). The क्त suffix forms the past passive participle, so कृतः means something that HAS BEEN done. Compare गम् + क्त = गतः, पठ् + क्त = पठितः, दृश् + क्त = दृष्टः. The related क्तवतु gives the active sense: कृतवान्, 'he did'.",
  },

  // ---------------- समास (Samasa) ----------------
  {
    id: 5016, ch: 8, subj: "sanskrit", diff: "medium",
    q: "'नीलम् कमलम्' इत्यस्य समासः कः, कश्च समासभेदः?",
    opts: ["नीलकमलम् — कर्मधारयः", "नीलकमलम् — द्वन्द्वः", "कमलनीलम् — बहुव्रीहिः", "नीलकमलम् — द्विगुः"],
    ans: 0,
    exp: "कर्मधारयसमासः — a compound in which one member qualifies the other as an adjective, and both refer to the SAME thing. Here नीलम् (blue) describes कमलम् (lotus), giving नीलकमलम् ('blue lotus'). Compare महान् पुरुषः = महापुरुषः and पीतम् अम्बरम् = पीताम्बरम्.",
  },
  {
    id: 5017, ch: 8, subj: "sanskrit", diff: "hard",
    q: "'पीतम् अम्बरम् यस्य सः' इत्यस्य समासः कः, कं च बोधयति?",
    opts: ["पीताम्बरम् — कर्मधारयः, वस्त्रम्", "पीताम्बरः — बहुव्रीहिः, विष्णुः", "अम्बरपीतम् — तत्पुरुषः, आकाशम्", "पीताम्बरी — द्विगुः, नदी"],
    ans: 1,
    exp: "बहुव्रीहिसमासः — the compound refers to something OUTSIDE its own members. Neither पीत nor अम्बर means Vishnu, yet पीताम्बरः denotes 'he whose garment is yellow', i.e. Vishnu. The tell-tale sign is the यस्य / यस्याः in the विग्रह. Compare चन्द्रः शेखरे यस्य सः = चन्द्रशेखरः (Shiva).",
  },
  {
    id: 5018, ch: 9, subj: "sanskrit", diff: "hard",
    q: "'त्रयाणां लोकानां समाहारः' इत्यस्य समासः कः?",
    opts: ["त्रिलोकी — द्विगुसमासः", "लोकत्रयम् — द्वन्द्वः", "त्रिलोकः — बहुव्रीहिः", "लोकत्रिः — अव्ययीभावः"],
    ans: 0,
    exp: "द्विगुसमासः — a compound whose first member is a NUMERAL and which denotes a collection (समाहार). त्रयाणां लोकानां समाहारः = त्रिलोकी, 'the three worlds taken together'. Compare पञ्चानां वटानां समाहारः = पञ्चवटी and त्रयाणां भुवनानां समाहारः = त्रिभुवनम्.",
  },
  {
    id: 5019, ch: 9, subj: "sanskrit", diff: "medium",
    q: "'रामः च कृष्णः च' इत्यस्य समासः कः, कश्च भेदः?",
    opts: ["रामकृष्णौ — द्वन्द्वसमासः", "रामकृष्णः — कर्मधारयः", "कृष्णरामः — तत्पुरुषः", "रामकृष्णम् — द्विगुः"],
    ans: 0,
    exp: "द्वन्द्वसमासः — both members are of EQUAL importance and are joined by 'and' (च) in the विग्रह. Since two people are named, the compound takes the dual: रामकृष्णौ. Compare माता च पिता च = मातापितरौ and सुखं च दुःखं च = सुखदुःखे.",
  },
  {
    id: 5020, ch: 9, subj: "sanskrit", diff: "hard",
    q: "'यथाशक्ति' इति कः समासः?",
    opts: ["तत्पुरुषः", "बहुव्रीहिः", "अव्ययीभावः", "द्वन्द्वः"],
    ans: 2,
    exp: "अव्ययीभावसमासः — the FIRST member is an indeclinable (अव्यय) and the whole compound behaves as an indeclinable, always staying in the neuter singular. यथा + शक्ति = यथाशक्ति, 'according to one's capacity'. Compare उपगङ्गम् (near the Ganga), प्रतिदिनम् (every day), यथासमयम् (on time).",
  },

  // ---------------- कारक एवं विभक्ति (Karaka & Vibhakti) ----------------
  {
    id: 5021, ch: 10, subj: "sanskrit", diff: "medium",
    q: "'बालकः हस्तेन लिखति।' अत्र 'हस्तेन' इति पदे का विभक्तिः, किं च कारकम्?",
    opts: ["द्वितीया — कर्म", "तृतीया — करणम्", "चतुर्थी — सम्प्रदानम्", "पञ्चमी — अपादानम्"],
    ans: 1,
    exp: "करणकारके तृतीया विभक्तिः. The करण is the instrument BY WHICH an action is performed, and it takes the third case. हस्तेन = 'with the hand'. Compare नेत्राभ्यां पश्यति ('sees with the eyes') and कर्णाभ्यां शृणोति ('hears with the ears').",
  },
  {
    id: 5022, ch: 10, subj: "sanskrit", diff: "hard",
    q: "'वृक्षात् पत्रं पतति।' अत्र 'वृक्षात्' इति पदे किं कारकम्?",
    opts: ["अधिकरणम्", "सम्प्रदानम्", "अपादानम्", "करणम्"],
    ans: 2,
    exp: "अपादानकारके पञ्चमी विभक्तिः. The अपादान is the fixed point FROM WHICH separation occurs, and it takes the fifth case. वृक्षात् = 'from the tree'. The defining rule is ध्रुवमपायेऽपादानम् — whatever stays fixed while something moves away from it. Compare ग्रामात् आगच्छति ('comes from the village').",
  },
  {
    id: 5023, ch: 10, subj: "sanskrit", diff: "hard",
    q: "'विप्राय गां ददाति।' अत्र 'विप्राय' इति पदे का विभक्तिः, किं च कारकम्?",
    opts: ["चतुर्थी — सम्प्रदानम्", "षष्ठी — सम्बन्धः", "तृतीया — करणम्", "सप्तमी — अधिकरणम्"],
    ans: 0,
    exp: "सम्प्रदानकारके चतुर्थी विभक्तिः. The सम्प्रदान is the recipient — the one FOR whom or TO whom something is given — and it takes the fourth case. The rule is कर्मणा यमभिप्रैति स सम्प्रदानम्. विप्राय = 'to the brahmin'. Verbs of giving (दा), telling (कथ्) and pleasing (रुच्) commonly take this case.",
  },
  {
    id: 5024, ch: 11, subj: "sanskrit", diff: "medium",
    q: "'गृहे माता अस्ति।' अत्र 'गृहे' इति पदे किं कारकम्?",
    opts: ["कर्म", "करणम्", "अधिकरणम्", "अपादानम्"],
    ans: 2,
    exp: "अधिकरणकारके सप्तमी विभक्तिः. The अधिकरण is the location — the place IN or ON which the action occurs — and it takes the seventh case. गृहे = 'in the house'. Compare नद्यां जलम् अस्ति ('there is water in the river') and वृक्षे खगः तिष्ठति ('the bird sits on the tree').",
  },
  {
    id: 5025, ch: 11, subj: "sanskrit", diff: "hard",
    q: "'सः ग्रामं गच्छति।' अत्र 'ग्रामम्' इति पदस्य कारकं किम्?",
    opts: ["कर्ता", "कर्म", "अधिकरणम्", "सम्प्रदानम्"],
    ans: 1,
    exp: "कर्मणि द्वितीया. The कर्म is what the agent most wishes to reach or affect — कर्तुरीप्सिततमं कर्म — and it takes the second case. With verbs of motion the destination is treated as the कर्म, so ग्रामम् ('to the village') is द्वितीया, not सप्तमी. This is a frequently tested distinction.",
  },

  // ---------------- वाच्य (Voice) ----------------
  {
    id: 5026, ch: 11, subj: "sanskrit", diff: "hard",
    q: "'रामः पुस्तकं पठति।' इत्यस्य कर्मवाच्ये रूपं किम्?",
    opts: ["रामः पुस्तकेन पठ्यते", "रामेण पुस्तकं पठ्यते", "रामाय पुस्तकं पठ्यते", "रामात् पुस्तकं पठ्यते"],
    ans: 1,
    exp: "In कर्मवाच्य (passive voice) three changes happen together: (1) the agent takes तृतीया — रामः becomes रामेण; (2) the object takes प्रथमा and the verb agrees with IT; (3) the verb takes the passive form पठ्यते. Result: रामेण पुस्तकं पठ्यते, 'the book is read by Rama'.",
  },
  {
    id: 5027, ch: 12, subj: "sanskrit", diff: "hard",
    q: "'बालकः गच्छति।' इत्यस्य भाववाच्ये रूपं किम्?",
    opts: ["बालकः गम्यते", "बालकेन गम्यते", "बालकम् गम्यते", "बालकाय गम्यते"],
    ans: 1,
    exp: "भाववाच्य is used for INTRANSITIVE verbs, which have no object to promote. The agent takes तृतीया and the verb goes into the third person singular regardless of the agent's number: बालकेन गम्यते, literally 'going is done by the boy'. Compare मया हस्यते ('laughing is done by me').",
  },

  // ---------------- चापटर-विषयक (Chapter-based) ----------------
  {
    id: 5028, ch: 1, subj: "sanskrit", diff: "medium",
    q: "'शुचिपर्यावरणम्' इति पाठे कः मुख्यः सन्देशः?",
    opts: ["केवलं धनम् एव महत्त्वपूर्णम्", "पर्यावरणस्य शुद्धता जीवनस्य आधारः", "वृक्षाः अनावश्यकाः", "जलं दूषितं भवतु"],
    ans: 1,
    exp: "The chapter's central message is that a clean environment is the foundation of life itself (पर्यावरणस्य शुद्धता जीवनस्य आधारः). शुचि = pure/clean; पर्यावरण = that which surrounds (परि 'around' + आवरण 'covering'). The etymology itself carries the idea that the environment is not separate from us but encircles us.",
  },
  {
    id: 5029, ch: 3, subj: "sanskrit", diff: "medium",
    q: "'गोदोहनम्' इति शब्दस्य अर्थः कः?",
    opts: ["गवां पालनम्", "गोः दोहनम् (milking of a cow)", "गोः विक्रयः", "गोशाला"],
    ans: 1,
    exp: "गोदोहनम् = गोः दोहनम्, a षष्ठी-तत्पुरुष compound meaning 'the milking of a cow'. गो = cow; दोहन = milking. The chapter uses the image to make a point about greed — attempting to extract more than is reasonable defeats the purpose entirely.",
  },
  {
    id: 5030, ch: 5, subj: "sanskrit", diff: "medium",
    q: "'जननी तु गुरुः' इत्यस्य भावः कः?",
    opts: ["माता एव प्रथमा गुरुः", "गुरुः एव माता", "जननी न पूजनीया", "गुरुः मातुः अधिकः"],
    ans: 0,
    exp: "जननी = mother (literally 'she who gives birth', from जन् 'to be born'); गुरुः = teacher. The chapter's claim is that the mother is the FIRST teacher — a child's earliest learning about language, conduct and values happens at home before any formal schooling begins. This echoes the traditional मातृदेवो भव.",
  },
  {
    id: 5031, ch: 6, subj: "sanskrit", diff: "hard",
    q: "'सूक्तिस्तबकः' इति शब्दस्य विग्रहः कः?",
    opts: ["सूक्तीनां स्तबकः — a bunch/cluster of wise sayings", "सूक्तिः च स्तबकः च", "स्तबकस्य सूक्तिः", "सूक्तिः स्तबके यस्य सः"],
    ans: 0,
    exp: "सूक्तिस्तबकः = सूक्तीनां स्तबकः, a षष्ठी-तत्पुरुष compound. सु + उक्ति = सूक्ति, 'a well-spoken saying'; स्तबक = a bunch or cluster, as of flowers. The title therefore means 'a bouquet of wise sayings' — an apt name for a chapter that gathers subhashitas from various sources.",
  },
  {
    id: 5032, ch: 7, subj: "sanskrit", diff: "medium",
    q: "'भारतमहिमा' इति पाठे भारतस्य का विशेषता वर्णिता?",
    opts: ["केवलं भौगोलिकं विस्तारम्", "सांस्कृतिकं आध्यात्मिकं च गौरवम्", "सैनिकशक्तिः एव", "वाणिज्यम् एव"],
    ans: 1,
    exp: "महिमा = greatness or glory. The chapter praises India's cultural and spiritual heritage — its rivers, mountains, sages and traditions of learning — rather than any material or military measure of greatness. The emphasis throughout is on what the land has contributed to thought and character.",
  },
  {
    id: 5033, ch: 9, subj: "sanskrit", diff: "hard",
    q: "'वाङ्मनसोर्मयूखः' इति शब्दे 'वाक्' तथा 'मनस्' इत्यनयोः सन्धिः कथं जातः?",
    opts: ["वाक् + मनस् → वाङ्मनस् (अनुनासिकसन्धिः)", "वाक् + मनस् → वाग्मनस्", "वाक् + मनस् → वाकमनस्", "वाक् + मनस् → वाच्मनस्"],
    ans: 0,
    exp: "अनुनासिकसन्धिः. When a hard consonant is followed by a NASAL (म्, न्), it changes into the nasal of its own varga. Here क् before म् becomes ङ्, giving वाङ्मनस्. The title वाङ्मनसोर्मयूखः means 'the ray of speech and mind'. Compare षट् + मासः = षण्मासः and जगत् + नाथः = जगन्नाथः.",
  },
  {
    id: 5034, ch: 11, subj: "sanskrit", diff: "medium",
    q: "'परिश्रमः' इति पाठस्य मुख्यः उपदेशः कः?",
    opts: ["भाग्यम् एव सर्वं करोति", "परिश्रमेण एव सफलता प्राप्यते", "परिश्रमः निरर्थकः", "धनेन एव सर्वं सिध्यति"],
    ans: 1,
    exp: "परिश्रमः = hard work or exertion (परि 'thoroughly' + श्रम 'labour'). The chapter argues that success comes through effort rather than through luck, echoing the well-known verse उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः — 'tasks are accomplished by effort, not by wishing'.",
  },
  {
    id: 5035, ch: 12, subj: "sanskrit", diff: "hard",
    q: "'वसुधैव कुटुम्बकम्' इत्यस्य सन्धिविच्छेदः कः?",
    opts: ["वसुधा + एव + कुटुम्बकम्", "वसुधा + इव + कुटुम्बकम्", "वसुधै + व + कुटुम्बकम्", "वसुध + एव + कुटुम्बकम्"],
    ans: 0,
    exp: "वसुधा + एव = वसुधैव by वृद्धिसन्धि (आ + ए → ऐ). The phrase means 'the earth itself is one family' and is the central idea of विश्वबन्धुत्वम्. Note that एव ('indeed, itself') is an emphatic particle, whereas इव would mean 'like' — the sense would then weaken to 'the earth is LIKE a family', which is a noticeably different claim.",
  },
  {
    id: 5036, ch: 12, subj: "sanskrit", diff: "medium",
    q: "'विश्वबन्धुत्वम्' इत्यस्य अर्थः कः?",
    opts: ["विश्वस्य विनाशः", "विश्वे सर्वेषां बन्धुत्वम् — universal brotherhood", "केवलं स्वदेशप्रेम", "युद्धस्य समर्थनम्"],
    ans: 1,
    exp: "विश्व = world; बन्धु = brother/kinsman; -त्व forms an abstract noun. So विश्वबन्धुत्वम् = 'the state of being brothers to the whole world', universal brotherhood. The chapter develops this from the Upanishadic ideal expressed in वसुधैव कुटुम्बकम्.",
  },

  // ---------------- अव्यय, संख्या, समय ----------------
  {
    id: 5037, ch: 2, subj: "sanskrit", diff: "medium",
    q: "अधोलिखितेषु किम् अव्ययपदम् अस्ति?",
    opts: ["बालकः", "गच्छति", "अधुना", "पुस्तकम्"],
    ans: 2,
    exp: "अधुना ('now') is an अव्यय — an indeclinable whose form never changes for gender, number or case. The defining rule is सदृशं त्रिषु लिङ्गेषु सर्वासु च विभक्तिषु. Other common अव्यय: अत्र, तत्र, कुत्र, अद्य, श्वः, ह्यः, सदा, कदा, इदानीम्, यदा, तदा.",
  },
  {
    id: 5038, ch: 4, subj: "sanskrit", diff: "hard",
    q: "'सार्धचतुर्वादनम्' इत्यस्य समयः कः?",
    opts: ["4:00", "4:15", "4:30", "4:45"],
    ans: 2,
    exp: "सार्ध = 'with a half' (स + अर्ध), so सार्धचतुर्वादनम् = 4:30. The related time words: सपाद = quarter past (सपादचतुर्वादनम् = 4:15); पादोन = quarter to (पादोनचतुर्वादनम् = 3:45); and plain चतुर्वादनम् = 4:00. वादन itself comes from वद्, referring to the striking of a clock.",
  },
  {
    id: 5039, ch: 6, subj: "sanskrit", diff: "medium",
    q: "'एकादश' इत्यस्य अङ्केषु मूल्यं किम्?",
    opts: ["9", "10", "11", "12"],
    ans: 2,
    exp: "एक + दश = एकादश = 11. The pattern continues transparently: द्वादश (12), त्रयोदश (13), चतुर्दश (14), पञ्चदश (15). Note that the joining follows sandhi — एक + दश gives एकादश by दीर्घसन्धि, not एकदश.",
  },
  {
    id: 5040, ch: 10, subj: "sanskrit", diff: "hard",
    q: "'अनया अकृतम्' इति शीर्षके 'अनया' इति पदस्य विभक्तिः लिङ्गं च किम्?",
    opts: ["प्रथमा, स्त्रीलिङ्गम्", "तृतीया, स्त्रीलिङ्गम्", "द्वितीया, पुंलिङ्गम्", "षष्ठी, नपुंसकलिङ्गम्"],
    ans: 1,
    exp: "अनया is the तृतीया एकवचन (instrumental singular) feminine form of इदम् ('this'), meaning 'by her / by this woman'. The third case is required because the sentence is in कर्मवाच्य — in the passive, the agent takes तृतीया. The title therefore means 'this was done by her'.",
  },

  // ---------------- अतिरिक्त व्याकरण ----------------
  {
    id: 5041, ch: 1, subj: "sanskrit", diff: "hard",
    q: "'बालक' शब्दस्य स्त्रीलिङ्गरूपं किम्, कश्च प्रत्ययः?",
    opts: ["बालकी — ङीप्", "बालिका — टाप् (with इत्व)", "बालका — टाप्", "बालकिनी — इनि"],
    ans: 1,
    exp: "बालक becomes बालिका in the feminine. The टाप् suffix adds आ, and the क of बालक is preceded by इ in the feminine formation. Compare अध्यापक → अध्यापिका, गायक → गायिका, नायक → नायिका. Contrast ङीप्, which adds ई: नद → नदी, कुमार → कुमारी.",
  },
  {
    id: 5042, ch: 3, subj: "sanskrit", diff: "medium",
    q: "'पठ्' धातोः लट्लकारे प्रथमपुरुषे बहुवचने रूपं किम्?",
    opts: ["पठति", "पठतः", "पठन्ति", "पठामः"],
    ans: 2,
    exp: "लट्लकार (present tense), प्रथमपुरुष (third person in Sanskrit terms): पठति (singular), पठतः (dual), पठन्ति (plural). Note that Sanskrit's प्रथमपुरुष corresponds to English's THIRD person — a reversal from the English convention that regularly confuses students. मध्यमपुरुष is 'you' and उत्तमपुरुष is 'I/we'.",
  },
  {
    id: 5043, ch: 5, subj: "sanskrit", diff: "hard",
    q: "'गम्' धातोः लृट्लकारे प्रथमपुरुषे एकवचने रूपं किम्?",
    opts: ["गच्छति", "अगच्छत्", "गमिष्यति", "गच्छतु"],
    ans: 2,
    exp: "लृट्लकार is the future tense: गमिष्यति, 'he/she will go'. The five commonly tested लकार in Class 10 are लट् (present, गच्छति), लङ् (past, अगच्छत्), लृट् (future, गमिष्यति), लोट् (imperative, गच्छतु), and विधिलिङ् (potential/should, गच्छेत्).",
  },
  {
    id: 5044, ch: 7, subj: "sanskrit", diff: "hard",
    q: "'अस्मद्' शब्दस्य षष्ठी-बहुवचने रूपं किम्?",
    opts: ["मम", "अस्माकम्", "अस्माभिः", "अस्मान्"],
    ans: 1,
    exp: "अस्मद् ('I/we') in the sixth case plural is अस्माकम् ('our'). The pattern: मम (my, singular), आवयोः (of us two), अस्माकम् (our, plural). Compare the second-person युष्मद्: तव (your, singular), युवयोः (of you two), युष्माकम् (your, plural). These appear in the familiar line त्वदीयं वस्तु गोविन्द तुभ्यमेव समर्पये.",
  },
  {
    id: 5045, ch: 8, subj: "sanskrit", diff: "medium",
    q: "'पर्यावरणम्' इति शब्दस्य सन्धिविच्छेदः कः?",
    opts: ["परि + आवरणम्", "पर + यावरणम्", "पर्या + वरणम्", "परी + आवरणम्"],
    ans: 0,
    exp: "परि + आवरणम् = पर्यावरणम् by यण्सन्धि (इ + आ → य् + आ = या). परि means 'around' and आवरण means 'covering' or 'enclosure' — so the word literally denotes 'that which covers us all around'. The etymology itself expresses the chapter's argument that we are inside the environment, not outside it.",
  },
  {
    id: 5046, ch: 10, subj: "sanskrit", diff: "hard",
    q: "'सः पुस्तकं पठितुम् इच्छति।' अत्र 'पठितुम्' इति पदं किं सूचयति?",
    opts: ["समाप्तां क्रियाम् (completed action)", "प्रयोजनम् / उद्देश्यम् (purpose)", "वर्तमानां क्रियाम् (ongoing action)", "आदेशम् (command)"],
    ans: 1,
    exp: "The तुमुन् suffix expresses PURPOSE — 'in order to'. पठितुम् इच्छति = 'he wishes to read'. तुमुन् is regularly used with verbs of wishing (इच्छति), being able (शक्नोति), beginning (आरभते) and going (गच्छति). Contrast क्त्वा (पठित्वा), which marks a completed PRIOR action.",
  },
  {
    id: 5047, ch: 12, subj: "sanskrit", diff: "medium", pyq: true,
    q: "'सत्यमेव जयते' इत्यस्य सन्धिविच्छेदः कः?",
    opts: ["सत्यम् + एव + जयते", "सत्य + मेव + जयते", "सत्यमे + व + जयते", "सत् + यमेव + जयते"],
    ans: 0,
    exp: "सत्यम् + एव = सत्यमेव. The म् of सत्यम् simply joins the following vowel, giving 'truth alone triumphs'. This line is from the Mundaka Upanishad and is inscribed on India's state emblem. The particle एव again supplies the emphatic 'alone / indeed'.",
  },
  {
    id: 5048, ch: 4, subj: "sanskrit", diff: "hard",
    q: "'शिशुलालनम्' इत्यस्य समासविग्रहः कः?",
    opts: ["शिशोः लालनम् — षष्ठीतत्पुरुषः", "शिशुः च लालनम् च — द्वन्द्वः", "शिशुः लालनम् यस्य सः — बहुव्रीहिः", "शिशौ लालनम् — सप्तमीतत्पुरुषः"],
    ans: 0,
    exp: "शिशुलालनम् = शिशोः लालनम्, a षष्ठी-तत्पुरुष compound meaning 'the fondling/nurturing of a child'. शिशु = infant; लालन = caressing or bringing up with affection. The type is identified by which case appears in the विग्रह — here षष्ठी (शिशोः), so it is a षष्ठीतत्पुरुष.",
  },
];

// =====================================================================
// SHORT ANSWERS
// =====================================================================

export const EXTRA_SKT_SHORT_QA: SKTQA[] = [
  {
    id: 5001, ch: 1, subj: "sanskrit", marks: 3,
    q: "सन्धिं कुरुत तथा सन्धिभेदं लिखत — (क) देव + इन्द्रः (ख) महा + ऋषिः (ग) गुरु + उपदेशः (घ) तथा + अपि",
    a: "(क) देव + इन्द्रः = देवेन्द्रः\nसन्धिभेदः: गुणसन्धिः\nनियमः: अ/आ + इ/ई → ए\n\n(ख) महा + ऋषिः = महर्षिः\nसन्धिभेदः: गुणसन्धिः\nनियमः: अ/आ + ऋ → अर्\n\n(ग) गुरु + उपदेशः = गुरूपदेशः\nसन्धिभेदः: दीर्घसन्धिः (सवर्णदीर्घः)\nनियमः: उ + उ → ऊ (two similar vowels merge into the long form)\n\n(घ) तथा + अपि = तथापि\nसन्धिभेदः: दीर्घसन्धिः\nनियमः: आ + अ → आ\n\nSUMMARY OF THE TWO RULES USED:\n\nदीर्घसन्धि applies when the two vowels are SIMILAR (सवर्ण) — they simply merge into the long version of the same sound.\n\nगुणसन्धि applies when अ/आ is followed by a DISSIMILAR vowel — इ/ई gives ए, उ/ऊ gives ओ, and ऋ gives अर्.\n\nThe practical test is therefore: are the two vowels of the same family? If yes, lengthen. If not, apply guna.",
  },
  {
    id: 5002, ch: 2, subj: "sanskrit", marks: 3,
    q: "अधोलिखितानां पदानां सन्धिविच्छेदं कुरुत — (क) स्वागतम् (ख) रामोऽपि (ग) निश्चयः (घ) सज्जनः",
    a: "(क) स्वागतम् = सु + आगतम्\nसन्धिभेदः: यण्सन्धिः\nनियमः: उ + आ → व् + आ = वा\nअर्थः: welcome (literally 'well-come')\n\n(ख) रामोऽपि = रामः + अपि\nसन्धिभेदः: विसर्गसन्धिः (उत्वम्)\nनियमः: अः + अ → ओ, and the following अ is dropped, marked by अवग्रह (ऽ)\nअर्थः: Rama also\n\n(ग) निश्चयः = निः + चयः\nसन्धिभेदः: विसर्गसन्धिः (श्चुत्वम्)\nनियमः: visarga before च्/छ् becomes श्\nअर्थः: certainty, firm decision\n\n(घ) सज्जनः = सत् + जनः\nसन्धिभेदः: व्यञ्जनसन्धिः (श्चुत्वम्)\nनियमः: a त्-varga consonant before a च्-varga consonant changes to the corresponding च्-varga letter (त् + ज् → ज्ज्)\nअर्थः: a good person\n\nA NOTE ON METHOD:\n\nWhen splitting a sandhi, work backwards from the result. Ask which rule could have produced the letter you actually see. In (ख) the अवग्रह sign is itself the clue — it appears only where an अ has been elided after ओ, so the original must have been अः + अ.",
  },
  {
    id: 5003, ch: 3, subj: "sanskrit", marks: 3,
    q: "प्रत्ययं योजयित्वा पदरचनां कुरुत — (क) पठ् + क्त्वा (ख) आ + गम् + ल्यप् (ग) कृ + तुमुन् (घ) बल + मतुप्। प्रत्येकस्य प्रयोगं वाक्ये दर्शयत।",
    a: "(क) पठ् + क्त्वा = पठित्वा\nअर्थः: having read\nवाक्यम्: सः पुस्तकं पठित्वा गच्छति। (Having read the book, he goes.)\n\n(ख) आ + गम् + ल्यप् = आगत्य\nअर्थः: having come\nवाक्यम्: सः गृहम् आगत्य भोजनं करोति। (Having come home, he eats.)\n\n(ग) कृ + तुमुन् = कर्तुम्\nअर्थः: in order to do / to do\nवाक्यम्: सः कार्यं कर्तुम् इच्छति। (He wishes to do the work.)\n\n(घ) बल + मतुप् = बलवान्\nअर्थः: strong, one possessing strength\nवाक्यम्: बलवान् बालकः क्रीडति। (The strong boy plays.)\n\nTHE CRITICAL RULE — क्त्वा versus ल्यप्:\n\nBoth express a completed prior action ('having done X'), and the choice between them is governed entirely by one condition:\n\n• NO प्रefix (उपसर्ग) on the root → use क्त्वा, which appears as -त्वा\n  गम् + क्त्वा = गत्वा\n\n• प्रefix PRESENT → क्त्वा is REPLACED by ल्यप्, which appears as -य\n  आ + गम् = आगत्य\n  प्र + नम् = प्रणम्य\n  वि + हस् = विहस्य\n\nWriting आगत्वा instead of आगत्य is the single most frequent error in this topic, and it is entirely avoidable — check for an उपसर्ग before choosing the suffix.\n\nमतुप् — A SECONDARY NOTE:\nAfter अ/आ the suffix appears as वत् (बलवान्, धनवान्); after इ/उ it keeps म् (बुद्धिमान्, श्रीमान्).",
  },
  {
    id: 5004, ch: 4, subj: "sanskrit", marks: 3,
    q: "समासविग्रहं कुरुत तथा समासभेदं लिखत — (क) नीलकमलम् (ख) रामकृष्णौ (ग) पीताम्बरः (घ) यथाशक्ति",
    a: "(क) नीलकमलम् = नीलम् च तत् कमलम् च\nसमासभेदः: कर्मधारयसमासः\nलक्षणम्: One member qualifies the other as an adjective, and BOTH refer to the same thing.\nअर्थः: blue lotus\n\n(ख) रामकृष्णौ = रामः च कृष्णः च\nसमासभेदः: द्वन्द्वसमासः\nलक्षणम्: Both members are of EQUAL importance, joined by च in the विग्रह. Since two persons are named, the compound takes the dual (द्विवचनम्).\nअर्थः: Rama and Krishna\n\n(ग) पीताम्बरः = पीतम् अम्बरम् यस्य सः\nसमासभेदः: बहुव्रीहिसमासः\nलक्षणम्: The compound refers to something OUTSIDE its own members. Neither पीत nor अम्बर means Vishnu.\nअर्थः: Vishnu ('he whose garment is yellow')\n\n(घ) यथाशक्ति = शक्तिम् अनतिक्रम्य\nसमासभेदः: अव्ययीभावसमासः\nलक्षणम्: The FIRST member is an indeclinable, and the whole compound behaves as an indeclinable — always neuter singular, never changing form.\nअर्थः: according to one's capacity\n\nHOW TO IDENTIFY THE TYPE QUICKLY:\n\nThe विग्रह itself gives the answer:\n• Contains यस्य / यस्याः / येषाम् → बहुव्रीहि (points outside itself)\n• Contains च ... च → द्वन्द्व (equal partners)\n• Contains च तत् / adjective + noun of the same referent → कर्मधारय\n• Begins with a numeral and means a collection (समाहार) → द्विगु\n• Begins with an अव्यय → अव्ययीभाव\n• Contains a case ending other than प्रथमा in the first member → तत्पुरुष\n\nWorking from the विग्रह rather than from the compound is far more reliable, which is why board questions almost always ask for both together.",
  },
  {
    id: 5005, ch: 5, subj: "sanskrit", marks: 2,
    q: "अनूद्यताम् — 'माता एव प्रथमा गुरुः भवति।' (Translate into English and Hindi, with a grammar note.)",
    a: "ENGLISH: The mother alone is the first teacher.\n\nहिन्दी: माता ही प्रथम गुरु होती है।\n\nपदपरिचयः (word analysis):\n• माता — प्रथमा विभक्तिः, एकवचनम्, स्त्रीलिङ्गम् (subject/कर्ता)\n• एव — अव्ययम् (emphatic particle: 'alone, indeed')\n• प्रथमा — विशेषणम् agreeing with गुरुः in gender, number and case\n• गुरुः — प्रथमा विभक्तिः, एकवचनम् (predicate noun)\n• भवति — लट्लकारः, प्रथमपुरुषः, एकवचनम् (भू धातु)\n\nGRAMMAR NOTE:\n\nThe particle एव is doing real work here and should not be dropped in translation. Without it the sentence would simply state that the mother is a first teacher; with it, the claim is that she alone is, which is much stronger.\n\nNote also that प्रथमा takes the feminine form to agree with गुरुः as used here. In Sanskrit an adjective must match its noun in लिङ्ग, वचन and विभक्ति — a rule tested constantly in translation questions.\n\nCONTEXT: The sentiment reflects the chapter जननी तु गुरुः and the traditional invocation मातृदेवो भव, पितृदेवो भव, आचार्यदेवो भव — where the mother is named first of the three.",
  },
  {
    id: 5006, ch: 6, subj: "sanskrit", marks: 3,
    q: "'उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।' अस्य श्लोकांशस्य अर्थं लिखत, भावं च स्पष्टीकुरुत।",
    a: "अर्थः (Meaning):\n\nENGLISH: Tasks are accomplished by effort, not by wishes.\n\nहिन्दी: कार्य परिश्रम से सिद्ध होते हैं, केवल मनोरथों (इच्छाओं) से नहीं।\n\nपदार्थः (word-by-word):\n• उद्यमेन — by effort (तृतीया विभक्तिः, करणकारकम्)\n• हि — indeed (अव्ययम्, emphatic)\n• सिध्यन्ति — are accomplished (लट्लकारः, बहुवचनम्)\n• कार्याणि — tasks (प्रथमा, बहुवचनम्, नपुंसकलिङ्गम्)\n• न — not\n• मनोरथैः — by wishes (तृतीया, बहुवचनम्)\n\nभावः (The idea developed):\n\nThe verse sets up a deliberate contrast between two instrumentals — उद्यमेन and मनोरथैः. Both are in the third case, both are presented as possible means, and the verse rejects one.\n\nThe point is not that wishing is wrong. Desire is what sets a goal in the first place. The claim is that desire alone accomplishes nothing — it must be followed by sustained effort before anything is achieved.\n\nThe full verse continues: न हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः — 'deer do not walk into the mouth of a sleeping lion'. Even the strongest creature must hunt. Capability without exertion produces nothing.\n\nWHY THE IMAGE IS WELL CHOSEN:\n\nA lion is the least likely animal to need help, which makes it the strongest possible case. If even the lion must act, then no one is exempt on grounds of natural advantage.\n\nसम्बद्धः पाठः: This is the core argument of the chapter परिश्रमः.",
  },
  {
    id: 5007, ch: 7, subj: "sanskrit", marks: 3,
    q: "वाच्यपरिवर्तनं कुरुत — (क) रामः पुस्तकं पठति। (कर्मवाच्ये) (ख) छात्रेण पाठः स्मर्यते। (कर्तृवाच्ये) (ग) बालकः हसति। (भाववाच्ये)",
    a: "(क) कर्तृवाच्य → कर्मवाच्य\n\nमूलम्: रामः पुस्तकं पठति।\nपरिवर्तितम्: रामेण पुस्तकं पठ्यते।\n\nTHREE CHANGES:\n1. कर्ता रामः (प्रथमा) → रामेण (तृतीया)\n2. कर्म पुस्तकम् (द्वितीया) → पुस्तकम् (प्रथमा)\n3. क्रिया पठति → पठ्यते, and now agrees with the OBJECT, not the agent\n\nअर्थः: The book is read by Rama.\n\n(ख) कर्मवाच्य → कर्तृवाच्य\n\nमूलम्: छात्रेण पाठः स्मर्यते।\nपरिवर्तितम्: छात्रः पाठं स्मरति।\n\nCHANGES (reversed):\n1. छात्रेण (तृतीया) → छात्रः (प्रथमा)\n2. पाठः (प्रथमा) → पाठम् (द्वितीया)\n3. स्मर्यते → स्मरति, now agreeing with the agent\n\nअर्थः: The student remembers the lesson.\n\n(ग) कर्तृवाच्य → भाववाच्य\n\nमूलम्: बालकः हसति।\nपरिवर्तितम्: बालकेन हस्यते।\n\nCHANGES:\n1. बालकः (प्रथमा) → बालकेन (तृतीया)\n2. हसति → हस्यते, which stays in the THIRD PERSON SINGULAR regardless of the agent's number\n\nअर्थः: Laughing is done by the boy.\n\nTHE GOVERNING DISTINCTION:\n\nकर्मवाच्य is used for TRANSITIVE verbs (सकर्मक) — there is an object available to be promoted to the subject position.\n\nभाववाच्य is used for INTRANSITIVE verbs (अकर्मक) — there is no object at all, so nothing can be promoted. The verb therefore defaults to third person singular and the sentence describes the action itself rather than anyone acting.\n\nThis is why हसति, गच्छति and तिष्ठति take भाववाच्य, while पठति, लिखति and खादति take कर्मवाच्य. Identifying whether the verb has an object is the first step in any वाच्यपरिवर्तन question.",
  },
  {
    id: 5008, ch: 8, subj: "sanskrit", marks: 3,
    q: "'पर्यावरणम्' इति पाठस्य आधारेण पर्यावरणसंरक्षणस्य त्रीणि उपायानि संस्कृतभाषायाम् लिखत।",
    a: "पर्यावरणसंरक्षणस्य उपायाः:\n\n१. वृक्षारोपणम्\nसंस्कृतवाक्यम्: वयं बहून् वृक्षान् रोपयेम।\nअर्थः: We should plant many trees.\nकारणम्: वृक्षाः वायुं शुद्धं कुर्वन्ति, वर्षां च आकर्षयन्ति। (Trees purify the air and attract rain.)\n\n२. जलसंरक्षणम्\nसंस्कृतवाक्यम्: जलं न अपव्ययेम, वर्षाजलं संगृह्णीयाम।\nअर्थः: We should not waste water, and should collect rainwater.\nकारणम्: जलम् एव जीवनम्। (Water itself is life.)\n\n३. प्रदूषणनिवारणम्\nसंस्कृतवाक्यम्: वयं प्लास्टिकस्य प्रयोगं न्यूनं कुर्याम।\nअर्थः: We should reduce the use of plastic.\nकारणम्: प्लास्टिकम् अविघटनीयम् अस्ति। (Plastic is non-degradable.)\n\nपाठस्य मुख्यः सन्देशः:\n\nपर्यावरणम् = परि (around) + आवरणम् (covering). The etymology carries the chapter's central claim: the environment is not something external to us but something that surrounds and contains us. Harming it is therefore not harming something else — it is harming the thing we live inside.\n\nसम्बद्धा सूक्तिः:\nवृक्षो रक्षति रक्षितः — 'the tree protects the one who protects it'. The line captures the reciprocity the chapter argues for, in which conservation is presented as self-interest rather than sacrifice.\n\nA NOTE ON WRITING SANSKRIT ANSWERS:\n\nFor questions asking for points in Sanskrit, विधिलिङ् forms (रोपयेम, कुर्याम, संगृह्णीयाम — 'we should...') are appropriate, since the sense required is recommendation rather than statement of fact. Using लट् (रोपयामः, 'we plant') would change the meaning to a description of what already happens.",
  },
  {
    id: 5009, ch: 9, subj: "sanskrit", marks: 2,
    q: "अधोलिखितयोः पदयोः कारकं विभक्तिं च लिखत — (क) 'सः कलमेन लिखति।' — कलमेन (ख) 'वृक्षात् फलं पतति।' — वृक्षात्",
    a: "(क) कलमेन\n\nविभक्तिः: तृतीया विभक्तिः, एकवचनम्\nकारकम्: करणकारकम्\nनियमः: साधकतमं करणम् — the most effective means by which an action is accomplished takes the third case.\nअर्थः: with a pen / by means of a pen\n\nअन्ये उदाहरणाः:\n• हस्तेन खादति (eats with the hand)\n• नेत्राभ्यां पश्यति (sees with the eyes)\n• पादाभ्यां चलति (walks with the feet)\n\n(ख) वृक्षात्\n\nविभक्तिः: पञ्चमी विभक्तिः, एकवचनम्\nकारकम्: अपादानकारकम्\nनियमः: ध्रुवमपायेऽपादानम् — the FIXED point from which separation or movement away occurs takes the fifth case.\nअर्थः: from the tree\n\nअन्ये उदाहरणाः:\n• ग्रामात् आगच्छति (comes from the village)\n• पर्वतात् नदी प्रवहति (the river flows from the mountain)\n• गृहात् निर्गच्छति (goes out from the house)\n\nTHE KEY WORD IN THE अपादान RULE:\n\nध्रुवम् means 'fixed'. The tree does not move — the fruit does. The अपादान is always the stationary reference point, not the thing in motion. This is what distinguishes it from other cases and is worth stating explicitly when the question asks for the नियम.",
  },
  {
    id: 5010, ch: 10, subj: "sanskrit", marks: 3,
    q: "अधोलिखितानि वाक्यानि संस्कृते अनूद्यताम् — (क) The boy goes to school. (ख) The girl reads a book. (ग) Trees give us fruits.",
    a: "(क) The boy goes to school.\nसंस्कृतम्: बालकः विद्यालयं गच्छति।\n\nपदपरिचयः:\n• बालकः — प्रथमा, एकवचनम् (कर्ता)\n• विद्यालयम् — द्वितीया, एकवचनम् (कर्म — destination takes द्वितीया with verbs of motion)\n• गच्छति — लट्लकारः, प्रथमपुरुषः, एकवचनम्\n\nNOTE: With verbs of motion, the destination is treated as the कर्म and takes द्वितीया, NOT सप्तमी. Writing विद्यालये गच्छति is a common error — that would mean 'goes in the school'.\n\n(ख) The girl reads a book.\nसंस्कृतम्: बालिका पुस्तकं पठति।\n\nपदपरिचयः:\n• बालिका — प्रथमा, एकवचनम्, स्त्रीलिङ्गम्\n• पुस्तकम् — द्वितीया, एकवचनम्, नपुंसकलिङ्गम् (कर्म)\n• पठति — लट्लकारः, एकवचनम्\n\n(ग) Trees give us fruits.\nसंस्कृतम्: वृक्षाः अस्मभ्यं फलानि यच्छन्ति।\n\nपदपरिचयः:\n• वृक्षाः — प्रथमा, बहुवचनम् (कर्ता)\n• अस्मभ्यम् — चतुर्थी, बहुवचनम् (सम्प्रदानम् — the recipient takes चतुर्थी)\n• फलानि — द्वितीया, बहुवचनम् (कर्म)\n• यच्छन्ति — लट्लकारः, बहुवचनम् (दा धातु)\n\nWHY अस्मभ्यम् AND NOT अस्मान्:\n\nThe verb दा ('to give') takes the recipient in चतुर्थी, because the recipient is the सम्प्रदान — the one FOR whom the action is done. The thing given is the कर्म and takes द्वितीया.\n\nSo the sentence has two 'objects' in English but two DIFFERENT cases in Sanskrit, which is exactly the kind of distinction translation questions are designed to test.\n\nGENERAL METHOD FOR TRANSLATION:\n1. Identify the कर्ता → प्रथमा\n2. Identify the कर्म → द्वितीया\n3. Identify any recipient → चतुर्थी\n4. Make the verb agree with the कर्ता in पुरुष and वचन\n5. Make every adjective agree with its noun in लिङ्ग, वचन and विभक्ति",
  },
  {
    id: 5011, ch: 11, subj: "sanskrit", marks: 3,
    q: "'परिश्रमः' इति विषये पञ्च संस्कृतवाक्यानि लिखत।",
    a: "परिश्रमः\n\n१. परिश्रमः एव सफलतायाः कुञ्जिका अस्ति।\n(Hard work alone is the key to success.)\n\n२. यः परिश्रमं करोति सः एव उन्नतिं प्राप्नोति।\n(One who works hard is the one who attains progress.)\n\n३. आलस्यं मनुष्यस्य महान् शत्रुः अस्ति।\n(Laziness is man's great enemy.)\n\n४. विद्यार्थिनः नित्यं परिश्रमेण अध्ययनं कुर्युः।\n(Students should study diligently every day.)\n\n५. परिश्रमेण विना किमपि न सिध्यति।\n(Without hard work nothing is accomplished.)\n\nसम्बद्धाः सूक्तयः (related maxims that support the theme):\n\n• उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।\n(Tasks are accomplished by effort, not by wishes.)\n\n• आलस्यं हि मनुष्याणां शरीरस्थो महान् रिपुः।\n(Laziness is the great enemy dwelling within the human body.)\n\n• श्रमेण लभ्यते सर्वं श्रमः सर्वस्य साधनम्।\n(Everything is obtained through labour; labour is the means to all things.)\n\nव्याकरणटिप्पणी (grammar notes on the sentences above):\n\n• In sentence 1, एव is the emphatic particle — it is what turns 'hard work is a key' into 'hard work ALONE is the key'.\n\n• In sentence 2, the correlative pair यः ... सः ('he who ... he') is the standard Sanskrit relative construction and is worth using in composition answers.\n\n• In sentence 4, कुर्युः is विधिलिङ् (potential mood, plural) — 'should do'. Using लट् (कुर्वन्ति) would state that students DO study hard rather than that they should.\n\n• In sentence 5, विना governs the तृतीया विभक्ति (परिश्रमेण), which is why the instrumental appears even though the sense is 'without'.",
  },
  {
    id: 5012, ch: 12, subj: "sanskrit", marks: 3,
    q: "'वसुधैव कुटुम्बकम्' इत्यस्य अर्थं लिखत, अस्य भावं च विस्तरेण स्पष्टीकुरुत।",
    a: "सन्धिविच्छेदः: वसुधा + एव + कुटुम्बकम्\nसन्धिभेदः: वृद्धिसन्धिः (आ + ए → ऐ)\n\nपदार्थः:\n• वसुधा — the earth (literally 'that which holds wealth': वसु 'wealth' + धा 'to hold')\n• एव — indeed, itself (अव्ययम्, emphatic)\n• कुटुम्बकम् — family\n\nअर्थः:\nENGLISH: The earth itself is one family.\nहिन्दी: पृथ्वी ही एक कुटुम्ब है।\n\nभावविस्तारः (the idea developed):\n\n१. THE CLAIM IS STRONGER THAN IT LOOKS\n\nThe particle एव is doing essential work. With इव, the phrase would mean 'the earth is LIKE a family' — a comparison, and a fairly modest one.\n\nWith एव, it means the earth IS a family. This is not a simile but an assertion of fact, and the difference is the whole point of the maxim.\n\n२. सङ्कुचितदृष्टेः त्यागः (the rejection of narrow thinking)\n\nThe fuller verse, from the Maha Upanishad, runs:\nअयं निजः परो वेति गणना लघुचेतसाम्।\nउदारचरितानां तु वसुधैव कुटुम्बकम्॥\n\n'This one is mine, that one is a stranger — such calculation belongs to the small-minded. For those of noble conduct, the whole earth is one family.'\n\nThe verse does not merely recommend universal brotherhood; it characterises the alternative. Dividing people into 'ours' and 'others' is described as लघुचेतसाम् — belonging to those of small mind.\n\n३. आधुनिकसन्दर्भः (contemporary relevance)\n\nThe idea has obvious application to problems that do not respect borders — environmental damage, pandemics, and the movement of people. A polluted river or a warming atmosphere does not distinguish between nations, which gives the ancient formulation a fairly literal modern sense.\n\nIndia has used the phrase as a guiding principle in its diplomatic self-presentation, and it is inscribed in the entrance hall of the Indian Parliament.\n\n४. पाठेन सह सम्बन्धः\n\nThis is the organising idea of the chapter विश्वबन्धुत्वम् — विश्व (world) + बन्धु (kinsman) + त्व (abstract suffix), 'the state of being kin to the whole world'.\n\nनिष्कर्षः:\n\nThe maxim's endurance owes something to its economy. Three words assert that the largest possible unit of belonging is also the most intimate one — and the surrounding verse makes clear that this is offered as a description of how a generous mind actually sees the world, not as an instruction to pretend.",
  },

  // =====================================================================
  // शब्दरूप एवं धातुरूप — declension & conjugation drills
  // =====================================================================
  // Added in place of the long-answer essays: these are the two core
  // paribhasha skills (noun and verb forms) that don't get exercised
  // anywhere else in the short-answer set, and they're worth marks on
  // their own in the Vyakaranvidhi section regardless of chapter.

  {
    id: 5013, ch: 1, subj: "sanskrit", marks: 3,
    q: "'राम' शब्दस्य (पुंलिङ्ग, अकारान्त) रूपाणि प्रथमा, द्वितीया, तृतीया विभक्तिषु त्रिषु वचनेषु लिखत।",
    a: "राम-शब्दः (अकारान्त, पुंलिङ्ग)\n\nप्रथमा विभक्तिः (कर्ता):\nएकवचनम् — रामः\nद्विवचनम् — रामौ\nबहुवचनम् — रामाः\n\nद्वितीया विभक्तिः (कर्म):\nएकवचनम् — रामम्\nद्विवचनम् — रामौ\nबहुवचनम् — रामान्\n\nतृतीया विभक्तिः (करणम्):\nएकवचनम् — रामेण\nद्विवचनम् — रामाभ्याम्\nबहुवचनम् — रामैः\n\nMEMORY AID:\nद्वितीया and प्रथमा share the same द्विवचन form (रामौ) for every अकारान्त पुंलिङ्ग noun. The pair students mix up most is रामः (प्रथमा एकवचन) vs रामैः (तृतीया बहुवचन) — check the ending vowel/matra carefully, not just the first letters.\n\nWHY राम MATTERS BEYOND राम:\nबालकः, छात्रः, नरः, अश्वः, ग्रामः, वृक्षः — every अकारान्त पुंलिङ्ग noun declines EXACTLY like राम. Learn these nine forms once and you already have all of these words too. (गुरुः, does NOT follow this — it's उकारान्त, a different pattern entirely, so don't extend the analogy there.)",
  },
  {
    id: 5014, ch: 3, subj: "sanskrit", marks: 3,
    q: "'पठ्' धातोः रूपाणि पञ्चसु लकारेषु (लट्, लङ्, लृट्, लोट्, विधिलिङ्) प्रथमपुरुषे त्रिषु वचनेषु लिखत।",
    a: "लट्लकार (वर्तमानकालः — present, 'reads/is reading'):\nएकवचनम् — पठति\nद्विवचनम् — पठतः\nबहुवचनम् — पठन्ति\n\nलङ्लकार (भूतकालः — past, 'read'):\nएकवचनम् — अपठत्\nद्विवचनम् — अपठताम्\nबहुवचनम् — अपठन्\n\nलृट्लकार (भविष्यत्कालः — future, 'will read'):\nएकवचनम् — पठिष्यति\nद्विवचनम् — पठिष्यतः\nबहुवचनम् — पठिष्यन्ति\n\nलोट्लकार (आज्ञार्थः — imperative, 'let him read / must read'):\nएकवचनम् — पठतु\nद्विवचनम् — पठताम्\nबहुवचनम् — पठन्तु\n\nविधिलिङ्लकार (विध्यर्थः — potential, 'should read'):\nएकवचनम् — पठेत्\nद्विवचनम् — पठेताम्\nबहुवचनम् — पठेयुः\n\nWHEN TO USE WHICH — the part that actually earns marks:\nलट् for something happening now or generally true (सः पठति). लङ् for something already finished (सः अपठत्). लृट् for something not yet started (सः पठिष्यति). लोट् for a command (सः पठतु — 'let him read'). विधिलिङ् for advice or soft obligation (सः पठेत् — 'he should read'), gentler than लोट्'s direct command.\n\nSAME TEMPLATE FOR OTHER भ्वादिगण ROOTS:\nगम्, लिख्, हस्, पश्, नम् and most regular roots conjugate on exactly this pattern — keep the endings, swap the root.",
  },

  // =====================================================================
  // अनुच्छेद-लेखनम् — paragraph writing
  // =====================================================================
  // CBSE papers ask for a short Sanskrit paragraph — usually 5-6
  // sentences — on a given topic. These entries do two things: give
  // exam-ready paragraphs to adapt directly, and teach the underlying
  // skeleton (opening line, 2-3 supporting lines, closing line) so an
  // unfamiliar topic on exam day is still approachable with the same
  // structure.

  {
    id: 5015, ch: 1, subj: "sanskrit", marks: 5,
    q: "अनुच्छेद-लेखनस्य (paragraph writing) सम्यक् रणनीतिः का? 'मम विद्यालयः' इति विषये एकं उदाहरणम् ददत्।",
    a: "रणनीतिः (Strategy):\n\nCBSE प्रश्नपत्रे सामान्यतः पञ्च-षट् वाक्यानां (5-6 sentences) एकः अनुच्छेदः अपेक्षितः भवति — अतिदीर्घः लेखः न आवश्यकः; सम्यक् रचना एव महत्त्वपूर्णा।\n\nत्रीणि सोपानानि:\n\n1. आरम्भवाक्यम् (opening line) — विषयस्य परिचयः एकेन सरलेन वाक्येन। What is it, or where is it?\n\n2. विस्तारवाक्यानि (2-3 supporting lines) — विशिष्टानि तथ्यानि, कारणानि, उदाहरणानि, संयोजकशब्दैः सह (यतः 'because', तथा 'and', किन्तु 'but', अपि च 'also'). एका विशिष्टा संख्या वा नाम सर्वदा 'बहवः' वा 'उत्तमः' इत्यादि अस्पष्टशब्देभ्यः उत्तमतरं फलं ददाति — specific beats vague.\n\n3. उपसंहारवाक्यम् (closing line) — एकं भावात्मकं वाक्यम्, व्यक्तिगतः अनुभवः वा लघु-उपदेशः वा।\n\nकालः: मुख्यतः लट्लकार (present) एव, यतः वर्णनं सामान्यतः वर्तमानस्थितेः भवति। 'Should/ought' कथयितुं विधिलिङ् (करणीयम्, पालनीयम्) उपयुज्यताम्।\n\n═══ उदाहरणम् — मम विद्यालयः ═══\n\nमम विद्यालयस्य नाम 'सरस्वती विद्यामन्दिरम्' अस्ति। सः ग्रामस्य मध्ये स्थितः अस्ति। तत्र दश कक्षाः सन्ति, प्रत्येकस्यां कक्षायां चत्वारिंशत् छात्राः पठन्ति। विद्यालये एकं विशालं पुस्तकालयं क्रीडाक्षेत्रं च अस्ति। शिक्षकाः अस्माकं कृते अतीव परिश्रमं कुर्वन्ति। अहं स्वविद्यालयं अतीव स्नेहामि।\n\nENGLISH: My school's name is 'Saraswati Vidyamandiram.' It is located in the middle of the village. There are ten classrooms; forty students study in each. The school has a large library and a playground. The teachers work very hard for us. I love my school very much.\n\nHOW THE SIX SENTENCES MAP TO THE SKELETON:\nSentence 1 = opening (name + location). Sentences 2-5 = supporting detail (numbers, facilities, teachers). Sentence 6 = closing (feeling). The exact same three-part shape works for every topic below — only the specifics change.",
  },
  {
    id: 5016, ch: 11, subj: "sanskrit", marks: 5,
    q: "'अनुशासनम्' इति विषये संस्कृतभाषायाम् अनुच्छेदं (5-6 वाक्यानि) लिखत।",
    a: "अनुशासनम् जीवनस्य आधारः अस्ति। अनुशासनेन विना कोऽपि कार्यं सम्यक् न सिध्यति। विद्यार्थिभिः समये विद्यालयं गन्तव्यम्, नियमाः च पालनीयाः। अनुशासितः छात्रः सर्वत्र सम्मानं प्राप्नोति। सैनिकाः अपि अनुशासनेन एव विजयं प्राप्नुवन्ति। अतः अस्माभिः जीवने अनुशासनं अवश्यं पालनीयम्।\n\nENGLISH: Discipline is the foundation of life. Without discipline no task is properly accomplished. Students should go to school on time and follow the rules. A disciplined student earns respect everywhere. Even soldiers achieve victory only through discipline. So we must certainly observe discipline in life.\n\nपुनःप्रयोज्याः शब्दाः (reusable): जीवनस्य आधारः ('the foundation of life' — opens almost any values-topic paragraph), अतः अस्माभिः ... पालनीयम् ('so we must observe/follow...' — a ready-made closing formula for any should-topic).",
  },
  {
    id: 5017, ch: 7, subj: "sanskrit", marks: 5,
    q: "'मम प्रियः त्यौहारः' (दीपावली) इति विषये संस्कृतभाषायाम् अनुच्छेदं लिखत।",
    a: "दीपावली भारतस्य प्रमुखः त्यौहारः अस्ति। एषः पर्वः कार्तिकमासस्य अमावास्यायां आचर्यते। जनाः स्वगृहाणि दीपैः पुष्पैः च अलङ्कुर्वन्ति। सर्वत्र दीपाः प्रज्वलन्ति, आकाशे च वर्णरञ्जिताः पटाकाः दृश्यन्ते। इदं पर्व असत्यस्य उपरि सत्यस्य विजयस्य प्रतीकम् अस्ति। अहं प्रतिवर्षं परिवारेण सह दीपावलीं आनन्देन आचरामि।\n\nENGLISH: Diwali is a major festival of India. It is celebrated on the new-moon day of the month of Kartik. People decorate their homes with lamps and flowers. Lamps blaze everywhere, and colourful fireworks are seen in the sky. This festival is a symbol of the victory of truth over falsehood. Every year I celebrate Diwali joyfully with my family.\n\nपुनःप्रयोज्याः शब्दाः: प्रमुखः त्यौहारः/पर्वः अस्ति (opening for ANY festival), ...मासस्य ...तिथौ आचर्यते (states when — swap the month/date for होली, रक्षाबन्धनम्, etc.), प्रतीकम् अस्ति (states what it symbolises — good closing move for festival topics).",
  },
  {
    id: 5018, ch: 11, subj: "sanskrit", marks: 5,
    q: "'समयस्य सदुपयोगः' इति विषये संस्कृतभाषायाम् अनुच्छेदं लिखत।",
    a: "समयः अमूल्यः अस्ति, सः पुनः न लभ्यते। ये जनाः समयस्य सदुपयोगं कुर्वन्ति, ते एव जीवने सफलाः भवन्ति। छात्रैः प्रतिदिनं निश्चितां समयसारणीम् अनुसृत्य अध्ययनं कर्तव्यम्। आलस्यं समयस्य महान् शत्रुः अस्ति। 'समयः धनात् अपि मूल्यवान् अस्ति' इति उक्तिः प्रसिद्धा अस्ति। अतः अस्माभिः प्रतिक्षणं सदुपयोक्तव्यम्।\n\nENGLISH: Time is priceless; it is never regained once lost. Only those who make good use of time succeed in life. Students should study daily by following a fixed timetable. Laziness is the great enemy of time. The saying 'time is more valuable than wealth' is well known. So we must make good use of every moment.\n\nपुनःप्रयोज्याः शब्दाः: ...अमूल्यः अस्ति, पुनः न लभ्यते (a strong opening for any 'precious resource' topic — works for जलम् too), ... इति उक्तिः प्रसिद्धा अस्ति (a clean way to drop in a proverb as supporting evidence).",
  },
  {
    id: 5019, ch: 8, subj: "sanskrit", marks: 5,
    q: "'वृक्षाणां महत्त्वम्' इति विषये संस्कृतभाषायाम् अनुच्छेदं लिखत।",
    a: "वृक्षाः अस्माकं जीवनस्य आधारः सन्ति। ते वायुं शुद्धं कुर्वन्ति, प्राणवायुं च ददति। वृक्षाः फलानि, पुष्पाणि, काष्ठं च प्रयच्छन्ति। ते भूमिं क्षरणात् रक्षन्ति, वर्षां च आकर्षयन्ति। दुर्भाग्येन जनाः निरन्तरं वृक्षान् छिन्दन्ति। अस्माभिः अधिकाधिकं वृक्षारोपणं कर्तव्यम्, वृक्षाणां रक्षा च करणीया।\n\nENGLISH: Trees are the foundation of our life. They purify the air and give us oxygen. Trees provide fruits, flowers and timber. They protect the soil from erosion and attract rainfall. Unfortunately people keep cutting down trees. We must plant more and more trees, and their protection must be undertaken.\n\nपुनःप्रयोज्याः शब्दाः: दुर्भाग्येन जनाः ... (a ready pivot into the 'problem' sentence of any environment/social-issue paragraph before the closing call-to-action), अधिकाधिकं ... कर्तव्यम् (a strong closing formula for any conservation topic).",
  },
  {
    id: 5020, ch: 5, subj: "sanskrit", marks: 5,
    q: "'आदर्शः छात्रः' (an ideal student) इति विषये संस्कृतभाषायाम् अनुच्छेदं लिखत।",
    a: "आदर्शः छात्रः सदैव समयस्य पालनं करोति। सः नियमितं विद्यालयं गच्छति, गुरून् च सम्मानयति। सः स्वगृहकार्यं समये एव सम्पादयति। सः न केवलं पुस्तकेषु, अपि तु क्रीडासु, संगीते, अन्येषु कार्येषु च रुचिं दर्शयति। सः सत्यवादी, परिश्रमी, विनम्रः च भवति। एवंविधः छात्रः एव समाजस्य गौरवं भवति।\n\nENGLISH: An ideal student always keeps to time. He attends school regularly and respects his teachers. He completes his homework on time. He shows interest not only in books but also in sports, music and other activities. He is truthful, hard-working and humble. Only such a student becomes the pride of society.\n\nपुनःप्रयोज्याः शब्दाः: सः न केवलं ..., अपि तु ... च (a very reusable 'not only X, but also Y' connector — works describing any well-rounded person or place), एवंविधः ... एव ... भवति (a strong general closing: 'only [such a] one becomes...').",
  },
  {
    id: 5021, ch: 1, subj: "sanskrit", marks: 5,
    q: "'स्वच्छता' इति विषये संस्कृतभाषायाम् अनुच्छेदं लिखत।",
    a: "स्वच्छता एव आरोग्यस्य मूलम् अस्ति। अस्माभिः स्वगृहं, विद्यालयं, परिसरं च स्वच्छं स्थापनीयम्। दूषितं जलं वायुः च नाना रोगान् जनयन्ति। अतः अस्माभिः कचरा निर्दिष्टस्थाने एव त्याज्या। 'स्वच्छता भगवत्तुल्या' इति उक्तिः प्रसिद्धा अस्ति। यदि प्रत्येकः जनः स्वच्छतां पालयति, तर्हि समग्रं राष्ट्रं स्वच्छं भविष्यति।\n\nENGLISH: Cleanliness alone is the root of health. We must keep our home, school and surroundings clean. Polluted water and air give rise to various diseases. So we must discard rubbish only at the designated place. The saying 'cleanliness is next to godliness' is well known. If every person observes cleanliness, the whole nation will become clean.\n\nपुनःप्रयोज्याः शब्दाः: यदि प्रत्येकः जनः ... , तर्हि समग्रं राष्ट्रं ... (a strong 'if everyone does X, the whole nation benefits' closing pattern for any civic-duty topic).",
  },
  {
    id: 5022, ch: 8, subj: "sanskrit", marks: 5,
    q: "'जलसंरक्षणम्' (water conservation) इति विषये संस्कृतभाषायाम् अनुच्छेदं लिखत।",
    a: "जलम् अस्माकं जीवनस्य आधारः अस्ति, जलं विना जीवनम् असम्भवम्। किन्तु अद्य जलस्य अभावः विश्वस्य गुरुतरा समस्या अस्ति। अस्माभिः जलं व्यर्थं न त्याज्यम्, अपितु सावधानतया उपयोक्तव्यम्। वर्षाजलसंचयनम् अत्यन्तम् उपयोगी उपायः अस्ति। कूपाः, तडागाः, नद्यः च दूषिताः न कर्तव्याः। एवं वयं भाविपीढ्यै जलं संरक्षयितुं शक्नुमः।\n\nENGLISH: Water is the foundation of our life; life is impossible without water. But today water scarcity is a serious problem for the world. We must not waste water, but use it carefully. Rainwater harvesting is an extremely useful method. Wells, ponds and rivers must not be polluted. Thus we can conserve water for future generations.\n\nपुनःप्रयोज्याः शब्दाः: किन्तु अद्य ... गुरुतरा समस्या अस्ति (pivots any paragraph from description into 'the problem'), भाविपीढ्यै ... शक्नुमः ('we can [do X] for future generations' — a strong closing for any conservation topic, pairs well with वृक्षाणां महत्त्वम् above).",
  },
  {
    id: 5023, ch: 5, subj: "sanskrit", marks: 5,
    q: "'मम गुरुः' / 'गुरोः महत्त्वम्' इति विषये संस्कृतभाषायाम् अनुच्छेदं लिखत।",
    a: "गुरुः अस्माकं जीवने द्वितीयः पिता इव अस्ति। सः न केवलं पुस्तकीयं ज्ञानं ददाति, अपि तु सम्यक् जीवनमार्गम् अपि दर्शयति। मम प्रियः गुरुः अतीव धैर्यवान्, स्नेहपूर्णः च अस्ति। सः प्रत्येकं छात्रं सम्यक् रीत्या अवगच्छति, तस्य समस्याः च सम्यक् समाधत्ते। गुरोः अभावे शिक्षा अपूर्णा एव तिष्ठति। अतः अस्माभिः गुरून् सर्वदा सम्मानं दातव्यम्।\n\nENGLISH: A teacher is like a second father in our life. He gives not only bookish knowledge but also shows the right path of life. My favourite teacher is very patient and affectionate. He understands every student properly and resolves their problems well. Without a teacher, education remains incomplete. So we must always give teachers respect.\n\nपुनःप्रयोज्याः शब्दाः: ... इव अस्ति (a simile-opener useful for describing any respected person: 'is like a...'), गुरोः अभावे ... अपूर्णा एव तिष्ठति ('without X, Y remains incomplete' — a strong pattern for any 'importance of' topic, matches जननी तु गुरुः thematically too).",
  },
];
