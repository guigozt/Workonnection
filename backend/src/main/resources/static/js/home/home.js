document.addEventListener("DOMContentLoaded", () => {
  // auth.js já verificou a sessão e populou window.usuarioLogado
  // aqui só usamos os dados, sem novo fetch
  const usuario = window.usuarioLogado;

  if (usuario) {
    const nomeEl = document.getElementById("nomeUsuario");
    if (nomeEl) nomeEl.textContent = usuario.nome;

    console.log("Usuário logado:", usuario.nome);
  }

  // restante da lógica da home (vagas, modal, etc.)
});