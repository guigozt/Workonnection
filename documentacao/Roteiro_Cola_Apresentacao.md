# Cola de Apresentação (Roteiro Slide a Slide) — Workonnection

> **Objetivo deste documento:** Como os slides foram enxugados para ficarem muito mais visuais e diretos, use este roteiro como sua **cola de apoio** no celular, segunda tela ou impresso.
> - **Olhar Rápido (3s):** Tópicos-gatilho para bater o olho sem ler texto corrido.
> - **Fala Sugerida:** Explicação completa e natural dos pontos vitais.
> - **Perguntas de Banca (no final):** Respostas rápidas para dúvidas técnicas sobre CI/CD, JaCoCo e Docker.

---

## Slide 01 — Capa: Workonnection
**⏱ Tempo sugerido:** ~30 a 40 segundos

**⚡ Olhar Rápido (Cola):**
- Plataforma Full Stack de vagas temporárias com **Feedback Obrigatório**.
- Alinhamento social: **ODS 8** (Trabalho Decente) e **ODS 17** (Parcerias).
- Foco de hoje: **Engenharia de CI/CD, Testes Automatizados (88,86%) e Docker**.

**🎙 Fala Sugerida:**
> "Olá a todos! Nós somos a equipe do projeto **Workonnection**, da Fatec Luigi Papaiz. O Workonnection é uma plataforma web voltada a vagas temporárias que combate o *ghosting* profissional exigindo feedback obrigatório aos candidatos. Nesta apresentação, além de contextualizar rapidamente a solução e sua arquitetura, vamos dar ênfase especial à nossa engenharia de **CI/CD no GitHub Actions**, ao salto para **88,86% de cobertura de testes com JaCoCo** e à **containerização completa com Docker**."

---

## Slide 02 — Problema vs. Solução
**⏱ Tempo sugerido:** ~45 segundos

**⚡ Olhar Rápido (Cola):**
- **Dor do mercado:** *Ghosting* (candidato participa e fica no vácuo) + informalidade.
- **Regra central:** Contratante só encerra processo emitindo **parecer construtivo obrigatório**.
- **Ecossistema:** 4 perfis (**Estudante, MEI, ME e Empresa**), chat em tempo real (**Pusher**) e **LGPD** (exclusão em cascata).

**🎙 Fala Sugerida:**
> "O grande problema que atacamos é o *ghosting profissional*: estudantes e autônomos se candidatam a vagas temporárias e nunca recebem retorno sobre o motivo da recusa. No Workonnection, transformamos a transparência em regra de sistema: o encerramento exige um **feedback estruturado obrigatório**. A plataforma atende quatro perfis — Estudante, MEI, Microempresa e Empresa — com chat em tempo real, gestão de documentos em nuvem e conformidade com a LGPD."

---

## Slide 03 — Arquitetura Cloud em Camadas
**⏱ Tempo sugerido:** ~45 segundos

**⚡ Olhar Rápido (Cola):**
- Padrão **MVC + Camada de Serviço (Service Layer)** isolando regras de negócio.
- **Frontend (Vercel):** React 19 + TypeScript + Vite 8.
- **Backend (Render via Docker):** Java 17 + Spring Boot 3.5 + Spring Security / Google OAuth 2.0.
- **Integrações:** MongoDB Atlas (NoSQL com TTL), Pusher (WebSockets) e Cloudinary (arquivos).

**🎙 Fala Sugerida:**
> "Tecnicamente, desacoplamos o sistema em camadas. Na ponta, o **Frontend em React 19 e TypeScript** é distribuído pela CDN da Vercel. No núcleo, a **API REST em Java 17 com Spring Boot 3.5** roda containerizada na nuvem da Render, protegida por Spring Security e login social Google OAuth2. Para persistência e eventos, integramos **MongoDB Atlas**, **Pusher Channels** para mensagens instantâneas e **Cloudinary** para armazenamento seguro de fotos e currículos."

---

## Slide 04 — Arquitetura da Pipeline de CI/CD (`workonnection.yaml`) ⭐
**⏱ Tempo sugerido:** ~1 minuto e 15 segundos

**⚡ Olhar Rápido (Cola):**
- Monitora apenas as branches reais do projeto: **`main` e `reactVersion`** (+ disparo manual).
- Segurança de execução: **`concurrency`** (cancela builds obsoletos) + **`contents: read`** (menor privilégio).
- **3 Jobs em Paralelo (Estágio 1):**
  1. **Gitleaks:** Varre histórico contra vazamento de senhas/chaves (*DevSecOps*).
  2. **Frontend:** Node 20 + `npm ci` + `ESLint` + compilação TypeScript/Vite.
  3. **Backend:** Sobe **`mongo:7` descartável** com *healthcheck* + roda `./mvnw -B verify`.
- **Quality Gate (Estágio 2):** Job **Docker** (`needs: [backend, frontend, gitleaks]`) só roda se os 3 passarem!

