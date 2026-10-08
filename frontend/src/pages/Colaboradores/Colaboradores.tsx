import React, { useState } from 'react';
import { Topbar } from '../../components/Topbar/Topbar';
import { UsuarioCard } from '../../components/UsuarioCard/UsuarioCard';
import { PerfilPublicoModal } from '../../components/PerfilPublicoModal/PerfilPublicoModal';
import type { UsuarioPublicoDTO } from '../../types/usuarios';
import { useColaboradores } from './useColaboradores';
import { obterTraducoes } from '../../utils/i18n';
import {
  UsersIcon,
  LayoutGrid,
  LayoutList,
} from 'lucide-react';
import styles from '../Home/Home.module.css';

export const Colaboradores: React.FC = () => {
  const {
    colaboradores,
    loading,
    isCompacto,
    setIsCompacto,
  } = useColaboradores();

  const t = obterTraducoes();

  const [usuarioModal, setUsuarioModal] = useState<UsuarioPublicoDTO | null>(null);

  return (
    <div>
      <Topbar />

      <main className={styles.homeWrapper}>
        <div
          style={{
            maxWidth: '680px',
            margin: '0 auto',
            paddingTop: '100px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <h2 style={{ fontWeight: 'bold', color: 'var(--text-h, inherit)' }}>
              {t.tituloColaboradores}
            </h2>

            {/* Botão para alternar entre Compacto e Expandido */}
            <button
              onClick={() =>
                setIsCompacto(!isCompacto)
              }
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#47a4c4',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
              }}
            >
              {isCompacto ? (
                <LayoutList size={20} />
              ) : (
                <LayoutGrid size={20} />
              )}

              {isCompacto
                ? t.verDetalhes
                : t.modoCompacto}
            </button>
          </div>

          {loading ? (
            <p>{t.carregandoRede}</p>
          ) : colaboradores.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: 'var(--text-light, #888)',
              }}
            >
              <UsersIcon
                size={48}
                style={{
                  opacity: 0.3,
                  marginBottom: '16px',
                }}
              />

              <p>{t.nenhumPerfilEncontrado}</p>
            </div>
          ) : (
            <div>
              {colaboradores.map((colab) => (
                <UsuarioCard
                  key={colab.id}
                  usuario={colab}
                  compacto={isCompacto}
                  onVerPerfil={(u) => setUsuarioModal(u)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <PerfilPublicoModal
        isOpen={!!usuarioModal}
        onClose={() => setUsuarioModal(null)}
        usuario={usuarioModal}
      />
    </div>
  );
};