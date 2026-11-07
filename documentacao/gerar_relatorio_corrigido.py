import os
import docx
from docx.shared import Cm, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls


BLACK = RGBColor(0, 0, 0)
FONT_FAMILY = "Times New Roman"


def set_run_font(run, size_pt=12, bold=False, italic=False, font_name=FONT_FAMILY):
    """Garante fonte Times New Roman preta em todos os alfabetos XML do Word."""
    run.font.name = font_name
    run.font.size = Pt(size_pt)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = BLACK
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.find(qn("w:rFonts"))
    if rFonts is None:
        rFonts = OxmlElement("w:rFonts")
        rPr.insert(0, rFonts)
    rFonts.set(qn("w:ascii"), font_name)
    rFonts.set(qn("w:hAnsi"), font_name)
    rFonts.set(qn("w:cs"), font_name)
    rFonts.set(qn("w:eastAsia"), font_name)


def set_cell_background(cell, hex_color):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)


def set_cell_borders(cell, color="000000", sz="4"):
    tcPr = cell._element.get_or_add_tcPr()
    tcBorders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:left w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:bottom w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'<w:right w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(tcBorders)


def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)


def add_page_number_footer(section):
    footer = section.footer
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    p.paragraph_format.first_line_indent = Cm(0)
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)

    run = p.add_run()
    set_run_font(run, size_pt=10)
    fldChar1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls("w"))
    instrText = parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls("w"))
    fldChar2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls("w"))
    fldChar3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls("w"))
    run._r.append(fldChar1)
    run._r.append(instrText)
    run._r.append(fldChar2)
    run._r.append(fldChar3)


def add_body_paragraph(doc, segments, indent_cm=1.0, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6):
    """
    Adiciona parágrafo padrão do relatório (Times New Roman 12, preto, justificado, recuo 1 cm).
    segments pode ser uma string simples ou uma lista de tuplas: (texto, bold, italic).
    """
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.first_line_indent = Cm(indent_cm)
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15

    if isinstance(segments, str):
        r = p.add_run(segments)
        set_run_font(r, size_pt=12, bold=False, italic=False)
    else:
        for seg in segments:
            txt = seg[0]
            b = seg[1] if len(seg) > 1 else False
            it = seg[2] if len(seg) > 2 else False
            r = p.add_run(txt)
            set_run_font(r, size_pt=12, bold=b, italic=it)
    return p


def add_heading(doc, text, space_before=12, space_after=6):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.first_line_indent = Cm(0)
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    set_run_font(r, size_pt=12, bold=True)
    return p


def add_caption_top(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.first_line_indent = Cm(0)
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    r = p.add_run(text)
    set_run_font(r, size_pt=11, bold=False)
    return p


def add_source_bottom(doc, text="Fonte: elaborado pelos autores (2026)."):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.first_line_indent = Cm(0)
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(8)
    r = p.add_run(text)
    set_run_font(r, size_pt=10, bold=False)
    return p


def add_boxed_block(doc, lines, align=WD_ALIGN_PARAGRAPH.CENTER, font_name=FONT_FAMILY, font_size=11):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Cm(17.0)

    cell = table.cell(0, 0)
    cell.width = Cm(17.0)
    set_cell_borders(cell, color="000000", sz="6")
    set_cell_margins(cell, top=120, bottom=120, left=180, right=180)

    p = cell.paragraphs[0]
    p.alignment = align
    p.paragraph_format.first_line_indent = Cm(0)
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15

    for idx, item in enumerate(lines):
        if isinstance(item, tuple):
            txt, b, it = item
        else:
            txt, b, it = item, False, False
        suffix = "\n" if idx < len(lines) - 1 else ""
        r = p.add_run(txt + suffix)
        set_run_font(r, size_pt=font_size, bold=b, italic=it, font_name=font_name)


def add_styled_table(doc, headers, rows, col_widths_cm):
    table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    # Cabeçalho
    hdr_row = table.rows[0]
    trPr = hdr_row._tr.get_or_add_trPr()
    trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))

    for col_idx, h_text in enumerate(headers):
        cell = hdr_row.cells[col_idx]
        cell.width = Cm(col_widths_cm[col_idx])
        set_cell_background(cell, "EFEFEF")
        set_cell_borders(cell, color="000000", sz="4")
        set_cell_margins(cell, top=90, bottom=90, left=110, right=110)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.first_line_indent = Cm(0)
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1)
        p.paragraph_format.line_spacing = 1.1
        r = p.add_run(h_text)
        set_run_font(r, size_pt=10.5, bold=True)

    # Linhas de dados
    for row_idx, r_data in enumerate(rows, start=1):
        row = table.rows[row_idx]
        for col_idx, val in enumerate(r_data):
            cell = row.cells[col_idx]
            cell.width = Cm(col_widths_cm[col_idx])
            set_cell_borders(cell, color="000000", sz="4")
            set_cell_margins(cell, top=80, bottom=80, left=110, right=110)
            p = cell.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.first_line_indent = Cm(0)
            p.paragraph_format.space_before = Pt(1)
            p.paragraph_format.space_after = Pt(1)
            p.paragraph_format.line_spacing = 1.1
            r = p.add_run(val)
            set_run_font(r, size_pt=10.5, bold=False)


