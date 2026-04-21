// perfil-loader.js

document.addEventListener("usuarioCarregado", (event) => {
  const usuario = event.detail;
  if (!usuario) return;

  let perfil = usuario.perfil || {};

  // ── Dados básicos ─────────────────────────────────────────────────────────

  document.getElementById("perfil-nome").textContent  = usuario.nome  || "—";
  document.getElementById("perfil-email").textContent = usuario.email || "—";

  const tipoEl = document.getElementById("perfil-tipo");
  if (tipoEl && usuario.tipoUsuario) tipoEl.textContent = usuario.tipoUsuario.toUpperCase();

  renderContatos();
  renderSobre();
  renderHabilidades();
  renderLista("formacoes-lista",    perfil.formacoes,    renderFormacaoItem);
  renderLista("experiencias-lista", perfil.experiencias, renderExperienciaItem);
  renderLista("cursos-lista",       perfil.cursos,       renderCursoItem);

  // ── Salvar ────────────────────────────────────────────────────────────────

  async function salvarPerfil() {
    const res = await fetch("http://localhost:8080/usuarios/perfil", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(perfil)
    });
    if (!res.ok) throw new Error("Erro ao salvar");
    const data = await res.json();
    perfil = data.perfil || perfil;
  }

  // ── Helpers de validação ──────────────────────────────────────────────────

  function campo(inputId, erroId, msg) {
    const el  = document.getElementById(inputId);
    const err = document.getElementById(erroId);
    if (!el) return !msg;
    if (msg) {
      el.classList.add("campo-erro"); el.classList.remove("campo-ok");
      if (err) err.textContent = msg;
      return false;
    }
    el.classList.remove("campo-erro"); el.classList.add("campo-ok");
    if (err) err.textContent = "";
    return true;
  }

  function limparValidacao(...ids) {
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ""; el.classList.remove("campo-erro","campo-ok"); }
    });
  }

  function limparErros(...ids) {
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = ""; });
  }

  // ── Contatos ──────────────────────────────────────────────────────────────

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
    limparValidacao("inputLocal","inputTelefone","inputInstagram","inputLinkedin","inputSite");
    limparErros("erroLocal","erroTelefone","erroInstagram","erroLinkedin","erroSite");
    // Restaura valores depois de limparValidacao ter apagado
    document.getElementById("inputLocal").value     = perfil.local     || "";
    document.getElementById("inputTelefone").value  = perfil.telefone  || "";
    document.getElementById("inputInstagram").value = perfil.instagram || "";
    document.getElementById("inputLinkedin").value  = perfil.linkedin  || "";
    document.getElementById("inputSite").value      = perfil.site      || "";
    modalPerfil.show();
  });

  // Máscara telefone
  document.getElementById("inputTelefone")?.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    v = v.length > 10
      ? v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3")
      : v.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    e.target.value = v;
  });

  document.getElementById("btnSalvarPerfil").addEventListener("click", async () => {
    const local     = document.getElementById("inputLocal").value.trim();
    const telefone  = document.getElementById("inputTelefone").value.trim();
    const instagram = document.getElementById("inputInstagram").value.trim();
    const linkedin  = document.getElementById("inputLinkedin").value.trim();
    const site      = document.getElementById("inputSite").value.trim();

    let ok = true;

    if (telefone && telefone.replace(/\D/g,"").length < 10)
      ok = campo("inputTelefone","erroTelefone","Telefone incompleto.") && ok;
    else campo("inputTelefone","erroTelefone","");

    if (instagram && !instagram.startsWith("@"))
      ok = campo("inputInstagram","erroInstagram","Deve começar com @.") && ok;
    else campo("inputInstagram","erroInstagram","");

    if (site && !/^https?:\/\/.+/.test(site))
      ok = campo("inputSite","erroSite","Use http:// ou https://.") && ok;
    else campo("inputSite","erroSite","");

    if (!ok) return;

    perfil.local = local; perfil.telefone = telefone;
    perfil.instagram = instagram; perfil.linkedin = linkedin; perfil.site = site;

    try { await salvarPerfil(); renderContatos(); modalPerfil.hide(); }
    catch (e) { alert("Erro ao salvar."); }
  });

  // ── Sobre ─────────────────────────────────────────────────────────────────

  function renderSobre() {
    const el = document.getElementById("sobre-conteudo");
    if (!el) return;
    if (perfil.sobre) {
      el.textContent = perfil.sobre;
      el.classList.remove("section-placeholder");
    } else {
      el.textContent = "Clique em editar para adicionar suas informações.";
      el.classList.add("section-placeholder");
    }
  }

  const modalSobre = new bootstrap.Modal(document.getElementById("editarSobreModal"));

  document.getElementById("btnEditarSobre").addEventListener("click", () => {
    document.getElementById("inputSobre").value = perfil.sobre || "";
    document.getElementById("inputSobre").classList.remove("campo-erro","campo-ok");
    limparErros("erroSobre");
    modalSobre.show();
  });

  document.getElementById("btnSalvarSobre").addEventListener("click", async () => {
    const val = document.getElementById("inputSobre").value.trim();
    if (!val)         { campo("inputSobre","erroSobre","Campo obrigatório."); return; }
    if (val.length < 10) { campo("inputSobre","erroSobre","Mínimo 10 caracteres."); return; }
    if (val.length > 1000) { campo("inputSobre","erroSobre","Máximo 1000 caracteres."); return; }
    campo("inputSobre","erroSobre","");
    perfil.sobre = val;
    try { await salvarPerfil(); renderSobre(); modalSobre.hide(); } catch (e) { alert("Erro ao salvar."); }
  });

  // ── Habilidades ───────────────────────────────────────────────────────────

  function renderHabilidades() {
    const lista = document.getElementById("habilidades-lista");
    const arr = perfil.habilidades || [];
    lista.innerHTML = "";
    if (!arr.length) {
      lista.innerHTML = '<span class="section-placeholder">Nenhuma habilidade cadastrada.</span>';
      return;
    }
    arr.forEach((h, idx) => {
      const span = document.createElement("span");
      span.className = "badge";
      span.innerHTML = `${h} <i class="fa-solid fa-xmark"></i>`;
      span.querySelector("i").addEventListener("click", async () => {
        if (!confirm(`Excluir "${h}"?`)) return;
        perfil.habilidades.splice(idx, 1);
        try { await salvarPerfil(); renderHabilidades(); } catch (e) { alert("Erro ao salvar."); }
      });
      lista.appendChild(span);
    });
  }

  const modalHabilidade = new bootstrap.Modal(document.getElementById("modalHabilidade"));

  document.getElementById("btnEditarHabilidades").addEventListener("click", () => {
    limparValidacao("inputHabilidade"); limparErros("erroHabilidade");
    modalHabilidade.show();
  });

  document.getElementById("btnSalvarHabilidade").addEventListener("click", async () => {
    const val = document.getElementById("inputHabilidade").value.trim();
    if (!val)          { campo("inputHabilidade","erroHabilidade","Digite uma habilidade."); return; }
    if (val.length < 2){ campo("inputHabilidade","erroHabilidade","Mínimo 2 caracteres."); return; }
    if (val.length > 40){ campo("inputHabilidade","erroHabilidade","Máximo 40 caracteres."); return; }
    if ((perfil.habilidades||[]).some(h => h.toLowerCase()===val.toLowerCase())) {
      campo("inputHabilidade","erroHabilidade","Já adicionada."); return;
    }
    campo("inputHabilidade","erroHabilidade","");
    if (!perfil.habilidades) perfil.habilidades = [];
    perfil.habilidades.push(val);
    try { await salvarPerfil(); renderHabilidades(); modalHabilidade.hide(); } catch (e) { alert("Erro ao salvar."); }
  });

  // ── Lista genérica ────────────────────────────────────────────────────────

  function renderLista(containerId, arr, renderFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    if (!arr || !arr.length) { container.innerHTML = renderFn(null); return; }
    arr.forEach((item, idx) => {
      const el = renderFn(item, idx, arr, containerId);
      if (typeof el === "string") container.innerHTML += el;
      else container.appendChild(el);
    });
  }

  function criarAcoesItem(onEdit, onDelete) {
    const div = document.createElement("div");
    div.className = "lista-item-acoes";
    const editI = document.createElement("i");
    editI.className = "fas fa-pen btn-editar-item"; editI.title = "Editar";
    editI.addEventListener("click", onEdit);
    const delI = document.createElement("i");
    delI.className = "fas fa-trash btn-excluir-item"; delI.title = "Excluir";
    delI.addEventListener("click", onDelete);
    div.appendChild(editI); div.appendChild(delI);
    return div;
  }

  // ── Formação ──────────────────────────────────────────────────────────────

  const modalFormacao = new bootstrap.Modal(document.getElementById("modalFormacao"));
  let editFormacaoIdx = -1;

  function renderFormacaoItem(f, idx, arr, containerId) {
    if (!f) return '<p class="section-placeholder">Nenhuma formação cadastrada.</p>';
    const div = document.createElement("div");
    div.className = "lista-item";
    div.innerHTML = `<i class="fas fa-university lista-item-icone"></i>
      <div class="lista-item-corpo"><b>${f.curso}</b><small>${f.universidade} · ${f.periodo}</small></div>`;
    div.appendChild(criarAcoesItem(
      () => { editFormacaoIdx = idx; abrirModalFormacao(f); },
      async () => { if (!confirm("Excluir?")) return; arr.splice(idx,1); try{await salvarPerfil(); renderLista(containerId,perfil.formacoes,renderFormacaoItem);}catch(e){alert("Erro.");} }
    ));
    return div;
  }

  function abrirModalFormacao(f) {
    document.getElementById("titleFormacao").textContent = f ? "Editar Formação" : "Adicionar Formação";
    document.getElementById("inputUniversidade").value = f?.universidade || "";
    document.getElementById("inputCurso").value        = f?.curso        || "";
    document.getElementById("inputPeriodo").value      = f?.periodo      || "";
    limparErros("erroUniversidade","erroCurso","erroPeriodo");
    ["inputUniversidade","inputCurso","inputPeriodo"].forEach(id => document.getElementById(id)?.classList.remove("campo-erro","campo-ok"));
    modalFormacao.show();
  }

  document.getElementById("btnEditarFormacao").addEventListener("click", () => { editFormacaoIdx=-1; abrirModalFormacao(null); });

  document.getElementById("btnSalvarFormacao").addEventListener("click", async () => {
    const uni = document.getElementById("inputUniversidade").value.trim();
    const cur = document.getElementById("inputCurso").value.trim();
    const per = document.getElementById("inputPeriodo").value.trim();
    let ok = true;
    if (!uni||uni.length<3) ok=campo("inputUniversidade","erroUniversidade","Mínimo 3 caracteres.")&&ok; else campo("inputUniversidade","erroUniversidade","");
    if (!cur||cur.length<3) ok=campo("inputCurso","erroCurso","Mínimo 3 caracteres.")&&ok; else campo("inputCurso","erroCurso","");
    if (!per) ok=campo("inputPeriodo","erroPeriodo","Informe o período.")&&ok; else campo("inputPeriodo","erroPeriodo","");
    if (!ok) return;
    if (!perfil.formacoes) perfil.formacoes=[];
    const obj={universidade:uni,curso:cur,periodo:per};
    if (editFormacaoIdx>=0) perfil.formacoes[editFormacaoIdx]=obj; else perfil.formacoes.push(obj);
    try{await salvarPerfil(); renderLista("formacoes-lista",perfil.formacoes,renderFormacaoItem); modalFormacao.hide();}catch(e){alert("Erro ao salvar.");}
  });

  // ── Experiência ───────────────────────────────────────────────────────────

  const modalExp = new bootstrap.Modal(document.getElementById("modalExperiencia"));
  let editExpIdx = -1;

  function renderExperienciaItem(e, idx, arr, containerId) {
    if (!e) return '<p class="section-placeholder">Nenhuma experiência cadastrada.</p>';
    const div = document.createElement("div");
    div.className = "lista-item";
    div.innerHTML = `<i class="fas fa-briefcase lista-item-icone"></i>
      <div class="lista-item-corpo"><b>${e.cargo}</b><small>${e.empresa} · ${e.periodo}</small>
      ${e.descricao?`<small style="display:block;color:#aaa;">${e.descricao}</small>`:""}</div>`;
    div.appendChild(criarAcoesItem(
      () => { editExpIdx=idx; abrirModalExp(e); },
      async () => { if (!confirm("Excluir?")) return; arr.splice(idx,1); try{await salvarPerfil(); renderLista(containerId,perfil.experiencias,renderExperienciaItem);}catch(e){alert("Erro.");} }
    ));
    return div;
  }

  function abrirModalExp(e) {
    document.getElementById("titleExperiencia").textContent = e ? "Editar Experiência" : "Adicionar Experiência";
    document.getElementById("inputEmpresa").value    = e?.empresa   || "";
    document.getElementById("inputCargo").value      = e?.cargo     || "";
    document.getElementById("inputPeriodoExp").value = e?.periodo   || "";
    document.getElementById("inputDescricao").value  = e?.descricao || "";
    limparErros("erroEmpresa","erroCargo","erroPeriodoExp");
    ["inputEmpresa","inputCargo","inputPeriodoExp"].forEach(id => document.getElementById(id)?.classList.remove("campo-erro","campo-ok"));
    modalExp.show();
  }

  document.getElementById("btnEditarExperiencias").addEventListener("click", () => { editExpIdx=-1; abrirModalExp(null); });

  document.getElementById("btnSalvarExperiencia").addEventListener("click", async () => {
    const empresa  = document.getElementById("inputEmpresa").value.trim();
    const cargo    = document.getElementById("inputCargo").value.trim();
    const periodo  = document.getElementById("inputPeriodoExp").value.trim();
    const descricao= document.getElementById("inputDescricao").value.trim();
    let ok = true;
    if (!empresa||empresa.length<2) ok=campo("inputEmpresa","erroEmpresa","Mínimo 2 caracteres.")&&ok; else campo("inputEmpresa","erroEmpresa","");
    if (!cargo||cargo.length<2)     ok=campo("inputCargo","erroCargo","Mínimo 2 caracteres.")&&ok;     else campo("inputCargo","erroCargo","");
    if (!periodo)                   ok=campo("inputPeriodoExp","erroPeriodoExp","Informe o período.")&&ok; else campo("inputPeriodoExp","erroPeriodoExp","");
    if (!ok) return;
    if (!perfil.experiencias) perfil.experiencias=[];
    const obj={empresa,cargo,periodo,descricao};
    if (editExpIdx>=0) perfil.experiencias[editExpIdx]=obj; else perfil.experiencias.push(obj);
    try{await salvarPerfil(); renderLista("experiencias-lista",perfil.experiencias,renderExperienciaItem); modalExp.hide();}catch(e){alert("Erro ao salvar.");}
  });

  // ── Cursos ────────────────────────────────────────────────────────────────

  const modalCurso = new bootstrap.Modal(document.getElementById("modalCurso"));
  let editCursoIdx = -1;

  function renderCursoItem(c, idx, arr, containerId) {
    if (!c) return '<p class="section-placeholder">Nenhum curso cadastrado.</p>';
    const div = document.createElement("div");
    div.className = "lista-item";
    div.innerHTML = `<i class="fas fa-graduation-cap lista-item-icone"></i>
      <div class="lista-item-corpo"><b>${c.nome}</b><small>${c.instituicao} · ${c.periodo}</small></div>`;
    div.appendChild(criarAcoesItem(
      () => { editCursoIdx=idx; abrirModalCurso(c); },
      async () => { if (!confirm("Excluir?")) return; arr.splice(idx,1); try{await salvarPerfil(); renderLista(containerId,perfil.cursos,renderCursoItem);}catch(e){alert("Erro.");} }
    ));
    return div;
  }

  function abrirModalCurso(c) {
    document.getElementById("titleCurso").textContent = c ? "Editar Curso" : "Adicionar Curso";
    document.getElementById("inputNomeCurso").value        = c?.nome        || "";
    document.getElementById("inputInstituicaoCurso").value = c?.instituicao || "";
    document.getElementById("inputPeriodoCurso").value     = c?.periodo     || "";
    limparErros("erroNomeCurso","erroInstituicaoCurso","erroPeriodoCurso");
    ["inputNomeCurso","inputInstituicaoCurso","inputPeriodoCurso"].forEach(id => document.getElementById(id)?.classList.remove("campo-erro","campo-ok"));
    modalCurso.show();
  }

  document.getElementById("btnEditarCursos").addEventListener("click", () => { editCursoIdx=-1; abrirModalCurso(null); });

  document.getElementById("btnSalvarCurso").addEventListener("click", async () => {
    const nome        = document.getElementById("inputNomeCurso").value.trim();
    const instituicao = document.getElementById("inputInstituicaoCurso").value.trim();
    const periodo     = document.getElementById("inputPeriodoCurso").value.trim();
    let ok = true;
    if (!nome||nome.length<3)             ok=campo("inputNomeCurso","erroNomeCurso","Mínimo 3 caracteres.")&&ok;         else campo("inputNomeCurso","erroNomeCurso","");
    if (!instituicao||instituicao.length<2) ok=campo("inputInstituicaoCurso","erroInstituicaoCurso","Mínimo 2 caracteres.")&&ok; else campo("inputInstituicaoCurso","erroInstituicaoCurso","");
    if (!periodo)                         ok=campo("inputPeriodoCurso","erroPeriodoCurso","Informe o período.")&&ok;     else campo("inputPeriodoCurso","erroPeriodoCurso","");
    if (!ok) return;
    if (!perfil.cursos) perfil.cursos=[];
    const obj={nome,instituicao,periodo};
    if (editCursoIdx>=0) perfil.cursos[editCursoIdx]=obj; else perfil.cursos.push(obj);
    try{await salvarPerfil(); renderLista("cursos-lista",perfil.cursos,renderCursoItem); modalCurso.hide();}catch(e){alert("Erro ao salvar.");}
  });

  // ── Resetar ───────────────────────────────────────────────────────────────

  document.getElementById("btnResetar").addEventListener("click", async () => {
    if (!confirm("Isso apagará todos os dados do perfil. Tem certeza?")) return;
    perfil = {};
    try { await salvarPerfil(); location.reload(); } catch (e) { alert("Erro ao resetar."); }
  });
});