import React, { useRef, useState } from 'react';
import type { ArquivoMetadados } from '../../types/perfil';
import {
  DOCUMENTOS_POR_CATEGORIA,
  obterUrlArquivo,
} from '../../utils/documentosPorCategoria';
import styles from './DocumentosSection.module.css';

interface Props {
  tipoUsuario?: string;
  documentos?: ArquivoMetadados[];
  onUploadDocumento: (tipoDocumento: string, arquivo: File) => Promise<void>;
}

export const DocumentosSection: React.FC<Props> = ({
  tipoUsuario,
  documentos = [],
  onUploadDocumento,
}) => {
  const [docEnviando, setDocEnviando] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tipoSelecionado, setTipoSelecionado] = useState<string | null>(null);

  const tipoNormalizado = (tipoUsuario || 'ESTUDANTE').toUpperCase();
  const documentosConfig = DOCUMENTOS_POR_CATEGORIA[tipoNormalizado] || [];

  const handleIniciarUpload = (codigo: string) => {
    setTipoSelecionado(codigo);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !tipoSelecionado) return;

    const extensoesValidas = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];
    if (!extensoesValidas.includes(file.type)) {
      alert('Selecione um arquivo válido (PDF, PNG, JPG ou JPEG).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('O arquivo não pode exceder 10MB.');
      return;
    }

    try {
      setDocEnviando(tipoSelecionado);
      await onUploadDocumento(tipoSelecionado, file);
    } finally {
      setDocEnviando(null);
      setTipoSelecionado(null);
    }
  };

  const formatarTamanho = (bytes: number) => {
    if (!bytes) return '';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <section className={styles.card}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf, .png, .jpg, .jpeg"
        className={styles.hiddenInput}
        onChange={handleFileChange}
      />

      <div className={styles.header}>
        <div>
          <div className={styles.tituloSecao}>
            <i className="fas fa-file-shield" />
            <h3>Documentos Comprobatórios</h3>
          </div>
          <p className={styles.subtitulo}>
            Envie a documentação exigida para validação cadastral da sua categoria ({tipoNormalizado}).
          </p>
        </div>
        <span className={styles.infoBadge}>
          {documentos.length} de {documentosConfig.length} enviados
        </span>
      </div>

      {documentosConfig.some((c) => c.obrigatorio && !documentos.some((d) => d.tipoDocumento?.toUpperCase() === c.codigo)) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          marginBottom: '16px',
          borderRadius: '8px',
          backgroundColor: '#fffbeb',
          border: '1px solid #fef3c7',
          color: '#b45309',
          fontSize: '13px'
        }}>
          <i className="fas fa-triangle-exclamation" />
          <span>Atenção: Você possui documento(s) obrigatório(s) pendente(s) de envio para validação do seu perfil.</span>
        </div>
      )}

      <div className={styles.listaDocumentos}>
        {documentosConfig.map((item) => {
          const docEnviado = documentos.find(
            (d) => d.tipoDocumento?.toUpperCase() === item.codigo
          );
          const estaEnviando = docEnviando === item.codigo;

          return (
            <div key={item.codigo} className={styles.docItem}>
              <div className={styles.docInfo}>
                <div
                  className={`${styles.docIcone} ${
                    docEnviado ? styles.docIconeEnviado : styles.docIconePendente
                  }`}
                >
                  <i
                    className={
                      docEnviado
                        ? 'fas fa-check-circle'
                        : 'fas fa-file-arrow-up'
                    }
                  />
                </div>

                <div className={styles.docDetalhes}>
                  <div className={styles.docNomeRow}>
                    <span className={styles.docNome}>{item.nome}</span>
                    {item.obrigatorio && (
                      <span className={styles.tagObrigatorio}>Obrigatório</span>
                    )}
                  </div>
                  <span className={styles.docDescricao}>{item.descricao}</span>

                  {docEnviado && (
                    <div className={styles.docMeta}>
                      <i className="fas fa-paperclip" />
                      <span>{docEnviado.nomeOriginal}</span>
                      <span>•</span>
                      <span>{formatarTamanho(docEnviado.tamanhoBytes)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.docAcoes}>
                {docEnviado && (
                  <a
                    href={obterUrlArquivo(docEnviado.url)}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.btnAcao}
                    title="Visualizar documento"
                  >
                    <i className="fas fa-arrow-up-right-from-square" />
                    <span>Visualizar</span>
                  </a>
                )}

                <button
                  type="button"
                  className={`${styles.btnAcao} ${
                    !docEnviado ? styles.btnUpload : ''
                  }`}
                  disabled={estaEnviando}
                  onClick={() => handleIniciarUpload(item.codigo)}
                >
                  {estaEnviando ? (
                    <>
                      <i className={`fas fa-spinner ${styles.spinner}`} />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <i
                        className={
                          docEnviado ? 'fas fa-rotate' : 'fas fa-upload'
                        }
                      />
                      <span>{docEnviado ? 'Substituir' : 'Enviar'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
