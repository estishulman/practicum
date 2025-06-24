


// import React, { useState, useEffect } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   Grid,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   IconButton,
//   Chip,
//   Alert,
//   CircularProgress,
//   Container,
//   InputAdornment,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   LinearProgress,
//   Divider,
//   Avatar
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Download as DownloadIcon,
//   Visibility as VisibilityIcon,
//   FilePresent as FilePresentIcon,
//   Search as SearchIcon,
//   ArrowBack as ArrowBackIcon,
//   Upload as UploadIcon,
//   Close as CloseIcon,
//   VideoFile as VideoFileIcon,
//   AudioFile as AudioFileIcon,
//   PictureAsPdf as PdfIcon,
//   InsertDriveFile as FileIcon,
//   CheckCircle as CheckCircleIcon,
//   Assignment as AssignmentIcon,
//   Person as PersonIcon,
//   Category as CategoryIcon,
//   PlayArrow as PlayArrowIcon
// } from '@mui/icons-material';
// import Header from './Header';
// import api from '../services/Api';

// // CSS Variables - matching Home.css
// const lecturesStyles = {
//   primaryBlue: '#2196f3',
//   primaryIndigo: '#6366f1',
//   primaryPurple: '#9c27b0',
//   textPrimary: '#1a1a1a',
//   textSecondary: '#666',
//   textMuted: '#999',
//   borderLight: '#e5e5e5',
//   bgLight: '#f8f9fa',
//   bgLighter: '#fafbfc',
//   white: '#ffffff',
//   shadowSm: '0 2px 8px rgba(0, 0, 0, 0.06)',
//   shadowMd: '0 4px 16px rgba(0, 0, 0, 0.08)',
//   shadowLg: '0 8px 32px rgba(0, 0, 0, 0.12)',
//   transition: 'all 0.3s ease',
//   borderRadius: '12px',
//   borderRadiusLg: '16px'
// };

// // Types based on the API controllers
// interface UserFile {
//   id: number;
//   fileName: string;
//   fileType: string;
//   uploadDate: string;
//   url?: string;
//   status: number;
//   userName: string;
//   categoryName: string;
//   summaryId?: number;
//   summaryContent?: string;
//   userId: number;
//   categoryId: number;
// }
// // הוסף enum שתואם לשרת
// enum FileStatus {
//   Pending = 0,
//   Processing = 1,
//   Completed = 2,
//   Failed = 3
// }


// interface Summary {
//   id: number;
//   content: string;
//   createdAt: string;
//   language: string;
//   fileId: number;
// }

// interface Category {
//   id: number;
//   name: string;
// }

// const LecturesList: React.FC = () => {
//   const { lecturerId, categoryId } = useParams<{ lecturerId: string; categoryId: string }>();
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   // Determine filter type from URL
//   const filterType: 'lecturer' | 'category' = lecturerId ? 'lecturer' : 'category';
//   const filterId = lecturerId ? parseInt(lecturerId) : categoryId ? parseInt(categoryId) : null;
//   const filterName = location.state?.lecturerName || location.state?.categoryName || 
//                     (filterType === 'lecturer' ? 'מרצה' : 'קטגוריה');

//   // States
//   const [lectures, setLectures] = useState<UserFile[]>([]);
//   const [filteredLectures, setFilteredLectures] = useState<UserFile[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Modal states
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showSummaryModal, setShowSummaryModal] = useState(false);
//   const [editingLecture, setEditingLecture] = useState<UserFile | null>(null);
//   const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  
//   // Upload form state
//   const [uploadForm, setUploadForm] = useState({
//     fileName: '',
//     categoryId: 1,
//     file: null as File | null
//   });
//   const [uploadLoading, setUploadLoading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   // Current user info
//   const [currentUserRole, setCurrentUserRole] = useState<string>('');
//   const [currentUserId, setCurrentUserId] = useState<number>(0);

//   // Validate filterId
//   if (!filterId) {
//     return (
//       <div style={{ minHeight: '100vh', backgroundColor: lecturesStyles.bgLighter }}>
//         <Header currentPage={filterType === 'lecturer' ? 'lecturers' : 'topics'} />
//         <Container maxWidth="lg" sx={{ paddingTop: '100px', textAlign: 'center' }}>
//           <Typography variant="h4" color="error" gutterBottom>
//             שגיאה: מזהה {filterType === 'lecturer' ? 'מרצה' : 'קטגוריה'} לא תקין
//           </Typography>
//           <Button
//             variant="contained"
//             onClick={() => navigate(filterType === 'lecturer' ? '/lecturers' : '/topics')}
//             startIcon={<ArrowBackIcon />}
//             sx={{ marginTop: 2 }}
//           >
//             חזור ל{filterType === 'lecturer' ? 'מרצים' : 'נושאים'}
//           </Button>
//         </Container>
//       </div>
//     );
//   }

//   // Get current user info from token
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     console.log('🔍 Checking token exists:', !!token);
    
//     if (token) {
//       try {
//         const payload = JSON.parse(atob(token.split('.')[1]));
//         console.log('📋 Full Token payload:', JSON.stringify(payload, null, 2));
        
//         // Handle Microsoft claims format
//         const role = payload.role || 
//                     payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
//                     payload.Role || '';
                    
//         const userId = parseInt(payload.sub) || 
//                       parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']) || 
//                       parseInt(payload.nameid) || 
//                       parseInt(payload.id) || 0;
        
//         setCurrentUserRole(role);
//         setCurrentUserId(userId);
        
//         console.log('✅ User info extracted:', {
//           role: role,
//           userId: userId,
//           filterId: filterId,
//           filterType: filterType,
//           allPayloadKeys: Object.keys(payload)
//         });
//       } catch (error) {
//         console.error('❌ Error parsing token:', error);
//       }
//     }
//   }, [filterId, filterType]);

//   // Check permissions
//   const canUpload = currentUserRole === 'lecturer' || currentUserRole === 'Admin';
//   const isCurrentUserLecturer = filterType === 'lecturer' && currentUserId === filterId;
//   const hasPermissions = (canUpload && isCurrentUserLecturer) || 
//                         (filterType === 'category' && currentUserRole === 'Admin');

//   // Fetch data
//   useEffect(() => {
//     fetchLectures();
//     fetchCategories();
//   }, [filterId, filterType]);

//   // Filter lectures
//   useEffect(() => {
//     const filtered = lectures.filter(lecture => {
//       const matchesSearch = lecture.fileName.toLowerCase().includes(searchTerm.toLowerCase());
//       return matchesSearch;
//     });
//     setFilteredLectures(filtered);
//   }, [searchTerm, lectures]);

//   const fetchLectures = async () => {
//     try {
//       setLoading(true);
//       console.log(`📡 Fetching lectures for ${filterType}:`, filterId);
//       console.log(`🏷️ Filter name: "${filterName}"`);
      
//       const response = await api.get('/UserFile');
//       console.log('📊 All files from API:', response.data);

//       // הוסף את זה:
//       response.data.forEach((file: any) => {
//        console.log(`📄 File ${file.id}: "${file.fileName}"`, {
//        status: file.status,
//        summaryId: file.summaryId,
//        summaryContent: file.summaryContent ? 'EXISTS' : 'NULL',
//        summaryContentLength: file.summaryContent?.length || 0
//   });
//   });

//       // בדיקה מיוחדת לקטגוריות
//       if (filterType === 'category') {
//         const allCategories = response.data.map((file: any) => ({
//           categoryId: file.categoryId,
//           categoryName: file.categoryName
//         }));
//         console.log('🔍 All unique categories in files:', [...new Set(allCategories.map(c => `${c.categoryId}: ${c.categoryName}`))]);
//       }

//       const userLectures = response.data.filter((file: any) => {
//         const matches = filterType === 'lecturer' ? 
//           file.userId === filterId : 
//           file.categoryId === filterId;
          
//         console.log('🔍 Checking file:', {
//           fileName: file.fileName,
//           userId: file.userId,
//           categoryId: file.categoryId,
//           categoryName: file.categoryName,
//           userName: file.userName,
//           filterType: filterType,
//           filterId: filterId,
//           matches: matches
//         });
        
//         return matches;
//       });
      
//       console.log(`📚 Filtered lectures for ${filterType}`, filterId, ':', userLectures);
//       setLectures(userLectures);
//       setError(null);
//     } catch (err: any) {
//       console.error('❌ Error fetching lectures:', err);
//       setError('שגיאה בטעינת ההרצאות');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await api.get('/Category');
//       setCategories(response.data);
//     } catch (err) {
//       console.error('⚠️ Error fetching categories:', err);
//       setCategories([
//         { id: 1, name: 'כללי' },
//         { id: 2, name: 'מתמטיקה' },
//         { id: 3, name: 'מדעי המחשב' },
//         { id: 4, name: 'פיזיקה' }
//       ]);
//     }
//   };

//   // File operations
//   const handleFileUpload = async () => {
//     if (!uploadForm.file) {
//       setError('אנא בחר קובץ להעלאה');
//       return;
//     }

//     try {
//       setUploadLoading(true);
//       setUploadProgress(10);
//       console.log('📤 Starting upload process...');

//       const presignedResponse = await api.get('/UserFile/presigned-url', {
//         params: {
//           fileName: uploadForm.file.name,
//           contentType: uploadForm.file.type
//         }
//       });

//       setUploadProgress(30);
//       const presignedUrl = presignedResponse.data.url;

//       console.log('🔗 Got presigned URL, uploading to S3...');

//       const response = await fetch(presignedUrl, {
//         method: 'PUT',
//         body: uploadForm.file,
//         headers: {
//           'Content-Type': uploadForm.file.type,
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Upload failed');
//       }

//       setUploadProgress(80);

//       const fileData = {
//         fileName: uploadForm.fileName || uploadForm.file.name,
//         fileType: uploadForm.file.type,
//         url: presignedUrl.split('?')[0],
//         userId: filterType === 'lecturer' ? filterId : currentUserId,
//         categoryId: filterType === 'category' ? filterId : uploadForm.categoryId
//       };

