export interface TipoDocumentoConfig {
  codigo: string;
  nome: string;
  descricao: string;
  obrigatorio?: boolean;
}

export const normalizarTipoUsuario = (tipo?: string): 'ESTUDANTE' | 'MEI' | 'ME' | 'EMPRESA' => {
  const t = (tipo || 'ESTUDANTE').trim().toUpperCase();
  if (t === 'MICROEMPREENDEDOR' || t === 'MEI') {
    return 'MEI';
  }
  if (t === 'MICROEMPRESA' || t === 'ME') {
    return 'ME';
  }
  if (t === 'EMPRESA') {
    return 'EMPRESA';
  }
  return 'ESTUDANTE';
};

export const DOCUMENTOS_POR_CATEGORIA: Record<string, TipoDocumentoConfig[]> = {
  ESTUDANTE: [
    {
      codigo: 'COMPROVANTE_MATRICULA',
      nome: 'Comprovante de Matrícula',
      descricao: 'Declaração atualizada da instituição de ensino',
      obrigatorio: true,
    },
    {
      codigo: 'HISTORICO_ESCOLAR',
      nome: 'Histórico Escolar / Acadêmico',
      descricao: 'Histórico com notas ou disciplinas cursadas',
    },
    {
      codigo: 'CURRICULO',
      nome: 'Currículo (PDF)',
      descricao: 'Currículo formatado para processos seletivos',
    },
    {
      codigo: 'DOCUMENTO_IDENTIDADE',
      nome: 'Documento de Identidade',
      descricao: 'RG ou CNH com foto',
    },
  ],
  MEI: [
    {
      codigo: 'CCMEI',
      nome: 'Certificado MEI (CCMEI)',
      descricao: 'Certificado da Condição de Microempreendedor Individual',
      obrigatorio: true,
    },
    {
      codigo: 'CARTAO_CNPJ',
      nome: 'Cartão CNPJ',
      descricao: 'Comprovante de Inscrição e de Situação Cadastral na Receita',
      obrigatorio: true,
    },
    {
      codigo: 'DOCUMENTO_TITULAR',
      nome: 'Documento do Titular',
      descricao: 'RG ou CNH do responsável',
    },
  ],
  ME: [
    {
      codigo: 'CARTAO_CNPJ',
      nome: 'Cartão CNPJ',
      descricao: 'Comprovante emitido pela Receita Federal',
      obrigatorio: true,
    },
    {
      codigo: 'CONTRATO_SOCIAL',
      nome: 'Contrato Social',
      descricao: 'Última alteração contratual consolidada',
      obrigatorio: true,
    },
    {
      codigo: 'CERTIDAO_NEGATIVA_DEBITOS',
      nome: 'Certidão Negativa de Débitos (CND)',
      descricao: 'CND da Receita Federal ou FGTS',
    },
    {
      codigo: 'DOC_REPRESENTANTE_LEGAL',
      nome: 'Doc. Representante Legal',
      descricao: 'Documento de identificação do sócio administrador',
    },
  ],
  EMPRESA: [
    {
      codigo: 'CARTAO_CNPJ',
      nome: 'Cartão CNPJ',
      descricao: 'Comprovante de Inscrição na Receita Federal',
      obrigatorio: true,
    },
    {
      codigo: 'COMPROVANTE_ENDERECO_COMERCIAL',
      nome: 'Comprovante de Endereço Comercial',
      descricao: 'Conta de consumo recente ou contrato de locação',
    },
    {
      codigo: 'PROCURACAO_OU_ESTATUTO',
      nome: 'Estatuto Social ou Procuração',
      descricao: 'Estatuto registrado ou procuração dos signatários',
    },
  ],
};

export const obterUrlArquivo = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${cleanPath}`;
};
