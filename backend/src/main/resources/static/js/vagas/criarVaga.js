// criarVaga.js — cards de vaga com like, dislike, comentários e foto do autor

const FOTO_DEFAULT = "https://newcastle-online.org/uploads/set_resources_2/84c1e40ea0e759e3f1505eb1788ddf3c_default_photo.png";

(function injetarEstilos() {
    const s = document.createElement("style");
    s.textContent = `
        .feed {
            max-width: 680px;
            margin: 0 auto;
            padding: 0 16px 80px;
        }

        .vaga-card {
            background: var(--card-bg, #fff);
            border-radius: 18px;
            border: 1px solid #eef0f2;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            margin-bottom: 18px;
            overflow: hidden;
            transition: box-shadow 0.2s;
        }

        .vaga-card:hover { box-shadow: 0 6px 22px rgba(0,0,0,0.09); }

        /* ── Header: avatar + nome + empresa · data + ações do dono ── */
        .vc-header {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 14px 16px 10px;
        }

        .vc-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            flex-shrink: 0;
            border: 2px solid #eef0f2;
        }

        .vc-autor { flex: 1; min-width: 0; }

        .vc-autor-nome {
            font-size: 14px;
            font-weight: 700;
            color: #222;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .vc-autor-meta {
            font-size: 11px;
            color: #aaa;
            margin-top: 1px;
        }

        .vc-header-acoes { display: flex; gap: 6px; flex-shrink: 0; }

        .vc-btn-icone {
            width: 30px;
            height: 30px;
            border-radius: 8px;
            border: 1.5px solid;
            background: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.15s;
            padding: 0;
        }

        .vc-btn-editar  { border-color: var(--primary-dark, #47a4c4); color: var(--primary-dark, #47a4c4); }
        .vc-btn-editar:hover  { background: var(--primary-dark, #47a4c4); color: #fff; }
        .vc-btn-excluir { border-color: #d86b6b; color: #d86b6b; }
        .vc-btn-excluir:hover { background: #d86b6b; color: #fff; }

        /* ── Corpo ── */
        .vc-body { padding: 0 16px 12px; }

        /* Cargo destaque */
        .vc-cargo {
            font-size: 18px;
            font-weight: 800;
            color: #111;
            margin-bottom: 2px;
        }

        /* Empresa */
        .vc-empresa-nome {
            font-size: 13px;
            font-weight: 600;
            color: var(--primary-dark, #47a4c4);
            margin-bottom: 12px;
        }

        /* Descrição — sem clamp, sempre completa */
        .vc-descricao {
            font-size: 13px;
            color: #444;
            line-height: 1.7;
            margin-bottom: 14px;
        }

        /* Seção de detalhes: benefícios + requisitos lado a lado */
        .vc-detalhes {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 14px;
        }

        .vc-detalhe-bloco {
            background: #f7f9fb;
            border-radius: 10px;
            padding: 10px 12px;
        }

        .vc-detalhe-label {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #aaa;
            margin-bottom: 4px;
        }

        .vc-detalhe-valor {
            font-size: 12px;
            color: #555;
            line-height: 1.5;
        }

        /* Tags de info (modalidade, local, horário, salário) */
        .vc-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 12px;
        }

        .vc-tag {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            color: #666;
            background: #f4f6f8;
            border-radius: 20px;
            padding: 4px 10px;
            font-weight: 500;
        }

        .vc-tag i { color: var(--primary-dark, #47a4c4); font-size: 10px; }

        /* Chips de quem pode se candidatar */
        .vc-chips { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 4px; }

        .vc-chip {
            font-size: 10px;
            font-weight: 700;
            padding: 3px 9px;
            border-radius: 20px;
            background: #eef7fb;
            color: var(--primary-dark, #47a4c4);
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }

        /* ── Barra de ações ── */
        .vc-acoes {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 8px 12px;
            border-top: 1px solid #f0f2f4;
        }

        .vc-acao-btn {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 6px 10px;
            border-radius: 8px;
            border: none;
            background: transparent;
            font-size: 13px;
            font-weight: 600;
            color: #777;
            cursor: pointer;
            transition: all 0.15s;
        }

        .vc-acao-btn:hover { background: #f4f6f8; color: #444; }
        .vc-acao-btn.liked    { color: #47a4c4; }
        .vc-acao-btn.disliked { color: #d86b6b; }
        .vc-acao-btn i { font-size: 14px; }

        .vc-spacer { flex: 1; }

        .btn-candidatar-card {
            padding: 7px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            border: none;
            cursor: pointer;
            transition: all 0.16s;
            text-decoration: none;
            display: inline-block;
            line-height: 1.4;
        }

        .btn-candidatar-card.ativo {
            background: var(--gradient, linear-gradient(135deg, #47a4c4, #d86b6b));
            color: #fff;
        }

        .btn-candidatar-card.ativo:hover { opacity: 0.88; transform: translateY(-1px); }

        .btn-candidatar-card.bloqueado {
            background: #f0f2f4;
            color: #bbb;
            cursor: default;
            font-size: 11px;
        }

        .btn-candidatar-card.dono {
            background: transparent;
            color: #aaa;
            font-size: 11px;
            cursor: default;
        }

        /* ── Drawer de comentários ── */
        .comentarios-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            z-index: 1050;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.22s;
        }

        .comentarios-overlay.aberto {
            opacity: 1;
            pointer-events: all;
        }

        .comentarios-drawer {
            position: fixed;
            right: 0; top: 0; bottom: 0;
            width: min(420px, 100vw);
            background: #fff;
            display: flex;
            flex-direction: column;
            z-index: 1051;
            transform: translateX(100%);
            transition: transform 0.26s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: -8px 0 32px rgba(0,0,0,0.12);
        }

        .comentarios-overlay.aberto .comentarios-drawer {
            transform: translateX(0);
        }

        .comentarios-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            border-bottom: 1px solid #f0f2f4;
            flex-shrink: 0;
        }

        .comentarios-header h6 {
            margin: 0;
            font-size: 15px;
            font-weight: 700;
            color: #222;
        }

        .btn-fechar-drawer {
            width: 32px; height: 32px;
            border-radius: 50%;
            border: none;
            background: #f4f6f8;
            color: #777;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            transition: background 0.15s;
        }

        .btn-fechar-drawer:hover { background: #e8ecef; }

        .comentarios-lista {
            flex: 1;
            overflow-y: auto;
            padding: 12px 20px;
        }

        .comentario-item {
            display: flex;
            gap: 10px;
            margin-bottom: 16px;
        }

        .comentario-avatar {
            width: 34px; height: 34px;
            border-radius: 50%;
            object-fit: cover;
            flex-shrink: 0;
            border: 1.5px solid #eef0f2;
        }

        .comentario-corpo { flex: 1; }

        .comentario-nome {
            font-size: 13px;
            font-weight: 700;
            color: #222;
            margin-bottom: 2px;
        }

        .comentario-texto {
            font-size: 13px;
            color: #444;
            line-height: 1.5;
        }

        .comentario-meta {
            font-size: 11px;
            color: #bbb;
            margin-top: 3px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .comentario-excluir {
            background: none;
            border: none;
            color: #d86b6b;
            font-size: 11px;
            cursor: pointer;
            padding: 0;
            font-weight: 600;
        }

        .comentarios-vazio {
            text-align: center;
            color: #bbb;
            font-size: 13px;
            margin-top: 40px;
        }

        .comentarios-footer {
            padding: 12px 20px;
            border-top: 1px solid #f0f2f4;
            display: flex;
            gap: 8px;
            flex-shrink: 0;
        }

        .comentarios-footer input {
            flex: 1;
            border: 1.5px solid #e8ecef;
            border-radius: 20px;
            padding: 9px 14px;
            font-size: 13px;
            outline: none;
            font-family: inherit;
        }

        .comentarios-footer input:focus {
            border-color: var(--primary-dark, #47a4c4);
            box-shadow: 0 0 0 3px rgba(71,164,196,0.12);
        }

        .btn-enviar-comentario {
            width: 38px; height: 38px;
            border-radius: 50%;
            border: none;
            background: var(--gradient, linear-gradient(135deg, #47a4c4, #d86b6b));
            color: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            flex-shrink: 0;
            transition: opacity 0.15s, transform 0.12s;
        }

        .btn-enviar-comentario:hover { opacity: 0.88; transform: scale(1.05); }

        @media (max-width: 600px) {
            .feed { padding: 0 8px 80px; }
            .vc-detalhes { grid-template-columns: 1fr; }
            .comentarios-drawer { width: 100vw; }
        }
    `;
    document.head.appendChild(s);
})();

