document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastroForm");
  const btnVoltar = document.querySelector(".btn-back");
  if (!form) return;

  btnVoltar?.addEventListener("click", () => window.history.back());

  // Inputs agrupados
  const inputs = {
    nome: form.querySelector('[name="nomeDadosPessoais"]'),
    cpf: form.querySelector('[name="cpfDadosPessoais"]'),
    data: form.querySelector('[name="dataNascimentoDadosPessoais"]'),
    telefone: form.querySelector('[name="telefoneDadosPessoais"]'),
    email: form.querySelector('[name="emailDadosPessoais"]'),
    senha: form.querySelector('[name="senhaDadosPessoais"]'),
    confirmarSenha: form.querySelector('[name="confirmarSenha"]')
  };

  // Funções de feedback
  function mostrarErro(input, mensagem) {
    if (!input) return;
    const small = input.parentElement.querySelector(".error-message");
    small.textContent = mensagem || "";
    input.classList.add("error");
    input.classList.remove("success");
  }

  function mostrarSucesso(input) {
    if (!input) return;
    const small = input.parentElement.querySelector(".error-message");
    small.textContent = "";
    input.classList.remove("error");
    input.classList.add("success");
  }

  function validar(input, condicao, mensagem) {
    if (!condicao) {
      mostrarErro(input, mensagem);
      return false;
    }
    mostrarSucesso(input);
    return true;
  }

  // Validações individuais

  // Nome mínimo 3 caracteres
  inputs.nome?.addEventListener("input", () => {
    validar(inputs.nome, inputs.nome.value.trim().length >= 3, "Mínimo 3 caracteres");
  });

  // CPF com máscara + validação
  inputs.cpf?.addEventListener("input", () => {
    let v = inputs.cpf.value.replace(/\D/g, "");

    // Máscara
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    inputs.cpf.value = v;

    if (v.replace(/\D/g, "").length < 11) {
      mostrarErro(inputs.cpf, "CPF incompleto");
    } else {
      validar(inputs.cpf, validarCPF(v), "CPF inválido");
    }
  });

  // Telefone com máscara
  inputs.telefone?.addEventListener("input", () => {
    let v = inputs.telefone.value.replace(/\D/g, "");
    v = v.length > 10
      ? v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3")
      : v.replace(/^(\d{2})(\d{4})(\d{4}).*/, "($1) $2-$3");
    inputs.telefone.value = v;

    validar(inputs.telefone, v.length >= 10, "Telefone incompleto");
  });

  // Data de nascimento mínima 16 anos
  function validarData() {
    if (!inputs.data) return;
    const valor = inputs.data.value;
    if (!valor) return mostrarErro(inputs.data, "Data obrigatória");

    const nascimento = new Date(valor);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    if (hoje.getMonth() < nascimento.getMonth() ||
        (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }

    if (idade < 16) return mostrarErro(inputs.data, "Mínimo 16 anos");
    if (idade > 120) return mostrarErro(inputs.data, "Data inválida");

    mostrarSucesso(inputs.data);
  }

  inputs.data?.addEventListener("change", validarData);
  inputs.data?.addEventListener("blur", validarData);

  // Email simples
  inputs.email?.addEventListener("input", () => {
    const email = inputs.email.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return mostrarErro(inputs.email, "Email obrigatório");
    validar(inputs.email, regex.test(email), "Email inválido");
  });

  // Senha mínimo 6 caracteres
  inputs.senha?.addEventListener("input", () => {
    validar(inputs.senha, inputs.senha.value.length >= 6, "Mínimo 6 caracteres");
  });

  // Confirmar senha igual à senha
  inputs.confirmarSenha?.addEventListener("input", () => {
    validar(inputs.confirmarSenha, inputs.confirmarSenha.value === inputs.senha.value, "Senhas não coincidem");
  });

  // Função real de CPF
  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;

    return resto === parseInt(cpf[10]);
  }

  // ===== TIPO DE USUÁRIO =====
  const botoesTipo = document.querySelectorAll(".user-btn");
  const tipoTitulo = document.getElementById("tipoTitulo");
  const tipoBox = document.getElementById("tipoBox");
  let tipoSelecionado = null;

  botoesTipo.forEach(btn => {
    btn.addEventListener("click", () => {
      const tipo = btn.dataset.tipo;
      if (tipoSelecionado === tipo) {
        btn.classList.remove("ativo");
        btn.setAttribute("aria-pressed", "false");
        tipoSelecionado = null;
        tipoBox?.classList.remove("is-open");
        tipoTitulo.textContent = "";
        return;
      }
      botoesTipo.forEach(b => {
        b.classList.remove("ativo");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("ativo");
      btn.setAttribute("aria-pressed", "true");
      tipoSelecionado = tipo;
      tipoBox?.classList.add("is-open");
      tipoTitulo.textContent = `Tipo selecionado: ${tipo.toUpperCase()}`;
    });
  });

  // ===== SUBMIT =====
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valido = true;
    Object.values(inputs).forEach(input => {
      if (input && (!input.value || input.classList.contains("error"))) {
        valido = false;
        mostrarErro(input, "Campo obrigatório ou inválido");
      }
    });

    if (!valido) {
      alert("Corrija os campos antes de continuar!");
      return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const email = inputs.email.value;

    if (usuarios.find(u => u.emailDadosPessoais === email)) {
      alert("Usuário já existe!");
      return;
    }

    const novoUsuario = {
      ...Object.fromEntries(new FormData(form).entries()),
      tipoUsuario: tipoSelecionado
    };

    usuarios.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso! Redirecionando para login...");
    setTimeout(() => {
      window.location.href = "../../index.html";
    }, 1000);
  });

});