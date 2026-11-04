# Ruby's Email Kit, Direction A (playful retro, from her Instagram): nine emails, each with its own layout.
# Run: python3 kit/emails.py -> writes kit/emails/<key>.html and prints a manifest (kit/page.py calls this).
import json, os, html as H
HERE = os.path.dirname(os.path.abspath(__file__))
IMG = 'https://rubys-wine-shop.theserviceedit.com/kit/img/'
CDN = 'https://cdn.shopify.com/s/files/1/0836/3622/4220/files/'
SITE = 'https://rubyswineshop.com.au'
W = SITE + '/pages/whats-on'; F = SITE + '/pages/find-us'; G = SITE + '/pages/gift-boxes'; M = SITE + '/collections/merch'; GC = SITE + '/pages/gift-cards'
WINE, TERRA, CREAM, SAND = '#470606', '#BA5B3E', '#F2EBD7', '#E5D9C2'
SANS = "'DM Sans',Helvetica,Arial,sans-serif"
FAT = "'Archivo','Arial Black','Helvetica Neue',Arial,sans-serif"  # closest free match to her Swiss Wine Night poster type
FATV = "font-weight:900;text-transform:uppercase;font-stretch:100%;"
FONTS = 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Archivo:wdth,wght@62..125,100..900&display=swap'

def img(src, alt, w=600, link=None, style=''):
    t = f'<img src="{src}" width="{w}" alt="{H.escape(alt)}" style="display:block;width:100%;max-width:{w}px;height:auto;border:0;{style}">'
    return f'<a href="{link}" target="_blank" style="text-decoration:none;">{t}</a>' if link else t
def row(inner, bg=CREAM, pad='0'):
    return f'<tr><td class="px" bgcolor="{bg}" style="background:{bg};padding:{pad};">{inner}</td></tr>'
def edge(a, b): return f'<tr><td style="padding:0;line-height:0;font-size:0;">{img(IMG + f"sc-{a}-{b}.png", "", 600)}</td></tr>'
def SP(n): return f'<div style="height:{n}px;line-height:{n}px;font-size:0;">&nbsp;</div>'
def btn(label, url, bg, fg, align='left'):
    a = ' align="center" style="margin:0 auto;"' if align == 'center' else ''
    return f'<table role="presentation" cellpadding="0" cellspacing="0" border="0"{a}><tr><td bgcolor="{bg}" style="background:{bg};border-radius:999px;"><a href="{url}" target="_blank" style="display:inline-block;padding:16px 32px;font-family:{SANS};font-size:16px;font-weight:700;color:{fg};text-decoration:none;">{label}</a></td></tr></table>'
def p(t, c, size=16, lh=26, align='left', mb=0, w=400):
    return f'<p style="margin:0 0 {mb}px 0;font-family:{SANS};font-size:{size}px;line-height:{lh}px;font-weight:{w};color:{c};text-align:{align};">{t}</p>'
def lab(t, c, align='left', mb=12):
    return f'<p style="margin:0 0 {mb}px 0;font-family:{FAT};font-size:13px;line-height:18px;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;color:{c};text-align:{align};">{t}</p>'
def fat(t, c, size, cls='mid', align='left', mb=0, lh=None):
    size = round(size * SCALE.get(cls, 0.8)); lh = round(size * 0.94)
    return f'<h1 class="{cls}" style="margin:0 0 {mb}px 0;font-family:{FAT};{FATV}font-size:{size}px;line-height:{lh}px;letter-spacing:-0.04em;color:{c};text-align:{align};">{t}</h1>'
SCALE = {'lng': 0.68, 'mega': 0.8, 'huge': 0.8, 'mid': 0.82, 'sm': 0.82}
def dot(big, small, bg, fg, sub, size=136, bsz=30, align='center'):
    a = ' align="center" style="margin:0 auto;"' if align == 'center' else ''
    return (f'<table role="presentation" cellpadding="0" cellspacing="0" border="0"{a}><tr><td class="dot" width="{size}" height="{size}" align="center" valign="middle" bgcolor="{bg}" style="width:{size}px;height:{size}px;background:{bg};border-radius:50%;">'
            f'<p style="margin:0;font-family:{FAT};{FATV}font-size:{round(bsz*0.82)}px;line-height:{round(bsz*0.9)}px;letter-spacing:-0.02em;color:{fg};">{big}</p><p style="margin:3px 0 0 0;font-family:{SANS};font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;color:{sub};">{small}</p></td></tr></table>')
def two(a, b, wa=50, gap=20, stack=True, va='middle'):
    ca = 'col colpad' if stack else 'keep'; cb = 'col' if stack else 'keep'
    return (f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>'
            f'<td class="{ca}" width="{wa}%" valign="{va}" style="width:{wa}%;padding-right:{gap//2}px;">{a}</td>'
            f'<td class="{cb}" width="{100-wa}%" valign="{va}" style="width:{100-wa}%;padding-left:{gap//2}px;">{b}</td></tr></table>')
def three(cells, gap=10, stack=False):
    c = 'col colpad' if stack else 'keep'
    tds = ''.join(f'<td class="{c}" width="33%" valign="top" style="width:33%;padding:0 {gap//2}px;">{x}</td>' for x in cells)
    return f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>{tds}</tr></table>'
