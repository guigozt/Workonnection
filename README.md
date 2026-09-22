# Workonnection

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

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
* **Privacidade e LGPD:** Blindagem completa de dados sensíveis na camada de API (exibição estrita de dados autorizados no perfil público).
* **Engajamento e Confiabilidade:** Feedback interativo, curtidas, comentários e histórico profissional.

---

## 🧱 Arquitetura do Sistema

O projeto adota uma arquitetura **desacoplada**, separando o cliente SPA da API RESTful no padrão **MVC com Camada de Serviço (MVC + Service)**:

```
┌────────────────────────────────────────────────────────┐
│                   Frontend (SPA)                       │
│           React 19 + TypeScript + Vite                 │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON (CORS + Cookie de Sessão)
                            ▼
┌────────────────────────────────────────────────────────┐
│               Backend (Spring Boot API)                │
│                                                        │
│  [ Controllers ] ──► [ Services ] ──► [ Repositories ] │
│         │                  │                 │         │
│     (Rotas/DTOs)     (Regras Negócio)  (Spring Data)   │
└────────────────────────────┬───────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────┐
│                Database (MongoDB Atlas)                │
│             Coleções: usuarios, vagas                  │
└────────────────────────────────────────────────────────┘
```

### Divisão das Camadas

1. **Controller (Camada de Apresentação da API):**
   * Responsável por expor endpoints RESTful, receber e validar requisições HTTP e retornar respostas padronizadas utilizando DTOs.
   * *Exemplos:* `UsuarioController`, `VagaController`, `NotificacaoController`.

2. **Service (Camada de Regras de Negócio):**
   * Centraliza a lógica de negócio, validações, regras de autenticação, criptografia de senhas com BCrypt e conversão segura para DTOs.
   * *Exemplos:* `UsuarioService`, `VagaService`, `NotificacaoService`.

3. **Model & Repository (Camada de Dados):**
   * Documentos de entidade mapeados para o MongoDB e interfaces de persistência do Spring Data.
   * *Exemplos:* `Usuario`, `Vaga`, `UsuarioRepository`, `VagaRepository`.

4. **DTOs (Data Transfer Objects & LGPD):**
   * Camada essencial para transferência de dados segura entre cliente e servidor, impedindo o vazamento de dados sensíveis como CPF, senha, e-mail e telefone na visualização pública.
   * *Exemplos:* `UsuarioPublicoDTO`, `PerfilPublicoDTO`, `UsuarioResponseDTO`, `VagaResponseDTO`.

5. **View (Frontend Desacoplado):**
   * SPA construída com React 19, TypeScript e Vite, utilizando CSS Modules para escopo de estilos e React Router para controle de navegação e rotas protegidas.

---

## 🚀 Funcionalidades Principais

- [x] **Autenticação Segura:** Cadastro e login com sessão HTTP (`JSESSIONID`) e senhas com hash BCrypt.
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
- **Estilização:** CSS Modules e [Lucide React](https://lucide.dev/) (Ícones)
- **HTTP Client:** [Axios](https://axios-http.com/)

### Backend
- **Framework:** [Spring Boot 3](https://spring.io/projects/spring-boot)
- **Linguagem:** [Java 17](https://www.oracle.com/java/)
- **Segurança:** Spring Security (sessão HTTP com suporte a CORS cross-site)
- **Persistência:** Spring Data MongoDB
- **Gerenciador de Dependências:** Maven

### Banco de Dados
- **Banco:** [MongoDB Atlas](https://www.mongodb.com/atlas) (NoSQL em nuvem)

---

## 📁 Estrutura de Pastas

```text
Workonnection/
├── backend/
│   ├── src/main/java/com/workonnection/backend/
│   │   ├── config/          # Configurações (Security, CORS, Mongo)
│   │   ├── controller/      # Controladores REST (MVC)
│   │   ├── dto/             # Data Transfer Objects (LGPD e requisições)
│   │   ├── exception/       # Manipulação global de exceções
│   │   ├── model/           # Modelos de domínio do MongoDB
│   │   ├── repository/      # Interfaces de persistência Spring Data
│   │   └── service/         # Regras de negócio e serviços
│   ├── src/main/resources/  # application.properties e recursos estáticos
│   └── pom.xml              # Dependências Maven
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis (Modais, Cards, Topbar)
│   │   ├── context/         # Contextos React (AuthContext)
│   │   ├── pages/           # Páginas (Home, Auth, Colaboradores, Perfil, etc.)
│   │   ├── routes/          # Definição de rotas públicas e privadas
│   │   ├── services/        # Integração com a API via Axios
│   │   └── types/           # Interfaces TypeScript e DTOs
│   ├── package.json
│   └── vite.config.ts
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

### Passo 1: Clonar o Repositório

```bash
git clone https://github.com/guigozt/Workonnection.git
cd Workonnection
```

---

### Passo 2: Configurar o Banco de Dados (Backend)

Crie o arquivo `application-local.properties` dentro do caminho:
`backend/src/main/resources/application-local.properties`

Adicione a string de conexão do seu cluster MongoDB Atlas:

```properties
spring.data.mongodb.uri=mongodb+srv://<USUARIO>:<SENHA>@<CLUSTER>.mongodb.net/<NOME_DO_BANCO>
```

> *Substitua `<USUARIO>`, `<SENHA>`, `<CLUSTER>` e `<NOME_DO_BANCO>` pelas credenciais do seu banco.*

---

### Passo 3: Executar o Backend

Abra um terminal na pasta `backend`:

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

O servidor da API iniciará em: `http://localhost:8080`

---

### Passo 4: Executar o Frontend

Em um **novo terminal**, navegue até a pasta `frontend`:

```bash
cd frontend
npm install
npm run dev
```

A aplicação estará disponível no navegador em: `http://localhost:5173`

---

### Scripts Úteis (Frontend)

* `npm run dev`: Inicia o servidor de desenvolvimento.
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
