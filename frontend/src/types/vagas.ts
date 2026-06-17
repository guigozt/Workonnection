export interface Comentario {
    id?: string;
    usuarioId?: string;
    nomeUsuario: string;
    texto: string;
}

export interface VagaDTO {
    empresa: string;
    cargo: string;
    descricao: string;
    modalidade: string;
    horario: string;
    beneficios: string;
    localizacao: string;
    salario: string;
    data: string;
    requisitos: string;
    email: string;
    tiposUsuario: string[];
}

export interface VagaResponseDTO extends VagaDTO {
    id: string;
    nomeUsuario: string;
    usuarioId: string;
    likes: string[];
    dislikes: string[];
    comentarios: Comentario[];
}