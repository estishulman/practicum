

// import React, { useState, useEffect } from 'react';
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
//   InputAdornment
// } from '@mui/material';
// import { 
//   Add as AddIcon, 
//   Edit as EditIcon, 
//   Delete as DeleteIcon,
//   Category as CategoryIcon,
//   Search as SearchIcon 
// } from '@mui/icons-material';
// import Header from './Header';
// import categoryService, { Category, CategoryCreate } from '../services/caregoryService';

// const Topics: React.FC = () => {
//   // States
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [newCategoryName, setNewCategoryName] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Fetch categories
//   const fetchCategories = async () => {
//     console.log(localStorage);
    
//     try {
//       setLoading(true);
//       const data = await categoryService.getAllCategories();
//       setCategories(data);
//       setFilteredCategories(data);
//       setError(null);
//     } catch (err: any) {
//       console.error('Error fetching categories:', err);
//       setError(err.response?.data?.message || 'שגיאה בטעינת הקטגוריות');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle search
//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = categories.filter(category =>
//         category.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredCategories(filtered);
//     } else {
//       setFilteredCategories(categories);
//     }
//   }, [searchTerm, categories]);

//   // Load categories on component mount
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Handle create category
//   const handleCreateCategory = async () => {
//     if (!newCategoryName.trim()) {
//       setError('שם הקטגוריה הוא שדה חובה');
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const categoryData: CategoryCreate = { name: newCategoryName.trim() };
//       const newCategory = await categoryService.createCategory(categoryData);
      
//       // Add new category to list
//       setCategories(prev => [...prev, newCategory]);
      
//       // Reset form
//       setNewCategoryName('');
//       setOpenDialog(false);
//       setError(null);
      
//     } catch (err: any) {
//       console.error('Error creating category:', err);
//       setError(err.response?.data?.message || 'שגיאה ביצירת הקטגוריה');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Handle update category
//   const handleUpdateCategory = async () => {
//     if (!editingCategory || !newCategoryName.trim()) {
//       setError('שם הקטגוריה הוא שדה חובה');
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const categoryData: CategoryCreate = { name: newCategoryName.trim() };
//       await categoryService.updateCategory(editingCategory.id, categoryData);
      
//       // Update category in list
//       setCategories(prev => 
//         prev.map(cat => 
//           cat.id === editingCategory.id 
//             ? { ...cat, name: newCategoryName.trim() }
//             : cat
//         )
//       );
      
//       // Reset form
//       setNewCategoryName('');
//       setEditingCategory(null);
//       setOpenDialog(false);
//       setError(null);
      
//     } catch (err: any) {
//       console.error('Error updating category:', err);
//       setError(err.response?.data?.message || 'שגיאה בעדכון הקטגוריה');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Handle delete category
//   const handleDeleteCategory = async (categoryId: number) => {
//     if (!window.confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו?')) {
//       return;
//     }

//     try {
//       await categoryService.deleteCategory(categoryId);
      
//       // Remove category from list
//       setCategories(prev => prev.filter(cat => cat.id !== categoryId));
//       setError(null);
      
//     } catch (err: any) {
//       console.error('Error deleting category:', err);
//       setError(err.response?.data?.message || 'שגיאה במחיקת הקטגוריה');
//     }
//   };

//   // Handle edit click
//   const handleEditClick = (category: Category) => {
//     setEditingCategory(category);
//     setNewCategoryName(category.name);
//     setOpenDialog(true);
//   };

//   // Handle add click
//   const handleAddClick = () => {
//     setEditingCategory(null);
//     setNewCategoryName('');
//     setOpenDialog(true);
//   };

//   // Handle dialog close
//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setEditingCategory(null);
//     setNewCategoryName('');
//     setError(null);
//   };

//   // Handle submit (create or update)
//   const handleSubmit = () => {
//     if (editingCategory) {
//       handleUpdateCategory();
//     } else {
//       handleCreateCategory();
//     }
//   };

//   return (
    
//     <div style={{ minHeight: '100vh', backgroundColor: '#fafbfc' }}>
//       <Header currentPage="topics" />
      
