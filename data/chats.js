// ============================================================================
// JAN.AI EDITORIAL DATING SYSTEM - CHATS & MESSAGING ENGINE
// Professional dialogue threads, icebreaker prompts, and automated responses
// ============================================================================

export const INITIAL_MATCHES = [
  {
    profileId: "profile-1",
    matchedAt: "Just now",
    unread: true,
    lastMessage: "Hello! Noticed your appreciation for clean systems. What's your current favorite cafe or reading sanctuary?"
  },
  {
    profileId: "profile-3",
    matchedAt: "2h ago",
    unread: false,
    lastMessage: "Up for checking out that contemporary photography exhibit this Thursday?"
  }
];

export const INITIAL_MESSAGES = {
  "profile-1": [
    {
      id: "m-101",
      sender: "them",
      text: "Hello! Noticed your appreciation for clean systems. What's your current favorite cafe or reading sanctuary?",
      time: "1:42 PM"
    }
  ],
  "profile-3": [
    {
      id: "m-301",
      sender: "them",
      text: "Hey! Impressed by your focus. Up for an espresso or a visit to the contemporary photography exhibit this week?",
      time: "11:15 AM"
    },
    {
      id: "m-302",
      sender: "me",
      text: "Definitely. I've been meaning to check out the new architectural gallery in Roppongi as well.",
      time: "11:20 AM"
    },
    {
      id: "m-303",
      sender: "them",
      text: "Up for checking out that contemporary photography exhibit this Thursday?",
      time: "11:22 AM"
    }
  ]
};

export const ICEBREAKER_PROMPTS = [
  "What is your quintessential weekend unwinding ritual?",
  "What architectural or design detail recently caught your attention?",
  "Early morning espresso or evening listening bar?",
  "What non-fiction book or journal has shaped your thinking lately?",
  "Tell me about a side project you're currently passionate about."
];

export const BOT_RESPONSES = {
  "profile-1": [
    "That aligns with my taste completely. There is an intimate, quiet roastery in Shibuya with natural light and exceptional filter brew—we should plan a visit.",
    "Very thoughtful. I find that intentional spaces make a tremendous difference in how we connect.",
    "I appreciate your directness. What other creative disciplines inspire your daily routine?"
  ],
  "profile-2": [
    "That is such a grounded perspective. Slow mornings with natural light and pour-overs are essential.",
    "Currently at my ceramics atelier trimming porcelain mugs. Would love to show you the studio space sometime.",
    "Agreed. Genuine conversation without rushed expectations is rare and valuable."
  ],
  "profile-3": [
    "Sounds like a plan. Let's aim for Thursday afternoon around 5 PM before the gallery gets crowded.",
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
    "We could easily bring sketchbooks or a book and spend a quiet afternoon along the canal."
  ],
  "profile-6": [
    "That synthesizer track you mentioned has phenomenal low-end fidelity.",
    "I'm putting together a new analog hardware set tonight. I'll share the preview track with you.",
    "Sounds great. Let's meet at the craft coffee spot near the station."
  ]
};