def day(big, small, bg, fg, sub, title, body, ink, last=False):
    """A dated line: round sticker on the left, chunky title and a line on the right. Stays side by side on phones."""
    b = '' if last else f'border-bottom:2px dashed {TERRA};'
    return (f'<tr><td class="keep" width="104" valign="middle" style="width:104px;padding:18px 0;{b}">{dot(big, small, bg, fg, sub, 92, 24, "left")}</td>'
            f'<td class="keep" valign="middle" style="padding:18px 0 18px 18px;{b}">{fat(title, ink, 26, "sm", "left", 6, 28)}{p(body, ink, 15, 23)}</td></tr>')
def table(rows): return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' + ''.join(rows) + '</table>'
def bye(line, frm='The Ruby&#x27;s crew (and Ruby)', bg=CREAM):
    return row(f'<div style="text-align:center;">{img(CDN + "rubys-cheers-hands.png?width=300", "", 104, None, "margin:0 auto;width:104px;")}' + SP(10) + fat(line, WINE, 32, 'mid', 'center', 6) + p(frm, TERRA, 14, 20, 'center') + '</div>', bg, '26px 40px 40px 40px')

def shell(title, pre, rows):
    return f'''<!DOCTYPE html>
<html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><base target="_blank">
<title>{title}</title>
<link href="{FONTS}" rel="stylesheet">
<style>
body{{margin:0;padding:0;background:{SAND};}}
a{{color:{TERRA};}}
@media (max-width:599px){{.w{{width:100%!important}}.px{{padding-left:22px!important;padding-right:22px!important}}.mega{{font-size:31px!important;line-height:30px!important}}.lng{{font-size:22px!important;line-height:22px!important}}.huge{{font-size:27px!important;line-height:26px!important}}.mid{{font-size:25px!important;line-height:25px!important}}.sm{{font-size:18px!important;line-height:19px!important}}.col{{display:block!important;width:100%!important;box-sizing:border-box!important;padding-left:0!important;padding-right:0!important}}.colpad{{padding-bottom:18px!important}}.col img,.keep img{{width:100%!important;max-width:100%!important}}.keep{{padding-left:3px!important;padding-right:3px!important}}.dot{{width:84px!important;height:84px!important}}.dot p:first-child{{font-size:17px!important;line-height:18px!important}}}}
</style></head>
<body style="margin:0;padding:0;background:{SAND};">
<div style="display:none;max-height:0;overflow:hidden;">{pre}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:{SAND};"><tr><td align="center" style="padding:24px 0;">
<table role="presentation" class="w" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:{CREAM};">
<tr><td align="center" bgcolor="{CREAM}" style="background:{CREAM};padding:26px 40px 22px 40px;"><a href="{SITE}/" target="_blank"><img src="{CDN}rubys-logo.png?width=300" width="100" height="100" alt="Ruby&#x27;s Wine Shop" style="display:block;width:100px;height:100px;border:0;"></a></td></tr>
{''.join(rows)}
<tr><td align="center" bgcolor="{SAND}" style="background:{SAND};padding:26px 40px;font-family:{SANS};font-size:12px;line-height:20px;color:{WINE};">Ruby&#x27;s Wine Shop &middot; 3/297 Sandgate Road, Albion QLD 4010<br><a href="mailto:info@rubyswineshop.com.au" style="color:{WINE};">info@rubyswineshop.com.au</a> &middot; <a href="https://www.instagram.com/rubys_wine_shop" style="color:{WINE};">Instagram</a><br>You&#x27;re getting this because you joined Ruby&#x27;s list. <a href="#" style="color:{WINE};">Unsubscribe</a></td></tr>
</table></td></tr></table></body></html>'''

def hours(bg=SAND, title='Come say hi.'):
    return row(fat(title, WINE, 34, 'mid', 'left', 12) + p('Walk-ins only, indoors and out. Build a DIY board from our rotating cheeses, dips, charcuterie and olives.', WINE, 15.5, 25, 'left', 20)
               + two(lab('Find us', TERRA, 'left', 6) + p('<b>3/297 Sandgate Road<br>Albion QLD 4010</b>', WINE, 15, 23), lab('Opening hours', TERRA, 'left', 6) + p('Mon and Wed 4 to 9pm<br>Thu 12 to 9pm<br>Fri and Sat 12 till late<br>Sun 12 to 8pm', WINE, 15, 23), 50, 24, True, 'top')
               + SP(22) + btn('Get directions', F, TERRA, CREAM), bg, '34px 44px 40px 44px')

EM = {}
def add(key, group, kicker, title, blurb, subject, pre, rows):
    EM[key] = dict(group=group, kicker=kicker, title=title, blurb=blurb, subject=subject, pre=pre, html=shell(H.escape(subject), H.escape(pre), rows))

