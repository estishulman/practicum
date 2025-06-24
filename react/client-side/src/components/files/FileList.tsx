import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/Api';
import Header from '../Header';
import './FileList.css';

// File Status Enum
enum FileStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Failed = 3
}

interface UserFile {
  id: number;
  fileName: string;
  fileType: string;
  uploadDate: string;
  url: string | null;
  status: number;
  userName: string;
  categoryName: string;
  summaryId: number | null;
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

const FileList: React.FC = () => {
  const [files, setFiles] = useState<UserFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  
  // Modal states
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  
  // Categories for filter
  const [categories, setCategories] = useState<string[]>([]);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Get search term from navigation state
  useEffect(() => {
    if (location.state?.searchTerm) {
      setSearchTerm(location.state.searchTerm);
    }
  }, [location.state]);

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    filterAndSortFiles();
  }, [files, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<UserFile[]>('/UserFile');
      setFiles(response.data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(response.data.map(file => file.categoryName)));
      setCategories(uniqueCategories);
      
    } catch (err) {
      setError('שגיאה בטעינת הקבצים');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortFiles = () => {
    let filtered = [...files];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(file =>
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(file => file.categoryName === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(file => file.status.toString() === selectedStatus);
    }

    // Sort files
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fileName.localeCompare(b.fileName);
        case 'category':
          return a.categoryName.localeCompare(b.categoryName);
        case 'user':
          return a.userName.localeCompare(b.userName);
        case 'status':
          return a.status - b.status;
        case 'date':
        default:
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      }
    });

    setFilteredFiles(filtered);
  };

  // Utility functions
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

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('pdf')) return '📄';
    return '📁';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

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

  const viewSummary = async (file: UserFile) => {
    try {
      if (file.summaryContent) {
        setSelectedSummary({
          id: file.summaryId!,
          content: file.summaryContent,
          createdAt: new Date().toISOString(),
          language: 'he',
          fileId: file.id
        });
        setShowSummaryModal(true);
      } else if (file.summaryId) {
        const response = await api.get(`/Summary/${file.summaryId}`);
        setSelectedSummary(response.data);
        setShowSummaryModal(true);
      } else {
        setError('לא נמצא סיכום עבור קובץ זה');
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError('שגיאה בטעינת הסיכום');
    }
  };

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

  const handleLecturerClick = (userId: number, userName: string) => {
    navigate(`/lecturers/${userId}/lectures`, { 
      state: { lecturerName: userName } 
    });
  };

  if (loading) {
    return (
      <div className="file-list-page">
        <Header currentPage="files" />
        <div className="loading-container">
          <div className="loading-spinner">📚</div>
          <h2>טוען קבצים...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="file-list-page">
        <Header currentPage="files" />
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>{error}</h2>
          <button onClick={fetchFiles} className="retry-btn">
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="file-list-page">
      <Header currentPage="files" />
      
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">כל ההרצאות</h1>
          <p className="page-subtitle">
            מצא את ההרצאה המושלמת עבורך מתוך {files.length} הרצאות זמינות
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="container">
          <div className="filters-container">
            {/* Search Input */}
            <div className="search-container">
              <input
                type="text"
                placeholder="חפש הרצאות, מרצים או נושאים..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            {/* Filters */}
            <div className="filters-group">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">כל הקטגוריות</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">כל הסטטוסים</option>
                <option value="2">הושלם</option>
                <option value="1">בעיבוד</option>
                <option value="0">ממתין</option>
                <option value="3">נכשל</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="date">תאריך העלאה</option>
                <option value="name">שם הקובץ</option>
                <option value="category">קטגוריה</option>
                <option value="user">מרצה</option>
                <option value="status">סטטוס</option>
              </select>
            </div>
          </div>

          {/* Results Counter */}
          <div className="results-info">
            <span className="results-count">
              {filteredFiles.length} מתוך {files.length} הרצאות
            </span>
          </div>
        </div>
      </div>

      {/* Files Grid */}
      <div className="files-section">
        <div className="container">
          {filteredFiles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>לא נמצאו הרצאות</h3>
              <p>נסה לשנות את הפילטרים או המונח החיפוש</p>
            </div>
          ) : (
            <div className="files-grid">
              {filteredFiles.map((file) => (
                <div key={file.id} className="file-card">
                  <div className="card-image" onClick={() => downloadFile(file.url || '', file.fileName)}>
                    <div className="default-image">
                      <div className="file-icon">{getFileIcon(file.fileType)}</div>
                    </div>
                    <div className="play-overlay">
                      <div className="play-button">▶</div>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <div className="card-header">
                      <div className="category-tag">{file.categoryName}</div>
                      <div 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(file.status) }}
                      >
                        {getStatusText(file.status)}
                      </div>
                    </div>
                    
                    <h3 
                      className="card-title"
                      onClick={() => downloadFile(file.url || '', file.fileName)}
                      title={file.fileName}
                    >
                      {file.fileName}
                    </h3>
                    
                    <div className="card-info">
                      <div className="lecturer-info">
                        <span 
                          className="lecturer-name"
                          onClick={() => handleLecturerClick(file.userId, file.userName)}
                        >
                          🎤 {file.userName}
                        </span>
                      </div>
                      
                      <div className="file-meta">
                        <span className="upload-date">📅 {formatDate(file.uploadDate)}</span>
                      </div>
                    </div>
                    
                    <div className="card-actions">
                      {file.url && (
                        <button 
                          className="action-btn download-btn"
                          onClick={() => downloadFile(file.url!, file.fileName)}
                          title="הורד קובץ"
                        >
                          ⬇ הורד
                        </button>
                      )}
                      {file.summaryId && (
                        <button 
                          className="action-btn summary-btn"
                          onClick={() => viewSummary(file)}
                          title="צפה בסיכום"
                        >
                          📝 סיכום
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Modal */}
      {showSummaryModal && selectedSummary && (
        <div 
          className="modal-overlay"
          onClick={() => setShowSummaryModal(false)}
        >
          <div 
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">סיכום ההרצאה</h2>
              <button 
                className="close-btn"
                onClick={() => setShowSummaryModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="summary-content">
                {selectedSummary.content}
              </div>
              
              <div className="summary-meta">
                נוצר ב: {new Date(selectedSummary.createdAt).toLocaleDateString('he-IL')} | 
                שפה: {selectedSummary.language === 'he' ? 'עברית' : selectedSummary.language}
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                onClick={() => setShowSummaryModal(false)}
                className="btn-secondary"
              >
                סגור
              </button>
              <button
                onClick={() => {
                  const file = filteredFiles.find(f => f.summaryId === selectedSummary.id);
                  downloadSummary(selectedSummary, file?.fileName || 'הרצאה');
                }}
                className="btn-primary"
              >
                ⬇ הורד סיכום
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="error-toast">
          {error}
          <button onClick={() => setError(null)} className="close-toast">✕</button>
        </div>
      )}
    </div>
  );
};

export default FileList;