// ── Drawer de comentários ─────────────────────────────────────────────────────

let vagaAtiva = null;

function criarDrawer() {
    const overlay = document.createElement("div");
    overlay.className = "comentarios-overlay";
    overlay.innerHTML = `
        <div class="comentarios-drawer">
            <div class="comentarios-header">
                <h6>Comentários</h6>
                <button class="btn-fechar-drawer"><i class="fas fa-times"></i></button>
            </div>
            <div class="comentarios-lista" id="drawerLista"></div>
            <div class="comentarios-footer">
                <input id="drawerInput" placeholder="Adicione um comentário..." maxlength="500">
                <button class="btn-enviar-comentario" id="drawerEnviar">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector(".btn-fechar-drawer").addEventListener("click", fecharDrawer);
    overlay.addEventListener("click", e => { if (e.target === overlay) fecharDrawer(); });
    return overlay;
}

const drawer = criarDrawer();

function abrirDrawer(vaga, usuarioLogado) {
    vagaAtiva = vaga;
    renderDrawer(vaga, usuarioLogado);
    drawer.classList.add("aberto");
}

function fecharDrawer() {
    drawer.classList.remove("aberto");
    vagaAtiva = null;
}

function renderDrawer(vaga, usuarioLogado) {
    const lista = drawer.querySelector("#drawerLista");
    const comentarios = vaga.comentarios || [];

    if (!comentarios.length) {
        lista.innerHTML = `<p class="comentarios-vazio">Nenhum comentário ainda.<br>Seja o primeiro!</p>`;
    } else {
        lista.innerHTML = comentarios.map(c => {
            const podeExcluir = usuarioLogado &&
                (c.usuarioId === usuarioLogado.id || vaga.usuarioId === usuarioLogado.id);
            const data = c.criadoEm ? new Date(c.criadoEm).toLocaleDateString("pt-BR") : "";
            return `
            <div class="comentario-item" data-id="${c.id}">
                <img class="comentario-avatar" src="${FOTO_DEFAULT}" alt="">
                <div class="comentario-corpo">
                    <div class="comentario-nome">${c.nomeUsuario || "Usuário"}</div>
                    <div class="comentario-texto">${c.texto}</div>
                    <div class="comentario-meta">
                        <span>${data}</span>
                        ${podeExcluir ? `<button class="comentario-excluir" data-cid="${c.id}">Excluir</button>` : ""}
                    </div>
                </div>
            </div>`;
        }).join("");

        lista.querySelectorAll(".comentario-excluir").forEach(btn => {
            btn.addEventListener("click", async () => {
                const cid = btn.dataset.cid;
                try {
                    const res = await fetch(`http://localhost:8080/vagas/${vaga.id}/comentarios/${cid}`, {
                        method: "DELETE", credentials: "include"
                    });
                    if (!res.ok) return;
                    const v = await res.json();
                    Object.assign(vaga, v);
                    renderDrawer(v, usuarioLogado);
                    atualizarContadorComentarios(vaga.id, v.comentarios?.length || 0);
                } catch (e) { console.error(e); }
            });
        });
    }

    const input  = drawer.querySelector("#drawerInput");
    const btnEnv = drawer.querySelector("#drawerEnviar");
    const novoBtnEnv = btnEnv.cloneNode(true);
    btnEnv.replaceWith(novoBtnEnv);

    async function enviarComentario() {
        const texto = input.value.trim();
        if (!texto) return;
        try {
            const res = await fetch(`http://localhost:8080/vagas/${vaga.id}/comentarios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ texto })
            });
            if (!res.ok) return;
            const v = await res.json();
            Object.assign(vaga, v);
            input.value = "";
            renderDrawer(v, usuarioLogado);
            atualizarContadorComentarios(vaga.id, v.comentarios?.length || 0);
        } catch (e) { console.error(e); }
    }

    novoBtnEnv.addEventListener("click", enviarComentario);
    input.addEventListener("keydown", e => { if (e.key === "Enter") enviarComentario(); });
}

function atualizarContadorComentarios(vagaId, count) {
    const el = document.querySelector(`[data-vaga-id="${vagaId}"] .vc-count-comentario`);
    if (el) el.textContent = count;
}

// ── Lógica principal ──────────────────────────────────────────────────────────

document.addEventListener("usuarioCarregado", (event) => {
    const usuarioLogado  = event.detail;
    const vagasContainer = document.getElementById("vagas-container");
    const botaoPublicar  = document.querySelector(".botao-publicar");

    if (!vagasContainer.classList.contains("feed")) {
        vagasContainer.classList.add("feed");
    }

    botaoPublicar?.addEventListener("click", () => window.ModalVaga.abrirParaCriar());
    window.ModalVaga.onSalvar(() => carregarVagas());

    function podeSeCandidar(vaga) {
        if (!usuarioLogado || vaga.usuarioId === usuarioLogado.id) return false;
        const tipos = vaga.tiposUsuario || [];
        if (!tipos.length || tipos.includes("todos")) return true;
        const tipo = (usuarioLogado.tipoUsuario || "").toLowerCase();
        if (tipos.includes("prestador") && ["empresa","mei","me"].includes(tipo)) return true;
        if (tipos.includes("estudante") && tipo === "estudante") return true;
        return false;
    }

    function labelTipos(tipos) {
        if (!tipos?.length || tipos.includes("todos")) return ["Todos"];
        return tipos.map(t => t === "prestador" ? "Prestadores" : "Estudantes");
    }

    async function carregarVagas() {
        try {
            const res   = await fetch("http://localhost:8080/vagas", { credentials: "include" });
            const vagas = await res.json();
            renderizarVagas(vagas);
        } catch (e) { console.error("Erro ao carregar vagas:", e); }
    }

    function renderizarVagas(vagas) {
        if (!vagasContainer) return;
        vagasContainer.innerHTML = "";
        if (!vagas.length) {
            vagasContainer.innerHTML = `<p style="text-align:center;color:#aaa;margin-top:60px;font-size:14px;">Nenhuma vaga publicada ainda.</p>`;
            return;
        }
        vagas.forEach(vaga => criarCard(vaga));
    }

    function criarCard(vaga) {
        const isDono   = usuarioLogado && vaga.usuarioId === usuarioLogado.id;
        const podeCand = podeSeCandidar(vaga);
        const chips    = labelTipos(vaga.tiposUsuario);

        const euCurtiu    = usuarioLogado && (vaga.likes    || []).includes(usuarioLogado.id);
        const euDescurtiu = usuarioLogado && (vaga.dislikes || []).includes(usuarioLogado.id);

        const nLikes       = (vaga.likes       || []).length;
        const nDislikes    = (vaga.dislikes    || []).length;
        const nComentarios = (vaga.comentarios || []).length;

        const card = document.createElement("div");
        card.className = "vaga-card";
        card.dataset.vagaId = vaga.id;

        card.innerHTML = `
            <!-- Header: foto + nome do usuário + cargo/empresa + data + ações do dono -->
            <div class="vc-header">
                <img class="vc-avatar" src="${FOTO_DEFAULT}" alt="Foto do autor">
                <div class="vc-autor">
                    <div class="vc-autor-nome">${vaga.nomeUsuario || "Usuário"}</div>
                    <div class="vc-autor-meta">${vaga.empresa} · ${vaga.data || ""}</div>
                </div>
                ${isDono ? `
                <div class="vc-header-acoes">
                    <button class="vc-btn-icone vc-btn-editar" title="Editar"><i class="fas fa-pen"></i></button>
                    <button class="vc-btn-icone vc-btn-excluir" title="Excluir"><i class="fas fa-trash"></i></button>
                </div>` : ""}
            </div>

            <!-- Corpo: cargo → empresa → descrição → benefícios/requisitos → modalidade e info -->
            <div class="vc-body">

                <div class="vc-cargo">${vaga.cargo}</div>
                <div class="vc-empresa-nome">${vaga.empresa}</div>

                <p class="vc-descricao">${vaga.descricao}</p>

                <div class="vc-detalhes">
                    <div class="vc-detalhe-bloco">
                        <div class="vc-detalhe-label">Benefícios</div>
                        <div class="vc-detalhe-valor">${vaga.beneficios || "—"}</div>
                    </div>
                    <div class="vc-detalhe-bloco">
                        <div class="vc-detalhe-label">Requisitos</div>
                        <div class="vc-detalhe-valor">${vaga.requisitos || "—"}</div>
                    </div>
                </div>

                <div class="vc-tags">
                    <span class="vc-tag"><i class="fas fa-laptop-house"></i>${vaga.modalidade}</span>
                    <span class="vc-tag"><i class="fas fa-location-dot"></i>${vaga.localizacao}</span>
                    <span class="vc-tag"><i class="fas fa-clock"></i>${vaga.horario}</span>
                    <span class="vc-tag"><i class="fas fa-dollar-sign"></i>${vaga.salario}</span>
                </div>

                <div class="vc-chips">
                    ${chips.map(c => `<span class="vc-chip">${c}</span>`).join("")}
                </div>

            </div>

            <!-- Ações: like, dislike, comentários + candidatar -->
            <div class="vc-acoes">
                <button class="vc-acao-btn btn-like ${euCurtiu ? "liked" : ""}" title="Curtir">
                    <i class="fa${euCurtiu ? "s" : "r"} fa-thumbs-up"></i>
                    <span class="vc-count-like">${nLikes}</span>
                </button>
                <button class="vc-acao-btn btn-dislike ${euDescurtiu ? "disliked" : ""}" title="Não curtir">
                    <i class="fa${euDescurtiu ? "s" : "r"} fa-thumbs-down"></i>
                    <span class="vc-count-dislike">${nDislikes}</span>
                </button>
                <button class="vc-acao-btn btn-comentar" title="Comentários">
                    <i class="far fa-comment"></i>
                    <span class="vc-count-comentario">${nComentarios}</span>
                </button>

                <span class="vc-spacer"></span>

                ${isDono
                    ? `<span class="btn-candidatar-card dono">Sua vaga</span>`
                    : podeCand
                        ? `<a href="mailto:${vaga.email}" class="btn-candidatar-card ativo">Candidatar-se</a>`
                        : `<span class="btn-candidatar-card bloqueado">Fora do perfil</span>`
                }
            </div>
        `;

        // Like
        card.querySelector(".btn-like").addEventListener("click", async () => {
            try {
                const res = await fetch(`http://localhost:8080/vagas/${vaga.id}/like`, {
                    method: "POST", credentials: "include"
                });
                if (!res.ok) return;
                const v = await res.json();
                Object.assign(vaga, v);
                atualizarReacoes(card, v, usuarioLogado);
            } catch (e) { console.error(e); }
        });

        // Dislike
        card.querySelector(".btn-dislike").addEventListener("click", async () => {
            try {
                const res = await fetch(`http://localhost:8080/vagas/${vaga.id}/dislike`, {
                    method: "POST", credentials: "include"
                });
                if (!res.ok) return;
                const v = await res.json();
                Object.assign(vaga, v);
                atualizarReacoes(card, v, usuarioLogado);
            } catch (e) { console.error(e); }
        });

        // Comentários
        card.querySelector(".btn-comentar").addEventListener("click", () => {
            abrirDrawer(vaga, usuarioLogado);
        });

        // Editar / Excluir (só dono)
        if (isDono) {
            card.querySelector(".vc-btn-editar").addEventListener("click", () => {
                window.ModalVaga.abrirParaEditar(vaga);
            });

            card.querySelector(".vc-btn-excluir").addEventListener("click", async () => {
                if (!confirm(`Excluir a vaga "${vaga.cargo}"?`)) return;
                try {
                    const res = await fetch(`http://localhost:8080/vagas/${vaga.id}`, {
                        method: "DELETE", credentials: "include"
                    });
                    if (!res.ok) { const err = await res.json().catch(() => ({})); alert(err.erro || "Erro ao excluir."); return; }
                    card.remove();
                } catch (e) { console.error(e); alert("Erro ao conectar."); }
            });
        }

        vagasContainer.appendChild(card);
    }

    function atualizarReacoes(card, vaga, usuario) {
        const euCurtiu    = usuario && (vaga.likes    || []).includes(usuario.id);
        const euDescurtiu = usuario && (vaga.dislikes || []).includes(usuario.id);

        const btnLike    = card.querySelector(".btn-like");
        const btnDislike = card.querySelector(".btn-dislike");

        btnLike.classList.toggle("liked",    euCurtiu);
        btnDislike.classList.toggle("disliked", euDescurtiu);

        btnLike.querySelector("i").className    = `fa${euCurtiu    ? "s" : "r"} fa-thumbs-up`;
        btnDislike.querySelector("i").className = `fa${euDescurtiu ? "s" : "r"} fa-thumbs-down`;

        card.querySelector(".vc-count-like").textContent    = (vaga.likes    || []).length;
        card.querySelector(".vc-count-dislike").textContent = (vaga.dislikes || []).length;
    }

    carregarVagas();
});