# 1. EVENT: Meet the Maker (the chosen direction)
add('event', 'templates', 'Template · Event', 'One event, made unmissable',
 'Shown with your real Meet the Maker night. Swap the title, the date sticker and two lines, and it works for quiz, tastings or the Milk Bar.',
 'Meet the maker this Friday', 'Free tastings with Johnny from Unnatural Urges, Friday 6 November from 4pm.', [
  edge('cream', 'terra'),
  row('<div style="text-align:center;">' + lab('This Friday at Ruby&#x27;s', CREAM, 'center', 14) + fat('Meet<br>the maker.', CREAM, 84, 'mega', 'center', 18, 78)
      + p('Johnny from <b>Unnatural Urges</b> is pouring his spooky, fun wines, made right here in our own backyard in Queensland.', CREAM, 17, 27, 'center', 26) + dot('Fri 6', 'Nov · 4pm', WINE, CREAM, SAND) + '</div>', TERRA, '30px 48px 44px 48px'),
  edge('terra', 'cream'),
  row(img(IMG + 'bottles-wide.jpg', 'Five Unnatural Urges bottles lined up on the bar', 600, None, 'border-radius:22px;'), CREAM, '26px 24px 0 24px'),
  row(two(img(IMG + 'maker-tall.jpg', 'The winemaker at work', 270, None, 'border-radius:22px;'),
          fat('Free tastings.<br>Zero pressure.', WINE, 40, 'mid', 'left', 14) + p('Taste the whole range with the person who made it, ask him anything, and take home the bottle you fall for. The newest additions land on the shelf the same night.', WINE, 16, 26, 'left', 22) + btn('I&#x27;m coming', W, TERRA, CREAM), 48, 26), CREAM, '30px 40px 40px 40px'),
  edge('cream', 'wine'),
  row(two(fat('Every<br>Thursday<br>from 12.', CREAM, 46, 'mid', 'left', 10) + p('Ruby&#x27;s Milk Bar. A space for new mums to meet, sip and relax. Babies very welcome.', SAND, 15.5, 24),
          img(IMG + 'cheers-sq.jpg', 'Two glasses clinking against the sky', 250, None, 'border-radius:50%;'), 56, 20), WINE, '34px 44px 40px 44px'),
  edge('wine', 'cream'),
  bye('See you Friday.')])

# 2. PRODUCT SPOTLIGHT: the Pet Nat
add('spotlight', 'templates', 'Template · Product spotlight', 'One bottle, told well',
 'Shown with your best-selling Pet Nat. One big photo, why you love it, and a nudge to grab it before it goes.',
 'The Pet Nat everyone keeps asking for', "Refreshing, fruity, and here until she's not.", [
  edge('cream', 'wine'),
  row('<div style="text-align:center;">' + lab('This week&#x27;s pick', SAND, 'center', 14) + fat('Refreshing.<br>Fruity.<br>Delicious.', CREAM, 72, 'mega', 'center', 0, 68) + '</div>', WINE, '30px 40px 34px 40px'),
  row(img(IMG + 'petnat-tall.jpg', 'A glass and a bottle of Pet Nat outside at dusk', 600, F, 'border-radius:26px;'), WINE, '0 28px 0 28px'),
  row('<div style="text-align:center;">' + SP(4) + dot('Best', 'seller', TERRA, CREAM, CREAM, 112, 28) + SP(18) + p('A gorgeous little Queensland Pet Nat, and a best seller for a reason.', CREAM, 18, 28, 'center', 0) + '</div>', WINE, '28px 52px 40px 52px'),
  edge('wine', 'terra'),
  row('<div style="text-align:center;">' + fat('Here until<br>she&#x27;s not.', CREAM, 54, 'huge', 'center', 14, 52) + p('When it&#x27;s gone, it&#x27;s gone. Come in for a glass or grab a bottle to take home.', CREAM, 16, 25, 'center', 24) + btn('Grab a bottle', F, WINE, CREAM, 'center') + '</div>', TERRA, '34px 48px 42px 48px'),
  edge('terra', 'cream'),
  row(three([img(IMG + 'glass-sq.jpg', 'A glass of white held up in the sun', 180, None, 'border-radius:50%;'), img(IMG + 'petnat-sq.jpg', 'The Pet Nat at dusk', 180, None, 'border-radius:50%;'), img(IMG + 'cheers-sq.jpg', 'Two glasses clinking against the sky', 180, None, 'border-radius:50%;')], 14), CREAM, '28px 34px 4px 34px'),
  bye('See you at the shelf.')])

