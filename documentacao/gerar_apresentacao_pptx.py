import os
from PIL import Image, ImageDraw, ImageFont, ImageOps
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# Paleta Oficial Workonnection
HEX_BG_DARK = (15, 23, 42)        # #0F172A
HEX_BG_CARD = (30, 41, 59)        # #1E293B
HEX_BG_ALT = (23, 33, 50)         # #172132
HEX_BORDER = (51, 65, 85)         # #334155
HEX_PRIMARY = (0, 123, 138)       # #007B8A
HEX_CYAN = (56, 189, 248)         # #38BDF8
HEX_CORAL = (216, 107, 107)       # #D86B6B
HEX_GREEN = (16, 185, 129)        # #10B981
HEX_AMBER = (245, 158, 11)        # #F59E0B
HEX_PURPLE = (168, 85, 247)       # #A855F7
HEX_WHITE = (255, 255, 255)
HEX_TEXT = (241, 245, 249)
HEX_MUTED = (148, 163, 184)

C_BG_DARK = RGBColor(*HEX_BG_DARK)
C_BG_CARD = RGBColor(*HEX_BG_CARD)
C_BG_CARD_ALT = RGBColor(*HEX_BG_ALT)
C_BORDER = RGBColor(*HEX_BORDER)
C_PRIMARY = RGBColor(*HEX_PRIMARY)
C_CYAN = RGBColor(*HEX_CYAN)
C_CORAL = RGBColor(*HEX_CORAL)
C_GREEN = RGBColor(*HEX_GREEN)
C_AMBER = RGBColor(*HEX_AMBER)
C_PURPLE = RGBColor(*HEX_PURPLE)
C_WHITE = RGBColor(*HEX_WHITE)
C_TEXT = RGBColor(*HEX_TEXT)
C_MUTED = RGBColor(*HEX_MUTED)

FONT_MAIN = "Segoe UI"
FONT_MONO = "Consolas"


# =============================================================================
# GERADOR DE IMAGENS, AVATARES E GRÁFICOS DE ALTA RESOLUÇÃO (PILLOW)
# =============================================================================

def load_font(size, bold=False, mono=False):
    win_fonts = r"C:\Windows\Fonts"
    candidates = []
    if mono:
        candidates = ["consolab.ttf" if bold else "consola.ttf", "courbd.ttf" if bold else "cour.ttf"]
    else:
        candidates = ["segoeuib.ttf" if bold else "segoeui.ttf", "arialbd.ttf" if bold else "arial.ttf"]
    for fn in candidates:
        p = os.path.join(win_fonts, fn)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def make_circular_avatar(src_path, dst_path, ring_color=HEX_CYAN, out_size=320):
    im = Image.open(src_path)
    im = ImageOps.exif_transpose(im).convert("RGBA")
    w, h = im.size
    side = min(w, h)
    left = (w - side) // 2
    # Leve viés superior para retratos verticais enquadrarem bem o rosto
    top = int((h - side) * 0.18) if h > w else (h - side) // 2
    im = im.crop((left, top, left + side, top + side))

    ss = out_size * 2  # Supersampling 2x para borda perfeitamente suave
    im = im.resize((ss - 28, ss - 28), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (ss, ss), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    draw.ellipse((2, 2, ss - 3, ss - 3), fill=ring_color + (255,))
    draw.ellipse((10, 10, ss - 11, ss - 11), fill=HEX_BG_DARK + (255,))

    mask = Image.new("L", (ss - 28, ss - 28), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, ss - 29, ss - 29), fill=255)
    canvas.paste(im, (14, 14), mask)

    canvas = canvas.resize((out_size, out_size), Image.Resampling.LANCZOS)
    canvas.save(dst_path, "PNG")
    return dst_path


def make_framed_illustration(src_path, dst_path, border_color=HEX_CYAN, target_w=1200, target_h=820):
    im = Image.open(src_path).convert("RGBA")
    im = ImageOps.fit(im, (target_w, target_h), method=Image.Resampling.LANCZOS)

    radius = 36
    mask = Image.new("L", (target_w, target_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, target_w - 1, target_h - 1), radius=radius, fill=255)

    out = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)

    draw = ImageDraw.Draw(out)
    draw.rounded_rectangle((2, 2, target_w - 3, target_h - 3), radius=radius, outline=border_color + (230,), width=5)
    out.save(dst_path, "PNG")
    return dst_path


