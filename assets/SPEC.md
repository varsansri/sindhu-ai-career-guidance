# Sindhu's AI Career Guidance — Spec

## One-liner
A **GeeksforGeeks-style** ("gigs for gigs") knowledge-base + AI career coach for **fresh college graduates** entering the job market. Trend-based guidance that tells them exactly what skills to learn to hit the salary they want — delivered as expandable courses + a daily guided log, with a "your worth" money timeline that grows as they finish.

## Top banner / positioning
> **Trend-based career guidance for college-out students** — what skills you need to earn the salary you expect.

## Core flows

### 1. Entry quiz (skill-gap finder)
- First page asks the user a set of questions (current education, field, target salary, current skills, etc.).
- Computes the **skill gap** = difference between what they expect and what's realistically possible now.
- Outputs a personalized starting point + recommended path.

### 2. Consultancy / categories page
- Pick **target salary** ("what salary are you preferring?").
- Shows **the ways to achieve that salary**.
- Shows the **career gap** between current and target.
- Shows **courses / paths that already worked** (proven).

### 3. Courses (GeeksforGeeks-style, the centerpiece)
- **4 courses**, each with **12–13+ pages**.
- Each course opens like GeeksforGeeks: an **expandable/folded sidebar** →
  - Course → list of **5–6 units** (main topics) → click a unit → **individual topics/pages** inside.
- Each page = a guideline (NOT a full course): "go read this, go here, these concepts, these websites, step-by-step."
- Replaces "typing into ChatGPT every time" — it showcases everything in one place.
- **"Finish" button on every topic/page.** Finishing drives the worth timeline + streak.

### 4. Worth timeline + streak (gamification)
- As pages/topics are finished, a **timeline** appears: "You're worth ₹20,000 now → ₹25,000 now → …".
- Daily **log journal**: re-enter the log over several days (2–5 days); it guides what to read/do each day.
- On finishing → shows a **streak** + your current "worth."

## AI layer (Grok)
- Uses a **Grok API key** (xAI) to power: skill-gap analysis from the quiz, trend-based path generation, and the daily-log guidance.
- Guidance content **switches based on current trends**.
- KEY HANDLING: never paste the key in chat. It goes into a hosting **env var** (server-side) or a local config — TBD by stack choice below.

## Hosting
- **Free hosting** (user said "notify free hosting" → likely **Netlify** or Vercel free tier).

## Open decisions (confirm before/while building)
1. The **4 course subjects** (user example: Computer Science).
2. **Stack + how the Grok key stays safe** (static vs server-rendered).
3. **Persistence** for streak/worth/log — local (no login) vs accounts.

## Brand
- Name: **Sindhu's AI Career Guidance**
- Theme/colors: TBD.
