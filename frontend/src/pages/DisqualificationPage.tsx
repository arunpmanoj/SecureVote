import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import './DisqualificationPage.css'

export default function DisqualificationPage() {
  const navigate = useNavigate()

  return (
    <div className="disqualification-page">
      <Card className="disqualification-card">
        <div className="disqualification-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h1 className="disqualification-title">Voting time has expired.</h1>
        <h2 className="disqualification-subtitle">You have been disqualified from voting.</h2>
        
        <div className="disqualification-explanation">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <p>This rule ensures fairness and prevents delayed voting.</p>
        </div>

        <div className="disqualification-actions">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate('/results')}
          >
            View Results
          </Button>
        </div>
      </Card>
    </div>
  )
}
