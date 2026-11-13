// ============================================================================
// CRAZY LOVE / PAWANDATE - COMMUNITY MOMENTS & MEDIA FEED STORE
// High-fashion lifestyle creator posts, image uploads, real-time likes & comments
// ============================================================================

export const INITIAL_FEED_POSTS = [
  {
    id: "post-1",
    authorId: "profile-1",
    authorName: "Anya Chen",
    authorHandle: "@anya.chen",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    location: "Daikanyama, Tokyo",
    mediaUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80",
    caption: "Golden hour pour-over at my favorite brutalist coffee sanctuary. 35mm film captures light in ways digital sensors still can't replicate. Who has recommendations for analog labs in Shibuya?",
    tags: ["#35mmFilm", "#MinimalistDesign", "#CoffeeCulture", "#TokyoAesthetic"],
    interest: "35mm Film",
    likesCount: 142,
    isLiked: false,
    timestamp: "2 hours ago",
    comments: [
      {
        id: "c-101",
        authorName: "Rin Takahashi",
        authorAvatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&h=200&q=80",
        text: "That lab behind the station on Cat Street does 1-hour high-res Noritsu scans! Drop by anytime.",
        time: "1h ago"
      },
      {
        id: "c-102",
        authorName: "Chloe Vance",
        authorAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&h=200&q=80",
        text: "The natural grain on this frame is stunning Anya ♡",
        time: "45m ago"
      }
    ]
  },
  {
    id: "post-2",
    authorId: "profile-2",
    authorName: "Chloe Vance",
    authorHandle: "@chloe.ceramics",
    authorAvatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&h=200&q=80",
    location: "Atelier, Kyoto",
    mediaUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80",
    caption: "Fresh batch of stoneware matcha chawan vessels out of the wood-fired kiln. The raw unglazed textured clay feels so grounded in your hands.",
    tags: ["#Ceramics", "#WabiSabi", "#HandmadeCraft", "#KyotoStudio"],
    interest: "Ceramics",
    likesCount: 218,
    isLiked: true,
    timestamp: "4 hours ago",
    comments: [
      {
        id: "c-201",
        authorName: "Maya Dubois",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
        text: "These would look divine paired with our autumn yuzu tartlettes. Let's collaborate!",
        time: "3h ago"
      }
    ]
  },
  {
    id: "post-3",
    authorId: "profile-3",
    authorName: "Rin Takahashi",
    authorHandle: "@rin.creative",
    authorAvatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&h=200&q=80",
    location: "Roppongi Hills, Tokyo",
    mediaUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
    caption: "Late night modular synth session & experimental lighting study for our upcoming design gallery showcase. Electric currents and analog warmth.",
    tags: ["#ElectronicMusic", "#VisualIdentity", "#TokyoNights", "#CreativeDirector"],
    interest: "Electronic Music",
    likesCount: 389,
    isLiked: false,
    timestamp: "6 hours ago",
    comments: [
      {
        id: "c-301",
        authorName: "Anya Chen",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
        text: "The neon glow balance here is incredible Rin!",
        time: "5h ago"
      }
    ]
  },
  {
    id: "post-4",
    authorId: "profile-4",
    authorName: "Maya Dubois",
    authorHandle: "@maya.patisserie",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
    location: "Ginza, Tokyo",
    mediaUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80",
    caption: "Early 5 AM laminations. 27 microscopic butter layers folded by hand. Crisp acoustic jazz in the kitchen and the aroma of roasted Madagascar vanilla beans.",
    tags: ["#CulinaryArts", "#FrenchPatisserie", "#PastryChef", "#MorningRituals"],
    interest: "Culinary",
    likesCount: 175,
    isLiked: false,
    timestamp: "8 hours ago",
    comments: []
  },
  {
    id: "post-5",
    authorId: "profile-5",
    authorName: "Sora Hayashi",
    authorHandle: "@sora.botanics",
    authorAvatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=200&h=200&q=80",
    location: "Inokashira Park, Kichijoji",
    mediaUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80",
    caption: "Autumn mist across the moss gardens. Designing bioclimatic shade structures that coexist with ancient cedar trees. Nature always has the best architectural solutions.",
    tags: ["#Architecture", "#BiophilicDesign", "#UrbanForest", "#QuietMornings"],
    interest: "Architecture",
    likesCount: 260,
    isLiked: false,
    timestamp: "12 hours ago",
    comments: []
  }
];

