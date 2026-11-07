import os
import shutil
from PIL import Image
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# =============================================================================
# CORES E FONTES PADRONIZADAS
# =============================================================================
COLOR_RED_CPS = RGBColor(210, 71, 38)     # #D24726 - Laranja/Vermelho Oficial do CPS
COLOR_PRIMARY = RGBColor(0, 123, 138)     # #007B8A - Azul Petróleo Workonnection
COLOR_TITLE = RGBColor(15, 23, 42)        # #0F172A - Ardósia Quase Preto
COLOR_SUBTITLE = RGBColor(71, 85, 105)    # #475569 - Ardósia Médio
COLOR_BODY = RGBColor(30, 41, 59)         # #1E293B - Texto Escuro Legível
COLOR_MUTED = RGBColor(100, 116, 139)     # #64748B - Texto Secundário
COLOR_WHITE = RGBColor(255, 255, 255)
COLOR_GREEN = RGBColor(16, 185, 129)      # #10B981 - Sucesso / Cobertura
COLOR_BORDER = RGBColor(203, 213, 225)    # #CBD5E1 - Borda Suave

FONT_HEADING = "Segoe UI Light"
FONT_BOLD = "Segoe UI Semibold"
FONT_BODY = "Segoe UI"


# =============================================================================
# HELPERS DE FORMATAÇÃO PPTX
# =============================================================================

def remove_shape_element(shape):
    """Remove um elemento de forma do slide com segurança."""
    sp = shape._element
    parent = sp.getparent()
    if parent is not None:
        parent.remove(sp)


def add_badge_circle(slide, left_in, top_in, number_str, diameter_in=0.42):
    """Cria o círculo numérico oficial (#D24726) igual ao template do professor."""
    shape = slide.shapes.add_shape(
        MSO_SHAPE.OVAL,
        Inches(left_in),
        Inches(top_in),
        Inches(diameter_in),
        Inches(diameter_in)
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = COLOR_RED_CPS
    shape.line.fill.background()
    tf = shape.text_frame
    tf.word_wrap = False
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = Inches(0)
    tf.margin_right = Inches(0)
    tf.margin_top = Inches(0)
    tf.margin_bottom = Inches(0)
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    r = p.add_run()
    r.text = str(number_str)
    r.font.name = FONT_BOLD
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = COLOR_WHITE
    return shape


def add_formatted_textbox(slide, left_in, top_in, width_in, height_in, paragraphs_data):
    """
    Adiciona uma caixa de texto com lista de parágrafos estruturados.
    paragraphs_data é uma lista de tuplas:
    (lead_bold, text_normal, font_size, space_after, is_bullet)
    """
    tb = slide.shapes.add_textbox(Inches(left_in), Inches(top_in), Inches(width_in), Inches(height_in))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.04)
    tf.margin_right = Inches(0.04)
    tf.margin_top = Inches(0.02)
    tf.margin_bottom = Inches(0.02)

    for idx, item in enumerate(paragraphs_data):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        lead_bold, text_normal, font_size, space_after, is_bullet = item
        p.space_after = Pt(space_after)
        p.line_spacing = 1.12

        if is_bullet:
            r_bullet = p.add_run()
            r_bullet.text = "• "
            r_bullet.font.name = FONT_BODY
            r_bullet.font.size = Pt(font_size)
            r_bullet.font.bold = True
            r_bullet.font.color.rgb = COLOR_RED_CPS

        if lead_bold:
            r_b = p.add_run()
            r_b.text = lead_bold
            r_b.font.name = FONT_BOLD
            r_b.font.size = Pt(font_size)
            r_b.font.bold = True
            r_b.font.color.rgb = COLOR_TITLE

        if text_normal:
            r_n = p.add_run()
            r_n.text = text_normal
            r_n.font.name = FONT_BODY
            r_n.font.size = Pt(font_size)
            r_n.font.bold = False
            r_n.font.color.rgb = COLOR_BODY

    return tb


def set_speaker_notes(slide, notes_text):
    """Define as anotações do orador no slide."""
    slide.notes_slide.notes_text_frame.text = notes_text.strip()


# =============================================================================
# CONSTRUÇÃO DOS 7 SLIDES SEGUNDO O MODELO
# =============================================================================

