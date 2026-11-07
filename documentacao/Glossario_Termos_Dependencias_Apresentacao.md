# Guia Completo de Termos, Bibliotecas e Dependências da Apresentação — Workonnection

> **Objetivo deste documento:** Explicar de forma clara e didática **todos os termos técnicos, siglas, bibliotecas, dependências, plugins e comandos** citados nos slides e no roteiro da apresentação. Ideal para estudo rápido da equipe antes da banca.

---

## 1. Contexto de Produto, Normas e Governança (Slides 01, 02 e 09)

| Termo / Sigla | O que é (Explicação Simples) | Onde entra no Workonnection |
| :--- | :--- | :--- |
| **Ghosting Profissional** | Prática em que empresas encerram processos seletivos sem dar nenhuma resposta aos candidatos reprovados. | É a dor central resolvida pelo projeto por meio da regra de **Feedback Obrigatório**. |
| **ODS 8 e ODS 17 (ONU)** | **Objetivos de Desenvolvimento Sustentável** da Agenda 2030 da ONU. **ODS 8:** Trabalho Decente e Crescimento Econômico; **ODS 17:** Parcerias e Meios de Implementação. | Fundamentam o impacto social do projeto na inserção digna de estudantes e autônomos no mercado. |
| **MEI e ME** | **MEI:** Microempreendedor Individual; **ME:** Microempresa. Categorias jurídicas brasileiras de pequenos negócios. | Compõem 2 dos **4 perfis especializados** da plataforma (junto com *Estudante* e *Empresa*). |
| **LGPD & Exclusão em Cascata** | **Lei Geral de Proteção de Dados (Lei nº 13.709/2018)**. *Exclusão em cascata* significa apagar não só o cadastro, mas todos os registros vinculados quando o usuário pede remoção. | Ao excluir a conta, o `UsuarioService` remove candidaturas, vagas, mensagens, notificações e arquivos associados. |
| **US (User Stories)** | **Histórias de Usuário:** requisitos funcionais descritos sob a ótica do valor entregue ao usuário final. | O projeto consolidou **15 histórias entregues** com **100% de conclusão** nos testes de usabilidade. |

---

## 2. Arquitetura de Software e Padrões Web (Slide 03)

| Termo / Sigla | O que é (Explicação Simples) | Onde entra no Workonnection |
| :--- | :--- | :--- |
| **Full Stack** | Aplicação completa que abrange tanto a interface visual do usuário (*Frontend*) quanto o servidor de regras e banco de dados (*Backend*). | Repositório integrado unindo `frontend/` (React) e `backend/` (Spring Boot). |
| **SPA (Single Page Application)** | Aplicação web que carrega uma única página HTML inicial e troca de telas dinamicamente via JavaScript, sem recarregar o navegador inteiro. | Todo o Frontend React funciona como SPA, garantindo navegação instantânea. |
| **API REST** | Interface de comunicação web baseada no protocolo HTTP usando métodos padronizados (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) e dados em JSON. | Ponte de comunicação entre o Frontend React e o Backend Java. |
| **MVC + Service Layer** | **Model-View-Controller** reforçado por uma **Camada de Serviço**. Os *Controllers* apenas recebem requisições HTTP, enquanto os *Services* concentram as regras de negócio. | Garante código desacoplado e fácil de testar (ex.: `VagaController` ➔ `VagaService` ➔ `VagaRepository`). |
| **DTO & Java Records** | **Data Transfer Object:** objeto criado especificamente para transportar dados na API sem expor diretamente a tabela/coleção do banco (como hashes de senha). | Implementados com `record` imutável do Java 17 para segurança e clareza nos contratos JSON. |
| **CORS (Cross-Origin Resource Sharing)** | Mecanismo de segurança do navegador que controla quais domínios externos podem chamar a API do Backend. | Configurado no `SecurityConfig.java` autorizando `http://localhost:5173` (local/Docker) e o domínio da Vercel. |
| **Cookie `SameSite=Lax`** | Atributo de cookie de sessão que controla seu envio entre páginas. `None + Secure` exige HTTPS (nuvem), enquanto `Lax` funciona em HTTP local. | Permite que o login por sessão funcione tanto na nuvem (HTTPS) quanto localmente no Docker Compose (`http://localhost`). |
| **i18n (Internacionalização)** | Abreviação de *Internationalization* (18 letras entre o `i` e o `n`): suporte a múltiplos idiomas na interface. | Suporte nativo de tradução na camada visual do Frontend. |
| **CDN (Content Delivery Network)** | Rede mundial de servidores distribuídos que entregam páginas, scripts e imagens a partir do ponto mais próximo do usuário. | Utilizada na **Vercel** (entrega do Frontend) e no **Cloudinary** (entrega de fotos e documentos). |

