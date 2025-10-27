// import { useEffect, useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { api } from '../api'

// export default function RegistrationForm() {
//   const [events, setEvents] = useState([])
//   const [form, setForm] = useState({ name: '', email: '', contact: '', eventId: '', paymentId: '' })
//   const [message, setMessage] = useState('')
//   const [qr, setQr] = useState('')
//   const [payload, setPayload] = useState('')
//   const navigate = useNavigate()
//   const [answers, setAnswers] = useState({})
//   const [myRegs, setMyRegs] = useState([])
//   const [ads, setAds] = useState([])
//   const [adIdx, setAdIdx] = useState(0)
//   const [qrSelectId, setQrSelectId] = useState('')
//   const [showModal, setShowModal] = useState(false)
//   const [showDetails, setShowDetails] = useState(false)

//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await api.get('/api/events')
//         setEvents(data)
//         const adsRes = await api.get('/api/ads')
//         setAds(Array.isArray(adsRes.data) ? adsRes.data : [])
//       } catch {
//         setMessage('Failed to load events')
//       }
//     })()
//   }, [])

//   useEffect(() => {
//     if (!ads.length) return
//     const t = setInterval(() => {
//       setAdIdx(i => (i + 1) % ads.length)
//     }, 5000)
//     return () => clearInterval(t)
//   }, [ads])

//   useEffect(() => {
//     (async () => {
//       try {
//         const token = localStorage.getItem('auth_token')
//         if (!token) return
//         const { data } = await api.get('/api/registration/mine')
//         setMyRegs(data || [])
//       } catch {
//         // ignore silently; My Events page already surfaces errors
//       }
//     })()
//   }, [])

//   useEffect(() => {
//     if (myRegs.length > 0 && !qrSelectId) {
//       setQrSelectId(String(myRegs[0].id))
//     }
//   }, [myRegs, qrSelectId])

//   const submit = async (e) => {
//     e.preventDefault()
//     setMessage('')
//     setQr('')
//     try {
//       const authed = (() => { try { return JSON.parse(localStorage.getItem('auth_user')||'null') } catch { return null } })()
//       const body = { ...form, email: authed?.email || form.email, name: authed?.name || form.name, answers }
//       const { data } = await api.post('/api/registration', body)
//       setMessage('Registered successfully!')
//       setQr(data.qr)
//       setPayload(data.payload)
//       navigate('/me', { replace: true })
//     } catch (e) {
//       const status = e?.response?.status
//       const errTxt = e?.response?.data?.error || e?.message
//       if (status === 409) setMessage('You have already registered for this event.')
//       else setMessage(errTxt || 'Registration failed')
//     }
//   }

//   const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

//   const authed = (() => { try { return JSON.parse(localStorage.getItem('auth_user')||'null') } catch { return null } })()

//   const selectedEvent = useMemo(() => events.find(ev => String(ev.id) === String(form.eventId)) || null, [events, form.eventId])
//   const schema = useMemo(() => {
//     if (!selectedEvent) return []
//     const raw = selectedEvent.formSchema
//     try {
//       if (!raw) return []
//       return typeof raw === 'string' ? JSON.parse(raw) : raw
//     } catch { return [] }
//   }, [selectedEvent])

//   const setAnswer = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }))
//   const registeredIds = useMemo(() => new Set(myRegs.map(r => String(r.eventId))), [myRegs])
//   const selectedIsRegistered = selectedEvent ? registeredIds.has(String(selectedEvent.id)) : false
//   const selectedReg = useMemo(() => myRegs.find(r => String(r.id) === String(qrSelectId)) || null, [myRegs, qrSelectId])

