// // import { Link } from 'react-router-dom'
// // import { useEffect, useMemo, useState } from 'react'
// // import { api } from '../api'

// // export default function Home() {
// //   const [items, setItems] = useState([])
// //   const [loading, setLoading] = useState(false)
// //   const isAuthed = !!localStorage.getItem('auth_token')

// //   useEffect(() => {
// //     if (!isAuthed) return
// //     setLoading(true)
// //     ;(async () => {
// //       try {
// //         const { data } = await api.get('/api/registration/mine')
// //         setItems(Array.isArray(data) ? data : [])
// //       } catch {
// //         setItems([])
// //       } finally {
// //         setLoading(false)
// //       }
// //     })()
// //   }, [isAuthed])

// //   const topItems = useMemo(() => items.slice(0, 3), [items])

// //   return (
// //     <div>
// //       {isAuthed && (
// //         <div className="card" style={{marginBottom:16}}>
// //           <div className="row" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
// //             <strong>Your Registered Events</strong>
// //             {loading && <span className="user-email">Loading...</span>}
// //           </div>
// //           {topItems.length === 0 && !loading && (
// //             <div className="row" style={{color:'var(--muted)'}}>No registrations yet.</div>
// //           )}
// //           {topItems.length > 0 && (
// //             <div className="grid" style={{marginTop:10}}>
// //               {topItems.map(r => (
// //                 <div key={r.id} className="card">
// //                   <div className="row"><strong>{r.eventName}</strong></div>
// //                   <div className="row">Date: {new Date(r.eventDate).toLocaleString()}</div>
// //                   <div className="row">Venue: {r.eventVenue}</div>
// //                   <div className="row">Checked In: {r.checkedIn ? 'Yes' : 'No'}</div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //           <div className="actions" style={{marginTop:10}}>
// //             <Link to="/me"><button type="button">View All</button></Link>
// //           </div>
// //         </div>
// //       )}

// //       <div className="card" style={{padding:'24px', display:'grid', gap:16}}>
// //         <div style={{display:'grid', gap:8}}>
// //           <h1>Welcome to Event Hub</h1>
// //           <div style={{color:'var(--muted)'}}>Plan, register, and manage campus events with ease.</div>
// //         </div>
// //         <div style={{display:'grid', gap:12}}>
// //           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:12}}>
// //             <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop" alt="people at an event" style={{width:'100%', height:180, objectFit:'cover', borderRadius:12, border:'1px solid var(--border)'}} />
// //             <img src="https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=1200&auto=format&fit=crop" alt="auditorium" style={{width:'100%', height:180, objectFit:'cover', borderRadius:12, border:'1px solid var(--border)'}} />
// //             <img src="https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?q=80&w=1200&auto=format&fit=crop" alt="speaker on stage" style={{width:'100%', height:180, objectFit:'cover', borderRadius:12, border:'1px solid var(--border)'}} />
// //           </div>
// //         </div>
// //         <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
// //           <Link to="/login"><button type="button">Login</button></Link>
// //           <Link to="/register"><button type="button" style={{background:'linear-gradient(180deg, var(--primary), var(--primary-600))'}}>Browse & Register</button></Link>
// //         </div>
// //       </div>
// //       <div className="list" style={{marginTop:16}}>
// //         <div className="card">
// //           <div className="row"><strong>For Students</strong></div>
// //           <div className="row" style={{color:'var(--muted)'}}>Discover upcoming events and register in seconds. Access your QR codes in My Events.</div>
// //         </div>
// //         <div className="card">
// //           <div className="row"><strong>For Admins</strong></div>
// //           <div className="row" style={{color:'var(--muted)'}}>Create events, manage registrations, check-in attendees, and manage promotions.</div>
// //         </div>
// //         <div className="card">
// //           <div className="row"><strong>Fast Check-In</strong></div>
// //           <div className="row" style={{color:'var(--muted)'}}>QR-based entry for a quick and seamless experience at the venue.</div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }




// import { Link } from 'react-router-dom'
// import { useEffect, useMemo, useState } from 'react'
// import { api } from '../api'

// export default function Home() {
//   const [items, setItems] = useState([])
//   const [loading, setLoading] = useState(false)
//   const isAuthed = !!localStorage.getItem('auth_token')
//   const isAdmin = (() => { try { return JSON.parse(localStorage.getItem('auth_user')||'null')?.role === 'admin' } catch { return false } })()
//   const [overview, setOverview] = useState({ totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 })
//   const [ovLoading, setOvLoading] = useState(false)
//   const [events, setEvents] = useState([])
//   const [eventsLoading, setEventsLoading] = useState(true)

