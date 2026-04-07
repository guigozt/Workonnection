// 5-Javascrip/4-LocalStorage/logout.js
document.addEventListener("DOMContentLoaded", () => {
    const btnSair = document.getElementById("btnSair");

    if (btnSair) {
        btnSair.addEventListener("click", () => {
            fetch("http://localhost:8080/usuarios/logout", {
                method: "POST",
                credentials: "include"
            })
            .then(res => {
                if (!res.ok) throw new Error("Erro ao deslogar");
                alert("Você saiu da conta!");
                window.location.href = "/index.html";
            })
            .catch(err => {
                console.error(err);
                alert("Erro ao deslogar");
            });
        });
    }
});