---

## 3. Dependências e Ferramentas do Frontend (`frontend/package.json` — Slides 03 e 04)

| Biblioteca / Ferramenta | Tipo | Função Técnica no Projeto |
| :--- | :--- | :--- |
| **`react` & `react-dom` (v19)** | Biblioteca UI | Biblioteca principal de construção de interfaces reativas baseadas em componentes reutilizáveis. |
| **`typescript` (`tsc -b`)** | Linguagem / Compilador | Superconjunto do JavaScript que adiciona **tipagem estática**, barrando erros de propriedades ou contratos de dados ainda antes de o código rodar. |
| **`vite` (v8) & `@vitejs/plugin-react`** | Empacotador (*Bundler*) | Ferramenta moderna e ultrarrápida que inicia o servidor de desenvolvimento e gera os pacotes otimizados de produção (`dist/`). |
| **`react-router-dom` (v7)** | Roteamento | Gerencia as rotas/URLs da SPA no navegador (ex.: `/login`, `/vagas`, `/perfil`) sem recarregar a página. |
| **`axios`** | Cliente HTTP | Biblioteca usada para disparar chamadas REST ao Backend (`GET`, `POST`, etc.) com suporte a cookies de sessão (`withCredentials`) e *interceptors*. |
| **`pusher-js`** | Cliente WebSocket | Conecta o navegador ao Pusher para receber novas mensagens de chat e confirmações de leitura em tempo real. |
| **`lucide-react` & `react-icons`** | Biblioteca de Ícones | Fornecem ícones vetoriais leves (SVG) para botões, menus, indicadores e cards da interface. |
| **`eslint` & `typescript-eslint`** | Análise Estática (*Linter*) | Inspeciona o código automaticamente na pipeline (`npm run lint`) procurando más práticas, variáveis não usadas e violações das regras de *React Hooks*. |
| **`npm ci` (Clean Install)** | Comando do Node.js | Diferente do `npm install`, o `npm ci` instala **exatamente** as versões travadas no `package-lock.json` de forma limpa e reprodutível — padrão obrigatório em CI/CD e Docker. |

---

## 4. Dependências e Plugins do Backend (`backend/pom.xml` — Slides 03, 04 e 06)

| Dependência / Ferramenta | Tipo | Função Técnica no Projeto |
| :--- | :--- | :--- |
| **Java 17 (`Eclipse Temurin`)** | Linguagem / Plataforma | Versão **LTS** (*Long-Term Support*) do Java. **JDK** (*Development Kit*) compila o código; **JRE** (*Runtime Environment*) é mais leve e apenas executa o `.jar` em produção. |
| **Maven & `./mvnw -B verify`** | Gerenciador de Build | Lê o `pom.xml`, baixa dependências, compila, roda testes e gera o `.jar`. `./mvnw` (*Wrapper*) garante a mesma versão do Maven em qualquer máquina, e `-B` (*Batch*) remove barras interativas nos logs da CI. |
| **`spring-boot-starter-web` (v3.5.16)** | Framework Web | Fornece o servidor embutido (Tomcat), serialização JSON (Jackson) e anotações REST (`@RestController`, `@GetMapping`, etc.). |
| **`spring-boot-starter-data-mongodb`** | Persistência NoSQL | Integra o Spring ao MongoDB, mapeando classes Java (`@Document`) e criando consultas automáticas via interfaces `MongoRepository`. |
| **`spring-boot-starter-security`** | Segurança / Autenticação | Protege rotas da API, gerencia sessões, criptografia de senhas (`BCrypt`) e políticas de CORS/CSRF. |
| **`spring-boot-starter-oauth2-client`** | Login Social | Implementa o protocolo **OAuth 2.0** para permitir autenticação segura com conta **Google**. |
| **`spring-boot-starter-mail`** | E-mail (SMTP) | Suporte ao envio de e-mails transacionais e notificações da plataforma. |
| **`lombok` (Project Lombok)** | Produtividade Java | Gera *getters*, *setters* e construtores automaticamente em tempo de compilação via anotações, reduzindo código repetitivo (*boilerplate*). |
| **`java-dotenv` (v5.2.2)** | Configuração Local | Permite carregar variáveis de ambiente a partir de um arquivo `.env` durante o desenvolvimento local sem expor senhas no código. |
| **`pusher-http-java` (v1.3.4)** | SDK Tempo Real | SDK oficial usado pelo `ChatService` no Backend para disparar eventos instantâneos aos canais WebSocket do Pusher. |
| **`cloudinary-http44` (v1.36.0)** | SDK Armazenamento | SDK oficial usado no upload de fotos de perfil e currículos/documentos diretamente para a nuvem do Cloudinary. |

