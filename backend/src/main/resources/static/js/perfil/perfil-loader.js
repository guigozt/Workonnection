// perfil-loader.js
// Carrega e salva dados do perfil no backend (PUT /usuarios/perfil)
// Os dados do usuário logado já estão em window.usuarioLogado (via auth.js)

document.addEventListener("usuarioCarregado", (event) => {
  const usuario = event.detail;
  if (!usuario) return; // auth.js já redirecionou se não logado

  // Estado local do perfil (sincronizado com o banco ao salvar)
  let perfil = usuario.perfil || {};

  // ── Preenche dados básicos ──────────────────────────────────────────────

  document.getElementById("perfil-nome").textContent  = usuario.nome  || "—";
  document.getElementById("perfil-email").textContent = usuario.email || "—";

  renderContatos();
  renderSobre();
  renderHabilidades();
  renderLista("formacoes-lista",    perfil.formacoes,    renderFormacaoItem);
  renderLista("experiencias-lista", perfil.experiencias, renderExperienciaItem);
  renderLista("cursos-lista",       perfil.cursos,       renderCursoItem);

  // ── Função central de salvamento ────────────────────────────────────────
  // Chama PUT /usuarios/perfil e atualiza o estado local

  async function salvarPerfil() {
    try {
      const res = await fetch("http://localhost:8080/usuarios/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(perfil)
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      const data = await res.json();
      perfil = data.perfil || perfil; // atualiza com o que veio do banco
    } catch (e) {
      console.error("Erro ao salvar perfil:", e);
      alert("Erro ao salvar. Tente novamente.");
    }
  }

  // ── Contatos ────────────────────────────────────────────────────────────

  function renderContatos() {
    setText("perfil-local",     perfil.local);
    setText("perfil-telefone",  perfil.telefone);
    setText("perfil-instagram", perfil.instagram);
    setText("perfil-linkedin",  perfil.linkedin);
    setText("perfil-site",      perfil.site);
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.querySelector("span").textContent = val || "—";
  }

  const modalPerfil = new bootstrap.Modal(document.getElementById("editarPerfilModal"));

  document.getElementById("btnAbrirModal").addEventListener("click", () => {
    document.getElementById("inputLocal").value     = perfil.local     || "";
    document.getElementById("inputTelefone").value  = perfil.telefone  || "";
    document.getElementById("inputInstagram").value = perfil.instagram || "";
    document.getElementById("inputLinkedin").value  = perfil.linkedin  || "";
    document.getElementById("inputSite").value      = perfil.site      || "";
    modalPerfil.show();
  });

  document.getElementById("btnSalvarPerfil").addEventListener("click", async () => {
    perfil.local     = document.getElementById("inputLocal").value.trim();
    perfil.telefone  = document.getElementById("inputTelefone").value.trim();
    perfil.instagram = document.getElementById("inputInstagram").value.trim();
    perfil.linkedin  = document.getElementById("inputLinkedin").value.trim();
    perfil.site      = document.getElementById("inputSite").value.trim();
    await salvarPerfil();
    renderContatos();
    modalPerfil.hide();
  });

  // ── Sobre ───────────────────────────────────────────────────────────────

  function renderSobre() {
    const el = document.getElementById("sobre-conteudo");
    if (el) el.textContent = perfil.sobre || "Clique em editar para adicionar suas informações.";
  }

  const modalSobre = new bootstrap.Modal(document.getElementById("editarSobreModal"));

  document.getElementById("btnEditarSobre").addEventListener("click", () => {
    document.getElementById("inputSobre").value = perfil.sobre || "";
    modalSobre.show();
  });

  document.getElementById("btnSalvarSobre").addEventListener("click", async () => {
    perfil.sobre = document.getElementById("inputSobre").value.trim();
    await salvarPerfil();
    renderSobre();
    modalSobre.hide();
  });

  // ── Habilidades ─────────────────────────────────────────────────────────

  function renderHabilidades() {
    const lista = document.getElementById("habilidades-lista");
    const arr = perfil.habilidades || [];
    lista.innerHTML = "";

    if (!arr.length) {
      lista.innerHTML = '<span class="badge bg-secondary">Clique no ícone para adicionar</span>';
      return;
    }

    arr.forEach((h, idx) => {
      const span = document.createElement("span");
      span.className = "badge bg-primary m-1";
      span.style.cssText = "display:inline-flex; align-items:center;";
      span.innerHTML = `${h} <i class="fa-solid fa-xmark ms-2" style="cursor:pointer;"></i>`;
      span.querySelector("i").addEventListener("click", async () => {
        if (!confirm("Excluir essa habilidade?")) return;
        perfil.habilidades.splice(idx, 1);
        await salvarPerfil();
        renderHabilidades();
      });
      lista.appendChild(span);
    });
  }

  const modalHabilidade = new bootstrap.Modal(document.getElementById("modalHabilidade"));

  document.getElementById("btnEditarHabilidades").addEventListener("click", () => {
    document.getElementById("inputHabilidade").value = "";
    modalHabilidade.show();
  });

  document.getElementById("btnSalvarHabilidade").addEventListener("click", async () => {
    const val = document.getElementById("inputHabilidade").value.trim();
    if (!val) return alert("Digite uma habilidade.");
    if (!perfil.habilidades) perfil.habilidades = [];
    perfil.habilidades.push(val);
    await salvarPerfil();
    renderHabilidades();
    modalHabilidade.hide();
  });

  // ── Listas genéricas (formação, experiência, cursos) ────────────────────

  function renderLista(containerId, arr, renderFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    if (!arr || !arr.length) {
      container.innerHTML = renderFn(null); // exibe placeholder
      return;
    }
    arr.forEach((item, idx) => container.appendChild(renderFn(item, idx, arr, containerId)));
  }

  function criarAcoes(onEdit, onDelete) {
    const div = document.createElement("div");
    div.className = "small-actions";
    const editI = document.createElement("i");
    editI.className = "fa-solid fa-pen text-primary";
    editI.style.cursor = "pointer";
    editI.addEventListener("click", onEdit);
    const delI = document.createElement("i");
    delI.className = "fa-solid fa-trash text-danger ms-2";
    delI.style.cursor = "pointer";
    delI.addEventListener("click", onDelete);
    div.appendChild(editI);
    div.appendChild(delI);
    return div;
  }

  // ── Formação ────────────────────────────────────────────────────────────

  const modalFormacao = new bootstrap.Modal(document.getElementById("modalFormacao"));
  let editFormacaoIdx = -1;

  function renderFormacaoItem(f, idx, arr, containerId) {
    if (!f) return '<div class="formacao-item"><i class="fas fa-university text-primary"></i><div><b>Nenhuma formação cadastrada</b></div></div>';
    const div = document.createElement("div");
    div.className = "experiencia-item d-flex justify-content-between align-items-center";
    div.innerHTML = `<div style="display:flex;gap:12px;align-items:center;"><i class="fas fa-university text-primary"></i><div><b>${f.curso}</b><br><small>${f.universidade} • ${f.periodo}</small></div></div>`;
    div.appendChild(criarAcoes(
      () => { editFormacaoIdx = idx; abrirModalFormacao(f); },
      async () => { if (!confirm("Excluir?")) return; arr.splice(idx, 1); await salvarPerfil(); renderLista(containerId, perfil.formacoes, renderFormacaoItem); }
    ));
    return div;
  }

  function abrirModalFormacao(f) {
    document.getElementById("titleFormacao").textContent     = f ? "Editar Formação" : "Adicionar Formação";
    document.getElementById("inputUniversidade").value = f?.universidade || "";
    document.getElementById("inputCurso").value        = f?.curso        || "";
    document.getElementById("inputPeriodo").value      = f?.periodo      || "";
    modalFormacao.show();
  }

  document.getElementById("btnEditarFormacao").addEventListener("click", () => { editFormacaoIdx = -1; abrirModalFormacao(null); });

  document.getElementById("btnSalvarFormacao").addEventListener("click", async () => {
    const uni  = document.getElementById("inputUniversidade").value.trim();
    const cur  = document.getElementById("inputCurso").value.trim();
    const per  = document.getElementById("inputPeriodo").value.trim();
    if (!uni || !cur || !per) return alert("Preencha todos os campos.");
    if (!perfil.formacoes) perfil.formacoes = [];
    const obj = { universidade: uni, curso: cur, periodo: per };
    if (editFormacaoIdx >= 0) perfil.formacoes[editFormacaoIdx] = obj;
    else perfil.formacoes.push(obj);
    await salvarPerfil();
    renderLista("formacoes-lista", perfil.formacoes, renderFormacaoItem);
    modalFormacao.hide();
  });

  // ── Experiência ─────────────────────────────────────────────────────────

  const modalExp = new bootstrap.Modal(document.getElementById("modalExperiencia"));
  let editExpIdx = -1;

  function renderExperienciaItem(e, idx, arr, containerId) {
    if (!e) return '<div class="experiencia-item"><i class="fas fa-building text-primary"></i><div><b>Nenhuma experiência cadastrada</b></div></div>';
    const div = document.createElement("div");
    div.className = "experiencia-item d-flex justify-content-between align-items-center";
    div.innerHTML = `<div style="display:flex;gap:12px;align-items:center;"><i class="fas fa-briefcase text-primary"></i><div><b>${e.cargo}</b><br><small>${e.empresa} • ${e.periodo}</small><br><small>${e.descricao || ""}</small></div></div>`;
    div.appendChild(criarAcoes(
      () => { editExpIdx = idx; abrirModalExp(e); },
      async () => { if (!confirm("Excluir?")) return; arr.splice(idx, 1); await salvarPerfil(); renderLista(containerId, perfil.experiencias, renderExperienciaItem); }
    ));
    return div;
  }

  function abrirModalExp(e) {
    document.getElementById("titleExperiencia").textContent = e ? "Editar Experiência" : "Adicionar Experiência";
    document.getElementById("inputEmpresa").value    = e?.empresa   || "";
    document.getElementById("inputCargo").value      = e?.cargo     || "";
    document.getElementById("inputDescricao").value  = e?.descricao || "";
    document.getElementById("inputPeriodoExp").value = e?.periodo   || "";
    modalExp.show();
  }

  document.getElementById("btnEditarExperiencias").addEventListener("click", () => { editExpIdx = -1; abrirModalExp(null); });

  document.getElementById("btnSalvarExperiencia").addEventListener("click", async () => {
    const empresa   = document.getElementById("inputEmpresa").value.trim();
    const cargo     = document.getElementById("inputCargo").value.trim();
    const descricao = document.getElementById("inputDescricao").value.trim();
    const periodo   = document.getElementById("inputPeriodoExp").value.trim();
    if (!empresa || !cargo || !periodo) return alert("Preencha os campos obrigatórios.");
    if (!perfil.experiencias) perfil.experiencias = [];
    const obj = { empresa, cargo, descricao, periodo };
    if (editExpIdx >= 0) perfil.experiencias[editExpIdx] = obj;
    else perfil.experiencias.push(obj);
    await salvarPerfil();
    renderLista("experiencias-lista", perfil.experiencias, renderExperienciaItem);
    modalExp.hide();
  });

  // ── Cursos ──────────────────────────────────────────────────────────────

  const modalCurso = new bootstrap.Modal(document.getElementById("modalCurso"));
  let editCursoIdx = -1;

  function renderCursoItem(c, idx, arr, containerId) {
    if (!c) return '<div class="experiencia-item"><i class="fas fa-book text-primary"></i><div><b>Nenhum curso cadastrado</b></div></div>';
    const div = document.createElement("div");
    div.className = "curso-item d-flex justify-content-between align-items-center";
    div.innerHTML = `<div style="display:flex;gap:12px;align-items:center;"><i class="fas fa-graduation-cap text-primary"></i><div><b>${c.nome}</b><br><small>${c.instituicao} • ${c.periodo}</small></div></div>`;
    div.appendChild(criarAcoes(
      () => { editCursoIdx = idx; abrirModalCurso(c); },
      async () => { if (!confirm("Excluir?")) return; arr.splice(idx, 1); await salvarPerfil(); renderLista(containerId, perfil.cursos, renderCursoItem); }
    ));
    return div;
  }

  function abrirModalCurso(c) {
    document.getElementById("titleCurso").textContent = c ? "Editar Curso" : "Adicionar Curso";
    document.getElementById("inputNomeCurso").value       = c?.nome       || "";
    document.getElementById("inputInstituicaoCurso").value = c?.instituicao || "";
    document.getElementById("inputPeriodoCurso").value    = c?.periodo    || "";
    modalCurso.show();
  }

  document.getElementById("btnEditarCursos").addEventListener("click", () => { editCursoIdx = -1; abrirModalCurso(null); });

  document.getElementById("btnSalvarCurso").addEventListener("click", async () => {
    const nome       = document.getElementById("inputNomeCurso").value.trim();
    const instituicao = document.getElementById("inputInstituicaoCurso").value.trim();
    const periodo    = document.getElementById("inputPeriodoCurso").value.trim();
    if (!nome || !instituicao || !periodo) return alert("Preencha todos os campos.");
    if (!perfil.cursos) perfil.cursos = [];
    const obj = { nome, instituicao, periodo };
    if (editCursoIdx >= 0) perfil.cursos[editCursoIdx] = obj;
    else perfil.cursos.push(obj);
    await salvarPerfil();
    renderLista("cursos-lista", perfil.cursos, renderCursoItem);
    modalCurso.hide();
  });

  // ── Resetar tudo ────────────────────────────────────────────────────────

  document.getElementById("btnResetar").addEventListener("click", async () => {
    if (!confirm("Isso apagará todos os dados do seu perfil. Tem certeza?")) return;
    perfil = {};
    await salvarPerfil();
    location.reload();
  });
});