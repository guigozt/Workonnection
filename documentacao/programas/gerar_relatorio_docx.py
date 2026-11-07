import docx
from docx.shared import Cm, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls
import os

def set_cell_background(cell, hex_color):
    """Aplica cor de fundo a uma célula de tabela."""
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_border(cell, **kwargs):
    """Aplica bordas finas personalizadas a uma célula."""
    tcPr = cell._element.get_or_add_tcPr()
    tcBorders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="{kwargs.get("top", "single")}" w:sz="{kwargs.get("top_sz", "4")}" w:space="0" w:color="{kwargs.get("top_color", "CCCCCC")}"/>'
        f'<w:left w:val="{kwargs.get("left", "single")}" w:sz="{kwargs.get("left_sz", "4")}" w:space="0" w:color="{kwargs.get("left_color", "CCCCCC")}"/>'
        f'<w:bottom w:val="{kwargs.get("bottom", "single")}" w:sz="{kwargs.get("bottom_sz", "4")}" w:space="0" w:color="{kwargs.get("bottom_color", "CCCCCC")}"/>'
        f'<w:right w:val="{kwargs.get("right", "single")}" w:sz="{kwargs.get("right_sz", "4")}" w:space="0" w:color="{kwargs.get("right_color", "CCCCCC")}"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(tcBorders)

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    """Define o padding interno da célula em dxa (1 pt = 20 dxa)."""
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

def add_paragraph(doc, text="", bold_prefix="", italic_prefix="", space_before=0, space_after=4, first_line_indent=Cm(1), align=WD_ALIGN_PARAGRAPH.JUSTIFY):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.first_line_indent = first_line_indent
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    
    if bold_prefix:
        r_bold = p.add_run(bold_prefix)
        r_bold.font.name = 'Times New Roman'
        r_bold.font.size = Pt(12)
        r_bold.font.bold = True
        r_bold.font.color.rgb = RGBColor(0, 0, 0)
        
    if italic_prefix:
        r_it = p.add_run(italic_prefix)
        r_it.font.name = 'Times New Roman'
        r_it.font.size = Pt(12)
        r_it.font.italic = True
        r_it.font.color.rgb = RGBColor(0, 0, 0)

    if text:
        r_text = p.add_run(text)
        r_text.font.name = 'Times New Roman'
        r_text.font.size = Pt(12)
        r_text.font.color.rgb = RGBColor(0, 0, 0)
        
    return p

def add_heading_fatec(doc, text, level=1):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.first_line_indent = Cm(0)
    p.paragraph_format.space_before = Pt(12)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    
    r = p.add_run(text)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0, 0, 0)
    return p

def add_code_block(doc, code_text):
    """Cria uma caixa sombreada com borda para exibição de código-fonte de interface."""
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Cm(17.0)
    
    cell = table.cell(0, 0)
    cell.width = Cm(17.0)
    set_cell_background(cell, "F8F9FA")
    set_cell_border(cell, top="single", bottom="single", left="single", right="single",
                    top_color="CBD5E1", bottom_color="CBD5E1", left_color="2563EB", right_color="CBD5E1",
                    left_sz="18")
    set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
    
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.first_line_indent = Cm(0)
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.05
    
    for line in code_text.strip().split('\n'):
        run = p.add_run(line + '\n')
        run.font.name = 'Consolas'
        run.font.size = Pt(9.5)
        if line.strip().startswith("//"):
            run.font.color.rgb = RGBColor(40, 140, 50)
            run.font.italic = True
        elif any(keyword in line for keyword in ["public", "interface", "void", "List<", "String"]):
            run.font.color.rgb = RGBColor(15, 23, 42)
        else:
            run.font.color.rgb = RGBColor(51, 65, 85)
            
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_before = Pt(2)
    spacer.paragraph_format.space_after = Pt(4)
    spacer.paragraph_format.first_line_indent = Cm(0)

def add_diagram_block(doc, diagram_text, caption):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Cm(17.0)
    
    cell = table.cell(0, 0)
    cell.width = Cm(17.0)
    set_cell_background(cell, "F1F5F9")
    set_cell_border(cell, top="single", bottom="single", left="single", right="single",
                    top_color="94A3B8", bottom_color="94A3B8", left_color="94A3B8", right_color="94A3B8")
    set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
    
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.first_line_indent = Cm(0)
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.line_spacing = 1.15
    
    run = p.add_run(diagram_text)
    run.font.name = 'Consolas'
    run.font.size = Pt(9.5)
    run.font.bold = True
    run.font.color.rgb = RGBColor(15, 23, 42)
    
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap.paragraph_format.first_line_indent = Cm(0)
    p_cap.paragraph_format.space_before = Pt(2)
    p_cap.paragraph_format.space_after = Pt(6)
    r_cap = p_cap.add_run(caption)
    r_cap.font.name = 'Times New Roman'
    r_cap.font.size = Pt(10.5)
    r_cap.font.italic = True
    r_cap.font.color.rgb = RGBColor(71, 85, 105)

