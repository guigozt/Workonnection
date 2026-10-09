# 📖 Guia Didático: Como Funciona o Workonnection por Dentro?

Bem-vindo ao guia definitivo do **Workonnection**! 

Se você já se perguntou coisas como:
> *"O que acontece exatamente quando clico em 'Entrar com o Google'?"*  
> *"Como uma mensagem sai da minha tela e aparece instantaneamente na tela de outra pessoa?"*  
> *"Quem chama quem? Onde cada arquivo entra nessa história?"*

Este documento foi feito sob medida para responder isso de forma clara, didática e passo a passo.

---

## 📑 Sumário
1. [A Visão Geral em Metáfora: O Restaurante](#1-a-visão-geral-em-metáfora-o-restaurante)
2. [O Mapa das Peças: Quem é quem no código?](#2-o-mapa-das-peças-quem-é-quem-no-código)
3. [Como Funciona o "Crachá" de Acesso (Autenticação)](#3-como-funciona-o-crachá-de-acesso-autenticação)
4. [Passo a Passo: O Fluxo do Login com Google](#4-passo-a-passo-o-fluxo-do-login-com-google)
5. [Passo a Passo: O Fluxo do Chat em Tempo Real](#5-passo-a-passo-o-fluxo-do-chat-em-tempo-real)
6. [Dicionário de Endpoints: Todas as Rotas da API](#6-dicionário-de-endpoints-todas-as-rotas-da-api)

---

## 1. A Visão Geral em Metáfora: O Restaurante

Para entender o Workonnection sem complicações técnicas, pense na aplicação como um **restaurante**:

```
+----------------------------------------------------------------------------+
| 1. O CLIENTE (Frontend - React)                                            |
|    - O que você vê no navegador: botões, inputs, cards e janelas de chat.  |
|    - Decide o que pedir e mostra o prato pronto quando chega.              |
+----------------------------------------------------------------------------+
                                     │
                 (Pedido HTTP via Axios / Internet)
                                     ▼
+----------------------------------------------------------------------------+
| 2. O GARÇOM / BALCÃO (Controller no Backend - Spring Boot)                 |
|    - Recebe o pedido na porta (ex: "Quero entrar com Google" ou            |
|      "Quero mandar esta mensagem").                                        |
|    - Confere se o cliente tem permissão e repassa para a cozinha.          |
+----------------------------------------------------------------------------+
                                     │
                             (Chama o Service)
                                     ▼
+----------------------------------------------------------------------------+
| 3. O CHEF DE COZINHA (Service no Backend - Spring Boot)                    |
|    - É onde fica a inteligência e as regras de negócio:                    |
|      "O e-mail é válido? Esse usuário já existe? Devo salvar ou criar?"    |
+----------------------------------------------------------------------------+
                    │                                    │
       (Salva ou consulta dados)               (Avisa em tempo real)
                    ▼                                    ▼
+-----------------------------------+  +-------------------------------------+
| 4. A DESPENSA (MongoDB Atlas)      |  | 5. O MENSAGEIRO (Pusher Channels)   |
|    - O banco de dados onde ficam  |  |    - Um rádio comunicador que toca  |
|      guardados os usuários,       |  |      um bip direto na tela do outro |
|      as vagas e as mensagens.     |  |      usuário sem ele precisar       |
|                                   |  |      dar F5 na página.              |
+-----------------------------------+  +-------------------------------------+
```

---

## 2. O Mapa das Peças: Quem é quem no código?

Quando você navega no código do projeto, existe uma cadeia de chamadas muito bem organizada:

### No Frontend (`/frontend/src`)
1. **Telas e Componentes (`/pages` e `/components`)**:
   - Exemplo: `LoginPage.tsx` ou `ChatPage.tsx`. Onde o usuário clica.
2. **Contextos (`/context/AuthContext.tsx`)**:
   - O "cérebro" da tela: guarda quem está logado para todas as telas saberem.
3. **Serviços de API (`/services/authService.ts`, `chatService.ts`)**:
   - Os arquivos responsáveis por disparar as requisições HTTP (`POST`, `GET`, etc.) usando a ferramenta central `api.ts` (Axios).
4. **Pusher (`/services/pusher.ts`)**:
   - Mantém uma conexão aberta com o servidor Pusher para escutar notificações ao vivo.

### No Backend (`/backend/src/main/java/com/workonnection/backend`)
A regra é sempre uma escadinha em 4 passos:
$$\text{Controller} \longrightarrow \text{Service} \longrightarrow \text{Repository} \longrightarrow \text{Banco (MongoDB)}$$

- **`Controller`**: A porta de entrada da rota. Recebe o JSON da requisição, extrai o usuário e chama o Service.
- **`DTO` (Data Transfer Object)**: O "envelope" de dados. Garante que só os dados necessários viajem pela rede (ex: não mandar a senha do usuário de volta para a tela).
- **`Service`**: Onde as regras acontecem (validar permissões, verificar token no Google, disparar eventos).
- **`Repository`**: Comandos que salvam, buscam ou alteram documentos no banco de dados MongoDB.
- **`Model`**: A representação da tabela/documento (`Usuario`, `Mensagem`, `Vaga`).

---

## 3. Como Funciona o "Crachá" de Acesso (Autenticação)

Imagine que entrar no sistema é como entrar em um prédio com catraca:
1. Quando você faz login (seja com e-mail/senha ou Google), o backend confere quem você é e cria um **ID de Usuário** único (ex: `c1f7a42b-...`).
2. O backend faz duas coisas:
   - Guarda esse ID na **Sessão** do servidor (cookie `JSESSIONID`).
   - Devolve esse ID para o frontend no corpo da resposta.
3. O frontend guarda esse ID no **`localStorage`** do navegador.
4. **Em todas as próximas requisições**:
   - O arquivo `frontend/src/services/api.ts` automaticamente pega esse ID guardado e coloca na etiqueta da requisição:
     ```http
     Authorization: Bearer <ID_DO_USUARIO>
     ```
   - O backend lê esse crachá através da função `getLoggerUserId()` e sabe exatamente quem está chamando a API, sem precisar pedir senha de novo!

---

## 4. Passo a Passo: O Fluxo do Login com Google

Aqui está a sequência exata de **quem chama quem**, desde o clique do botão até o usuário estar logado:

```
[1. Usuário]
     │ Clica no botão "Continuar com o Google"
     ▼
[2. Frontend - Google Identity Services SDK]
     │ Abre a janelinha oficial do Google para escolher a conta
     ▼
[3. Servidores do Google]
     │ O usuário escolhe a conta e autoriza
     │ O Google entrega ao Frontend um "Token de Identidade" (ID Token JWT criptografado)
     ▼
[4. Frontend - authService.loginComGoogleToken()]
     │ Pega esse token e faz: POST /auth/google enviando { "token": "..." }
     ▼
[5. Backend - GoogleAuthController.java]
     │ Recebe a requisição HTTP e repassa o token para o Service:
     │ googleOAuthService.verifyAndProcessToken(token)
     ▼
[6. Backend - GoogleOAuthService.java]
     │ Chama a API do Google: GET https://oauth2.googleapis.com/tokeninfo?id_token={token}
     │ O Google confirma: "Sim, esse token é autêntico! O e-mail dele é joao@email.com e o nome é João"
     │ O Service chama usuarioRepository.findFirstByEmail(email):
     │   - Se já existe: atualiza para googleLinked = true
     │   - Se não existe: cria novo Usuario no banco MongoDB
     ▼
[7. Backend - GoogleAuthController.java]
     │ Cria o crachá de sessão no Spring Security e salva session.setAttribute("usuarioId", ...)
     │ Devolve HTTP 200 com os dados do usuário (UsuarioResponseDTO)
     ▼
[8. Frontend - authService.ts & AuthContext.tsx]
     │ Recebe o usuário, grava o ID no localStorage e redireciona para a tela inicial /feed!
```

### O que trafega na rede (Exemplo Real):

#### Envio (Frontend $\rightarrow$ Backend):
- **URL**: `POST /auth/google`
- **Cabeçalho**: `Content-Type: application/json`
- **Corpo (Payload)**:
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRiOT... (Token longo gerado pelo Google)"
}
```

#### Resposta (Backend $\rightarrow$ Frontend):
- **Status**: `200 OK`
- **Corpo (Response)**:
```json
{
  "id": "6706912389abcdef12345678",
  "nome": "Carlos Silva",
  "email": "carlos.silva@exemplo.com",
  "tipoUsuario": "Estudante",
  "foto": "https://lh3.googleusercontent.com/a/...",
  "googleLinked": true,
  "emailVerified": true
}
```

---

## 5. Passo a Passo: O Fluxo do Chat em Tempo Real

O chat utiliza uma combinação inteligente de **duas tecnologias**:
1. **API REST (HTTP)**: Serve para gravar a mensagem permanentemente no banco para nunca se perder.
2. **Pusher (WebSockets)**: Serve para avisar o outro usuário em milissegundos sem ele ter que recarregar a tela.

### O Fluxo Sequencial: Quem chama quem?

```
CENÁRIO: A Ana quer mandar "Oi, tudo bem?" para o Bruno.

1. [Ana no Frontend]
   - Digita o texto e clica em "Enviar".
   - O arquivo chatService.enviarMensagem() é executado:
     Faz um POST para: /conversas/{idDoBruno}/mensagens com { "conteudo": "Oi, tudo bem?" }

2. [Backend - ChatController.java]
   - O método enviarMensagem() atende a chamada.
   - Pega o ID da Ana através do crachá (sessão / Authorization Bearer).
   - Passa os dados para o chatService.enviarMensagem(anaId, brunoId, dto).

3. [Backend - ChatService.java]
   - Passo 3.1: Valida se o texto não está em branco.
   - Passo 3.2: Cria o objeto Mensagem e salva no MongoDB através do MensagemRepository.
   - Passo 3.3: Chama pusherService.dispararEvento():
       -> Avisa o canal "chat-" + brunoId com o evento "nova-mensagem"
       -> Avisa o canal "chat-" + anaId com o evento "nova-mensagem"

4. [Backend -> Pusher Cloud]
   - O servidor do Pusher na nuvem recebe a ordem do backend e a retransmite via WebSocket.

5. [Bruno no Frontend]
   - O navegador do Bruno já estava conectado ouvindo o canal "chat-" + brunoId (via pusher.ts).
   - O evento "nova-mensagem" chega instantaneamente:
     -> A tela do Bruno adiciona a mensagem na lista sem precisar de recarregar (F5).
     -> Um som de notificação pode tocar e o contador de mensagens não lidas sobe.

6. [Bruno lê a mensagem]
   - Quando o Bruno clica na conversa:
     O frontend chama PUT /conversas/{idDaAna}/ler.
   - O backend atualiza o banco colocando lida = true.
```

### O que trafega na rede (Exemplo Real):

#### Envio (Ana $\rightarrow$ Backend):
- **URL**: `POST /conversas/65e100f918.../mensagens`
- **Cabeçalho**: `Authorization: Bearer <idDaAna>`
- **Corpo (Payload)**:
```json
{
  "conteudo": "Oi Bruno, vi seu perfil e gostaria de conversar sobre a vaga!"
}
```

#### Resposta Imediata da API (Backend $\rightarrow$ Ana):
- **Status**: `201 Created`
```json
{
  "id": "msg_998877",
  "remetenteId": "id_ana",
  "destinatarioId": "id_bruno",
  "conteudo": "Oi Bruno, vi seu perfil e gostaria de conversar sobre a vaga!",
  "dataEnvio": "2026-10-09T15:20:00Z",
  "lida": false,
  "editada": false
}
```

#### Notificação em Tempo Real (Pusher $\rightarrow$ Bruno):
- **Canal**: `chat-id_bruno`
- **Evento**: `nova-mensagem`
- **Dados transmitidos**: O mesmo JSON retornado acima, entregue instantaneamente na tela do Bruno.

---

## 6. Dicionário de Endpoints: Todas as Rotas da API

Aqui está o resumo prático de todas as rotas que o backend disponibiliza para o frontend.

### 🔐 Autenticação com o Google
- `GET /auth/google/client-id`
  - **O que faz?** Retorna o ID público do Google para o front poder carregar o botão oficial.
- `POST /auth/google`
  - **O que faz?** Recebe o token do Google, valida na nuvem, cadastra/recupera o usuário e inicia a sessão.

---

### 👤 Usuários e Contas (`/usuarios`)
- `POST /usuarios` $\rightarrow$ Cadastro tradicional com nome, e-mail e senha.
- `POST /usuarios/login` $\rightarrow$ Login tradicional com e-mail e senha.
- `POST /usuarios/logout` $\rightarrow$ Encerra a sessão e apaga os cookies.
- `GET /usuarios/me` $\rightarrow$ Retorna os dados do usuário atualmente conectado.
- `GET /usuarios/{id}` $\rightarrow$ Retorna o perfil público de um usuário específico.
- `GET /usuarios` $\rightarrow$ Lista todos os colaboradores cadastrados para encontrar conexões.
- `PUT /usuarios/perfil` $\rightarrow$ Atualiza foto, bio, competências e redes sociais.
- `PUT /usuarios/configuracoes` $\rightarrow$ Salva preferências de tema (claro/escuro) e idioma.
- `POST /usuarios/completar-cadastro` $\rightarrow$ Preenche dados adicionais após o primeiro login.
- `DELETE /usuarios/conta` $\rightarrow$ Exclui permanentemente a conta do usuário conectado.

---

### 💼 Vagas de Emprego / Estágio (`/vagas`)
- `GET /vagas` $\rightarrow$ Lista todas as oportunidades. Suporta filtros: `?busca=Java&tipo=Estágio&modalidade=Remoto`.
- `POST /vagas` $\rightarrow$ Cria uma nova oportunidade (título, descrição, salário, requisitos).
- `GET /vagas/{id}` $\rightarrow$ Mostra todos os detalhes de uma vaga e se você já se candidatou nela.
- `PUT /vagas/{id}` $\rightarrow$ Edita uma vaga criada por você.
- `DELETE /vagas/{id}` $\rightarrow$ Apaga a vaga.
- `GET /vagas/minhas` $\rightarrow$ Lista apenas as vagas que você mesmo publicou.
- `POST /vagas/{id}/candidatar` $\rightarrow$ Registra a candidatura do usuário àquela vaga.
- `DELETE /vagas/{id}/candidatar` $\rightarrow$ Cancela a candidatura previamente feita.
- `POST /vagas/{id}/comentarios` $\rightarrow$ Deixa uma pergunta ou comentário público na vaga.

---

### 💬 Bate-Papo Interno (`/conversas`)
- `GET /conversas` $\rightarrow$ Lista sua caixa de entrada (último contato de cada conversa, última mensagem e quantidade não lidas).
- `GET /conversas/{contatoId}/mensagens` $\rightarrow$ Carrega o histórico completo de mensagens trocadas com aquele contato.
- `POST /conversas/{contatoId}/mensagens` $\rightarrow$ Envia uma nova mensagem e avisa o Pusher.
- `PUT /conversas/{contatoId}/ler` $\rightarrow$ Marca como lidas todas as mensagens daquele contato.
- `PUT /conversas/mensagens/{mensagemId}` $\rightarrow$ Corrige/edita o texto de uma mensagem enviada.
- `DELETE /conversas/mensagens/{mensagemId}` $\rightarrow$ Oculta a mensagem para quem apagou.
- `DELETE /conversas/{contatoId}` $\rightarrow$ Oculta toda a conversa com aquela pessoa da sua lista.
- `GET /conversas/nao-lidas/total` $\rightarrow$ Retorna o número total de mensagens que você ainda não leu (usado no sininho/badge da navbar).

---

### 🔔 Notificações (`/notificacoes`)
- `GET /notificacoes` $\rightarrow$ Lista avisos do sistema (ex: alguém se candidatou à sua vaga).
- `PUT /notificacoes/{id}/ler` $\rightarrow$ Marca uma notificação como lida.
- `PUT /notificacoes/ler-todas` $\rightarrow$ Limpa todas as notificações pendentes.
- `DELETE /notificacoes/{id}` $\rightarrow$ Exclui uma notificação.

---

### 🩺 Teste de Saúde (`/hello`)
- `GET /hello` $\rightarrow$ Responde `"Hello, Workonnection Backend is running!"` para testar se a API está online.
