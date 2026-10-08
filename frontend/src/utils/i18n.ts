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

  // Home e Vagas
  filtroBuscaPlaceholder: string;
  filtroModalidade: string;
  filtroTipo: string;
  filtroTodos: string;
  filtroPresencial: string;
  filtroRemoto: string;
  filtroHibrido: string;
  filtroPrestador: string;
  filtroEstudante: string;
  limparFiltros: string;
  carregandoVagas: string;
  nenhumaVagaEncontrada: string;
  nenhumaVagaSub: string;
  nenhumaVagaCadastrada: string;
  criarNovaVaga: string;
  suaVaga: string;
  candidatarSe: string;
  foraDoPerfil: string;
  beneficios: string;
  requisitos: string;

  // Notificações
  tituloNotificacoes: string;
  carregandoNotificacoes: string;
  nenhumaNotificacao: string;
  marcarLidas: string;
  limparTodas: string;
  confirmarLimparNotificacoes: string;
  agoraMesmo: string;
  minAtras: string;
  horasAtras: string;
  ontem: string;
  diasAtras: string;

  // Rede / Colaboradores
  tituloColaboradores: string;
  modoCompacto: string;
  verDetalhes: string;
  carregandoRede: string;
  nenhumPerfilEncontrado: string;
  verPerfilCompleto: string;

  // Sobre
  sobreTitulo: string;
  sobreSubtitulo: string;
  sobreSecaoDevs: string;
  sobreRapidoTitulo: string;
  sobreRapidoDesc: string;
  sobreAutonomosTitulo: string;
  sobreAutonomosDesc: string;
  sobreMeiTitulo: string;
  sobreMeiDesc: string;

  // Minhas Vagas
  minhasPublicacoes: string;
  painelEstudante: string;
  nenhumaVagaPublicada: string;
  areaCandidaturas: string;
  estudanteDesc: string;
  explorarVagasCompativeis: string;

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

    filtroBuscaPlaceholder: 'Buscar por cargo, empresa, tecnologia...',
    filtroModalidade: 'Modalidade',
    filtroTipo: 'Tipo de Vaga',
    filtroTodos: 'Todos',
    filtroPresencial: 'Presencial',
    filtroRemoto: 'Remoto',
    filtroHibrido: 'Híbrido',
    filtroPrestador: 'Prestador',
    filtroEstudante: 'Estudante',
    limparFiltros: 'Limpar Filtros',
    carregandoVagas: 'Carregando vagas...',
    nenhumaVagaEncontrada: 'Nenhuma vaga encontrada com os critérios informados.',
    nenhumaVagaSub: 'Tente alterar os termos de busca ou remover alguns filtros.',
    nenhumaVagaCadastrada: 'Nenhuma vaga cadastrada no momento para seu perfil.',
    criarNovaVaga: 'Criar Nova Vaga',
    suaVaga: 'Sua vaga',
    candidatarSe: 'Candidatar-se',
    foraDoPerfil: 'Fora do perfil',
    beneficios: 'Benefícios',
    requisitos: 'Requisitos',

    tituloNotificacoes: 'Notificações',
    carregandoNotificacoes: 'Carregando notificações...',
    nenhumaNotificacao: 'Você não possui notificações no momento.',
    marcarLidas: 'Marcar todas como lidas',
    limparTodas: 'Limpar todas',
    confirmarLimparNotificacoes: 'Tem certeza que deseja limpar todas as notificações?',
    agoraMesmo: 'Agora mesmo',
    minAtras: 'min atrás',
    horasAtras: 'h atrás',
    ontem: 'Ontem',
    diasAtras: 'dias atrás',

    tituloColaboradores: 'Colaboradores',
    modoCompacto: 'Modo Compacto',
    verDetalhes: 'Ver Detalhes',
    carregandoRede: 'Carregando rede...',
    nenhumPerfilEncontrado: 'Nenhum perfil encontrado.',
    verPerfilCompleto: 'Ver Perfil',

    sobreTitulo: 'O que você está procurando?',
    sobreSubtitulo: 'Somos uma plataforma inovadora que busca simplificar e tornar o processo seletivo algo mais rápido e menos burocrático. Nunca foi tão simples encontrar a vaga perfeita para você.',
    sobreSecaoDevs: 'Desenvolvedores do Projeto',
    sobreRapidoTitulo: 'Rápido e Simples',
    sobreRapidoDesc: 'Encontre novos trabalhos em minutos. Cadastre-se, crie seu perfil e comece a receber propostas. Rápido, simples e direto ao ponto.',
    sobreAutonomosTitulo: 'Para Autônomos',
    sobreAutonomosDesc: 'Você trabalha por conta? A gente te conecta com clientes de verdade. Mostre suas habilidades e conquiste projetos que pagam.',
    sobreMeiTitulo: 'MEIs para MEIs',
    sobreMeiDesc: 'De microempreendedor para microempreendedor: aqui você se conecta com quem também faz acontecer. Negocie entre MEIs, com segurança e facilidade.',

    minhasPublicacoes: 'Minhas Publicações',
    painelEstudante: 'Painel do Estudante',
    nenhumaVagaPublicada: 'Você ainda não publicou nenhuma vaga.',
    areaCandidaturas: 'Área de Candidaturas',
    estudanteDesc: 'Como estudante, seu perfil é focado na descoberta de vagas temporárias e candidaturas. Em breve, todo o seu histórico de candidaturas e feedbacks estará centralizado aqui!',
    explorarVagasCompativeis: 'Explorar Vagas Compatíveis',

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

    filtroBuscaPlaceholder: 'Search by position, company, technology...',
    filtroModalidade: 'Modality',
    filtroTipo: 'Job Type',
    filtroTodos: 'All',
    filtroPresencial: 'On-site',
    filtroRemoto: 'Remote',
    filtroHibrido: 'Hybrid',
    filtroPrestador: 'Service Provider',
    filtroEstudante: 'Student',
    limparFiltros: 'Clear Filters',
    carregandoVagas: 'Loading jobs...',
    nenhumaVagaEncontrada: 'No jobs found matching the selected criteria.',
    nenhumaVagaSub: 'Try changing your search terms or clearing some filters.',
    nenhumaVagaCadastrada: 'No jobs currently registered for your profile.',
    criarNovaVaga: 'Post New Job',
    suaVaga: 'Your post',
    candidatarSe: 'Apply now',
    foraDoPerfil: 'Not eligible',
    beneficios: 'Benefits',
    requisitos: 'Requirements',

    tituloNotificacoes: 'Notifications',
    carregandoNotificacoes: 'Loading notifications...',
    nenhumaNotificacao: 'You have no notifications at the moment.',
    marcarLidas: 'Mark all as read',
    limparTodas: 'Clear all',
    confirmarLimparNotificacoes: 'Are you sure you want to clear all notifications?',
    agoraMesmo: 'Just now',
    minAtras: 'min ago',
    horasAtras: 'h ago',
    ontem: 'Yesterday',
    diasAtras: 'days ago',

    tituloColaboradores: 'Network Members',
    modoCompacto: 'Compact View',
    verDetalhes: 'Detailed View',
    carregandoRede: 'Loading network...',
    nenhumPerfilEncontrado: 'No profiles found.',
    verPerfilCompleto: 'View Profile',

    sobreTitulo: 'What are you looking for?',
    sobreSubtitulo: 'We are an innovative platform designed to simplify job discovery, making connections faster and free of bureaucracy.',
    sobreSecaoDevs: 'Project Developers',
    sobreRapidoTitulo: 'Fast and Simple',
    sobreRapidoDesc: 'Find new opportunities within minutes. Register, set up your profile, and start receiving offers.',
    sobreAutonomosTitulo: 'For Freelancers',
    sobreAutonomosDesc: 'Are you self-employed? We connect you with real clients looking for your skills.',
    sobreMeiTitulo: 'Business to Business',
    sobreMeiDesc: 'From entrepreneur to entrepreneur: network safely and discover great partners.',

    minhasPublicacoes: 'My Posts',
    painelEstudante: 'Student Portal',
    nenhumaVagaPublicada: 'You have not posted any jobs yet.',
    areaCandidaturas: 'Applications Area',
    estudanteDesc: 'As a student, your profile is focused on temporary job discovery and applications. Soon all your history will be organized here!',
    explorarVagasCompativeis: 'Explore Matching Jobs',

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

    filtroBuscaPlaceholder: 'Buscar por cargo, empresa, tecnología...',
    filtroModalidade: 'Modalidad',
    filtroTipo: 'Tipo de Empleo',
    filtroTodos: 'Todos',
    filtroPresencial: 'Presencial',
    filtroRemoto: 'Remoto',
    filtroHibrido: 'Híbrido',
    filtroPrestador: 'Prestador',
    filtroEstudante: 'Estudiante',
    limparFiltros: 'Limpiar Filtros',
    carregandoVagas: 'Cargando empleos...',
    nenhumaVagaEncontrada: 'No se encontraron empleos con los criterios indicados.',
    nenhumaVagaSub: 'Intente cambiar las palabras de búsqueda o quitar filtros.',
    nenhumaVagaCadastrada: 'No hay empleos registrados para su perfil en este momento.',
    criarNovaVaga: 'Publicar Empleo',
    suaVaga: 'Su publicación',
    candidatarSe: 'Postularse',
    foraDoPerfil: 'Fuera de perfil',
    beneficios: 'Beneficios',
    requisitos: 'Requisitos',

    tituloNotificacoes: 'Notificaciones',
    carregandoNotificacoes: 'Cargando notificaciones...',
    nenhumaNotificacao: 'No tiene notificaciones en este momento.',
    marcarLidas: 'Marcar todas como leídas',
    limparTodas: 'Limpiar todas',
    confirmarLimparNotificacoes: '¿Está seguro de que desea eliminar todas las notificaciones?',
    agoraMesmo: 'Ahora mismo',
    minAtras: 'min atrás',
    horasAtras: 'h atrás',
    ontem: 'Ayer',
    diasAtras: 'días atrás',

    tituloColaboradores: 'Colaboradores',
    modoCompacto: 'Modo Compacto',
    verDetalhes: 'Ver Detalles',
    carregandoRede: 'Cargando red...',
    nenhumPerfilEncontrado: 'No se encontraron perfiles.',
    verPerfilCompleto: 'Ver Perfil',

    sobreTitulo: '¿Qué estás buscando?',
    sobreSubtitulo: 'Somos una plataforma innovadora que busca simplificar el proceso de contratación, haciéndolo más rápido y sin burocracia.',
    sobreSecaoDevs: 'Desarrolladores del Proyecto',
    sobreRapidoTitulo: 'Rápido y Simple',
    sobreRapidoDesc: 'Encuentre nuevos proyectos en minutos. Regístrese, configure su perfil y comience a recibir ofertas.',
    sobreAutonomosTitulo: 'Para Autónomos',
    sobreAutonomosDesc: '¿Trabaja por cuenta propia? Le conectamos con clientes reales interesados en sus servicios.',
    sobreMeiTitulo: 'Entre Emprendedores',
    sobreMeiDesc: 'Haga negocios con otros emprendedores con total confianza y facilidad.',

    minhasPublicacoes: 'Mis Publicaciones',
    painelEstudante: 'Panel del Estudiante',
    nenhumaVagaPublicada: 'Aún no ha publicado ningún empleo.',
    areaCandidaturas: 'Área de Postulaciones',
    estudanteDesc: 'Como estudiante, su perfil está enfocado en descubrir empleos temporales y pasantías. ¡Pronto todo su historial estará aquí!',
    explorarVagasCompativeis: 'Explorar Empleos Compatibles',

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

export const obterTraducoes = (idioma?: string | null): Traducoes => {
  const lang = (idioma || localStorage.getItem('workonnection_idioma') || 'pt-BR') as Idioma;
  return DICIONARIO[lang] || DICIONARIO['pt-BR'];
};