//   return (
//     <div>
//       <h1>Register</h1>
//       {message && <div className="alert">{message}</div>}
//       {ads.length > 0 && (
//         <div className="card" style={{margin:'10px 0 18px', overflow:'hidden'}}>
//           <div className="row" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
//             <strong>Sponsored</strong>
//             <div className="user-email">{adIdx+1} / {ads.length}</div>
//           </div>
//           <div style={{display:'grid', placeItems:'center'}}>
//             {(() => {
//               const ad = ads[adIdx]
//               const img = (
//                 <img src={ad.image} alt={ad.title||'ad'} style={{maxWidth:'100%', maxHeight:260, width:'100%', objectFit:'cover', borderRadius:10, border:'1px solid var(--border)'}} />
//               )
//               return ad.link ? <a href={ad.link} target="_blank" rel="noreferrer">{img}</a> : img
//             })()}
//           </div>
//         </div>
//       )}
//       <div style={{margin:'12px 0 18px'}}>
//         <strong>Available Events</strong>
//         <div className="grid" style={{marginTop:10}}>
//           {events.map(ev => (
//             <div key={ev.id} className={`card ${String(form.eventId)===String(ev.id)?'fade-in':''}`}>
//               {ev.poster && (
//                 <div className="qr" style={{marginTop:0, marginBottom:10}}>
//                   <img src={typeof ev.poster==='string'?ev.poster:''} alt={`${ev.name} poster`} style={{maxWidth:'100%', maxHeight:180, objectFit:'cover', width:'100%', borderRadius:10, border:'1px solid var(--border)'}} />
//                 </div>
//               )}
//               <div className="row"><strong>{ev.name}</strong></div>
//               <div className="row">Date: {new Date(ev.date).toLocaleString()}</div>
//               <div className="row">Venue: {ev.venue}</div>
//               <div className="actions">
//                 {registeredIds.has(String(ev.id)) ? (
//                   <span className="user-email" style={{padding:'6px 10px', border:'1px solid var(--border)', borderRadius:8, background:'rgba(0,0,0,.04)'}}>Registered</span>
//                 ) : (
//                   <button type="button" onClick={() => { set('eventId', ev.id); setShowModal(true); }}>{String(form.eventId)===String(ev.id)?'Selected':'Register'}</button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {!form.eventId && (
//         <div className="alert">Select an event above to continue registration.</div>
//       )}

//       {/* Registration Modal */}
//       {showModal && form.eventId && !selectedIsRegistered && (
//         <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.35)', display:'grid', placeItems:'center', padding:'16px', zIndex:1000}} onClick={() => setShowModal(false)}>
//           <div className="card" style={{maxWidth:640, width:'100%', position:'relative'}} onClick={e => e.stopPropagation()}>
//             <div className="row" style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:8}}>
//               <strong>Register for Event</strong>
//               <div style={{display:'flex', gap:8, alignItems:'center'}}>
//                 <button type="button" onClick={() => setShowDetails(v => !v)} title="Show details" aria-label="Show details" style={{background:'transparent', color:'var(--text)', border:'1px solid var(--border)'}}>
//                   {showDetails ? '▲ Details' : '▼ Details'}
//                 </button>
//                 <button type="button" className="danger" onClick={() => setShowModal(false)}>Close</button>
//               </div>
//             </div>
//             {/* Collapsible Event Details */}
//             {selectedEvent && (
//               <div style={{
//                 overflow:'hidden',
//                 transition:'max-height .25s ease',
//                 maxHeight: showDetails ? 300 : 0,
//                 border:'1px solid var(--border)',
//                 borderRadius:10,
//                 padding: showDetails ? 12 : 0,
//                 background:'var(--panel)'
//               }}>
//                 <div className="row" style={{marginTop:0}}>
//                   <strong>{selectedEvent.name}</strong>
//                 </div>
//                 <div className="row">Date: {new Date(selectedEvent.date).toLocaleString()}</div>
//                 <div className="row">Venue: {selectedEvent.venue}</div>
//                 {selectedEvent.speaker && <div className="row">Speaker: {selectedEvent.speaker}</div>}
//                 {selectedEvent.food && <div className="row">Food: {selectedEvent.food}</div>}
//                 {/* If a description field exists in the event record, show it */}
//                 {selectedEvent.description && (
//                   <div className="row" style={{color:'var(--muted)'}}>Description: {selectedEvent.description}</div>
//                 )}
//               </div>
//             )}
//             <form onSubmit={submit} className="form">
//               <label>Name<input value={authed?.name || form.name} onChange={e => set('name', e.target.value)} required readOnly={!!authed} /></label>
//               <label>Email<input type="email" value={authed?.email || form.email} onChange={e => set('email', e.target.value)} required readOnly={!!authed} /></label>
//               <label>Contact<input value={form.contact} onChange={e => set('contact', e.target.value)} /></label>

