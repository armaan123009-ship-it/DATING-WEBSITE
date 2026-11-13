// ============================================================================
// CRAZY LOVE / PAWANDATE - INSTAGRAM-STYLE CHATS & DIRECT MESSAGING ENGINE
// Stories tray, photo/voice notes, message reactions, typing state, bot replies,
// AI Wingman Opener Suggestions, Anti-Ghosting Timers, and Safety Moderation
// ============================================================================

export const INITIAL_MATCHES = [
  {
    profileId: "profile-1",
    matchedAt: "Just now",
    unread: true,
    lastMessage: "Hello! Noticed your appreciation for clean aesthetic spaces. What's your current favorite cafe?",
    lastTime: "1:42 PM",
    antiGhostTimer: "47h 58m",
    chatStarted: true
  },
  {
    profileId: "profile-3",
    matchedAt: "2h ago",
    unread: false,
    lastMessage: "Up for checking out that contemporary photography exhibit this Thursday?",
    lastTime: "11:22 AM",
    antiGhostTimer: "45h 10m",
    chatStarted: true
  },
  {
    profileId: "profile-6",
    matchedAt: "1d ago",
    unread: false,
    lastMessage: "Love your creative vibe! Are you into contemporary sculpture exhibitions?",
    lastTime: "Yesterday",
    antiGhostTimer: "24h 18m",
    chatStarted: true
  }
];

export const INITIAL_MESSAGES = {
  "profile-1": [
    {
      id: "m-101",
      sender: "them",
      type: "text",
      text: "Hello! Noticed your appreciation for clean aesthetic spaces. What's your current favorite cafe or reading sanctuary?",
      time: "1:42 PM",
      reactions: ["❤️"],
      status: "seen"
    }
  ],
  "profile-3": [
    {
      id: "m-301",
      sender: "them",
      type: "text",
      text: "Hey! Impressed by your focus. Up for an espresso or a visit to the contemporary photography exhibit this week?",
      time: "11:15 AM",
      reactions: [],
      status: "seen"
    },
    {
      id: "m-302",
      sender: "me",
      type: "text",
      text: "Definitely. I've been meaning to check out the new architectural gallery in Roppongi as well.",
      time: "11:20 AM",
      reactions: ["🔥"],
      status: "seen"
    },
    {
      id: "m-303",
      sender: "them",
      type: "text",
      text: "Up for checking out that contemporary photography exhibit this Thursday?",
      time: "11:22 AM",
      reactions: [],
      status: "seen"
    }
  ],
  "profile-6": [
    {
      id: "m-601",
      sender: "them",
      type: "text",
      text: "Love your creative vibe! Are you into contemporary sculpture exhibitions or runway archiving?",
      time: "Yesterday",
      reactions: ["⚡"],
      status: "seen"
    }
  ]
};

// AI Wingman Context-Aware Openers per Profile based on hobbies, prompts & values
export const AI_WINGMAN_OPENERS = {
  "profile-1": [
    "I was just looking at Ethiopian washed vs natural beans this morning! You have to tell me your top 3 Tokyo roasters.",
    "A bilingual risograph journal sounds incredible. What's the rarest print or typeface you've featured so far?",
    "Brutalist architecture plus analog vinyl is my exact definition of a perfect Saturday afternoon."
  ],
  "profile-2": [
    "Drinking hot sencha from hand-sculpted stoneware beats any mug in the world. How long did it take to master your glaze?",
    "Slow mornings, native botanicals, and sourdough baking—your energy feels like an antidote to modern rush.",
    "What's your current favorite acoustic folk record playing in the pottery studio?"
  ],
  "profile-3": [
    "A listening bar followed by midnight ramen in Shimokitazawa? Say less, you're picking the record first.",
    "Curiosity over certainty is the best rule I've read in a long time. What synth patch are you experimenting with right now?",
    "Bouldering routes or 35mm film street walk this weekend?"
  ],
  "profile-4": [
    "27-layer laminated butter pastry is serious dedication. Which French patisserie technique gave you the biggest rush to nail?",
    "Kamakura coastal drive with an acoustic soundtrack sounds like a scene out of a French cinema classic.",
    "Natural wine with late night Bill Evans jazz—what bottle should we try first?"
  ],
  "profile-5": [
    "Identifying 200 plant species by leaf silhouette alone is a genuine superpower! What's the calmest canal route in Kichijoji?",
    "Your greenhouse morning mist vibe is unmatched. Do you listen to Bon Iver while sketching landscape layouts?",
    "Campfire cooking under a clear night sky is on my bucket list this season."
  ],
  "profile-6": [
    "Private underground gallery viewings followed by midnight ramen is pure gold. Have you shot runway shows on 35mm film?",
    "Bold architectural tailoring and avant-garde art—your aesthetic is undeniably dialed in.",
    "Berlin techno or Daikanyama coffee walk—where is your creative head right now?"
  ]
};

export const ICEBREAKER_PROMPTS = [
  "What is your quintessential weekend unwinding ritual?",
  "What architectural or design detail recently caught your attention?",
  "Early morning espresso or evening listening bar?",
  "What 35mm film stock or record do you cherish most?",
  "Tell me about a personal project you are currently building."
];

export const SAFETY_REASONS = [
  { id: "harassment", label: "Inappropriate language or harassment", desc: "Offensive words, threats, or unsolicited advances" },
  { id: "catfish", label: "Fake profile or impersonation", desc: "Photos do not match or suspected automated bot" },
  { id: "solicitation", label: "Commercial spam or solicitation", desc: "Promoting paid services, crypto, or third-party links" },
  { id: "safety", label: "Underage or safety emergency", desc: "Violates fundamental community age and safety rules" }
];

export const BOT_RESPONSES = {
  "profile-1": [
    "That aligns with my taste completely! There's an intimate, quiet roastery in Shibuya with natural light and exceptional filter brew—we should plan a visit.",
    "Very thoughtful. I find that intentional spaces make a tremendous difference in how we connect.",
    "I appreciate your directness. What other creative disciplines inspire your daily routine?",
    "Totally on the same wavelength! Let's definitely coordinate coffee sometime this week."
  ],
  "profile-2": [
    "That is such a grounded perspective. Slow mornings with natural light and pour-overs are essential.",
    "I love that answer! It takes patience and focus to appreciate those subtle textures.",
    "My studio always welcomes people with creative curiosity. We should grab matcha soon!"
  ],
  "profile-3": [
    "Spot on! Most people don't realize the craft that goes into intentional sound and atmosphere.",
    "You get it. Life moves too fast to waste on boring conversation.",
    "Are you free this Thursday evening? I'm heading over to a secret listening lounge in Shibuya."
  ],
  "profile-4": [
    "Exquisite taste! The balance of acidity, sweetness, and aroma requires deep attention.",
    "I completely agree. Food styling is just sculpting with ephemeral ingredients.",
    "Let me prepare a private tasting box for our next conversation."
  ],
  "profile-5": [
    "That is so refreshing to hear! In a concrete jungle, living greenery restores our equilibrium.",
    "Spot on. Have you tried planting native mosses or miniature bonsai?",
    "We should take an electric bike ride around Inokashira park this weekend."
  ],
  "profile-6": [
    "You have an undeniable eye for composition! High fashion is living sculpture.",
    "I love that contrast—street energy meets architectural precision.",
    "There is an invite-only installation opening on Friday. Would love to bring you along as my guest."
  ]
};
