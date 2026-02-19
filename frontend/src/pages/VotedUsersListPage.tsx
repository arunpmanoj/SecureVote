import { useState, useEffect } from 'react'
import Card from '../components/Card'
import { API_BASE_URL } from '../config'
import './VotedUsersListPage.css'

interface VotedUser {
  _id: string
  name: string
  voterId: string
  createdAt: string
  votedCandidate?: {
    name: string
    party: string
  }
}

export default function VotedUsersListPage() {
  const [votedUsers, setVotedUsers] = useState<VotedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVotedUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/voted-users`, {
          credentials: 'include',
        })

        if (!res.ok) {
          console.error('Failed to fetch voted users')
          return
        }

        const data = await res.json()
        setVotedUsers(data)
      } catch (err) {
        console.error('Failed to load voted users', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVotedUsers()

    // 🔁 Auto refresh every 10 seconds (live audit view)
    const interval = setInterval(fetchVotedUsers, 10000)
    return () => clearInterval(interval)
  }, [])

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds} seconds ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    const days = Math.floor(hours / 24)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }

  if (isLoading) {
    return <div style={{ padding: 40 }}>Loading voted participants...</div>
  }

  return (
    <div className="voted-users-page">
      <div className="voted-users-header">
        <h1 className="voted-users-title">Voted Participants</h1>
        <div className="voted-users-count">
          {votedUsers.length} {votedUsers.length === 1 ? 'participant' : 'participants'}
        </div>
      </div>

      <Card className="privacy-note-card">
        <div className="privacy-note-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <p className="privacy-note-text">
          <strong>Privacy Note:</strong> This list shows verified votes for transparency and audit purposes.
          Voter identity details should be restricted to authorized personnel only.
        </p>
      </Card>

      <div className="voted-users-list">
        {votedUsers.map((user) => {
          const voteTime = new Date(user.createdAt)

          return (
            <Card key={user._id} className="voted-user-card">
              <div className="voted-user-header">
                <div className="voted-user-id">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span className="voter-id-text">{user.voterId}</span>
                </div>
                <div className="voted-status-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Voted
                </div>
              </div>

              <div className="voted-user-details">
                <div className="voted-user-detail-item">
                  <label>Vote Timestamp</label>
                  <div className="detail-value">
                    {formatTimestamp(voteTime)}
                    <span className="time-ago"> ({formatTimeAgo(voteTime)})</span>
                  </div>
                </div>

                <div className="voted-user-detail-item">
                  <label>Vote Lock Status</label>
                  <div className="lock-status-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Immutable
                  </div>
                </div>

                {user.votedCandidate && (
                  <div className="voted-user-detail-item">
                    <label>Voted For</label>
                    <div className="detail-value">
                      {user.votedCandidate.name} ({user.votedCandidate.party})
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {votedUsers.length === 0 && (
        <Card className="empty-state-card">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <h3>No votes recorded yet</h3>
          <p>Voted participants will appear here once voting begins.</p>
        </Card>
      )}
    </div>
  )
}