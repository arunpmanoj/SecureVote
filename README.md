# SecureVote – Privacy-First Online Voting Platform

## 📋 Overview

SecureVote is a full-stack, privacy-first online voting platform built as an internship-level production MVP. The system allows authenticated users to vote exactly once within a strict time window after verification, ensuring fairness, security, and integrity.

The application uses OAuth authentication, session-based security, MongoDB persistence, and time-bound voting logic enforced on both frontend and backend.

**Target Audience:** Internship reviewers, hiring managers, technical evaluators.

## 🛠️ Tech Stack

### Frontend
- **React** (Vite)
- **TypeScript**
- **React Router**
- **Fetch API**
- **CSS Modules**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Passport.js** (Google & LinkedIn OAuth)
- **express-session**

### Database
- **MongoDB** (Atlas compatible)

## ✨ Key Features

- Google & LinkedIn OAuth authentication
- Session-based login persistence
- One-time voter verification using Voter ID
- Strict 5-minute voting window per user
- Automatic timer reset if voting window expires
- One-person-one-vote enforcement
- Server-side vote validation (anti-cheating)
- Candidate data stored in database
- Real-time vote count persistence
- Post-vote confirmation screen
- Live results page
- Fully protected routes
- Clean separation of frontend and backend

## 📁 Project Structure

```
voting/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components (Button, Card, Input)
│   │   ├── pages/          # Page components (Authentication, Voting, Results, etc.)
│   │   └── main.tsx        # App entry point with routing setup
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── config/         # Database and Passport configuration
│   │   ├── controllers/    # Business logic for auth, users, votes
│   │   ├── middleware/     # Authentication and authorization middleware
│   │   ├── models/         # Mongoose schemas (User, Vote)
│   │   ├── routes/         # API endpoints (auth, voting, etc.)
│   │   └── scripts/        # Database seeding scripts
│   ├── package.json
│   └── server.js           # Express server entry point
└── README.md
```

### Frontend Details
- **src/pages/**: Contains page-level components for different application states (login, voting, results).
- **src/components/**: Modular UI components with CSS Modules for styling.
- **Routing**: Handled via React Router for client-side navigation.

### Backend Details
- **src/routes/**: RESTful API endpoints for authentication, voting, and data retrieval.
- **src/models/**: Mongoose models defining data structures and relationships.
- **src/config/**: Configuration for database connection and OAuth providers.
- **OAuth Setup**: Passport.js strategies for Google and LinkedIn authentication.
- **Session Handling**: express-session for maintaining user sessions securely.

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Clone the Repository
```bash
git clone https://github.com/your-username/securevote.git
cd securevote
```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend root and configure environment variables (see Environment Variables section).

4. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000` (or your configured PORT).

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend root and configure environment variables (see Environment Variables section).

4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (Vite default).

## 🔧 Environment Variables

### Backend (.env)
Create a `.env` file in the `backend/` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/securevote  # Or your MongoDB Atlas URI
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
SESSION_SECRET=your_secure_random_session_secret
```

### Frontend (.env)
Create a `.env` file in the `frontend/` directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

**Note:** Replace placeholder values with actual credentials from your OAuth providers and generate a secure session secret.

## 🔄 Usage Flow

1. **User Authentication**: User logs in via Google or LinkedIn OAuth, creating a secure session.
2. **Session Creation**: Backend establishes a session with user data persistence.
3. **Voter ID Verification**: User enters their Voter ID for one-time verification.
4. **Timer Warning**: System displays a warning about the upcoming 5-minute voting window.
5. **Voting Page**: User sees candidates and a countdown timer; votes within the time limit.
6. **Vote Submission**: Vote is validated server-side and recorded in MongoDB.
7. **Confirmation**: User receives a confirmation screen after successful voting.
8. **Results**: Access to live results page showing real-time vote counts.

## 🔒 Security Considerations

- **Session-Based Authentication**: Uses express-session for secure, server-side session management.
- **Backend-Enforced Rules**: All voting logic and validation occurs server-side to prevent client-side manipulation.
- **Time-Bound Voting**: Strict 5-minute windows prevent prolonged exposure and ensure fairness.
- **No Client-Side Trust**: Frontend handles UI only; all critical operations are validated on the backend.
- **Database Constraints**: MongoDB schemas enforce data integrity and prevent duplicate votes.
<!-- 
## 📸 Screenshots

- Login page
- Voter ID verification
- Voting interface with timer
- Results page -->

## 🔮 Future Improvements

- **Admin Dashboard**: Interface for election administrators to manage candidates and monitor voting.
- **Result Export**: Functionality to export voting results in various formats (PDF, CSV).
- **Audit Logs**: Comprehensive logging of all voting activities for transparency.
- **Rate Limiting**: Implement API rate limiting to prevent abuse.
- **WebSocket Live Results**: Real-time updates using WebSockets for instant result visibility.
- **Role-Based Access**: Different permission levels for voters, admins, and observers.

---

*Built with security, integrity, and user privacy as core principles.*