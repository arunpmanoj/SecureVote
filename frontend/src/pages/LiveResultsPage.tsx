import { useState, useEffect } from "react";
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

interface LiveResultsPageProps {
  userState: UserState;
}

const CANDIDATES = [
  {
    id: "sarah-mitchell",
    name: "Sarah Mitchell",
    role: "Senior Product Manager",
    photo: "👩‍💼",
    color: "#10b981",
  },
  {
    id: "james-chen",
    name: "James Chen",
    role: "Engineering Lead",
    photo: "👨‍💻",
    color: "#4f46e5",
  },
];

// Simulate vote data over time
const generateVoteData = (minutes: number) => {
  const data = [];
  const startTime = new Date();
  startTime.setMinutes(startTime.getMinutes() - minutes);

  for (let i = 0; i <= minutes; i++) {
    const time = new Date(startTime);
    time.setMinutes(time.getMinutes() + i);
    data.push({
      time: time.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      "Sarah Mitchell": Math.floor(Math.random() * 10) + i * 0.5,
      "James Chen": Math.floor(Math.random() * 5) + i * 0.2,
    });
  }
  return data;
};

export default function LiveResultsPage({ userState }: LiveResultsPageProps) {
  const [votes, setVotes] = useState({ sarah: 3, james: 1 });
  const [timeRange, setTimeRange] = useState<"recent" | "full">("recent");
  const [graphData, setGraphData] = useState(generateVoteData(10));

  useEffect(() => {
    // Simulate auto-updating results
    const interval = setInterval(() => {
      setVotes((prev) => ({
        sarah: prev.sarah + (Math.random() > 0.7 ? 1 : 0),
        james: prev.james + (Math.random() > 0.8 ? 1 : 0),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeRange === "recent") {
      setGraphData(generateVoteData(10));
    } else {
      setGraphData(generateVoteData(60));
    }
  }, [timeRange]);

  const totalVotes = votes.sarah + votes.james;
  const sarahPercentage = totalVotes > 0 ? (votes.sarah / totalVotes) * 100 : 0;
  const jamesPercentage = totalVotes > 0 ? (votes.james / totalVotes) * 100 : 0;

  const votedCandidate = userState.votedCandidate;

  return (
    <div className="results-page">
      <div className="results-header">
        <div>
          <h1 className="results-title">Team Voting Platform</h1>
          <p className="results-welcome">
            Welcome, {userState.userName || "Voter"}
          </p>
           {" "}
        </div>
        <a
          href="#"
          className="results-signout"
          onClick={(e) => {
            e.preventDefault();
            localStorage.removeItem("votingAppState");
            window.location.href = "/";
          }}
        >
          Sign out
        </a>
      </div>

      {userState.hasVoted && (
        <div className="results-success-banner">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div>
            <strong>Your vote has been successfully submitted.</strong>
            <span>
              Thank you for participating. You can now view the voting results
              below.
            </span>
          </div>
        </div>
      )}

      <div className="results-content">
        <div className="results-section">
          <div className="results-section-header">
            <h2 className="results-section-title">Live Voting Results</h2>
            <div className="auto-update-indicator">
              <div className="auto-update-dot"></div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              <span>Auto-updating</span>
            </div>
          </div>

          <div className="results-cards">
            <Card
              className={`result-card ${votedCandidate === "Sarah Mitchell" ? "result-card-voted" : ""}`}
            >
              <div className="result-card-header">
                <div className="result-candidate-info">
                  <div className="result-candidate-photo">👩‍💼</div>
                  <div>
                    <div className="result-candidate-name">
                      Sarah Mitchell
                      {votedCandidate === "Sarah Mitchell" && (
                        <span className="result-badge result-badge-voted">
                          Your Vote
                        </span>
                      )}
                      {votes.sarah > votes.james && (
                        <span className="result-badge result-badge-leading">
                          Leading
                        </span>
                      )}
                    </div>
                    <div className="result-candidate-role">
                      Senior Product Manager
                    </div>
                  </div>
                </div>
                <div className="result-vote-count">
                  {votes.sarah} {votes.sarah === 1 ? "vote" : "votes"}
                </div>
              </div>
              <div className="result-progress">
                <div
                  className="result-progress-bar result-progress-bar-sarah"
                  style={{ width: `${sarahPercentage}%` }}
                ></div>
              </div>
              <div className="result-percentage">
                {sarahPercentage.toFixed(1)}%
              </div>
            </Card>

            <Card
              className={`result-card ${votedCandidate === "James Chen" ? "result-card-voted" : ""}`}
            >
              <div className="result-card-header">
                <div className="result-candidate-info">
                  <div className="result-candidate-photo">👨‍💻</div>
                  <div>
                    <div className="result-candidate-name">
                      James Chen
                      {votedCandidate === "James Chen" && (
                        <span className="result-badge result-badge-voted">
                          Your Vote
                        </span>
                      )}
                    </div>
                    <div className="result-candidate-role">
                      Engineering Lead
                    </div>
                  </div>
                </div>
                <div className="result-vote-count">
                  {votes.james} {votes.james === 1 ? "vote" : "votes"}
                </div>
              </div>
              <div className="result-progress">
                <div
                  className="result-progress-bar result-progress-bar-james"
                  style={{ width: `${jamesPercentage}%` }}
                ></div>
              </div>
              <div className="result-percentage">
                {jamesPercentage.toFixed(1)}%
              </div>
            </Card>
          </div>
        </div>

        <div className="results-section">
          <div className="results-section-header">
            <div>
              <h2 className="results-section-title">Vote Trend Analysis</h2>
              <p className="results-section-subtitle">
                Real-time voting patterns
              </p>
            </div>
            <div className="graph-toggle">
              <button
                className={`toggle-button ${timeRange === "recent" ? "toggle-active" : ""}`}
                onClick={() => setTimeRange("recent")}
              >
                Last 10 min
              </button>
              <button
                className={`toggle-button ${timeRange === "full" ? "toggle-active" : ""}`}
                onClick={() => setTimeRange("full")}
              >
                Full Period
              </button>
            </div>
          </div>

          <Card className="graph-card">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Sarah Mitchell"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="James Chen"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  dot={{ fill: "#4f46e5", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
