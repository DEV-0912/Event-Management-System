// import { useState } from 'react'
// import { api } from '../api'

// export default function EventForm() {
//   const [form, setForm] = useState({ name: '', date: '', venue: '', speaker: '', food: '' })
//   const [message, setMessage] = useState('')
//   const [fields, setFields] = useState([])
//   const [newField, setNewField] = useState({ label: '', type: 'text', options: '' })
//   const [poster, setPoster] = useState('')

//   const submit = async (e) => {
//     e.preventDefault()
//     try {
//       const formSchema = fields.map((f, idx) => ({ id: idx + 1, label: f.label.trim(), type: f.type, options: f.options?.length ? f.options : undefined }))
//       await api.post('/api/events', { ...form, formSchema, poster })
//       setMessage('Event created!')
//       setForm({ name: '', date: '', venue: '', speaker: '', food: '', description: '' })
//       setFields([])
//       setNewField({ label: '', type: 'text', options: '' })
//       setPoster('')
//     } catch (e) {
//       setMessage('Failed to create event')
//     }
//   }

//   const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

//   const addField = () => {
//     if (!newField.label.trim()) return
//     const field = {
//       label: newField.label.trim(),
//       type: newField.type,
//       options: (newField.type === 'select' || newField.type === 'multiselect')
//         ? newField.options.split(',').map(s => s.trim()).filter(Boolean)
//         : []
//     }
//     setFields(prev => [...prev, field])
//     setNewField({ label: '', type: 'text', options: '' })
//   }
//   const removeField = (i) => setFields(prev => prev.filter((_, idx) => idx !== i))

//   const onPosterChange = (file) => {
//     if (!file) { setPoster(''); return }
//     const reader = new FileReader()
//     reader.onload = () => setPoster(String(reader.result || ''))
//     reader.readAsDataURL(file)
//   }

//   return (
//     <div>
//       <h1>Create Event</h1>
//       {message && <div className="alert">{message}</div>}
//       <form onSubmit={submit} className="form">
//         <label>Name<input value={form.name} onChange={e => set('name', e.target.value)} required /></label>
//         <label>Date/time<input type="datetime-local" value={form.date} onChange={e => set('date', e.target.value)} required /></label>
//         <label>Venue<input value={form.venue} onChange={e => set('venue', e.target.value)} required /></label>
//         <label>Speaker<input value={form.speaker} onChange={e => set('speaker', e.target.value)} /></label>
//         <label>Food<input value={form.food} onChange={e => set('food', e.target.value)} /></label>

//         <div>
//           <strong>Poster</strong>
//           <div style={{display:'grid', gap:8, marginTop:8}}>
//             <input type="file" accept="image/*" onChange={e => onPosterChange(e.target.files?.[0])} />
//             {poster && (
//               <div className="qr" style={{gap:8}}>
//                 <img src={poster} alt="Poster preview" style={{maxWidth:280, borderRadius:10, border:'1px solid var(--border)'}} />
//                 <button type="button" className="danger" onClick={() => setPoster('')}>Remove Poster</button>
//               </div>
//             )}
//           </div>
//         </div>

//         <div>
//           <strong>Custom Registration Fields</strong>
//           <div style={{display:'grid', gap:8, marginTop:8}}>
//             <label>Label<input value={newField.label} onChange={e => setNewField(v => ({...v, label: e.target.value}))} placeholder="e.g. T-Shirt Size" /></label>
//             <label>Type<select value={newField.type} onChange={e => setNewField(v => ({...v, type: e.target.value}))}>
//               <option value="text">Text</option>
//               <option value="select">Options (single choice)</option>
//               <option value="multiselect">Options (multiple)</option>
//               <option value="checkbox">Tick mark (Yes/No)</option>
//             </select></label>
//             {(newField.type === 'select' || newField.type === 'multiselect') && (
//               <label>Options (comma separated)<input value={newField.options} onChange={e => setNewField(v => ({...v, options: e.target.value}))} placeholder="S, M, L, XL" /></label>
//             )}
//             <div style={{display:'flex', gap:8}}>
//               <button type="button" onClick={addField}>Add Field</button>
//             </div>
//           </div>

