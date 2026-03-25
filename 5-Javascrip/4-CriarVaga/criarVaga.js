document.addEventListener("DOMContentLoaded", () => {

  const botaoNovaVaga = document.querySelector(".botao-publicar");
  const modalVaga = new bootstrap.Modal(document.getElementById("modalVaga"));
  const btnSalvarVaga = document.getElementById("btnSalvarVaga");

  const inputs = {
    empresa: document.getElementById("inputEmpresa"),
    cargo: document.getElementById("inputCargo"),
    descricao: document.getElementById("inputDescricao"),
    modalidade: document.getElementById("inputModalidade"),
    horario: document.getElementById("inputHorario"),
    beneficios: document.getElementById("inputBeneficios"),
    localizacao: document.getElementById("inputLocalizacao"),
    salario: document.getElementById("inputSalario"),
    data: document.getElementById("inputData"),
    requisitos: document.getElementById("inputRequisitos"),
    email: document.getElementById("inputEmail")
  };

  const vagasContainer = document.getElementById("vagas-container");
  const usuarioLogado = localStorage.getItem("usuarioLogado") || "Guest";

  const user = {
    username: usuarioLogado,
    profilePic: "https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
  };

  let vagas = JSON.parse(localStorage.getItem("vagas")) || [];

  // =========================
  // FEEDBACK VISUAL
  // =========================

  function mostrarErro(input, mensagem) {
    const small = input.parentElement.querySelector(".error-message");
    if (small) small.textContent = mensagem;
    input.classList.add("error");
    input.classList.remove("success");
  }

  function mostrarSucesso(input) {
    const small = input.parentElement.querySelector(".error-message");
    if (small) small.textContent = "";
    input.classList.remove("error");
    input.classList.add("success");
  }

  // =========================
  // VALIDAÇÕES
  // =========================

  function validarTexto(input, nome, min = 3) {
    const valor = input.value.trim();

    if (!valor) {
      mostrarErro(input, `${nome} é obrigatório`);
      return false;
    }

    if (valor.length < min) {
      mostrarErro(input, `${nome} deve ter pelo menos ${min} caracteres`);
      return false;
    }

    mostrarSucesso(input);
    return true;
  }

  function validarEmail(input) {
    const valor = input.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!valor) {
      mostrarErro(input, "Email é obrigatório");
      return false;
    }

    if (!regex.test(valor)) {
      mostrarErro(input, "Email inválido (ex: exemplo@email.com)");
      return false;
    }

    mostrarSucesso(input);
    return true;
  }

  function validarSalario(input) {
    const valor = parseFloat(
      input.value.replace(/\./g, "").replace(",", ".")
    );

    if (!input.value.trim()) {
      mostrarErro(input, "Salário é obrigatório");
      return false;
    }

    if (isNaN(valor)) {
      mostrarErro(input, "Salário inválido");
      return false;
    }

    if (valor <= 0) {
      mostrarErro(input, "Salário deve ser maior que zero");
      return false;
    }

    mostrarSucesso(input);
    return true;
  }

  function validarData(input) {
    if (!input.value) {
      mostrarErro(input, "Data obrigatória");
      return false;
    }

    const data = new Date(input.value);
    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    if (data < hoje) {
      mostrarErro(input, "Data não pode ser no passado");
      return false;
    }

    const limite = new Date();
    limite.setFullYear(limite.getFullYear() + 1);

    if (data > limite) {
      mostrarErro(input, "Máximo de 1 ano");
      return false;
    }

    mostrarSucesso(input);
    return true;
  }

  function validarHorario(input) {
    const valor = input.value.trim();
    const regex = /^([01]\d|2[0-3]):([0-5]\d)\s?-\s?([01]\d|2[0-3]):([0-5]\d)$/;

    if (!valor) {
      mostrarErro(input, "Horário obrigatório");
      return false;
    }

    if (!regex.test(valor)) {
      mostrarErro(input, "Formato: 08:00 - 18:00");
      return false;
    }

    mostrarSucesso(input);
    return true;
  }

  // =========================
  // VALIDAÇÃO EM TEMPO REAL
  // =========================

  const touched = new WeakSet();

  function validarCampo(input) {

    if (input === inputs.email) return validarEmail(input);
    if (input === inputs.salario) return validarSalario(input);
    if (input === inputs.data) return validarData(input);
    if (input === inputs.horario) return validarHorario(input);

    if (input === inputs.descricao) return validarTexto(input, "Descrição", 10);
    if (input === inputs.requisitos) return validarTexto(input, "Requisitos", 5);

    return validarTexto(input, input.placeholder || "Campo");
  }

  Object.values(inputs).forEach(input => {

    input.addEventListener("input", () => {
      if (touched.has(input)) {
        if (input.value.length < 2) return;
        validarCampo(input);
      }
    });

    input.addEventListener("blur", () => {
      touched.add(input);
      validarCampo(input);
    });

  });

  // =========================
  // MÁSCARA SALÁRIO
  // =========================

  inputs.salario.addEventListener("input", () => {
    let v = inputs.salario.value.replace(/\D/g, "");
    v = (v / 100).toFixed(2)
      .replace(".", ",")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    inputs.salario.value = v;
  });

  // =========================
  // LIMPAR CAMPOS
  // =========================

  function limparCampos() {
    Object.values(inputs).forEach(input => {
      input.value = "";
      input.classList.remove("error", "success");
      const small = input.parentElement.querySelector(".error-message");
      if (small) small.textContent = "";
    });
  }

  // =========================
  // RENDER VAGAS
  // =========================

  function renderVagas() {
    vagasContainer.querySelectorAll(".vaga-card[data-created]").forEach(v => v.remove());

    vagas.forEach((vaga, index) => {
      const div = document.createElement("div");
      div.className = "vaga-card";
      div.dataset.created = true;

      div.innerHTML = `
        <div class="vaga-header d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-2">
            <img src="${user.profilePic}" class="rounded-circle" style="width:50px;height:50px;">
            <div>
              <h5>${vaga.empresa}</h5>
              <small>${vaga.cargo}</small>
            </div>
          </div>

          ${vaga.creator === user.username ? `
          <div class="dropdown">
            <button class="btn btn-light btn-sm dropdown-toggle" data-bs-toggle="dropdown">
              <i class="fas fa-ellipsis-h"></i>
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" onclick="editarVaga(${index})">Editar</a></li>
              <li><a class="dropdown-item" href="#" onclick="excluirVaga(${index})">Excluir</a></li>
            </ul>
          </div>` : ""}
        </div>

        <div class="vaga-body">
          <p><b>Descrição:</b> ${vaga.descricao}</p>
          <p><b>Modalidade:</b> ${vaga.modalidade}</p>
          <p><b>Horário:</b> ${vaga.horario}</p>
          <p><b>Benefícios:</b> ${vaga.beneficios}</p>
          <p><b>Localização:</b> ${vaga.localizacao}</p>
          <p><b>Salário:</b> ${vaga.salario}</p>
          <p><b>Data:</b> ${vaga.data}</p>
          <p><b>Requisitos:</b> ${vaga.requisitos}</p>
          <p><b>Email:</b> ${vaga.email}</p>
        </div>
      `;

      vagasContainer.appendChild(div);
    });
  }

  // =========================
  // SALVAR VAGA
  // =========================

  btnSalvarVaga.addEventListener("click", () => {

    let valido = true;

    valido = validarTexto(inputs.empresa, "Empresa") && valido;
    valido = validarTexto(inputs.cargo, "Cargo") && valido;
    valido = validarTexto(inputs.modalidade, "Modalidade") && valido;
    valido = validarHorario(inputs.horario) && valido;
    valido = validarTexto(inputs.localizacao, "Localização") && valido;
    valido = validarSalario(inputs.salario) && valido;
    valido = validarData(inputs.data) && valido;
    valido = validarTexto(inputs.descricao, "Descrição", 10) && valido;
    valido = validarTexto(inputs.beneficios, "Benefícios") && valido;
    valido = validarTexto(inputs.requisitos, "Requisitos", 5) && valido;
    valido = validarEmail(inputs.email) && valido;

    if (!valido) {
      alert("Corrija os campos antes de salvar!");
      return;
    }

    const novaVaga = {};
    Object.keys(inputs).forEach(key => {
      novaVaga[key] = inputs[key].value.trim();
    });

    novaVaga.creator = user.username;

    vagas.push(novaVaga);
    localStorage.setItem("vagas", JSON.stringify(vagas));

    renderVagas();
    modalVaga.hide();
  });

  // =========================
  // EDITAR / EXCLUIR
  // =========================

  window.excluirVaga = function(index) {
    if (vagas[index].creator !== user.username) {
      return alert("Você não pode excluir essa vaga!");
    }

    vagas.splice(index, 1);
    localStorage.setItem("vagas", JSON.stringify(vagas));
    renderVagas();
  };

  window.editarVaga = function(index) {
    if (vagas[index].creator !== user.username) {
      return alert("Você não pode editar essa vaga!");
    }

    Object.keys(inputs).forEach(key => {
      inputs[key].value = vagas[index][key];
    });

    vagas.splice(index, 1);
    localStorage.setItem("vagas", JSON.stringify(vagas));

    modalVaga.show();
  };

  // =========================
  // ABRIR MODAL LIMPO
  // =========================

  botaoNovaVaga.addEventListener("click", () => {
    limparCampos();
    modalVaga.show();
  });

  renderVagas();
});