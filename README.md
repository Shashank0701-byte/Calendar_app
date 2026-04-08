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
- **Skeuomorphic Micro-Interactions**: To push the tactile feel of an offline wall calendar, several complex animations are crafted via pure CSS without using heavy animation UI libraries (like Framer Motion):
  - **Dynamic 3D Parallax Tracking**: The entire calendar tracks the user's cursor (`clientX / clientY`) by injecting normalized coordinates into native CSS variables. The DOM utilizes these variables to recalculate `transform: perspective(...)` and `box-shadow`, giving a lifelike 3D tilt without triggering expensive React frame re-renders across the grid elements.
  - **Hand-Drawn SVG Markers**: Active notes and dates receive red circle markers dynamically. Using `svg` properties (`stroke-dasharray`, `stroke-dashoffset`), the marker simulates being fully hand-drawn in real-time, and erases backwards conditionally when removed.
  - **Physics-Based UI Deletions**: Deleting a note collapses the digital card inwards along scaled axes (`scaleX/Y` and `rotate`) to mimic crumpled paper, translating rapidly down to intersect with a dynamically rendered pop-up dustbin. 
  - **3D Page Peel & Stagger**: Directional navigation (next/prev month) triggers unique `rotateX` CSS keyframes mimicking a page peeling back or flipping up, paired with a custom `stagger-delay` inline CSS cascade fading in day cells instantly.

### 4. Accessibility and UX
- **Responsive Date Range Selection**: The application natively supports multi-day range selection using tailored device physics. On desktop, users can utilize standard `Shift+Click` mechanics to extend a selection. On mobile touch interfaces (where shift keys don't exist), this is handled via a dedicated `onTouchStart/End` custom event hook that listens for a 500ms **Long-Press** on a given date to seamlessly extend the range, matching native OS expectations.
- Focus states and `aria-labels` are actively applied across the calendar components.
- Keyboard navigation is supported globally via `ArrowLeft` and `ArrowRight` event listeners to quickly traverse through months.
- Added `prefers-reduced-motion` fallbacks across all custom CSS animations to respect user system accessibility preferences.

### 5. Content Design
A comprehensive `HOLIDAYS` mapping object is embedded in the application covering Indian festivals and national holidays (2025-2027) dynamically rendering color-coded indicators when a date correlates with a holiday. Unsplash assets are statically mapped per-month to mimic the thematic imagery of a physical hanging calendar.
