
// import React, { useState, useEffect } from 'react';
// import Header from './Header';
// import Login from './login/Login';
// import Registration from './login/Registeration';
// import './Home.css';

// interface Lecture {
//   id: number;
//   title: string;
//   lecturer: string;
//   category: string;
//   date: string;
//   duration?: string;
//   image?: string;
//   views?: number;
//   rating?: number;
// }

// const newLectures: Lecture[] = [
//   {
//     id: 1,
//     title: "מהפכת הבינה המלאכותית בעולם העסקים",
//     lecturer: "פרופ' דן כהן",
//     category: "טכנולוגיה",
//     date: "2024-03-15",
//     duration: "45 דקות",
//     views: 1250,
//     rating: 4.8
//   },
//   {
//     id: 2,
//     title: "עקרונות ההנהגה המודרנית",
//     lecturer: "ד״ר שרה לוי",
//     category: "ניהול",
//     date: "2024-03-12",
//     duration: "38 דקות",
//     views: 892,
//     rating: 4.6
//   },
//   {
//     id: 3,
//     title: "פסיכולוגיה חיובית ואושר בעבודה",
//     lecturer: "ד״ר אלון רוזן",
//     category: "פסיכולוגיה",
//     date: "2024-03-10",
//     duration: "52 דקות",
//     views: 743,
//     rating: 4.9
//   },
//   {
//     id: 4,
//     title: "כלכלה דיגיטלית במאה ה-21",
//     lecturer: "פרופ' מיכל ברק",
//     category: "כלכלה",
//     date: "2024-03-08",
//     duration: "41 דקות",
//     views: 1156,
//     rating: 4.7
//   },
//   {
//     id: 5,
//     title: "חדשנות וקרייטיביות בארגון",
//     lecturer: "ד״ר יוסי פרידמן",
//     category: "חדשנות",
//     date: "2024-03-05",
//     duration: "47 דקות",
//     views: 634,
//     rating: 4.5
//   },
//   {
//     id: 6,
//     title: "סייבר וביטחון מידע עבור מנהלים",
//     lecturer: "רועי אבני",
//     category: "אבטחה",
//     date: "2024-03-03",
//     duration: "55 דקות",
//     views: 987,
//     rating: 4.8
//   }
// ];

// const featuredLectures: Lecture[] = [
//   {
//     id: 7,
//     title: "אמנות התקשורת הבין-אישית",
//     lecturer: "ד״ר רונית אבן",
//     category: "תקשורת",
//     date: "2024-02-28",
//     duration: "43 דקות",
//     views: 2150,
//     rating: 4.9
//   },
//   {
//     id: 8,
//     title: "מכניקת הקוונטים למתחילים",
//     lecturer: "פרופ' עמית גולדשטין",
//     category: "מדע",
//     date: "2024-02-25",
//     duration: "62 דקות",
//     views: 1876,
//     rating: 4.7
//   },
//   {
//     id: 9,
//     title: "אסטרטגיות השקעה מנצחות",
//     lecturer: "נועם תמיר",
//     category: "השקעות",
//     date: "2024-02-22",
//     duration: "39 דקות",
//     views: 3245,
//     rating: 4.8
//   },
//   {
//     id: 10,
//     title: "פילוסופיה מעשית לחיים טובים",
//     lecturer: "פרופ' אורי זימן",
//     category: "פילוסופיה",
//     date: "2024-02-20",
//     duration: "51 דקות",
//     views: 1567,
//     rating: 4.9
//   }
// ];

// const Home: React.FC = () => {
//   const [savedLectures, setSavedLectures] = useState<Set<number>>(new Set());
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchFilter, setSearchFilter] = useState<'all' | 'lecturer' | 'category'>('all');
  
//   // מצבים לקומפוננטות Login ו-Registration
//   const [showLogin, setShowLogin] = useState(false);
//   const [showRegistration, setShowRegistration] = useState(false);

//   // useEffect למניעת גלילה כשמודל פתוח
//   useEffect(() => {
//     if (showLogin || showRegistration) {
//       document.body.style.overflow = 'hidden';
//       document.body.classList.add('modal-open');
//     } else {
//       document.body.style.overflow = 'unset';
//       document.body.classList.remove('modal-open');
//     }

//     // ניקוי כשהקומפוננטה נהרסת
//     return () => {
//       document.body.style.overflow = 'unset';
//       document.body.classList.remove('modal-open');
//     };
//   }, [showLogin, showRegistration]);

//   // פונקציות לטיפול בהתחברות והרשמה
//   const handleLoginSuccess = () => {
//     setShowLogin(false);
//     console.log('Login successful');
//   };

