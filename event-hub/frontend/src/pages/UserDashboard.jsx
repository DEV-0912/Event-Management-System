// import { useEffect, useState } from 'react'
// import { api } from '../api'

// export default function UserDashboard() {
//   const [items, setItems] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [message, setMessage] = useState('')

//   useEffect(() => {
//     const token = localStorage.getItem('auth_token')
//     if (!token) {
//       setMessage('Please login to view your events.')
//       setLoading(false)
//       return
//     }
//     ;(async () => {
//       try {
//         const { data } = await api.get('/api/registration/mine')
//         setItems(data)
//       } catch (e) {
//         setMessage('Failed to load your registrations')
//       } finally {
//         setLoading(false)
//       }
//     })()
//   }, [])

//   return (
//     <div>
//       <h1>My Events</h1>
//       {message && <div className="alert">{message}</div>}
//       {loading ? <p>Loading...</p> : (
//         <div className="grid">
//           {items.length === 0 && <p>No registrations yet.</p>}
//           {items.map(r => (
//             <div key={r.id} className="card fade-in">
//               <div className="row"><strong>{r.eventName}</strong></div>
//               <div className="row">Date: {new Date(r.eventDate).toLocaleString()}</div>
//               <div className="row">Venue: {r.eventVenue}</div>
//               {r.eventSpeaker && <div className="row">Speaker: {r.eventSpeaker}</div>}
//               {r.eventFood && <div className="row">Food: {r.eventFood}</div>}
//               <div className="row">Checked In: {r.checkedIn ? 'Yes' : 'No'}</div>
//               {r.qrCode && (
//                 <div className="qr">
//                   <img src={r.qrCode} alt="QR" />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )

//   const downloadQR = (qrCode, eventName) => {
//     if (!qrCode) return
    
//     const link = document.createElement('a')
//     link.href = qrCode
//     link.download = `${eventName.replace(/\s+/g, '_')}_QR.png`
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   const user = JSON.parse(localStorage.getItem('auth_user') || '{}')

//   // countdown tick
//   useEffect(() => {
//     const t = setInterval(() => {
//       setQrState(prev => {
//         const next = { ...prev }
//         const now = Date.now()
//         Object.keys(next).forEach(k => {
//           const entry = next[k]
//           if (!entry) return
//           const remainingMs = Math.max(0, (entry.expiresAt || 0) - now)
//           const sec = Math.ceil(remainingMs / 1000)
//           if (remainingMs <= 0) {
//             // expire and clear QR image
//             next[k] = { ...entry, url: '', countdown: 0 }
//           } else {
//             next[k] = { ...entry, countdown: sec }
//           }
//         })
//         return next
//       })
//     }, 300)
//     return () => clearInterval(t)
//   }, [])

//   const generateQr = async (reg) => {
//     const id = reg.id
//     try {
//       setQrBusy(prev => ({ ...prev, [id]: true }))
//       const { data } = await api.post(`/api/registration/${id}/generate-qr`)
//       const { dataUrl, expiresAt, remaining, limit } = data || {}
//       if (!dataUrl || !expiresAt) {
//         setMessage('QR generation failed')
//         return
//       }
//       setQrState(prev => ({
//         ...prev,
//         [id]: { url: dataUrl, expiresAt, remaining, limit, countdown: Math.ceil((expiresAt - Date.now())/1000) }
//       }))
//     } catch (e) {
//       const status = e?.response?.status
//       const err = e?.response?.data?.error || 'QR generation failed'
//       if (status === 403 && /disabled/i.test(err)) {
//         setMessage('QR generation is disabled by the admin for this event')
//       } else if (status === 429) {
//         setMessage('QR attempts limit reached')
//       } else {
//         setMessage(err)
//       }
//     } finally {
//       setQrBusy(prev => ({ ...prev, [id]: false }))
//     }
//   }

