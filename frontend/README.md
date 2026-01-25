# Secure Online Voting Platform

A modern, secure, privacy-first web application UI for an online voting platform. This application strongly enforces fairness, urgency, and privacy through UI states, timers, and irreversible actions.

## Features

- **Authentication**: OAuth with Google/LinkedIn or email/password
- **Voter ID Verification**: One-time verification before voting
- **Time-Bound Voting**: Strict 5-minute timer for voting
- **One-Person-One-Vote**: Enforced through verification and UI states
- **Privacy-First**: Zero-knowledge proof concepts, no identity leaks
- **Live Results**: Real-time vote counts and trend analysis
- **Audit Trail**: Private vote confirmation visible only to the voter

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **Recharts** for data visualization
- **CSS Modules** for styling

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Application Flow

1. **Authentication Page**: Users sign in via OAuth or email/password
2. **Voter ID Verification**: One-time verification of voter eligibility
3. **Timer Warning**: Explicit warning about the 5-minute voting window
4. **Voting Page**: Active timer with candidate selection
5. **Vote Confirmation**: Modal to prevent accidental votes
6. **Post-Vote Confirmation**: Private audit trail and success message
7. **Live Results**: Real-time vote counts and trend graphs

## Design System

- **Font**: Inter (with Poppins fallback)
- **Colors**:
  - Primary: Indigo/Blue (#4f46e5)
  - Success: Green (#10b981)
  - Warning: Amber (#f59e0b)
  - Danger: Red (#ef4444)
  - Neutral: Soft gray backgrounds (#f3f4f6)
- **Spacing**: 8px base unit
- **Components**: Card-based UI with subtle shadows, rounded buttons

## Core UX Principles

- One-person-one-vote enforcement
- Strong visual emphasis on time-bound voting
- Prevent delayed or coordinated voting
- Absolute clarity that voting is final
- Privacy-preserving design (no identity leaks)
- Professional, neutral, and unbiased UI

## State Management

The application uses React state and localStorage to persist user state across sessions. State includes:
- Authentication status
- Verification status
- Vote status
- Disqualification status
- Voter ID and vote details

## Notes

- This is a UI prototype for demonstration purposes
- OAuth flows are simulated (no actual authentication)
- Vote data is simulated and resets on page refresh
- Timer logic is client-side only
