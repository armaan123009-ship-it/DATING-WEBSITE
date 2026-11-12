// ============================================================================
// LOVEEEZ DATING APP - PROFILE DATA STORE
// Modern dating profiles with prompts, vibe islands, and compatibility data
// ============================================================================

export const PROFILES = [
  {
    id: "profile-1",
    name: "Anya",
    age: 23,
    city: "Tokyo & Shibuya",
    occupation: "Indie Game Artist & Illustrator",
    distance: "3 km away",
    verified: true,
    island: "pinky", // Pinky Island - Romantic & Artsy
    islandName: "Pinky Island 🌸",
    islandColor: "var(--surface-pink)",
    accentColor: "var(--accent-pink)",
    bio: "Painting pastel worlds by day, searching for someone to explore cozy matcha cafes and vinyl record shops by night ✨",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"
    ],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    tags: ["🎨 Digital Art", "🍵 Matcha Latte", "🎧 Lo-Fi", "🐱 Cat Cafe", "📸 Film Cameras"],
    prompts: [
      {
        question: "Dating me is like...",
        answer: "Getting unlimited cute doodles and spontaneous late-night strawberry crepe runs 🍓"
      },
      {
        question: "A life goal of mine",
        answer: "Publishing an illustrated storybook inspired by quiet coastal towns."
      }
    ],
    compatibility: 96,
    initialMessage: "Hey! Your vibe is so warm ✨ What's your comfort anime or favorite cafe spot?"
  },
  {
    id: "profile-2",
    name: "Chloe",
    age: 24,
    city: "Shimokitazawa",
    occupation: "Ceramics Designer",
    distance: "5 km away",
    verified: true,
    island: "central", // Central Island - Warm & Cozy
    islandName: "Central Island ☀️",
    islandColor: "var(--surface-yellow)",
    accentColor: "var(--accent-coral)",
    bio: "Thrifting vintage knitwear, sipping peach iced tea, and spinning indie pop. Looking for slow Sunday mornings.",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"
    ],
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&h=200&q=80",
    tags: ["🏺 Pottery", "☕ Pour-over Coffee", "🌿 Plants", "📚 Bookstores", "🍞 Bakery Tours"],
    prompts: [
      {
        question: "My simple pleasures",
        answer: "The smell of fresh sourdough bread and morning sunlight on wooden floors."
      },
      {
        question: "Two truths and a lie",
        answer: "I make my own coffee mugs, I have 32 houseplants, and I've never eaten sushi!"
      }
    ],
    compatibility: 92,
    initialMessage: "Hi there! I love that we both appreciate cozy spaces. Are you a coffee or tea person?"
  },
  {
    id: "profile-3",
    name: "Rin",
    age: 22,
    city: "Harajuku",
    occupation: "Fashion Stylist & Dancer",
    distance: "2 km away",
    verified: true,
    island: "kappe", // Kappe Island - Energetic & Playful
    islandName: "Kappe Island 🌊",
    islandColor: "var(--surface-cyan)",
    accentColor: "var(--accent-cyan)",
    bio: "Life is too short for boring outfits! Let's go to an arcade, take photobooth stickers, and eat spicy ramen 🍜",
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80"
    ],
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&h=200&q=80",
    tags: ["🎮 Arcades", "👗 Streetwear", "🍜 Spicy Ramen", "✨ Purikura", "🛹 Skater Vibe"],
    prompts: [
      {
        question: "The first round is on me if...",
        answer: "You can beat my high score in Mario Kart or rhythm games at the arcade!"
      },
      {
        question: "I geek out on",
        answer: "Early 2000s Y2K aesthetics and discovering hidden underground sneaker shops."
      }
    ],
    compatibility: 89,
    initialMessage: "Yo! Ready for a friendly Mario Kart showdown? Winner picks the ramen spot 🍜"
  },
  {
    id: "profile-4",
    name: "Maya",
    age: 25,
    city: "Ginza",
    occupation: "Pastry Chef & Patisserie Owner",
    distance: "6 km away",
    verified: true,
    island: "pinky",
    islandName: "Pinky Island 🌸",
    islandColor: "var(--surface-pink)",
    accentColor: "var(--accent-pink)",
    bio: "Spreading happiness one macaron at a time. I'll test new dessert recipes on you if you promise to give honest reviews 💕",
    photos: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80"
    ],
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
    tags: ["🧁 Baking", "🍓 Strawberries", "🎹 Piano", "✈️ Paris", "🌸 Cherry Blossoms"],
    prompts: [
      {
        question: "Best perk of dating me",
        answer: "Fresh warm pastries on Sunday mornings and handmade birthday cakes for your friends."
      },
      {
        question: "Together, we could",
        answer: "Travel across Japan finding the most delicate soufflé pancakes."
      }
    ],
    compatibility: 95,
    initialMessage: "Bonjour! I just finished baking fresh raspberry tarts—care for one? 🍓"
  },
  {
    id: "profile-5",
    name: "Sora",
    age: 23,
    city: "Kichijoji",
    occupation: "Botanical Garden Guide & Florist",
    distance: "4 km away",
    verified: true,
    island: "central",
    islandName: "Central Island ☀️",
    islandColor: "var(--surface-mint)",
    accentColor: "var(--accent-cyan)",
    bio: "Living surrounded by eucalyptus and wildflowers. Looking for museum strolls, quiet picnics, and deep stargazing talks.",
    photos: [
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80"
    ],
    avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=200&h=200&q=80",
    tags: ["💐 Flowers", "🧺 Picnics", "🚲 Biking", "🌿 Nature Walks", "🔭 Astronomy"],
    prompts: [
      {
        question: "My ideal Sunday",
        answer: "Packing an oversized picnic blanket, a good book, and iced tea at Inokashira Park."
      },
      {
        question: "Green flags I look for",
        answer: "Being kind to animals, laughing at yourself, and curiosity about the little things."
      }
    ],
    compatibility: 94,
    initialMessage: "Hello! If you could have any flower delivered to your desk today, what would it be? 🌸"
  },
  {
    id: "profile-6",
    name: "Yuna",
    age: 22,
    city: "Roppongi",
    occupation: "UI/UX Designer & DJ",
    distance: "7 km away",
    verified: true,
    island: "kappe",
    islandName: "Kappe Island 🌊",
    islandColor: "var(--surface-lavender)",
    accentColor: "var(--accent-pink)",
    bio: "Obsessed with clean design tokens, neon night drives, and synth-pop. Can cook a mean homemade gyoza spread!",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
    ],
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&h=200&q=80",
    tags: ["🎛️ Synthwave", "🥟 Gyoza", "🌃 Night City", "✨ Neon", "💻 Figma"],
    prompts: [
      {
        question: "Dating me is like...",
        answer: "Having your personal playlist curator and someone who notices all the tiny aesthetic details."
      },
      {
        question: "We'll get along if",
        answer: "You love spontaneous drives listening to city-pop albums under the highway lights."
      }
    ],
    compatibility: 91,
    initialMessage: "Hey! Loved your profile aesthetic. What track is on repeat for you right now? 🎵"
  }
];

export const ISLANDS = [
  {
    id: "all",
    name: "All Islands",
    emoji: "💖",
    color: "var(--surface-pink)",
    description: "Discover all compatible people across the Loveeez world"
  },
  {
    id: "pinky",
    name: "Pinky Island",
    emoji: "🌸",
    color: "var(--surface-pink)",
    themeColor: "var(--accent-pink)",
    description: "Romantic, artistic souls who love cafes, books, and delicate aesthetics"
  },
  {
    id: "kappe",
    name: "Kappe Island",
    emoji: "🌊",
    color: "var(--surface-cyan)",
    themeColor: "var(--accent-cyan)",
    description: "Energetic, playful, and adventurous spirits ready for arcade battles and ramen nights"
  },
  {
    id: "central",
    name: "Central Island",
    emoji: "☀️",
    color: "var(--surface-yellow)",
    themeColor: "var(--accent-coral)",
    description: "Warm, thoughtful connections focused on slow mornings, pottery, and deep conversations"
  }
];
