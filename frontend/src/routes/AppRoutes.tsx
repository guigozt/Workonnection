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
import { Colaboradores } from "../pages/Colaboradores/Colaboradores";
import { MinhasVagas } from "../pages/MinhasVagas/MinhasVagas";
import { Perfil } from "../pages/Perfil/Perfil";

import { PrivateRoute } from "./PrivateRoute";

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* Página inicial */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                {/* Autenticação */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/cadastro"
                    element={<Cadastro />}
                />

                {/* Home */}
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />

                {/* Perfil */}
                <Route
                    path="/perfil"
                    element={
                        <PrivateRoute>
                            <Perfil />
                        </PrivateRoute>
                    }
                />

                {/* Notificações */}
                <Route
                    path="/notificacoes"
                    element={
                        <PrivateRoute>
                            <Notificacoes />
                        </PrivateRoute>
                    }
                />

                {/* Colaboradores */}
                <Route
                    path="/colaboradores"
                    element={
                        <PrivateRoute>
                            <Colaboradores />
                        </PrivateRoute>
                    }
                />

                {/* Sobre */}
                <Route
                    path="/sobre"
                    element={
                        <PrivateRoute>
                            <Sobre />
                        </PrivateRoute>
                    }
                />

                {/* Minhas vagas */}
                <Route
                    path="/vagas"
                    element={
                        <PrivateRoute>
                            <MinhasVagas />
                        </PrivateRoute>
                    }
                />

                {/* Qualquer rota inexistente */}
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