// src/services/lecturerService.ts
import api from './Api';

export interface UserFile {
  id: number;
  fileName: string;
  fileType: string;
  uploadDate: string;
  url?: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  userName: string;
  categoryName: string;
  summaryId?: number;
}

export interface Summary {
  id: number;
  content: string;
  createdAt: string;
  language: string;
  fileId: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface UserFileCreateDto {
  fileName: string;
  fileType: string;
  url?: string;
  userId: number;
  categoryId: number;
}

export interface PresignedUrlResponse {
  url: string;
}

class LecturerService {
  // Get all lectures for a specific lecturer
  async getLecturesByLecturerId(lecturerId: number): Promise<UserFile[]> {
    const response = await api.get('/UserFile');
    // Filter on client side - you can also ask backend to add endpoint
    return response.data.filter((file: any) => file.userId === lecturerId);
  }

  // Get all lectures (for admin view)
  async getAllLectures(): Promise<UserFile[]> {
    const response = await api.get('/UserFile');
    return response.data;
  }

  // Get specific lecture by ID
  async getLectureById(id: number): Promise<UserFile> {
    const response = await api.get(`/UserFile/${id}`);
    return response.data;
  }

  // Get summary by ID
  async getSummaryById(summaryId: number): Promise<Summary> {
    const response = await api.get(`/Summary/${summaryId}`);
    return response.data;
  }

  // Get presigned URL for file upload
  async getPresignedUrl(fileName: string, contentType: string): Promise<PresignedUrlResponse> {
    const response = await api.get('/UserFile/presigned-url', {
      params: {
        fileName,
        contentType
      }
    });
    return response.data;
  }

  // Upload file using presigned URL
  async uploadFileToS3(presignedUrl: string, file: File): Promise<void> {
    await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  }

  // Create file record in database
  async createLecture(fileData: UserFileCreateDto): Promise<UserFile> {
    const response = await api.post('/UserFile', fileData);
    return response.data;
  }

  // Update lecture
  async updateLecture(id: number, fileData: Partial<UserFileCreateDto>): Promise<void> {
    await api.put(`/UserFile/${id}`, fileData);
  }

  // Delete lecture
  async deleteLecture(id: number): Promise<void> {
    await api.delete(`/UserFile/${id}`);
  }

  // Generate summary for lecture
  async generateSummary(fileId: number): Promise<Summary> {
    const response = await api.post(`/UserFile/${fileId}/generate-summary`);
    return response.data;
  }

  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get('/Category');
      return response.data;
    } catch (error) {
      // Return default categories if endpoint doesn't exist
      console.warn('Categories endpoint not found, using defaults');
      return [
        { id: 1, name: 'כללי' },
        { id: 2, name: 'מתמטיקה' },
        { id: 3, name: 'פיזיקה' },
        { id: 4, name: 'כימיה' },
        { id: 5, name: 'ביולוגיה' },
        { id: 6, name: 'מדעי המחשב' },
        { id: 7, name: 'היסטוריה' },
        { id: 8, name: 'ספרות' },
        { id: 9, name: 'פסיכולוגיה' },
        { id: 10, name: 'כלכלה' }
      ];
    }
  }

  // Get current user info from token
  getCurrentUser(): { userId: number; role: string; name: string } | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        userId: parseInt(payload.sub) || 0,
        role: payload.role || '',
        name: payload.name || ''
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }

  // Check if user can upload lectures
  canUploadLectures(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'lecturer' || user?.role === 'Admin';
  }

  // Upload complete lecture (file + metadata)
  async uploadCompleteLecture(
    file: File, 
    fileName: string, 
    categoryId: number, 
    userId: number
  ): Promise<UserFile> {
    try {
      // Step 1: Get presigned URL
      const presignedData = await this.getPresignedUrl(file.name, file.type);
      
      // Step 2: Upload file to S3
      await this.uploadFileToS3(presignedData.url, file);
      
      // Step 3: Create file record in database
      const fileData: UserFileCreateDto = {
        fileName: fileName || file.name,
        fileType: file.type,
        url: presignedData.url.split('?')[0], // Remove query parameters
        userId: userId,
        categoryId: categoryId
      };
      
      return await this.createLecture(fileData);
    } catch (error) {
      console.error('Error uploading lecture:', error);
      throw new Error('שגיאה בהעלאת ההרצאה');
    }
  }

  // Download file
  downloadFile(url: string, fileName: string): void {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Download summary as text file
  downloadSummary(summary: Summary, fileName: string): void {
    const blob = new Blob([summary.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `סיכום-${fileName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Format file status for display
  getStatusText(status: string): string {
    switch (status) {
      case 'Completed': return 'הושלם';
      case 'Processing': return 'בעיבוד';
      case 'Failed': return 'נכשל';
      default: return 'ממתין';
    }
  }

  // Get status color class
  getStatusColor(status: string): string {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}

export const lecturerService = new LecturerService();
export default lecturerService;
