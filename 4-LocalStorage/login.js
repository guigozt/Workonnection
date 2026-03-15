document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const feedback = document.getElementById("feedback");

  // 🔹 Função para mostrar feedback
  function mostrarFeedback(mensagem, tipo) {
    feedback.textContent = mensagem;
    feedback.className = `feedback ${tipo}`;
    feedback.style.display = "block";
  }

  // 🔹 Simulação de API (igual apiPost do React)
  function apiLogin(email, senha) {
    return new Promise((resolve, reject) => {
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      const usuarioEncontrado = usuarios.find(
        (u) => u.emailDadosPessoais === email
      );

      if (!usuarioEncontrado) {
        reject(new Error("Usuário não encontrado."));
        return;
      }

      if (usuarioEncontrado.senhaDadosPessoais !== senha) {
        reject(new Error("Senha incorreta."));
        return;
      }

      resolve(usuarioEncontrado);
    });
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
      const usuario = await apiLogin(email, senha);

      localStorage.setItem("usuarioLogado", usuario.emailDadosPessoais);

      mostrarFeedback(`Bem vindo(a) ${usuario.nomeDadosPessoais}!`, "sucesso");

      setTimeout(() => {
        window.location.href = "/2-Paginas/Home/home.html";
      }, 1500);

    } catch (error) {
      mostrarFeedback(error.message, "erro");
    }
  });
});