//       <Container 
//         maxWidth="lg" 
//         sx={{ 
//           paddingTop: '100px', 
//           paddingBottom: '40px' 
//         }}
//       >
//         {/* Page Header */}
//         <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
//           <Typography 
//             variant="h3" 
//             component="h1" 
//             sx={{ 
//               fontWeight: 900,
//               background: 'linear-gradient(135deg, #2196f3, #6366f1, #9c27b0)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//               backgroundClip: 'text',
//               marginBottom: 2
//             }}
//           >
//             נושאי הרצאות
//           </Typography>
//           <Typography 
//             variant="h6" 
//             color="text.secondary" 
//             sx={{ marginBottom: 3 }}
//           >
//             גלה את מגוון הנושאים והקטגוריות השונות
//           </Typography>
          
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={handleAddClick}
//             sx={{
//               background: 'linear-gradient(135deg, #2196f3, #6366f1, #9c27b0)',
//               borderRadius: '12px',
//               padding: '12px 24px',
//               fontSize: '16px',
//               fontWeight: 700,
//               boxShadow: '0 8px 24px rgba(33, 150, 243, 0.4)',
//               '&:hover': {
//                 background: 'linear-gradient(135deg, #1976d2, #5e35b1, #7b1fa2)',
//                 transform: 'translateY(-2px)',
//                 boxShadow: '0 12px 32px rgba(33, 150, 243, 0.5)',
//               },
//               transition: 'all 0.3s ease',
//             }}
//           >
//             הוסף קטגוריה חדשה
//           </Button>
//         </Box>

//         {/* Search Bar */}
//         <Box sx={{ marginBottom: 4 }}>
//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="חיפוש קטגוריות..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon sx={{ color: '#666' }} />
//                 </InputAdornment>
//               ),
//             }}
//             sx={{
//               maxWidth: '500px',
//               margin: '0 auto',
//               display: 'block',
//               '& .MuiOutlinedInput-root': {
//                 borderRadius: '16px',
//                 backgroundColor: 'white',
//                 '&:hover fieldset': {
//                   borderColor: '#2196f3',
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: '#2196f3',
//                 },
//               },
//             }}
//           />
//         </Box>

//         {/* Error Alert */}
//         {error && (
//           <Alert 
//             severity="error" 
//             sx={{ marginBottom: 3 }}
//             onClose={() => setError(null)}
//           >
//             {error}
//           </Alert>
//         )}

//         {/* Loading */}
//         {loading ? (
//           <Box 
//             sx={{ 
//               display: 'flex', 
//               justifyContent: 'center', 
//               alignItems: 'center',
//               minHeight: '300px'
//             }}
//           >
//             <CircularProgress size={60} />
//           </Box>
//         ) : (
//           /* Categories Grid */
//           <Grid container spacing={3}>
//             {filteredCategories.length === 0 ? (
//               <Grid size={12}>
//                 <Card 
//                   sx={{ 
//                     padding: 4, 
//                     textAlign: 'center',
//                     borderRadius: '16px',
//                     border: '2px dashed #e5e5e5'
//                   }}
//                 >
//                   <CategoryIcon sx={{ fontSize: 64, color: '#ccc', marginBottom: 2 }} />
//                   <Typography variant="h6" color="text.secondary" gutterBottom>
//                     {searchTerm ? 'לא נמצאו קטגוריות התואמות לחיפוש' : 'אין קטגוריות זמינות'}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {searchTerm ? 'נסה לשנות את מילות החיפוש' : 'התחל על ידי הוספת הקטגוריה הראשונה שלך'}
//                   </Typography>
//                 </Card>
//               </Grid>
//             ) : (
//               filteredCategories.map((category) => (
//                 <Grid 
//                   size={{ xs: 12, sm: 6, md: 4, lg: 3 }} 
//                   key={category.id}
//                   sx={{ 
//                     display: 'flex',
//                     minWidth: {
//                       xs: '100%',
//                       sm: '300px',
//                       md: '280px', 
//                       lg: '250px'
//                     },
//                     flexShrink: 0
//                   }}
//                 >
//                   <Card 
//                     sx={{ 
//                       height: '100%',
//                       minHeight: '200px',
//                       minWidth: {
//                         xs: '100%',
//                         sm: '280px',
//                         md: '260px', 
//                         lg: '230px'
//                       },
//                       borderRadius: '16px',
//                       transition: 'all 0.3s ease',
//                       border: '1px solid #e5e5e5',
//                       display: 'flex',
//                       flexDirection: 'column',
//                       flexShrink: 0,
//                       '&:hover': {
//                         transform: 'translateY(-8px)',
//                         boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
//                         borderColor: '#2196f3',
//                       },
//                     }}
//                   >
//                     <CardContent sx={{ 
//                       padding: 3,
//                       flex: 1,
//                       display: 'flex',
//                       flexDirection: 'column',
//                       justifyContent: 'space-between'
//                     }}>
//                       <Box>
//                         <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, justifyContent: 'center' }}>
//                           <CategoryIcon 
//                             sx={{ 
//                               fontSize: 40, 
//                               color: '#2196f3'
//                             }} 
//                           />
//                         </Box>
                        
