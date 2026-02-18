import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import "./PostVoteConfirmationPage.css";
import type { UserState } from "../App";
import { API_BASE_URL } from "../config";
// using a small inline SVG for logout to avoid a problematic lucide-react import
/* =====================
   TYPES
===================== */
interface PostVoteConfirmationPageProps {
  userState: UserState;
  onLogout: () => void; // 👈 added
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
  onLogout, // 👈 receive here
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
          `${API_BASE_URL}/api/candidates/${votedCandidateId}`,
          { credentials: "include" },
        );

        if (!res.ok) {
          throw new Error("Candidate not found");
        }

        const data = await res.json();
        setCandidate(data);
      } catch {
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
  if (loading) return <div style={{ padding: 40 }}>Loading confirmation…</div>;
  if (error) return <div style={{ padding: 40 }}>{error}</div>;
  if (!candidate)
    return <div style={{ padding: 40 }}>No candidate data available.</div>;

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

          {/* 🔴 LOGOUT BUTTON */}
          <div className="confirmation-actions">
            {/* 🔴 LOGOUT BUTTON WITH RED ICON */}
            <div style={{ marginTop: 12 }}>
              <Button
                variant="secondary"
                fullWidth
                onClick={onLogout}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M16 17L21 12L16 7" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 12H9" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
                className="logout-danger"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
