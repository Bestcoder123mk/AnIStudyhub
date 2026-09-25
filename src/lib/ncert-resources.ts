// Official NCERT / CBSE resource links for Class 10 — used by the Resources view.
// Chapter titles are verified against the current NCERT Class 10 syllabus (2026-27 session).
// We link to NCERT's own textbook portal rather than guessing individual per-chapter PDF
// URLs, since NCERT periodically re-numbers/re-issues chapters and a wrong hardcoded link
// is worse than a correct portal link the student can click through from.

export interface NcertChapter {
  no: number;
  title: string;
}

export interface NcertBook {
  id: string;
  subject: string;
  bookTitle: string;
  /** NCERT's internal short-code for this title, used in ncert.nic.in URLs (e.g. jesc1) */
  code: string;
  chapters: NcertChapter[];
  officialUrl: string;
}

export const NCERT_CLASS10_BOOKS: NcertBook[] = [
  {
    id: "science",
    subject: "Science",
    bookTitle: "Science — Class X",
    code: "jesc1",
    officialUrl: "https://ncert.nic.in/textbook.php?jesc1=0-15",
    chapters: [
      { no: 1, title: "Chemical Reactions and Equations" },
      { no: 2, title: "Acids, Bases and Salts" },
      { no: 3, title: "Metals and Non-metals" },
      { no: 4, title: "Carbon and its Compounds" },
      { no: 5, title: "Periodic Classification of Elements" },
      { no: 6, title: "Life Processes" },
      { no: 7, title: "Control and Coordination" },
      { no: 8, title: "How do Organisms Reproduce?" },
      { no: 9, title: "Heredity and Evolution" },
      { no: 10, title: "Light — Reflection and Refraction" },
      { no: 11, title: "The Human Eye and the Colourful World" },
      { no: 12, title: "Electricity" },
      { no: 13, title: "Magnetic Effects of Electric Current" },
      { no: 14, title: "Sources of Energy" },
      { no: 15, title: "Our Environment" },
      { no: 16, title: "Sustainable Management of Natural Resources" },
    ],
  },
  {
    id: "maths",
    subject: "Mathematics",
    bookTitle: "Mathematics — Class X",
    code: "jemh1",
    officialUrl: "https://ncert.nic.in/textbook.php?jemh1=0-14",
    chapters: [
      { no: 1, title: "Real Numbers" },
      { no: 2, title: "Polynomials" },
      { no: 3, title: "Pair of Linear Equations in Two Variables" },
      { no: 4, title: "Quadratic Equations" },
      { no: 5, title: "Arithmetic Progressions" },
      { no: 6, title: "Triangles" },
      { no: 7, title: "Coordinate Geometry" },
      { no: 8, title: "Introduction to Trigonometry" },
      { no: 9, title: "Some Applications of Trigonometry" },
      { no: 10, title: "Circles" },
      { no: 11, title: "Areas Related to Circles" },
      { no: 12, title: "Surface Areas and Volumes" },
      { no: 13, title: "Statistics" },
      { no: 14, title: "Probability" },
    ],
  },
  {
    id: "history",
    subject: "Social Science · History",
    bookTitle: "India and the Contemporary World – II",
    code: "jess3",
    officialUrl: "https://ncert.nic.in/textbook.php?jess3=0-5",
    chapters: [
      { no: 1, title: "The Rise of Nationalism in Europe" },
      { no: 2, title: "Nationalism in India" },
      { no: 3, title: "The Making of a Global World" },
      { no: 4, title: "The Age of Industrialisation" },
      { no: 5, title: "Print Culture and the Modern World" },
    ],
  },
  {
    id: "geography",
    subject: "Social Science · Geography",
    bookTitle: "Contemporary India – II",
    code: "jess1",
    officialUrl: "https://ncert.nic.in/textbook.php?jess1=0-7",
    chapters: [
      { no: 1, title: "Resources and Development" },
      { no: 2, title: "Forest and Wildlife Resources" },
      { no: 3, title: "Water Resources" },
      { no: 4, title: "Agriculture" },
      { no: 5, title: "Minerals and Energy Resources" },
      { no: 6, title: "Manufacturing Industries" },
      { no: 7, title: "Lifelines of National Economy" },
    ],
  },
  {
    id: "civics",
    subject: "Social Science · Political Science",
    bookTitle: "Democratic Politics – II",
    code: "jess4",
    officialUrl: "https://ncert.nic.in/textbook.php?jess4=0-8",
    chapters: [
      { no: 1, title: "Power-sharing" },
      { no: 2, title: "Federalism" },
      { no: 3, title: "Democracy and Diversity" },
      { no: 4, title: "Gender, Religion and Caste" },
      { no: 5, title: "Popular Struggles and Movements" },
      { no: 6, title: "Political Parties" },
      { no: 7, title: "Outcomes of Democracy" },
      { no: 8, title: "Challenges to Democracy" },
    ],
  },
  {
    id: "economics",
    subject: "Social Science · Economics",
    bookTitle: "Understanding Economic Development",
    code: "jess2",
    officialUrl: "https://ncert.nic.in/textbook.php?jess2=0-5",
    chapters: [
      { no: 1, title: "Development" },
      { no: 2, title: "Sectors of the Indian Economy" },
      { no: 3, title: "Money and Credit" },
      { no: 4, title: "Globalisation and the Indian Economy" },
      { no: 5, title: "Consumer Rights" },
    ],
  },
];

export interface ExternalResource {
  label: string;
  description: string;
  url: string;
}

// Official government portals only — no third-party PDF mirrors.
export const OFFICIAL_LINKS: ExternalResource[] = [
  {
    label: "NCERT Textbooks Portal",
    description: "Official chapter-wise PDF downloads for every NCERT title, Class I–XII.",
    url: "https://ncert.nic.in/textbook.php",
  },
  {
    label: "NCERT ePathshala",
    description: "Flipbooks, audio/video, and interactive versions of NCERT textbooks.",
    url: "https://epathshala.nic.in/",
  },
  {
    label: "CBSE Academic — Sample Question Papers",
    description: "Official CBSE sample papers and marking schemes for the current board session.",
    url: "https://cbseacademic.nic.in/SQP_CLASSX_2026.html",
  },
  {
    label: "CBSE — Previous Year Question Papers",
    description: "Official archive of past Class X board question papers, published by CBSE.",
    url: "https://cbse.gov.in/cbsenew/question-paper.html",
  },
  {
    label: "DIKSHA",
    description: "Government of India's national platform for NCERT-aligned e-content and practice.",
    url: "https://diksha.gov.in/",
  },
];