//   useEffect(() => {
//     if (!isAuthed || isAdmin) return
//     setLoading(true)
//     ;(async () => {
//       try {
//         const { data } = await api.get('/api/registration/mine')
//         setItems(Array.isArray(data) ? data : [])
//       } catch {
//         setItems([])
//       } finally {
//         setLoading(false)
//       }
//     })()
//   }, [isAuthed, isAdmin])

//   useEffect(() => {
//     setEventsLoading(true)
//     ;(async () => {
//       try {
//         const { data } = await api.get('/api/events')
//         setEvents(Array.isArray(data) ? data : [])
//       } catch {
//         setEvents([])
//       } finally {
//         setEventsLoading(false)
//       }
//     })()
//   }, [])

//   useEffect(() => {
//     if (!isAuthed || !isAdmin) return
//     setOvLoading(true)
//     ;(async () => {
//       try {
//         const { data } = await api.get('/api/events/overview')
//         setOverview(data || { totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 })
//       } catch {
//         setOverview({ totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 })
//       } finally {
//         setOvLoading(false)
//       }
//     })()
//   }, [isAuthed, isAdmin])

//   const topItems = useMemo(() => items.slice(0, 3), [items])

//   return (
//     <div className="container">
//       {/* Hero Section */}
//       <div className="hero-section">
//         <div className="hero-content">
//           <div className="hero-text">
//             <h1 className="hero-title">Welcome to Event Hub</h1>
//             <p className="hero-subtitle">
//               Plan, register, and manage campus events with ease. Discover amazing events and connect with your community.
//             </p>
//             <div className="hero-actions">
//               <Link to="/login">
//                 <button className="hero-btn secondary">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                     <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                   Login
//                 </button>
//               </Link>
//               <Link to="/register">
//                 <button className="hero-btn primary">
//                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                     <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   </svg>
//                   Browse & Register
//                 </button>
//               </Link>
//             </div>
//           </div>
//           <div className="hero-images">
//             <div className="image-grid">
//               <img 
//                 src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop" 
//                 alt="People at an event" 
//                 className="hero-image"
//               />
//               <img 
//                 src="https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=1200&auto=format&fit=crop" 
//                 alt="Auditorium" 
//                 className="hero-image"
//               />
//               <img 
//                 src="https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?q=80&w=1200&auto=format&fit=crop" 
//                 alt="Speaker on stage" 
//                 className="hero-image"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Upcoming Events (everyone) */}
//       <section className="upcoming-section">
//         <div className="section-header">
//           <h2>Upcoming Events</h2>
//           {eventsLoading && <span className="loading-text">Loading...</span>}
//         </div>
//         {(!eventsLoading && events.length === 0) ? (
//           <div className="empty-state">
//             <h3>No events available</h3>
//             <p>Check back later for upcoming events</p>
//           </div>
//         ) : (
//           <div className="events-scroll">
//             {events.map(ev => (
//               <div key={ev.id} className="event-card-wide">
//                 {ev.poster && (
//                   <div className="event-poster">
//                     <img src={typeof ev.poster === 'string' ? ev.poster : ''} alt={`${ev.name} poster`} />
//                   </div>
//                 )}
//                 <div className="event-info">
//                   <div className="event-title">{ev.name}</div>
//                   <div className="event-meta">
//                     <span>{new Date(ev.date).toLocaleString()}</span>
//                     <span>•</span>
//                     <span>{ev.venue}</span>
//                   </div>
//                   {ev.description && (
//                     <div className="event-desc">{String(ev.description).slice(0, 120)}{String(ev.description).length > 120 ? '…' : ''}</div>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </section>

//       {/* User Events Section (non-admin) */}
//       {isAuthed && !isAdmin && (
//         <section className="user-events-section">
//           <div className="section-card">
//             <div className="section-header">
//               <h2>Your Registered Events</h2>
//               {loading && <span className="loading-text">Loading...</span>}
//             </div>
            
//             {topItems.length === 0 && !loading && (
//               <div className="empty-state">
//                 <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
//                   <path d="M8 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H8C6.9 18 6 17.1 6 16V8C6 6.9 6.9 6 8 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                   <path d="M16 18V20C16 21.1 15.1 22 14 22H6C4.9 22 4 21.1 4 20V12C4 10.9 4.9 10 6 10H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//                 <h3>No registrations yet</h3>
//                 <p>Start by browsing and registering for events</p>
//               </div>
//             )}

