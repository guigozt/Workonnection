export interface LoginDTO {
    email: string;
    senha?: string;
}

export interface CadastroDTO {
    nome: string;
    cpf: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    tipoUsuario: string;
    senha?: string;
}

export interface VerificarCodigoDTO {
    email: string;
    codigo: string;
}

export interface ReenviarCodigoDTO {
    email: string;
}

export interface CompletarCadastroDTO {
    nome: string;
    cpf: string;
    dataNascimento: string;
    telefone: string;
    tipoUsuario: string;
}

export interface ConfiguracoesDTO {
    tema?: string;
    idioma?: string;
}

export interface UsuarioResponseDTO {
    id: string;
    nome: string;
    email: string;
    cpf?: string;
    dataNascimento?: string;
    telefone?: string;
    tipoUsuario: string;
    cadastroCompleto?: boolean;
    foto?: string;
    configuracoes?: ConfiguracoesDTO;
    perfil?: {
        fotoPerfil?: {
            url?: string;
        };
    };
}
