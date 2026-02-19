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

  useEffect(() => {
    const fetchVotedUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/voted-users`, {
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Failed to fetch voted users");
          return;
        }

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to load voted users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVotedUsers();
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading voted users...</div>;
  }

  return (
    <div className="voted-users-page">
      <h1>Voted Users</h1>

      {users.length === 0 && <p>No users have voted yet.</p>}

      <div className="voted-users-list">
        {users.map((u) => {
          const linkedInUrl =
            u.linkedinProfileUrl ||
            "https://www.linkedin.com/in/linkedinurl"; // 👈 hardcoded fallback

          return (
            <Card key={u._id} className="voted-user-card">
              <div><strong>Name:</strong> {u.name}</div>
              <div><strong>Voter ID:</strong> {u.voterId}</div>
              <div>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href={linkedInUrl}
                  target="_blank"
                  rel="noreferrer"
                >
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