import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import "./VotingTimerWarningPage.css";
import type { UserState } from "../App";
import { API_BASE_URL } from "../config";

interface VotingTimerWarningPageProps {
  updateUserState: (updates: Partial<UserState>) => void;
  userState: UserState; // ✅ ADD THIS
}

export default function VotingTimerWarningPage({
  updateUserState,
  userState,
}: VotingTimerWarningPageProps) {
  const navigate = useNavigate();
  const handleProceed = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/start-voting`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Unable to start voting");
        return;
      }

      // ✅ ALWAYS update state
      updateUserState({
        voteTimestamp: new Date(data.votingStartedAt),
        isDisqualified: false, // 🔥 IMPORTANT
      });

      navigate("/voting");
    } catch {
      alert("Server error. Please try again.");
    }
  };
  return (
    <div className="timer-warning-page">
      <div className="timer-warning-header">
        <div className="timer-warning-icon">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h1 className="timer-warning-title">Time-Bound Voting</h1>
        <p className="timer-warning-subtitle">
          Welcome, {userState.userName || "Voter"}
        </p>
          {" "}
      </div>

      <Card className="timer-warning-card warning-card">
        <div className="warning-header">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <div>
            <h2>Important: Voting Window</h2>
            <p>Please read carefully before proceeding</p>
          </div>
        </div>
      </Card>

      <Card className="timer-warning-card timer-display-card">
        <p className="timer-intro">You will have</p>
        <div className="timer-large">5:00</div>
        <p className="timer-label">minutes to cast your vote</p>
      </Card>

      <Card className="timer-warning-card disqualification-warning">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <p>
          If the timer expires, you will be disqualified from voting. This rule
          ensures fairness and prevents delayed or coordinated voting
          strategies. Once you proceed, the timer will start immediately.
        </p>
      </Card>

      <Card className="timer-warning-card rules-card">
        <h3>Voting Rules:</h3>
        <ul className="rules-list">
          <li>Timer starts as soon as you click 'Proceed to Voting'</li>
          <li>You must complete your vote within 5 minutes</li>
          <li>
            You can vote only once - your choice is final and cannot be changed
          </li>
          <li>The timer will be visible at all times during voting</li>
        </ul>
      </Card>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleProceed}
        icon={
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
        className="proceed-button"
      >
        Proceed to Voting (Timer Will Start)
      </Button>
    </div>
  );
}
