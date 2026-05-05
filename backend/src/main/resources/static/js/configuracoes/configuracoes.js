document.addEventListener("DOMContentLoaded", async () => {

    // 🔹 Carrega usuário logado
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

    // 🔹 Sessão atual
    const card = document.getElementById("cardSessaoAtual");
    card.innerHTML = `
        <div class="config-card">
            <strong>${usuario.nome}</strong><br>
            <small>${usuario.email}</small>
        </div>
    `;

    // 🔹 TEMA
    const temaAtual = usuario.configuracoes?.tema || "claro";
    aplicarTema(temaAtual);

    document.querySelectorAll(".tema-chip").forEach(chip => {
        chip.classList.toggle("ativo", chip.dataset.tema === temaAtual);

        chip.addEventListener("click", async () => {
            const novoTema = chip.dataset.tema;

            aplicarTema(novoTema);

            await salvarConfiguracoes({ tema: novoTema });

            document.querySelectorAll(".tema-chip")
                .forEach(c => c.classList.remove("ativo"));

            chip.classList.add("ativo");
        });
    });

    // 🔹 IDIOMA
    const selectIdioma = document.getElementById("selectIdioma");
    const idiomaAtual = usuario.configuracoes?.idioma || "pt-BR";

    selectIdioma.value = idiomaAtual;

    selectIdioma.addEventListener("change", async () => {
        await salvarConfiguracoes({ idioma: selectIdioma.value });
    });

    // 🔹 CONTAS (localStorage)
    const contas = JSON.parse(localStorage.getItem("contas") || "[]");

    if (!contas.includes(usuario.email)) {
        contas.push(usuario.email);
        localStorage.setItem("contas", JSON.stringify(contas));
    }

    const container = document.getElementById("containerContas");
    const semContas = document.getElementById("semContas");

    if (contas.length <= 1) {
        semContas.style.display = "block";
    } else {
        contas
            .filter(c => c !== usuario.email)
            .forEach(email => {
                const div = document.createElement("div");
                div.className = "config-card";
                div.textContent = email;

                div.addEventListener("click", () => {
                    window.location.href = "/modules/auth/login.html";
                });

                container.appendChild(div);
            });
    }
});

// 🔹 Helpers

function aplicarTema(tema) {
    document.documentElement.setAttribute("data-tema", tema);
}

async function salvarConfiguracoes(config) {
    try {
        await fetch("http://localhost:8080/usuarios/configuracoes", {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config)
        });
    } catch (e) {
        console.error("Erro ao salvar config");
    }
}