---

## 5. Banco de Dados e Serviços Cloud (Slides 03, 07 e 08)

| Serviço / Conceito | O que é | Papel na Arquitetura |
| :--- | :--- | :--- |
| **MongoDB 7 / MongoDB Atlas** | Banco de dados **NoSQL orientado a documentos** (armazena dados em formato BSON, similar a JSON). O **Atlas** é a versão gerenciada na nuvem. | Flexibilidade para guardar os 4 perfis distintos de usuários, vagas, candidaturas, feedbacks e histórico de chat. |
| **Índice TTL (Time-To-Live)** | Recurso nativo do MongoDB que monitora um campo de data e expira/remove documentos automaticamente após o prazo definido. | Auxilia no ciclo de vida temporal das vagas temporárias sem exigir rotinas manuais pesadas. |
| **Pusher Channels / WebSockets** | Serviço gerenciado de mensageria instantânea baseado em conexões persistentes **WebSocket**. | Viabiliza o chat em tempo real entre contratante e candidato sem precisar recarregar a tela (*polling*). |
| **Cloudinary** | Plataforma em nuvem especializada em armazenamento, otimização e entrega rápida de imagens e documentos. | Evita salvar fotos e PDFs no disco efêmero do container em nuvem (que seria apagado a cada novo deploy). |
| **Vercel** | Plataforma global de nuvem focada em aplicações Frontend e SPAs. | Faz o deploy contínuo automático do Frontend React com HTTPS e CDN global. |
| **Render Cloud** | Plataforma de nuvem (*PaaS*) que constrói e hospeda serviços web e containers Docker. | Hospeda a API Backend construída a partir do `backend/Dockerfile` (plano gratuito com limite de 512 MB de RAM). |

---

## 6. Engenharia de CI/CD e DevSecOps (Slides 04 e 05)

