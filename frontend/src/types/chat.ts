import type { UsuarioPublicoDTO } from './usuarios';

export interface MensagemDTO {
  conteudo: string;
}

export interface MensagemResponseDTO {
  id: string;
  remetenteId: string;
  destinatarioId: string;
  conteudo: string;
  dataEnvio: string;
  lida: boolean;
  dataLeitura?: string;
  editada?: boolean;
  dataEdicao?: string;
}

export interface ConversaResumoDTO {
  contato: UsuarioPublicoDTO;
  ultimaMensagem: MensagemResponseDTO;
  naoLidasCount: number;
}
