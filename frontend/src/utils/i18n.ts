export type Idioma = 'pt-BR' | 'en' | 'es';

export interface Traducoes {
  // Topbar / Geral
  home: string;
  avisos: string;
  chat: string;
  vagas: string;
  rede: string;
  perfil: string;
  sobre: string;
  opcoes: string;
  sair: string;
  pesquisar: string;

  // Configurações
  tituloConfiguracoes: string;
  subtituloConfiguracoes: string;
  
  secaoAparencia: string;
  descAparencia: string;
  temaClaro: string;
  temaEscuro: string;
  temaDescClaro: string;
  temaDescEscuro: string;

  secaoIdioma: string;
  descIdioma: string;
  portugues: string;
  ingles: string;
  espanhol: string;

  secaoContas: string;
  descContas: string;
  contaAtual: string;
  entrarConta: string;
  adicionarConta: string;
  removerContaNavegador: string;
  nenhumaOutraConta: string;

  secaoZonaPerigo: string;
  descZonaPerigo: string;
  excluirContaBtn: string;
  excluirContaDesc: string;
  confirmarExclusao: string;
  cancelar: string;
  excluindo: string;
  sairSiteBtn: string;
  sairSiteDesc: string;
}

export const DICIONARIO: Record<Idioma, Traducoes> = {
  'pt-BR': {
    home: 'Home',
    avisos: 'Avisos',
    chat: 'Chat',
    vagas: 'Vagas',
    rede: 'Rede',
    perfil: 'Perfil',
    sobre: 'Sobre',
    opcoes: 'Opções',
    sair: 'Sair',
    pesquisar: 'Pesquisar...',

    tituloConfiguracoes: 'Configurações da Conta',
    subtituloConfiguracoes: 'Personalize a sua experiência no Workonnection, alterne perfis e configure suas preferências.',

    secaoAparencia: 'Aparência e Tema',
    descAparencia: 'Escolha entre o modo claro e escuro para melhor conforto visual.',
    temaClaro: 'Tema Claro',
    temaEscuro: 'Tema Escuro',
    temaDescClaro: 'Visual limpo e brilhante',
    temaDescEscuro: 'Menor esforço para os olhos em ambientes escuros',

    secaoIdioma: 'Idioma do Sistema',
    descIdioma: 'Selecione a linguagem de preferência para interface.',
    portugues: 'Português (Brasil)',
    ingles: 'English (US)',
    espanhol: 'Español',

    secaoContas: 'Contas neste Navegador',
    descContas: 'Alterne rapidamente entre contas salvas sem precisar digitar suas credenciais novamente.',
    contaAtual: 'Em uso',
    entrarConta: 'Trocar para esta conta',
    adicionarConta: 'Adicionar nova conta',
    removerContaNavegador: 'Remover deste navegador',
    nenhumaOutraConta: 'Nenhuma outra conta salva neste navegador.',

    secaoZonaPerigo: 'Zona de Perigo',
    descZonaPerigo: 'Ações irreversíveis relacionadas à sua conta no Workonnection.',
    excluirContaBtn: 'Excluir minha conta',
    excluirContaDesc: 'Essa ação apagará permanentemente todos os seus dados, vagas e histórico.',
    confirmarExclusao: 'Tem certeza de que deseja excluir permanentemente sua conta? Esta ação não pode ser desfeita.',
    cancelar: 'Cancelar',
    excluindo: 'Excluindo conta...',
    sairSiteBtn: 'Sair do site',
    sairSiteDesc: 'Encerra a sessão da sua conta atual neste navegador.',
  },

  'en': {
    home: 'Home',
    avisos: 'Notices',
    chat: 'Chat',
    vagas: 'Jobs',
    rede: 'Network',
    perfil: 'Profile',
    sobre: 'About',
    opcoes: 'Settings',
    sair: 'Sign Out',
    pesquisar: 'Search...',

    tituloConfiguracoes: 'Account Settings',
    subtituloConfiguracoes: 'Customize your Workonnection experience, switch profiles, and set your preferences.',

    secaoAparencia: 'Appearance & Theme',
    descAparencia: 'Choose between light and dark modes for better visual comfort.',
    temaClaro: 'Light Theme',
    temaEscuro: 'Dark Theme',
    temaDescClaro: 'Clean and bright interface',
    temaDescEscuro: 'Reduces eye strain in low-light environments',

    secaoIdioma: 'System Language',
    descIdioma: 'Select your preferred interface language.',
    portugues: 'Portuguese (Brazil)',
    ingles: 'English (US)',
    espanhol: 'Spanish',

    secaoContas: 'Accounts in this Browser',
    descContas: 'Quickly switch between saved accounts without having to enter credentials again.',
    contaAtual: 'Active',
    entrarConta: 'Switch to this account',
    adicionarConta: 'Add another account',
    removerContaNavegador: 'Remove from browser',
    nenhumaOutraConta: 'No other saved accounts in this browser.',

    secaoZonaPerigo: 'Danger Zone',
    descZonaPerigo: 'Irreversible actions related to your Workonnection account.',
    excluirContaBtn: 'Delete my account',
    excluirContaDesc: 'This action will permanently delete all your data, jobs, and history.',
    confirmarExclusao: 'Are you sure you want to permanently delete your account? This action cannot be undone.',
    cancelar: 'Cancel',
    excluindo: 'Deleting account...',
    sairSiteBtn: 'Log out of site',
    sairSiteDesc: 'Sign out of your active account in this browser.',
  },

  'es': {
    home: 'Inicio',
    avisos: 'Avisos',
    chat: 'Chat',
    vagas: 'Empleos',
    rede: 'Red',
    perfil: 'Perfil',
    sobre: 'Acerca de',
    opcoes: 'Ajustes',
    sair: 'Cerrar sesión',
    pesquisar: 'Buscar...',

    tituloConfiguracoes: 'Configuración de la Cuenta',
    subtituloConfiguracoes: 'Personalice su experiencia en Workonnection, cambie perfiles y configure sus preferencias.',

    secaoAparencia: 'Apariencia y Tema',
    descAparencia: 'Elija entre el modo claro y oscuro para mayor comodidad visual.',
    temaClaro: 'Tema Claro',
    temaEscuro: 'Tema Oscuro',
    temaDescClaro: 'Visual limpio y brillante',
    temaDescEscuro: 'Menor fatiga visual en entornos oscuros',

    secaoIdioma: 'Idioma del Sistema',
    descIdioma: 'Seleccione el idioma de preferencia para la interfaz.',
    portugues: 'Portugués (Brasil)',
    ingles: 'Inglés (EE. UU.)',
    espanhol: 'Español',

    secaoContas: 'Cuentas en este Navegador',
    descContas: 'Cambie rápidamente entre cuentas guardadas sin tener que escribir sus credenciales de nuevo.',
    contaAtual: 'En uso',
    entrarConta: 'Cambiar a esta cuenta',
    adicionarConta: 'Agregar otra cuenta',
    removerContaNavegador: 'Eliminar de este navegador',
    nenhumaOutraConta: 'No hay otras cuentas guardadas en este navegador.',

    secaoZonaPerigo: 'Zona de Peligro',
    descZonaPerigo: 'Acciones irreversibles relacionadas con su cuenta en Workonnection.',
    excluirContaBtn: 'Eliminar mi cuenta',
    excluirContaDesc: 'Esta acción borrará permanentemente todos sus datos, empleos e historial.',
    confirmarExclusao: '¿Está seguro de que desea eliminar permanentemente su cuenta? Esta acción no se puede deshacer.',
    cancelar: 'Cancelar',
    excluindo: 'Eliminando cuenta...',
    sairSiteBtn: 'Cerrar sesión en el sitio',
    sairSiteDesc: 'Cerrar sesión de su cuenta activa en este navegador.',
  },
};
