// import { useEffect, useRef, useState } from 'react'
// import QrScanner from 'react-qr-scanner'
// import { api } from '../api'

// export default function CheckIn() {
//   const [message, setMessage] = useState('')
//   const [result, setResult] = useState(null)
//   const [toast, setToast] = useState('')
//   const busyUntil = useRef(0)
//   const [useScanner, setUseScanner] = useState(true)
//   const [scannerKind, setScannerKind] = useState('react-qr') // 'react-qr' | 'fallback'
//   const [errCount, setErrCount] = useState(0)
//   const [manualQR, setManualQR] = useState('')
//   const videoRef = useRef(null)
//   const canvasRef = useRef(null)
//   const animRef = useRef(0)
//   const streamRef = useRef(null)

//   const showToast = (text) => {
//     setToast(text)
//     setTimeout(() => setToast(''), 2000)
//   }

//   const handleDecode = async (text) => {
//     if (!text) return
//     const now = Date.now()
//     if (now < busyUntil.current) return // throttle rapid duplicate scans
//     busyUntil.current = now + 1800
//     try {
//       const { data } = await api.post('/api/registration/checkin', { qr: text })
//       setResult(data.registration)
//       setMessage('Check-in successful!')
//       showToast('Checked')
//     } catch (e) {
//       setMessage('Check-in failed')
//       showToast('Failed')
//     }
//   }

//   // react-qr-scanner handles camera stream internally; we just count errors
//   useEffect(() => {
//     if (!useScanner) setScannerKind('fallback')
//   }, [useScanner])

//   // Fallback: use BarcodeDetector on uploaded image
//   const detectFromFile = async (file) => {
//     try {
//       if (!file) return
//       if (typeof window.BarcodeDetector === 'undefined') {
//         setMessage('BarcodeDetector not supported on this device. Use manual entry below.')
//         return
//       }
//       const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
//       const imgBitmap = await createImageBitmap(file)
//       const codes = await detector.detect(imgBitmap)
//       const text = codes?.[0]?.rawValue || codes?.[0]?.rawText || ''
//       if (text) {
//         await handleDecode(text)
//       } else {
//         setMessage('Could not read QR from image')
//         showToast('Failed')
//       }
//     } catch (e) {
//       setMessage('QR detect failed')
//       showToast('Failed')
//     }
//   }

//   const submitManual = async () => {
//     const t = (manualQR || '').trim()
//     if (!t) { setMessage('Enter QR text like eventId|registrationId'); return }
//     await handleDecode(t)
//   }

//   return (
//     <div>
//       <h1>Check-In</h1>
//       {message && <div className="alert">{message}</div>}

//       {toast && (
//         <div style={{
//           position:'fixed', bottom:16, left:'50%', transform:'translateX(-50%)',
//           background:'#111', color:'#fff', padding:'10px 14px',
//           borderRadius:10, boxShadow:'0 10px 24px rgba(0,0,0,.18)', zIndex:1000
//         }}>{toast}</div>
//       )}
//       {useScanner && (
//         <div className="scanner" style={{position:'relative'}}>
//           <QrScanner
//             delay={200}
//             onError={() => setErrCount(c => { const n = c + 1; if (n >= 20) setUseScanner(false); return n })}
//             onScan={(data) => {
//               const text = typeof data === 'string' ? data : (data?.text || data?.getText?.() || '')
//               if (text) void handleDecode(text)
//             }}
//             constraints={{ video: { facingMode: 'environment' } }}
//             style={{ width: '100%' }}
//           />
//           <div className="row" style={{position:'absolute', right:8, top:8, background:'rgba(0,0,0,.5)', color:'#fff', padding:'4px 8px', borderRadius:8, fontSize:12}}>
//             {scannerKind === 'react-qr' ? 'React-QR' : 'Fallback'}
//           </div>
//         </div>
//       )}

//       {!useScanner && (
//         <div className="card" style={{marginTop:12}}>
//           <div className="row"><strong>Scanner fallback</strong></div>
//           <div className="row">Upload a photo of the QR or paste its text.</div>
//           <div className="row" style={{display:'grid', gap:10}}>
//             <input type="file" accept="image/*" capture="environment" onChange={e => detectFromFile(e.target.files?.[0])} />
//             <div style={{display:'flex', gap:8}}>
//               <input value={manualQR} onChange={e => setManualQR(e.target.value)} placeholder="e.g. 4|123" />
//               <button type="button" onClick={submitManual}>Submit</button>
//             </div>
//           </div>
//         </div>
//       )}
//       {result && (
//         <div className="card">
//           <div className="row"><strong>{result.name}</strong></div>
//           <div className="row">Email: {result.email}</div>
//           <div className="row">Contact: {result.contact}</div>
//           <div className="row">Event ID: {result.eventId}</div>
//           <div className="row">Checked In: {result.checkedIn ? 'Yes' : 'No'}</div>
//         </div>
//       )}
//     </div>
//   )
// }

import { useEffect, useRef, useState } from 'react'
import QrScanner from 'react-qr-scanner'
import { api } from '../api'

