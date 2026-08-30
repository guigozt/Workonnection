export type TipoNotificacao =
  | 'like'
  | 'dislike'
  | 'comentario'
  | 'vaga_nova';

export interface Notificacao {
  id: number;
  tipo: TipoNotificacao;
  mensagem: string;
  lida: boolean;
  criadaEm: string;
  vagaId?: number;
}