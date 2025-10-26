// import { useEffect, useState } from 'react'
// import { api } from '../api'

// export default function AdsManager() {
//   const [message, setMessage] = useState('')
//   const [ads, setAds] = useState([])
//   const [adForm, setAdForm] = useState({ title: '', link: '', active: true, image: '' })
//   const [loading, setLoading] = useState(true)

//   const load = async () => {
//     setLoading(true)
//     try {
//       const adsRes = await api.get('/api/ads/all')
//       setAds(adsRes.data || [])
//     } catch (e) {
//       setMessage('Failed to load ads')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { load() }, [])

//   const onAdImage = (file) => {
//     if (!file) { setAdForm(prev => ({ ...prev, image: '' })); return }
//     const reader = new FileReader()
//     reader.onload = () => setAdForm(prev => ({ ...prev, image: String(reader.result || '') }))
//     reader.readAsDataURL(file)
//   }

//   const createAd = async () => {
//     try {
//       if (!adForm.image) { setMessage('Ad image is required'); return }
//       const { data } = await api.post('/api/ads', adForm)
//       setAds(prev => [data, ...prev])
//       setAdForm({ title: '', link: '', active: true, image: '' })
//       setMessage('Ad created')
//     } catch (e) {
//       setMessage('Failed to create ad')
//     }
//   }

//   const deleteAd = async (id) => {
//     if (!confirm('Delete this ad?')) return
//     try {
//       await api.delete(`/api/ads/${id}`)
//       setAds(prev => prev.filter(a => a.id !== id))
//       setMessage('Ad deleted')
//     } catch {
//       setMessage('Failed to delete ad')
//     }
//   }

//   return (
//     <div>
//       <h1>Advertisements</h1>
//       <div className="row" style={{marginTop: -6, marginBottom: 10, color: 'var(--muted)'}}>
//         Manage promotional banners shown to students on the registration page.
//       </div>
//       {message && <div className="alert">{message}</div>}

//       <div className="card" style={{marginBottom:14}}>
//         <div className="row"><strong>Create Ad</strong></div>
//         <div className="row" style={{display:'grid', gap:10}}>
//           <label>Title<input value={adForm.title} onChange={e => setAdForm(v => ({...v, title: e.target.value}))} /></label>
//           <label>Link (optional)<input value={adForm.link} onChange={e => setAdForm(v => ({...v, link: e.target.value}))} placeholder="https://..." /></label>
//           <label style={{display:'flex', alignItems:'center', gap:8}}>Active<input type="checkbox" checked={adForm.active} onChange={e => setAdForm(v => ({...v, active: e.target.checked}))} /></label>
//           <div>
//             <input type="file" accept="image/*" onChange={e => onAdImage(e.target.files?.[0])} />
//             {adForm.image && (
//               <div className="qr" style={{gap:8}}>
//                 <img src={adForm.image} alt="Ad preview" style={{maxWidth:320, borderRadius:8, border:'1px solid var(--border)'}} />
//                 <button type="button" className="danger" onClick={() => setAdForm(v => ({...v, image: ''}))}>Remove Image</button>
//               </div>
//             )}
//           </div>
//           <div className="actions"><button type="button" onClick={createAd}>Add Ad</button></div>
//         </div>
//       </div>

//       {loading ? <p>Loading...</p> : (
//         <>
//           {ads.length === 0 && <p>No ads yet.</p>}
//           {ads.length > 0 && (
//             <div className="grid" style={{marginTop:12}}>
//               {ads.map(a => (
//                 <div className="card" key={a.id}>
//                   {a.image && <img src={a.image} alt={a.title||'ad'} style={{width:'100%', maxHeight:160, objectFit:'cover', borderRadius:8, border:'1px solid var(--border)'}} />}
//                   <div className="row"><strong>{a.title || 'Advertisement'}</strong></div>
//                   {a.link && <div className="row"><a href={a.link} target="_blank" rel="noreferrer">{a.link}</a></div>}
//                   <div className="actions"><button className="danger" onClick={() => deleteAd(a.id)}>Delete</button></div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   )
// }


