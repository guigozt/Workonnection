import { save, load, getUserKey, getCurrentUser } from './helpers.js';

// ===== ELEMENTOS =====
const fotoEl = document.getElementById('perfil-foto');
const nomeEl = document.getElementById('perfil-nome');
const formacaoSmall = document.getElementById('perfil-formacao');
const btnAbrirModal = document.getElementById('btnAbrirModal');

const modalPerfil = new bootstrap.Modal(document.getElementById('editarPerfilModal'));

const inputNome = document.getElementById('inputNome');
const inputEmail = document.getElementById('inputEmail');
const inputLocal = document.getElementById('inputLocal');
const inputTelefone = document.getElementById('inputTelefone');
const inputInstagram = document.getElementById('inputInstagram');
const inputLinkedin = document.getElementById('inputLinkedin');
const inputSite = document.getElementById('inputSite');
const inputFoto = document.getElementById('inputFoto'); // FILE INPUT
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
function validarNome(input) {
  if (input.value.trim().length < 3) {
    mostrarErro(input, "Nome deve ter no mínimo 3 caracteres");
    return false;
  }
  mostrarSucesso(input);
  return true;
}

function validarEmail(input) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(input.value.trim())) {
    mostrarErro(input, "Email inválido");
    return false;
  }

  mostrarSucesso(input);
  return true;
}

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
inputNome.addEventListener("input", () => validarNome(inputNome));
inputEmail.addEventListener("input", () => validarEmail(inputEmail));
inputTelefone.addEventListener("input", () => validarTelefone(inputTelefone));

// ===== FOTO (UPLOAD) =====
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

  // 🔥 BUSCAR USUÁRIO DO ARRAY
  const usuarios = load("usuarios", []);
  const cadastro = usuarios.find(
    u => u.emailDadosPessoais === usuarioLogado.email
  ) || {};

  // 🔹 Se não tiver perfil ainda, cria baseado no cadastro
  if (!perfil && cadastro) {
    perfil = {
      nome: cadastro.nomeDadosPessoais || "Seu Nome",
      email: cadastro.emailDadosPessoais || "",
      telefone: cadastro.telefoneDadosPessoais || "",
      local: '',
      instagram: '',
      linkedin: '',
      site: '',
      foto: ''
    };

    save(getUserKey('perfil'), perfil);
  }

  // 🔹 fallback seguro
  if (!perfil) {
    perfil = {
      nome: "Seu Nome",
      email: usuarioLogado.email,
      telefone: '',
      local: '',
      instagram: '',
      linkedin: '',
      site: '',
      foto: ''
    };
    save(getUserKey('perfil'), perfil);
  }

  // ===== ATUALIZA TELA =====
  nomeEl.textContent = perfil.nome;
  fotoEl.src = perfil.foto || "https://via.placeholder.com/150";

  document.getElementById('perfil-local').innerHTML =
    `<i class="fas fa-map-marker-alt text-primary"></i> ${perfil.local || 'Local:'}`;

  document.getElementById('perfil-telefone').innerHTML =
    `<i class="fas fa-phone text-success"></i> ${perfil.telefone || 'Telefone:'}`;

  document.getElementById('perfil-instagram').innerHTML =
    `<i class="fab fa-instagram text-danger"></i> ${perfil.instagram || 'Instagram:'}`;

  document.getElementById('perfil-linkedin').innerHTML =
    `<i class="fab fa-linkedin text-primary"></i> ${perfil.linkedin || 'LinkedIn:'}`;

  document.getElementById('perfil-site').innerHTML =
    `<i class="fas fa-globe text-info"></i> ${perfil.site || 'Site:'}`;
}

// ===== ABRIR MODAL =====
btnAbrirModal.addEventListener('click', () => {
  const usuarioLogado = getCurrentUser();
  const perfil = load(getUserKey('perfil'), {});

  // 🔥 BUSCAR DO ARRAY
  const usuarios = load("usuarios", []);
  const cadastro = usuarios.find(
    u => u.emailDadosPessoais === usuarioLogado.email
  ) || {};

  // 🔹 PRIORIDADE: cadastro > perfil
  inputNome.value = cadastro.nomeDadosPessoais || perfil.nome || '';
  inputEmail.value = cadastro.emailDadosPessoais || perfil.email || '';
  inputTelefone.value = cadastro.telefoneDadosPessoais || perfil.telefone || '';

  inputLocal.value = perfil.local || '';
  inputInstagram.value = perfil.instagram || '';
  inputLinkedin.value = perfil.linkedin || '';
  inputSite.value = perfil.site || '';

  modalPerfil.show();
});

// ===== SALVAR =====
btnSalvarPerfil.addEventListener('click', () => {
  const valido =
    validarNome(inputNome) &&
    validarEmail(inputEmail) &&
    validarTelefone(inputTelefone);

  if (!valido) {
    alert("Corrija os campos!");
    return;
  }

  const perfil = {
    nome: inputNome.value.trim(),
    email: inputEmail.value.trim(),
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