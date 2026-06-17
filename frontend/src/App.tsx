import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import type { ReactNode } from 'react';

const Login = () => <h1>Tela de Login (Visual em breve)</h1>;
const Vagas = () => <h1>Tela de Vagas (Visual em breve)</h1>;

const RotaPrivada = ({ children }: { children: ReactNode }) => {
  const { usuario, loading } = useContext(AuthContext);

  if (loading) return <div> Carregando...</div>;
  if (!usuario) return <Navigate to="/login" />

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route
            path='/vagas'
            element={
              <RotaPrivada>
                <Vagas />
              </RotaPrivada>
            }
          >
          <Route path='*' element={<Navigate to="/login" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
