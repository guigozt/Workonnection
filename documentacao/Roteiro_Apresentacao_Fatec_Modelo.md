# Roteiro Completo de Apresentação – Workonnection (Modelo Oficial Fatec Diadema)

**Disciplina:** Laboratório de Desenvolvimento Web (6º Semestre)  
**Instituição:** Centro Paula Souza – Faculdade de Tecnologia Luigi Papaiz (Fatec Diadema)  
**Projeto:** Workonnection – Plataforma para Divulgação de Vagas Temporárias com Feedback Obrigatório  
**Autores:** Caroline de Carvalho Mendes, Gabriel da Silva Gutierres, Guilherme Gomes da Silva, Hugo Aparecido de Oliveira Costa, Paulo Roberto Santos Elias, Priscila de Carvalho Mendes  
**Arquivo Gerado:** `documentacao/Apresentacao_Workonnection_Modelo_Final.pptx` (e cópia em `documentacao/Apresentacao_Workonnection.pptx`)

---

## Estrutura dos 7 Slides e Fala Sugerida

### Slide 1: Capa
- **Elementos Visuais:** Cabeçalho oficial Fatec Diadema / Centro Paula Souza, título da disciplina, nome do projeto, relação completa dos seis autores, logotipo do Centro Paula Souza à esquerda e logotipo do Workonnection à direita.
- **Tempo Estimado:** 1 minuto.
- **Roteiro de Fala:**
  > *"Boa noite, professora Elza e colegas. Somos estudantes da Fatec Diadema e hoje apresentamos o projeto integrador da disciplina de Laboratório de Desenvolvimento Web: o **Workonnection**, uma plataforma web full stack voltada à divulgação e intermediação de vagas temporárias que estabelece, como regra de negócio indispensável, o fornecimento obrigatório de feedback estruturado aos candidatos. Nossa equipe é composta por Caroline Mendes, Gabriel Gutierres, Guilherme Silva, Hugo Costa, Paulo Roberto Santos Elias e Priscila Mendes. Ao longo desta apresentação, demonstraremos como unimos boas práticas de Engenharia de Software a um propósito prático de impacto social."*

---

### Slide 2: Introdução & Alinhamento aos ODS
- **Elementos Visuais:** Coluna esquerda com contexto, o problema do ghosting profissional, objetivo e ODS; coluna direita com o card gráfico ilustrando os ODS 8 e 17 e o diferencial da plataforma.
- **Tempo Estimado:** 2 minutos.
- **Roteiro de Fala:**
  > *"Na Introdução, partimos de um diagnóstico real: o mercado de trabalho temporário no Brasil sofre com alta informalidade e falta de transparência. Plataformas tradicionais facilitam a candidatura, mas o processo se encerra de maneira silenciosa e unilateral — fenômeno que a literatura acadêmica chama de **ghosting profissional** (SILVA; RODRIGUES, 2025). O candidato é recusado sem saber o motivo, o que gera frustração emocional e impede qualquer correção de rumo técnico ou comportamental.  
  O objetivo do Workonnection é combater essa opacidade por meio da arquitetura de software, transformando a devolutiva em uma regra mandatória.  
  Esse propósito conecta-se diretamente a dois Objetivos de Desenvolvimento Sustentável da Agenda 2030 da ONU:  
  1) **ODS 8 (Trabalho Decente e Crescimento Econômico):** ao estruturar as relações temporárias, combater a precarização e fazer com que cada seleção recusada sirva de insumo de capacitação para o trabalhador;  
  2) **ODS 17 (Parcerias e Meios de Implementação):** operando como uma rede colaborativa multissetorial que aproxima empresas, MEIs, autônomos, estudantes universitários e instituições de ensino."*

---

### Slide 3: Modelo de Negócio — Business Model Canvas
- **Elementos Visuais:** Imagem oficial em alta resolução do Business Model Canvas do Workonnection perfeitamente enquadrada e centralizada.
- **Tempo Estimado:** 2 minutos.
- **Roteiro de Fala:**
  > *"Apresentamos a modelagem de negócio do Workonnection via Business Model Canvas:  
  - **Proposta de Valor:** Conectar empresas, MEIs e estudantes com agilidade, oferecendo comunicação direta via chat em tempo real e instituindo o feedback estruturado bilateral obrigatório como alavanca de empregabilidade.  
  - **Segmento de Clientes:** Empresas de pequeno e médio porte, startups, microempreendedores individuais (MEIs), estudantes universitários e trabalhadores autônomos em busca de renda temporária digna.  
  - **Parcerias Principais:** Universidades e Fatecs para divulgação acadêmica e captação de talentos, empresas parceiras contratantes e provedores de nuvem (Vercel, Render, MongoDB Atlas, Cloudinary, Pusher).  
  - **Atividades e Recursos-Chave:** Desenvolvimento e manutenção contínua da aplicação, esteira DevSecOps automatizada, algoritmo de busca contextual, segurança LGPD e sustentação da infraestrutura tecnológica.  
  - **Estrutura de Custos e Fontes de Receita:** Custos enxutos de computação em nuvem, banco de dados gerenciado e armazenamento seguro; viabilidade financeira prevista por taxas por contratação bem-sucedida, vagas patrocinadas/destacadas e planos corporativos de triagem avançada."*