//   // פונקציות שתחברי לAPI שלך
//   const handleSaveLecture = (lectureId: number) => {
//     const newSaved = new Set(savedLectures);
//     if (newSaved.has(lectureId)) {
//       newSaved.delete(lectureId);
//     } else {
//       newSaved.add(lectureId);
//     }
//     setSavedLectures(newSaved);
//     console.log(`Save/Unsave lecture ${lectureId}`);
//   };

//   const handleDownload = (lectureId: number) => {
//     console.log(`Download lecture ${lectureId}`);
//   };

//   const handleOpenSummary = (lectureId: number) => {
//     console.log(`Open summary for lecture ${lectureId}`);
//   };

//   const handlePlayLecture = (lectureId: number) => {
//     console.log(`Play lecture ${lectureId}`);
//   };

//   const handleSearch = () => {
//     console.log(`Search: ${searchQuery}, Filter: ${searchFilter}`);
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('he-IL');
//   };

//   const renderStars = (rating: number) => {
//     return '⭐'.repeat(Math.floor(rating));
//   };

//   const LectureCard: React.FC<{ lecture: Lecture; featured?: boolean }> = ({ 
//     lecture, 
//     featured = false 
//   }) => (
//     <div className={`lecture-card ${featured ? 'featured' : ''}`}>
//       <div className="card-image" onClick={() => handlePlayLecture(lecture.id)}>
//         {lecture.image ? (
//           <img src={lecture.image} alt={lecture.title} />
//         ) : (
//           <div className="default-image">
//             <div className="image-icon">🎓</div>
//           </div>
//         )}
//         <div className="play-overlay">
//           <div className="play-button">▶</div>
//         </div>
//       </div>
      
//       <div className="card-content">
//         <div className="card-header">
//           <span className="category-tag">{lecture.category}</span>
//           <div className="card-actions">
//             <button 
//               className={`action-btn save-btn ${savedLectures.has(lecture.id) ? 'saved' : ''}`}
//               onClick={() => handleSaveLecture(lecture.id)}
//               title={savedLectures.has(lecture.id) ? 'הסר משמורים' : 'שמור לצפייה מאוחר יותר'}
//             >
//               {savedLectures.has(lecture.id) ? '❤️' : '🤍'}
//             </button>
//             <button 
//               className="action-btn download-btn"
//               onClick={() => handleDownload(lecture.id)}
//               title="הורד הרצאה"
//             >
//               ⬇️
//             </button>
//             <button 
//               className="action-btn summary-btn"
//               onClick={() => handleOpenSummary(lecture.id)}
//               title="פתח סיכום"
//             >
//               📄
//             </button>
//           </div>
//         </div>
        
//         <h3 className="card-title" onClick={() => handlePlayLecture(lecture.id)}>
//           {lecture.title}
//         </h3>
        
//         <div className="card-info">
//           <div className="lecturer-info">
//             <span className="lecturer-name">🎤 {lecture.lecturer}</span>
//           </div>
          
//           <div className="lecture-meta">
//             <span className="date">📅 {formatDate(lecture.date)}</span>
//             {lecture.duration && (
//               <span className="duration">⏱️ {lecture.duration}</span>
//             )}
//           </div>
          
//           {(lecture.views || lecture.rating) && (
//             <div className="lecture-stats">
//               {lecture.views && (
//                 <span className="views">👁️ {lecture.views.toLocaleString()}</span>
//               )}
//               {lecture.rating && (
//                 <span className="rating">
//                   {renderStars(lecture.rating)} {lecture.rating}
//                 </span>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className={`${(showLogin || showRegistration) ? 'modal-active' : ''}`}>
//       {/* Header קבוע עם פונקציות לפתיחת Login/Registration */}
//       <Header 
//         currentPage="home" 
//         onLoginClick={() => setShowLogin(true)}
//         onRegisterClick={() => setShowRegistration(true)}
//       />
      
//       {/* התוכן הראשי - עם padding-top בגלל ה-Header הקבוע */}
//       <div className="home-page" style={{ paddingTop: '80px' }}>
//         {/* Hero Section */}
//         <section className="hero-section">
//           <div className="hero-content">
//             <div className="hero-text">
//               <h1 className="hero-title">
//                 רעיון טוב יכול לשנות תודעה
//               </h1>
//               <p className="hero-subtitle">
//                 הרצאות שמשלבות ידע, ניסיון והשראה – במילים מדויקות ובגובה העיניים
//               </p>
//             </div>
            
