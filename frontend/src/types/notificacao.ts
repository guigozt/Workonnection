export type TipoNotificacao =
  | 'like'
  | 'dislike'
  | 'comentario'
  | 'vaga_nova'
  | 'candidatura_nova'
  | 'candidatura_chat'
  | 'candidatura_aceite'
  | 'candidatura_feedback';

export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  mensagem: string;
  remetenteId: string;
  remetenteNome: string;
  lida: boolean;
  criadaEm: string;
  vagaId?: string | null;
}