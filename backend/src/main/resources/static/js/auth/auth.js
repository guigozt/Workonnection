document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:8080/usuarios/me", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Não autenticado");

        const usuario = await response.json();
        if (!usuario) throw new Error("Sem sessão");

        console.log("Usuário autenticado:", usuario);

    } catch (error) {
        console.log("Redirecionando para login...");
        window.location.href = "/index.html";
    }
});