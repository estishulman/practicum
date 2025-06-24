


// import { createBrowserRouter } from "react-router-dom";
// import Login from "./components/login/Login";
// import Registration from "./components/login/Registeration";
// import FileList from "./components/files/FileList";
// import FileUploader from "./components/files/FileUploader";
// import Home from "./components/Home";
// import ShowSummarizes from "./components/ShowSummarizes";
// import Header from "./components/Header";
// import Topics from "./components/Topics";
// import Lecturers from "./components/Lecturers";
// import LecturerLectures from "./components/LecturerLectures"; // ← הוספתי ייבוא

// // קומפוננט עטיפה להרצאות מרצה ספציפי
// const LecturerLecturesPage = () => {
//    // זה יעבוד רק אם נשתמש ב-useParams בתוך הקומפוננט
//    return <LecturerLecturesWrapper />;
// };

// // קומפוננט פנימי שיכול להשתמש ב-hooks
// import { useParams, useLocation } from 'react-router-dom';

// const LecturerLecturesWrapper = () => {
//    const { lecturerId } = useParams();
//    const location = useLocation();
//    const lecturerName = location.state?.lecturerName || 'מרצה';

//    if (!lecturerId) {
//       return (
//          <div style={{ 
//             minHeight: '100vh', 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'center',
//             backgroundColor: '#fafbfc',
//             textAlign: 'center'
//          }}>
//             <div>
//                <h1 style={{ 
//                   fontSize: '48px', 
//                   color: '#f44336',
//                   margin: '0 0 16px 0'
//                }}>
//                   שגיאה
//                </h1>
//                <p style={{ color: '#666', fontSize: '18px' }}>
//                   לא נמצא מזהה מרצה
//                </p>
//                <button 
//                   onClick={() => window.location.href = '/lecturers'}
//                   style={{
//                      padding: '12px 24px',
//                      backgroundColor: '#2196f3',
//                      color: 'white',
//                      border: 'none',
//                      borderRadius: '8px',
//                      cursor: 'pointer',
//                      fontSize: '16px',
//                      marginTop: '16px'
//                   }}
//                >
//                   חזור למרצים
//                </button>
//             </div>
//          </div>
//       );
//    }

//    return (
//       <LecturerLectures 
//          lecturerId={parseInt(lecturerId)} 
//          lecturerName={lecturerName}
//          showBackButton={true}
//       />
//    );
// };

// const router = createBrowserRouter([
//    // דף הבית
//    {
//       path: '/',
//       element: <Home />,
//       errorElement: <h1>שגיאה בטעינת העמוד</h1>
//    },
   
//    // דפי תוכן עיקריים
//    {
//       path: '/topics',
//       element: <Topics />
//    },
//    {
//       path: '/lecturers',
//       element: <Lecturers />
//    },
//    // ← הוספתי ראוט חדש להרצאות של מרצה ספציפי
//    {
//       path: '/lecturers/:lecturerId/lectures',
//       element: <LecturerLecturesPage />
//    },
   
//    // דפי התחברות והרשמה
//    {
//       path: '/login',
//       element: <Login onLoginSuccess={() => console.log('Login success')} />
//    },
//    {
//       path: '/register',
//       element: <Registration />
//    },
   
//    // דפים נוספים
//    {
//       path: '/summarizes',
//       element: <ShowSummarizes />
//    },
//    {
//       path: '/files',
//       element: <FileList />
//    },
//    {
//       path: '/upload',
//       element: <FileUploader />
//    },
   
//    // דף 404 לכל שאר הנתיבים
//    {
//       path: '*',
//       element: (
//          <div style={{
//             minHeight: '100vh',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: '#fafbfc',
//             textAlign: 'center'
//          }}>
//             <div>
//                <h1 style={{
//                   fontSize: '72px',
//                   color: '#2196f3',
//                   margin: '0'
//                }}>
//                   404
//                </h1>
//                <h2 style={{ color: '#666' }}>עמוד לא נמצא</h2>
//                <p style={{ color: '#999' }}>
//                   העמוד שחיפשת לא קיים במערכת
//                </p>
//                <button
//                   onClick={() => window.location.href = '/'}
//                   style={{
//                      padding: '12px 24px',
//                      backgroundColor: '#2196f3',
//                      color: 'white',
//                      border: 'none',
//                      borderRadius: '8px',
//                      cursor: 'pointer',
//                      fontSize: '16px'
//                   }}
//                >
//                   חזור לדף הבית
//                </button>
//             </div>
//          </div>
//       )
//    }
// ]);

// export default router;





