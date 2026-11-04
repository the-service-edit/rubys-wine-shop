# Two design directions for one email (Meet the Maker), so Mel can choose before all nine are rebuilt.
# Run: python3 kit/directions.py -> kit/directions/a.html, b.html, index.html
import os, html as H
HERE = os.path.dirname(os.path.abspath(__file__))
IMG = 'https://rubys-wine-shop.theserviceedit.com/kit/img/'
CDN = 'https://cdn.shopify.com/s/files/1/0836/3622/4220/files/'
SITE = 'https://rubyswineshop.com.au'; W = SITE + '/pages/whats-on'; F = SITE + '/pages/find-us'
WINE, TERRA, CREAM, SAND, STONE = '#470606', '#BA5B3E', '#F2EBD7', '#E5D9C2', '#B8A88A'
SANS = "'DM Sans',Helvetica,Arial,sans-serif"
SERIF = "'Playfair',Georgia,'Times New Roman',serif"
FAT = "'Fraunces','Cooper Black',Georgia,serif"  # closest free match to her poster lettering
FATV = "font-variation-settings:'SOFT' 100,'WONK' 0,'opsz' 144;font-weight:900;"

def img(src, alt, w=600, link=None, style=''):
    t = f'<img src="{src}" width="{w}" alt="{H.escape(alt)}" style="display:block;width:100%;max-width:{w}px;height:auto;border:0;{style}">'
    return f'<a href="{link}" target="_blank" style="text-decoration:none;">{t}</a>' if link else t
def row(inner, bg=CREAM, pad='0', cls=''):
    return f'<tr><td class="{cls}" bgcolor="{bg}" style="background:{bg};padding:{pad};">{inner}</td></tr>'
def edge(a, b): return f'<tr><td style="padding:0;line-height:0;font-size:0;">{img(IMG + f"sc-{a}-{b}.png", "", 600)}</td></tr>'
def btn(label, url, bg, fg, align='left', big=False):
    a = ' align="center" style="margin:0 auto;"' if align == 'center' else ''
    pad = '18px 36px' if big else '15px 30px'
    return f'<table role="presentation" cellpadding="0" cellspacing="0" border="0"{a}><tr><td bgcolor="{bg}" style="background:{bg};border-radius:999px;"><a href="{url}" target="_blank" style="display:inline-block;padding:{pad};font-family:{SANS};font-size:{17 if big else 15}px;font-weight:700;color:{fg};text-decoration:none;">{label}</a></td></tr></table>'
def SP(n): return f'<div style="height:{n}px;line-height:{n}px;font-size:0;">&nbsp;</div>'
def p(t, c, size=16, lh=26, align='left', mb=0, w=400):
    return f'<p style="margin:0 0 {mb}px 0;font-family:{SANS};font-size:{size}px;line-height:{lh}px;font-weight:{w};color:{c};text-align:{align};">{t}</p>'
def two(a, b, wa=50, gap=16, stack=True):
    ca = 'col colpad' if stack else 'keep'; cb = 'col' if stack else 'keep'
    return (f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>'
            f'<td class="{ca}" width="{wa}%" valign="middle" style="width:{wa}%;padding-right:{gap//2}px;">{a}</td>'
            f'<td class="{cb}" width="{100-wa}%" valign="middle" style="width:{100-wa}%;padding-left:{gap//2}px;">{b}</td></tr></table>')