//                         <Typography 
//                           variant="h6" 
//                           component="h3"
//                           sx={{ 
//                             fontWeight: 700,
//                             marginBottom: 2,
//                             color: '#1a1a1a',
//                             lineHeight: 1.4,
//                             textAlign: 'center'
//                           }}
//                         >
//                           {category.name}
//                         </Typography>
//                       </Box>
                      
//                       <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
//                         <IconButton
//                           size="small"
//                           onClick={() => handleEditClick(category)}
//                           sx={{
//                             backgroundColor: '#f8f9fa',
//                             '&:hover': {
//                               backgroundColor: '#2196f3',
//                               color: 'white',
//                               transform: 'scale(1.1)',
//                             },
//                             transition: 'all 0.3s ease',
//                           }}
//                         >
//                           <EditIcon fontSize="small" />
//                         </IconButton>
                        
//                         <IconButton
//                           size="small"
//                           onClick={() => handleDeleteCategory(category.id)}
//                           sx={{
//                             backgroundColor: '#f8f9fa',
//                             '&:hover': {
//                               backgroundColor: '#f44336',
//                               color: 'white',
//                               transform: 'scale(1.1)',
//                             },
//                             transition: 'all 0.3s ease',
//                           }}
//                         >
//                           <DeleteIcon fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))
//             )}
//           </Grid>
//         )}

//         {/* Add/Edit Dialog */}
//         <Dialog 
//           open={openDialog} 
//           onClose={handleCloseDialog}
//           maxWidth="sm"
//           fullWidth
//           PaperProps={{
//             sx: {
//               borderRadius: '16px',
//               padding: 2,
//             }
//           }}
//         >
//           <DialogTitle sx={{ textAlign: 'center', paddingBottom: 1 }}>
//             <Typography 
//               variant="h5" 
//               sx={{ 
//                 fontWeight: 900,
//                 background: 'linear-gradient(135deg, #2196f3, #6366f1, #9c27b0)',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 backgroundClip: 'text',
//               }}
//             >
//               {editingCategory ? 'עריכת קטגוריה' : 'הוספת קטגוריה חדשה'}
//             </Typography>
//           </DialogTitle>
          
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="שם הקטגוריה"
//               type="text"
//               fullWidth
//               variant="outlined"
//               value={newCategoryName}
//               onChange={(e) => setNewCategoryName(e.target.value)}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter') {
//                   handleSubmit();
//                 }
//               }}
//               sx={{
//                 marginTop: 2,
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: '12px',
//                   '&:hover fieldset': {
//                     borderColor: '#2196f3',
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#2196f3',
//                   },
//                 },
//               }}
//             />
//           </DialogContent>
          
//           <DialogActions sx={{ padding: 3, gap: 1 }}>
//             <Button 
//               onClick={handleCloseDialog}
//               sx={{
//                 borderRadius: '12px',
//                 color: '#666',
//                 '&:hover': {
//                   backgroundColor: '#f5f5f5',
//                 },
//               }}
//             >
//               ביטול
//             </Button>
//             <Button 
//               onClick={handleSubmit}
//               variant="contained"
//               disabled={submitting || !newCategoryName.trim()}
//               sx={{
//                 borderRadius: '12px',
//                 background: 'linear-gradient(135deg, #2196f3, #6366f1, #9c27b0)',
//                 minWidth: '120px',
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #1976d2, #5e35b1, #7b1fa2)',
//                 },
//                 '&:disabled': {
//                   background: '#ccc',
//                 },
//               }}
//             >
//               {submitting ? (
//                 <CircularProgress size={20} color="inherit" />
//               ) : (
//                 editingCategory ? 'עדכן' : 'הוסף'
//               )}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </div>
//   );
// };

