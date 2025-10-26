import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    ;(async () => {
      try {
        const { data } = await api.get(`/api/events/${id}`)
        if (!active) return
        setEvent(data || null)
        setError(null)
      } catch (e) {
        if (!active) return
        setError('Event not found')
        setEvent(null)
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [id])

  const onShare = async () => {
    try {
      const eventUrl = window.location.href
      const registrationUrl = `${window.location.origin}/events/${event.id}/register`
      
      if (navigator.share) {
        await navigator.share({ 
          title: `${event?.name || 'Event'} - Registration`, 
          text: `Join me at ${event?.name}! Register here:`, 
          url: registrationUrl 
        })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(registrationUrl)
        alert('Registration link copied to clipboard! Share this with friends so they can register directly.')
      }
    } catch (err) {
      console.error('Share failed:', err)
      // Fallback: show the link in a prompt
      const registrationUrl = `${window.location.origin}/events/${event.id}/register`
      prompt('Copy this registration link to share:', registrationUrl)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="section-card"><div className="loading-text">Loading...</div></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container">
        <div className="section-card" style={{display:'grid', gap:12}}>
          <div className="empty-state">
            <h3>Event not found</h3>
            <p>The event may have been removed or the link is incorrect.</p>
          </div>
          <div style={{display:'flex', justifyContent:'center'}}>
            <button className="view-all-btn" onClick={() => navigate(-1)}>Go Back</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="section-card" style={{display:'grid', gap:16}}>
        <div className="section-header">
          <h2>{event.name}</h2>
          <div style={{display:'flex', gap:8}}>
            <Link to={`/events/${event.id}/register`} className="view-all-btn" style={{textDecoration:'none', display:'inline-flex', alignItems:'center'}}>
              Register
            </Link>
            <button className="view-all-btn" onClick={onShare}>
              Share Registration Link
            </button>
            <Link to="/" className="view-all-btn" style={{textDecoration:'none', display:'inline-flex', alignItems:'center'}}>Home</Link>
          </div>
        </div>
        {event.poster && (
          <div className="event-poster" style={{width:'100%', maxHeight:420, overflow:'hidden', borderRadius:12, border:'1px solid var(--border)'}}>
            <img src={typeof event.poster === 'string' ? event.poster : ''} alt={`${event.name} poster`} style={{width:'100%', height:'100%', objectFit:'cover'}} />
          </div>
        )}
        <div className="event-details" style={{display:'grid', gap:8}}>
          <div className="detail-item"><strong>Date:</strong> <span>{new Date(event.date).toLocaleString()}</span></div>
          <div className="detail-item"><strong>Venue:</strong> <span>{event.venue}</span></div>
          {event.speaker && <div className="detail-item"><strong>Speaker:</strong> <span>{event.speaker}</span></div>}
          {event.food && <div className="detail-item"><strong>Food:</strong> <span>{event.food}</span></div>}
        </div>
        {event.description && (
          <div style={{color:'var(--muted)', lineHeight:1.6}}>
            {event.description}
          </div>
        )}
      </div>
    </div>
  )
}