//               {schema.length > 0 && (
//                 <div>
//                   <strong>Additional Details</strong>
//                   <div style={{display:'grid', gap:10, marginTop:8}}>
//                     {schema.map(f => (
//                       <div key={f.id || f.label}>
//                         {f.type === 'text' && (
//                           <label>{f.label}<input value={answers[f.label] || ''} onChange={e => setAnswer(f.label, e.target.value)} /></label>
//                         )}
//                         {f.type === 'select' && Array.isArray(f.options) && (
//                           <label>{f.label}
//                             <select value={answers[f.label] || ''} onChange={e => setAnswer(f.label, e.target.value)}>
//                               <option value="">Select</option>
//                               {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//                             </select>
//                           </label>
//                         )}
//                         {f.type === 'multiselect' && Array.isArray(f.options) && (
//                           <div>
//                             <div style={{fontSize:14, color:'var(--muted)'}}>{f.label}</div>
//                             <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
//                               {f.options.map(opt => {
//                                 const values = Array.isArray(answers[f.label]) ? answers[f.label] : []
//                                 const checked = values.includes(opt)
//                                 return (
//                                   <label key={opt} style={{display:'flex', alignItems:'center', gap:6}}>
//                                     <input type="checkbox" checked={checked} onChange={e => {
//                                       const v = new Set(values)
//                                       if (e.target.checked) v.add(opt); else v.delete(opt)
//                                       setAnswer(f.label, Array.from(v))
//                                     }} /> {opt}
//                                   </label>
//                                 )
//                               })}
//                             </div>
//                           </div>
//                         )}
//                         {f.type === 'checkbox' && (
//                           <label style={{display:'flex', alignItems:'center', gap:8}}>
//                             <input type="checkbox" checked={!!answers[f.label]} onChange={e => setAnswer(f.label, e.target.checked)} /> {f.label}
//                           </label>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//               <button type="submit">Register</button>
//             </form>
//           </div>
//         </div>
//       )}

//       {form.eventId && selectedIsRegistered && (
//         <div className="alert">You have already registered for this event.</div>
//       )}

//     </div>
//   )}


import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom'
import { api } from '../api'

