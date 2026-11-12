# Loveeez Dating Application 💖

A Japanese character property-inspired dating application built with soft, rounded visual language, pastel candy colors, and modern market dating app architecture (inspired by Tinder, Bumble, and Hinge).

---

## 🎨 Loveeez Design System
Built following the official Loveeez Design Specification (`DESIGN.md`):
- **Colors**: Confectionery pastel palette (`#FFE4F0` surface pink, `#A8F0F8` surface cyan, `#FFF8C8` surface yellow, `#FF88B8` accent pink, `#3D3D3D` ink).
- **Typography**: Display typography using `Cherry Bomb One`, interactive labels using `Coiny`, and legible body reading using `Zen Maru Gothic`.
- **Shapes & Radii**: Blob-like panels (`2rem`), rounded cards (`1.5rem`), pill buttons (`9999px`), and speech bubbles with triangular directional tails.
- **Micro-Interactions**: Draggable card deck with dynamic angle tilt, LIKE/NOPE stamps, celebration modals with avatars, and typing indicators.

---

## 📂 Project Architecture & File Structure

```text
DATING-WEBSITE/
├── DESIGN.md               # Complete design system specification and guidelines
├── README.md               # Documentation and architectural guide
├── index.html              # Main application shell with Discover, Explore, Chat, and Profile tabs
├── app.css                 # Loveeez design system tokens, components, and animations
├── app.js                  # Modular state manager, gesture engine, matching & chat controller
└── data/
    ├── profiles.js         # Curated AI-style dating profiles, prompt cards, and island vibes
    └── chats.js            # Matches store, active conversation threads, icebreakers, and bot reply engine
```

---

## 🚀 Key Features Implemented

1. **Card Swipe Deck (Tinder / Bumble Style)**:
   - 3D Draggable cards with mouse/touch drag physics and proportional rotation.
   - Dynamic real-time stamp overlays (`LIKE`, `NOPE`, `SUPER LIKE`).
   - Bottom action pill buttons: Rewind ↺, Pass ✕, Super Like ★, Like ♥, and Info ℹ️.
   - Full keyboard accessibility: ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Space.

2. **Loveeez Island Vibes & Character Relationship Diagram**:
   - **Pinky Island 🌸**: Romantic, sweet aesthetics, matcha cafes, books, and delicate art.
   - **Kappe Island 🌊**: Energetic, playful arcades, purikura photobooths, spicy ramen, dance.
   - **Central Island ☀️**: Cozy, thoughtful pottery, bakery walks, pour-over coffee, deep conversations.
   - Filter swipe deck dynamically by Island vibe.
   - Interactive character relationship network with pastel speech bubbles.

3. **Connections & Real-Time Interactive Messaging**:
   - New Matches carousel with unread indicators.
   - Conversation thread list with timestamps and message previews.
   - Interactive chat room with speech bubble tails.
   - One-tap icebreaker prompt chips ("What's your ideal Sunday?", "Matcha or pour-over?").
   - Automated companion replies with realistic typing indicators.

4. **Google Authentication & Identity**:
   - Google Sign-in flow with profile picture, email synchronization, and verification badge.
   - Persistent session storage in `localStorage` across page refreshes.

5. **Profile & Discovery Preferences**:
   - View and edit bio, city, discovery radius slider, and dating vibe island.
