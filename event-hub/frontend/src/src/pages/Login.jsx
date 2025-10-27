// // import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
// // import { useEffect, useState } from 'react'
// // import { useLocation, useNavigate } from 'react-router-dom'
// // import { api } from '../api'

// // export default function Login() {
// //   const navigate = useNavigate()
// //   const location = useLocation()
// //   const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
// //   const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
// //   const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
// //   const isInApp = /(FBAN|FBAV|Instagram|Line|WeChat|Twitter)(?=\/)|FB_IAB|FB4A|FBAN|FB_IOS/i.test(ua)
// //   const [errMsg, setErrMsg] = useState('')

// //   useEffect(() => {
// //     const token = localStorage.getItem('auth_token')
// //     if (token) {
// //       const dest = location.state?.from || '/'
// //       navigate(dest, { replace: true })
// //     }
// //   }, [location.state, navigate])

// //   const onSuccess = async (credentialResponse) => {
// //     try {
// //       const credential = credentialResponse?.credential
// //       if (!credential) return
// //       const { data } = await api.post('/api/auth/google', { credential })
// //       localStorage.setItem('auth_token', data.token)
// //       localStorage.setItem('auth_user', JSON.stringify(data.user))
// //       const dest = location.state?.from || '/'
// //       navigate(dest, { replace: true })
// //     } catch (e) {
// //       const msg = e?.response?.data?.error || e?.response?.data?.details || e?.message || 'Login failed'
// //       setErrMsg(String(msg))
// //     }
// //   }

// //   const onError = () => {
// //     setErrMsg('Google Sign-In Error')
// //   }

// //   return (
// //     <div>
// //       <h1>Login</h1>
// //       {location.state?.from && (
// //         <p>You must log in to access {location.state.from}.</p>
// //       )}
// //       {!location.state?.from && <p>Sign in with Google to continue.</p>}
// //       {errMsg && <div className="alert" style={{marginBottom:12}}>{errMsg}</div>}
// //       <GoogleOAuthProvider clientId={clientId}>
// //         {isInApp && (
// //           <div className="alert" style={{marginBottom:12}}>
// //             In-app browsers sometimes block Google login. Please open this page in your default browser (Chrome/Safari).
// //           </div>
// //         )}
// //         <GoogleLogin onSuccess={onSuccess} onError={onError} useOneTap={!isMobile && !isInApp} />
// //       </GoogleOAuthProvider>
// //     </div>
// //   )
// // }
// import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
// import { useEffect, useState } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
// import { api } from '../api'

// export default function Login() {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
//   const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
//   const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
//   const isInApp = /(FBAN|FBAV|Instagram|Line|WeChat|Twitter)(?=\/)|FB_IAB|FB4A|FBAN|FB_IOS/i.test(ua)
//   const [errMsg, setErrMsg] = useState('')
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     const token = localStorage.getItem('auth_token')
//     if (token) {
//       const dest = location.state?.from || '/'
//       navigate(dest, { replace: true })
//     }
//   }, [location.state, navigate])

//   const onSuccess = async (credentialResponse) => {
//     setLoading(true)
//     try {
//       const credential = credentialResponse?.credential
//       if (!credential) return
//       const { data } = await api.post('/api/auth/google', { credential })
//       localStorage.setItem('auth_token', data.token)
//       localStorage.setItem('auth_user', JSON.stringify(data.user))
//       const dest = location.state?.from || '/'
//       navigate(dest, { replace: true })
//     } catch (e) {
//       const msg = e?.response?.data?.error || e?.response?.data?.details || e?.message || 'Login failed'
//       setErrMsg(String(msg))
//     } finally {
//       setLoading(false)
//     }
//   }

//   const onError = () => {
//     setErrMsg('Google Sign-In failed. Please try again.')
//   }

