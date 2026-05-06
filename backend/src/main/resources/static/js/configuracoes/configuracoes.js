document.addEventListener("usuarioCarregado", async (e) => {
    const usuario = e.detail; 
    
    // 1. Definição do tema inicial
    const temaSalvo = usuario.configuracoes?.tema || localStorage.getItem("temaUsuario") || "claro";
    const chips = document.querySelectorAll('.tema-chip');

    // 2. Função para aplicar o tema e atualizar visual dos chips
    const aplicarTema = (tema) => {
        // Aplica no body/html
        if (tema === "escuro") {
            document.body.classList.add("dark-mode");
            document.documentElement.setAttribute("data-tema", "escuro");
        } else {
            document.body.classList.remove("dark-mode");
            document.documentElement.setAttribute("data-tema", "claro");
        }

        // Atualiza o visual dos chips (quem está selecionado)
        chips.forEach(chip => {
            if (chip.getAttribute('data-tema') === tema) {
                chip.classList.add('ativo'); // Certifique-se de ter esse estilo no CSS
            } else {
                chip.classList.remove('ativo');
            }
        });
    };

    // 3. Inicializa a página com o tema correto
    aplicarTema(temaSalvo);

    // 4. Adiciona o evento de clique em cada Chip
    chips.forEach(chip => {
        chip.style.cursor = "pointer"; // Garante que o mouse mude ao passar por cima

        chip.addEventListener("click", async () => {
            const novoTema = chip.getAttribute('data-tema');

            // Aplica visualmente na hora
            aplicarTema(novoTema);
            
            // Salva no localStorage
            localStorage.setItem("temaUsuario", novoTema);

            // Salva no banco de dados
            await salvarConfiguracoes({ tema: novoTema });
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