def shell(title, pre, rows, fonts, bg=SAND, logo_bg=CREAM, eyebrow=''):
    eb = f'<tr><td align="center" bgcolor="{logo_bg}" style="background:{logo_bg};padding:0 40px 22px 40px;font-family:{SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:{WINE};">{eyebrow}</td></tr>' if eyebrow else ''
    return f'''<!DOCTYPE html>
<html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><base target="_blank">
<title>{title}</title>
<link href="{fonts}" rel="stylesheet">
<style>
body{{margin:0;padding:0;background:{bg};}}
@media (max-width:599px){{.w{{width:100%!important}}.px{{padding-left:22px!important;padding-right:22px!important}}.mega{{font-size:58px!important;line-height:56px!important}}.huge{{font-size:44px!important;line-height:46px!important}}.mid{{font-size:30px!important;line-height:34px!important}}.col{{display:block!important;width:100%!important;box-sizing:border-box!important;padding-left:0!important;padding-right:0!important}}.colpad{{padding-bottom:18px!important}}.col img,.keep img{{width:100%!important;max-width:100%!important}}.dot{{width:112px!important;height:112px!important}}}}
</style></head>
<body style="margin:0;padding:0;background:{bg};">
<div style="display:none;max-height:0;overflow:hidden;">{pre}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:{bg};"><tr><td align="center" style="padding:24px 0;">
<table role="presentation" class="w" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:{CREAM};">
<tr><td align="center" bgcolor="{logo_bg}" style="background:{logo_bg};padding:26px 40px {14 if eyebrow else 22}px 40px;"><a href="{SITE}/" target="_blank"><img src="{CDN}rubys-logo.png?width=300" width="100" height="100" alt="Ruby&#x27;s Wine Shop" style="display:block;width:100px;height:100px;border:0;"></a></td></tr>
{eb}{''.join(rows)}
<tr><td align="center" bgcolor="{SAND}" style="background:{SAND};padding:26px 40px;font-family:{SANS};font-size:12px;line-height:20px;color:{WINE};">Ruby&#x27;s Wine Shop &middot; 3/297 Sandgate Road, Albion QLD 4010<br><a href="mailto:info@rubyswineshop.com.au" style="color:{WINE};">info@rubyswineshop.com.au</a> &middot; <a href="https://www.instagram.com/rubys_wine_shop" style="color:{WINE};">Instagram</a><br>You&#x27;re getting this because you joined Ruby&#x27;s list. <a href="#" style="color:{WINE};">Unsubscribe</a></td></tr>
</table></td></tr></table></body></html>'''

# ---------- DIRECTION A: PLAYFUL RETRO (her Instagram) ----------
FA = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Fraunces:opsz,wght,SOFT,WONK@9..144,100..900,0..100,0..1&display=swap'
def fat(t, c, size, lh, cls, align='left', mb=0):
    return f'<h1 class="{cls}" style="margin:0 0 {mb}px 0;font-family:{FAT};{FATV}font-size:{size}px;line-height:{lh}px;letter-spacing:-1px;color:{c};text-align:{align};">{t}</h1>'
dot = (f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;"><tr><td class="dot" width="136" height="136" align="center" valign="middle" bgcolor="{WINE}" style="width:136px;height:136px;background:{WINE};border-radius:50%;">'
       f'<p style="margin:0;font-family:{FAT};{FATV}font-size:30px;line-height:30px;color:{CREAM};">Fri 6</p><p style="margin:2px 0 0 0;font-family:{SANS};font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:{SAND};">Nov · 4pm</p></td></tr></table>')
