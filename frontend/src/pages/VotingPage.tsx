import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import "./VotingPage.css";
import type { UserState } from "../App";

interface VotingPageProps {
  updateUserState: (updates: Partial<UserState>) => void;
  userState: UserState;
}

const CANDIDATES = [
  {
    id: "sarah-mitchell",
    name: "Sarah Mitchell",
    role: "Senior Product Manager",
    description:
      "Leading product innovation with 8+ years of experience in building scalable solutions.",
    photo: "👩‍💼",
  },
  {
    id: "james-chen",
    name: "James Chen",
    role: "Engineering Lead",
    description:
      "Passionate about building high-performance teams and delivering exceptional technical solutions.",
    photo: "👨‍💻",
  },
];

export default function VotingPage({
  updateUserState,
  userState,
}: VotingPageProps) {  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(
    null,
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  /* ⏱️ LOAD TIMER FROM BACKEND */useEffect(() => {
  const loadTimer = async () => {
    const res = await fetch("http://localhost:4000/api/voting-timer", {
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

    tick(); // initial render
    timerRef.current = window.setInterval(tick, 1000); // ✅ FIXED LINE
  };

  loadTimer();

  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, [navigate]);
  if (timeRemaining === null) return null;

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
     ✅ REAL VOTE SUBMIT
  ====================== */
  const handleConfirmVote = async () => {
    if (!selectedCandidate) return;

    setIsSubmitting(true);
    setShowConfirmModal(false);

    try {
      const res = await fetch("http://localhost:4000/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          candidateId: selectedCandidate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Voting failed");
        setIsSubmitting(false);
        return;
      }

      updateUserState({
        hasVoted: true,
        votedCandidate: selectedCandidate,
        voteTimestamp: new Date(),
      });

      navigate("/confirmation");
    } catch (err) {
      alert("Server error. Try again.");
      setIsSubmitting(false);
    }
  };

  const timerColor = getTimerColor();

  return (
    <div className="voting-page">
      <div className={`timer-bar timer-bar-${timerColor}`}>
        <div className="timer-bar-left">
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
      {/* 🔽 UI BELOW IS UNCHANGED */}
      {/* (rest of your JSX stays exactly the same) */}
      <div className="voting-content">
        {" "}
        <h1 className="voting-title">Vote for Your Team Candidate</h1>{" "}
        <div className="voting-instruction">
          {" "}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {" "}
            <circle cx="12" cy="12" r="10" />{" "}
            <line x1="12" y1="16" x2="12" y2="12" />{" "}
            <line x1="12" y1="8" x2="12.01" y2="8" />{" "}
          </svg>{" "}
          You can vote for only one candidate. This action cannot be
          changed.{" "}
        </div>{" "}
        <Card className="privacy-panel">
          {" "}
          <div className="privacy-panel-header">
            {" "}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {" "}
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />{" "}
            </svg>{" "}
            <div>
              {" "}
              <h3>Privacy-Preserving Verification</h3>{" "}
              <p>Zero-knowledge proof enabled</p>{" "}
            </div>{" "}
          </div>{" "}
          <div className="privacy-checklist">
            {" "}
            <div className="checklist-item">
              {" "}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {" "}
                <polyline points="20 6 9 17 4 12" />{" "}
              </svg>{" "}
              <span>Eligibility verified</span>{" "}
            </div>{" "}
            <div className="checklist-item">
              {" "}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {" "}
                <polyline points="20 6 9 17 4 12" />{" "}
              </svg>{" "}
              <span>One-person-one-vote enforced</span>{" "}
            </div>{" "}
            <div className="checklist-item">
              {" "}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {" "}
                <polyline points="20 6 9 17 4 12" />{" "}
              </svg>{" "}
              <span>Time-bound voting enforced</span>{" "}
            </div>{" "}
            <div className="checklist-item">
              {" "}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {" "}
                <line x1="18" y1="6" x2="6" y2="18" />{" "}
                <line x1="6" y1="6" x2="18" y2="18" />{" "}
              </svg>{" "}
              <span>No voter identity stored or displayed publicly</span>{" "}
            </div>{" "}
          </div>{" "}
          <p className="privacy-explanation">
            {" "}
            How it works: Your credentials are verified without revealing your
            identity. The system confirms you're eligible to vote without
            knowing who you are.{" "}
          </p>{" "}
        </Card>{" "}
        <div className="candidates-grid">
          {" "}
          {CANDIDATES.map((candidate) => (
            <Card
              key={candidate.id}
              className={`candidate-card ${selectedCandidate === candidate.id && isSubmitting ? "candidate-selected" : ""} ${isSubmitting ? "candidate-disabled" : ""}`}
            >
              {" "}
              <div className="candidate-photo">{candidate.photo}</div>{" "}
              <h3 className="candidate-name">{candidate.name}</h3>{" "}
              <p className="candidate-role">{candidate.role}</p>{" "}
              <p className="candidate-description">{candidate.description}</p>{" "}
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleVoteClick(candidate.id)}
                disabled={isSubmitting || timeRemaining === 0}
              >
                {" "}
                Vote{" "}
              </Button>{" "}
            </Card>
          ))}{" "}
        </div>{" "}
      </div>{" "}
      {" "}
      {/* Submission Overlay */}{" "}
      {isSubmitting && (
        <div className="submission-overlay">
          {" "}
          <div className="submission-spinner">
            {" "}
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {" "}
              <circle
                cx="12"
                cy="12"
                r="10"
                strokeDasharray="60"
                strokeDashoffset="30"
              >
                {" "}
                <animate
                  attributeName="stroke-dasharray"
                  values="0 60;60 0"
                  dur="1s"
                  repeatCount="indefinite"
                />{" "}
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;-60"
                  dur="1s"
                  repeatCount="indefinite"
                />{" "}
              </circle>{" "}
            </svg>{" "}
          </div>{" "}
          <p>Submitting your vote...</p>{" "}
        </div>
      )}
      {/* Vote Confirmation Modal */}
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
                {CANDIDATES.find((c) => c.id === selectedCandidate)?.name}
              </strong>
              ?
            </p>
            <p className="modal-warning">This action cannot be changed.</p>
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