//           {fields.length > 0 && (
//             <div className="list" style={{marginTop:12}}>
//               {fields.map((f, i) => (
//                 <div className="card" key={i}>
//                   <div className="row"><strong>{f.label}</strong> — {f.type}{(f.type==='select'||f.type==='multiselect') && ` [${f.options.join(', ')}]`}</div>
//                   <div className="actions"><button type="button" className="danger" onClick={() => removeField(i)}>Remove</button></div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//         <button type="submit">Create</button>
//       </form>
//     </div>
//   )
// }


import { useState } from 'react'
import { api } from '../api'

export default function EventForm() {
  const [form, setForm] = useState({ 
    name: '', 
    date: '', 
    venue: '', 
    speaker: '', 
    food: '',
    description: '' 
  })
  const [message, setMessage] = useState('')
  const [fields, setFields] = useState([])
  const [newField, setNewField] = useState({ 
    label: '', 
    type: 'text', 
    options: '' 
  })
  const [poster, setPoster] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [regCapEnforced, setRegCapEnforced] = useState(false)
  const [regCap, setRegCap] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let formSchema = fields.map((f, idx) => ({ 
        id: idx + 1, 
        label: f.label.trim(), 
        type: f.type, 
        options: f.options?.length ? f.options : undefined,
        required: !!f.required
      }))

      const hasRoll = formSchema.some(f => /roll/i.test(String(f.label||'')))
      const hasPayment = formSchema.some(f => /payment/i.test(String(f.label||'')))
      if (!hasRoll) formSchema.push({ id: formSchema.length + 1, label: 'Roll Number', type: 'text', required: true })
      if (!hasPayment) formSchema.push({ id: formSchema.length + 1, label: 'Payment ID', type: 'text', required: true })

      // Normalize capacity fields
      const capNum = Number(regCap || 0)
      const payload = {
        ...form,
        formSchema,
        poster,
        regCapEnforced: !!regCapEnforced,
        regCap: Number.isFinite(capNum) ? Math.max(0, capNum) : 0
      }
      await api.post('/api/events', payload)
      setMessage('Event created successfully!')
      // Reset form
      setForm({ name: '', date: '', venue: '', speaker: '', food: '' })
      setFields([])
      setNewField({ label: '', type: 'text', options: '' })
      setPoster('')
      setRegCapEnforced(false)
      setRegCap('')
    } catch (e) {
      setMessage('Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const addField = () => {
    if (!newField.label.trim()) {
      setMessage('Field label is required')
      return
    }
    const field = {
      label: newField.label.trim(),
      type: newField.type,
      options: (newField.type === 'select' || newField.type === 'multiselect')
        ? newField.options.split(',').map(s => s.trim()).filter(Boolean)
        : []
    }
    setFields(prev => [...prev, field])
    setNewField({ label: '', type: 'text', options: '' })
  }

  const removeField = (i) => setFields(prev => prev.filter((_, idx) => idx !== i))

  const onPosterChange = (file) => {
    if (!file) { 
      setPoster(''); 
      return 
    }
    
    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image size must be less than 5MB')
      return
    }

    setUploading(true)
    const reader = new FileReader()
    reader.onload = () => {
      setPoster(String(reader.result || ''))
      setUploading(false)
    }
    reader.onerror = () => {
      setMessage('Failed to read image file')
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Create Event</h1>
        <div className="header-subtitle">
          Set up a new event with custom registration fields
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'} fade-in`}>
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

      <form onSubmit={submit} className="event-form">
        <div className="form-section">
          <div className="section-header">
            <h2>Event Details</h2>
            <p>Basic information about your event</p>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Event Name *
                <input 
                  className="form-input"
                  value={form.name} 
                  onChange={e => set('name', e.target.value)} 
                  placeholder="Enter event name..."
                  required 
                />
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">
                Date & Time *
                <input 
                  type="datetime-local" 
                  className="form-input"
                  value={form.date} 
                  onChange={e => set('date', e.target.value)} 
                  required 
                />
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">
                Venue *
                <input 
                  className="form-input"
                  value={form.venue} 
                  onChange={e => set('venue', e.target.value)} 
                  placeholder="Enter venue location..."
                  required 
                />
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">
                Speaker
                <input 
                  className="form-input"
                  value={form.speaker} 
                  onChange={e => set('speaker', e.target.value)} 
                  placeholder="Enter speaker name..."
                />
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">
                Food & Refreshments
                <input 
                  className="form-input"
                  value={form.food} 
                  onChange={e => set('food', e.target.value)} 
                  placeholder="Describe food options..."
                />
              </label>
            </div>
            
            <div className="form-group full-width">
              <label className="form-label">
                Description
                <textarea
                  className="form-input"
                  rows="4"
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Describe the event for attendees..."
                />
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Registration Controls</h2>
            <p>Limit registrations if needed</p>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                <span style={{display:'flex', alignItems:'center', gap:8}}>
                  <input
                    type="checkbox"
                    checked={regCapEnforced}
                    onChange={e => setRegCapEnforced(e.target.checked)}
                  />
                  Limit registrations
                </span>
              </label>
            </div>
            <div className="form-group">
              <label className="form-label">
                Max registrations
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  placeholder="e.g. 100"
                  value={regCap}
                  onChange={e => setRegCap(e.target.value.replace(/[^0-9]/g, ''))}
                  disabled={!regCapEnforced}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Event Poster</h2>
            <p>Upload an image to promote your event</p>
          </div>
          
          <div className="poster-upload">
            <label className="form-label">
              Event Poster
              <div className="file-upload-area" onClick={() => document.getElementById('poster-input').click()}>
                <input 
                  id="poster-input"
                  type="file" 
                  className="file-input"
                  accept="image/*" 
                  onChange={e => onPosterChange(e.target.files?.[0])} 
                />
                <div className="upload-content">
                  {uploading ? (
                    <div className="upload-loading">
                      <div className="spinner-small"></div>
                      <span>Uploading image...</span>
                    </div>
                  ) : (
                    <>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M4 16L8.586 11.414C9.366 10.634 10.634 10.634 11.414 11.414L16 16M14 14L15.586 12.414C16.366 11.634 17.634 11.634 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="upload-text">
                        <span className="upload-title">Click to upload poster</span>
                        <span className="upload-subtitle">PNG, JPG up to 5MB</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </label>
            
            {poster && (
              <div className="image-preview">
                <div className="preview-header">
                  <span>Poster Preview</span>
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => setPoster('')}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Remove
                  </button>
                </div>
                <div className="preview-image">
                  <img src={poster} alt="Poster preview" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Registration Fields</h2>
            <p>Add custom fields to your registration form</p>
          </div>
          
          <div className="custom-fields">
            <div className="add-field-form">
              <div className="field-form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Field Label *
                    <input 
                      className="form-input"
                      value={newField.label} 
                      onChange={e => setNewField(v => ({...v, label: e.target.value}))} 
                      placeholder="e.g. T-Shirt Size, Dietary Requirements..."
                    />
                  </label>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    Field Type
                    <select 
                      className="form-input"
                      value={newField.type} 
                      onChange={e => setNewField(v => ({...v, type: e.target.value}))}
                    >
                      <option value="text">Text Input</option>
                      <option value="select">Dropdown (Single Choice)</option>
                      <option value="multiselect">Multiple Choice</option>
                      <option value="checkbox">Checkbox (Yes/No)</option>
                    </select>
                  </label>
                </div>
                
                {(newField.type === 'select' || newField.type === 'multiselect') && (
                  <div className="form-group full-width">
                    <label className="form-label">
                      Options (comma separated) *
                      <input 
                        className="form-input"
                        value={newField.options} 
                        onChange={e => setNewField(v => ({...v, options: e.target.value}))} 
                        placeholder="S, M, L, XL"
                      />
                    </label>
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="add-field-btn primary-btn"
                  onClick={addField}
                  disabled={!newField.label.trim() || (['select', 'multiselect'].includes(newField.type) && !newField.options.trim())}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Add Field
                </button>
              </div>
            </div>

            {fields.length > 0 && (
              <div className="fields-list">
                <h4>Added Fields ({fields.length})</h4>
                <div className="fields-grid">
                  {fields.map((f, i) => (
                    <div className="field-card" key={i}>
                      <div className="field-header">
                        <div className="field-info">
                          <h5 className="field-label">{f.label}</h5>
                          <span className="field-type">{f.type}</span>
                        </div>
                        <button 
                          type="button" 
                          className="remove-field-btn"
                          onClick={() => removeField(i)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                      
                      {(f.type === 'select' || f.type === 'multiselect') && f.options.length > 0 && (
                        <div className="field-options">
                          <span className="options-label">Options:</span>
                          <div className="options-list">
                            {f.options.map((option, idx) => (
                              <span key={idx} className="option-tag">{option}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-submit">
          <button 
            type="submit" 
            className="create-event-btn primary-btn"
            disabled={loading || !form.name || !form.date || !form.venue}
          >
            {loading ? (
              <>
                <div className="spinner-small"></div>
                <span>Creating Event...</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Create Event</span>
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .dashboard-header {
          margin-bottom: 32px;
        }

        .dashboard-header h1 {
          margin: 0 0 8px 0;
          font-size: 2.25rem;
          font-weight: 800;
          background: linear-gradient(90deg, var(--primary), var(--primary-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-subtitle {
          color: var(--muted);
          font-size: 1rem;
          line-height: 1.5;
        }

        /* Form Styles */
        .event-form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .form-section {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 24px;
          box-shadow: var(--shadow);
        }

        .section-header {
          margin-bottom: 24px;
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

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
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

        .form-input::placeholder {
          color: var(--muted);
        }

        /* File Upload */
        .file-upload-area {
          border: 2px dashed var(--border);
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          cursor: pointer;
        }

        .file-upload-area:hover {
          border-color: var(--primary);
          background: rgba(255, 255, 255, 0.08);
        }

        .file-input {
          display: none;
        }

        .upload-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: var(--muted);
        }

        .upload-content svg {
          color: var(--primary);
        }

        .upload-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .upload-title {
          font-weight: 600;
          color: var(--text);
        }

        .upload-subtitle {
          font-size: 0.8rem;
          color: var(--muted);
        }

        .upload-loading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text);
        }

        /* Image Preview */
        .image-preview {
          margin-top: 16px;
          animation: fade 0.3s ease-out;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-weight: 600;
          color: var(--text);
        }

        .remove-image-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .remove-image-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .preview-image {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--border);
        }

        .preview-image img {
          width: 100%;
          height: auto;
          max-height: 300px;
          object-fit: contain;
          background: var(--bg);
        }

        /* Custom Fields */
        .custom-fields {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .add-field-form {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 20px;
        }

        .field-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
        }

        .add-field-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          font-weight: 600;
        }

        .add-field-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Fields List */
        .fields-list h4 {
          margin: 0 0 16px 0;
          color: var(--text);
          font-size: 1.125rem;
        }

        .fields-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        .field-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.2s ease;
        }

        .field-card:hover {
          border-color: var(--primary);
          transform: translateY(-1px);
        }

        .field-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .field-info {
          flex: 1;
        }

        .field-label {
          margin: 0 0 4px 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text);
        }

        .field-type {
          display: inline-block;
          padding: 2px 8px;
          background: rgba(99, 102, 241, 0.2);
          color: var(--primary);
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .remove-field-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 6px;
          padding: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .remove-field-btn:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .field-options {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.875rem;
        }

        .options-label {
          font-weight: 600;
          color: var(--muted);
          white-space: nowrap;
        }

        .options-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .option-tag {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          border: 1px solid var(--border);
        }

        /* Form Submit */
        .form-submit {
          display: flex;
          justify-content: center;
          margin-top: 16px;
        }

        .create-event-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .create-event-btn:disabled {
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

        /* Loading Spinner */
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

        /* Buttons */
        .primary-btn {
          background: linear-gradient(180deg, var(--primary), var(--primary-600));
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
        @keyframes fade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
          animation: fade 0.3s ease-out;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .dashboard-header h1 {
            font-size: 1.75rem;
          }

          .section-header h2 {
            font-size: 1.25rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .field-form-grid {
            grid-template-columns: 1fr;
          }

          .fields-grid {
            grid-template-columns: 1fr;
          }

          .form-section {
            padding: 20px;
          }

          .create-event-btn {
            width: 100%;
            justify-content: center;
          }

          .file-upload-area {
            padding: 24px 16px;
          }

          .upload-content svg {
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .form-section {
            padding: 16px;
          }

          .field-header {
            flex-direction: column;
            gap: 8px;
          }

          .remove-field-btn {
            align-self: flex-end;
          }

          .field-options {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .preview-image img {
            max-height: 220px;
          }

          .upload-content svg {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </div>
  )
}