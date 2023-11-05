import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { TrabajadorProvider } from './context/TrabajadorContext';
import { ClienteProvider } from './context/ClienteContext';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ClientesPage from './pages/ClientPage';
import NewClientPage from './pages/NewClientPage';
import NewPersonalPage from './pages/NewPersonalPage';
import PersonalPage from './pages/PersonalsPage';
import AdminPage from './pages/AdminPage';
import IngenieroPage from './pages/IngenieroPage';

function App() {
  return (
    <AuthProvider>
      <TrabajadorProvider>
      <ClienteProvider>
      <BrowserRouter>
      <div className="flex flex-col min-h-screen m-0 p-0">
        <main className="flex-1 m-0 w-full p-0">
          <Routes>
            <Route path='/' element={<LoginPage />} />

            {/* Rutas protegidas sin roles específicos */}
            <Route element={<ProtectedRoute />}>
              <Route path="/homepage" element={<HomePage />} />
            </Route>

            {/* Rutas protegidas para Admin */}
            <Route element={<ProtectedRoute roles={["Admin"]} />}>
              <Route path="/adminpage" element={<AdminPage />} />
              <Route path="/new-personal" element={<NewPersonalPage />} />
              <Route path="/personals/:id" element={<NewPersonalPage />} />
              <Route path="/personals" element={<PersonalPage />} />
              <Route path="/client" element={<ClientesPage />} />
              <Route path="/new-client" element={<NewClientPage />} />
            </Route>

            {/* Rutas protegidas para Ingeniero */}
            <Route element={<ProtectedRoute roles={["Ingeniero"]} />}>
              <Route path="/ingenieropage" element={<IngenieroPage />} />
            </Route>

          </Routes>
        </main>
      </div>
    </BrowserRouter>
    </ClienteProvider>
      </TrabajadorProvider>
    </AuthProvider>
  );
}

export default App;