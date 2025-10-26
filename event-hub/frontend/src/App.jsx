// // import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
// // no local nav state needed
// // import AdminDashboard from './pages/AdminDashboard.jsx'
// // import AdsManager from './pages/AdsManager.jsx'
// // import EventForm from './pages/EventForm.jsx'
// // import RegistrationForm from './pages/RegistrationForm.jsx'
// // import CheckIn from './pages/CheckIn.jsx'
// // import Login from './pages/Login.jsx'
// // import UserDashboard from './pages/UserDashboard.jsx'
// // import Home from './pages/Home.jsx'

// // function RequireAuth({ children }) {
// //   const location = useLocation()
// //   const token = localStorage.getItem('auth_token')
// //   if (!token) {
// //     return <Navigate to="/login" replace state={{ from: location.pathname }} />
// //   }
// //   return children
// // }

// // function RequireAdmin({ children }) {
// //   const location = useLocation()
// //   const token = localStorage.getItem('auth_token')
// //   if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />
// //   let user = null
// //   try { user = JSON.parse(localStorage.getItem('auth_user') || 'null') } catch {}
// //   if (user?.role !== 'admin') return <Navigate to="/me" replace />
// //   return children
// // }

// // export default function App() {
// //   const navigate = useNavigate()
// //   const user = (() => {
// //     try {
// //       return JSON.parse(localStorage.getItem('auth_user') || 'null')
// //     } catch {
// //       return null
// //     }
// //   })()

// //   const isAuthed = !!localStorage.getItem('auth_token')
// //   const isAdmin = user?.role === 'admin'

// //   const onLogout = () => {
// //     localStorage.removeItem('auth_token')
// //     localStorage.removeItem('auth_user')
// //     navigate('/login', { replace: true })
// //   }

// //   return (
// //     <>
// //       <ul className="background" style={{zIndex:0}}>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //         <li></li>
// //       </ul>
// //       <div className="container">
// //       <nav className="nav">
// //         <div className="nav-left">
// //           <Link to="/">Home</Link>
// //           {!isAuthed && <Link to="/login">Login</Link>}
// //           {isAuthed && (
// //             <>
// //               {isAdmin && <Link to="/admin">Admin</Link>}
// //               {isAdmin && <Link to="/new">Create Event</Link>}
// //               {!isAdmin && <Link to="/register">Register</Link>}
// //               {isAdmin && <Link to="/checkin">Check-In</Link>}
// //               {isAdmin && <Link to="/ads">Ads</Link>}
// //               {!isAdmin && <Link to="/me">My Events</Link>}
// //             </>
// //           )}
// //         </div>
// //         {isAuthed && user && (
// //           <div className="user-badge">
// //             <img
// //               className="avatar"
// //               src={user.picture || ''}
// //               alt={user.name || user.email || 'user'}
// //               onError={e => { e.currentTarget.style.display = 'none' }}
// //             />
// //             <div className="user-meta">
// //               <div className="user-name">{user.name}</div>
// //               <div className="user-email">{user.email}</div>
// //             </div>
// //             <button className="icon-btn" onClick={onLogout} title="Logout" aria-label="Logout">
// //               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
// //                 <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //                 <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //                 <path d="M12 19a7 7 0 110-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
// //               </svg>
// //             </button>
// //           </div>
// //         )}
// //       </nav>
// //       <Routes>
// //         <Route path="/" element={<Home />} />
// //         <Route
// //           path="/admin"
// //           element={
// //             <RequireAdmin>
// //               <AdminDashboard />
// //             </RequireAdmin>
// //           }
// //         />
// //         <Route
// //           path="/new"
// //           element={
// //             <RequireAdmin>
// //               <EventForm />
// //             </RequireAdmin>
// //           }
// //         />
// //         <Route
// //           path="/register"
// //           element={
// //             <RequireAuth>
// //               <RegistrationForm />
// //             </RequireAuth>
// //           }
// //         />
// //         <Route
// //           path="/checkin"
// //           element={
// //             <RequireAdmin>
// //               <CheckIn />
// //             </RequireAdmin>
// //           }
// //         />
// //         <Route
// //           path="/ads"
// //           element={
// //             <RequireAdmin>
// //               <AdsManager />
// //             </RequireAdmin>
// //           }
// //         />
// //         <Route path="/login" element={<Login />} />
// //         <Route
// //           path="/me"
// //           element={
// //             <RequireAuth>
// //               <UserDashboard />
// //             </RequireAuth>
// //           }
// //         />
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdsManager from './pages/AdsManager.jsx'
import EventForm from './pages/EventForm.jsx'
import RegistrationForm from './pages/RegistrationForm.jsx'
import CheckIn from './pages/CheckIn.jsx'
import Login from './pages/Login.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import Home from './pages/Home.jsx'
import EventDetails from './pages/EventDetails.jsx'

