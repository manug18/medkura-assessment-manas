# Task 1: Medical Dashboard - Patient Case Management

A modern, responsive React + TypeScript healthcare dashboard for managing patient cases and medical workflows. Built with Vite, Tailwind CSS, and designed for optimal user experience in medical settings.

## 📋 Project Overview

This dashboard displays comprehensive patient case information including:
- Patient demographics and case details
- Multi-stage medical process tracking
- Real-time notification and event timeline
- Urgency status management
- Interactive UI with dynamic state management
- Responsive design for desktop and mobile devices

## ✨ Features

- **Patient Case Card**: Displays detailed patient information with case ID, condition, and current stage
- **Progress Stepper**: Visual representation of multi-stage medical processes (consultation → lab work → pre-approval → surgery → post-op)
- **Status Badge**: Dynamic urgency indicators (Normal, Attention, Urgent) with color-coded styling
- **Notification Panel**: Timeline view of patient events with type indicators (info, alert, success)
- **Responsive Layout**: Works seamlessly across desktop, tablet, and mobile devices
- **Interactive Controls**: Toggle urgency levels and interact with patient data
- **Type-Safe Development**: Full TypeScript support for safer code and better IDE experience

## 🛠️ Technology Stack

- **React 19**: Modern UI library with hooks
- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite 7**: Fast build tool and development server
- **Tailwind CSS 4**: Utility-first CSS framework with PostCSS integration
- **ESLint**: Code quality and consistency checks
- **React Hooks**: State management (useState)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Steps

1. **Navigate to the project directory**:
   ```bash
   cd task1-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Tailwind CSS (if needed)**:
   ```bash
   npm install @tailwindcss/postcss
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 🚀 Available Scripts

- `npm run dev` - Start development server with hot module replacement (HMR)
- `npm run build` - Compile TypeScript and build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 📂 Project Structure

```
task1-dashboard/
├── src/
│   ├── components/
│   │   ├── PatientCaseCard.tsx      # Main patient case display component
│   │   ├── NotificationPanel.tsx    # Event timeline and notifications
│   │   ├── ProgressStepper.tsx      # Multi-stage progress indicator
│   │   └── StatusBadge.tsx          # Urgency status display badge
│   ├── constants/
│   │   └── stages.ts                # Stage definitions and labels
│   ├── data/
│   │   └── mockCase.ts              # Mock patient data for development
│   ├── types/
│   │   ├── patient.ts               # Patient case interfaces and types
│   │   └── stages.ts                # Stage-related type definitions
│   ├── App.tsx                      # Main application component
│   ├── App.css                      # Application styles
│   ├── main.tsx                     # React DOM render entry point
│   └── index.css                    # Global styles
├── public/                          # Static assets
├── index.html                       # HTML entry point
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
├── tsconfig.json                    # TypeScript configuration
├── eslint.config.js                 # ESLint rules configuration
└── package.json                     # Project dependencies
```

## 🧩 Components Overview

### PatientCaseCard
Main container displaying complete patient case information:
- Patient name, age, and condition
- Case ID and urgency status
- Interactive urgency toggle button
- Stage progress indicator
- Current and next actions

**Props**:
```typescript
interface Props {
  data: PatientCase;
  onToggleUrgency: () => void;
}
```

### ProgressStepper
Visual indicator showing progress through medical stages:
- 5-stage pipeline: Consultation → Lab → Pre-Approval → Surgery → Post-Op
- Highlights current stage
- Shows completion status for past stages

**Props**:
```typescript
interface Props {
  currentStage: number;
}
```

### StatusBadge
Visual urgency indicator with color coding:
- **Normal**: Gray styling
- **Attention**: Yellow/amber styling
- **Urgent**: Red styling

**Props**:
```typescript
interface Props {
  urgency: 'normal' | 'attention' | 'urgent';
}
```

### NotificationPanel
Timeline view of patient events:
- Chronological event display (newest first)
- Event type indicators: info (blue), alert (red), success (green)
- Relative timestamps ("2 hours ago", "Yesterday", etc.)

**Props**:
```typescript
interface Props {
  events: TimelineEvent[];
}
```

## 📊 Data Types

### PatientCase
```typescript
interface PatientCase {
  id: string;                          // Unique case identifier
  patientName: string;                 // Full name of patient
  age: number;                         // Patient age in years
  condition: string;                   // Medical condition
  currentStage: number;                // Current process stage (1-5)
  urgency: 'normal' | 'attention' | 'urgent';  // Urgency level
  representative: {
    name: string;                      // Representative name
    phone: string;                     // Contact phone number
  };
  nextAction: string;                  // Next required action
  events: TimelineEvent[];             // Array of historical events
}
```

### TimelineEvent
```typescript
interface TimelineEvent {
  timestamp: string;                   // Event timestamp
  description: string;                 // Event details
  type: 'info' | 'alert' | 'success';  // Event type for styling
}
```

## 🎨 Styling

The project uses Tailwind CSS v4 with:
- Gradient backgrounds (blue to slate)
- Rounded corners and shadows for depth
- Responsive grid layout (1 column mobile, 3 columns desktop)
- Color-coded status indicators
- Custom spacing and typography

## 🔧 Development Workflow

1. **Development Mode**: Use `npm run dev` for instant reload on file changes
2. **Type Checking**: TypeScript errors appear in console and editor
3. **Linting**: Run `npm run lint` to check code quality
4. **Building**: Use `npm run build` before deploying to production

## 📱 Browser Support

- Modern browsers supporting ES2020+ JavaScript
- Chrome, Firefox, Safari, Edge (latest versions recommended)
- Mobile browsers on iOS and Android

## � Running Locally - Complete Guide

### Full Setup from Scratch

