import './App.css'
import Login from './components/login/Login'
import { UsersProvider } from './components/login/UserProvider';
import Registration from './components/login/Registeration'
import FileUploader from './components/files/FileUploader';
import FileList from './components/files/FileList';
import ShowSummarizes from './components/ShowSummarizes';
import Home from './components/Home';
import { RouterProvider } from 'react-router-dom';
import router from './Router';
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
     <UsersProvider>
      {/* <Login onLoginSuccess={() => console.log('Login successful!')} />
        <Registration/> */}
        {/* <FileUploader></FileUploader>
        <FileList></FileList>
        <ShowSummarizes></ShowSummarizes> */}
        <RouterProvider router={router} />
    </UsersProvider>
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App