// export default Topics;




import React, { useState, useEffect } from 'react';
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
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Category as CategoryIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import categoryService, { Category, CategoryCreate } from '../services/caregoryService';

const Topics: React.FC = () => {
  const navigate = useNavigate();
  
  // States
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch categories
  const fetchCategories = async () => {
    console.log(localStorage);
    
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
      setFilteredCategories(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.message || 'שגיאה בטעינת הקטגוריות');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  // Load categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle view lectures
  const handleViewLectures = (category: Category) => {
    navigate(`/topics/${category.id}/lectures`, {
      state: { categoryName: category.name }
    });
  };

  // Handle create category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('שם הקטגוריה הוא שדה חובה');
      return;
    }

    try {
      setSubmitting(true);
      const categoryData: CategoryCreate = { name: newCategoryName.trim() };
      const newCategory = await categoryService.createCategory(categoryData);
      
      // Add new category to list
      setCategories(prev => [...prev, newCategory]);
      
      // Reset form
      setNewCategoryName('');
      setOpenDialog(false);
      setError(null);
      
    } catch (err: any) {
      console.error('Error creating category:', err);
      setError(err.response?.data?.message || 'שגיאה ביצירת הקטגוריה');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle update category
  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) {
      setError('שם הקטגוריה הוא שדה חובה');
      return;
    }

    try {
      setSubmitting(true);
      const categoryData: CategoryCreate = { name: newCategoryName.trim() };
      await categoryService.updateCategory(editingCategory.id, categoryData);
      
      // Update category in list
      setCategories(prev => 
        prev.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, name: newCategoryName.trim() }
            : cat
        )
      );
      
      // Reset form
      setNewCategoryName('');
      setEditingCategory(null);
      setOpenDialog(false);
      setError(null);
      
    } catch (err: any) {
      console.error('Error updating category:', err);
      setError(err.response?.data?.message || 'שגיאה בעדכון הקטגוריה');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (categoryId: number) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק קטגוריה זו?')) {
      return;
    }

    try {
      await categoryService.deleteCategory(categoryId);
      
      // Remove category from list
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      setError(null);
      
    } catch (err: any) {
      console.error('Error deleting category:', err);
      setError(err.response?.data?.message || 'שגיאה במחיקת הקטגוריה');
    }
  };

  // Handle edit click
  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setOpenDialog(true);
  };

  // Handle add click
  const handleAddClick = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setNewCategoryName('');
    setError(null);
  };

  // Handle submit (create or update)
  const handleSubmit = () => {
    if (editingCategory) {
      handleUpdateCategory();
    } else {
      handleCreateCategory();
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafbfc' }}>
      <Header currentPage="topics" />
      
      <Container 
        maxWidth="lg" 
        sx={{ 
          paddingTop: '100px', 
          paddingBottom: '40px' 
        }}
      >
        {/* Page Header */}
        <Box sx={{ marginBottom: 4, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 900,
              background: 'linear-gradient(135deg, #2196f3, #6366f1, #9c27b0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 2
            }}
          >
            נושאי הרצאות
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ marginBottom: 3 }}
          >
            גלה את מגוון הנושאים והקטגוריות השונות
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{
              background: 'linear-gradient(135deg, #2196f3, #6366f1, #9c27b0)',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 700,
              boxShadow: '0 8px 24px rgba(33, 150, 243, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1976d2, #5e35b1, #7b1fa2)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 32px rgba(33, 150, 243, 0.5)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            הוסף קטגוריה חדשה
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ marginBottom: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="חיפוש קטגוריות..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#666' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: '500px',
              margin: '0 auto',
              display: 'block',
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                backgroundColor: 'white',
                '&:hover fieldset': {
                  borderColor: '#2196f3',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#2196f3',
                },
              },
            }}
          />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ marginBottom: 3 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '300px'
            }}
          >
            <CircularProgress size={60} />
          </Box>
        ) : (
          /* Categories Grid */
          <Grid container spacing={3}>
            {filteredCategories.length === 0 ? (
              <Grid size={12}>
                <Card 
                  sx={{ 
                    padding: 4, 
                    textAlign: 'center',
                    borderRadius: '16px',
                    border: '2px dashed #e5e5e5'
                  }}
                >
                  <CategoryIcon sx={{ fontSize: 64, color: '#ccc', marginBottom: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {searchTerm ? 'לא נמצאו קטגוריות התואמות לחיפוש' : 'אין קטגוריות זמינות'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? 'נסה לשנות את מילות החיפוש' : 'התחל על ידי הוספת הקטגוריה הראשונה שלך'}
                  </Typography>
                </Card>
              </Grid>
            ) : (
              filteredCategories.map((category) => (
                <Grid 
                  size={{ xs: 12, sm: 6, md: 4, lg: 3 }} 
                  key={category.id}
                  sx={{ 
                    display: 'flex',
                    minWidth: {
                      xs: '100%',
                      sm: '300px',
                      md: '280px', 
                      lg: '250px'
                    },
                    flexShrink: 0
                  }}
                >
                  <Card 
                    sx={{ 
                      height: '100%',
                      minHeight: '280px',
                      minWidth: {
                        xs: '100%',
                        sm: '280px',
                        md: '260px', 
                        lg: '230px'
                      },
                      borderRadius: '16px',
                      transition: 'all 0.3s ease',
                      border: '1px solid #e5e5e5',
                      display: 'flex',
                      flexDirection: 'column',
                      flexShrink: 0,
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        borderColor: '#2196f3',
                      },
                    }}
                  >
                    <CardContent sx={{ 
                      padding: 3,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, justifyContent: 'center' }}>
                          <CategoryIcon 
                            sx={{ 
                              fontSize: 40, 
                              color: '#2196f3'
                            }} 
                          />
                        </Box>
                        
                        <Typography 
                          variant="h6" 
                          component="h3"
                          sx={{ 
                            fontWeight: 700,
                            marginBottom: 2,
                            color: '#1a1a1a',
                            lineHeight: 1.4,
                            textAlign: 'center'
                          }}
                        >
                          {category.name}
                        </Typography>

                        {/* View Lectures Button */}
                        <Button
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleViewLectures(category)}
                          fullWidth
                          sx={{
                            marginBottom: 2,
                            borderColor: '#2196f3',
                            color: '#2196f3',
                            borderRadius: '8px',
                            '&:hover': {
                              backgroundColor: '#2196f3',
                              color: 'white',
                              borderColor: '#2196f3',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          צפה בהרצאות
                        </Button>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(category)}
                          sx={{
                            backgroundColor: '#f8f9fa',
                            '&:hover': {
                              backgroundColor: '#2196f3',
                              color: 'white',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteCategory(category.id)}
                          sx={{
                            backgroundColor: '#f8f9fa',
                            '&:hover': {
                              backgroundColor: '#f44336',
                              color: 'white',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* Add/Edit Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: '16px',
              padding: 2,
            }
          }}
        >
          <DialogTitle sx={{ textAlign: 'center', paddingBottom: 1 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 900,
                background: 'linear-gradient(135deg, #2196f3, #6366f1, #9c27b0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {editingCategory ? 'עריכת קטגוריה' : 'הוספת קטגוריה חדשה'}
            </Typography>
          </DialogTitle>
          
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="שם הקטגוריה"
              type="text"
              fullWidth
              variant="outlined"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit();
                }
              }}
              sx={{
                marginTop: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#2196f3',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2196f3',
                  },
                },
              }}
            />
          </DialogContent>
          
          <DialogActions sx={{ padding: 3, gap: 1 }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{
                borderRadius: '12px',
                color: '#666',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              ביטול
            </Button>
            <Button 
              onClick={handleSubmit}
              variant="contained"
              disabled={submitting || !newCategoryName.trim()}
              sx={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2196f3, #6366f1, #9c27b0)',
                minWidth: '120px',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1976d2, #5e35b1, #7b1fa2)',
                },
                '&:disabled': {
                  background: '#ccc',
                },
              }}
            >
              {submitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                editingCategory ? 'עדכן' : 'הוסף'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default Topics;