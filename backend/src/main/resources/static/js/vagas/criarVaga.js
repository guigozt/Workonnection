document.addEventListener("DOMContentLoaded", () => {

  const botaoNovaVaga = document.querySelector(".botao-publicar");
  const modalVaga = new bootstrap.Modal(document.getElementById("modalVaga"));
  const btnSalvarVaga = document.getElementById("btnSalvarVaga");

  const inputs = {
    empresa: document.getElementById("inputEmpresa"),
    cargo: document.getElementById("inputCargo"),
    descricao: document.getElementById("inputDescricao"),
    modalidade: document.getElementById("inputModalidade"),
    horaInicio: document.getElementById("inputHoraInicio"),
    horaFim: document.getElementById("inputHoraFim"),
    beneficios: document.getElementById("inputBeneficios"),
    localizacao: document.getElementById("inputLocalizacao"),
    salario: document.getElementById("inputSalario"),
    data: document.getElementById("inputData"),
    requisitos: document.getElementById("inputRequisitos"),
    email: document.getElementById("inputEmail")
  };

  const vagasContainer = document.getElementById("vagas-container");

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
      mostrarErro(input, "Email inválido");
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

    if (isNaN(valor) || valor <= 0) {
      mostrarErro(input, "Salário inválido");
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

    mostrarSucesso(input);
    return true;
  }

  function validarHorario() {
    const inicio = inputs.horaInicio.value;
    const fim = inputs.horaFim.value;

    if (!inicio || !fim) {
      mostrarErro(inputs.horaFim, "Horário obrigatório");
      return false;
    }

    if (inicio >= fim) {
      mostrarErro(inputs.horaFim, "Hora final deve ser maior");
      return false;
    }

    mostrarSucesso(inputs.horaFim);
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

    if (input === inputs.descricao) return validarTexto(input, "Descrição", 10);
    if (input === inputs.requisitos) return validarTexto(input, "Requisitos", 5);

    return validarTexto(input, input.placeholder || "Campo");
  }

  Object.values(inputs).forEach(input => {

    if (!input) return;

    input.addEventListener("input", () => {
      if (touched.has(input)) validarCampo(input);
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
  // LIMITAR DATA
  // =========================

  const hoje = new Date().toISOString().split("T")[0];
  const max = new Date();
  max.setFullYear(max.getFullYear() + 1);

  inputs.data.min = hoje;
  inputs.data.max = max.toISOString().split("T")[0];

  // =========================
  // LIMPAR CAMPOS
  // =========================

  function limparCampos() {
    Object.values(inputs).forEach(input => {
      if (!input) return;
      input.value = "";
      input.classList.remove("error", "success");
      const small = input.parentElement.querySelector(".error-message");
      if (small) small.textContent = "";
    });
  }

  // =========================
  // CARREGAR VAGAS
  // =========================

  async function carregarVagas() {
    try {
      const response = await fetch("http://localhost:8080/vagas", {
        credentials: "include"
      });

      const vagas = await response.json();

      vagasContainer.innerHTML = "";

      vagas.forEach(vaga => {
        const div = document.createElement("div");
        div.className = "vaga-card";

        div.innerHTML = `
          <div class="vaga-body">
            <h5>${vaga.empresa}</h5>
            <p><b>${vaga.cargo}</b></p>
            <p>${vaga.descricao}</p>
            <p><b>Modalidade:</b> ${vaga.modalidade}</p>
            <p><b>Horário:</b> ${vaga.horario}</p>
            <p><b>Data:</b> ${new Date(vaga.data).toLocaleDateString("pt-BR")}</p>
            <p><b>Localização:</b> ${vaga.localizacao}</p>
            <p><b>Salário:</b> ${vaga.salario}</p>
          </div>
        `;

        vagasContainer.appendChild(div);
      });

    } catch (error) {
      console.error("Erro ao carregar vagas:", error);
    }
  }

  // =========================
  // SALVAR VAGA
  // =========================

  btnSalvarVaga.addEventListener("click", async () => {

    let valido = true;

    valido = validarTexto(inputs.empresa, "Empresa") && valido;
    valido = validarTexto(inputs.cargo, "Cargo") && valido;
    valido = validarTexto(inputs.modalidade, "Modalidade") && valido;
    valido = validarTexto(inputs.localizacao, "Localização") && valido;
    valido = validarTexto(inputs.beneficios, "Benefícios") && valido;
    valido = validarTexto(inputs.descricao, "Descrição", 10) && valido;
    valido = validarTexto(inputs.requisitos, "Requisitos", 5) && valido;

    valido = validarEmail(inputs.email) && valido;
    valido = validarSalario(inputs.salario) && valido;
    valido = validarData(inputs.data) && valido;
    valido = validarHorario() && valido;

    if (!valido) {
      alert("Corrija os campos!");
      return;
    }

    const novaVaga = {
      empresa: inputs.empresa.value.trim(),
      cargo: inputs.cargo.value.trim(),
      descricao: inputs.descricao.value.trim(),
      modalidade: inputs.modalidade.value.trim(),
      beneficios: inputs.beneficios.value.trim(),
      localizacao: inputs.localizacao.value.trim(),
      salario: inputs.salario.value.trim(),
      data: inputs.data.value,
      requisitos: inputs.requisitos.value.trim(),
      email: inputs.email.value.trim(),
      horario: `${inputs.horaInicio.value} - ${inputs.horaFim.value}`
    };

    try {
      const response = await fetch("http://localhost:8080/vagas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(novaVaga)
      });

      if (!response.ok) throw new Error();

      alert("Vaga criada com sucesso!");

      modalVaga.hide();
      limparCampos();
      carregarVagas();

    } catch (error) {
      alert("Erro ao criar vaga");
    }
  });

  // =========================
  // ABRIR MODAL
  // =========================

  botaoNovaVaga.addEventListener("click", () => {
    limparCampos();
    modalVaga.show();
  });

  // =========================
  // INIT
  // =========================

  carregarVagas();

});