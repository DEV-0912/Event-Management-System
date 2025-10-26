// import { useEffect, useState } from 'react'
// import { api } from '../api'
// import { Button } from '../components/ui/button'
// import { Card, CardContent } from '../components/ui/card'

// export default function AdminDashboard() {
//   const [events, setEvents] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [message, setMessage] = useState('')
//   const [regsByEvent, setRegsByEvent] = useState({})
//   const [openEventIds, setOpenEventIds] = useState(new Set())
//   const [loadingEventId, setLoadingEventId] = useState(null)
//   // Ads moved to AdsManager page
//   const [sendTo, setSendTo] = useState({}) // eventId -> recipients string
//   const [overview, setOverview] = useState({ totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 })
//   const [unowned, setUnowned] = useState([])
//   const [popup, setPopup] = useState({ open: false, text: '' })
//   const [deletingId, setDeletingId] = useState(null)
//   const [expandedAnswers, setExpandedAnswers] = useState(new Set())

//   const load = async () => {
//     setLoading(true)
//     try {
//       const { data } = await api.get('/api/events/mine')
//       setEvents(data)
//       // ads removed from this page
//       const ov = await api.get('/api/events/overview')
//       setOverview(ov.data || { totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 })
//       const u = await api.get('/api/events/unowned')
//       setUnowned(u.data || [])
//     } catch (e) {
//       setMessage('Failed to load events')
//     } finally {
//       setLoading(false)
//     }

//   const claim = async (id) => {
//     try {
//       await api.post(`/api/events/${id}/claim`)
//       setMessage('Event claimed')
//       await load()
//     } catch (e) {
//       setMessage(e?.response?.data?.error || 'Failed to claim event')
//     }
//   }
//   }

//   useEffect(() => { load() }, [])

//   const remove = async (id) => {
//     if (!confirm('Delete this event?')) return
//     try {
//       setDeletingId(id)
//       await api.delete(`/api/events/${id}`)
//       setMessage('Event deleted')
//       load()
//     } catch (e) {
//       setMessage('Delete failed')
//     } finally { setDeletingId(null) }
//   }

//   const reloadRegs = async (eventId) => {
//     try {
//       setLoadingEventId(eventId)
//       const { data } = await api.get(`/api/registration/event/${eventId}`)
//       setRegsByEvent(prev => ({ ...prev, [eventId]: data }))
//     } catch (e) {
//       setMessage('Failed to load registrations')
//     } finally {
//       setLoadingEventId(null)
//     }
//   }

//   const toggleRegs = async (eventId) => {
//     const next = new Set(openEventIds)
//     if (next.has(eventId)) {
//       next.delete(eventId)
//       setOpenEventIds(next)
//       return
//     }
//     next.add(eventId)
//     setOpenEventIds(next)
//     await reloadRegs(eventId)
//   }

//   return (
//     <div>
//       {popup.open && (
//         <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.4)', display:'grid', placeItems:'center', zIndex:9999}}>
//           <Card style={{maxWidth:380, width:'90%', textAlign:'center'}}>
//             <CardContent>
//               <div className="row"><strong>Success</strong></div>
//               <div className="row">{popup.text || 'Attendance sent'}</div>
//               <div className="actions" style={{justifyContent:'center', marginTop:12}}>
//                 <Button onClick={() => setPopup({ open:false, text:'' })}>OK</Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//       <h1>Admin Dashboard</h1>
//       <div className="row" style={{marginTop: -6, marginBottom: 10, color: 'var(--muted)'}}>
//         Signed in as: <strong style={{marginLeft: 6}}>{(JSON.parse(localStorage.getItem('auth_user')||'{}').name)||'Admin'}</strong>
//       </div>
//       {message && <div className="alert">{message}</div>}

//       {/* Analytics summary */}
//       <div className="grid" style={{marginBottom:14}}>
//         <div className="card fade-in">
//           <div className="row"><strong>My Events</strong></div>
//           <div className="row" style={{fontSize:24, fontWeight:700}}>{overview.totalEvents}</div>
//         </div>
//         <div className="card fade-in">
//           <div className="row"><strong>Registrations</strong></div>
//           <div className="row" style={{fontSize:24, fontWeight:700}}>{overview.totalRegistrations}</div>
//         </div>
//         <div className="card fade-in">
//           <div className="row"><strong>Checked-In</strong></div>
//           <div className="row" style={{fontSize:24, fontWeight:700}}>{overview.totalCheckedIn}</div>
//         </div>
//       </div>
//       {/* Legacy (Unowned) Events - claim ownership */}
//       {unowned.length > 0 && (
//         <div className="card" style={{marginBottom:14}}>
//           <div className="row"><strong>Legacy Events (claim to manage)</strong></div>
//           <div className="list" style={{marginTop:8}}>
//             {unowned.map(ev => (
//               <div className="card" key={ev.id}>
//                 <div className="row"><strong>{ev.name}</strong></div>
//                 <div className="row">Date: {new Date(ev.date).toLocaleString()}</div>
//                 <div className="row">Venue: {ev.venue}</div>
//                 <div className="actions"><button type="button" onClick={() => claim(ev.id)}>Claim</button></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Ads moved to AdsManager page */}

//       {loading ? <p>Loading...</p> : (
//         <div className="list">
//           {events.length === 0 && <p>No events yet.</p>}
//           {events.map(ev => (
//             <div className="card" key={ev.id}>
//               {ev.poster && (
//                 <div className="qr" style={{marginTop:0, marginBottom:10}}>
//                   <img src={typeof ev.poster === 'string' ? ev.poster : ''} alt={`${ev.name} poster`} style={{maxWidth:'100%', maxHeight:180, objectFit:'cover', width:'100%', borderRadius:10, border:'1px solid var(--border)'}} />
//                 </div>
//               )}
//               <div className="row"><strong>{ev.name}</strong></div>
//               <div className="row">Date: {new Date(ev.date).toLocaleString()}</div>
//               <div className="row">Venue: {ev.venue}</div>
//               {ev.speaker && <div className="row">Speaker: {ev.speaker}</div>}
//               {ev.food && <div className="row">Food: {ev.food}</div>}
//               <div className="actions">
//                 <Button type="button" onClick={() => toggleRegs(ev.id)}>
//                   {openEventIds.has(ev.id) ? 'Hide Registrations' : 'View Registrations'}
//                 </Button>
//                 <Button type="button" variant="destructive" onClick={() => remove(ev.id)} disabled={deletingId===ev.id}>
//                   {deletingId===ev.id ? 'Deleting…' : 'Delete'}
//                 </Button>
//               </div>
//               {openEventIds.has(ev.id) && (
//                 <div className="sublist">
//                   {loadingEventId === ev.id && <p>Loading registrants...</p>}
//                   {!loadingEventId && (
//                     <>
//                       {(!regsByEvent[ev.id] || regsByEvent[ev.id].length === 0) && (
//                         <p>No registrations yet.</p>
//                       )}
//                       {regsByEvent[ev.id] && regsByEvent[ev.id].length > 0 && (
//                         <div className="list">
//                           <div className="card">
//                             <div className="row">
//                               <strong>Summary</strong>
//                             </div>
//                             <div className="row">
//                               Total: {regsByEvent[ev.id].length} &nbsp;|
//                               &nbsp; Checked-in: {regsByEvent[ev.id].filter(r => r.checkedIn).length}
//                             </div>
//                             <div className="actions" style={{marginTop:6}}>
//                               <Button type="button" onClick={() => reloadRegs(ev.id)}>Refresh</Button>
//                             </div>
//                             <div className="row" style={{display:'grid', gap:8}}>
//                               <label>Recipients (comma separated emails)
//                                 <input value={sendTo[ev.id]||''} onChange={e => setSendTo(prev => ({...prev, [ev.id]: e.target.value}))} placeholder="dean@college.edu, hod@dept.edu" />
//                               </label>
//                               <div className="actions">
//                                 <Button type="button" onClick={async () => {
//                                   const raw = (sendTo[ev.id]||'').split(',').map(s=>s.trim()).filter(Boolean)
//                                   if (raw.length === 0) { setMessage('Please enter at least one recipient'); return }
//                                   try {
//                                     const res = await api.post(`/api/registration/event/${ev.id}/send-attendance`, { recipients: raw })
//                                     const cnt = res?.data?.count
//                                     setPopup({ open: true, text: `Attendance sent to ${raw.length} recipient(s).${typeof cnt==='number' ? ` Checked-in rows: ${cnt}.` : ''}` })
//                                   } catch (e) {
//                                     setMessage('Failed to send attendance')
//                                   }
//                                 }}>Send Attendance</Button>
//                               </div>
//                             </div>
//                           </div>
//                           {regsByEvent[ev.id].map(r => {
//                             let ans = null
//                             try { ans = r.answers ? (typeof r.answers === 'string' ? JSON.parse(r.answers) : r.answers) : null } catch {}
//                             const isOpen = expandedAnswers.has(r.id)
//                             const toggleAns = () => {
//                               const next = new Set(expandedAnswers)
//                               next[isOpen ? 'delete' : 'add'](r.id)
//                               setExpandedAnswers(next)
//                             }
//                             const answerCount = ans ? Object.keys(ans).length : 0
//                             return (
//                             <div key={r.id} className="card">
//                               <div className="row" style={{marginBottom:4}}><strong>{r.name}</strong> — {r.email}</div>
//                               {r.contact && <div className="row" style={{margin:0}}>Contact: {r.contact}</div>}
//                               <div className="row" style={{marginTop:4}}>Checked In: {r.checkedIn ? 'Yes' : 'No'}</div>
//                               {ans && (
//                                 <div className="row" style={{marginTop:6}}>
//                                   <Button type="button" variant="outline" onClick={toggleAns} style={{padding:'6px 10px'}}>
//                                     {isOpen ? 'Hide answers' : `Show answers (${answerCount})`}
//                                   </Button>
//                                   {isOpen && (
//                                     <div style={{marginTop:8}}>
//                                       <div style={{fontSize:14, color:'var(--muted)'}}>Answers</div>
//                                       <ul style={{margin:'6px 0 0 16px', padding:0}}>
//                                         {Object.entries(ans).map(([k,v]) => (
//                                           <li key={k} style={{margin:'2px 0'}}>
//                                             <strong>{k}:</strong> {Array.isArray(v) ? v.join(', ') : String(v)}
//                                           </li>
//                                         ))}
//                                       </ul>
//                                     </div>
//                                   )}
//                                 </div>
//                               )}
//                             </div>
//                             )
//                           })}
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }


