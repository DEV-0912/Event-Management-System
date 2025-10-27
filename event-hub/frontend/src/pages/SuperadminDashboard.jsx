// // import { useEffect, useState } from 'react'
// // import { api } from '../api'

// // export default function SuperadminDashboard() {
// //   const [events, setEvents] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [busy, setBusy] = useState({})
// //   const [logsByEvent, setLogsByEvent] = useState({})

// //   const fetchEvents = async () => {
// //     setLoading(true)
// //     try {
// //       const { data } = await api.get('/api/events')
// //       setEvents(Array.isArray(data) ? data : [])
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   useEffect(() => { fetchEvents() }, [])

// //   const toggleQr = async (evId, enabled) => {
// //     setBusy(b => ({ ...b, [evId]: true }))
// //     try {
// //       await api.post(`/api/events/${evId}/qr-toggle`, { enabled })
// //       await fetchEvents()
// //     } finally {
// //       setBusy(b => ({ ...b, [evId]: false }))
// //     }
// //   }

// //   const resetAll = async (evId) => {
// //     if (!window.confirm('Reset QR attempts for all registrations of this event?')) return
// //     setBusy(b => ({ ...b, [evId]: true }))
// //     try {
// //       await api.post(`/api/events/${evId}/qr-reset-all`)
// //       alert('Reset done')
// //     } finally {
// //       setBusy(b => ({ ...b, [evId]: false }))
// //     }
// //   }

// //   const loadLogs = async (evId) => {
// //     setBusy(b => ({ ...b, ['logs_'+evId]: true }))
// //     try {
// //       const { data } = await api.get(`/api/events/${evId}/qr-logs`)
// //       setLogsByEvent(s => ({ ...s, [evId]: data || [] }))
// //     } finally {
// //       setBusy(b => ({ ...b, ['logs_'+evId]: false }))
// //     }
// //   }

// //   return (
// //     <div className="page-wrap">
// //       <h1 className="title">Superadmin</h1>
// //       {loading ? (
// //         <div>Loading...</div>
// //       ) : (
// //         <div className="cards">
// //           {events.map(ev => (
// import { useEffect, useState } from 'react'
// import { api } from '@/api'

// export default function SuperadminDashboard() {
//   const [events, setEvents] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [busy, setBusy] = useState({})
//   const [logsByEvent, setLogsByEvent] = useState({})
//   const [regsByEvent, setRegsByEvent] = useState({})
//   const [expandedSections, setExpandedSections] = useState({})
//   const [perAdminStats, setPerAdminStats] = useState([])

//   const fetchEvents = async () => {
//     setLoading(true)
//     try {
//       const [all, perAdmin] = await Promise.all([
//         api.get('/api/events/all'),
//         api.get('/api/events/overview/all')
//       ])
//       setEvents(Array.isArray(all.data) ? all.data : [])
//       setPerAdminStats(Array.isArray(perAdmin.data) ? perAdmin.data : [])
//     } catch (e) {
//       // Backend may not be updated in this environment; avoid throwing in UI
//       setEvents([])
//       setPerAdminStats([])
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { fetchEvents() }, [])

//   const loadLogs = async (evId) => {
//     setBusy(b => ({ ...b, ['logs_'+evId]: true }))
//     try {
//       const { data } = await api.get(`/api/events/${evId}/qr-logs`)
//       setLogsByEvent(s => ({ ...s, [evId]: data || [] }))
//       setExpandedSections(prev => ({ ...prev, [`logs_${evId}`]: true }))
//     } finally {
//       setBusy(b => ({ ...b, ['logs_'+evId]: false }))
//     }
//   }

//   const toggleQr = async (evId, enabled) => {
//     setBusy(b => ({ ...b, ['qr_'+evId]: true }))
//     try {
//       await api.post(`/api/events/${evId}/qr-toggle`, { enabled })
//       await fetchEvents()
//     } finally {
//       setBusy(b => ({ ...b, ['qr_'+evId]: false }))
//     }
//   }

//   const loadRegs = async (evId) => {
//     setBusy(b => ({ ...b, ['regs_'+evId]: true }))
//     try {
//       const { data } = await api.get(`/api/registration/event/${evId}`)
//       setRegsByEvent(s => ({ ...s, [evId]: Array.isArray(data) ? data : [] }))
//       setExpandedSections(prev => ({ ...prev, [`regs_${evId}`]: true }))
//     } finally {
//       setBusy(b => ({ ...b, ['regs_'+evId]: false }))
//     }
//   }