export default function CheckIn() {
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [toast, setToast] = useState('')
  const busyUntil = useRef(0)
  const [useScanner, setUseScanner] = useState(true)
  const [scannerKind, setScannerKind] = useState('react-qr')
  const [errCount, setErrCount] = useState(0)
  const [manualQR, setManualQR] = useState('')
  const [loading, setLoading] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const animRef = useRef(0)
  const streamRef = useRef(null)

  const showToast = (text, type = 'success') => {
    setToast({ text, type })
    setTimeout(() => setToast(''), 2000)
  }

  const handleDecode = async (text) => {
    if (!text) return
    const now = Date.now()
    if (now < busyUntil.current) return
    busyUntil.current = now + 1800
    
    setLoading(true)
    try {
      const { data } = await api.post('/api/registration/checkin', { qr: text })
      setResult(data.registration)
      setMessage('Check-in successful!')
      showToast('Checked in successfully!', 'success')
    } catch (e) {
      setMessage('Check-in failed')
      showToast('Check-in failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!useScanner) setScannerKind('fallback')
  }, [useScanner])

  const detectFromFile = async (file) => {
    if (!file) return
    
    setLoading(true)
    try {
      if (typeof window.BarcodeDetector === 'undefined') {
        setMessage('BarcodeDetector not supported on this device. Use manual entry below.')
        showToast('Browser not supported', 'error')
        return
      }
      
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
      const imgBitmap = await createImageBitmap(file)
      const codes = await detector.detect(imgBitmap)
      const text = codes?.[0]?.rawValue || codes?.[0]?.rawText || ''
      
      if (text) {
        await handleDecode(text)
      } else {
        setMessage('Could not read QR from image')
        showToast('No QR code found', 'error')
      }
    } catch (e) {
      setMessage('QR detection failed')
      showToast('Detection failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const submitManual = async () => {
    const t = (manualQR || '').trim()
    if (!t) { 
      setMessage('Enter QR text like eventId|registrationId')
      showToast('Enter QR text', 'error')
      return 
    }
    await handleDecode(t)
  }

  const toggleScanner = () => {
    setUseScanner(!useScanner)
    setMessage('')
    setResult(null)
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Check-In</h1>
        <div className="header-subtitle">
          Scan QR codes to check in attendees for events
        </div>
      </div>

      {message && (
        <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'} fade-in`}>
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

      {toast && (
        <div className={`toast ${toast.type}`}>
          <div className="toast-content">
            {toast.type === 'success' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Scanner Toggle */}
      <div className="scanner-toggle">
        <button 
          className={`toggle-btn ${useScanner ? 'active' : ''}`}
          onClick={toggleScanner}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M2 9V6.5C2 4.01 4.01 2 6.5 2H9M15 2H17.5C19.99 2 22 4.01 22 6.5V9M22 16V17.5C22 19.99 19.99 22 17.5 22H16M9 22H6.5C4.01 22 2 19.99 2 17.5V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          QR Scanner
        </button>
        <button 
          className={`toggle-btn ${!useScanner ? 'active' : ''}`}
          onClick={toggleScanner}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Manual Entry
        </button>
      </div>

      {useScanner ? (
        <div className="scanner-section">
          <div className="scanner-container">
            <div className="scanner-frame">
              <QrScanner
                delay={200}
                onError={() => setErrCount(c => { 
                  const n = c + 1; 
                  if (n >= 20) setUseScanner(false); 
                  return n 
                })}
                onScan={(data) => {
                  const text = typeof data === 'string' ? data : (data?.text || data?.getText?.() || '')
                  if (text) void handleDecode(text)
                }}
                constraints={{ video: { facingMode: 'environment' } }}
                style={{ 
                  width: '100%', 
                  height: '300px',
                  borderRadius: '12px',
                  objectFit: 'cover'
                }}
              />
              <div className="scanner-overlay">
                <div className="scan-line"></div>
                <div className="scanner-corners">
                  <div className="corner top-left"></div>
                  <div className="corner top-right"></div>
                  <div className="corner bottom-left"></div>
                  <div className="corner bottom-right"></div>
                </div>
              </div>
            </div>
            
            <div className="scanner-info">
              <div className="scanner-status">
                <span className="status-badge active">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 12L11 15L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Scanner Active
                </span>
                <span className="scanner-type">React-QR Scanner</span>
              </div>
              <p className="scanner-help">
                Point your camera at a QR code to automatically check in
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="manual-section">
          <div className="card fade-in">
            <div className="section-header">
              <h2>Manual Check-In</h2>
              <p>Upload QR image or enter code manually</p>
            </div>
            
            <div className="manual-options">
              <div className="upload-section">
                <label className="upload-label">
                  Upload QR Image
                  <div className="file-upload-area" onClick={() => document.getElementById('qr-file-input').click()}>
                    <input 
                      id="qr-file-input"
                      type="file" 
                      className="file-input"
                      accept="image/*" 
                      capture="environment"
                      onChange={e => detectFromFile(e.target.files?.[0])} 
                    />
                    <div className="upload-content">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <div className="upload-text">
                        <span className="upload-title">Click to upload QR image</span>
                        <span className="upload-subtitle">Take photo or select from gallery</span>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
              
              <div className="divider">
                <span>OR</span>
              </div>
              
              <div className="manual-input-section">
                <label className="form-label">
                  Enter QR Code Manually
                  <input 
                    className="form-input"
                    value={manualQR} 
                    onChange={e => setManualQR(e.target.value)} 
                    placeholder="e.g. 4|123 (eventId|registrationId)"
                  />
                </label>
                <button 
                  className="submit-btn primary-btn"
                  onClick={submitManual}
                  disabled={loading || !manualQR.trim()}
                >
                  {loading ? (
                    <>
                      <div className="spinner-small"></div>
                      <span>Checking In...</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Check In</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="result-card card fade-in">
          <div className="result-header">
            <h3>Check-In Successful!</h3>
            <span className="success-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Checked In
            </span>
          </div>
          
          <div className="result-details">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{result.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{result.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Contact:</span>
                <span className="detail-value">{result.contact || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Event ID:</span>
                <span className="detail-value">{result.eventId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${result.checkedIn ? 'checked-in' : 'not-checked-in'}`}>
                  {result.checkedIn ? 'Checked In' : 'Not Checked In'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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

        /* Scanner Toggle */
        .scanner-toggle {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          background: var(--card);
          padding: 8px;
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--muted);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
          justify-content: center;
        }

        .toggle-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: var(--shadow);
        }

        .toggle-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
        }

        /* Scanner Section */
        .scanner-section {
          margin-bottom: 24px;
        }

        .scanner-container {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          box-shadow: var(--shadow);
        }

        .scanner-frame {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .scanner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .scan-line {
          position: absolute;
          top: 20%;
          left: 10%;
          right: 10%;
          height: 2px;
          background: var(--primary);
          box-shadow: 0 0 8px var(--primary);
          animation: scan 2s ease-in-out infinite;
        }

        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(200px); }
        }

        .scanner-corners {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .corner {
          position: absolute;
          width: 30px;
          height: 30px;
          border-color: var(--primary);
          border-width: 3px;
        }

        .top-left {
          top: 10px;
          left: 10px;
          border-top: 3px solid var(--primary);
          border-left: 3px solid var(--primary);
          border-right: none;
          border-bottom: none;
        }

        .top-right {
          top: 10px;
          right: 10px;
          border-top: 3px solid var(--primary);
          border-right: 3px solid var(--primary);
          border-left: none;
          border-bottom: none;
        }

        .bottom-left {
          bottom: 10px;
          left: 10px;
          border-bottom: 3px solid var(--primary);
          border-left: 3px solid var(--primary);
          border-top: none;
          border-right: none;
        }

        .bottom-right {
          bottom: 10px;
          right: 10px;
          border-bottom: 3px solid var(--primary);
          border-right: 3px solid var(--primary);
          border-top: none;
          border-left: none;
        }

        .scanner-info {
          text-align: center;
        }

        .scanner-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .scanner-type {
          font-size: 0.875rem;
          color: var(--muted);
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 8px;
          border-radius: 6px;
        }

        .scanner-help {
          color: var(--muted);
          font-size: 0.9rem;
          margin: 0;
        }

        /* Manual Section */
        .manual-section {
          margin-bottom: 24px;
        }

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

        .manual-options {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .upload-section {
          flex: 1;
        }

        .upload-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 8px;
          display: block;
        }

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

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--muted);
          font-size: 0.9rem;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .manual-input-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 8px;
          display: block;
        }

        .form-input {
          padding: 12px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-size: 0.9rem;
          transition: all 0.2s;
          width: 100%;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        .form-input::placeholder {
          color: var(--muted);
        }

        .submit-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          font-weight: 600;
          align-self: flex-start;
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Result Card */
        .result-card {
          margin-top: 20px;
          border-left: 4px solid #22c55e;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .result-header h3 {
          margin: 0;
          color: var(--text);
          font-size: 1.25rem;
        }

        .success-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .result-details {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 16px;
        }

        .detail-grid {
          display: grid;
          gap: 12px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid var(--border);
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-weight: 600;
          color: var(--muted);
        }

        .detail-value {
          color: var(--text);
          text-align: right;
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
        }

        .status-badge.active {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
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

        /* Toast */
        .toast {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--card);
          color: var(--text);
          padding: 12px 20px;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          z-index: 1000;
          border: 1px solid var(--border);
          animation: slideUp 0.3s ease-out;
        }

        .toast.success {
          border-left: 4px solid #22c55e;
        }

        .toast.error {
          border-left: 4px solid #ef4444;
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
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
          padding: 12px 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: var(--shadow);
        }

        .primary-btn:hover:not(:disabled) {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .scanner-toggle {
            flex-direction: column;
          }

          .toggle-btn {
            justify-content: center;
          }

          .result-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .detail-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .detail-value {
            text-align: left;
          }
        }

        @media (max-width: 480px) {
          .scanner-frame {
            margin: 0 -20px;
            border-radius: 0;
          }

          .manual-input-section {
            gap: 16px;
          }

          .submit-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}