A = shell('Meet the maker this Friday', 'Free tastings with Johnny from Unnatural Urges, Friday 6 November from 4pm.', [
  edge('cream', 'terra'),
  row('<div style="text-align:center;">' + p('This Friday at Ruby&#x27;s', CREAM, 12, 18, 'center', 14, 700).replace('font-size:12px', 'font-size:12px;letter-spacing:3px;text-transform:uppercase')
      + fat('Meet<br>the maker.', CREAM, 84, 78, 'mega', 'center', 18) + p('Johnny from <b>Unnatural Urges</b> is pouring his spooky, fun wines, made right here in our own backyard in Queensland.', CREAM, 17, 27, 'center', 26) + dot + '</div>', TERRA, '34px 48px 44px 48px', 'px'),
  edge('terra', 'cream'),
  row(img(IMG + 'bottles-wide.jpg', 'Five Unnatural Urges bottles lined up on the bar', 600), CREAM, '26px 24px 0 24px', 'px'),
  row(two(img(IMG + 'maker-tall.jpg', 'The winemaker at work', 270, None, 'border-radius:22px;'),
          fat('Free tastings.<br>Zero pressure.', WINE, 40, 42, 'mid', 'left', 14) + p('Taste the whole range with the person who made it, ask him anything, and take home the bottle you fall for. The newest additions land on the shelf the same night.', WINE, 16, 26, 'left', 22) + btn('I&#x27;m coming', W, TERRA, CREAM), 48, 26), CREAM, '30px 40px 40px 40px', 'px'),
  edge('cream', 'wine'),
  row(two(fat('Every<br>Thursday<br>from 12.', CREAM, 46, 46, 'mid', 'left', 10) + p('Ruby&#x27;s Milk Bar. A space for new mums to meet, sip and relax. Babies very welcome.', SAND, 15.5, 24, 'left', 0),
          img(IMG + 'cheers-sq.jpg', 'Two glasses clinking against the sky', 250, None, 'border-radius:50%;'), 56, 20), WINE, '36px 44px 40px 44px', 'px'),
  edge('wine', 'cream'),
  row(f'<div style="text-align:center;">{img(CDN + "rubys-cheers-hands.png?width=300", "", 110, None, "margin:0 auto;width:110px;")}' + SP(10) + fat('See you Friday.', WINE, 34, 38, 'mid', 'center', 4) + p('The Ruby&#x27;s crew (and Ruby)', TERRA, 14, 20, 'center') + '</div>', CREAM, '24px 40px 40px 40px', 'px'),
], FA)

# ---------- DIRECTION B: BOLD EDITORIAL (photo-led, magazine) ----------
FB = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair:ital,wght@0,400;0,700;1,400&display=swap'
def ser(t, c, size, lh, cls, italic=False, align='left', mb=0):
    st = 'font-style:italic;font-weight:400;' if italic else 'font-weight:700;'
    return f'<h1 class="{cls}" style="margin:0 0 {mb}px 0;font-family:{SERIF};{st}font-size:{size}px;line-height:{lh}px;letter-spacing:-1.5px;color:{c};text-align:{align};">{t}</h1>'
def lab(t, c=TERRA, mb=10): return f'<p style="margin:0 0 {mb}px 0;font-family:{SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:{c};">{t}</p>'
def fact(n, k, v):
    return (f'<tr><td width="56" valign="top" style="width:56px;padding:16px 0;border-top:1px solid {WINE};font-family:{SERIF};font-style:italic;font-size:26px;line-height:28px;color:{TERRA};">{n}</td>'
            f'<td valign="top" style="padding:16px 0;border-top:1px solid {WINE};">{lab(k, WINE, 4)}<p style="margin:0;font-family:{SERIF};font-weight:700;font-size:24px;line-height:30px;color:{WINE};">{v}</p></td></tr>')