//   const toggleSection = (sectionId) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [sectionId]: !prev[sectionId]
//     }))
//   }

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   return (
//     <div className="superadmin-dashboard">
//       {/* Header */}
//       <div className="dashboard-header">
//         <div className="header-content">
//           <h1 className="page-title">Superadmin Dashboard</h1>
//           <p className="page-subtitle">Monitor all events, QR scans, and registrations</p>
//         </div>
//         <div className="header-actions">
//           <button 
//             className="refresh-btn"
//             onClick={fetchEvents}
//             disabled={loading}
//           >
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//               <path d="M23 4V10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M1 20V14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M3.51 9C4.01717 7.56678 4.87913 6.2854 6.01547 5.27542C7.1518 4.26543 8.52547 3.55976 10.0083 3.22426C11.4911 2.88875 13.0348 2.93434 14.4952 3.35677C15.9556 3.7792 17.2853 4.56471 18.36 5.64L23 10M1 14L5.64 18.36C6.71475 19.4353 8.04437 20.2208 9.50481 20.6432C10.9652 21.0657 12.5089 21.1113 13.9917 20.7757C15.4745 20.4402 16.8482 19.7346 17.9845 18.7246C19.1209 17.7146 19.9828 16.4332 20.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Stats Overview */}
//       <div className="stats-grid">
//         <div className="stat-card">
//           <div className="stat-icon total-events">
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//               <path d="M8 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H8C6.9 18 6 17.1 6 16V8C6 6.9 6.9 6 8 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M16 18V20C16 21.1 15.1 22 14 22H6C4.9 22 4 21.1 4 20V12C4 10.9 4.9 10 6 10H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <div className="stat-content">
//             <div className="stat-value">{events.length}</div>
//             <div className="stat-label">Total Events</div>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon active-events">
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//               <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <div className="stat-content">
//             <div className="stat-value">
//               {events.filter(ev => !Number(ev.archived)).length}
//             </div>
//             <div className="stat-label">Active Events</div>
//           </div>
//         </div>

//         <div className="stat-card">
//           <div className="stat-icon archived-events">
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
//               <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </div>
//           <div className="stat-content">
//             <div className="stat-value">
//               {events.filter(ev => Number(ev.archived)).length}
//             </div>
//             <div className="stat-label">Archived Events</div>
//           </div>
//         </div>
//       </div>

//       {/* Events Grid */}
//       {loading ? (
//         <div className="loading-state">
//           <div className="loading-spinner"></div>
//           <p>Loading events...</p>
//         </div>
//       ) : (
//         <div className="events-grid">
//           {events.map(ev => (
//             <div className="event-card" key={ev.id}>
//               <div className="event-header">
//                 <div className="event-title-section">
//                   <h3 className="event-title">{ev.name}</h3>
//                   <div className="event-meta">
//                     <span className="event-id">#{ev.id}</span>
//                     <span className="event-date">{ev.date}</span>
//                     <span className={`event-status ${Number(ev.archived) ? 'archived' : 'active'}`}>
//                       {Number(ev.archived) ? 'Archived' : 'Active'}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="event-venue">{ev.venue}</div>
//               </div>

//               <div className="event-details">
//                 <div className="detail-item">
//                   <span className="detail-label">Creator:</span>
//                   <span className="detail-value">{ev.createdBy || 'Unassigned'}</span>
//                 </div>
//               </div>

//               <div className="event-actions">
//                 <button 
//                   className={`action-btn ${logsByEvent[ev.id] ? 'active' : ''}`}
//                   onClick={() => loadLogs(ev.id)}
//                   disabled={!!busy['logs_'+ev.id]}
//                 >
//                   {busy['logs_'+ev.id] ? (
//                     <div className="button-spinner"></div>
//                   ) : (
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                   )}
//                   View Logs ({logsByEvent[ev.id]?.length || 0})
//                 </button>

//                 <button 
//                   className={`action-btn ${regsByEvent[ev.id] ? 'active' : ''}`}
//                   onClick={() => loadRegs(ev.id)}
//                   disabled={!!busy['regs_'+ev.id]}
//                 >
//                   {busy['regs_'+ev.id] ? (
//                     <div className="button-spinner"></div>
//                   ) : (
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       <path d="M20 8v6M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                   )}
//                   View Registrations ({regsByEvent[ev.id]?.length || 0})
//                 </button>

