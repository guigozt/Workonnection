import os
import shutil
import textwrap
from PIL import Image, ImageDraw, ImageFont, ImageOps
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# =============================================================================
# PALETA OFICIAL WORKONNECTION (EXTRAÍDA DA LOGO E DO TEMA ESCURO DO SISTEMA)
# =============================================================================
HEX_BG_DARK = (13, 21, 38)        # #0D1526 - Fundo Imersivo Workonnection Dark
HEX_BG_CARD = (24, 36, 58)        # #18243A - Superfície dos Cards
HEX_BG_ALT = (18, 28, 46)         # #121C2E - Card Secundário / Destaque Interno
HEX_BORDER = (45, 64, 94)         # #2D405E - Borda Sutil
HEX_CYAN = (46, 181, 216)         # #2EB5D8 - Azul Ciano Oficial da Logo ("ONNECTION" / Quebra-cabeça)
HEX_TEAL = (0, 123, 138)          # #007B8A - Azul Petróleo (--primary do CSS)
HEX_CORAL = (222, 84, 84)         # #DE5454 - Vermelho Coral Oficial da Logo ("WORK" / Pessoa central)
HEX_CORAL_SOFT = (216, 107, 107)  # #D86B6B - Coral Suave (--header-bg do CSS)
HEX_GREEN = (16, 185, 129)        # #10B981 - Verde Sucesso / Qualidade Aprovada
HEX_AMBER = (245, 158, 11)        # #F59E0B - Âmbar / Destaques e ODS
HEX_PURPLE = (168, 85, 247)       # #A855F7 - Roxo Complementar
HEX_WHITE = (255, 255, 255)
HEX_PEARL = (244, 249, 252)       # #F4F9FC - Fundo Claro p/ Destacar a Logo Oficial
HEX_TEXT = (232, 240, 248)        # #E8F0F8 - Texto Principal Suave
HEX_MUTED = (148, 163, 184)       # #94A3B8 - Texto Secundário / Legendas

C_BG_DARK = RGBColor(*HEX_BG_DARK)
C_BG_CARD = RGBColor(*HEX_BG_CARD)
C_BG_ALT = RGBColor(*HEX_BG_ALT)
C_BORDER = RGBColor(*HEX_BORDER)
C_CYAN = RGBColor(*HEX_CYAN)
C_TEAL = RGBColor(*HEX_TEAL)
C_CORAL = RGBColor(*HEX_CORAL)
C_CORAL_SOFT = RGBColor(*HEX_CORAL_SOFT)
C_GREEN = RGBColor(*HEX_GREEN)
C_AMBER = RGBColor(*HEX_AMBER)
C_PURPLE = RGBColor(*HEX_PURPLE)
C_WHITE = RGBColor(*HEX_WHITE)
C_PEARL = RGBColor(*HEX_PEARL)
C_TEXT = RGBColor(*HEX_TEXT)
C_MUTED = RGBColor(*HEX_MUTED)

FONT_MAIN = "Segoe UI"
FONT_SEMI = "Segoe UI Semibold"
FONT_MONO = "Consolas"

TOTAL_SLIDES = 10


# =============================================================================
# UTILITÁRIOS DE IMAGEM E INFOGRÁFICOS EM ALTA RESOLUÇÃO (PILLOW)
# =============================================================================

