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
import { normalizarTipoUsuario } from '../../utils/documentosPorCategoria';

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

  const parsePeriodoInicio = (str?: string) => {
    if (!str) return '';
    const partes = str.split(/\s*[-–—aA]\s*/);
    return partes[0]?.trim() || '';
  };

  const parsePeriodoFim = (str?: string) => {
    if (!str) return '';
    const partes = str.split(/\s*[-–—aA]\s*/);
    return partes[1]?.trim() || '';
  };

  const periodoAtual = (() => {
    if (tipo === 'formacao') return formacao?.periodo || '';
    if (tipo === 'experiencia') return experiencia?.periodo || '';
    if (tipo === 'curso') return curso?.periodo || '';
    return '';
  })();

  const [dataInicio, setDataInicio] = useState(() => parsePeriodoInicio(periodoAtual));
  const [dataFim, setDataFim] = useState(() => parsePeriodoFim(periodoAtual));
  const [atualmente, setAtualmente] = useState(() => {
    const f = parsePeriodoFim(periodoAtual).toLowerCase();
    return f.includes('atual') || f.includes('presente');
  });

  const [empresa, setEmpresa] = useState(() => experiencia?.empresa || '');
  const [cargo, setCargo] = useState(() => experiencia?.cargo || '');
  const [descricao, setDescricao] = useState(() => experiencia?.descricao || '');
  const [instituicao, setInstituicao] = useState(() => curso?.instituicao || '');

  // Estados dos Subperfis
  const tipoNorm = normalizarTipoUsuario(tipoUsuario);

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

  const formatarCnpj = (valor: string) => {
    let v = valor.replace(/\D/g, '');
    if (v.length > 14) v = v.slice(0, 14);
    if (v.length > 12) {
      v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, '$1.$2.$3/$4-$5');
    } else if (v.length > 8) {
      v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4})/, '$1.$2.$3/$4');
    } else if (v.length > 5) {
      v = v.replace(/^(\d{2})(\d{3})(\d{0,3})/, '$1.$2.$3');
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,3})/, '$1.$2');
    }
    return v;
  };

  const formatarMesAno = (valor: string) => {
    // Permite formato MM/AAAA
    let v = valor.replace(/\D/g, '');
    if (v.length > 6) v = v.slice(0, 6);
    if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{1,4})/, '$1/$2');
    }
    return v;
  };

  const validarCnpj = (cnpj: string) => {
    const limpo = cnpj.replace(/\D/g, '');
    return limpo.length === 14;
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
      if (!universidade.trim()) {
        setErro('Informe a instituição de ensino.');
        return;
      }
      if (!cursoNome.trim()) {
        setErro('Informe o nome do curso.');
        return;
      }
      if (!dataInicio.trim()) {
        setErro('Informe a data de início (MM/AAAA).');
        return;
      }
      if (!atualmente && !dataFim.trim()) {
        setErro('Informe a data de término/previsão ou marque "Atualmente cursando".');
        return;
      }

      // Validação de formato MM/AAAA ou AAAA
      const regexData = /^(\d{2}\/\d{4}|\d{4})$/;
      if (!regexData.test(dataInicio.trim())) {
        setErro('Data de início inválida. Use o formato MM/AAAA (ex: 02/2021).');
        return;
      }
      if (!atualmente && !regexData.test(dataFim.trim())) {
        setErro('Data de conclusão/previsão inválida. Use o formato MM/AAAA (ex: 12/2025).');
        return;
      }

      const periodoCalculado = atualmente
        ? `${dataInicio.trim()} - Atual`
        : `${dataInicio.trim()} - ${dataFim.trim()}`;

      await onSalvarFormacao({
        universidade: universidade.trim(),
        curso: cursoNome.trim(),
        periodo: periodoCalculado,
      });
      return;
    }

    if (tipo === 'experiencia') {
      if (!empresa.trim()) {
        setErro('Informe a empresa.');
        return;
      }
      if (!cargo.trim()) {
        setErro('Informe o cargo ocupado.');
        return;
      }
      if (!dataInicio.trim()) {
        setErro('Informe a data de início (MM/AAAA).');
        return;
      }
      if (!atualmente && !dataFim.trim()) {
        setErro('Informe a data de término ou marque "Trabalho atualmente aqui".');
        return;
      }

      const regexData = /^(\d{2}\/\d{4}|\d{4})$/;
      if (!regexData.test(dataInicio.trim())) {
        setErro('Data de início inválida. Use o formato MM/AAAA (ex: 03/2022).');
        return;
      }
      if (!atualmente && !regexData.test(dataFim.trim())) {
        setErro('Data de término inválida. Use o formato MM/AAAA (ex: 10/2024).');
        return;
      }

      const periodoCalculado = atualmente
        ? `${dataInicio.trim()} - Atual`
        : `${dataInicio.trim()} - ${dataFim.trim()}`;

      await onSalvarExperiencia({
        empresa: empresa.trim(),
        cargo: cargo.trim(),
        periodo: periodoCalculado,
        descricao: descricao.trim(),
      });
      return;
    }

    if (tipo === 'curso') {
      if (!cursoNome.trim()) {
        setErro('Informe o nome do curso.');
        return;
      }
      if (!instituicao.trim()) {
        setErro('Informe a instituição emissora.');
        return;
      }
      if (!dataInicio.trim()) {
        setErro('Informe a data de conclusão (MM/AAAA).');
        return;
      }

      const regexData = /^(\d{2}\/\d{4}|\d{4})$/;
      if (!regexData.test(dataInicio.trim())) {
        setErro('Data inválida. Use o formato MM/AAAA ou AAAA (ex: 06/2024).');
        return;
      }

      await onSalvarCurso({
        nome: cursoNome.trim(),
        instituicao: instituicao.trim(),
        periodo: dataInicio.trim(),
      });
      return;
    }

    if (tipo === 'subperfil' && onSalvarSubperfil) {
      if (tipoNorm === 'ESTUDANTE') {
        if (!estInstituicao.trim()) {
          setErro('Instituição de ensino é obrigatória.');
          return;
        }
        if (!estCurso.trim()) {
          setErro('Nome do curso é obrigatório.');
          return;
        }
        if (estPrevisao.trim()) {
          const regexData = /^(\d{2}\/\d{4}|\d{4})$/;
          if (!regexData.test(estPrevisao.trim())) {
            setErro('Previsão de conclusão deve estar no formato MM/AAAA (ex: 12/2026).');
            return;
          }
        }

        await onSalvarSubperfil({
          perfilEstudante: {
            instituicaoEnsino: estInstituicao.trim(),
            curso: estCurso.trim(),
            semestreAno: estSemestre.trim(),
            previsaoConclusao: estPrevisao.trim(),
            turno: estTurno.trim(),
            matricula: estMatricula.trim(),
            modalidadeInteresse: estModalidade.trim(),
          },
        });
      } else if (tipoNorm === 'MEI') {
        if (!meiCnpj.trim()) {
          setErro('CNPJ é obrigatório para MEI.');
          return;
        }
        if (!validarCnpj(meiCnpj)) {
          setErro('CNPJ inválido. Digite os 14 dígitos completos.');
          return;
        }
        if (!meiRazaoSocial.trim()) {
          setErro('Razão Social é obrigatória.');
          return;
        }
        if (!meiNomeFantasia.trim()) {
          setErro('Nome Fantasia é obrigatório.');
          return;
        }

        await onSalvarSubperfil({
          perfilMei: {
            cnpj: meiCnpj.trim(),
            razaoSocial: meiRazaoSocial.trim(),
            nomeFantasia: meiNomeFantasia.trim(),
            ocupacaoPrincipal: meiOcupacao.trim(),
            chavePix: meiChavePix.trim(),
            inscricaoMunicipal: meiInscricaoMunicipal.trim(),
            emiteNotaFiscal: meiEmiteNf,
          },
        });
      } else if (tipoNorm === 'ME') {
        if (!meCnpj.trim()) {
          setErro('CNPJ é obrigatório para Microempresa.');
          return;
        }
        if (!validarCnpj(meCnpj)) {
          setErro('CNPJ inválido. Digite os 14 dígitos completos.');
          return;
        }
        if (!meRazaoSocial.trim()) {
          setErro('Razão Social é obrigatória.');
          return;
        }
        if (!meNomeFantasia.trim()) {
          setErro('Nome Fantasia é obrigatório.');
          return;
        }

        await onSalvarSubperfil({
          perfilMe: {
            cnpj: meCnpj.trim(),
            razaoSocial: meRazaoSocial.trim(),
            nomeFantasia: meNomeFantasia.trim(),
            cnaePrincipal: meCnae.trim(),
            inscricaoEstadual: meInscricaoEstadual.trim(),
            inscricaoMunicipal: meInscricaoMunicipal.trim(),
            regimeTributario: meRegime.trim(),
            porteEmpresa: mePorte.trim(),
            quantidadeFuncionarios: meQtdFuncionarios ? parseInt(meQtdFuncionarios, 10) : undefined,
          },
        });
      } else if (tipoNorm === 'EMPRESA') {
        if (!empCnpj.trim()) {
          setErro('CNPJ é obrigatório para Empresa.');
          return;
        }
        if (!validarCnpj(empCnpj)) {
          setErro('CNPJ inválido. Digite os 14 dígitos completos.');
          return;
        }
        if (!empRazaoSocial.trim()) {
          setErro('Razão Social é obrigatória.');
          return;
        }
        if (!empNomeFantasia.trim()) {
          setErro('Nome Fantasia é obrigatório.');
          return;
        }
        if (empRhEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empRhEmail.trim())) {
          setErro('E-mail do RH em formato inválido.');
          return;
        }

        await onSalvarSubperfil({
          perfilEmpresa: {
            cnpj: empCnpj.trim(),
            razaoSocial: empRazaoSocial.trim(),
            nomeFantasia: empNomeFantasia.trim(),
            setorAtuacao: empSetor.trim(),
            tamanhoEmpresa: empTamanho.trim(),
            siteOficial: empSiteOficial.trim(),
            paginaCarreiras: empPaginaCarreiras.trim(),
            contatoRhEmail: empRhEmail.trim(),
            contatoRhTelefone: empRhTelefone.trim(),
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
              <div className={styles.labelRow}>
                <label>Instituição de Ensino</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={universidade}
                onChange={(e) => setUniversidade(e.target.value)}
                placeholder="Ex: USP, UNIP, Fatec"
              />

              <div className={styles.labelRow}>
                <label>Curso</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={cursoNome}
                onChange={(e) => setCursoNome(e.target.value)}
                placeholder="Ex: Ciência da Computação"
              />

              <div className={styles.gridDatas}>
                <div>
                  <div className={styles.labelRow}>
                    <label>Data de Início</label>
                    <span className={styles.tagObrigatorio}>Obrigatório</span>
                  </div>
                  <input
                    value={dataInicio}
                    onChange={(e) => setDataInicio(formatarMesAno(e.target.value))}
                    placeholder="MM/AAAA (ex: 02/2021)"
                  />
                </div>

                <div>
                  <div className={styles.labelRow}>
                    <label>Término / Previsão</label>
                    {!atualmente && <span className={styles.tagObrigatorio}>Obrigatório</span>}
                  </div>
                  <input
                    value={dataFim}
                    disabled={atualmente}
                    onChange={(e) => setDataFim(formatarMesAno(e.target.value))}
                    placeholder="MM/AAAA (ex: 12/2025)"
                  />
                </div>
              </div>

              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  id="chkFormacaoAtual"
                  type="checkbox"
                  style={{ width: 'auto', cursor: 'pointer' }}
                  checked={atualmente}
                  onChange={(e) => {
                    setAtualmente(e.target.checked);
                    if (e.target.checked) setDataFim('');
                  }}
                />
                <label htmlFor="chkFormacaoAtual" style={{ margin: 0, cursor: 'pointer', textTransform: 'none' }}>
                  Atualmente cursando esta formação
                </label>
              </div>
            </>
          )}

          {tipo === 'experiencia' && (
            <>
              <div className={styles.labelRow}>
                <label>Empresa</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
                placeholder="Ex: Google, Nubank, Freelance"
              />

              <div className={styles.labelRow}>
                <label>Cargo</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Ex: Desenvolvedor Front-end"
              />

              <div className={styles.gridDatas}>
                <div>
                  <div className={styles.labelRow}>
                    <label>Data de Início</label>
                    <span className={styles.tagObrigatorio}>Obrigatório</span>
                  </div>
                  <input
                    value={dataInicio}
                    onChange={(e) => setDataInicio(formatarMesAno(e.target.value))}
                    placeholder="MM/AAAA (ex: 03/2022)"
                  />
                </div>

                <div>
                  <div className={styles.labelRow}>
                    <label>Data de Saída</label>
                    {!atualmente && <span className={styles.tagObrigatorio}>Obrigatório</span>}
                  </div>
                  <input
                    value={dataFim}
                    disabled={atualmente}
                    onChange={(e) => setDataFim(formatarMesAno(e.target.value))}
                    placeholder="MM/AAAA (ex: 10/2024)"
                  />
                </div>
              </div>

              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  id="chkExpAtual"
                  type="checkbox"
                  style={{ width: 'auto', cursor: 'pointer' }}
                  checked={atualmente}
                  onChange={(e) => {
                    setAtualmente(e.target.checked);
                    if (e.target.checked) setDataFim('');
                  }}
                />
                <label htmlFor="chkExpAtual" style={{ margin: 0, cursor: 'pointer', textTransform: 'none' }}>
                  Trabalho atualmente nesta empresa / função
                </label>
              </div>

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
              <div className={styles.labelRow}>
                <label>Nome do Curso / Certificação</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={cursoNome}
                onChange={(e) => setCursoNome(e.target.value)}
                placeholder="Ex: React do Zero ao Avançado"
              />

              <div className={styles.labelRow}>
                <label>Instituição Emissora</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={instituicao}
                onChange={(e) => setInstituicao(e.target.value)}
                placeholder="Ex: Udemy, Alura, Coursera, Senac"
              />

              <div className={styles.labelRow}>
                <label>Data de Conclusão</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={dataInicio}
                onChange={(e) => setDataInicio(formatarMesAno(e.target.value))}
                placeholder="MM/AAAA (ex: 06/2024)"
              />
            </>
          )}

          {tipo === 'subperfil' && tipoNorm === 'ESTUDANTE' && (
            <>
              <div className={styles.labelRow}>
                <label>Instituição de Ensino</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={estInstituicao}
                onChange={(e) => setEstInstituicao(e.target.value)}
                placeholder="Ex: Faculdade Impacta"
              />

              <div className={styles.labelRow}>
                <label>Curso</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={estCurso}
                onChange={(e) => setEstCurso(e.target.value)}
                placeholder="Ex: Engenharia de Software"
              />

              <div className={styles.gridDatas}>
                <div>
                  <label>Semestre / Ano</label>
                  <input
                    value={estSemestre}
                    onChange={(e) => setEstSemestre(e.target.value)}
                    placeholder="Ex: 5º Semestre"
                  />
                </div>

                <div>
                  <label>Previsão de Conclusão</label>
                  <input
                    value={estPrevisao}
                    onChange={(e) => setEstPrevisao(formatarMesAno(e.target.value))}
                    placeholder="MM/AAAA (ex: 12/2026)"
                  />
                </div>
              </div>

              <div className={styles.gridDatas}>
                <div>
                  <label>Turno</label>
                  <input
                    value={estTurno}
                    onChange={(e) => setEstTurno(e.target.value)}
                    placeholder="Ex: Noturno, Matutino, EAD"
                  />
                </div>

                <div>
                  <label>Matrícula / RA</label>
                  <input
                    value={estMatricula}
                    onChange={(e) => setEstMatricula(e.target.value)}
                    placeholder="Ex: 202301928"
                  />
                </div>
              </div>

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
              <div className={styles.labelRow}>
                <label>CNPJ (14 dígitos)</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={meiCnpj}
                onChange={(e) => setMeiCnpj(formatarCnpj(e.target.value))}
                placeholder="00.000.000/0001-00"
              />

              <div className={styles.labelRow}>
                <label>Razão Social</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={meiRazaoSocial}
                onChange={(e) => setMeiRazaoSocial(e.target.value)}
                placeholder="Nome do Titular MEI"
              />

              <div className={styles.labelRow}>
                <label>Nome Fantasia</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={meiNomeFantasia}
                onChange={(e) => setMeiNomeFantasia(e.target.value)}
                placeholder="Nome Comercial ou Fantasia"
              />

              <label>Ocupação Principal</label>
              <input
                value={meiOcupacao}
                onChange={(e) => setMeiOcupacao(e.target.value)}
                placeholder="Ex: Programador, Designer, Eletricista"
              />

              <div className={styles.gridDatas}>
                <div>
                  <label>Chave PIX</label>
                  <input
                    value={meiChavePix}
                    onChange={(e) => setMeiChavePix(e.target.value)}
                    placeholder="E-mail, CPF, celular ou chave"
                  />
                </div>

                <div>
                  <label>Inscrição Municipal</label>
                  <input
                    value={meiInscricaoMunicipal}
                    onChange={(e) => setMeiInscricaoMunicipal(e.target.value)}
                    placeholder="Número no município"
                  />
                </div>
              </div>

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
              <div className={styles.labelRow}>
                <label>CNPJ (14 dígitos)</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={meCnpj}
                onChange={(e) => setMeCnpj(formatarCnpj(e.target.value))}
                placeholder="00.000.000/0001-00"
              />

              <div className={styles.labelRow}>
                <label>Razão Social</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={meRazaoSocial}
                onChange={(e) => setMeRazaoSocial(e.target.value)}
                placeholder="Razão Social LTDA"
              />

              <div className={styles.labelRow}>
                <label>Nome Fantasia</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
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

              <div className={styles.gridDatas}>
                <div>
                  <label>Inscrição Estadual</label>
                  <input
                    value={meInscricaoEstadual}
                    onChange={(e) => setMeInscricaoEstadual(e.target.value)}
                    placeholder="IE (se aplicável)"
                  />
                </div>

                <div>
                  <label>Inscrição Municipal</label>
                  <input
                    value={meInscricaoMunicipal}
                    onChange={(e) => setMeInscricaoMunicipal(e.target.value)}
                    placeholder="IM no município"
                  />
                </div>
              </div>

              <div className={styles.gridDatas}>
                <div>
                  <label>Regime Tributário</label>
                  <input
                    value={meRegime}
                    onChange={(e) => setMeRegime(e.target.value)}
                    placeholder="Ex: Simples Nacional"
                  />
                </div>

                <div>
                  <label>Quantidade de Funcionários</label>
                  <input
                    type="number"
                    min="0"
                    value={meQtdFuncionarios}
                    onChange={(e) => setMeQtdFuncionarios(e.target.value)}
                    placeholder="Ex: 8"
                  />
                </div>
              </div>

              <label>Porte da Empresa</label>
              <input
                value={mePorte}
                onChange={(e) => setMePorte(e.target.value)}
                placeholder="Ex: Microempresa (ME)"
              />
            </>
          )}

          {tipo === 'subperfil' && tipoNorm === 'EMPRESA' && (
            <>
              <div className={styles.labelRow}>
                <label>CNPJ (14 dígitos)</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={empCnpj}
                onChange={(e) => setEmpCnpj(formatarCnpj(e.target.value))}
                placeholder="00.000.000/0001-00"
              />

              <div className={styles.labelRow}>
                <label>Razão Social</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={empRazaoSocial}
                onChange={(e) => setEmpRazaoSocial(e.target.value)}
                placeholder="Razão Social completa"
              />

              <div className={styles.labelRow}>
                <label>Nome Fantasia</label>
                <span className={styles.tagObrigatorio}>Obrigatório</span>
              </div>
              <input
                value={empNomeFantasia}
                onChange={(e) => setEmpNomeFantasia(e.target.value)}
                placeholder="Nome Fantasia / Marca"
              />

              <div className={styles.gridDatas}>
                <div>
                  <label>Setor de Atuação</label>
                  <input
                    value={empSetor}
                    onChange={(e) => setEmpSetor(e.target.value)}
                    placeholder="Ex: Tecnologia, Varejo"
                  />
                </div>

                <div>
                  <label>Tamanho da Empresa</label>
                  <input
                    value={empTamanho}
                    onChange={(e) => setEmpTamanho(e.target.value)}
                    placeholder="Ex: 50-200 funcionários"
                  />
                </div>
              </div>

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

              <div className={styles.gridDatas}>
                <div>
                  <label>E-mail do RH</label>
                  <input
                    type="email"
                    value={empRhEmail}
                    onChange={(e) => setEmpRhEmail(e.target.value)}
                    placeholder="vagas@empresa.com"
                  />
                </div>

                <div>
                  <label>Telefone do RH</label>
                  <input
                    value={empRhTelefone}
                    onChange={(e) => setEmpRhTelefone(formatarTelefone(e.target.value))}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
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