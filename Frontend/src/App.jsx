import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext';
import {ProtectedRoute}  from './ProtectedRoute';
import { Navigate } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ClientesPage from './pages/ClientPage';
import NewClientPage from './pages/NewClientPage';
import NewUserPage from './pages/NewUserPage';
import UsersPage from './pages/UsersPage';
import AdminPage from './pages/AdminPage';
import IngenieroPage from './pages/IngenieroPage';
function App() {
  return (
    <AuthProvider>
      <Content />
    </AuthProvider>
  );
}

function Content() {
  const { isAuthenticated } = useAuth();
  
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen m-0 p-0">
        <main className="flex-1  m-0 w-full p-0">
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/ingenieropage" element={<IngenieroPage />}/>
              <Route path="/adminpage"element={<AdminPage/>} />
              <Route path="/homepage" element={<HomePage/>} />
              <Route path="/client" element={<ClientesPage/>}/>
              <Route path="/new-client" element={<NewClientPage/>}/>
              <Route path="/new-user" element={isAuthenticated ? <NewUserPage/> : <Navigate to="/" replace/>}/>
              <Route path="/users" element={isAuthenticated ? <UsersPage/> : <Navigate to="/" replace/>}/>
            </Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