//   return (
//     <div className="container">
//       <div className="dashboard-header">
//         <div className="user-welcome">
//           <h1>My Events</h1>
//           <div className="user-greeting">
//             Welcome back, <span className="user-name">{user.name || 'User'}</span>
//           </div>
//         </div>
//         <div className="stats-overview">
//           <div className="stat-item">
//             <div className="stat-value">{items.length}</div>
//             <div className="stat-label">Total Events</div>
//           </div>
//           <div className="stat-item">
//             <div className="stat-value">
//               {items.filter(r => r.checkedIn).length}
//             </div>
//             <div className="stat-label">Attended</div>
//           </div>
//           <div className="stat-item">
//             <div className="stat-value">
//               {items.filter(r => !r.checkedIn).length}
//             </div>
//             <div className="stat-label">Upcoming</div>
//           </div>
//         </div>
//       </div>

//       {message && (
//         <div className={`alert ${message.includes('login') ? 'alert-warning' : 'alert-error'} fade-in`}>
//           <div className="alert-content">
//             <span>{message}</span>
//             <button className="alert-close" onClick={() => setMessage('')}>
//               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                 <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>Loading your events...</p>
//         </div>
//       ) : (
//         <div className="events-section">
//           {items.length === 0 ? (
//             <div className="empty-state">
//               <div className="empty-icon">
//                 <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
//                   <path d="M8 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H8C6.9 18 6 17.1 6 16V8C6 6.9 6.9 6 8 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   <path d="M16 18V20C16 21.1 15.1 22 14 22H6C4.9 22 4 21.1 4 20V12C4 10.9 4.9 10 6 10H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//               </div>
//               <h3>No events registered yet</h3>
//               <p>Get started by browsing and registering for events</p>
//               <button 
//                 className="browse-events-btn primary-btn"
//                 onClick={() => window.location.href = '/register'}
//               >
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                   <path d="M10 12H6M6 12L9 9M6 12L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   <path d="M4 5H18C19.1046 5 20 5.89543 20 7V17C20 18.1046 19.1046 19 18 19H4C2.89543 19 2 18.1046 2 17V7C2 5.89543 2.89543 5 4 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//                 Browse Events
//               </button>
//             </div>
//           ) : (
//             <div className="events-grid">
//               {items.map(r => {
//                 const isExpanded = expandedCard === r.id
//                 const eventDate = new Date(r.eventDate)
//                 const isPastEvent = eventDate < new Date()
                
//                 return (
//                   <div 
//                     key={r.id} 
//                     className={`event-card ${isExpanded ? 'expanded' : ''} ${isPastEvent ? 'past-event' : ''}`}
//                   >
//                     <div className="event-header">
//                       <div className="event-title-section">
//                         <h3 className="event-name">{r.eventName}</h3>
//                         <div className="event-meta">
//                           <span className="event-date">
//                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                               <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                             </svg>
//                             {eventDate.toLocaleString()}
//                           </span>
//                           <span className={`status-badge ${r.checkedIn ? 'checked-in' : 'not-checked-in'}`}>
//                             {r.checkedIn ? (
//                               <>
//                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//                                   <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                 </svg>
//                                 Checked In
//                               </>
//                             ) : isPastEvent ? (
//                               <>
//                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//                                   <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                 </svg>
//                                 Missed
//                               </>
//                             ) : (
//                               <>
//                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//                                   <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                   <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
//                                 </svg>
//                                 Upcoming
//                               </>
//                             )}
//                           </span>
//                         </div>
//                       </div>
//                       <button 
//                         className="expand-btn"
//                         onClick={() => toggleCardExpansion(r.id)}
//                         aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
//                       >
//                         <svg 
//                           width="20" 
//                           height="20" 
//                           viewBox="0 0 24 24" 
//                           fill="none"
//                           style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
//                         >
//                           <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                         </svg>
//                       </button>
//                     </div>

//                     <div className="event-details">
//                       <div className="detail-item">
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                           <path d="M17.657 16.657L13.414 20.9C13.039 21.2746 12.5306 21.485 12 21.485C11.4694 21.485 10.961 21.2746 10.586 20.9L6.343 16.657C5.22422 15.5381 4.46234 14.1127 4.15369 12.5608C3.84504 11.009 4.00349 9.40047 4.60901 7.93868C5.21452 6.4769 6.2399 5.22749 7.55548 4.34846C8.87107 3.46943 10.4178 3.00024 12 3.00024C13.5822 3.00024 15.1289 3.46943 16.4445 4.34846C17.7601 5.22749 18.7855 6.4769 19.391 7.93868C19.9965 9.40047 20.155 11.009 19.8463 12.5608C19.5377 14.1127 18.7758 15.5381 17.657 16.657Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                           <path d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                         </svg>
//                         <span>{r.eventVenue}</span>
//                       </div>
//                       {r.eventSpeaker && (
//                         <div className="detail-item">
//                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                             <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                           </svg>
//                           <span>{r.eventSpeaker}</span>
//                         </div>
//                       )}
//                       {r.eventFood && (
//                         <div className="detail-item">
//                           <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                             <path d="M3 10H21M7 15H17M6 15V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V15M9 5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V7H9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                           </svg>
//                           <span>{r.eventFood}</span>
//                         </div>
//                       )}
//                     </div>