# 3. WHAT'S ON: the week, as stickers
add('whatson', 'templates', 'Template · What&#x27;s on', 'The week at Ruby&#x27;s',
 'The weekly or fortnightly round-up: each night gets a date sticker, a chunky title and one line. Same blocks every time, so it takes minutes.',
 "This week at Ruby's", 'Milk Bar Thursday, meet the maker Friday, and Sunday sun.', [
  row(two(img(IMG + 'cheers-sq.jpg', 'Two glasses clinking against the sky', 290, None, 'border-radius:22px;'), img(IMG + 'tee-sq.jpg', 'A Ruby&#x27;s T-shirt at the bar', 290, None, 'border-radius:22px;'), 50, 14, False), CREAM, '0 24px 26px 24px'),
  edge('cream', 'terra'),
  row(fat('This week<br>at Ruby&#x27;s.', CREAM, 70, 'mega', 'left', 14, 66) + p('One glass or a whole night of it. Here&#x27;s what&#x27;s on.', CREAM, 17, 26), TERRA, '26px 44px 36px 44px'),
  edge('terra', 'cream'),
  row(table([
    day('Thu', 'from 12', WINE, CREAM, SAND, 'Ruby&#x27;s Milk Bar', 'New mums meet, sip and relax. Babies welcome, prams best left in the car.', WINE),
    day('Fri 6', 'from 4pm', TERRA, CREAM, CREAM, 'Meet the maker', 'Free tastings with Johnny from Unnatural Urges.', WINE),
    day('Wed', '2nd of month', WINE, CREAM, SAND, 'Quiz night', 'With The Weekly Fifty. Booking opens two weeks before.', WINE),
    day('Sun', '12 to 8', TERRA, CREAM, CREAM, 'Sunday sun', 'What a day for a wine.', WINE, True)]) + SP(18) + btn('See what&#x27;s on', W, WINE, CREAM), CREAM, '18px 40px 38px 40px'),
  edge('cream', 'wine'),
  row(two(img(IMG + 'chilledred-sq.jpg', 'Chilled red bottles on a Ruby&#x27;s T-shirt', 250, M, 'border-radius:50%;'),
          lab('Our most-asked question', SAND, 'left', 10) + fat('Chilled<br>red?', CREAM, 56, 'huge', 'left', 10, 52) + p('Always yes. Now it&#x27;s on a T-shirt too.', SAND, 16, 25, 'left', 20) + btn('Shop the merch', M, CREAM, WINE), 46, 24), WINE, '34px 44px 40px 44px'),
  edge('wine', 'cream'),
  bye('See you at the bar.')])

# 4. GIFT BOX DROP
add('giftdrop', 'templates', 'Template · Gift box drop', 'Boxes, prices, cut-offs',
 "Big prices, big cut-off dates and your own gift box artwork. Works for Christmas now, then Mother's Day, end of financial year and corporate thank-yous.",
 'Wine gifts, reimagined', 'Three boxes, hand-picked by us. Ruby Custom orders close 6 December.', [
  edge('cream', 'terra'),
  row('<div style="text-align:center;">' + lab('Christmas at Ruby&#x27;s', CREAM, 'center', 14) + fat('Wine gifts,<br>reimagined.', CREAM, 70, 'mega', 'center', 16, 66) + p('Hand-picked by us, not an algorithm. Three bottles from the independent winemakers we pour all year, with tasting cards, ready to give.', CREAM, 17, 27, 'center', 24) + dot('From', '$160', WINE, CREAM, SAND, 120, 26) + '</div>', TERRA, '30px 48px 42px 48px'),
  edge('terra', 'cream'),
  row(table([
    f'<tr><td class="keep" valign="middle" style="padding:20px 0;border-bottom:2px dashed {TERRA};">{fat("Introduction", WINE, 28, "sm", "left", 4, 30)}{p("A sparkling, a white and a red. Fun and easy drinking.", WINE, 15, 23)}</td><td class="keep" align="right" valign="middle" width="130" style="width:130px;padding:20px 0;border-bottom:2px dashed {TERRA};">{fat("$160", TERRA, 40, "mid", "right")}</td></tr>',
    f'<tr><td class="keep" valign="middle" style="padding:20px 0;border-bottom:2px dashed {TERRA};">{fat("Explorer&#x27;s", WINE, 28, "sm", "left", 4, 30)}{p("Three standout bottles you won&#x27;t find in an average bottle shop, with a personal note.", WINE, 15, 23)}</td><td class="keep" align="right" valign="middle" width="130" style="width:130px;padding:20px 0;border-bottom:2px dashed {TERRA};">{fat("$260", TERRA, 40, "mid", "right")}</td></tr>',
    f'<tr><td class="keep" valign="middle" style="padding:20px 0;">{fat("The Ruby Custom", WINE, 28, "sm", "left", 4, 30)}{p("Three premium bottles, fully bespoke. Tell us about them and we&#x27;ll build it.", WINE, 15, 23)}</td><td class="keep" align="right" valign="middle" width="130" style="width:130px;padding:20px 0;">{fat("$380+", TERRA, 40, "mid", "right")}</td></tr>'])
      + SP(20) + btn('Choose your box', G, WINE, CREAM, 'center'), CREAM, '22px 44px 40px 44px'),
  edge('cream', 'wine'),
  row('<div style="text-align:center;">' + lab('Get your order in by', SAND, 'center', 20) + two(dot('6 Dec', 'Ruby Custom', CREAM, WINE, TERRA, 150, 34), dot('13 Dec', 'The rest', TERRA, CREAM, CREAM, 150, 34), 50, 10, False) + SP(22)
      + p('Pickup or delivery from Wednesday 2 December. Free pickup in Albion, $15 delivery across Brisbane metro, free on orders over $800 (minimum 5 boxes). Adults 18+ only.', SAND, 14.5, 23, 'center') + '</div>', WINE, '34px 44px 40px 44px'),
  edge('wine', 'cream'),
  bye('Cheers to the season.')])