---

### Slide 4: Materiais e Métodos (Referencial Teórico)
- **Elementos Visuais:** Subtítulo metodológico com Engenharia de Software Empírica (ESE) por Estudo de Caso (Yin, 2014; Hollweck, 2015) e ISO/IEC 25010; 4 itens numerados com badges laranjas oficiais (#D24726); diagrama de blocos da arquitetura em camadas à direita.
- **Tempo Estimado:** 2,5 minutos.
- **Roteiro de Fala:**
  > *"Nossa fundamentação metodológica seguiu a Engenharia de Software Empírica por meio de Estudo de Caso (YIN, 2014; HOLLWECK, 2015; GUEVARA-VEGA et al., 2021) em três dimensões da norma ISO/IEC 25010:  
  1. **Processo Ágil:** Adotamos um modelo iterativo e incremental fundamentado no Manifesto Ágil (BECK et al., 2001) e adaptado do Scrum (SOMMERVILLE, 2019; PRESSMAN; MAXIM, 2021) em 4 ciclos (sprints) de agosto a novembro de 2026, com Product Backlog de 15 histórias de usuário e quadro Kanban no Trello.  
  2. **Arquitetura MVC com Service Layer:** Para evitar o antipadrão 'Fat Controllers', isolamos a View (SPA em React 19, TypeScript e Vite) do backend (Spring Boot 3.5 em Java 17). Nossos controllers são enxutos (Thin Controllers) e delegam transações, validações de negócio e regras de feedback para a Camada de Serviços (KRASNER; POPE, 1988; SOMMERVILLE, 2019).  
  3. **Gerenciamento de Configuração e DevSecOps:** Controle de versão no GitHub com feature branches e Pull Requests para as branches `reactVersion` e `main`. Pipeline no GitHub Actions executando varredura Gitleaks de segredos, lint Node.js 20, MongoDB 7 efêmero no runner, Maven verify e Docker Multi-Stage (Nginx Alpine e Eclipse Temurin JRE 17).  
  4. **Validação em Três Níveis:** (i) 22 cenários funcionais caixa-preta em BDD Gherkin (SMART, 2015); (ii) suíte automatizada com 57 testes (JUnit 5, Mockito, MockMvc) com Quality Gate de 70% no JaCoCo; e (iii) testes empíricos de usabilidade com usuários representativos (Vitor e Bernardo)."*

---

### Slide 5: Resultados — Métricas de Gerenciamento e Qualidade
- **Elementos Visuais:** 4 blocos de métricas quantitativas à esquerda e o gráfico auditado de cobertura JaCoCo (+54,3 p.p., 88,9% e 57 testes) à direita.
- **Tempo Estimado:** 2,5 minutos.
- **Roteiro de Fala:**
  > *"Nos Resultados, comprovamos o alcance das metas planejadas com dados auditados:  
  1. **Escopo Ágil (100% Entregue):** Das 15 histórias de usuário planejadas no Plano de Release, entregamos 100% (15 de 15) nos 4 ciclos, organizadas em 8 módulos operacionais.  
  2. **Classes e Persistência NoSQL:** O backend possui mais de 25 classes estruturadas (Controllers, Services, Repositories e DTOs). O banco MongoDB Atlas conta com 5 coleções documentais principais (usuarios, vagas, candidaturas, feedbacks, mensagens), com subperfis polimórficos e índices TTL para expiração de vagas.  
  3. **Linhas de Código e Testes JaCoCo:** Auditamos 2.244 linhas de código no backend. A suíte foi expandida para 11 classes de teste, saltando de 34,54% (35 testes) para **88,86% de cobertura de linhas** (1.994 linhas cobertas) em **57 testes automatizados**. Nossos Controllers atingiram 100% e os Services centrais superaram 94% de cobertura.  
  4. **Usabilidade Real:** Nos testes com os usuários representativos Vitor (Estudante) e Bernardo (Empresa), obtivemos 100% de conclusão autônoma das tarefas. O fluxo completo de candidatura e devolutiva estruturada foi executado em menos de 3 minutos, com unânime aprovação de clareza."*

---

### Slide 6: Resultados — SOLID, Camada de Serviços e Módulos Entregues
- **Elementos Visuais:** 4 itens numerados cobrindo os princípios SOLID, a abordagem orientada a serviços, os 8 módulos entregues e a matriz de permissões.
- **Tempo Estimado:** 2,5 minutos.
- **Roteiro de Fala:**
  > *"Neste slide, destacamos a excelência técnica de código e arquitetura:  
  1. **Princípios SOLID:**  
     - **DIP (Inversão de Dependência):** Controllers e Services dependem de interfaces e contratos abstratos via Spring IoC (@Autowired), sem acoplamento a drivers NoSQL;  
     - **SRP (Responsabilidade Única):** Thin Controllers tratam apenas transporte HTTP e DTOs; validações transacionais e regras corporativas ficam estritamente na Service Layer;  
     - **ISP (Segregação de Interfaces):** Contratos segregados por entidade (VagaOperationsContract, CandidaturaOperationsContract, etc.).  
  2. **Abordagem Orientada a Serviços:** A Service Layer atua como orquestradora e integra quatro serviços externos via SDKs: Pusher Channels (WebSockets em tempo real para chat), Cloudinary API (storage em nuvem para fotos e documentos comprobatórios até 10 MB com fallback local), Google Identity OAuth 2.0 (tokens JWT) e JavaMail (SMTP para códigos transitórios).  
  3. **Oito Módulos Operacionais Concluídos:** Gestão multi-perfil e privacidade LGPD com exclusão em cascata; Upload de comprovantes; Gestão de vagas com curtidas/comentários; Busca contextual com filtros de modalidade (Presencial/Remoto/Híbrido); Candidaturas com triagem; Feedback obrigatório bilateral; Chat via WebSockets; e Central de Notificações.  
  4. **Blindagem do Feedback na Camada de Serviço:** O método `atualizarStatus` de `CandidaturaService` bloqueia transição direta para status RECUSADO com erro HTTP 400. A recusa só é permitida via `recusarComFeedback`, que valida obrigatoriamente motivo e dicas construtivas (HTTP 422 se ausente). O encerramento da vaga após contratação também é automático via `FeedbackService`."*

---

### Slide 7: Considerações Finais
- **Elementos Visuais:** 3 blocos numerados destacando as dificuldades técnicas superadas, o impacto social e os trabalhos futuros mapeados.
- **Tempo Estimado:** 1,5 minuto.
- **Roteiro de Fala:**
  > *"Finalizando com as Considerações Finais:  
  1. **Dificuldades Enfrentadas e Superadas:**  
     - Autenticação e cookies de sessão cross-site (SameSite=None; Secure) com CORS restrito entre SPA na Vercel e API na nuvem Render;  
     - Estabilização de sondas de prontidão (healthchecks) do MongoDB 7 na esteira GitHub Actions e ajuste fino de memória JVM (-XX:MaxRAMPercentage=75.0) para contornar o teto de 512 MB da nuvem Render;  
     - Modelagem da exclusão em cascata (LGPD) e integridade relacional entre vagas, inscrições e mensagens em um banco NoSQL documental.  
  2. **Impacto e Conclusão:** O Workonnection atinge plenamente seus objetivos, aliando 88,86% de cobertura de código a um compromisso social com os ODS 8 e 17, erradicando o ghosting profissional no mercado temporário.  
  3. **Trabalhos Futuros:** Versão mobile nativa (React Native / Flutter), validação cadastral automatizada de comprovantes por OCR, anonimato opcional em avaliações corporativas sensíveis e suíte automatizada E2E com Cypress/Playwright.  
  Agradecemos a atenção da banca avaliadora e abrimos para perguntas."*

---

## Perguntas Prováveis da Banca & Respostas Estratégicas

### P1: "Por que escolheram MongoDB em vez de um banco relacional como PostgreSQL?"
- **Resposta:** O MongoDB foi selecionado pela flexibilidade do modelo de documentos para acomodar subperfis polimórficos dentro da entidade `Usuario` (`PerfilEstudante`, `PerfilMei`, `PerfilMe`, `PerfilEmpresa`) sem a necessidade de múltiplas tabelas de junção complexas. Além disso, utilizamos índices de expiração automática (TTL - Time to Live) para encerrar vagas expiradas nativamente no banco. A integridade referencial foi garantida na Camada de Serviços através de rotinas coordenadas de exclusão em cascata.

### P2: "Como vocês garantem que a empresa realmente deu feedback e não enviou apenas um caractere em branco?"
- **Resposta:** Implementamos validações tanto no frontend (React) quanto na Camada de Serviços (`CandidaturaService.recusarComFeedback`). O backend rejeita requisições com campos vazios ou motivos genéricos abaixo do limite mínimo com código de erro HTTP 422 (Unprocessable Entity). Adicionalmente, o método direto de transição de status para RECUSADO lança erro HTTP 400, forçando o uso exclusivo do endpoint de recusa estruturada com feedback.

### P3: "Como foi resolvida a limitação de 512 MB de RAM no plano gratuito da nuvem Render?"
- **Resposta:** Utilizamos Docker com Multi-Stage Build. No primeiro estágio, o Maven e a JDK compilam a aplicação; no estágio final, utilizamos a imagem enxuta Eclipse Temurin JRE 17 sob usuário non-root e configuramos a flag JVM `-XX:MaxRAMPercentage=75.0`. Com isso, a JVM não ultrapassa ~384 MB de heap, deixando folga para o sistema operacional do container e prevenindo o encerramento por Out of Memory.

