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
  const user = { username: usuarioLogado, profilePic: "https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg" };
  let vagas = JSON.parse(localStorage.getItem("vagas")) || [];

  // ===== Feedback igual cadastro =====
  function mostrarErro(input, mensagem) {
    let small = input.parentElement.querySelector(".error-message");
    if (!small) {
      small = document.createElement("small");
      small.className = "error-message";
      input.parentElement.appendChild(small);
    }
    small.textContent = mensagem;
    input.classList.add("error");
    input.classList.remove("success");
  }

  function mostrarSucesso(input) {
    let small = input.parentElement.querySelector(".error-message");
    if (small) small.textContent = "";
    input.classList.remove("error");
    input.classList.add("success");
  }

  // ===== Validações =====
  function validarObrigatorio(input) {
    if (!input.value.trim()) {
      mostrarErro(input, "Campo obrigatório");
      return false;
    }
    mostrarSucesso(input);
    return true;
  }

  function validarEmail(input) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!input.value.trim()) return mostrarErro(input, "Campo obrigatório") && false;
    if (!regex.test(input.value.trim())) return mostrarErro(input, "Email inválido") && false;
    mostrarSucesso(input);
    return true;
  }

  function validarSalario(input) {
    const valor = input.value.replace(/\D/g, "");
    if (!valor) return mostrarErro(input, "Salário obrigatório") && false;
    mostrarSucesso(input);
    return true;
  }

  function validarData(input) {
    if (!input.value.trim()) return mostrarErro(input, "Data obrigatória") && false;
    const dataSelecionada = new Date(input.value);
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const umAnoDepois = new Date(); umAnoDepois.setFullYear(umAnoDepois.getFullYear() + 1); umAnoDepois.setHours(0,0,0,0);

    if (dataSelecionada < hoje) return mostrarErro(input, "Data não pode ser passada") && false;
    if (dataSelecionada > umAnoDepois) return mostrarErro(input, "Data não pode ser maior que 1 ano") && false;

    mostrarSucesso(input);
    return true;
  }

  // ===== Máscara de salário =====
  inputs.salario.addEventListener("input", () => {
    let v = inputs.salario.value.replace(/\D/g, "");
    v = (v/100).toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    inputs.salario.value = v;
  });

  // ===== Feedback em tempo real =====
  Object.values(inputs).forEach(input => {
    input.addEventListener("blur", () => {
      if (input === inputs.email) validarEmail(input);
      else if (input === inputs.salario) validarSalario(input);
      else if (input === inputs.data) validarData(input);
      else validarObrigatorio(input);
    });
  });

  // ===== Render vagas =====
  function renderVagas() {
    vagasContainer.querySelectorAll(".vaga-card[data-created]").forEach(v => v.remove());
    vagas.forEach((vaga, index) => {
      const div = document.createElement("div");
      div.className = "vaga-card";
      div.dataset.created = true;

      div.innerHTML = `
        <div class="vaga-header d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-2">
            <img src="${user.profilePic}" alt="Logo Empresa" class="rounded-circle" style="width:50px;height:50px;">
            <div>
              <h5>${vaga.empresa}</h5>
              <small>${vaga.cargo}</small>
            </div>
          </div>
          ${vaga.creator === user.username ? `
          <div class="dropdown">
            <button class="btn btn-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
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

  // ===== Salvar vaga =====
  btnSalvarVaga.addEventListener("click", () => {
    let valido = true;
    Object.values(inputs).forEach(input => {
      if (input === inputs.email) valido = validarEmail(input) && valido;
      else if (input === inputs.salario) valido = validarSalario(input) && valido;
      else if (input === inputs.data) valido = validarData(input) && valido;
      else valido = validarObrigatorio(input) && valido;
    });

    if (!valido) return alert("Corrija os campos antes de salvar!");

    const novaVaga = {};
    Object.keys(inputs).forEach(key => novaVaga[key] = inputs[key].value.trim());
    novaVaga.creator = user.username;

    vagas.push(novaVaga);
    localStorage.setItem("vagas", JSON.stringify(vagas));
    renderVagas();
    modalVaga.hide();

    Object.values(inputs).forEach(input => {
      input.value = "";
      input.classList.remove("error", "success");
    });
  });

  // ===== Editar / Excluir =====
  window.excluirVaga = function(index) {
    if (vagas[index].creator !== user.username) return alert("Não pode excluir vaga de outro usuário!");
    vagas.splice(index, 1);
    localStorage.setItem("vagas", JSON.stringify(vagas));
    renderVagas();
  };

  window.editarVaga = function(index) {
    if (vagas[index].creator !== user.username) return alert("Não pode editar vaga de outro usuário!");
    Object.keys(inputs).forEach(key => inputs[key].value = vagas[index][key]);
    vagas.splice(index, 1);
    localStorage.setItem("vagas", JSON.stringify(vagas));
    modalVaga.show();
  };

  function limparCamposVaga() {
    Object.values(inputs).forEach(input => {
        input.value = "";
        input.classList.remove("error", "success");
        const small = input.parentElement.querySelector(".error-message");
        if (small) small.textContent = "";
  });
}


  // Ao abrir o modal, limpar campos
    botaoNovaVaga.addEventListener("click", () => {
    limparCamposVaga();   // limpa antes de abrir
    modalVaga.show();
    });
});