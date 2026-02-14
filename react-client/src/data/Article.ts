
        
export type ArticleComplexity = 'Easy' | 'Medium' | 'Hard';

export type ArticleSource = {
  name: string;
  type: 'Blog' | 'Medium' | 'Publication' | 'Newsletter';
};

export enum ArticleStatus {
  Unread = 'Unread',
  Skimmed = 'Skimmed',
  Read = 'Read',
  Snoozed = 'Snoozed',
  Archived = 'Archived',
}

export interface ArticleModel {
  id: string;
  title: string;
  source: ArticleSource;
  url: string;
  saveDate: string; // ISO date string or friendly string like '12 days ago'
  
  // Analysis data
  readingTimeInMinutes: number;
  skimTimeInMinutes: number;
  complexity: ArticleComplexity;
  tldrSummary: string[];
  fullContent: string;
  
  // User state
  status: ArticleStatus;
  userNote?: string;
  isDailyRead: boolean;
}

// --- Mock Data ---

const MOCK_CONTENT_1 = `
In the modern digital landscape, the way we consume information has fundamentally shifted. We are bombarded by streams of content, notifications, and endless feeds. This constant stimulus has trained our brains to prefer skimming over deep reading. Studies show that when faced with a screen, the average user defaults to an F-shaped reading pattern, prioritizing the first few words of a line and dropping down quickly.

This habit presents a challenge for long-form content creators and a crisis for readers seeking depth. However, long-form content, when well-structured and engaging, remains the most powerful vehicle for complex ideas. The key is recognizing that attention is finite. When we save an article for later, we are making a promise to our future selves that we often fail to keep, leading to 'read debt' and digital guilt.

To combat this, tools must adopt a reading-first philosophy. By providing immediate value—a summary, a time estimate—we lower the cognitive barrier to starting. Without clutter, sidebars, or competing links, the brain is allowed to re-engage with linear thought, making the act of reading intentional again, rather than accidental.
`;

const MOCK_CONTENT_2 = `
The history of time management is essentially a history of self-control techniques. From the ancient practice of journaling to the modern Pomodoro Technique, all aim to externalize attention management. But digital clutter sabotages these efforts. Every new tab is a potential distraction, stealing valuable cognitive bandwidth.

Read-later apps were supposed to solve this, but many became dumping grounds. They failed because they optimized for *saving* rather than for *finishing*. The true value is not in the archive, but in the prioritized, scarce list of things that matter *today*.

Scarcity, when applied intentionally, is a powerful motivator. Limiting choices (like the "max 3 items" rule) forces prioritization and reduces decision fatigue. It transforms the app from a passive archive into an active tool for daily intellectual hygiene. This intentional constraint signals to the user that their time is respected and their attention is valuable.
`;

export const MOCK_ARTICLES: ArticleModel[] = [
  {
    id: 'a1',
    title: 'How We Read on the Internet: Skimming, Depth, and Digital Guilt',
    source: { name: 'Medium', type: 'Medium' },
    url: 'https://example.medium.com/how-we-read',
    saveDate: '2025-12-05T10:00:00Z',
    readingTimeInMinutes: 7,
    skimTimeInMinutes: 2,
    complexity: 'Medium',
    tldrSummary: [
      'Skimming is the default reading habit on digital screens due to overload.',
      'Long-form content still provides the most depth, but requires focused effort.',
      'Context switching and digital clutter are the primary killers of focus and completion.',
    ],
    fullContent: MOCK_CONTENT_1,
    status: ArticleStatus.Unread,
    isDailyRead: true,
  },
  {
    id: 'a2',
    title: 'The Power of Intentional Scarcity in Productivity Tools',
    source: { name: 'UX Design Review', type: 'Publication' },
    url: 'https://uxreview.com/scarcity-productivity',
    saveDate: '2025-12-10T15:30:00Z',
    readingTimeInMinutes: 6,
    skimTimeInMinutes: 3,
    complexity: 'Hard',
    tldrSummary: [
      'Traditional read-later apps failed by optimizing for saving, not finishing.',
      'Limiting the daily reading quota (intentional scarcity) reduces decision fatigue.',
      'The focus should shift from archiving everything to prioritizing what truly matters today.',
    ],
    fullContent: MOCK_CONTENT_2,
    status: ArticleStatus.Unread,
    isDailyRead: true,
  },
  {
    id: 'a3',
    title: 'Why Most People Quit Their Learning Goals by January 15th',
    source: { name: 'Personal Blog', type: 'Blog' },
    url: 'https://blog.com/new-years-goals',
    saveDate: '2025-11-20T08:00:00Z',
    readingTimeInMinutes: 2,
    skimTimeInMinutes: 1,
    complexity: 'Easy',
    tldrSummary: [
      'Goals fail due to poor environment design, not lack of motivation.',
      'The friction of starting a task is often the largest hurdle.',
      'To succeed, reduce the cost of entry and enforce strict limits on competing activities.',
    ],
    fullContent: "This is a short, motivational article focusing on the friction of starting tasks and setting up a good environment...",
    status: ArticleStatus.Skimmed,
    isDailyRead: false,
  },
  {
    id: 'a4',
    title: 'A Deep Dive into the Astrophysics of Black Holes for Beginners',
    source: { name: 'Scientific American', type: 'Publication' },
    url: 'https://sciam.com/black-holes-deep-dive',
    saveDate: '2025-10-01T12:00:00Z',
    readingTimeInMinutes: 15,
    skimTimeInMinutes: 5,
    complexity: 'Hard',
    tldrSummary: [
      'Black holes are regions of spacetime where gravity is so strong that nothing can escape.',
      'The event horizon is the point of no return.',
      'New data confirms complex gravitational wave patterns around merging black holes.',
    ],
    fullContent: "A detailed scientific explanation of black hole formation and detection...",
    status: ArticleStatus.Read,
    userNote: "Fascinating overview. Learned about the different types of singularities and event horizons.",
    isDailyRead: false,
  },
];

/**
 * Returns articles specifically marked for display on the Today's Reads screen.
 * For mock purposes, it limits to the first 3 unread/unsnoozed articles.
 */
export function getDailyReads(): ArticleModel[] {
  // Mock data for Today's Reads (max 3 items rule)
  return [
    {
      ...MOCK_ARTICLES[0],
      saveDate: '12 days ago', // Friendly UI string override for context
      // Additional descriptive metadata for the Today's Reads card
      dailyReadContext: 'Why it matters now → Focus on digital hygiene.',
      readLabel: '2-min skim',
    },
    {
      ...MOCK_ARTICLES[1],
      saveDate: 'Saved last week',
      dailyReadContext: 'Good for focused time',
      readLabel: '6-min read',
    },
  ] as unknown as ArticleModel[]; // Using unknown to satisfy the temporary structure change for MOCK
}

export function getArticleById(id: string): ArticleModel | undefined {
  return MOCK_ARTICLES.find(a => a.id === id);
}

export function getAllLibraryArticles(): ArticleModel[] {
    return MOCK_ARTICLES;
}
        
      