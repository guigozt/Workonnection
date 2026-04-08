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

### 2️⃣ Criar uma variavel de ambiente

Abra o terminal e rode o comando para criar a variável de ambiente que guarda a URL de conexão com o MongoDB Atlas:

```bash
setx MONGO_URI "mongodb+srv://USUARIO:SENHA@SEU_CLUSTER.mongodb.net/workonnection"
````

Troque USUARIO, SENHA e SEU_CLUSTER pelos dados do seu cluster Atlas.

Feche o terminal atual e abra novamente outro terminal.

### 3️⃣ Rodar o backend

No terminal, estando na pasta do backend, execute:

```bash
.\mvnw clean install
.\mvnw spring-boot:run
````

### 5️⃣ Testar a aplicação
Abra o navegador em http://localhost:8080/modules/auth/Login.html

Certifique-se de que o MongoDB Atlas permite conexão do seu IP (libere em Network Access caso necessário).
