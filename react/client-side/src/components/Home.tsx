import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import api from '../services/Api';
import categoryService from '../services/caregoryService';
import lecturerService from '../services/LecturerService';
import './Home.css';

// File Status Enum - תואם לשרת
enum FileStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Failed = 3
}

// Interfaces
interface UserFile {
  id: number;
  fileName: string;
  fileType: string;
  uploadDate: string;
  url?: string;
  status: number; // מספר במקום string
  userName: string;
  categoryName: string;
  summaryId?: number;
  summaryContent?: string;
  userId: number;
  categoryId: number;
}

interface Summary {
  id: number;
  content: string;
  createdAt: string;
  language: string;
  fileId: number;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal states for summary
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);

  // Stats for footer
  const [stats, setStats] = useState({
    totalLectures: 0,
    totalLecturers: 0,
    totalCategories: 0,
    totalUsers: 0
  });

  // Utility functions for status
  const getStatusText = (status: number): string => {
    switch (status) {
      case FileStatus.Completed: return 'הושלם';
      case FileStatus.Processing: return 'בעיבוד';
      case FileStatus.Failed: return 'נכשל';
      case FileStatus.Pending:
      default: return 'ממתין';
    }
  };

  const getStatusColor = (status: number): string => {
    switch (status) {
      case FileStatus.Completed: return '#4caf50';
      case FileStatus.Processing: return '#ff9800';
      case FileStatus.Failed: return '#f44336';
      case FileStatus.Pending:
      default: return '#666';
    }
  };

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

  // View summary - תיקון הפונקציה
  const viewSummary = async (lecture: UserFile) => {
    try {
      console.log('👁️ Viewing summary for lecture:', {
        lectureId: lecture.id,
        fileName: lecture.fileName,
        summaryId: lecture.summaryId,
        hasSummaryContent: !!lecture.summaryContent
      });

      if (lecture.summaryContent) {
        // אם יש תוכן סיכום ישירות - השתמש בו
        console.log('📋 Using direct summary content');
        setSelectedSummary({
          id: lecture.summaryId!,
          content: lecture.summaryContent,
          createdAt: new Date().toISOString(),
          language: 'he',
          fileId: lecture.id
        });
        setShowSummaryModal(true);
      } else if (lecture.summaryId) {
        // אחרת - בצע קריאה נפרדת
        console.log('📡 Fetching summary from API');
        const response = await api.get(`/Summary/${lecture.summaryId}`);
        setSelectedSummary(response.data);
        setShowSummaryModal(true);
      } else {
        console.log('❌ No summary available');
        setError('לא נמצא סיכום עבור הרצאה זו');
      }
    } catch (err) {
      console.error('❌ Error fetching summary:', err);
      setError('שגיאה בטעינת הסיכום');
    }
  };

  // Download summary
  const downloadSummary = (summary: Summary, fileName: string) => {
    const blob = new Blob([summary.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `סיכום-${fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          <button 
            onClick={() => setError(null)}
            style={{
              marginLeft: '10px',
              padding: '5px 10px',
              background: 'transparent',
              border: '1px solid #c62828',
              borderRadius: '4px',
              color: '#c62828',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
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
                        onClick={() => viewSummary(lecture)}
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

      {/* Summary Modal */}
      {showSummaryModal && selectedSummary && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowSummaryModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h2 style={{ 
                fontSize: '1.5rem',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0
              }}>
                סיכום ההרצאה
              </h2>
            </div>
            
            {/* Modal Content */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                borderRadius: '12px', 
                padding: '24px',
                marginBottom: '16px',
                maxHeight: '400px',
                overflowY: 'auto',
                border: '1px solid #e5e5e5',
                flex: 1
              }}>
                <div style={{ 
                  whiteSpace: 'pre-wrap', 
                  lineHeight: 1.6,
                  fontFamily: 'inherit',
                  color: '#1a1a1a',
                }}>
                  {selectedSummary.content}
                </div>
              </div>
              
              <div style={{ 
                borderTop: '1px solid #e5e5e5', 
                paddingTop: '16px',
                marginBottom: '16px'
              }} />
              
              <div style={{ 
                color: '#666',
                fontSize: '13px',
                marginBottom: '24px'
              }}>
                נוצר ב: {new Date(selectedSummary.createdAt).toLocaleDateString('he-IL')} | 
                שפה: {selectedSummary.language === 'he' ? 'עברית' : selectedSummary.language}
              </div>
            </div>
            
            {/* Modal Actions */}
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'flex-end'
            }}>
              <button 
                onClick={() => setShowSummaryModal(false)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#f8f9fa',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              >
                סגור
              </button>
              <button
                onClick={() => {
                  const lecture = recentLectures.find(l => l.summaryId === selectedSummary.id);
                  downloadSummary(selectedSummary, lecture?.fileName || 'הרצאה');
                }}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #388e3c, #4caf50)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ⬇ הורד סיכום
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;