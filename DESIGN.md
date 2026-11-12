<!-- MIT licensed. Copyright and license: https://opendesignmd.com/licenses/ -->

# How Loveeez Dating Design System is Designed

## Overview

Loveeez Dating is built around soft, rounded visual language and pastel candy colors inspired by Japanese character storytelling and modern dating platforms (Tinder, Bumble, Hinge). The design system prioritizes emotional warmth, psychological safety, and playful accessibility through blob-like shapes, generous corner radii, pill buttons, and responsive micro-interactions. Every surface feels cushiony and approachable—cards curve gently, buttons are fully pill-shaped (`9999px`), and typography alternates between bouncy display faces and friendly rounded gothic text.

## Architecture & Data Management (Top Dating Apps Comparison)

Modern dating applications like Tinder, Bumble, and Hinge follow a decoupled, state-driven client architecture:

1. **Deck & Feed Management**:
   - Algorithmic deck stack with eager card pre-fetching (top 3 cards rendered in DOM: active, undercard, background).
   - Multi-gesture input handling (touch drag, mouse drag, keyboard arrows, and action bar pill buttons).
   - Reversible action stack (`undo` / rewind queue for accidental passes).

2. **Match Engine & Compatibility**:
   - Island / Vibe based taxonomy (Pinky Island for Romance, Kappe Island for Active/Adventures, Central Island for Cozy & Deep Chats).
   - Mutual match triggers with celebratory modals, instant icebreaker suggestions, and sound/haptic feedback.

3. **Real-time Messaging & Presence**:
   - Chat thread state with typing indicators, timestamp grouping, read receipts, and icebreaker prompts.
   - Local state cache with optimistic UI updates and local persistence.

4. **Authentication & Identity**:
   - Google Sign-In identity provider integration with one-tap authentication.
   - Verified profile badges and safety-first reporting/blocking controls.

## Color Tokens

| token | value | use |
|---|---|---|
| ink | #3D3D3D | Primary text, character outlines, diagram connectors |
| canvas | #FFFFFF | Speech bubbles, card surfaces, text on dark surfaces |
| surface-pink | #FFE4F0 | Primary page background, romantic island theme, match glow |
| surface-cyan | #A8F0F8 | Playful island theme, hero accent surfaces |
| surface-mint | #C8F8E8 | Active card backgrounds, compatibility chips |
| surface-yellow | #FFF8C8 | Central island card, warm accent highlights |
| surface-lavender | #E8E0F8 | Tertiary card backgrounds, secondary tags |
| accent-pink | #FF88B8 | Primary pill buttons, like action, active states |
| accent-cyan | #38D8F0 | Secondary buttons, refresh icons, message bubble |
| accent-coral | #FF6B6B | Nope/pass action, alerts, badge notifications |
| muted-ink | #888888 | Secondary text, captions, subtitles |

## Typography

| token | family | size | weight | use |
|---|---|---:|---:|---|
| hero-display | 'Cherry Bomb One', cursive | 3.5rem - 4.5rem | 400 | Page titles, large celebratory headers |
| section-display | 'Cherry Bomb One', cursive | 2rem - 2.5rem | 400 | Card titles, match notices |
| label | 'Coiny', cursive | 0.875rem - 1.1rem | 400 | Buttons, tags, badges, swipe stamps |
| body | 'Zen Maru Gothic', sans-serif | 0.95rem - 1rem | 400 | Descriptions, bios, dialogue |
| body-bold | 'Zen Maru Gothic', sans-serif | 0.95rem - 1rem | 700 | Emphasized text, speech bubbles |
| navigation | 'Zen Maru Gothic', sans-serif | 0.875rem | 700 | Navigation, tabs, status |

## Components

- **Pill Buttons**: Full `border-radius: 9999px`, solid pastel/accent fills, zero harsh box-shadows.
- **Swipeable Card Stack**: Smooth transform transitions, realistic rotation proportional to horizontal drag distance, dynamic LIKE/NOPE stamps.
- **Speech Bubbles**: Rounded rectangular badges with directional triangle tails.
- **Island Badges**: Color-coded location and vibe tags for matching compatibility.
- **Chat Drawer**: Sliding panel with real-time mockup messaging, automated companion replies, and quick prompts.
- **Google Auth Modal**: Authentic Google Sign-in flow with profile picture and email synchronization.
