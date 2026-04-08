document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const feedback = document.getElementById("feedback");

  function mostrarFeedback(mensagem, tipo) {
    feedback.textContent = mensagem;
    feedback.className = `feedback ${tipo}`;
    feedback.style.display = "block";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!email || !senha) {
      mostrarFeedback("Preencha todos os campos.", "erro");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, senha })
      });

      if (!response.ok) {
        // Lê o JSON de erro vindo do GlobalExceptionHandler
        const data = await response.json().catch(() => ({}));
        mostrarFeedback(data.erro || "Email ou senha inválidos.", "erro");
        return;
      }

      mostrarFeedback("Login realizado com sucesso!", "sucesso");
      setTimeout(() => {
        window.location.href = "/modules/home/home.html";
      }, 1500);

    } catch (error) {
      console.error(error);
      mostrarFeedback("Erro ao conectar com o servidor.", "erro");
    }
  });
});