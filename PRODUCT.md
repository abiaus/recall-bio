# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are individuals across different life stages (teen, young adult, adult, midlife, senior) who want to document their memories, personal stories, and life lessons, alongside designated trusted heirs (family members, children, close friends) who will inherit access to this emotional archive.

## Product Purpose

Recall.bio is a digital legacy platform that helps people document their life story through daily reflective prompts using text, voice recordings, and photos. It enables users to build an authentic emotional archive with automated voice transcription and controlled heir access.

## Positioning

"Tu vida, tu voz, tu legado." (Your life, your voice, your legacy.)
Recall.bio is a privacy-first digital legacy vault combining structured daily prompt reflection, multi-modal memory capture (audio + text + photos with Gemini voice transcription), and precise heir access controls.

## Operating Context

Web application used on desktop and mobile web browsers. Users engage in brief daily reflection rituals by answering assigned daily prompts, recording audio memories, uploading photos, and configuring digital legacy release rules for their designated heirs.

## Capabilities and Constraints

- **Stack**: Next.js 16 (App Router), TypeScript (strict), Tailwind CSS 4, Framer Motion, Supabase (Auth, PostgreSQL, Storage, Realtime), TanStack Query, next-intl.
- **Prompt Engine**: Stable per-user daily prompt assignment weighted by life stage with fallback / retry prompts and EN/ES bilingual support.
- **Memory Composition**: Multi-modal memory creation containing text, audio recording (WebM/Opus in browser), up to 5 photos per memory (max 5MB each, 20MB total; JPEG/PNG/WebP), and mood tagging (happy, grateful, contemplative, nostalgic, peaceful, excited).
- **AI Transcription**: Automatic multi-language voice transcription powered by Gemini with processing status tracking (pending, processing, completed, failed) and plan-based monthly quotas.
- **Legacy & Heirs**: Heir invitation system with role/relationship mapping (accepted, active, revoked states) and dual-view management ("My heirs" and "Legacies received").
- **Internationalization**: Dual locale support (`en` default, `es`) across app interfaces, emails, and prompt content.
- **Plans & Feature Flags**: Free and Pro tier definitions with feature key enforcement, user overrides, and monthly usage limit tracking.

## Brand Commitments

- Name: Recall.bio
- Slogan: "Tu vida, tu voz, tu legado." / "Your life, your voice, your legacy."
- Privacy Commitment: Full user control over memory access and heir release timing; media files stored in private Supabase buckets with Row Level Security (RLS).

## Evidence on Hand

- [PRODUCT_DESCRIPTION.md](file:///c:/Users/Agustin/coding/recall-bio/PRODUCT_DESCRIPTION.md): Complete functional specification and stack overview.
- [ROADMAP.md](file:///c:/Users/Agustin/coding/recall-bio/ROADMAP.md): Feature evolution roadmap.
- Application codebase: Next.js 16 App Router components, Supabase schema, and locale files (`messages/en.json`, `messages/es.json`).

## Product Principles

1. **One Day at a Time**: Lower the barrier to documentation through single, inspiring daily prompts.
2. **Authentic Voice**: Preserve human emotion and cadence by prioritizing voice recording alongside text and visual memories.
3. **Absolute Privacy & Control**: Memories belong to the user; sharing with heirs is explicit, intentional, and strictly permissioned.
4. **Enduring Legibility**: Multi-language transcription ensures voice memories remain search-accessible and readable across generations.

## Accessibility & Inclusion

Support multi-language interfaces (English/Spanish), accessible media players with transcriptions for audio content, and responsive layout across desktop and mobile devices.