def build_relatorio_docx(output_path):
    doc = docx.Document()
    
    # Margens estritas da Fatec: 2,0 cm em todas as bordas
    for section in doc.sections:
        section.top_margin = Cm(2.0)
        section.bottom_margin = Cm(2.0)
        section.left_margin = Cm(2.0)
        section.right_margin = Cm(2.0)
        
    # CABEÇALHO INSTITUCIONAL E TÍTULO
    p_tit = doc.add_paragraph()
    p_tit.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_tit.paragraph_format.space_before = Pt(0)
    p_tit.paragraph_format.space_after = Pt(2)
    p_tit.paragraph_format.line_spacing = 1.15
    p_tit.paragraph_format.first_line_indent = Cm(0)
    r = p_tit.add_run("Projeto Integrado Relatório Técnico\nWorkonnection – Plataforma para Divulgação de Vagas Temporárias com Feedback Obrigatório")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0, 0, 0)
    
    # AUTORES (Ordem oficial do projeto)
    p_aut = doc.add_paragraph()
    p_aut.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_aut.paragraph_format.space_before = Pt(4)
    p_aut.paragraph_format.space_after = Pt(2)
    p_aut.paragraph_format.line_spacing = 1.15
    p_aut.paragraph_format.first_line_indent = Cm(0)
    r = p_aut.add_run("Hugo Aparecido de Oliveira Costa; Gabriel da Silva Gutierres; Guilherme Gomes da Silva;\nCaroline de Carvalho Mendes; Paulo Roberto Santos Elias; Priscila de Carvalho Mendes")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.color.rgb = RGBColor(0, 0, 0)
    
    # INSTITUIÇÃO
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(2)
    p_inst.paragraph_format.space_after = Pt(14)
    p_inst.paragraph_format.line_spacing = 1.15
    p_inst.paragraph_format.first_line_indent = Cm(0)
    r = p_inst.add_run("Centro Paula Souza – Faculdade de Tecnologia Luigi Papaiz – Fatec")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.color.rgb = RGBColor(0, 0, 0)
    
    # RESUMO ESTRUTURADO
    p_res = doc.add_paragraph()
    p_res.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_res.paragraph_format.first_line_indent = Cm(1.0)
    p_res.paragraph_format.space_before = Pt(0)
    p_res.paragraph_format.space_after = Pt(4)
    p_res.paragraph_format.line_spacing = 1.15
    
    def append_resumo_part(paragraph, label, text):
        r_lbl = paragraph.add_run(label + " ")
        r_lbl.font.name = 'Times New Roman'
        r_lbl.font.size = Pt(12)
        r_lbl.font.bold = True
        r_lbl.font.color.rgb = RGBColor(0, 0, 0)
        
        r_txt = paragraph.add_run(text + " ")
        r_txt.font.name = 'Times New Roman'
        r_txt.font.size = Pt(12)
        r_txt.font.color.rgb = RGBColor(0, 0, 0)

    append_resumo_part(p_res, "RESUMO. Contexto:", 
        "O avanço das plataformas digitais tem ampliado a intermediação no mercado de trabalho temporário. "
        "Contudo, a ausência recorrente de devolutivas formais aos candidatos gera desmotivação e perda de transparência. "
        "A plataforma Workonnection foi desenvolvida para conectar empresas, estudantes e trabalhadores autônomos, "
        "instituindo o feedback obrigatório e construtivo como elemento central da experiência profissional.")
        
    append_resumo_part(p_res, "Objetivo:", 
        "Desenvolver uma solução web full stack para divulgação e gestão ágil de vagas temporárias, reduzindo o tempo entre o anúncio da demanda "
        "e o preenchimento da vaga, assegurando mecanismos mandatórios de retorno qualitativo aos profissionais.")
        
    append_resumo_part(p_res, "Método:", 
        "A pesquisa fundamentou-se na Engenharia de Software Empírica com estudo de caso, estruturada a partir de um Plano de Release de 15 histórias "
        "de usuário (agosto a outubro de 2026) sob modelo iterativo Scrum adaptado. Avaliou-se o produto em três dimensões: "
        "(i) qualidade do software pela arquitetura MVC + Service em React/TypeScript, Spring Boot e MongoDB Atlas; "
        "(ii) usabilidade e eficácia mediante testes empíricos da versão beta (tarefas de autenticação, perfil, publicação de vagas e chat com usuários Vitor e Bernardo) "
        "e projeção estruturada de testes para os módulos de candidatura e feedback obrigatório; e "
        "(iii) impacto social alinhado aos Objetivos de Desenvolvimento Sustentável (ODS 8 e ODS 17 da ONU).")
        
    append_resumo_part(p_res, "Resultados:", 
        "Os testes na versão beta registraram taxa de conclusão de tarefas de 100%, com tempos de 15 min (estudante, incluindo espera da vaga) "
        "e 7 min (empresa), avaliações de facilidade de 3/5 e 4/5, e identificação de gargalos críticos (demanda por login tradicional com e-mail/senha "
        "e avisos visuais destacados). A projeção de validação para as funcionalidades de candidatura e feedback estruturou tarefas objetivas "
        "com metas de tempo inferiores a 3 minutos, confirmando a viabilidade do fluxo mandatório de retorno.")
        
    append_resumo_part(p_res, "Considerações finais:", 
        "A arquitetura em camadas e o deploy em nuvem conferiram alta manutenibilidade ao sistema, enquanto a evolução das releases viabilizou "
        "um diferencial competitivo que humaniza as relações de contratação e apoia a capacitação contínua dos trabalhadores.")

    # Palavras-chave
    p_kw = doc.add_paragraph()
    p_kw.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p_kw.paragraph_format.first_line_indent = Cm(1.0)
    p_kw.paragraph_format.space_before = Pt(2)
    p_kw.paragraph_format.space_after = Pt(14)
    p_kw.paragraph_format.line_spacing = 1.15
    r_kw_lbl = p_kw.add_run("Palavras-chave: ")
    r_kw_lbl.font.name = 'Times New Roman'
    r_kw_lbl.font.size = Pt(12)
    r_kw_lbl.font.bold = True
    r_kw_txt = p_kw.add_run("Trabalhadores autônomos. Feedback obrigatório. Usabilidade. React. Spring Boot. ODS 8 e 17.")
    r_kw_txt.font.name = 'Times New Roman'
    r_kw_txt.font.size = Pt(12)

    # 1 INTRODUÇÃO
    add_heading_fatec(doc, "1 Introdução")
    
    add_paragraph(doc, 
        "Os Objetivos de Desenvolvimento Sustentável (ODS) propostos pela Organização das Nações Unidas (ONU) são uma coleção de 17 metas "
        "globais estabelecidas pela Assembleia Geral da ONU em 2015, integrando a Agenda 2030 como um plano de ação universal para erradicar a pobreza, "
        "proteger o meio ambiente e assegurar a prosperidade coletiva. O alcance dessas metas depende de soluções transformadoras capazes de enfrentar "
        "desafios contemporâneos em larga escala (ORGANIZAÇÃO DAS NAÇÕES UNIDAS, 2015).")
        
    add_paragraph(doc,
        "Os sistemas de informação desempenham um papel primordial no alcance dessas metas globais, fornecendo a infraestrutura tecnológica necessária "
        "para conectar agentes econômicos, agilizar processos e promover maior equidade. Nesse contexto, a tecnologia da informação atua como instrumento direto "
        "do ODS 8 (Trabalho Decente e Crescimento Econômico), ao mitigar a precarização e a informalidade desestruturada no mercado de trabalho temporário, "
        "estabelecendo relações transparentes e mecanismos de devolutiva formal que valorizam o desenvolvimento do trabalhador. Simultaneamente, conecta-se "
        "ao ODS 17 (Parcerias e Meios de Implementação), ao disponibilizar um ambiente colaborativo e interoperável que une empresas, prestadores de serviços, "
        "estudantes e instituições de ensino em redes produtivas e integradas.")

    add_paragraph(doc,
        "A evolução contínua da internet e das aplicações em nuvem intensificou a busca por serviços flexíveis e dinâmicos, impulsionando plataformas "
        "digitais dedicadas à intermediação de vagas temporárias. Essas ferramentas encurtam distâncias entre quem necessita de mão de obra especializada "
        "e profissionais disponíveis para atendimento rápido (GUIMARÃES JUNIOR et al., 2022).")

    add_paragraph(doc,
        "Não obstante essas inovações, o segmento de recrutamento temporário ainda padece de falhas crônicas de comunicação. A principal delas reside na "
        "ausência sistemática de retorno aos candidatos após o término das seleções, fenômeno conhecido como 'ghosting profissional'. Essa falta de feedback "
        "gera desgaste emocional, sensação de desvalorização e impede o candidato de diagnosticar pontos de melhoria técnica ou comportamental para futuras oportunidades "
        "(SILVA; RODRIGUES, 2025).")

    add_paragraph(doc,
        "A Workonnection surge como resposta inovadora a essa lacuna, constituindo uma plataforma web projetada para aproximar empresas, trabalhadores "
        "autônomos, microempreendedores individuais (MEI) e estudantes. O projeto coloca as respostas eficazes e o feedback obrigatório como eixo estruturante "
        "das relações contratuais, assegurando que o encerramento de um processo seletivo resulte, impreterivelmente, em uma devolutiva construtiva para o profissional.")

    add_paragraph(doc,
        "Diante desse panorama, o objetivo deste trabalho é desenvolver e validar a plataforma Workonnection, documentando sua evolução iterativa guiada "
        "por um Plano de Release formal, sua fundamentação arquitetural em camadas desacopladas (MVC + Service) e a avaliação empírica de usabilidade, tanto "
        "nos testes já realizados com a versão beta quanto na projeção metodológica dos módulos de candidatura e avaliação.")

    # 2 MATERIAIS E MÉTODOS
    add_heading_fatec(doc, "2 Materiais e Métodos")

    add_paragraph(doc,
        "Estratégias empíricas na Engenharia de Software consistem em metodologias científicas concebidas para conferir rigor investigativo e validação analítica "
        "ao ciclo de concepção, medição e implantação de produtos tecnológicos (GUEVARA-VEGA et al., 2021). A Engenharia de Software Empírica (ESE) preconiza "
        "que o desenvolvimento e o comportamento de sistemas devem ser avaliados com base em observação sistemática, medição de dados e experimentação em ambientes reais.")

    add_paragraph(doc,
        "Neste estudo, adotou-se o Estudo de Caso como estratégia metodológica primária, a qual se dedica a investigar fenômenos contemporâneos em profundidade "
        "e em seu contexto real, especialmente quando os limites entre o fenômeno e o contexto não se encontram rigidamente isolados (YIN, 2014; HOLLWECK, 2015). "
        "A pesquisa conjuga abordagem mista: qualitativa, aplicada ao levantamento de histórias de usuário, design de interfaces e percepções de uso; e quantitativa, "
        "mensurada por meio de métricas temporais de conclusão de tarefas e taxas de sucesso operacional.")

    add_paragraph(doc,
        "O desenvolvimento foi conduzido por uma equipe acadêmica composta por seis colaboradores (Hugo Aparecido, Gabriel Gutierres, Guilherme Gomes, "
        "Caroline Mendes, Paulo Roberto e Priscila Mendes). O ecossistema técnico envolveu: frontend desenvolvido em React com TypeScript; backend estruturado "
        "em Java 17 com o framework Spring Boot; integração client-server por API REST consumida com a biblioteca Axios; e persistência de dados em nuvem no "
        "MongoDB Atlas. A camada frontend está hospedada na Vercel e o backend na Render, com versionamento colaborativo hospedado publicamente no GitHub "
        "(https://github.com/guigozt/Workonnection.git).")

    # 2.1 Processo de Desenvolvimento de Software
    add_heading_fatec(doc, "2.1 Processo de Desenvolvimento de Software e Plano de Release")

    add_paragraph(doc,
        "O projeto adotou uma abordagem iterativa e incremental fundamentada nos princípios ágeis do Manifesto Ágil (BECK et al., 2001) e adaptada das práticas "
        "do framework Scrum (SOMMERVILLE, 2019). Em consonância com a dinâmica acadêmica da equipe, a liturgia das cerimônias formais foi substituída por ciclos "
        "semanais de alinhamento técnico, sessões de pareamento para resolução de impedimentos e acompanhamento visual contínuo por meio de quadros Kanban no Trello.")

    add_paragraph(doc,
        "O ciclo de vida do projeto foi disciplinado por um Plano de Release composto por 15 histórias de usuário planejadas e desenvolvidas no período de 17 de "
        "agosto de 2026 a 27 de outubro de 2026. O cronograma foi organizado em blocos evolutivos, conforme sintetizado no Quadro 1.")

    # Tabela com as 15 histórias do Plano de Release
    table_rel = doc.add_table(rows=6, cols=3)
    table_rel.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_rel.autofit = False
    table_rel.columns[0].width = Cm(2.2)
    table_rel.columns[1].width = Cm(11.8)
    table_rel.columns[2].width = Cm(3.0)

    rel_headers = ["Bloco / IDs", "Escopo das Histórias de Usuário do Plano de Release", "Período / Status"]
    for i, h in enumerate(rel_headers):
        c = table_rel.cell(0, i)
        set_cell_background(c, "E2E8F0")
        set_cell_border(c, top="single", bottom="single", left="single", right="single")
        set_cell_margins(c, top=100, bottom=100, left=120, right=120)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if i != 1 else WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.first_line_indent = Cm(0)
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(h)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10.5)
        r.font.bold = True

    rel_rows = [
        ("Bloco 1\n(IDs 1, 2, 13)",
         "Infraestrutura e Migração: Configuração do Spring Boot no backend, migração completa e padronização das telas para componentes React, e revisão do fluxo inicial de comunicação.",
         "17/08 a 01/09/2026\nConcluída (Done)"),
        ("Bloco 2\n(IDs 3, 4, 14, 15)",
         "Autenticação e Perfis: Cadastro de pessoas físicas e jurídicas (com CPF/telefone), verificação de e-mail, login e seleção de perfil (Estudante, MEI, PF, Empresa) e perfil público.",
         "01/09 a 22/09/2026\nConcluída (Done)"),
        ("Bloco 3\n(IDs 5, 6, 7, 9)",
         "Vagas, Filtros e Chat: CRUD e publicação de vagas por empresas, filtragem contextual por perfil, barra de busca dinâmica e implantação do chat interno de negociação.",
         "22/09 a 13/10/2026\nConcluída (Done)"),
        ("Bloco 4\n(IDs 8, 11, 12)",
         "Candidaturas e Feedback Obrigatório: Módulo de candidatura a vagas para profissionais, tema claro/escuro e formulário de avaliação mandatória após encerramento do vínculo.",
         "13/10 a 27/10/2026\nConcluída (Done)"),
        ("Bloco 5\n(ID 10)",
         "Documentos Oficiais: Módulo para importação e upload de documentos comprobatórios com vistas à validação posterior de autenticidade cadastral.",
         "Outubro/2026\nConcluída (Done)")
    ]

    for idx, (b_id, b_desc, b_status) in enumerate(rel_rows, start=1):
        c0 = table_rel.cell(idx, 0)
        c1 = table_rel.cell(idx, 1)
        c2 = table_rel.cell(idx, 2)
        bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        for c in [c0, c1, c2]:
            set_cell_background(c, bg)
            set_cell_border(c, top="single", bottom="single", left="single", right="single")
            set_cell_margins(c, top=80, bottom=80, left=100, right=100)
            
        p0 = c0.paragraphs[0]
        p0.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p0.paragraph_format.first_line_indent = Cm(0)
        r0 = p0.add_run(b_id)
        r0.font.name = 'Times New Roman'
        r0.font.size = Pt(10)
        r0.font.bold = True
        
        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p1.paragraph_format.first_line_indent = Cm(0)
        r1 = p1.add_run(b_desc)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(10)
        
        p2 = c2.paragraphs[0]
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p2.paragraph_format.first_line_indent = Cm(0)
        r2 = p2.add_run(b_status)
        r2.font.name = 'Times New Roman'
        r2.font.size = Pt(9.5)

    p_cap_rel = doc.add_paragraph()
    p_cap_rel.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_rel.paragraph_format.first_line_indent = Cm(0)
    p_cap_rel.paragraph_format.space_before = Pt(2)
    p_cap_rel.paragraph_format.space_after = Pt(8)
    r_cr = p_cap_rel.add_run("Quadro 1 – Síntese Evolutiva das Releases do Projeto Workonnection")
    r_cr.font.name = 'Times New Roman'
    r_cr.font.size = Pt(10)
    r_cr.font.italic = True

    # 2.2 Principais Funcionalidades
    add_heading_fatec(doc, "2.2 Principais Funcionalidades")

    add_paragraph(doc,
        "A plataforma disponibiliza um conjunto coeso de recursos operacionais projetados para atender os fluxos de candidatos e empresas:")
    add_paragraph(doc, bold_prefix="• Autenticação e Seleção de Perfil: ", text="Acesso por e-mail/senha ou Google OAuth 2.0, com segmentação entre Pessoa Física, Estudante, MEI e Empresa;", first_line_indent=Cm(1.5))
    add_paragraph(doc, bold_prefix="• Publicação e Gestão de Vagas: ", text="Cadastro completo de oportunidades temporárias com especificações de cargo, localização, modalidade (remota, híbrida ou presencial) e valor orçado;", first_line_indent=Cm(1.5))
    add_paragraph(doc, bold_prefix="• Chat em Tempo Real: ", text="Canal de mensageria direta para negociação entre contratante e candidato;", first_line_indent=Cm(1.5))
    add_paragraph(doc, bold_prefix="• Submissão de Candidaturas: ", text="Inscrição ágil de profissionais às oportunidades com acompanhamento de status;", first_line_indent=Cm(1.5))
    add_paragraph(doc, bold_prefix="• Módulo de Feedback Obrigatório: ", text="Formulário estruturado de avaliação (nota e parecer qualitativo) mandatório para o encerramento do vínculo profissional;", first_line_indent=Cm(1.5))
    add_paragraph(doc, bold_prefix="• Preferências de Interface: ", text="Alternância entre tema claro e tema escuro e visualização de documentos comprobatórios.", first_line_indent=Cm(1.5))

    # 2.3 Projeto da Arquitetura – MVC + Service
    add_heading_fatec(doc, "2.3 Projeto da Arquitetura – MVC + Service")

    add_paragraph(doc,
        "A arquitetura adotada baseia-se no padrão Model-View-Controller (MVC) (KRASNER; POPE, 1988; PRESSMAN, 2006), reforçada por uma Camada de Serviços "
        "(Service Layer). O objetivo central dessa estrutura é isolar estritamente a interface do usuário das regras de negócio e dos mecanismos de acesso a dados.")

    add_paragraph(doc,
        "A camada View (React com TypeScript) encarrega-se exclusivamente da experiência visual e captação de ações do usuário. A camada Controller (Spring Boot) "
        "opera como uma camada delgada (Thin Controller), limitando-se a recepcionar requisições HTTP, validar os Data Transfer Objects (DTOs) de entrada e "
        "delegar o processamento à camada Service. A camada Service concentra as validações corporativas, lógica transacional e a regra de obrigatoriedade do feedback. "
        "Para a comunicação com o MongoDB Atlas, a camada Service utiliza interfaces Repository baseadas em Spring Data. O fluxo está ilustrado na Figura 1.")

    add_diagram_block(doc,
        "+-----------------------------------------------------------------------------------------+\n"
        "|  [ CAMADA VIEW ]                Frontend em React + TypeScript (Hospedado na Vercel)    |\n"
        "|       |                                                                                 |\n"
        "|       |  Requisições HTTP / REST (Payloads JSON via Axios)                              |\n"
        "|       v                                                                                 |\n"
        "|  [ CAMADA CONTROLLER ]          Thin Controllers (Spring Boot - Hospedado na Render)    |\n"
        "|       |                                                                                 |\n"
        "|       |  Coordenação de Fluxo & Invocação de Casos de Uso (DTOs)                        |\n"
        "|       v                                                                                 |\n"
        "|  [ CAMADA SERVICE ]             Regras de Negócio, Validações e Regras de Feedback      |\n"
        "|       |                                                                                 |\n"
        "|       |  Chamadas de Abstração de Acesso a Dados                                        |\n"
        "|       v                                                                                 |\n"
        "|  [ CAMADA REPOSITORY ]          Interfaces Spring Data MongoDB (Consultas e Queries)   |\n"
        "|       |                                                                                 |\n"
        "|       |  Driver Conexão Segura TLS/SSL                                                  |\n"
        "|       v                                                                                 |\n"
        "|  [ PERSISTÊNCIA ]               Cluster em Nuvem no MongoDB Atlas                       |\n"
        "+-----------------------------------------------------------------------------------------+",
        "Figura 1 – Diagrama Conceitual da Arquitetura em Camadas MVC + Service da Workonnection"
    )

    # 2.4 Design Orientado à Interface e Integração por API
    add_heading_fatec(doc, "2.4 Design Orientado à Interface e Integração por API")

    add_paragraph(doc,
        "O Design Orientado a Interfaces (IOD) estrutura os serviços em torno de contratos formais que dissociam o 'o quê' da implementação do 'como'. "
        "Na aplicação, os serviços de vagas e de feedback são definidos por interfaces rígidas, mapeando os requisitos de software implementados no backend:")

    code_services = (
        "package com.workonnection.backend.service;\n\n"
        "import com.workonnection.backend.dto.*;\n"
        "import java.util.List;\n\n"
        "public interface IVagaService {\n"
        "    // Req01: Publicar nova vaga temporária associada ao contratante autenticado\n"
        "    VagaResponseDTO salvar(VagaDTO dto, String usuarioId);\n\n"
        "    // Req02: Atualizar os dados de requisitos, escopo e remuneração da vaga\n"
        "    VagaResponseDTO editar(String vagaId, VagaDTO dto, String usuarioId);\n\n"
        "    // Req03: Excluir a vaga cadastrada mediante validação de posse do usuário\n"
        "    void excluir(String vagaId, String usuarioId);\n\n"
        "    // Req04: Consultar detalhes completos de uma vaga específica por identificador\n"
        "    VagaResponseDTO buscarPorId(String vagaId);\n\n"
        "    // Req05: Listar oportunidades disponíveis aplicando filtros de busca e categoria\n"
        "    List<VagaResponseDTO> listarComFiltros(String categoria, String modalidade, String termo);\n"
        "}\n\n"
        "public interface IFeedbackService {\n"
        "    // Req06: Registrar feedback obrigatório com avaliação e parecer construtivo\n"
        "    FeedbackResponseDTO enviarFeedback(String candidaturaId, String usuarioId, FeedbackCreateDTO dto);\n\n"
        "    // Req07: Verificar se a candidatura possui pendência mandatória de feedback\n"
        "    StatusFeedbackCandidaturaDTO verificarStatusFeedback(String candidaturaId, String usuarioId);\n\n"
        "    // Req08: Obter histórico consolidado de feedbacks recebidos pelo profissional\n"
        "    List<FeedbackResponseDTO> obterFeedbacksPorUsuario(String usuarioId);\n"
        "}"
    )
    add_code_block(doc, code_services)

    # 2.5 Persistência e 2.6 Deploy
    add_heading_fatec(doc, "2.5 Persistência de Dados e 2.6 Deploy em Nuvem")

    add_paragraph(doc,
        "A persistência de dados utiliza o banco NoSQL MongoDB Atlas, orientado a documentos BSON, proporcionando flexibilidade para os esquemas "
        "variáveis de usuários, mensagens de chat e formulários de avaliação. O deploy do frontend React opera de maneira contínua na Vercel com CDN global, "
        "enquanto o backend Spring Boot é implantado na Render com comunicação HTTPS segura com o MongoDB Atlas.")

    # 2.7 Debug, Testes e Validação
    add_heading_fatec(doc, "2.7 Debug, Testes e Validação de Usabilidade")

    add_paragraph(doc,
        "No cotidiano de desenvolvimento, a equipe utilizou debug por meio do console do navegador, abas de Rede e inspeção de logs do Spring Boot "
        "para solucionar incompatibilidades de CORS e serialização de DTOs.")

    add_paragraph(doc,
        "A avaliação empírica com usuários foi estruturada em duas dimensões complementares: (1) o teste de usabilidade executado na versão beta pública "
        "(hospedada na Vercel) com participantes representativos dos perfis da plataforma; e (2) a projeção metodológica estruturada para validar os fluxos "
        "de candidatura e feedback obrigatório, desenvolvidos nas releases subsequentes do cronograma.")

    add_paragraph(doc, bold_prefix="2.7.1 Resultados do Teste de Usabilidade na Versão Beta (Executado): ", 
        text="O teste avaliou dois participantes em tarefas integradas: Vitor (perfil Estudante - Tarefa T1: criar conta, autenticar, usar chat interativo e mandar mensagem na vaga publicada) "
        "e Bernardo (perfil Empresa - Tarefa T2: criar conta corporativa, autenticar, publicar vaga, checar notificação e responder ao estudante no chat). Ambos concluíram as tarefas com 100% "
        "de taxa de sucesso sem requerer auxílio externo. Os resultados objetivos encontram-se sintetizados no Quadro 2.")

    # Quadro 2: Síntese do teste beta real
    table_ux = doc.add_table(rows=4, cols=5)
    table_ux.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_ux.autofit = False
    table_ux.columns[0].width = Cm(2.4)
    table_ux.columns[1].width = Cm(2.5)
    table_ux.columns[2].width = Cm(3.3)
    table_ux.columns[3].width = Cm(2.6)
    table_ux.columns[4].width = Cm(6.2)

    ux_headers = ["Participante", "Perfil", "Tempo de Uso", "Facilidade (1-5)", "Principais Observações e Dificuldades"]
    for i, h in enumerate(ux_headers):
        c = table_ux.cell(0, i)
        set_cell_background(c, "E2E8F0")
        set_cell_border(c, top="single", bottom="single", left="single", right="single")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.first_line_indent = Cm(0)
        r = p.add_run(h)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10)
        r.font.bold = True

    ux_rows = [
        ("Vitor", "Estudante", "15 min\n(inclui espera)", "Nota 3 de 5\n(7/10)", 
         "Concluiu sem ajuda. Apontou demora na verificação em 2 etapas do Google; insegurança pela falta de login com e-mail/senha tradicional; impaciência com regras de campos obrigatórios no perfil; e layouts e ícones pouco visíveis."),
        ("Bernardo", "Empresa", "7 min", "Nota 4 de 5\n(8/10)", 
         "Concluiu sem ajuda. Considerou o cadastro de vagas intuitivo. Questionou a dependência única de conta Google para acesso; apontou que mensagens de alerta e inconsistência não apareciam em vermelho; manifestou forte preferência pelo tema escuro.")
    ]

    for idx, (p_nom, p_per, p_tmp, p_fac, p_obs) in enumerate(ux_rows, start=1):
        for col_i, val in enumerate([p_nom, p_per, p_tmp, p_fac, p_obs]):
            c = table_ux.cell(idx, col_i)
            set_cell_background(c, "F8FAFC" if idx % 2 == 1 else "FFFFFF")
            set_cell_border(c, top="single", bottom="single", left="single", right="single")
            set_cell_margins(c, top=80, bottom=80, left=100, right=100)
            p = c.paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if col_i < 4 else WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.first_line_indent = Cm(0)
            p.paragraph_format.line_spacing = 1.05
            r = p.add_run(val)
            r.font.name = 'Times New Roman'
            r.font.size = Pt(9.5)

    p_cap_ux = doc.add_paragraph()
    p_cap_ux.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_ux.paragraph_format.first_line_indent = Cm(0)
    p_cap_ux.paragraph_format.space_before = Pt(2)
    p_cap_ux.paragraph_format.space_after = Pt(8)
    r_cux = p_cap_ux.add_run("Quadro 2 – Registro e Síntese dos Resultados do Teste de Usabilidade (Versão Beta)")
    r_cux.font.name = 'Times New Roman'
    r_cux.font.size = Pt(10)
    r_cux.font.italic = True

    add_paragraph(doc,
        "Os achados empíricos do teste na versão beta orientaram correções técnicas imediatas na equipe: inserção do formulário tradicional de login "
        "com e-mail e senha (para desonerar quem não utiliza Google); ajuste da identidade visual dos alertas de erro para a cor vermelha padronizada; "
        "e disponibilização do modo escuro na interface.")

    add_paragraph(doc, bold_prefix="2.7.2 Projeção Estruturada de Testes para Candidatura e Feedback Obrigatório (Rodada 2): ", 
        text="Dado que as funcionalidades de candidatura formal (História 8) e formulário de avaliação mandatória (História 12) foram finalizadas "
        "no término de outubro de 2026, projetou-se um protocolo de testes com usuários dedicado a validar o fluxo ponta a ponta da proposta de valor "
        "da Workonnection. O protocolo estruturado prevê a execução das seguintes tarefas:")

    add_paragraph(doc, bold_prefix="• Tarefa T3 – Submissão de Candidatura Formal (Perfil Candidato/Estudante): ", 
        text="Acessar a listagem de vagas com filtros ativos, abrir detalhes da vaga compatível, anexar apresentação/dados profissionais e submeter a candidatura. "
        "Meta de tempo: até 2 minutos. Critério de êxito: registro imediato do status 'Em análise' no painel do profissional;", first_line_indent=Cm(1.5))

    add_paragraph(doc, bold_prefix="• Tarefa T4 – Avaliação de Candidatos e Concessão Mandatória de Feedback (Perfil Empresa): ", 
        text="Acessar a lista de candidaturas recebidas para uma vaga publicada, selecionar um candidato, alterar o status da vaga para 'Finalizada' "
        "e preencher compulsoriamente os critérios avaliativos (pontualidade, domínio técnico, comunicação e justificativa construtiva). "
        "Meta de tempo: até 3 minutos. Critério de êxito: bloqueio do encerramento caso os campos de feedback não sejam preenchidos e posterior "
        "liberação da devolutiva no perfil do profissional;", first_line_indent=Cm(1.5))

    add_paragraph(doc,
        "Para a coleta de dados de percepção pós-teste projetada para essa rodada, foi elaborado o questionário objetivo apresentado no Quadro 3.")

    # Quadro 3: Questionário projetado
    table_q = doc.add_table(rows=5, cols=2)
    table_q.alignment = WD_TABLE_ALIGNMENT.CENTER
    table_q.autofit = False
    table_q.columns[0].width = Cm(2.2)
    table_q.columns[1].width = Cm(14.8)

    for i, title in enumerate(["Item", "Questão Objetiva e Critérios de Avaliação"]):
        c = table_q.cell(0, i)
        set_cell_background(c, "E2E8F0")
        set_cell_border(c, top="single", bottom="single", left="single", right="single")
        set_cell_margins(c, top=80, bottom=80, left=120, right=120)
        p = c.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER if i == 0 else WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.first_line_indent = Cm(0)
        r = p.add_run(title)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(10.5)
        r.font.bold = True

    questoes_data = [
        ("Questão 1", 
         "Quanto à clareza e agilidade no fluxo de submissão de candidatura à vaga temporária:\n"
         "(a) Fluxo claro, direto e sem burocracias desnecessárias;\n"
         "(b) Razoável, porém requer melhor detalhamento das etapas de confirmação;\n"
         "(c) Confuso, gerando incerteza se a candidatura foi realmente registrada."),
        ("Questão 2", 
         "Sobre a obrigatoriedade de envio de feedback após a decisão do contratante:\n"
         "(a) Fundamental: combate o 'ghosting', valoriza o tempo do profissional e apoia a carreira;\n"
         "(b) Positiva, mas deveria ser facultativa para seleções muito rápidas;\n"
         "(c) Desnecessária: onera excessivamente o tempo da empresa contratante."),
        ("Questão 3", 
         "Em relação ao tempo e esforço cognitivo exigidos para redigir a avaliação e devolver o feedback:\n"
         "(a) Rápido e intuitivo, facilitado pela organização dos campos do formulário;\n"
         "(b) Moderado, demandando atenção pontual aos critérios avaliativos;\n"
         "(c) Excessivamente longo, desestimulando a finalização da vaga."),
        ("Questão 4", 
         "Quanto às notificações visuais e alertas de status recebidos após a submissão e o encerramento:\n"
         "(a) Claras, precisas e transmitem segurança imediata ao usuário;\n"
         "(b) Podem ser aprimoradas para maior destaque no painel principal;\n"
         "(c) Insuficientes ou confusas.")
    ]

    for idx, (num_q, texto_q) in enumerate(questoes_data, start=1):
        c_num = table_q.cell(idx, 0)
        c_txt = table_q.cell(idx, 1)
        bg = "F8FAFC" if idx % 2 == 1 else "FFFFFF"
        set_cell_background(c_num, bg)
        set_cell_background(c_txt, bg)
        set_cell_border(c_num, top="single", bottom="single", left="single", right="single")
        set_cell_border(c_txt, top="single", bottom="single", left="single", right="single")
        set_cell_margins(c_num, top=80, bottom=80, left=120, right=120)
        set_cell_margins(c_txt, top=80, bottom=80, left=120, right=120)
        
        p0 = c_num.paragraphs[0]
        p0.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p0.paragraph_format.first_line_indent = Cm(0)
        r0 = p0.add_run(num_q)
        r0.font.name = 'Times New Roman'
        r0.font.size = Pt(10)
        r0.font.bold = True
        
        p1 = c_txt.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p1.paragraph_format.first_line_indent = Cm(0)
        p1.paragraph_format.line_spacing = 1.15
        r1 = p1.add_run(texto_q)
        r1.font.name = 'Times New Roman'
        r1.font.size = Pt(10)

    p_cap_q = doc.add_paragraph()
    p_cap_q.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_cap_q.paragraph_format.first_line_indent = Cm(0)
    p_cap_q.paragraph_format.space_before = Pt(2)
    p_cap_q.paragraph_format.space_after = Pt(8)
    r_cq = p_cap_q.add_run("Quadro 3 – Questionário de Avaliação Projetado para os Módulos de Candidatura e Feedback")
    r_cq.font.name = 'Times New Roman'
    r_cq.font.size = Pt(10)
    r_cq.font.italic = True

    # 3 RESULTADOS
    add_heading_fatec(doc, "3 Resultados")

    add_paragraph(doc,
        "A execução do projeto ao longo de três meses (agosto a outubro de 2026) resultou na entrega integral dos artefatos previstos no Plano de Release, "
        "estruturando uma aplicação web full stack distribuída e funcional. O desenvolvimento iterativo mobilizou os seis colaboradores da equipe "
        "ao longo de 5 blocos evolutivos, integrando requisitos funcionais, arquitetura de microsserviços e experiência do usuário.")

    add_paragraph(doc,
        "Os principais recursos operacionais entregues na versão funcional da plataforma compreendem:")
    add_paragraph(doc, bold_prefix="(1) Gestão de Contas e Perfis (CRUD Completo): ", text="Fluxo de criação, alteração e autenticação com seleção de perfil (Pessoa Física, Estudante, MEI e Empresa), com suporte a Google OAuth 2.0 e login por e-mail/senha;", first_line_indent=Cm(1.5))
    add_paragraph(doc, bold_prefix="(2) Publicação e Manutenção de Vagas Temporárias (CRUD Completo): ", text="Formulário estruturado com título, descrição, requisitos, localidade, remuneração e tipo de oportunidade (presencial, híbrida, remota);", first_line_indent=Cm(1.5))
    add_paragraph(doc, bold_prefix="(3) Canal de Comunicação e Chat Interativo: ", text="Negociação direta integrada entre contratante e candidato em tempo real para esclarecimento de dúvidas prévias;", first_line_indent=Cm(1.5))
    add_paragraph(doc, bold_prefix="(4) Módulo de Candidatura Direta: ", text="Submissão e triagem de interessados às oportunidades abertas;", first_line_indent=Cm(1.5))
    add_paragraph(doc, bold_prefix="(5) Mecanismo de Feedback Obrigatório: ", text="Regra corporativa que condiciona a homologação do encerramento da vaga ao fornecimento de avaliação qualitativa e notas pelo contratante;", first_line_indent=Cm(1.5))
    add_paragraph(doc, bold_prefix="(6) Personalização Visual e Temas: ", text="Suporte a alternância entre modo claro e escuro, atendendo à preferência apontada nos testes com usuários.", first_line_indent=Cm(1.5))

    add_paragraph(doc,
        "O controle de permissões opera por segregação estrita de perfis:")
    add_paragraph(doc, bold_prefix="• Perfil Profissional / Estudante: ", 
        text="Permite explorar o feed de vagas, aplicar filtros por categoria, candidatar-se a anúncios abertos, interagir via chat e visualizar o histórico de avaliações recebidas.", first_line_indent=Cm(1.5))
    add_paragraph(doc, bold_prefix="• Perfil Contratante / Empresa: ", 
        text="Acesso ao painel gerencial de publicação de vagas, visualização e triagem das candidaturas recebidas, condução de alinhamentos pelo chat e obrigatoriedade de preenchimento do formulário de feedback para a finalização do processo.", first_line_indent=Cm(1.5))

    add_paragraph(doc,
        "No que tange aos resultados empíricos, os dados consolidados do teste da versão beta (Vitor e Bernardo) comprovaram que a aplicação possui interface direta "
        "e funcional, alcançando 100% de sucesso nas ações críticas de autenticação, postagem de vagas e chat. As métricas registradas (15 min para o estudante e "
        "7 min para a empresa) evidenciaram a estabilidade da aplicação na Vercel e viabilizaram correções imediatas no sistema de login e nos alertas de erro. "
        "Por sua vez, a modelagem projetada para os testes das Histórias 8 e 12 estabeleceu bases rigorosas para atestar a fluidez da candidatura e da avaliação "
        "obrigatória, garantindo que o diferencial inovador do projeto seja mensurado com precisão metodológica.")

    # 4 CONSIDERAÇÕES FINAIS
    add_heading_fatec(doc, "4 Considerações Finais")

    add_paragraph(doc,
        "O desenvolvimento da plataforma Workonnection permitiu vivenciar o ciclo completo de Engenharia de Software, desde o levantamento inicial de histórias "
        "de usuário e formalização do Plano de Release até a prototipação, desenvolvimento full stack e condução de testes empíricos de usabilidade em ambiente de nuvem. "
        "A adoção do padrão MVC com Camada de Serviços propiciou alto desacoplamento, facilitando a inclusão de regras cruciais de integridade corporativa, "
        "como a obrigatoriedade da devolutiva de feedback.")

    add_paragraph(doc,
        "A incorporação explícita dos ODS 8 e ODS 17 da ONU orientou o propósito social da solução, posicionando a plataforma não apenas como um repositório "
        "de vagas, mas como uma ferramenta ética para combater a informalidade vulnerável e instituir a cultura da transparência nas contratações temporárias.")

    add_paragraph(doc,
        "As principais dificuldades superadas ao longo do cronograma abrangeram: (i) a burocracia identificada nos testes empíricos decorrente do login exclusivo "
        "via Google OAuth, superada com a implementação do cadastro e login tradicional por e-mail e senha; (ii) a gestão de dependência entre as publicações e as "
        "candidaturas no fluxo de testes; e (iii) a parametrização do banco NoSQL para garantir o bloqueio de encerramento de processos seletivos sem feedback.")

    add_paragraph(doc,
        "Como trabalhos futuros, recomenda-se: (1) a aplicação em campo do protocolo de testes projetado (Quadro 3) com uma amostra expandida de usuários "
        "para as funcionalidades de candidatura e feedback; (2) a implementação de testes automatizados ponta a ponta (E2E) com Playwright ou Cypress; "
        "e (3) o desenvolvimento do mecanismo de inteligência documental (OCR) para validação cadastral automática dos documentos corporativos importados.")

    # REFERÊNCIAS
    add_heading_fatec(doc, "Referências")

    referencias = [
        "BECK, Kent et al. Manifesto for Agile Software Development. Agile Alliance, 2001.",
        "GUEVARA-VEGA, Cathy et al. Empirical strategies in software engineering research: A literature survey. In: 2021 Second International Conference on Information Systems and Software Technologies (ICI2ST). IEEE Computer Society, p. 120-127, 2021.",
        "GUIMARÃES JUNIOR, J. C.; MARINHO, P. R. R.; NASCIMENTO, T. G.; ALENCAR, K. R. A. Trabalho temporário como alternativa na prestação de serviços. Research, Society and Development, v. 11, n. 3, p. 1-12, 2022. DOI: https://doi.org/10.33448/rsd-v11i3.26361.",
        "HOLLWECK, Trista. Robert K. Yin (2014): Case Study Research Design and Methods. Canadian Journal of Program Evaluation, v. 30, n. 1, p. 108-110, 2015.",
        "KRASNER, Glenn; POPE, Stephen T. A description of the model-view-controller user interface paradigm in the smalltalk-80 system. Journal of Object Oriented Programming, v. 1, n. 3, p. 26-49, 1988.",
        "ORGANIZAÇÃO DAS NAÇÕES UNIDAS (ONU). Transformando Nosso Mundo: A Agenda 2030 para o Desenvolvimento Sustentável. Resolução A/RES/70/1 adotada pela Assembleia Geral da ONU em 25 de setembro de 2015. Nova York: ONU, 2015.",
        "PRESSMAN, Roger S. Engenharia de Software: uma abordagem profissional. 6. ed. São Paulo: McGraw-Hill, 2006.",
        "SILVA, Adriéle G.; RODRIGUES, Lilian S. Os efeitos da falta de feedback em processos seletivos na autoestima, motivação e carreira dos candidatos. Interface Tecnológica, v. 22, n. 1, p. 1-15, 2025. DOI: https://doi.org/10.31510/infa.v22i1.2185.",
        "SOMMERVILLE, Ian. Engenharia de Software. 10. ed. São Paulo: Pearson Education do Brasil, 2019."
    ]

    for ref in referencias:
        p_ref = doc.add_paragraph()
        p_ref.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_ref.paragraph_format.first_line_indent = Cm(0)
        p_ref.paragraph_format.space_before = Pt(4)
        p_ref.paragraph_format.space_after = Pt(4)
        p_ref.paragraph_format.line_spacing = 1.15
        r_ref = p_ref.add_run(ref)
        r_ref.font.name = 'Times New Roman'
        r_ref.font.size = Pt(12)
        r_ref.font.color.rgb = RGBColor(0, 0, 0)

    doc.save(output_path)
    print(f"Documento gerado com sucesso em: {output_path}")

if __name__ == "__main__":
    output_file = os.path.join(os.path.dirname(__file__), "Workonnection_Relatorio_Tecnico_Revisado.docx")
    build_relatorio_docx(output_file)
