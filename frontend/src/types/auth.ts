export interface LoginDTO {
    email: string;
    senha: string;
}

export interface CompletarCadastroDTO {
    nome: string;
    cpf: string;
    dataNascimento: string;
    telefone: string;
    tipoUsuario: string;
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
}
