# ExamOrbit UI Redesign - Master Prompt (HD)

**Role**: You are an expert Senior UI/UX Engineer and Frontend Developer specializing in React, Tailwind CSS v4, Framer Motion, and Modern Application Design.

**Objective**: Redesign the entire "ExamOrbit" application to have a premium, "OLED" dark mode aesthetic with vibrant accents, glassmorphism, and fluid animations.

**Output Format**: Provide a single comprehensive text file (or broken down by page) containing the HTML/React/Tailwind code for each page, along with a list of required icons and assets.

---

## 1. Global Design System

### A. Theme & Colors

- **Background**: Deep "OLED" Black (`#000000` or `#050505`). NOT grey.
- **Foreground**: Pure White (`#FFFFFF`).
- **Accents**:
  - **Primary**: Electric Blue / Purple Gradient (e.g., `from-violet-500 to-fuchsia-500`).
  - **Success**: Neon Green (`#22c55e`).
  - **Error**: Bright Red (`#ef4444`).
  - **Warning**: Amber/Yellow (`#f59e0b`).
- **Surface**: Dark Grey with transparency (`bg-white/5` or `bg-white/10`) + Backdrop Blur (`blur-xl`).
- **Borders**: Extremely subtle (`border-white/10`).

### B. Typography

- **Headings**: `Lexend`, sans-serif. Bold, tight tracking.
- **Body**: `Inter` or `Manrope`, sans-serif. Readable, good contrast.
- **Handwritten/Fun**: `Kalam` (for motivational quotes or special accents).

### C. Layout & Structure

- **Mobile-First**: The app is designed primarily for mobile usage but must look great on desktop.
- **Center Layout (Phone-in-Browser)**:
  - On desktop, the entire app must be constrained to a centered wrapper (`max-w-[420px]`) with a shadow and border.
  - The rest of the screen is a dark background.
  - This simulates a mobile app running in a browser window.
  - **NO** full-width desktop dashboards. Always use the mobile layout centered.
- **Global CSS**: Define reusable classes in `globals.css` for:
  - `.glass-card`: `bg-white/5 backdrop-blur-md border border-white/10`
  - `.text-gradient`: `bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400`
  - `.custom-scrollbar`: Hide scrollbar for clean UI.

### D. Animations (Framer Motion)

- **Page Transitions**: Smooth fade-in + slide-up (`initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}`).
- **Micro-interactions**: Buttons scale on click. Cards list stagger in.
- **Loading**: Pulse animations or shimmering skeletons.

---

## 2. Component Requirements

For every page, implement these states:

1.  **Loading**: Show a `Skeleton` UI that matches the final layout.
2.  **Error**: Friendly error message with a "Retry" button.
3.  **Empty**: "No quizzes found" (etc.) with an illustration/icon.
4.  **Content**: The actual data display.

---

## 3. Page-by-Page Specifications

### Page 1: Authentication (Login / Register)

- **Route**: `app/(pages)/auth/page.tsx`
- **Elements**:
  - **Logo**: Centered, animated (Orbit/Planet theme).
  - **Social Buttons**: "Continue with Google" (Brand color/icon).
  - **Form**: Email/Password inputs (Glassmorphism style).
  - **Action**: "Sign In" button (Full width, gradient).
  - **Footer**: "Don't have an account? Sign up."
- **Data**: Nothing fetch-heavy.
- **States**: `isSubmitting` (disable buttons, show spinner).

### Page 2: Dashboard (Quiz Selection)

- **Route**: `app/(pages)/dashboard` (or `quiz/page.tsx`)
- **Header**: User Greeting ("Good Evening, Ritik"), Avatar (Link to Profile), Streak Flame Icon.
- **Content**:
  - **Motivation Card**: Random quote or "Daily Word".
  - **Subject Tabs/Swiper**: Horizontal scroll or tabs for "Biology", "Physics", etc.
  - **Topic List**: Vertical list of topics.
    - **Topic Card**: Shows Title, Progress Bar, "Start" button.
    - **Lock State**: If locked (cooldown), show countdown timer overlay.