//             {topItems.length > 0 && (
//               <div className="events-grid">
//                 {topItems.map(r => (
//                   <div key={r.id} className="event-card">
//                     <div className="event-header">
//                       <h3 className="event-name">{r.eventName}</h3>
//                       <span className={`status-badge ${r.checkedIn ? 'checked-in' : 'not-checked-in'}`}>
//                         {r.checkedIn ? 'Checked In' : 'Not Checked In'}
//                       </span>
//                     </div>
//                     <div className="event-details">
//                       <div className="detail-item">
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                           <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                           <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
//                         </svg>
//                         <span>{new Date(r.eventDate).toLocaleString()}</span>
//                       </div>
//                       <div className="detail-item">
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                           <path d="M17.657 16.657L13.414 20.9C13.039 21.2746 12.5306 21.485 12 21.485C11.4694 21.485 10.961 21.2746 10.586 20.9L6.343 16.657C5.22422 15.5381 4.46234 14.1127 4.15369 12.5608C3.84504 11.009 4.00349 9.40047 4.60901 7.93868C5.21452 6.4769 6.2399 5.22749 7.55548 4.34846C8.87107 3.46943 10.4178 3.00024 12 3.00024C13.5822 3.00024 15.1289 3.46943 16.4445 4.34846C17.7601 5.22749 18.7855 6.4769 19.391 7.93868C19.9965 9.40047 20.155 11.009 19.8463 12.5608C19.5377 14.1127 18.7758 15.5381 17.657 16.657Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                           <path d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                         </svg>
//                         <span>{r.eventVenue}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {topItems.length > 0 && (
//               <div className="section-actions">
//                 <Link to="/me">
//                   <button className="view-all-btn">
//                     View All Events
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                   </button>
//                 </Link>
//               </div>
//             )}
//           </div>
//         </section>
//       )}

//       {/* Admin Overview (admin only) */}
//       {isAuthed && isAdmin && (
//         <section className="user-events-section">
//           <div className="section-card">
//             <div className="section-header">
//               <h2>Admin Overview</h2>
//               {ovLoading && <span className="loading-text">Loading...</span>}
//             </div>
//             <div className="events-grid">
//               <div className="event-card">
//                 <div className="event-header">
//                   <h3 className="event-name">My Events</h3>
//                 </div>
//                 <div className="event-details">
//                   <div className="detail-item"><strong>Total:</strong> <span>{overview.totalEvents}</span></div>
//                 </div>
//               </div>
//               <div className="event-card">
//                 <div className="event-header">
//                   <h3 className="event-name">Registrations</h3>
//                 </div>
//                 <div className="event-details">
//                   <div className="detail-item"><strong>Total:</strong> <span>{overview.totalRegistrations}</span></div>
//                 </div>
//               </div>
//               <div className="event-card">
//                 <div className="event-header">
//                   <h3 className="event-name">Checked-In</h3>
//                 </div>
//                 <div className="event-details">
//                   <div className="detail-item"><strong>Total:</strong> <span>{overview.totalCheckedIn}</span></div>
//                 </div>
//               </div>
//             </div>
//             <div className="section-actions" style={{marginTop:16}}>
//               <Link to="/admin"><button className="view-all-btn">Go to Dashboard</button></Link>
//             </div>
//             <div className="section-actions" style={{gap:12, marginTop:12, display:'flex', justifyContent:'center', flexWrap:'wrap'}}>
//               <Link to="/new"><button className="view-all-btn">Create Event</button></Link>
//               <Link to="/checkin"><button className="view-all-btn">Check-In</button></Link>
//               <Link to="/ads"><button className="view-all-btn">Manage Ads</button></Link>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Features Section */}
//       <section className="features-section">
//         <div className="section-header centered">
//           <h2>Why Choose Event Hub?</h2>
//           <p>Everything you need for seamless event management</p>
//         </div>
        
//         <div className="features-grid">
//           <div className="feature-card">
//             <div className="feature-icon">
//               <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
//                 <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <h3>For Students</h3>
//             <p>Discover upcoming events and register in seconds. Access your QR codes in My Events for quick check-in.</p>
//           </div>

//           <div className="feature-card">
//             <div className="feature-icon">
//               <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
//                 <path d="M12 15V17M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <h3>For Admins</h3>
//             <p>Create events, manage registrations, check-in attendees, and manage promotional banners with ease.</p>
//           </div>

//           <div className="feature-card">
//             <div className="feature-icon">
//               <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
//                 <path d="M12 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V12M16 5H10C8.89543 5 8 5.89543 8 7V17C8 18.1046 8.89543 19 10 19H16C17.1046 19 18 18.1046 18 17V7C18 5.89543 17.1046 5 16 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <h3>Fast Check-In</h3>
//             <p>QR-based entry system for quick and seamless experience at the venue. No more waiting in long lines.</p>
//           </div>
//         </div>
//       </section>

