# Understand Bible — Adaptive Reading Focus Engine (R&D Specification)

**Project Core Pillar 1: Intelligent Rhythm Matching & Focus Guidance**  
*Document Version: 2.0 · Updated: 24 November 2026*  
*Authors: Antigravity (UI/UX Lead) & Codex (Engineering/Data Lead)*  
*Status: Architecture & Prototype Specification (Active R&D)*

---

## 1. Product Vision & Architectural Context

Understand Bible is structured around a five-stage experience:
$$\text{READ} \longrightarrow \text{FIND} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{EXPLORE} \longrightarrow \text{GROW}$$

Within this vision, **Two Pillar Innovations** redefine digital Scripture engagement:
1. **Pillar 1 (Flagship R&D): Adaptive Reading Focus & Rhythm Matching**  
   An unobtrusive, privacy-first intelligent pacing engine that studies a user's natural reading rhythm across daily sessions and gently guides their focus.
2. **Pillar 2: Vamsavali (Biblical Genealogy & Chronology Explorer)**  
   A multi-generational graph and timeline mapping biblical lineages with dual Matthew 1 and Luke 3 lineages, archaeological confidence, and contextual mobile swipe navigation.
3. **Pillar 3: UNDERSTAND AI Assistant**  
   Floating chapter context assistant fine-tuned on biblical scholarship and canonical references (trained on Kaggle using Qwen open foundation models).

---

## 2. Adaptive Focus Mechanics: The 6-Day Learning & 7th-Day Suggestion

### A. The 6-Day Passive Learning Phase
- **Zero Interruption**: The reader reads normally without prompts, popups, or enforced timers.
- **Client-Side Telemetry Only**:
  - Dwell time per verse ($t_{\text{verse}}$ in milliseconds).
  - Scroll velocity and smooth forward progression rate.
  - Active layout factors (viewport size, font size, single vs. parallel side-by-side mode, script: Telugu script vs. English Latin script).
  - Pauses longer than 45 seconds are treated as reflection or interruption and excluded from pacing averages.
- **Storage Privacy**:
  - All metrics are computed and stored purely in device `localStorage` (`ub_reading_rhythm_v1`).
  - Never transmits reading speed, verse timestamps, or behavioral logs to backend servers.

### B. The 7th-Day Smart Suggestion
- When the reader launches the application on their 7th session (or after 6 qualifying distinct reading days):
  - A glassmorphic suggestion modal materializes:  
    > *"We noticed your natural reading rhythm over the past week (avg. ~195 WPM). Would you like Understand Bible to pace with you and gently illuminate the active reading line?"*
  - Action buttons:
    - **[Preview Rhythm]**: Demonstrates ambient illumination at their detected speed.
    - **[Enable Adaptive Focus]**: Activates the ambient guide.
    - **[Adjust Speed (0.8x / 1.0x / 1.2x)]**: Fine-tunes the pacing multiplier.
    - **[Maybe Later / Dismiss]**: Respects reader autonomy; never nags.

---

## 3. Visual Illumination & Highlight Separation Principle

A critical design requirement is maintaining a strict visual and functional separation between **temporary ambient focus** and **user-saved highlights**:

| Dimension | Temporary Ambient Focus (`data-focus="active"`) | User-Saved Highlights (`data-highlight="color"`) |
|---|---|---|
| **Purpose** | Guiding eyes forward in real-time | Intentional study, reflection, and bookmarking |
| **Trigger** | Automatic pacing or scroll rhythm | User clicks verse $\to$ selects color palette |
| **Visual Appearance** | Soft warm gold breathing glow (`rgba(197, 161, 90, 0.12)` with `border-left: 3px solid #c5a15a`) | Solid translucent tint (Yellow, Green, Rose, Sky, Lavender) |
| **Persistence** | Ephemeral: disappears on blur, pause, or scroll | Persistent: saved to user notes database & synced |
| **Screen Reader** | Transparent (does not interrupt voiceover) | Announced as "Highlighted verse" |

---

## 4. Mathematical Pacing Formulation

For any given verse $v$ containing word count $W(v)$ and character count $C(v)$:

$$T_{\text{expected}}(v) = \left( \frac{W(v)}{\text{WPM}_{\text{median}}} \times 60 \times 1000 \right) \times \mu_{\text{script}} \times \mu_{\text{user}}$$

Where:
- $\text{WPM}_{\text{median}}$: Median reading speed over the 6-day baseline (typically 180–230 WPM for English; 120–160 WPM for agglutinative Telugu script).
- $\mu_{\text{script}}$: Script complexity multiplier (1.0 for English, 1.35 for Telugu ligature clusters).
- $\mu_{\text{user}}$: User preference multiplier ($0.8\times$, $1.0\times$, $1.2\times$).

---

## 5. Future R&D Horizons: Verse to Token Illumination

1. **Phase 1 (Current Implementation)**: Verse-level ambient illumination and smooth scroll batching.
2. **Phase 2 (Sub-Verse Pacing)**: Clause and sentence-level pacing based on punctuation delimiters (commas, semicolons, colons).
3. **Phase 3 (Word-Level Token Illumination)**: Real-time karaoke-style or subtle flowing underline illumination matching reading cadence and TTS audio synchronization (using Bible Brain / IRV audio alignment).
4. **Phase 4 (AI Chapter Context Synergy)**: Cross-referencing reading speed with chapter theological density (e.g. slowing slightly through Romans 9 or Leviticus 16, advancing faster through narrative in 1 Samuel).

---

## 6. Implementation Deliverables in Current Build

- [useAdaptiveFocus.ts](file:///c:/Understand_bible/02_Codex_Workspace/apps/web/lib/reader/useAdaptiveFocus.ts): Client-side rhythm tracking hook.
- [AdaptiveFocusSuggestionModal.tsx](file:///c:/Understand_bible/02_Codex_Workspace/apps/web/components/reader/AdaptiveFocusSuggestionModal.tsx): Day-7 glassmorphic suggestion modal.
- [BibleReader.module.css](file:///c:/Understand_bible/02_Codex_Workspace/apps/web/components/reader/BibleReader.module.css): Ambient breathing focus animations.
- [ag-phase2-mobile-study.test.mjs](file:///c:/Understand_bible/02_Codex_Workspace/apps/web/test/ag-phase2-mobile-study.test.mjs): Automated verification tests.
