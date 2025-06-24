



// import api from './Api';

// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: string; // שדה string כמו שהשרת מחזיר
// }

// export interface UserCreateDto {
//   name: string;
//   email: string;
//   password: string;
//   role?: Role; // תואם ל-C# UserCreateDto
// }

// export interface UserUpdateDto {
//   name?: string;
//   email?: string;
//   password?: string;
//   role?: Role; // תואם ל-C# UserUpdateDto
// }

// // Enum תואם לערכים ב-C#
// export enum Role {
//   Admin = 0,
//   Regular = 1, 
//   lecturer = 2
// }

// export interface UserResponseDto extends User {}

// class LecturerService {
//   // קבלת כל המרצים (משתמש ב-endpoint הייעודי)
//   async getAllLecturers(): Promise<User[]> {
//     const response = await api.get<User[]>('/User/lecturers');
//     return response.data;
//   }

//   // קבלת מרצה לפי ID
//   async getLecturerById(id: number): Promise<User> {
//     const response = await api.get<User>(`/User/${id}`);
//     return response.data;
//   }

//   // יצירת מרצה חדש
//   async createLecturer(data: UserCreateDto): Promise<User> {
//     // וידוא שהתפקיד נשלח כמספר (enum value)
//     const requestData = {
//       name: data.name,
//       email: data.email,
//       password: data.password,
//       role: data.role !== undefined ? data.role : Role.lecturer // ברירת מחדל למרצה
//     };
    
//     const response = await api.post<User>('/Auth/register', requestData);
//     return response.data;
//   }

//   // עדכון מרצה
//   async updateLecturer(id: number, data: UserUpdateDto): Promise<void> {
//     // רק שדות שהוגדרו יישלחו לשרת
//     const updateData: any = {};
    
//     if (data.name !== undefined) updateData.name = data.name;
//     if (data.email !== undefined) updateData.email = data.email;
//     if (data.password !== undefined) updateData.password = data.password;
//     if (data.role !== undefined) updateData.role = data.role;
    
//     await api.put(`/User/${id}`, updateData);
//   }

//   // מחיקת מרצה
//   async deleteLecturer(id: number): Promise<void> {
//     await api.delete(`/User/${id}`);
//   }

//   // בדיקת הרשאות - האם המשתמש הנוכחי הוא אדמין
//   getCurrentUserRole(): string | null {
//     const userStr = localStorage.getItem('user');
//     if (!userStr) return null;
    
//     try {
//       const user = JSON.parse(userStr);
//       return user.role || null;
//     } catch {
//       return null;
//     }
//   }

//   // האם המשתמש הנוכחי הוא אדמין
//   isCurrentUserAdmin(): boolean {
//     const role = this.getCurrentUserRole();
//     return role === 'Admin' || role === Role.Admin.toString();
//   }

//   // פונקציית עזר להמרת role string ל-enum
//   stringToRole(roleString: string): Role {
//     switch (roleString.toLowerCase()) {
//       case 'admin':
//         return Role.Admin;
//       case 'regular':
//         return Role.Regular;
//       case 'lecturer':
//         return Role.lecturer;
//       default:
//         return Role.Regular; // ברירת מחדל
//     }
//   }

//   // פונקציית עזר להמרת role enum ל-string
//   roleToString(role: Role): string {
//     switch (role) {
//       case Role.Admin:
//         return 'Admin';
//       case Role.Regular:
//         return 'Regular';
//       case Role.lecturer:
//         return 'lecturer';
//       default:
//         return 'Regular';
//     }
//   }
// }

// const lecturerService = new LecturerService();
// export default lecturerService;



import api from './Api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string; // שדה string כמו שהשרת מחזיר
}

export interface UserCreateDto {
  name: string;
  email: string;
  password: string;
  role?: Role; // תואם ל-C# UserCreateDto
}

export interface UserUpdateDto {
  name?: string;
  email?: string;
  password?: string;
  role?: Role; // תואם ל-C# UserUpdateDto
}

// Enum תואם לערכים ב-C#
export enum Role {
  Admin = 0,
  Regular = 1, 
  lecturer = 2
}

export interface UserResponseDto extends User {}

class LecturerService {
  // קבלת כל המרצים (משתמש ב-endpoint הייעודי)
  async getAllLecturers(): Promise<User[]> {
    const response = await api.get<User[]>('/User/lecturers');
    return response.data;
  }

  // קבלת מרצה לפי ID
  async getLecturerById(id: number): Promise<User> {
    const response = await api.get<User>(`/User/${id}`);
    return response.data;
  }

  // יצירת מרצה חדש
  async createLecturer(data: UserCreateDto): Promise<User> {
    // וידוא שהתפקיד נשלח כמספר (enum value)
    const requestData = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role !== undefined ? data.role : Role.lecturer // ברירת מחדל למרצה
    };
    
    const response = await api.post<User>('/Auth/register', requestData);
    return response.data;
  }

  // עדכון מרצה
  async updateLecturer(id: number, data: UserUpdateDto): Promise<void> {
    // רק שדות שהוגדרו יישלחו לשרת
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.password !== undefined && data.password.trim() !== '') {
      updateData.password = data.password;
    }
    // רק נשלח role אם זה שונה מהתפקיד הנוכחי
    if (data.role !== undefined) updateData.role = data.role;
    
    console.log('Sending to server - updateData:', updateData);
    console.log('URL:', `/User/${id}`);
    
    await api.put(`/User/${id}`, updateData);
  }

  // מחיקת מרצה
  async deleteLecturer(id: number): Promise<void> {
    await api.delete(`/User/${id}`);
  }

  // בדיקת הרשאות - האם המשתמש הנוכחי הוא אדמין
  getCurrentUserRole(): string | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return user.role || null;
    } catch {
      return null;
    }
  }

  // האם המשתמש הנוכחי הוא אדמין
  isCurrentUserAdmin(): boolean {
    const role = this.getCurrentUserRole();
    return role === 'Admin' || role === Role.Admin.toString();
  }

  // פונקציית עזר להמרת role string ל-enum
  stringToRole(roleString: string): Role {
    switch (roleString.toLowerCase()) {
      case 'admin':
        return Role.Admin;
      case 'regular':
        return Role.Regular;
      case 'lecturer':
        return Role.lecturer;
      default:
        return Role.Regular; // ברירת מחדל
    }
  }

  // פונקציית עזר להמרת role enum ל-string
  roleToString(role: Role): string {
    switch (role) {
      case Role.Admin:
        return 'Admin';
      case Role.Regular:
        return 'Regular';
      case Role.lecturer:
        return 'lecturer';
      default:
        return 'Regular';
    }
  }
}

const lecturerService = new LecturerService();
export default lecturerService;