def generate_jacoco_donut_chart(dst_path):
    W, H = 1320, 960
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Card container
    d.rounded_rectangle((4, 4, W - 5, H - 5), radius=32, fill=HEX_BG_CARD + (255,), outline=HEX_GREEN + (220,), width=4)

    f_title = load_font(30, bold=True)
    f_big_before = load_font(56, bold=True)
    f_big_after = load_font(68, bold=True)
    f_lbl = load_font(25, bold=True)
    f_sub = load_font(22, bold=False)
    f_pill = load_font(24, bold=True)

    d.text((48, 36), "SALTO DE COBERTURA GLOBAL", font=f_title, fill=HEX_GREEN)

    # Left Donut (Antes: 34.54%)
    cx1, cy1, r1, thick1 = 300, 365, 165, 36
    bbox1 = (cx1 - r1, cy1 - r1, cx1 + r1, cy1 + r1)
    d.arc(bbox1, start=0, end=360, fill=HEX_BORDER + (255,), width=thick1)
    d.arc(bbox1, start=-90, end=-90 + 360 * 0.3454, fill=HEX_CORAL + (255,), width=thick1)
    d.text((cx1, cy1 - 16), "34,5%", font=f_big_before, fill=HEX_CORAL, anchor="mm")
    d.text((cx1, cy1 + 42), "35 Testes", font=f_sub, fill=HEX_MUTED, anchor="mm")
    d.text((cx1, cy1 + r1 + 44), "ANTES", font=f_lbl, fill=HEX_CORAL, anchor="mm")

    # Center Arrow + Gain Badge
    d.polygon([(535, 348), (615, 348), (615, 330), (655, 365), (615, 400), (615, 382), (535, 382)], fill=HEX_GREEN + (255,))
    d.rounded_rectangle((515, 255, 675, 308), radius=18, fill=HEX_BG_ALT + (255,), outline=HEX_GREEN + (255,), width=3)
    d.text((595, 281), "+54,3 p.p.", font=f_pill, fill=HEX_GREEN, anchor="mm")

    # Right Donut (Agora: 88.86%)
    cx2, cy2, r2, thick2 = 965, 365, 195, 44
    bbox2 = (cx2 - r2, cy2 - r2, cx2 + r2, cy2 + r2)
    d.arc(bbox2, start=0, end=360, fill=HEX_BORDER + (255,), width=thick2)
    d.arc(bbox2, start=-90, end=-90 + 360 * 0.8886, fill=HEX_GREEN + (255,), width=thick2)
    d.text((cx2, cy2 - 18), "88,9%", font=f_big_after, fill=HEX_GREEN, anchor="mm")
    d.text((cx2, cy2 + 46), "57 Testes", font=f_lbl, fill=HEX_WHITE, anchor="mm")
    d.text((cx2, cy2 + r2 + 44), "AGORA (AUDITADO)", font=f_lbl, fill=HEX_GREEN, anchor="mm")

    # Bottom 4 Mini Metric Pills
    metrics = [
        ("Linhas", "88,9%", "1.994/2.244", HEX_GREEN),
        ("Bytecode", "87,5%", "8.358/9.549", HEX_CYAN),
        ("Métodos", "87,2%", "615/705", HEX_PURPLE),
        ("Branches", "59,1%", "524/887", HEX_AMBER),
    ]
    pw, ph, gap = 285, 185, 28
    start_x = 48
    by = 720
    for i, (m_name, m_val, m_raw, m_col) in enumerate(metrics):
        px = start_x + i * (pw + gap)
        d.rounded_rectangle((px, by, px + pw, by + ph), radius=20, fill=HEX_BG_ALT + (255,), outline=m_col + (200,), width=3)
        d.text((px + pw // 2, by + 42), m_name.upper(), font=load_font(21, bold=True), fill=HEX_MUTED, anchor="mm")
        d.text((px + pw // 2, by + 98), m_val, font=load_font(40, bold=True), fill=m_col, anchor="mm")
        d.text((px + pw // 2, by + 150), m_raw, font=load_font(20), fill=HEX_TEXT, anchor="mm")

    img.save(dst_path, "PNG")
    return dst_path


def generate_jacoco_modules_chart(dst_path):
    W, H = 1480, 960
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    d.rounded_rectangle((4, 4, W - 5, H - 5), radius=32, fill=HEX_BG_CARD + (255,), outline=HEX_CYAN + (220,), width=4)

    f_title = load_font(30, bold=True)
    f_mod = load_font(25, bold=True)
    f_pct = load_font(26, bold=True)
    f_gate = load_font(22, bold=True)

    d.text((48, 36), "COBERTURA POR CAMADA & TRAVA MÍNIMA (70%)", font=f_title, fill=HEX_CYAN)

    modules = [
        ("Controllers REST", 1.000, "100%", HEX_GREEN),
        ("NotificacaoService", 1.000, "100%", HEX_GREEN),
        ("ChatService", 0.990, "99,0%", HEX_GREEN),
        ("UsuarioService", 0.984, "98,4%", HEX_GREEN),
        ("VagaService", 0.957, "95,7%", HEX_GREEN),
        ("CandidaturaService", 0.948, "94,8%", HEX_GREEN),
        ("FeedbackService", 0.825, "82,5%", HEX_CYAN),
        ("FileStorageService", 0.704, "70,4%", HEX_CYAN),
    ]

    bar_x = 355
    bar_max_w = 930
    start_y = 135
    row_h = 88

    for idx, (name, ratio, txt, col) in enumerate(modules):
        y = start_y + idx * row_h
        d.text((335, y + 24), name, font=f_mod, fill=HEX_TEXT, anchor="rm")
        # Background track
        d.rounded_rectangle((bar_x, y + 6, bar_x + bar_max_w, y + 46), radius=16, fill=HEX_BG_ALT + (255,), outline=HEX_BORDER + (255,), width=2)
        # Filled bar
        fill_w = max(40, int(bar_max_w * ratio))
        d.rounded_rectangle((bar_x, y + 6, bar_x + fill_w, y + 46), radius=16, fill=col + (255,))
        # Value label
        d.text((bar_x + bar_max_w + 22, y + 25), txt, font=f_pct, fill=col, anchor="lm")

    # Vertical 70% threshold dashed line
    gate_x = bar_x + int(bar_max_w * 0.70)
    top_line = 115
    bot_line = start_y + len(modules) * row_h - 18
    for yy in range(top_line, bot_line, 22):
        d.line([(gate_x, yy), (gate_x, min(yy + 13, bot_line))], fill=HEX_AMBER + (255,), width=5)

    # Gate badge at bottom
    d.rounded_rectangle((48, 855, W - 48, 922), radius=18, fill=HEX_BG_ALT + (255,), outline=HEX_AMBER + (255,), width=3)
    d.text((W // 2, 888), "TRAVA AUTOMÁTICA NO POM.XML (jacoco-check): MÍNIMO OBRIGATÓRIO DE 70%", font=f_gate, fill=HEX_AMBER, anchor="mm")

    img.save(dst_path, "PNG")
    return dst_path


def generate_before_after_infographic(dst_path):
    W, H = 2400, 1060
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    f_hdr = load_font(32, bold=True)
    f_dim = load_font(30, bold=True)
    f_txt = load_font(28, bold=True)
    f_sub = load_font(23, bold=False)

    # Column Headers
    d.rounded_rectangle((20, 15, 490, 95), radius=20, fill=HEX_BG_ALT + (255,), outline=HEX_AMBER + (255,), width=3)
    d.text((255, 55), "EIXO TÉCNICO", font=f_hdr, fill=HEX_AMBER, anchor="mm")

    d.rounded_rectangle((530, 15, 1380, 95), radius=20, fill=HEX_BG_ALT + (255,), outline=HEX_CORAL + (255,), width=3)
    d.text((955, 55), "ANTES (GARGALOS)", font=f_hdr, fill=HEX_CORAL, anchor="mm")

    d.rounded_rectangle((1500, 15, 2380, 95), radius=20, fill=HEX_BG_ALT + (255,), outline=HEX_GREEN + (255,), width=3)
    d.text((1940, 55), "AGORA (PIPELINE OTIMIZADA)", font=f_hdr, fill=HEX_GREEN, anchor="mm")

    rows = [
        ("Gatilhos &\nPull Requests",
         "Disparo Duplo (2x)", "Sem filtro de branch nem cancelamento",
         "Filtro Limpo + Concurrency", "Apenas main e reactVersion • Cancela runs antigos"),
        ("Banco nos\nTestes",
         "MongoDB Atlas Externo", "Dependia de rede e secret em nuvem",
         "Container mongo:7 Efêmero", "100% isolado no runner com healthcheck"),
        ("Execução\nMaven",
         "Suíte Rodava 2 Vezes", "./mvnw test + ./mvnw verify sem métricas",
         "Ciclo Único + JaCoCo", "./mvnw -B verify + Tabela no GitHub Summary"),
        ("Imagens\nDocker",
         "Zero Teste na CI", "Falhas só apareciam no deploy da Render",
         "Quality Gate Dedicado", "Valida Compose e Build antes do deploy"),
    ]

    for i, (dim, b_main, b_sub, a_main, a_sub) in enumerate(rows):
        y = 130 + i * 230
        h = 200

        # Dim box
        d.rounded_rectangle((20, y, 490, y + h), radius=26, fill=HEX_BG_CARD + (255,), outline=HEX_BORDER + (255,), width=3)
        d.multiline_text((255, y + h // 2), dim, font=f_dim, fill=HEX_WHITE, anchor="mm", align="center", spacing=8)

        # Before box
        d.rounded_rectangle((530, y, 1380, y + h), radius=26, fill=HEX_BG_CARD + (255,), outline=HEX_CORAL + (190,), width=3)
        cx_b, cy_b = 603, y + 100
        d.ellipse((cx_b - 38, cy_b - 38, cx_b + 38, cy_b + 38), fill=(58, 28, 38, 255), outline=HEX_CORAL + (255,), width=4)
        # Vector X icon
        d.line([(cx_b - 15, cy_b - 15), (cx_b + 15, cy_b + 15)], fill=HEX_CORAL + (255,), width=7)
        d.line([(cx_b - 15, cy_b + 15), (cx_b + 15, cy_b - 15)], fill=HEX_CORAL + (255,), width=7)
        d.text((670, y + 72), b_main, font=f_txt, fill=HEX_CORAL, anchor="lm")
        d.text((670, y + 130), b_sub, font=f_sub, fill=HEX_MUTED, anchor="lm")

        # Arrow
        cy = y + h // 2
        d.polygon([(1405, cy - 16), (1450, cy - 16), (1450, cy - 34), (1482, cy), (1450, cy + 34), (1450, cy + 16), (1405, cy + 16)],
                  fill=HEX_GREEN + (255,))

        # After box
        d.rounded_rectangle((1500, y, 2380, y + h), radius=26, fill=HEX_BG_CARD + (255,), outline=HEX_GREEN + (240,), width=4)
        cx_a, cy_a = 1573, y + 100
        d.ellipse((cx_a - 38, cy_a - 38, cx_a + 38, cy_a + 38), fill=(16, 56, 46, 255), outline=HEX_GREEN + (255,), width=4)
        # Vector Checkmark icon
        d.line([(cx_a - 17, cy_a + 2), (cx_a - 4, cy_a + 15), (cx_a + 18, cy_a - 13)], fill=HEX_GREEN + (255,), width=7, joint="curve")
        d.text((1640, y + 72), a_main, font=f_txt, fill=HEX_GREEN, anchor="lm")
        d.text((1640, y + 130), a_sub, font=f_sub, fill=HEX_TEXT, anchor="lm")

    img.save(dst_path, "PNG")
    return dst_path


def generate_multistage_funnel(dst_path):
    W, H = 2400, 740
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    f_hdr = load_font(32, bold=True)
    f_stage = load_font(26, bold=True)
    f_sub = load_font(23, bold=False)
    f_badge = load_font(24, bold=True, mono=True)

    # Two side-by-side panels: Backend (Left) & Frontend (Right)
    panels = [
        (20, "BACKEND DOCKERFILE  (Render Cloud)", HEX_CYAN,
         "ESTÁGIO 1: BUILD (Descartado)", "maven:3.9.6-eclipse-temurin-17", "Cache go-offline + Compilação (~480 MB)",
         "ESTÁGIO 2: PRODUÇÃO ENXUTA", "eclipse-temurin:17-jre", "Apenas app.jar • Non-Root • RAM 75% (~185 MB)", HEX_GREEN),
        (1220, "FRONTEND DOCKERFILE  (SPA Estático)", HEX_PURPLE,
         "ESTÁGIO 1: BUILD (Descartado)", "node:20-bookworm-slim", "npm ci + Build TypeScript/Vite (~420 MB)",
         "ESTÁGIO 2: PRODUÇÃO ULTRA LEVE", "nginx:1.27-alpine", "Estáticos puros • Gzip • Rotas SPA (~25 MB)", HEX_CYAN),
    ]

    for px, title, col_main, s1_t, s1_img, s1_sub, s2_t, s2_img, s2_sub, col_out in panels:
        pw = 1160
        d.rounded_rectangle((px, 10, px + pw, H - 10), radius=30, fill=HEX_BG_CARD + (255,), outline=col_main + (220,), width=4)
        d.rounded_rectangle((px, 10, px + pw, 92), radius=30, fill=HEX_BG_ALT + (255,), outline=col_main + (220,), width=3)
        d.text((px + pw // 2, 51), title, font=f_hdr, fill=col_main, anchor="mm")

        # Wide Stage 1 Box (Heavy)
        s1_x1, s1_x2 = px + 65, px + pw - 65
        d.rounded_rectangle((s1_x1, 130, s1_x2, 335), radius=22, fill=HEX_BG_ALT + (255,), outline=HEX_CORAL + (200,), width=3)
        d.text((px + pw // 2, 172), s1_t, font=f_stage, fill=HEX_CORAL, anchor="mm")
        d.text((px + pw // 2, 232), s1_img, font=f_badge, fill=HEX_WHITE, anchor="mm")
        d.text((px + pw // 2, 288), s1_sub, font=f_sub, fill=HEX_MUTED, anchor="mm")

        # Funnel trapezoid + Down arrow (solid dark tint so alpha stays 255!)
        cx = px + pw // 2
        d.polygon([(s1_x1 + 90, 344), (s1_x2 - 90, 344), (cx + 260, 450), (cx - 260, 450)],
                  fill=(20, 35, 56, 255), outline=HEX_BORDER + (255,))
        d.polygon([(cx - 180, 356), (cx - 144, 356), (cx - 144, 406), (cx - 122, 406),
                   (cx - 162, 442), (cx - 202, 406), (cx - 180, 406)],
                  fill=col_out + (255,))
        d.rounded_rectangle((cx - 95, 372, cx + 235, 424), radius=14, fill=HEX_BG_ALT + (255,), outline=col_out + (200,), width=2)
        d.text((cx + 70, 398), "Copia só o artefato final", font=load_font(21, bold=True), fill=col_out, anchor="mm")

        # Compact Stage 2 Box (Lean Runtime)
        s2_x1, s2_x2 = px + 150, px + pw - 150
        d.rounded_rectangle((s2_x1, 462, s2_x2, 688), radius=24, fill=HEX_BG_ALT + (255,), outline=col_out + (255,), width=4)
        d.text((px + pw // 2, 508), s2_t, font=f_stage, fill=col_out, anchor="mm")
        d.text((px + pw // 2, 572), s2_img, font=f_badge, fill=HEX_WHITE, anchor="mm")
        d.text((px + pw // 2, 635), s2_sub, font=f_sub, fill=HEX_TEXT, anchor="mm")

    img.save(dst_path, "PNG")
    return dst_path


# =============================================================================
# HELPERS DO POWERPOINT (PPTX)
# =============================================================================

def set_slide_bg(slide, color=C_BG_DARK):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_rect(slide, left, top, width, height, fill_color, border_color=None, border_pt=1.3, rounded=True):
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
    r = p.add_run()
    r.text = text
    r.font.name = font_name
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.color.rgb = color
    return tb


def add_bullets(slide, left, top, width, height, items, size=14, color=C_TEXT, bullet_color=C_CYAN, space_after=10):
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
        r_bul.text = "▸ "
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


def add_header(slide, tag, title, slide_num, total_slides=9, accent=C_CYAN):
    add_rect(slide, 0, 0, 13.333, 0.08, accent, rounded=False)
    add_rect(slide, 0.65, 0.30, 2.75, 0.34, C_BG_CARD, border_color=accent, border_pt=1.0)
    add_text(slide, 0.65, 0.30, 2.75, 0.34, tag.upper(), size=10, bold=True, color=accent,
             align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
    add_text(slide, 11.4, 0.30, 1.28, 0.34, f"{slide_num:02d} / {total_slides:02d}",
             size=11, bold=True, color=C_MUTED, align=PP_ALIGN.RIGHT, anchor=MSO_ANCHOR.MIDDLE)
    add_text(slide, 0.65, 0.72, 12.0, 0.55, title, size=26, bold=True, color=C_WHITE)
    add_rect(slide, 0.65, 1.35, 12.03, 0.02, C_BORDER, rounded=False)


def add_notes(slide, notes_text):
    slide.notes_slide.notes_text_frame.text = notes_text


# =============================================================================
# CONSTRUÇÃO DOS 9 SLIDES CONCISOS & VISUAIS
# =============================================================================

def build_presentation(output_path, assets_dir, logo_path, photos_dir):
    os.makedirs(assets_dir, exist_ok=True)

    # Preparar imagens e gráficos
    card_feedback = make_framed_illustration(
        os.path.join(assets_dir, "ilustracao_feedback.jpg"),
        os.path.join(assets_dir, "card_feedback.png"), HEX_CORAL, 1200, 920
    )
    card_arq = make_framed_illustration(
        os.path.join(assets_dir, "ilustracao_arquitetura.jpg"),
        os.path.join(assets_dir, "card_arquitetura.png"), HEX_CYAN, 1360, 820
    )
    card_cicd = make_framed_illustration(
        os.path.join(assets_dir, "ilustracao_cicd.jpg"),
        os.path.join(assets_dir, "card_cicd.png"), HEX_GREEN, 1320, 840
    )
    card_docker = make_framed_illustration(
        os.path.join(assets_dir, "ilustracao_docker.jpg"),
        os.path.join(assets_dir, "card_docker.png"), HEX_AMBER, 1320, 820
    )

    chart_donut = generate_jacoco_donut_chart(os.path.join(assets_dir, "chart_jacoco_donut.png"))
    chart_mods = generate_jacoco_modules_chart(os.path.join(assets_dir, "chart_jacoco_modulos.png"))
    chart_ba = generate_before_after_infographic(os.path.join(assets_dir, "chart_antes_depois.png"))
    chart_ms = generate_multistage_funnel(os.path.join(assets_dir, "chart_multistage.png"))

    team_members = [
        ("Hugo", "Hugo.jpeg", HEX_CYAN),
        ("Gabriel", "gabriel.jpg", HEX_CORAL),
        ("Guilherme", "Guilherme.jpeg", HEX_GREEN),
        ("Caroline", "Caroline.jpeg", HEX_CYAN),
        ("Paulo", "Paulo.jpeg", HEX_AMBER),
        ("Priscila", "Priscila.jpeg", HEX_PURPLE),
    ]
    avatars = []
    for name, fn, ring in team_members:
        src = os.path.join(photos_dir, fn)
        dst = os.path.join(assets_dir, f"avatar_{name.lower()}.png")
        if os.path.exists(src):
            make_circular_avatar(src, dst, ring_color=ring)
            avatars.append((name, dst))

    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]

    # -------------------------------------------------------------------------
    # SLIDE 1: CAPA VISUAL COM LOGO + FOTOS DA EQUIPE
    # -------------------------------------------------------------------------
    s1 = prs.slides.add_slide(blank)
    set_slide_bg(s1)
    add_rect(s1, 0, 0, 8.5, 0.12, C_CYAN, rounded=False)
    add_rect(s1, 8.5, 0, 4.833, 0.12, C_CORAL, rounded=False)

    add_rect(s1, 0.75, 0.55, 5.1, 0.38, C_BG_CARD, border_color=C_BORDER)
    add_text(s1, 0.75, 0.55, 5.1, 0.38, "CENTRO PAULA SOUZA  •  FATEC LUIGI PAPAIZ",
             size=10.5, bold=True, color=C_CYAN, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    add_text(s1, 0.75, 1.18, 7.6, 0.90, "WORKONNECTION", size=46, bold=True, color=C_WHITE)
    add_text(s1, 0.75, 2.05, 7.6, 0.55, "Vagas Temporárias com Feedback Obrigatório", size=21, bold=True, color=C_CORAL)
    add_text(s1, 0.75, 2.62, 7.6, 0.50, "Ênfase em Pipeline CI/CD  •  Qualidade JaCoCo  •  Containerização Docker",
             size=14.5, color=C_MUTED)

    # Official Logo Card
    add_rect(s1, 8.95, 0.75, 3.63, 2.55, C_WHITE, border_color=C_CYAN, border_pt=2.0)
    if os.path.exists(logo_path):
        s1.shapes.add_picture(logo_path, Inches(9.18), Inches(0.95), width=Inches(3.15))

    # 4 Concise KPI Badges
    kpis = [
        ("CI / CD", "GitHub Actions", C_CYAN),
        ("88,86%", "Cobertura JaCoCo", C_GREEN),
        ("Docker", "Multi-Stage & Compose", C_CORAL),
        ("ODS 8 & 17", "Impacto Social ONU", C_AMBER),
    ]
    for i, (big, sub, col) in enumerate(kpis):
        x = 0.75 + i * 3.00
        add_rect(s1, x, 3.55, 2.82, 1.22, C_BG_CARD, border_color=col, border_pt=1.5)
        add_text(s1, x, 3.68, 2.82, 0.52, big, size=24, bold=True, color=col, align=PP_ALIGN.CENTER)
        add_text(s1, x, 4.25, 2.82, 0.35, sub, size=12.5, bold=True, color=C_WHITE, align=PP_ALIGN.CENTER)

    # Team Member Avatars Strip
    add_rect(s1, 0.75, 5.05, 11.83, 2.05, C_BG_CARD_ALT, border_color=C_BORDER)
    add_text(s1, 0.75, 5.13, 11.83, 0.30, "EQUIPE DE ENGENHARIA", size=10, bold=True, color=C_CYAN, align=PP_ALIGN.CENTER)
    for idx, (m_name, av_path) in enumerate(avatars):
        ax = 1.25 + idx * 1.88
        s1.shapes.add_picture(av_path, Inches(ax), Inches(5.48), width=Inches(1.12))
        add_text(s1, ax - 0.18, 6.66, 1.48, 0.32, m_name, size=12, bold=True, color=C_TEXT, align=PP_ALIGN.CENTER)

    add_notes(s1, "Apresentação do projeto Workonnection (Fatec Luigi Papaiz) — foco em CI/CD, 88,86% JaCoCo e Docker.")

    # -------------------------------------------------------------------------
    # SLIDE 2: PROBLEMA VS SOLUÇÃO (ILUSTRAÇÃO + TÓPICOS CURTOS)
    # -------------------------------------------------------------------------
    s2 = prs.slides.add_slide(blank)
    set_slide_bg(s2)
    add_header(s2, "Proposta de Valor", "Combate ao Ghosting com Feedback Obrigatório", 2, accent=C_CORAL)

    # Left Big Visual Illustration + Validation Badge
    s2.shapes.add_picture(card_feedback, Inches(0.65), Inches(1.68), width=Inches(5.85))
    add_rect(s2, 0.65, 6.28, 5.85, 0.76, C_BG_CARD_ALT, border_color=C_GREEN, border_pt=1.4)
    add_text(s2, 0.80, 6.28, 5.55, 0.76,
             "Validado com Usuários Reais: 100% de conclusão das tarefas nos testes de usabilidade",
             size=12.5, bold=True, color=C_GREEN, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    # Right Top Card: Problema
    add_rect(s2, 6.80, 1.68, 5.88, 2.32, C_BG_CARD, border_color=C_CORAL, border_pt=1.5)
    add_text(s2, 7.05, 1.80, 5.40, 0.40, "✕  O PROBLEMA: GHOSTING PROFISSIONAL", size=15, bold=True, color=C_CORAL)
    add_bullets(s2, 7.05, 2.30, 5.40, 1.6, [
        ("Vácuo seletivo: ", "Candidatos ficam sem retorno."),
        ("Estagnação: ", "Falta clareza sobre o que evoluir."),
        ("Informalidade: ", "Contratações sem histórico confiável."),
    ], size=14, bullet_color=C_CORAL, space_after=8)

    # Right Bottom Card: Solução
    add_rect(s2, 6.80, 4.22, 5.88, 2.82, C_BG_CARD, border_color=C_CYAN, border_pt=1.5)
    add_text(s2, 7.05, 4.34, 5.40, 0.40, "✔  A SOLUÇÃO: WORKONNECTION", size=15, bold=True, color=C_CYAN)
    add_bullets(s2, 7.05, 4.82, 5.40, 2.1, [
        ("Feedback Obrigatório: ", "Parecer exigido ao encerrar vaga."),
        ("4 Perfis Dedicados: ", "Estudante • MEI • ME • Empresa."),
        ("Tempo Real & Nuvem: ", "Chat Pusher + Upload Cloudinary."),
        ("Segurança & Impacto: ", "Adequação LGPD • ODS 8 e 17."),
    ], size=14, bullet_color=C_CYAN, space_after=8)

    add_notes(s2, "Problema do ghosting vs regra de feedback obrigatório do Workonnection para 4 perfis.")

    # -------------------------------------------------------------------------
    # SLIDE 3: ARQUITETURA CLOUD EM CAMADAS (ILUSTRAÇÃO 3D + 3 CARDS CURTOS)
    # -------------------------------------------------------------------------
    s3 = prs.slides.add_slide(blank)
    set_slide_bg(s3)
    add_header(s3, "Arquitetura Cloud", "Ecossistema Full Stack em Camadas (MVC + Service)", 3, accent=C_CYAN)

    # Left Isometric Cloud Architecture Illustration
    s3.shapes.add_picture(card_arq, Inches(0.65), Inches(1.75), width=Inches(6.95))

    # Governance pill under image
    add_rect(s3, 0.65, 6.18, 6.95, 0.78, C_BG_CARD_ALT, border_color=C_PRIMARY)
    add_text(s3, 0.80, 6.18, 6.65, 0.78,
             "Fluxo Desacoplado  •  Branches main & reactVersion\nDeploy Contínuo: Vercel (Front) + Render Docker (API)",
             size=12.5, bold=True, color=C_TEXT, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    # Right 3 Compact Tier Cards matching illustration colors
    tiers = [
        ("1. VIEW  •  VERCEL CDN", "React 19  •  TypeScript  •  Vite 8", "Interface responsiva, i18n e tema escuro/claro.", C_CYAN, 1.75),
        ("2. API REST  •  RENDER DOCKER", "Java 17  •  Spring Boot 3.5", "Service Layer, Spring Security e Google OAuth 2.0.", C_GREEN, 3.56),
        ("3. DADOS & EVENTOS", "MongoDB Atlas  •  Pusher  •  Cloudinary", "NoSQL com TTL, WebSockets real-time e CDN de mídia.", C_AMBER, 5.37),
    ]
    for t_head, t_stack, t_desc, t_col, ty in tiers:
        add_rect(s3, 7.88, ty, 4.80, 1.58, C_BG_CARD, border_color=t_col, border_pt=1.6)
        add_text(s3, 8.08, ty + 0.14, 4.40, 0.34, t_head, size=13, bold=True, color=t_col)
        add_text(s3, 8.08, ty + 0.52, 4.40, 0.34, t_stack, size=14, bold=True, color=C_WHITE)
        add_text(s3, 8.08, ty + 0.94, 4.40, 0.50, t_desc, size=12, color=C_MUTED)

    add_notes(s3, "Arquitetura em 3 camadas: React 19/TS na Vercel, Spring Boot 3.5 em Docker na Render e Atlas/Pusher/Cloudinary.")

    # -------------------------------------------------------------------------
    # SLIDE 4: PIPELINE CI/CD NO GITHUB ACTIONS (ILUSTRAÇÃO + DIAGRAMA LIMPO)
    # -------------------------------------------------------------------------
    s4 = prs.slides.add_slide(blank)
    set_slide_bg(s4)
    add_header(s4, "Engenharia CI/CD", "Esteira Automatizada no GitHub Actions (workonnection.yaml)", 4, accent=C_GREEN)

    # Left Isometric CI/CD Conveyor Illustration
    s4.shapes.add_picture(card_cicd, Inches(0.65), Inches(1.72), width=Inches(5.90))

    add_rect(s4, 0.65, 5.68, 5.90, 1.30, C_BG_CARD_ALT, border_color=C_CYAN)
    add_text(s4, 0.85, 5.78, 5.50, 0.32, "GATILHOS & SEGURANÇA DA ESTEIRA", size=12, bold=True, color=C_CYAN)
    add_text(s4, 0.85, 6.14, 5.50, 0.72,
             "• Branches oficiais: main e reactVersion (+ manual)\n"
             "• Concurrency ativa  •  Token restrito (contents: read)",
             size=12.5, color=C_TEXT)

    # Right Parallel Jobs + Quality Gate
    add_text(s4, 6.85, 1.66, 5.80, 0.34, "ESTÁGIO 1 — 3 JOBS SIMULTÂNEOS", size=12, bold=True, color=C_MUTED)

    jobs = [
        ("Segurança  •  Gitleaks", "Auditoria DevSecOps bloqueando vazamento de segredos.", C_CORAL, 2.06),
        ("Frontend  •  Node.js 20", "Cache NPM  ➔  npm ci  ➔  ESLint  ➔  Build TS + Vite.", C_CYAN, 3.16),
        ("Backend  •  JDK 17 + Mongo 7", "Container mongo:7 efêmero  ➔  57 Testes + JaCoCo >= 70%.", C_GREEN, 4.26),
    ]
    for j_t, j_s, j_c, jy in jobs:
        add_rect(s4, 6.85, jy, 5.83, 0.95, C_BG_CARD, border_color=j_c, border_pt=1.6)
        add_text(s4, 7.08, jy + 0.10, 5.40, 0.34, j_t, size=14, bold=True, color=j_c)
        add_text(s4, 7.08, jy + 0.48, 5.40, 0.36, j_s, size=12.5, color=C_TEXT)

    # Down Arrow into Stage 2
    arr = s4.shapes.add_shape(MSO_SHAPE.DOWN_ARROW, Inches(9.55), Inches(5.30), Inches(0.42), Inches(0.34))
    arr.fill.solid()
    arr.fill.fore_color.rgb = C_GREEN
    arr.line.fill.background()

    # Quality Gate Final Box
    add_rect(s4, 6.85, 5.72, 5.83, 1.26, C_BG_CARD, border_color=C_GREEN, border_pt=2.2)
    add_text(s4, 7.08, 5.82, 5.40, 0.36, "ESTÁGIO 2 — QUALITY GATE: DOCKER BUILD", size=14, bold=True, color=C_GREEN)
    add_text(s4, 7.08, 6.22, 5.40, 0.62,
             "Só executa se os 3 jobs aprovarem (needs)\nValida docker-compose.yml + Build Backend & Frontend",
             size=12.5, color=C_WHITE)

    add_notes(s4, "Esteira CI/CD em 2 estágios: 3 jobs paralelos (Gitleaks, Front, Back com Mongo 7) e Quality Gate de Docker.")

    # -------------------------------------------------------------------------
    # SLIDE 5: ANTES VS DEPOIS DA PIPELINE (INFOGRÁFICO VISUAL DE ALTA NITIDEZ)
    # -------------------------------------------------------------------------
    s5 = prs.slides.add_slide(blank)
    set_slide_bg(s5)
    add_header(s5, "Refatoração DevOps", "Evolução da Pipeline CI/CD: Antes vs. Agora", 5, accent=C_AMBER)

    s5.shapes.add_picture(chart_ba, Inches(0.65), Inches(1.62), width=Inches(12.03))

    add_notes(s5, "Comparativo visual Antes vs Agora: fim de PR duplicado, container mongo:7 local, ciclo único Maven e Quality Gate Docker.")

    # -------------------------------------------------------------------------
    # SLIDE 6: COBERTURA DE TESTES JACOCO (2 GRÁFICOS DE DADOS 300 DPI)
    # -------------------------------------------------------------------------
    s6 = prs.slides.add_slide(blank)
    set_slide_bg(s6)
    add_header(s6, "Qualidade Auditada", "Cobertura de Testes Automatizados com JaCoCo (88,86%)", 6, accent=C_GREEN)

    s6.shapes.add_picture(chart_donut, Inches(0.65), Inches(1.65), width=Inches(5.72))
    s6.shapes.add_picture(chart_mods, Inches(6.58), Inches(1.65), width=Inches(6.10))

    add_rect(s6, 0.65, 6.08, 12.03, 0.88, C_BG_CARD_ALT, border_color=C_GREEN, border_pt=1.5)
    add_text(s6, 0.85, 6.08, 11.63, 0.88,
             " Ferramental de Testes:  JUnit 5  •  Mockito  •  Spring MockMvc  •  MongoDB 7 Isolado  •  Relatório HTML & GitHub Step Summary",
             size=13.5, bold=True, color=C_TEXT, align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)

    add_notes(s6, "Salto de 34,54% (35 testes) para 88,86% (57 testes) com trava mínima obrigatória de 70% no pom.xml.")

    # -------------------------------------------------------------------------
    # SLIDE 7: DOCKER MULTI-STAGE & HARDENING (FUNIL VISUAL + 4 PILLS)
    # -------------------------------------------------------------------------
    s7 = prs.slides.add_slide(blank)
    set_slide_bg(s7)
    add_header(s7, "Containerização", "Builds Multi-Stage & Otimização para Nuvem", 7, accent=C_CYAN)

    # Visual Multi-Stage Funnel Image
    s7.shapes.add_picture(chart_ms, Inches(0.65), Inches(1.62), width=Inches(12.03))

    # 4 Concise Hardening Pills at bottom
    pills = [
        ("Cache Inteligente", "go-offline & npm ci aceleram builds", C_CYAN),
        ("Segurança Non-Root", "Executa sem privilégio root (appuser)", C_GREEN),
        ("Limite JVM 75%", "Evita crash nos 512 MB da Render", C_AMBER),
        ("SPA + Gzip + Ignore", "Rotas sem erro 404 e build limpo", C_PURPLE),
    ]
    for i, (p_t, p_s, p_c) in enumerate(pills):
        px = 0.65 + i * 3.05
        add_rect(s7, px, 5.55, 2.88, 1.42, C_BG_CARD, border_color=p_c, border_pt=1.5)
        add_text(s7, px + 0.12, 5.72, 2.64, 0.40, p_t, size=14, bold=True, color=p_c, align=PP_ALIGN.CENTER)
        add_text(s7, px + 0.12, 6.18, 2.64, 0.62, p_s, size=12, color=C_TEXT, align=PP_ALIGN.CENTER)

    add_notes(s7, "Multi-stage Dockerfiles descartando SDKs pesados, rodando non-root e respeitando 512 MB na Render.")

    # -------------------------------------------------------------------------
    # SLIDE 8: ORQUESTRAÇÃO DOCKER COMPOSE (ILUSTRAÇÃO 3D + 3 CARDS CURTOS)
    # -------------------------------------------------------------------------
    s8 = prs.slides.add_slide(blank)
    set_slide_bg(s8)
    add_header(s8, "Ambiente Padronizado", "Orquestração Completa em 1 Comando (Docker Compose)", 8, accent=C_AMBER)

    # Terminal Banner
    add_rect(s8, 0.65, 1.58, 12.03, 0.65, C_BG_CARD_ALT, border_color=C_GREEN, border_pt=1.5)
    add_text(s8, 0.90, 1.58, 11.50, 0.65,
             "$  docker compose up --build -d     # Sobe Banco + API + Frontend sem instalar nada!",
             size=15, bold=True, color=C_GREEN, font_name=FONT_MONO, anchor=MSO_ANCHOR.MIDDLE)

    # Left 3D Containers Illustration
    s8.shapes.add_picture(card_docker, Inches(0.65), Inches(2.45), width=Inches(6.45))

    # Right 3 Color-Matched Container Cards
    containers = [
        ("mongodb  •  Porta 27017", "Volume persistente + Healthcheck (mongosh).", C_AMBER, 2.45),
        ("backend  •  Porta 8080", "Inicia após banco saudável (service_healthy).", C_CYAN, 4.02),
        ("frontend  •  Porta 5173:80", "Integrado ao CORS • Pronto no navegador.", C_PURPLE, 5.59),
    ]
    for c_t, c_s, c_col, cy in containers:
        add_rect(s8, 7.38, cy, 5.30, 1.38, C_BG_CARD, border_color=c_col, border_pt=1.8)
        add_text(s8, 7.62, cy + 0.18, 4.85, 0.40, c_t, size=15, bold=True, color=c_col, font_name=FONT_MONO)
        add_text(s8, 7.62, cy + 0.68, 4.85, 0.50, c_s, size=13, color=C_TEXT)

    add_notes(s8, "Orquestração via docker-compose.yml subindo MongoDB, Backend e Frontend em ordem saudável com 1 comando.")

    # -------------------------------------------------------------------------
    # SLIDE 9: CONCLUSÃO & MATURIDADE DE ENGENHARIA
    # -------------------------------------------------------------------------
    s9 = prs.slides.add_slide(blank)
    set_slide_bg(s9)
    add_header(s9, "Resultados Alcançados", "Conclusão: Propósito Social & Engenharia Confiável", 9, accent=C_GREEN)

    results = [
        ("15 US", "Produto Validado", "100% de conclusão nos testes de usabilidade e fim do ghosting.", C_CORAL),
        ("4 Jobs", "Pipeline DevSecOps", "Segurança, lint, banco isolado e Docker a cada push/PR.", C_CYAN),
        ("88,86%", "Cobertura Auditada", "57 testes automatizados com trava mínima de 70% no Maven.", C_GREEN),
        ("Cloud", "Pronto para Escala", "Multi-stage seguro na Render/Vercel + Compose em 1 comando.", C_AMBER),
    ]
    for idx, (big_v, r_title, r_desc, r_col) in enumerate(results):
        col_i = idx % 2
        row_i = idx // 2
        rx = 0.65 + col_i * 6.15
        ry = 1.68 + row_i * 1.98

        add_rect(s9, rx, ry, 5.88, 1.76, C_BG_CARD, border_color=r_col, border_pt=1.6)
        add_rect(s9, rx + 0.22, ry + 0.26, 1.45, 1.24, C_BG_CARD_ALT, border_color=r_col)
        add_text(s9, rx + 0.22, ry + 0.26, 1.45, 1.24, big_v, size=22, bold=True, color=r_col,
                 align=PP_ALIGN.CENTER, anchor=MSO_ANCHOR.MIDDLE)
        add_text(s9, rx + 1.88, ry + 0.28, 3.78, 0.42, r_title, size=16, bold=True, color=C_WHITE)
        add_text(s9, rx + 1.88, ry + 0.78, 3.78, 0.75, r_desc, size=13, color=C_TEXT)

    # Bottom Closing Banner with Avatars + Thank You
    add_rect(s9, 0.65, 5.78, 12.03, 1.22, C_PRIMARY, border_color=C_CYAN, border_pt=1.8)
    add_text(s9, 0.95, 5.92, 6.80, 0.50, "OBRIGADO PELA ATENÇÃO!", size=22, bold=True, color=C_WHITE)
    add_text(s9, 0.95, 6.42, 6.80, 0.42, "Workonnection — Conectando talentos com transparência e qualidade.",
             size=13.5, color=C_TEXT)

    for idx, (_, av_path) in enumerate(avatars):
        ax = 8.05 + idx * 0.74
        s9.shapes.add_picture(av_path, Inches(ax), Inches(6.02), width=Inches(0.68))

    add_notes(s9, "Síntese final: 15 histórias validadas, CI/CD DevSecOps, 88,86% JaCoCo e Docker pronto para nuvem.")

    prs.save(output_path)
    print(f"Apresentacao visual concisa gerada com sucesso em: {output_path}")


if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    out_pptx = os.path.join(base_dir, "Apresentacao_Workonnection_CICD_Docker.pptx")
    assets_folder = os.path.join(base_dir, "assets_slides")
    logo_file = os.path.abspath(os.path.join(base_dir, "..", "frontend", "public", "logo_workonnection.png"))
    photos_folder = os.path.abspath(os.path.join(base_dir, "..", "frontend", "src", "assets", "photoMembers"))
    build_presentation(out_pptx, assets_folder, logo_file, photos_folder)