//       <style jsx>{`
//         .container {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 0 20px;
//         }

//         /* Hero Section */
//         .hero-section {
//           margin: 40px 0 60px;
//         }

//         .hero-content {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 60px;
//           align-items: center;
//         }

//         .hero-text {
//           display: flex;
//           flex-direction: column;
//           gap: 24px;
//         }

//         .hero-title {
//           font-size: 3.5rem;
//           font-weight: 800;
//           line-height: 1.1;
//           margin: 0;
//           background: linear-gradient(135deg, var(--primary), var(--primary-600));
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .hero-subtitle {
//           font-size: 1.25rem;
//           line-height: 1.6;
//           color: var(--muted);
//           margin: 0;
//         }

//         .hero-actions {
//           display: flex;
//           gap: 16px;
//           flex-wrap: wrap;
//         }

//         .hero-btn {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 14px 28px;
//           border-radius: 12px;
//           font-weight: 600;
//           font-size: 1rem;
//           text-decoration: none;
//           border: none;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .hero-btn.primary {
//           background: linear-gradient(135deg, var(--primary), var(--primary-600));
//           color: white;
//           box-shadow: var(--shadow);
//         }

//         .hero-btn.secondary {
//           background: var(--card);
//           color: var(--text);
//           border: 2px solid var(--border);
//         }

//         .hero-btn:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
//         }

//         .hero-btn.primary:hover {
//           filter: brightness(1.1);
//         }

//         .hero-btn.secondary:hover {
//           border-color: var(--primary);
//         }

//         .hero-images {
//           position: relative;
//         }

//         .image-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 16px;
//         }

//         .hero-image {
//           width: 100%;
//           height: 200px;
//           object-fit: cover;
//           border-radius: 16px;
//           border: 1px solid var(--border);
//           box-shadow: var(--shadow);
//           transition: transform 0.3s ease;
//         }

//         .hero-image:hover {
//           transform: scale(1.05);
//         }

//         .hero-image:nth-child(1) {
//           grid-column: 1;
//           grid-row: 1 / span 2;
//           height: 416px;
//         }

//         .hero-image:nth-child(2) {
//           grid-column: 2;
//           grid-row: 1;
//         }

//         .hero-image:nth-child(3) {
//           grid-column: 2;
//           grid-row: 2;
//         }

//         /* User Events Section */
//         .user-events-section {
//           margin-bottom: 60px;
//         }

//         .upcoming-section {
//           margin-bottom: 40px;
//         }

//         .events-scroll {
//           display: flex;
//           gap: 16px;
//           overflow-x: auto;
//           padding-bottom: 8px;
//           scroll-snap-type: x mandatory;
//           -webkit-overflow-scrolling: touch;
//         }

//         .events-scroll::-webkit-scrollbar {
//           height: 8px;
//         }
//         .events-scroll::-webkit-scrollbar-thumb {
//           background: rgba(100,100,120,0.35);
//           border-radius: 4px;
//         }

//         .event-card-wide {
//           min-width: 320px;
//           max-width: 360px;
//           background: var(--card);
//           border: 1px solid var(--border);
//           border-radius: 14px;
//           overflow: hidden;
//           box-shadow: var(--shadow);
//           scroll-snap-align: start;
//           transition: transform .2s ease, border-color .2s ease;
//         }
//         .event-card-wide:hover {
//           transform: translateY(-2px);
//           border-color: var(--primary);
//         }
//         .event-poster {
//           width: 100%;
//           height: 160px;
//           overflow: hidden;
//           background: var(--panel);
//         }
//         .event-poster img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//           display: block;
//         }
//         .event-info {
//           padding: 14px;
//           display: grid;
//           gap: 8px;
//         }
//         .event-title {
//           font-weight: 700;
//           color: var(--text);
//         }
//         .event-meta {
//           display: flex;
//           gap: 8px;
//           color: var(--muted);
//           font-size: .9rem;
//         }
//         .event-desc {
//           color: var(--muted);
//           font-size: .9rem;
//           line-height: 1.4;
//         }

//         .section-card {
//           background: var(--card);
//           border: 1px solid var(--border);
//           border-radius: 20px;
//           padding: 32px;
//           box-shadow: var(--shadow);
//         }

//         .section-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 24px;
//         }

//         .section-header h2 {
//           font-size: 1.75rem;
//           font-weight: 700;
//           color: var(--text);
//           margin: 0;
//         }

//         .section-header.centered {
//           text-align: center;
//           flex-direction: column;
//           gap: 8px;
//         }

//         .section-header.centered h2 {
//           font-size: 2.25rem;
//         }

//         .section-header.centered p {
//           color: var(--muted);
//           font-size: 1.125rem;
//           margin: 0;
//         }

//         .loading-text {
//           color: var(--muted);
//           font-size: 0.9rem;
//         }

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
//           font-size: 1.25rem;
//         }

//         .empty-state p {
//           margin: 0;
//           font-size: 0.95rem;
//         }

//         .events-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//           gap: 20px;
//           margin-bottom: 24px;
//         }

//         .event-card {
//           background: rgba(255, 255, 255, 0.05);
//           border: 1px solid var(--border);
//           border-radius: 12px;
//           padding: 20px;
//           transition: all 0.3s ease;
//         }

//         .event-card:hover {
//           border-color: var(--primary);
//           transform: translateY(-2px);
//           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
//         }

//         .event-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-bottom: 16px;
//           gap: 12px;
//         }

//         .event-name {
//           font-size: 1.125rem;
//           font-weight: 600;
//           color: var(--text);
//           margin: 0;
//           line-height: 1.4;
//         }

//         .event-details {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//         }

//         .detail-item {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           color: var(--muted);
//           font-size: 0.9rem;
//         }

//         .section-actions {
//           display: flex;
//           justify-content: center;
//         }

//         .view-all-btn {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 12px 24px;
//           background: var(--card);
//           color: var(--text);
//           border: 2px solid var(--border);
//           border-radius: 10px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           text-decoration: none;
//         }

//         .view-all-btn:hover {
//           border-color: var(--primary);
//           transform: translateY(-1px);
//         }

//         /* Features Section */
//         .features-section {
//           margin-bottom: 60px;
//         }

//         .features-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
//           gap: 30px;
//           margin-top: 40px;
//         }

//         .feature-card {
//           background: var(--card);
//           border: 1px solid var(--border);
//           border-radius: 16px;
//           padding: 32px;
//           text-align: center;
//           transition: all 0.3s ease;
//           box-shadow: var(--shadow);
//         }

//         .feature-card:hover {
//           transform: translateY(-5px);
//           border-color: var(--primary);
//           box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
//         }

//         .feature-icon {
//           width: 64px;
//           height: 64px;
//           margin: 0 auto 20px;
//           background: linear-gradient(135deg, var(--primary), var(--primary-600));
//           border-radius: 16px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//         }

//         .feature-card h3 {
//           font-size: 1.375rem;
//           font-weight: 700;
//           color: var(--text);
//           margin: 0 0 12px 0;
//         }

//         .feature-card p {
//           color: var(--muted);
//           line-height: 1.6;
//           margin: 0;
//           font-size: 0.95rem;
//         }

//         /* Status Badges */
//         .status-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 4px;
//           padding: 4px 8px;
//           border-radius: 20px;
//           font-size: 0.75rem;
//           font-weight: 600;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//           white-space: nowrap;
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

//         /* Responsive Design */
//         @media (max-width: 1024px) {
//           .hero-content {
//             gap: 40px;
//           }

//           .hero-title {
//             font-size: 3rem;
//           }
//         }

//         @media (max-width: 768px) {
//           .hero-content {
//             grid-template-columns: 1fr;
//             gap: 40px;
//           }

//           .hero-text {
//             text-align: center;
//           }

//           .hero-actions {
//             justify-content: center;
//           }

//           .hero-title {
//             font-size: 2.5rem;
//           }

//           .image-grid {
//             grid-template-columns: 1fr;
//           }

//           .hero-image:nth-child(1),
//           .hero-image:nth-child(2),
//           .hero-image:nth-child(3) {
//             grid-column: 1;
//             grid-row: auto;
//             height: 200px;
//           }

//           .section-header {
//             flex-direction: column;
//             align-items: flex-start;
//             gap: 8px;
//           }

//           .section-header.centered h2 {
//             font-size: 1.75rem;
//           }

//           .features-grid {
//             grid-template-columns: 1fr;
//           }

//           .events-grid {
//             grid-template-columns: 1fr;
//           }
//         }

//         @media (max-width: 480px) {
//           .container {
//             padding: 0 16px;
//           }

//           .hero-title {
//             font-size: 2rem;
//           }

//           .hero-subtitle {
//             font-size: 1.125rem;
//           }

//           .hero-actions {
//             flex-direction: column;
//           }

//           .hero-btn {
//             width: 100%;
//             justify-content: center;
//           }

//           .section-card {
//             padding: 24px;
//           }

//           .feature-card {
//             padding: 24px;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }


import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'

export default function Home() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const isAuthed = !!localStorage.getItem('auth_token')
  const isAdmin = (() => { try { return JSON.parse(localStorage.getItem('auth_user')||'null')?.role === 'admin' } catch { return false } })()
  const [overview, setOverview] = useState({ totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 })
  const [ovLoading, setOvLoading] = useState(false)
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthed || isAdmin) return
    setLoading(true)
    ;(async () => {
      try {
        const { data } = await api.get('/api/registration/mine')
        setItems(Array.isArray(data) ? data : [])
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    })()
  }, [isAuthed, isAdmin])

  useEffect(() => {
    setEventsLoading(true)
    ;(async () => {
      try {
        const { data } = await api.get('/api/events')
        setEvents(Array.isArray(data) ? data : [])
      } catch {
        setEvents([])
      } finally {
        setEventsLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (!isAuthed || !isAdmin) return
    setOvLoading(true)
    ;(async () => {
      try {
        const { data } = await api.get('/api/events/overview')
        setOverview(data || { totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 })
      } catch {
        setOverview({ totalEvents: 0, totalRegistrations: 0, totalCheckedIn: 0 })
      } finally {
        setOvLoading(false)
      }
    })()
  }, [isAuthed, isAdmin])

  const topItems = useMemo(() => items.slice(0, 3), [items])

  return (
    <div className="container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Welcome to Event Hub</h1>
            <p className="hero-subtitle">
              Plan, register, and manage campus events with ease. Discover amazing events and connect with your community.
            </p>
            <div className="hero-actions">
              {!isAuthed && (
                <Link to="/login">
                  <button className="hero-btn secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Login
                  </button>
                </Link>
              )}
              <Link to="/register">
                <button className="hero-btn primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Browse & Register
                </button>
              </Link>
            </div>
          </div>
          <div className="hero-images">
            <div className="image-grid">
              <img 
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop" 
                alt="People at an event" 
                className="hero-image"
              />
              <img 
                src="https://images.unsplash.com/photo-1485217988980-11786ced9454?q=80&w=1200&auto=format&fit=crop" 
                alt="Auditorium" 
                className="hero-image"
              />
              <img 
                src="https://images.unsplash.com/photo-1472653816316-3ad6f10a6592?q=80&w=1200&auto=format&fit=crop" 
                alt="Speaker on stage" 
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events (everyone) */}
      <section className="upcoming-section">
        <div className="section-header">
          <h2>Upcoming Events</h2>
          {eventsLoading && <span className="loading-text">Loading...</span>}
        </div>
        {(!eventsLoading && events.length === 0) ? (
          <div className="empty-state">
            <h3>No events available</h3>
            <p>Check back later for upcoming events</p>
          </div>
        ) : (
          <div className="events-scroll">
            {events.map(ev => (
              <div key={ev.id} className="event-card-wide">
                {ev.poster && (
                  <div className="event-poster">
                    <img src={typeof ev.poster === 'string' ? ev.poster : ''} alt={`${ev.name} poster`} />
                  </div>
                )}
                <div className="event-info">
                  <div className="event-title">{ev.name}</div>
                  <div className="event-meta">
                    <span>{new Date(ev.date).toLocaleString()}</span>
                    <span>•</span>
                    <span>{ev.venue}</span>
                  </div>
                  {ev.description && (
                    <div className="event-desc">{String(ev.description).slice(0, 120)}{String(ev.description).length > 120 ? '…' : ''}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* User Events Section (non-admin) */}
      {isAuthed && !isAdmin && (
        <section className="user-events-section">
          <div className="section-card">
            <div className="section-header">
              <h2>Your Registered Events</h2>
              {loading && <span className="loading-text">Loading...</span>}
            </div>
            
            {topItems.length === 0 && !loading && (
              <div className="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M8 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H8C6.9 18 6 17.1 6 16V8C6 6.9 6.9 6 8 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 18V20C16 21.1 15.1 22 14 22H6C4.9 22 4 21.1 4 20V12C4 10.9 4.9 10 6 10H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>No registrations yet</h3>
                <p>Start by browsing and registering for events</p>
              </div>
            )}

            {topItems.length > 0 && (
              <div className="events-grid">
                {topItems.map(r => (
                  <div key={r.id} className="event-card">
                    <div className="event-header">
                      <h3 className="event-name">{r.eventName}</h3>
                      <span className={`status-badge ${r.checkedIn ? 'checked-in' : 'not-checked-in'}`}>
                        {r.checkedIn ? 'Checked In' : 'Not Checked In'}
                      </span>
                    </div>
                    <div className="event-details">
                      <div className="detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>{new Date(r.eventDate).toLocaleString()}</span>
                      </div>
                      <div className="detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M17.657 16.657L13.414 20.9C13.039 21.2746 12.5306 21.485 12 21.485C11.4694 21.485 10.961 21.2746 10.586 20.9L6.343 16.657C5.22422 15.5381 4.46234 14.1127 4.15369 12.5608C3.84504 11.009 4.00349 9.40047 4.60901 7.93868C5.21452 6.4769 6.2399 5.22749 7.55548 4.34846C8.87107 3.46943 10.4178 3.00024 12 3.00024C13.5822 3.00024 15.1289 3.46943 16.4445 4.34846C17.7601 5.22749 18.7855 6.4769 19.391 7.93868C19.9965 9.40047 20.155 11.009 19.8463 12.5608C19.5377 14.1127 18.7758 15.5381 17.657 16.657Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{r.eventVenue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {topItems.length > 0 && (
              <div className="section-actions">
                <Link to="/me">
                  <button className="view-all-btn">
                    View All Events
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Admin Overview (admin only) */}
      {isAuthed && isAdmin && (
        <section className="user-events-section">
          <div className="section-card">
            <div className="section-header">
              <h2>Admin Overview</h2>
              {ovLoading && <span className="loading-text">Loading...</span>}
            </div>
            <div className="events-grid">
              <div className="event-card">
                <div className="event-header">
                  <h3 className="event-name">My Events</h3>
                </div>
                <div className="event-details">
                  <div className="detail-item"><strong>Total:</strong> <span>{overview.totalEvents}</span></div>
                </div>
              </div>
              <div className="event-card">
                <div className="event-header">
                  <h3 className="event-name">Registrations</h3>
                </div>
                <div className="event-details">
                  <div className="detail-item"><strong>Total:</strong> <span>{overview.totalRegistrations}</span></div>
                </div>
              </div>
              <div className="event-card">
                <div className="event-header">
                  <h3 className="event-name">Checked-In</h3>
                </div>
                <div className="event-details">
                  <div className="detail-item"><strong>Total:</strong> <span>{overview.totalCheckedIn}</span></div>
                </div>
              </div>
            </div>
            <div className="section-actions" style={{marginTop:16}}>
              <Link to="/admin"><button className="view-all-btn">Go to Dashboard</button></Link>
            </div>
            <div className="section-actions" style={{gap:12, marginTop:12, display:'flex', justifyContent:'center', flexWrap:'wrap'}}>
              <Link to="/new"><button className="view-all-btn">Create Event</button></Link>
              <Link to="/checkin"><button className="view-all-btn">Check-In</button></Link>
              {/* <Link to="/ads"><button className="view-all-btn">Manage Ads</button></Link> */}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header centered">
          <h2>Why Choose Event Hub?</h2>
          <p>Everything you need for seamless event management</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>For Students</h3>
            <p>Discover upcoming events and register in seconds. Access your QR codes in My Events for quick check-in.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V17M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>For Admins</h3>
            <p>Create events, manage registrations, check-in attendees, and manage promotional banners with ease.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V12M16 5H10C8.89543 5 8 5.89543 8 7V17C8 18.1046 8.89543 19 10 19H16C17.1046 19 18 18.1046 18 17V7C18 5.89543 17.1046 5 16 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Fast Check-In</h3>
            <p>QR-based entry system for quick and seamless experience at the venue. No more waiting in long lines.</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Custom Scrollbar Styles */
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 100, 120, 0.35) transparent;
        }

        *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        *::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 4px;
        }

        *::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 120, 0.35);
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        *::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 100, 120, 0.55);
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        *::-webkit-scrollbar-thumb:active {
          background: rgba(100, 100, 120, 0.75);
        }

        *::-webkit-scrollbar-corner {
          background: transparent;
        }

        /* Hero Section */
        .hero-section {
          margin: 40px 0 60px;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .hero-text {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin: 0;
          background: linear-gradient(135deg, var(--primary), var(--primary-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          line-height: 1.6;
          color: var(--muted);
          margin: 0;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .hero-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .hero-btn.primary {
          background: linear-gradient(135deg, var(--primary), var(--primary-600));
          color: white;
          box-shadow: var(--shadow);
        }

        .hero-btn.secondary {
          background: var(--card);
          color: var(--text);
          border: 2px solid var(--border);
        }

        .hero-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }

        .hero-btn.primary:hover {
          filter: brightness(1.1);
        }

        .hero-btn.secondary:hover {
          border-color: var(--primary);
        }

        .hero-images {
          position: relative;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .hero-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 16px;
          border: 1px solid var(--border);
          box-shadow: var(--shadow);
          transition: transform 0.3s ease;
        }

        .hero-image:hover {
          transform: scale(1.05);
        }

        .hero-image:nth-child(1) {
          grid-column: 1;
          grid-row: 1 / span 2;
          height: 416px;
        }

        .hero-image:nth-child(2) {
          grid-column: 2;
          grid-row: 1;
        }

        .hero-image:nth-child(3) {
          grid-column: 2;
          grid-row: 2;
        }

        /* User Events Section */
        .user-events-section {
          margin-bottom: 60px;
        }

        .upcoming-section {
          margin-bottom: 40px;
        }

        .events-scroll {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 16px 8px 24px 8px;
          margin: 0 -8px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
        }

        .events-scroll::-webkit-scrollbar {
          height: 12px;
        }

        .events-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 6px;
          margin: 0 8px;
        }

        .events-scroll::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 120, 0.4);
          border-radius: 6px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .events-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 100, 120, 0.6);
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .event-card-wide {
          min-width: 320px;
          max-width: 360px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: var(--shadow);
          scroll-snap-align: start;
          transition: transform 0.2s ease, border-color 0.2s ease;
          flex-shrink: 0;
        }

        .event-card-wide:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
        }

        .event-poster {
          width: 100%;
          height: 160px;
          overflow: hidden;
          background: var(--panel);
        }

        .event-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .event-info {
          padding: 14px;
          display: grid;
          gap: 8px;
        }

        .event-title {
          font-weight: 700;
          color: var(--text);
        }

        .event-meta {
          display: flex;
          gap: 8px;
          color: var(--muted);
          font-size: .9rem;
        }

        .event-desc {
          color: var(--muted);
          font-size: .9rem;
          line-height: 1.4;
        }

        .section-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 32px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .section-header h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text);
          margin: 0;
        }

        .section-header.centered {
          text-align: center;
          flex-direction: column;
          gap: 8px;
        }

        .section-header.centered h2 {
          font-size: 2.25rem;
        }

        .section-header.centered p {
          color: var(--muted);
          font-size: 1.125rem;
          margin: 0;
        }

        .loading-text {
          color: var(--muted);
          font-size: 0.9rem;
        }

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
          font-size: 1.25rem;
        }

        .empty-state p {
          margin: 0;
          font-size: 0.95rem;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
          max-height: 400px;
          overflow-y: auto;
          padding: 8px 4px 16px 4px;
        }

        .events-grid::-webkit-scrollbar {
          width: 6px;
        }

        .events-grid::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }

        .events-grid::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 120, 0.3);
          border-radius: 3px;
        }

        .events-grid::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 100, 120, 0.5);
        }

        .event-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .event-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 12px;
        }

        .event-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text);
          margin: 0;
          line-height: 1.4;
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--muted);
          font-size: 0.9rem;
        }

        .section-actions {
          display: flex;
          justify-content: center;
        }

        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: var(--card);
          color: var(--text);
          border: 2px solid var(--border);
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .view-all-btn:hover {
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        /* Features Section */
        .features-section {
          margin-bottom: 60px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }

        .feature-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: var(--shadow);
        }

        .feature-card:hover {
          transform: translateY(-5px);
          border-color: var(--primary);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, var(--primary), var(--primary-600));
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .feature-card h3 {
          font-size: 1.375rem;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 12px 0;
        }

        .feature-card p {
          color: var(--muted);
          line-height: 1.6;
          margin: 0;
          font-size: 0.95rem;
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

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-content {
            gap: 40px;
          }

          .hero-title {
            font-size: 3rem;
          }
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-text {
            text-align: center;
          }

          .hero-actions {
            justify-content: center;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .image-grid {
            grid-template-columns: 1fr;
          }

          .hero-image:nth-child(1),
          .hero-image:nth-child(2),
          .hero-image:nth-child(3) {
            grid-column: 1;
            grid-row: auto;
            height: 200px;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .section-header.centered h2 {
            font-size: 1.75rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .events-grid {
            grid-template-columns: 1fr;
          }

          .events-scroll {
            padding: 12px 4px 20px 4px;
          }

          .event-card-wide {
            min-width: 280px;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 16px;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1.125rem;
          }

          .hero-actions {
            flex-direction: column;
          }

          .hero-btn {
            width: 100%;
            justify-content: center;
          }

          .section-card {
            padding: 24px;
          }

          .feature-card {
            padding: 24px;
          }

          .events-scroll {
            gap: 12px;
          }

          .event-card-wide {
            min-width: 260px;
          }
        }
      `}</style>
    </div>
  )
}