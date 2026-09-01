import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { Login } from "../pages/Auth/Login/Login";
import { Cadastro } from "../pages/Auth/Cadastro/Cadastro";
import { Home } from "../pages/Home/Home";
import Sobre from "../pages/Sobre/Sobre";
import { Notificacoes } from "../pages/Notificacoes/Notificacoes";
import { Colaboradores } from '../pages/Colaboradores/Colaboradores';

import { PrivateRoute } from "./PrivateRoute";

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/cadastro"
                    element={<Cadastro />}
                />

                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />
                
                <Route
                    path="/notificacoes"
                    element={
                        <PrivateRoute>
                            <Notificacoes />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/colaboradores"
                    element={
                        <PrivateRoute>
                            <Colaboradores />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/sobre"
                    element={
                        <PrivateRoute>
                            <Sobre />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};