def load_font(size, bold=False, mono=False):
    win_fonts = r"C:\Windows\Fonts"
    if mono:
        candidates = ["consolab.ttf" if bold else "consola.ttf", "courbd.ttf" if bold else "cour.ttf"]
    else:
        candidates = ["segoeuib.ttf" if bold else "segoeui.ttf", "arialbd.ttf" if bold else "arial.ttf"]
    for fn in candidates:
        p = os.path.join(win_fonts, fn)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def prepare_logo_assets(public_logo_path, uploaded_logo_path, assets_dir):
    """Prepara um card hero nítido e um selo compacto para a logo oficial do Workonnection."""
    src = public_logo_path if os.path.exists(public_logo_path) else uploaded_logo_path
    im = Image.open(src).convert("RGBA")

    # Se a imagem tiver fundo branco opaco (caso do upload), remove o branco puro preservando bordas
    if im.getpixel((0, 0))[3] == 255 and im.getpixel((0, 0))[:3] == (255, 255, 255):
        datas = list(im.getdata())
        new_data = []
        for r, g, b, a in datas:
            if r > 246 and g > 246 and b > 246:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append((r, g, b, a))
        im.putdata(new_data)

    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)

    clean_path = os.path.join(assets_dir, "logo_workonnection_cropped.png")
    im.save(clean_path, "PNG")

    # Card Hero para a Capa (fundo pérola com borda dupla Ciano/Coral da marca)
    cw, ch = 920, 560
    card = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    d = ImageDraw.Draw(card)
    d.rounded_rectangle((6, 6, cw - 7, ch - 7), radius=42, fill=HEX_PEARL + (255,), outline=HEX_CYAN + (255,), width=7)
    # Barra decorativa superior meio Coral, meio Ciano (assinatura WORK + ONNECTION)
    d.rounded_rectangle((36, 22, cw // 2 - 6, 36), radius=7, fill=HEX_CORAL + (255,))
    d.rounded_rectangle((cw // 2 + 6, 22, cw - 36, 36), radius=7, fill=HEX_CYAN + (255,))

    # Redimensiona a logo mantendo proporção com amplo respiro
    max_lw, max_lh = cw - 130, ch - 130
    ratio = min(max_lw / im.width, max_lh / im.height)
    nw, nh = int(im.width * ratio), int(im.height * ratio)
    logo_resized = im.resize((nw, nh), Image.Resampling.LANCZOS)
    lx = (cw - nw) // 2
    ly = (ch - nh) // 2 + 12
    card.paste(logo_resized, (lx, ly), logo_resized)

    hero_card_path = os.path.join(assets_dir, "logo_hero_card.png")
    card.save(hero_card_path, "PNG")

    # Mini selo para cabeçalhos internos
    mw, mh = 340, 108
    mini = Image.new("RGBA", (mw, mh), (0, 0, 0, 0))
    dm = ImageDraw.Draw(mini)
    dm.rounded_rectangle((2, 2, mw - 3, mh - 3), radius=22, fill=HEX_PEARL + (255,), outline=HEX_CYAN + (230,), width=4)
    m_ratio = min((mw - 36) / im.width, (mh - 20) / im.height)
    mnw, mnh = int(im.width * m_ratio), int(im.height * m_ratio)
    m_logo = im.resize((mnw, mnh), Image.Resampling.LANCZOS)
    mini.paste(m_logo, ((mw - mnw) // 2, (mh - mnh) // 2), m_logo)
    mini_path = os.path.join(assets_dir, "logo_mini_pill.png")
    mini.save(mini_path, "PNG")

    return clean_path, hero_card_path, mini_path


def make_circular_avatar(src_path, dst_path, ring_color=HEX_CYAN, out_size=320):
    im = Image.open(src_path)
    im = ImageOps.exif_transpose(im).convert("RGBA")
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    top = int((h - side) * 0.18) if h > w else (h - side) // 2
    im = im.crop((left, top, left + side, top + side))

    ss = out_size * 2
    im = im.resize((ss - 30, ss - 30), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (ss, ss), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    draw.ellipse((2, 2, ss - 3, ss - 3), fill=ring_color + (255,))
    draw.ellipse((11, 11, ss - 12, ss - 12), fill=HEX_BG_DARK + (255,))

    mask = Image.new("L", (ss - 30, ss - 30), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, ss - 31, ss - 31), fill=255)
    canvas.paste(im, (15, 15), mask)

    canvas = canvas.resize((out_size, out_size), Image.Resampling.LANCZOS)
    canvas.save(dst_path, "PNG")
    return dst_path


def make_framed_illustration(src_path, dst_path, border_color=HEX_CYAN, target_w=1200, target_h=800):
    im = Image.open(src_path).convert("RGBA")
    im = ImageOps.fit(im, (target_w, target_h), method=Image.Resampling.LANCZOS)
    radius = 36
    mask = Image.new("L", (target_w, target_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, target_w - 1, target_h - 1), radius=radius, fill=255)

    out = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    draw = ImageDraw.Draw(out)
    draw.rounded_rectangle((2, 2, target_w - 3, target_h - 3), radius=radius, outline=border_color + (235,), width=5)
    out.save(dst_path, "PNG")
    return dst_path


def draw_vector_star(draw, cx, cy, r_out, r_in, fill_col):
    import math
    pts = []
    for i in range(10):
        ang = -math.pi / 2 + i * math.pi / 5
        r = r_out if i % 2 == 0 else r_in
        pts.append((cx + r * math.cos(ang), cy + r * math.sin(ang)))
    draw.polygon(pts, fill=fill_col)


def draw_wrapped_bullets(draw, x, y, max_chars, bullets, f_text, text_col, dot_col, line_gap=7, item_gap=12):
    """Desenha lista de bullets com triângulo vetorial nítido dentro dos cards."""
    cy = y
    for b in bullets:
        lines = textwrap.wrap(b, width=max_chars)
        for idx, line in enumerate(lines):
            bbox = draw.textbbox((0, 0), line, font=f_text)
            lh = bbox[3] - bbox[1]
            if idx == 0:
                ty_mid = cy + lh // 2 + 3
                draw.polygon([(x + 2, ty_mid - 6), (x + 12, ty_mid), (x + 2, ty_mid + 6)], fill=dot_col + (255,))
            draw.text((x + 24, cy), line, font=f_text, fill=text_col)
            cy += lh + line_gap
        cy += item_gap - line_gap
    return cy


def generate_bmc_infographic(dst_path):
    """Gera o Business Model Canvas completo e imersivo nas cores do Workonnection (Slide 03)."""
    W, H = 2420, 1140
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    f_hdr = load_font(25, bold=True)
    f_txt = load_font(21, bold=False)
    f_val = load_font(22, bold=True)

    gap = 18
    top_h = 740
    bot_y = top_h + gap
    bot_h = H - bot_y - 6
    col_w = (W - 12 - 4 * gap) // 5  # 466 px por coluna

    def draw_bmc_box(bx, by, bw, bh, title, bullets, accent, highlight_bg=False, wrap_chars=34, is_bold_items=False):
        bg = (30, 44, 72, 255) if highlight_bg else HEX_BG_CARD + (255,)
        bw_line = 5 if highlight_bg else 3
        d.rounded_rectangle((bx, by, bx + bw, by + bh), radius=24, fill=bg, outline=accent + (240,), width=bw_line)
        d.rounded_rectangle((bx, by, bx + bw, by + 64), radius=24, fill=HEX_BG_ALT + (255,), outline=accent + (220,), width=2)
        if highlight_bg:
            draw_vector_star(d, bx + 34, by + 32, 13, 6, accent + (255,))
            d.text((bx + 56, by + 32), title.upper(), font=f_hdr, fill=accent, anchor="lm")
        else:
            d.text((bx + 24, by + 32), title.upper(), font=f_hdr, fill=accent, anchor="lm")
        font_use = f_val if is_bold_items else f_txt
        col_use = HEX_WHITE if is_bold_items else HEX_TEXT
        draw_wrapped_bullets(d, bx + 22, by + 84, wrap_chars, bullets, font_use, col_use, accent, line_gap=6, item_gap=13)

    x0 = 6
    x1 = x0 + col_w + gap
    x2 = x1 + col_w + gap
    x3 = x2 + col_w + gap
    x4 = x3 + col_w + gap
    half_h = (top_h - gap) // 2

    # 1. Parcerias Principais
    draw_bmc_box(x0, 6, col_w, top_h, "Parcerias Principais", [
        "Instituições de ensino (Fatecs e universidades)",
        "Empresas e startups contratantes",
        "MEIs e profissionais autônomos",
        "Parceiros tecnológicos (Vercel, Render, Atlas, Cloudinary e Pusher)"
    ], HEX_CYAN, wrap_chars=35)

    # 2A. Atividades Principais
    draw_bmc_box(x1, 6, col_w, half_h, "Atividades-Chave", [
        "Evolução e manutenção da plataforma",
        "Gestão segura de perfis (LGPD)",
        "Divulgação ágil de oportunidades",
        "Mediação de comunicação e feedbacks"
    ], HEX_CYAN, wrap_chars=35)

    # 2B. Recursos Principais
    draw_bmc_box(x1, 6 + half_h + gap, col_w, half_h, "Recursos Principais", [
        "Plataforma web Full Stack responsiva",
        "Banco NoSQL e busca contextual",
        "Marca Workonnection",
        "Equipe de engenharia (6 devs)"
    ], HEX_TEAL, wrap_chars=35)

    # 3. Proposta de Valor (CENTRO EM DESTAQUE CORAL + CIANO)
    draw_bmc_box(x2, 6, col_w, top_h, "Proposta de Valor", [
        "Conectar empresas, MEIs e estudantes em um só lugar",
        "Feedback obrigatório visando o crescimento profissional",
        "Fim do ghosting e avaliação bilateral justa",
        "Ponte ágil para estágios e prestação de serviços",
        "Chat direto em tempo real (Pusher) e histórico auditável"
    ], HEX_CORAL, highlight_bg=True, wrap_chars=33, is_bold_items=True)

    # 4A. Relacionamento
    draw_bmc_box(x3, 6, col_w, half_h, "Relacionamento", [
        "Sistema de avaliação bilateral",
        "Alertas e notificações instantâneas",
        "Chat direto dentro da plataforma",
        "Cultura de feedbacks construtivos"
    ], HEX_AMBER, wrap_chars=35)

    # 4B. Canais
    draw_bmc_box(x3, 6 + half_h + gap, col_w, half_h, "Canais", [
        "Portal web oficial (Desktop/Mobile)",
        "Indicação orgânica entre usuários",
        "Divulgação digital e acadêmica"
    ], HEX_AMBER, wrap_chars=35)

    # 5. Segmento de Clientes
    draw_bmc_box(x4, 6, col_w, top_h, "Segmentos de Clientes", [
        "Pequenas e médias empresas (ME / EPP)",
        "Startups com demandas pontuais",
        "MEIs e prestadores autônomos",
        "Estudantes em busca de experiência",
        "Profissionais buscando renda extra"
    ], HEX_CYAN, wrap_chars=35)

    # Base Esquerda: Estrutura de Custos
    bot_w_left = (W - 12 - gap) // 2
    bot_w_right = W - 12 - gap - bot_w_left
    draw_bmc_box(x0, bot_y, bot_w_left, bot_h, "Estrutura de Custos", [
        "Infraestrutura em nuvem, banco de dados e mídia (CDN)",
        "Manutenção contínua, testes automatizados e segurança",
        "Divulgação digital e custos operacionais/administrativos"
    ], HEX_CORAL_SOFT, wrap_chars=72)

    # Base Direita: Fontes de Receita
    draw_bmc_box(x0 + bot_w_left + gap, bot_y, bot_w_right, bot_h, "Fontes de Receita", [
        "Taxa reduzida por contratação temporária efetivada",
        "Planos Premium corporativos e vagas patrocinadas em destaque",
        "Assinatura opcional para profissionais e parcerias institucionais"
    ], HEX_GREEN, wrap_chars=72)

    img.save(dst_path, "PNG")
    return dst_path


def generate_feedback_shield_diagram(dst_path):
    """Infográfico de alta clareza explicando como a Service Layer blinda o Feedback Obrigatório (Slide 07)."""
    W, H = 1320, 1180
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    d.rounded_rectangle((4, 4, W - 5, H - 5), radius=32, fill=HEX_BG_CARD + (255,), outline=HEX_CORAL + (230,), width=4)

    f_hdr = load_font(30, bold=True)
    f_sub = load_font(22, bold=False)
    f_card_t = load_font(25, bold=True)
    f_mono = load_font(21, bold=True, mono=True)
    f_body = load_font(22, bold=False)
    f_badge = load_font(22, bold=True)

    d.text((46, 38), "BLINDAGEM ANTI-GHOSTING NO CÓDIGO", font=f_hdr, fill=HEX_WHITE)
    d.text((46, 82), "A regra não depende só da tela — a Camada de Serviços protege o candidato:", font=f_sub, fill=HEX_MUTED)

    tracks = [
        (
            150, HEX_CORAL, "x_icon", "TENTATIVA DE RECUSAR EM SILÊNCIO",
            "atualizarStatus(id, RECUSADO)",
            "Se alguém tentar pular o parecer construtivo direto pela API:",
            "BLOQUEADO • Erro HTTP 400 (Transição Proibida)",
            (68, 24, 34, 255)
        ),
        (
            490, HEX_CYAN, "check_icon", "RECUSA CONSTRUTIVA OBRIGATÓRIA",
            "recusarComFeedback(id, motivo, dicas)",
            "Valida preenchimento real (barra vazio com HTTP 422):",
            "APROVADO • Envia dicas ao candidato e mantém vaga aberta",
            (18, 48, 66, 255)
        ),
        (
            830, HEX_GREEN, "star_icon", "CONTRATAÇÃO & FECHAMENTO MÚTUO",
            "enviarFeedback(candidaturaId, avaliacao)",
            "Contratante e candidato avaliam a experiência (bidirecional):",
            "CONCLUÍDO • Salva reputação no perfil e encerra a vaga",
            (16, 54, 44, 255)
        ),
    ]

    for ty, col, icon_kind, title, method_sig, desc, pill_txt, pill_bg in tracks:
        d.rounded_rectangle((42, ty, W - 42, ty + 305), radius=26, fill=HEX_BG_ALT + (255,), outline=col + (225,), width=3)
        icx, icy = 86, ty + 44
        d.ellipse((icx - 20, icy - 20, icx + 20, icy + 20), fill=pill_bg, outline=col + (255,), width=3)
        if icon_kind == "x_icon":
            d.line([(icx - 8, icy - 8), (icx + 8, icy + 8)], fill=col + (255,), width=4)
            d.line([(icx - 8, icy + 8), (icx + 8, icy - 8)], fill=col + (255,), width=4)
        elif icon_kind == "check_icon":
            d.line([(icx - 9, icy + 1), (icx - 2, icy + 8), (icx + 10, icy - 7)], fill=col + (255,), width=4, joint="curve")
        else:
            draw_vector_star(d, icx, icy, 11, 5, col + (255,))

        d.text((118, ty + 44), title, font=f_card_t, fill=col, anchor="lm")

        # Badge de código à direita no topo do card
        sig_w = d.textbbox((0, 0), method_sig, font=f_mono)[2] + 36
        d.rounded_rectangle((W - 70 - sig_w, ty + 22, W - 70, ty + 66), radius=12, fill=HEX_BG_CARD + (255,), outline=HEX_BORDER + (255,), width=2)
        d.text((W - 70 - sig_w // 2, ty + 44), method_sig, font=f_mono, fill=HEX_WHITE, anchor="mm")

        d.text((70, ty + 122), desc, font=f_body, fill=HEX_TEXT, anchor="lm")

        # Pill de resultado
        d.rounded_rectangle((70, ty + 188, W - 70, ty + 268), radius=18, fill=pill_bg, outline=col + (240,), width=3)
        d.text((W // 2, ty + 228), pill_txt, font=f_badge, fill=col, anchor="mm")

    img.save(dst_path, "PNG")
    return dst_path


def generate_quality_jacoco_panel(dst_path):
    """Painel visual unificado do salto de cobertura JaCoCo e cobertura por módulo (Slide 08)."""
    W, H = 1360, 1195
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    d.rounded_rectangle((4, 4, W - 5, H - 5), radius=32, fill=HEX_BG_CARD + (255,), outline=HEX_GREEN + (230,), width=4)

    f_hdr = load_font(30, bold=True)
    f_big1 = load_font(52, bold=True)
    f_big2 = load_font(64, bold=True)
    f_lbl = load_font(24, bold=True)
    f_sub = load_font(22, bold=False)
    f_mod = load_font(24, bold=True)

    d.text((48, 38), "AUDITORIA DE TESTES AUTOMATIZADOS (JACOCO)", font=f_hdr, fill=HEX_GREEN)

    # Top Section: Donuts Antes vs Agora
    cx1, cy1, r1, th1 = 275, 290, 145, 34
    d.arc((cx1 - r1, cy1 - r1, cx1 + r1, cy1 + r1), 0, 360, fill=HEX_BORDER + (255,), width=th1)
    d.arc((cx1 - r1, cy1 - r1, cx1 + r1, cy1 + r1), -90, -90 + 360 * 0.3454, fill=HEX_CORAL + (255,), width=th1)
    d.text((cx1, cy1 - 14), "34,5%", font=f_big1, fill=HEX_CORAL, anchor="mm")
    d.text((cx1, cy1 + 38), "35 Testes", font=f_sub, fill=HEX_MUTED, anchor="mm")
    d.text((cx1, cy1 + r1 + 36), "INÍCIO", font=f_lbl, fill=HEX_CORAL, anchor="mm")

    # Seta de evolução
    d.rounded_rectangle((480, 200, 685, 254), radius=16, fill=HEX_BG_ALT + (255,), outline=HEX_GREEN + (255,), width=3)
    d.text((582, 227), "+54,3 p.p.", font=f_lbl, fill=HEX_GREEN, anchor="mm")
    d.polygon([(495, 278), (620, 278), (620, 258), (668, 294), (620, 330), (620, 310), (495, 310)], fill=HEX_GREEN + (255,))
    d.text((582, 366), "1.994 / 2.244 linhas", font=f_sub, fill=HEX_TEXT, anchor="mm")

    cx2, cy2, r2, th2 = 965, 290, 162, 40
    d.arc((cx2 - r2, cy2 - r2, cx2 + r2, cy2 + r2), 0, 360, fill=HEX_BORDER + (255,), width=th2)
    d.arc((cx2 - r2, cy2 - r2, cx2 + r2, cy2 + r2), -90, -90 + 360 * 0.8886, fill=HEX_GREEN + (255,), width=th2)
    d.text((cx2, cy2 - 16), "88,9%", font=f_big2, fill=HEX_GREEN, anchor="mm")
    d.text((cx2, cy2 + 44), "57 Testes", font=f_lbl, fill=HEX_WHITE, anchor="mm")
    d.text((cx2, cy2 + r2 + 36), "ATUAL (AUDITADO)", font=f_lbl, fill=HEX_GREEN, anchor="mm")

    # Divider
    d.line([(48, 525), (W - 48, 525)], fill=HEX_BORDER + (255,), width=2)
    d.text((48, 554), "COBERTURA NAS PRINCIPAIS CAMADAS (MÍNIMO EXIGIDO: 70%)", font=f_lbl, fill=HEX_CYAN)

    bars = [
        ("Controllers REST", 1.000, "100%", HEX_GREEN),
        ("Notificações & Chat", 0.995, "99,5%", HEX_GREEN),
        ("Usuários & Perfis", 0.984, "98,4%", HEX_GREEN),
        ("Vagas & Filtros", 0.957, "95,7%", HEX_GREEN),
        ("Candidaturas", 0.948, "94,8%", HEX_GREEN),
        ("Feedback & Upload", 0.825, "82,5%", HEX_CYAN),
    ]

    bx = 335
    bw_max = 840
    sy = 618
    rh = 78
    for idx, (lbl, ratio, pct, col) in enumerate(bars):
        y = sy + idx * rh
        d.text((315, y + 23), lbl, font=f_mod, fill=HEX_TEXT, anchor="rm")
        d.rounded_rectangle((bx, y + 4, bx + bw_max, y + 44), radius=16, fill=HEX_BG_ALT + (255,), outline=HEX_BORDER + (255,), width=2)
        fw = int(bw_max * ratio)
        d.rounded_rectangle((bx, y + 4, bx + fw, y + 44), radius=16, fill=col + (255,))
        d.text((bx + bw_max + 20, y + 23), pct, font=f_mod, fill=col, anchor="lm")

    # Linha tracejada da trava de 70%
    gx = bx + int(bw_max * 0.70)
    for yy in range(608, sy + len(bars) * rh - 14, 20):
        d.line([(gx, yy), (gx, yy + 11)], fill=HEX_AMBER + (255,), width=4)

    d.rounded_rectangle((48, 1108, W - 48, 1162), radius=14, fill=HEX_BG_ALT + (255,), outline=HEX_AMBER + (220,), width=2)
    d.text((W // 2, 1135), "Trava Automática JaCoCo na Pipeline: Abaixo de 70% o Pull Request é bloqueado!", font=f_sub, fill=HEX_AMBER, anchor="mm")

    img.save(dst_path, "PNG")
    return dst_path


# =============================================================================
# HELPERS DO POWERPOINT (PPTX)
# =============================================================================

def set_slide_bg(slide, color=C_BG_DARK):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_rect(slide, left, top, width, height, fill_color, border_color=None, border_pt=1.4, rounded=True):
    shape_type = MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE
    shape = slide.shapes.add_shape(shape_type, Inches(left), Inches(top), Inches(width), Inches(height))
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    if rounded and shape.adjustments:
        shape.adjustments[0] = 0.05
    if border_color:
        shape.line.color.rgb = border_color
        shape.line.width = Pt(border_pt)
    else:
        shape.line.fill.background()
    shape.shadow.inherit = False
    return shape


def add_text(slide, left, top, width, height, text, size=14, bold=False, color=C_TEXT,
             align=PP_ALIGN.LEFT, font_name=FONT_MAIN, anchor=MSO_ANCHOR.TOP):
    tb = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    tf.margin_left = Inches(0.04)
    tf.margin_right = Inches(0.04)
    tf.margin_top = Inches(0.02)
    tf.margin_bottom = Inches(0.02)
    p = tf.paragraphs[0]
    p.alignment = align
    p.line_spacing = 1.15
    r = p.add_run()
    r.text = text
    r.font.name = font_name
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.color.rgb = color
    return tb


def add_brand_title(slide, left, top, width, height, size=46):
    """Escreve WORK (Coral) + ONNECTION (Ciano) fielmente à logo oficial."""
    tb = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = tb.text_frame
    tf.word_wrap = False
    tf.margin_left = Inches(0.02)
    p = tf.paragraphs[0]
    r1 = p.add_run()
    r1.text = "WORK"
    r1.font.name = FONT_MAIN
    r1.font.size = Pt(size)
    r1.font.bold = True
    r1.font.color.rgb = C_CORAL

    r2 = p.add_run()
    r2.text = "ONNECTION"
    r2.font.name = FONT_MAIN
    r2.font.size = Pt(size)
    r2.font.bold = True
    r2.font.color.rgb = C_CYAN
    return tb


def add_bullets(slide, left, top, width, height, items, size=13.5, color=C_TEXT, bullet_color=C_CYAN, space_after=8):
    tb = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.04)
    tf.margin_right = Inches(0.04)
    tf.margin_top = Inches(0.02)
    tf.margin_bottom = Inches(0.02)

    for idx, item in enumerate(items):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        p.space_after = Pt(space_after)
        p.line_spacing = 1.15

        r_bul = p.add_run()
        r_bul.text = "• "
        r_bul.font.name = FONT_MAIN
        r_bul.font.size = Pt(size)
        r_bul.font.bold = True
        r_bul.font.color.rgb = bullet_color

        if isinstance(item, tuple):
            bold_part, rest_part = item
            r_b = p.add_run()
            r_b.text = bold_part
            r_b.font.name = FONT_MAIN
            r_b.font.size = Pt(size)
            r_b.font.bold = True
            r_b.font.color.rgb = C_WHITE

            r_t = p.add_run()
            r_t.text = rest_part
            r_t.font.name = FONT_MAIN
            r_t.font.size = Pt(size)
            r_t.font.color.rgb = color
        else:
            r_t = p.add_run()
            r_t.text = item
            r_t.font.name = FONT_MAIN
            r_t.font.size = Pt(size)
            r_t.font.color.rgb = color
    return tb


def add_header(slide, tag, title, slide_num, mini_logo_path=None, accent=C_CYAN):
    # Barra superior bicolor Workonnection (Coral + Ciano)
    add_rect(slide, 0, 0, 5.2, 0.09, C_CORAL, rounded=False)
    add_rect(slide, 5.2, 0, 8.133, 0.09, C_CYAN, rounded=False)

    # Pill da seção
    add_rect(slide, 0.60, 0.26, 3.10, 0.34, C_BG_CARD, border_color=accent, border_pt=1.1)
    add_text(slide, 0.60, 0.26, 3.10, 0.34, f"{slide_num:02d}  •  {tag.upper()}",
             size=10, bold=True, color=accent, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    # Mini logo + Contador à direita
    if mini_logo_path and os.path.exists(mini_logo_path):
        slide.shapes.add_picture(mini_logo_path, Inches(10.35), Inches(0.22), width=Inches(1.38))
    add_text(slide, 11.80, 0.26, 0.93, 0.34, f"{slide_num:02d} / {TOTAL_SLIDES:02d}",
             size=11, bold=True, color=C_MUTED, align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.MIDDLE)

    # Título principal do slide
    add_text(slide, 0.60, 0.68, 12.13, 0.54, title, size=25, bold=True, color=C_WHITE)
    add_rect(slide, 0.60, 1.30, 12.13, 0.02, C_BORDER, rounded=False)


def add_notes(slide, notes_text):
    slide.notes_slide.notes_text_frame.text = notes_text.strip()


# =============================================================================
# CONSTRUÇÃO DOS 10 SLIDES IMERSIVOS DO PROJETO WORKONNECTION
# =============================================================================

def build_immersive_presentation(output_paths, assets_dir, public_logo, uploaded_logo, photos_dir):
    os.makedirs(assets_dir, exist_ok=True)

    # 1. Preparar logo, avatares e ilustrações
    _, hero_logo_card, mini_logo_pill = prepare_logo_assets(public_logo, uploaded_logo, assets_dir)

    card_feedback = make_framed_illustration(
        os.path.join(assets_dir, "ilustracao_feedback.jpg"),
        os.path.join(assets_dir, "imersivo_feedback.png"), HEX_CYAN, 1200, 820
    )
    card_arq = make_framed_illustration(
        os.path.join(assets_dir, "ilustracao_arquitetura.jpg"),
        os.path.join(assets_dir, "imersivo_arquitetura.png"), HEX_CYAN, 1320, 780
    )

    img_bmc = generate_bmc_infographic(os.path.join(assets_dir, "imersivo_bmc.png"))
    img_shield = generate_feedback_shield_diagram(os.path.join(assets_dir, "imersivo_feedback_shield.png"))
    img_jacoco = generate_quality_jacoco_panel(os.path.join(assets_dir, "imersivo_jacoco_panel.png"))

    team_members = [
        ("Caroline Mendes", "Caroline.jpeg", HEX_CORAL),
        ("Gabriel Gutierres", "gabriel.jpg", HEX_CYAN),
        ("Guilherme Silva", "Guilherme.jpeg", HEX_CORAL),
        ("Hugo Costa", "Hugo.jpeg", HEX_CYAN),
        ("Paulo Elias", "Paulo.jpeg", HEX_CORAL),
        ("Priscila Mendes", "Priscila.jpeg", HEX_CYAN),
    ]
    avatars = []
    for full_name, fn, ring in team_members:
        src = os.path.join(photos_dir, fn)
        slug = full_name.split()[0].lower()
        dst = os.path.join(assets_dir, f"imersivo_avatar_{slug}.png")
        if os.path.exists(src):
            make_circular_avatar(src, dst, ring_color=ring, out_size=300)
            avatars.append((full_name, dst))

    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]

    # =========================================================================
    # SLIDE 01 — CAPA IMERSIVA (IDENTIDADE, LOGO OFICIAL & EQUIPE)
    # =========================================================================
    s1 = prs.slides.add_slide(blank)
    set_slide_bg(s1)
    add_rect(s1, 0, 0, 5.5, 0.12, C_CORAL, rounded=False)
    add_rect(s1, 5.5, 0, 7.833, 0.12, C_CYAN, rounded=False)

    # Selo Institucional Fatec Diadema / CPS
    add_rect(s1, 0.65, 0.48, 7.35, 0.40, C_BG_CARD, border_color=C_CYAN, border_pt=1.2)
    add_text(s1, 0.65, 0.48, 7.35, 0.40,
             "FATEC DIADEMA (LUIGI PAPAIZ)  •  CENTRO PAULA SOUZA  •  LAB. DESENVOLVIMENTO WEB",
             size=10, bold=True, color=C_CYAN, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    # Nome com as cores da Logo (WORK em Coral + ONNECTION em Ciano)
    add_brand_title(s1, 0.65, 1.05, 7.60, 0.88, size=46)
    add_text(s1, 0.65, 1.94, 7.75, 0.45,
             "Plataforma de Vagas Temporárias com Feedback Obrigatório",
             size=17.5, bold=True, color=C_WHITE)
    add_text(s1, 0.65, 2.45, 7.65, 0.68,
             "Conexão transparente entre empresas, autônomos, MEIs e estudantes.\n"
             "Processos seletivos auditáveis com feedback estruturado garantido.",
             size=13.5, color=C_MUTED)

    # Card Oficial da Logo Workonnection à direita
    s1.shapes.add_picture(hero_logo_card, Inches(8.55), Inches(0.48), width=Inches(4.12))

    # 4 Pilares de Impacto (Badges visuais rápidos)
    kpis = [
        ("Zero Ghosting", "Devolutiva Obrigatória", C_CORAL),
        ("8 Módulos", "4 Perfis Conectados", C_CYAN),
        ("88,86% Testes", "Qualidade Auditada", C_GREEN),
        ("ODS 8 & 17", "Impacto Social ONU", C_AMBER),
    ]
    for i, (big, sub, col) in enumerate(kpis):
        kx = 0.65 + i * 3.05
        add_rect(s1, kx, 3.38, 2.88, 1.22, C_BG_CARD, border_color=col, border_pt=1.6)
        add_text(s1, kx, 3.52, 2.88, 0.50, big, size=22, bold=True, color=col, align=PP_ALIGN.CENTER)
        add_text(s1, kx, 4.08, 2.88, 0.36, sub, size=12.5, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)

    # Faixa da Equipe com Fotos Circulares
    add_rect(s1, 0.65, 4.88, 12.03, 2.22, C_BG_ALT, border_color=C_BORDER)
    add_text(s1, 0.65, 4.96, 12.03, 0.30,
             "EQUIPE DO PROJETO INTEGRADO", size=10.5, bold=True, color=C_CYAN, align=PP_ALIGN.CENTER)
    for idx, (m_name, av_path) in enumerate(avatars):
        ax = 1.08 + idx * 1.94
        s1.shapes.add_picture(av_path, Inches(ax), Inches(5.32), width=Inches(1.16))
        add_text(s1, ax - 0.32, 6.56, 1.80, 0.42, m_name, size=11.5, bold=True, color=C_TEXT, align=PP_ALIGN.CENTER)

    add_notes(s1, "Slide 01 [Priscila]: Apresentação da equipe. Enfatizar com força a problemática do ghosting e a dor do trabalhador/estudante no mercado temporário para dar grande valor à nossa solução.")

    # =========================================================================
    # SLIDE 02 — O PROBLEMA & NOSSO PROPÓSITO (INTRODUÇÃO + ODS 8 E 17)
    # =========================================================================
    s2 = prs.slides.add_slide(blank)
    set_slide_bg(s2)
    add_header(s2, "Introdução & Propósito", "Do 'Ghosting Profissional' ao Feedback Construtivo", 2, mini_logo_pill, accent=C_CORAL)

    # Ilustração 3D à esquerda + Selos ODS 8 e ODS 17
    s2.shapes.add_picture(card_feedback, Inches(0.60), Inches(1.55), width=Inches(5.65))

    # Dois cards ODS abaixo da ilustração
    add_rect(s2, 0.60, 5.55, 2.75, 1.55, C_BG_CARD, border_color=C_CORAL, border_pt=1.5)
    add_text(s2, 0.68, 5.63, 2.58, 0.34, "ODS 8 • TRABALHO DECENTE", size=11, bold=True, color=C_CORAL)
    add_text(s2, 0.68, 6.00, 2.58, 1.02,
             "• Combate à precarização informal\n"
             "• Relações justas e transparentes\n"
             "• Feedback como capacitação",
             size=10.5, color=C_TEXT)

    add_rect(s2, 3.50, 5.55, 2.75, 1.55, C_BG_CARD, border_color=C_CYAN, border_pt=1.5)
    add_text(s2, 3.58, 5.63, 2.58, 0.34, "ODS 17 • PARCERIAS EM REDE", size=11, bold=True, color=C_CYAN)
    add_text(s2, 3.58, 6.00, 2.58, 1.02,
             "• Rede multissetorial colaborativa\n"
             "• Conexão: Empresas, MEIs e Alunos\n"
             "• Integração com Ensino Superior",
             size=10.5, color=C_TEXT)

    # Coluna Direita: O Problema vs A Virada do Workonnection
    add_rect(s2, 6.52, 1.55, 6.21, 2.55, C_BG_CARD, border_color=C_CORAL, border_pt=1.6)
    add_text(s2, 6.78, 1.68, 5.70, 0.38, "O GARGALO: GHOSTING PROFISSIONAL", size=14.5, bold=True, color=C_CORAL)
    add_bullets(s2, 6.78, 2.14, 5.75, 1.85, [
        ("Silêncio Seletivo: ", "Candidaturas encerradas sem qualquer justificativa."),
        ("Estagnação Técnica: ", "Sem devolutiva, o candidato não identifica onde evoluir."),
        ("Informalidade: ", "Falta de histórico profissional confiável e auditável."),
    ], size=13, bullet_color=C_CORAL, space_after=8)

    add_rect(s2, 6.52, 4.30, 6.21, 2.80, C_BG_CARD, border_color=C_CYAN, border_pt=1.8)
    add_text(s2, 6.78, 4.40, 5.70, 0.36, "A SOLUÇÃO: WORKONNECTION", size=14.5, bold=True, color=C_CYAN)
    add_bullets(s2, 6.78, 4.80, 5.75, 1.55, [
        ("Devolutiva Obrigatória: ", "Recusa ou encerramento exigem parecer construtivo."),
        ("Avaliação Bidirecional: ", "Candidato e contratante avaliam a experiência mútua."),
        ("Rede Multissetorial: ", "Quatro perfis integrados em fluxo ágil e sem silêncio."),
    ], size=12.2, bullet_color=C_CYAN, space_after=5)

    # Selo de Sustentação Científica
    add_rect(s2, 6.78, 6.42, 5.70, 0.54, C_BG_ALT, border_color=C_CORAL, border_pt=1.0)
    add_text(s2, 6.88, 6.44, 5.50, 0.50,
             "Sustentação Científica: SILVA & RODRIGUES (Interface Tecnológica, 2025)\n"
             "Efeitos da falta de feedback na autoestima, motivação e carreira.",
             size=9.2, bold=True, color=C_WHITE)

    add_notes(s2, "Slide 02 [Gabriel]: Citar o artigo científico de Silva & Rodrigues (2025) na Interface Tecnológica, demonstrando que a falta de feedback prejudica a carreira e a autoestima, e conectar com ODS 8 e 17.")

    # =========================================================================
    # SLIDE 03 — MODELO DE NEGÓCIO (BUSINESS MODEL CANVAS VISUAL)
    # =========================================================================
    s3 = prs.slides.add_slide(blank)
    set_slide_bg(s3)
    add_header(s3, "Modelo de Negócio", "Business Model Canvas — Sustentabilidade e Geração de Valor", 3, mini_logo_pill, accent=C_CYAN)

    s3.shapes.add_picture(img_bmc, Inches(0.60), Inches(1.48), width=Inches(12.13))

    add_notes(s3, "Slide 03 [Gabriel]: Business Model Canvas — Enfatizar na Proposta de Valor o Crescimento Profissional contínuo gerado pelo feedback e histórico de reputação.")

    # =========================================================================
    # SLIDE 04 — A PLATAFORMA EM AÇÃO: 4 PERFIS & 8 MÓDULOS ENTREGUES
    # =========================================================================
    s4 = prs.slides.add_slide(blank)
    set_slide_bg(s4)
    add_header(s4, "O Produto Vivo", "Quatro Perfis Conectados & Oito Módulos em Produção", 4, mini_logo_pill, accent=C_CYAN)

    add_text(s4, 0.60, 1.44, 12.13, 0.32, "ESTUDANTE (CANDIDATO EXCLUSIVO) • DEMAIS 3 PERFIS COM AS MESMAS PERMISSÕES OPERACIONAIS:",
             size=11.2, bold=True, color=C_CYAN)

    profiles = [
        ("Estudante / Aluno", "Candidato Exclusivo", "Inscrição em vagas e estágios.\nBloqueio de publicação (HTTP 403).", C_CYAN),
        ("Autônomo / MEI", "Mesmas Permissões", "Publica vagas ou candidata-se.\nTrava lógica de autocandidatura.", C_CORAL),
        ("Microempresa (ME)", "Mesmas Permissões", "Publica vagas ou presta serviços,\nchat direto e seleção com feedback.", C_AMBER),
        ("Empresa", "Mesmas Permissões", "Publica vagas ou presta serviços,\ntriagem estruturada e contratação.", C_GREEN),
    ]
    for i, (p_title, p_role, p_desc, p_col) in enumerate(profiles):
        px = 0.60 + i * 3.08
        add_rect(s4, px, 1.80, 2.90, 1.62, C_BG_CARD, border_color=p_col, border_pt=1.6)
        add_text(s4, px + 0.14, 1.90, 2.62, 0.34, p_title, size=14, bold=True, color=C_WHITE)
        add_text(s4, px + 0.14, 2.24, 2.62, 0.28, p_role.upper(), size=10, bold=True, color=p_col)
        add_text(s4, px + 0.14, 2.55, 2.62, 0.80, p_desc, size=11.2, color=C_TEXT)

    add_text(s4, 0.60, 3.60, 12.13, 0.32, "OS 8 MÓDULOS OPERACIONAIS IMPLEMENTADOS NO SEMESTRE:",
             size=11.5, bold=True, color=C_CORAL)

    modules = [
        ("1. Contas & LGPD", "Subperfis dedicados, perfil público restrito e exclusão em cascata.", C_CYAN),
        ("2. Comprovantes em Nuvem", "Upload seguro de matrícula e CCMEI via Cloudinary (PDF/imagem).", C_CYAN),
        ("3. Mural de Oportunidades", "CRUD autoral de vagas com curtidas, descurtidas e comentários.", C_CORAL),
        ("4. Busca Contextual", "Filtro dinâmico por modalidade: Presencial, Remoto ou Híbrido.", C_CORAL),
        ("5. Triagem de Candidaturas", "Inscrição com apresentação e evolução (Em Chat -> Alinhamento).", C_GREEN),
        ("6. Feedback Obrigatório", "Devolutiva mandatória na recusa/aceite e avaliação da empresa.", C_GREEN),
        ("7. Chat em Tempo Real", "Mensageria instantânea (Pusher), edição e confirmação de leitura.", C_AMBER),
        ("8. Alertas & Login Híbrido", "Notificações em tempo real, acesso E-mail/Google e Tema Escuro.", C_AMBER),
    ]
    for idx, (m_title, m_desc, m_col) in enumerate(modules):
        col_i = idx % 4
        row_i = idx // 4
        mx = 0.60 + col_i * 3.08
        my = 3.98 + row_i * 1.60
        add_rect(s4, mx, my, 2.90, 1.44, C_BG_ALT, border_color=m_col, border_pt=1.3)
        add_text(s4, mx + 0.14, my + 0.12, 2.62, 0.36, m_title, size=12.5, bold=True, color=m_col)
        add_text(s4, mx + 0.14, my + 0.54, 2.62, 0.80, m_desc, size=11.2, color=C_TEXT)

    add_notes(s4, "Slide 04 [Hugo]: Explicar que Estudante é candidato exclusivo e os outros 3 perfis (MEI, ME e Empresa) possuem as mesmas permissões operacionais completas na plataforma.")

    # =========================================================================
    # SLIDE 05 — COMO CONSTRUÍMOS: METODOLOGIA ÁGIL & GOVERNANÇA (MÉTODOS)
    # =========================================================================
    s5 = prs.slides.add_slide(blank)
    set_slide_bg(s5)
    add_header(s5, "Materiais & Métodos", "Como Construímos: Ciclo Ágil, GitHub Flow & ISO/IEC 25010", 5, mini_logo_pill, accent=C_AMBER)

    # Banner superior de Delineamento Metodológico
    add_rect(s5, 0.60, 1.50, 12.13, 0.78, C_BG_ALT, border_color=C_AMBER, border_pt=1.4)
    add_text(s5, 0.82, 1.50, 11.70, 0.78,
             "Método: Engenharia de Software Empírica por Estudo de Caso (ISO/IEC 25010)\n"
             "Avaliação em 3 dimensões: Qualidade Técnica, Usabilidade Real e Impacto Social.",
             size=12.5, bold=True, color=C_TEXT, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    # 3 Colunas Visuais: 1) Scrum Adaptado | 2) Fluxo GitHub | 3) Requisitos & LGPD
    cols = [
        (
            0.60, C_CYAN, "1. GESTÃO ÁGIL (SCRUM ADAPTADO)",
            [
                ("4 Sprints Evolutivas: ", "Ciclos de ago-nov/2026 com 6 colaboradores."),
                ("Ritos Semanais: ", "Planejamento, inspeção de entregas e retrospectiva."),
                ("Product Backlog: ", "15 Histórias de Usuário priorizadas por valor."),
                ("Gestão Visual: ", "Plano de Release consolidado e Kanban no Trello."),
            ]
        ),
        (
            4.72, C_CORAL, "2. GOVERNANÇA DE CÓDIGO (GITHUB)",
            [
                ("Feature Branches: ", "Ramificação isolada para cada funcionalidade."),
                ("Revisão por PR: ", "Pull Requests validados com testes automáticos."),
                ("Branch reactVersion: ", "Consolidação contínua da arquitetura React."),
                ("Branch main: ", "Sincronização estável e homologada para deploy."),
            ]
        ),
        (
            8.84, C_GREEN, "3. REQUISITOS & PRIVACIDADE",
            [
                ("Rastreabilidade: ", "Requisitos e RNFs mapeados aos serviços e testes."),
                ("Inspiração na LGPD: ", "Perfil público restrito a dados essenciais (DTO)."),
                ("Direito ao Esquecimento: ", "Remoção definitiva em cascata a pedido do titular."),
            ]
        ),
    ]

    for cx, c_col, c_title, c_items in cols:
        add_rect(s5, cx, 2.50, 3.89, 4.58, C_BG_CARD, border_color=c_col, border_pt=1.6)
        add_rect(s5, cx, 2.50, 3.89, 0.56, C_BG_ALT, border_color=c_col, border_pt=1.2)
        add_text(s5, cx + 0.16, 2.50, 3.57, 0.56, c_title, size=12.5, bold=True, color=c_col,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        sp_after = 16 if len(c_items) == 3 else 10
        add_bullets(s5, cx + 0.18, 3.22, 3.53, 3.70, c_items, size=12.5, bullet_color=c_col, space_after=sp_after)

    add_notes(s5, "Slide 05 [Hugo]: Apresentar Scrum e GitHub Flow. Frisar com humildade técnica que seguimos práticas 'inspiradas na LGPD', pois ainda não é seguida em sua liturgia formal completa.")

    # =========================================================================
    # SLIDE 06 — ARQUITETURA EM NUVEM & ABORDAGEM ORIENTADA A SERVIÇOS
    # =========================================================================
    s6 = prs.slides.add_slide(blank)
    set_slide_bg(s6)
    add_header(s6, "Arquitetura & Nuvem", "Arquitetura Desacoplada (MVC + Service Layer) & Serviços", 6, mini_logo_pill, accent=C_CYAN)

    # Ilustração 3D à esquerda
    s6.shapes.add_picture(card_arq, Inches(0.60), Inches(1.52), width=Inches(5.85))

    # Card das 4 Integrações Externas abaixo da ilustração
    add_rect(s6, 0.60, 5.18, 5.85, 1.92, C_BG_CARD, border_color=C_CORAL, border_pt=1.5)
    add_text(s6, 0.80, 5.28, 5.45, 0.34, "4 SERVIÇOS EXTERNOS INTEGRADOS (SDKs OFICIAIS):", size=12.5, bold=True, color=C_CORAL)
    add_bullets(s6, 0.80, 5.64, 5.45, 1.38, [
        ("Pusher Channels: ", "Chat em tempo real com status e recibo de leitura."),
        ("Cloudinary API: ", "Armazenamento em nuvem de fotos e documentos (fallback local)."),
        ("Google OAuth2 & JavaMail: ", "Login social federado e envio de códigos transitórios."),
    ], size=12, bullet_color=C_CORAL, space_after=4)

    # Direita: As 3 Camadas explicadas sem jargão pesado
    tiers = [
        (
            1.52, C_CYAN, "1. VIEW — FRONTEND SPA (VERCEL CDN)",
            "React 19  •  TypeScript  •  Vite",
            "SPA fluida e responsiva. Comunicação REST via Axios e escuta de eventos assíncronos via Pusher JS."
        ),
        (
            3.42, C_GREEN, "2. REGRAS & NEGÓCIO — BACKEND (RENDER DOCKER)",
            "Java 17  •  Spring Boot 3.5  •  Spring Security",
            "Thin Controllers para roteamento REST + Service Layer centralizando regras, permissões e validação de feedback."
        ),
        (
            5.32, C_AMBER, "3. DADOS EM NUVEM — NOSQL (MONGODB ATLAS)",
            "MongoDB Atlas  •  Spring Data Repository",
            "Modelo documental flexível para os 4 subperfis polimórficos e expiração automática de vagas com índice TTL."
        ),
    ]
    for ty, t_col, t_head, t_tech, t_desc in tiers:
        add_rect(s6, 6.72, ty, 6.01, 1.74, C_BG_CARD, border_color=t_col, border_pt=1.6)
        add_text(s6, 6.94, ty + 0.12, 5.58, 0.34, t_head, size=12.5, bold=True, color=t_col)
        add_text(s6, 6.94, ty + 0.46, 5.58, 0.32, t_tech, size=13.5, bold=True, color=C_WHITE)
        add_text(s6, 6.94, ty + 0.82, 5.58, 0.82, t_desc, size=12, color=C_TEXT)

    add_notes(s6, "Slide 06 [Guilherme]: Apresentar a arquitetura desacoplada em 3 camadas, padrão MVC com Camada de Serviços (sem Fat Controllers) e as 4 integrações externas.")

    # =========================================================================
    # SLIDE 07 — ENGENHARIA NO CÓDIGO: SOLID NA PRÁTICA & BLINDAGEM DO FEEDBACK
    # =========================================================================
    s7 = prs.slides.add_slide(blank)
    set_slide_bg(s7)
    add_header(s7, "SOLID & Regras de Negócio", "Boas Práticas SOLID & Como o Código Blinda o Feedback", 7, mini_logo_pill, accent=C_CORAL)

    # Coluna Esquerda: SOLID explicado de forma simples e aplicada
    add_text(s7, 0.60, 1.48, 5.65, 0.34, "PRINCÍPIOS SOLID APLICADOS NA ARQUITETURA:", size=12, bold=True, color=C_CYAN)

    solid_cards = [
        (
            1.88, C_CYAN, "DIP — Inversão de Dependência",
            "Controllers e Services dependem de interfaces abstratas (Repository), desacoplados do driver NoSQL concreto via Spring IoC (@Autowired)."
        ),
        (
            3.66, C_GREEN, "SRP — Responsabilidade Única",
            "Controladores finos cuidam do transporte HTTP/DTOs; a Camada de Serviços orquestra as regras de negócio e validações."
        ),
        (
            5.44, C_AMBER, "ISP — Segregação de Interfaces",
            "Contratos públicos segregados por domínio (Vagas, Candidaturas e Feedbacks), espelhados entre DTOs Java e interfaces TypeScript."
        ),
    ]
    for sy, s_col, s_title, s_desc in solid_cards:
        add_rect(s7, 0.60, sy, 5.65, 1.62, C_BG_CARD, border_color=s_col, border_pt=1.6)
        add_text(s7, 0.82, sy + 0.14, 5.22, 0.36, s_title, size=14.5, bold=True, color=s_col)
        add_text(s7, 0.82, sy + 0.54, 5.22, 0.96, s_desc, size=12, color=C_TEXT)

    # Coluna Direita: Diagrama Visual de Blindagem Anti-Ghosting
    s7.shapes.add_picture(img_shield, Inches(6.50), Inches(1.50), width=Inches(6.23))

    add_notes(s7, "Slide 07 [Paulo]: Princípios SOLID (DIP, SRP, ISP) e detalhar a blindagem na API contra ghosting (HTTP 400 em recusa direta e 422 em feedback vazio).")

    # =========================================================================
    # SLIDE 08 — QUALIDADE AUTOMATIZADA: BDD, CI/CD, JACOCO & DOCKER
    # =========================================================================
    s8 = prs.slides.add_slide(blank)
    set_slide_bg(s8)
    add_header(s8, "Qualidade & DevSecOps", "Testes BDD, Esteira CI/CD Automatizada, JaCoCo & Docker", 8, mini_logo_pill, accent=C_GREEN)

    # Esquerda: Os 3 Pilares de Confiança (BDD + Pipeline + Docker)
    pillars = [
        (
            1.52, C_CYAN, "1. ESPECIFICAÇÃO BDD (22 CENÁRIOS)",
            [
                ("Linguagem Gherkin: ", "'Dado que... Quando... Então...' unindo regra e teste."),
                ("Escopo Funcional: ", "Valida Cadastro, Uploads, Vagas, Chat e Alertas."),
            ]
        ),
        (
            3.38, C_CORAL, "2. ESTEIRA CI/CD (GITHUB ACTIONS)",
            [
                ("DevSecOps: ", "Varredura contínua contra segredos expostos (Gitleaks)."),
                ("Testes Isolados: ", "Build React (Node 20) + ciclo Maven verify com Mongo 7 efêmero."),
            ]
        ),
        (
            5.24, C_AMBER, "3. CONTAINERS DOCKER OTIMIZADOS",
            [
                ("Multi-Stage Builds: ", "Imagens enxutas, usuário non-root e JVM calibrada a 75% da RAM."),
                ("Comando Único: ", "docker compose up orquestra Banco, API e Front padronizados."),
            ]
        ),
    ]
    for py, p_col, p_head, p_buls in pillars:
        add_rect(s8, 0.60, py, 5.75, 1.70, C_BG_CARD, border_color=p_col, border_pt=1.6)
        add_text(s8, 0.82, py + 0.12, 5.32, 0.34, p_head, size=13, bold=True, color=p_col)
        add_bullets(s8, 0.82, py + 0.50, 5.32, 1.10, p_buls, size=12, bullet_color=p_col, space_after=6)

    # Direita: Painel Gráfico JaCoCo (34,5% -> 88,9% + Barras por Módulo)
    s8.shapes.add_picture(img_jacoco, Inches(6.58), Inches(1.52), width=Inches(6.15))

    add_notes(s8, "Slide 08 [Paulo]: DevSecOps com 22 cenários BDD, esteira GitHub Actions com Gitleaks e Mongo 7, JaCoCo a 88,86% (trava de 70%) e Docker Multi-stage.")

    # =========================================================================
    # SLIDE 09 — RESULTADOS EM NÚMEROS & VALIDAÇÃO COM USUÁRIOS REAIS
    # =========================================================================
    s9 = prs.slides.add_slide(blank)
    set_slide_bg(s9)
    add_header(s9, "Resultados & Validação", "Raio-X Quantitativo do Projeto & Testes com Usuários Reais", 9, mini_logo_pill, accent=C_CYAN)

    # Faixa Superior: 4 Big Numbers respondendo diretamente ao norte da disciplina
    metrics = [
        ("15 / 15", "100% das Histórias", "Concluídas nas 4 Sprints (8 módulos operacionais)", C_GREEN),
        ("70 + 76", "Arquivos Modulares", "70 classes/interfaces Java + 76 módulos React/TS", C_CYAN),
        ("5 Coleções", "MongoDB Atlas", "usuarios, vagas, candidaturas, feedbacks e mensagens", C_CORAL),
        ("+17 mil", "Linhas de Código", "2.244 linhas executáveis auditadas pelo JaCoCo na API", C_AMBER),
    ]
    for i, (m_big, m_mid, m_sub, m_col) in enumerate(metrics):
        mx = 0.60 + i * 3.08
        add_rect(s9, mx, 1.52, 2.90, 1.82, C_BG_CARD, border_color=m_col, border_pt=1.7)
        add_text(s9, mx, 1.64, 2.90, 0.54, m_big, size=25, bold=True, color=m_col, align=PP_ALIGN.CENTER)
        add_text(s9, mx + 0.12, 2.22, 2.66, 0.34, m_mid, size=13, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)
        add_text(s9, mx + 0.12, 2.58, 2.66, 0.66, m_sub, size=11, color=C_MUTED, align=PP_ALIGN.CENTER)

    # Faixa Inferior: Jornada de Usabilidade com Vitor (Estudante) & Bernardo (Empresa)
    add_rect(s9, 0.60, 3.58, 12.13, 3.52, C_BG_ALT, border_color=C_CYAN, border_pt=1.5)
    add_text(s9, 0.85, 3.70, 11.60, 0.38,
             "VALIDAÇÃO EMPÍRICA DE USABILIDADE COM USUÁRIOS REAIS — VITOR (ESTUDANTE) & BERNARDO (EMPRESA)",
             size=13, bold=True, color=C_CYAN)

    # 3 Etapas horizontais da validação
    steps = [
        (
            0.85, C_AMBER, "1ª Rodada • Beta Exploratório",
            "• Testes autônomos: 15 min (aluno) e 7 min (empresa).\n"
            "• Apontamentos: demanda por login tradicional, destaque em erros e Tema Escuro."
        ),
        (
            4.86, C_CYAN, "Refatoração Ágil Imediata",
            "• Implementação de autenticação híbrida (E-mail + Google).\n"
            "• Adição de tema claro/escuro e realce de alertas visuais.\n"
            "• Simplificação dos botões de candidatura e feedback."
        ),
        (
            8.87, C_GREEN, "2ª Rodada • Fluxo Consolidado",
            "• 100% de conclusão das tarefas sem auxílio prévio.\n"
            "• Fluxo completo (candidatura + feedback) em MENOS DE 3 MINUTOS!\n"
            "• Avaliação pós-teste: Fácil, Claro e Muito Valioso."
        ),
    ]
    for sx, s_col, s_t, s_b in steps:
        add_rect(s9, sx, 4.20, 3.62, 2.68, C_BG_CARD, border_color=s_col, border_pt=1.5)
        add_text(s9, sx + 0.18, 4.34, 3.26, 0.36, s_t, size=13.5, bold=True, color=s_col)
        add_text(s9, sx + 0.18, 4.78, 3.26, 1.96, s_b, size=12, color=C_TEXT)

    add_notes(s9, "Slide 09 [Paulo]: Métricas consolidadas do projeto (15/15 histórias, 146 arquivos) e resultados dos testes de usabilidade com Vitor e Bernardo (< 3 min).")

    # =========================================================================
    # SLIDE 10 — CONSIDERAÇÕES FINAIS: DESAFIOS, FUTURO & AGRADECIMENTO
    # =========================================================================
    s10 = prs.slides.add_slide(blank)
    set_slide_bg(s10)
    add_header(s10, "Considerações Finais", "Desafios Superados na Prática & Próximos Passos", 10, mini_logo_pill, accent=C_CORAL)

    # Esquerda: Dificuldades Reais Superadas
    add_rect(s10, 0.60, 1.50, 5.92, 4.05, C_BG_CARD, border_color=C_CORAL, border_pt=1.6)
    add_text(s10, 0.84, 1.64, 5.45, 0.38, "PRINCIPAIS DESAFIOS TÉCNICOS SUPERADOS", size=14.5, bold=True, color=C_CORAL)
    add_bullets(s10, 0.84, 2.12, 5.45, 3.25, [
        ("Sessões e CORS entre Nuvens: ", "Cookies cross-site seguros e alinhamento de CORS entre Vercel e Render."),
        ("Limite de 512 MB de RAM: ", "Calibração da JVM (-XX:MaxRAMPercentage=75.0) e healthchecks do MongoDB."),
        ("Exclusão em Cascata NoSQL: ", "Garantia de limpeza coordenada em 5 coleções atendendo à LGPD."),
    ], size=12.5, bullet_color=C_CORAL, space_after=10)

    # Direita: Trabalhos Futuros
    add_rect(s10, 6.81, 1.50, 5.92, 4.05, C_BG_CARD, border_color=C_CYAN, border_pt=1.6)
    add_text(s10, 7.05, 1.64, 5.45, 0.38, "PRÓXIMOS PASSOS (EVOLUÇÃO DO PRODUTO)", size=14.5, bold=True, color=C_CYAN)
    add_bullets(s10, 7.05, 2.12, 5.45, 3.25, [
        ("Aplicativo Mobile Nativo: ", "Notificações push em tempo real para profissionais em campo."),
        ("Validação por OCR: ", "Reconhecimento automatizado de matrícula e CCMEI enviados."),
        ("Anonimato & LGPD Plena: ", "Opção de sigilo em avaliações sensíveis e termos formais de adesão."),
        ("Testes Ponta a Ponta (E2E): ", "Automação visual completa no React com Playwright."),
    ], size=12.5, bullet_color=C_CYAN, space_after=8)

    # Banner Final de Encerramento com Equipe e Identidade Workonnection
    add_rect(s10, 0.60, 5.75, 12.13, 1.35, C_BG_ALT, border_color=C_CYAN, border_pt=1.8)
    add_rect(s10, 0.60, 5.75, 0.16, 1.35, C_CORAL, rounded=False)
    add_text(s10, 0.96, 5.88, 6.50, 0.48, "OBRIGADO PELA ATENÇÃO!", size=22, bold=True, color=C_WHITE)
    add_text(s10, 0.96, 6.38, 6.50, 0.52,
             "Workonnection — Transformando cada candidatura em respeito, transparência e evolução.",
             size=13, bold=True, color=C_CYAN)

    for idx, (_, av_path) in enumerate(avatars):
        ax = 7.78 + idx * 0.78
        s10.shapes.add_picture(av_path, Inches(ax), Inches(6.04), width=Inches(0.70))

    add_notes(s10, "Slide 10 [Caroline]: Desafios técnicos superados (CORS, 512 MB JVM, integridade NoSQL), próximos passos do backlog e agradecimento final abrindo para perguntas.")

    for out_p in output_paths:
        prs.save(out_p)
        print(f"Apresentacao imersiva salva com sucesso em: {out_p}")


if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    outputs = [
        os.path.join(base_dir, "Apresentacao_Workonnection_Imersiva.pptx"),
        os.path.join(base_dir, "Apresentacao_Workonnection.pptx"),
    ]
    assets_folder = os.path.join(base_dir, "assets_slides")
    pub_logo = os.path.abspath(os.path.join(base_dir, "..", "frontend", "public", "logo_workonnection.png"))
    up_logo = r"C:\Users\paulo\.gemini\antigravity\brain\a2299e51-0a15-4e5a-8552-245d21b9505b\.user_uploaded\media_1793836337681_94cc2394.png"
    photos_folder = os.path.abspath(os.path.join(base_dir, "..", "frontend", "src", "assets", "photoMembers"))
    build_immersive_presentation(outputs, assets_folder, pub_logo, up_logo, photos_folder)