# 5. WELCOME 2
add('welcome2', 'flows', 'Welcome · Email 2 · 3 days later', 'Take a bit of Ruby&#x27;s home',
 'Sends three days after the welcome email. It turns a new subscriber into a customer: the shelf, the merch, the boxes and gift cards.',
 "Take a bit of Ruby's home", 'The shelf, the boxes, and the answer to our most-asked question.', [
  row(img(IMG + 'glass-tall.jpg', 'A glass of white held in the late sun, in a Ruby&#x27;s T-shirt', 600, F, 'border-radius:26px;'), CREAM, '0 24px 28px 24px'),
  row(fat('Everything<br>we pour,<br>you can take<br>home.', WINE, 62, 'mega', 'left', 18, 60) + p('Our shelf is always growing, with unique and classic wines from all over the world. Hard-to-find drops from Switzerland, skin-contact Georgian beauties, and a great selection from our own backyard in QLD.', WINE, 16.5, 27, 'left', 24) + btn('Come and browse', F, TERRA, CREAM), CREAM, '4px 44px 40px 44px'),
  edge('cream', 'wine'),
  row('<div style="text-align:center;">' + lab('The question we hear most', SAND, 'center', 12) + fat('&ldquo;Chilled<br>red?&rdquo;', CREAM, 84, 'mega', 'center', 18, 78) + img(IMG + 'chilledred-sq.jpg', 'Chilled red bottles on a Ruby&#x27;s T-shirt', 300, M, 'border-radius:50%;margin:0 auto;max-width:300px;')
      + SP(20) + p('The answer is always yes. Now it&#x27;s on a T-shirt.', CREAM, 17, 26, 'center', 22) + btn('See the merch', M, CREAM, WINE, 'center') + '</div>', WINE, '30px 48px 42px 48px'),
  edge('wine', 'sand'),
  row(fat('For someone else.', WINE, 36, 'mid', 'left', 20)
      + two(img(IMG + 'giftboxes-sq.jpg', 'Ruby&#x27;s gift boxes', 250, G, 'border-radius:22px;') + SP(12) + fat('Gift boxes', WINE, 24, 'sm', 'left', 4, 26) + p('Three bottles, hand-picked. From $160.', WINE, 14.5, 22),
            img(IMG + 'cheers-sq.jpg', 'Two glasses clinking against the sky', 250, GC, 'border-radius:22px;') + SP(12) + fat('Gift cards', WINE, 24, 'sm', 'left', 4, 26) + p('For the friend who&#x27;d love it here.', WINE, 14.5, 22), 50, 18, True, 'top'), SAND, '30px 44px 38px 44px'),
  edge('sand', 'cream'),
  bye('See you at the bar.')])

# 6. GIFT BOX REMINDER
add('reminder', 'flows', 'Gift box reminder · A few hours later', 'Still deciding?',
 "For anyone who starts a box order and doesn't finish. Short, warm, and straight back to checkout. Shopify fills in their actual box.",
 'Your box is still waiting', 'Pick up right where you left off.', [
  row('<div style="text-align:center;">' + fat('Still<br>deciding?', WINE, 78, 'mega', 'center', 16, 74) + p('You were halfway through choosing a gift. We&#x27;ve saved it, so you can pick up right where you left off.', WINE, 17, 27, 'center') + '</div>', CREAM, '6px 52px 30px 52px'),
  row(f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{SAND}" style="background:{SAND};border-radius:26px;"><tr><td style="padding:22px;">'
      + two(img(IMG + 'giftboxes-sq.jpg', 'Ruby&#x27;s gift box', 220, G, 'border-radius:18px;'), lab('In your cart', TERRA, 'left', 6) + fat('Introduction Collection', WINE, 28, 'sm', 'left', 8, 30) + p('A sparkling, a white and a red, with tasting cards.', WINE, 15, 23, 'left', 10) + fat('$160', TERRA, 36, 'mid'), 44, 20) + '</td></tr></table>'
      + SP(26) + btn('Finish your order', G, TERRA, CREAM, 'center'), CREAM, '0 36px 40px 36px'),
  edge('cream', 'wine'),
  row('<div style="text-align:center;">' + lab('Orders close', SAND, 'center', 18) + dot('Sun 13', 'December', CREAM, WINE, TERRA, 170, 40) + SP(18) + p('Pickup or Brisbane delivery from Wednesday 2 December.', SAND, 15, 23, 'center') + '</div>', WINE, '34px 44px 40px 44px'),
  edge('wine', 'cream'),
  bye('Any questions, just reply.', 'We&#x27;re real people. The Ruby&#x27;s crew (and Ruby)')])

# 7. THANK YOU
add('thanks', 'flows', 'After they buy · Straight away', 'Thank you',
 'A warm thank-you to every box buyer, with pickup and delivery details as stickers so they never have to ask.',
 "Thank you from Ruby's", "Your box is in good hands. Here's what happens next.", [
  row(img(IMG + 'cheers-wide.jpg', 'Two glasses clinking against a blue sky', 600, None, 'border-radius:26px;'), CREAM, '0 24px 0 24px'),
  row('<div style="text-align:center;">' + fat('Cheers<br>to you.', TERRA, 88, 'mega', 'center', 16, 82) + p('Your box is hand-picked and packed by us, with tasting cards and your personal note. It&#x27;s in good hands.', WINE, 17, 27, 'center') + '</div>', CREAM, '30px 52px 34px 52px'),
  edge('cream', 'terra'),
  row('<div style="text-align:center;">' + lab('What happens next', CREAM, 'center', 20)
      + three([dot('2 Dec', 'Ready from', WINE, CREAM, SAND, 140, 30), dot('Free', 'Albion pickup', CREAM, WINE, TERRA, 140, 30), dot('$15', 'Brisbane delivery', WINE, CREAM, SAND, 140, 30)], 8)
      + SP(22) + p('Adults 18+ only, and ID may be checked on pickup or delivery. Need to change your note or delivery? Just reply to this email.', CREAM, 14.5, 23, 'center') + '</div>', TERRA, '30px 30px 38px 30px'),
  edge('terra', 'sand'),
  hours(SAND, 'While you&#x27;re<br>in Albion.'),
  edge('sand', 'cream'),
  bye('Cheers to the season.')])

