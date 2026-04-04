document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8080/usuarios/me", {
    credentials: "include"
  })
  .then(res => {
    if (!res.ok) throw new Error();
    return res.json();
  })
  .then(usuario => {
    if (!usuario) {
      window.location.href = "/index.html";
      return;
    }

    console.log("Usuário logado: ", usuario.nome);

    const nomeEl = document.getElementById("nomeUsuario");
    if (nomeEl) nomeEl.textContent = usuario.nome;
  })
  .catch(() => {
    window.location.href = "/index.html";
  });
});