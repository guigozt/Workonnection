import os
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn


def set_cell_shading(cell, color_hex):
    shading = OxmlElement("w:shd")
    shading.set(qn("w:fill"), color_hex)
    cell._tc.get_or_add_tcPr().append(shading)


def set_cell_margins(cell, top=80, bottom=80, left=120, right=120):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement("w:tcMar")
    for m, val in [("top", top), ("bottom", bottom), ("left", left), ("right", right)]:
        node = OxmlElement(f"w:{m}")
        node.set(qn("w:w"), str(val))
        node.set(qn("w:type"), "dxa")
        tcMar.append(node)
    tcPr.append(tcMar)


SECTIONS = [
    (
        "1. Contexto de Produto, Normas e Governança (Slides 01, 02 e 09)",
        [
            ("Ghosting Profissional",
             "Prática em que empresas encerram processos seletivos sem dar nenhuma resposta aos candidatos reprovados.",
             "É a dor central resolvida pelo projeto por meio da regra de Feedback Obrigatório."),
            ("ODS 8 e ODS 17 (ONU)",
             "Objetivos de Desenvolvimento Sustentável da Agenda 2030 da ONU. ODS 8: Trabalho Decente e Crescimento Econômico; ODS 17: Parcerias e Meios de Implementação.",
             "Fundamentam o impacto social do projeto na inserção digna de estudantes e autônomos."),
            ("MEI e ME",
             "MEI: Microempreendedor Individual; ME: Microempresa. Categorias jurídicas brasileiras de pequenos negócios.",
             "Compõem 2 dos 4 perfis especializados da plataforma (junto com Estudante e Empresa)."),
            ("LGPD & Exclusão em Cascata",
             "Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Exclusão em cascata apaga não só o perfil, mas todos os dados vinculados quando solicitado.",
             "Ao excluir a conta, o UsuarioService remove candidaturas, vagas, mensagens, notificações e arquivos."),
            ("US (User Stories)",
             "Histórias de Usuário: requisitos funcionais descritos sob a ótica do valor entregue ao usuário.",
             "O projeto consolidou 15 histórias entregues com 100% de conclusão nos testes de usabilidade."),
        ],
    ),
    (
        "2. Arquitetura de Software e Padrões Web (Slide 03)",
        [
            ("Full Stack",
             "Aplicação completa que abrange tanto a interface visual (Frontend) quanto o servidor de regras e banco de dados (Backend).",
             "Repositório integrado unindo frontend/ (React) e backend/ (Spring Boot)."),
            ("SPA (Single Page Application)",
             "Aplicação web que carrega uma única página HTML inicial e troca de telas dinamicamente via JavaScript, sem recarregar o navegador inteiro.",
             "Todo o Frontend React funciona como SPA, garantindo navegação fluida e instantânea."),
            ("API REST",
             "Interface de comunicação web baseada em HTTP usando métodos padronizados (GET, POST, PUT, PATCH, DELETE) e JSON.",
             "Ponte estruturada entre o Frontend React e o Backend Java."),
            ("MVC + Service Layer",
             "Model-View-Controller reforçado por Camada de Serviço: Controllers apenas recebem requisições HTTP, enquanto Services isolam as regras de negócio.",
             "Garante baixo acoplamento e facilidade de testes unitários (ex.: VagaController -> VagaService)."),
            ("DTO & Java Records",
             "Data Transfer Object: objeto criado para trafegar dados na API sem expor diretamente o modelo do banco (como hashes de senha).",
             "Implementados com record imutável do Java 17 para segurança e clareza nos contratos JSON."),
            ("CORS (Cross-Origin Resource Sharing)",
             "Mecanismo de segurança do navegador que define quais domínios externos podem requisitar dados da API.",
             "Configurado no SecurityConfig.java autorizando http://localhost:5173 (local/Docker) e a Vercel."),
            ("Cookie SameSite=Lax",
             "Atributo de cookie de sessão. None + Secure exige HTTPS (nuvem), enquanto Lax permite autenticação via HTTP local.",
             "Viabiliza login por sessão tanto em produção (HTTPS) quanto localmente no Docker Compose."),
            ("i18n (Internacionalização)",
             "Abreviação de Internationalization: arquitetura preparada para múltiplos idiomas na interface.",
             "Suporte nativo a tradução de textos na camada visual do Frontend."),
            ("CDN (Content Delivery Network)",
             "Rede distribuída de servidores globais que entregam páginas e arquivos a partir do ponto geograficamente mais próximo do usuário.",
             "Presente na Vercel (entrega do Frontend) e no Cloudinary (entrega de fotos e PDFs)."),
        ],
    ),
    (
        "3. Bibliotecas e Dependências do Frontend — package.json (Slides 03 e 04)",
        [
            ("react & react-dom (v19)",
             "Biblioteca principal de construção de interfaces reativas baseadas em componentes reutilizáveis.",
             "Núcleo de todas as páginas e componentes interativos do Frontend."),
            ("typescript (tsc -b)",
             "Superconjunto do JavaScript com tipagem estática, detectando erros de tipos e contratos em tempo de compilação.",
             "Validado rigorosamente no build local, no Dockerfile e na pipeline do GitHub Actions."),
            ("vite (v8) & @vitejs/plugin-react",
             "Empacotador (bundler) moderno e ultrarrápido que serve o ambiente dev e gera os arquivos otimizados de produção (dist/).",
             "Gera pacotes leves com hash para cache eficiente no navegador e no Nginx."),
            ("react-router-dom (v7)",
             "Biblioteca de gerenciamento de rotas no navegador para aplicações SPA.",
             "Controla a navegação entre telas (/login, /vagas, /perfil) sem recarregar a página."),
            ("axios",
             "Cliente HTTP baseado em Promises para consumo de APIs REST.",
             "Centraliza chamadas ao Backend com envio automático de credenciais/cookies e interceptors."),
            ("pusher-js",
             "Biblioteca cliente de WebSockets da plataforma Pusher.",
             "Recebe instantaneamente novas mensagens e avisos de leitura no chat do usuário."),
            ("lucide-react & react-icons",
             "Coleções de ícones vetoriais leves em SVG para React.",
             "Composição visual limpa dos botões, indicadores de status, menus e cards."),
            ("eslint & typescript-eslint",
             "Ferramentas de análise estática de código (Linter) para JavaScript e TypeScript.",
             "Executado na pipeline (npm run lint) para barrar más práticas e erros em React Hooks."),
            ("npm ci (Clean Install)",
             "Comando do Node.js que instala exatamente as versões travadas no package-lock.json em ambiente limpo.",
             "Usado na pipeline CI e no Dockerfile para builds 100% determinísticos e reprodutíveis."),
        ],
    ),
    (
        "4. Frameworks, Dependências e Plugins do Backend — pom.xml (Slides 03, 04 e 06)",
        [
            ("Java 17 (Eclipse Temurin — JDK vs JRE)",
             "Versão LTS (Long-Term Support) do Java. JDK compila o código; JRE é mais enxuto e apenas executa o .jar.",
             "Usamos JDK no estágio de build e JRE enxuto na imagem final de produção Docker."),
            ("Maven & ./mvnw -B verify",
             "Gerenciador de dependências e ciclo de build Java. ./mvnw fixa a versão do Maven e -B ativa modo silencioso para logs de CI.",
             "Compila o projeto, roda os 57 testes e executa a checagem obrigatória do JaCoCo em um único ciclo."),
            ("spring-boot-starter-web (v3.5.16)",
             "Módulo base para criação de APIs REST com servidor Tomcat embutido e conversão automática JSON.",
             "Sustenta todos os Controllers REST do sistema."),
            ("spring-boot-starter-data-mongodb",
             "Integração oficial do Spring com bancos NoSQL MongoDB.",
             "Mapeia entidades (@Document) e abstrai consultas nos repositórios MongoRepository."),
            ("spring-boot-starter-security",
             "Framework de autenticação, autorização e proteção contra ataques web.",
             "Gerencia sessões autenticadas, criptografia BCrypt de senhas e regras de CORS."),
            ("spring-boot-starter-oauth2-client",
             "Implementação cliente do protocolo OAuth 2.0 / OpenID Connect no Spring.",
             "Permite login social rápido e seguro utilizando conta Google."),
            ("spring-boot-starter-mail",
             "Módulo Spring para envio de e-mails via protocolo SMTP.",
             "Suporte a comunicações e notificações por e-mail na plataforma."),
            ("lombok (Project Lombok)",
             "Biblioteca que gera getters, setters e construtores automaticamente em tempo de compilação.",
             "Elimina código repetitivo (boilerplate) nas classes de modelo e serviço."),
            ("java-dotenv (v5.2.2)",
             "Leitor de arquivos .env para aplicações Java.",
             "Facilita carregar variáveis sensíveis em ambiente de desenvolvimento local sem fixá-las no código."),
            ("pusher-http-java (v1.3.4)",
             "SDK oficial do Pusher para servidores Java.",
             "Usado pelo ChatService para publicar eventos de mensagens em tempo real."),
            ("cloudinary-http44 (v1.36.0)",
             "SDK oficial de integração Java com o Cloudinary.",
             "Realiza upload seguro de fotos de perfil e documentos diretamente para a nuvem."),
        ],
    ),
    (
        "5. Banco de Dados e Serviços em Nuvem (Slides 03, 07 e 08)",
        [
            ("MongoDB 7 / MongoDB Atlas",
             "Banco de dados NoSQL orientado a documentos (formato BSON/JSON). Atlas é sua oferta gerenciada em nuvem.",
             "Armazena com flexibilidade os 4 perfis de usuário, vagas, candidaturas, feedbacks e conversas."),
            ("Índice TTL (Time-To-Live)",
             "Índice especial do MongoDB que expira documentos automaticamente após um tempo configurado.",
             "Apoia a gestão automática de validade temporal de registros e vagas temporárias."),
            ("Pusher Channels / WebSockets",
             "Serviço em nuvem de comunicação bidirecional em tempo real via protocolo WebSocket.",
             "Entrega mensagens de chat instantaneamente sem sobrecarregar o servidor com requisições repetidas."),
            ("Cloudinary",
             "Serviço cloud de armazenamento e distribuição otimizada de imagens e arquivos.",
             "Garante que fotos e currículos não sejam perdidos quando o container na Render reinicia."),
            ("Vercel & Render Cloud",
             "Plataformas modernas de nuvem (PaaS) com integração direta ao GitHub.",
             "Vercel hospeda o Frontend estático globalmente; Render executa o container Docker do Backend."),
        ],
    ),
    (
        "6. Engenharia de CI/CD e DevSecOps — workonnection.yaml (Slides 04 e 05)",
        [
            ("CI/CD",
             "Continuous Integration (validar build e testes a cada código novo) e Continuous Delivery/Deployment (entrega contínua em nuvem).",
             "Automatiza a qualidade de ponta a ponta antes que alterações cheguem ao usuário final."),
            ("DevSecOps",
             "Cultura que integra Segurança automatizada dentro do fluxo de Desenvolvimento e Operações.",
             "Aplicada com Gitleaks, menor privilégio no token da CI e execução non-root no Docker."),
            ("GitHub Actions, Runner & Jobs",
             "Automação nativa do GitHub onde máquinas virtuais Linux (Runners) executam tarefas (Jobs) em paralelo ou em sequência.",
             "Roda 3 jobs simultâneos no Estágio 1 e 1 Quality Gate final no Estágio 2."),
            ("Branches main & reactVersion + workflow_dispatch",
             "Filtro das ramificações oficiais do projeto somado ao botão de disparo manual sob demanda (workflow_dispatch).",
             "Evita disparos duplicados em branches inexistentes e permite revalidar a esteira a qualquer hora."),
            ("concurrency (cancel-in-progress)",
             "Diretiva que cancela execuções anteriores da mesma branch se um novo commit for enviado em seguida.",
             "Economiza minutos de execução e entrega resultado mais rápido em Pull Requests ativos."),
            ("permissions: contents: read",
             "Aplicação do Princípio do Menor Privilégio ao token temporário da esteira.",
             "Impede que jobs modifiquem código ou configurações do repositório em caso de falha em terceiros."),
            ("Gitleaks & fetch-depth: 0",
             "Scanner de segurança que detecta senhas, tokens e chaves vazadas em todo o histórico Git (fetch-depth: 0).",
             "Atua como barreira automática contra vazamento acidental de credenciais."),
            ("Service Container (mongo:7 efêmero) & healthcheck",
             "Container temporário do MongoDB 7 criado dentro do runner apenas durante o teste, monitorado por sonda mongosh.",
             "Substituiu o Atlas externo na CI: testes rodam isolados, rápidos e sem expor credenciais de produção."),
            ("Quality Gate (needs: [backend, frontend, gitleaks])",
             "Portão de qualidade que bloqueia a etapa seguinte caso qualquer verificação anterior falhe.",
             "Garante que o build Docker só seja validado/aprovado quando Segurança, Front e Back estiverem 100% verdes."),
            ("GitHub Step Summary",
             "Relatório visual em Markdown renderizado diretamente na tela da execução no GitHub.",
             "Exibe instantaneamente a tabela com as porcentagens de cobertura do JaCoCo."),
        ],
    ),
    (
        "7. Testes Automatizados e Métricas do JaCoCo (Slide 06)",
        [
            ("spring-boot-starter-test",
             "Pacote agregador oficial de ferramentas de teste do ecossistema Spring.",
             "Fornece JUnit 5, Mockito e MockMvc para os 57 testes automatizados do projeto."),
            ("JUnit 5",
             "Framework padrão da plataforma Java para escrita e execução de testes (@Test, Assertions).",
             "Valida cenários positivos, regras de exceção e casos de borda em todas as camadas."),
            ("Mockito (@Mock / Dublês)",
             "Framework que cria objetos simulados para isolar a classe testada de dependências externas.",
             "Simula MongoDB, Cloudinary e Pusher nos testes unitários das Services com execução em milissegundos."),
            ("Spring MockMvc",
             "Utilitário que simula requisições HTTP reais contra os Controllers sem precisar abrir porta de rede.",
             "Atingiu 100% de cobertura nos Controllers REST validando status HTTP e respostas JSON."),
            ("JaCoCo (jacoco-maven-plugin v0.8.12)",
             "Java Code Coverage: ferramenta que instrumenta o bytecode Java para medir exatamente o que os testes executam.",
             "Comprovou a evolução de 34,54% (35 testes) para 88,86% de cobertura de linhas (57 testes)."),
            ("Linhas, Bytecode, Métodos e Branches",
             "Métricas do JaCoCo: Linhas executadas (88,9%), instruções compiladas (87,5%), métodos invocados (87,2%) e desvios if/else (59,1%).",
             "Oferecem transparência completa sobre a qualidade interna do Backend."),
            ("jacoco-check (Trava Mínima de 70%)",
             "Meta automática vinculada à fase verify do Maven exigindo COVEREDRATIO >= 0.70.",
             "Se alguém adicionar código sem testes e a cobertura cair abaixo de 70%, o build quebra na hora."),
            ("p.p. (Pontos Percentuais)",
             "Unidade que mede a diferença absoluta entre duas porcentagens (88,86% - 34,54% = +54,32 p.p.).",
             "Destaca no gráfico do Slide 06 o ganho real obtido na cobertura."),
        ],
    ),
    (
        "8. Containerização Docker e Orquestração (Slides 07 e 08)",
        [
            ("Docker, Dockerfile, Imagem e Contêiner",
             "Dockerfile é o script de montagem; Imagem é o pacote fechado gerado; Contêiner é a instância isolada rodando.",
             "Padroniza o ambiente entre os 6 integrantes da equipe, a pipeline CI e o servidor em nuvem."),
            ("Multi-Stage Build",
             "Divisão do Dockerfile em estágio de compilação (pesado, descartado) e estágio final de execução (leve).",
             "Reduziu o Backend de ~480 MB para ~185 MB e o Frontend de ~420 MB para apenas ~25 MB."),
            ("mvn dependency:go-offline",
             "Comando que baixa todas as dependências do pom.xml em uma camada separada antes de copiar o código-fonte.",
             "Aproveita o cache de camadas do Docker para tornar novos builds muito mais rápidos."),
            ("Hardening Non-Root (appuser)",
             "Prática de segurança que executa o processo da aplicação com um usuário restrito sem poder de administrador (root).",
             "Protege o servidor hospedeiro contra escalonamento de privilégios."),
            ("UseContainerSupport & MaxRAMPercentage=75.0",
             "Parâmetros da JVM que instruem o Java a respeitar o limite de memória do contêiner.",
             "Evita quedas por falta de memória (OOM Kill) dentro do limite rígido de 512 MB do plano gratuito da Render."),
            ("nginx:1.27-alpine, try_files & Gzip",
             "Servidor web ultraleve em Linux Alpine configurado com compressão HTTP Gzip e redirecionamento para index.html.",
             "Entrega o React com alta velocidade e impede erro 404 ao atualizar a página em rotas internas da SPA."),
            (".dockerignore",
             "Lista de pastas e arquivos ignorados no envio de contexto ao Docker.",
             "Bloqueia envio de node_modules/, target/, uploads/ e arquivos sensíveis .env para dentro da imagem."),
            ("Docker Compose (docker compose up --build -d)",
             "Ferramenta declarativa (docker-compose.yml) que constrói e conecta múltiplos contêineres com um só comando.",
             "Sobe MongoDB (:27017), Backend (:8080) e Frontend (:5173) prontos para uso sem instalar nada na máquina."),
            ("Volumes Persistentes & depends_on: service_healthy",
             "Volumes preservam dados do banco no disco; service_healthy aguarda o healthcheck antes de subir dependentes.",
             "Garante persistência local de dados e impede que o Spring Boot tente conectar antes de o MongoDB iniciar."),
        ],
    ),
]


