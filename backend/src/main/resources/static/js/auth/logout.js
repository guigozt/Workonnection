document.addEventListener("DOMContentLoaded", () => {
    const btnSair = document.getElementById("btnSair");

    if (btnSair) {
        btnSair.addEventListener("click", async () => {
            try {
                const res = await fetch("http://localhost:8080/usuarios/logout", {
                    method: "POST",
                    credentials: "include"
                });

                if (!res.ok) throw new Error("Erro ao deslogar");

                window.location.href = "/modules/auth/Login.html";

            } catch (err) {
                console.error(err);
                alert("Erro ao deslogar. Tente novamente.");
            }
        });
    }
});