import { useState, useEffect } from "react";
import Card from "../components/Card";
import { API_BASE_URL } from "../config";
import "./VotedUsersListPage.css";

interface VotedUser {
  _id: string;
  name: string;
  voterId: string;
  linkedinProfileUrl?: string; // optional for now
}

export default function VotedUsersListPage() {
  const [users, setUsers] = useState<VotedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVotedUsers = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/voted-users`, {
        credentials: "include",
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to fetch voted users");
      }

      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      console.error("Failed to load voted users", err);
      setError("Unable to load voted users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVotedUsers();

    // 🔁 Optional auto-refresh every 15 seconds (comment out if not needed)
    const interval = setInterval(fetchVotedUsers, 15000);
    return () => clearInterval(interval);
  }, []);

  const normalizeLinkedInUrl = (url?: string) => {
    if (!url || !url.trim()) {
      return "https://www.linkedin.com/in/linkedinurl"; // fallback
    }
    // basic safety: ensure protocol exists
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Loading voted users...</div>;
  }

  return (
    <div className="voted-users-page">
      <div className="voted-users-header">
        <h1>Voted Users</h1>
        <button
          onClick={fetchVotedUsers}
          className="refresh-btn"
          style={{ marginLeft: 12 }}
        >
          Refresh
        </button>
      </div>

      {error && (
        <Card className="error-card">
          <p style={{ color: "#b91c1c" }}>{error}</p>
        </Card>
      )}

      {users.length === 0 && !error && (
        <Card className="empty-state-card">
          <p>No users have voted yet.</p>
        </Card>
      )}

      <div className="voted-users-list">
        {users.map((u) => {
          const linkedInUrl = normalizeLinkedInUrl(u.linkedinProfileUrl);

          return (
            <Card key={u._id} className="voted-user-card">
              <div>
                <strong>Name:</strong> {u.name}
              </div>
              <div>
                <strong>Voter ID:</strong> {u.voterId}
              </div>
              <div>
                <strong>LinkedIn:</strong>{" "}
                <a href={linkedInUrl} target="_blank" rel="noreferrer">
                  View Profile
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}