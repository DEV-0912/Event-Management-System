import { useEffect, useState } from 'react';
import { api } from '../api';

export default function UserDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [qrState, setQrState] = useState({});
  const [qrBusy, setQrBusy] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setMessage('Please login to view your events.');
      setLoading(false);
      return;
    }
    
    const fetchRegistrations = async () => {
      try {
        const { data } = await api.get('/api/registration/mine');
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setMessage('Failed to load your registrations');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  // Countdown effect for QR codes
  useEffect(() => {
    const timer = setInterval(() => {
      setQrState(prev => {
        const now = Date.now();
        const newState = { ...prev };
        
        Object.keys(newState).forEach(id => {
          if (newState[id].expiresAt <= now) {
            delete newState[id];
          } else {
            newState[id] = {
              ...newState[id],
              countdown: Math.ceil((newState[id].expiresAt - now) / 1000)
            };
          }
        });
        
        return newState;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const toggleExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const generateQr = async (registration) => {
    const { id } = registration;
    if (qrBusy[id]) return;
    
    setQrBusy(prev => ({ ...prev, [id]: true }));
    
    try {
      const response = await api.post(`/api/registration/${id}/generate-qr`);
      const { dataUrl, expiresAt, remaining, limit } = response.data;
      
      setQrState(prev => ({
        ...prev,
        [id]: {
          url: dataUrl,
          expiresAt: new Date(expiresAt).getTime(),
          remaining,
          limit,
          countdown: Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000)
        }
      }));
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to generate QR code';
      setMessage(errorMessage);
    } finally {
      setQrBusy(prev => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your events...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>My Events</h1>
        {message && <div className="alert">{message}</div>}
      </div>

      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-value">{items.length}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {items.filter(r => r.checkedIn).length}
          </div>
          <div className="stat-label">Attended</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {items.filter(r => !r.checkedIn).length}
          </div>
          <div className="stat-label">Upcoming</div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>No events registered yet</h3>
          <p>Register for events to see them listed here.</p>
        </div>
      ) : (
        <div className="event-cards">
          {items.map((registration) => {
            const eventDate = new Date(registration.eventDate);
            const isExpanded = expandedCard === registration.id;
            const qrInfo = qrState[registration.id];
            
            return (
              <div key={registration.id} className={`event-card ${isExpanded ? 'expanded' : ''}`}>
                <div className="event-card-header" onClick={() => toggleExpand(registration.id)}>
                  <h3>{registration.eventName}</h3>
                  <div className="event-meta">
                    <span className="event-date">
                      {eventDate.toLocaleDateString()}
                    </span>
                    <span className={`status-badge ${registration.checkedIn ? 'checked-in' : 'not-checked-in'}`}>
                      {registration.checkedIn ? 'Checked In' : 'Not Checked In'}
                    </span>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="event-card-details">
                    <div className="event-info">
                      <div className="info-row">
                        <span className="info-label">Venue:</span>
                        <span>{registration.eventVenue}</span>
                      </div>
                      {registration.eventSpeaker && (
                        <div className="info-row">
                          <span className="info-label">Speaker:</span>
                          <span>{registration.eventSpeaker}</span>
                        </div>
                      )}
                      {registration.eventFood && (
                        <div className="info-row">
                          <span className="info-label">Food:</span>
                          <span>{registration.eventFood}</span>
                        </div>
                      )}
                      <div className="info-row">
                        <span className="info-label">Registration ID:</span>
                        <span className="mono">{registration.id}</span>
                      </div>
                    </div>
                    
                    <div className="qr-section">
                      <h4>Check-in QR Code</h4>
                      <p>QR is valid for 10 seconds. You have limited attempts.</p>
                      
                      {qrInfo?.url ? (
                        <div className="qr-container">
                          <img src={qrInfo.url} alt="Check-in QR Code" className="qr-image" />
                          <div className="qr-meta">
                            <span>Expires in: {qrInfo.countdown}s</span>
                            <span>Attempts: {qrInfo.remaining} / {qrInfo.limit}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="no-qr">
                          <p>Generate a QR code when you're ready to check in.</p>
                          <button 
                            className="generate-qr-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              generateQr(registration);
                            }}
                            disabled={qrBusy[registration.id]}
                          >
                            {qrBusy[registration.id] ? 'Generating...' : 'Generate QR'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          margin: 0 0 1rem 0;
          color: #2c3e50;
        }

        .alert {
          padding: 1rem;
          background-color: #f8d7da;
          color: #721c24;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .stats-container {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-item {
          flex: 1;
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .empty-state h3 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
        }

        .empty-state p {
          color: #6c757d;
          margin: 0;
        }

        .event-cards {
          display: grid;
          gap: 1.5rem;
        }

        .event-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .event-card.expanded {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .event-card-header {
          padding: 1.25rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .event-card-header h3 {
          margin: 0;
          color: #2c3e50;
        }

        .event-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .event-date {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .checked-in {
          background-color: #d4edda;
          color: #155724;
        }

        .not-checked-in {
          background-color: #fff3cd;
          color: #856404;
        }

        .event-card-details {
          padding: 1.5rem;
          border-top: 1px solid #e9ecef;
        }

        .event-info {
          margin-bottom: 1.5rem;
        }

        .info-row {
          display: flex;
          margin-bottom: 0.75rem;
          line-height: 1.5;
        }

        .info-label {
          font-weight: 600;
          min-width: 120px;
          color: #495057;
        }

        .mono {
          font-family: 'Courier New', monospace;
          background-color: #f8f9fa;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-size: 0.9em;
        }

        .qr-section {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px dashed #dee2e6;
        }

        .qr-section h4 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          color: #2c3e50;
        }

        .qr-section p {
          margin-top: 0;
          margin-bottom: 1rem;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .qr-container {
          text-align: center;
          margin: 1rem 0;
        }

        .qr-image {
          max-width: 200px;
          height: auto;
          margin-bottom: 0.5rem;
        }

        .qr-meta {
          display: flex;
          justify-content: center;
          gap: 1rem;
          font-size: 0.85rem;
          color: #6c757d;
        }

        .no-qr {
          text-align: center;
          padding: 1rem;
          background-color: #f8f9fa;
          border-radius: 6px;
        }

        .generate-qr-btn {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }

        .generate-qr-btn:hover:not(:disabled) {
          background-color: #0056b3;
        }

        .generate-qr-btn:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading {
          text-align: center;
          padding: 2rem;
          color: #6c757d;
        }

        @media (max-width: 768px) {
          .stats-container {
            flex-direction: column;
            gap: 1rem;
          }
          
          .event-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .event-meta {
            width: 100%;
            justify-content: space-between;
          }
          
          .info-row {
            flex-direction: column;
            gap: 0.25rem;
          }
          
          .info-label {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}
