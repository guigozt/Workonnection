const FOTO_DEFAULT =
  "https://newcastle-online.org/uploads/set_resources_2/84c1e40ea0e759e3f1505eb1788ddf3c_default_photo.png";

async function carregarColaboradores(usuarioLogado) {
  const container = document.getElementById("colaboradores-container");
  const vazioMsg = document.getElementById("sem-colaboradores");

  try {
    const response = await fetch("http://localhost:8080/usuarios", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Erro ao buscar dados");

    const colaboradores = await response.json();
    const lista = colaboradores.filter((c) => c.id !== usuarioLogado?.id);

    if (lista.length === 0) {
      vazioMsg.style.display = "block";
      container.innerHTML = "";
      return;
    }

    vazioMsg.style.display = "none";
    renderizarCardsColab(lista, container);
  } catch (error) {
    console.error("Erro:", error);
    container.innerHTML = `<p class="text-center text-danger">Erro ao carregar colaboradores.</p>`;
  }
}

function renderizarCardsColab(lista, container) {
  container.innerHTML = "";

  lista.forEach((colab) => {
    const nome = colab.nome || "Usuário";
    const tipo = colab.tipoUsuario || "Membro";
    const local = colab.perfil?.local || "Não informado";
    const habilidades = colab.perfil?.habilidades || [];
    const fotoUrl =
      colab.perfil?.foto ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=47a4c4&color=fff`;

    const card = document.createElement("div");
    card.className = "vaga-card";

    card.innerHTML = `
            <div class="vc-header">
                <img class="vc-avatar" src="${fotoUrl}" alt="${nome}">
                <div class="vc-autor">
                    <div class="vc-autor-nome">${nome}</div>
                    <div class="vc-autor-meta">${tipo.toLowerCase()}</div>
                </div>
            </div>

            <div class="vc-body">
                <div class="vc-cargo" style="font-size: 18px; margin-bottom: 12px;">${nome}</div>
                
                <div class="vc-detalhes">
                    <div class="vc-detalhe-bloco">
                        <div class="vc-detalhe-label">Categoria</div>
                        <div class="vc-detalhe-valor">${tipo}</div>
                    </div>
                    <div class="vc-detalhe-bloco">
                        <div class="vc-detalhe-label">Localização</div>
                        <div class="vc-detalhe-valor">${local}</div>
                    </div>
                </div>

                <div class="vc-tags">
                    ${
                      habilidades.length > 0
                        ? habilidades
                            .map(
                              (h) =>
                                `<span class="vc-tag"><i class="fas fa-check"></i>${h}</span>`,
                            )
                            .join("")
                        : '<span class="vc-tag">Perfil Geral</span>'
                    }
                </div>
            </div>

            <div class="vc-acoes">
                <button class="vc-acao-btn">
                    <i class="far fa-comment"></i> Mensagem
                </button>
                <span class="vc-spacer"></span>
                <a href="/perfil-view.html?id=${colab.id}" class="btn-candidatar-card ativo">Ver Perfil</a>
            </div>
        `;
    container.appendChild(card);
  });
}

document.addEventListener("usuarioCarregado", (e) =>
  carregarColaboradores(e.detail),
);
if (window.usuarioLogado) carregarColaboradores(window.usuarioLogado);
