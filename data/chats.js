// ============================================================================
// CRAZY LOVE / PAWANDATE - INSTAGRAM-STYLE CHATS & DIRECT MESSAGING ENGINE
// Stories tray, photo/voice notes, message reactions, typing state, bot replies
// ============================================================================

export const INITIAL_MATCHES = [
  {
    profileId: "profile-1",
    matchedAt: "Just now",
    unread: true,
    lastMessage: "Hello! Noticed your appreciation for clean aesthetic spaces. What's your current favorite cafe?",
    lastTime: "1:42 PM"
  },
  {
    profileId: "profile-3",
    matchedAt: "2h ago",
    unread: false,
    lastMessage: "Up for checking out that contemporary photography exhibit this Thursday?",
    lastTime: "11:22 AM"
  },
  {
    profileId: "profile-6",
    matchedAt: "1d ago",
    unread: false,
    lastMessage: "Love your creative vibe! Are you into contemporary sculpture exhibitions?",
    lastTime: "Yesterday"
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

export const ICEBREAKER_PROMPTS = [
  "What is your quintessential weekend unwinding ritual?",
  "What architectural or design detail recently caught your attention?",
  "Early morning espresso or evening listening bar?",
  "What 35mm film stock or record do you cherish most?",
  "Tell me about a personal project you are currently building."
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
    "Currently at my ceramics atelier trimming stoneware cups. Would love to show you the studio space sometime.",
    "Agreed. Genuine conversation without rushed expectations is rare and valuable."
  ],
  "profile-3": [
    "Sounds like a plan! Let's aim for Thursday afternoon around 5 PM before the gallery gets crowded.",
    "Agreed. High quality design and zero pretension is the ideal combination.",
    "I'll send over the location pin—they have a fantastic listening room adjacent to the exhibition space."
  ],
  "profile-4": [
    "A refined choice. The balance of acidity and sweetness in a single origin roast is much like balancing pastry elements.",
    "I would be glad to share some freshly baked financiers on our first meetup.",
    "Looking forward to hearing more about your projects in person."
  ],
  "profile-5": [
    "Inokashira park courtyard is particularly serene this week. The autumn foliage is beginning to turn.",
    "That is a very rare and admirable quality. Consideration for one's surroundings matters immensely.",
    "We could easily bring sketchbooks and spend a quiet afternoon along the canal."
  ],
  "profile-6": [
    "Love that energy! The intersection of fashion archives and minimal architecture is where all the best ideas come from.",
    "I'm curating a private showroom presentation this Friday. Would love for you to drop by!",
    "Phenomenal taste! What kind of aesthetic palette do you usually gravitate toward?"
  ]
};