# 8. COME IN FOR A GLASS (January)
add('glass', 'flows', 'After they buy · Mid January', 'Come in for a glass',
 'Goes to box buyers who joined at checkout. It turns a Christmas gift into a night at the bar, with the regular nights to come back for.',
 'Now come and taste it here', "Thanks for choosing Ruby's at Christmas.", [
  edge('cream', 'wine'),
  row(fat('You gave<br>the box.', CREAM, 76, 'mega', 'left', 6, 72) + fat('Now come and<br>taste it here.', TERRA, 44, 'huge', 'left', 18, 44) + p('Grab a seat indoors or out, pick from our rotating pours by the glass, and let the evening unfold however it wants to.', SAND, 16.5, 26, 'left', 24) + btn('Plan your visit', F, CREAM, WINE), WINE, '28px 44px 34px 44px'),
  row(img(IMG + 'long-table-wide.jpg', 'A long table of wine and friends inside Ruby&#x27;s', 600, F, 'border-radius:26px;'), WINE, '0 24px 32px 24px'),
  edge('wine', 'cream'),
  row(fat('Worth coming<br>back for.', WINE, 44, 'huge', 'left', 8, 44) + table([
    day('Thu', 'from 12', TERRA, CREAM, CREAM, 'Ruby&#x27;s Milk Bar', 'New mums meet, sip and relax. Babies welcome.', WINE),
    day('Wed', '2nd of month', WINE, CREAM, SAND, 'Quiz night', 'With The Weekly Fifty. Spots go fast.', WINE),
    day('Free', 'tastings', TERRA, CREAM, CREAM, 'Meet the maker nights', 'Taste with the people who make the wine.', WINE, True)]), CREAM, '30px 40px 30px 40px'),
  edge('cream', 'sand'),
  hours(SAND),
  edge('sand', 'cream'),
  bye('See you at the bar.')])

# 9. SQUARE REGULARS
add('regulars', 'square', 'Your Square regulars · Sent once', 'A note from Tamara',
 "One email to customers with 3 or more visits in the past year, the last within 6 months. It says who it's from, what they'll get, and makes leaving easy.",
 "A note from Ruby's", "You're one of our regulars, so we wanted to tell you first.", [
  row(img(IMG + 'tee-back-wide.jpg', 'A Ruby&#x27;s T-shirt at the bar on Sandgate Road', 600, None, 'border-radius:26px;'), CREAM, '0 24px 0 24px'),
  row(lab('For our regulars', TERRA, 'left', 12) + fat('You&#x27;re one of<br>the reasons we<br>love this place.', WINE, 52, 'huge', 'left', 18, 52)
      + p('You&#x27;ve been in to see us a few times this year, so we wanted you to hear it from us first: we&#x27;re starting a Ruby&#x27;s email.', WINE, 17, 27, 'left', 14) + p('It&#x27;s short and it&#x27;s from us. No more than one a week.', WINE, 17, 27), CREAM, '30px 44px 34px 44px'),
  edge('cream', 'terra'),
  row(fat('You&#x27;ll hear<br>about it first.', CREAM, 46, 'huge', 'left', 8, 46) + table([
    day('Thu', 'from 12', WINE, CREAM, SAND, 'Milk Bar and events', 'What&#x27;s on at the bar, as soon as it&#x27;s announced.', CREAM),
    day('New', 'bottles', CREAM, WINE, TERRA, 'On the shelf', 'Bottles worth taking home, as they land.', CREAM),
    day('6 Dec', 'order by', WINE, CREAM, SAND, 'Christmas gift boxes', 'Ruby Custom orders close Sunday 6 December.', CREAM, True)]), TERRA, '30px 40px 30px 40px'),
  edge('terra', 'wine'),
  row(two(img(IMG + 'finalist-sq.jpg', '2026 Awards finalist', 200, None, 'border-radius:22px;'), lab('Thank you', SAND, 'left', 8) + fat('We made<br>the finals.', CREAM, 46, 'huge', 'left', 10, 46) + p('Ruby&#x27;s is a 2026 Awards finalist, and that&#x27;s down to regulars like you.', SAND, 16, 25), 40, 24), WINE, '32px 44px 36px 44px'),
  edge('wine', 'sand'),
  row(fat('Not for you?<br>No worries.', WINE, 38, 'mid', 'left', 10, 40) + p('Tap unsubscribe at the bottom of this email and you won&#x27;t hear from us again. No hard feelings, and we&#x27;ll still save you a seat.', WINE, 16, 25), SAND, '30px 44px 34px 44px'),
  edge('sand', 'cream'),
  bye('See you at the bar.', 'Tamara and the Ruby&#x27;s crew (and Ruby)')])