// import { useEffect, useState } from 'react'
// import { api } from '../api'

// export default function AdminDashboard() {
//   const [events, setEvents] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [message, setMessage] = useState('')
//   const [regsByEvent, setRegsByEvent] = useState({})
//   const [openEventIds, setOpenEventIds] = useState(new Set())
//   const [loadingEventId, setLoadingEventId] = useState(null)
//   const [sendTo, setSendTo] = useState({})
//   const [overview, setOverview] = useState({ totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 })
//   const [unowned, setUnowned] = useState([])
//   const [popup, setPopup] = useState({ open: false, text: '' })
//   const [deletingId, setDeletingId] = useState(null)
//   const [expandedAnswers, setExpandedAnswers] = useState(new Set())

//   const load = async () => {
//     setLoading(true)
//     try {
//       const { data } = await api.get('/api/events/mine')
//       setEvents(data)
//       const ov = await api.get('/api/events/overview')
//       setOverview(ov.data || { totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 })
//       const u = await api.get('/api/events/unowned')
//       setUnowned(u.data || [])
//     } catch (e) {
//       setMessage('Failed to load events')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const claim = async (id) => {
//     try {
//       await api.post(`/api/events/${id}/claim`)
//       setMessage('Event claimed successfully')
//       await load()
//     } catch (e) {
//       setMessage(e?.response?.data?.error || 'Failed to claim event')
//     }
//   }

//   useEffect(() => { load() }, [])

//   const remove = async (id) => {
//     if (!confirm('Are you sure you want to delete this event?')) return
//     try {
//       setDeletingId(id)
//       await api.delete(`/api/events/${id}`)
//       setMessage('Event deleted successfully')
//       load()
//     } catch (e) {
//       setMessage('Delete failed')
//     } finally { 
//       setDeletingId(null) 
//     }
//   }

//   const reloadRegs = async (eventId) => {
//     try {
//       setLoadingEventId(eventId)
//       const { data } = await api.get(`/api/registration/event/${eventId}`)
//       setRegsByEvent(prev => ({ ...prev, [eventId]: data }))
//     } catch (e) {
//       setMessage('Failed to load registrations')
//     } finally {
//       setLoadingEventId(null)
//     }
//   }

//   const toggleRegs = async (eventId) => {
//     const next = new Set(openEventIds)
//     if (next.has(eventId)) {
//       next.delete(eventId)
//       setOpenEventIds(next)
//       return
//     }
//     next.add(eventId)
//     setOpenEventIds(next)
//     await reloadRegs(eventId)
//   }

//   const clearMessage = () => setMessage('')

//   return (
//     <div className="container">
//       {/* Popup Modal */}
//       {popup.open && (
//         <div className="modal-overlay" onClick={() => setPopup({ open:false, text:'' })}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h3>Success</h3>
//               <button className="close-btn" onClick={() => setPopup({ open:false, text:'' })}>
//                 <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                   <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                 </svg>
//               </button>
//             </div>
//             <div className="modal-body">
//               <p>{popup.text || 'Attendance sent successfully'}</p>
//             </div>
//             <div className="modal-footer">
//               <button className="primary-btn" onClick={() => setPopup({ open:false, text:'' })}>
//                 OK
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="dashboard-header">
//         <h1>Admin Dashboard</h1>
//         <div className="user-info">
//           <span className="user-label">Signed in as:</span>
//           <span className="user-name">
//             {(JSON.parse(localStorage.getItem('auth_user')||'{}').name)||'Admin'}
//           </span>
//         </div>
//       </div>

//       {message && (
//         <div className="alert fade-in">
//           <div className="alert-content">
//             <span>{message}</span>
//             <button className="alert-close" onClick={clearMessage}>
//               <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                 <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Analytics Summary */}
//       <div className="analytics-grid">
//         <div className="stat-card fade-in">
//           <div className="stat-icon">
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//               <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <div className="stat-content">
//             <div className="stat-label">My Events</div>
//             <div className="stat-value">{overview.totalEvents}</div>
//           </div>
//         </div>
        
//         <div className="stat-card fade-in">
//           <div className="stat-icon">
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//               <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M22 21V19C21.9999 17.8755 21.6298 16.7827 20.944 15.8848C20.2581 14.9869 19.2973 14.3355 18.215 14.03" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <div className="stat-content">
//             <div className="stat-label">Registrations</div>
//             <div className="stat-value">{overview.totalRegistrations}</div>
//           </div>
//         </div>
        
//         <div className="stat-card fade-in">
//           <div className="stat-icon">
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//               <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <div className="stat-content">
//             <div className="stat-label">Checked-In</div>
//             <div className="stat-value">{overview.totalCheckedIn}</div>
//           </div>
//         </div>
//       </div>

//       {/* Legacy Events */}
//       {unowned.length > 0 && (
//         <section className="legacy-section">
//           <div className="section-header">
//             <h2>Legacy Events</h2>
//             <p>Claim ownership to manage these events</p>
//           </div>
//           <div className="events-grid">
//             {unowned.map(ev => (
//               <div className="event-card" key={ev.id}>
//                 <div className="event-header">
//                   <h3 className="event-name">{ev.name}</h3>
//                 </div>
//                 <div className="event-details">
//                   <div className="detail-item">
//                     <span className="detail-label">Date:</span>
//                     <span className="detail-value">{new Date(ev.date).toLocaleString()}</span>
//                   </div>
//                   <div className="detail-item">
//                     <span className="detail-label">Venue:</span>
//                     <span className="detail-value">{ev.venue}</span>
//                   </div>
//                 </div>
//                 <div className="event-actions">
//                   <button className="claim-btn" onClick={() => claim(ev.id)}>
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                     Claim Event
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* My Events */}
//       <section className="events-section">
//         <div className="section-header">
//           <h2>My Events</h2>
//         </div>

