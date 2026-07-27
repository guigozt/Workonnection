import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Auth/Login/Login';
import { Cadastro } from '../pages/Auth/Cadastro/Cadastro';
import { PrivateRoute } from './PrivateRoute';

const HomeSimulator = () => <h1>Tela de Home (Se você chegou aqui, o login funcionou! 🎉)</h1>;

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />}/>
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/homesimulator" element={<PrivateRoute> <HomeSimulator /> </PrivateRoute>} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