//             {/* Search Section */}
//             <div className="search-section">
//               <div className="search-container">
//                 <div className="search-filters">
//                   <select 
//                     className="search-filter"
//                     value={searchFilter}
//                     onChange={(e) => setSearchFilter(e.target.value as 'all' | 'lecturer' | 'category')}
//                   >
//                     <option value="all">הכל</option>
//                     <option value="lecturer">לפי מרצה</option>
//                     <option value="category">לפי נושא</option>
//                   </select>
//                 </div>
//                 <div className="search-input-container">
//                   <input 
//                     type="text"
//                     className="search-input"
//                     placeholder={
//                       searchFilter === 'lecturer' ? 'חפש מרצה...' :
//                       searchFilter === 'category' ? 'חפש נושא...' :
//                       'חפש הרצאות, מרצים או נושאים...'
//                     }
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//                   />
//                   <button className="search-btn" onClick={handleSearch}>
//                     🔍
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="hero-visual">
//             <div className="floating-elements">
//               <div className="element element-1">💡</div>
//               <div className="element element-2">🎯</div>
//               <div className="element element-3">🚀</div>
//               <div className="element element-4">📚</div>
//               <div className="element element-5">⭐</div>
//               <div className="element element-6">🎓</div>
//             </div>
//           </div>
//         </section>

//         {/* New Lectures Section */}
//         <section className="lectures-section">
//           <div className="section-header">
//             <h2 className="section-title">הרצאות חדשות</h2>
//             <p className="section-subtitle">התוכן החדש והמעודכן ביותר מהמרצים המובילים</p>
//           </div>
          
//           <div className="lectures-grid">
//             {newLectures.map(lecture => (
//               <LectureCard key={lecture.id} lecture={lecture} />
//             ))}
//           </div>
          
//           <div className="section-footer">
//             <button className="view-all-btn" onClick={() => console.log('Navigate to all new lectures')}>
//               צפה בכל ההרצאות החדשות
//               <span className="arrow">←</span>
//             </button>
//           </div>
//         </section>

//         {/* Featured Lectures Section */}
//         <section className="lectures-section featured-section">
//           <div className="section-header">
//             <h2 className="section-title">הרצאות נבחרות</h2>
//             <p className="section-subtitle">הקולקציה המובחרת של התוכן הכי איכותי ומבוקש</p>
//           </div>
          
//           <div className="lectures-grid featured-grid">
//             {featuredLectures.map(lecture => (
//               <LectureCard key={lecture.id} lecture={lecture} featured={true} />
//             ))}
//           </div>
          
//           <div className="section-footer">
//             <button className="view-all-btn featured-btn" onClick={() => console.log('Navigate to all featured lectures')}>
//               צפה בכל ההרצאות הנבחרות
//               <span className="arrow">←</span>
//             </button>
//           </div>
//         </section>

//         {/* Stats Section */}
//         <section className="stats-section">
//           <div className="stats-container">
//             <div className="stat-item">
//               <div className="stat-number">1,250+</div>
//               <div className="stat-label">הרצאות איכות</div>
//             </div>
//             <div className="stat-item">
//               <div className="stat-number">150+</div>
//               <div className="stat-label">מרצים מובילים</div>
//             </div>
//             <div className="stat-item">
//               <div className="stat-number">50,000+</div>
//               <div className="stat-label">סטודנטים פעילים</div>
//             </div>
//             <div className="stat-item">
//               <div className="stat-number">25+</div>
//               <div className="stat-label">תחומי ידע</div>
//             </div>
//           </div>
//         </section>
//       </div>

//       {/* מודלים לLogin ו-Registration */}
//       {showLogin && (
//         <div className="modal-overlay" onClick={() => setShowLogin(false)}>
//           <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
//             <Login onLoginSuccess={handleLoginSuccess} />
//             <button 
//               className="modal-close-btn" 
//               onClick={() => setShowLogin(false)}
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}

//       {showRegistration && (
//         <div className="modal-overlay" onClick={() => setShowRegistration(false)}>
//           <div className="modal-wrapper" onClick={(e) => e.stopPropagation()}>
//             <Registration />
//             <button 
//               className="modal-close-btn" 
//               onClick={() => setShowRegistration(false)}
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import api from '../services/Api';
import categoryService from '../services/caregoryService';
import lecturerService from '../services/LecturerService';
import './Home.css';

