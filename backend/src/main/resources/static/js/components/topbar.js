(function () {
    const topbarHTML = `
    <div class="topbar">
        <div class="logo">
            <a href="/modules/home/home.html">
                <img src="/imagens/logo_workonnection.png" alt="WorkConnection Logo" style="height: 43px;">
            </a>
        </div>
        <div class="search-bar">
            <input type="text" placeholder="Pesquisar">
        </div>
        <div class="top-icons">
            <a href="/modules/home/home.html"                   title="Home">          <i class="fas fa-home"></i></a>
            <a href="/modules/notificacoes/Notificacao.html"    title="Notificações">  <i class="fas fa-bell"></i></a>
            <a href="/modules/vagas/Vagas.html"                 title="Vagas">         <i class="fas fa-briefcase"></i></a>
            <a href="/modules/colaboradores/Colaboradores.html" title="Colaboradores"> <i class="fas fa-users"></i></a>
            <a href="/modules/perfil/Perfil.html"               title="Perfil">        <i class="fas fa-user"></i></a>
            <a href="/modules/chat/Chat.html"                   title="Chat">          <i class="fas fa-comment"></i></a>
            <a href="/modules/sobre/Sobre.html"                 title="Sobre">         <i class="fas fa-info-circle"></i></a>
            <a href="/modules/configuracoes/Configuracoes.html" title="Configurações"> <i class="fas fa-cog"></i></a>
        </div>
    </div>`;

    document.body.insertAdjacentHTML("afterbegin", topbarHTML);

    // Marca o link ativo com base na URL atual
    const paginaAtual = window.location.pathname;
    document.querySelectorAll(".top-icons a[href]").forEach(link => {
        const href = link.getAttribute("href");
        if (href !== "#" && paginaAtual.includes(href)) {
            link.classList.add("ativo");
        }
    });
})();