def build_relatorio(output_path):
    doc = docx.Document()

    # Configurar estilo Normal padrão
    normal_style = doc.styles["Normal"]
    normal_style.font.name = FONT_FAMILY
    normal_style.font.size = Pt(12)
    normal_style.font.color.rgb = BLACK

    # Configurar Página A4 (21,0 x 29,7 cm) e Margens estritas de 2,0 cm nos 4 lados
    for section in doc.sections:
        section.page_width = Cm(21.0)
        section.page_height = Cm(29.7)
        section.top_margin = Cm(2.0)
        section.bottom_margin = Cm(2.0)
        section.left_margin = Cm(2.0)
        section.right_margin = Cm(2.0)
        add_page_number_footer(section)

    # =========================================================================
    # CABEÇALHO E TÍTULO (Seguindo estritamente o modelo da pág. 1 do Template)
    # =========================================================================
    p_top1 = doc.add_paragraph()
    p_top1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_top1.paragraph_format.first_line_indent = Cm(0)
    p_top1.paragraph_format.space_before = Pt(0)
    p_top1.paragraph_format.space_after = Pt(2)
    p_top1.paragraph_format.line_spacing = 1.15
    r_top1 = p_top1.add_run(
        "Projeto Integrado – Relatório Técnico\n"
        "Workonnection – Plataforma para Divulgação de Vagas Temporárias com Feedback Obrigatório"
    )
    set_run_font(r_top1, size_pt=12, bold=True)

    p_aut = doc.add_paragraph()
    p_aut.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_aut.paragraph_format.first_line_indent = Cm(0)
    p_aut.paragraph_format.space_before = Pt(2)
    p_aut.paragraph_format.space_after = Pt(2)
    p_aut.paragraph_format.line_spacing = 1.15
    r_aut = p_aut.add_run(
        "Caroline de Carvalho Mendes, Gabriel da Silva Gutierres, Guilherme Gomes da Silva, "
        "Hugo Aparecido de Oliveira Costa, Paulo Roberto Santos Elias, Priscila de Carvalho Mendes"
    )
    set_run_font(r_aut, size_pt=12, bold=False)

    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.first_line_indent = Cm(0)
    p_inst.paragraph_format.space_before = Pt(0)
    p_inst.paragraph_format.space_after = Pt(14)
    p_inst.paragraph_format.line_spacing = 1.15
    r_inst = p_inst.add_run("Centro Paula Souza – Faculdade de Tecnologia Luigi Papaiz – Fatec Diadema")
    set_run_font(r_inst, size_pt=12, bold=False)

    # =========================================================================
    # RESUMO (Parágrafo único contínuo justificado, recuo 1 cm, igual ao Template)
    # =========================================================================
    add_body_paragraph(
        doc,
        [
            ("RESUMO. Contexto: ", True, False),
            (
                "o mercado brasileiro de trabalho temporário e prestação autônoma de serviços caracteriza-se pela elevada informalidade, "
                "pela baixa transparência nos processos seletivos e pela recorrente ausência de retorno aos candidatos (ghosting profissional), "
                "o que dificulta o aprimoramento técnico e fragiliza a confiança entre contratantes e trabalhadores. ",
                False,
                False,
            ),
            ("Objetivo: ", True, False),
            (
                "desenvolver e avaliar o Workonnection, plataforma web full stack voltada à divulgação de oportunidades temporárias que conecta "
                "empresas, microempresas (ME), microempreendedores individuais (MEI), autônomos e estudantes, instituindo o fornecimento obrigatório "
                "de feedback construtivo na conclusão ou recusa de candidaturas. ",
                False,
                False,
            ),
            ("Método: ", True, False),
            (
                "adotou-se a Engenharia de Software Empírica por meio de Estudo de Caso, com abordagem mista (qualitativa e quantitativa) e processo "
                "iterativo e incremental inspirado no Scrum ao longo de quatro ciclos de desenvolvimento. O produto foi avaliado em três dimensões, em "
                "consonância com a norma ISO/IEC 25010: (i) qualidade do software, analisando a arquitetura desacoplada MVC com Camada de Serviços "
                "(React 19, TypeScript, Java 17 com Spring Boot 3 e MongoDB Atlas), a especificação de 22 cenários de teste caixa-preta em BDD e a suíte "
                "automatizada em pipeline CI/CD; (ii) aceitação e usabilidade, mediante testes empíricos com usuários representativos e mensuração de tempos "
                "de execução; e (iii) impacto social, observando a transparência contratual e o alinhamento aos ODS 8 e 17 da ONU. ",
                False,
                False,
            ),
            ("Resultados: ", True, False),
            (
                "uma equipe de seis colaboradores entregou oito módulos operacionais cobrindo quatro perfis cadastrais, chat em tempo real via WebSockets, "
                "upload de documentos comprobatórios em nuvem, exclusão de conta em cascata e avaliação bidirecional com devolutiva obrigatória. "
                "A suíte de 57 testes automatizados atingiu 88,86% de cobertura de linhas auditada pelo JaCoCo em esteira GitHub Actions com containerização "
                "Docker, enquanto os testes de usabilidade registraram 100% de conclusão das tarefas, com o fluxo de candidatura e feedback concluído em até 3 minutos. ",
                False,
                False,
            ),
            ("Considerações finais: ", True, False),
            (
                "a separação arquitetural em camadas e a automação de qualidade favoreceram a manutenibilidade e o trabalho paralelo da equipe, projetando-se "
                "como trabalhos futuros a versão mobile nativa, mecanismos opcionais de anonimato em avaliações sensíveis e validação documental automatizada por OCR.",
                False,
                False,
            ),
        ],
        indent_cm=1.0,
        space_after=6,
    )

    add_body_paragraph(
        doc,
        [
            ("Palavras-chave: ", True, False),
            ("Trabalhadores autônomos. Feedback obrigatório. Plataforma digital. React. Spring Boot. BDD. ODS.", False, False),
        ],
        indent_cm=0.0,
        space_after=12,
    )

    # =========================================================================
    # 1 INTRODUÇÃO
    # =========================================================================
    add_heading(doc, "1 Introdução")

    add_body_paragraph(
        doc,
        "Os Objetivos de Desenvolvimento Sustentável (ODS), instituídos pela Assembleia Geral da Organização das Nações Unidas (ONU) em 2015 "
        "no escopo da Agenda 2030, constituem um plano de ação global composto por 17 objetivos e 169 metas voltados à erradicação da pobreza, "
        "à proteção ambiental e à promoção da paz e da prosperidade coletiva (ONU, 2015). Nesse cenário, os sistemas de informação desempenham "
        "papel estratégico como infraestrutura habilitadora, pois reduzem assimetrias informacionais, conectam agentes econômicos de diferentes "
        "portes e viabilizam processos auditáveis e eficientes em escala digital.",
    )

    add_body_paragraph(
        doc,
        "A plataforma Workonnection vincula-se diretamente a dois desses eixos globais. O primeiro corresponde ao ODS 8 (Trabalho Decente e "
        "Crescimento Econômico), que visa promover o crescimento econômico sustentado, o emprego produtivo e condições dignas de trabalho para todos. "
        "A solução contribui para essa meta ao estruturar a divulgação de vagas temporárias e prestação de serviços em um ambiente transparente, "
        "combatendo a precarização informal e instituindo a obrigatoriedade de feedback construtivo aos candidatos, o que transforma cada seleção "
        "em insumo concreto de desenvolvimento profissional. O segundo vínculo estabelece-se com o ODS 17 (Parcerias e Meios de Implementação), "
        "uma vez que o sistema opera como rede colaborativa multissetorial aproximando empresas, microempresas (ME), microempreendedores individuais (MEI), "
        "trabalhadores autônomos, estudantes e instituições de ensino.",
    )

    add_body_paragraph(
        doc,
        "A motivação central deste trabalho decorre de uma falha crônica observada nas plataformas contemporâneas de intermediação de mão de obra "
        "temporária. Embora a digitalização tenha acelerado a abertura de vagas e a captação de currículos (GUIMARÃES JUNIOR et al., 2022), a etapa "
        "de encerramento permanece majoritariamente silenciosa e unilateral. Em grande parte dos processos seletivos, o profissional não recebe qualquer "
        "justificativa sobre sua recusa — fenômeno denominado ghosting profissional —, o que compromete a autoestima, gera desgaste emocional e impede "
        "a identificação de lacunas técnicas ou comportamentais para futuras candidaturas (SILVA; RODRIGUES, 2025). Torna-se relevante, portanto, "
        "projetar mecanismos arquiteturais que incorporem a devolutiva estruturada como regra de negócio indissociável do fluxo de seleção.",
    )

    add_body_paragraph(
        doc,
        "Considerando-se esse contexto, este trabalho tem por objetivo geral desenvolver e avaliar o Workonnection, plataforma web full stack para "
        "divulgação e gestão de vagas temporárias com feedback obrigatório. Constituem objetivos específicos: (a) projetar uma arquitetura em camadas "
        "desacoplada segundo o padrão MVC aliado à Camada de Serviços; (b) implementar os módulos de gestão de contas multi-perfil (incluindo exclusão "
        "em cascata e separação visual de perfil público), importação de documentos comprobatórios, vagas, busca contextual, candidaturas, chat em "
        "tempo real, notificações e feedback bidirecional obrigatório; (c) verificar a adequação funcional do software mediante cenários de teste "
        "caixa-preta em BDD e testes automatizados integrados em pipeline CI/CD; e (d) avaliar a usabilidade e a aceitação da solução com usuários reais.",
    )

    # =========================================================================
    # 2 MATERIAIS E MÉTODOS
    # =========================================================================
    add_heading(doc, "2 Materiais e Métodos")

    add_body_paragraph(
        doc,
        "Estratégias empíricas na Engenharia de Software consistem em metodologias científicas baseadas em observação sistemática, medição e "
        "experimentação para conferir rigor e validade analítica à avaliação de processos, técnicas e produtos de software, consolidando o campo "
        "denominado Engenharia de Software Empírica (ESE) (GUEVARA-VEGA et al., 2021). De acordo com o mapeamento conduzido por Guevara-Vega et al. (2021), "
        "o estudo de caso figura entre as estratégias investigativas mais recorrentes na área para analisar sistemas em operação.",
    )

    add_body_paragraph(
        doc,
        "Neste trabalho, adotou-se o Estudo de Caso como delineamento metodológico, definido por Yin (2014) e discutido por Hollweck (2015) como "
        "uma investigação empírica que examina um fenômeno contemporâneo em profundidade dentro de seu contexto real, apoiando-se na triangulação "
        "de múltiplas fontes de evidência. O caso investigado compreende o ciclo completo de concepção, construção, verificação automatizada e "
        "validação do Workonnection. A abordagem qualitativa orientou a elicitação de histórias de usuário, a modelagem de fluxos de contratação e "
        "a interpretação das percepções de uso; já a abordagem quantitativa fundamentou a aferição de cobertura de código, taxas de êxito em cenários "
        "funcionais e tempos de conclusão de tarefas.",
    )

    add_body_paragraph(
        doc,
        "Em alinhamento ao modelo de qualidade de produto da norma ISO/IEC 25010 (ISO/IEC, 2011), a avaliação abrangeu três dimensões complementares: "
        "(i) qualidade interna e adequação funcional do software, verificadas pela arquitetura em camadas, práticas de código limpo, roteiros caixa-preta "
        "em BDD e cobertura de testes automatizados; (ii) aceitação e usabilidade (Interação Humano-Computador), aferidas por testes com usuários e "
        "questionário estruturado; e (iii) impacto social, analisado sob a ótica da transparência seletiva e da obrigatoriedade de retorno ao trabalhador.",
    )

    # 2.1 Processo de Desenvolvimento
    add_heading(doc, "2.1 Processo de desenvolvimento de software")

    add_body_paragraph(
        doc,
        "O desenvolvimento seguiu um modelo iterativo e incremental fundamentado nos princípios do Manifesto Ágil (BECK et al., 2001) e adaptado do "
        "framework Scrum (SOMMERVILLE, 2019), organizado em quatro ciclos evolutivos (sprints) executados entre agosto e novembro de 2026 por uma equipe "
        "acadêmica de seis colaboradores. Diante da necessidade de conciliar o projeto interdisciplinar com as demais disciplinas curriculares, "
        "adaptaram-se as cerimônias canônicas para reuniões semanais integradas de planejamento, inspeção de incremento e retrospectiva.",
    )

    add_body_paragraph(
        doc,
        "Quatro artefatos estruturaram a governança do projeto: (1) o Product Backlog, contendo 15 histórias de usuário priorizadas pelo valor entregue "
        "ao candidato e ao contratante; (2) o Plano de Release, que distribuiu as entregas desde a migração da interface para React e configuração da "
        "API Spring Boot até os módulos de chat em tempo real, documentos, candidaturas, feedback obrigatório e esteira DevSecOps; (3) o quadro Kanban "
        "no Trello para gestão visual das tarefas; e (4) o controle de versão colaborativo no GitHub, no qual cada iteração foi desenvolvida em branches "
        "isoladas nomeadas de acordo com a funcionalidade proposta (feature branches) e, após sua conclusão e validação, integrada por meio de Pull "
        "Request à branch consolidada da aplicação (reactVersion), mantendo-se a sincronização final com a branch principal (main).",
    )

    # 2.2 Levantamento de Requisitos
    add_heading(doc, "2.2 Levantamento de requisitos")

    add_body_paragraph(
        doc,
        "Os requisitos foram levantados a partir da análise crítica de plataformas convencionais de recrutamento e da modelagem de processos em BPMN, "
        "sendo catalogados com identificadores rastreáveis até as camadas de serviço e cenários de teste. No escopo funcional, estabeleceram-se o "
        "cadastro multi-perfil (Estudante, MEI, Microempresa e Empresa), a autenticação tradicional e social, a importação de documentos comprobatórios "
        "por categoria, o gerenciamento e filtragem de vagas, o chat instantâneo, o fluxo de candidaturas e a exigência de feedback estruturado na "
        "recusa ou contratação. No escopo não funcional, consideraram-se os atributos da ISO/IEC 25010 de segurança e privacidade — adotando práticas "
        "iniciais inspiradas na LGPD, como a exclusão definitiva da conta em cascata a pedido do titular e a apresentação resumida no modal de perfil "
        "público —, além de manutenibilidade e portabilidade via containers.",
    )

    # 2.3 Projeto da Arquitetura
    add_heading(doc, "2.3 Projeto da arquitetura")

    add_body_paragraph(
        doc,
        "A arquitetura de software adota o padrão Model-View-Controller (MVC), originalmente formulado por Krasner e Pope (1988) para desacoplar a "
        "representação dos dados (Model), a interface visual (View) e a coordenação das interações (Controller). Conforme destacam Pressman e Maxim (2021), "
        "esse isolamento permite que alterações na camada de apresentação não impactem as regras de domínio e vice-versa, elevando a modularidade do sistema.",
    )

    add_body_paragraph(
        doc,
        "Em arquiteturas web distribuídas, entretanto, a alocação direta de validações corporativas nos controladores origina o antipadrão conhecido "
        "como Controladores Gordos (Fat Controllers), que mistura roteamento HTTP, regras de negócio e acesso a dados, dificultando testes unitários "
        "isolados. Para mitigar esse risco, o Workonnection incorporou uma Camada de Serviços (Service Layer) dedicada a centralizar toda a lógica "
        "transacional, regras de permissão por perfil, disparo de notificações e validação do feedback obrigatório. Com isso, mantiveram-se Controladores "
        "Finos (Thin Controllers), restritos a recepcionar requisições REST, converter objetos de transferência (DTOs) e devolver respostas HTTP padronizadas.",
    )

    add_body_paragraph(
        doc,
        "Na implementação física, a camada View consiste em uma Single Page Application (SPA) construída com React 19, TypeScript e Vite, hospedada na "
        "Vercel, que consome a API REST por meio do cliente HTTP Axios e recebe eventos assíncronos via Pusher JS. O backend, desenvolvido em Java 17 com "
        "Spring Boot 3.5 e protegido por Spring Security, executa containerizado na nuvem Render. Os controladores (UsuarioController, VagaController, "
        "CandidaturaController, FeedbackController, ChatController, NotificacaoController e GoogleAuthController) delegam o processamento aos respectivos "
        "serviços, que persistem documentos no MongoDB Atlas através das interfaces Spring Data Repository. A Figura 1 sintetiza o fluxo arquitetural.",
    )

    add_caption_top(doc, "Figura 1 – Representação em blocos da arquitetura em camadas do Workonnection")
    add_boxed_block(
        doc,
        [
            ("[Usuário / Navegador Web]", True, False),
            ("⇅", False, False),
            ("[View (SPA): React 19 + TypeScript + Vite (Vercel)]", True, False),
            ("⇅  Requisições HTTPS / JSON (Axios)  &  Eventos WebSocket (Pusher Channels)", False, False),
            ("[Thin Controllers: API REST Spring Boot 3.5 / Java 17 (Container Docker na Render)]", True, False),
            ("⇅  Transferência Estruturada via DTOs (Isolamento das Entidades de Domínio)", False, False),
            ("[Service Layer: Regras de Negócio, Perfis, Upload, Chat e Feedback Obrigatório]", True, False),
            ("⇅  Contratos de Persistência Orientados a Interfaces", False, False),
            ("[Repository Layer: Interfaces Spring Data MongoDB & MongoTemplate]", True, False),
            ("⇅  Conexão Segura TLS + Armazenamento de Mídia Externa", False, False),
            ("[Persistência em Nuvem: MongoDB Atlas (NoSQL)  |  Cloudinary (Documentos/Fotos)]", True, False),
        ],
        align=WD_ALIGN_PARAGRAPH.CENTER,
        font_name=FONT_FAMILY,
        font_size=10.5,
    )
    add_source_bottom(doc)

    # 2.4 Design Orientado a Interface
    add_heading(doc, "2.4 Design orientado a interface")

    add_body_paragraph(
        doc,
        "O Design Orientado a Interfaces (Interface-Oriented Design – IOD) fundamenta-se na definição de sistemas como conjuntos de contratos bem "
        "delimitados que especificam 'o quê' um módulo realiza, ocultando 'como' sua implementação interna opera. Sommerville (2019) ressalta que a "
        "especificação rigorosa de interfaces e assinaturas públicas constitui requisito essencial para o desenvolvimento paralelo de componentes por "
        "equipes distribuídas e para a criação de dublês de teste (mocks).",
    )

    add_body_paragraph(
        doc,
        "No Workonnection, esse princípio foi aplicado em duas frentes complementares, observando a segregação de responsabilidades (Interface "
        "Segregation Principle): (1) na camada de acesso a dados, por meio das interfaces segregadas UsuarioRepository, VagaRepository, "
        "CandidaturaRepository, FeedbackRepository e MensagemRepository, que estendem MongoRepository sem expor detalhes do driver NoSQL à camada de "
        "negócio; e (2) na definição estrita dos contratos públicos de serviço e DTOs consumidos pelos controladores REST e espelhados pelas interfaces "
        "TypeScript do frontend. O Quadro 1 apresenta o contrato consolidado das operações centrais de vagas, candidaturas, feedback e documentos, "
        "refletindo fielmente as assinaturas e DTOs implementados no backend.",
    )

    add_caption_top(doc, "Quadro 1 – Contratos de operações e persistência mapeados aos requisitos do sistema (Java)")
    add_boxed_block(
        doc,
        [
            ("// Contrato de Operações de Vagas (VagaService / VagaRepository)", False, True),
            ("public interface VagaOperationsContract {", True, False),
            ("    // Req01 - Publicar vaga temporária (bloqueado para perfil Estudante)", False, True),
            ("    VagaResponseDTO salvar(VagaDTO dto, String usuarioId);", False, False),
            ("    // Req02 - Filtrar vagas por palavra-chave, perfil compatível e modalidade", False, True),
            ("    List<VagaResponseDTO> filtrar(String busca, String tipo,", False, False),
            ("                                  String modalidade, String usuarioId);", False, False),
            ("}", True, False),
            ("", False, False),
            ("// Contrato de Candidaturas e Recusa Construtivo-Obrigatória (CandidaturaService)", False, True),
            ("public interface CandidaturaOperationsContract {", True, False),
            ("    // Req03 - Registrar candidatura validando compatibilidade de público-alvo", False, True),
            ("    CandidaturaResponseDTO candidatar(String vagaId, String candidatoId,", False, False),
            ("                                      CandidaturaCreateDTO dto);", False, False),
            ("    // Req04 - Recusar candidato exigindo motivo principal e dicas construtivas", False, True),
            ("    CandidaturaResponseDTO recusarComFeedback(String id, String contratanteId,", False, False),
            ("                                              FeedbackRecusaDTO dto);", False, False),
            ("}", True, False),
            ("", False, False),
            ("// Contrato de Avaliação Bidirecional e Fechamento de Vaga (FeedbackService)", False, True),
            ("public interface FeedbackOperationsContract {", True, False),
            ("    // Req05 - Enviar feedback (contratante ou candidato) e encerrar vaga na contratação", False, True),
            ("    FeedbackResponseDTO enviarFeedback(String candidaturaId, String usuarioId,", False, False),
            ("                                       FeedbackCreateDTO dto);", False, False),
            ("    // Req06 - Consultar histórico público de feedbacks recebidos no perfil", False, True),
            ("    List<FeedbackResponseDTO> listarFeedbacksDoPerfil(String usuarioId, int limite);", False, False),
            ("}", True, False),
        ],
        align=WD_ALIGN_PARAGRAPH.LEFT,
        font_name="Courier New",
        font_size=9.5,
    )
    add_source_bottom(doc)

    add_body_paragraph(
        doc,
        "Observa-se que a obrigatoriedade do feedback foi blindada diretamente na camada de serviço em dois pontos críticos: no método atualizarStatus "
        "de CandidaturaService, o sistema bloqueia qualquer tentativa de transição direta para o status RECUSADO (lançando erro HTTP 400) e exige o "
        "acionamento de recusarComFeedback, que valida o preenchimento do motivo principal (HTTP 422 caso ausente) mantendo a vaga aberta para novos "
        "inscritos; já na contratação efetiva (ACEITO), o método enviarFeedback de FeedbackService registra a avaliação formal, altera a candidatura "
        "para CONCLUIDO e encerra automaticamente a vaga ativa.",
    )

    # 2.5 Integração com APIs Externas
    add_heading(doc, "2.5 Integração com APIs e serviços externos")

    add_body_paragraph(
        doc,
        "Para prover recursos de tempo real, autenticação federada e armazenamento seguro de mídias sem sobrecarregar o container de aplicação, "
        "o sistema integra quatro serviços externos por meio de SDKs oficiais: (a) Google Identity Services / OAuth 2.0, validando tokens criptográficos "
        "no backend (GoogleOAuthService) para login social ágil; (b) Pusher Channels (WebSockets), disparando eventos instantâneos de novas mensagens, "
        "edição, exclusão e confirmação de leitura no chat interno; (c) Cloudinary API, realizando o upload em nuvem de fotos de perfil e documentos "
        "comprobatórios (PDF, PNG, JPG e JPEG de até 10 MB) em FileStorageService, com fallback automático para armazenamento local; e (d) JavaMail (SMTP), "
        "destinado ao envio de códigos temporários de verificação cadastral.",
    )

    # 2.6 Persistência e Deploy
    add_heading(doc, "2.6 Persistência, containerização e deploy em nuvem")

    add_body_paragraph(
        doc,
        "A persistência utiliza o banco de dados NoSQL orientado a documentos MongoDB Atlas em nuvem, organizado nas coleções usuarios, vagas, "
        "candidaturas, feedbacks e mensagens. A flexibilidade do modelo documental mostrou-se decisiva para acomodar subperfis polimórficos (PerfilEstudante, "
        "PerfilMei, PerfilMe e PerfilEmpresa) dentro da entidade Usuario, bem como índices de expiração automática (TTL) para a data limite das vagas.",
    )

    add_body_paragraph(
        doc,
        "Visando eliminar divergências de ambiente e assegurar portabilidade em nuvem, toda a solução foi containerizada com Docker utilizando "
        "Multi-Stage Builds. No backend, o primeiro estágio compila o artefato com Maven e JDK 17 aproveitando cache de dependências, enquanto o estágio "
        "final executa sobre imagem enxuta Eclipse Temurin JRE 17 sob usuário sem privilégios administrativos (non-root) e limite de memória JVM "
        "parametrizado (-XX:MaxRAMPercentage=75.0) para evitar encerramentos abruptos no plano de 512 MB da plataforma Render. No frontend, o pacote "
        "estático é servido em container Nginx Alpine com compressão Gzip, além de contar com publicação contínua na rede global (CDN) da Vercel. "
        "Localmente, o arquivo docker-compose.yml orquestra banco MongoDB 7 (com healthcheck), backend e frontend em um único comando. A comunicação "
        "em produção ocorre sob HTTPS com política de CORS restrita às origens homologadas e cookies de sessão configurados para tráfego cross-site.",
    )

    # 2.7 Debug, Testes e Validação
    add_heading(doc, "2.7 Debug, testes e validação")

    add_body_paragraph(
        doc,
        "A estratégia de verificação e validação do Workonnection foi estruturada em três níveis complementares para atender às características de "
        "adequação funcional, confiabilidade, segurança e usabilidade preconizadas pela norma ISO/IEC 25010 (ISO/IEC, 2011). No cotidiano de "
        "implementação, o debug contínuo apoiou-se na inspeção de tráfego HTTP e WebSockets pelas ferramentas de desenvolvedor do navegador e na "
        "análise de logs de exceções tratadas globalmente no Spring Boot (GlobalExceptionHandler).",
    )

    add_body_paragraph(
        doc,
        "No primeiro nível formal de verificação, aplicou-se a técnica de testes funcionais caixa-preta (PRESSMAN; MAXIM, 2021) combinada à especificação "
        "Behavior-Driven Development (BDD) em linguagem natural Gherkin ('Dado que... Quando... Então...') (SMART, 2015). Foram documentados 22 cenários "
        "de uso abrangendo cinco funcionalidades estruturantes da plataforma, conforme sintetizado no Quadro 2, complementados por uma especificação "
        "de requisito não funcional voltada a nortear a separação entre informações profissionais públicas e dados cadastrais privados.",
    )

    add_caption_top(doc, "Quadro 2 – Síntese dos cenários de teste caixa-preta especificados com a técnica BDD")
    add_styled_table(
        doc,
        ["Módulo / Funcionalidade", "Cenários BDD", "Escopo de Validação (Caminho Feliz e Exceções)"],
        [
            (
                "1. Cadastro de Usuário",
                "4 cenários",
                "Cadastro válido multi-perfil e rejeição de entradas inválidas para CPF (tamanho, vazio, dígitos repetidos e duplicidade), Nome (< 3 caracteres/branco) e Idade (< 16 ou > 100 anos).",
            ),
            (
                "2. Importação de Documentos",
                "3 cenários",
                "Upload de comprovante por categoria (ex.: matrícula, CCMEI), substituição mantendo versão única e bloqueio de extensões inválidas (.docx, .exe), arquivos vazios ou acima de 10 MB.",
            ),
            (
                "3. Gerenciamento de Vagas",
                "5 cenários",
                "Publicação completa, validação de campos obrigatórios, bloqueio de data limite no passado e intervalo de horário inválido, edição/exclusão autoral, bloqueio de edição por terceiros e busca/filtros.",
            ),
            (
                "4. Chat e Mensagens",
                "5 cenários",
                "Envio instantâneo via Pusher, bloqueio de mensagens vazias ou acima de 2.000 caracteres, edição restrita ao autor com selo '(editada)', exclusão unilateral ('Excluir para mim') e recibo de leitura.",
            ),
            (
                "5. Central de Notificações",
                "5 cenários",
                "Listagem ordenada até o teto de 50 eventos, marcação individual e em lote ('Marcar todas como lidas') com atualização de badge, exclusão unitária e limpeza integral da caixa.",
            ),
        ],
        [4.5, 2.5, 10.0],
    )
    add_source_bottom(doc)

    add_body_paragraph(
        doc,
        "No segundo nível, implementou-se uma suíte de testes automatizados unitários e de integração de controladores no backend utilizando JUnit 5, "
        "Mockito e Spring MockMvc, integrada a uma pipeline de Integração Contínua (CI) no GitHub Actions (workonnection.yaml). A cada push ou abertura "
        "de Pull Request das branches de funcionalidade para a branch integradora reactVersion (ou para a main), três trabalhos paralelos executam "
        "varredura de segredos expostos com Gitleaks (DevSecOps), lint e compilação estrita do frontend em Node.js 20 e execução do ciclo Maven verify "
        "sobre um container efêmero oficial do MongoDB 7, exigindo aprovação automática de cobertura mínima de 70% no plugin JaCoCo antes de liberar o "
        "estágio final de validação de build das imagens Docker.",
    )

    add_body_paragraph(
        doc,
        "No terceiro nível, conduziram-se testes empíricos de usabilidade com os usuários representativos Vitor (perfil Estudante/Candidato) e Bernardo "
        "(perfil Empresa/Contratante). Os participantes percorreram sem auxílio prévio os fluxos operacionais da plataforma — criação de conta e perfil, "
        "publicação de oportunidade, filtragem, negociação via chat, submissão de candidatura, simulação de contratação/recusa e preenchimento/recebimento "
        "do feedback obrigatório — registrando-se a taxa de conclusão, o tempo gasto e as percepções em questionário pós-teste estruturado (Quadro 3).",
    )

    add_caption_top(doc, "Quadro 3 – Questionário pós-teste de avaliação de usabilidade e percepção de valor")
    add_boxed_block(
        doc,
        [
            ("1) Como você avalia a facilidade de navegação na plataforma?", True, False),
            ("   (a) Fácil: encontrei tudo o que precisava sem dificuldades.", False, False),
            ("   (b) Razoável: encontrei, mas com alguma dificuldade.", False, False),
            ("   (c) Difícil: tive dificuldades para encontrar as funcionalidades.", False, False),
            ("2) Como você avalia a clareza do fluxo para concluir as tarefas solicitadas?", True, False),
            ("   (a) Claro: sempre soube qual era o próximo passo.", False, False),
            ("   (b) Parcialmente claro: tive dúvidas em alguns momentos.", False, False),
            ("   (c) Confuso: precisei de ajuda para prosseguir.", False, False),
            ("3) Qual é a sua percepção sobre o valor do feedback obrigatório ao final do processo seletivo?", True, False),
            ("   (a) Muito valioso: ajuda o candidato a melhorar e traz transparência.", False, False),
            ("   (b) Moderadamente valioso: é útil, mas depende da qualidade da devolutiva.", False, False),
            ("   (c) Pouco valioso: não faria diferença para mim.", False, False),
            ("4) Como você avalia o tempo necessário para concluir as tarefas na plataforma?", True, False),
            ("   (a) Rápido: concluí as tarefas em menos tempo do que esperava.", False, False),
            ("   (b) Adequado: o tempo foi compatível com o que esperava.", False, False),
            ("   (c) Demorado: levei mais tempo do que esperava.", False, False),
        ],
        align=WD_ALIGN_PARAGRAPH.LEFT,
        font_name=FONT_FAMILY,
        font_size=10.5,
    )
    add_source_bottom(doc)

    # =========================================================================
    # 3 RESULTADOS
    # =========================================================================
    add_heading(doc, "3 Resultados")

    add_heading(doc, "3.1 Métricas de gerenciamento e engenharia de qualidade", space_before=6)

    add_body_paragraph(
        doc,
        "O gerenciamento ágil adaptado mobilizou seis colaboradores ao longo de quatro ciclos iterativos (três meses de duração), concluindo 100% das "
        "15 histórias previstas no Plano de Release. Na dimensão de qualidade de código e confiabilidade, a expansão da suíte automatizada em 11 classes "
        "de teste elevou a cobertura de linhas do backend de um patamar inicial de 34,54% (35 testes) para 88,86% (57 testes executados, cobrindo 1.994 "
        "de 2.244 linhas auditadas pelo JaCoCo), alcançando 100% nos controladores REST e índices superiores a 94% nos serviços centrais de chat, "
        "usuários, vagas e candidaturas.",
    )

    add_heading(doc, "3.2 Recursos entregues no produto", space_before=8)

    add_body_paragraph(
        doc,
        "Foram implementados e integrados oito módulos principais na versão atual da plataforma: "
        "(1) Gestão de Contas, Multi-Perfis e Práticas Iniciais de Privacidade (CRUD completo com subperfis específicos para Estudante, MEI, Microempresa "
        "e Empresa, visualização resumida no modal de perfil público, uso de DTO público nas conversas e exclusão definitiva de conta em cascata — alinhada "
        "ao princípio de eliminação de dados da LGPD — removendo vagas, candidaturas, interações, feedbacks e mensagens); "
        "(2) Importação de Documentos Comprobatórios (envio, visualização e substituição de comprovantes em nuvem via Cloudinary); "
        "(3) Gerenciamento e Engajamento em Vagas Temporárias (CRUD autoral acrescido de curtidas, descurtidas e comentários em vagas); "
        "(4) Busca e Filtragem Contextual de Oportunidades (pesquisa dinâmica por palavra-chave combinada a filtros de modalidade — Presencial, Remoto "
        "ou Híbrido — e segmentação automática conforme o perfil autenticado); "
        "(5) Módulo de Candidaturas e Triagem (inscrição com mensagem de apresentação e evolução de status para EM_CHAT e ALINHAMENTO_FINAL); "
        "(6) Sistema de Feedback Obrigatório e Avaliação Bidirecional (devolutiva mandatória do contratante na recusa ou contratação e avaliação "
        "recíproca do processo/empresa pelo candidato); "
        "(7) Chat Interno em Tempo Real (mensageria instantânea via Pusher com histórico persistido, edição, exclusão unilateral e status de leitura); e "
        "(8) Central de Notificações e Autenticação Híbrida (acesso tradicional e via Google OAuth 2.0, com alertas de eventos e preferência de tema).",
    )

    add_heading(doc, "3.3 Perfis de acesso e permissões", space_before=8)

    add_body_paragraph(
        doc,
        "O controle de autorização distingue as permissões operacionais conforme a natureza jurídica e profissional da conta cadastrada. Enquanto "
        "estudantes possuem atuação exclusiva como candidatos, prestadores formalizados (MEI) e empresas podem atuar conforme o público-alvo da "
        "oportunidade, respeitando-se o bloqueio de autocandidatura à própria vaga. O Quadro 4 sintetiza a matriz de permissões vigente no sistema.",
    )

    add_caption_top(doc, "Quadro 4 – Matriz de perfis de acesso e permissões operacionais implementadas")
    add_styled_table(
        doc,
        ["Funcionalidade do Sistema", "Estudante / Aluno", "Autônomo / MEI", "Microempresa (ME) / Empresa"],
        [
            ("Gerenciar própria conta, foto, documentos e exclusão em cascata", "Permitido", "Permitido", "Permitido"),
            ("Pesquisar, filtrar, curtir e comentar vagas compatíveis", "Permitido (vagas p/ Estudante ou Todos)", "Permitido (vagas p/ Prestador ou Todos)", "Permitido"),
            ("Publicar, editar e excluir as próprias vagas", "Não permitido (bloqueio HTTP 403)", "Permitido (apenas próprias vagas)", "Permitido (apenas próprias vagas)"),
            ("Registrar candidatura e acompanhar status", "Permitido (vagas compatíveis)", "Permitido (exceto na própria vaga)", "Permitido apenas em vagas de terceiros p/ Prestador"),
            ("Gerenciar candidatos e alterar status da seleção", "Não permitido", "Permitido nas vagas que publicou", "Permitido nas vagas que publicou"),
            ("Recusar candidato na seleção", "Não permitido", "Permitido somente com feedback obrigatório", "Permitido somente com feedback obrigatório"),
            ("Enviar feedback pós-contratação / processo", "Permitido (avalia processo e empresa)", "Bidirecional (conforme papel na vaga)", "Obrigatório p/ concluir vaga; recebe avaliação"),
            ("Consultar feedbacks recebidos e perfil público", "Permitido (visualização de perfil e avaliações)", "Permitido (visualização de perfil e avaliações)", "Permitido (visualização de perfil e avaliações)"),
        ],
        [5.3, 3.8, 3.9, 4.0],
    )
    add_source_bottom(doc)

    add_heading(doc, "3.4 Resultados dos testes de usabilidade e impacto", space_before=8)

    add_body_paragraph(
        doc,
        "As avaliações empíricas conduzidas com os usuários Vitor e Bernardo demonstraram taxa de 100% de êxito na execução autônoma das tarefas "
        "propostas. Na primeira bateria exploratória da versão beta (focada em cadastro, publicação de vaga e negociação pelo chat), registraram-se "
        "tempos totais de 15 minutos para o estudante (incluindo o aguardo da postagem da oportunidade) e 7 minutos para a empresa, com notas de "
        "facilidade de 3/5 e 4/5, respectivamente. Os apontamentos coletados nessa rodada — como o desconforto com o login restrito à conta Google, "
        "a demanda por alertas de erro destacados em vermelho e a preferência pelo tema escuro — motivaram refatorações imediatas incorporadas às "
        "entregas seguintes.",
    )

    add_body_paragraph(
        doc,
        "No prosseguimento contínuo das avaliações com os mesmos participantes (Vitor e Bernardo), contemplando os fluxos completos de candidatura "
        "formal, simulação de contratação/recusa e concessão de feedback obrigatório, constatou-se que as interfaces são diretas e objetivas, com "
        "tempo de execução inferior a 3 minutos. Os usuários identificaram rapidamente os ícones de ação e confirmaram o recebimento imediato da "
        "notificação e da devolutiva estruturada logo após a decisão seletiva. As respostas ao questionário pós-teste ratificaram elevada aprovação "
        "do fluxo navegacional e destacaram o feedback obrigatório como diferencial concreto contra a opacidade dos processos seletivos temporários. "
        "Também foram mapeadas melhorias incrementais para o backlog, como a oferta de modelos pré-estruturados de texto para agilizar a redação "
        "de devolutivas pelos contratantes.",
    )

    # =========================================================================
    # 4 CONSIDERAÇÕES FINAIS
    # =========================================================================
    add_heading(doc, "4 Considerações finais")

    add_body_paragraph(
        doc,
        "Este trabalho apresentou o desenvolvimento, a verificação automatizada e a validação empírica do Workonnection, confirmando o alcance integral "
        "dos objetivos propostos. Ao condicionar a recusa seletiva e a conclusão contratual ao registro de pareceres construtivos, além de habilitar "
        "a avaliação recíproca da empresa pelo candidato, a plataforma materializa uma contribuição prática às metas dos ODS 8 e 17 da ONU, promovendo "
        "relações de trabalho temporário mais transparentes, instrutivas e articuladas entre estudantes, autônomos e organizações.",
    )

    add_body_paragraph(
        doc,
        "Sob a perspectiva de Engenharia de Software, a arquitetura MVC combinada à Camada de Serviços, ao fluxo colaborativo em branches por "
        "funcionalidade integradas via Pull Request para a branch reactVersion, à especificação comportamental em BDD e à pipeline DevSecOps com "
        "88,86% de cobertura auditada pelo JaCoCo e containers Docker mostrou-se altamente eficaz para sustentar a evolução paralela do código "
        "pelos seis integrantes sem regressões funcionais.",
    )

    add_body_paragraph(
        doc,
        "Entre as principais dificuldades técnicas enfrentadas e superadas ao longo do projeto, destacam-se: (i) a configuração de autenticação e "
        "cookies de sessão HTTP cross-site aliada às políticas de CORS entre domínios distintos (Vercel e Render); (ii) o ajuste de limites de memória "
        "da JVM e de sondas de prontidão (healthchecks) do container MongoDB 7 na esteira do GitHub Actions e no ambiente restrito de 512 MB em nuvem; "
        "e (iii) a modelagem da exclusão em cascata e da relação entre vagas, candidaturas e feedbacks no banco orientado a documentos.",
    )

    add_body_paragraph(
        doc,
        "Como trabalhos futuros, propõem-se: (i) o desenvolvimento de aplicativo móvel nativo para ampliar o alcance de notificações instantâneas a "
        "trabalhadores em campo; (ii) a evolução das práticas de segurança, privacidade e adequação integral à LGPD, incluindo a padronização de DTOs "
        "públicos restritos em todas as rotas abertas de consulta, a inclusão de termos formais de consentimento no cadastro, a opção de anonimato em "
        "avaliações negativas atribuídas por candidatos às empresas e a consolidação da persistência de hash BCrypt no fluxo de credenciais próprias; "
        "(iii) a incorporação de leitura óptica de caracteres (OCR) para validação cadastral automática dos documentos comprobatórios enviados ao "
        "Cloudinary; e (iv) a extração de interfaces Java formais na camada de serviços acompanhada de testes automatizados ponta a ponta (E2E) na "
        "interface React e de estudos longitudinais sobre o impacto do feedback na empregabilidade dos usuários.",
    )

    # =========================================================================
    # REFERÊNCIAS BIBLIOGRÁFICAS (100% completas, sem placeholders, justificadas)
    # =========================================================================
    add_heading(doc, "Referências bibliográficas")

    referencias = [
        [
            ("BECK, K. et al. ", False, False),
            ("Manifesto for Agile Software Development", True, False),
            (". Agile Alliance, 2001. Disponível em: https://agilemanifesto.org/. Acesso em: 4 nov. 2026.", False, False),
        ],
        [
            ("GUEVARA-VEGA, C. et al. Empirical strategies in software engineering research: a literature survey. In: SECOND INTERNATIONAL CONFERENCE ON INFORMATION SYSTEMS AND SOFTWARE TECHNOLOGIES (ICI2ST), 2021, Quito. ", False, False),
            ("Proceedings", True, False),
            (" [...]. Los Alamitos: IEEE Computer Society, 2021. p. 120-127.", False, False),
        ],
        [
            ("GUIMARÃES JUNIOR, J. C.; MARINHO, P. R. R.; NASCIMENTO, T. G.; ALENCAR, K. R. A. Trabalho temporário como alternativa na prestação de serviços. ", False, False),
            ("Research, Society and Development", True, False),
            (", v. 11, n. 3, p. 1-12, 2022. DOI: https://doi.org/10.33448/rsd-v11i3.26361.", False, False),
        ],
        [
            ("HOLLWECK, T. Robert K. Yin (2014). Case study research design and methods (5th ed.). ", False, False),
            ("The Canadian Journal of Program Evaluation", True, False),
            (", v. 30, n. 1, p. 108-110, 2015.", False, False),
        ],
        [
            ("INTERNATIONAL ORGANIZATION FOR STANDARDIZATION; INTERNATIONAL ELECTROTECHNICAL COMMISSION. ", False, False),
            ("ISO/IEC 25010:2011", True, False),
            (": Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models. Geneva: ISO/IEC, 2011.", False, False),
        ],
        [
            ("KRASNER, G. E.; POPE, S. T. A description of the model-view-controller user interface paradigm in the Smalltalk-80 system. ", False, False),
            ("Journal of Object Oriented Programming", True, False),
            (", v. 1, n. 3, p. 26-49, 1988.", False, False),
        ],
        [
            ("ONU. Organização das Nações Unidas. ", False, False),
            ("Transformando Nosso Mundo: A Agenda 2030 para o Desenvolvimento Sustentável", True, False),
            (". Nova York: ONU, 2015. Disponível em: https://brasil.un.org/pt-br/91863-agenda-2030-para-o-desenvolvimento-sustentavel. Acesso em: 4 nov. 2026.", False, False),
        ],
        [
            ("PRESSMAN, R. S.; MAXIM, B. R. ", False, False),
            ("Engenharia de software: uma abordagem profissional", True, False),
            (". 9. ed. Porto Alegre: AMGH / McGraw-Hill Brasil, 2021.", False, False),
        ],
        [
            ("SILVA, A. G.; RODRIGUES, L. S. Os efeitos da falta de feedback em processos seletivos na autoestima, motivação e carreira dos candidatos. ", False, False),
            ("Interface Tecnológica", True, False),
            (", v. 22, n. 1, p. 1-15, 2025. DOI: https://doi.org/10.31510/infa.v22i1.2185.", False, False),
        ],
        [
            ("SMART, J. F. ", False, False),
            ("BDD in Action: Behavior-driven development for the whole software lifecycle", True, False),
            (". Shelter Island, NY: Manning Publications, 2015.", False, False),
        ],
        [
            ("SOMMERVILLE, I. ", False, False),
            ("Engenharia de software", True, False),
            (". 10. ed. São Paulo: Pearson Education do Brasil, 2019.", False, False),
        ],
        [
            ("YIN, R. K. ", False, False),
            ("Estudo de caso: planejamento e métodos", True, False),
            (". 5. ed. Porto Alegre: Bookman, 2014.", False, False),
        ],
    ]

    for ref in referencias:
        add_body_paragraph(doc, ref, indent_cm=0.0, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=5)

    doc.save(output_path)
    print(f"Relatório gerado com sucesso em: {output_path}")


if __name__ == "__main__":
    out_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Workonnection_Relatorio_Tecnico_Corrigido.docx")
    build_relatorio(out_file)
