import React, { useState } from 'react';
import api from '../../services/Api';
import axios from 'axios';

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setProgress(0); // איפוס התקדמות אם הוחלף קובץ
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('לא נבחר קובץ להעלאה.');
      return;
    }

    setIsUploading(true);

    try {
      // שלב 1: בקשת כתובת Presigned
      console.log('JWT Token:', localStorage.getItem('token'));
      console.log(Headers);
      
      const presignedResponse = await api.get('/UserFile/presigned-url', {
        params: {
          fileName: file.name,
          contentType: file.type,
        },
      });

      const presignedUrl = presignedResponse.data.url;

      // שלב 2: העלאה ל-S3 (ללא JWT)
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setProgress(percent);
        },
        transformRequest: [(data) => data], // למניעת המרה אוטומטית של הקובץ
      });

      // שלב 3: שמירת פרטי הקובץ במסד הנתונים
      // await api.post('/UserFile', {
      //   fileName: file.name,
      //   fileType: file.type,
      //   url: presignedUrl.split('?')[0],
      //   userId: 1,       // לשנות לפי ה־user שלך
      //   categoryId: 1,   // לשנות לפי הקטגוריה הרלוונטית
      // });

      const dbResponse = await api.post('/UserFile', {
        fileName: file.name,
        fileType: file.type,
        url: presignedUrl.split('?')[0],
        userId: 1,
        categoryId: 1,
      });
      
      console.log('DB Response:', dbResponse.data);
      

      alert('הקובץ הועלה ונשמר בהצלחה!');
      setFile(null);
      setProgress(0);

    } catch (error) {
      console.error('שגיאה בהעלאה:', error);
      alert('אירעה שגיאה בהעלאת הקובץ.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={isUploading} />
      <button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? 'מעלה...' : 'העלה קובץ'}
      </button>
      {progress > 0 && <div>התקדמות: {progress}%</div>}
    </div>
  );
};

export default FileUploader;
