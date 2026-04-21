// notificacoes.js

const FOTO_DEFAULT = "https://newcastle-online.org/uploads/set_resources_2/84c1e40ea0e759e3f1505eb1788ddf3c_default_photo.png";

const ICONES = {
    like:       { cls: "like",       icon: "fas fa-thumbs-up"  },
    dislike:    { cls: "dislike",    icon: "fas fa-thumbs-down" },
    comentario: { cls: "comentario", icon: "fas fa-comment"    },
    vaga_nova:  { cls: "vaga_nova",  icon: "fas fa-briefcase"  },
};

document.addEventListener("usuarioCarregado", async () => {
    await carregarNotificacoes();

    document.getElementById("btnMarcarTodas")?.addEventListener("click", async () => {
        await fetch("http://localhost:8080/notificacoes/lidas", {
            method: "PATCH", credentials: "include"
        });
        await carregarNotificacoes();
        atualizarBadge(0);
    });

    document.getElementById("btnLimparTodas")?.addEventListener("click", async () => {
        if (!confirm("Limpar todas as notificações?")) return;
        await fetch("http://localhost:8080/notificacoes", {
            method: "DELETE", credentials: "include"
        });
        await carregarNotificacoes();
        atualizarBadge(0);
    });
});

async function carregarNotificacoes() {
    try {
        const res = await fetch("http://localhost:8080/notificacoes", { credentials: "include" });
        if (!res.ok) return;
        const lista = await res.json();
        renderizarNotificacoes(lista);

        const naoLidas = lista.filter(n => !n.lida).length;
        if (typeof atualizarBadge === "function") atualizarBadge(naoLidas);
    } catch (e) {
        console.error("Erro ao carregar notificações:", e);
    }
}

function renderizarNotificacoes(lista) {
    const container = document.getElementById("notificacoes-lista");
    const vazio     = document.getElementById("sem-notificacoes");

    if (!container) return;
    container.innerHTML = "";

    if (!lista.length) {
        if (vazio) vazio.style.display = "block";
        return;
    }

    if (vazio) vazio.style.display = "none";

    lista.forEach(n => {
        const card = criarCard(n);
        container.appendChild(card);
    });
}

function criarCard(n) {
    const card = document.createElement("div");
    card.className = `notificacao-card${n.lida ? "" : " nao-lida"}`;

    const iconeInfo = ICONES[n.tipo] || { cls: "like", icon: "fas fa-bell" };
    const tempo     = formatarTempo(n.criadaEm);

    card.innerHTML = `
        <div class="notif-icone ${iconeInfo.cls}">
            <i class="${iconeInfo.icon}"></i>
        </div>
        <div class="notif-corpo">
            <div class="notif-mensagem">${n.mensagem}</div>
            <div class="notif-tempo">${tempo}</div>
        </div>
        ${!n.lida ? '<div class="notif-ponto"></div>' : ""}
        <button class="btn-excluir-notif" title="Excluir"><i class="fas fa-times"></i></button>
    `;

    // Marcar como lida ao clicar no card
    card.addEventListener("click", async (e) => {
        if (e.target.closest(".btn-excluir-notif")) return;
        if (!n.lida) {
            await fetch(`http://localhost:8080/notificacoes/${n.id}/lida`, {
                method: "PATCH", credentials: "include"
            });
            n.lida = true;
            card.classList.remove("nao-lida");
            card.querySelector(".notif-ponto")?.remove();

            // Atualiza badge
            const naoLidas = document.querySelectorAll(".notificacao-card.nao-lida").length;
            if (typeof atualizarBadge === "function") atualizarBadge(naoLidas);
        }

        // Navega para a vaga se houver referência
        if (n.vagaId) {
            window.location.href = `/modules/home/home.html`;
        }
    });

    // Excluir
    card.querySelector(".btn-excluir-notif").addEventListener("click", async (e) => {
        e.stopPropagation();
        await fetch(`http://localhost:8080/notificacoes/${n.id}`, {
            method: "DELETE", credentials: "include"
        });
        card.style.opacity = "0";
        card.style.transform = "translateX(20px)";
        card.style.transition = "all 0.2s";
        setTimeout(() => {
            card.remove();
            const restantes = document.querySelectorAll(".notificacao-card").length;
            if (!restantes) {
                document.getElementById("sem-notificacoes").style.display = "block";
            }
            const naoLidas = document.querySelectorAll(".notificacao-card.nao-lida").length;
            if (typeof atualizarBadge === "function") atualizarBadge(naoLidas);
        }, 200);
    });

    return card;
}

function formatarTempo(instante) {
    if (!instante) return "";
    const diff = Date.now() - new Date(instante).getTime();
    const min  = Math.floor(diff / 60000);
    const h    = Math.floor(diff / 3600000);
    const d    = Math.floor(diff / 86400000);

    if (min < 1)  return "Agora mesmo";
    if (min < 60) return `${min} min atrás`;
    if (h < 24)   return `${h}h atrás`;
    if (d === 1)  return "Ontem";
    if (d < 7)    return `${d} dias atrás`;
    return new Date(instante).toLocaleDateString("pt-BR");
}