def build_fatec_presentation():
    base_pptx = r"C:\Users\paulo\.gemini\antigravity\brain\d52820d4-7b0c-4be5-affd-f37e7ee04a73\.user_uploaded\media_1793831499541_820c0be3.pptx"
    bmc_img_path = r"C:\Users\paulo\.gemini\antigravity\brain\d52820d4-7b0c-4be5-affd-f37e7ee04a73\.user_uploaded\media_1793831507693_e0d711ea.png"
    workonnection_logo = r"c:\Users\paulo\Documents\Workonnection\frontend\public\logo_workonnection.png"
    card_ods_path = r"c:\Users\paulo\Documents\Workonnection\documentacao\assets_slides\card_introducao_ods.png"
    diagrama_arq_path = r"c:\Users\paulo\Documents\Workonnection\documentacao\assets_slides\diagrama_arquitetura_camadas.png"
    chart_jacoco_donut = r"c:\Users\paulo\Documents\Workonnection\documentacao\assets_slides\chart_jacoco_donut.png"

    output_final = r"c:\Users\paulo\Documents\Workonnection\documentacao\Apresentacao_Workonnection_Modelo_Final.pptx"
    output_standard = r"c:\Users\paulo\Documents\Workonnection\documentacao\Apresentacao_Workonnection.pptx"

    prs = pptx.Presentation(base_pptx)
    assert len(prs.slides) == 7, f"Esperado 7 slides no modelo, encontrado {len(prs.slides)}"

    print(">>> Iniciando montagem da apresentação nos 7 slides do modelo...")

    # =========================================================================
    # SLIDE 1: CAPA
    # =========================================================================
    s1 = prs.slides[0]
    # Shape 0: Título 1
    t1 = s1.shapes[0]
    t1.text_frame.text = "Fatec Diadema – Centro Paula Souza"
    p0 = t1.text_frame.paragraphs[0]
    p0.runs[0].font.name = FONT_HEADING
    p0.runs[0].font.size = Pt(40)
    p0.runs[0].font.bold = True
    p0.runs[0].font.color.rgb = COLOR_TITLE

    # Shape 1: Subtítulo 2
    st1 = s1.shapes[1]
    st1.text_frame.text = ""
    p_sub1 = st1.text_frame.paragraphs[0]
    p_sub1.space_after = Pt(10)
    r = p_sub1.add_run()
    r.text = "Disciplina: Laboratório de Desenvolvimento Web (6º Semestre)\n"
    r.font.name = FONT_BOLD
    r.font.size = Pt(18)
    r.font.bold = True
    r.font.color.rgb = COLOR_RED_CPS

    r2 = p_sub1.add_run()
    r2.text = "Workonnection – Plataforma para Divulgação de Vagas Temporárias com Feedback Obrigatório\n\n"
    r2.font.name = FONT_BOLD
    r2.font.size = Pt(17)
    r2.font.bold = True
    r2.font.color.rgb = COLOR_TITLE

    r3 = p_sub1.add_run()
    r3.text = "Autores / Discentes:\n"
    r3.font.name = FONT_BOLD
    r3.font.size = Pt(14)
    r3.font.bold = True
    r3.font.color.rgb = COLOR_SUBTITLE

    r4 = p_sub1.add_run()
    r4.text = (
        "Caroline de Carvalho Mendes  •  Gabriel da Silva Gutierres  •  Guilherme Gomes da Silva\n"
        "Hugo Aparecido de Oliveira Costa  •  Paulo Roberto Santos Elias  •  Priscila de Carvalho Mendes"
    )
    r4.font.name = FONT_BODY
    r4.font.size = Pt(13)
    r4.font.color.rgb = COLOR_BODY

    # Adicionar logo do Workonnection no canto inferior direito para harmonizar com o logo do CPS à esquerda
    if os.path.exists(workonnection_logo):
        s1.shapes.add_picture(workonnection_logo, Inches(9.85), Inches(5.25), width=Inches(2.55))

    set_speaker_notes(s1, """
ROTEIRO DO ORADOR (SLIDE 1 - CAPA):
"Boa noite a todos os professores e colegas. Somos discentes da Fatec Diadema – Centro Paula Souza, no curso de Gestão da Tecnologia da Informação / Desenvolvimento de Software.
Apresentamos hoje o projeto desenvolvido para a disciplina de Laboratório de Desenvolvimento Web, intitulado: 'Workonnection – Plataforma para Divulgação de Vagas Temporárias com Feedback Obrigatório'.
A nossa equipe é composta por: Caroline Mendes, Gabriel Gutierres, Guilherme Silva, Hugo Costa, Paulo Roberto Santos Elias e Priscila Mendes.
Vamos demonstrar como concebemos, desenvolvemos e validamos uma solução full-stack que alia rigor de engenharia de software com impacto social prático alinhado à Agenda 2030 da ONU."
""")

    # =========================================================================
    # SLIDE 2: INTRODUÇÃO
    # =========================================================================
    s2 = prs.slides[1]
    # Shape 0: Título
    s2.shapes[0].text_frame.text = "Introdução"
    p = s2.shapes[0].text_frame.paragraphs[0]
    p.runs[0].font.name = FONT_HEADING
    p.runs[0].font.size = Pt(32)
    p.runs[0].font.color.rgb = COLOR_TITLE

    # Remover imagem antiga de tomates/Designer (Shape 2)
    for sh in list(s2.shapes):
        if sh.name.startswith("Imagem"):
            remove_shape_element(sh)

    # Inserir o novo card visual de ODS e Propósito
    if os.path.exists(card_ods_path):
        s2.shapes.add_picture(card_ods_path, Inches(6.85), Inches(1.42), width=Inches(5.95))

    # Atualizar conteúdo textual à esquerda (Shape 1)
    tb_intro = s2.shapes[1]
    tb_intro.left = Inches(0.58)
    tb_intro.top = Inches(1.35)
    tb_intro.width = Inches(6.10)
    tb_intro.height = Inches(5.60)
    tb_intro.text_frame.text = ""

    intro_data = [
        ("Contexto e Problema de Mercado:", "", 14, 4, True),
        ("", "O mercado brasileiro de trabalho temporário e prestação autônoma de serviços caracteriza-se pela elevada informalidade e carência de canais confiáveis que conectem estudantes e profissionais a oportunidades pontuais.", 12, 10, False),
        ("A Falha Crônica: Ghosting Profissional:", "", 14, 4, True),
        ("", "Plataformas contemporâneas aceleraram o envio de currículos, mas a etapa de encerramento permanece silenciosa e unilateral. Candidatos são recusados sem qualquer devolutiva ou justificativa, o que gera desgaste emocional e impede a identificação de lacunas técnicas (SILVA; RODRIGUES, 2025).", 12, 10, False),
        ("Objetivo do Workonnection:", "", 14, 4, True),
        ("", "Desenvolver e avaliar uma plataforma web full stack voltada a vagas temporárias, instituindo o feedback estruturado obrigatório como regra de negócio nativa na recusa ou conclusão de seleções.", 12, 10, False),
        ("Alinhamento com a Agenda 2030 da ONU:", "", 14, 4, True),
        ("", "• ODS 8 (Trabalho Decente e Crescimento Econômico): relações formais e transparentes, transformando cada seleção em insumo concreto de capacitação.\n• ODS 17 (Parcerias e Meios de Implementação): rede colaborativa unindo empresas, MEIs, autônomos, estudantes e instituições de ensino.", 12, 0, False),
    ]

    for idx, (lead, text, sz, sp_after, is_bul) in enumerate(intro_data):
        p_curr = tb_intro.text_frame.paragraphs[0] if idx == 0 else tb_intro.text_frame.add_paragraph()
        p_curr.space_after = Pt(sp_after)
        p_curr.line_spacing = 1.12
        if lead:
            r = p_curr.add_run()
            r.text = lead + " "
            r.font.name = FONT_BOLD
            r.font.size = Pt(sz)
            r.font.bold = True
            r.font.color.rgb = COLOR_TITLE
        if text:
            r = p_curr.add_run()
            r.text = text
            r.font.name = FONT_BODY
            r.font.size = Pt(sz)
            r.font.color.rgb = COLOR_BODY

    set_speaker_notes(s2, """
ROTEIRO DO ORADOR (SLIDE 2 - INTRODUÇÃO):
"Na Introdução, situamos o problema que motivou o projeto. No Brasil, o trabalho temporário é marcado por informalidade e desconfiança. Mas o ponto crítico que atacamos é o chamado 'ghosting profissional': você se candidata, aguarda dias, e o processo simplesmente fecha sem que ninguém lhe diga por que foi recusado.
Segundo Silva e Rodrigues (2025), essa ausência de feedback gera desgaste emocional crônico e impede o candidato de saber se faltou um certificado, uma habilidade técnica ou uma postura profissional.
O Workonnection resolve isso na raiz arquitetural: desenvolvemos uma plataforma onde o contratante é OBRIGADO pelo software a dar uma devolutiva construtiva para concluir a recusa ou fechar a vaga.
Alinhamos o sistema a dois Objetivos de Desenvolvimento Sustentável da ONU:
1) ODS 8 (Trabalho Decente), combatendo a informalidade e qualificando trabalhadores;
2) ODS 17 (Parcerias e Meios de Implementação), integrando academia, microempreendedores e empresas."
""")

    # =========================================================================
    # SLIDE 3: MODELO DE NEGÓCIO — BUSINESS MODEL CANVAS
    # =========================================================================
    s3 = prs.slides[2]
    # Shape 0: Título
    s3.shapes[0].text_frame.text = "Modelo de negócio — Business Model Canvas"
    p = s3.shapes[0].text_frame.paragraphs[0]
    p.runs[0].font.name = FONT_HEADING
    p.runs[0].font.size = Pt(32)
    p.runs[0].font.color.rgb = COLOR_TITLE

    # Remover imagem antiga placeholder
    for sh in list(s3.shapes):
        if sh.name.startswith("Imagem"):
            remove_shape_element(sh)

    # Inserir imagem oficial do BMC enviada pelo usuário
    if os.path.exists(bmc_img_path):
        # A imagem tem 788x479 (ratio ~1.645).
        # Largura 10.4 polegadas, altura ~6.32 polegadas.
        # Centralizar horizontalmente: (13.333 - 10.4) / 2 = 1.46 in
        s3.shapes.add_picture(bmc_img_path, Inches(1.46), Inches(1.28), width=Inches(10.41))

    set_speaker_notes(s3, """
ROTEIRO DO ORADOR (SLIDE 3 - BUSINESS MODEL CANVAS):
"Apresentamos aqui o Business Model Canvas do Workonnection, modelando a sustentabilidade e operação da solução:
1. Proposta de Valor: conectar empresas, MEIs, CNPJs e estudantes de forma ágil, com comunicação direta e a garantia de um feedback estruturado bilateral. Não é apenas uma lista de vagas, é uma ponte de desenvolvimento e estágios.
2. Segmento de Clientes: estudantes universitários em busca de renda inicial ou estágio; MEIs e autônomos que prestam serviços; e pequenas/médias empresas e startups que necessitam de contratações pontuais ágeis.
3. Parcerias Principais: instituições de ensino superior (como Fatecs e universidades), associações comerciais, MEIs e provedores de infraestrutura em nuvem (Vercel, Render, MongoDB Atlas, Cloudinary).
4. Atividades e Recursos Principais: desenvolvimento full-stack, gestão de usuários com privacidade (LGPD), algoritmo de busca contextual, chat em tempo real via WebSockets e a própria marca Workonnection.
5. Relacionamento e Canais: relação transparente baseada em devolutivas mútuas e notificações em tempo real, distribuída via portal web responsivo e indicações acadêmicas.
6. Custos e Receitas: estrutura enxuta de hospedagem em nuvem, armazenamento de documentos e segurança; monetização futura prevista por taxas por contratação bem-sucedida, vagas patrocinadas e planos premium corporativos."
""")

    # =========================================================================
    # SLIDE 4: MATERIAIS E MÉTODOS (REFERENCIAL TEÓRICO)
    # =========================================================================
    s4 = prs.slides[3]
    # Shape 0: Título
    s4.shapes[0].text_frame.text = "Materiais e Métodos (Referencial Teórico)"
    p = s4.shapes[0].text_frame.paragraphs[0]
    p.runs[0].font.name = FONT_HEADING
    p.runs[0].font.size = Pt(30)
    p.runs[0].font.color.rgb = COLOR_TITLE

    # Shape 1: Subtítulo metodológico
    sh_sub = s4.shapes[1]
    sh_sub.left = Inches(0.58)
    sh_sub.top = Inches(1.22)
    sh_sub.width = Inches(12.10)
    sh_sub.height = Inches(0.40)
    sh_sub.text_frame.text = ""
    p_sub = sh_sub.text_frame.paragraphs[0]
    r_sub = p_sub.add_run()
    r_sub.text = "Abordagem baseada na Engenharia de Software Empírica (ESE) por Estudo de Caso (YIN, 2014; HOLLWECK, 2015; GUEVARA-VEGA et al., 2021) e ISO/IEC 25010."
    r_sub.font.name = FONT_BODY
    r_sub.font.size = Pt(12)
    r_sub.font.italic = True
    r_sub.font.color.rgb = COLOR_SUBTITLE

    # Remover prints antigos da interface do PowerPoint (Imagem 28 e 22)
    for sh in list(s4.shapes):
        if sh.name.startswith("Imagem"):
            remove_shape_element(sh)

    # Inserir diagrama de arquitetura em camadas no lado direito
    if os.path.exists(diagrama_arq_path):
        s4.shapes.add_picture(diagrama_arq_path, Inches(6.95), Inches(1.65), width=Inches(5.80))

    # Ajustar posições dos 4 itens e seus badges à esquerda
    # Badges: Grupo 17, Grupo 32, Grupo 21, Grupo 36
    # Textos: Shapes 3, 5, 7, 9
    method_items = [
        (
            2.10, "1. Processo de Desenvolvimento Ágil (Scrum / Kanban):",
            "Modelo iterativo e incremental em 4 ciclos evolutivos (sprints) entre ago-nov/2026 com equipe de 6 integrantes. Governança com Product Backlog (15 histórias de usuário), quadro Kanban e reuniões semanais de planejamento e retrospectiva (BECK et al., 2001; SOMMERVILLE, 2019; PRESSMAN; MAXIM, 2021)."
        ),
        (
            3.20, "2. Arquitetura em Camadas Desacoplada (MVC + Service Layer):",
            "Isolamento entre View e Model (KRASNER; POPE, 1988). Prevenção do antipadrão Fat Controllers com Service Layer centralizadora de regras transacionais, permissões e validação de feedback obrigatório no Spring Boot 3 / Java 17; SPA no React 19 / TypeScript / Vite (SOMMERVILLE, 2019)."
        ),
        (
            4.45, "3. Gerenciamento de Configuração, CI/CD e Docker:",
            "Controle de versão no GitHub com feature branches e Pull Requests para reactVersion e main. Pipeline no GitHub Actions executando varredura Gitleaks (DevSecOps), lint Node.js 20, MongoDB 7 efêmero no runner, Maven verify e Docker Multi-Stage (Nginx Alpine e Temurin JRE 17)."
        ),
        (
            5.70, "4. Validação e Qualidade de Software em 3 Níveis (ISO/IEC 25010):",
            "Estratégia abrangendo: (i) 22 cenários funcionais caixa-preta em BDD Gherkin (SMART, 2015); (ii) suíte automatizada de 57 testes (JUnit 5, Mockito, MockMvc) com Quality Gate de 70% no JaCoCo; e (iii) testes empíricos de usabilidade com usuários reais (Vitor e Bernardo)."
        )
    ]

    # Encontrar os grupos de badges e textboxes existentes no slide 4
    badge_groups = [sh for sh in s4.shapes if sh.name.startswith("Grupo")]
    text_boxes = [sh for sh in s4.shapes if sh.name.startswith("Espaço Reservado") and sh != sh_sub]

    # Reposicionar e atualizar os 4 pares existentes
    for idx, (top_y, lead, desc) in enumerate(method_items):
        if idx < len(badge_groups):
            bg = badge_groups[idx]
            bg.top = Inches(top_y)
            bg.left = Inches(0.58)

        if idx < len(text_boxes):
            tb = text_boxes[idx]
            tb.top = Inches(top_y - 0.04)
            tb.left = Inches(1.15)
            tb.width = Inches(5.65)
            tb.height = Inches(1.10)
            tb.text_frame.text = ""
            p_item = tb.text_frame.paragraphs[0]
            p_item.space_after = Pt(2)
            p_item.line_spacing = 1.10

            r_title = p_item.add_run()
            r_title.text = lead + "\n"
            r_title.font.name = FONT_BOLD
            r_title.font.size = Pt(13)
            r_title.font.bold = True
            r_title.font.color.rgb = COLOR_TITLE

            r_desc = p_item.add_run()
            r_desc.text = desc
            r_desc.font.name = FONT_BODY
            r_desc.font.size = Pt(11)
            r_desc.font.color.rgb = COLOR_BODY

    set_speaker_notes(s4, """
ROTEIRO DO ORADOR (SLIDE 4 - MATERIAIS E MÉTODOS):
"Em Materiais e Métodos, destacamos o embasamento acadêmico e técnico da nossa engenharia de software:
1. Processo Ágil: adotamos princípios do Manifesto Ágil (Beck, 2001) e Scrum (Sommerville, 2019; Pressman, 2021), operando em 4 sprints ao longo de 3 meses. Mantivemos Product Backlog com 15 histórias de usuário e quadro Kanban.
2. Arquitetura MVC com Service Layer: seguimos Krasner & Pope (1988) e Sommerville (2019) para evitar o antipadrão 'Fat Controllers'. Nossos controllers no Spring Boot são enxutos; toda a regra de negócio e a validação do feedback obrigatório residem na Camada de Serviços. O frontend é uma SPA moderna com React 19 e Vite.
3. Gerenciamento de Configuração e DevSecOps: fluxo de trabalho estrito no GitHub com feature branches integradas via Pull Request. Nossa pipeline no GitHub Actions roda checagem de segredos com Gitleaks, compila o React em Node 20, sobe um container efêmero oficial do MongoDB 7 e executa o ciclo Maven verify.
4. Validação em 3 Níveis: elaboramos 22 cenários formais em BDD Gherkin (Smart, 2015), 57 testes automatizados com trava no JaCoCo e testes empíricos de usabilidade com usuários representativos (Vitor e Bernardo)."
""")

    # =========================================================================
    # SLIDE 5: RESULTADOS — MÉTRICAS DE GERENCIAMENTO E QUALIDADE
    # =========================================================================
    s5 = prs.slides[4]
    # Shape 0: Título
    s5.shapes[0].text_frame.text = "Resultados — Métricas de Gerenciamento e Qualidade"
    p = s5.shapes[0].text_frame.paragraphs[0]
    p.runs[0].font.name = FONT_HEADING
    p.runs[0].font.size = Pt(30)
    p.runs[0].font.color.rgb = COLOR_TITLE

    # Limpar placeholder antigo de texto único (Shape 1) e badge antigo (Shape 2)
    for sh in list(s5.shapes):
        if sh != s5.shapes[0]:
            remove_shape_element(sh)

    # Inserir o gráfico do JaCoCo donut no lado direito
    if os.path.exists(chart_jacoco_donut):
        s5.shapes.add_picture(chart_jacoco_donut, Inches(6.90), Inches(1.50), width=Inches(5.85))

    # Criar 4 blocos de métricas com badges oficiais (1, 2, 3, 4) na esquerda
    # Respondendo exatamente aos requisitos do modelo:
    # "Foram planejadas 15 funções... 20 classes e 5 tabelas... XX linhas de código..."
    metrics_data = [
        (
            1.65, "1", "Escopo Ágil Planejado vs. Entregue (100% Concluído):",
            "Foram planejadas 15 histórias de usuário no Product Backlog e no Plano de Release, com 100% de conclusão nas 4 sprints pelos 6 colaboradores, consolidadas em 8 módulos operacionais integrados em produção."
        ),
        (
            2.95, "2", "Classes do Backend e Persistência NoSQL (MongoDB Atlas):",
            "O projeto é estruturado em mais de 25 classes Java/Spring Boot (Controllers REST, Service Layer, Repositories e DTOs de isolamento). A persistência utiliza 5 coleções documentais principais no MongoDB Atlas: usuarios, vagas, candidaturas, feedbacks e mensagens, com subperfis polimórficos e índices TTL."
        ),
        (
            4.40, "3", "Linhas de Código e Salto de Cobertura JaCoCo (88,86%):",
            "Auditoria de 2.244 linhas de código no backend. A suíte foi expandida para 11 classes de teste, saltando de 34,54% (35 testes) para 88,86% de cobertura de linhas com 57 testes automatizados (JUnit 5, Mockito, MockMvc). Controllers atingiram 100% e serviços centrais superaram 94% de cobertura."
        ),
        (
            5.85, "4", "Validação Empírica de Usabilidade e Desempenho:",
            "100% de conclusão autônoma das tarefas pelos usuários representativos Vitor (Estudante/Candidato) e Bernardo (Empresa/Contratante). O tempo de conclusão do fluxo crítico (candidatura + feedback obrigatório) caiu para menos de 3 minutos, com avaliação unânime de facilidade e clareza."
        )
    ]

    for top_y, num_str, lead_txt, body_txt in metrics_data:
        add_badge_circle(s5, 0.58, top_y, num_str, diameter_in=0.42)
        add_formatted_textbox(
            s5,
            left_in=1.15,
            top_in=top_y - 0.05,
            width_in=5.60,
            height_in=1.25,
            paragraphs_data=[
                (lead_txt + "\n", body_txt, 11, 0, False)
            ]
        )

    set_speaker_notes(s5, """
ROTEIRO DO ORADOR (SLIDE 5 - RESULTADOS E MÉTRICAS):
"Neste slide de Resultados, apresentamos os indicadores quantitativos exatos exigidos pelo modelo da disciplina:
1. Funções planejadas vs entregues: planejamos 15 histórias de usuário e entregamos 100% delas (todas as 15 concluídas) ao longo das 4 iterações, distribuídas em 8 módulos operacionais.
2. Estrutura de Classes e Banco: o backend é composto por mais de 25 classes estruturadas entre Thin Controllers, Services, Repositories e DTOs. Nosso banco NoSQL MongoDB Atlas utiliza 5 coleções documentais principais: usuarios, vagas, candidaturas, feedbacks e mensagens, aproveitando índices TTL para expiração de vagas.
3. Linhas de Código e Testes JaCoCo: auditamos 2.244 linhas no backend. Saltamos de uma cobertura inicial frágil de 34,54% para expressivos 88,86% auditados pelo JaCoCo na esteira CI/CD, com 57 testes executados. Todos os nossos controllers REST atingiram 100% de cobertura.
4. Usabilidade: nos testes empíricos com Vitor e Bernardo, tivemos 100% de sucesso nas tarefas sem suporte, e o fluxo de candidatura e retorno com feedback foi executado em menos de 3 minutos."
""")

    # =========================================================================
    # SLIDE 6: RESULTADOS — SOLID, SERVIÇOS E MÓDULOS ENTREGUES
    # =========================================================================
    s6 = prs.slides[5]
    # Shape 0: Título
    s6.shapes[0].text_frame.text = "Resultados — SOLID, Camada de Serviços e Módulos"
    p = s6.shapes[0].text_frame.paragraphs[0]
    p.runs[0].font.name = FONT_HEADING
    p.runs[0].font.size = Pt(30)
    p.runs[0].font.color.rgb = COLOR_TITLE

    # Shape 1: Subtítulo SOLID
    sh_sub6 = s6.shapes[1]
    sh_sub6.left = Inches(0.58)
    sh_sub6.top = Inches(1.22)
    sh_sub6.width = Inches(12.10)
    sh_sub6.height = Inches(0.40)
    sh_sub6.text_frame.text = ""
    p_sub6 = sh_sub6.text_frame.paragraphs[0]
    r_sub6 = p_sub6.add_run()
    r_sub6.text = "Aplicação prática dos princípios SOLID, abordagem orientada a serviços e módulos implementados no semestre:"
    r_sub6.font.name = FONT_BODY
    r_sub6.font.size = Pt(12)
    r_sub6.font.italic = True
    r_sub6.font.color.rgb = COLOR_SUBTITLE

    # Limpar shapes antigos abaixo do subtítulo para recriar com alinhamento impecável
    for sh in list(s6.shapes):
        if sh != s6.shapes[0] and sh != sh_sub6:
            remove_shape_element(sh)

    # 4 Itens detalhados com badges oficiais:
    solid_items = [
        (
            1.68, "1", "DIP (Inversão de Dependência) & Princípios SOLID Aplicados:",
            "• DIP: Controllers e Services dependem exclusivamente de interfaces e abstrações (ex: UsuarioRepository, VagaRepository via Spring IoC e @Autowired), sem acoplamento a drivers concretos de banco NoSQL.\n"
            "• SRP (Responsabilidade Única): Thin Controllers cuidam unicamente do roteamento HTTP e serialização de DTOs; regras transacionais, permissões e validação de feedback residem estritamente na Service Layer.\n"
            "• ISP (Segregação de Interfaces): Contratos públicos segregados (VagaOperationsContract, CandidaturaOperationsContract, FeedbackOperationsContract) facilitando manutenção e mocks de teste."
        ),
        (
            3.05, "2", "Abordagem Orientada a Serviços e Integração de APIs / Microsserviços:",
            "Toda a lógica corporativa é centralizada em uma Camada de Serviços desacoplada com segurança Spring Security, integrando quatro serviços externos especializados via SDKs oficiais:\n"
            "• Pusher Channels (WebSockets): mensageria em tempo real para chat com confirmação de leitura;\n"
            "• Cloudinary API: upload e entrega em nuvem de fotos e comprovantes (PDF/PNG até 10 MB) com fallback local;\n"
            "• Google Identity Services (OAuth 2.0): login social federado via tokens criptográficos JWT;\n"
            "• JavaMail (SMTP): serviço para disparo de códigos transitórios de verificação cadastral."
        ),
        (
            4.55, "3", "Oito Módulos Funcionais Entregues no Semestre:",
            "M1: Gestão de Contas Multi-Perfil e Privacidade (LGPD) com exclusão de conta em cascata;\n"
            "M2: Upload e Validação de Documentos Comprobatórios em nuvem via Cloudinary;\n"
            "M3: Gestão de Vagas Temporárias com engajamento autoral (curtidas, comentários);\n"
            "M4: Busca Contextual Dinâmica e Filtros por Modalidade (Presencial, Remoto, Híbrido);\n"
            "M5: Candidaturas e Triagem com fluxo de status (EM_CHAT, ALINHAMENTO_FINAL);\n"
            "M6: Feedback Obrigatório Construtivo e Avaliação Recíproca na contratação/recusa;\n"
            "M7: Chat Interno em Tempo Real via Pusher com histórico persistido e exclusão unilateral;\n"
            "M8: Central de Notificações, Autenticação Híbrida e Suporte a Tema Claro/Escuro."
        ),
        (
            6.05, "4", "Matriz de Permissões e Regras de Negócio Blindadas:",
            "• Controle por Perfil: Estudante possui atuação restrita a candidato (bloqueio HTTP 403 para criação de vaga); MEI e Empresas podem contratar ou prestar serviços conforme o papel na oportunidade. Bloqueio estrito de autocandidatura.\n"
            "• Blindagem de Feedback: O método atualizarStatus bloqueia transição direta para status RECUSADO (HTTP 400), exigindo acionamento de recusarComFeedback com motivo e dicas construtivas (HTTP 422 se ausente)."
        )
    ]

    for top_y, num_str, lead_txt, body_txt in solid_items:
        add_badge_circle(s6, 0.58, top_y, num_str, diameter_in=0.42)
        add_formatted_textbox(
            s6,
            left_in=1.15,
            top_in=top_y - 0.05,
            width_in=11.55,
            height_in=1.30,
            paragraphs_data=[
                (lead_txt + "\n", body_txt, 10.5, 0, False)
            ]
        )

    set_speaker_notes(s6, """
ROTEIRO DO ORADOR (SLIDE 6 - SOLID, SERVIÇOS E RECURSOS):
"Neste segundo slide de Resultados, detalhamos a arquitetura de código:
1. Princípios SOLID: aplicamos intensamente o DIP (Inversão de Dependência) com o container IoC do Spring Boot, onde nenhuma classe de negócio conhece a implementação de banco NoSQL — todas operam por interfaces segregadas (ISP). Adotamos o SRP separando Thin Controllers de Service Layers com contratos bem delimitados.
2. Abordagem Orientada a Serviços: a camada de serviços atua como orquestradora central e consome 4 serviços externos via SDKs: Pusher para chat instantâneo WebSockets, Cloudinary para uploads de documentos com fallback local, Google OAuth para autenticação federada e JavaMail para códigos temporários.
3. Oito Módulos Concluídos: cobrimos desde a gestão multi-perfil (Estudante, MEI, ME, Empresa) até a exclusão de conta em cascata inspirada na LGPD, vagas com engajamento, busca dinâmica, chat em tempo real e notificações.
4. Blindagem do Feedback: como diferencial inovador, no backend o método atualizarStatus lança erro HTTP 400 caso alguém tente recusar um candidato diretamente. A única forma permitida é via recusarComFeedback, que valida se o contratante preencheu orientações construtivas (lançando HTTP 422 se faltar dados). A regra é garantida pelo código, não apenas pelo visual."
""")

    # =========================================================================
    # SLIDE 7: CONSIDERAÇÕES FINAIS
    # =========================================================================
    s7 = prs.slides[6]
    # Shape 0: Título
    s7.shapes[0].text_frame.text = "Considerações finais"
    p = s7.shapes[0].text_frame.paragraphs[0]
    p.runs[0].font.name = FONT_HEADING
    p.runs[0].font.size = Pt(32)
    p.runs[0].font.color.rgb = COLOR_TITLE

    # Limpar placeholder antigo de texto único (Shape 1) e badge antigo (Shape 2)
    for sh in list(s7.shapes):
        if sh != s7.shapes[0]:
            remove_shape_element(sh)

    # Subtítulo explicativo
    add_formatted_textbox(
        s7,
        left_in=0.58,
        top_in=1.22,
        width_in=12.10,
        height_in=0.40,
        paragraphs_data=[
            ("", "Dificuldades técnicas vivenciadas pela equipe, superação na engenharia e perspectivas futuras:", 12, 0, False)
        ]
    )

    final_items = [
        (
            1.72, "1", "Dificuldades Técnicas Vivenciadas e Superadas pela Equipe:",
            "• Autenticação Cross-Site e Políticas de CORS: integração da SPA na Vercel com a API Spring Boot na nuvem Render, resolvendo incompatibilidades de cookies de sessão cross-domain (SameSite=None; Secure) e alinhamento de CORS restrito às origens homologadas.\n"
            "• Gestão de Memória da JVM e Healthchecks na CI/CD: estabilização do container MongoDB 7 efêmero na pipeline GitHub Actions e configuração fina da JVM (-XX:MaxRAMPercentage=75.0) para suportar o teto restrito de 512 MB da nuvem Render sem falhas de Out of Memory.\n"
            "• Modelagem NoSQL e Exclusão em Cascata: garantia de integridade relacional entre usuários, vagas, candidaturas e feedbacks em banco orientado a documentos (MongoDB Atlas), executando remoção em cascata coordenada em conformidade com a LGPD sem chaves estrangeiras nativas."
        ),
        (
            3.65, "2", "Síntese dos Resultados e Impacto Social (Agenda 2030 da ONU):",
            "• Alcance pleno de 100% dos objetivos propostos: software modular entregue, 88,86% de cobertura de código auditada pelo JaCoCo e 100% de sucesso nos testes de usabilidade com execução de fluxos completos em menos de 3 minutos.\n"
            "• Contribuição prática aos ODS 8 (Trabalho Decente) e 17 (Parcerias e Meios de Implementação), extinguindo o ghosting profissional no mercado temporário e articulando estudantes, autônomos e contratantes em uma rede auditável e confiável."
        ),
        (
            5.25, "3", "Trabalhos Futuros Mapeados para o Backlog:",
            "• Aplicativo móvel nativo (React Native / Flutter) com notificações push para autônomos em campo;\n"
            "• Validação cadastral automática de documentos comprobatórios via OCR (Reconhecimento Óptico de Caracteres);\n"
            "• Evolução das práticas de privacidade e LGPD (opção de anonimato em avaliações sensíveis e termos de consentimento formais);\n"
            "• Implementação de suíte de testes automatizados ponta a ponta (E2E) com Cypress / Playwright."
        )
    ]

    for top_y, num_str, lead_txt, body_txt in final_items:
        add_badge_circle(s7, 0.58, top_y, num_str, diameter_in=0.42)
        add_formatted_textbox(
            s7,
            left_in=1.15,
            top_in=top_y - 0.05,
            width_in=11.55,
            height_in=1.60,
            paragraphs_data=[
                (lead_txt + "\n", body_txt, 11, 0, False)
            ]
        )

    set_speaker_notes(s7, """
ROTEIRO DO ORADOR (SLIDE 7 - CONSIDERAÇÕES FINAIS):
"Para encerrar, nas Considerações Finais refletimos sobre a jornada e o aprendizado:
1. Dificuldades e Superação: enfrentamos desafios reais de computação em nuvem, especialmente cookies cross-site entre Vercel e Render, limites de memória JVM no plano gratuito da nuvem e a garantia de exclusão em cascata (LGPD) em um banco NoSQL documental que não possui integridade referencial nativa. Superamos todos com engenharia e testes.
2. Impacto Social: comprovamos que a tecnologia pode ser uma alavanca para os ODS 8 e 17, combatendo a precarização e transformando o silêncio seletivo em oportunidade concreta de aprendizado.
3. Próximos Passos: planejamos o aplicativo mobile nativo para trabalhadores externos, validação documental por OCR e suíte E2E automatizada.
Agradecemos à professora Elza e à Fatec Diadema pelo apoio. Estamos abertos a perguntas!"
""")

    # =========================================================================
    # SALVAR A APRESENTAÇÃO FINAL
    # =========================================================================
    prs.save(output_final)
    shutil.copyfile(output_final, output_standard)
    print(f">>> Apresentação gerada com sucesso em:\n 1) {output_final}\n 2) {output_standard}")


if __name__ == "__main__":
    build_fatec_presentation()

