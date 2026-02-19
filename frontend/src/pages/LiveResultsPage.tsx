import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Card from "../components/Card";
import "./LiveResultsPage.css";
import type { UserState } from "../App";
import { useNavigate } from "react-router-dom";

interface LiveResultsPageProps {
  userState: UserState;
}

interface Candidate {
  _id: string;
  name: string;
  party: string;
  voteCount: number;
}

export default function LiveResultsPage({ userState }: LiveResultsPageProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [graphData, setGraphData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<"recent" | "full">("recent");

  const navigate = useNavigate(); // ✅ must be inside component

  /* =====================
     🔗 LOAD LIVE RESULTS
  ====================== */
  useEffect(() => {
    const loadResults = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/candidates`, {
          credentials: "include",
        });

        const data = await res.json();
        setCandidates(data);

        // Build simple trend snapshot (no DB schema change)
        setGraphData((prev) => [
          ...prev.slice(-20),
          {
            time: new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
            ...data.reduce((acc: any, c: Candidate) => {
              acc[c.name] = c.voteCount;
              return acc;
            }, {}),
          },
        ]);
      } catch {
        console.error("Failed to load results");
      }
    };

    loadResults();
    const interval = setInterval(loadResults, 5000);

    return () => clearInterval(interval);
  }, []);

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

  return (
    <div className="results-page">
      <div className="results-header">
        <div>
          <h1 className="results-title">Team Voting Platform</h1>
          <p className="results-welcome">
            Welcome, {userState.userName || "Voter"}
          </p>
        </div>
      </div>

      {userState.hasVoted && (
        <div className="results-success-banner">
          <strong>Your vote has been successfully submitted.</strong>
        </div>
      )}

      {/* 🔗 REDIRECT CARD */}
      <Card
        className="results-redirect-card"
        onClick={() => navigate("/voted-users")}
        style={{ cursor: "pointer", marginBottom: 16 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>View Voted Users</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              See the list of participants who have already voted
            </p>
          </div>
          <span style={{ fontSize: 18 }}>→</span>
        </div>
      </Card>

      <div className="results-content">
        <div className="results-section">
          <h2 className="results-section-title">Live Voting Results</h2>

          <div className="results-cards">
            {candidates.map((c) => {
              const percent =
                totalVotes > 0 ? (c.voteCount / totalVotes) * 100 : 0;

              return (
                <Card key={c._id} className="result-card">
                  <div className="result-card-header">
                    <div>
                      <div className="result-candidate-name">
                        {c.name}
                        {userState.votedCandidate === c._id && (
                          <span className="result-badge result-badge-voted">
                            Your Vote
                          </span>
                        )}
                      </div>
                      <div className="result-candidate-role">{c.party}</div>
                    </div>
                    <div className="result-vote-count">{c.voteCount} votes</div>
                  </div>

                  <div className="result-progress">
                    <div
                      className="result-progress-bar"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="result-percentage">{percent.toFixed(1)}%</div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* GRAPH */}
        <div className="results-section">
          <h2 className="results-section-title">Vote Trend Analysis</h2>

          <Card className="graph-card">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                {candidates.map((c) => (
                  <Line
                    key={c._id}
                    type="monotone"
                    dataKey={c.name}
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}