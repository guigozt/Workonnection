// modal-vaga.js — componente isolado e reutilizável
// Injeta estilos + modal no DOM e expõe window.ModalVaga
//
// API:
//   window.ModalVaga.abrirParaCriar()
//   window.ModalVaga.abrirParaEditar(vaga)
//   window.ModalVaga.onSalvar(callback)

(function () {

    // ── Estilos ───────────────────────────────────────────────────────────────

    const style = document.createElement("style");
    style.textContent = `
        #modalVaga .modal-dialog { max-width: 700px; }

        #modalVaga .modal-content {
            border: none;
            border-radius: 20px;
            box-shadow: 0 24px 60px rgba(0,0,0,0.16);
            overflow: hidden;
            max-height: 88vh;
            display: flex;
            flex-direction: column;
        }

        #modalVaga .modal-header {
            background: linear-gradient(135deg, #47a4c4 0%, #d86b6b 100%);
            border: none;
            padding: 20px 28px;
            flex-shrink: 0;
        }

        #modalVaga .modal-header h5 {
            color: #fff;
            font-size: 17px;
            font-weight: 700;
            letter-spacing: 0.3px;
            margin: 0;
        }

        #modalVaga .btn-close { filter: brightness(0) invert(1); opacity: 0.9; }

        #modalVaga .modal-body {
            padding: 22px 28px;
            overflow-y: auto;
            flex: 1;
        }

        .mv-secao { margin-bottom: 22px; }

        .mv-secao-titulo {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: #47a4c4;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 2px solid #f0f4f6;
        }

        .mv-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .mv-grid.full { grid-template-columns: 1fr; }

        .mv-campo { display: flex; flex-direction: column; gap: 4px; }

        .mv-campo label {
            font-size: 11px;
            font-weight: 700;
            color: #777;
            text-transform: uppercase;
            letter-spacing: 0.6px;
        }

        .mv-campo input,
        .mv-campo textarea {
            border: 1.5px solid #e8ecef;
            border-radius: 10px;
            padding: 9px 13px;
            font-size: 14px;
            color: #333;
            background: #f8fafb;
            transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
            outline: none;
            width: 100%;
            font-family: inherit;
        }

        .mv-campo input:focus,
        .mv-campo textarea:focus {
            border-color: #47a4c4;
            background: #fff;
            box-shadow: 0 0 0 3px rgba(71,164,196,0.13);
        }

        .mv-campo input.mv-erro,
        .mv-campo textarea.mv-erro {
            border-color: #d86b6b;
            background: #fff9f9;
        }

        .mv-campo textarea { resize: vertical; min-height: 68px; }

        .mv-msg-erro {
            font-size: 11px;
            color: #d86b6b;
            font-weight: 600;
            min-height: 14px;
        }

        .mv-horario {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .mv-horario input { flex: 1; }
        .mv-horario span { color: #aaa; font-size: 12px; white-space: nowrap; }

        /* Chips de tipo de candidato */
        .mv-tipos-grid {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-top: 4px;
        }

        .mv-tipo-chip {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 9px 16px;
            border-radius: 50px;
            border: 2px solid #e8ecef;
            background: #f8fafb;
            cursor: pointer;
            transition: all 0.16s;
            font-size: 13px;
            font-weight: 600;
            color: #777;
            user-select: none;
        }

        .mv-tipo-chip:hover {
            border-color: #47a4c4;
            color: #47a4c4;
            background: #eef7fb;
        }

        .mv-tipo-chip.selecionado {
            border-color: #47a4c4;
            background: #47a4c4;
            color: #fff;
        }

        .mv-tipo-chip.desabilitado {
            opacity: 0.35;
            cursor: not-allowed;
            pointer-events: none;
        }

        .mv-tipo-chip i { font-size: 13px; }
        .mv-tipo-chip small { font-size: 10px; opacity: 0.75; }

        /* Footer */
        #modalVaga .modal-footer {
            border: none;
            padding: 14px 28px 18px;
            background: #f8fafb;
            border-top: 1px solid #eef0f2;
            gap: 8px;
            flex-shrink: 0;
        }

        #btnSalvarVaga {
            background: linear-gradient(135deg, #47a4c4, #2d8aae);
            border: none;
            border-radius: 10px;
            padding: 10px 26px;
            font-weight: 700;
            font-size: 14px;
            color: #fff;
            transition: opacity 0.18s, transform 0.12s;
            cursor: pointer;
        }

        #btnSalvarVaga:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        #btnSalvarVaga:disabled { opacity: 0.6; cursor: not-allowed; }

        #btnCancelarVaga {
            background: #eff1f3;
            border: none;
            border-radius: 10px;
            padding: 10px 18px;
            font-weight: 600;
            font-size: 14px;
            color: #777;
            cursor: pointer;
            transition: background 0.16s;
        }

        #btnCancelarVaga:hover { background: #e4e7ea; }

        /* ── Cards de vaga ── */
        .vaga-card {
            background: #fff;
            border-radius: 16px;
            padding: 20px 24px;
            margin: 14px 40px;
            box-shadow: 0 2px 12px rgba(0,0,0,0.06);
            border: 1px solid #eef0f2;
            transition: transform 0.18s, box-shadow 0.18s;
        }

        .vaga-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .vaga-card-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .vaga-card-titulo h5 {
            margin: 0 0 2px;
            font-size: 16px;
            font-weight: 700;
            color: #222;
        }

        .vaga-card-titulo .empresa { font-size: 13px; color: #888; }

        .vaga-acoes { display: flex; gap: 6px; }

        .vaga-acoes button {
            width: 30px;
            height: 30px;
            border-radius: 8px;
            border: 1.5px solid;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.15s;
            background: transparent;
            padding: 0;
        }

        .btn-editar-vaga  { border-color: #47a4c4 !important; color: #47a4c4 !important; }
        .btn-editar-vaga:hover  { background: #47a4c4 !important; color: #fff !important; }
        .btn-excluir-vaga { border-color: #d86b6b !important; color: #d86b6b !important; }
        .btn-excluir-vaga:hover { background: #d86b6b !important; color: #fff !important; }

        .vaga-info-linha {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-bottom: 10px;
        }

        .vaga-info-item {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
            color: #777;
        }

        .vaga-info-item i { color: #47a4c4; font-size: 11px; }

        .vaga-descricao {
            font-size: 13px;
            color: #555;
            line-height: 1.6;
            margin-bottom: 14px;
        }

        .vaga-footer-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 8px;
        }

        .vaga-chips { display: flex; gap: 5px; flex-wrap: wrap; }

        .vaga-chip {
            font-size: 10px;
            font-weight: 700;
            padding: 3px 9px;
            border-radius: 20px;
            background: #eef7fb;
            color: #47a4c4;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }

        .btn-candidatar {
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

        .btn-candidatar.ativo {
            background: linear-gradient(135deg, #47a4c4, #2d8aae);
            color: #fff;
        }

        .btn-candidatar.ativo:hover { opacity: 0.88; transform: translateY(-1px); }

        .btn-candidatar.bloqueado {
            background: #f0f2f4;
            color: #bbb;
            cursor: default;
            font-size: 11px;
        }

        @media (max-width: 600px) {
            .mv-grid { grid-template-columns: 1fr; }
            .vaga-card { margin: 10px 12px; }
        }
    `;
    document.head.appendChild(style);

    // ── HTML do modal ─────────────────────────────────────────────────────────

    document.body.insertAdjacentHTML("beforeend", `
    <div class="modal fade" id="modalVaga" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="modalVagaTitulo">Nova Vaga</h5>
                    <button class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">

                    <div class="mv-secao">
                        <div class="mv-secao-titulo">Informações principais</div>
                        <div class="mv-grid">
                            <div class="mv-campo">
                                <label>Empresa</label>
                                <input id="mvEmpresa" placeholder="Ex: Workonnection">
                                <div class="mv-msg-erro" id="erroEmpresa"></div>
                            </div>
                            <div class="mv-campo">
                                <label>Cargo</label>
                                <input id="mvCargo" placeholder="Ex: Desenvolvedor">
                                <div class="mv-msg-erro" id="erroCargo"></div>
                            </div>
                            <div class="mv-campo">
                                <label>Modalidade</label>
                                <input id="mvModalidade" placeholder="Presencial, Remoto, Híbrido">
                                <div class="mv-msg-erro" id="erroModalidade"></div>
                            </div>
                            <div class="mv-campo">
                                <label>Horário</label>
                                <div class="mv-horario">
                                    <input type="time" id="mvHoraInicio">
                                    <span>até</span>
                                    <input type="time" id="mvHoraFim">
                                </div>
                                <div class="mv-msg-erro" id="erroHorario"></div>
                            </div>
                            <div class="mv-campo">
                                <label>Localização</label>
                                <input id="mvLocalizacao" placeholder="Ex: São Paulo, SP">
                                <div class="mv-msg-erro" id="erroLocalizacao"></div>
                            </div>
                            <div class="mv-campo">
                                <label>Salário</label>
                                <input id="mvSalario" placeholder="Ex: 1.500,00">
                                <div class="mv-msg-erro" id="erroSalario"></div>
                            </div>
                            <div class="mv-campo">
                                <label>Data de expiração</label>
                                <input type="date" id="mvData">
                                <div class="mv-msg-erro" id="erroData"></div>
                            </div>
                            <div class="mv-campo">
                                <label>Email de contato</label>
                                <input type="email" id="mvEmail" placeholder="contato@empresa.com">
                                <div class="mv-msg-erro" id="erroEmail"></div>
                            </div>
                        </div>
                    </div>

                    <div class="mv-secao">
                        <div class="mv-secao-titulo">Detalhes da vaga</div>
                        <div class="mv-grid full">
                            <div class="mv-campo">
                                <label>Descrição</label>
                                <textarea id="mvDescricao" placeholder="Descreva as responsabilidades e o dia a dia da vaga..."></textarea>
                                <div class="mv-msg-erro" id="erroDescricao"></div>
                            </div>
                            <div class="mv-campo">
                                <label>Requisitos</label>
                                <textarea id="mvRequisitos" placeholder="Ex: Python, Git, 2 anos de experiência..."></textarea>
                                <div class="mv-msg-erro" id="erroRequisitos"></div>
                            </div>
                            <div class="mv-campo">
                                <label>Benefícios</label>
                                <input id="mvBeneficios" placeholder="Ex: VT, VA, Plano de saúde">
                                <div class="mv-msg-erro" id="erroBeneficios"></div>
                            </div>
                        </div>
                    </div>

                    <div class="mv-secao">
                        <div class="mv-secao-titulo">Quem pode se candidatar</div>
                        <div class="mv-tipos-grid" id="mvTiposGrid">
                            <div class="mv-tipo-chip" data-valor="todos">
                                <i class="fas fa-globe"></i> Todos
                            </div>
                            <div class="mv-tipo-chip" data-valor="prestador">
                                <i class="fas fa-briefcase"></i> Prestador de Serviço
                                <small>(Empresa, MEI, ME)</small>
                            </div>
                            <div class="mv-tipo-chip" data-valor="estudante">
                                <i class="fas fa-graduation-cap"></i> Estudante
                            </div>
                        </div>
                        <div class="mv-msg-erro" id="erroTipos" style="margin-top:8px;"></div>
                    </div>

                </div>
                <div class="modal-footer">
                    <button id="btnCancelarVaga" data-bs-dismiss="modal">Cancelar</button>
                    <button id="btnSalvarVaga">Salvar Vaga</button>
                </div>
            </div>
        </div>
    </div>`);

    // ── Lógica ────────────────────────────────────────────────────────────────

    const modal     = new bootstrap.Modal(document.getElementById("modalVaga"));
    const titulo    = document.getElementById("modalVagaTitulo");
    const btnSalvar = document.getElementById("btnSalvarVaga");
    const chips     = document.querySelectorAll(".mv-tipo-chip");

    let vagaEmEdicaoId = null;
    let callbackSalvar = null;
    let tiposSelecionados = [];

    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            const valor = chip.dataset.valor;
            if (valor === "todos") {
                tiposSelecionados = tiposSelecionados.includes("todos") ? [] : ["todos"];
            } else {
                tiposSelecionados = tiposSelecionados.filter(t => t !== "todos");
                tiposSelecionados = tiposSelecionados.includes(valor)
                    ? tiposSelecionados.filter(t => t !== valor)
                    : [...tiposSelecionados, valor];
            }
            atualizarChips();
        });
    });

    function atualizarChips() {
        const temTodos = tiposSelecionados.includes("todos");
        chips.forEach(chip => {
            chip.classList.toggle("selecionado", tiposSelecionados.includes(chip.dataset.valor));
            chip.classList.toggle("desabilitado", temTodos && chip.dataset.valor !== "todos");
        });
    }

    function limpar() {
        ["mvEmpresa","mvCargo","mvModalidade","mvHoraInicio","mvHoraFim",
         "mvLocalizacao","mvSalario","mvData","mvEmail","mvDescricao",
         "mvRequisitos","mvBeneficios"].forEach(id => {
            const el = document.getElementById(id);
            if (el) { el.value = ""; el.classList.remove("mv-erro"); }
        });
        document.querySelectorAll(".mv-msg-erro").forEach(e => e.textContent = "");
        tiposSelecionados = [];
        atualizarChips();
        vagaEmEdicaoId = null;
    }

    function preencherCampos(v) {
        document.getElementById("mvEmpresa").value    = v.empresa    || "";
        document.getElementById("mvCargo").value      = v.cargo      || "";
        document.getElementById("mvModalidade").value = v.modalidade || "";
        document.getElementById("mvLocalizacao").value= v.localizacao|| "";
        document.getElementById("mvSalario").value    = v.salario    || "";
        document.getElementById("mvData").value       = v.data       || "";
        document.getElementById("mvDescricao").value  = v.descricao  || "";
        document.getElementById("mvBeneficios").value = v.beneficios || "";
        document.getElementById("mvRequisitos").value = v.requisitos || "";
        document.getElementById("mvEmail").value      = v.email      || "";
        if (v.horario?.includes(" - ")) {
            const [ini, fim] = v.horario.split(" - ");
            document.getElementById("mvHoraInicio").value = ini.trim();
            document.getElementById("mvHoraFim").value    = fim.trim();
        }
        tiposSelecionados = v.tiposUsuario || [];
        atualizarChips();
    }

    function coletarDados() {
        return {
            empresa:      document.getElementById("mvEmpresa").value.trim(),
            cargo:        document.getElementById("mvCargo").value.trim(),
            modalidade:   document.getElementById("mvModalidade").value.trim(),
            localizacao:  document.getElementById("mvLocalizacao").value.trim(),
            salario:      document.getElementById("mvSalario").value.trim(),
            data:         document.getElementById("mvData").value,
            descricao:    document.getElementById("mvDescricao").value.trim(),
            beneficios:   document.getElementById("mvBeneficios").value.trim(),
            requisitos:   document.getElementById("mvRequisitos").value.trim(),
            email:        document.getElementById("mvEmail").value.trim(),
            horario:      `${document.getElementById("mvHoraInicio").value} - ${document.getElementById("mvHoraFim").value}`,
            tiposUsuario: [...tiposSelecionados]
        };
    }

    function validar(d) {
        let ok = true;
        function campo(inputId, erroId, msg) {
            const el  = document.getElementById(inputId);
            const err = document.getElementById(erroId);
            if (msg) { el?.classList.add("mv-erro"); if (err) err.textContent = msg; ok = false; }
            else     { el?.classList.remove("mv-erro"); if (err) err.textContent = ""; }
        }
        campo("mvEmpresa",    "erroEmpresa",    !d.empresa    ? "Obrigatório" : "");
        campo("mvCargo",      "erroCargo",      !d.cargo      ? "Obrigatório" : "");
        campo("mvModalidade", "erroModalidade", !d.modalidade ? "Obrigatório" : "");
        campo("mvLocalizacao","erroLocalizacao",!d.localizacao? "Obrigatório" : "");
        campo("mvSalario",    "erroSalario",    !d.salario    ? "Obrigatório" : "");
        campo("mvData",       "erroData",       !d.data       ? "Obrigatório" : d.data < hoje ? "Data não pode ser no passada" : "");
        campo("mvBeneficios", "erroBeneficios", !d.beneficios ? "Obrigatório" : "");
        campo("mvDescricao",  "erroDescricao",  d.descricao.length < 10 ? "Mínimo 10 caracteres" : "");
        campo("mvRequisitos", "erroRequisitos", d.requisitos.length < 5  ? "Mínimo 5 caracteres"  : "");
        campo("mvEmail",      "erroEmail",      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) ? "Email inválido" : "");

        const ini = document.getElementById("mvHoraInicio").value;
        const fim = document.getElementById("mvHoraFim").value;
        const erroH = document.getElementById("erroHorario");
        if (!ini || !fim || ini >= fim) { erroH.textContent = "Hora final deve ser maior que a inicial"; ok = false; }
        else erroH.textContent = "";

        const erroT = document.getElementById("erroTipos");
        if (!d.tiposUsuario.length) { erroT.textContent = "Selecione ao menos um tipo"; ok = false; }
        else erroT.textContent = "";

        return ok;
    }

    btnSalvar.addEventListener("click", async () => {
        const dados = coletarDados();
        if (!validar(dados)) return;

        btnSalvar.textContent = "Salvando...";
        btnSalvar.disabled = true;

        try {
            const url    = vagaEmEdicaoId ? `http://localhost:8080/vagas/${vagaEmEdicaoId}` : "http://localhost:8080/vagas";
            const method = vagaEmEdicaoId ? "PUT" : "POST";
            const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(dados) });

            if (!res.ok) { const err = await res.json().catch(() => ({})); alert(err.erro || "Erro ao salvar."); return; }

            const salva = await res.json();
            modal.hide();
            limpar();
            if (callbackSalvar) callbackSalvar(salva);
        } catch (e) {
            console.error(e);
            alert("Erro ao conectar com o servidor.");
        } finally {
            btnSalvar.textContent = "Salvar Vaga";
            btnSalvar.disabled = false;
        }
    });

    window.ModalVaga = {
        onSalvar(cb)       { callbackSalvar = cb; },
        abrirParaCriar()   { limpar(); titulo.textContent = "Nova Vaga"; modal.show(); },
        abrirParaEditar(v) { limpar(); titulo.textContent = "Editar Vaga"; vagaEmEdicaoId = v.id; preencherCampos(v); modal.show(); }
    };

})();