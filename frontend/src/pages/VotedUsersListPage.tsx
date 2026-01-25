import { useState, useEffect } from 'react'
import Card from '../components/Card'
import './VotedUsersListPage.css'

interface VotedUser {
  id: string
  voterId: string
  timestamp: Date
  status: 'Voted'
  lockStatus: 'Immutable'
}

// Generate anonymous voter ID
const generateAnonymousVoterId = (): string => {
  const prefix = 'VTR-'
  const chars = '0123456789ABCDEF'
  const randomPart = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `${prefix}${randomPart}`
}

// Simulate voted users data
const generateVotedUsers = (count: number): VotedUser[] => {
  const users: VotedUser[] = []
  const now = new Date()
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - Math.random() * 3600000) // Random time in last hour
    users.push({
      id: `user-${i}`,
      voterId: generateAnonymousVoterId(),
      timestamp,
      status: 'Voted',
      lockStatus: 'Immutable',
    })
  }
  
  return users.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export default function VotedUsersListPage() {
  const [votedUsers, setVotedUsers] = useState<VotedUser[]>(generateVotedUsers(12))
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Simulate real-time updates - add new votes periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new vote
        const newUser: VotedUser = {
          id: `user-${Date.now()}`,
          voterId: generateAnonymousVoterId(),
          timestamp: new Date(),
          status: 'Voted',
          lockStatus: 'Immutable',
        }
        setVotedUsers((prev) => [newUser, ...prev].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()))
      }
    }, 5000)

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
          <strong>Privacy Note:</strong> All voter identifiers are anonymized and cannot be linked to real individuals.
          This list exists only for transparency and audit purposes.
        </p>
      </Card>

      <div className="voted-users-list">
        {votedUsers.map((user) => (
          <Card key={user.id} className="voted-user-card">
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
                {user.status}
              </div>
            </div>

            <div className="voted-user-details">
              <div className="voted-user-detail-item">
                <label>Vote Timestamp</label>
                <div className="detail-value">
                  {formatTimestamp(user.timestamp)}
                  <span className="time-ago">({formatTimeAgo(user.timestamp)})</span>
                </div>
              </div>

              <div className="voted-user-detail-item">
                <label>Vote Lock Status</label>
                <div className="lock-status-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  {user.lockStatus}
                </div>
              </div>
            </div>
          </Card>
        ))}
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
