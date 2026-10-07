# Workonnection

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Pusher](https://img.shields.io/badge/Pusher-Channels-300D4F?style=for-the-badge&logo=pusher&logoColor=white)

**Plataforma digital para conectar empresas e profissionais autônomos/MEIs de forma ágil, segura e acessível.**

</div>

---

## 📌 Sobre o Projeto

O **Workonnection** foi idealizado para reduzir a burocracia e o tempo gasto em processos de contratações temporárias e prestação de serviços. A plataforma democratiza oportunidades para trabalhadores autônomos, prestadores de serviços, microempreendedores (MEIs) e estudantes, simplificando o recrutamento para empresas.

O projeto está diretamente alinhado às metas dos Objetivos de Desenvolvimento Sustentável da ONU:
* **ODS 8:** Trabalho Decente e Crescimento Econômico
* **ODS 17:** Parcerias e Meios de Implementação

---

## 🎯 Objetivos da Plataforma

* **Agilidade na Contratação:** Interface intuitiva e dinâmica com fluxo ágil de divulgação e busca de oportunidades.
* **Oportunidades Segmentadas:** Vagas personalizadas para estudantes, autônomos e MEIs.
* **Comunicação em Tempo Real:** Chat direto entre usuários e empresas sem intermediários.
* **Autenticação Flexível:** Acesso tradicional via email/senha e autenticação social via Google OAuth2.
* **Privacidade e LGPD:** Blindagem completa de dados sensíveis na camada de API (exibição estrita de dados autorizados no perfil público).
* **Engajamento e Confiabilidade:** Feedback interativo, curtidas, comentários e histórico profissional.

---

## 🧱 Arquitetura do Sistema

O projeto adota uma arquitetura **desacoplada**, separando o cliente SPA da API RESTful no padrão **MVC com Camada de Serviço (MVC + Service)** e eventos em tempo real:

```text
┌────────────────────────────────────────────────────────┐
│                   Frontend (SPA)                       │
│       React 19 + TypeScript + Vite + Pusher JS         │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON (CORS + Cookie) & WebSocket
                            ▼
┌────────────────────────────────────────────────────────┐
│               Backend (Spring Boot API)                │
│                                                        │
│  [ Controllers ] ──► [ Services ] ──► [ Repositories ] │
│         │                  │                 │         │
│     (Rotas/DTOs)     (Regras Negócio)  (Spring Data)   │
│                            │                           │
│                            ▼                           │
│                   [ Pusher Java Server ]               │
└────────────────────────────┬───────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────┐
│                Database (MongoDB Atlas)                │
│        Coleções: usuarios, vagas, mensagens, etc.      │
└────────────────────────────────────────────────────────┘
```

### Divisão das Camadas

1. **Controller (Camada de Apresentação da API):**
   * Responsável por expor endpoints RESTful, receber e validar requisições HTTP e retornar respostas padronizadas utilizando DTOs.
   * *Exemplos:* `UsuarioController`, `VagaController`, `ChatController`, `NotificacaoController`.

2. **Service (Camada de Regras de Negócio):**
   * Centraliza a lógica de negócio, validações, regras de autenticação, integração OAuth2 Google, disparo de mensagens WebSocket (Pusher), envio de e-mails, validação e upload de documentos por tipo de usuário (`ESTUDANTE`, `MEI`, `ME`, `EMPRESA`), criptografia de senhas com BCrypt e conversão segura para DTOs.
   * *Exemplos:* `UsuarioService`, `VagaService`, `ChatService`, `FileStorageService`.

3. **Model & Repository (Camada de Dados):**
   * Documentos de entidade mapeados para o MongoDB e interfaces de persistência do Spring Data.
   * *Exemplos:* `Usuario`, `Vaga`, `Mensagem`, `UsuarioRepository`, `VagaRepository`, `MensagemRepository`.

4. **DTOs (Data Transfer Objects & LGPD):**
   * Camada essencial para transferência de dados segura entre cliente e servidor, impedindo o vazamento de dados sensíveis como CPF, senha, e-mail e telefone na visualização pública.
   * *Exemplos:* `UsuarioPublicoDTO`, `PerfilPublicoDTO`, `UsuarioResponseDTO`, `VagaResponseDTO`.

5. **View (Frontend Desacoplado):**
   * SPA construída com React 19, TypeScript e Vite, utilizando CSS Modules para escopo de estilos, contexto de autenticação centralizado e canais Pusher para atualização de chat em tempo real.

---

## 🚀 Funcionalidades Principais

- [x] **Autenticação Dupla:**
  - Login e Cadastro tradicional por E-mail e Senha (criptografia BCrypt e sessão HTTP).
  - Login Social integrado com **Google OAuth2 / Google Identity Services**.
- [x] **Chat Interno em Tempo Real:**
  - Troca de mensagens instantânea entre usuários via **Pusher Channels**.
  - Histórico de conversas persistido no MongoDB.
  - Indicador de status, mensagens não lidas e interface conversacional fluida.
- [x] **Upload e Validação de Documentos:**
  - Upload segmentado por tipo de perfil: comprovante de matrícula para estudantes, CCMEI para MEIs e Contrato Social para ME/Empresas.
- [x] **Feed de Oportunidades:** Listagem e publicação de vagas com suporte a edição e exclusão pelo autor.
- [x] **Interação Social:** Curtidas, descurtidas e comentários em tempo real nas publicações de vagas.
- [x] **Rede de Colaboradores:** Busca e listagem de profissionais da plataforma.
- [x] **Modal de Perfil Público (LGPD):** Visualização segura de dados profissionais (habilidades, experiências, formação, cursos e redes sociais) sem exposição de dados de contato confidenciais.
- [x] **Gestão de Perfil Pessoal:** Edição completa de biografia, experiências profissionais, formações acadêmicas e portfólio.
- [x] **Central de Notificações:** Notificações de interações e avisos no sistema.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Framework:** [React 19](https://react.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Roteamento:** [React Router 7](https://reactrouter.com/)
- **Tempo Real:** [Pusher JS](https://pusher.com/docs/channels)
- **Autenticação:** [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google)
- **Estilização:** CSS Modules e [Lucide React](https://lucide.dev/) (Ícones)
- **HTTP Client:** [Axios](https://axios-http.com/)

### Backend
- **Framework:** [Spring Boot 3](https://spring.io/projects/spring-boot)
- **Linguagem:** [Java 17](https://www.oracle.com/java/)
- **Segurança:** Spring Security (sessão HTTP com suporte a CORS cross-site) e Spring Security OAuth2 Client
- **Tempo Real:** Pusher Java Server SDK
- **Persistência:** Spring Data MongoDB
- **E-mail:** Spring Boot Starter Mail (JavaMail)
- **Gerenciador de Dependências:** Maven

### Banco de Dados
- **Banco:** [MongoDB Atlas](https://www.mongodb.com/atlas) (NoSQL em nuvem)

---

## 📁 Estrutura de Pastas

```text
Workonnection/
├── backend/
│   ├── src/main/java/com/workonnection/backend/
│   │   ├── config/          # Configurações (Security, CORS, Mongo, Pusher)
│   │   ├── controller/      # Controladores REST (MVC)
│   │   ├── dto/             # Data Transfer Objects (LGPD e requisições)
│   │   ├── exception/       # Manipulação global de exceções
│   │   ├── model/           # Modelos de domínio do MongoDB (Usuario, Vaga, Mensagem)
│   │   ├── repository/      # Interfaces de persistência Spring Data
│   │   └── service/         # Regras de negócio, OAuth, Chat e Upload de arquivos
│   ├── src/main/resources/  # application.properties e recursos estáticos
│   └── pom.xml              # Dependências Maven
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis (Chat, Modais, Cards, Topbar)
│   │   ├── context/         # Contextos React (AuthContext)
│   │   ├── pages/           # Páginas (Home, Auth, Colaboradores, Perfil, Chat)
│   │   ├── routes/          # Definição de rotas públicas e privadas
│   │   ├── services/        # Integração com a API via Axios e Pusher
│   │   └── types/           # Interfaces TypeScript e DTOs
│   ├── package.json
│   └── vite.config.ts
│
├── dev.js                   # 🤖 Bot runner multiplataforma (Windows, Linux, macOS)
└── README.md
```

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos

* **Java 17+** instalado e configurado no `PATH`
* **Node.js (v18+)** e **NPM**
* **Git**
* Um cluster ativo no **MongoDB Atlas**

---

### 1. Clonar o Repositório

```bash
git clone https://github.com/guigozt/Workonnection.git
cd Workonnection
```

---

### 2. Configurar as Variáveis de Ambiente

Por questões de segurança e proteção contra vazamento de segredos, os arquivos com credenciais reais não são commitados no repositório. Você precisará criá-los localmente:

#### A. Frontend (`frontend/.env`)
Crie o arquivo `frontend/.env` (ou copie de `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=SEU_GOOGLE_CLIENT_ID.apps.googleusercontent.com
VITE_PUSHER_KEY=SUA_PUSHER_KEY
VITE_PUSHER_CLUSTER=sa1
```

#### B. Backend (`backend/src/main/resources/application-local.properties`)
Crie o arquivo `backend/src/main/resources/application-local.properties` com suas credenciais:

```properties
# BANCO DE DADOS
spring.data.mongodb.uri=mongodb+srv://<USUARIO>:<SENHA>@<CLUSTER>.mongodb.net/workonnection?retryWrites=true&w=majority&appName=Workonnection

# SESSÃO
server.servlet.session.cookie.same-site=lax
server.servlet.session.cookie.secure=false

# GOOGLE OAUTH2
spring.security.oauth2.client.registration.google.client-id=SEU_GOOGLE_CLIENT_ID.apps.googleusercontent.com
spring.security.oauth2.client.registration.google.client-secret=SEU_GOOGLE_CLIENT_SECRET
spring.security.oauth2.client.registration.google.scope=email,profile
spring.security.oauth2.client.registration.google.redirect-uri={baseUrl}/login/oauth2/code/google
spring.security.oauth2.client.registration.google.client-name=Google

# EMAIL (Gmail SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=seu_email@gmail.com
spring.mail.password=sua_senha_de_app_gmail
spring.mail.protocol=smtp
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# FRONTEND URL
app.frontend.url=http://localhost:5173

# PUSHER (CHAT EM TEMPO REAL)
pusher.app-id=SEU_PUSHER_APP_ID
pusher.key=SUA_PUSHER_KEY
pusher.secret=SEU_PUSHER_SECRET
pusher.cluster=sa1
```

---

### 3. Rodar a Aplicação

#### 🤖 Método Recomendado (Multiplataforma com `dev.js`)

Criamos um utilitário de orquestração na raiz do projeto compatível com **Windows**, **Linux** e **macOS**. Ele:
- Instala automaticamente as dependências do frontend (`npm install`), se necessário.
- Encerra processos presos nas portas `8080` e `5173` para evitar erros de conflito.
- Inicia o **Backend** (`profile local`) e o **Frontend** (`Vite`) em paralelo no mesmo terminal.
- Garante o encerramento limpo (*graceful shutdown*) de ambos os processos ao pressionar `Ctrl + C`.

Basta executar na raiz do repositório:

```bash
node dev.js
```

---

#### 🛠️ Método Manual (Terminais Separados)

Se preferir rodar cada serviço individualmente:

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
   ```
   *(No Windows: `mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local`)*
   * A API iniciará em: `http://localhost:8080`

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   * A aplicação web estará acessível em: `http://localhost:5173`

---

### Scripts Úteis (Frontend)

* `npm run dev`: Inicia o servidor Vite de desenvolvimento.
* `npm run lint`: Executa a verificação estática de código com o ESLint.
* `npm run build`: Valida tipagens TypeScript e compila o bundle para produção.

---

## 👥 Integrantes da Equipe

* 👤 **Hugo Aparecido**
* 👤 **Paulo Roberto**
* 👤 **Caroline Mendes**
* 👤 **Priscila Mendes**
* 👤 **Gabriel Gutierres**
* 👤 **Guilherme Gomes**