//   return (
//     <div className="container">
//       <div className="login-container">
//         <div className="login-card">
//           <div className="login-header">
//             <div className="login-icon">
//               <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
//                 <path d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 <path d="M17.657 16.657L13.414 20.9C13.039 21.2746 12.5306 21.485 12 21.485C11.4694 21.485 10.961 21.2746 10.586 20.9L6.343 16.657C5.22422 15.5381 4.46234 14.1127 4.15369 12.5608C3.84504 11.009 4.00349 9.40047 4.60901 7.93868C5.21452 6.4769 6.2399 5.22749 7.55548 4.34846C8.87107 3.46943 10.4178 3.00024 12 3.00024C13.5822 3.00024 15.1289 3.46943 16.4445 4.34846C17.7601 5.22749 18.7855 6.4769 19.391 7.93868C19.9965 9.40047 20.155 11.009 19.8463 12.5608C19.5377 14.1127 18.7758 15.5381 17.657 16.657Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </div>
//             <h1 className="login-title">Welcome Back</h1>
//             <p className="login-subtitle">
//               {location.state?.from 
//                 ? `Sign in to access ${location.state.from}` 
//                 : 'Sign in to manage your events and registrations'
//               }
//             </p>
//           </div>

//           {errMsg && (
//             <div className="alert error fade-in">
//               <div className="alert-content">
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                   <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//                 <span>{errMsg}</span>
//                 <button className="alert-close" onClick={() => setErrMsg('')}>
//                   <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//                     <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           )}

//           {isInApp && (
//             <div className="alert warning fade-in">
//               <div className="alert-content">
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                   <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//                 <div>
//                   <strong>In-App Browser Detected</strong>
//                   <p>For best experience, please open this page in Chrome or Safari</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           <div className="login-content">
//             <GoogleOAuthProvider clientId={clientId}>
//               <div className="google-login-container">
//                 {loading ? (
//                   <div className="loading-state">
//                     <div className="loading-spinner"></div>
//                     <span>Signing you in...</span>
//                   </div>
//                 ) : (
//                   <GoogleLogin 
//                     onSuccess={onSuccess} 
//                     onError={onError} 
//                     useOneTap={!isMobile && !isInApp}
//                     theme="filled_blue"
//                     size="large"
//                     width="100%"
//                     text="continue_with"
//                   />
//                 )}
//               </div>
//             </GoogleOAuthProvider>

//             <div className="login-features">
//               <div className="feature-item">
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                   <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//                 <span>Secure Google authentication</span>
//               </div>
//               <div className="feature-item">
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                   <path d="M12 15V17M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//                 <span>Manage events and registrations</span>
//               </div>
//               <div className="feature-item">
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                   <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                 </svg>
//                 <span>Quick QR check-in system</span>
//               </div>
//             </div>
//           </div>

//           <div className="login-footer">
//             <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .container {
//           min-height: 100vh;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 20px;
//           background: linear-gradient(135deg, var(--bg) 0%, color-mix(in srgb, var(--bg) 95%, var(--primary)) 100%);
//         }

//         .login-container {
//           width: 100%;
//           max-width: 440px;
//         }

//         .login-card {
//           background: var(--card);
//           border: 1px solid var(--border);
//           border-radius: 20px;
//           padding: 40px;
//           box-shadow: var(--shadow);
//           text-align: center;
//         }

//         .login-header {
//           margin-bottom: 32px;
//         }

//         .login-icon {
//           width: 80px;
//           height: 80px;
//           margin: 0 auto 20px;
//           background: linear-gradient(135deg, var(--primary), var(--primary-600));
//           border-radius: 20px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: white;
//         }

