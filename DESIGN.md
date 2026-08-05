---
name: Recall.bio
description: Tu vida, tu voz, tu legado — Digital legacy platform
colors:
  primary: "#9E5D46"
  terracotta-clay: "#C4907C"
  earth-brown: "#8B6F4E"
  accent-sage: "#9CAF88"
  accent-dusty-rose: "#D4A5A5"
  accent-lavender: "#B8A9C9"
  bg-cream: "#FDF8F3"
  bg-warm: "#F7EDE4"
  bg-sage: "#E8EDE5"
  text-primary: "#3D3229"
  text-secondary: "#6B5D4D"
  text-muted: "#9B8B7A"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.15
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.2
  title:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Outfit, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Outfit, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.accent-sage}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.terracotta-clay}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  card-animated:
    backgroundColor: "#ffffff"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "24px"
---

# Design System: Recall.bio

## Overview

**Creative North Star: "The Warm Organic Sanctuary"**

Recall.bio is designed as a calm, reflective space for capturing human memory and emotion. The visual system avoids sterile tech aesthetics in favor of tactile organic warmth—reminiscent of handcrafted journal paper, earthenware pottery, and natural linen. Generous organic rounded curves (24px–32px radii), warm earth-toned palettes, and subtle floating fluid shapes create an inviting atmosphere where users feel safe documenting their life story.

The density is spacious and unhurried. Typography pairs the elegant editorial character of *Playfair Display* for reflective headings with the clean modern legibility of *Outfit* for interactive controls and body text. Motion is fluid and organic, employing soft spring dynamics rather than harsh linear transitions.

**Key Characteristics:**
- Warm organic color palette featuring Terracotta Earth, Soft Sage, and Cream parchment background
- Tactile, high-radius container language (24px–32px corners)
- Dual typography pairing elegant serif display titles with clear sans-serif body text
- Subtle decorative fluid blobs providing soft ambient depth without heavy dropshadows
- Reassuring, accessible touch targets designed for multi-generational users

## Colors

The palette draws inspiration from earth, clay, flora, and natural light. Bright neon accents and cold blue/purple AI gradients are strictly prohibited.

### Primary
- **Terracotta Earth** (`#9E5D46` / `#C4907C`): The core action color used for primary interactive buttons, prominent action icons, and focal points. Represents warmth and permanence.
- **Clay Earth** (`#A67B5B`): Supporting earthy tone used for focus rings and subtle hover states.
- **Earth Brown** (`#8B6F4E`): Deep natural tone used for grounding elements and structural borders.

### Secondary
- **Soft Sage** (`#9CAF88`): Secondary accent representing tranquility and growth; used for success states, secondary buttons, and peaceful mood tags.

### Tertiary
- **Dusty Rose** (`#D4A5A5`): Warm accent used for nostalgic / tender memory highlights.
- **Soft Lavender** (`#B8A9C9`): Gentle tertiary accent used for contemplative mood badges and ambient decorations.

### Neutral
- **Warm Cream** (`#FDF8F3`): Primary app background canvas providing a soft, non-glare surface.
- **Warm Linen** (`#F7EDE4`): Card backgrounds, hover states, and container borders.
- **Deep Espresso** (`#3D3229`): Primary high-contrast text color for effortless legibility.
- **Warm Walnut** (`#6B5D4D`): Secondary text for subtitles and metadata.
- **Muted Sand** (`#9B8B7A`): Muted text for captions, timestamps, and disabled states.

### Named Rules
**The One Voice Rule.** Primary Terracotta Earth is reserved for active CTAs and high-intent choices. It covers ≤10% of any screen surface to preserve visual emphasis.
**The No AI Gradient Rule.** Cold cyan-to-purple gradients and harsh synthetic colors are banned. All colors must belong to the earthy organic palette.

## Typography

**Display Font:** Playfair Display (serif)
**Body Font:** Outfit (sans-serif)

**Character:** Playfair Display introduces a personal, literary editorial presence for questions and memory titles, while Outfit ensures crisp clarity for input fields, navigation, and long-form reading.