//       console.log('💾 Creating file record:', fileData);
//       console.log('🔧 Upload context:', {
//         filterType,
//         filterId,
//         filterName,
//         currentUserId,
//         selectedCategoryId: uploadForm.categoryId
//       });

//       await api.post('/UserFile', fileData);
      
//       setUploadProgress(100);

//       // Reset form and refresh
//       setUploadForm({ fileName: '', categoryId: 1, file: null });
//       setShowUploadModal(false);
//       setUploadProgress(0);
//       await fetchLectures();
      
//       console.log('✅ Upload completed successfully');
//     } catch (err: any) {
//       console.error('❌ Error uploading file:', err);
//       setError('שגיאה בהעלאת הקובץ');
//     } finally {
//       setUploadLoading(false);
//       setUploadProgress(0);
//     }
//   };

//   const handleEditLecture = (lecture: UserFile) => {
//     setEditingLecture(lecture);
//     setUploadForm({
//       fileName: lecture.fileName,
//       categoryId: lecture.categoryId,
//       file: null
//     });
//     setShowEditModal(true);
//   };

//   const handleUpdateLecture = async () => {
//     if (!editingLecture) return;

//     try {
//       setUploadLoading(true);
      
//       const updateData: any = {
//         fileName: uploadForm.fileName,
//         categoryId: uploadForm.categoryId,
//         url: editingLecture.url,
//         status: editingLecture.status
//       };

//       if (uploadForm.file) {
//         console.log('📤 Uploading new file...');
        
//         const presignedResponse = await api.get('/UserFile/presigned-url', {
//           params: {
//             fileName: uploadForm.file.name,
//             contentType: uploadForm.file.type
//           }
//         });

//         const presignedUrl = presignedResponse.data.url;

//         await fetch(presignedUrl, {
//           method: 'PUT',
//           body: uploadForm.file,
//           headers: {
//             'Content-Type': uploadForm.file.type,
//           },
//         });

//         updateData.url = presignedUrl.split('?')[0];
//         updateData.fileType = uploadForm.file.type;
//       }

//       console.log('💾 Updating lecture:', updateData);

//       await api.put(`/UserFile/${editingLecture.id}`, updateData);
      
//       setShowEditModal(false);
//       setEditingLecture(null);
//       await fetchLectures();
//       console.log('✅ Lecture updated successfully');
//     } catch (err: any) {
//       console.error('❌ Error updating lecture:', err);
//       setError('שגיאה בעדכון ההרצאה');
//     } finally {
//       setUploadLoading(false);
//     }
//   };

//   const handleDeleteLecture = async (lectureId: number, fileName: string) => {
//     if (!window.confirm(`האם אתה בטוח שברצונך למחוק את ההרצאה "${fileName}"?`)) {
//       return;
//     }

//     try {
//       console.log('🗑️ Deleting lecture:', lectureId);
//       await api.delete(`/UserFile/${lectureId}`);
//       await fetchLectures();
//       console.log('✅ Lecture deleted successfully');
//     } catch (err: any) {
//       console.error('❌ Error deleting lecture:', err);
//       setError('שגיאה במחיקת ההרצאה');
//     }
//   };

//   // const viewSummary = async (summaryId: number) => {
//   //   try {
//   //     const response = await api.get(`/Summary/${summaryId}`);
//   //     setSelectedSummary(response.data);
//   //     setShowSummaryModal(true);
//   //   } catch (err) {
//   //     console.error('❌ Error fetching summary:', err);
//   //     setError('שגיאה בטעינת הסיכום');
//   //   }
//   // };
//   const viewSummary = async (lecture: UserFile) => {
//     try {
//       console.log('👁️ Viewing summary for lecture:', {
//         lectureId: lecture.id,
//         fileName: lecture.fileName,
//         summaryId: lecture.summaryId,
//         hasSummaryContent: !!lecture.summaryContent
//       });
  
//       if (lecture.summaryContent) {
//         // אם יש תוכן סיכום ישירות - השתמש בו
//         console.log('📋 Using direct summary content');
//         setSelectedSummary({
//           id: lecture.summaryId!,
//           content: lecture.summaryContent,
//           createdAt: new Date().toISOString(),
//           language: 'he',
//           fileId: lecture.id
//         });
//         setShowSummaryModal(true);
//       } else if (lecture.summaryId) {
//         // אחרת - בצע קריאה נפרדת
//         console.log('📡 Fetching summary from API');
//         const response = await api.get(`/Summary/${lecture.summaryId}`);
//         setSelectedSummary(response.data);
//         setShowSummaryModal(true);
//       } else {
//         console.log('❌ No summary available');
//         setError('לא נמצא סיכום עבור הרצאה זו');
//       }
//     } catch (err) {
//       console.error('❌ Error fetching summary:', err);
//       setError('שגיאה בטעינת הסיכום');
//     }
//   };

//   const generateSummary = async (lectureId: number) => {
//     try {
//       console.log('🧠 Generating summary for lecture:', lectureId);
//       await api.post(`/UserFile/${lectureId}/generate-summary`);
//       await fetchLectures();
//       console.log('✅ Summary generated successfully');
//     } catch (err: any) {
//       console.error('❌ Error generating summary:', err);
//       setError('שגיאה ביצירת הסיכום');
//     }
//   };