// Interfaces
interface UserFile {
  id: number;
  fileName: string;
  fileType: string;
  uploadDate: string;
  url?: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  userName: string;
  categoryName: string;
  summaryId?: number;
  userId: number;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  // States for real data
  const [recentLectures, setRecentLectures] = useState<UserFile[]>([]);
  const [allLectures, setAllLectures] = useState<UserFile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [lecturers, setLecturers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Stats for footer
  const [stats, setStats] = useState({
    totalLectures: 0,
    totalLecturers: 0,
    totalCategories: 0,
    totalUsers: 0
  });

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all lectures
      const lecturesResponse = await api.get('/UserFile');
      const allLecturesData = lecturesResponse.data;
      setAllLectures(allLecturesData);

      // Get recent lectures (last 6)
      const sortedLectures = allLecturesData
        .sort((a: UserFile, b: UserFile) => 
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        )
        .slice(0, 6);
      setRecentLectures(sortedLectures);

      // Fetch categories
      const categoriesData = await categoryService.getAllCategories();
      setCategories(categoriesData);

      // Fetch lecturers
      const lecturersData = await lecturerService.getAllLecturers();
      setLecturers(lecturersData);

      // Fetch all users for stats
      let allUsersData = [];
      try {
        const allUsersResponse = await api.get('/User');
        allUsersData = allUsersResponse.data;
      } catch (err) {
        // If /User endpoint doesn't exist, use lecturers as fallback
        console.warn('All users endpoint not found, using lecturers count');
        allUsersData = lecturersData;
      }
      setAllUsers(allUsersData);

      // Calculate stats - ALL lectures (not just completed)
      setStats({
        totalLectures: allLecturesData.length, // כל ההרצאות
        totalLecturers: lecturersData.length,
        totalCategories: categoriesData.length,
        totalUsers: allUsersData.length // כל המשתמשים
      });

      setError(null);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  // Handle search - navigate to lectures page with search parameter
  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      // If no search term, go to general lectures page
      navigate('/files', { state: { searchTerm: '' } });
      return;
    }
    
    // Check if search matches a specific category
    const matchingCategory = categories.find(cat => 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (matchingCategory) {
      // Navigate to category lectures page
      navigate(`/topics/${matchingCategory.id}/lectures`, { 
        state: { 
          categoryName: matchingCategory.name,
          searchTerm: searchTerm.trim()
        } 
      });
      return;
    }

    // Check if search matches a lecturer
    const matchingLecturer = lecturers.find(lecturer => 
      lecturer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (matchingLecturer) {
      // Navigate to lecturer lectures page
      navigate(`/lecturers/${matchingLecturer.id}/lectures`, { 
        state: { 
          lecturerName: matchingLecturer.name,
          searchTerm: searchTerm.trim()
        } 
      });
      return;
    }

    // General search - navigate to files page with search term
    navigate('/files', { 
      state: { 
        searchTerm: searchTerm.trim() 
      } 
    });
  };

  // Navigate to category lectures
  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    navigate(`/topics/${categoryId}/lectures`, { 
      state: { categoryName } 
    });
  };

  // Navigate to lecturer lectures
  const handleLecturerClick = (lecturerId: number, lecturerName: string) => {
    navigate(`/lecturers/${lecturerId}/lectures`, { 
      state: { lecturerName } 
    });
  };

