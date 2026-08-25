import React, { useEffect, useState } from 'react';

import type {
  Curso,
  Experiencia,
  Formacao,
  PerfilData,
} from '../../types/perfil';

import styles from './PerfilModal.module.css';

type ModalType =
  | 'contatos'
  | 'sobre'
  | 'habilidade'
  | 'formacao'
  | 'experiencia'
  | 'curso'
  | null;

interface Props {
  tipo: ModalType;
  onClose: () => void;

  perfil: PerfilData;

  formacao?: Formacao;
  experiencia?: Experiencia;
  curso?: Curso;

  onSalvarContatos: (
    dados: Pick<
      PerfilData,
      'local' | 'telefone' | 'instagram' | 'linkedin' | 'site'
    >
  ) => Promise<void>;

  onSalvarSobre: (sobre: string) => Promise<void>;

  onSalvarHabilidade: (
    habilidade: string
  ) => Promise<void>;

  onSalvarFormacao: (
    formacao: Formacao
  ) => Promise<void>;

  onSalvarExperiencia: (
    experiencia: Experiencia
  ) => Promise<void>;

  onSalvarCurso: (
    curso: Curso
  ) => Promise<void>;
}

export const PerfilModal: React.FC<Props> = ({
  tipo,
  onClose,
  perfil,
  formacao,
  experiencia,
  curso,
  onSalvarContatos,
  onSalvarSobre,
  onSalvarHabilidade,
  onSalvarFormacao,
  onSalvarExperiencia,
  onSalvarCurso,
}) => {

  const [local, setLocal] = useState('');
  const [telefone, setTelefone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [site, setSite] = useState('');

  const [sobre, setSobre] = useState('');
  const [habilidade, setHabilidade] = useState('');

  const [universidade, setUniversidade] = useState('');
  const [cursoNome, setCursoNome] = useState('');
  const [periodo, setPeriodo] = useState('');

  const [empresa, setEmpresa] = useState('');
  const [cargo, setCargo] = useState('');
  const [descricao, setDescricao] = useState('');

  const [instituicao, setInstituicao] = useState('');

  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!tipo) return;

    setErro('');

    if (tipo === 'contatos') {
      setLocal(perfil.local || '');
      setTelefone(perfil.telefone || '');
      setInstagram(perfil.instagram || '');
      setLinkedin(perfil.linkedin || '');
      setSite(perfil.site || '');
    }

    if (tipo === 'sobre') {
      setSobre(perfil.sobre || '');
    }

    if (tipo === 'habilidade') {
      setHabilidade('');
    }

    if (tipo === 'formacao') {
      setUniversidade(formacao?.universidade || '');
      setCursoNome(formacao?.curso || '');
      setPeriodo(formacao?.periodo || '');
    }

    if (tipo === 'experiencia') {
      setEmpresa(experiencia?.empresa || '');
      setCargo(experiencia?.cargo || '');
      setPeriodo(experiencia?.periodo || '');
      setDescricao(experiencia?.descricao || '');
    }

    if (tipo === 'curso') {
      setCursoNome(curso?.nome || '');
      setInstituicao(curso?.instituicao || '');
      setPeriodo(curso?.periodo || '');
    }
  }, [
    tipo,
    perfil,
    formacao,
    experiencia,
    curso,
  ]);

  if (!tipo) {
    return null;
  }

  const formatarTelefone = (valor: string) => {
    let v = valor.replace(/\D/g, '');

    if (v.length > 10) {
      v = v.replace(
        /^(\d{2})(\d{5})(\d{4}).*/,
        '($1) $2-$3'
      );
    } else {
      v = v.replace(
        /^(\d{2})(\d{4})(\d{0,4})/,
        '($1) $2-$3'
      );
    }

    return v;
  };

  const validar = async () => {

    if (tipo === 'contatos') {

      if (
        telefone &&
        telefone.replace(/\D/g, '').length < 10
      ) {
        setErro('Telefone incompleto.');
        return;
      }

      if (
        instagram &&
        !instagram.startsWith('@')
      ) {
        setErro('Instagram deve começar com @.');
        return;
      }

      if (
        site &&
        !/^https?:\/\/.+/.test(site)
      ) {
        setErro(
          'Use http:// ou https:// no site.'
        );
        return;
      }

      await onSalvarContatos({
        local,
        telefone,
        instagram,
        linkedin,
        site,
      });

      return;
    }

    if (tipo === 'sobre') {
      if (!sobre) {
        setErro('Campo obrigatório.');
        return;
      }

      if (sobre.length < 10) {
        setErro('Mínimo 10 caracteres.');
        return;
      }

      if (sobre.length > 1000) {
        setErro('Máximo 1000 caracteres.');
        return;
      }

      await onSalvarSobre(sobre);

      return;
    }

    if (tipo === 'habilidade') {

      if (!habilidade) {
        setErro('Digite uma habilidade.');
        return;
      }

      if (habilidade.length < 2) {
        setErro('Mínimo 2 caracteres.');
        return;
      }

      if (habilidade.length > 40) {
        setErro('Máximo 40 caracteres.');
        return;
      }

      try {
        await onSalvarHabilidade(habilidade);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : 'Erro ao adicionar.'
        );
      }

      return;
    }

    if (tipo === 'formacao') {

      if (!universidade || universidade.length < 3) {
        setErro('Universidade: mínimo 3 caracteres.');
        return;
      }

      if (!cursoNome || cursoNome.length < 3) {
        setErro('Curso: mínimo 3 caracteres.');
        return;
      }

      if (!periodo) {
        setErro('Informe o período.');
        return;
      }

      await onSalvarFormacao({
        universidade,
        curso: cursoNome,
        periodo,
      });

      return;
    }

    if (tipo === 'experiencia') {

      if (!empresa || empresa.length < 2) {
        setErro('Empresa: mínimo 2 caracteres.');
        return;
      }

      if (!cargo || cargo.length < 2) {
        setErro('Cargo: mínimo 2 caracteres.');
        return;
      }

      if (!periodo) {
        setErro('Informe o período.');
        return;
      }

      await onSalvarExperiencia({
        empresa,
        cargo,
        periodo,
        descricao,
      });

      return;
    }

    if (tipo === 'curso') {

      if (!cursoNome || cursoNome.length < 3) {
        setErro('Nome do curso: mínimo 3 caracteres.');
        return;
      }

      if (!instituicao || instituicao.length < 2) {
        setErro('Instituição: mínimo 2 caracteres.');
        return;
      }

      if (!periodo) {
        setErro('Informe o período.');
        return;
      }

      await onSalvarCurso({
        nome: cursoNome,
        instituicao,
        periodo,
      });
    }
  };

  const titulo = {
    contatos: 'Editar Contatos',
    sobre: 'Editar Sobre',
    habilidade: 'Adicionar Habilidade',
    formacao: formacao
      ? 'Editar Formação'
      : 'Adicionar Formação',
    experiencia: experiencia
      ? 'Editar Experiência'
      : 'Adicionar Experiência',
    curso: curso
      ? 'Editar Curso'
      : 'Adicionar Curso',
  }[tipo];

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >

        <div className={styles.header}>
          <h5>{titulo}</h5>

          <button onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.body}>

          {tipo === 'contatos' && (
            <>
              <label>Local</label>
              <input
                value={local}
                onChange={(e) =>
                  setLocal(e.target.value)
                }
                placeholder="Ex: São Paulo, SP"
              />

              <label>Telefone</label>
              <input
                value={telefone}
                onChange={(e) =>
                  setTelefone(
                    formatarTelefone(
                      e.target.value
                    )
                  )
                }
                placeholder="(11) 99999-9999"
              />

              <label>Instagram</label>
              <input
                value={instagram}
                onChange={(e) =>
                  setInstagram(e.target.value)
                }
                placeholder="@usuario"
              />

              <label>LinkedIn</label>
              <input
                value={linkedin}
                onChange={(e) =>
                  setLinkedin(e.target.value)
                }
                placeholder="linkedin.com/in/usuario"
              />

              <label>Site</label>
              <input
                value={site}
                onChange={(e) =>
                  setSite(e.target.value)
                }
                placeholder="https://..."
              />
            </>
          )}

          {tipo === 'sobre' && (
            <>
              <label>Texto</label>

              <textarea
                rows={5}
                value={sobre}
                onChange={(e) =>
                  setSobre(e.target.value)
                }
                placeholder="Escreva sobre você..."
              />
            </>
          )}

          {tipo === 'habilidade' && (
            <>
              <label>Habilidade</label>

              <input
                value={habilidade}
                onChange={(e) =>
                  setHabilidade(e.target.value)
                }
                placeholder="Ex: Java, Git, SQL"
              />
            </>
          )}

          {tipo === 'formacao' && (
            <>
              <label>
                Universidade / Instituição
              </label>

              <input
                value={universidade}
                onChange={(e) =>
                  setUniversidade(e.target.value)
                }
                placeholder="Ex: FATEC São Paulo"
              />

              <label>Curso</label>

              <input
                value={cursoNome}
                onChange={(e) =>
                  setCursoNome(e.target.value)
                }
                placeholder="Ex: Análise e Desenvolvimento de Sistemas"
              />

              <label>Período</label>

              <input
                value={periodo}
                onChange={(e) =>
                  setPeriodo(e.target.value)
                }
                placeholder="Ex: 2022 - 2025"
              />
            </>
          )}

          {tipo === 'experiencia' && (
            <>
              <label>Empresa</label>

              <input
                value={empresa}
                onChange={(e) =>
                  setEmpresa(e.target.value)
                }
                placeholder="Ex: Workonnection"
              />

              <label>Cargo</label>

              <input
                value={cargo}
                onChange={(e) =>
                  setCargo(e.target.value)
                }
                placeholder="Ex: Desenvolvedor Frontend"
              />

              <label>Período</label>

              <input
                value={periodo}
                onChange={(e) =>
                  setPeriodo(e.target.value)
                }
                placeholder="Ex: 03/2022 - 07/2023"
              />

              <label>Descrição</label>

              <textarea
                rows={3}
                value={descricao}
                onChange={(e) =>
                  setDescricao(e.target.value)
                }
                placeholder="Descreva suas atividades..."
              />
            </>
          )}

          {tipo === 'curso' && (
            <>
              <label>Nome do Curso</label>

              <input
                value={cursoNome}
                onChange={(e) =>
                  setCursoNome(e.target.value)
                }
                placeholder="Ex: React do Zero ao Avançado"
              />

              <label>Instituição</label>

              <input
                value={instituicao}
                onChange={(e) =>
                  setInstituicao(e.target.value)
                }
                placeholder="Ex: Udemy, Alura, Coursera"
              />

              <label>Período / Ano</label>

              <input
                value={periodo}
                onChange={(e) =>
                  setPeriodo(e.target.value)
                }
                placeholder="Ex: 2024"
              />
            </>
          )}

          {erro && (
            <div className={styles.erro}>
              {erro}
            </div>
          )}

        </div>

        <div className={styles.footer}>

          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="btn btn-primary"
            onClick={validar}
          >
            Salvar
          </button>

        </div>

      </div>
    </div>
  );
};