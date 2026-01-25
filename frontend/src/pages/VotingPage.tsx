import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import "./VotingPage.css";
import type { UserState } from "../App";
import { API_BASE_URL } from "../config";

/* =====================
   TYPES
====================== */
interface VotingPageProps {
  updateUserState: (updates: Partial<UserState>) => void;
  userState: UserState;
}

interface Candidate {
  _id: string;
  name: string;
  party: string;
}

/* =====================
   COMPONENT
====================== */
export default function VotingPage({
  updateUserState,
  userState,
}: VotingPageProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null,
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCandidates, setLoadingCandidates] = useState(true);

  const navigate = useNavigate();
  const timerRef = useRef<number | null>(null);

  /* =====================
     ⏱️ LOAD VOTING TIMER
  ====================== */
  useEffect(() => {
    const loadTimer = async () => {
      const res = await fetch(`${API_BASE_URL}/api/voting-timer`, {
        credentials: "include",
      });

      if (!res.ok) {
        navigate("/timer-warning");
        return;
      }

      const data = await res.json();
      const endTime = new Date(data.votingEndsAt).getTime();

      const tick = () => {
        const diff = Math.floor((endTime - Date.now()) / 1000);

        if (diff <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          navigate("/timer-warning");
          return;
        }

        setTimeRemaining(diff);
      };

      tick();
      timerRef.current = window.setInterval(tick, 1000);
    };

    loadTimer();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [navigate]);

  /* =====================
     👥 LOAD CANDIDATES
  ====================== */
  useEffect(() => {
    const loadCandidates = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/candidates`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch candidates");
        }

        const data = await res.json();
        setCandidates(data);
      } catch (err) {
        alert("Failed to load candidates");
      } finally {
        setLoadingCandidates(false);
      }
    };

    loadCandidates();
  }, []);

  /* =====================
     GUARDS
  ====================== */
  if (timeRemaining === null) {
    return <div style={{ padding: 40 }}>Loading voting timer…</div>;
  }

  if (loadingCandidates) {
    return <div style={{ padding: 40 }}>Loading candidates…</div>;
  }

  /* =====================
     HELPERS
  ====================== */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (timeRemaining > 180) return "green";
    if (timeRemaining > 60) return "amber";
    return "red";
  };

  const handleVoteClick = (candidateId: string) => {
    setSelectedCandidate(candidateId);
    setShowConfirmModal(true);
  };

  /* =====================
     🗳️ SUBMIT VOTE
  ====================== */
  const handleConfirmVote = async () => {
    if (!selectedCandidate) return;

    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const res = await fetch(`${API_BASE_URL}/api/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ candidateId: selectedCandidate }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Voting failed");
        setIsSubmitting(false);
        return;
      }

      // ✅ SAVE STATE LOCALLY (BACKEND IS SOURCE OF TRUTH)
      updateUserState({
        hasVoted: true,
        votedCandidate: selectedCandidate,
        voteTimestamp: new Date(),
      });

      navigate("/confirmation");
    } catch {
      alert("Server error. Try again.");
      setIsSubmitting(false);
    }
  };

  const timerColor = getTimerColor();

  /* =====================
     UI
  ====================== */
  return (
    <div className="voting-page">
      <div className={`timer-bar timer-bar-${timerColor}`}>
        <div className="timer-bar-left">
          <div>
            <div className="timer-bar-label">Time Remaining</div>
            <div className="timer-bar-subtitle">
              Complete your vote within the time limit
            </div>
          </div>
        </div>
        <div className="timer-bar-countdown">{formatTime(timeRemaining)}</div>
      </div>

      {timeRemaining <= 60 && (
        <div className="timer-warning-banner">
          ⏰ Less than 1 minute remaining!
        </div>
      )}

      <div className="voting-content">
        <h1 className="voting-title">Vote for Your Team Candidate</h1>

        <div className="candidates-grid">
          {candidates.map((candidate) => (
            <Card
              key={candidate._id}
              className={`candidate-card ${
                selectedCandidate === candidate._id && isSubmitting
                  ? "candidate-selected"
                  : ""
              } ${isSubmitting ? "candidate-disabled" : ""}`}
            >
              <h3 className="candidate-name">{candidate.name}</h3>
              <p className="candidate-role">{candidate.party}</p>

              <Button
                variant="primary"
                fullWidth
                onClick={() => handleVoteClick(candidate._id)}
                disabled={isSubmitting || timeRemaining === 0}
              >
                Vote
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {showConfirmModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowConfirmModal(false)}
        >
          <Card className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Confirm Your Vote</h2>
            <p className="modal-message">
              Are you sure you want to vote for{" "}
              <strong>
                {candidates.find((c) => c._id === selectedCandidate)?.name}
              </strong>
              ?
            </p>
            <div className="modal-actions">
              <Button
                variant="secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={handleConfirmVote}>
                Confirm Vote
              </Button>
            </div>
          </Card>
        </div>
      )}

      {isSubmitting && (
        <div className="submission-overlay">
          <p>Submitting your vote...</p>
        </div>
      )}
    </div>
  );
}
