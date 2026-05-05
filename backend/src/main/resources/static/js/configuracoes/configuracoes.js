document.addEventListener("DOMContentLoaded", async () => {

    let usuario;

    try {
        const res = await fetch("http://localhost:8080/usuarios/me", {
            credentials: "include"
        });

        if (!res.ok) throw new Error();

        usuario = await res.json();

    } catch {
        window.location.href = "/modules/login/login.html";
        return;
    }

    // =====================
    // TEMA (APENAS SALVAR)
    // =====================

    const temaAtual = usuario.configuracoes?.tema || "claro";

    document.querySelectorAll(".tema-chip").forEach(chip => {

        chip.classList.toggle("ativo", chip.dataset.tema === temaAtual);

        chip.addEventListener("click", async () => {

            const novoTema = chip.dataset.tema;

            await salvarConfiguracoes({ tema: novoTema });

            // 🔥 atualiza tudo corretamente
            location.reload();
        });
    });

});

// =====================
// API
// =====================

async function salvarConfiguracoes(config) {
    await fetch("http://localhost:8080/usuarios/configuracoes", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
    });
}