import React, { useState } from 'react';

import type {
  Curso,
  Experiencia,
  Formacao,
  PerfilData,
  PerfilEstudante,
  PerfilMei,
  PerfilMe,
  PerfilEmpresa,
} from '../../types/perfil';

import styles from './PerfilModal.module.css';

export type ModalType =
  | 'contatos'
  | 'sobre'
  | 'habilidade'
  | 'formacao'
  | 'experiencia'
  | 'curso'
  | 'subperfil'
  | null;

interface Props {
  tipo: ModalType;
  tipoUsuario?: string;
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

  onSalvarSubperfil?: (dadosSubperfil: {
    perfilEstudante?: PerfilEstudante;
    perfilMei?: PerfilMei;
    perfilMe?: PerfilMe;
    perfilEmpresa?: PerfilEmpresa;
  }) => Promise<void>;
}

export const PerfilModal: React.FC<Props> = ({
  tipo,
  tipoUsuario,
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
  onSalvarSubperfil,
}) => {
  const [local, setLocal] = useState(() => perfil.local || '');
  const [telefone, setTelefone] = useState(() => perfil.telefone || '');
  const [instagram, setInstagram] = useState(() => perfil.instagram || '');
  const [linkedin, setLinkedin] = useState(() => perfil.linkedin || '');
  const [site, setSite] = useState(() => perfil.site || '');
  const [sobre, setSobre] = useState(() => perfil.sobre || '');
  const [habilidade, setHabilidade] = useState('');

  const [universidade, setUniversidade] = useState(() => formacao?.universidade || '');
  const [cursoNome, setCursoNome] = useState(() => {
    if (tipo === 'formacao') return formacao?.curso || '';
    if (tipo === 'curso') return curso?.nome || '';
    return '';
  });

  const [periodo, setPeriodo] = useState(() => {
    if (tipo === 'formacao') return formacao?.periodo || '';
    if (tipo === 'experiencia') return experiencia?.periodo || '';
    if (tipo === 'curso') return curso?.periodo || '';
    return '';
  });

  const [empresa, setEmpresa] = useState(() => experiencia?.empresa || '');
  const [cargo, setCargo] = useState(() => experiencia?.cargo || '');
  const [descricao, setDescricao] = useState(() => experiencia?.descricao || '');
  const [instituicao, setInstituicao] = useState(() => curso?.instituicao || '');

  // Estados dos Subperfis
  const tipoNorm = (tipoUsuario || 'ESTUDANTE').toUpperCase();

  // Estudante
  const [estInstituicao, setEstInstituicao] = useState(() => perfil.perfilEstudante?.instituicaoEnsino || '');
  const [estCurso, setEstCurso] = useState(() => perfil.perfilEstudante?.curso || '');
  const [estSemestre, setEstSemestre] = useState(() => perfil.perfilEstudante?.semestreAno || '');
  const [estPrevisao, setEstPrevisao] = useState(() => perfil.perfilEstudante?.previsaoConclusao || '');
  const [estTurno, setEstTurno] = useState(() => perfil.perfilEstudante?.turno || '');
  const [estMatricula, setEstMatricula] = useState(() => perfil.perfilEstudante?.matricula || '');
  const [estModalidade, setEstModalidade] = useState(() => perfil.perfilEstudante?.modalidadeInteresse || '');

  // MEI
  const [meiCnpj, setMeiCnpj] = useState(() => perfil.perfilMei?.cnpj || '');
  const [meiRazaoSocial, setMeiRazaoSocial] = useState(() => perfil.perfilMei?.razaoSocial || '');
  const [meiNomeFantasia, setMeiNomeFantasia] = useState(() => perfil.perfilMei?.nomeFantasia || '');
  const [meiOcupacao, setMeiOcupacao] = useState(() => perfil.perfilMei?.ocupacaoPrincipal || '');
  const [meiChavePix, setMeiChavePix] = useState(() => perfil.perfilMei?.chavePix || '');
  const [meiInscricaoMunicipal, setMeiInscricaoMunicipal] = useState(() => perfil.perfilMei?.inscricaoMunicipal || '');
  const [meiEmiteNf, setMeiEmiteNf] = useState(() => perfil.perfilMei?.emiteNotaFiscal || false);

  // ME
  const [meCnpj, setMeCnpj] = useState(() => perfil.perfilMe?.cnpj || '');
  const [meRazaoSocial, setMeRazaoSocial] = useState(() => perfil.perfilMe?.razaoSocial || '');
  const [meNomeFantasia, setMeNomeFantasia] = useState(() => perfil.perfilMe?.nomeFantasia || '');
  const [meCnae, setMeCnae] = useState(() => perfil.perfilMe?.cnaePrincipal || '');
  const [meInscricaoEstadual, setMeInscricaoEstadual] = useState(() => perfil.perfilMe?.inscricaoEstadual || '');
  const [meInscricaoMunicipal, setMeInscricaoMunicipal] = useState(() => perfil.perfilMe?.inscricaoMunicipal || '');
  const [meRegime, setMeRegime] = useState(() => perfil.perfilMe?.regimeTributario || '');
  const [mePorte, setMePorte] = useState(() => perfil.perfilMe?.porteEmpresa || '');
  const [meQtdFuncionarios, setMeQtdFuncionarios] = useState(() =>
    perfil.perfilMe?.quantidadeFuncionarios !== undefined ? String(perfil.perfilMe.quantidadeFuncionarios) : ''
  );

  // Empresa
  const [empCnpj, setEmpCnpj] = useState(() => perfil.perfilEmpresa?.cnpj || '');
  const [empRazaoSocial, setEmpRazaoSocial] = useState(() => perfil.perfilEmpresa?.razaoSocial || '');
  const [empNomeFantasia, setEmpNomeFantasia] = useState(() => perfil.perfilEmpresa?.nomeFantasia || '');
  const [empSetor, setEmpSetor] = useState(() => perfil.perfilEmpresa?.setorAtuacao || '');
  const [empTamanho, setEmpTamanho] = useState(() => perfil.perfilEmpresa?.tamanhoEmpresa || '');
  const [empSiteOficial, setEmpSiteOficial] = useState(() => perfil.perfilEmpresa?.siteOficial || '');
  const [empPaginaCarreiras, setEmpPaginaCarreiras] = useState(() => perfil.perfilEmpresa?.paginaCarreiras || '');
  const [empRhEmail, setEmpRhEmail] = useState(() => perfil.perfilEmpresa?.contatoRhEmail || '');
  const [empRhTelefone, setEmpRhTelefone] = useState(() => perfil.perfilEmpresa?.contatoRhTelefone || '');

  const [erro, setErro] = useState('');

  if (!tipo) {
    return null;
  }

  const formatarTelefone = (valor: string) => {
    let v = valor.replace(/\D/g, '');
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else {
      v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return v;
  };

  const validar = async () => {
    if (tipo === 'contatos') {
      if (telefone && telefone.replace(/\D/g, '').length < 10) {
        setErro('Telefone incompleto.');
        return;
      }

      if (instagram && !instagram.startsWith('@')) {
        setErro('Instagram deve começar com @.');
        return;
      }

      if (site && !/^https?:\/\/.+/.test(site)) {
        setErro('Use http:// ou https:// no site.');
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
      } catch (err: unknown) {
        const error = err as Error;
        setErro(error?.message || 'Erro ao adicionar habilidade');
      }
      return;
    }

    if (tipo === 'formacao') {
      if (!universidade || !cursoNome || !periodo) {
        setErro('Preencha todos os campos obrigatórios.');
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
      if (!empresa || !cargo || !periodo) {
        setErro('Preencha os campos obrigatórios.');
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
      if (!cursoNome || !instituicao || !periodo) {
        setErro('Preencha todos os campos.');
        return;
      }
      await onSalvarCurso({
        nome: cursoNome,
        instituicao,
        periodo,
      });
      return;
    }

    if (tipo === 'subperfil' && onSalvarSubperfil) {
      if (tipoNorm === 'ESTUDANTE') {
        await onSalvarSubperfil({
          perfilEstudante: {
            instituicaoEnsino: estInstituicao,
            curso: estCurso,
            semestreAno: estSemestre,
            previsaoConclusao: estPrevisao,
            turno: estTurno,
            matricula: estMatricula,
            modalidadeInteresse: estModalidade,
          },
        });
      } else if (tipoNorm === 'MEI') {
        await onSalvarSubperfil({
          perfilMei: {
            cnpj: meiCnpj,
            razaoSocial: meiRazaoSocial,
            nomeFantasia: meiNomeFantasia,
            ocupacaoPrincipal: meiOcupacao,
            chavePix: meiChavePix,
            inscricaoMunicipal: meiInscricaoMunicipal,
            emiteNotaFiscal: meiEmiteNf,
          },
        });
      } else if (tipoNorm === 'ME') {
        await onSalvarSubperfil({
          perfilMe: {
            cnpj: meCnpj,
            razaoSocial: meRazaoSocial,
            nomeFantasia: meNomeFantasia,
            cnaePrincipal: meCnae,
            inscricaoEstadual: meInscricaoEstadual,
            inscricaoMunicipal: meInscricaoMunicipal,
            regimeTributario: meRegime,
            porteEmpresa: mePorte,
            quantidadeFuncionarios: meQtdFuncionarios ? parseInt(meQtdFuncionarios, 10) : undefined,
          },
        });
      } else if (tipoNorm === 'EMPRESA') {
        await onSalvarSubperfil({
          perfilEmpresa: {
            cnpj: empCnpj,
            razaoSocial: empRazaoSocial,
            nomeFantasia: empNomeFantasia,
            setorAtuacao: empSetor,
            tamanhoEmpresa: empTamanho,
            siteOficial: empSiteOficial,
            paginaCarreiras: empPaginaCarreiras,
            contatoRhEmail: empRhEmail,
            contatoRhTelefone: empRhTelefone,
          },
        });
      }
      return;
    }
  };

  const getTituloModal = () => {
    switch (tipo) {
      case 'contatos':
        return 'Editar Contatos';
      case 'sobre':
        return 'Editar Sobre';
      case 'habilidade':
        return 'Adicionar Habilidade';
      case 'formacao':
        return formacao ? 'Editar Formação' : 'Adicionar Formação';
      case 'experiencia':
        return experiencia ? 'Editar Experiência' : 'Adicionar Experiência';
      case 'curso':
        return curso ? 'Editar Curso' : 'Adicionar Curso';
      case 'subperfil':
        return `Editar Informações de ${tipoNorm}`;
      default:
        return '';
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h5>{getTituloModal()}</h5>
          <button onClick={onClose}>&times;</button>
        </div>

        <div className={styles.body}>
          {tipo === 'contatos' && (
            <>
              <label>Localização</label>
              <input
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                placeholder="Ex: São Paulo, SP"
              />

              <label>Telefone</label>
              <input
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                placeholder="(00) 00000-0000"
              />

              <label>Instagram</label>
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@seu.usuario"
              />

              <label>LinkedIn</label>
              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="linkedin.com/in/seu-perfil"
              />

              <label>Site</label>
              <input
                value={site}
                onChange={(e) => setSite(e.target.value)}
                placeholder="https://seusite.com"
              />
            </>
          )}

          {tipo === 'sobre' && (
            <>
              <label>Biografia / Sobre você</label>
              <textarea
                value={sobre}
                onChange={(e) => setSobre(e.target.value)}
                placeholder="Conte sobre sua trajetória, conquistas e objetivos..."
              />
            </>
          )}

          {tipo === 'habilidade' && (
            <>
              <label>Habilidade ou Ferramenta</label>
              <input
                value={habilidade}
                onChange={(e) => setHabilidade(e.target.value)}
                placeholder="Ex: React, Java, Gestão Ágil"
                autoFocus
              />
            </>
          )}

          {tipo === 'formacao' && (
            <>
              <label>Instituição de Ensino</label>
              <input
                value={universidade}
                onChange={(e) => setUniversidade(e.target.value)}
                placeholder="Ex: USP, UNIP, Fatec"
              />

              <label>Curso</label>
              <input
                value={cursoNome}
                onChange={(e) => setCursoNome(e.target.value)}
                placeholder="Ex: Ciência da Computação"
              />

              <label>Período / Ano</label>
              <input
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                placeholder="Ex: 2021 - 2025"
              />
            </>
          )}

          {tipo === 'experiencia' && (
            <>
              <label>Empresa</label>
              <input
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Ex: Google, Nubank, Freelance"
              />

              <label>Cargo</label>
              <input
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ex: Desenvolvedor Front-end"
              />

              <label>Período</label>
              <input
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                placeholder="Ex: Jan 2022 - Atual"
              />

              <label>Descrição das Atividades</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva suas atribuições e principais projetos..."
              />
            </>
          )}

          {tipo === 'curso' && (
            <>
              <label>Nome do Curso</label>
              <input
                value={cursoNome}
                onChange={(e) => setCursoNome(e.target.value)}
                placeholder="Ex: React do Zero ao Avançado"
              />

              <label>Instituição</label>
              <input
                value={instituicao}
                onChange={(e) => setInstituicao(e.target.value)}
                placeholder="Ex: Udemy, Alura, Coursera"
              />

              <label>Período / Ano</label>
              <input
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                placeholder="Ex: 2024"
              />
            </>
          )}

          {tipo === 'subperfil' && tipoNorm === 'ESTUDANTE' && (
            <>
              <label>Instituição de Ensino</label>
              <input
                value={estInstituicao}
                onChange={(e) => setEstInstituicao(e.target.value)}
                placeholder="Ex: Faculdade Impacta"
              />

              <label>Curso</label>
              <input
                value={estCurso}
                onChange={(e) => setEstCurso(e.target.value)}
                placeholder="Ex: Engenharia de Software"
              />

              <label>Semestre / Ano</label>
              <input
                value={estSemestre}
                onChange={(e) => setEstSemestre(e.target.value)}
                placeholder="Ex: 5º Semestre"
              />

              <label>Previsão de Conclusão</label>
              <input
                value={estPrevisao}
                onChange={(e) => setEstPrevisao(e.target.value)}
                placeholder="Ex: 12/2026"
              />

              <label>Turno</label>
              <input
                value={estTurno}
                onChange={(e) => setEstTurno(e.target.value)}
                placeholder="Ex: Noturno, Matutino, EAD"
              />

              <label>Matrícula</label>
              <input
                value={estMatricula}
                onChange={(e) => setEstMatricula(e.target.value)}
                placeholder="Ex: 202301928"
              />

              <label>Modalidade de Interesse</label>
              <input
                value={estModalidade}
                onChange={(e) => setEstModalidade(e.target.value)}
                placeholder="Ex: Estágio Remoto / Híbrido"
              />
            </>
          )}

          {tipo === 'subperfil' && tipoNorm === 'MEI' && (
            <>
              <label>CNPJ</label>
              <input
                value={meiCnpj}
                onChange={(e) => setMeiCnpj(e.target.value)}
                placeholder="00.000.000/0001-00"
              />

              <label>Razão Social</label>
              <input
                value={meiRazaoSocial}
                onChange={(e) => setMeiRazaoSocial(e.target.value)}
                placeholder="Razão Social MEI"
              />

              <label>Nome Fantasia</label>
              <input
                value={meiNomeFantasia}
                onChange={(e) => setMeiNomeFantasia(e.target.value)}
                placeholder="Nome Fantasia"
              />

              <label>Ocupação Principal</label>
              <input
                value={meiOcupacao}
                onChange={(e) => setMeiOcupacao(e.target.value)}
                placeholder="Ex: Programador, Designer"
              />

              <label>Chave PIX</label>
              <input
                value={meiChavePix}
                onChange={(e) => setMeiChavePix(e.target.value)}
                placeholder="E-mail, CPF, celular ou aleatória"
              />

              <label>Inscrição Municipal</label>
              <input
                value={meiInscricaoMunicipal}
                onChange={(e) => setMeiInscricaoMunicipal(e.target.value)}
                placeholder="Número da inscrição municipal"
              />

              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  id="chkEmiteNf"
                  type="checkbox"
                  style={{ width: 'auto', cursor: 'pointer' }}
                  checked={meiEmiteNf}
                  onChange={(e) => setMeiEmiteNf(e.target.checked)}
                />
                <label htmlFor="chkEmiteNf" style={{ margin: 0, cursor: 'pointer', textTransform: 'none' }}>
                  Emite Nota Fiscal de Serviços
                </label>
              </div>
            </>
          )}

          {tipo === 'subperfil' && tipoNorm === 'ME' && (
            <>
              <label>CNPJ</label>
              <input
                value={meCnpj}
                onChange={(e) => setMeCnpj(e.target.value)}
                placeholder="00.000.000/0001-00"
              />

              <label>Razão Social</label>
              <input
                value={meRazaoSocial}
                onChange={(e) => setMeRazaoSocial(e.target.value)}
                placeholder="Razão Social LTDA"
              />

              <label>Nome Fantasia</label>
              <input
                value={meNomeFantasia}
                onChange={(e) => setMeNomeFantasia(e.target.value)}
                placeholder="Nome Fantasia"
              />

              <label>CNAE Principal</label>
              <input
                value={meCnae}
                onChange={(e) => setMeCnae(e.target.value)}
                placeholder="Ex: 62.01-5-01"
              />

              <label>Inscrição Estadual</label>
              <input
                value={meInscricaoEstadual}
                onChange={(e) => setMeInscricaoEstadual(e.target.value)}
                placeholder="Inscrição Estadual (se aplicável)"
              />

              <label>Inscrição Municipal</label>
              <input
                value={meInscricaoMunicipal}
                onChange={(e) => setMeInscricaoMunicipal(e.target.value)}
                placeholder="Inscrição Municipal"
              />

              <label>Regime Tributário</label>
              <input
                value={meRegime}
                onChange={(e) => setMeRegime(e.target.value)}
                placeholder="Ex: Simples Nacional, Lucro Presumido"
              />

              <label>Porte da Empresa</label>
              <input
                value={mePorte}
                onChange={(e) => setMePorte(e.target.value)}
                placeholder="Ex: Microempresa (ME)"
              />

              <label>Quantidade de Funcionários</label>
              <input
                type="number"
                value={meQtdFuncionarios}
                onChange={(e) => setMeQtdFuncionarios(e.target.value)}
                placeholder="Ex: 5"
              />
            </>
          )}

          {tipo === 'subperfil' && tipoNorm === 'EMPRESA' && (
            <>
              <label>CNPJ</label>
              <input
                value={empCnpj}
                onChange={(e) => setEmpCnpj(e.target.value)}
                placeholder="00.000.000/0001-00"
              />

              <label>Razão Social</label>
              <input
                value={empRazaoSocial}
                onChange={(e) => setEmpRazaoSocial(e.target.value)}
                placeholder="Razão Social"
              />

              <label>Nome Fantasia</label>
              <input
                value={empNomeFantasia}
                onChange={(e) => setEmpNomeFantasia(e.target.value)}
                placeholder="Nome Fantasia"
              />

              <label>Setor de Atuação</label>
              <input
                value={empSetor}
                onChange={(e) => setEmpSetor(e.target.value)}
                placeholder="Ex: Tecnologia, Financeiro, Varejo"
              />

              <label>Tamanho da Empresa</label>
              <input
                value={empTamanho}
                onChange={(e) => setEmpTamanho(e.target.value)}
                placeholder="Ex: 50-200 funcionários"
              />

              <label>Site Oficial</label>
              <input
                value={empSiteOficial}
                onChange={(e) => setEmpSiteOficial(e.target.value)}
                placeholder="https://empresa.com"
              />

              <label>Página de Carreiras</label>
              <input
                value={empPaginaCarreiras}
                onChange={(e) => setEmpPaginaCarreiras(e.target.value)}
                placeholder="https://empresa.com/carreiras"
              />

              <label>E-mail do RH</label>
              <input
                value={empRhEmail}
                onChange={(e) => setEmpRhEmail(e.target.value)}
                placeholder="vagas@empresa.com"
              />

              <label>Telefone do RH</label>
              <input
                value={empRhTelefone}
                onChange={(e) => setEmpRhTelefone(e.target.value)}
                placeholder="(00) 0000-0000"
              />
            </>
          )}

          {erro && <div className={styles.erro}>{erro}</div>}
        </div>

        <div className={styles.footer}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={validar}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};