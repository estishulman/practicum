import  { useEffect, useState } from 'react';
import api from '../../services/Api';

interface UserFile {
  id: number;
  fileName: string;
  fileType: string;
  uploadDate: string; // DateTime מומר ל־string ב־JSON
  url: string | null;
  status: string; // אם זה enum בצד השרת, מגיע כמחרוזת ל-React
  userName: string;
  categoryName: string;
  summaryId: number | null;
}

const FileList = () => {
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<UserFile[]>('/UserFile');
        setFiles(response.data);
      } catch (err) {
        setError('שגיאה בטעינת הקבצים');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) return <div>טוען קבצים...</div>;
  if (error) return <div>{error}</div>;
  if (files.length === 0) return <div>אין קבצים להצגה</div>;

  return (
    <div>
      <h3>קבצים שהועלו:</h3>
      <ul>
        {files.map(file => (
          <li key={file.id}>
            <a href={file.url ?? '#'} target="_blank" rel="noopener noreferrer">
              {file.fileName}
            </a>{' '}
            - {new Date(file.uploadDate).toLocaleString()}<br />
            <strong>משתמש:</strong> {file.userName} | <strong>קטגוריה:</strong> {file.categoryName} | <strong>סטטוס:</strong> {file.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