//   const downloadFile = (url: string, fileName: string) => {
//     if (url) {
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = fileName;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const downloadSummary = (summary: Summary, fileName: string) => {
//     const blob = new Blob([summary.content], { type: 'text/plain;charset=utf-8' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `סיכום-${fileName}.txt`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   };

//   // Utility functions
//   const getFileIcon = (fileType: string) => {
//     if (fileType.includes('video')) return '🎥';
//     if (fileType.includes('audio')) return '🎵';
//     if (fileType.includes('pdf')) return '📄';
//     return '📁';
//   };

//   const getStatusText = (status: number): string => {
//     switch (status) {
//       case 2: return 'הושלם';     // Completed
//       case 1: return 'בעיבוד';    // Processing  
//       case 3: return 'נכשל';      // Failed
//       case 0: 
//       default: return 'ממתין';    // Pending
//     }
//   };
//   const getStatusColor = (status: number): string => {
//     switch (status) {
//       case 2: return '#4caf50';   // Completed = ירוק
//       case 1: return '#ff9800';   // Processing = כתום
//       case 3: return '#f44336';   // Failed = אדום
//       case 0:
//       default: return '#666';     // Pending = אפור
//     }
//   };

//   const resetForm = () => {
//     setUploadForm({ fileName: '', categoryId: 1, file: null });
//     setEditingLecture(null);
//     setShowUploadModal(false);
//     setShowEditModal(false);
//     setError(null);
//   };

//   const getBackPath = () => filterType === 'lecturer' ? '/lecturers' : '/topics';
//   const getBackText = () => filterType === 'lecturer' ? 'מרצים' : 'נושאים';
//   const getTitle = () => filterType === 'lecturer' ? 
//     `הרצאות של ${filterName}` : 
//     `הרצאות בנושא ${filterName}`;

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('he-IL');
//   };

//   // Lecture Card Component - matching Home.css styling
//   const LectureCard: React.FC<{ lecture: UserFile }> = ({ lecture }) => (
//     <Card 
//       sx={{ 
//         height: '100%',
//         borderRadius: lecturesStyles.borderRadiusLg,
//         overflow: 'hidden',
//         boxShadow: lecturesStyles.shadowSm,
//         transition: lecturesStyles.transition,
//         border: `1px solid ${lecturesStyles.borderLight}`,
//         position: 'relative',
//         background: lecturesStyles.white,
//         '&:hover': {
//           transform: 'translateY(-8px)',
//           boxShadow: lecturesStyles.shadowLg,
//         },
//       }}
//     >
//       {/* Card Image */}
//       <Box
//         sx={{
//           position: 'relative',
//           height: '200px',
//           overflow: 'hidden',
//           cursor: 'pointer',
//           background: `linear-gradient(135deg, 
//             rgba(33, 150, 243, 0.1), 
//             rgba(156, 39, 176, 0.1)
//           )`,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//         onClick={() => lecture.url && downloadFile(lecture.url, lecture.fileName)}
//       >
//         <Box
//           sx={{
//             fontSize: '48px',
//             opacity: 0.8,
//             color: lecturesStyles.white,
//             background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryPurple})`,
//             width: '80px',
//             height: '80px',
//             borderRadius: '50%',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//           }}
//         >
//           {getFileIcon(lecture.fileType)}
//         </Box>
        
//         {/* Play Overlay */}
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             background: 'rgba(0, 0, 0, 0.3)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             opacity: 0,
//             transition: lecturesStyles.transition,
//             '.MuiCard-root:hover &': {
//               opacity: 1,
//             },
//           }}
//         >
//           <Box
//             sx={{
//               width: '60px',
//               height: '60px',
//               background: lecturesStyles.white,
//               borderRadius: '50%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: '20px',
//               color: lecturesStyles.primaryBlue,
//               boxShadow: lecturesStyles.shadowMd,
//               transform: 'scale(0.8)',
//               transition: lecturesStyles.transition,
//               '.MuiCard-root:hover &': {
//                 transform: 'scale(1)',
//               },
//             }}
//           >
//             <PlayArrowIcon />
//           </Box>
//         </Box>
//       </Box>
      
//       <CardContent sx={{ padding: '20px' }}>
//         {/* Card Header */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
//           <Chip
//             label={filterType === 'lecturer' ? lecture.categoryName : lecture.userName}
//             size="small"
//             sx={{
//               background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryPurple})`,
//               color: lecturesStyles.white,
//               borderRadius: '20px',
//               fontSize: '12px',
//               fontWeight: 600,
//               textTransform: 'uppercase',
//               letterSpacing: '0.5px',
//             }}
//           />
          
//           {/* Status Chip */}
//           <Chip
//             icon={
//               lecture.status === 'Completed' ? <CheckCircleIcon /> :
//               lecture.status === 'Processing' ? <CircularProgress size={16} /> :
//               <CloseIcon />
//             }
//             label={
//               lecture.status === 'Completed' ? 'הושלם' :
//               lecture.status === 'Processing' ? 'בעיבוד' :
//               lecture.status === 'Failed' ? 'נכשל' : 'ממתין'
//             }
//             size="small"
//             sx={{
//               backgroundColor: getStatusColor(lecture.status),
//               color: 'white',
//               fontWeight: 600,
//             }}
//           />
//         </Box>
        
//         {/* Card Title */}
//         <Typography 
//           variant="h6" 
//           component="h3"
//           sx={{ 
//             fontSize: '18px',
//             fontWeight: 700,
//             color: lecturesStyles.textPrimary,
//             lineHeight: 1.4,
//             marginBottom: '16px',
//             cursor: 'pointer',
//             transition: lecturesStyles.transition,
//             '&:hover': {
//               color: lecturesStyles.primaryBlue,
//             },
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             display: '-webkit-box',
//             WebkitLineClamp: 2,
//             WebkitBoxOrient: 'vertical',
//           }}
//           onClick={() => lecture.url && downloadFile(lecture.url, lecture.fileName)}
//         >
//           {lecture.fileName}
//         </Typography>
        
//         {/* Card Info */}
//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Typography
//               sx={{
//                 fontSize: '14px',
//                 color: lecturesStyles.textSecondary,
//                 fontWeight: 500,
//               }}
//             >
//               🎤 {filterType === 'category' ? lecture.userName : lecture.categoryName}
//             </Typography>
//           </Box>
          
//           <Box sx={{ display: 'flex', gap: '16px', fontSize: '13px', color: lecturesStyles.textMuted }}>
//             <span>📅 {formatDate(lecture.uploadDate)}</span>
//           </Box>
//         </Box>

//         {/* Action Buttons Row */}
//         <Box sx={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
//           {lecture.url && (
//             <IconButton
//               size="small"
//               onClick={() => downloadFile(lecture.url!, lecture.fileName)}
//               sx={{
//                 width: '36px',
//                 height: '36px',
//                 background: lecturesStyles.bgLight,
//                 transition: lecturesStyles.transition,
//                 '&:hover': {
//                   background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryIndigo})`,
//                   color: lecturesStyles.white,
//                   transform: 'scale(1.1)',
//                 },
//               }}
//               title="הורד קובץ"
//             >
//               <DownloadIcon fontSize="small" />
//             </IconButton>
//           )}
          
//           {lecture.summaryId ? (
//             <IconButton
//               size="small"
//               // onClick={() => viewSummary(lecture.summaryId!)}
//                onClick={() => viewSummary(lecture)}

//               sx={{
//                 width: '36px',
//                 height: '36px',
//                 background: lecturesStyles.bgLight,
//                 transition: lecturesStyles.transition,
//                 '&:hover': {
//                   background: `linear-gradient(135deg, ${lecturesStyles.primaryIndigo}, ${lecturesStyles.primaryPurple})`,
//                   color: lecturesStyles.white,
//                   transform: 'scale(1.1)',
//                 },
//               }}
//               title="צפה בסיכום"
//             >
//               <VisibilityIcon fontSize="small" />
//             </IconButton>
//           ) : lecture.status === 'Completed' ? (
//             <IconButton
//               size="small"
//               onClick={() => generateSummary(lecture.id)}
//               sx={{
//                 width: '36px',
//                 height: '36px',
//                 background: lecturesStyles.bgLight,
//                 transition: lecturesStyles.transition,
//                 '&:hover': {
//                   background: `linear-gradient(135deg, ${lecturesStyles.primaryPurple}, #7b1fa2)`,
//                   color: lecturesStyles.white,
//                   transform: 'scale(1.1)',
//                 },
//               }}
//               title="צור סיכום"
//             >
//               <AssignmentIcon fontSize="small" />
//             </IconButton>
//           ) : null}

//           {/* Admin Controls */}
//           {hasPermissions && (
//             <>
//               <IconButton
//                 size="small"
//                 onClick={() => handleEditLecture(lecture)}
//                 sx={{
//                   width: '36px',
//                   height: '36px',
//                   background: lecturesStyles.bgLight,
//                   transition: lecturesStyles.transition,
//                   '&:hover': {
//                     background: '#f57c00',
//                     color: lecturesStyles.white,
//                     transform: 'scale(1.1)',
//                   },
//                 }}
//                 title="ערוך"
//               >
//                 <EditIcon fontSize="small" />
//               </IconButton>
              
//               <IconButton
//                 size="small"
//                 onClick={() => handleDeleteLecture(lecture.id, lecture.fileName)}
//                 sx={{
//                   width: '36px',
//                   height: '36px',
//                   background: lecturesStyles.bgLight,
//                   transition: lecturesStyles.transition,
//                   '&:hover': {
//                     background: '#f44336',
//                     color: lecturesStyles.white,
//                     transform: 'scale(1.1)',
//                   },
//                 }}
//                 title="מחק"
//               >
//                 <DeleteIcon fontSize="small" />
//               </IconButton>
//             </>
//           )}
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <div style={{ 
//       minHeight: '100vh', 
//       backgroundColor: lecturesStyles.bgLighter,
//     }}>
//       <Header currentPage={filterType === 'lecturer' ? 'lecturers' : 'topics'} />
      
//       {/* Hero Section */}
//       <Box
//         sx={{
//           backgroundColor: lecturesStyles.white,
//           padding: '80px 0 60px',
//           paddingTop: '100px',
//         }}
//       >
//         <Container maxWidth="lg">
//           <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
//             <Button
//               startIcon={<ArrowBackIcon />}
//               onClick={() => navigate(getBackPath())}
//               sx={{
//                 marginRight: 2,
//                 color: lecturesStyles.textSecondary,
//                 fontSize: '16px',
//                 fontWeight: 600,
//                 padding: '12px 20px',
//                 borderRadius: lecturesStyles.borderRadius,
//                 transition: lecturesStyles.transition,
//                 '&:hover': { 
//                   backgroundColor: lecturesStyles.bgLight,
//                   boxShadow: lecturesStyles.shadowSm,
//                   transform: 'translateY(-2px)',
//                 }
//               }}
//             >
//               חזור ל{getBackText()}
//             </Button>
//           </Box>

//           <Box sx={{ textAlign: 'center' }}>
//             <Typography 
//               variant="h2" 
//               component="h1" 
//               sx={{ 
//                 fontSize: 'clamp(36px, 5vw, 56px)',
//                 fontWeight: 900,
//                 background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryIndigo}, ${lecturesStyles.primaryPurple})`,
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 backgroundClip: 'text',
//                 lineHeight: 1.2,
//                 marginBottom: '24px',
//                 letterSpacing: '-1px',
//               }}
//             >
//               {getTitle()}
//             </Typography>
//             <Typography 
//               variant="h6" 
//               sx={{ 
//                 fontSize: 'clamp(18px, 2.5vw, 24px)',
//                 color: lecturesStyles.textSecondary,
//                 lineHeight: 1.6,
//                 maxWidth: '600px',
//                 margin: '0 auto 40px',
//                 fontWeight: 500,
//               }}
//             >
//               {filteredLectures.length} הרצאות איכותיות זמינות לצפייה
//             </Typography>

//             {/* Search Section */}
//             <Box sx={{ maxWidth: '600px', margin: '0 auto' }}>
//               <Box
//                 sx={{
//                   background: lecturesStyles.white,
//                   borderRadius: lecturesStyles.borderRadiusLg,
//                   padding: '20px',
//                   boxShadow: lecturesStyles.shadowMd,
//                   border: `1px solid ${lecturesStyles.borderLight}`,
//                 }}
//               >
//                 <Box sx={{ position: 'relative', display: 'flex', gap: '12px' }}>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     placeholder="חפש הרצאות, נושאים או מרצים..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <SearchIcon sx={{ color: lecturesStyles.textMuted }} />
//                         </InputAdornment>
//                       ),
//                     }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         padding: '14px 16px',
//                         border: `2px solid ${lecturesStyles.borderLight}`,
//                         borderRadius: lecturesStyles.borderRadius,
//                         fontSize: '16px',
//                         transition: lecturesStyles.transition,
//                         background: lecturesStyles.white,
//                         '&:hover fieldset': {
//                           borderColor: lecturesStyles.primaryBlue,
//                         },
//                         '&.Mui-focused fieldset': {
//                           borderColor: lecturesStyles.primaryBlue,
//                           boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
//                         },
//                       },
//                       '& .MuiOutlinedInput-input': {
//                         padding: 0,
//                       },
//                       '& .MuiOutlinedInput-input::placeholder': {
//                         color: lecturesStyles.textMuted,
//                       },
//                     }}
//                   />
                  
//                   {hasPermissions && (
//                     <Button
//                       variant="contained"
//                       startIcon={<AddIcon />}
//                       onClick={() => setShowUploadModal(true)}
//                       sx={{
//                         padding: '14px 20px',
//                         background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryPurple})`,
//                         borderRadius: lecturesStyles.borderRadius,
//                         fontSize: '16px',
//                         fontWeight: 700,
//                         transition: lecturesStyles.transition,
//                         whiteSpace: 'nowrap',
//                         '&:hover': {
//                           transform: 'translateY(-2px)',
//                           boxShadow: lecturesStyles.shadowMd,
//                         },
//                       }}
//                     >
//                       הוסף הרצאה
//                     </Button>
//                   )}
//                 </Box>
//               </Box>
//             </Box>
//           </Box>
//         </Container>
//       </Box>

//       {/* Main Content */}
//       <Box sx={{ 
//         padding: '60px 0', 
//         backgroundColor: lecturesStyles.bgLighter,
//       }}>
//         <Container maxWidth="lg">
//           {/* Error Alert */}
//           {error && (
//             <Alert 
//               severity="error" 
//               sx={{ 
//                 marginBottom: 3, 
//                 borderRadius: lecturesStyles.borderRadius,
//                 border: `1px solid #f44336`,
//                 backgroundColor: '#ffebee',
//               }}
//               onClose={() => setError(null)}
//             >
//               {error}
//             </Alert>
//           )}

//           {/* Loading */}
//           {loading ? (
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'center', 
//               alignItems: 'center', 
//               minHeight: '300px',
//               flexDirection: 'column',
//               gap: 2,
//             }}>
//               <CircularProgress 
//                 size={60} 
//                 sx={{ color: lecturesStyles.primaryBlue }}
//               />
//               <Typography 
//                 variant="h6" 
//                 sx={{ 
//                   color: lecturesStyles.textPrimary,
//                   fontWeight: 600,
//                 }}
//               >
//                 טוען הרצאות...
//               </Typography>
//             </Box>
//           ) : (
//             /* Lectures Grid */
//             <Box>
//               {filteredLectures.length === 0 ? (
//                 <Card 
//                   sx={{ 
//                     padding: 4, 
//                     textAlign: 'center', 
//                     borderRadius: lecturesStyles.borderRadiusLg, 
//                     border: `2px dashed ${lecturesStyles.borderLight}`,
//                     background: lecturesStyles.white,
//                   }}
//                 >
//                   <Box sx={{ fontSize: '64px', marginBottom: 2, opacity: 0.3 }}>
//                     🎓
//                   </Box>
//                   <Typography 
//                     variant="h6" 
//                     sx={{ 
//                       color: lecturesStyles.textSecondary, 
//                       marginBottom: 2,
//                       fontWeight: 600,
//                     }}
//                   >
//                     {searchTerm ? 'לא נמצאו תוצאות' : 
//                      filterType === 'lecturer' ? 'אין הרצאות' : 'אין הרצאות בקטגוריה זו'}
//                   </Typography>
//                   <Typography 
//                     variant="body2" 
//                     sx={{ color: lecturesStyles.textMuted }}
//                   >
//                     {searchTerm ? 'נסה לשנות את מילות החיפוש' : 
//                      filterType === 'lecturer' ? 'המרצה עדיין לא העלה הרצאות' :
//                      'עדיין לא הועלו הרצאות לקטגוריה זו'}
//                   </Typography>
//                 </Card>
//               ) : (
//                 <Box
//                   sx={{
//                     display: 'grid',
//                     gridTemplateColumns: {
//                       xs: '1fr',
//                       sm: 'repeat(2, 1fr)',
//                       md: 'repeat(3, 1fr)',
//                       lg: 'repeat(3, 1fr)',
//                       xl: 'repeat(3, 1fr)'
//                     },
//                     gap: '24px',
//                   }}
//                 >
//                   {filteredLectures.map((lecture) => (
//                     <LectureCard key={lecture.id} lecture={lecture} />
//                   ))}
//                 </Box>
//               )}
//             </Box>
//           )}
//         </Container>
//       </Box>

//       {/* Upload Modal */}
//       <Dialog 
//         open={showUploadModal} 
//         onClose={resetForm}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{ 
//           sx: { 
//             borderRadius: '24px', 
//             padding: 2,
//             background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
//             minHeight: '400px',
//           } 
//         }}
//       >
//         <DialogTitle sx={{ textAlign: 'center', paddingBottom: 1 }}>
//           <Typography
//             sx={{ 
//               fontWeight: 900,
//               fontSize: '1.5rem',
//               background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryIndigo}, ${lecturesStyles.primaryPurple})`,
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               backgroundClip: 'text',
//             }}
//           >
//             העלאת הרצאה חדשה
//           </Typography>
//         </DialogTitle>
        
//         <DialogContent sx={{ padding: '32px' }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//             <Box>
//               <Typography variant="body1" sx={{ marginBottom: 2, color: lecturesStyles.textSecondary, fontWeight: 600 }}>
//                 בחר קובץ להעלאה
//               </Typography>
//               <Box
//                 component="input"
//                 type="file"
//                 accept="audio/*,video/*,.pdf,.doc,.docx"
//                 onChange={(e: any) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
//                 sx={{ 
//                   width: '100%', 
//                   padding: '16px', 
//                   border: '2px dashed #ddd', 
//                   borderRadius: '12px',
//                   fontSize: '14px',
//                   cursor: 'pointer',
//                   backgroundColor: lecturesStyles.bgLight,
//                   transition: lecturesStyles.transition,
//                   boxSizing: 'border-box',
//                   '&:hover': {
//                     borderColor: lecturesStyles.primaryBlue,
//                     backgroundColor: lecturesStyles.white,
//                   },
//                 }}
//               />
//             </Box>
            
//             <Box>
//               <TextField
//                 fullWidth
//                 label="שם ההרצאה"
//                 value={uploadForm.fileName}
//                 onChange={(e) => setUploadForm({...uploadForm, fileName: e.target.value})}
//                 placeholder="שם מותאם אישית (אופציונלי)"
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: '12px',
//                     backgroundColor: lecturesStyles.bgLight,
//                     padding: '4px',
//                     '&:hover fieldset': { borderColor: lecturesStyles.primaryBlue },
//                     '&.Mui-focused fieldset': { borderColor: lecturesStyles.primaryBlue },
//                     '&.Mui-focused': { backgroundColor: lecturesStyles.white },
//                   },
//                   '& .MuiInputLabel-root': {
//                     fontWeight: 600,
//                   },
//                   '& .MuiOutlinedInput-input': {
//                     padding: '16px 14px',
//                   },
//                 }}
//               />
//             </Box>
            
//             {filterType === 'lecturer' && (
//               <Box>
//                 <FormControl fullWidth>
//                   <InputLabel sx={{ fontWeight: 600 }}>קטגוריה</InputLabel>
//                   <Select
//                     value={uploadForm.categoryId}
//                     onChange={(e) => setUploadForm({...uploadForm, categoryId: e.target.value as number})}
//                     label="קטגוריה"
//                     sx={{ 
//                       borderRadius: '12px',
//                       backgroundColor: lecturesStyles.bgLight,
//                       '& .MuiSelect-select': {
//                         padding: '16px 14px',
//                       },
//                       '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: lecturesStyles.primaryBlue },
//                       '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: lecturesStyles.primaryBlue },
//                       '&.Mui-focused': { backgroundColor: lecturesStyles.white },
//                     }}
//                   >
//                     {categories.map(category => (
//                       <MenuItem key={category.id} value={category.id}>
//                         {category.name}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Box>
//             )}
            
//             {uploadLoading && (
//               <Box 
//                 sx={{ 
//                   width: '100%',
//                   padding: '24px',
//                   backgroundColor: lecturesStyles.bgLight,
//                   borderRadius: '12px',
//                   border: `1px solid ${lecturesStyles.borderLight}`,
//                 }}
//               >
//                 <Typography 
//                   variant="body1" 
//                   sx={{ 
//                     marginBottom: 3, 
//                     fontWeight: 600,
//                     color: lecturesStyles.textPrimary,
//                   }}
//                 >
//                   מעלה קובץ... {uploadProgress}%
//                 </Typography>
//                 <LinearProgress 
//                   variant="determinate" 
//                   value={uploadProgress}
//                   sx={{ 
//                     borderRadius: '8px', 
//                     height: '12px',
//                     backgroundColor: '#e0e0e0',
//                     '& .MuiLinearProgress-bar': {
//                       background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryPurple})`,
//                     },
//                   }}
//                 />
//               </Box>
//             )}
//           </Box>
//         </DialogContent>
        
//         <DialogActions sx={{ padding: 3, gap: 1 }}>
//           <Button 
//             onClick={resetForm} 
//             disabled={uploadLoading}
//             sx={{
//               borderRadius: '12px',
//               color: lecturesStyles.textSecondary,
//               '&:hover': { backgroundColor: lecturesStyles.bgLight },
//             }}
//           >
//             ביטול
//           </Button>
//           <Button 
//             onClick={handleFileUpload}
//             variant="contained"
//             disabled={uploadLoading || !uploadForm.file}
//             startIcon={uploadLoading ? <CircularProgress size={20} /> : <UploadIcon />}
//             sx={{
//               background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryIndigo}, ${lecturesStyles.primaryPurple})`,
//               borderRadius: '12px',
//               minWidth: '120px',
//               fontWeight: 700,
//               '&:hover': {
//                 background: 'linear-gradient(135deg, #1976d2, #5e35b1, #7b1fa2)',
//                 transform: 'translateY(-2px)',
//                 boxShadow: lecturesStyles.shadowMd,
//               },
//             }}
//           >
//             {uploadLoading ? 'מעלה...' : 'העלה הרצאה'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Edit Modal */}
//       <Dialog 
//         open={showEditModal} 
//         onClose={resetForm}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{ 
//           sx: { 
//             borderRadius: '24px', 
//             padding: 2,
//             background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
//             minHeight: '400px',
//           } 
//         }}
//       >
//         <DialogTitle sx={{ textAlign: 'center', paddingBottom: 1 }}>
//           <Typography
//             sx={{ 
//               fontWeight: 900,
//               fontSize: '1.5rem',
//               background: 'linear-gradient(135deg, #f57c00, #ff9800)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               backgroundClip: 'text',
//             }}
//           >
//             עריכת הרצאה
//           </Typography>
//         </DialogTitle>
        
//         <DialogContent sx={{ padding: '32px' }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
//             <Box>
//               <TextField
//                 fullWidth
//                 label="שם ההרצאה"
//                 value={uploadForm.fileName}
//                 onChange={(e) => setUploadForm({...uploadForm, fileName: e.target.value})}
//                 required
//                 sx={{
//                   '& .MuiOutlinedInput-root': {
//                     borderRadius: '12px',
//                     backgroundColor: lecturesStyles.bgLight,
//                     padding: '4px',
//                     '&:hover fieldset': { borderColor: '#f57c00' },
//                     '&.Mui-focused fieldset': { borderColor: '#f57c00' },
//                     '&.Mui-focused': { backgroundColor: lecturesStyles.white },
//                   },
//                   '& .MuiInputLabel-root': {
//                     fontWeight: 600,
//                   },
//                   '& .MuiOutlinedInput-input': {
//                     padding: '16px 14px',
//                   },
//                 }}
//               />
//             </Box>
            
//             <Box>
//               <Typography variant="body1" sx={{ marginBottom: 2, color: lecturesStyles.textSecondary, fontWeight: 600 }}>
//                 עדכן קובץ (אופציונלי)
//               </Typography>
//               <Box
//                 component="input"
//                 type="file"
//                 accept="audio/*,video/*,.pdf,.doc,.docx"
//                 onChange={(e: any) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
//                 sx={{ 
//                   width: '100%', 
//                   padding: '16px', 
//                   border: '2px dashed #ddd', 
//                   borderRadius: '12px',
//                   fontSize: '14px',
//                   cursor: 'pointer',
//                   backgroundColor: lecturesStyles.bgLight,
//                   transition: lecturesStyles.transition,
//                   boxSizing: 'border-box',
//                   '&:hover': {
//                     borderColor: '#f57c00',
//                     backgroundColor: lecturesStyles.white,
//                   },
//                 }}
//               />
//               <Typography 
//                 variant="body2" 
//                 sx={{ 
//                   marginTop: 2, 
//                   color: lecturesStyles.textMuted,
//                   fontStyle: 'italic',
//                   fontSize: '14px',
//                 }}
//               >
//                 השאר ריק כדי לשמור על הקובץ הקיים
//               </Typography>
//             </Box>
            
//             <Box>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ fontWeight: 600 }}>קטגוריה</InputLabel>
//                 <Select
//                   value={uploadForm.categoryId}
//                   onChange={(e) => setUploadForm({...uploadForm, categoryId: e.target.value as number})}
//                   label="קטגוריה"
//                   sx={{
//                     borderRadius: '12px',
//                     backgroundColor: lecturesStyles.bgLight,
//                     '& .MuiSelect-select': {
//                       padding: '16px 14px',
//                     },
//                     '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#f57c00' },
//                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f57c00' },
//                     '&.Mui-focused': { backgroundColor: lecturesStyles.white },
//                   }}
//                 >
//                   {categories.map(category => (
//                     <MenuItem key={category.id} value={category.id}>
//                       {category.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>
//             </Box>
//           </Box>
//         </DialogContent>
        
//         <DialogActions sx={{ padding: 3, gap: 1 }}>
//           <Button 
//             onClick={resetForm} 
//             disabled={uploadLoading}
//             sx={{
//               borderRadius: '12px',
//               color: lecturesStyles.textSecondary,
//               '&:hover': { backgroundColor: lecturesStyles.bgLight },
//             }}
//           >
//             ביטול
//           </Button>
//           <Button 
//             onClick={handleUpdateLecture}
//             variant="contained"
//             disabled={uploadLoading || !uploadForm.fileName.trim()}
//             startIcon={uploadLoading ? <CircularProgress size={20} /> : <EditIcon />}
//             sx={{
//               background: 'linear-gradient(135deg, #f57c00, #ff9800)',
//               borderRadius: '12px',
//               minWidth: '120px',
//               fontWeight: 700,
//               '&:hover': { 
//                 background: 'linear-gradient(135deg, #ef6c00, #f57c00)',
//                 transform: 'translateY(-2px)',
//                 boxShadow: lecturesStyles.shadowMd,
//               },
//             }}
//           >
//             {uploadLoading ? 'מעדכן...' : 'עדכן הרצאה'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Summary Modal */}
//       <Dialog 
//         open={showSummaryModal} 
//         onClose={() => setShowSummaryModal(false)}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{ 
//           sx: { 
//             borderRadius: '24px', 
//             padding: 2, 
//             maxHeight: '80vh',
//             background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
//           } 
//         }}
//       >
//         <DialogTitle sx={{ textAlign: 'center', paddingBottom: 1 }}>
//           <Typography
//             sx={{ 
//               fontWeight: 900,
//               fontSize: '1.5rem',
//               background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               backgroundClip: 'text',
//             }}
//           >
//             סיכום ההרצאה
//           </Typography>
//         </DialogTitle>
        
//         <DialogContent>
//           {selectedSummary && (
//             <Box>
//               <Card sx={{ 
//                 backgroundColor: lecturesStyles.bgLight, 
//                 borderRadius: '12px', 
//                 padding: 3,
//                 marginBottom: 2,
//                 maxHeight: '400px',
//                 overflowY: 'auto',
//                 border: `1px solid ${lecturesStyles.borderLight}`,
//               }}>
//                 <Typography 
//                   variant="body1" 
//                   sx={{ 
//                     whiteSpace: 'pre-wrap', 
//                     lineHeight: 1.6,
//                     fontFamily: 'inherit',
//                     color: lecturesStyles.textPrimary,
//                   }}
//                 >
//                   {selectedSummary.content}
//                 </Typography>
//               </Card>
              
//               <Divider sx={{ marginY: 2 }} />
              
//               <Typography 
//                 variant="caption" 
//                 sx={{ 
//                   color: lecturesStyles.textSecondary,
//                   fontSize: '13px',
//                 }}
//               >
//                 נוצר ב: {new Date(selectedSummary.createdAt).toLocaleDateString('he-IL')} | 
//                 שפה: {selectedSummary.language === 'he' ? 'עברית' : selectedSummary.language}
//               </Typography>
//             </Box>
//           )}
//         </DialogContent>
        
//         <DialogActions sx={{ padding: 3, gap: 1 }}>
//           <Button 
//             onClick={() => setShowSummaryModal(false)}
//             sx={{ 
//               borderRadius: '12px',
//               color: lecturesStyles.textSecondary,
//               '&:hover': { backgroundColor: lecturesStyles.bgLight },
//             }}
//           >
//             סגור
//           </Button>
//           {selectedSummary && (
//             <Button
//               variant="contained"
//               startIcon={<DownloadIcon />}
//               onClick={() => {
//                 const lecture = lectures.find(l => l.summaryId === selectedSummary.id);
//                 downloadSummary(selectedSummary, lecture?.fileName || 'הרצאה');
//               }}
//               sx={{
//                 background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
//                 borderRadius: '12px',
//                 fontWeight: 700,
//                 '&:hover': { 
//                   background: 'linear-gradient(135deg, #388e3c, #4caf50)',
//                   transform: 'translateY(-2px)',
//                   boxShadow: lecturesStyles.shadowMd,
//                 },
//               }}
//             >
//               הורד סיכום
//             </Button>
//           )}
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };



// export default LecturesList;



import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Container,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Divider,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  FilePresent as FilePresentIcon,
  Search as SearchIcon,
  ArrowBack as ArrowBackIcon,
  Upload as UploadIcon,
  Close as CloseIcon,
  VideoFile as VideoFileIcon,
  AudioFile as AudioFileIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import Header from './Header';
import api from '../services/Api';

// CSS Variables - matching Home.css
const lecturesStyles = {
  primaryBlue: '#2196f3',
  primaryIndigo: '#6366f1',
  primaryPurple: '#9c27b0',
  textPrimary: '#1a1a1a',
  textSecondary: '#666',
  textMuted: '#999',
  borderLight: '#e5e5e5',
  bgLight: '#f8f9fa',
  bgLighter: '#fafbfc',
  white: '#ffffff',
  shadowSm: '0 2px 8px rgba(0, 0, 0, 0.06)',
  shadowMd: '0 4px 16px rgba(0, 0, 0, 0.08)',
  shadowLg: '0 8px 32px rgba(0, 0, 0, 0.12)',
  transition: 'all 0.3s ease',
  borderRadius: '12px',
  borderRadiusLg: '16px'
};

// File Status Enum - תואם לשרת
enum FileStatus {
  Pending = 0,
  Processing = 1,
  Completed = 2,
  Failed = 3
}

// Types based on the API controllers
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

const LecturesList: React.FC = () => {
  const { lecturerId, categoryId } = useParams<{ lecturerId: string; categoryId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine filter type from URL
  const filterType: 'lecturer' | 'category' = lecturerId ? 'lecturer' : 'category';
  const filterId = lecturerId ? parseInt(lecturerId) : categoryId ? parseInt(categoryId) : null;
  const filterName = location.state?.lecturerName || location.state?.categoryName || 
                    (filterType === 'lecturer' ? 'מרצה' : 'קטגוריה');

  // States
  const [lectures, setLectures] = useState<UserFile[]>([]);
  const [filteredLectures, setFilteredLectures] = useState<UserFile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState<UserFile | null>(null);
  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null);
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    fileName: '',
    categoryId: 1,
    file: null as File | null
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Current user info
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<number>(0);

  // Validate filterId
  if (!filterId) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: lecturesStyles.bgLighter }}>
        <Header currentPage={filterType === 'lecturer' ? 'lecturers' : 'topics'} />
        <Container maxWidth="lg" sx={{ paddingTop: '100px', textAlign: 'center' }}>
          <Typography variant="h4" color="error" gutterBottom>
            שגיאה: מזהה {filterType === 'lecturer' ? 'מרצה' : 'קטגוריה'} לא תקין
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(filterType === 'lecturer' ? '/lecturers' : '/topics')}
            startIcon={<ArrowBackIcon />}
            sx={{ marginTop: 2 }}
          >
            חזור ל{filterType === 'lecturer' ? 'מרצים' : 'נושאים'}
          </Button>
        </Container>
      </div>
    );
  }

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

  const isCompleted = (status: number): boolean => {
    return status === FileStatus.Completed;
  };

  // Get current user info from token
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('🔍 Checking token exists:', !!token);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('📋 Full Token payload:', JSON.stringify(payload, null, 2));
        
        // Handle Microsoft claims format
        const role = payload.role || 
                    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 
                    payload.Role || '';
                    
        const userId = parseInt(payload.sub) || 
                      parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']) || 
                      parseInt(payload.nameid) || 
                      parseInt(payload.id) || 0;
        
        setCurrentUserRole(role);
        setCurrentUserId(userId);
        
        console.log('✅ User info extracted:', {
          role: role,
          userId: userId,
          filterId: filterId,
          filterType: filterType,
          allPayloadKeys: Object.keys(payload)
        });
      } catch (error) {
        console.error('❌ Error parsing token:', error);
      }
    }
  }, [filterId, filterType]);

  // Check permissions
  const canUpload = currentUserRole === 'lecturer' || currentUserRole === 'Admin';
  const isCurrentUserLecturer = filterType === 'lecturer' && currentUserId === filterId;
  const hasPermissions = (canUpload && isCurrentUserLecturer) || 
                        (filterType === 'category' && currentUserRole === 'Admin');

  // Fetch data
  useEffect(() => {
    fetchLectures();
    fetchCategories();
  }, [filterId, filterType]);

  // Filter lectures
  useEffect(() => {
    const filtered = lectures.filter(lecture => {
      const matchesSearch = lecture.fileName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
    setFilteredLectures(filtered);
  }, [searchTerm, lectures]);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      console.log(`📡 Fetching lectures for ${filterType}:`, filterId);
      console.log(`🏷️ Filter name: "${filterName}"`);
      
      const response = await api.get('/UserFile');
      console.log('📊 All files from API:', response.data);

      // בדיקה מפורטת של הנתונים
      response.data.forEach((file: any) => {
        console.log(`📄 File ${file.id}: "${file.fileName}"`, {
          status: file.status,
          statusText: getStatusText(file.status),
          summaryId: file.summaryId,
          summaryContent: file.summaryContent ? 'EXISTS' : 'NULL',
          summaryContentLength: file.summaryContent?.length || 0
        });

        // בדיקה מיוחדת לחוסר עקביות
        if (file.summaryId && file.status !== FileStatus.Completed) {
          console.log('⚠️ INCONSISTENCY: File has summaryId but status is not Completed!', {
            fileId: file.id,
            fileName: file.fileName,
            status: file.status,
            expectedStatus: FileStatus.Completed,
            summaryId: file.summaryId
          });
        }
      });

      // בדיקה מיוחדת לקטגוריות
      if (filterType === 'category') {
        const allCategories = response.data.map((file: any) => ({
          categoryId: file.categoryId,
          categoryName: file.categoryName
        }));
        console.log('🔍 All unique categories in files:', [...new Set(allCategories.map(c => `${c.categoryId}: ${c.categoryName}`))]);
      }

      const userLectures = response.data.filter((file: any) => {
        const matches = filterType === 'lecturer' ? 
          file.userId === filterId : 
          file.categoryId === filterId;
          
        console.log('🔍 Checking file:', {
          fileName: file.fileName,
          userId: file.userId,
          categoryId: file.categoryId,
          categoryName: file.categoryName,
          userName: file.userName,
          filterType: filterType,
          filterId: filterId,
          matches: matches
        });
        
        return matches;
      });
      
      console.log(`📚 Filtered lectures for ${filterType}`, filterId, ':', userLectures);
      setLectures(userLectures);
      setError(null);
    } catch (err: any) {
      console.error('❌ Error fetching lectures:', err);
      setError('שגיאה בטעינת ההרצאות');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/Category');
      setCategories(response.data);
    } catch (err) {
      console.error('⚠️ Error fetching categories:', err);
      setCategories([
        { id: 1, name: 'כללי' },
        { id: 2, name: 'מתמטיקה' },
        { id: 3, name: 'מדעי המחשב' },
        { id: 4, name: 'פיזיקה' }
      ]);
    }
  };

  // File operations
  const handleFileUpload = async () => {
    if (!uploadForm.file) {
      setError('אנא בחר קובץ להעלאה');
      return;
    }

    try {
      setUploadLoading(true);
      setUploadProgress(10);
      console.log('📤 Starting upload process...');

      const presignedResponse = await api.get('/UserFile/presigned-url', {
        params: {
          fileName: uploadForm.file.name,
          contentType: uploadForm.file.type
        }
      });

      setUploadProgress(30);
      const presignedUrl = presignedResponse.data.url;

      console.log('🔗 Got presigned URL, uploading to S3...');

      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: uploadForm.file,
        headers: {
          'Content-Type': uploadForm.file.type,
        },
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setUploadProgress(80);

      const fileData = {
        fileName: uploadForm.fileName || uploadForm.file.name,
        fileType: uploadForm.file.type,
        url: presignedUrl.split('?')[0],
        userId: filterType === 'lecturer' ? filterId : currentUserId,
        categoryId: filterType === 'category' ? filterId : uploadForm.categoryId
      };

      console.log('💾 Creating file record:', fileData);
      console.log('🔧 Upload context:', {
        filterType,
        filterId,
        filterName,
        currentUserId,
        selectedCategoryId: uploadForm.categoryId
      });

      await api.post('/UserFile', fileData);
      
      setUploadProgress(100);

      // Reset form and refresh
      setUploadForm({ fileName: '', categoryId: 1, file: null });
      setShowUploadModal(false);
      setUploadProgress(0);
      await fetchLectures();
      
      console.log('✅ Upload completed successfully');
    } catch (err: any) {
      console.error('❌ Error uploading file:', err);
      setError('שגיאה בהעלאת הקובץ');
    } finally {
      setUploadLoading(false);
      setUploadProgress(0);
    }
  };

  const handleEditLecture = (lecture: UserFile) => {
    setEditingLecture(lecture);
    setUploadForm({
      fileName: lecture.fileName,
      categoryId: lecture.categoryId,
      file: null
    });
    setShowEditModal(true);
  };

  const handleUpdateLecture = async () => {
    if (!editingLecture) return;

    try {
      setUploadLoading(true);
      
      const updateData: any = {
        fileName: uploadForm.fileName,
        categoryId: uploadForm.categoryId,
        url: editingLecture.url,
        status: editingLecture.status
      };

      if (uploadForm.file) {
        console.log('📤 Uploading new file...');
        
        const presignedResponse = await api.get('/UserFile/presigned-url', {
          params: {
            fileName: uploadForm.file.name,
            contentType: uploadForm.file.type
          }
        });

        const presignedUrl = presignedResponse.data.url;

        await fetch(presignedUrl, {
          method: 'PUT',
          body: uploadForm.file,
          headers: {
            'Content-Type': uploadForm.file.type,
          },
        });

        updateData.url = presignedUrl.split('?')[0];
        updateData.fileType = uploadForm.file.type;
      }

      console.log('💾 Updating lecture:', updateData);

      await api.put(`/UserFile/${editingLecture.id}`, updateData);
      
      setShowEditModal(false);
      setEditingLecture(null);
      await fetchLectures();
      console.log('✅ Lecture updated successfully');
    } catch (err: any) {
      console.error('❌ Error updating lecture:', err);
      setError('שגיאה בעדכון ההרצאה');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteLecture = async (lectureId: number, fileName: string) => {
    if (!window.confirm(`האם אתה בטוח שברצונך למחוק את ההרצאה "${fileName}"?`)) {
      return;
    }

    try {
      console.log('🗑️ Deleting lecture:', lectureId);
      await api.delete(`/UserFile/${lectureId}`);
      await fetchLectures();
      console.log('✅ Lecture deleted successfully');
    } catch (err: any) {
      console.error('❌ Error deleting lecture:', err);
      setError('שגיאה במחיקת ההרצאה');
    }
  };

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

  const generateSummary = async (lectureId: number) => {
    try {
      console.log('🧠 Generating summary for lecture:', lectureId);
      
      // עדכן מיידית את הסטטוס ל-Processing
      setLectures(prevLectures => 
        prevLectures.map(lecture => 
          lecture.id === lectureId 
            ? { ...lecture, status: FileStatus.Processing }
            : lecture
        )
      );
      
      const response = await api.post(`/UserFile/${lectureId}/generate-summary`);
      console.log('✅ Summary response:', response.data);
      
      // עדכן את הנתונים מהשרת
      await fetchLectures();
      
      console.log('✅ Summary generated successfully');
    } catch (err: any) {
      console.error('❌ Error generating summary:', err);
      setError('שגיאה ביצירת הסיכום');
      
      // אם נכשל, שנה לסטטוס Failed
      setLectures(prevLectures => 
        prevLectures.map(lecture => 
          lecture.id === lectureId 
            ? { ...lecture, status: FileStatus.Failed }
            : lecture
        )
      );
    }
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

  // Utility functions
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('pdf')) return '📄';
    return '📁';
  };

  const resetForm = () => {
    setUploadForm({ fileName: '', categoryId: 1, file: null });
    setEditingLecture(null);
    setShowUploadModal(false);
    setShowEditModal(false);
    setError(null);
  };

  const getBackPath = () => filterType === 'lecturer' ? '/lecturers' : '/topics';
  const getBackText = () => filterType === 'lecturer' ? 'מרצים' : 'נושאים';
  const getTitle = () => filterType === 'lecturer' ? 
    `הרצאות של ${filterName}` : 
    `הרצאות בנושא ${filterName}`;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL');
  };

  // Lecture Card Component - matching Home.css styling
  const LectureCard: React.FC<{ lecture: UserFile }> = ({ lecture }) => (
    <Card 
      sx={{ 
        height: '100%',
        borderRadius: lecturesStyles.borderRadiusLg,
        overflow: 'hidden',
        boxShadow: lecturesStyles.shadowSm,
        transition: lecturesStyles.transition,
        border: `1px solid ${lecturesStyles.borderLight}`,
        position: 'relative',
        background: lecturesStyles.white,
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: lecturesStyles.shadowLg,
        },
      }}
    >
      {/* Card Image */}
      <Box
        sx={{
          position: 'relative',
          height: '200px',
          overflow: 'hidden',
          cursor: 'pointer',
          background: `linear-gradient(135deg, 
            rgba(33, 150, 243, 0.1), 
            rgba(156, 39, 176, 0.1)
          )`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => lecture.url && downloadFile(lecture.url, lecture.fileName)}
      >
        <Box
          sx={{
            fontSize: '48px',
            opacity: 0.8,
            color: lecturesStyles.white,
            background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryPurple})`,
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {getFileIcon(lecture.fileType)}
        </Box>
        
        {/* Play Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: lecturesStyles.transition,
            '.MuiCard-root:hover &': {
              opacity: 1,
            },
          }}
        >
          <Box
            sx={{
              width: '60px',
              height: '60px',
              background: lecturesStyles.white,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: lecturesStyles.primaryBlue,
              boxShadow: lecturesStyles.shadowMd,
              transform: 'scale(0.8)',
              transition: lecturesStyles.transition,
              '.MuiCard-root:hover &': {
                transform: 'scale(1)',
              },
            }}
          >
            <PlayArrowIcon />
          </Box>
        </Box>
      </Box>
      
      <CardContent sx={{ padding: '20px' }}>
        {/* Card Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <Chip
            label={filterType === 'lecturer' ? lecture.categoryName : lecture.userName}
            size="small"
            sx={{
              background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryPurple})`,
              color: lecturesStyles.white,
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          />
          
          {/* Status Chip */}
          <Chip
            icon={
              lecture.status === FileStatus.Completed ? <CheckCircleIcon /> :
              lecture.status === FileStatus.Processing ? <CircularProgress size={16} /> :
              <CloseIcon />
            }
            label={getStatusText(lecture.status)}
            size="small"
            sx={{
              backgroundColor: getStatusColor(lecture.status),
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>
        
        {/* Card Title */}
        <Typography 
          variant="h6" 
          component="h3"
          sx={{ 
            fontSize: '18px',
            fontWeight: 700,
            color: lecturesStyles.textPrimary,
            lineHeight: 1.4,
            marginBottom: '16px',
            cursor: 'pointer',
            transition: lecturesStyles.transition,
            '&:hover': {
              color: lecturesStyles.primaryBlue,
            },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
          onClick={() => lecture.url && downloadFile(lecture.url, lecture.fileName)}
        >
          {lecture.fileName}
        </Typography>
        
        {/* Card Info */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              sx={{
                fontSize: '14px',
                color: lecturesStyles.textSecondary,
                fontWeight: 500,
              }}
            >
              🎤 {filterType === 'category' ? lecture.userName : lecture.categoryName}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: '16px', fontSize: '13px', color: lecturesStyles.textMuted }}>
            <span>📅 {formatDate(lecture.uploadDate)}</span>
          </Box>
        </Box>

        {/* Action Buttons Row */}
        <Box sx={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {lecture.url && (
            <IconButton
              size="small"
              onClick={() => downloadFile(lecture.url!, lecture.fileName)}
              sx={{
                width: '36px',
                height: '36px',
                background: lecturesStyles.bgLight,
                transition: lecturesStyles.transition,
                '&:hover': {
                  background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryIndigo})`,
                  color: lecturesStyles.white,
                  transform: 'scale(1.1)',
                },
              }}
              title="הורד קובץ"
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          )}
          
          {lecture.summaryId ? (
            <IconButton
              size="small"
              onClick={() => viewSummary(lecture)}
              sx={{
                width: '36px',
                height: '36px',
                background: lecturesStyles.bgLight,
                transition: lecturesStyles.transition,
                '&:hover': {
                  background: `linear-gradient(135deg, ${lecturesStyles.primaryIndigo}, ${lecturesStyles.primaryPurple})`,
                  color: lecturesStyles.white,
                  transform: 'scale(1.1)',
                },
              }}
              title="צפה בסיכום"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          ) : isCompleted(lecture.status) ? (
            <IconButton
              size="small"
              onClick={() => generateSummary(lecture.id)}
              sx={{
                width: '36px',
                height: '36px',
                background: lecturesStyles.bgLight,
                transition: lecturesStyles.transition,
                '&:hover': {
                  background: `linear-gradient(135deg, ${lecturesStyles.primaryPurple}, #7b1fa2)`,
                  color: lecturesStyles.white,
                  transform: 'scale(1.1)',
                },
              }}
              title="צור סיכום"
            >
              <AssignmentIcon fontSize="small" />
            </IconButton>
          ) : null}

          {/* Admin Controls */}
          {hasPermissions && (
            <>
              <IconButton
                size="small"
                onClick={() => handleEditLecture(lecture)}
                sx={{
                  width: '36px',
                  height: '36px',
                  background: lecturesStyles.bgLight,
                  transition: lecturesStyles.transition,
                  '&:hover': {
                    background: '#f57c00',
                    color: lecturesStyles.white,
                    transform: 'scale(1.1)',
                  },
                }}
                title="ערוך"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              
              <IconButton
                size="small"
                onClick={() => handleDeleteLecture(lecture.id, lecture.fileName)}
                sx={{
                  width: '36px',
                  height: '36px',
                  background: lecturesStyles.bgLight,
                  transition: lecturesStyles.transition,
                  '&:hover': {
                    background: '#f44336',
                    color: lecturesStyles.white,
                    transform: 'scale(1.1)',
                  },
                }}
                title="מחק"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: lecturesStyles.bgLighter,
    }}>
      <Header currentPage={filterType === 'lecturer' ? 'lecturers' : 'topics'} />
      
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: lecturesStyles.white,
          padding: '80px 0 60px',
          paddingTop: '100px',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(getBackPath())}
              sx={{
                marginRight: 2,
                color: lecturesStyles.textSecondary,
                fontSize: '16px',
                fontWeight: 600,
                padding: '12px 20px',
                borderRadius: lecturesStyles.borderRadius,
                transition: lecturesStyles.transition,
                '&:hover': { 
                  backgroundColor: lecturesStyles.bgLight,
                  boxShadow: lecturesStyles.shadowSm,
                  transform: 'translateY(-2px)',
                }
              }}
            >
              חזור ל{getBackText()}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: 900,
                background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryIndigo}, ${lecturesStyles.primaryPurple})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: 1.2,
                marginBottom: '24px',
                letterSpacing: '-1px',
              }}
            >
              {getTitle()}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: 'clamp(18px, 2.5vw, 24px)',
                color: lecturesStyles.textSecondary,
                lineHeight: 1.6,
                maxWidth: '600px',
                margin: '0 auto 40px',
                fontWeight: 500,
              }}
            >
              {filteredLectures.length} הרצאות איכותיות זמינות לצפייה
            </Typography>

            {/* Search Section */}
            <Box sx={{ maxWidth: '600px', margin: '0 auto' }}>
              <Box
                sx={{
                  background: lecturesStyles.white,
                  borderRadius: lecturesStyles.borderRadiusLg,
                  padding: '20px',
                  boxShadow: lecturesStyles.shadowMd,
                  border: `1px solid ${lecturesStyles.borderLight}`,
                }}
              >
                <Box sx={{ position: 'relative', display: 'flex', gap: '12px' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="חפש הרצאות, נושאים או מרצים..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: lecturesStyles.textMuted }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        padding: '14px 16px',
                        border: `2px solid ${lecturesStyles.borderLight}`,
                        borderRadius: lecturesStyles.borderRadius,
                        fontSize: '16px',
                        transition: lecturesStyles.transition,
                        background: lecturesStyles.white,
                        '&:hover fieldset': {
                          borderColor: lecturesStyles.primaryBlue,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: lecturesStyles.primaryBlue,
                          boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: 0,
                      },
                      '& .MuiOutlinedInput-input::placeholder': {
                        color: lecturesStyles.textMuted,
                      },
                    }}
                  />
                  
                  {hasPermissions && (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setShowUploadModal(true)}
                      sx={{
                        padding: '14px 20px',
                        background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryPurple})`,
                        borderRadius: lecturesStyles.borderRadius,
                        fontSize: '16px',
                        fontWeight: 700,
                        transition: lecturesStyles.transition,
                        whiteSpace: 'nowrap',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: lecturesStyles.shadowMd,
                        },
                      }}
                    >
                      הוסף הרצאה
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        padding: '60px 0', 
        backgroundColor: lecturesStyles.bgLighter,
      }}>
        <Container maxWidth="lg">
          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                marginBottom: 3, 
                borderRadius: lecturesStyles.borderRadius,
                border: `1px solid #f44336`,
                backgroundColor: '#ffebee',
              }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Loading */}
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '300px',
              flexDirection: 'column',
              gap: 2,
            }}>
              <CircularProgress 
                size={60} 
                sx={{ color: lecturesStyles.primaryBlue }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: lecturesStyles.textPrimary,
                  fontWeight: 600,
                }}
              >
                טוען הרצאות...
              </Typography>
            </Box>
          ) : (
            /* Lectures Grid */
            <Box>
              {filteredLectures.length === 0 ? (
                <Card 
                  sx={{ 
                    padding: 4, 
                    textAlign: 'center', 
                    borderRadius: lecturesStyles.borderRadiusLg, 
                    border: `2px dashed ${lecturesStyles.borderLight}`,
                    background: lecturesStyles.white,
                  }}
                >
                  <Box sx={{ fontSize: '64px', marginBottom: 2, opacity: 0.3 }}>
                    🎓
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: lecturesStyles.textSecondary, 
                      marginBottom: 2,
                      fontWeight: 600,
                    }}
                  >
                    {searchTerm ? 'לא נמצאו תוצאות' : 
                     filterType === 'lecturer' ? 'אין הרצאות' : 'אין הרצאות בקטגוריה זו'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ color: lecturesStyles.textMuted }}
                  >
                    {searchTerm ? 'נסה לשנות את מילות החיפוש' : 
                     filterType === 'lecturer' ? 'המרצה עדיין לא העלה הרצאות' :
                     'עדיין לא הועלו הרצאות לקטגוריה זו'}
                  </Typography>
                </Card>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                      lg: 'repeat(3, 1fr)',
                      xl: 'repeat(3, 1fr)'
                    },
                    gap: '24px',
                  }}
                >
                  {filteredLectures.map((lecture) => (
                    <LectureCard key={lecture.id} lecture={lecture} />
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>

      {/* Upload Modal */}
      <Dialog 
        open={showUploadModal} 
        onClose={resetForm}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '24px', 
            padding: 2,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            minHeight: '400px',
          } 
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', paddingBottom: 1 }}>
          <Typography
            sx={{ 
              fontWeight: 900,
              fontSize: '1.5rem',
              background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryIndigo}, ${lecturesStyles.primaryPurple})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            העלאת הרצאה חדשה
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ padding: '32px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Box>
              <Typography variant="body1" sx={{ marginBottom: 2, color: lecturesStyles.textSecondary, fontWeight: 600 }}>
                בחר קובץ להעלאה
              </Typography>
              <Box
                component="input"
                type="file"
                accept="audio/*,video/*,.pdf,.doc,.docx"
                onChange={(e: any) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
                sx={{ 
                  width: '100%', 
                  padding: '16px', 
                  border: '2px dashed #ddd', 
                  borderRadius: '12px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  backgroundColor: lecturesStyles.bgLight,
                  transition: lecturesStyles.transition,
                  boxSizing: 'border-box',
                  '&:hover': {
                    borderColor: lecturesStyles.primaryBlue,
                    backgroundColor: lecturesStyles.white,
                  },
                }}
              />
            </Box>
            
            <Box>
              <TextField
                fullWidth
                label="שם ההרצאה"
                value={uploadForm.fileName}
                onChange={(e) => setUploadForm({...uploadForm, fileName: e.target.value})}
                placeholder="שם מותאם אישית (אופציונלי)"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: lecturesStyles.bgLight,
                    padding: '4px',
                    '&:hover fieldset': { borderColor: lecturesStyles.primaryBlue },
                    '&.Mui-focused fieldset': { borderColor: lecturesStyles.primaryBlue },
                    '&.Mui-focused': { backgroundColor: lecturesStyles.white },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '16px 14px',
                  },
                }}
              />
            </Box>
            
            {filterType === 'lecturer' && (
              <Box>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 600 }}>קטגוריה</InputLabel>
                  <Select
                    value={uploadForm.categoryId}
                    onChange={(e) => setUploadForm({...uploadForm, categoryId: e.target.value as number})}
                    label="קטגוריה"
                    sx={{ 
                      borderRadius: '12px',
                      backgroundColor: lecturesStyles.bgLight,
                      '& .MuiSelect-select': {
                        padding: '16px 14px',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: lecturesStyles.primaryBlue },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: lecturesStyles.primaryBlue },
                      '&.Mui-focused': { backgroundColor: lecturesStyles.white },
                    }}
                  >
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
            
            {uploadLoading && (
              <Box 
                sx={{ 
                  width: '100%',
                  padding: '24px',
                  backgroundColor: lecturesStyles.bgLight,
                  borderRadius: '12px',
                  border: `1px solid ${lecturesStyles.borderLight}`,
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    marginBottom: 3, 
                    fontWeight: 600,
                    color: lecturesStyles.textPrimary,
                  }}
                >
                  מעלה קובץ... {uploadProgress}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress}
                  sx={{ 
                    borderRadius: '8px', 
                    height: '12px',
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryPurple})`,
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ padding: 3, gap: 1 }}>
          <Button 
            onClick={resetForm} 
            disabled={uploadLoading}
            sx={{
              borderRadius: '12px',
              color: lecturesStyles.textSecondary,
              '&:hover': { backgroundColor: lecturesStyles.bgLight },
            }}
          >
            ביטול
          </Button>
          <Button 
            onClick={handleFileUpload}
            variant="contained"
            disabled={uploadLoading || !uploadForm.file}
            startIcon={uploadLoading ? <CircularProgress size={20} /> : <UploadIcon />}
            sx={{
              background: `linear-gradient(135deg, ${lecturesStyles.primaryBlue}, ${lecturesStyles.primaryIndigo}, ${lecturesStyles.primaryPurple})`,
              borderRadius: '12px',
              minWidth: '120px',
              fontWeight: 700,
              '&:hover': {
                background: 'linear-gradient(135deg, #1976d2, #5e35b1, #7b1fa2)',
                transform: 'translateY(-2px)',
                boxShadow: lecturesStyles.shadowMd,
              },
            }}
          >
            {uploadLoading ? 'מעלה...' : 'העלה הרצאה'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog 
        open={showEditModal} 
        onClose={resetForm}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '24px', 
            padding: 2,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            minHeight: '400px',
          } 
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', paddingBottom: 1 }}>
          <Typography
            sx={{ 
              fontWeight: 900,
              fontSize: '1.5rem',
              background: 'linear-gradient(135deg, #f57c00, #ff9800)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            עריכת הרצאה
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ padding: '32px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Box>
              <TextField
                fullWidth
                label="שם ההרצאה"
                value={uploadForm.fileName}
                onChange={(e) => setUploadForm({...uploadForm, fileName: e.target.value})}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: lecturesStyles.bgLight,
                    padding: '4px',
                    '&:hover fieldset': { borderColor: '#f57c00' },
                    '&.Mui-focused fieldset': { borderColor: '#f57c00' },
                    '&.Mui-focused': { backgroundColor: lecturesStyles.white },
                  },
                  '& .MuiInputLabel-root': {
                    fontWeight: 600,
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '16px 14px',
                  },
                }}
              />
            </Box>
            
            <Box>
              <Typography variant="body1" sx={{ marginBottom: 2, color: lecturesStyles.textSecondary, fontWeight: 600 }}>
                עדכן קובץ (אופציונלי)
              </Typography>
              <Box
                component="input"
                type="file"
                accept="audio/*,video/*,.pdf,.doc,.docx"
                onChange={(e: any) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
                sx={{ 
                  width: '100%', 
                  padding: '16px', 
                  border: '2px dashed #ddd', 
                  borderRadius: '12px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  backgroundColor: lecturesStyles.bgLight,
                  transition: lecturesStyles.transition,
                  boxSizing: 'border-box',
                  '&:hover': {
                    borderColor: '#f57c00',
                    backgroundColor: lecturesStyles.white,
                  },
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  marginTop: 2, 
                  color: lecturesStyles.textMuted,
                  fontStyle: 'italic',
                  fontSize: '14px',
                }}
              >
                השאר ריק כדי לשמור על הקובץ הקיים
              </Typography>
            </Box>
            
            <Box>
              <FormControl fullWidth>
                <InputLabel sx={{ fontWeight: 600 }}>קטגוריה</InputLabel>
                <Select
                  value={uploadForm.categoryId}
                  onChange={(e) => setUploadForm({...uploadForm, categoryId: e.target.value as number})}
                  label="קטגוריה"
                  sx={{
                    borderRadius: '12px',
                    backgroundColor: lecturesStyles.bgLight,
                    '& .MuiSelect-select': {
                      padding: '16px 14px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#f57c00' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#f57c00' },
                    '&.Mui-focused': { backgroundColor: lecturesStyles.white },
                  }}
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ padding: 3, gap: 1 }}>
          <Button 
            onClick={resetForm} 
            disabled={uploadLoading}
            sx={{
              borderRadius: '12px',
              color: lecturesStyles.textSecondary,
              '&:hover': { backgroundColor: lecturesStyles.bgLight },
            }}
          >
            ביטול
          </Button>
          <Button 
            onClick={handleUpdateLecture}
            variant="contained"
            disabled={uploadLoading || !uploadForm.fileName.trim()}
            startIcon={uploadLoading ? <CircularProgress size={20} /> : <EditIcon />}
            sx={{
              background: 'linear-gradient(135deg, #f57c00, #ff9800)',
              borderRadius: '12px',
              minWidth: '120px',
              fontWeight: 700,
              '&:hover': { 
                background: 'linear-gradient(135deg, #ef6c00, #f57c00)',
                transform: 'translateY(-2px)',
                boxShadow: lecturesStyles.shadowMd,
              },
            }}
          >
            {uploadLoading ? 'מעדכן...' : 'עדכן הרצאה'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Summary Modal */}
      <Dialog 
        open={showSummaryModal} 
        onClose={() => setShowSummaryModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ 
          sx: { 
            borderRadius: '24px', 
            padding: 2, 
            maxHeight: '80vh',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          } 
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', paddingBottom: 1 }}>
          <Typography
            sx={{ 
              fontWeight: 900,
              fontSize: '1.5rem',
              background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            סיכום ההרצאה
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {selectedSummary && (
            <Box>
              <Card sx={{ 
                backgroundColor: lecturesStyles.bgLight, 
                borderRadius: '12px', 
                padding: 3,
                marginBottom: 2,
                maxHeight: '400px',
                overflowY: 'auto',
                border: `1px solid ${lecturesStyles.borderLight}`,
              }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    whiteSpace: 'pre-wrap', 
                    lineHeight: 1.6,
                    fontFamily: 'inherit',
                    color: lecturesStyles.textPrimary,
                  }}
                >
                  {selectedSummary.content}
                </Typography>
              </Card>
              
              <Divider sx={{ marginY: 2 }} />
              
              <Typography 
                variant="caption" 
                sx={{ 
                  color: lecturesStyles.textSecondary,
                  fontSize: '13px',
                }}
              >
                נוצר ב: {new Date(selectedSummary.createdAt).toLocaleDateString('he-IL')} | 
                שפה: {selectedSummary.language === 'he' ? 'עברית' : selectedSummary.language}
              </Typography>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ padding: 3, gap: 1 }}>
          <Button 
            onClick={() => setShowSummaryModal(false)}
            sx={{ 
              borderRadius: '12px',
              color: lecturesStyles.textSecondary,
              '&:hover': { backgroundColor: lecturesStyles.bgLight },
            }}
          >
            סגור
          </Button>
          {selectedSummary && (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => {
                const lecture = lectures.find(l => l.summaryId === selectedSummary.id);
                downloadSummary(selectedSummary, lecture?.fileName || 'הרצאה');
              }}
              sx={{
                background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
                borderRadius: '12px',
                fontWeight: 700,
                '&:hover': { 
                  background: 'linear-gradient(135deg, #388e3c, #4caf50)',
                  transform: 'translateY(-2px)',
                  boxShadow: lecturesStyles.shadowMd,
                },
              }}
            >
              הורד סיכום
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LecturesList;