def build_glossario_docx(output_path):
    doc = Document()

    for section in doc.sections:
        section.top_margin = Inches(0.55)
        section.bottom_margin = Inches(0.55)
        section.left_margin = Inches(0.60)
        section.right_margin = Inches(0.60)

    normal = doc.styles["Normal"]
    normal.font.name = "Segoe UI"
    normal.font.size = Pt(10)
    normal.font.color.rgb = RGBColor(30, 41, 59)

    # Document Header
    p_head = doc.add_paragraph()
    p_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r1 = p_head.add_run("GUIA DE TERMOS, BIBLIOTECAS E DEPENDÊNCIAS DA APRESENTAÇÃO\n")
    r1.bold = True
    r1.font.size = Pt(15.5)
    r1.font.color.rgb = RGBColor(0, 123, 138)

    r2 = p_head.add_run("Projeto Workonnection — Referência Técnica Didática para Estudo e Defesa em Banca")
    r2.bold = True
    r2.font.size = Pt(10.5)
    r2.font.color.rgb = RGBColor(216, 107, 107)

    p_intro = doc.add_paragraph()
    p_intro.alignment = WD_ALIGN_PARAGRAPH.CENTER
    ri = p_intro.add_run(
        "Este documento explica de forma objetiva cada sigla, biblioteca, dependência, plugin e comando "
        "apresentado nos slides de Arquitetura, Pipeline CI/CD, Testes JaCoCo e Docker."
    )
    ri.italic = True
    ri.font.size = Pt(9.5)
    ri.font.color.rgb = RGBColor(100, 116, 139)

    col_widths = [Inches(2.05), Inches(2.65), Inches(2.55)]

    for sec_title, items in SECTIONS:
        p_sec = doc.add_paragraph()
        p_sec.paragraph_format.space_before = Pt(10)
        p_sec.paragraph_format.space_after = Pt(4)
        rs = p_sec.add_run(sec_title)
        rs.bold = True
        rs.font.size = Pt(12)
        rs.font.color.rgb = RGBColor(15, 23, 42)

        tbl = doc.add_table(rows=1 + len(items), cols=3)
        tbl.autofit = False

        headers = ["Termo / Dependência", "O que é (Explicação Simples)", "Papel no Workonnection"]
        hdr_cells = tbl.rows[0].cells
        for idx, h_text in enumerate(headers):
            hdr_cells[idx].width = col_widths[idx]
            set_cell_shading(hdr_cells[idx], "0F172A")
            set_cell_margins(hdr_cells[idx], top=90, bottom=90, left=110, right=110)
            ph = hdr_cells[idx].paragraphs[0]
            ph.paragraph_format.space_before = Pt(2)
            ph.paragraph_format.space_after = Pt(2)
            rh = ph.add_run(h_text)
            rh.bold = True
            rh.font.size = Pt(9.8)
            rh.font.color.rgb = RGBColor(56, 189, 248)

        for r_idx, (term, desc, role) in enumerate(items, start=1):
            row_cells = tbl.rows[r_idx].cells
            bg_hex = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
            vals = [term, desc, role]
            for c_idx, val in enumerate(vals):
                row_cells[c_idx].width = col_widths[c_idx]
                set_cell_shading(row_cells[c_idx], bg_hex)
                set_cell_margins(row_cells[c_idx], top=75, bottom=75, left=110, right=110)
                pc = row_cells[c_idx].paragraphs[0]
                pc.paragraph_format.space_before = Pt(1)
                pc.paragraph_format.space_after = Pt(1)
                rc = pc.add_run(val)
                rc.font.size = Pt(9.3)
                if c_idx == 0:
                    rc.bold = True
                    rc.font.color.rgb = RGBColor(0, 123, 138)
                else:
                    rc.font.color.rgb = RGBColor(30, 41, 59)

    doc.save(output_path)
    print(f"Glossario DOCX gerado com sucesso em: {output_path}")


if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    build_glossario_docx(os.path.join(base_dir, "Glossario_Termos_Dependencias_Apresentacao.docx"))

