// ============================================================================
// LOVEEEZ DATING APP - CHATS & REAL-TIME MESSAGING ENGINE
// Pre-populated conversations, icebreakers, and automated companion responses
// ============================================================================

export const INITIAL_MATCHES = [
  {
    profileId: "profile-1",
    matchedAt: "Just now",
    unread: true,
    lastMessage: "Hey! Your vibe is so warm ✨ What's your comfort cafe spot?"
  },
  {
    profileId: "profile-3",
    matchedAt: "2h ago",
    unread: false,
    lastMessage: "Winner picks the ramen spot 🍜"
  }
];

export const INITIAL_MESSAGES = {
  "profile-1": [
    {
      id: "m-101",
      sender: "them",
      text: "Hey! Your vibe is so warm ✨ What's your comfort anime or favorite cafe spot?",
      time: "1:42 PM"
    }
  ],
  "profile-3": [
    {
      id: "m-301",
      sender: "them",
      text: "Yo! Ready for a friendly Mario Kart showdown? 🎮",
      time: "11:15 AM"
    },
    {
      id: "m-302",
      sender: "me",
      text: "Only if you can handle Rainbow Road without falling off! 🏎️",
      time: "11:20 AM"
    },
    {
      id: "m-303",
      sender: "them",
      text: "Haha challenge accepted! Winner picks the ramen spot 🍜",
      time: "11:22 AM"
    }
  ]
};

export const ICEBREAKER_PROMPTS = [
  "✨ What's your ideal Sunday morning?",
  "☕ Matcha latte or pour-over coffee?",
  "🎮 Arcade challenge or quiet bookstore stroll?",
  "🍰 Two truths and one sweet lie?",
  "🎵 What song is stuck in your head today?"
];

export const BOT_RESPONSES = {
  "profile-1": [
    "Aww I love that! 🥰 There's this tiny hidden garden cafe in Shibuya with the flakiest matcha croissants, we should definitely check it out!",
    "That sounds so cozy. I was actually just sketching some character designs while listening to lofi music ✨",
    "Haha you have great taste! What kind of books or anime are you into lately?"
  ],
  "profile-2": [
    "That's so thoughtful. Slow mornings with fresh tea and records are the best kind of therapy ☕",
    "I'm actually in my pottery studio right now! Just finished throwing a set of peach-colored mugs.",
    "Haha deal! I'll hold you to that promise. Do you like thrift shopping too?"
  ],
  "profile-3": [
    "Hahaha no way! You're definitely getting wrecked on Rainbow Road 🏁",
    "Let's go to the Akihabara Sega arcade this weekend, they just got the newest rhythm drum game!",
    "Spicy tonkotsu ramen with extra green onions is non-negotiable though 🍜 You in?"
  ],
  "profile-4": [
    "Ooh that sounds delicious! 🍓 I'm testing a new strawberry rhubarb tart today—would love your opinion!",
    "Nothing beats sharing fresh warm pastries on a weekend stroll.",
    "Haha you're making me blush! Promise you'll be my official taste-tester?"
  ],
  "profile-5": [
    "Inokashira park is blooming right now! The cherry trees near the pond are stunning 🌸",
    "That's such a gentle perspective. I love people who appreciate quiet nature moments.",
    "We should pack some iced tea and sketchbooks for a weekend picnic!"
  ],
  "profile-6": [
    "Yes!! That song gives the best midnight drive energy 🎛️",
    "I'm working on a new synth-pop DJ mix right now, let me send you the tracklist later tonight!",
    "Haha homemade crispy gyoza is ready whenever you are! 🥟"
  ]
};
