document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('containerPerfis');
  if (!container) return;

  container.innerHTML = '';

  const usuarioAtual = localStorage.getItem('usuarioLogado');

  for (let i = 0; i < localStorage.length; i++) {
    const chave = localStorage.key(i);
    if (!chave.startsWith('cadastroDados_')) continue;

    const dados = JSON.parse(localStorage.getItem(chave));

    const email = dados.emailDadosPessoais;
    const nome  = dados.nomeDadosPessoais || 'Usuário';
    const foto  = dados.fotoPerfil || 'https://via.placeholder.com/60';

    const ativo = email === usuarioAtual;

    const div = document.createElement('div');
    div.className = 'perfil-item';

    div.innerHTML = `
      <div class="perfil-avatar-wrapper">
        <img src="${foto}">
        ${ativo ? '<div class="online-dot"></div>' : ''}
      </div>

      <div class="perfil-info">
        <strong>${nome}</strong>
        <div class="perfil-status">
          ${ativo ? 'Conectado agora' : 'Offline'}
        </div>
        <small>${email}</small>
      </div>

      <button class="btn ${ativo ? 'btn-secondary' : 'btn-outline-primary'}">
        ${ativo ? 'Ativo' : 'Entrar'}
      </button>
    `;

    const btn = div.querySelector('button');

    // TROCAR CONTA
    if (!ativo) {
      btn.addEventListener('click', () => {
        localStorage.setItem('usuarioLogado', email);
        location.reload();
      });
    }

    // LOGOUT AO CLICAR NO PERFIL ATIVO
    if (ativo) {
      div.addEventListener('click', () => {
        localStorage.removeItem('usuarioLogado');
        window.location.href = '/login.html';
      });
    }

    container.appendChild(div);
  }
});