| Termo / Configuração | O que significa | Por que é vital na nossa esteira (`workonnection.yaml`) |
| :--- | :--- | :--- |
| **CI/CD** | **Continuous Integration** (Integração Contínua: validar código e testes a cada alteração) e **Continuous Delivery/Deployment** (Entrega/Deploy Contínuo em nuvem). | Impede que código quebrado, mal formatado ou sem testes chegue às branches principais e à produção. |
| **DevSecOps** | União de *Development + Security + Operations*: incluir verificações automatizadas de segurança desde o primeiro passo da esteira. | Representado pelo scan automático de segredos (**Gitleaks**), permissões restritas e container *non-root*. |
| **GitHub Actions & Runner** | Plataforma de automação nativa do GitHub. **Runner** é a máquina virtual Linux (`ubuntu-latest`) criada sob demanda para executar os comandos da pipeline. | Orquestra gratuitamente os 4 *jobs* do projeto a cada `push` ou `pull_request`. |
| **Branches `main` & `reactVersion`** | Ramificações oficiais do Git no projeto (`main` consolidada e `reactVersion` ativa da nova arquitetura). | Configurar apenas as branches reais evita execuções inúteis ou duplicadas na esteira. |
| **`workflow_dispatch`** | Gatilho manual do GitHub Actions. | Permite disparar a pipeline a qualquer momento clicando em um botão na interface do GitHub, sem precisar fazer um novo commit. |
| **`concurrency` (`cancel-in-progress`)** | Regra de controle de concorrência da esteira. | Se um desenvolvedor enviar 2 commits seguidos em 1 minuto, cancela automaticamente a execução antiga para economizar recursos e fila. |
| **`permissions: contents: read`** | Princípio do **Menor Privilégio** (*Least Privilege*) aplicado ao `GITHUB_TOKEN`. | Garante que o script da pipeline tenha permissão apenas para ler o código, nunca para alterar ou apagar dados do repositório. |
| **Gitleaks & `fetch-depth: 0`** | Ferramenta de segurança que caça senhas, chaves de API e tokens esquecidos no código. `fetch-depth: 0` baixa todo o histórico de commits para análise completa. | Bloqueia imediatamente o *Pull Request* caso alguém tente subir uma credencial sensível por engano. |
| **Service Container (`mongo:7` efêmero)** | Container auxiliar temporário iniciado pelo GitHub Actions ao lado do job de Backend e destruído ao final do teste. | Substituiu o uso do MongoDB Atlas externo nos testes: roda 100% isolado, rápido e sem expor senhas reais de banco. |
| **`healthcheck` (`mongosh`)** | Sonda periódica de saúde (`mongosh --quiet --eval 1`) executada pelo Docker. | Garante que os testes Java só comecem depois que o banco MongoDB estiver 100% pronto para aceitar conexões. |
| **Quality Gate (`needs: [...]`)** | "Portão de Qualidade": condição obrigatória de aprovação para avançar de fase. | O job final de **Docker** possui `needs: [backend, frontend, gitleaks]`, ou seja, só inicia se segurança, frontend e testes passarem juntos. |
| **GitHub Step Summary** | Painel visual em Markdown gerado automaticamente na página de resumo da execução no GitHub Actions. | Exibe uma tabela pronta com as porcentagens de cobertura do JaCoCo sem precisar baixar arquivos ZIP. |

---

## 7. Testes Automatizados e Métricas do JaCoCo (Slide 06)

| Termo / Ferramenta | O que é | Aplicação nos 57 Testes do Backend |
| :--- | :--- | :--- |
| **`spring-boot-starter-test`** | Pacote oficial que reúne as principais bibliotecas de teste do ecossistema Java/Spring (JUnit 5, Mockito, AssertJ e MockMvc). | Base de toda a pasta `backend/src/test/`. |
| **JUnit 5** | Framework padrão de execução de testes automatizados em Java (`@Test`, `assertEquals`, `assertThrows`). | Executa as asserções de sucesso e de erro das regras de negócio. |
| **Mockito (`@Mock`, `when(...)`)** | Biblioteca de criação de **Mocks** (objetos simulados/dublês). | Simula repositórios, Cloudinary e Pusher nos testes unitários para testar a lógica das *Services* em milissegundos, sem depender de serviços externos. |
| **Spring MockMvc** | Simulador da camada HTTP do Spring. | Testa os *Controllers REST* validando rotas, códigos HTTP (`200 OK`, `400 Bad Request`, `401 Unauthorized`) e serialização JSON. |
| **JaCoCo (`jacoco-maven-plugin`)** | **Java Code Coverage:** plugin que monitora quais linhas do código foram realmente executadas durante os testes. | Gerou o salto auditado de **34,54% (35 testes)** para **88,86% (57 testes)**. |
| **Linhas / Bytecode / Métodos / Branches** | As 4 dimensões medidas pelo JaCoCo:<br>• **Linhas (88,9%):** linhas de código-fonte executadas.<br>• **Bytecode/Instruções (87,5%):** instruções compiladas da JVM.<br>• **Métodos (87,2%):** funções chamadas ao menos uma vez.<br>• **Branches/Desvios (59,1%):** caminhos `if/else` e `switch` percorridos. | Dão visão transparente da profundidade dos testes por pacote e classe. |
| **`jacoco-check` (Trava 70%)** | Regra configurada no `pom.xml` (`MINIMUM = 0.70` na fase `verify`). | Se novos códigos sem teste fizerem a cobertura de linhas cair abaixo de **70%**, o Maven quebra o build automaticamente e barra o merge. |
| **p.p. (Pontos Percentuais)** | Diferença aritmética direta entre duas porcentagens (`88,86% - 34,54% = +54,32 p.p.`). | Usado no gráfico do Slide 06 (`+54,3 p.p.`) para expressar com precisão estatística o ganho de cobertura. |

