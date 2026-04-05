// perfil-loader.js
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 🔹 Pega o usuário logado via auth.js
        const response = await fetch("http://localhost:8080/usuarios/me", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Não autenticado");

        const usuario = await response.json();

        if (!usuario) throw new Error("Sem sessão");

        console.log("Usuário logado:", usuario);

        // 🔹 Preenche os campos básicos do perfil
        const nomeEl = document.getElementById("perfil-nome");
        const emailEl = document.getElementById("perfil-email");
        const fotoEl = document.getElementById("perfil-foto");

        if (nomeEl) nomeEl.textContent = usuario.nome || "Nome não definido";
        if (emailEl) emailEl.textContent = usuario.email || "E-mail não definido";
        if (fotoEl) fotoEl.src = usuario.foto || "https://newcastle-online.org/uploads/set_resources_2/84c1e40ea0e759e3f1505eb1788ddf3c_default_photo.png";

    } catch (error) {
        console.log("Usuário não logado, redirecionando...");
        window.location.href = "/index.html";
    }
});