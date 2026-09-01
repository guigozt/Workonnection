import React from 'react';
import { Topbar } from '../../components/Topbar/Topbar';
import { UsuarioCard } from '../../components/UsuarioCard/UsuarioCard';
import { useColaboradores } from './useColaboradores';
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

  return (
    <div>
      <Topbar notificacoesNaoLidas={3} />

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
            <h2 style={{ fontWeight: 'bold' }}>
              Colaboradores
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
                ? 'Ver Detalhes'
                : 'Modo Compacto'}
            </button>
          </div>

          {loading ? (
            <p>Carregando rede...</p>
          ) : colaboradores.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: '#888',
              }}
            >
              <UsersIcon
                size={48}
                style={{
                  opacity: 0.3,
                  marginBottom: '16px',
                }}
              />

              <p>Nenhum perfil encontrado.</p>
            </div>
          ) : (
            <div>
              {colaboradores.map((colab) => (
                <UsuarioCard
                  key={colab.id}
                  usuario={colab}
                  compacto={isCompacto}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};