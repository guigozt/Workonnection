export interface PerfilUsuario {
  local?: string;
  foto?: string;
  habilidades?: string[];
}

export interface UsuarioResponseDTO {
  id: number | string;
  nome?: string;
  tipoUsuario?: string;
  perfil?: PerfilUsuario;
}