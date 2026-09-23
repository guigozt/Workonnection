import React, { useEffect } from 'react';
import {
  X,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Check,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { FaLinkedin, FaGithub } from 'react-icons/fa6';
import type { Formacao, Experiencia, Curso } from '../../types/perfil';
import type { UsuarioPublicoDTO, UsuarioResponseDTO } from '../../types/usuarios';
import styles from './PerfilPublicoModal.module.css';

export interface PerfilPublicoModalProps {
  isOpen?: boolean;
  onClose: () => void;
  usuario: UsuarioPublicoDTO | UsuarioResponseDTO | null;
  onSendMessage?: (usuario: UsuarioPublicoDTO | UsuarioResponseDTO) => void;
}

export const PerfilPublicoModal: React.FC<PerfilPublicoModalProps> = ({
  isOpen = true,
  onClose,
  usuario,
  onSendMessage,
}) => {
  // Fecha o modal ao pressionar a tecla ESC
  useEffect(() => {
    if (!isOpen || !usuario) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, usuario, onClose]);

  if (!isOpen || !usuario) {
    return null;
  }

  const nome: string = usuario.nome || 'Usuário';
  const tipoUsuario: string = usuario.tipoUsuario || 'Membro';

  // Obtenção segura dos dados conforme o contrato da Tarefa 1 (LGPD)
  const perfil = usuario.perfil || {};
  const userPub = usuario as UsuarioPublicoDTO;

  const fotoUrl: string =
    userPub.foto ||
    perfil.foto ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      nome
    )}&background=47a4c4&color=fff&size=150`;

  const biografia: string | undefined =
    userPub.biografia || userPub.sobre || perfil.sobre || perfil.biografia;

  const localizacao: string | undefined =
    userPub.cidade || userPub.local || perfil.local || perfil.cidade;

  const habilidades: string[] = Array.isArray(userPub.habilidades)
    ? userPub.habilidades
    : Array.isArray(perfil.habilidades)
    ? perfil.habilidades
    : [];

  const linkedin: string | undefined =
    userPub.linkedin || perfil.linkedin;

  const github: string | undefined =
    userPub.github || perfil.github;

  const portfolio: string | undefined =
    userPub.portfolio || userPub.site || perfil.site || perfil.portfolio;

  // Informações complementares opcionais (exibidas somente se fornecidas)
  const formacoes: Formacao[] = Array.isArray(perfil.formacoes)
    ? perfil.formacoes
    : [];

  const experiencias: Experiencia[] = Array.isArray(perfil.experiencias)
    ? perfil.experiencias
    : [];

  const cursos: Curso[] = Array.isArray(perfil.cursos)
    ? perfil.cursos
    : [];

  // Formatação de links externos
  const getExternalUrl = (url: string) => {
    return url.startsWith('http') ? url : `https://${url}`;
  };

  const getGithubUrl = (userOrUrl: string) => {
    if (userOrUrl.startsWith('http')) return userOrUrl;
    const clean = userOrUrl.replace('@', '').trim();
    return `https://github.com/${clean}`;
  };

  const handleMessageClick = () => {
    if (onSendMessage) {
      onSendMessage(usuario);
    } else {
      alert(`Iniciar conversa com ${nome}`);
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Perfil de ${nome}`}
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner de Capa com Botão Fechar */}
        <div className={styles.coverBanner}>
          <button
            type="button"
            className={styles.btnClose}
            onClick={onClose}
            title="Fechar"
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cabeçalho do Perfil (Avatar, Nome, Tipo e Redes Sociais Públicas) */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarWrapper}>
            <img
              src={fotoUrl}
              alt={`Foto de ${nome}`}
              className={styles.avatar}
            />
            <span className={styles.badgeTipo}>
              {tipoUsuario}
            </span>
          </div>

          <div className={styles.infoPessoa}>
            <h3 className={styles.nome}>{nome}</h3>
          </div>

          {/* Dados Públicos Permitidos: Cidade/Estado e Redes Sociais (LinkedIn, GitHub, Portfólio) */}
          {(localizacao || linkedin || github || portfolio) && (
            <div className={styles.contatosGrid}>
              {localizacao && (
                <div
                  className={styles.contatoItem}
                  title={`Localização: ${localizacao}`}
                >
                  <span className={styles.contatoIcon}>
                    <MapPin size={15} />
                  </span>
                  <span className={styles.contatoTexto}>{localizacao}</span>
                </div>
              )}

              {linkedin && (
                <a
                  href={getExternalUrl(linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contatoItem}
                  title="Perfil no LinkedIn"
                >
                  <span className={styles.contatoIcon}>
                    <FaLinkedin size={15} />
                  </span>
                  <span className={styles.contatoTexto}>LinkedIn</span>
                  <ExternalLink size={11} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </a>
              )}

              {github && (
                <a
                  href={getGithubUrl(github)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contatoItem}
                  title="Perfil no GitHub"
                >
                  <span className={styles.contatoIcon}>
                    <FaGithub size={15} />
                  </span>
                  <span className={styles.contatoTexto}>GitHub</span>
                  <ExternalLink size={11} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </a>
              )}

              {portfolio && (
                <a
                  href={getExternalUrl(portfolio)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contatoItem}
                  title="Portfólio / Website"
                >
                  <span className={styles.contatoIcon}>
                    <Globe size={15} />
                  </span>
                  <span className={styles.contatoTexto}>Portfólio</span>
                  <ExternalLink size={11} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Corpo com Informações Públicas Detalhadas */}
        <div className={styles.modalBody}>
          {/* Seção Biografia */}
          <div className={styles.secao}>
            <div className={styles.secaoTitulo}>Biografia</div>
            {biografia?.trim() ? (
              <p className={styles.sobreTexto}>{biografia}</p>
            ) : (
              <p className={styles.placeholder}>Nenhuma biografia informada.</p>
            )}
          </div>

          {/* Seção Habilidades e Competências */}
          <div className={styles.secao}>
            <div className={styles.secaoTitulo}>Habilidades</div>
            {habilidades.length > 0 ? (
              <div className={styles.habilidadesLista}>
                {habilidades.map((hab, idx) => (
                  <span key={idx} className={styles.habilidadeBadge}>
                    <Check size={13} />
                    {hab}
                  </span>
                ))}
              </div>
            ) : (
              <p className={styles.placeholder}>Nenhuma habilidade informada.</p>
            )}
          </div>

          {/* Seção Experiências (Exibida somente se houver dados no objeto) */}
          {experiencias.length > 0 && (
            <div className={styles.secao}>
              <div className={styles.secaoTitulo}>Experiências Profissionais</div>
              <div className={styles.timelineLista}>
                {experiencias.map((exp, idx) => (
                  <div key={idx} className={styles.timelineItem}>
                    <div className={styles.timelineIconWrapper}>
                      <Briefcase size={18} />
                    </div>
                    <div className={styles.timelineConteudo}>
                      <h4 className={styles.timelineTitulo}>{exp.cargo}</h4>
                      <p className={styles.timelineSubtitulo}>
                        {exp.empresa} {exp.periodo ? `· ${exp.periodo}` : ''}
                      </p>
                      {exp.descricao && (
                        <p className={styles.timelineDescricao}>
                          {exp.descricao}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seção Formações (Exibida somente se houver dados no objeto) */}
          {formacoes.length > 0 && (
            <div className={styles.secao}>
              <div className={styles.secaoTitulo}>Formação Acadêmica</div>
              <div className={styles.timelineLista}>
                {formacoes.map((form, idx) => (
                  <div key={idx} className={styles.timelineItem}>
                    <div className={styles.timelineIconWrapper}>
                      <GraduationCap size={18} />
                    </div>
                    <div className={styles.timelineConteudo}>
                      <h4 className={styles.timelineTitulo}>{form.curso}</h4>
                      <p className={styles.timelineSubtitulo}>
                        {form.universidade} {form.periodo ? `· ${form.periodo}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seção Cursos (Exibida somente se houver dados no objeto) */}
          {cursos.length > 0 && (
            <div className={styles.secao}>
              <div className={styles.secaoTitulo}>Cursos e Certificados</div>
              <div className={styles.timelineLista}>
                {cursos.map((cur, idx) => (
                  <div key={idx} className={styles.timelineItem}>
                    <div className={styles.timelineIconWrapper}>
                      <Award size={18} />
                    </div>
                    <div className={styles.timelineConteudo}>
                      <h4 className={styles.timelineTitulo}>{cur.nome}</h4>
                      <p className={styles.timelineSubtitulo}>
                        {cur.instituicao} {cur.periodo ? `· ${cur.periodo}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.btnSecundario}
            onClick={onClose}
          >
            Fechar
          </button>

          <button
            type="button"
            className={styles.btnPrimario}
            onClick={handleMessageClick}
          >
            <MessageCircle size={16} />
            Mensagem
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfilPublicoModal;
