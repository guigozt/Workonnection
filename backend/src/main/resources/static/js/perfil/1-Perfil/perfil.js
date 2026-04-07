import { save, load, getUserKey, getCurrentUser } from './helpers.js';

// ===== ELEMENTOS =====
const fotoEl = document.getElementById('perfil-foto');
const nomeEl = document.getElementById('perfil-nome');
const emailEl = document.getElementById('perfil-email')
const btnAbrirModal = document.getElementById('btnAbrirModal');

const modalPerfil = new bootstrap.Modal(document.getElementById('editarPerfilModal'));

const inputNome = document.getElementById('inputNome');
const inputEmail = document.getElementById('inputEmail');
const inputLocal = document.getElementById('inputLocal');
const inputTelefone = document.getElementById('inputTelefone');
const inputInstagram = document.getElementById('inputInstagram');
const inputLinkedin = document.getElementById('inputLinkedin');
const inputSite = document.getElementById('inputSite');
const inputFoto = document.getElementById('inputFoto');
const btnSalvarPerfil = document.getElementById('btnSalvarPerfil');

let fotoBase64 = "";

// ===== VALIDAÇÃO =====
function mostrarErro(input, mensagem) {
  let small = input.parentElement.querySelector(".error-message");

  if (!small) {
    small = document.createElement("small");
    small.className = "error-message";
    input.parentElement.appendChild(small);
  }

  small.textContent = mensagem;
  input.classList.add("error");
  input.classList.remove("success");
}

function mostrarSucesso(input) {
  let small = input.parentElement.querySelector(".error-message");
  if (small) small.textContent = "";

  input.classList.remove("error");
  input.classList.add("success");
}

// ===== REGRAS =====
function validarTelefone(input) {
  const numeros = input.value.replace(/\D/g, "");
  if (numeros.length < 10) {
    mostrarErro(input, "Telefone inválido");
    return false;
  }
  mostrarSucesso(input);
  return true;
}

// ===== VALIDAÇÃO EM TEMPO REAL =====
inputTelefone.addEventListener("input", () => validarTelefone(inputTelefone));

// ===== FOTO =====
inputFoto.addEventListener("change", () => {
  const file = inputFoto.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Selecione uma imagem válida");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    fotoBase64 = reader.result;
    fotoEl.src = fotoBase64;
  };
  reader.readAsDataURL(file);
});

// ===== CARREGAR PERFIL =====
export function carregarPerfil() {
  const usuarioLogado = getCurrentUser();
  if (!usuarioLogado) return;

  let perfil = load(getUserKey('perfil'), null);

  const usuarios = load("usuarios", []);
  const cadastro = usuarios.find(
    u => u.emailDadosPessoais === usuarioLogado.email
  ) || {};

  if (!perfil && cadastro) {
    perfil = {
      nome: cadastro.nomeDadosPessoais,
      email: cadastro.emailDadosPessoais,
      telefone: cadastro.telefoneDadosPessoais || '',
      local: '',
      instagram: '',
      linkedin: '',
      site: '',
      foto: ''
    };

    save(getUserKey('perfil'), perfil);
  }

  if (!perfil) return;

  // ===== TEXTO INTELIGENTE =====
  function textoOuPadrao(valor, texto) {
    return valor && valor.trim() !== "" ? valor : texto;
  }

  // ===== ATUALIZA TELA =====
  nomeEl.textContent = perfil.nome;
  fotoEl.src = perfil.foto || "https://via.placeholder.com/150";
  emailEl.textContent = perfil.email
    ? `Email: ${perfil.email}`
    : "Email não disponível";

  document.getElementById('perfil-local').innerHTML =
    `<i class="fas fa-map-marker-alt text-primary"></i> ${textoOuPadrao(perfil.local, "Adicione sua localização")}`;

  document.getElementById('perfil-telefone').innerHTML =
    `<i class="fas fa-phone text-success"></i> ${textoOuPadrao(perfil.telefone, "Adicione seu telefone")}`;

  document.getElementById('perfil-instagram').innerHTML =
    `<i class="fab fa-instagram text-danger"></i> ${textoOuPadrao(perfil.instagram, "Adicione seu Instagram")}`;

  document.getElementById('perfil-linkedin').innerHTML =
    `<i class="fab fa-linkedin text-primary"></i> ${textoOuPadrao(perfil.linkedin, "Adicione seu LinkedIn")}`;

  document.getElementById('perfil-site').innerHTML =
    `<i class="fas fa-globe text-info"></i> ${textoOuPadrao(perfil.site, "Adicione seu site")}`;
}

// ===== ABRIR MODAL =====
btnAbrirModal.addEventListener('click', () => {
  const usuarioLogado = getCurrentUser();
  const perfil = load(getUserKey('perfil'), {});

  const usuarios = load("usuarios", []);
  const cadastro = usuarios.find(
    u => u.emailDadosPessoais === usuarioLogado.email
  ) || {};

  // 🔒 NÃO EDITÁVEIS
  inputNome.value = cadastro.nomeDadosPessoais || '';
  inputEmail.value = cadastro.emailDadosPessoais || '';

  inputNome.disabled = true;
  inputEmail.disabled = true;

  // 🔓 EDITÁVEIS
  inputTelefone.value = cadastro.telefoneDadosPessoais || perfil.telefone || '';
  inputLocal.value = perfil.local || '';
  inputInstagram.value = perfil.instagram || '';
  inputLinkedin.value = perfil.linkedin || '';
  inputSite.value = perfil.site || '';

  modalPerfil.show();
});

// ===== SALVAR =====
btnSalvarPerfil.addEventListener('click', () => {
  if (!validarTelefone(inputTelefone)) {
    alert("Corrija o telefone!");
    return;
  }

  const usuarioLogado = getCurrentUser();
  const usuarios = load("usuarios", []);
  const cadastro = usuarios.find(
    u => u.emailDadosPessoais === usuarioLogado.email
  ) || {};

  const perfil = {
    nome: cadastro.nomeDadosPessoais, // 🔒 fixo
    email: cadastro.emailDadosPessoais, // 🔒 fixo
    telefone: inputTelefone.value.trim(),
    local: inputLocal.value.trim(),
    instagram: inputInstagram.value.trim(),
    linkedin: inputLinkedin.value.trim(),
    site: inputSite.value.trim(),
    foto: fotoBase64 || fotoEl.src
  };

  save(getUserKey('perfil'), perfil);
  carregarPerfil();
  modalPerfil.hide();
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', carregarPerfil);