```bash
# 1. Clone/navigate to workspace
cd /Users/manasgoyal/medkura-assessment-manas/task1-dashboard

# 2. Install all dependencies
npm install

# 3. Install Tailwind CSS v4 (required for styling)
npm install @tailwindcss/postcss autoprefixer postcss tailwindcss

# 4. Verify installation
npm list tailwindcss @tailwindcss/postcss

# 5. Start development server
npm run dev

# 6. Open browser to http://localhost:5173
```

### Development Workflow

1. **File watching**: Changes to `.tsx`, `.ts`, `.css` files trigger hot reload
2. **Type checking**: TypeScript errors displayed in terminal and VS Code
3. **Console access**: Open browser DevTools to see logs/errors
4. **Build testing**: Run `npm run build && npm run preview` to test production build

### Environment Notes

- Single Node.js instance runs the Vite dev server
- No backend API dependency - uses mock data
- Tailwind CSS processes on-demand during development
- HMR (Hot Module Replacement) maintains component state while editing

---

## 💡 Design Decisions

### 1. **Component Architecture**
- **Decision**: Split UI into small, focused components (PatientCaseCard, StatusBadge, ProgressStepper, NotificationPanel)
- **Why**: Single Responsibility Principle improves maintainability, reusability, and testability. Each component handles one concern.

### 2. **TypeScript for Type Safety**
- **Decision**: Use TypeScript interfaces for all data structures
- **Why**: Prevents runtime errors, provides IDE autocomplete, clarifies data contracts between components, improves code documentation.

### 3. **Tailwind CSS over Custom CSS**
- **Decision**: Utility-first CSS framework instead of writing CSS files
- **Why**: Faster styling, reduced CSS bloat, consistent design system, responsive design easier to implement.

### 4. **Mock Data in App**
- **Decision**: Static mock data in `App.tsx` rather than fetching from API
- **Why**: Focuses on frontend UI/UX without backend dependency, allows independent development and testing.

### 5. **React Hooks (useState)**
- **Decision**: Use functional components with hooks for state management
- **Why**: Modern React approach, simpler than class components, easier to test and debug.

### 6. **Responsive Grid Layout**
- **Decision**: 1-column mobile → 3-column desktop with CSS Grid
- **Why**: Ensures usability across all devices, medical dashboards need mobile access in clinical settings.

### 7. **Vite as Build Tool**
- **Decision**: Vite instead of Create React App
- **Why**: Faster development server (HMR is instant), faster builds, smaller bundle size, better DX.

---

## ⏳ Future Improvements (With More Time)

### 1. **Backend Integration**
- Connect to Task 2 API to fetch real patient data
- Implement authentication/authorization
- Add real database persistence

### 2. **State Management**
- Implement Context API or Zustand for global state
- Add patient data caching
- Implement optimistic updates for better UX

### 3. **Enhanced Features**
- Real-time notifications using WebSockets
- Document upload/preview functionality
- Calendar view for appointment scheduling
- Patient search and filtering
- Bulk actions on multiple cases

### 4. **Testing**
- Add unit tests with Vitest/Jest
- Component snapshot testing
- E2E testing with Playwright/Cypress
- Accessibility testing with axe-core

### 5. **Performance Optimizations**
- Code splitting and lazy loading
- Image optimization
- Memoization for expensive computations
- Virtual scrolling for large lists

### 6. **Accessibility & UX**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader optimization
- Dark mode support

### 7. **Deployment**
- CI/CD pipeline (GitHub Actions, GitLab CI)
- Docker containerization
- Environment configuration management
- Analytics integration

---

## 📝 Assumptions Made

### 1. **Data Structure**
- Assumed `currentStage` is a number from 1-5 corresponding to the stage pipeline
- Assumed urgency has exactly 3 states: "normal", "attention", "urgent"
- Assumed events array is always ordered with newest events first

### 2. **Component Usage**
- Assumed `PatientCaseCard` component receives complete patient data; no partial data loading
- Assumed urgency toggle cycles through fixed states (normal → attention → urgent → normal)
- Assumed `nextAction` is a short text string, not a complex object

### 3. **UI/UX**
- Assumed medical dashboards prioritize information density over whitespace
- Assumed users access from various devices (mobile clinic visits, desktop office use)
- Assumed color-coding for urgency is sufficient (no additional icons needed)

### 4. **Performance**
- Assumed patient data is relatively small (< 50 KB per case)
- Assumed number of concurrent users is manageable (not a high-traffic application)
- Assumed dashboard refreshes are manual (user-triggered) rather than auto-refresh

### 5. **Dependencies**
- Assumed Node.js v18+ is available
- Assumed npm is used (not yarn or pnpm)
- Assumed modern browser with ES2020 support

### 6. **Medical Domain**
- Assumed 5-stage process flow is standard (consultation → lab → pre-approval → surgery → post-op)
- Assumed patient representative is required (has name and phone)
- Assumed case IDs follow format: "MK-YYYY-###" (MedKura prefix)

### 7. **Security**
- Assumed this is an internal/authenticated application (not public-facing)
- Assumed data shown is already authorized for current user
- Assumed no sensitive data encryption needed at frontend level

---

## �🚨 Troubleshooting

### Module Not Found Error
If you see `Cannot find module './components/...'`:
- Ensure the component file exists in `src/components/`
- Check file name matches the import statement exactly
- Verify the file has default or named export

### Tailwind CSS Not Styling
- Run `npm install @tailwindcss/postcss`
- Ensure `index.css` imports Tailwind directives
- Check `tailwind.config.js` scans correct template files

### Port Already in Use
- Change the port in `vite.config.ts` or run: `npm run dev -- --port 3000`

## 📚 Learn More

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📝 License

ISC License - See LICENSE file for details

## 👨‍💻 Author

Medical Dashboard Assessment - Task 1
