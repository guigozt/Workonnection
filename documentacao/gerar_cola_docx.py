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


def build_cola_docx(output_path):
    doc = Document()

    for section in doc.sections:
        section.top_margin = Inches(0.6)
        section.bottom_margin = Inches(0.6)
        section.left_margin = Inches(0.65)
        section.right_margin = Inches(0.65)

    style = doc.styles["Normal"]
    style.font.name = "Segoe UI"
    style.font.size = Pt(10.5)
    style.font.color.rgb = RGBColor(30, 41, 59)

    # Header Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_t = p_title.add_run("COLA DE APRESENTAÇÃO (ROTEIRO SLIDE A SLIDE)\n")
    r_t.bold = True
    r_t.font.size = Pt(16)
    r_t.font.color.rgb = RGBColor(0, 123, 138)

    r_sub = p_title.add_run("Projeto Workonnection — Ênfase em Pipeline CI/CD, Cobertura JaCoCo e Docker")
    r_sub.bold = True
    r_sub.font.size = Pt(11)
    r_sub.font.color.rgb = RGBColor(216, 107, 107)

    p_tip = doc.add_paragraph()
    p_tip.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_tip = p_tip.add_run(
        "Dica de uso: Use 'Olhar Rápido' para bater o olho em 2 segundos sem ler no slide, "
        "ou siga a 'Fala Sugerida' para explicar os gráficos e imagens com naturalidade."
    )
    r_tip.italic = True
    r_tip.font.size = Pt(9.5)
    r_tip.font.color.rgb = RGBColor(100, 116, 139)

    slides_data = [
        (
            "SLIDE 01 — Capa: Workonnection",
            "30 a 40s",
            [
                "Plataforma Full Stack de vagas temporárias com Feedback Obrigatório.",
                "Impacto social ONU: ODS 8 (Trabalho Decente) e ODS 17 (Parcerias).",
                "Foco principal: Pipeline CI/CD (GitHub Actions), 88,86% JaCoCo e Docker.",
            ],
            "Olá a todos! Somos a equipe do Workonnection, da Fatec Luigi Papaiz. O projeto é uma plataforma web "
            "de vagas temporárias que combate o ghosting profissional exigindo feedback obrigatório. Hoje, além da "
            "visão geral da plataforma, daremos ênfase especial à nossa engenharia de CI/CD, ao salto para 88,86% "
            "de cobertura de testes com JaCoCo e à containerização completa com Docker."
        ),
        (
            "SLIDE 02 — Problema vs. Solução",
            "45s",
            [
                "Problema: Ghosting profissional (candidato fica sem resposta) e contratação informal.",
                "Regra de ouro: Processo seletivo só encerra com parecer construtivo obrigatório.",
                "Recursos: 4 perfis (Estudante, MEI, ME e Empresa), Chat real-time (Pusher) e LGPD.",
            ],
            "O problema central que resolvemos é o ghosting profissional: candidatos participam de seleções e nunca "
            "recebem retorno. No Workonnection, o encerramento exige um feedback estruturado obrigatório. Atendemos "
            "quatro perfis — Estudante, MEI, Microempresa e Empresa — com chat instantâneo, upload documental em "
            "nuvem e exclusão em cascata seguindo a LGPD."
        ),
        (
            "SLIDE 03 — Arquitetura Cloud em Camadas",
            "45s",
            [
                "Arquitetura desacoplada: MVC reforçado por Service Layer.",
                "Frontend (Vercel): React 19 + TypeScript + Vite 8.",
                "Backend (Render via Docker): Java 17 + Spring Boot 3.5 + Security / Google OAuth2.",
                "Serviços: MongoDB Atlas (NoSQL + TTL), Pusher (WebSockets) e Cloudinary (mídia).",
            ],
            "Nossa arquitetura é desacoplada em três camadas na nuvem: o Frontend reativo em React 19 e TypeScript "
            "distribuído na Vercel; a API REST em Java 17 com Spring Boot 3.5 rodando em container Docker na Render, "
            "com autenticação híbrida e OAuth2; e os serviços gerenciados MongoDB Atlas, Pusher para eventos em tempo "
            "real e Cloudinary para armazenamento seguro."
        ),
        (
            "SLIDE 04 — Pipeline CI/CD no GitHub Actions (ÊNFASE)",
            "1min 15s",
            [
                "Branches monitoradas: main e reactVersion + concurrency + menor privilégio (contents: read).",
                "Estágio 1 Paralelo (3 Jobs): Gitleaks (segredos) | Frontend (ESLint + Build TS) | Backend (Mongo 7 + Testes).",
                "Estágio 2 (Quality Gate): Job Docker só inicia se os 3 jobs anteriores passarem.",
            ],
            "Entrando na nossa esteira de CI/CD no GitHub Actions: ela monitora as branches oficiais main e reactVersion, "
            "cancelando builds obsoletos automaticamente. No primeiro estágio, três jobs rodam em paralelo: o Gitleaks "
            "faz varredura DevSecOps contra vazamento de senhas; o job de Frontend valida ESLint e compilação TypeScript; "
            "e o job de Backend sobe um container efêmero do MongoDB 7 com healthcheck para rodar os testes e o JaCoCo. "
            "Somente se os três passarem, o Quality Gate final testa o docker-compose e constrói as imagens Docker."
        ),
        (
            "SLIDE 05 — Evolução da Pipeline: Antes vs. Depois (ÊNFASE)",
            "1min",
            [
                "PRs: Antes disparava 2x seguidas ➔ Agora tem filtro limpo e cancelamento automático.",
                "Banco de Testes: Antes dependia do Atlas na nuvem ➔ Agora usa container mongo:7 local e isolado.",
                "Maven: Antes rodava test e verify duplicado ➔ Agora ciclo único ./mvnw -B verify + Resumo no GitHub.",
                "Contêineres: Antes sem teste na CI ➔ Agora Quality Gate barra Dockerfile quebrado antes do deploy.",
            ],
            "Neste comparativo destacamos quatro avanços: eliminamos execuções duplicadas em Pull Requests; trocamos a "
            "dependência externa do MongoDB Atlas nos testes por um Service Container MongoDB 7 100% isolado dentro do "
            "runner; cortamos o tempo do Maven unificando em um único ciclo verify com publicação automática no resumo "
            "do GitHub; e blindamos o deploy validando o build Docker diretamente na CI."
        ),
        (
            "SLIDE 06 — Cobertura de Testes com JaCoCo (ÊNFASE)",
            "1min 15s",
            [
                "Evolução: Saltamos de 34,54% (35 testes) para 88,86% de cobertura de linhas (57 testes)!",
                "Quase 2.000 linhas cobertas com JUnit 5, Mockito e MockMvc.",
                "Destaques: Controllers 100%, Notificação 100%, Chat 99%, Usuário 98,4%, Vaga 95,7%, Candidatura 94,8%.",
                "Trava no pom.xml (jacoco-check): Exige mínimo de 70% — abaixo disso a pipeline reprova o build.",
            ],
            "Ao integrar o JaCoCo, partimos de 34,54% e expandimos nossa suíte de 35 para 57 testes automatizados, "
            "atingindo 88,86% de cobertura global de linhas. Como mostram os gráficos, todos os Controllers estão em 100% "
            "e serviços críticos como Chat, Usuário, Vaga e Candidatura passam de 94%. Além disso, configuramos a trava "
            "jacoco-check no Maven: se um novo commit derrubar a cobertura abaixo de 70%, a pipeline bloqueia o merge."
        ),
        (
            "SLIDE 07 — Docker Multi-Stage & Hardening (ÊNFASE)",
            "1min",
            [
                "Multi-Stage Build: Descarta SDKs pesados (Maven/Node) e leva só o runtime leve para produção.",
                "Backend: Cache go-offline, usuário non-root (appuser) e MaxRAMPercentage=75% (evita crash em 512 MB).",
                "Frontend: Node 20 compila e Nginx Alpine (~25 MB) serve com Gzip e try_files para rotas SPA.",
            ],
            "Na containerização adotamos builds Multi-Stage para gerar imagens enxutas e seguras. No Backend, usamos "
            "cache de dependências com go-offline, removemos privilégio root rodando com appuser e limitamos a JVM a "
            "75% da RAM para evitar quedas por falta de memória nos 512 MB da Render. No Frontend, compilamos no Node 20 "
            "e entregamos tudo em um Nginx Alpine super leve com compressão Gzip e suporte a rotas SPA."
        ),
        (
            "SLIDE 08 — Orquestração com Docker Compose (ÊNFASE)",
            "45s",
            [
                "Padronização total entre os 6 integrantes — fim do 'na minha máquina funciona'.",
                "Comando único: docker compose up --build -d sobe Banco, API e Frontend sem instalar nada.",
                "Fluxo saudável: mongodb (:27017 com healthcheck) ➔ backend (:8080 service_healthy) ➔ frontend (:5173 CORS).",
            ],
            "Para padronizar o desenvolvimento e facilitar testes locais, o docker-compose.yml orquestra os três serviços "
            "com um único comando: docker compose up --build -d. Ele sobe o MongoDB 7 com volume persistente, aguarda o "
            "banco ficar saudável via healthcheck para iniciar o Backend na porta 8080, e expõe o Frontend na porta 5173 "
            "já alinhado ao CORS, sem precisar instalar Java, Node ou configurar banco em nuvem."
        ),
        (
            "SLIDE 09 — Conclusão & Resultados",
            "35s",
            [
                "15 histórias entregues e 100% de conclusão nos testes de usabilidade.",
                "Esteira DevSecOps completa + 88,86% de cobertura auditada + Cloud & Docker prontos para escala.",
            ],
            "Concluímos o Workonnection unindo propósito social contra o ghosting — com 15 histórias validadas — a uma "
            "engenharia de software madura: arquitetura em nuvem, pipeline CI/CD DevSecOps automatizada, quase 89% de "
            "cobertura auditada pelo JaCoCo e containerização profissional pronta para produção. Muito obrigado!"
        ),
    ]

    for title, tempo, bullets, fala in slides_data:
        tbl = doc.add_table(rows=2, cols=1)
        tbl.autofit = True

        # Row 0: Header bar
        c0 = tbl.cell(0, 0)
        set_cell_shading(c0, "0F172A")
        p0 = c0.paragraphs[0]
        p0.paragraph_format.space_before = Pt(3)
        p0.paragraph_format.space_after = Pt(3)
        r_h = p0.add_run(f"{title}   |   ⏱ {tempo}")
        r_h.bold = True
        r_h.font.size = Pt(11)
        r_h.font.color.rgb = RGBColor(56, 189, 248)

        # Row 1: Quick bullets + Speech
        c1 = tbl.cell(1, 0)
        set_cell_shading(c1, "F8FAFC")
        p_b_head = c1.paragraphs[0]
        p_b_head.paragraph_format.space_before = Pt(4)
        p_b_head.paragraph_format.space_after = Pt(2)
        rbh = p_b_head.add_run("⚡ Olhar Rápido (Tópicos-Chave):")
        rbh.bold = True
        rbh.font.size = Pt(10)
        rbh.font.color.rgb = RGBColor(0, 123, 138)

        for b in bullets:
            pb = c1.add_paragraph()
            pb.paragraph_format.left_indent = Inches(0.18)
            pb.paragraph_format.space_before = Pt(1)
            pb.paragraph_format.space_after = Pt(2)
            rb = pb.add_run(f"• {b}")
            rb.font.size = Pt(9.8)

        pf_head = c1.add_paragraph()
        pf_head.paragraph_format.space_before = Pt(5)
        pf_head.paragraph_format.space_after = Pt(2)
        rfh = pf_head.add_run("🎙 Fala Sugerida:")
        rfh.bold = True
        rfh.font.size = Pt(10)
        rfh.font.color.rgb = RGBColor(216, 107, 107)

        pf = c1.add_paragraph()
        pf.paragraph_format.space_before = Pt(1)
        pf.paragraph_format.space_after = Pt(5)
        rf = pf.add_run(f'"{fala}"')
        rf.italic = True
        rf.font.size = Pt(10)

        doc.add_paragraph().paragraph_format.space_after = Pt(2)

    # Extra Q&A Section
    p_qa = doc.add_paragraph()
    p_qa.paragraph_format.space_before = Pt(8)
    r_qa = p_qa.add_run("🛡 COLA EXTRA — PERGUNTAS PROVÁVEIS DA BANCA")
    r_qa.bold = True
    r_qa.font.size = Pt(13)
    r_qa.font.color.rgb = RGBColor(0, 123, 138)

    qas = [
        ("1. Por que a pipeline monitora apenas as branches main e reactVersion?",
         "Porque refletimos fielmente a governança real do repositório: main é a linha consolidada e reactVersion é a branch ativa da arquitetura React + Spring Boot, evitando branches fictícias."),
        ("2. Como a pipeline testa o banco sem expor a senha do MongoDB Atlas?",
         "Usamos Service Containers do GitHub Actions: a esteira sobe um container oficial mongo:7 efêmero e isolado em localhost com healthcheck via mongosh apenas durante os testes."),
        ("3. Qual erro de container vocês resolveram na inicialização do MongoDB na pipeline?",
         "O healthcheck inicial com parênteses em db.runCommand({ping:1}) quebrava no interpretador /bin/sh do runner. Simplificamos a sonda para 'mongosh --quiet --eval 1', estabilizando o container."),
        ("4. Por que usar MaxRAMPercentage=75.0 no Dockerfile do Backend?",
         "Na Render o container tem limite rígido de 512 MB. Essa flag garante que a JVM respeite o limite do container e deixe 25% de margem segura para o sistema operacional, evitando OOM Kill."),
        ("5. Como funciona a trava de 70% de cobertura do JaCoCo?",
         "A meta jacoco-check roda na fase verify do Maven. Se novos códigos sem teste derrubarem a cobertura global de linhas abaixo de 70%, o build falha automaticamente e bloqueia o Pull Request."),
    ]
    for q, a in qas:
        pq = doc.add_paragraph()
        pq.paragraph_format.space_before = Pt(4)
        pq.paragraph_format.space_after = Pt(1)
        rq = pq.add_run(q)
        rq.bold = True
        rq.font.size = Pt(10)

        pa = doc.add_paragraph()
        pa.paragraph_format.left_indent = Inches(0.18)
        pa.paragraph_format.space_after = Pt(3)
        ra = pa.add_run(f"R: {a}")
        ra.font.size = Pt(9.8)

    doc.save(output_path)
    print(f"Cola DOCX gerada com sucesso em: {output_path}")


if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    build_cola_docx(os.path.join(base_dir, "Roteiro_Cola_Apresentacao.docx"))

