export interface LoginDTO {
    email: string;
    senha: string;
}

export interface CadastroDTO {
    nome: string;
    cpf: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    senha: string;
    tipoUsuario: string;
}

export interface UsuarioResponseDTO {
    id: string;
    nome: string;
    email: string;
    tipoUsuario: string;
}
