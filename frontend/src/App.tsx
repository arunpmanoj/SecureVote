import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import AuthenticationPage from "./pages/AuthenticationPage";
import VoterIDVerificationPage from "./pages/VoterIDVerificationPage";
import VotingTimerWarningPage from "./pages/VotingTimerWarningPage";
import VotingPage from "./pages/VotingPage";
import PostVoteConfirmationPage from "./pages/PostVoteConfirmationPage";
import LiveResultsPage from "./pages/LiveResultsPage";
import DisqualificationPage from "./pages/DisqualificationPage";
import VotedUsersListPage from "./pages/VotedUsersListPage";
import OAuthSuccess from "./pages/OAuthSuccess";

export interface UserState {
  isAuthenticated: boolean;
  isVerified: boolean;
  hasVoted: boolean;
  isDisqualified: boolean;
  voterId?: string;
  votedCandidate?: string;
  voteTimestamp?: Date;
  userName?: string;
}

function App() {
  const [userState, setUserState] = useState<UserState>({
    isAuthenticated: false,
    isVerified: false,
    hasVoted: false,
    isDisqualified: false,
  });

  const [checkingSession, setCheckingSession] = useState(true);

  /* 🔐 CHECK BACKEND SESSION ON APP LOAD */
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("http://localhost:4000/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setCheckingSession(false);
          return;
        }

        const user = await res.json();

        setUserState({
          isAuthenticated: true,
          userName: user.name,
          isVerified: user.isVerified,
          hasVoted: user.hasVoted,
          isDisqualified: user.isDisqualified,
          voterId: user.voterId,
        });
      } catch {
        console.log("No active session");
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const updateUserState = (updates: Partial<UserState>) => {
    setUserState((prev) => ({ ...prev, ...updates }));
  };

  if (checkingSession) {
    return <div style={{ padding: 40 }}>Checking session...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/oauth-success"
          element={<OAuthSuccess updateUserState={updateUserState} />}
        />

        <Route
          path="/"
          element={
            userState.isAuthenticated ? (
              <Navigate to="/verify" replace />
            ) : (
              <AuthenticationPage />
            )
          }
        />

        <Route
          path="/verify"
          element={
            !userState.isAuthenticated ? (
              <Navigate to="/" replace />
            ) : userState.isVerified ? (
              userState.hasVoted ? (
                <Navigate to="/confirmation" replace />
              ) : (
                <Navigate to="/timer-warning" replace />
              )
            ) : (
              <VoterIDVerificationPage updateUserState={updateUserState} />
            )
          }
        />

        {/* ✅ UPDATED: pass userState */}
        <Route
          path="/timer-warning"
          element={
            !userState.isAuthenticated || !userState.isVerified ? (
              <Navigate to="/" replace />
            ) : userState.hasVoted ? (
              <Navigate to="/confirmation" replace />
            ) : (
              <VotingTimerWarningPage
                updateUserState={updateUserState}
                userState={userState}
              />
            )
          }
        />

        <Route
          path="/voting"
          element={
            !userState.isAuthenticated || !userState.isVerified ? (
              <Navigate to="/" replace />
            ) : userState.hasVoted ? (
              <Navigate to="/confirmation" replace />
            ) : userState.isDisqualified ? (
              <Navigate to="/disqualified" replace />
            ) : (
              <VotingPage
                userState={userState}
                updateUserState={updateUserState}
              />
            )
          }
        />

        <Route
          path="/confirmation"
          element={
            userState.hasVoted ? (
              <PostVoteConfirmationPage userState={userState} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route
          path="/results"
          element={<LiveResultsPage userState={userState} />}
        />

        <Route path="/disqualified" element={<DisqualificationPage />} />
        <Route path="/voted-users" element={<VotedUsersListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;