### Hierarchy
- **Display** (SemiBold 600, `clamp(2rem, 5vw, 3.5rem)`, line-height 1.15): Hero prompts and major section headings.
- **Headline** (SemiBold 600, `clamp(1.5rem, 3.5vw, 2.25rem)`, line-height 1.2): Daily prompt question cards and page titles.
- **Title** (SemiBold 600, `1.25rem` / 20px, line-height 1.3): Card titles, memory headers, and dialog headings.
- **Body** (Regular 400, `1rem` / 16px, line-height 1.6, max length 65–75ch): Memory narrative text, answers, and descriptions.
- **Label** (Medium 500, `0.875rem` / 14px, line-height 1.4): Button text, form labels, and mood badges.

### Named Rules
**The Editorial Title Rule.** Prompt questions and memory titles are always styled in Playfair Display serif to evoke personal storytelling.

## Layout

Layouts use single-column focused flows for prompt reflection and responsive grid cards for memory browsing. Containers feature generous internal padding (`24px` to `32px`) and soft outer margins to maintain a meditative, distraction-free environment.

- **Breakpoints**: Mobile (<640px), Tablet (640px–1024px), Desktop (>1024px).
- **Max Width**: Standard page container caps at `1280px` (`max-w-7xl`), while focused creation/reflection flows cap at `768px` (`max-w-3xl`).
- **Spacing Scale**: 8px (`sm`), 16px (`md`), 24px (`lg`), 32px (`xl`), 48px (`2xl`).

## Elevation & Depth

The design system relies on tonal layering and ambient color blobs rather than heavy drop shadows. Surfaces rest softly on the Warm Cream canvas.

### Shadow Vocabulary
- **Ambient Soft** (`0 1px 3px rgba(61, 50, 41, 0.05)`): Subtle border replacement for floating cards at rest.
- **Elevated Hover** (`0 10px 25px -5px rgba(61, 50, 41, 0.08)`): Interactive cards lift slightly on hover via spring physics.

### Named Rules
**The Tonal Depth Rule.** Layering Warm Linen (`#F7EDE4`) and White surfaces over Warm Cream (`#FDF8F3`) creates depth without intrusive dark drop shadows.

## Shapes

Shapes feature dramatic organic curvature. Standard UI elements use `rounded-2xl` (16px) or `rounded-3xl` (24px–32px), creating friendly, approachable silhouettes.

- **Buttons**: `rounded-2xl` (16px) pill-like soft forms.
- **Cards**: `rounded-3xl` (24px) container corners.
- **Modals & Sheets**: `rounded-3xl` (24px–32px) top corners.
- **Badges**: Fully rounded pills (`rounded-full`).

## Components

### Buttons
- **Shape:** Soft pill (`rounded-2xl` / 16px radius)
- **Primary:** Background Terracotta Earth (`#9E5D46`), Text White, padding `12px 24px`
- **Hover / Focus:** Darker Terracotta (`#854B36`), scale transition, clay focus ring (`#A67B5B`)
- **Secondary:** Background Soft Sage (`#9CAF88`), Text Deep Espresso (`#3D3229`)
- **Ghost:** Transparent background, Terracotta Earth border (`#C4907C`) and text

### Cards
- **Corner Style:** `rounded-3xl` (24px radius)
- **Background:** White (`#FFFFFF`) or Warm Linen (`#F7EDE4`)
- **Border:** `1px solid #F7EDE4`
- **Internal Padding:** `24px` (`p-6`) or `32px` (`p-8`)

### Inputs & Fields
- **Style:** Background Warm Cream (`#FDF8F3`), border Warm Linen (`#F7EDE4`), radius `16px`
- **Focus:** Border shift to Terracotta Clay (`#A67B5B`) with subtle offset ring

### Mood Badges & Chips
- **Style:** Pill shape (`rounded-full`), background colored tint, text matching deep tint
- **Variants:** Happy (Amber tint), Grateful (Sage tint), Contemplative (Lavender tint), Nostalgic (Rose tint)

## Do's and Don'ts

### Do:
- **Do** use Playfair Display for all daily prompt questions and memory titles.
- **Do** use generous 24px+ rounded corners for cards and containers.
- **Do** maintain high contrast between Deep Espresso text (`#3D3229`) and Warm Cream background (`#FDF8F3`).
- **Do** use smooth Framer Motion spring physics for card hover states and modal entrances.

### Don't:
- **Don't** use neon, cyan, dark purple, or synthetic AI-style gradient backgrounds.
- **Don't** use sharp 0px or small 2px corners on cards and buttons.
- **Don't** use harsh black `#000000` text or heavy dark drop shadows.
- **Don't** crowd inputs and buttons together; preserve spatial breathing room.
