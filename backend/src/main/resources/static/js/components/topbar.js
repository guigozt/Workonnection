(function () {
  const style = document.createElement("style");
  style.textContent = `
        .topbar {
            background: linear-gradient(135deg, #47a4c4, #d86b6b);
            padding: 0 15px;
            /* Altura reduzida para ser mais discreta */
            height: var(--topbar-height, 75px); 
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: fixed;
            top: 0; left: 0; right: 0;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.12);
        }

        .topbar .logo a { display: flex; align-items: center; }
        .topbar .logo img { height: 35px; } /* Logo ligeiramente menor */

        .search-bar { flex: 1; margin: 0 15px; max-width: 280px; }

        .search-bar input {
            width: 100%;
            border-radius: 20px;
            border: none;
            padding: 6px 14px;
            font-size: 13px;
            background: rgba(255,255,255,0.18);
            color: #fff;
            outline: none;
        }

        .search-bar input::placeholder { color: rgba(255,255,255,0.6); }

        .top-icons { display: flex; align-items: center; gap: 1px; }

        .top-icons a {
            position: relative;
            width: 58px; /* Mais estreito */
            height: 65px;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            transition: all 0.2s ease;
            gap: 2px; /* Espaço mínimo entre ícone e texto */
        }

        .top-icons a i {
            font-size: 16px; /* Ícone reduzido */
        }

        .top-icons a span.icon-text {
            font-size: 9px; /* Texto bem pequeno e discreto */
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.2px;
            opacity: 0.9;
        }

        .top-icons a:hover,
        .top-icons a.ativo {
            background: rgba(255,255,255,0.12);
            color: #fff;
        }

        /* Badge de notificações ajustado para o tamanho slim */
        .notif-badge {
            position: absolute;
            top: 10px; right: 16px;
            width: 14px; height: 14px;
            border-radius: 50%;
            background: #ff4d4d;
            color: #fff;
            font-size: 8px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #fff;
            pointer-events: none;
        }
    `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML(
    "afterbegin",
    `
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
            <a href="/modules/home/home.html"><i class="fas fa-home"></i><span class="icon-text">Home</span></a>
            <a href="/modules/notificacoes/Notificacao.html" id="linkNotificacoes"><i class="fas fa-bell"></i><span class="icon-text">Avisos</span></a>
            <a href="/modules/vagas/Vagas.html"><i class="fas fa-briefcase"></i><span class="icon-text">Vagas</span></a>
            <a href="/modules/colaboradores/Colaboradores.html"><i class="fas fa-users"></i><span class="icon-text">Rede</span></a>
            <a href="/modules/perfil/Perfil.html"><i class="fas fa-user"></i><span class="icon-text">Perfil</span></a>
            <a href="/modules/sobre/Sobre.html"><i class="fas fa-info-circle"></i><span class="icon-text">Sobre</span></a>
            <a href="/modules/configuracoes/Configuracoes.html"><i class="fas fa-cog"></i><span class="icon-text">Opções</span></a>
            <a href="#" id="btnSair"><i class="fas fa-sign-out-alt"></i><span class="icon-text">Sair</span></a>
        </div>
    </div>`,
  );

  // ... (restante do código de logout e marcação de link ativo permanece igual)

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("#btnSair");
    if (!btn) return;
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/usuarios/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.status === 204) {
        window.location.href = "/modules/auth/login.html";
      } else {
        alert("Erro ao sair");
      }
    } catch (err) {
      alert("Erro de conexão com servidor");
    }
  });

  const paginaAtual = window.location.pathname;
  document.querySelectorAll(".top-icons a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (href !== "#" && paginaAtual.includes(href)) link.classList.add("ativo");
  });

  document.addEventListener("usuarioCarregado", (e) => {
    const n = e.detail?.notificacoesNaoLidas || 0;
    atualizarBadge(n);
  });
})();

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