//                 <div className="qr-toggle">
//                   <label className="switch">
//                     <input 
//                       type="checkbox" 
//                       checked={Number(ev.regQrEnabled) === 1}
//                       onChange={e => toggleQr(ev.id, e.target.checked)}
//                       disabled={!!busy['qr_'+ev.id]}
//                     />
//                     <span className="slider" />
//                   </label>
//                   <span className="qr-label">
//                     {Number(ev.regQrEnabled) === 1 ? 'QR Enabled' : 'QR Disabled'}
//                   </span>
//                 </div>
//               </div>

//               {/* Logs Section */}
//               {Array.isArray(logsByEvent[ev.id]) && logsByEvent[ev.id].length > 0 && (
//                 <div className="data-section">
//                   <div 
//                     className="section-header"
//                     onClick={() => toggleSection(`logs_${ev.id}`)}
//                   >
//                     <h4>QR Scan Logs ({logsByEvent[ev.id].length})</h4>
//                     <svg 
//                       width="16" 
//                       height="16" 
//                       viewBox="0 0 24 24" 
//                       fill="none"
//                       className={`toggle-icon ${expandedSections[`logs_${ev.id}`] ? 'expanded' : ''}`}
//                     >
//                       <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                   </div>
                  
//                   {expandedSections[`logs_${ev.id}`] && (
//                     <div className="logs-list">
//                       {logsByEvent[ev.id].slice(0, 50).map(log => (
//                         <div className="log-item" key={log.id}>
//                           <div className="log-status">
//                             <span className={`status-badge ${log.status}`}>
//                               {log.status}
//                             </span>
//                           </div>
//                           <div className="log-details">
//                             <div className="log-message">{log.detail}</div>
//                             <div className="log-meta">
//                               <span>Registration: {log.regId}</span>
//                               <span>User: {log.userEmail}</span>
//                               <span>{formatDate(log.createdAt)}</span>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Registrations Section */}
//               {Array.isArray(regsByEvent[ev.id]) && regsByEvent[ev.id].length > 0 && (
//                 <div className="data-section">
//                   <div 
//                     className="section-header"
//                     onClick={() => toggleSection(`regs_${ev.id}`)}
//                   >
//                     <h4>Registrations ({regsByEvent[ev.id].length})</h4>
//                     <svg 
//                       width="16" 
//                       height="16" 
//                       viewBox="0 0 24 24" 
//                       fill="none"
//                       className={`toggle-icon ${expandedSections[`regs_${ev.id}`] ? 'expanded' : ''}`}
//                     >
//                       <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                   </div>
                  
//                   {expandedSections[`regs_${ev.id}`] && (
//                     <div className="registrations-list">
//                       {regsByEvent[ev.id].map(registration => (
//                         <div className="registration-item" key={registration.id}>
//                           <div className="registration-info">
//                             <div className="reg-name">{registration.name}</div>
//                             <div className="reg-email">{registration.email}</div>
//                           </div>
//                           <div className={`checkin-status ${registration.checkedIn ? 'checked-in' : 'not-checked-in'}`}>
//                             {registration.checkedIn ? (
//                               <>
//                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//                                   <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                 </svg>
//                                 Checked In
//                               </>
//                             ) : (
//                               <>
//                                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
//                                   <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                                 </svg>
//                                 Not Checked In
//                               </>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       <style>{`
//         .superadmin-dashboard {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 20px;
//         }

//         /* Header */
//         .dashboard-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-bottom: 32px;
//         }

//         .header-content {
//           flex: 1;
//         }

