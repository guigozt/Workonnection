// topbar.js — componente reutilizável (estilo alinhado com modal)

(function () {

    // ── ESTILOS ───────────────────────────────────────────────
    const style = document.createElement("style");
    style.textContent = `
        .topbar {
            position: sticky;
            top: 0;
            z-index: 999;

            display: flex;
            align-items: center;
            justify-content: space-between;

            padding: 10px 24px;
            background: linear-gradient(135deg, #47a4c4 0%, #d86b6b 100%);
            box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        }

        .topbar .logo img {
            height: 42px;
            transition: transform 0.2s;
        }

        .topbar .logo img:hover {
            transform: scale(1.05);
        }

        .search-bar {
            flex: 1;
            max-width: 400px;
            margin: 0 20px;
        }

        .search-bar input {
            width: 100%;
            padding: 8px 14px;
            border-radius: 30px;
            border: none;
            outline: none;

            background: rgba(255,255,255,0.15);
            color: #fff;
            font-size: 14px;

            backdrop-filter: blur(6px);
            transition: 0.2s;
        }

        .search-bar input::placeholder {
            color: rgba(255,255,255,0.8);
        }

        .search-bar input:focus {
            background: rgba(255,255,255,0.25);
        }

        .top-icons {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .top-icons a {
            width: 36px;
            height: 36px;
            border-radius: 10px;

            display: flex;
            align-items: center;
            justify-content: center;

            color: #fff;
            font-size: 14px;
            text-decoration: none;

            transition: all 0.18s;
            position: relative;
        }

        .top-icons a:hover {
            background: rgba(255,255,255,0.2);
            transform: translateY(-2px);
        }

        .top-icons a.ativo {
            background: #fff;
            color: #47a4c4;
            font-weight: bold;
        }

        .top-icons a.ativo:hover {
            transform: none;
        }

        /* Badge (notificação) */
        .tem-badge {
            position: relative;
        }

        .tem-badge .badge {
            position: absolute;
            top: -4px;
            right: -4px;
            background: #ff4d4d;
            color: #fff;
            font-size: 9px;
            padding: 2px 5px;
            border-radius: 10px;
        }

        /* Responsivo */
        @media (max-width: 700px) {
            .search-bar {
                display: none;
            }

            .topbar {
                padding: 10px 12px;
            }
        }
    `;
    document.head.appendChild(style);


    // ── HTML ───────────────────────────────────────────────
    const topbarHTML = `
    <div class="topbar">
        <div class="logo">
            <a href="/modules/home/home.html">
                <img src="/imagens/logo_workonnection.png" alt="WorkConnection Logo">
            </a>
        </div>

        <div class="search-bar">
            <input type="text" placeholder="Pesquisar">
        </div>

        <div class="top-icons">
            <a href="/modules/home/home.html" title="Home">
                <i class="fas fa-home"></i>
            </a>

            <a href="/modules/notificacoes/Notificacao.html" title="Notificações" class="tem-badge">
                <i class="fas fa-bell"></i>
                <span class="badge">3</span>
            </a>

            <a href="/modules/vagas/Vagas.html" title="Vagas">
                <i class="fas fa-briefcase"></i>
            </a>

            <a href="/modules/colaboradores/Colaboradores.html" title="Colaboradores">
                <i class="fas fa-users"></i>
            </a>

            <a href="/modules/perfil/Perfil.html" title="Perfil">
                <i class="fas fa-user"></i>
            </a>

            <a href="/modules/chat/Chat.html" title="Chat">
                <i class="fas fa-comment"></i>
            </a>

            <a href="/modules/sobre/Sobre.html" title="Sobre">
                <i class="fas fa-info-circle"></i>
            </a>

            <a href="/modules/configuracoes/Configuracoes.html" title="Configurações">
                <i class="fas fa-cog"></i>
            </a>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", topbarHTML);


    // ── JS ───────────────────────────────────────────────

    // Marca link ativo
    const paginaAtual = window.location.pathname;

    document.querySelectorAll(".top-icons a[href]").forEach(link => {
        const href = link.getAttribute("href");

        if (href !== "#" && paginaAtual.includes(href)) {
            link.classList.add("ativo");
        }
    });

})();