export default function RegistrationForm() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState({ name: '', email: '', contact: '', eventId: '', paymentId: '' })
  const [message, setMessage] = useState('')
  const [qr, setQr] = useState('')
  const [payload, setPayload] = useState('')
  const navigate = useNavigate()
  const [answers, setAnswers] = useState({})
  const [myRegs, setMyRegs] = useState([])
  const [ads, setAds] = useState([])
  const [adIdx, setAdIdx] = useState(0)
  const [qrSelectId, setQrSelectId] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(false)
  const [eventsLoading, setEventsLoading] = useState(true)
  
  // Get authentication status and check if user is admin
  const authed = (() => { try { return JSON.parse(localStorage.getItem('auth_user')||'null') } catch { return null } })()
  const isAdmin = !!authed && (authed?.role === 'admin' || authed?.role === 'superadmin')
  const { id: routeEventId } = useParams()
  const location = useLocation()

  // Immediately open modal and preselect event when route has :id
  useEffect(() => {
    if (!routeEventId) return
    setShowModal(true)
    setForm(prev => ({ ...prev, eventId: String(routeEventId) }))
  }, [routeEventId])

  useEffect(() => {
    (async () => {
      try {
        setEventsLoading(true)
        if (isAdmin) {
          const eventsRes = await api.get('/api/events')
          setEvents(eventsRes.data)
          setAds([])
        } else {
          const [eventsRes, adsRes] = await Promise.all([
            api.get('/api/events'),
            api.get('/api/ads')
          ])
          setEvents(eventsRes.data)
          setAds(Array.isArray(adsRes.data) ? adsRes.data : [])
        }
      } catch {
        setMessage('Failed to load events')
      } finally {
        setEventsLoading(false)
      }
    })()
  }, [isAdmin])

  // If route contains an event ID, preselect it and open the modal when events are loaded
  useEffect(() => {
    if (!eventsLoading && routeEventId && events.length > 0) {
      const found = events.find(ev => String(ev.id) === String(routeEventId))
      if (found) {
        setForm(prev => ({ ...prev, eventId: String(found.id) }))
        setShowModal(true)
      }
    }
  }, [eventsLoading, events, routeEventId])

  // If user opens a per-event registration link, verify session via cookie-aware API and redirect to login only if unauthorized
  useEffect(() => {
    if (!routeEventId) return
    let cancelled = false
    ;(async () => {
      try {
        await api.get('/api/auth/me')
        // authenticated (via cookie or header); do nothing
      } catch (e) {
        if (cancelled) return
        const status = e?.response?.status
        if (status === 401) {
          const from = location?.pathname + (location?.search || '')
          navigate('/login', { state: { from }, replace: true })
        }
      }
    })()
    return () => { cancelled = true }
  }, [routeEventId, location, navigate])

  useEffect(() => {
    if (!ads.length) return
    const t = setInterval(() => {
      setAdIdx(i => (i + 1) % ads.length)
    }, 5000)
    return () => clearInterval(t)
  }, [ads])

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) return
        const { data } = await api.get('/api/registration/mine')
        setMyRegs(data || [])
      } catch {
        // ignore silently; My Events page already surfaces errors
      }
    })()
  }, [])

  useEffect(() => {
    if (myRegs.length > 0 && !qrSelectId) {
      setQrSelectId(String(myRegs[0].id))
    }
  }, [myRegs, qrSelectId])

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    setQr('')
    setLoading(true)
    try {
      if (isAdmin && !form.paymentId) {
        setMessage('Please enter a payment ID to register as admin')
        return
      }
      // Client-side validation for required custom fields
      try {
        const reqErrors = []
        if (Array.isArray(schema) && schema.length) {
          for (const f of schema) {
            if (!f?.required) continue
            const val = answers[f.label]
            const present = (
              (f.type === 'checkbox') ? !!val :
              (f.type === 'multiselect') ? Array.isArray(val) && val.length > 0 :
              (f.type === 'image' || f.type === 'file') ? !!(val && (val.dataUrl || (typeof val === 'string' && val))) :
              (val != null && String(val).trim().length > 0)
            )
            if (!present) reqErrors.push(f.label)
          }
        }
        if (reqErrors.length) {
          setLoading(false)
          setMessage(`Please fill required fields: ${reqErrors.join(', ')}`)
          return
        }
      } catch {}
      const authed = (() => { try { return JSON.parse(localStorage.getItem('auth_user')||'null') } catch { return null } })()
      const body = { ...form, email: authed?.email || form.email, name: authed?.name || form.name, answers }
      const { data } = await api.post('/api/registration', body)
      setMessage('Registered successfully!')
      setQr(data.qr)
      setPayload(data.payload)
      
      // Close the modal on successful registration
      setShowModal(false)
      setShowDetails(false)
      setForm(prev => ({ ...prev, eventId: '' }))
      setAnswers({})
      
      // Refresh registrations list
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          const { data: regsData } = await api.get('/api/registration/mine')
          setMyRegs(regsData || [])
        }
      } catch {}
      
      // For direct event registration, go back to events page; otherwise go to user dashboard
      if (routeEventId && !isAdmin) {
        navigate('/register', { replace: true })
      } else {
        navigate('/me', { replace: true })
      }
    } catch (e) {
      const status = e?.response?.status
      const errTxt = e?.response?.data?.error || e?.message
      if (status === 409) setMessage('You have already registered for this event.')
      else setMessage(errTxt || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))


  const selectedEvent = useMemo(() => events.find(ev => String(ev.id) === String(form.eventId)) || null, [events, form.eventId])
  const schema = useMemo(() => {
    if (!selectedEvent) return []
    const raw = selectedEvent.formSchema
    try {
      if (!raw) return []
      return typeof raw === 'string' ? JSON.parse(raw) : raw
    } catch { return [] }
  }, [selectedEvent])

  const setAnswer = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }))
  const registeredIds = useMemo(() => new Set(myRegs.map(r => String(r.eventId))), [myRegs])
  const selectedIsRegistered = selectedEvent ? registeredIds.has(String(selectedEvent.id)) : false
  const selectedReg = useMemo(() => myRegs.find(r => String(r.id) === String(qrSelectId)) || null, [myRegs, qrSelectId])

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Event Registration</h1>
        <div className="header-subtitle">
          {routeEventId && !isAdmin ? 
            `Register for ${events.find(ev => String(ev.id) === String(routeEventId))?.name || 'this event'}` : 
            'Discover and register for upcoming events'
          }
        </div>
        {routeEventId && isAdmin && (
          <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:8}}>
            <Link to={`/events/${routeEventId}`} className="view-all-btn" style={{textDecoration:'none'}}>View Event</Link>
            <button
              type="button"
              className="view-all-btn"
              onClick={async () => {
                try {
                  const url = `${window.location.origin}/events/${routeEventId}/register`
                  const eventName = events.find(ev => String(ev.id) === String(routeEventId))?.name || 'Event'
                  if (navigator.share) {
                    await navigator.share({ 
                      title: `${eventName} - Registration`, 
                      text: `Join me at ${eventName}! Register here:`,
                      url 
                    })
                  } else if (navigator.clipboard) {
                    await navigator.clipboard.writeText(url)
                    alert('Registration link copied! Share this with friends so they can register directly.')
                  }
                } catch (err) {
                  // Fallback: show the link in a prompt
                  const url = `${window.location.origin}/events/${routeEventId}/register`
                  prompt('Copy this registration link to share:', url)
                }
              }}
              title="Copy/share registration link"
            >
              Share Registration Link
            </button>
            <span className="registered-badge" title="Admin access">
              Admin Mode
            </span>
          </div>
        )}
      </div>

      {/* Advertisements Carousel */}
      {!isAdmin && ads.length > 0 && (
        <div className="ad-carousel">
          <div className="ad-header">
            <span className="ad-label">Sponsored</span>
            <div className="ad-counter">
              {adIdx + 1} / {ads.length}
            </div>
          </div>
          <div className="ad-content">
            {(() => {
              const ad = ads[adIdx]
              const img = (
                <img 
                  src={ad.image} 
                  alt={ad.title || 'Advertisement'} 
                  className="ad-image"
                />
              )
              return ad.link ? (
                <a href={ad.link} target="_blank" rel="noopener noreferrer" className="ad-link">
                  {img}
                </a>
              ) : img
            })()}
          </div>
        </div>
      )}

      {/* Events Grid */}
      <section className="events-section">
        <div className="section-header">
          <h2>Available Events</h2>
          <div className="events-count">
            {events.length} event{events.length !== 1 ? 's' : ''} available
          </div>
        </div>

        {eventsLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M8 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H8C6.9 18 6 17.1 6 16V8C6 6.9 6.9 6 8 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 18V20C16 21.1 15.1 22 14 22H6C4.9 22 4 21.1 4 20V12C4 10.9 4.9 10 6 10H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>No events available</h3>
            <p>Check back later for upcoming events</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map(ev => {
              const isRegistered = registeredIds.has(String(ev.id))
              const isSelected = String(form.eventId) === String(ev.id)
              // Registration window checks
              const now = Date.now()
              const startMs = ev.startAt ? new Date(ev.startAt).getTime() : (ev.date ? new Date(ev.date).getTime() : NaN)
              const started = Number.isFinite(startMs) && now >= startMs
              const regCloseMs = ev.regCloseAt ? new Date(ev.regCloseAt).getTime() : NaN
              const deadlinePassed = Number.isFinite(regCloseMs) && now > regCloseMs
              const manualClosed = Number(ev.regClosed || 0) === 1
              const allowAfterStart = Number(ev.allowAfterStart || 0) === 1
              const registrationClosed = manualClosed || deadlinePassed || (started && !allowAfterStart)

              return (
                <div 
                  key={ev.id} 
                  className={`event-card ${isSelected ? 'selected' : ''} ${isRegistered ? 'registered' : ''}`}
                >
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
                      {isRegistered && (
                        <span className="status-badge registered">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Registered
                        </span>
                      )}
                    </div>
                    
                    <div className="event-details">
                      <div className="detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <span>{new Date(ev.date).toLocaleString()}</span>
                      </div>
                      <div className="detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M17.657 16.657L13.414 20.9C13.039 21.2746 12.5306 21.485 12 21.485C11.4694 21.485 10.961 21.2746 10.586 20.9L6.343 16.657C5.22422 15.5381 4.46234 14.1127 4.15369 12.5608C3.84504 11.009 4.00349 9.40047 4.60901 7.93868C5.21452 6.4769 6.2399 5.22749 7.55548 4.34846C8.87107 3.46943 10.4178 3.00024 12 3.00024C13.5822 3.00024 15.1289 3.46943 16.4445 4.34846C17.7601 5.22749 18.7855 6.4769 19.391 7.93868C19.9965 9.40047 20.155 11.009 19.8463 12.5608C19.5377 14.1127 18.7758 15.5381 17.657 16.657Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{ev.venue}</span>
                      </div>
                      {ev.speaker && (
                        <div className="detail-item">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>{ev.speaker}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="event-actions">
                      {isRegistered ? (
                        <span className="registered-badge">Already Registered</span>
                      ) : registrationClosed ? (
                        <span className="registered-badge" title={manualClosed ? 'Closed by admin' : (started ? 'Event started' : 'Deadline passed')}>
                          Registration Closed
                        </span>
                      ) : (
                        <button 
                          type="button" 
                          className={`select-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => { 
                            set('eventId', ev.id); 
                            if (!routeEventId) {
                              navigate(`/events/${ev.id}/register`);
                            } else {
                              navigate(`/events/${ev.id}/register`); 
                            }
                          }}
                        >
                          {isSelected ? (
                            <>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Selected
                            </>
                          ) : (
                            <>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Register
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Registration Modal */}
      {showModal && form.eventId && !selectedIsRegistered && (
        <div className="modal-overlay" onClick={() => {
          setShowModal(false)
          setShowDetails(false)
          setForm(prev => ({ ...prev, eventId: '' }))
          if (routeEventId && !isAdmin) {
            navigate('/register')
          }
        }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Register for Event</h2>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="details-btn"
                  onClick={() => setShowDetails(v => !v)}
                >
                  {showDetails ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Hide Details
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6 15L12 9L18 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Show Details
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="close-btn"
                  onClick={() => {
                    setShowModal(false)
                    setShowDetails(false)
                    setForm(prev => ({ ...prev, eventId: '' }))
                    if (routeEventId && !isAdmin) {
                      navigate('/register')
                    }
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Error/Success Message inside Modal */}
            {message && (
              <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'} fade-in`} style={{margin: '20px 24px 0'}}>
                <div className="alert-content">
                  <span>{message}</span>
                  <button className="alert-close" onClick={() => setMessage('')}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Event Details */}
            {selectedEvent && showDetails && (
              <div className="event-details-panel">
                <div className="details-grid">
                  <div className="detail-card">
                    <h3>{selectedEvent.name}</h3>
                    <div className="detail-items">
                      <div className="detail-item">
                        <strong>Date & Time:</strong>
                        <span>{new Date(selectedEvent.date).toLocaleString()}</span>
                      </div>
                      <div className="detail-item">
                        <strong>Venue:</strong>
                        <span>{selectedEvent.venue}</span>
                      </div>
                      {selectedEvent.speaker && (
                        <div className="detail-item">
                          <strong>Speaker:</strong>
                          <span>{selectedEvent.speaker}</span>
                        </div>
                      )}
                      {selectedEvent.food && (
                        <div className="detail-item">
                          <strong>Food:</strong>
                          <span>{selectedEvent.food}</span>
                        </div>
                      )}
                      {selectedEvent.description && (
                        <div className="detail-item full-width">
                          <strong>Description:</strong>
                          <span>{selectedEvent.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={submit} className="registration-form">
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Full Name *
                      <input 
                        className="form-input"
                        value={authed?.name || form.name} 
                        onChange={e => set('name', e.target.value)} 
                        required 
                        readOnly={!!authed}
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Email Address *
                      <input 
                        type="email" 
                        className="form-input"
                        value={authed?.email || form.email} 
                        onChange={e => set('email', e.target.value)} 
                        required 
                        readOnly={!!authed}
                      />
                    </label>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Contact Number
                      <input 
                        type="tel" 
                        className="form-input"
                        value={form.contact} 
                        onChange={e => set('contact', e.target.value)} 
                        placeholder="Enter your contact number"
                        required
                      />
                    </label>
                  </div>
                  {isAdmin && (
                    <div className="form-group">
                      <label className="form-label">
                        Payment ID (Required for Admin)
                        <input 
                          type="text" 
                          className="form-input"
                          value={form.paymentId} 
                          onChange={e => set('paymentId', e.target.value)} 
                          placeholder="Enter payment reference ID"
                          required
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Form Fields */}
              {schema.length > 0 && (
                <div className="form-section">
                  <h3>Additional Information</h3>
                  <div className="custom-fields">
                    {schema.map(f => (
                      <div key={f.id || f.label} className="custom-field">
                        {f.type === 'text' && (
                          <div className="form-group">
                            <label className="form-label">
                              {f.label}{f.required ? ' *' : ''}
                              <input 
                                className="form-input"
                                value={answers[f.label] || ''} 
                                onChange={e => setAnswer(f.label, e.target.value)}
                                placeholder={`Enter ${f.label.toLowerCase()}...`}
                              />
                            </label>
                          </div>
                        )}
                        {f.type === 'select' && Array.isArray(f.options) && (
                          <div className="form-group">
                            <label className="form-label">
                              {f.label}{f.required ? ' *' : ''}
                              <select 
                                className="form-input"
                                value={answers[f.label] || ''} 
                                onChange={e => setAnswer(f.label, e.target.value)}
                              >
                                <option value="">Select an option</option>
                                {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                              </select>
                            </label>
                          </div>
                        )}
                        {f.type === 'multiselect' && Array.isArray(f.options) && (
                          <div className="form-group">
                            <label className="form-label">{f.label}{f.required ? ' *' : ''}</label>
                            <div className="checkbox-grid">
                              {f.options.map(opt => {
                                const values = Array.isArray(answers[f.label]) ? answers[f.label] : []
                                const checked = values.includes(opt)
                                return (
                                  <label key={opt} className="checkbox-label">
                                    <input 
                                      type="checkbox" 
                                      className="checkbox-input"
                                      checked={checked} 
                                      onChange={e => {
                                        const v = new Set(values)
                                        if (e.target.checked) v.add(opt); else v.delete(opt)
                                        setAnswer(f.label, Array.from(v))
                                      }} 
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span className="checkbox-text">{opt}</span>
                                  </label>
                                )
                              })}
                            </div>
                          </div>
                        )}
                        {f.type === 'checkbox' && (
                          <div className="form-group">
                            <label className="checkbox-label full-width">
                              <input 
                                type="checkbox" 
                                className="checkbox-input"
                                checked={!!answers[f.label]} 
                                onChange={e => setAnswer(f.label, e.target.checked)} 
                              />
                              <span className="checkbox-custom"></span>
                              <span className="checkbox-text">{f.label}{f.required ? ' *' : ''}</span>
                            </label>
                          </div>
                        )}
                        {f.type === 'image' && (
                          <div className="form-group">
                            <label className="form-label">
                              {f.label}{f.required ? ' *' : ''}
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="form-input"
                                onChange={e => {
                                  const file = e.target.files?.[0]
                                  if (!file) { setAnswer(f.label, ''); return }
                                  const reader = new FileReader()
                                  reader.onload = () => setAnswer(f.label, { name: file.name, type: file.type, dataUrl: String(reader.result||'') })
                                  reader.readAsDataURL(file)
                                }}
                              />
                            </label>
                            {(() => {
                              const v = answers[f.label]
                              if (!v || !(v.dataUrl || typeof v === 'string')) return null
                              const src = typeof v === 'string' ? v : v.dataUrl
                              return (
                                <div style={{marginTop:8, display:'flex', alignItems:'center', gap:10}}>
                                  <img src={src} alt={f.label} style={{maxHeight:80, border:'1px solid var(--border)', borderRadius:8}} />
                                  <span style={{fontSize:12, color:'var(--muted)'}}>{typeof v === 'string' ? '' : v.name}</span>
                                </div>
                              )
                            })()}
                          </div>
                        )}
                        {f.type === 'file' && (
                          <div className="form-group">
                            <label className="form-label">
                              {f.label}{f.required ? ' *' : ''}
                              <input 
                                type="file" 
                                className="form-input"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                onChange={e => {
                                  const file = e.target.files?.[0]
                                  if (!file) { setAnswer(f.label, ''); return }
                                  const reader = new FileReader()
                                  reader.onload = () => setAnswer(f.label, { name: file.name, type: file.type, dataUrl: String(reader.result||'') })
                                  reader.readAsDataURL(file)
                                }}
                              />
                            </label>
                            {(() => {
                              const v = answers[f.label]
                              if (!v || !(v.dataUrl || typeof v === 'string')) return null
                              return (
                                <div style={{marginTop:8, display:'flex', alignItems:'center', gap:10}}>
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                  <span style={{fontSize:12, color:'var(--muted)'}}>{typeof v === 'string' ? '' : v.name}</span>
                                </div>
                              )
                            })()}
                          </div>
                        )}
                        {f.type === 'ppt' && (
                          <div className="form-group">
                            <label className="form-label">
                              {f.label}{f.required ? ' *' : ''}
                              <input 
                                type="file" 
                                className="form-input"
                                accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                onChange={e => {
                                  const file = e.target.files?.[0]
                                  if (!file) { setAnswer(f.label, ''); return }
                                  const reader = new FileReader()
                                  reader.onload = () => setAnswer(f.label, { name: file.name, type: file.type, dataUrl: String(reader.result||'') })
                                  reader.readAsDataURL(file)
                                }}
                              />
                            </label>
                            {(() => {
                              const v = answers[f.label]
                              if (!v || !(v.dataUrl || typeof v === 'string')) return null
                              return (
                                <div style={{marginTop:8, display:'flex', alignItems:'center', gap:10}}>
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                  <span style={{fontSize:12, color:'var(--muted)'}}>{typeof v === 'string' ? '' : v.name}</span>
                                </div>
                              )
                            })()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => {
                    setShowModal(false)
                    setShowDetails(false)
                    setForm(prev => ({ ...prev, eventId: '' }))
                    if (routeEventId && !isAdmin) {
                      navigate('/register')
                    }
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn primary-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner-small"></div>
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Complete Registration{isAdmin ? ' (Admin)' : ''}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
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

        .dashboard-header h1 {
          margin: 0 0 8px 0;
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary), var(--primary-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-subtitle {
          color: var(--muted);
          font-size: 1rem;
          line-height: 1.5;
        }

        /* Ad Carousel */
        .ad-carousel {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 32px;
          box-shadow: var(--shadow);
        }

        .ad-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .ad-label {
          font-weight: 600;
          color: var(--text);
          font-size: 1.125rem;
        }

        .ad-counter {
          color: var(--muted);
          font-size: 0.875rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 8px;
          border-radius: 6px;
        }

        .ad-content {
          border-radius: 12px;
          overflow: hidden;
        }

        .ad-image {
          width: 100%;
          height: 260px;
          object-fit: cover;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .ad-link {
          display: block;
          transition: transform 0.2s ease;
        }

        .ad-link:hover {
          transform: scale(1.02);
        }

        /* Events Section */
        .events-section {
          margin-bottom: 32px;
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

        .events-count {
          color: var(--muted);
          font-size: 0.9rem;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .event-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
        }

        .event-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .event-card.selected {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary);
        }

        .event-card.registered {
          opacity: 0.8;
        }

        .event-poster {
          width: 100%;
          height: 200px;
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
          gap: 12px;
        }

        .event-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
          margin: 0;
          line-height: 1.4;
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--muted);
          font-size: 0.9rem;
        }

        .event-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .select-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--card);
          color: var(--text);
          border: 2px solid var(--border);
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .select-btn:hover {
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        .select-btn.selected {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .registered-badge {
          padding: 8px 12px;
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
        }

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
        }

        .status-badge.registered {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          opacity: 0;
          animation: fadeIn 0.3s forwards;
        }
        
        @keyframes fadeIn {
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 32px;
          position: relative;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
          transform: translateY(20px);
          opacity: 0;
          animation: slideUp 0.3s 0.1s forwards;
        }
        
        @keyframes slideUp {
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 24px 0;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
          margin: 0;
        }

        .modal-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .details-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .details-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--primary);
        }

        .close-btn {
          padding: 8px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        /* Event Details Panel */
        .event-details-panel {
          padding: 0 24px;
          margin: 16px 0;
        }

        .details-grid {
          display: grid;
          gap: 16px;
        }

        .detail-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
        }

        .detail-card h3 {
          margin: 0 0 16px 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
        }

        .detail-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-item {
          display: flex;
          gap: 12px;
        }

        .detail-item.full-width {
          flex-direction: column;
          gap: 8px;
        }

        .detail-item strong {
          color: var(--text);
          font-weight: 600;
          min-width: 120px;
        }

        .detail-item span {
          color: var(--muted);
          flex: 1;
        }

        /* Registration Form */
        .registration-form {
          padding: 24px;
        }

        .form-section {
          margin-bottom: 32px;
        }

        .form-section h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 20px 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 8px;
        }

        .form-input {
          padding: 12px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        .form-input:read-only {
          background: rgba(255, 255, 255, 0.05);
          color: var(--muted);
          cursor: not-allowed;
        }

        .custom-fields {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .custom-field {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
        }

        .checkbox-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
          margin-top: 8px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-label.full-width {
          width: 100%;
        }

        .checkbox-input {
          display: none;
        }

        .checkbox-custom {
          width: 18px;
          height: 18px;
          border: 2px solid var(--border);
          border-radius: 4px;
          background: var(--panel);
          position: relative;
          transition: all 0.2s ease;
        }

        .checkbox-input:checked + .checkbox-custom {
          background: var(--primary);
          border-color: var(--primary);
        }

        .checkbox-input:checked + .checkbox-custom::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .checkbox-text {
          color: var(--text);
          font-size: 0.9rem;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
        }

        .cancel-btn {
          padding: 12px 24px;
          background: var(--card);
          color: var(--text);
          border: 2px solid var(--border);
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          border-color: var(--primary);
        }

        .submit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-weight: 600;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        .alert-success {
          background: rgba(34, 197, 94, 0.12);
          color: #166534;
          border-color: rgba(34, 197, 94, 0.28);
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

        .primary-btn:hover:not(:disabled) {
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

          .events-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .modal-content {
            margin: 0;
            border-radius: 0;
            max-height: 100vh;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .checkbox-grid {
            grid-template-columns: 1fr;
          }

          .detail-item {
            flex-direction: column;
            gap: 4px;
          }

          .detail-item strong {
            min-width: auto;
          }
        }

        @media (max-width: 480px) {
          .modal-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .modal-actions {
            width: 100%;
            justify-content: space-between;
          }

          .event-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .ad-image {
            height: 200px;
          }
        }
      `}</style>
    </div>
  )
}