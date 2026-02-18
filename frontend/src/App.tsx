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
import { API_BASE_URL } from "./config";

/* =====================
   USER STATE TYPE
===================== */
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

/* =====================
   APP
===================== */
function App() {
  const [userState, setUserState] = useState<UserState>({
    isAuthenticated: false,
    isVerified: false,
    hasVoted: false,
    isDisqualified: false,
  });
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "GET",
        credentials: "include", // required for session cookies
      });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Clear frontend auth state
      setUserState({
        isAuthenticated: false,
        isVerified: false,
        hasVoted: false,
        isDisqualified: false,
        voterId: undefined,
        votedCandidate: undefined,
        voteTimestamp: undefined,
        userName: undefined,
      });

      // ✅ Redirect to HOME page
      window.location.href = "/";
    }
  };
  const [checkingSession, setCheckingSession] = useState(true);

  /* =====================
     🔐 CHECK SESSION
  ====================== */
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
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

          // THIS FIXES BLANK CONFIRMATION PAGE
          votedCandidate: user.votedCandidate || undefined,
        });
      } catch {
        console.log("No active session");
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  /* =====================
     STATE UPDATER
  ====================== */
  const updateUserState = (updates: Partial<UserState>) => {
    setUserState((prev) => ({ ...prev, ...updates }));
  };

  if (checkingSession) {
    return <div style={{ padding: 40 }}>Checking session...</div>;
  }

  /* =====================
     ROUTES
  ====================== */
  return (
    <BrowserRouter>
      <Routes>
        {/* OAuth */}
        <Route
          path="/oauth-success"
          element={<OAuthSuccess updateUserState={updateUserState} />}
        />
        {/* Login */}
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
        {/* Voter Verification */}
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
        {/* Timer Warning */}
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
        {/* Voting */}
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
        {/* Confirmation */}
        <Route
          path="/confirmation"
          element={
            userState.hasVoted ? (
              <PostVoteConfirmationPage
                userState={userState}
                onLogout={handleLogout} // 👈 pass logout here
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
         ̰
        {/* Results */}
        <Route
          path="/results"
          element={<LiveResultsPage userState={userState} />}
        />
        {/* Disqualified */}
        <Route path="/disqualified" element={<DisqualificationPage />} />
        {/* Admin */}
        <Route path="/voted-users" element={<VotedUsersListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