- **Micro-interactions**: Confetti when a set is completed (if showing history).

### Page 3: Quiz Attempt (Active)

- **Route**: `app/(pages)/quiz/quiz-ongoing/page.tsx`
- **Layout**:
  - **Top Bar**: Progress Bar (Segmented, e.g., 5/20), Timer (Sticky, turns red when low).
  - **Question Area**: Large card, clear text.
  - **Options**: Vertical stack of 4 buttons.
    - **Idle**: dark grey background.
    - **Selected**: Blue border/glow.
    - **Submitted (if immediate feedback)**: Green (Correct) / Red (Wrong).
  - **Bottom Bar**: "Next" / "Submit" button. Navigation arrows.
- **States**: Loading Question, Submitting Answer.

### Page 4: Quiz Review / History

- **Route**: `app/(pages)/quiz/review/page.tsx` & `history/page.tsx`
- **Header**: "Result" or "History".
- **Score Card**: Large circular progress or donut chart showing score %. Animated counter.
- **Stats Grid**: Time Taken, Accuracy, XP Earned.
- **Question Review List**:
  - Accordion or List functionality.
  - Show Question, User Answer (with icon check/x), Correct Answer.
  - Explanation box (expandable).

### Page 5: Stats

- **Route**: `app/(pages)/stats/page.tsx`
- **Visuals**:
  - **XP Chart**: Line chart (Recharts) showing progress over time.
  - **Heatmap**: GitHub-style contribution graph for quiz activity.
  - **Badges**: Grid of earned achievements (locked/unlocked styles).

### Page 6: Profile

- **Route**: `app/(pages)/profile/page.tsx`
- **Avatar Editor**:
  - Click to upload/change.
  - Options to choose preset avatars.
- **Fields**: Name (Editable), Bio (Editable, textarea), Email (Read-only).
- **Settings**: Toggle "Sound Effects", "Haptic Feedback", "Theme" (if applicable).
- **Actions**: "Log Out" (Destructive red variant).

### Page 7: Admin (CMS)

- **Route**: `app/(pages)/admin/page.tsx`
- **Upload**: Large drag-and-drop zone for JSON files.
- **Table**: Modern data table for Questions.
  - Columns: ID, Text (Truncated), Topic, Set.
  - Actions: Edit, Delete buttons.
- **Stats**: Total Users, Total Quizzes (Admin view).

---

## 4. Implementation Assets

### Required Icons (Lucide React)

- `Zap` (XP/Streak)
- `Clock` (Timer)
- `CheckCircle`, `XCircle` (Answers)
- `Trophy` (Leaderboard/Stats)
- `User`, `Settings`, `LogOut` (Profile)
- `ChevronRight`, `ArrowLeft` (Navigation)
- `Loader2` (Loading Spinner)
- `Flame` (Streak)
- `BookOpen` (Subjects)

### Data Types (Reference)

_Use these types to mock data structure._

```typescript
// convex-table-types.ts
export type ConvexUserType = {
  name?: string;
  email?: string;
  image?: string;
  bio?: string;
  role?: "admin" | "user";
  // ...
};

export type ConvexQuestionType = {
  text: string;
  options: string[]; // Array of 4 strings
  correctOption: number; // 0-3
  explanation?: string;
  // ...
};

export type ConvexUserStatsType = {
  totalXp: number;
  quizzesTaken: number;
  averageScore: number; // Percentage
  lastActive: number; // Timestamp
};
```

---

**Execution Plan**:

1.  Read this prompt.
2.  Generate the HTML/JSX for the "Center Layout" wrapper.
3.  Generate the Global CSS (`globals.css`) with the definitions above.
4.  Generate each Page Component individually, ensuring they fit within the wrapper.
5.  Generate the `Component` file for smaller reusable UI pieces (Buttons, Cards).
