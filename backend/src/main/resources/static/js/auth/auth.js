// auth.js — inclua esse script em todas as páginas que exigem login
// Ele verifica com o backend se há sessão ativa.
// Se não houver, redireciona para o login.

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://localhost:8080/usuarios/me", {
            method: "GET",
            credentials: "include"  // envia o cookie de sessão
        });

        if (!response.ok) {
            // Sessão inválida ou expirada → vai para login
            window.location.href = "/modules/auth/Login.html";
            return;
        }

        const usuario = await response.json();
        console.log("Sessão ativa:", usuario.nome);

        // Opcional: exporta os dados do usuário para outros scripts da página
        window.usuarioLogado = usuario;

    } catch (error) {
        // Servidor fora do ar ou erro de rede → vai para login
        console.error("Erro ao verificar sessão:", error);
        window.location.href = "/modules/auth/Login.html";
    }
});