function RequireAuth({ children }) {
  const location = useLocation()
  const token = localStorage.getItem('auth_token')
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}

function RequireAdmin({ children }) {
  const location = useLocation()
  const token = localStorage.getItem('auth_token')
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  let user = null
  try { user = JSON.parse(localStorage.getItem('auth_user') || 'null') } catch {}
  if (user?.role !== 'admin') return <Navigate to="/me" replace />
  return children
}

function RequireUser({ children }) {
  const location = useLocation()
  const token = localStorage.getItem('auth_token')
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  let user = null
  try { user = JSON.parse(localStorage.getItem('auth_user') || 'null') } catch {}
  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  return children
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('auth_user') || 'null')
    } catch {
      return null
    }
  })()

  const isAuthed = !!localStorage.getItem('auth_token')
  const isAdmin = user?.role === 'admin'

  const onLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    navigate('/login', { replace: true })
  }

  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link'
  }

  return (
    <>
      {/* Animated Background */}
      <div className="animated-background">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
        <div className="bg-grid"></div>
      </div>

      <div className="app-container">
        {/* Navigation Header */}
        <header className="app-header">
          <div className="header-content">
            <div className="header-left">
              <Link to="/" className="logo">
                <div className="logo-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 2V4M8 2V4M3 10H21M8 14H16M8 18H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="logo-text">EventHub</span>
              </Link>
              
              <nav className="main-nav">
                <Link to="/" className={getNavLinkClass('/')}> 
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="nav-text">Home</span>
                </Link>
                
                {isAuthed && (
                  <>
                    {isAdmin ? (
                      <>
                        <Link to="/admin" className={getNavLinkClass('/admin')}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19.4 15C19.2663 15.9333 19.1333 16.8667 19 17.8C18.8333 18.6667 18.6667 19.5333 18.5 20.4C18.3667 21.0667 17.9333 21.5333 17.3333 21.8C16.6 22.0667 15.8667 22.3333 15.1333 22.6C14.4 22.8667 13.6667 23.1333 12.9333 23.4C12.3333 23.6 11.6667 23.6 11.0667 23.4C10.3333 23.1333 9.6 22.8667 8.86667 22.6C8.13333 22.3333 7.4 22.0667 6.66667 21.8C6.06667 21.5333 5.63333 21.0667 5.5 20.4C5.33333 19.5333 5.16667 18.6667 5 17.8C4.86667 16.8667 4.73333 15.9333 4.6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M4.6 9C4.73333 8.06667 4.86667 7.13333 5 6.2C5.16667 5.33333 5.33333 4.46667 5.5 3.6C5.63333 2.93333 6.06667 2.46667 6.66667 2.2C7.4 1.93333 8.13333 1.66667 8.86667 1.4C9.6 1.13333 10.3333 0.866667 11.0667 0.6C11.6667 0.4 12.3333 0.4 12.9333 0.6C13.6667 0.866667 14.4 1.13333 15.1333 1.4C15.8667 1.66667 16.6 1.93333 17.3333 2.2C17.9333 2.46667 18.3667 2.93333 18.5 3.6C18.6667 4.46667 18.8333 5.33333 19 6.2C19.1333 7.13333 19.2667 8.06667 19.4 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="nav-text">Dashboard</span>
                        </Link>
                        <Link to="/new" className={getNavLinkClass('/new')}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="nav-text">Create Event</span>
                        </Link>
                        <Link to="/checkin" className={getNavLinkClass('/checkin')}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M12 10V14M10 12H14M6 12H4.8C4.32261 12 3.86477 12.1896 3.52721 12.5272C3.18964 12.8648 3 13.3226 3 13.8V19.2C3 19.6774 3.18964 20.1352 3.52721 20.4728C3.86477 20.8104 4.32261 21 4.8 21H19.2C19.6774 21 20.1352 20.8104 20.4728 20.4728C20.8104 20.1352 21 19.6774 21 19.2V13.8C21 13.3226 20.8104 12.8648 20.4728 12.5272C20.1352 12.1896 19.6774 12 19.2 12H18M15 7C15 8.65685 13.6569 10 12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4C13.6569 4 15 5.34315 15 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="nav-text">Check-In</span>
                        </Link>
                        <Link to="/ads" className={getNavLinkClass('/ads')}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="nav-text">Ads</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/register" className={getNavLinkClass('/register')}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M16 21V19M5 12H19M5 6H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="nav-text">Register</span>
                        </Link>
                        <Link to="/me" className={getNavLinkClass('/me')}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M8 6H20C21.1 6 22 6.9 22 8V16C22 17.1 21.1 18 20 18H8C6.9 18 6 17.1 6 16V8C6 6.9 6.9 6 8 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 18V20C16 21.1 15.1 22 14 22H6C4.9 22 4 21.1 4 20V12C4 10.9 4.9 10 6 10H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="nav-text">My Events</span>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </nav>
            </div>

            <div className="header-right">
              {isAuthed && user ? (
                <div className="user-menu">
                  <div className="user-info">
                    <img
                      className="user-avatar"
                      src={user.picture || '/default-avatar.png'}
                      alt={user.name || user.email || 'user'}
                      onError={e => { 
                        e.currentTarget.src = '/default-avatar.png'
                        e.currentTarget.alt = 'Default Avatar'
                      }}
                    />
                    <div className="user-details">
                      <div className="user-name">{user.name || 'User'}</div>
                      <div className="user-role">{isAdmin ? 'Administrator' : 'User'}</div>
                    </div>
                  </div>
                  <button 
                    className="logout-btn" 
                    onClick={onLogout}
                    title="Logout"
                    aria-label="Logout"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 19a7 7 0 110-14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="login-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="nav-text">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              }
            />
            <Route
              path="/new"
              element={
                <RequireAdmin>
                  <EventForm />
                </RequireAdmin>
              }
            />
            <Route
              path="/register"
              element={
                <RequireUser>
                  <RegistrationForm />
                </RequireUser>
              }
            />
            <Route
              path="/events/:id/register"
              element={
                <RequireUser>
                  <RegistrationForm />
                </RequireUser>
              }
            />
            <Route
              path="/events/:id"
              element={<EventDetails />}
            />
            <Route
              path="/checkin"
              element={
                <RequireAdmin>
                  <CheckIn />
                </RequireAdmin>
              }
            />
            <Route
              path="/ads"
              element={
                <RequireAdmin>
                  <AdsManager />
                </RequireAdmin>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/me"
              element={
                <RequireUser>
                  <UserDashboard />
                </RequireUser>
              }
            />
          </Routes>
        </main>
      </div>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }

        /* Animated Background */
        .animated-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .bg-glow-1 {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%);
          animation: float 20s infinite ease-in-out;
        }

        .bg-glow-2 {
          position: absolute;
          bottom: -20%;
          left: -10%;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0) 70%);
          animation: float 25s infinite ease-in-out reverse;
        }

        .bg-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.3;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, 10px) rotate(5deg); }
          50% { transform: translate(0, 20px) rotate(0deg); }
          75% { transform: translate(-10px, 10px) rotate(-5deg); }
        }

        /* Header Styles */
        .app-header {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: saturate(180%) blur(20px);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        body.dark .app-header {
          background: rgba(30, 30, 46, 0.8);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 40px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-weight: 800;
          font-size: 1.5rem;
          color: var(--text);
          transition: all 0.2s ease;
        }

        .logo:hover {
          transform: translateY(-1px);
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--primary), var(--primary-600));
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .logo-text {
          background: linear-gradient(135deg, var(--primary), var(--primary-600));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .main-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          text-decoration: none;
          color: var(--muted);
          font-weight: 500;
          border-radius: 10px;
          transition: all 0.2s ease;
          position: relative;
          white-space: nowrap;
        }

        .nav-link:hover {
          color: var(--text);
          background: rgba(255, 255, 255, 0.1);
        }

        .nav-link.active {
          color: var(--primary);
          background: rgba(99, 102, 241, 0.1);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 16px;
          right: 16px;
          height: 2px;
          background: linear-gradient(90deg, var(--primary), var(--primary-600));
          border-radius: 2px;
        }

        .nav-text {
          display: inline;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* User Menu */
        .user-menu {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .user-menu:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid var(--border);
          object-fit: cover;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .user-name {
          font-weight: 600;
          color: var(--text);
          font-size: 0.9rem;
          line-height: 1;
        }

        .user-role {
          color: var(--muted);
          font-size: 0.75rem;
          line-height: 1;
        }

        .logout-btn {
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

        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: translateY(-1px);
        }

        .login-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: linear-gradient(135deg, var(--primary), var(--primary-600));
          color: white;
          text-decoration: none;
          border-radius: 10px;
          font-weight: 600;
          transition: all 0.2s ease;
          box-shadow: var(--shadow);
        }

        .login-btn:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }

        /* Main Content */
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          position: relative;
          z-index: 1;
          min-height: calc(100vh - 70px);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .header-content {
            padding: 0 16px;
          }

          .header-left {
            gap: 24px;
          }

          .main-nav {
            gap: 4px;
          }

          .nav-link {
            padding: 8px 12px;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 768px) {
          .header-content {
            height: 60px;
            padding: 0 12px;
          }

          .header-left {
            gap: 16px;
          }

          .logo-text {
            display: none;
          }

          .main-nav {
            gap: 4px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            -ms-overflow-style: none;
            padding: 4px 0;
          }

          .main-nav::-webkit-scrollbar {
            display: none;
          }

          .nav-link {
            padding: 8px 12px;
            font-size: 0.85rem;
          }

          .nav-text {
            display: inline;
          }

          .user-details {
            display: none;
          }

          .user-menu {
            gap: 8px;
            padding: 6px;
          }

          .user-avatar {
            width: 32px;
            height: 32px;
          }

          .login-btn {
            padding: 8px 12px;
          }
        }

        @media (max-width: 640px) {
          .main-nav {
            gap: 2px;
          }

          .nav-link {
            padding: 6px 10px;
          }

          .nav-text {
            display: none;
          }

          .nav-link svg {
            margin-right: 0;
          }

          .header-content {
            padding: 0 8px;
          }

          .main-content {
            padding: 16px 8px;
          }

          .user-info {
            gap: 6px;
          }

          .user-avatar {
            width: 28px;
            height: 28px;
          }

          .logout-btn {
            padding: 6px;
          }

          .login-btn {
            padding: 6px 10px;
          }
        }

        @media (max-width: 480px) {
          .header-content {
            height: 56px;
          }

          .logo-icon {
            width: 28px;
            height: 28px;
          }

          .main-nav {
            gap: 1px;
          }

          .nav-link {
            padding: 6px 8px;
            border-radius: 8px;
          }

          .nav-link.active::after {
            left: 8px;
            right: 8px;
          }

          .user-menu {
            gap: 6px;
          }

          .main-content {
            padding: 12px 6px;
          }
        }

        @media (max-width: 360px) {
          .header-content {
            padding: 0 6px;
          }

          .nav-link {
            padding: 5px 6px;
          }

          .logo-icon {
            width: 24px;
            height: 24px;
          }

          .user-avatar {
            width: 24px;
            height: 24px;
          }

          .logout-btn, .login-btn {
            padding: 4px 6px;
          }

          .logout-btn svg, .login-btn svg {
            width: 16px;
            height: 16px;
          }
        }

        /* Mobile-first responsive utilities */
        .mobile-only {
          display: none;
        }

        .desktop-only {
          display: flex;
        }

        @media (max-width: 768px) {
          .mobile-only {
            display: flex;
          }
          .desktop-only {
            display: none;
          }
        }

        /* Animation for page transitions */
        .main-content > * {
          animation: fadeInUp 0.3s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Ensure proper scrolling on mobile */
        html {
          -webkit-text-size-adjust: 100%;
        }

        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </>
  )
}