  // Navigate to all lectures
  const handleViewAllLectures = () => {
    navigate('/files');
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  // Get file icon
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('pdf')) return '📄';
    return '📁';
  };

  // Get status text in Hebrew
  const getStatusText = (status: string) => {
    switch (status) {
      case 'Completed': return 'הושלם';
      case 'Processing': return 'בעיבוד';
      case 'Failed': return 'נכשל';
      default: return 'ממתין';
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#4caf50';
      case 'Processing': return '#ff9800';
      case 'Failed': return '#f44336';
      default: return '#666';
    }
  };

  // Download file
  const downloadFile = (url: string, fileName: string) => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // View summary
  const viewSummary = async (summaryId: number) => {
    try {
      const response = await api.get(`/Summary/${summaryId}`);
      // You can implement a modal or navigate to summary page
      console.log('Summary:', response.data);
      alert('פתיחת סיכום - ניתן להוסיף מודל או עמוד ייעודי');
    } catch (err) {
      console.error('Error fetching summary:', err);
      alert('שגיאה בטעינת הסיכום');
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        <Header currentPage="home" />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <div style={{ fontSize: '48px' }}>📚</div>
          <h2>טוען נתונים...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Header currentPage="home" />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">פלטפורמת הרצאות אקדמיות</h1>
            <p className="hero-subtitle">
              גלה, למד והתפתח עם מגוון רחב של הרצאות איכותיות מהמרצים הטובים ביותר
            </p>
          </div>
          
          {/* Search Section */}
          <div className="search-section">
            <div className="search-container">
              <div className="search-filters">
                <select 
                  className="search-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">כל הקטגוריות</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="search-input-container">
                <input 
                  type="text"
                  className="search-input"
                  placeholder="חפש הרצאות, מרצים או נושאים..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button className="search-btn" onClick={handleSearch}>
                  חפש
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="hero-visual">
          <div className="floating-elements">
            <div className="element element-1">💡</div>
            <div className="element element-2">🎯</div>
            <div className="element element-3">🚀</div>
            <div className="element element-4">📚</div>
            <div className="element element-5">⭐</div>
            <div className="element element-6">🎓</div>
          </div>
        </div>
      </section>

      {/* Error Display */}
      {error && (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          textAlign: 'center',
          margin: '20px',
          borderRadius: '12px',
          border: '1px solid #f44336'
        }}>
          {error}
        </div>
      )}

      {/* Recent Lectures Section */}
      <section className="lectures-section">
        <div className="section-header">
          <h2 className="section-title">הרצאות אחרונות</h2>
          <p className="section-subtitle">הרצאות שהועלו לאחרונה בפלטפורמה</p>
        </div>
        
        <div className="lectures-grid">
          {recentLectures.map((lecture) => (
            <div key={lecture.id} className="lecture-card">
              <div className="card-image" onClick={() => downloadFile(lecture.url || '', lecture.fileName)}>
                <div className="default-image">
                  <div className="image-icon">{getFileIcon(lecture.fileType)}</div>
                </div>
                <div className="play-overlay">
                  <div className="play-button">▶</div>
                </div>
              </div>
              
              <div className="card-content">
                <div className="card-header">
                  <div className="category-tag">{lecture.categoryName}</div>
                  <div className="card-actions">
                    {lecture.url && (
                      <button 
                        className="action-btn download-btn"
                        onClick={() => downloadFile(lecture.url!, lecture.fileName)}
                        title="הורד"
                      >
                        ⬇
                      </button>
                    )}
                    {lecture.summaryId && (
                      <button 
                        className="action-btn summary-btn"
                        onClick={() => viewSummary(lecture.summaryId!)}
                        title="צפה בסיכום"
                      >
                        📝
                      </button>
                    )}
                  </div>
                </div>
                
                <h3 
                  className="card-title"
                  onClick={() => downloadFile(lecture.url || '', lecture.fileName)}
                >
                  {lecture.fileName}
                </h3>
                
                <div className="card-info">
                  <div className="lecturer-info">
                    <span 
                      className="lecturer-name"
                      onClick={() => handleLecturerClick(lecture.userId, lecture.userName)}
                      style={{ cursor: 'pointer', color: '#2196f3' }}
                    >
                      🎤 {lecture.userName}
                    </span>
                  </div>
                  
                  <div className="lecture-meta">
                    <span>📅 {formatDate(lecture.uploadDate)}</span>
                    <span style={{ color: getStatusColor(lecture.status) }}>
                      📊 {getStatusText(lecture.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="section-footer">
          <button className="view-all-btn" onClick={handleViewAllLectures}>
            צפה בכל ההרצאות
            <span className="arrow">←</span>
          </button>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="lectures-section featured-section">
        <div className="section-header">
          <h2 className="section-title">חקור לפי נושאים</h2>
          <p className="section-subtitle">מגוון רחב של תחומי ידע ונושאים</p>
        </div>
        
        <div className="lectures-grid featured-grid">
          {categories.slice(0, 6).map((category) => {
            const categoryLectures = allLectures.filter(lecture => 
              lecture.categoryId === category.id
            );
            
            return (
              <div 
                key={category.id} 
                className="lecture-card featured"
                onClick={() => handleCategoryClick(category.id, category.name)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-image">
                  <div className="default-image">
                    <div className="image-icon">📚</div>
                  </div>
                  <div className="play-overlay">
                    <div className="play-button">👁</div>
                  </div>
                </div>
                
                <div className="card-content">
                  <div className="card-header">
                    <div className="category-tag">{categoryLectures.length} הרצאות</div>
                  </div>
                  
                  <h3 className="card-title">{category.name}</h3>
                  
                  <div className="card-info">
                    <div className="lecture-meta">
                      <span>🎯 {categoryLectures.length} הרצאות זמינות</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="section-footer">
          <button 
            className="view-all-btn featured-btn"
            onClick={() => navigate('/topics')}
          >
            צפה בכל הנושאים
            <span className="arrow">←</span>
          </button>
        </div>
      </section>

      {/* Stats Section - Updated with real data */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{stats.totalLectures}</div>
            <div className="stat-label">הרצאות בסך הכל</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalUsers}</div>
            <div className="stat-label">משתמשים רשומים</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalLecturers}</div>
            <div className="stat-label">מרצים פעילים</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalCategories}</div>
            <div className="stat-label">תחומי ידע</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;