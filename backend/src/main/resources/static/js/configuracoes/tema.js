document.addEventListener("DOMContentLoaded", () => {
  const temaSalvo = localStorage.getItem("tema") || "claro";

  document.body.setAttribute("data-tema", temaSalvo);

  document.querySelectorAll("input[name='tema']").forEach(radio => {
    if (radio.value === temaSalvo) radio.checked = true;

    radio.addEventListener("change", () => {
      localStorage.setItem("tema", radio.value);
      document.body.setAttribute("data-tema", radio.value);
    });
  });
});