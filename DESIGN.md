<!-- MIT licensed. Copyright and license: https://opendesignmd.com/licenses/ -->

# How Jan.ai Design System is Applied

## Overview

Jan presents an open-source, developer-grade aesthetic that pairs rigorous Swiss-style grotesque typography with stark monochrome contrast and neo-brutalist graphic depth. The interface utilizes pure black against pure white for chrome and primary actions, with vibrant pastel color fields (`#FFD21E`, `#BBF7D0`, `#E9D5FF`, `#458EDF`) reserved for feature cards, tags, and status badges.

All emojis are strictly replaced with clean, minimalist geometric SVG icons. Depth is achieved entirely through hard, flat cut-paper shadows (`box-shadow: 4px 4px 0 #000000`) and solid 2px black outlines (`border: 2px solid #000000`), completely avoiding blurry gradients or soft drop shadows.

## Color Tokens

| token | value | use |
|---|---|---|
| ink | #000000 | Primary text, borders, primary button fills, hard shadows |
| ink-secondary | #1F2937 | Body text on light backgrounds, secondary headings |
| ink-tertiary | #374151 | Muted text, captions, metadata |
| muted | #4B5563 | De-emphasized labels, subtitles |
| canvas | #FFFFFF | Background, inverted text on dark surfaces |
| surface | #2C2C2C | Dark stat cards, terminal containers |
| surface-secondary | #404040 | Secondary dark UI components |
| accent-blue | #458EDF | Verified badges, primary system accents |
| accent-indigo | #5765F2 | Integration accents |
| accent-yellow | #FFD21E | Highlight cards, compatibility badges |
| accent-green | #BBF7D0 | Active status, match success indicators |
| accent-purple | #E9D5FF | Layered offset cards, category chips |
| accent-cream | #FEF08A | Profile note backgrounds, sticky cards |

## Typography

Built using geometric grotesques (`Plus Jakarta Sans` / `Inter` / `Space Grotesk`) with tight tracking at display sizes and neutral tracking for body text:

- **Hero Display:** 3.5rem - 4.5rem, Weight: 800, Tracking: -0.04em
- **Section Heading:** 2.25rem, Weight: 700, Tracking: -0.03em
- **Feature Title:** 1.5rem, Weight: 700, Tracking: -0.02em
- **Body & Controls:** 0.95rem - 1rem, Weight: 400 & 500, Leading: 1.5
- **Labels & Tags:** 0.8125rem, Weight: 600, Uppercase or Title Case

## Key Principles

1. **Zero Emojis:** All UI indicators, statuses, and navigation items use high-contrast monochrome and two-tone SVG line icons.
2. **2px Solid Borders:** Every card, button, input, and modal features crisp `2px solid #000000` boundaries.
3. **Hard 4px Shadows:** Flat `4px 4px 0px #000000` shadows with hover transform `translate(-2px, -2px)` and shadow expansion `6px 6px 0px #000000`.
4. **Information Architecture:** Seamless flow between Landing Page, Login / Authentication portal, and the full Discovery & Chat Dashboard.