**🎙 Fala Sugerida:**
> "Entrando no coração de DevOps do projeto: estruturamos nossa esteira no **GitHub Actions** monitorando as branches oficiais `main` e `reactVersion`, com cancelamento automático de execuções antigas e permissões mínimas no token.
> No primeiro estágio, **três jobs rodam simultaneamente** para dar feedback rápido: o **Gitleaks** faz auditoria *DevSecOps* impedindo vazamento de credenciais; o job de **Frontend** valida *lint* e compilação estrita do TypeScript; e o job de **Backend** provisiona automaticamente um container **MongoDB 7 efêmero** com *healthcheck*, executando todos os testes e a verificação do JaCoCo.
> Somente quando esses três sinais ficam verdes, abre-se o **Quality Gate final**, que valida o `docker-compose.yml` e constrói as imagens Docker antes do deploy."

---

## Slide 05 — Evolução da Pipeline: Antes vs. Depois ⭐
**⏱ Tempo sugerido:** ~1 minuto

**⚡ Olhar Rápido (Cola):**
- **PRs sem duplicidade:** Antes rodava 2x sem filtro ➔ Agora tem filtro de branch + `cancel-in-progress`.
- **Fim da dependência externa:** Antes usava *secret* do MongoDB Atlas na nuvem ➔ Agora usa **Service Container `mongo:7` local e isolado**.
- **Metade do tempo no Maven:** Antes rodava `test` e depois `verify` (2x) ➔ Agora roda **ciclo único `./mvnw -B verify`** gerando tabela automática no resumo do GitHub.
- **Blindagem de Deploy:** Antes não testava Docker na CI ➔ Agora detecta falhas de imagem antes de chegar na Render.

**🎙 Fala Sugerida:**
> "Este comparativo mostra o ganho real da refatoração que fizemos na pipeline:
> Primeiro, eliminamos execuções duplicadas em Pull Requests e desperdício de minutos.
> Segundo — e mais crítico — removemos a dependência do MongoDB Atlas externo durante os testes, substituindo por um **Service Container oficial do MongoDB 7** dentro do próprio *runner*, garantindo testes 100% isolados e imunes a oscilações de rede.
> Terceiro, unificamos o Maven em um único ciclo `verify` com relatório publicado direto na aba *Summary* do GitHub.
> E quarto, passamos a testar o build Docker dentro da CI, evitando que um erro de imagem quebre o ambiente de produção na Render."

---

## Slide 06 — Salto de Cobertura de Testes com JaCoCo ⭐
**⏱ Tempo sugerido:** ~1 minuto e 15 segundos

**⚡ Olhar Rápido (Cola):**
- Salto expressivo: de **34,54% (35 testes)** para **88,86% de cobertura de linhas (57 testes)**!
- Quase **2.000 linhas auditadas** (`1.994 / 2.244`) com JUnit 5, Mockito e MockMvc.
- Camadas críticas blindadas: **Controllers (100%)**, **Notificação (100%)**, **Chat (99%)**, **Usuário (98,4%)**, **Vaga (95,7%)**, **Candidatura (94,8%)** e **Feedback (82,5%)**.
- **Trava automática (`jacoco-check`):** Configurada em **70%** no `pom.xml` — caiu abaixo disso, a pipeline bloqueia o merge!

**🎙 Fala Sugerida:**
> "Não basta a pipeline rodar rápido; ela precisa garantir qualidade real. Quando integramos o **JaCoCo**, medimos inicialmente **34,54%** de cobertura. Expandimos nossa suíte com JUnit 5, Mockito e MockMvc de 35 para **57 testes automatizados**, elevando a cobertura global do backend para **88,86%**.
> Como mostram os gráficos, todos os *Controllers REST* estão em **100%** e serviços vitais como *Chat, Usuário, Vaga e Candidatura* superam **94%**. Além disso, ativamos a regra `jacoco-check` no Maven exigindo piso obrigatório de **70%**: se qualquer commit futuro reduzir a cobertura abaixo dessa linha, o build quebra automaticamente."

---

## Slide 07 — Containerização Multi-Stage & Hardening ⭐
**⏱ Tempo sugerido:** ~1 minuto

**⚡ Olhar Rápido (Cola):**
- **Multi-Stage Build:** Compila em imagem pesada (Maven JDK / Node 20) e leva só o artefato final para produção (**JRE 17** / **Nginx Alpine ~25 MB**).
- **Cache inteligente:** `mvn dependency:go-offline` e `npm ci` separados do código-fonte aceleram novos builds.
- **Segurança Non-Root:** Backend roda com usuário restrito `appuser` (sem privilégio `root`).
- **Anti-Crash na Render (512 MB):** Flag `-XX:MaxRAMPercentage=75.0` impede morte do container por falta de memória (*OOM Kill*).
- **Frontend SPA:** `nginx.conf` com `try_files` (sem erro 404 ao dar F5) + compressão `Gzip`.

