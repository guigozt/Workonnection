(function () {
    const style = document.createElement("style");
    style.textContent = `
        .topbar {
            background: linear-gradient(135deg, #47a4c4, #d86b6b);
            padding: 0 20px;
            height: var(--topbar-height, 70px);
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 1000;
            box-shadow: 0 2px 12px rgba(0,0,0,0.15);
        }

        .topbar .logo a { display: flex; align-items: center; }
        .topbar .logo img { height: 40px; }

        .search-bar { flex: 1; margin: 0 20px; max-width: 360px; }

        .search-bar input {
            width: 100%;
            border-radius: 25px;
            border: none;
            padding: 7px 16px;
            font-size: 14px;
            background: rgba(255,255,255,0.2);
            color: #fff;
            outline: none;
        }

        .search-bar input::placeholder { color: rgba(255,255,255,0.7); }
        .search-bar input:focus { background: rgba(255,255,255,0.3); }

        .top-icons { display: flex; align-items: center; gap: 4px; }

        .top-icons a {
            position: relative;
            width: 38px;
            height: 38px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(255,255,255,0.85);
            font-size: 17px;
            text-decoration: none;
            transition: background 0.16s, color 0.16s;
        }

        .top-icons a:hover,
        .top-icons a.ativo {
            background: rgba(255,255,255,0.18);
            color: #fff;
        }

        /* Badge de notificações */
        .notif-badge {
            position: absolute;
            top: 4px; right: 4px;
            width: 16px; height: 16px;
            border-radius: 50%;
            background: #ff4d4d;
            color: #fff;
            font-size: 9px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1.5px solid #fff;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    document.body.insertAdjacentHTML("afterbegin", `
    <div class="topbar">
        <div class="logo">
            <a href="/modules/home/home.html">
                <img src="/imagens/logo_workonnection.png" alt="WorkConnection">
            </a>
        </div>
        <div class="search-bar">
            <input type="text" placeholder="Pesquisar...">
        </div>
        <div class="top-icons">
            <a href="/modules/home/home.html"                   title="Home">          <i class="fas fa-home"></i></a>
            <a href="/modules/notificacoes/Notificacao.html"    title="Notificações" id="linkNotificacoes">
                <i class="fas fa-bell"></i>
            </a>
            <a href="/modules/vagas/Vagas.html"                 title="Vagas">         <i class="fas fa-briefcase"></i></a>
            <a href="/modules/colaboradores/Colaboradores.html" title="Colaboradores"> <i class="fas fa-users"></i></a>
            <a href="/modules/perfil/Perfil.html"               title="Perfil">        <i class="fas fa-user"></i></a>
            <a href="/modules/chat/Chat.html"                   title="Chat">          <i class="fas fa-comment"></i></a>
            <a href="/modules/sobre/Sobre.html"                 title="Sobre">         <i class="fas fa-info-circle"></i></a>
            <a href="/modules/configuracoes/Configuracoes.html" title="Configurações"> <i class="fas fa-cog"></i></a>
            <a href="#" id="btnSair"                            title="Sair">          <i class="fas fa-sign-out-alt"></i></a>
        </div>
    </div>`);

    // Logout (funciona em todas as páginas)
    document.addEventListener("click", async (e) => {
        const btn = e.target.closest("#btnSair");

        if (!btn) return;

        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8080/usuarios/logout", {
                method: "POST",
                credentials: "include"
            });

            if (res.status === 204) {
                window.location.href = "/modules/auth/login.html";
            } else {
                console.error("Status:", res.status);
                alert("Erro ao sair");
            }

        } catch (err) {
            console.error(err);
            alert("Erro de conexão com servidor");
        }
    });

    // Marca link ativo
    const paginaAtual = window.location.pathname;
    document.querySelectorAll(".top-icons a[href]").forEach(link => {
        const href = link.getAttribute("href");
        if (href !== "#" && paginaAtual.includes(href)) link.classList.add("ativo");
    });

    // Atualiza badge de notificações quando usuarioLogado estiver disponível
    document.addEventListener("usuarioCarregado", (e) => {
        const n = e.detail?.notificacoesNaoLidas || 0;
        atualizarBadge(n);
    });
})();

// Exporta função global para atualizar o badge de qualquer página
function atualizarBadge(count) {
    const link = document.getElementById("linkNotificacoes");
    if (!link) return;
    let badge = link.querySelector(".notif-badge");
    if (count > 0) {
        if (!badge) {
            badge = document.createElement("span");
            badge.className = "notif-badge";
            link.appendChild(badge);
        }
        badge.textContent = count > 99 ? "99+" : count;
    } else {
        badge?.remove();
    }
}