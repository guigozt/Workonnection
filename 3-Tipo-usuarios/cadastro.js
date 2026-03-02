document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("cadastroForm");
  const feedback = document.getElementById("feedback");
  const btnVoltar = document.querySelector(".btn-back");

  if (!form) return;

  if (btnVoltar) {
    btnVoltar.addEventListener("click", () => {
      window.history.back();
    });
  }

  function mostrarFeedback(mensagem, tipo) {
    feedback.textContent = mensagem;
    feedback.style.display = "block";
    feedback.style.padding = "10px";
    feedback.style.marginTop = "10px";
    feedback.style.borderRadius = "6px";

    if (tipo === "sucesso") {
      feedback.style.backgroundColor = "#d4edda";
      feedback.style.color = "#155724";
    } else {
      feedback.style.backgroundColor = "#f8d7da";
      feedback.style.color = "#721c24";
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const novoUsuario = Object.fromEntries(formData.entries());

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioExiste = usuarios.find(
      u => u.emailDadosPessoais === novoUsuario.emailDadosPessoais
    );

    if (usuarioExiste) {
      mostrarFeedback("Usuário já cadastrado!", "erro");
      return;
    }

    usuarios.push(novoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mostrarFeedback("Cadastro realizado com sucesso!", "sucesso");

    setTimeout(() => {
      window.location.href = "../../index.html"; // ajuste se necessário
    }, 1500);
  });

});