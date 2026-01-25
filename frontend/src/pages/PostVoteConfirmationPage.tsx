import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import "./PostVoteConfirmationPage.css";
import type { UserState } from "../App";

/* =====================
   TYPES
===================== */
interface PostVoteConfirmationPageProps {
  userState: UserState;
}

interface Candidate {
  _id: string;
  name: string;
  party: string;
}

/* =====================
   COMPONENT
===================== */
export default function PostVoteConfirmationPage({
  userState,
}: PostVoteConfirmationPageProps) {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =====================
     🔗 LOAD VOTED CANDIDATE
  ====================== */
  useEffect(() => {
    const votedCandidateId = userState.votedCandidate;

    if (!votedCandidateId) {
      setError("No vote found for this user.");
      setLoading(false);
      return;
    }

    const loadCandidate = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/candidates/${votedCandidateId}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error("Candidate not found");
        }

        const data = await res.json();
        setCandidate(data);
      } catch (err) {
        setError("Unable to load vote details.");
      } finally {
        setLoading(false);
      }
    };

    loadCandidate();
  }, [userState.votedCandidate]);

  /* =====================
     STATES
  ====================== */
  if (loading) {
    return <div style={{ padding: 40 }}>Loading confirmation…</div>;
  }

  if (error) {
    return <div style={{ padding: 40 }}>{error}</div>;
  }

  if (!candidate) {
    return <div style={{ padding: 40 }}>No candidate data available.</div>;
  }

  /* =====================
     UI
  ====================== */
  return (
    <div className="confirmation-page">
      <div className="confirmation-success-banner">
        ✅ Vote submitted for <strong>{candidate.name}</strong>!
      </div>

      <Card className="confirmation-card">
        <h1 className="confirmation-title">Vote Submitted Successfully</h1>

        <div className="audit-field">
          <label>Voted Candidate</label>
          <div className="candidate-name">{candidate.name}</div>
          <div className="candidate-role">{candidate.party}</div>
        </div>

        <div className="confirmation-actions">
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate("/results")}
          >
            View Results
          </Button>
        </div>
      </Card>
    </div>
  );
}