document.addEventListener("DOMContentLoaded", () => {
  const select = document.getElementById("idiomaSelect");

  const idiomaSalvo = localStorage.getItem("idioma") || "pt";
  select.value = idiomaSalvo;

  select.addEventListener("change", () => {
    localStorage.setItem("idioma", select.value);
    alert("Idioma salvo! (tradução futura)");
  });
});