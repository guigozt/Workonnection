document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const feedback = document.getElementById("feedback");

  const inputs = {
    email: document.getElementById("email"),
    senha: document.getElementById("senha")
  };

  console.log("Login carregado");

  // ── Feedback global ─────────────────────────────
  function mostrarFeedback(msg, tipo) {
    console.log("Feedback:", msg);
    feedback.textContent = msg;
    feedback.className = `feedback ${tipo}`;
    feedback.style.display = "block";
  }

  // ── Erro por campo ─────────────────────────────
  function mostrarErro(input, msg) {
    const group = input.closest(".input-group");
    const small = group.querySelector(".error-message");

    if (small) small.textContent = msg;

    input.classList.add("error");
    input.classList.remove("success");
  }

  function limparErro(input) {
    const group = input.closest(".input-group");
    const small = group.querySelector(".error-message");

    if (small) small.textContent = "";

    input.classList.remove("error");
  }

  // ── Submit ─────────────────────────────────────
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("Submit acionado");

    const email = inputs.email.value.trim();
    const senha = inputs.senha.value;

    let valido = true;

    // limpa erros antes
    Object.values(inputs).forEach(limparErro);

    // validações simples
    if (!email) {
      mostrarErro(inputs.email, "Email obrigatório");
      valido = false;
    }

    if (!senha) {
      mostrarErro(inputs.senha, "Senha obrigatória");
      valido = false;
    }

    // valida email formato (opcional leve)
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !regex.test(email)) {
      mostrarErro(inputs.email, "Email inválido");
      valido = false;
    }

    if (!valido) {
      mostrarFeedback("Preencha os campos corretamente.", "erro");
      return;
    }

    try {
      console.log("Enviando login...");

      const response = await fetch("http://localhost:8080/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, senha })
      });

      console.log("Resposta:", response.status);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        console.error("Erro backend:", data);

        mostrarFeedback(data.erro || "Email ou senha inválidos.", "erro");
        return;
      }

      console.log("Login sucesso");

      mostrarFeedback("Login realizado com sucesso!", "sucesso");

      setTimeout(() => {
        window.location.href = "/modules/home/home.html";
      }, 1200);

    } catch (error) {
      console.error("Erro conexão:", error);

      mostrarFeedback("Erro ao conectar com o servidor.", "erro");
    }
  });
});