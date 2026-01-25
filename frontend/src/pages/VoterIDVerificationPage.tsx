import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import "./VoterIDVerificationPage.css";
import type { UserState } from "../App";

interface VoterIDVerificationPageProps {
  updateUserState: (updates: Partial<UserState>) => void;
}

export default function VoterIDVerificationPage({
  updateUserState,
}: VoterIDVerificationPageProps) {
  const [voterId, setVoterId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!voterId.trim()) {
      setError("Voter ID number is required");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("voterId", voterId.trim());
      if (file) {
        formData.append("document", file);
      }

      const res = await fetch("http://localhost:4000/api/verify-voter", {
        method: "POST",
        credentials: "include", // 🔑 REQUIRED (session cookie)
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      // ✅ Backend verified successfully
      updateUserState({
        isVerified: true,
        voterId: voterId.trim(),
      });

      navigate("/timer-warning");
    } catch (err: any) {
      setError(err.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <Card className="verify-card">
        <h1 className="verify-title">Verify Your Voter ID</h1>

        <div className="verify-explanation">
          To ensure one-person-one-vote, please verify your Voter ID. This is a
          one-time verification process.
        </div>

        <form onSubmit={handleSubmit} className="verify-form">
          <Input
            label="Voter ID Number"
            placeholder="Enter your Voter ID number"
            value={voterId}
            onChange={setVoterId}
            error={error}
            helperText="Enter your government-issued Voter ID number"
            required
            disabled={loading}
          />

          <div className="file-upload-group">
            <label className="file-upload-label">
              Upload Voter ID Document (Optional)
            </label>

            <div className="file-upload-area">
              <input
                type="file"
                id="file-upload"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                disabled={loading}
                className="file-upload-input"
              />

              <label
                htmlFor="file-upload"
                className="file-upload-label-button"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>

                <span>Click to upload or drag and drop</span>
                <span className="file-upload-hint">
                  JPG, PNG or PDF (max 5MB)
                </span>
              </label>

              {file && (
                <div className="file-upload-selected">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  {file.name}
                </div>
              )}
            </div>
          </div>

          <div className="privacy-disclaimer">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <div>
              <strong>Your Privacy is Protected.</strong> Voter ID data is used
              only for eligibility verification and is never publicly displayed.
              Your vote remains completely anonymous.
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={loading}
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            }
          >
            {loading ? "Verifying..." : "Start Voting (Timer Will Begin)"}
          </Button>
        </form>
      </Card>
    </div>
  );
}