---

## 8. Containerização Docker e Orquestração (Slides 07 e 08)

| Termo / Comando | O que é | Por que usamos no Workonnection |
| :--- | :--- | :--- |
| **Docker & Contêiner** | Tecnologia que empacota a aplicação junto com todas as suas bibliotecas e configurações em uma unidade isolada e leve (**contêiner**). | Elimina o problema do *"na minha máquina funciona"*, garantindo ambiente idêntico no PC da equipe, na CI e na nuvem. |
| **`Dockerfile` & Imagem** | `Dockerfile` é a "receita" passo a passo; **Imagem** é o pacote imutável gerado a partir dessa receita; **Contêiner** é a imagem em execução. | Temos receitas dedicadas em `backend/Dockerfile` e `frontend/Dockerfile`. |
| **Multi-Stage Build** | Técnica que divide o `Dockerfile` em 2 estágios: o **1º estágio** usa imagens pesadas com compiladores (Maven/Node) e o **2º estágio** copia apenas o arquivo final pronto para uma imagem enxuta de produção. | Reduz drasticamente o tamanho final (de `~480 MB` para `~185 MB` no Backend e de `~420 MB` para **`~25 MB`** no Frontend) e remove compiladores da produção. |
| **`mvn dependency:go-offline`** | Comando Maven executado no `Dockerfile` **antes** de copiar a pasta `src/`. | Cria uma **camada de cache** no Docker: se apenas o código Java mudar (e não o `pom.xml`), o Docker reaproveita todas as bibliotecas já baixadas, acelerando o deploy. |
| **Hardening Non-Root (`appuser`)** | Boa prática de segurança (*hardening*) onde o contêiner cria e usa um usuário comum sem poderes administrativos (`root`). | Se houver qualquer tentativa de invasão à aplicação, o invasor não terá privilégio administrativo dentro do servidor Linux. |
| **`UseContainerSupport` & `MaxRAMPercentage=75.0`** | Flags de memória da Máquina Virtual Java (JVM) dentro de contêineres. | Como o plano gratuito da Render tem **512 MB rígidos de RAM**, limitar a JVM a 75% deixa 25% livres para o Linux e evita o **OOM Kill** (*Out Of Memory Kill* — quando o servidor derruba o app por estouro de memória). |
| **`nginx:1.27-alpine`, `try_files` & `Gzip`** | **Nginx** é um servidor web de altíssima performance; **Alpine** é uma distribuição Linux minúscula (~5 MB). | Serve os arquivos finais do React com **compressão Gzip** (carregamento rápido) e a diretiva `try_files $uri /index.html`, que impede erro `404 Not Found` quando o usuário aperta `F5` em rotas internas como `/vagas`. |
| **`.dockerignore`** | Arquivo análogo ao `.gitignore`, mas para o Docker. | Impede que pastas pesadas ou sensíveis da máquina local (`node_modules/`, `target/`, `.env`, `uploads/`) sejam enviadas para dentro da imagem. |
| **Docker Compose (`docker compose up --build -d`)** | Orquestrador que lê o arquivo `docker-compose.yml` e sobe múltiplos contêineres conectados na mesma rede virtual com um único comando (`-d` roda em segundo plano). | Sobe `mongodb (:27017)`, `backend (:8080)` e `frontend (:5173)` juntos sem precisar instalar Java, Maven, Node ou configurar banco em nuvem. |
| **Volumes Persistentes & `service_healthy`** | **Volumes** (`mongodb_data`, `backend_uploads`) salvam dados fora do ciclo descartável do contêiner. **`depends_on: service_healthy`** controla a ordem de partida. | Garante que os dados locais não sumam ao reiniciar o Docker e que o Backend só inicie quando o MongoDB já estiver respondendo saudável. |

