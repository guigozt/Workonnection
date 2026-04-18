document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Cadastro carregado");

  const form = document.getElementById("cadastroForm");
  const btnVoltar = document.querySelector(".btn-back");
  const feedbackEl = document.getElementById("feedback");

  if (!form) {
    console.error("❌ Form não encontrado");
    return;
  }

  btnVoltar?.addEventListener("click", () => {
    console.log("⬅️ Voltando página");
    window.history.back();
  });

  const inputs = {
    nome: form.querySelector('[name="nomeDadosPessoais"]'),
    cpf: form.querySelector('[name="cpfDadosPessoais"]'),
    data: form.querySelector('[name="dataNascimentoDadosPessoais"]'),
    telefone: form.querySelector('[name="telefoneDadosPessoais"]'),
    email: form.querySelector('[name="emailDadosPessoais"]'),
    senha: form.querySelector('[name="senhaDadosPessoais"]'),
    confirmarSenha: form.querySelector('[name="confirmarSenha"]')
  };

  // ── Feedback global ─────────────────

  function mostrarFeedback(mensagem, tipo) {
    console.log(`📢 Feedback (${tipo}):`, mensagem);
    feedbackEl.textContent = mensagem;
    feedbackEl.className = `feedback ${tipo}`;
    feedbackEl.style.display = "block";
  }

  // ── Erro por campo ─────────────────

  function mostrarErro(input, mensagem) {
    if (!input) return;

    console.warn(`⚠️ Erro no campo ${input.name}:`, mensagem);

    const small = input.closest(".input-group")?.querySelector(".error-message");

    if (small) small.textContent = mensagem || "";

    input.classList.add("error");
    input.classList.remove("success");
  }

  function mostrarSucesso(input) {
    if (!input) return;

    console.log(`✅ Campo válido: ${input.name}`);

    const small = input.closest(".input-group")?.querySelector(".error-message");

    if (small) small.textContent = "";

    input.classList.remove("error");
    input.classList.add("success");
  }

  function validar(input, condicao, mensagem) {
    console.log(`🔎 Validando ${input.name}:`, condicao);

    if (!condicao) {
      mostrarErro(input, mensagem);
      return false;
    }

    mostrarSucesso(input);
    return true;
  }

  // ── Validações ─────────────────

  inputs.nome?.addEventListener("input", () => {
    validar(inputs.nome, inputs.nome.value.trim().length >= 3, "Mínimo 3 caracteres");
  });

  inputs.cpf?.addEventListener("input", () => {
    let v = inputs.cpf.value.replace(/\D/g, "");

    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    inputs.cpf.value = v;

    console.log("🧾 CPF digitado:", v);

    if (v.replace(/\D/g, "").length < 11) {
      mostrarErro(inputs.cpf, "CPF incompleto");
    } else {
      validar(inputs.cpf, validarCPF(v), "CPF inválido");
    }
  });

  inputs.telefone?.addEventListener("input", () => {
    let v = inputs.telefone.value.replace(/\D/g, "");

    v = v.length > 10
      ? v.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3")
      : v.replace(/^(\d{2})(\d{4})(\d{4}).*/, "($1) $2-$3");

    inputs.telefone.value = v;

    validar(inputs.telefone, v.length >= 10, "Telefone incompleto");
  });

  function validarData() {
    if (!inputs.data) return;

    const valor = inputs.data.value;
    console.log("📅 Data:", valor);

    if (!valor) return mostrarErro(inputs.data, "Data obrigatória");

    const nascimento = new Date(valor);
    const hoje = new Date();

    let idade = hoje.getFullYear() - nascimento.getFullYear();

    if (
      hoje.getMonth() < nascimento.getMonth() ||
      (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())
    ) idade--;

    console.log("🎂 Idade:", idade);

    if (idade < 16) return mostrarErro(inputs.data, "Mínimo 16 anos");
    if (idade > 120) return mostrarErro(inputs.data, "Data inválida");

    mostrarSucesso(inputs.data);
  }

  inputs.data?.addEventListener("change", validarData);

  inputs.email?.addEventListener("input", () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validar(inputs.email, regex.test(inputs.email.value.trim()), "Email inválido");
  });

  inputs.senha?.addEventListener("input", () => {
    validar(inputs.senha, inputs.senha.value.length >= 6, "Mínimo 6 caracteres");

    if (inputs.confirmarSenha.value) {
      validar(inputs.confirmarSenha,
        inputs.confirmarSenha.value === inputs.senha.value,
        "Senhas não coincidem"
      );
    }
  });

  inputs.confirmarSenha?.addEventListener("input", () => {
    validar(inputs.confirmarSenha,
      inputs.confirmarSenha.value === inputs.senha.value,
      "Senhas não coincidem"
    );
  });

  // ── CPF ─────────────────

  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++)
      soma += parseInt(cpf[i - 1]) * (11 - i);

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;

    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;

    for (let i = 1; i <= 10; i++)
      soma += parseInt(cpf[i - 1]) * (12 - i);

    resto = (soma * 10) % 11;
    if (resto >= 10) resto = 0;

    return resto === parseInt(cpf[10]);
  }

  // ── Tipo usuário ─────────────────

  const botoesTipo = document.querySelectorAll(".user-btn");
  let tipoSelecionado = null;

  botoesTipo.forEach(btn => {
    btn.addEventListener("click", () => {
      const tipo = btn.dataset.tipo;

      console.log("👤 Tipo selecionado:", tipo);

      botoesTipo.forEach(b => b.classList.remove("ativo"));
      btn.classList.add("ativo");

      tipoSelecionado = tipo;
    });
  });

  // ── Submit ─────────────────

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("📤 Enviando formulário...");

    let valido = true;

    Object.values(inputs).forEach(input => {
      if (!input.value.trim() || input.classList.contains("error")) {
        mostrarErro(input, "Campo inválido");
        valido = false;
      }
    });

    if (!tipoSelecionado) {
      alert("Selecione um tipo de usuário!");
      console.warn("❌ Tipo não selecionado");
      return;
    }

    if (!valido) {
      mostrarFeedback("Corrija os campos antes de continuar.", "erro");
      alert("Verifique os campos!");
      return;
    }

    const payload = {
      nome: inputs.nome.value.trim(),
      cpf: inputs.cpf.value,
      dataNascimento: inputs.data.value,
      telefone: inputs.telefone.value,
      email: inputs.email.value.trim(),
      senha: inputs.senha.value,
      tipoUsuario: tipoSelecionado
    };

    console.log("📦 Payload:", payload);

    try {
      const response = await fetch("http://localhost:8080/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });

      console.log("📡 Status:", response.status);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error("❌ Erro backend:", data);

        mostrarFeedback(data.erro || "Erro ao cadastrar.", "erro");
        alert("Erro no cadastro!");
        return;
      }

      mostrarFeedback("Cadastro realizado com sucesso!", "sucesso");
      alert("Cadastro feito!");

      setTimeout(() => {
        window.location.href = "/modules/auth/Login.html";
      }, 1500);

    } catch (error) {
      console.error("❌ Erro conexão:", error);
      mostrarFeedback("Erro ao conectar com servidor.", "erro");
      alert("Servidor offline!");
    }
  });
});