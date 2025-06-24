


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
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
  PlayArrow as PlayArrowIcon  // ← הוספתי את האיקון הזה
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom'; // ← הוספתי את זה
import Header from './Header';
import lecturerService, { User, UserUpdateDto, UserCreateDto, Role } from '../services/LecturerService';

const Lecturers: React.FC = () => {
  const navigate = useNavigate(); // ← הוספתי את זה
  
  // States
  const [lecturers, setLecturers] = useState<User[]>([]);
  const [filteredLecturers, setFilteredLecturers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: Role.lecturer
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // ← הוספתי פונקציה לניווט להרצאות
  const handleViewLectures = (lecturer: User) => {
    navigate(`/lecturers/${lecturer.id}/lectures`, { 
      state: { lecturerName: lecturer.name } 
    });
  };

  // Fetch lecturers
  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const data = await lecturerService.getAllLecturers();
      setLecturers(data);
      setFilteredLecturers(data);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching lecturers:', err);
      setError(err.response?.data?.message || 'שגיאה בטעינת המרצים');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchTerm) {
      const filtered = lecturers.filter(lecturer =>
        (lecturer.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (lecturer.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
      setFilteredLecturers(filtered);
    } else {
      setFilteredLecturers(lecturers);
    }
  }, [searchTerm, lecturers]);

  // Load lecturers on component mount
  useEffect(() => {
    fetchLecturers();
  }, []);

  // Handle create lecturer
  const handleCreateLecturer = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('כל השדות הם חובה');
      return;
    }

    try {
      setSubmitting(true);
      const createData: UserCreateDto = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: formData.role
      };
      
      const newLecturer = await lecturerService.createLecturer(createData);
      
      // Add new lecturer to list
      setLecturers(prev => [...prev, newLecturer]);
      
      // Reset form
      resetForm();
      
    } catch (err: any) {
      console.error('Error creating lecturer:', err);
      setError(err.response?.data?.message || 'שגיאה ביצירת המרצה');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle update lecturer
  const handleUpdateLecturer = async () => {
    if (!editingLecturer || !formData.name.trim() || !formData.email.trim()) {
      setError('שם ומייל הם חובה');
      return;
    }

    try {
      setSubmitting(true);
      const updateData: UserUpdateDto = {
        name: formData.name.trim(),
        email: formData.email.trim(),
      };
      
      // Add password only if provided
      if (formData.password.trim()) {
        updateData.password = formData.password.trim();
      }
      
      // Add role only if it changed from the original
      const originalRole = lecturerService.stringToRole(editingLecturer.role);
      if (formData.role !== originalRole) {
        updateData.role = formData.role;
      }
      
      await lecturerService.updateLecturer(editingLecturer.id, updateData);
      
      // Update lecturer in list
      setLecturers(prev => 
        prev.map(lecturer => 
          lecturer.id === editingLecturer.id 
            ? { 
                ...lecturer, 
                name: updateData.name!, 
                email: updateData.email!, 
                role: updateData.role !== undefined ? lecturerService.roleToString(formData.role) : lecturer.role
              }
            : lecturer
        )
      );
      
      // Reset form
      resetForm();
      
    } catch (err: any) {
      console.error('Error updating lecturer:', err);
      setError(err.response?.data?.message || 'שגיאה בעדכון המרצה');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete lecturer
  const handleDeleteLecturer = async (lecturerId: number) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק מרצה זה?')) {
      return;
    }

    try {
      await lecturerService.deleteLecturer(lecturerId);
      
      // Remove lecturer from list
      setLecturers(prev => prev.filter(lecturer => lecturer.id !== lecturerId));
      setError(null);
      
    } catch (err: any) {
      console.error('Error deleting lecturer:', err);
      setError(err.response?.data?.message || 'שגיאה במחיקת המרצה');
    }
  };

  // Handle edit click
  const handleEditClick = (lecturer: User) => {
    setEditingLecturer(lecturer);
    setFormData({
      name: lecturer.name,
      email: lecturer.email,
      password: '',
      role: lecturerService.stringToRole(lecturer.role)
    });
    setOpenDialog(true);
  };

  // Handle add click
  const handleAddClick = () => {
    setEditingLecturer(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: Role.lecturer
    });
    setOpenDialog(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: Role.lecturer
    });
    setEditingLecturer(null);
    setOpenDialog(false);
    setError(null);
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    resetForm();
  };

  // Handle submit (create or update)
  const handleSubmit = () => {
    if (editingLecturer) {
      handleUpdateLecturer();
    } else {
      handleCreateLecturer();
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    if (!name) return '??';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Get role color
  const getRoleColor = (role: string | Role) => {
    const roleString = typeof role === 'string' ? role : lecturerService.roleToString(role);
    switch (roleString) {
      case 'Admin':
        return '#f44336';
      case 'lecturer':
        return '#2196f3';
      case 'Regular':
        return '#2196f3';
      default:
        return '#666';
    }
  };

  // Get role icon
  const getRoleIcon = (role: string | Role) => {
    const roleString = typeof role === 'string' ? role : lecturerService.roleToString(role);
    switch (roleString) {
      case 'Admin':
        return <AdminIcon />;
      case 'lecturer':
        return <SchoolIcon />;
      case 'Regular':
        return <PersonIcon />;
      default:
        return <PersonIcon />;
    }
  };

  // Get role label
  const getRoleLabel = (role: string | Role) => {
    const roleString = typeof role === 'string' ? role : lecturerService.roleToString(role);
    switch (roleString) {
      case 'Admin':
        return 'מנהל';
      case 'lecturer':
        return 'מרצה';
      case 'Regular':
        return 'רגיל';
      default:
        return roleString;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafbfc' }}>
      <Header currentPage="lecturers" />
      
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
            מרצים
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ marginBottom: 3 }}
          >
            רשימת כל המרצים במערכת
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
            הוסף מרצה חדש
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ marginBottom: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="חיפוש מרצים (שם או מייל)..."
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
          /* Lecturers Grid */
          <Grid container spacing={3}>
            {filteredLecturers.length === 0 ? (
              <Grid size={12}>
                <Card 
                  sx={{ 
                    padding: 4, 
                    textAlign: 'center',
                    borderRadius: '16px',
                    border: '2px dashed #e5e5e5'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 64, color: '#ccc', marginBottom: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {searchTerm ? 'לא נמצאו מרצים התואמים לחיפוש' : 'אין מרצים זמינים'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? 'נסה לשנות את מילות החיפוש' : 'אין מרצים רשומים במערכת כרגע'}
                  </Typography>
                </Card>
              </Grid>
            ) : (
              filteredLecturers.map((lecturer) => (
                <Grid 
                  size={{ xs: 12, sm: 6, md: 4, lg: 3 }} 
                  key={lecturer.id}
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
                      minHeight: '340px', // ← הגדלתי כדי להכיל את הכפתור החדש
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
                      textAlign: 'center',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      <Box>
                        {/* Avatar */}
                        <Avatar
                          sx={{
                            width: 64,
                            height: 64,
                            margin: '0 auto 16px',
                            background: 'linear-gradient(135deg, #2196f3, #9c27b0)',
                            fontSize: '24px',
                            fontWeight: 'bold'
                          }}
                        >
                          {getUserInitials(lecturer.name)}
                        </Avatar>

                        {/* Role Chip */}
                        <Chip 
                          icon={getRoleIcon(lecturer.role)}
                          label={getRoleLabel(lecturer.role)}
                          size="small"
                          sx={{
                            backgroundColor: getRoleColor(lecturer.role),
                            color: 'white',
                            fontWeight: 600,
                            marginBottom: 2,
                          }}
                        />
                        
                        {/* Name */}
                        <Typography 
                          variant="h6" 
                          component="h3"
                          sx={{ 
                            fontWeight: 700,
                            marginBottom: 1,
                            color: '#1a1a1a',
                            lineHeight: 1.4
                          }}
                        >
                          {lecturer.name || 'ללא שם'}
                        </Typography>
                        
                        {/* Email */}
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ marginBottom: 2 }}
                        >
                          {lecturer.email || 'אין כתובת מייל'}
                        </Typography>
                      </Box>

                      {/* ← הוספתי כפתור להרצאות */}
                      {lecturer.role === 'lecturer' && (
                        <Button
                          variant="outlined"
                          startIcon={<PlayArrowIcon />}
                          onClick={() => handleViewLectures(lecturer)}
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
                      )}

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', marginTop: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(lecturer)}
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
                          onClick={() => handleDeleteLecturer(lecturer.id)}
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

        {/* Edit Dialog */}
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
            <Box
              sx={{ 
                fontWeight: 900,
                fontSize: '1.5rem',
                background: 'linear-gradient(135deg, #2196f3, #6366f1, #9c27b0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {editingLecturer ? 'עריכת מרצה' : 'הוספת מרצה חדש'}
            </Box>
          </DialogTitle>
          
          <DialogContent>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField
                  margin="dense"
                  label="שם מלא"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                  sx={{
                    marginTop: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': { borderColor: '#2196f3' },
                      '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                    },
                  }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  margin="dense"
                  label="כתובת מייל"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': { borderColor: '#2196f3' },
                      '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                    },
                  }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  margin="dense"
                  label={editingLecturer ? "סיסמה חדשה (אופציונלי)" : "סיסמה"}
                  type="password"
                  fullWidth
                  variant="outlined"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover fieldset': { borderColor: '#2196f3' },
                      '&.Mui-focused fieldset': { borderColor: '#2196f3' },
                    },
                  }}
                />
              </Grid>
              <Grid size={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>תפקיד</InputLabel>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({...prev, role: e.target.value as Role}))}
                    label="תפקיד"
                    sx={{
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2196f3' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2196f3' },
                    }}
                  >
                    <MenuItem value={Role.Admin}>מנהל</MenuItem>
                    <MenuItem value={Role.Regular}>רגיל</MenuItem>
                    <MenuItem value={Role.lecturer}>מרצה</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ padding: 3, gap: 1 }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{
                borderRadius: '12px',
                color: '#666',
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
            >
              ביטול
            </Button>
            <Button 
              onClick={handleSubmit}
              variant="contained"
              disabled={submitting || !formData.name.trim() || !formData.email.trim() || (!editingLecturer && !formData.password.trim())}
              sx={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2196f3, #6366f1, #9c27b0)',
                minWidth: '120px',
                '&:hover': { background: 'linear-gradient(135deg, #1976d2, #5e35b1, #7b1fa2)' },
                '&:disabled': { background: '#ccc' },
              }}
            >
              {submitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                editingLecturer ? 'עדכן' : 'הוסף'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default Lecturers;