//         {loading ? (
//           <div className="loading-container">
//             <div className="loading-spinner"></div>
//             <p>Loading events...</p>
//           </div>
//         ) : (
//           <div className="events-list">
//             {events.length === 0 && (
//               <div className="empty-state">
//                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
//                   <path d="M8 6H20C21.1046 6 22 6.89543 22 8V16C22 17.1046 21.1046 18 20 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   <path d="M16 18V20C16 21.1046 15.1046 22 14 22H6C4.89543 22 4 21.1046 4 20V12C4 10.8954 4.89543 10 6 10H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//                 <h3>No events yet</h3>
//                 <p>Create your first event to get started</p>
//               </div>
//             )}

//             {events.map(ev => (
//               <div className="event-card expandable" key={ev.id}>
//                 {ev.poster && (
//                   <div className="event-poster">
//                     <img 
//                       src={typeof ev.poster === 'string' ? ev.poster : ''} 
//                       alt={`${ev.name} poster`} 
//                     />
//                   </div>
//                 )}
                
//                 <div className="event-content">
//                   <div className="event-header">
//                     <h3 className="event-name">{ev.name}</h3>
//                     <div className="event-actions">
//                       <button 
//                         className="toggle-regs-btn" 
//                         onClick={() => toggleRegs(ev.id)}
//                       >
//                         {openEventIds.has(ev.id) ? (
//                           <>
//                             <span>Hide Registrations</span>
//                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                               <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                             </svg>
//                           </>
//                         ) : (
//                           <>
//                             <span>View Registrations</span>
//                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                               <path d="M6 15L12 9L18 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                             </svg>
//                           </>
//                         )}
//                       </button>
//                       <button 
//                         className="delete-btn" 
//                         onClick={() => remove(ev.id)} 
//                         disabled={deletingId===ev.id}
//                       >
//                         {deletingId===ev.id ? (
//                           <>
//                             <div className="spinner-small"></div>
//                             <span>Deleting...</span>
//                           </>
//                         ) : (
//                           <>
//                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                               <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                               <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                             </svg>
//                             <span>Delete</span>
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
                  
//                   <div className="event-details">
//                     <div className="detail-item">
//                       <span className="detail-label">Date:</span>
//                       <span className="detail-value">{new Date(ev.date).toLocaleString()}</span>
//                     </div>
//                     <div className="detail-item">
//                       <span className="detail-label">Venue:</span>
//                       <span className="detail-value">{ev.venue}</span>
//                     </div>
//                     {ev.speaker && (
//                       <div className="detail-item">
//                         <span className="detail-label">Speaker:</span>
//                         <span className="detail-value">{ev.speaker}</span>
//                       </div>
//                     )}
//                     {ev.food && (
//                       <div className="detail-item">
//                         <span className="detail-label">Food:</span>
//                         <span className="detail-value">{ev.food}</span>
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Registrations Section */}
//                   {openEventIds.has(ev.id) && (
//                     <div className="registrations-section slide-down">
//                       {loadingEventId === ev.id ? (
//                         <div className="loading-registrations">
//                           <div className="loading-spinner-small"></div>
//                           <span>Loading registrants...</span>
//                         </div>
//                       ) : (
//                         <>
//                           {(!regsByEvent[ev.id] || regsByEvent[ev.id].length === 0) ? (
//                             <div className="empty-registrations">
//                               <p>No registrations yet.</p>
//                             </div>
//                           ) : (
//                             <div className="registrations-container">
//                               <div className="registrations-summary">
//                                 <h4>Registration Summary</h4>
//                                 <div className="summary-stats">
//                                   <div className="summary-stat">
//                                     <span className="stat-label">Total:</span>
//                                     <span className="stat-value">{regsByEvent[ev.id].length}</span>
//                                   </div>
//                                   <div className="summary-stat">
//                                     <span className="stat-label">Checked-in:</span>
//                                     <span className="stat-value checked-in">
//                                       {regsByEvent[ev.id].filter(r => r.checkedIn).length}
//                                     </span>
//                                   </div>
//                                 </div>
//                                 <div className="summary-actions">
//                                   <button 
//                                     className="refresh-btn" 
//                                     onClick={() => reloadRegs(ev.id)}
//                                   >
//                                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                                       <path d="M23 4V10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                       <path d="M1 20V14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                       <path d="M3.51 9C4.01717 7.56678 4.87913 6.2854 6.01547 5.27542C7.1518 4.26543 8.52547 3.55976 10.0083 3.22426C11.4911 2.88875 13.0348 2.93434 14.4952 3.35677C15.9556 3.77921 17.2853 4.56471 18.36 5.64L23 10M1 14L5.64 18.36C6.71475 19.4353 8.04437 20.2208 9.50481 20.6432C10.9652 21.0657 12.5089 21.1113 13.9917 20.7757C15.4745 20.4402 16.8482 19.7346 17.9845 18.7246C19.1209 17.7146 19.9828 16.4332 20.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                     </svg>
//                                     <span>Refresh</span>
//                                   </button>
//                                 </div>
                                
//                                 <div className="email-section">
//                                   <label className="email-label">
//                                     Recipients (comma separated emails)
//                                   </label>
//                                   <input 
//                                     className="email-input"
//                                     value={sendTo[ev.id]||''} 
//                                     onChange={e => setSendTo(prev => ({...prev, [ev.id]: e.target.value}))} 
//                                     placeholder="dean@college.edu, hod@dept.edu" 
//                                   />
//                                   <button 
//                                     className="send-attendance-btn primary-btn"
//                                     onClick={async () => {
//                                       const raw = (sendTo[ev.id]||'').split(',').map(s=>s.trim()).filter(Boolean)
//                                       if (raw.length === 0) { 
//                                         setMessage('Please enter at least one recipient'); 
//                                         return 
//                                       }
//                                       try {
//                                         const res = await api.post(`/api/registration/event/${ev.id}/send-attendance`, { recipients: raw })
//                                         const cnt = res?.data?.count
//                                         setPopup({ 
//                                           open: true, 
//                                           text: `Attendance sent to ${raw.length} recipient(s).${typeof cnt==='number' ? ` Checked-in rows: ${cnt}.` : ''}` 
//                                         })
//                                       } catch (e) {
//                                         setMessage('Failed to send attendance')
//                                       }
//                                     }}
//                                   >
//                                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                                       <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                     </svg>
//                                     <span>Send Attendance</span>
//                                   </button>
//                                 </div>
//                               </div>
                              
//                               <div className="registrations-list">
//                                 <h4>Registrants</h4>
//                                 <div className="registrants-grid">
//                                   {regsByEvent[ev.id].map(r => {
//                                     let ans = null
//                                     try { 
//                                       ans = r.answers ? (typeof r.answers === 'string' ? JSON.parse(r.answers) : r.answers) : null 
//                                     } catch {}
//                                     const isOpen = expandedAnswers.has(r.id)
//                                     const toggleAns = () => {
//                                       const next = new Set(expandedAnswers)
//                                       next[isOpen ? 'delete' : 'add'](r.id)
//                                       setExpandedAnswers(next)
//                                     }
//                                     const answerCount = ans ? Object.keys(ans).length : 0
                                    
//                                     return (
//                                       <div key={r.id} className="registrant-card">
//                                         <div className="registrant-header">
//                                           <div className="registrant-info">
//                                             <h5 className="registrant-name">{r.name}</h5>
//                                             <span className="registrant-email">{r.email}</span>
//                                           </div>
//                                           <div className="registrant-status">
//                                             <span className={`status-badge ${r.checkedIn ? 'checked-in' : 'not-checked-in'}`}>
//                                               {r.checkedIn ? 'Checked In' : 'Not Checked In'}
//                                             </span>
//                                           </div>
//                                         </div>
                                        
//                                         {r.contact && (
//                                           <div className="registrant-contact">
//                                             <span className="contact-label">Contact:</span>
//                                             <span className="contact-value">{r.contact}</span>
//                                           </div>
//                                         )}
                                        
//                                         {ans && (
//                                           <div className="answers-section">
//                                             <button 
//                                               className="toggle-answers-btn" 
//                                               onClick={toggleAns}
//                                             >
//                                               {isOpen ? (
//                                                 <>
//                                                   <span>Hide Answers</span>
//                                                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//                                                     <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                                   </svg>
//                                                 </>
//                                               ) : (
//                                                 <>
//                                                   <span>Show Answers ({answerCount})</span>
//                                                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//                                                     <path d="M6 15L12 9L18 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                                   </svg>
//                                                 </>
//                                               )}
//                                             </button>
                                            
