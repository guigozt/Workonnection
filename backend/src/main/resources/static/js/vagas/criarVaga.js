// criarVaga.js
// Renderiza vagas e controla botões de editar/excluir/candidatar
// O modal vive em /js/components/modal-vaga.js

document.addEventListener("usuarioCarregado", (event) => {
  const usuario        = event.detail;
  const vagasContainer = document.getElementById("vagas-container");
  const botaoPublicar  = document.querySelector(".botao-publicar");

  botaoPublicar?.addEventListener("click", () => window.ModalVaga.abrirParaCriar());
  window.ModalVaga.onSalvar(() => carregarVagas());

  // ── Verifica se o tipo do usuário pode se candidatar ───────────────────────
  // tiposUsuario na vaga: ["todos"] | ["prestador"] | ["estudante"] | combinações
  // tipoUsuario do usuário: "empresa" | "mei" | "me" | "estudante"

  function podeSeCandidar(vaga) {
    if (!usuario) return false;
    if (vaga.usuarioId === usuario.id) return false; // dono não se candidata

    const tipos = vaga.tiposUsuario || [];
    if (!tipos.length || tipos.includes("todos")) return true;

    const tipo = (usuario.tipoUsuario || "").toLowerCase();
    const ehPrestador = ["empresa", "mei", "me"].includes(tipo);
    const ehEstudante = tipo === "estudante";

    if (tipos.includes("prestador") && ehPrestador) return true;
    if (tipos.includes("estudante") && ehEstudante) return true;

    return false;
  }

  function labelTipos(tipos) {
    if (!tipos || !tipos.length || tipos.includes("todos")) return ["Todos"];
    return tipos.map(t => t === "prestador" ? "Prestadores" : "Estudantes");
  }

  // ── Carregar vagas ─────────────────────────────────────────────────────────

  async function carregarVagas() {
    try {
      const res   = await fetch("http://localhost:8080/vagas", { credentials: "include" });
      const vagas = await res.json();
      renderizarVagas(vagas);
    } catch (e) {
      console.error("Erro ao carregar vagas:", e);
    }
  }

  // ── Renderizar ─────────────────────────────────────────────────────────────

  function renderizarVagas(vagas) {
    if (!vagasContainer) return;
    vagasContainer.innerHTML = "";

    if (!vagas.length) {
      vagasContainer.innerHTML = `<p style="text-align:center;color:#aaa;margin-top:40px;">Nenhuma vaga publicada ainda.</p>`;
      return;
    }

    vagas.forEach(vaga => {
      const isDono    = usuario && vaga.usuarioId === usuario.id;
      const podeCand  = podeSeCandidar(vaga);
      const chips     = labelTipos(vaga.tiposUsuario);

      const card = document.createElement("div");
      card.className = "vaga-card";
      card.innerHTML = `
        <div class="vaga-card-header">
          <div class="vaga-card-titulo">
            <h5>${vaga.cargo}</h5>
            <span class="empresa">${vaga.empresa}</span>
          </div>
          ${isDono ? `
            <div class="vaga-acoes">
              <button class="btn-editar-vaga" title="Editar"><i class="fas fa-pen"></i></button>
              <button class="btn-excluir-vaga" title="Excluir"><i class="fas fa-trash"></i></button>
            </div>` : ""}
        </div>

        <div class="vaga-info-linha">
          <span class="vaga-info-item"><i class="fas fa-location-dot"></i> ${vaga.localizacao}</span>
          <span class="vaga-info-item"><i class="fas fa-clock"></i> ${vaga.horario}</span>
          <span class="vaga-info-item"><i class="fas fa-laptop-house"></i> ${vaga.modalidade}</span>
          <span class="vaga-info-item"><i class="fas fa-dollar-sign"></i> ${vaga.salario}</span>
        </div>

        <p class="vaga-descricao">${vaga.descricao}</p>

        <div class="vaga-footer-row">
          <div class="vaga-chips">
            ${chips.map(c => `<span class="vaga-chip">${c}</span>`).join("")}
          </div>
          ${isDono
            ? `<span style="font-size:11px;color:#aaa;font-weight:600;">Sua vaga</span>`
            : podeCand
              ? `<a href="mailto:${vaga.email}" class="btn-candidatar ativo">Candidatar-se</a>`
              : `<span class="btn-candidatar bloqueado">Não disponível para seu perfil</span>`
          }
        </div>
      `;

      if (isDono) {
        card.querySelector(".btn-editar-vaga").addEventListener("click", () => {
          window.ModalVaga.abrirParaEditar(vaga);
        });

        card.querySelector(".btn-excluir-vaga").addEventListener("click", async () => {
          if (!confirm(`Excluir a vaga "${vaga.cargo}"?`)) return;
          try {
            const res = await fetch(`http://localhost:8080/vagas/${vaga.id}`, {
              method: "DELETE",
              credentials: "include"
            });
            if (!res.ok) { const err = await res.json().catch(() => ({})); alert(err.erro || "Erro ao excluir."); return; }
            carregarVagas();
          } catch (e) {
            console.error(e);
            alert("Erro ao conectar com o servidor.");
          }
        });
      }

      vagasContainer.appendChild(card);
    });
  }

  carregarVagas();
});