//                     {/* Expanded Content */}
//                     {isExpanded && (
//                       <div className="expanded-content">
//                         <div className="qr-section">
//                           <h4>Your QR Code</h4>
//                           <p>QR is valid for 10 seconds. You have limited attempts.</p>
//                           <div className="qr-container">
//                             {!!qrState[r.id]?.url ? (
//                               <>
//                                 <img src={qrState[r.id].url} alt="QR Code for event check-in" className="qr-image" />
//                                 <div className="qr-actions" style={{alignItems:'center'}}>
//                                   <span style={{color:'var(--muted)'}}>Expires in {Math.max(0, qrState[r.id].countdown || 0)}s</span>
//                                   {Number.isFinite(qrState[r.id]?.remaining) && Number.isFinite(qrState[r.id]?.limit) && (
//                                     <span style={{color:'var(--muted)'}}>Attempts left: {qrState[r.id].remaining} / {qrState[r.id].limit}</span>
//                                   )}
//                                 </div>
//                               </>
//                             ) : (
//                               <>
//                                 <div className="no-qr-message">
//                                   <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
//                                     <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                   </svg>
//                                   <p>Generate a QR when you are near the check-in desk. It will be valid for 10 seconds.</p>
//                                 </div>
//                                 <div className="qr-actions">
//                                   <button 
//                                     className="download-btn"
//                                     onClick={() => generateQr(r)}
//                                     disabled={!!qrBusy[r.id]}
//                                     title="Generate a short-lived QR for check-in"
//                                   >
//                                     {qrBusy[r.id] ? 'Generating…' : 'Generate QR'}
//                                   </button>
//                                 </div>
//                               </>
//                             )}
//                           </div>
//                         </div>