**🎙 Fala Sugerida:**
> "Na containerização, aplicamos o padrão **Multi-Stage Build** nas duas pontas. No Backend, compilamos com Maven mas levamos apenas o `.jar` para uma imagem enxuta **JRE 17**, aproveitando cache de dependências com `go-offline`. Por segurança, removemos privilégios administrativos rodando com usuário **non-root**, e ajustamos a JVM para limitar o uso a **75% da RAM do container**, evitando quedas no plano de 512 MB da Render.
> Já no Frontend, compilamos o React no Node 20 e entregamos os arquivos estáticos em um **Nginx Alpine** super leve, já configurado com compressão Gzip e suporte nativo às rotas SPA."

---

## Slide 08 — Orquestração Completa com Docker Compose ⭐
**⏱ Tempo sugerido:** ~45 segundos

**⚡ Olhar Rápido (Cola):**
- Fim do *"na minha máquina funciona"* entre os 6 integrantes.
- **1 único comando:** `docker compose up --build -d` sobe tudo sem instalar Java, Maven, Node ou configurar Atlas.
- Ordem inteligente: `mongodb (:27017)` valida *healthcheck* ➔ libera `backend (:8080)` via `service_healthy` ➔ conecta `frontend (:5173)` já alinhado ao CORS.

**🎙 Fala Sugerida:**
> "Para padronizar o ambiente entre os 6 desenvolvedores e facilitar qualquer avaliação técnica, criamos a orquestração completa no **`docker-compose.yml`**. Com um único comando — `docker compose up --build -d` — o Docker sobe o **MongoDB 7** com volume persistente, aguarda o banco ficar saudável via *healthcheck* para iniciar o **Backend na porta 8080**, e expõe o **Frontend na porta 5173** perfeitamente alinhado às políticas de CORS, sem precisar instalar absolutamente nada na máquina local."

---

## Slide 09 — Conclusão & Maturidade de Engenharia
**⏱ Tempo sugerido:** ~35 segundos

**⚡ Olhar Rápido (Cola):**
- **Produto validado:** 15 histórias entregues + 100% de aprovação nos testes de usabilidade.
- **DevSecOps completo:** Segurança + Lint + Testes + Docker automatizados a cada commit.
- **Confiabilidade comprovada:** 88,86% de cobertura auditada e deploy em nuvem resiliente.

**🎙 Fala Sugerida:**
> "Em síntese, o **Workonnection** entrega não apenas uma solução de impacto social real contra o *ghosting* — com 15 histórias concluídas e validadas com usuários — mas também uma base madura de Engenharia de Software: arquitetura em nuvem, pipeline DevSecOps 100% automatizada, quase 89% de cobertura de testes auditada pelo JaCoCo e containerização profissional pronta para escala. Muito obrigado, e estamos à disposição da banca!"

---

## 🛡 Cola Extra: Perguntas Prováveis da Banca (Respostas Rápidas)

1. **"Por que vocês filtraram apenas `main` e `reactVersion` na pipeline e não `develop`?"**
   > *Resposta:* Porque auditamos a governança real do nosso repositório Git: `main` é a linha principal consolidada e `reactVersion` é a branch ativa da arquitetura React + Spring Boot. Evitamos referenciar branches inexistentes para manter a pipeline limpa e fiel ao fluxo da equipe.

2. **"Como a pipeline testa o banco de dados sem expor a senha do MongoDB Atlas?"**
   > *Resposta:* Usamos o recurso de *Service Containers* do GitHub Actions. A cada execução, a esteira sobe um container oficial `mongo:7` descartável em localhost, aguarda o `mongosh` responder saudável e injeta uma URI local temporária apenas durante os testes.

3. **"Tiveram algum desafio técnico ao configurar o container do MongoDB na pipeline?"**
   > *Resposta:* Sim! Inicialmente, o *healthcheck* do Docker falhou porque o comando `db.runCommand({ping:1})` continha parênteses interpretados pelo shell `/bin/sh` do *runner* do GitHub. Resolvemos simplificando a sonda de prontidão para `mongosh --quiet --eval 1`, estabilizando a inicialização em poucos segundos.

4. **"Por que usar a flag `MaxRAMPercentage=75.0` no Dockerfile do Java?"**
   > *Resposta:* Containers gratuitos/básicos em nuvem como na Render têm limite rígido de 512 MB de RAM. Sem essa flag, a JVM pode alocar memória além do esperado somando *Heap* e *Metaspace*, fazendo o Linux matar o processo (*OOM Kill*). Com 75%, reservamos margem segura para o sistema operacional e threads nativas.

5. **"O que acontece se alguém fizer um código novo sem testes?"**
   > *Resposta:* O plugin do JaCoCo calcula a razão de linhas cobertas na fase `verify` do Maven. Se o código novo derrubar a cobertura global abaixo da trava configurada de **70%**, o Maven falha automaticamente na pipeline e impede que o Pull Request passe no Quality Gate.