//         .login-title {
//           font-size: 2.25rem;
//           font-weight: 800;
//           margin: 0 0 8px 0;
//           background: linear-gradient(135deg, var(--primary), var(--primary-600));
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .login-subtitle {
//           color: var(--muted);
//           font-size: 1.125rem;
//           line-height: 1.5;
//           margin: 0;
//         }

//         .login-content {
//           margin: 32px 0;
//         }

//         .google-login-container {
//           margin-bottom: 32px;
//         }

//         .loading-state {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           gap: 12px;
//           padding: 20px;
//           color: var(--muted);
//         }

//         .loading-spinner {
//           width: 32px;
//           height: 32px;
//           border: 3px solid rgba(255, 255, 255, 0.1);
//           border-left: 3px solid var(--primary);
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         .login-features {
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//           padding: 24px;
//           background: rgba(255, 255, 255, 0.05);
//           border-radius: 12px;
//           border: 1px solid var(--border);
//         }

//         .feature-item {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           color: var(--muted);
//           font-size: 0.9rem;
//         }

//         .feature-item svg {
//           color: var(--primary);
//           flex-shrink: 0;
//         }

//         .login-footer {
//           border-top: 1px solid var(--border);
//           padding-top: 24px;
//         }

//         .login-footer p {
//           color: var(--muted);
//           font-size: 0.875rem;
//           line-height: 1.5;
//           margin: 0;
//         }

//         /* Alert Styles */
//         .alert {
//           padding: 16px;
//           border-radius: 12px;
//           margin-bottom: 20px;
//           text-align: left;
//         }

//         .alert.error {
//           background: rgba(239, 68, 68, 0.1);
//           border: 1px solid rgba(239, 68, 68, 0.3);
//           color: #dc2626;
//         }

//         .alert.warning {
//           background: rgba(245, 158, 11, 0.1);
//           border: 1px solid rgba(245, 158, 11, 0.3);
//           color: #d97706;
//         }

//         .alert-content {
//           display: flex;
//           align-items: flex-start;
//           gap: 12px;
//         }

//         .alert-content svg {
//           flex-shrink: 0;
//           margin-top: 2px;
//         }

//         .alert-content div {
//           flex: 1;
//         }

//         .alert-content strong {
//           display: block;
//           margin-bottom: 4px;
//         }

//         .alert-content p {
//           margin: 0;
//           font-size: 0.9rem;
//           opacity: 0.9;
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
//           flex-shrink: 0;
//         }

//         .alert-close:hover {
//           background: rgba(0, 0, 0, 0.1);
//         }

//         /* Google Login Button Customization */
//         :global(.google-login-button) {
//           width: 100% !important;
//         }

//         :global(div[role="button"]) {
//           width: 100% !important;
//           border-radius: 10px !important;
//           font-weight: 600 !important;
//         }

//         /* Animations */
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         .fade-in {
//           animation: fadeIn 0.3s ease-out;
//         }

//         @keyframes fadeIn {
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
//           .login-card {
//             padding: 32px 24px;
//           }

//           .login-title {
//             font-size: 2rem;
//           }

//           .login-subtitle {
//             font-size: 1rem;
//           }
//         }

//         @media (max-width: 480px) {
//           .container {
//             padding: 16px;
//           }

//           .login-card {
//             padding: 24px 20px;
//           }

//           .login-icon {
//             width: 64px;
//             height: 64px;
//           }

//           .login-title {
//             font-size: 1.75rem;
//           }

//           .login-features {
//             padding: 20px;
//           }

//           .feature-item {
//             font-size: 0.85rem;
//           }
//         }

//         @media (max-height: 700px) {
//           .container {
//             align-items: flex-start;
//             padding-top: 40px;
//             padding-bottom: 40px;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
  const isInApp = /(FBAN|FBAV|Instagram|Line|WeChat|Twitter)(?=\/)|FB_IAB|FB4A|FBAN|FB_IOS/i.test(ua)
  const [errMsg, setErrMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      const dest = location.state?.from || '/'
      navigate(dest, { replace: true })
    }
  }, [location.state, navigate])

  const onSuccess = async (credentialResponse) => {
    setLoading(true)
    try {
      const credential = credentialResponse?.credential
      if (!credential) return
      const { data } = await api.post('/api/auth/google', { credential })
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      const dest = location.state?.from || '/'
      navigate(dest, { replace: true })
    } catch (e) {
      const msg = e?.response?.data?.error || e?.response?.data?.details || e?.message || 'Login failed'
      setErrMsg(String(msg))
    } finally {
      setLoading(false)
    }
  }

  const onError = () => {
    setErrMsg('Google Sign-In failed. Please try again.')
  }

  return (
    <div className="container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17.657 16.657L13.414 20.9C13.039 21.2746 12.5306 21.485 12 21.485C11.4694 21.485 10.961 21.2746 10.586 20.9L6.343 16.657C5.22422 15.5381 4.46234 14.1127 4.15369 12.5608C3.84504 11.009 4.00349 9.40047 4.60901 7.93868C5.21452 6.4769 6.2399 5.22749 7.55548 4.34846C8.87107 3.46943 10.4178 3.00024 12 3.00024C13.5822 3.00024 15.1289 3.46943 16.4445 4.34846C17.7601 5.22749 18.7855 6.4769 19.391 7.93868C19.9965 9.40047 20.155 11.009 19.8463 12.5608C19.5377 14.1127 18.7758 15.5381 17.657 16.657Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">
            {location.state?.from 
              ? `Sign in to access ${location.state.from}` 
              : 'Sign in to manage your events and registrations'
            }
          </p>
        </div>

        {errMsg && (
          <div className="alert error fade-in">
            <div className="alert-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{errMsg}</span>
              <button className="alert-close" onClick={() => setErrMsg('')}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {isInApp && (
          <div className="alert warning fade-in">
            <div className="alert-content">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div>
                <strong>In-App Browser Detected</strong>
                <p>For best experience, please open this page in Chrome or Safari</p>
              </div>
            </div>
          </div>
        )}

        <div className="login-content">
          <GoogleOAuthProvider clientId={clientId}>
            <div className="google-login-container">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <span>Signing you in...</span>
                </div>
              ) : (
                <GoogleLogin 
                  onSuccess={onSuccess} 
                  onError={onError} 
                  useOneTap={!isMobile && !isInApp}
                  theme="filled_blue"
                  size="large"
                  width="100%"
                  text="continue_with"
                />
              )}
            </div>
          </GoogleOAuthProvider>

          <div className="login-features">
            <div className="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Secure Google authentication</span>
            </div>
            <div className="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 15V17M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Manage events and registrations</span>
            </div>
            <div className="feature-item">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Quick QR check-in system</span>
            </div>
          </div>
        </div>

        <div className="login-footer">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>

      <style jsx>{`
        .container {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          background: linear-gradient(135deg, var(--bg) 0%, color-mix(in srgb, var(--bg) 95%, var(--primary)) 100%);
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          max-height: 90vh;
          overflow-y: auto;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 40px;
          box-shadow: var(--shadow);
          text-align: center;
        }

        .login-header { margin-bottom: 32px; }
        .login-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, var(--primary), var(--primary-600));
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .login-title {
          font-size: 2.25rem;
          font-weight: 800;
          margin: 0 0 8px 0;
          background: linear-gradient(135deg, var(--primary), var(--primary-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .login-subtitle { color: var(--muted); font-size: 1.125rem; margin: 0; }

        .login-content { margin: 32px 0; }
        .google-login-container { margin-bottom: 32px; }
        .loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px; color: var(--muted); }
        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-left: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .login-features { display: flex; flex-direction: column; gap: 12px; padding: 24px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid var(--border); }
        .feature-item { display: flex; align-items: center; gap: 12px; color: var(--muted); font-size: 0.9rem; }
        .feature-item svg { color: var(--primary); flex-shrink: 0; }

        .login-footer { border-top: 1px solid var(--border); padding-top: 24px; }
        .login-footer p { color: var(--muted); font-size: 0.875rem; margin: 0; }

        /* Alerts */
        .alert { padding: 16px; border-radius: 12px; margin-bottom: 20px; text-align: left; }
        .alert.error { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #dc2626; }
        .alert.warning { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); color: #d97706; }
        .alert-content { display: flex; align-items: flex-start; gap: 12px; }
        .alert-close { background: none; border: none; color: inherit; cursor: pointer; padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center; }

        :global(div[role="button"]) { width: 100% !important; border-radius: 10px !important; font-weight: 600 !important; }

        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        /* Responsive */
        @media (max-width: 768px) {
          .login-card { padding: 32px 24px; }
          .login-title { font-size: 2rem; }
          .login-subtitle { font-size: 1rem; }
        }
        @media (max-width: 480px) {
          .login-card { padding: 24px 20px; }
          .login-icon { width: 64px; height: 64px; }
          .login-title { font-size: 1.75rem; }
          .login-features { padding: 20px; }
          .feature-item { font-size: 0.85rem; }
        }
        @media (max-height: 700px) {
          .container { align-items: flex-start; padding-top: 40px; padding-bottom: 40px; }
        }
      `}</style>
    </div>
  )
}