B = shell('Meet the maker this Friday', 'Free tastings with Johnny from Unnatural Urges, Friday 6 November from 4pm.', [
  row(img(IMG + 'maker-tall.jpg', 'The winemaker at work', 600, W), CREAM),
  row(lab('Meet the maker · Friday 6 November') + ser('The man<br>behind the<br><i style="font-weight:400;color:#BA5B3E;">bottle.</i>', WINE, 76, 74, 'mega', False, 'left', 22)
      + p('Johnny from Unnatural Urges makes spooky, fun wines right here in Queensland. On Friday he&#x27;s behind our bar, pouring the lot. Come and taste it with him.', WINE, 18, 29, 'left', 0), CREAM, '40px 48px 34px 48px', 'px'),
  row(f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">{fact("01", "When", "Friday 6 November")}{fact("02", "From", "4pm, till late")}{fact("03", "Tastings", "Free. Bottles to take home.")}</table>' + SP(26) + btn('See what&#x27;s on', W, WINE, CREAM, 'left', True), CREAM, '0 48px 44px 48px', 'px'),
  row(img(IMG + 'bottles-wide.jpg', 'Five Unnatural Urges bottles on the bar', 600), WINE),
  row(ser('&ldquo;We care about community and where the wine has come from.&rdquo;', CREAM, 30, 38, 'mid', True, 'left', 14) + lab('Ruby&#x27;s Wine Shop, Albion', SAND, 0), WINE, '38px 48px 42px 48px', 'px'),
  row(lab('Also on') + two(img(IMG + 'glass-sq.jpg', 'A glass of white in the sun', 200, None), ser('Ruby&#x27;s Milk Bar', WINE, 30, 34, 'mid', False, 'left', 6) + p('Every Thursday from 12. New mums meet, sip and relax. Babies welcome.', WINE, 15.5, 24), 36, 22), SAND, '34px 48px 36px 48px', 'px'),
  row(ser('See you Friday.', WINE, 30, 36, 'mid', True, 'left', 4) + p('The Ruby&#x27;s crew (and Ruby)', TERRA, 14, 20), CREAM, '30px 48px 40px 48px', 'px'),
], FB, eyebrow='')

os.makedirs(os.path.join(HERE, 'directions'), exist_ok=True)
open(os.path.join(HERE, 'directions', 'a.html'), 'w').write(A)
open(os.path.join(HERE, 'directions', 'b.html'), 'w').write(B)

def card(k, t, b, f):
    return (f'<div class="card"><div class="k">{k}</div><h3>{t}</h3><p>{b}</p><div class="phone"><iframe title="{t}" srcdoc="{H.escape(open(os.path.join(HERE, "directions", f)).read(), quote=True)}"></iframe></div>'
            f'<p class="open"><a href="{f}" target="_blank">Open full width</a></p></div>')
page = f'''<!doctype html><html lang="en-AU"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Two Directions</title><link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600&display=swap" rel="stylesheet">
<style>:root{{--ink:#1B1512;--paper:#F7F4EC;--brown:#3A2E25;--mute:#6B5F54}}*{{box-sizing:border-box}}body{{margin:0;background:var(--paper);color:var(--ink);font-family:Geist,Arial,sans-serif}}
.wrap{{max-width:1000px;margin:0 auto;padding:40px 20px 60px}}h1{{margin:0 0 8px;font-size:clamp(30px,4vw,46px);letter-spacing:-.03em;text-transform:uppercase;font-weight:600}}.lede{{margin:0 0 34px;font-size:17px;line-height:1.55;color:#3d342d;max-width:60ch}}
.grid{{display:grid;grid-template-columns:1fr 1fr;gap:36px}}.k{{font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--mute)}}h3{{margin:6px 0 8px;font-size:26px;letter-spacing:-.02em}}.card>p{{margin:0 0 16px;font-size:15px;line-height:1.5;color:#3d342d;min-height:4.5em}}
.phone{{background:#111;border-radius:44px;padding:12px;max-width:414px}}.phone iframe{{display:block;width:100%;height:800px;border:0;border-radius:33px;background:#fff}}.open a{{color:var(--ink);font-weight:600}}
@media (max-width:860px){{.grid{{grid-template-columns:1fr}}.card>p{{min-height:0}}}}</style></head><body><div class="wrap">
<h1>Two directions. Pick one.</h1><p class="lede">The same Meet the Maker email, built two ways from Ruby&#x27;s own photos. Whichever you choose, I rebuild all nine emails in that style, each with its own layout.</p>
<div class="grid">{card("Direction A", "Playful retro", "Built from her Instagram: chunky type, scalloped edges, a date sticker, warm blocks of terracotta and wine. Fun, like the bar.", "a.html")}
{card("Direction B", "Bold editorial", "Photo-led and magazine-like: one huge image, big serif headlines, numbered details, lots of space. Confident, more grown-up.", "b.html")}</div>
</div></body></html>'''
open(os.path.join(HERE, 'directions', 'index.html'), 'w').write(page)
print('ok')