//                         <div className="event-notes">
//                           <h4>Event Information</h4>
//                           <div className="notes-grid">
//                             <div className="note-item">
//                               <strong>Registration ID:</strong>
//                               <span className="mono">{r.id}</span>
//                             </div>
//                             <div className="note-item">
//                               <strong>Check-in Status:</strong>
//                               <span className={r.checkedIn ? 'status-success' : 'status-pending'}>
//                                 {r.checkedIn ? 'Checked In' : 'Not Checked In'}
//                               </span>
//                             </div>
//                             <div className="note-item">
//                               <strong>Event Date:</strong>
//                               <span>{eventDate.toLocaleDateString('en-US', { 
//                                 weekday: 'long',
//                                 year: 'numeric',
//                                 month: 'long',
//                                 day: 'numeric'
//                               })}</span>
//                             </div>
//                             <div className="note-item">
//                               <strong>Event Time:</strong>
//                               <span>{eventDate.toLocaleTimeString('en-US', {
//                                 hour: '2-digit',
//                                 minute: '2-digit'
//                               })}</span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 )
//               })}
//             </div>
//           )}
//         </div>
//       )}
                              <strong>Registration ID:</strong>
                              <span className="mono">{r.id}</span>
                            </div>
                            <div className="note-item">
                              <strong>Check-in Status:</strong>
                              <span className={r.checkedIn ? 'status-success' : 'status-pending'}>
                                {r.checkedIn ? 'Checked In' : 'Not Checked In'}
                              </span>
                            </div>
                            <div className="note-item">
                              <strong>Event Date:</strong>
                              <span>{eventDate.toLocaleDateString('en-US', { 
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}</span>
                            </div>
                            <div className="note-item">
                              <strong>Event Time:</strong>
                              <span>{eventDate.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .dashboard-header {
          margin-bottom: 32px;
        }

        .user-welcome {
          margin-bottom: 24px;
        }

        .user-welcome h1 {
          margin: 0 0 8px 0;
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary), var(--primary-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .user-greeting {
          color: var(--muted);
          font-size: 1.125rem;
        }

        .user-name {
          color: var(--text);
          font-weight: 600;
        }

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
        }

        .stat-item {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          box-shadow: var(--shadow);
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          color: var(--muted);
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Events Section */
        .events-section {
          margin-bottom: 32px;
        }

        .events-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .event-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
        }

        .event-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .event-card.expanded {
          border-color: var(--primary);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .event-card.past-event {
          opacity: 0.8;
          background: rgba(255, 255, 255, 0.02);
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 16px;
        }

        .event-title-section {
          flex: 1;
        }

        .event-name {
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .event-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .event-date {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--muted);
          font-size: 0.9rem;
        }

        .expand-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px;
          color: var(--text);
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .expand-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--primary);
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--muted);
          font-size: 0.9rem;
        }

        /* Status Badges */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .status-badge.checked-in {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .status-badge.not-checked-in {
          background: rgba(100, 116, 139, 0.2);
          color: #64748b;
          border: 1px solid rgba(100, 116, 139, 0.3);
        }

        /* Expanded Content */
        .expanded-content {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .qr-section {
          margin-bottom: 24px;
        }

        .qr-section h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 8px 0;
        }

        .qr-section p {
          color: var(--muted);
          margin: 0 0 16px 0;
          font-size: 0.9rem;
        }

        .qr-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .qr-image {
          width: 200px;
          height: 200px;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px;
          background: white;
        }

        .qr-actions {
          display: flex;
          gap: 12px;
        }

        .download-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .download-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--primary);
        }

        .no-qr-message {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 40px 20px;
          color: var(--muted);
          text-align: center;
        }

        .no-qr-message svg {
          color: var(--muted);
        }

        .event-notes h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 16px 0;
        }

        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }

        .note-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .note-item strong {
          color: var(--text);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .note-item span {
          color: var(--muted);
          font-size: 0.875rem;
        }

        .mono {
          font-family: 'Fira Code', monospace;
          font-size: 0.8rem;
        }

        .status-success {
          color: #22c55e;
          font-weight: 600;
        }

        .status-pending {
          color: #f59e0b;
          font-weight: 600;
        }

        /* Alerts */
        .alert {
          background: rgba(160, 107, 43, 0.12);
          color: #2b2116;
          padding: 12px 16px;
          border: 1px solid rgba(160, 107, 43, 0.28);
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .alert-warning {
          background: rgba(245, 158, 11, 0.12);
          color: #92400e;
          border-color: rgba(245, 158, 11, 0.28);
        }

        .alert-error {
          background: rgba(239, 68, 68, 0.12);
          color: #991b1b;
          border-color: rgba(239, 68, 68, 0.28);
        }

        .alert-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: '100%';
        }

        .alert-close {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .alert-close:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        /* Loading States */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          gap: 16px;
          color: var(--muted);
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-left: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
          color: var(--muted);
        }

        .empty-icon {
          margin-bottom: 24px;
        }

        .empty-state h3 {
          margin: 0 0 12px 0;
          color: var(--text);
          font-size: 1.5rem;
        }

        .empty-state p {
          margin: 0 0 24px 0;
          font-size: 1rem;
          max-width: 400px;
          line-height: 1.5;
        }

        .browse-events-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-weight: 600;
        }

        /* Buttons */
        .primary-btn {
          background: linear-gradient(135deg, var(--primary), var(--primary-600));
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: var(--shadow);
        }

        .primary-btn:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }

        /* Animations */
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .container {
            padding: 0 16px;
          }

          .stats-overview {
            grid-template-columns: repeat(3, 1fr);
          }

          .event-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .expand-btn {
            align-self: flex-end;
          }

          .event-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .notes-grid {
            grid-template-columns: 1fr;
          }

          .qr-image {
            width: 160px;
            height: 160px;
          }
        }

        @media (max-width: 480px) {
          .stat-item {
            padding: 16px;
          }

          .stat-value {
            font-size: 1.5rem;
          }

          .event-card {
            padding: 20px;
          }

          .event-name {
            font-size: 1.25rem;
          }

          .qr-actions {
            flex-direction: column;
            width: 100%;
          }

          .download-btn {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}