RUBY = CDN + '4x3_MikaylaADAMS_RubysWineShop_11.jpg?width=1200&height=1200&crop=center'
BAR = CDN + '4x3_MikaylaADAMS_RubysWineShop_8.jpg?width=1200&height=800&crop=center'
P_INTRO = SITE + '/products/christmas-gift-box?variant=67604206616796'
P_EXPL = SITE + '/products/christmas-gift-box?variant=67604206649564'

# 10. WELCOME 1
add('welcome1', 'flows', 'Welcome · Email 1 · Straight away', 'Welcome to the neighbourhood',
 "The first email every new subscriber gets: the Swiss story behind Ruby's, what lands in their inbox, Ruby herself, and how to visit.",
 "Welcome to Ruby's", "You're on the list. Here's what you've signed up for.", [
  edge('cream', 'terra'),
  row('<div style="text-align:center;">' + lab('You&#x27;re on the list', CREAM, 'center', 14) + fat('Welcome to the<br>neighbourhood.', CREAM, 66, 'lng', 'center', 18)
      + p('Ruby&#x27;s was inspired by a childhood spent in a small Swiss town, where sharing a bottle is never just about the wine. It&#x27;s how friends become family. We brought a little of that spirit to Albion, and now you&#x27;re part of it.', CREAM, 17, 27, 'center') + '</div>', TERRA, '30px 48px 42px 48px'),
  edge('terra', 'cream'),
  row(img(BAR, 'A busy night at the bar at Ruby&#x27;s', 600, F, 'border-radius:26px;'), CREAM, '26px 24px 6px 24px'),
  row(fat('What lands in<br>your inbox.', WINE, 52, 'huge', 'left', 8) + table([
    day('01', 'weekly', TERRA, CREAM, CREAM, 'What&#x27;s pouring', '8 to 10 rotating pours by the glass. Know what&#x27;s open before you walk in.', WINE),
    day('02', 'events', WINE, CREAM, SAND, 'What&#x27;s on', 'Quiz night with The Weekly Fifty, Milk Bar Thursdays and meet the maker nights.', WINE),
    day('03', 'the shelf', TERRA, CREAM, CREAM, 'New arrivals', 'Hard-to-find Swiss drops, skin-contact Georgian beauties and the best of our QLD backyard.', WINE, True)])
      + SP(18) + btn('See what&#x27;s on', W, WINE, CREAM), CREAM, '26px 40px 38px 40px'),
  edge('cream', 'wine'),
  row(two(img(RUBY, 'Ruby the border collie under a chair at the bar', 260, SITE + '/pages/about', 'border-radius:50%;'),
          lab('Meet the boss', SAND, 'left', 10) + fat('This is<br>Ruby.', CREAM, 60, 'huge', 'left', 12) + p('Our founder&#x27;s border collie, and the reason the bar has a name. She greets every visitor like an old friend and firmly believes the world revolves around her. She is usually right.', SAND, 15.5, 25), 46, 24), WINE, '34px 44px 40px 44px'),
  edge('wine', 'sand'),
  hours(SAND),
  edge('sand', 'cream'),
  bye('No pretension. Just great wine and good people.')])