import { useEffect, useState } from 'react'
import { api } from '../api'

export default function AdsManager() {
  const [message, setMessage] = useState('')
  const [ads, setAds] = useState([])
  const [adForm, setAdForm] = useState({ title: '', link: '', active: true, image: '' })
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const adsRes = await api.get('/api/ads/all')
      setAds(adsRes.data || [])
    } catch (e) {
      setMessage('Failed to load ads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onAdImage = (file) => {
    if (!file) { 
      setAdForm(prev => ({ ...prev, image: '' })); 
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
      setAdForm(prev => ({ ...prev, image: String(reader.result || '') }))
      setUploading(false)
    }
    reader.onerror = () => {
      setMessage('Failed to read image file')
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const createAd = async () => {
    try {
      if (!adForm.image) { 
        setMessage('Ad image is required'); 
        return 
      }
      if (!adForm.title.trim()) {
        setMessage('Ad title is required')
        return
      }
      
      const { data } = await api.post('/api/ads', adForm)
      setAds(prev => [data, ...prev])
      setAdForm({ title: '', link: '', active: true, image: '' })
      setMessage('Ad created successfully')
    } catch (e) {
      setMessage('Failed to create ad')
    }
  }

  const deleteAd = async (id) => {
    if (!confirm('Are you sure you want to delete this ad?')) return
    try {
      setDeletingId(id)
      await api.delete(`/api/ads/${id}`)
      setAds(prev => prev.filter(a => a.id !== id))
      setMessage('Ad deleted successfully')
    } catch {
      setMessage('Failed to delete ad')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Advertisements</h1>
        <div className="header-subtitle">
          Manage promotional banners shown to students on the registration page
        </div>
      </div>
      
      {message && (
        <div className="alert fade-in">
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

      {/* Create Ad Section */}
      <div className="card fade-in" style={{marginBottom: '24px'}}>
        <div className="section-header">
          <h2>Create New Ad</h2>
          <p>Add a new promotional banner to display on registration pages</p>
        </div>
        
        <div className="ad-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Title *
                <input 
                  className="form-input"
                  value={adForm.title} 
                  onChange={e => setAdForm(v => ({...v, title: e.target.value}))}
                  placeholder="Enter ad title..."
                />
              </label>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                Link URL (Optional)
                <input 
                  className="form-input"
                  value={adForm.link} 
                  onChange={e => setAdForm(v => ({...v, link: e.target.value}))} 
                  placeholder="https://example.com"
                />
              </label>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  className="checkbox-input"
                  checked={adForm.active} 
                  onChange={e => setAdForm(v => ({...v, active: e.target.checked}))} 
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">Active (Visible to students)</span>
              </label>
            </div>
            
            <div className="form-group full-width">
              <label className="form-label">
                Ad Image *
                <div className="file-upload-area" onClick={() => document.getElementById('file-input').click()}>
                  <input 
                    id="file-input"
                    type="file" 
                    className="file-input"
                    accept="image/*" 
                    onChange={e => onAdImage(e.target.files?.[0])} 
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
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <div className="upload-text">
                          <span className="upload-title">Click to upload image</span>
                          <span className="upload-subtitle">PNG, JPG, GIF up to 5MB</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </label>
              
              {adForm.image && (
                <div className="image-preview">
                  <div className="preview-header">
                    <span>Image Preview</span>
                    <button 
                      type="button" 
                      className="remove-image-btn"
                      onClick={() => setAdForm(v => ({...v, image: ''}))}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Remove
                    </button>
                  </div>
                  <div className="preview-image">
                    <img src={adForm.image} alt="Ad preview" />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="create-ad-btn primary-btn"
              onClick={createAd}
              disabled={!adForm.image || !adForm.title.trim() || uploading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Create Advertisement
            </button>
          </div>
        </div>
      </div>

      {/* Ads List Section */}
      <div className="section-header">
        <h2>Active Advertisements</h2>
        <div className="ads-count">
          {ads.length} {ads.length === 1 ? 'ad' : 'ads'} total
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading advertisements...</p>
        </div>
      ) : (
        <>
          {ads.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>No advertisements yet</h3>
              <p>Create your first ad to get started</p>
            </div>
          ) : (
            <div className="ads-grid">
              {ads.map(ad => (
                <div className="ad-card" key={ad.id}>
                  <div className="ad-image">
                    <img src={ad.image} alt={ad.title || 'Advertisement'} />
                    <div className="ad-status">
                      <span className={`status-badge ${ad.active ? 'active' : 'inactive'}`}>
                        {ad.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ad-content">
                    <h3 className="ad-title">{ad.title || 'Advertisement'}</h3>
                    
                    {ad.link && (
                      <div className="ad-link">
                        <a href={ad.link} target="_blank" rel="noopener noreferrer">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M15 3H21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {ad.link}
                        </a>
                      </div>
                    )}
                    
                    <div className="ad-meta">
                      <span className="meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        Created {new Date(ad.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ad-actions">
                    <button 
                      className="delete-ad-btn"
                      onClick={() => deleteAd(ad.id)}
                      disabled={deletingId === ad.id}
                    >
                      {deletingId === ad.id ? (
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
              ))}
            </div>
          )}
        </>
      )}

      <style>
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

        .header-subtitle {
          color: var(--muted);
          font-size: 1rem;
          line-height: 1.5;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 20px;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
          margin: 0;
        }

        .ads-count {
          color: var(--muted);
          font-size: 0.9rem;
        }

        /* Form Styles */
        .ad-form {
          margin-top: 16px;
        }

        .form-grid {
          display: grid;
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

        /* Checkbox */
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
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
          max-height: 200px;
          object-fit: contain;
          background: var(--bg);
        }

        /* Form Actions */
        .form-actions {
          margin-top: 24px;
        }

        .create-ad-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-weight: 600;
        }

        .create-ad-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .create-ad-btn:disabled:hover {
          filter: none;
        }

        /* Ads Grid */
        .ads-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .ad-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
        }

        .ad-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .ad-image {
          position: relative;
          width: 100%;
          height: 160px;
          overflow: hidden;
          background: var(--bg);
        }

        .ad-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ad-status {
          position: absolute;
          top: 12px;
          right: 12px;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.active {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .status-badge.inactive {
          background: rgba(100, 116, 139, 0.2);
          color: #64748b;
          border: 1px solid rgba(100, 116, 139, 0.3);
        }

        .ad-content {
          padding: 16px;
        }

        .ad-title {
          margin: 0 0 8px 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text);
          line-height: 1.4;
        }

        .ad-link {
          margin-bottom: 12px;
        }

        .ad-link a {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--primary);
          text-decoration: none;
          font-size: 0.85rem;
          transition: color 0.2s ease;
        }

        .ad-link a:hover {
          color: var(--primary-600);
        }

        .ad-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.8rem;
          color: var(--muted);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .ad-actions {
          padding: 0 16px 16px;
        }

        .delete-ad-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          padding: 8px 12px;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .delete-ad-btn:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.2);
          transform: translateY(-1px);
        }

        .delete-ad-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
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

        .empty-icon {
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

        /* Responsive */
        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .ads-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            gap: 16px;
          }

          .file-upload-area {
            padding: 30px 15px;
          }
        }

        @media (max-width: 480px) {
          .ad-content {
            padding: 12px;
          }

          .ad-actions {
            padding: 0 12px 12px;
          }

          .create-ad-btn {
            width: 100%;
            justify-content: center;
          }
        }
      </style>
    </div>
  )
}