//                                             {isOpen && (
//                                               <div className="answers-list slide-down">
//                                                 <h6>Registration Answers</h6>
//                                                 <div className="answers-grid">
//                                                   {Object.entries(ans).map(([k,v]) => (
//                                                     <div key={k} className="answer-item">
//                                                       <span className="answer-question">{k}:</span>
//                                                       <span className="answer-value">
//                                                         {Array.isArray(v) ? v.join(', ') : String(v)}
//                                                       </span>
//                                                     </div>
//                                                   ))}
//                                                 </div>
//                                               </div>
//                                             )}
//                                           </div>
//                                         )}
//                                       </div>
//                                     )
//                                   })}
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       <style jsx>{`
//         /* Dashboard Header */
//         .dashboard-header {
//           margin-bottom: 24px;
//         }

//         .dashboard-header h1 {
//           margin: 0 0 8px 0;
//           font-size: 2.25rem;
//           font-weight: 800;
//           background: linear-gradient(90deg, var(--primary), var(--primary-600));
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .user-info {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           color: var(--muted);
//           font-size: 0.95rem;
//         }

//         .user-label {
//           color: var(--muted);
//         }

//         .user-name {
//           font-weight: 600;
//           color: var(--text);
//         }

//         /* Analytics Grid */
//         .analytics-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
//           gap: 16px;
//           margin-bottom: 32px;
//         }

//         .stat-card {
//           background: var(--card);
//           border: 1px solid var(--border);
//           border-radius: 14px;
//           padding: 20px;
//           display: flex;
//           align-items: center;
//           gap: 16px;
//           box-shadow: var(--shadow);
//           transition: all 0.3s ease;
//         }

//         .stat-card:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
//         }

//         .stat-icon {
//           width: 48px;
//           height: 48px;
//           border-radius: 12px;
//           background: linear-gradient(135deg, var(--primary), var(--primary-600));
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//           flex-shrink: 0;
//         }

//         .stat-content {
//           flex: 1;
//         }

//         .stat-label {
//           font-size: 0.9rem;
//           color: var(--muted);
//           margin-bottom: 4px;
//         }

//         .stat-value {
//           font-size: 2rem;
//           font-weight: 800;
//           color: var(--text);
//           line-height: 1;
//         }

//         /* Sections */
//         .section-header {
//           margin-bottom: 20px;
//         }

//         .section-header h2 {
//           font-size: 1.5rem;
//           font-weight: 700;
//           color: var(--text);
//           margin: 0 0 4px 0;
//         }

//         .section-header p {
//           color: var(--muted);
//           margin: 0;
//           font-size: 0.95rem;
//         }

//         /* Legacy Events */
//         .legacy-section {
//           margin-bottom: 32px;
//         }

//         .events-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//           gap: 16px;
//         }

//         /* Event Cards */
//         .events-section {
//           margin-bottom: 32px;
//         }

//         .events-list {
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//         }

//         .event-card {
//           background: var(--card);
//           border: 1px solid var(--border);
//           border-radius: 14px;
//           overflow: hidden;
//           box-shadow: var(--shadow);
//           transition: all 0.3s ease;
//         }

//         .event-card:hover {
//           border-color: var(--primary);
//           box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
//         }

//         .event-poster {
//           width: 100%;
//           height: 180px;
//           overflow: hidden;
//         }

//         .event-poster img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .event-content {
//           padding: 20px;
//         }

//         .event-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-bottom: 16px;
//           gap: 16px;
//         }

//         .event-name {
//           font-size: 1.25rem;
//           font-weight: 700;
//           color: var(--text);
//           margin: 0;
//           flex: 1;
//         }

//         .event-actions {
//           display: flex;
//           gap: 8px;
//           flex-wrap: wrap;
//         }

//         .event-details {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//           margin-bottom: 16px;
//         }

//         .detail-item {
//           display: flex;
//           gap: 8px;
//         }

//         .detail-label {
//           font-weight: 600;
//           color: var(--muted);
//           min-width: 60px;
//         }

//         .detail-value {
//           color: var(--text);
//         }

//         /* Buttons */
//         button {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 10px 16px;
//           border-radius: 10px;
//           font-weight: 600;
//           font-size: 0.875rem;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           border: none;
//           outline: none;
//         }

//         .primary-btn {
//           background: linear-gradient(180deg, var(--primary), var(--primary-600));
//           color: white;
//           box-shadow: var(--shadow);
//         }

//         .primary-btn:hover {
//           filter: brightness(1.05);
//           transform: translateY(-1px);
//         }

//         .toggle-regs-btn {
//           background: var(--card);
//           color: var(--text);
//           border: 1px solid var(--border);
//         }

//         .toggle-regs-btn:hover {
//           background: rgba(255, 255, 255, 0.05);
//           border-color: var(--primary);
//         }

//         .delete-btn {
//           background: rgba(239, 68, 68, 0.1);
//           color: #ef4444;
//           border: 1px solid rgba(239, 68, 68, 0.3);
//         }

//         .delete-btn:hover:not(:disabled) {
//           background: rgba(239, 68, 68, 0.2);
//           transform: translateY(-1px);
//         }

//         .delete-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .claim-btn {
//           background: rgba(34, 197, 94, 0.1);
//           color: #22c55e;
//           border: 1px solid rgba(34, 197, 94, 0.3);
//         }

//         .claim-btn:hover {
//           background: rgba(34, 197, 94, 0.2);
//           transform: translateY(-1px);
//         }

//         .refresh-btn {
//           background: rgba(255, 255, 255, 0.05);
//           color: var(--text);
//           border: 1px solid var(--border);
//         }

//         .refresh-btn:hover {
//           background: rgba(255, 255, 255, 0.1);
//         }

//         .toggle-answers-btn {
//           background: rgba(255, 255, 255, 0.05);
//           color: var(--text);
//           border: 1px solid var(--border);
//           font-size: 0.8rem;
//           padding: 6px 12px;
//         }

//         .toggle-answers-btn:hover {
//           background: rgba(255, 255, 255, 0.1);
//         }

//         /* Registrations Section */
//         .registrations-section {
//           margin-top: 20px;
//           border-top: 1px solid var(--border);
//           padding-top: 20px;
//         }

//         .loading-registrations {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 20px;
//           justify-content: center;
//           color: var(--muted);
//         }

//         .empty-registrations {
//           padding: 20px;
//           text-align: center;
//           color: var(--muted);
//         }

//         .registrations-container {
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//         }

//         .registrations-summary {
//           background: rgba(255, 255, 255, 0.05);
//           border-radius: 12px;
//           padding: 20px;
//         }

//         .registrations-summary h4 {
//           margin: 0 0 16px 0;
//           color: var(--text);
//           font-size: 1.125rem;
//         }

//         .summary-stats {
//           display: flex;
//           gap: 24px;
//           margin-bottom: 16px;
//         }

//         .summary-stat {
//           display: flex;
//           flex-direction: column;
//         }

//         .stat-label {
//           font-size: 0.875rem;
//           color: var(--muted);
//           margin-bottom: 4px;
//         }

//         .stat-value {
//           font-size: 1.5rem;
//           font-weight: 700;
//           color: var(--text);
//         }

//         .stat-value.checked-in {
//           color: #22c55e;
//         }

//         .summary-actions {
//           margin-bottom: 20px;
//         }

//         .email-section {
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//         }

//         .email-label {
//           font-size: 0.875rem;
//           font-weight: 600;
//           color: var(--text);
//         }

//         .email-input {
//           background: var(--bg);
//           border: 1px solid var(--border);
//           border-radius: 8px;
//           padding: 12px;
//           color: var(--text);
//           font-size: 0.875rem;
//           transition: all 0.2s;
//         }

//         .email-input:focus {
//           outline: none;
//           border-color: var(--primary);
//           box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
//         }

//         .email-input::placeholder {
//           color: var(--muted);
//         }

//         .send-attendance-btn {
//           align-self: flex-start;
//         }

//         /* Registrations List */
//         .registrations-list h4 {
//           margin: 0 0 16px 0;
//           color: var(--text);
//           font-size: 1.125rem;
//         }

//         .registrants-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//           gap: 16px;
//         }

//         .registrant-card {
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid var(--border);
//           border-radius: 12px;
//           padding: 16px;
//           transition: all 0.2s;
//         }

//         .registrant-card:hover {
//           border-color: var(--primary);
//           transform: translateY(-1px);
//         }

//         .registrant-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-bottom: 12px;
//           gap: 12px;
//         }

//         .registrant-info {
//           flex: 1;
//         }

//         .registrant-name {
//           font-size: 1rem;
//           font-weight: 600;
//           color: var(--text);
//           margin: 0 0 4px 0;
//         }

//         .registrant-email {
//           font-size: 0.875rem;
//           color: var(--muted);
//         }

//         .registrant-status {
//           flex-shrink: 0;
//         }

//         .status-badge {
//           display: inline-block;
//           padding: 4px 8px;
//           border-radius: 20px;
//           font-size: 0.75rem;
//           font-weight: 600;
//         }

//         .status-badge.checked-in {
//           background: rgba(34, 197, 94, 0.2);
//           color: #22c55e;
//           border: 1px solid rgba(34, 197, 94, 0.3);
//         }

//         .status-badge.not-checked-in {
//           background: rgba(100, 116, 139, 0.2);
//           color: #64748b;
//           border: 1px solid rgba(100, 116, 139, 0.3);
//         }

//         .registrant-contact {
//           display: flex;
//           gap: 6px;
//           margin-bottom: 12px;
//           font-size: 0.875rem;
//         }

//         .contact-label {
//           font-weight: 600;
//           color: var(--muted);
//         }

//         .contact-value {
//           color: var(--text);
//         }

//         /* Answers Section */
//         .answers-section {
//           margin-top: 12px;
//         }

//         .answers-list {
//           margin-top: 12px;
//         }

//         .answers-list h6 {
//           margin: 0 0 8px 0;
//           color: var(--text);
//           font-size: 0.875rem;
//         }

//         .answers-grid {
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

//         .answer-item {
//           display: flex;
//           gap: 8px;
//           padding: 8px;
//           background: rgba(255, 255, 255, 0.03);
//           border-radius: 6px;
//           font-size: 0.875rem;
//         }

//         .answer-question {
//           font-weight: 600;
//           color: var(--muted);
//           min-width: 120px;
//         }

//         .answer-value {
//           color: var(--text);
//           flex: 1;
//         }

//         /* Modal */
//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(0, 0, 0, 0.7);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           z-index: 1000;
//           backdrop-filter: blur(5px);
//         }

//         .modal-content {
//           background: var(--card);
//           border: 1px solid var(--border);
//           border-radius: 14px;
//           width: 90%;
//           max-width: 400px;
//           box-shadow: var(--shadow);
//           overflow: hidden;
//         }

//         .modal-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 20px 20px 0;
//         }

//         .modal-header h3 {
//           margin: 0;
//           color: var(--text);
//           font-size: 1.25rem;
//         }

//         .close-btn {
//           background: none;
//           border: none;
//           color: var(--muted);
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 4px;
//           border-radius: 4px;
//           transition: all 0.2s;
//         }

//         .close-btn:hover {
//           background: rgba(255, 255, 255, 0.1);
//           color: var(--text);
//         }

//         .modal-body {
//           padding: 20px;
//         }

//         .modal-body p {
//           margin: 0;
//           color: var(--text);
//           line-height: 1.5;
//         }

//         .modal-footer {
//           padding: 0 20px 20px;
//           display: flex;
//           justify-content: center;
//         }

//         /* Loading States */
//         .loading-container {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           padding: 60px 20px;
//           gap: 16px;
//           color: var(--muted);
//         }

//         .loading-spinner {
//           width: 40px;
//           height: 40px;
//           border: 3px solid rgba(255, 255, 255, 0.1);
//           border-left: 3px solid var(--primary);
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         .loading-spinner-small {
//           width: 20px;
//           height: 20px;
//           border: 2px solid rgba(255, 255, 255, 0.1);
//           border-left: 2px solid var(--primary);
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         .spinner-small {
//           width: 16px;
//           height: 16px;
//           border: 2px solid rgba(255, 255, 255, 0.3);
//           border-left: 2px solid currentColor;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         /* Empty State */
//         .empty-state {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           padding: 60px 20px;
//           text-align: center;
//           color: var(--muted);
//         }

//         .empty-state svg {
//           margin-bottom: 16px;
//           color: var(--muted);
//         }

//         .empty-state h3 {
//           margin: 0 0 8px 0;
//           color: var(--text);
//           font-size: 1.125rem;
//         }

//         .empty-state p {
//           margin: 0;
//           font-size: 0.875rem;
//         }

//         /* Alert */
//         .alert {
//           background: rgba(160, 107, 43, 0.12);
//           color: #2b2116;
//           padding: 12px 16px;
//           border: 1px solid rgba(160, 107, 43, 0.28);
//           border-radius: 10px;
//           margin-bottom: 20px;
//         }

//         .alert-content {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           width: 100%;
//         }

//         .alert-close {
//           background: none;
//           border: none;
//           color: inherit;
//           cursor: pointer;
//           padding: 4px;
//           border-radius: 4px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: background-color 0.2s;
//         }

//         .alert-close:hover {
//           background: rgba(0, 0, 0, 0.1);
//         }

//         /* Animations */
//         .slide-down {
//           animation: slideDown 0.3s ease-out;
//         }

//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         /* Responsive Design */
//         @media (max-width: 768px) {
//           .analytics-grid {
//             grid-template-columns: 1fr;
//           }

//           .event-header {
//             flex-direction: column;
//             align-items: flex-start;
//           }

//           .event-actions {
//             width: 100%;
//             justify-content: flex-start;
//           }

//           .summary-stats {
//             flex-direction: column;
//             gap: 12px;
//           }

//           .registrants-grid {
//             grid-template-columns: 1fr;
//           }

//           .modal-content {
//             width: 95%;
//             margin: 20px;
//           }
//         }

//         @media (max-width: 480px) {
//           .event-actions {
//             flex-direction: column;
//           }

//           .event-actions button {
//             width: 100%;
//             justify-content: center;
//           }

//           .send-attendance-btn {
//             align-self: stretch;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }



import { useEffect, useState } from 'react'
import { api } from '../api'

export default function AdminDashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [regsByEvent, setRegsByEvent] = useState({})
  const [openEventIds, setOpenEventIds] = useState(new Set())
  const [loadingEventId, setLoadingEventId] = useState(null)
  const [sendTo, setSendTo] = useState({})
  const [overview, setOverview] = useState({ totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 })
  const [unowned, setUnowned] = useState([])
  const [popup, setPopup] = useState({ open: false, text: '' })
  const [deletingId, setDeletingId] = useState(null)
  const [expandedAnswers, setExpandedAnswers] = useState(new Set())
  const [departmentFilters, setDepartmentFilters] = useState({})
  const user = (() => { try { return JSON.parse(localStorage.getItem('auth_user')||'null') } catch { return null } })()
  const isSuper = user?.role === 'superadmin'
  const [perAdminStats, setPerAdminStats] = useState([])
  const [capForm, setCapForm] = useState({}) // eventId -> { enforced, cap }

  const DEPT_MAP = {
    '66': 'AIML',
    '24': 'AE',
    '01': 'Civil',
    '32': 'CSBS',
    '05': 'CSE',
    '62': 'Cys',
    '67': 'CSE-DS',
    '04': 'ECE',
    '02': 'EEE',
    '10': 'EIE',
    '69': 'IoT',
    '03': 'ME',
    '12': 'IT',
  }

  const getDeptFromEmail = (email) => {
    if (!email) return { code: '', name: 'Unknown' }
    const local = String(email).split('@')[0] || ''
    const m = local.match(/A(\d{2})/i)
    const code = m ? m[1] : ''
    const name = code && DEPT_MAP[code] ? DEPT_MAP[code] : 'Unknown'
    return { code, name }
  }

  const load = async () => {
    setLoading(true)
    try {
      if (isSuper) {
        const [all, perAdmin] = await Promise.all([
          api.get('/api/events/all'),
          api.get('/api/events/overview/all')
        ])
        setEvents(all.data || [])
        // Aggregate totals for header cards
        const rows = Array.isArray(perAdmin.data) ? perAdmin.data : []
        setPerAdminStats(rows)
        const totals = rows.reduce((acc, r) => {
          acc.totalEvents += Number(r.totalEvents || 0)
          acc.totalRegistrations += Number(r.totalRegistrations || 0)
          acc.totalCheckedIn += Number(r.totalCheckedIn || 0)
          return acc
        }, { totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 })
        setOverview(totals)
        setUnowned([])
      } else {
        const { data } = await api.get('/api/events/mine')
        setEvents(data)
        const ov = await api.get('/api/events/overview')
        setOverview(ov.data || { totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 })
        const u = await api.get('/api/events/unowned')
        setUnowned(u.data || [])
      }
    } catch (e) {
      setMessage('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const claim = async (id) => {
    try {
      await api.post(`/api/events/${id}/claim`)
      setMessage('Event claimed successfully')
      await load()
    } catch (e) {
      setMessage(e?.response?.data?.error || 'Failed to claim event')
    }
  }

  useEffect(() => { load() }, [])

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    try {
      setDeletingId(id)
      await api.delete(`/api/events/${id}`)
      setMessage('Event deleted successfully')
      load()
    } catch (e) {
      setMessage('Delete failed')
    } finally { 
      setDeletingId(null) 
    }
  }

  const toggleRegistration = async (ev) => {
    try {
      const nextClosed = Number(ev.regClosed || 0) === 1 ? false : true
      await api.post(`/api/events/${ev.id}/reg-toggle`, { closed: nextClosed })
      setMessage(nextClosed ? 'Registrations closed' : 'Registrations opened')
      await load()
    } catch (e) {
      setMessage('Failed to toggle registrations')
    }
  }

  const reloadRegs = async (eventId) => {
    try {
      setLoadingEventId(eventId)
      const { data } = await api.get(`/api/registration/event/${eventId}`)
      setRegsByEvent(prev => ({ ...prev, [eventId]: data }))
    } catch (e) {
      setMessage('Failed to load registrations')
    } finally {
      setLoadingEventId(null)
    }
  }

  const toggleRegs = async (eventId) => {
    const next = new Set(openEventIds)
    if (next.has(eventId)) {
      next.delete(eventId)
      setOpenEventIds(next)
      return
    }
    next.add(eventId)
    setOpenEventIds(next)
    await reloadRegs(eventId)
  }

  const handleDepartmentFilterChange = (eventId, value) => {
    setDepartmentFilters(prev => ({
      ...prev,
      [eventId]: value
    }))
  }

  const toggleAnswers = (registrantId) => {
    const next = new Set(expandedAnswers)
    if (next.has(registrantId)) {
      next.delete(registrantId)
    } else {
      next.add(registrantId)
    }
    setExpandedAnswers(next)
  }

  const sendAttendance = async (eventId) => {
    const raw = (sendTo[eventId] || '').split(',').map(s => s.trim()).filter(Boolean)
    if (raw.length === 0) {
      setMessage('Please enter at least one recipient')
      return
    }
    try {
      await api.post(`/api/registration/event/${eventId}/send-attendance`, { recipients: raw })
      setPopup({ open: true, text: 'Attendance list sent successfully!' })
      setSendTo(prev => ({ ...prev, [eventId]: '' }))
    } catch (e) {
      setMessage('Failed to send attendance list')
    }
  }

  const clearMessage = () => setMessage('')

  return (
    <div className="container">
      {/* Popup Modal */}
      {popup.open && (
        <div className="modal-overlay" onClick={() => setPopup({ open:false, text:'' })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Success</h3>
              <button className="close-btn" onClick={() => setPopup({ open:false, text:'' })}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

      {isSuper && perAdminStats.length > 0 && (
        <section className="events-section" style={{marginTop: 16}}>
          <div className="section-header">
            <h2>Per-Admin Statistics</h2>
            <p>Total events, registrations, and check-ins by admin</p>
          </div>
          <div className="card" style={{overflowX:'auto'}}>
            <table className="table" style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr>
                  <th style={{textAlign:'left', padding:'8px'}}>Admin Email</th>
                  <th style={{textAlign:'right', padding:'8px'}}>Events</th>
                  <th style={{textAlign:'right', padding:'8px'}}>Registrations</th>
                  <th style={{textAlign:'right', padding:'8px'}}>Checked-In</th>
                </tr>
              </thead>
              <tbody>
                {perAdminStats.map(r => (
                  <tr key={r.adminEmail || 'unknown'}>
                    <td style={{padding:'8px'}}>{r.adminEmail || '—'}</td>
                    <td style={{padding:'8px', textAlign:'right'}}>{r.totalEvents || 0}</td>
                    <td style={{padding:'8px', textAlign:'right'}}>{r.totalRegistrations || 0}</td>
                    <td style={{padding:'8px', textAlign:'right'}}>{r.totalCheckedIn || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
            <div className="modal-body">
              <p>{popup.text || 'Attendance sent successfully'}</p>
            </div>
            <div className="modal-footer">
              <button className="primary-btn" onClick={() => setPopup({ open:false, text:'' })}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-header">
        <h1>{isSuper ? 'Super Admin Dashboard' : 'Admin Dashboard'}</h1>
        <div className="user-info">
          <span className="user-label">Signed in as:</span>
          <span className="user-name">
            {(JSON.parse(localStorage.getItem('auth_user')||'{}').name)||'Admin'}
          </span>
        </div>
      </div>

      {message && (
        <div className="alert fade-in">
          <div className="alert-content">
            <span>{message}</span>
            <button className="alert-close" onClick={clearMessage}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Analytics Summary */}
      <div className="analytics-grid">
        <div className="stat-card fade-in">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">My Events</div>
            <div className="stat-value">{overview.totalEvents}</div>
          </div>
        </div>
        
        <div className="stat-card fade-in">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H6C4.93913 15 3.92172 15.4214 3.17157 16.1716C2.42143 16.9217 2 17.9391 2 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 21V19C21.9999 17.8755 21.6298 16.7827 20.944 15.8848C20.2581 14.9869 19.2973 14.3355 18.215 14.03" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Registrations</div>
            <div className="stat-value">{overview.totalRegistrations}</div>
          </div>
        </div>
        
        <div className="stat-card fade-in">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Checked-In</div>
            <div className="stat-value">{overview.totalCheckedIn}</div>
          </div>
        </div>
      </div>

      {/* Legacy Events */}
      {unowned.length > 0 && (
        <section className="legacy-section">
          <div className="section-header">
            <h2>Legacy Events</h2>
            <p>Claim ownership to manage these events</p>
          </div>
          <div className="events-grid">
            {unowned.map(ev => (
              <div className="event-card" key={ev.id}>
                <div className="event-header">
                  <h3 className="event-name">{ev.name}</h3>
                </div>
                <div className="event-details">
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{new Date(ev.date).toLocaleString()}</span>
                  </div>
                  {/* Capacity editor */}
                  <div className="event-details" style={{marginTop: 8}}>
                    <div className="detail-item">
                      <span className="detail-label">Limit registrations:</span>
                      <span className="detail-value">
                        <input
                          type="checkbox"
                          checked={(capForm[ev.id]?.enforced) ?? (Number(ev.regCapEnforced||0)===1)}
                          onChange={e => setCapForm(prev => ({
                            ...prev,
                            [ev.id]: {
                              enforced: e.target.checked,
                              cap: (prev[ev.id]?.cap ?? Number(ev.regCap||0))
                            }
                          }))}
                        />
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Max registrations:</span>
                      <span className="detail-value">
                        <input
                          type="number"
                          min="0"
                          style={{width: 110}}
                          value={String((capForm[ev.id]?.cap) ?? Number(ev.regCap||0))}
                          onChange={e => setCapForm(prev => ({
                            ...prev,
                            [ev.id]: {
                              enforced: (prev[ev.id]?.enforced) ?? (Number(ev.regCapEnforced||0)===1),
                              cap: e.target.value.replace(/[^0-9]/g,'')
                            }
                          }))}
                          disabled={!((capForm[ev.id]?.enforced) ?? (Number(ev.regCapEnforced||0)===1))}
                        />
                      </span>
                    </div>
                    <div className="detail-item">
                      <button className="refresh-btn" onClick={() => saveCapacity(ev)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Save Capacity</span>
                      </button>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Venue:</span>
                    <span className="detail-value">{ev.venue}</span>
                  </div>
                </div>
                <div className="event-actions">
                  <button className="claim-btn" onClick={() => claim(ev.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Claim Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* My Events */}
      <section className="events-section">
        <div className="section-header">
          <h2>My Events</h2>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : (
          <div className="events-list">
            {events.length === 0 && (
              <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M8 6H20C21.1046 6 22 6.89543 22 8V16C22 17.1046 21.1046 18 20 18H8C6.89543 18 6 17.1046 6 16V8C6 6.89543 6.89543 6 8 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 18V20C16 21.1046 15.1046 22 14 22H6C4.89543 22 4 21.1046 4 20V12C4 10.8954 4.89543 10 6 10H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>No events yet</h3>
                <p>Create your first event to get started</p>
              </div>
            )}

            {events.map(ev => (
              <div className="event-card expandable" key={ev.id}>
                {ev.poster && (
                  <div className="event-poster">
                    <img 
                      src={typeof ev.poster === 'string' ? ev.poster : ''} 
                      alt={`${ev.name} poster`} 
                    />
                  </div>
                )}
                
                <div className="event-content">
                  <div className="event-header">
                    <h3 className="event-name">{ev.name}</h3>
                    <div className="event-actions">
                      <button 
                        className="toggle-regs-btn" 
                        onClick={() => toggleRegistration(ev)}
                        title={Number(ev.regClosed || 0) === 1 ? 'Open registrations' : 'Close registrations'}
                      >
                        {Number(ev.regClosed || 0) === 1 ? 'Open Reg' : 'Close Reg'}
                      </button>
                      <button 
                        className="toggle-regs-btn" 
                        onClick={() => toggleRegs(ev.id)}
                      >
                        {openEventIds.has(ev.id) ? (
                          <>
                            <span>Hide Registrations</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </>
                        ) : (
                          <>
                            <span>View Registrations</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M6 15L12 9L18 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </>
                        )}
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => remove(ev.id)} 
                        disabled={deletingId===ev.id}
                      >
                        {deletingId===ev.id ? (
                          <>
                            <div className="spinner-small"></div>
                            <span>Deleting...</span>
                          </>
                        ) : (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="event-details">
                    <div className="detail-item">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{new Date(ev.date).toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Venue:</span>
                      <span className="detail-value">{ev.venue}</span>
                    </div>
                    {isSuper && ev.createdBy && (
                      <div className="detail-item">
                        <span className="detail-label">Created By:</span>
                        <span className="detail-value">{ev.createdBy}</span>
                      </div>
                    )}
                    {ev.speaker && (
                      <div className="detail-item">
                        <span className="detail-label">Speaker:</span>
                        <span className="detail-value">{ev.speaker}</span>
                      </div>
                    )}
                    {ev.food && (
                      <div className="detail-item">
                        <span className="detail-label">Food:</span>
                        <span className="detail-value">{ev.food}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Registrations Section */}
                  {openEventIds.has(ev.id) && (
                    <div className="registrations-section slide-down">
                      {loadingEventId === ev.id ? (
                        <div className="loading-registrations">
                          <div className="loading-spinner-small"></div>
                          <span>Loading registrants...</span>
                        </div>
                      ) : (
                        <>
                          {(!regsByEvent[ev.id] || regsByEvent[ev.id].length === 0) ? (
                            <div className="empty-registrations">
                              <p>No registrations yet.</p>
                            </div>
                          ) : (
                            <div className="registrations-container">
                              <div className="registrations-summary">
                                <h4>Registration Summary</h4>
                                <div className="summary-stats">
                                  <div className="summary-stat">
                                    <span className="stat-label">Total:</span>
                                    <span className="stat-value">{regsByEvent[ev.id].length}</span>
                                  </div>
                                  <div className="summary-stat">
                                    <span className="stat-label">Checked-in:</span>
                                    <span className="stat-value checked-in">
                                      {regsByEvent[ev.id].filter(r => r.checkedIn).length}
                                    </span>
                                  </div>
                                </div>
                                <div className="summary-actions">
                                  <button 
                                    className="refresh-btn" 
                                    onClick={() => reloadRegs(ev.id)}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                      <path d="M23 4V10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M1 20V14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      <path d="M3.51 9C4.01717 7.56678 4.87913 6.2854 6.01547 5.27542C7.1518 4.26543 8.52547 3.55976 10.0083 3.22426C11.4911 2.88875 13.0348 2.93434 14.4952 3.35677C15.9556 3.77921 17.2853 4.56471 18.36 5.64L23 10M1 14L5.64 18.36C6.71475 19.4353 8.04437 20.2208 9.50481 20.6432C10.9652 21.0657 12.5089 21.1113 13.9917 20.7757C15.4745 20.4402 16.8482 19.7346 17.9845 18.7246C19.1209 17.7146 19.9828 16.4332 20.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>Refresh</span>
                                  </button>
                                </div>
                                
                                {/* Department Filter - FIXED POSITION */}
                                <div className="summary-filters">
                                  <label className="filter-label">Filter by Department:</label>
                                  <select
                                    value={departmentFilters[ev.id] || ''}
                                    onChange={(e) => handleDepartmentFilterChange(ev.id, e.target.value)}
                                    className="filter-select"
                                  >
                                    <option value="">All Departments</option>
                                    {Object.entries(DEPT_MAP).map(([code, name]) => (
                                      <option key={code} value={code}>{code} - {name}</option>
                                    ))}
                                  </select>
                                </div>
                                
                                <div className="email-section">
                                  <label className="email-label">
                                    Recipients (comma separated emails)
                                  </label>
                                  <input 
                                    className="email-input"
                                    value={sendTo[ev.id]||''} 
                                    onChange={e => setSendTo(prev => ({...prev, [ev.id]: e.target.value}))} 
                                    placeholder="dean@college.edu, hod@dept.edu" 
                                  />
                                  <button 
                                    className="send-attendance-btn primary-btn"
                                    onClick={() => sendAttendance(ev.id)}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                      <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>Send Attendance</span>
                                  </button>
                                </div>
                              </div>
                              
                              <div className="registrations-list">
                                <h4>
                                  Registrants
                                  {departmentFilters[ev.id] && (
                                    <span className="filter-indicator">
                                      {' '}— {departmentFilters[ev.id]} {DEPT_MAP[departmentFilters[ev.id]] ? `(${DEPT_MAP[departmentFilters[ev.id]]})` : ''}
                                      {' '}({regsByEvent[ev.id].filter(r => {
                                        const filter = departmentFilters[ev.id]
                                        if (!filter) return true
                                        return getDeptFromEmail(r.email).code === filter
                                      }).length})
                                    </span>
                                  )}
                                </h4>
                                <div className="registrants-grid">
                                  {regsByEvent[ev.id]
                                    .filter(r => {
                                      const filter = departmentFilters[ev.id]
                                      if (!filter) return true
                                      return getDeptFromEmail(r.email).code === filter
                                    })
                                    .map(r => {
                                      let ans = null
                                      try { 
                                        ans = r.answers ? (typeof r.answers === 'string' ? JSON.parse(r.answers) : r.answers) : null 
                                      } catch {}
                                      const isOpen = expandedAnswers.has(r.id)
                                      const answerCount = ans ? Object.keys(ans).length : 0
                                      const dept = getDeptFromEmail(r.email)
                                      
                                      return (
                                        <div key={r.id} className="registrant-card">
                                          <div className="registrant-header">
                                            <div className="registrant-info">
                                              <h5 className="registrant-name">{r.name}</h5>
                                              <span className="registrant-email">{r.email}</span>
                                            </div>
                                            <div className="registrant-status">
                                              <span className={`status-badge ${r.checkedIn ? 'checked-in' : 'not-checked-in'}`}>
                                                {r.checkedIn ? 'Checked In' : 'Not Checked In'}
                                              </span>
                                              <span className="dept-badge">
                                                {dept.code || 'NA'} · {dept.name}
                                              </span>
                                            </div>
                                          </div>
                                          
                                          {r.contact && (
                                            <div className="registrant-contact">
                                              <span className="contact-label">Contact:</span>
                                              <span className="contact-value">{r.contact}</span>
                                            </div>
                                          )}
                                          
                                          {ans && (
                                            <div className="answers-section">
                                              <button 
                                                className="toggle-answers-btn" 
                                                onClick={() => toggleAnswers(r.id)}
                                              >
                                                {isOpen ? (
                                                  <>
                                                    <span>Hide Answers</span>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                  </>
                                                ) : (
                                                  <>
                                                    <span>Show Answers ({answerCount})</span>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                      <path d="M6 15L12 9L18 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                  </>
                                                )}
                                              </button>
                                              
                                              {isOpen && (
                                                <div className="answers-list slide-down">
                                                  <h6>Registration Answers</h6>
                                                  <div className="answers-grid">
                                                    {Object.entries(ans).map(([k,v]) => (
                                                      <div key={k} className="answer-item">
                                                        <span className="answer-question">{k}:</span>
                                                        <span className="answer-value">
                                                          {Array.isArray(v) ? v.join(', ') : String(v)}
                                                        </span>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    })}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Dashboard Header */
        .dashboard-header {
          margin-bottom: 24px;
        }

        .dashboard-header h1 {
          margin: 0 0 8px 0;
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(90deg, var(--primary), var(--primary-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--muted);
          font-size: 0.95rem;
        }

        .user-label {
          color: var(--muted);
        }

        .user-name {
          font-weight: 600;
          color: var(--text);
        }

        /* Analytics Grid */
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--primary), var(--primary-600));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--muted);
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text);
          line-height: 1;
        }

        /* Sections */
        .section-header {
          margin-bottom: 20px;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 4px 0;
        }

        .section-header p {
          color: var(--muted);
          margin: 0;
          font-size: 0.95rem;
        }

        /* Legacy Events */
        .legacy-section {
          margin-bottom: 32px;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        /* Event Cards */
        .events-section {
          margin-bottom: 32px;
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .event-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
        }

        .event-card:hover {
          border-color: var(--primary);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .event-poster {
          width: 100%;
          height: 180px;
          overflow: hidden;
        }

        .event-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .event-content {
          padding: 20px;
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 16px;
        }

        .event-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
          margin: 0;
          flex: 1;
        }

        .event-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .detail-item {
          display: flex;
          gap: 8px;
        }

        .detail-label {
          font-weight: 600;
          color: var(--muted);
          min-width: 60px;
        }

        .detail-value {
          color: var(--text);
        }

        /* Buttons */
        button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          outline: none;
        }

        .primary-btn {
          background: linear-gradient(180deg, var(--primary), var(--primary-600));
          color: white;
          box-shadow: var(--shadow);
        }

        .primary-btn:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }

        .toggle-regs-btn {
          background: var(--card);
          color: var(--text);
          border: 1px solid var(--border);
        }

        .toggle-regs-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--primary);
        }

        .delete-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .delete-btn:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.2);
          transform: translateY(-1px);
        }

        .delete-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .claim-btn {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .claim-btn:hover {
          background: rgba(34, 197, 94, 0.2);
          transform: translateY(-1px);
        }

        .refresh-btn {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          border: 1px solid var(--border);
        }

        .refresh-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .toggle-answers-btn {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          border: 1px solid var(--border);
          font-size: 0.8rem;
          padding: 6px 12px;
        }

        .toggle-answers-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Registrations Section */
        .registrations-section {
          margin-top: 20px;
          border-top: 1px solid var(--border);
          padding-top: 20px;
        }

        .loading-registrations {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 20px;
          justify-content: center;
          color: var(--muted);
        }

        .empty-registrations {
          padding: 20px;
          text-align: center;
          color: var(--muted);
        }

        .registrations-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .registrations-summary {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
        }

        .registrations-summary h4 {
          margin: 0 0 16px 0;
          color: var(--text);
          font-size: 1.125rem;
        }

        .summary-stats {
          display: flex;
          gap: 24px;
          margin-bottom: 16px;
        }

        .summary-stat {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--muted);
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
        }

        .stat-value.checked-in {
          color: #22c55e;
        }

        .summary-actions {
          margin-bottom: 20px;
        }

        /* Department Filter - FIXED STYLES */
        .summary-filters {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .filter-label {
          color: var(--text);
          font-size: 0.9rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .filter-select {
          background: var(--bg);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.875rem;
          min-width: 200px;
        }

        .filter-select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        .filter-indicator {
          color: var(--muted);
          font-weight: normal;
          font-size: 0.9rem;
        }

        .email-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
        }

        .email-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text);
        }

        .email-input {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 12px;
          color: var(--text);
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .email-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        .email-input::placeholder {
          color: var(--muted);
        }

        .send-attendance-btn {
          align-self: flex-start;
        }

        /* Registrations List */
        .registrations-list h4 {
          margin: 0 0 16px 0;
          color: var(--text);
          font-size: 1.125rem;
        }

        .registrants-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .registrant-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.2s;
        }

        .registrant-card:hover {
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        .registrant-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 12px;
        }

        .registrant-info {
          flex: 1;
        }

        .registrant-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 4px 0;
        }

        .registrant-email {
          font-size: 0.875rem;
          color: var(--muted);
        }

        .registrant-status {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: flex-end;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
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

        .dept-badge {
          font-size: 0.7rem;
          color: var(--muted);
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid var(--border);
          padding: 2px 8px;
          border-radius: 999px;
          white-space: nowrap;
        }

        .registrant-contact {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
          font-size: 0.875rem;
        }

        .contact-label {
          font-weight: 600;
          color: var(--muted);
        }

        .contact-value {
          color: var(--text);
        }

        /* Answers Section */
        .answers-section {
          margin-top: 12px;
        }

        .answers-list {
          margin-top: 12px;
        }

        .answers-list h6 {
          margin: 0 0 8px 0;
          color: var(--text);
          font-size: 0.875rem;
        }

        .answers-grid {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .answer-item {
          display: flex;
          gap: 8px;
          padding: 8px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          font-size: 0.875rem;
        }

        .answer-question {
          font-weight: 600;
          color: var(--muted);
          min-width: 120px;
        }

        .answer-value {
          color: var(--text);
          flex: 1;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(5px);
        }

        .modal-content {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          width: 90%;
          max-width: 400px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 20px 0;
        }

        .modal-header h3 {
          margin: 0;
          color: var(--text);
          font-size: 1.25rem;
        }

        .close-btn {
          background: none;
          border: none;
          color: var(--muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text);
        }

        .modal-body {
          padding: 20px;
        }

        .modal-body p {
          margin: 0;
          color: var(--text);
          line-height: 1.5;
        }

        .modal-footer {
          padding: 0 20px 20px;
          display: flex;
          justify-content: center;
        }

        /* Loading States */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
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

        .loading-spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-left: 2px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-left: 2px solid currentColor;
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
          padding: 60px 20px;
          text-align: center;
          color: var(--muted);
        }

        .empty-state svg {
          margin-bottom: 16px;
          color: var(--muted);
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          color: var(--text);
          font-size: 1.125rem;
        }

        .empty-state p {
          margin: 0;
          font-size: 0.875rem;
        }

        /* Alert */
        .alert {
          background: rgba(160, 107, 43, 0.12);
          color: #2b2116;
          padding: 12px 16px;
          border: 1px solid rgba(160, 107, 43, 0.28);
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .alert-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
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

        /* Animations */
        .fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }

        .slide-down {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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

        /* Responsive Design */
        @media (max-width: 768px) {
          .container {
            padding: 16px;
          }

          .analytics-grid {
            grid-template-columns: 1fr;
          }

          .event-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .event-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .summary-stats {
            flex-direction: column;
            gap: 12px;
          }

          .summary-filters {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .filter-select {
            min-width: 100%;
          }

          .registrants-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            width: 95%;
            margin: 20px;
          }
        }

        @media (max-width: 480px) {
          .event-actions {
            flex-direction: column;
          }

          .event-actions button {
            width: 100%;
            justify-content: center;
          }

          .send-attendance-btn {
            align-self: stretch;
          }
        }
      `}</style>
    </div>
  )
}