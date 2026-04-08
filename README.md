# Interactive Wall Calendar

A responsive, physical-style wall calendar application built with Next.js, React, and Tailwind CSS. The project deliberately avoids external date manipulation libraries (like date-fns or moment.js) in favor of the native JavaScript `Date` and `Intl` APIs to minimize bundle size and demonstrate core engineering fundamentals.

## How to Run Locally

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **View the application:**
   Open your browser and navigate to `http://localhost:3000` (or the port specified in your terminal if 3000 is occupied).

## Implementation Architecture & Choices

### 1. Separation of Concerns (Custom Hooks)
The business logic is cleanly separated from the UI components using three primary custom React hooks:
- **`useCalendar.ts`**: Handles core date math, generating the 42-day grid (6 weeks), processing overflow days from adjacent months, and managing month-to-month navigation.
- **`useRangeSelect.ts`**: Manages the selection state. Adapted a Shift+Click logic to allow users to either single-click a date flawlessly, or extend a range using shift.
- **`useNotes.ts`**: Handles CRUD operations and persistence of user notes via browser `localStorage`.

### 2. State Persistence
User notes are persisted entirely client-side using `localStorage`. This removes the need for a backend database during this phase while ensuring user data survives page refreshes.

### 3. Styling and Theming
- **Tailwind CSS**: Used for structural layout, responsiveness, and basic typography. A mobile-first approach ensures the calendar stacks vertically on small screens and expands to a side-by-side layout on desktop.
- **Custom CSS / Variables**: Found in `calendar.css`, custom CSS variables and pseudo-elements were used to create heavy visual styling like the spiral binding, wall hooks, and lined paper.
- **Animations**: Implemented via pure CSS keyframes (`transform` and `opacity`) to ensure smooth, hardware-accelerated performance without third-party animation libraries. This covers the page-flip transition, the staggered day-cell cascade, and note slide-ins.

### 4. Accessibility and UX
- Focus states and `aria-labels` are actively applied across the calendar components.
- Keyboard navigation is supported globally via `ArrowLeft` and `ArrowRight` event listeners to quickly traverse through months.
- Added `prefers-reduced-motion` fallbacks across all custom CSS animations to respect user system accessibility preferences.

### 5. Content Design
A comprehensive `HOLIDAYS` mapping object is embedded in the application covering Indian festivals and national holidays (2025-2027) dynamically rendering color-coded indicators when a date correlates with a holiday. Unsplash assets are statically mapped per-month to mimic the thematic imagery of a physical hanging calendar.
