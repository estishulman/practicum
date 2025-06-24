import './App.css'
import { UsersProvider } from './components/login/UserProvider';
import { RouterProvider } from 'react-router-dom';
import router from './Router';

function App() {
  return (
    <>
     <UsersProvider>
        <RouterProvider router={router} />
    </UsersProvider>
    </>
  )
}

export default App