import { createBrowserRouter } from "react-router-dom";
import Login from "./components/login/Login";
import Registration from "./components/login/Registeration";
import FileList from "./components/files/FileList";
import FileUploader from "./components/files/FileUploader";
import Home from "./components/Home";
import ShowSummarizes from "./components/ShowSummarizes";
import Header from "./components/Header";
import Topics from "./components/Topics";
import Lecturers from "./components/Lecturers";
import LecturesList from "./components/LecturerLectures"; // הקומפוננטה המאוחדת החדשה

// קומפוננט עטיפה להרצאות של מרצה ספציפי
const LecturerLecturesPage = () => {
   return <LecturerLecturesWrapper />;
};

// קומפוננט עטיפה להרצאות של קטגוריה ספציפית
const CategoryLecturesPage = () => {
   return <CategoryLecturesWrapper />;
};

// קומפוננטים פנימיים שיכולים להשתמש ב-hooks
import { useParams, useLocation } from 'react-router-dom';

const LecturerLecturesWrapper = () => {
   const { lecturerId } = useParams();
   const location = useLocation();
   const lecturerName = location.state?.lecturerName || 'מרצה';

   if (!lecturerId) {
      return (
         <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#fafbfc',
            textAlign: 'center'
         }}>
            <div>
               <h1 style={{ 
                  fontSize: '48px', 
                  color: '#f44336',
                  margin: '0 0 16px 0'
               }}>
                  שגיאה
               </h1>
               <p style={{ color: '#666', fontSize: '18px' }}>
                  לא נמצא מזהה מרצה
               </p>
               <button 
                  onClick={() => window.location.href = '/lecturers'}
                  style={{
                     padding: '12px 24px',
                     backgroundColor: '#2196f3',
                     color: 'white',
                     border: 'none',
                     borderRadius: '8px',
                     cursor: 'pointer',
                     fontSize: '16px',
                     marginTop: '16px'
                  }}
               >
                  חזור למרצים
               </button>
            </div>
         </div>
      );
   }

   return <LecturesList />;
};

const CategoryLecturesWrapper = () => {
   const { categoryId } = useParams();
   const location = useLocation();
   const categoryName = location.state?.categoryName || 'קטגוריה';

   if (!categoryId) {
      return (
         <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#fafbfc',
            textAlign: 'center'
         }}>
            <div>
               <h1 style={{ 
                  fontSize: '48px', 
                  color: '#f44336',
                  margin: '0 0 16px 0'
               }}>
                  שגיאה
               </h1>
               <p style={{ color: '#666', fontSize: '18px' }}>
                  לא נמצא מזהה קטגוריה
               </p>
               <button 
                  onClick={() => window.location.href = '/topics'}
                  style={{
                     padding: '12px 24px',
                     backgroundColor: '#2196f3',
                     color: 'white',
                     border: 'none',
                     borderRadius: '8px',
                     cursor: 'pointer',
                     fontSize: '16px',
                     marginTop: '16px'
                  }}
               >
                  חזור לנושאים
               </button>
            </div>
         </div>
      );
   }

   return <LecturesList />;
};

const router = createBrowserRouter([
   // דף הבית
   {
      path: '/',
      element: <Home />,
      errorElement: <h1>שגיאה בטעינת העמוד</h1>
   },
   
   // דפי תוכן עיקריים
   {
      path: '/topics',
      element: <Topics />
   },
   {
      path: '/lecturers',
      element: <Lecturers />
   },
   
   // ראוטים להרצאות
   {
      path: '/lecturers/:lecturerId/lectures',
      element: <LecturerLecturesPage />
   },
   {
      path: '/topics/:categoryId/lectures',
      element: <CategoryLecturesPage />
   },
   
   // דפי התחברות והרשמה
   {
      path: '/login',
      element: <Login onLoginSuccess={() => console.log('Login success')} />
   },
   {
      path: '/register',
      element: <Registration />
   },
   
   // דפים נוספים
   {
      path: '/summarizes',
      element: <ShowSummarizes />
   },
   {
      path: '/files',
      element: <FileList />
   },
   {
      path: '/upload',
      element: <FileUploader />
   },
   
   // דף 404 לכל שאר הנתיבים
   {
      path: '*',
      element: (
         <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fafbfc',
            textAlign: 'center'
         }}>
            <div>
               <h1 style={{
                  fontSize: '72px',
                  color: '#2196f3',
                  margin: '0'
               }}>
                  404
               </h1>
               <h2 style={{ color: '#666' }}>עמוד לא נמצא</h2>
               <p style={{ color: '#999' }}>
                  העמוד שחיפשת לא קיים במערכת
               </p>
               <button
                  onClick={() => window.location.href = '/'}
                  style={{
                     padding: '12px 24px',
                     backgroundColor: '#2196f3',
                     color: 'white',
                     border: 'none',
                     borderRadius: '8px',
                     cursor: 'pointer',
                     fontSize: '16px'
                  }}
               >
                  חזור לדף הבית
               </button>
            </div>
         </div>
      )
   }
]);

export default router;