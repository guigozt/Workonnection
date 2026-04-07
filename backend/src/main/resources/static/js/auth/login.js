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
      mostrarFeedback("Email ou senha inválidos.", "erro");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, senha })
      });

      if (!response.ok) throw new Error("Email ou senha inválidos");

      mostrarFeedback("Login realizado com sucesso!", "sucesso");

      setTimeout(() => {
        window.location.href = "/2-Paginas/Home/home.html";
      }, 1500);

    } catch (error) {
      mostrarFeedback(error.message, "erro");
    }
  });
});