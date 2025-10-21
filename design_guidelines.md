# Design Guidelines: Python Learning Platform

## Design Approach

**Selected Approach:** Hybrid Design System inspired by modern coding platforms (LeetCode, Replit, Codecademy) combined with gamification elements from Duolingo.

**Core Principle:** Create a clean, distraction-free learning environment that balances professional code editing with engaging gamification, prioritizing readability and user focus.

## Color Palette

### Light Mode
- **Primary Brand:** 220 90% 56% (vibrant blue, Python-inspired)
- **Secondary Accent:** 142 70% 45% (success green for achievements)
- **Background Base:** 220 15% 98% (soft off-white)
- **Surface Cards:** 0 0% 100% (pure white)
- **Text Primary:** 220 15% 20% (dark charcoal)
- **Text Secondary:** 220 10% 45% (medium gray)
- **Border Subtle:** 220 15% 90% (light gray)
- **Code Editor Background:** 220 20% 14% (dark slate, always dark)

### Dark Mode
- **Primary Brand:** 220 85% 65% (lighter blue for contrast)
- **Secondary Accent:** 142 65% 55% (brighter success green)
- **Background Base:** 220 18% 12% (deep charcoal)
- **Surface Cards:** 220 15% 16% (elevated dark cards)
- **Text Primary:** 220 15% 95% (off-white)
- **Text Secondary:** 220 10% 70% (light gray)
- **Border Subtle:** 220 15% 25% (dark borders)

### Gamification Colors
- **XP Gold:** 45 95% 60%
- **Streak Fire:** 15 90% 55%
- **Achievement Purple:** 270 70% 60%
- **Warning/Error:** 0 75% 60%

## Typography

**Font Families:**
- **UI Text:** Inter (Google Fonts) - weights 400, 500, 600, 700
- **Code Editor:** JetBrains Mono (Google Fonts) - weights 400, 500, 600
- **Headings:** Inter Bold (700)

**Size Scale:**
- Hero/Dashboard titles: text-3xl to text-4xl
- Section headers: text-2xl
- Exercise titles: text-xl
- Body text: text-base
- Code: text-sm
- Metadata/labels: text-xs

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm (p-4, gap-8, mt-12, etc.)

**Grid Structure:**
- **Desktop (3-panel layout):** Left sidebar (300px) navigation, center panel (flex-1) exercise/editor, right sidebar (320px) AI assistant/stats
- **Tablet (2-panel):** Collapsible left nav, main content, floating AI assistant
- **Mobile (stacked):** Bottom nav bar, full-width content panels, modal AI assistant

**Container Max-widths:**
- Dashboard grid cards: max-w-7xl
- Exercise descriptions: max-w-3xl
- Code editor: full-width within panel

## Component Library

### Navigation & Structure
- **Top Header:** Fixed with logo, section pills navigation, progress ring, user avatar
- **Section Pills:** Rounded-full badges showing progress percentage per section
- **Left Sidebar:** Exercise list with completion checkmarks, difficulty indicators, locked/unlocked states
- **Bottom Progress Bar:** Thin, animated XP bar spanning full width

### Exercise Interface
- **Exercise Card:** Rounded-xl white/dark card with shadow-lg
- **Prompt Panel:** Clear typography with code snippets inline using monospace
- **Code Editor:** Monaco Editor integration, dark theme always, line numbers, minimap for long code
- **Action Buttons:** Large rounded "Run Code" (primary blue), "Submit" (green), "Get Hint" (outline)
- **Result Panel:** Color-coded (green success, red error) with animated slide-in from bottom

### Gamification Elements
- **XP Bar:** Horizontal progress bar with glowing effect, level number badge
- **Streak Counter:** Fire icon with day count, pulse animation on increment
- **Achievement Cards:** Grid of rounded cards, grayscale when locked, colorful when unlocked
- **Leaderboard Table:** Alternating row backgrounds, user's row highlighted, rank badges
- **Level Up Modal:** Full-screen overlay with confetti animation, new badge reveal

### Dashboard Components
- **Stat Cards:** Grid of 4 cards showing total exercises, XP, streak, completion rate
- **Progress Charts:** Line chart (time spent per day), donut chart (completion by section), bar chart (exercises per difficulty)
- **Recent Activity:** Timeline-style list with icons and timestamps
- **Section Overview:** 4 large cards with circular progress indicators, exercise count, "Continue" buttons

### AI Assistant Panel
- **Chat Interface:** Message bubbles (user right, AI left), input field at bottom
- **Hint Cards:** Collapsible accordion with progressive hints (Hint 1, 2, 3)
- **Code Suggestions:** Syntax-highlighted code blocks within AI responses
- **Quick Actions:** Pill buttons for "Explain Error", "Show Solution", "Similar Examples"

## Animations & Interactions

**Use Sparingly:**
- **Micro-interactions:** Button hover scale (1.02), focus ring glow
- **Progress animations:** Smooth XP bar fill, confetti on level up
- **Transitions:** Panel slide-in/out (300ms ease-out), modal fade (200ms)
- **Success feedback:** Checkmark scale-in, green flash on correct answer
- **NO excessive scrolling animations or parallax**

## Images

**Hero Section (Dashboard):**
- Large illustrative graphic in the header showing Python code elements, abstract shapes, and learning theme
- Style: Modern, flat illustration with gradients matching brand colors
- Placement: Top right of dashboard, 40% width on desktop, full-width on mobile
- Alternative: 3D isometric illustration of coding workspace

**Achievement Badges:**
- Custom icon illustrations for each achievement (trophy, star, flame, code symbol)
- Glowing effects when unlocked
- Grayscale SVG filters when locked

**No Other Images Needed:** Interface relies on icons (Heroicons), charts (Chart.js), and code syntax highlighting for visual interest.

## Accessibility & Dark Mode

- **Consistent dark mode:** All inputs, textareas, modals maintain dark theme when active
- **Focus states:** Visible 2px ring with primary color
- **ARIA labels:** All interactive elements properly labeled
- **Keyboard navigation:** Tab order logical, escape key closes modals
- **Color contrast:** WCAG AA minimum (4.5:1 for text)
- **Code editor:** Always uses dark theme regardless of app mode for reduced eye strain

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (single column, bottom nav)
- Tablet: 768px - 1024px (2-panel, collapsible sidebar)
- Desktop: > 1024px (3-panel full layout)

**Mobile Optimizations:**
- Code editor: Full-screen modal when active
- AI assistant: Floating action button, slides up as drawer
- Charts: Simplified mobile versions, horizontal scroll if needed
- Exercise list: Swipeable cards instead of sidebar