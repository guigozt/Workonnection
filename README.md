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
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" height="50" alt="html5 logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="50" alt="css logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="50" alt="javascript logo" />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" height="50" alt="github logo" />
</div>

## Arquitetura 🧱

O projeto segue o padrão MVC (Model-View-Controller):

- Model → entidades (Usuario, Vaga)
- View → HTML + CSS + JS (frontend)
- Controller → endpoints REST (UsuarioController, VagaController)
- Service → regras de negócio
- Repository → acesso ao banco MongoDB

## Pré-requisitos 🖥️

Antes de rodar o projeto, você precisa ter instalado:

✅ Java 17+
✅ Maven (ou usar o wrapper mvnw)
✅ Git
✅ Conta no MongoDB Atlas

## Observações 📌
O frontend é servido diretamente pelo Spring Boot
As requisições são feitas via fetch API
O sistema utiliza autenticação baseada em sessão

## Professor 👤

- 👤 Bruno Zolotareff

## Integrantes 👥

- 👤 Hugo Aparecido  
- 👤 Paulo Roberto  
- 👤 Caroline Mendes  
- 👤 Priscila Mendes  
- 👤 Gabriel Gutierres  
- 👤 Guilherme Gomes

## Como Clonar e Testar o Projeto 🚀

Siga os passos abaixo para configurar o projeto localmente e rodar o backend com o MongoDB Atlas.

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/guigozt/Workonnection.git
cd Workonnection/backend
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
.\mvnw clean install
.\mvnw spring-boot:run
````

### 5️⃣ Testar a aplicação
Abra o navegador em http://localhost:8080/modules/auth/Login.html