//         .page-title {
//           font-size: 28px;
//           font-weight: 700;
//           color: var(--text);
//           margin: 0 0 8px 0;
//           background: linear-gradient(135deg, var(--primary), var(--primary-600));
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .page-subtitle {
//           color: var(--muted);
//           font-size: 16px;
//           margin: 0;
//         }

//         .refresh-btn {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           padding: 10px 16px;
//           background: var(--primary);
//           color: white;
//           border: none;
//           border-radius: 10px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .refresh-btn:hover:not(:disabled) {
//           filter: brightness(1.1);
//           transform: translateY(-1px);
//         }

//         .refresh-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         /* Stats Grid */
//         .stats-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//           gap: 16px;
//           margin-bottom: 32px;
//         }

//         .stat-card {
//           display: flex;
//           align-items: center;
//           gap: 16px;
//           padding: 20px;
//           background: var(--panel);
//           border: 1px solid var(--border);
//           border-radius: 16px;
//           transition: all 0.2s ease;
//         }

//         .stat-card:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
//         }

//         .stat-icon {
//           width: 48px;
//           height: 48px;
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .stat-icon.total-events {
//           background: rgba(99, 102, 241, 0.1);
//           color: var(--primary);
//         }

//         .stat-icon.active-events {
//           background: rgba(34, 197, 94, 0.1);
//           color: #16a34a;
//         }

//         .stat-icon.archived-events {
//           background: rgba(148, 163, 184, 0.1);
//           color: #64748b;
//         }

//         .stat-value {
//           font-size: 24px;
//           font-weight: 700;
//           color: var(--text);
//           line-height: 1;
//         }

//         .stat-label {
//           color: var(--muted);
//           font-size: 14px;
//           margin-top: 4px;
//         }

//         /* Loading State */
//         .loading-state {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           padding: 60px 20px;
//           color: var(--muted);
//         }

//         .loading-spinner {
//           width: 32px;
//           height: 32px;
//           border: 3px solid var(--border);
//           border-top: 3px solid var(--primary);
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin-bottom: 16px;
//         }

//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         /* Events Grid */
//         .events-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
//           gap: 20px;
//         }

//         .event-card {
//           background: var(--panel);
//           border: 1px solid var(--border);
//           border-radius: 16px;
//           padding: 20px;
//           transition: all 0.2s ease;
//         }

//         .event-card:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
//         }

//         .event-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-bottom: 16px;
//         }

//         .event-title {
//           font-size: 18px;
//           font-weight: 700;
//           color: var(--text);
//           margin: 0 0 8px 0;
//           line-height: 1.3;
//         }

//         .event-meta {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 8px;
//           align-items: center;
//         }

//         .event-id, .event-date {
//           color: var(--muted);
//           font-size: 12px;
//           padding: 2px 8px;
//           background: var(--bg);
//           border-radius: 6px;
//         }

//         .event-status {
//           font-size: 12px;
//           padding: 2px 8px;
//           border-radius: 6px;
//           font-weight: 600;
//         }

//         .event-status.active {
//           background: rgba(34, 197, 94, 0.1);
//           color: #16a34a;
//         }

//         .event-status.archived {
//           background: rgba(148, 163, 184, 0.1);
//           color: #64748b;
//         }

//         .event-venue {
//           color: var(--muted);
//           font-size: 12px;
//           text-align: right;
//         }

//         .event-details {
//           margin-bottom: 16px;
//         }

//         .detail-item {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           margin-bottom: 4px;
//         }

//         .detail-label {
//           color: var(--muted);
//           font-size: 12px;
//           font-weight: 600;
//         }

//         .detail-value {
//           color: var(--text);
//           font-size: 12px;
//         }

//         /* Actions */
//         .event-actions {
//           display: flex;
//           gap: 8px;
//           margin-bottom: 16px;
//         }

//         .action-btn {
//           flex: 1;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//           padding: 10px 12px;
//           background: var(--bg);
//           border: 1px solid var(--border);
//           border-radius: 10px;
//           color: var(--text);
//           font-size: 12px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .action-btn:hover:not(:disabled) {
//           background: var(--primary);
//           color: white;
//           border-color: var(--primary);
//           transform: translateY(-1px);
//         }

//         .action-btn.active {
//           background: var(--primary);
//           color: white;
//           border-color: var(--primary);
//         }

//         .action-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .button-spinner {
//           width: 12px;
//           height: 12px;
//           border: 2px solid transparent;
//           border-top: 2px solid currentColor;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         /* QR Toggle */
//         .qr-toggle {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .switch {
//           position: relative;
//           display: inline-block;
//           width: 40px;
//           height: 22px;
//         }

//         .switch input {
//           opacity: 0;
//           width: 0;
//           height: 0;
//         }

//         .slider {
//           position: absolute;
//           cursor: pointer;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background-color: var(--border);
//           transition: .2s;
//           border-radius: 999px;
//         }

//         .slider:before {
//           position: absolute;
//           content: "";
//           height: 16px;
//           width: 16px;
//           left: 3px;
//           top: 3px;
//           background-color: white;
//           transition: .2s;
//           border-radius: 50%;
//           box-shadow: 0 1px 2px rgba(0,0,0,0.3);
//         }

//         .switch input:checked + .slider {
//           background-color: var(--primary);
//         }

//         .switch input:checked + .slider:before {
//           transform: translateX(18px);
//         }

//         .qr-label {
//           font-size: 12px;
//           color: var(--muted);
//           min-width: 86px;
//         }

//         /* Data Sections */
//         .data-section {
//           margin-top: 16px;
//           border-top: 1px solid var(--border);
//           padding-top: 16px;
//         }

//         .section-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           cursor: pointer;
//           padding: 8px 0;
//         }

//         .section-header h4 {
//           margin: 0;
//           font-size: 14px;
//           font-weight: 600;
//           color: var(--text);
//         }

//         .toggle-icon {
//           transition: transform 0.2s ease;
//         }

//         .toggle-icon.expanded {
//           transform: rotate(180deg);
//         }

//         /* Logs List */
//         .logs-list, .registrations-list {
//           max-height: 300px;
//           overflow-y: auto;
//           margin-top: 8px;
//         }

//         .log-item, .registration-item {
//           padding: 12px;
//           border: 1px solid var(--border);
//           border-radius: 8px;
//           margin-bottom: 8px;
//           background: var(--bg);
//         }

//         .log-item {
//           display: flex;
//           gap: 12px;
//           align-items: flex-start;
//         }

//         .log-status {
//           flex-shrink: 0;
//         }

//         .status-badge {
//           padding: 4px 8px;
//           border-radius: 6px;
//           font-size: 10px;
//           font-weight: 600;
//           text-transform: uppercase;
//         }

//         .status-badge.generated {
//           background: rgba(34, 197, 94, 0.1);
//           color: #16a34a;
//           border: 1px solid rgba(34, 197, 94, 0.2);
//         }

//         .status-badge.denied {
//           background: rgba(239, 68, 68, 0.1);
//           color: #ef4444;
//           border: 1px solid rgba(239, 68, 68, 0.2);
//         }

//         .log-details {
//           flex: 1;
//         }

//         .log-message {
//           color: var(--text);
//           font-size: 12px;
//           font-weight: 600;
//           margin-bottom: 4px;
//         }

//         .log-meta {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 8px;
//           font-size: 10px;
//           color: var(--muted);
//         }

//         /* Registrations List */
//         .registration-item {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .registration-info {
//           flex: 1;
//         }

//         .reg-name {
//           font-size: 12px;
//           font-weight: 600;
//           color: var(--text);
//           margin-bottom: 2px;
//         }

//         .reg-email {
//           font-size: 11px;
//           color: var(--muted);
//         }

//         .checkin-status {
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           font-size: 11px;
//           font-weight: 600;
//           padding: 4px 8px;
//           border-radius: 6px;
//         }

//         .checkin-status.checked-in {
//           background: rgba(34, 197, 94, 0.1);
//           color: #16a34a;
//         }

//         .checkin-status.not-checked-in {
//           background: rgba(148, 163, 184, 0.1);
//           color: #64748b;
//         }

//         /* Responsive Design */
//         @media (max-width: 768px) {
//           .superadmin-dashboard {
//             padding: 16px;
//           }

//           .dashboard-header {
//             flex-direction: column;
//             gap: 16px;
//           }

//           .stats-grid {
//             grid-template-columns: 1fr;
//           }

//           .events-grid {
//             grid-template-columns: 1fr;
//           }

//           .event-header {
//             flex-direction: column;
//             gap: 8px;
//           }

//           .event-venue {
//             text-align: left;
//           }

//           .event-actions {
//             flex-direction: column;
//           }

//           .log-item {
//             flex-direction: column;
//             gap: 8px;
//           }

//           .registration-item {
//             flex-direction: column;
//             align-items: flex-start;
//             gap: 8px;
//           }

//           .checkin-status {
//             align-self: flex-start;
//           }
//         }

//         @media (max-width: 480px) {
//           .page-title {
//             font-size: 24px;
//           }

//           .stat-card {
//             padding: 16px;
//           }

//           .event-card {
//             padding: 16px;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }