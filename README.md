# Sistema Workonnection

Plataforma digital para conectar empresas e trabalhadores autônomos/MEIs de forma ágil, segura e acessível.

## Sobre o Projeto 💻📚

O Workonnection tem como objetivo reduzir a burocracia e o tempo gasto em contratações temporárias.  
Ele promove oportunidades para profissionais autônomos e simplifica processos para empresas, alinhado aos ODS 8 (Trabalho Decente e Crescimento Econômico) e ODS 17 (Parcerias e Meios de Implementação) da ONU.

## Objetivos 📊

- Agilizar contratações temporárias com uma interface intuitiva.  
- Oferecer vagas personalizadas para estudantes, autônomos e MEIs.  
- Garantir segurança com verificação de documentos (CNPJ/MEI).  
- Implementar avaliações e feedbacks para maior confiança entre as partes.

## Tecnologias Utilizadas ⚙

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="50" alt="react logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="50" alt="typescript logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" height="50" alt="java logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" height="50" alt="spring logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" height="50" alt="mongodb logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="50" alt="css logo" />
</div>

## Arquitetura 🧱

O projeto adota uma arquitetura **desacoplada (Frontend SPA + Backend REST API)**:

- **Frontend (React + TypeScript + Vite):** Interface SPA interativa, estilizada com CSS Modules e rotas gerenciadas por React Router.
- **Backend (Spring Boot):** API RESTful que gerencia regras de negócio, autenticação via sessão HTTP/SecurityContext e endpoints.
- **Database (MongoDB Atlas):** Banco NoSQL para armazenamento de usuários, vagas, comentários e notificações.

## Pré-requisitos 🖥️

Antes de rodar o projeto, você precisa ter instalado:

- Node.js (v18+) e NPM
- Java 17+
- Maven (ou utilizar o wrapper `./mvnw`)
- Git
- Conta no MongoDB Atlas

## Observações 📌
- O frontend roda de forma independente via Vite (`http://localhost:5173`) e consome a API executada no Spring Boot (`http://localhost:8080`).
- A autenticação é gerenciada via Cookies/Sessão (`JSESSIONID`) com envio de credenciais habilitado no CORS (`credentials: 'include'`).

## Professor 👤

- 👤 Bruno Zolotareff

## Integrantes 👥

- 👤 Hugo Aparecido  
- 👤 Paulo Roberto  
- 👤 Caroline Mendes  
- 👤 Priscila Mendes  
- 👤 Gabriel Gutierres  
- 👤 Guilherme Gomes

---

## Como Clonar e Testar o Projeto 🚀

### 1️⃣ Clonar o repositório

```bash
git clone [https://github.com/guigozt/Workonnection.git](https://github.com/guigozt/Workonnection.git)
cd Workonnection
````

### 2️⃣ Criar arquivo local

Crie um arquivo nesse caminho:

```bash
backend\src\main\resources\application-local.properties
````

E adicione o link de acesso ao banco do MongoDB Atlas

```bash
spring.data.mongodb.uri=mongodb+srv://USUARIO:SENHA@CLUSTER.mongodb.net/NOME_DO_BANCO
````

Troque USUARIO, SENHA, CLUSTER e SEU_BANCO pelos dados do seu cluster Atlas.

### 3️⃣ Instalar dependencias

No terminal, estando na pasta do backend, execute:

```bash
cd backend
.\mvnw clean install
.\mvnw spring-boot:run
````

### 5️⃣ Testar a aplicação

Em um novo terminal, acesse a pasta do frontend a partir da raiz do projeto:: 
```bash
cd frontend
npm install
npm run dev
```
