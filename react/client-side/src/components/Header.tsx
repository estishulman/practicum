import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  currentPage?: string;
  userName?: string;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  currentPage = 'home',
  userName,
  onLoginClick,
  onRegisterClick
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = () => {
      if (showUserDropdown) {
        setShowUserDropdown(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserDropdown]);

  const navigateTo = (page: string) => {
    if (page === 'home') {
      navigate('/');
    } else {
      navigate(`/${page}`);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick(); // פותח modal בעמוד ה-Home
    } else {
      navigate('/login'); // ניווט רגיל לעמוד Login
    }
  };

  const handleRegister = () => {
    if (onRegisterClick) {
      onRegisterClick(); // פותח modal בעמוד ה-Home
    } else {
      navigate('/register'); // ניווט רגיל לעמוד Registration
    }
  };

  const handleUserMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowUserDropdown(!showUserDropdown);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowUserDropdown(false);
    localStorage.removeItem('token');
    console.log('User logged out');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          
          {/* Logo Section */}
          <div className="logo-section" onClick={() => navigateTo('home')}>
            <div className="logo-container">
              <div className="logo-icon">
                <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                  {/* כוכב מרכזי */}
                  <circle cx="20" cy="20" r="3" fill="rgba(255,255,255,0.9)"/>
                  
                  {/* קרניים */}
                  <g stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round">
                    <line x1="20" y1="4" x2="20" y2="12"/>
                    <line x1="20" y1="28" x2="20" y2="36"/>
                    <line x1="4" y1="20" x2="12" y2="20"/>
                    <line x1="28" y1="20" x2="36" y2="20"/>
                    <line x1="8.9" y1="8.9" x2="14.3" y2="14.3"/>
                    <line x1="25.7" y1="25.7" x2="31.1" y2="31.1"/>
                    <line x1="31.1" y1="8.9" x2="25.7" y2="14.3"/>
                    <line x1="14.3" y1="25.7" x2="8.9" y2="31.1"/>
                  </g>
                  
                  {/* ספר */}
                  <path d="M12 15 L28 15 L26 25 L14 25 Z" fill="rgba(255,255,255,0.7)" stroke="rgba(255,255,255,0.9)" strokeWidth="1"/>
                  <line x1="20" y1="15" x2="20" y2="25" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
                </svg>
              </div>
              <div className="logo-glow"></div>
            </div>
            <div className="logo-text">
              <div className="logo-title">קמפוס דיגיטלי</div>
              <div className="logo-subtitle">פלטפורמת הרצאות מתקדמת</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="nav-desktop">
            <button 
              className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => navigateTo('home')}
            >
              בית
            </button>
            <button 
              className={`nav-item ${currentPage === 'lecturers' ? 'active' : ''}`}
              onClick={() => navigateTo('lecturers')}
            >
              מרצים
            </button>
            <button 
              className={`nav-item ${currentPage === 'topics' ? 'active' : ''}`}
              onClick={() => navigateTo('topics')}
            >
              נושאים
            </button>
          </nav>

          {/* Auth Section */}
          <div className="auth-section">
            {isLoggedIn ? (
              <div className="user-menu-container">
                <div className="user-profile" onClick={handleUserMenu}>
                  <div className="user-avatar">
                    {userName ? userName.charAt(0).toUpperCase() : 'י'}
                  </div>
                  <div className="user-info">
                    <span className="user-name">{userName || 'משתמש'}</span>
                  </div>
                  <span className="dropdown-arrow">▼</span>
                </div>
                
                {/* User Dropdown */}
                {showUserDropdown && (
                  <div className="user-dropdown">
                    <div className="dropdown-item" onClick={() => navigateTo('profile')}>
                      <span>פרופיל אישי</span>
                    </div>
                    <div className="dropdown-item" onClick={() => navigateTo('my-lectures')}>
                      <span>ההרצאות שלי</span>
                    </div>
                    <div className="dropdown-item" onClick={() => navigateTo('settings')}>
                      <span>הגדרות</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-item logout" onClick={handleLogout}>
                      <span>התנתקות</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <button className="auth-btn login-btn" onClick={handleLogin}>
                  כניסה
                </button>
                <button className="auth-btn register-btn" onClick={handleRegister}>
                  הרשמה
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <div className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="mobile-nav-content">
            {/* Mobile Navigation Items */}
            <div className="mobile-nav-items">
              <button className="mobile-nav-item" onClick={() => navigateTo('home')}>
                בית
              </button>
              <button className="mobile-nav-item" onClick={() => navigateTo('lecturers')}>
                מרצים
              </button>
              <button className="mobile-nav-item" onClick={() => navigateTo('topics')}>
                נושאים
              </button>
            </div>

            {/* Mobile Auth */}
            <div className="mobile-auth">
              {isLoggedIn ? (
                <div className="mobile-user-section">
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar">
                      {userName ? userName.charAt(0).toUpperCase() : 'י'}
                    </div>
                    <span className="mobile-user-name">{userName || 'משתמש'}</span>
                  </div>
                  <div className="mobile-user-actions">
                    <button className="mobile-action-btn" onClick={() => navigateTo('profile')}>
                      פרופיל אישי
                    </button>
                    <button className="mobile-action-btn" onClick={() => navigateTo('my-lectures')}>
                      ההרצאות שלי
                    </button>
                    <button className="mobile-action-btn logout" onClick={handleLogout}>
                      התנתקות
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mobile-auth-buttons">
                  <button className="mobile-auth-btn mobile-login" onClick={handleLogin}>
                    כניסה
                  </button>
                  <button className="mobile-auth-btn mobile-register" onClick={handleRegister}>
                    הרשמה
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  };

  export default Header;