import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_background(cell, hex_color):
    """Sets background color of a table cell."""
    tcPr = cell._element.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_color)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Sets cell padding in dxa (1 pt = 20 dxa)."""
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for margin_name, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{margin_name}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def create_document():
    doc = docx.Document()

    # Define standard margins (2.5 cm)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Color Palette
    PRIMARY = RGBColor(27, 54, 93)      # #1B365D - Deep Navy
    SECONDARY = RGBColor(41, 128, 185)  # #2980B9 - Blue Accent
    DARK_TEXT = RGBColor(44, 62, 80)    # #2C3E50 - Dark Slate
    GRAY_TEXT = RGBColor(127, 140, 141) # #7F8C8D - Gray
    BG_LIGHT = 'F4F6F9'

    # Title
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title_p.add_run("Workonnection")
    title_run.font.name = 'Calibri'
    title_run.font.size = Pt(26)
    title_run.font.bold = True
    title_run.font.color.rgb = PRIMARY
    title_p.paragraph_format.space_after = Pt(4)

    # Subtitle
    sub_p = doc.add_paragraph()
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub_run = sub_p.add_run("Análise de Requisitos Não-Funcionais (RNF) segundo a ISO/IEC 25010 e Impactos na Arquitetura de Software")
    sub_run.font.name = 'Calibri'
    sub_run.font.size = Pt(14)
    sub_run.font.bold = True
    sub_run.font.color.rgb = SECONDARY
    sub_p.paragraph_format.space_after = Pt(16)

    # Metadata Box
    meta_table = doc.add_table(rows=1, cols=1)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = meta_table.cell(0, 0)
    set_cell_background(cell, BG_LIGHT)
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)

    meta_p = cell.paragraphs[0]
    meta_p.paragraph_format.space_after = Pt(2)
    m1 = meta_p.add_run("Projeto: ")
    m1.bold = True
    meta_p.add_run("Workonnection — Plataforma Digital para Conexão Profissional (Autônomos / MEIs)\n")
    m2 = meta_p.add_run("Stack Tecnológica: ")
    m2.bold = True
    meta_p.add_run("React 19, TypeScript, Vite, Spring Boot 3, Spring Security, MongoDB Atlas\n")
    m3 = meta_p.add_run("Integrantes: ")
    m3.bold = True
    meta_p.add_run("Hugo Aparecido, Paulo Roberto, Caroline Mendes, Priscila Mendes, Gabriel Gutierres, Guilherme Gomes\n")
    m4 = meta_p.add_run("Norma Avaliada: ")
    m4.bold = True
    meta_p.add_run("ISO/IEC 25010 (Modelo de Qualidade de Produto de Software)")

    doc.add_paragraph().paragraph_format.space_after = Pt(10)

    # Helper function for Section Headings
    def add_heading_1(text):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(14)
        h.paragraph_format.space_after = Pt(6)
        r = h.add_run(text)
        r.font.name = 'Calibri'
        r.font.size = Pt(16)
        r.font.bold = True
        r.font.color.rgb = PRIMARY
        return h

    def add_heading_2(text):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(10)
        h.paragraph_format.space_after = Pt(4)
        r = h.add_run(text)
        r.font.name = 'Calibri'
        r.font.size = Pt(13)
        r.font.bold = True
        r.font.color.rgb = SECONDARY
        return h

    # Section 1: Objetivo
    add_heading_1("1. Objetivo da Atividade")
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "Esta atividade tem como objetivo analisar e demonstrar como os Requisitos Não-Funcionais (RNF), "
        "estruturados sob as diretrizes do padrão internacional de qualidade ISO/IEC 25010, guiaram as decisões "
        "críticas de arquitetura do sistema Workonnection. A arquitetura de uma aplicação moderna não é orientada "
        "apenas pelo que o software faz (requisitos funcionais), mas prioritariamente por como o software se comporta "
        "em termos de segurança, desempenho, disponibilidade e manutenibilidade."
    )

    # Prompt Box
    prompt_table = doc.add_table(rows=1, cols=1)
    prompt_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    p_cell = prompt_table.cell(0, 0)
    set_cell_background(p_cell, 'EBF5FB')
    set_cell_margins(p_cell, top=120, bottom=120, left=180, right=180)
    pr_p = p_cell.paragraphs[0]
    pr_label = pr_p.add_run("Prompt de Pesquisa Utilizado:\n")
    pr_label.bold = True
    pr_label.font.color.rgb = SECONDARY
    pr_text = pr_p.add_run(
        "“Como um analista de qualidade, relacione os aspectos mais importantes que devem direcionar a especificação "
        "de requisitos não funcionais, considerando a ISO/IEC 25010, para um projeto de software e como esses requisitos "
        "podem impactar a arquitetura do software”"
    )
    pr_text.italic = True

    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    # Section 2: Pesquisa e Visão do Analista
    add_heading_1("2. Fundamentação Teórica: ISO/IEC 25010 e Impacto Arquitetural")
    
    add_heading_2("2.1. O Modelo de Qualidade de Software ISO/IEC 25010")
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "A norma ISO/IEC 25010 substituiu a antiga ISO/IEC 9126 e estabelece um modelo de qualidade estruturado em 8 características "
        "primárias para produtos de software. Sob a ótica de um Analista de Qualidade (QA), essas características funcionam como "
        "direcionadores para a identificação precoce de restrições técnicas e métricas de aceitação:"
    )

    characteristics = [
        ("Segurança (Security):", " Grau de proteção das informações e dados contra acessos não autorizados. Subcaracterísticas: Confidencialidade, Integridade, Não-repúdio, Responsabilidade e Autenticidade."),
        ("Eficiência de Desempenho (Performance Efficiency):", " Comportamento temporal sob cargas específicas e utilização eficiente de recursos computacionais. Subcaracterísticas: Tempo de resposta, Vazão e Capacidade."),
        ("Manutenibilidade (Maintainability):", " Eficácia e facilidade com que o software pode ser modificado, corrigido ou evoluído. Subcaracterísticas: Modularidade, Reusabilidade, Analisabilidade, Modificabilidade e Testabilidade."),
        ("Confiabilidade (Reliability):", " Capacidade do sistema de desempenhar funções especificadas sob condições pré-estabelecidas e por períodos definidos. Subcaracterísticas: Disponibilidade, Maturidade, Tolerância a falhas e Recuperabilidade."),
        ("Compatibilidade (Compatibility):", " Capacidade de componentes trocarem informações e compartilharem recursos sem conflitos. Subcaracterísticas: Coexistência e Interoperabilidade."),
        ("Usabilidade (Usability):", " Grau em que o produto pode ser usado por usuários específicos com eficácia e satisfação. Subcaracterísticas: Reconhecibilidade, Facilidade de aprendizado, Operabilidade e Estética."),
        ("Portabilidade (Portability):", " Facilidade com que o sistema pode ser transferido de um ambiente operacional ou de hardware para outro. Subcaracterísticas: Adaptabilidade, Facilidade de instalação e Facilidade de substituição."),
        ("Adequação Funcional (Functional Suitability):", " Grau em que as funções atendem aos objetivos especificados. Subcaracterísticas: Completude, Correção e Pertinência funcional.")
    ]

    for title, desc in characteristics:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.line_spacing = 1.15
        bp.paragraph_format.space_after = Pt(3)
        r_title = bp.add_run(title)
        r_title.bold = True
        r_title.font.color.rgb = DARK_TEXT
        bp.add_run(desc)

    add_heading_2("2.2. Como os RNFs Moldam e Restringem a Arquitetura")
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "Ao contrário dos requisitos funcionais, que determinam as 'telas e botões' do sistema, os requisitos não-funcionais "
        "definem os alicerces estruturais da solução (estilo arquitetural, tecnologias, protocolos e estratégias de persistência). "
        "A relação de causa e efeito ocorre da seguinte forma:"
    )

    impacts = [
        ("Segurança e Privacidade ➔ ", "Impõem a segregação de dados por meio de DTOs, filtros de autorização na borda da API, gerenciamento de sessões com cookies seguros (SameSite/Secure) e criptografia forte de dados sensíveis."),
        ("Desempenho e Escalabilidade ➔ ", "Direcionam o modelo de persistência (NoSQL com documentos desnormalizados vs. relacional), indexações de banco e comunicação assíncrona/reativa."),
        ("Manutenibilidade ➔ ", "Determina o padrão de divisão de responsabilidades: desacoplamento total entre Frontend (SPA) e Backend (REST API) e organização interna em camadas bem delimitadas (Controller, Service, Repository)."),
        ("Portabilidade e Implantação ➔ ", "Exigem conteinerização (Docker), configuração externa isolada do código (environment variables) e suporte a execução transparente em nuvem.")
    ]

    for label, text in impacts:
        ip = doc.add_paragraph(style='List Bullet')
        ip.paragraph_format.line_spacing = 1.15
        ip.paragraph_format.space_after = Pt(3)
        r_label = ip.add_run(label)
        r_label.bold = True
        r_label.font.color.rgb = SECONDARY
        ip.add_run(text)

    # Section 3: Análise Crítica Workonnection
    add_heading_1("3. Análise Crítica Aplicada ao Projeto Workonnection")
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "O Workonnection foi desenvolvido para aproximar autônomos, MEIs e estudantes de oportunidades de prestação de serviços "
        "e empregos temporários. A partir da análise dos RNFs, a arquitetura do sistema foi estruturada no modelo desacoplado "
        "Client-Server (SPA + RESTful API), amparado por pilares fundamentais:"
    )

    points_workonnection = [
        ("Blindagem LGPD na Camada Pública:", " Como a plataforma publica perfis e vagas, é crucial que dados confidenciais (CPF, telefone, senha, e-mail privado) não trafeguem na rede em endpoints de consulta pública. Isso exigiu a criação de DTOs de sanitização (UsuarioPublicoDTO e PerfilPublicoDTO)."),
        ("Arquitetura Desacoplada (Frontend SPA + Backend REST):", " A adoção de React 19 com Vite no frontend e Spring Boot 3 no backend permitiu que a interface seja altamente ágil e responsiva para o autônomo em dispositivos móveis, comunicando-se estritamente por JSON."),
        ("Modelo de Dados Dinâmico com MongoDB Atlas:", " Vagas contam com interações dinâmicas (curtidas, comentários e filtros de requisitos). O modelo NoSQL orientado a documentos foi escolhido para suportar o feed sem a sobrecarga de JOINs relacionais."),
        ("Segurança de Sessão e Interoperabilidade Cross-Origin:", " Como o frontend é hospedado na Vercel e o backend no Render, o sistema precisou de configuração criteriosa de CORS e cookies de sessão (SameSite=None; Secure=true) e suporte federado ao Google OAuth2.")
    ]

    for title, desc in points_workonnection:
        p_pt = doc.add_paragraph(style='List Bullet')
        p_pt.paragraph_format.line_spacing = 1.15
        p_pt.paragraph_format.space_after = Pt(3)
        r_t = p_pt.add_run(title)
        r_t.bold = True
        p_pt.add_run(desc)

    # Section 4: Especificação dos Requisitos
    add_heading_1("4. Especificação dos Requisitos que Impactam a Arquitetura")
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(6)
    p.add_run(
        "A seguir, são especificados formalmente os requisitos de maior impacto na arquitetura do Workonnection, "
        "no formato solicitado pela atividade (RF01 – O sistema deve...):"
    )

    requirements = [
        {
            "id": "RF01",
            "enunciado": "O sistema deve desacoplar a interface visual da camada de regras de negócio e dados através de uma API RESTful.",
            "iso": "Manutenibilidade (Modularidade e Modificabilidade)",
            "justificativa": "Permite que a interface do usuário (SPA) e o núcleo de regras de negócio (API) evoluam, sejam testados e recebam deploy de forma independente.",
            "impacto": "Determinou a divisão física do repositório em Frontend (React 19 + TypeScript + Vite) e Backend (Spring Boot 3 no padrão MVC + Service). A comunicação é estritamente assíncrona via HTTP/JSON."
        },
        {
            "id": "RF02",
            "enunciado": "O sistema deve proteger a exposição de dados sensíveis na camada pública em conformidade com as diretrizes da LGPD.",
            "iso": "Segurança (Confidencialidade)",
            "justificativa": "Profissionais autônomos e candidatos precisam de visualização de perfil profissional sem ter seus dados privados (CPF, telefone, senha hash) expostos na rede.",
            "impacto": "Exigiu a inclusão de uma camada estrita de Data Transfer Objects (DTOs) como UsuarioPublicoDTO e PerfilPublicoDTO. Nenhuma entidade pura do MongoDB é exposta diretamente nos endpoints públicos."
        },
        {
            "id": "RF03",
            "enunciado": "O sistema deve armazenar credenciais com criptografia unidirecional e controlar autenticações por meio de sessões HTTP protegidas.",
            "iso": "Segurança (Autenticidade e Integridade)",
            "justificativa": "Garantir que senhas nunca sejam armazenadas em texto claro e que sessões de usuários sejam blindadas contra interceptações e ataques de sequestro de sessão.",
            "impacto": "Implementação do Spring Security com BCryptPasswordEncoder para hashing de senhas. Sessão gerenciada via cookie JSESSIONID com sinalizadores SameSite=None e Secure=true, além do endpoint de login federado via Google OAuth2."
        },
        {
            "id": "RF04",
            "enunciado": "O sistema deve persistir informações em um banco de dados NoSQL orientado a documentos com alta disponibilidade.",
            "iso": "Eficiência de Desempenho e Confiabilidade (Disponibilidade)",
            "justificativa": "O feed de vagas possui interações instantâneas (likes, dislikes e comentários aninhados) e schemas dinâmicos que gerariam gargalos em bancos relacionais.",
            "impacto": "Adoção do MongoDB Atlas na nuvem com cluster replicado e Spring Data MongoDB. Permitiu modelar comentários e curtidas diretamente no documento de Vaga, reduzindo latência no carregamento do feed."
        },
        {
            "id": "RF05",
            "enunciado": "O sistema deve garantir comunicação segura e controlada entre origens distintas (CORS Cross-Origin).",
            "iso": "Compatibilidade (Interoperabilidade) e Segurança",
            "justificativa": "O frontend SPA e a API residem em domínios e portas diferentes em desenvolvimento e em produção (Vercel e Render).",
            "impacto": "Configuração explícita de CorsConfigurationSource no SecurityConfig do Spring, liberando origens autorizadas (localhost:5173, vercel.app), com suporte obrigatório a credenciais (allowCredentials=true) e cabeçalhos de autorização."
        },
        {
            "id": "RF06",
            "enunciado": "O sistema deve ser distribuível por meio de contêineres e configurações baseadas em variáveis de ambiente.",
            "iso": "Portabilidade (Adaptabilidade e Facilidade de Instalação)",
            "justificativa": "Permitir que desenvolvedores executem a aplicação localmente de imediato e que o deploy em plataformas de nuvem (Render, Docker) ocorra de forma padronizada.",
            "impacto": "Criação de Dockerfile multi-stage (Maven 3.9 + Eclipse Temurin 17 JRE) e parametrização dinâmica de application.properties via profiles (local e prod) e variáveis de ambiente (MONGODB_URI, SPRING_PROFILES_ACTIVE)."
        }
    ]

    for req in requirements:
        # Table per requirement for visual elegance
        t = doc.add_table(rows=4, cols=2)
        t.alignment = WD_TABLE_ALIGNMENT.CENTER
        
        # Col widths
        for row in t.rows:
            row.cells[0].width = Inches(1.8)
            row.cells[1].width = Inches(4.7)

        # Header row
        cell_hdr = t.cell(0, 0)
        set_cell_background(cell_hdr, 'EAECEE')
        set_cell_margins(cell_hdr, top=80, bottom=80, left=120, right=120)
        p_hdr = cell_hdr.paragraphs[0]
        r_id = p_hdr.add_run(req["id"])
        r_id.bold = True
        r_id.font.color.rgb = PRIMARY

        cell_title = t.cell(0, 1)
        set_cell_background(cell_title, 'EAECEE')
        set_cell_margins(cell_title, top=80, bottom=80, left=120, right=120)
        p_t = cell_title.paragraphs[0]
        r_enunc = p_t.add_run(req["enunciado"])
        r_enunc.bold = True
        r_enunc.font.color.rgb = DARK_TEXT

        # Row 1: ISO
        c0 = t.cell(1, 0)
        set_cell_margins(c0, top=60, bottom=60, left=120, right=120)
        p0 = c0.paragraphs[0]
        r0 = p0.add_run("Característica ISO 25010:")
        r0.bold = True

        c1 = t.cell(1, 1)
        set_cell_margins(c1, top=60, bottom=60, left=120, right=120)
        p1 = c1.paragraphs[0]
        p1.add_run(req["iso"])

        # Row 2: Justificativa
        c2 = t.cell(2, 0)
        set_cell_margins(c2, top=60, bottom=60, left=120, right=120)
        p2 = c2.paragraphs[0]
        r2 = p2.add_run("Justificativa Técnica:")
        r2.bold = True

        c3 = t.cell(2, 1)
        set_cell_margins(c3, top=60, bottom=60, left=120, right=120)
        p3 = c3.paragraphs[0]
        p3.add_run(req["justificativa"])

        # Row 3: Impacto
        c4 = t.cell(3, 0)
        set_cell_margins(c4, top=60, bottom=60, left=120, right=120)
        p4 = c4.paragraphs[0]
        r4 = p4.add_run("Impacto na Arquitetura:")
        r4.bold = True
        r4.font.color.rgb = SECONDARY

        c5 = t.cell(3, 1)
        set_cell_margins(c5, top=60, bottom=60, left=120, right=120)
        p5 = c5.paragraphs[0]
        p5.add_run(req["impacto"])

        doc.add_paragraph().paragraph_format.space_after = Pt(4)

    # Section 5: Matriz de Rastreabilidade
    add_heading_1("5. Matriz de Rastreabilidade: RNF x ISO 25010 x Arquitetura")
    p = doc.add_paragraph()
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.space_after = Pt(6)
    p.add_run("A tabela abaixo sintetiza o mapeamento entre os requisitos levantados, os atributos da ISO/IEC 25010 e as tecnologias correspondentes no projeto:")

    summary_table = doc.add_table(rows=7, cols=4)
    summary_table.alignment = WD_TABLE_ALIGNMENT.CENTER

    headers = ["Requisito", "Atributo ISO 25010", "Componente Arquitetural", "Tecnologia / Decisão"]
    for i, h in enumerate(headers):
        c = summary_table.cell(0, i)
        set_cell_background(c, '1B365D')
        set_cell_margins(c, top=100, bottom=100, left=100, right=100)
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.color.rgb = RGBColor(255, 255, 255)

    matrix_data = [
        ("RF01", "Manutenibilidade", "Divisão SPA + REST API", "React 19, TypeScript, Spring Boot 3"),
        ("RF02", "Segurança (LGPD)", "Camada de DTOs", "UsuarioPublicoDTO, PerfilPublicoDTO"),
        ("RF03", "Segurança", "Camada de Autenticação", "BCrypt, Spring Security, Google OAuth2"),
        ("RF04", "Desempenho / Confiabilidade", "Camada de Persistência", "MongoDB Atlas NoSQL, Documentos Embutidos"),
        ("RF05", "Compatibilidade / Segurança", "Filtro de Cross-Origin", "CorsConfigurationSource, SameSite Cookies"),
        ("RF06", "Portabilidade", "Empacotamento / Deploy", "Dockerfile multi-stage, application.properties")
    ]

    for row_idx, row_data in enumerate(matrix_data, start=1):
        bg = 'F8F9F9' if row_idx % 2 == 1 else 'FFFFFF'
        for col_idx, text in enumerate(row_data):
            c = summary_table.cell(row_idx, col_idx)
            set_cell_background(c, bg)
            set_cell_margins(c, top=80, bottom=80, left=100, right=100)
            p = c.paragraphs[0]
            if col_idx == 0:
                r = p.add_run(text)
                r.bold = True
                r.font.color.rgb = PRIMARY
            else:
                p.add_run(text)

    # Save document
    output_path = r"c:\Users\paulo\Documents\Workonnection\documentacao\Atividade_Requisitos_Nao_Funcionais_ISO25010.docx"
    doc.save(output_path)
    print(f"Document saved successfully at: {output_path}")

if __name__ == "__main__":
    create_document()
