<!-- MIT licensed. Copyright and license: https://opendesignmd.com/licenses/ -->

# How CrazyCreative.design & High-Performance Modern Dating Architecture are Applied to Crazy Love

## 1. Overview & Visual Direction

Crazy Love is a high-voltage, poster-like studio dating experience built on the visual principles of [crazycreative.design](https://crazycreative.design/). The design language rejects boring corporate swiping in favor of monumental typography (`Bricolage Grotesque`), saturated color stages, crisp solid surfaces (`#0D0D0D`, `#18181B`, `#FFFFFF`, `#FF2E93`), and handcrafted cartoon mascot storytelling.

### Three Integrated Signature Mascot Artworks:
1. **The Late-Night Studio Brain Mascot (`assets/character-night-studio.jpg`):**
   - The night owl creator wearing headphones at his desk with lamp glow, snail bug, window, and interactive live Tokyo studio clock. Represents the Late-Night Vibe-Check Lounge where users preview ambient 15-second video vibe checks.
2. **The Crazy Chemistry Shock Bomb Mascot (`assets/character-shock-bomb.jpg`):**
   - Bomb-head character in shock with hands on cheeks on electric pink background with lightning bolts. Celebrates matches and warns users of the 48-Hour Anti-Ghosting expiration clock!
3. **The Dome Brain & Gem Ticker (`assets/character-dome-brain.png`):**
   - Brain under glass dome on starry space accompanied by the continuous icosahedron gem ticker: **"YOU DESERVE SOMETHING SPECIAL"** & **"48H ANTI-GHOSTING GUARANTEE"**.

---

## 2. Product Feature Implementation Matrix

| Area | Feature | Implementation Details |
|---|---|---|
| **Onboarding** | Phone & SMS Authentication | One-time 6-digit verification code simulation (`+1 (555) 928-1044` -> `849201`). |
| | Pose Photo Verification | Interactive camera simulator with facial guide oval, biometric scanner line, and "✓ Photo Verified" badge. |
| | Signature Story Prompts | Selectable prompts (e.g. "Dating me looks like...", "A simple luxury I value...") with custom magnetic answer editor. |
| | Core Values & Ambition | Multi-tag selection: Creative Freedom, Deep Ambition, Zero Ghosting, Slow Living, Night Owl / Early Bird. |
| **Profiles** | Rich Creative Data | Multi-photo carousel, occupation, location, bio, hobby chips, values tags, and 3 story prompts. |
| | Linked Connected Socials | Spotify anthem badge with animated soundwave bars, Instagram handle, Twitter/X, and GitHub. |
| | Video-First Vibe Check | Looping ambient 15s video reel preview ("Video Verified Vibe"). |
| **Matching** | Gesture & Keyboard Swiping | Touch drag physics with tilt & PASS/MATCH stamps; Arrow keys [← Pass, → Like, ↑ Superlike, ↓ Rewind, Space Inspect]. |
| | Multi-Factor Algorithm | Distance bounds (km slider), age preferences (slider), and semantic cosine similarity on creative hobbies. |
| | Anti-Ghosting Engine | 48-hour expiration timer (`⏳ 47h 58m left`) displayed on cards, matches, and chat headers. |
| **Chat** | Instagram-Style Messaging | Direct messaging, audio voice memos, photo attachments, double-tap heart reactions, and read receipts (`✓✓ Seen`). |
| | AI Wingman Generator | Context-aware button in chat proposing 3 tailored openers based on the match's bio, prompts, and hobbies. |
| | Video Call Verification | Interactive 1080p video call overlay simulation with live partner stream, self PIP, mute, flip, and hangup. |
| **Safety** | Trust & Moderation Suite | Block user (immediate queue removal) and report categories (harassment, catfish, solicitation, safety). |
| | Sensitive Photo Shield | Toggable photo blur on incoming media with tap-to-reveal. |
| **VIP Perks** | 10x Profile Boost | 30-minute priority discovery timer with pulsing golden halo around user status. |
| | Super Likes Bank | 3 daily Super Likes with celebratory sparkle arpeggio audio and confetti burst. |
| | "See Who Liked You" | Gold radar grid displaying secret admirers with unblur toggle and instant 1-click match. |
| | Stealth / Incognito Mode | Hide distance and only appear to creators you have swiped right on. |

---

## 3. High-Throughput Production Architecture

```
[ Client Applications ]
  ├── React Native / Flutter (iOS & Android Native Mobile Apps)
  └── Web Studio SPA (Bricolage Grotesque, Solid Poster Canvas, Web Audio API)
          │
          ▼  HTTPS / WSS (WebSockets)
[ API Gateway & Ingress (Caddy / Envoy) ]
  ├── JWT Auth & Twilio SMS Token Validation
  └── Rate Limiting & SSL Termination
          │
  ┌───────┴──────────────────────────────┐
  ▼                                      ▼
[ Core Backend Service (Node.js/FastAPI) ] [ Realtime Gateway (Socket.io / Redis) ]
  ├── Matching Engine & Distance Scoring     ├── Sub-millisecond Messaging
  ├── Profile Management & S3 Presigned URLs ├── Active Typing Indicators
  └── 48h Anti-Ghosting Cron Worker          └── Read Receipts & Video Call Signaling
          │                                      │
  ┌───────┴───────────────┐                      ▼
  ▼                       ▼            [ Redis In-Memory Cache ]
[ PostgreSQL Database ]  [ AWS S3 & CDN ]  ├── Active Sessions & Swipe Queues
  ├── User Profiles        ├── High-Res Photos ├── Match Expiration Timers
  ├── Values & Socials     ├── Video Clips    └── Pub/Sub Message Channels
  └── Audit & Safety Logs  └── Voice Memos
          │
          ▼
[ ML Recommendation Service (Python PyTorch) ]
  ├── Collaborative Filtering (Surprise / LightFM)
  ├── Semantic Text Embeddings (Sentence-Transformers)
  └── Daily Re-ranking Batch Jobs
```

---

## 4. Color Tokens

| token | value | use |
|---|---|---|
| `canvas-pink` | `#FF2E93` | Brand hero billboard canvas, flame cards, primary CTAs |
| `canvas-white` | `#FFFFFF` | White card sections, monumental typography, white pill buttons |
| `canvas-dark` | `#0D0D0D` | Theatrical dark stages, chat console, base card backgrounds |
| `canvas-dark-card`| `#18181B` | Solid card bodies, chat drawer, settings containers |
| `accent-lime` | `#D4FF00` | High-voltage action buttons, match celebration, verified badges |
| `accent-cyan` | `#00F0FF` | Confetti sparks, photo verified badges, video call borders |
| `accent-yellow` | `#FFE600` | Anti-ghosting timers, VIP pass perks, handwritten script accents |
| `accent-purple` | `#9D4EDD` | Dome brain glow, category badges, soundwave bars |
| `border-dark` | `#27272A` | Crisp 2px-3px solid container outlines |