# 11. CHRISTMAS (written by Mel, sent by Tamara)
add('christmas', 'christmas', 'Christmas · Thu 19 Nov', 'Three boxes, hand-picked',
 'Your three boxes, prices and the 6 and 13 December cut-offs, plus a line for corporate buyers, sent well before Ruby Custom orders close.',
 "Christmas gift boxes at Ruby's", 'Three boxes, hand-picked by us. The Ruby Custom closes Sunday 6 December.', [
  row(img(IMG + 'giftboxes-sq.jpg', 'Wine Gifts Reimagined: Ruby&#x27;s Christmas gift boxes', 600, G, 'border-radius:26px;'), CREAM, '0 24px 0 24px'),
  row('<div style="text-align:center;">' + lab('Christmas 2026', TERRA, 'center', 12) + fat('Hand-picked<br>by us, not an<br>algorithm.', WINE, 64, 'mega', 'center', 16)
      + p('Three bottles in every box, chosen from the independent winemakers we pour all year. Tasting cards included, beautifully packaged and ready to give.', WINE, 17, 27, 'center') + '</div>', CREAM, '30px 48px 30px 48px'),
  row(three([dot('6 Dec', 'Custom closes', WINE, CREAM, SAND, 140, 30), dot('13 Dec', 'The rest close', TERRA, CREAM, CREAM, 140, 30), dot('2 Dec', 'Ready from', SAND, WINE, TERRA, 140, 30)], 8), CREAM, '0 30px 34px 30px'),
  edge('cream', 'wine'),
  row('<div style="text-align:center;">' + lab('Limited · closes first', SAND, 'center', 10) + fat('The Ruby<br>Custom.', CREAM, 66, 'mega', 'center', 10) + fat('From $380', TERRA, 40, 'mid', 'center', 16)
      + p('Three premium bottles, fully bespoke. Tell us about the lucky recipient: their tastes, travels and the wines they&#x27;ve loved. We&#x27;ll build something made entirely for them, with a personal note and tasting cards.', SAND, 16, 26, 'center', 24) + btn('Request a custom box', G + '#ruby-custom', CREAM, WINE, 'center') + '</div>', WINE, '30px 48px 40px 48px'),
  edge('wine', 'cream'),
  row(two(f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{TERRA}" style="background:{TERRA};border-radius:24px;"><tr><td style="padding:24px 22px;">' + fat('$260', CREAM, 46, 'mid', 'left', 6) + fat('Explorer&#x27;s', CREAM, 26, 'sm', 'left', 8) + p('Three standout bottles you won&#x27;t find in an average bottle shop, with a personal note.', CREAM, 14.5, 22, 'left', 16) + btn('Order', P_EXPL, WINE, CREAM) + '</td></tr></table>',
          f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{SAND}" style="background:{SAND};border-radius:24px;"><tr><td style="padding:24px 22px;">' + fat('$160', WINE, 46, 'mid', 'left', 6) + fat('Introduction', WINE, 26, 'sm', 'left', 8) + p('A sparkling, a white and a red. Fun, easy drinking from producers we love.', WINE, 14.5, 22, 'left', 16) + btn('Order', P_INTRO, WINE, CREAM) + '</td></tr></table>', 50, 16, True, 'top'), CREAM, '30px 32px 34px 32px'),
  edge('cream', 'terra'),
  row(fat('Buying for<br>the team?', CREAM, 52, 'huge', 'left', 12) + p('The custom form takes your company name, and orders over $800 (minimum 5 boxes) get free Brisbane delivery. Free pickup in Albion, $15 delivery across Brisbane metro.', CREAM, 16, 26, 'left', 22) + btn('Choose your boxes', G, WINE, CREAM) + SP(16) + p('Only available to adults 18+. ID may be checked on pickup or delivery.', CREAM, 13, 20), TERRA, '30px 44px 38px 44px'),
  edge('terra', 'cream'),
  bye('Cheers to the season.')])

# 12. LAST ORDERS
add('lastorders', 'christmas', 'Last orders · Thu 10 Dec', 'Boxes close Sunday 13 Dec',
 'The final call before the cut-off: a big date, the two boxes still open, and gift cards as the fallback for late shoppers.',
 "Last orders at Ruby's", "Explorer's and Introduction boxes close Sunday. After that, there's always a gift card.", [
  edge('cream', 'wine'),
  row('<div style="text-align:center;">' + lab('Last orders', SAND, 'center', 18) + dot('Sun 13', 'December', TERRA, CREAM, CREAM, 190, 46) + SP(22) + fat('Boxes close<br>Sunday.', CREAM, 76, 'lng', 'center', 14).replace('class="mega"', 'class="huge"')
      + p('Order by Sunday and we&#x27;ll have yours packed with tasting cards, ready for pickup or Brisbane delivery.', SAND, 17, 27, 'center') + '</div>', WINE, '30px 48px 40px 48px'),
  edge('wine', 'cream'),
  row(table([
    f'<tr><td class="keep" valign="middle" style="padding:20px 0;border-bottom:2px dashed {TERRA};">{fat("Introduction", WINE, 28, "sm", "left", 4)}{p("A sparkling, a white and a red.", WINE, 15, 23)}</td><td class="keep" align="right" valign="middle" width="96" style="width:96px;padding:20px 0;border-bottom:2px dashed {TERRA};"><a href="{P_INTRO}" target="_blank" style="text-decoration:none;">{fat("$160", TERRA, 40, "mid", "right", 2)}{lab("Order", TERRA, "right", 0)}</a></td></tr>',
    f'<tr><td class="keep" valign="middle" style="padding:20px 0;">{fat("Explorer&#x27;s", WINE, 30, "sm", "left", 4)}{p("Bottles you won&#x27;t find in an average bottle shop, plus a personal note.", WINE, 15, 23)}</td><td class="keep" align="right" valign="middle" width="96" style="width:96px;padding:20px 0;"><a href="{P_EXPL}" target="_blank" style="text-decoration:none;">{fat("$260", WINE, 40, "mid", "right", 2)}{lab("Order", WINE, "right", 0)}</a></td></tr>'])
      + SP(10) + p('Free pickup in Albion, $15 delivery across Brisbane metro. 18+ only.', WINE, 14, 21), CREAM, '22px 44px 32px 44px'),
  edge('cream', 'terra'),
  row(two(fat('Missed<br>the cut-off?', CREAM, 52, 'huge', 'left', 12) + p('Give them a seat at the bar instead. A Ruby&#x27;s gift card works for take-away bottles and drinks in-store, and we email it straight to them.', CREAM, 16, 26, 'left', 20) + btn('Buy a gift card', GC, WINE, CREAM),
          img(IMG + 'cheers-sq.jpg', 'Two glasses clinking against the sky', 250, GC, 'border-radius:50%;'), 56, 22), TERRA, '32px 44px 38px 44px'),
  edge('terra', 'cream'),
  bye('Cheers to the season.')])

os.makedirs(os.path.join(HERE, 'emails'), exist_ok=True)
man = {}
for k, v in EM.items():
    open(os.path.join(HERE, 'emails', k + '.html'), 'w').write(v['html'])
    man[k] = {x: v[x] for x in ('group', 'kicker', 'title', 'blurb', 'subject', 'pre')}
print(json.dumps(man))
