import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import './PostVoteConfirmationPage.css'
import type { UserState } from '../App'

interface PostVoteConfirmationPageProps {
  userState: UserState
}

const CANDIDATES = [
  {
    id: 'sarah-mitchell',
    name: 'Sarah Mitchell',
    role: 'Senior Product Manager',
    photo: '👩‍💼',
  },
  {
    id: 'james-chen',
    name: 'James Chen',
    role: 'Engineering Lead',
    photo: '👨‍💻',
  },
]

export default function PostVoteConfirmationPage({ userState }: PostVoteConfirmationPageProps) {
  const navigate = useNavigate()
  const votedCandidate = CANDIDATES.find((c) => c.name === userState.votedCandidate) || CANDIDATES[0]
  
  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A'
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (date: Date | undefined) => {
    if (!date) return 'N/A'
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  return (
    <div className="confirmation-page">
      <div className="confirmation-success-banner">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>Vote submitted for {userState.votedCandidate}!</span>
      </div>

      <Card className="confirmation-card">
        <div className="confirmation-header">
          <div className="confirmation-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h1 className="confirmation-title">Vote Submitted!</h1>
          <p className="confirmation-subtitle">Your vote has been successfully recorded</p>
        </div>

        <div className="confirmation-divider"></div>

        <div className="confirmation-section">
          <h2 className="confirmation-section-title">VOTE CONFIRMATION</h2>

          <Card className="audit-card">
            <div className="audit-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <div>
                <h3 className="audit-title">Private Vote Audit Trail</h3>
                <p className="audit-subtitle">Visible only to you for verification purposes</p>
              </div>
            </div>

            <div className="audit-details">
              <div className="audit-field">
                <label>Voted Candidate</label>
                <div className="candidate-badge">
                  <div className="candidate-avatar">{votedCandidate.photo}</div>
                  <div>
                    <div className="candidate-name">{votedCandidate.name}</div>
                    <div className="candidate-role">{votedCandidate.role}</div>
                  </div>
                </div>
              </div>

              <div className="audit-field-group">
                <div className="audit-field">
                  <label>Date</label>
                  <div className="audit-value">{formatDate(userState.voteTimestamp)}</div>
                </div>
                <div className="audit-field">
                  <label>Time</label>
                  <div className="audit-value">{formatTime(userState.voteTimestamp)}</div>
                </div>
              </div>

              <div className="audit-field">
                <label>Vote Status</label>
                <div className="status-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <div>
                    <div className="status-text">Immutable / Locked</div>
                    <div className="status-description">Cannot be edited or deleted</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <div className="privacy-guarantee">
            <strong>Privacy Guarantee:</strong> Vote details are visible only to you and the system for audit purposes. Your identity is never publicly displayed to protect privacy and ensure unbiased voting.
          </div>

          <div className="confirmation-actions">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/results')}
            >
              View Results
            </Button>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => navigate('/voted-users')}
            >
              View Voted Participants
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
