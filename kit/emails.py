# Ruby's Email Kit: hand-built emails using Ruby's own Instagram and site photos.
# Run: python3 kit/emails.py  -> writes kit/emails/<key>.html and prints a manifest.
import json, os, html as H
HERE = os.path.dirname(os.path.abspath(__file__))
IMG = 'https://rubys-wine-shop.theserviceedit.com/kit/img/'
CDN = 'https://cdn.shopify.com/s/files/1/0836/3622/4220/files/'
SITE = 'https://rubyswineshop.com.au'
WINE, TERRA, CREAM, SAND, STONE = '#470606', '#BA5B3E', '#F2EBD7', '#E5D9C2', '#B8A88A'
SERIF = "'Playfair',Georgia,'Times New Roman',serif"
SANS = "'DM Sans',Helvetica,Arial,sans-serif"

def e(s): return H.escape(H.unescape(s), quote=False).replace("'", '&#x27;')

def img(src, alt, w=600, link=None, style=''):
    t = f'<img src="{src}" width="{w}" alt="{e(alt)}" style="display:block;width:100%;max-width:{w}px;height:auto;border:0;{style}">'
    return f'<a href="{link}" target="_blank" style="text-decoration:none;">{t}</a>' if link else t

def block(bg, inner, pad='40px 48px', cls='px'):
    return f'<tr><td class="{cls}" bgcolor="{bg}" style="background:{bg};padding:{pad};">{inner}</td></tr>'

def full(inner): return f'<tr><td style="padding:0;">{inner}</td></tr>'

def kick(t, c=TERRA, mb=12): return f'<p style="margin:0 0 {mb}px 0;font-family:{SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:{c};">{e(t)}</p>'

def head(t, c=WINE, size=40, lh=None, italic=False, mb=16, align='left', cls='h1'):
    lh = lh or int(size * 1.12)
    st = 'font-style:italic;font-weight:400;' if italic else 'font-weight:700;'
    return f'<h1 class="{cls}" style="margin:0 0 {mb}px 0;font-family:{SERIF};{st}font-size:{size}px;line-height:{lh}px;color:{c};text-align:{align};">{t}</h1>'

def para(t, c=WINE, size=16, lh=26, mb=14, align='left'):
    return ''.join(f'<p style="margin:0 0 {mb}px 0;font-family:{SANS};font-size:{size}px;line-height:{lh}px;color:{c};text-align:{align};">{e(x)}</p>' for x in t.split('\n\n'))

def btn(label, url, bg=WINE, fg=CREAM, align='left'):
    a = ' align="center" style="margin:0 auto;"' if align == 'center' else ''
    return f'<table role="presentation" cellpadding="0" cellspacing="0" border="0"{a}><tr><td bgcolor="{bg}" style="background:{bg};border-radius:999px;"><a href="{url}" target="_blank" style="display:inline-block;padding:15px 30px;font-family:{SANS};font-size:15px;font-weight:700;color:{fg};text-decoration:none;">{e(label)}</a></td></tr></table>'

def cols(cells, gap=16):
    """cells: list of (width_pct, html). Stacks on mobile."""
    n = len(cells); tds = []
    for i, (w, inner) in enumerate(cells):
        pl = 0 if i == 0 else gap // 2; pr = 0 if i == n - 1 else gap // 2
        tds.append(f'<td class="col{" colpad" if i < n-1 else ""}" width="{w}%" valign="top" style="width:{w}%;padding:0 {pr}px 0 {pl}px;">{inner}</td>')
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' + ''.join(tds) + '</tr></table>'

def ticket(rows, bg=CREAM, ink=WINE, rule=TERRA):
    cells = ''.join(f'<td class="col tk" valign="top" style="padding:16px 14px;border-left:{"0" if i==0 else "2px dashed "+rule};text-align:center;"><p style="margin:0 0 4px 0;font-family:{SANS};font-size:10px;letter-spacing:3px;text-transform:uppercase;color:{rule};">{e(a)}</p><p style="margin:0;font-family:{SERIF};font-weight:700;font-size:22px;line-height:27px;color:{ink};">{e(b)}</p></td>' for i, (a, b) in enumerate(rows))
    return f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{bg}" style="background:{bg};border:2px solid {rule};border-radius:14px;"><tr>{cells}</tr></table>'

def listrow(left_img, title, note, tag='', link=None, ink=WINE, acc=TERRA, last=False):
    border = '' if last else f'border-bottom:1px solid {STONE};'
    t = f'<p style="margin:0 0 4px 0;font-family:{SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:{acc};">{e(tag)}</p>' if tag else ''
    return (f'<tr><td width="120" valign="top" style="width:120px;padding:16px 0;{border}">{img(left_img, title, 120, link, "border-radius:8px;")}</td>'
            f'<td valign="middle" style="padding:16px 0 16px 18px;{border}">{t}<p style="margin:0 0 4px 0;font-family:{SERIF};font-weight:700;font-size:21px;line-height:26px;color:{ink};">{e(title)}</p>'
            f'<p style="margin:0;font-family:{SANS};font-size:14.5px;line-height:22px;color:{ink};">{e(note)}</p></td></tr>')

def table(rows): return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' + ''.join(rows) + '</table>'

def hours(bg=SAND, title='Come say hi'):
    return block(bg, head(title, size=28, mb=10, cls='h2') + para('Walk-ins only, indoors and out. Build a DIY board from our rotating cheeses, dips, charcuterie and olives.', size=15.5, lh=25, mb=18)
        + cols([(50, f'<p style="margin:0 0 6px 0;font-family:{SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:{TERRA};">Find us</p><p style="margin:0;font-family:{SANS};font-size:15px;line-height:23px;font-weight:700;color:{WINE};">3/297 Sandgate Road<br>Albion QLD 4010</p>'),
                (50, f'<p style="margin:0 0 6px 0;font-family:{SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:{TERRA};">Opening hours</p><p style="margin:0;font-family:{SANS};font-size:15px;line-height:23px;color:{WINE};">Mon and Wed 4 to 9pm<br>Thu 12 to 9pm<br>Fri and Sat 12 till late<br>Sun 12 to 8pm</p>')], 24)
        + '<div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>' + btn('Directions', SITE + '/pages/find-us', TERRA), '36px 48px 40px 48px')

def signoff(line, frm="The Ruby&#x27;s crew (and Ruby)", bg=CREAM):
    return block(bg, f'<p style="margin:0 0 4px 0;font-family:{SERIF};font-style:italic;font-size:22px;line-height:30px;color:{WINE};">{e(line)}</p><p style="margin:0;font-family:{SANS};font-size:14px;line-height:20px;color:{TERRA};">{frm}</p>', '32px 48px 40px 48px')

def shell(subject, pre, eyebrow, rows, top=CREAM):
    return f'''<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<base target="_blank">
<title>{e(subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Playfair:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
<style>
body{{margin:0;padding:0;background:{SAND};}}
a{{color:{TERRA};}}
@media (max-width:599px){{.w{{width:100%!important}}.px{{padding-left:24px!important;padding-right:24px!important}}.h1{{font-size:34px!important;line-height:39px!important}}.h2{{font-size:26px!important;line-height:31px!important}}.big{{font-size:64px!important;line-height:66px!important}}.col{{display:block!important;width:100%!important;box-sizing:border-box!important;padding-left:0!important;padding-right:0!important}}.colpad{{padding-bottom:18px!important}}.tk{{border-left:0!important;border-top:2px dashed {TERRA}!important}}.tk:first-child{{border-top:0!important}}}}
</style>
</head>
<body style="margin:0;padding:0;background:{SAND};">
<div style="display:none;max-height:0;overflow:hidden;">{e(pre)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:{SAND};"><tr><td align="center" style="padding:24px 0;">
<table role="presentation" class="w" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:{CREAM};">
<tr><td align="center" bgcolor="{top}" style="background:{top};padding:28px 40px 4px 40px;"><a href="{SITE}/" target="_blank"><img src="{CDN}rubys-logo.png?width=300" width="110" height="110" alt="Ruby&#x27;s Wine Shop" style="display:block;width:110px;height:110px;border:0;"></a></td></tr>
<tr><td align="center" bgcolor="{top}" style="background:{top};padding:0 40px 24px 40px;font-family:{SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:{WINE};">{e(eyebrow)}</td></tr>
{''.join(rows)}
<tr><td align="center" bgcolor="{SAND}" style="background:{SAND};padding:28px 40px;font-family:{SANS};font-size:12px;line-height:20px;color:{WINE};">Ruby&#x27;s Wine Shop &middot; 3/297 Sandgate Road, Albion QLD 4010<br><a href="mailto:info@rubyswineshop.com.au" style="color:{WINE};">info@rubyswineshop.com.au</a> &middot; <a href="https://www.instagram.com/rubys_wine_shop" target="_blank" style="color:{WINE};">Instagram</a><br>You&#x27;re getting this because you joined Ruby&#x27;s list. <a href="#" style="color:{WINE};">Unsubscribe</a></td></tr>
</table>
</td></tr></table>
</body>
</html>'''

SP = '<div style="height:{0}px;line-height:{0}px;font-size:0;">&nbsp;</div>'.format
W = SITE + '/pages/whats-on'; F = SITE + '/pages/find-us'; G = SITE + '/pages/gift-boxes'

EM = {}

# 1. EVENT template, shown with her real Meet the Maker night
EM['event'] = dict(group='templates', kicker='Template · Event', title='One event, made unmissable',
 blurb='Shown with your real Meet the Maker night. Swap in the poster, the date and two lines, and it works for quiz, tastings or the Milk Bar.',
 subject='Meet the maker: Unnatural Urges, Friday', pre='Free tastings from 4pm, Friday 6 November.',
 html=shell('Meet the maker: Unnatural Urges, Friday', 'Free tastings from 4pm, Friday 6 November.', 'What&#x27;s on at Ruby&#x27;s', [
  full(img(IMG + 'meetmaker-poster.jpg', 'Meet the Maker poster: Unnatural Urges, 6 November from 4pm', 600, W)),
  block(WINE, kick('Meet the maker', SAND) + head('Johnny from Unnatural Urges is pouring.', CREAM, 38) + para('Spooky, fun wines from our own backyard here in Queensland. Come and taste the range with the person who made it.', CREAM) + SP(10)
        + ticket([('When', 'Fri 6 Nov'), ('From', '4pm'), ('Tastings', 'Free')], WINE, CREAM, SAND) + SP(26) + btn('See what&#x27;s on'.replace('&#x27;', "'"), W, CREAM, WINE), '40px 48px 44px 48px'),
  block(SAND, cols([(50, img(IMG + 'maker-sq.jpg', 'A winemaker at work', 268, None, 'border-radius:10px;')), (50, img(IMG + 'meetmaker-bottles.jpg', 'Five Unnatural Urges bottles lined up', 268, None, 'border-radius:10px;') + SP(14) + para('The newest additions to the range land on the shelf the same night, so you can take a bottle home.', size=15, lh=23, mb=0))]), '32px 48px'),
  block(CREAM, kick('Also on') + table([listrow(IMG + 'milkbar-sq.jpg', 'Ruby&#x27;s Milk Bar'.replace('&#x27;', "'"), 'Every Thursday from 12. A space for new mums to meet, sip and relax.', 'Thursdays', W, last=True)]), '30px 48px 10px 48px'),
  signoff('See you there.')]))

# 2. PRODUCT SPOTLIGHT template, shown with her Pet Nat
EM['spotlight'] = dict(group='templates', kicker='Template · Product spotlight', title='One bottle, told well',
 blurb='Shown with your best-selling Pet Nat. One great photo, why you love it, and a nudge to grab it before it goes.',
 subject='The Pet Nat everyone keeps asking for', pre='Refreshing, fruity, and here until she&#x27;s not.',
 html=shell('The Pet Nat everyone keeps asking for', "Refreshing, fruity, and here until she's not.", 'On the shelf', [
  full(img(IMG + 'petnat-tall.jpg', 'A glass and a bottle of Pet Nat outside at dusk', 600, F)),
  block(CREAM, '<div style="text-align:center;">' + kick('This week&#x27;s pick'.replace('&#x27;', "'")) + head('Refreshing. Fruity.<br>Delicious.', WINE, 46, 50, True, 18, 'center')
        + para("A gorgeous little Queensland beauty, and a best seller for a reason. It's here until it's not, so come and grab one while you can.", align='center') + '</div>' + SP(8) + btn('Grab a bottle', F, TERRA, CREAM, 'center'), '40px 56px 44px 56px'),
  block(SAND, cols([(33, img(IMG + 'glass-sq.jpg', 'A glass of white held up in the sun', 176, None, 'border-radius:8px;')), (34, img(IMG + 'petnat-sq.jpg', 'The Pet Nat at dusk', 176, None, 'border-radius:8px;')), (33, img(IMG + 'cheers-sq.jpg', 'Two glasses clinking against the sky', 176, None, 'border-radius:8px;'))], 10), '24px 32px'),
  block(WINE, f'<p style="margin:0 0 12px 0;font-family:{SERIF};font-size:56px;line-height:30px;color:{TERRA};text-align:center;">&ldquo;</p>' + head('We care about community and where the wine has come from.', CREAM, 26, 34, True, 12, 'center', 'h2') + f'<p style="margin:0;font-family:{SANS};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:{SAND};text-align:center;">Minimal intervention, independent winemakers</p>', '40px 56px'),
  signoff('See you at the shelf.')]))

# 3. WHAT'S ON template, the round-up
EM['whatson'] = dict(group='templates', kicker='Template · What&#x27;s on'.replace('&#x27;', "'"), title='The week at Ruby&#x27;s'.replace('&#x27;', "'"),
 blurb='The weekly or fortnightly round-up: every regular night in one place, one bottle and one thing to take home. Same blocks every time.',
 subject='This week at Ruby&#x27;s', pre='Milk Bar Thursday, meet the maker Friday, and Sunday sun.',
 html=shell("This week at Ruby's", 'Milk Bar Thursday, meet the maker Friday, and Sunday sun.', 'Ruby&#x27;s Weekly', [
  full(cols([(50, img(IMG + 'cheers-sq.jpg', 'Two glasses clinking against the sky', 300)), (50, img(IMG + 'tee-back.jpg', 'A Ruby&#x27;s T-shirt at the bar', 300))], 0)),
  block(TERRA, kick('This week', WINE) + head('Here&#x27;s what&#x27;s on.', CREAM, 42) + para('Pop in for one glass or make a night of it. Here&#x27;s the week at a glance.'.replace('&#x27;', "'"), CREAM, mb=0), '36px 48px 38px 48px'),
  block(CREAM, table([
    listrow(IMG + 'milkbar-sq.jpg', 'Ruby&#x27;s Milk Bar'.replace('&#x27;', "'"), 'From 12. New mums welcome, babies too. Leave the pram in the car.', 'Thursday', W),
    listrow(IMG + 'maker-sq.jpg', 'Meet the maker', 'Free tastings with Unnatural Urges from 4pm.', 'Friday', W),
    listrow(CDN + 'Pub_Quiz_Night.png?width=240', 'Quiz night', 'With The Weekly Fifty, every second Wednesday of the month.', 'Coming up', W),
    listrow(IMG + 'cheers-sq.jpg', 'Sunday sun', 'Open 12 to 8. What a day for a wine.', 'Sunday', F, last=True)]), '16px 48px 22px 48px'),
  block(WINE, cols([(45, img(IMG + 'chilledred-sq.jpg', 'Chilled red bottles on a Ruby&#x27;s T-shirt', 240, SITE + '/collections/merch', 'border-radius:10px;')),
                    (55, kick('On the shelf and on a T-shirt', SAND) + head('Chilled red?', CREAM, 32, 38, False, 10, 'left', 'h2') + para('The question we hear most, now in T-shirt form. You already know the answer.', CREAM, 15.5, 24, 18) + btn('Shop the merch', SITE + '/collections/merch', CREAM, WINE))], 24), '36px 48px'),
  signoff('See you at the bar.')]))

# 4. GIFT BOX DROP template
EM['giftdrop'] = dict(group='templates', kicker='Template · Gift box drop', title='Boxes, prices, cut-offs',
 blurb='Built around your own Wine Gifts Reimagined artwork. Works for Christmas now, then Mother&#x27;s Day, end of financial year and corporate thank-yous.'.replace('&#x27;', "'"),
 subject='Wine gifts, reimagined', pre='Three boxes, hand-picked by us. Ruby Custom orders close 6 December.',
 html=shell('Wine gifts, reimagined', 'Three boxes, hand-picked by us. Ruby Custom orders close 6 December.', 'Christmas at Ruby&#x27;s', [
  full(img(IMG + 'giftboxes-poster.jpg', 'Wine Gifts Reimagined: Ruby&#x27;s Christmas gift boxes', 600, G)),
  block(CREAM, head('Hand-picked by us, not an algorithm.', WINE, 36) + para('Three bottles in every box from the independent winemakers we pour all year, with tasting cards, beautifully packaged and ready to give. Perfect for corporate gifting or that special someone.'), '38px 48px 20px 48px'),
  block(CREAM, cols([
    (33, f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{SAND}" style="background:{SAND};border-radius:12px;"><tr><td style="padding:20px 16px;">{kick("Introduction", TERRA, 6)}<p style="margin:0 0 8px 0;font-family:{SERIF};font-weight:700;font-size:34px;line-height:36px;color:{WINE};">$160</p><p style="margin:0;font-family:{SANS};font-size:14px;line-height:21px;color:{WINE};">A sparkling, a white and a red. Fun and easy drinking.</p></td></tr></table>'),
    (34, f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{TERRA}" style="background:{TERRA};border-radius:12px;"><tr><td style="padding:20px 16px;">{kick("Explorer&#x27;s".replace("&#x27;", "’"), CREAM, 6)}<p style="margin:0 0 8px 0;font-family:{SERIF};font-weight:700;font-size:34px;line-height:36px;color:{CREAM};">$260</p><p style="margin:0;font-family:{SANS};font-size:14px;line-height:21px;color:{CREAM};">Three standout bottles you won&#x27;t find in an average bottle shop, with a personal note.</p></td></tr></table>'),
    (33, f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{WINE}" style="background:{WINE};border-radius:12px;"><tr><td style="padding:20px 16px;">{kick("Ruby Custom", SAND, 6)}<p style="margin:0 0 8px 0;font-family:{SERIF};font-weight:700;font-size:34px;line-height:36px;color:{CREAM};">$380+</p><p style="margin:0;font-family:{SANS};font-size:14px;line-height:21px;color:{CREAM};">Three premium bottles, fully bespoke. Tell us about them.</p></td></tr></table>')], 12)
    + SP(26) + btn('Choose your box', G, WINE, CREAM, 'center'), '6px 32px 40px 32px'),
  block(WINE, '<div style="text-align:center;">' + kick('Order by', SAND, 14) + cols([(50, f'<p class="big" style="margin:0;font-family:{SERIF};font-weight:700;font-size:72px;line-height:74px;color:{CREAM};">6 Dec</p><p style="margin:6px 0 0 0;font-family:{SANS};font-size:14px;color:{SAND};">Ruby Custom</p>'), (50, f'<p class="big" style="margin:0;font-family:{SERIF};font-weight:700;font-size:72px;line-height:74px;color:{CREAM};">13 Dec</p><p style="margin:6px 0 0 0;font-family:{SANS};font-size:14px;color:{SAND};">Explorer&#x27;s and Introduction</p>')]) + '</div>', '40px 48px'),
  block(SAND, head('Getting it to them', WINE, 26, 32, False, 10, 'left', 'h2') + para('Pickup or delivery from Wednesday 2 December. Free pickup from Ruby&#x27;s in Albion, or $15 delivery across Brisbane metro. Free delivery on orders over $800 (minimum 5 boxes). Only available to adults 18+.'.replace('&#x27;', "'"), size=15.5, lh=25, mb=0), '32px 48px'),
  signoff('Cheers to the season.')]))

# 5. WELCOME 2
EM['welcome2'] = dict(group='flows', kicker='Welcome · Email 2 · 3 days later', title='Take a bit of Ruby&#x27;s home'.replace('&#x27;', "'"),
 blurb='Sends three days after the welcome email. It turns a new subscriber into a customer: the shelf, the boxes, gift cards and the merch.',
 subject='Take a bit of Ruby&#x27;s home', pre='The shelf, the boxes, and the answer to our most-asked question.',
 html=shell("Take a bit of Ruby's home", 'The shelf, the boxes, and the answer to our most-asked question.', 'Welcome to Ruby&#x27;s', [
  full(img(IMG + 'glass-tall.jpg', 'A glass of white held in the late sun, in a Ruby&#x27;s T-shirt', 600, F)),
  block(CREAM, kick('Glad you&#x27;re here') + head('Everything we pour, you can take home.', WINE, 38) + para('Our shelf is always growing, with unique and classic wines from all over the world. Hard-to-find drops from Switzerland, skin-contact Georgian beauties, and a great selection from our own backyard in QLD.'.replace('&#x27;', "'")) + SP(4) + btn('Come and browse', F, TERRA), '36px 48px 40px 48px'),
  block(SAND, cols([(58, img(IMG + 'chilledred-wide.jpg', 'Chilled red bottles on a Ruby&#x27;s T-shirt', 312, SITE + '/collections/merch', 'border-radius:10px;')), (42, kick('Our most-asked question') + head('&ldquo;Chilled red?&rdquo;', WINE, 30, 36, True, 8, 'left', 'h2') + para('The answer is always yes. Now it&#x27;s on a T-shirt too.'.replace('&#x27;', "'"), size=15, lh=23, mb=14) + btn('See the merch', SITE + '/collections/merch', WINE))], 20), '32px 48px'),
  block(CREAM, kick('For someone else') + head('Gifts they&#x27;ll actually open.', WINE, 30, 36, False, 18, 'left', 'h2') + table([
    listrow(IMG + 'giftboxes-sq.jpg', 'Christmas gift boxes', 'Three bottles, hand-picked by us. From $160.', 'Order by 13 Dec', G),
    listrow(IMG + 'cheers-sq.jpg', 'Gift cards', 'For the friend who&#x27;d love it here.'.replace('&#x27;', "'"), 'Any time', SITE + '/pages/gift-cards', last=True)]), '36px 48px 20px 48px'),
  signoff('See you at the bar.')]))

# 6. GIFT BOX REMINDER
EM['reminder'] = dict(group='flows', kicker='Gift box reminder · A few hours later', title='Still deciding?',
 blurb='For anyone who starts a box order and doesn&#x27;t finish. Short, warm, and straight back to checkout. Shopify fills in their actual box.'.replace('&#x27;', "'"),
 subject='Your box is still waiting', pre='Pick up right where you left off.',
 html=shell('Your box is still waiting', 'Pick up right where you left off.', 'Christmas at Ruby&#x27;s', [
  block(CREAM, '<div style="text-align:center;">' + kick('Still deciding?') + head('Your box is still waiting.', WINE, 40, 46, False, 14, 'center') + para('You were halfway through choosing a gift. We&#x27;ve saved it, so you can pick up right where you left off.'.replace('&#x27;', "'"), align='center') + '</div>', '30px 56px 26px 56px'),
  block(CREAM, f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="{SAND}" style="background:{SAND};border-radius:14px;"><tr><td class="col colpad" width="42%" valign="top" style="width:42%;padding:18px 0 18px 18px;">{img(IMG + "giftboxes-sq.jpg", "Ruby&#x27;s gift box", 200, G, "border-radius:8px;")}</td><td class="col px" valign="middle" style="padding:18px 22px;">{kick("In your cart", TERRA, 6)}<p style="margin:0 0 4px 0;font-family:{SERIF};font-weight:700;font-size:24px;line-height:29px;color:{WINE};">Introduction Collection</p><p style="margin:0 0 10px 0;font-family:{SANS};font-size:14.5px;line-height:22px;color:{WINE};">A sparkling, a white and a red, with tasting cards.</p><p style="margin:0;font-family:{SERIF};font-weight:700;font-size:22px;color:{TERRA};">$160</p></td></tr></table>' + SP(24) + btn('Finish your order', G, WINE, CREAM, 'center'), '0 40px 36px 40px'),
  block(WINE, '<div style="text-align:center;">' + kick('Orders close', SAND, 8) + f'<p class="big" style="margin:0;font-family:{SERIF};font-weight:700;font-size:84px;line-height:86px;color:{CREAM};">Sun 13 Dec</p>' + SP(10) + para('Pickup or Brisbane delivery from Wednesday 2 December.', SAND, 15, 23, 0, 'center') + '</div>', '40px 40px'),
  signoff('Any questions, just reply. We&#x27;re real people.'.replace('&#x27;', "'"))]))

# 7. THANK YOU
EM['thanks'] = dict(group='flows', kicker='After they buy · Straight away', title='Thank you',
 blurb='A warm thank-you to every box buyer, with pickup and delivery details so they never have to ask.',
 subject='Thank you from Ruby&#x27;s', pre='Your box is in good hands. Here&#x27;s what happens next.',
 html=shell("Thank you from Ruby's", "Your box is in good hands. Here's what happens next.", 'Thank you', [
  full(img(IMG + 'cheers-wide.jpg', 'Two glasses clinking against a blue sky', 600)),
  block(TERRA, '<div style="text-align:center;">' + kick('Order confirmed', WINE) + head('Cheers to you.', CREAM, 52, 56, True, 14, 'center') + para('Your box is hand-picked and packed by us, with tasting cards and your personal note. It&#x27;s in good hands.'.replace('&#x27;', "'"), CREAM, align='center', mb=0) + '</div>', '40px 56px 44px 56px'),
  block(CREAM, kick('What happens next') + ticket([('Ready from', 'Wed 2 Dec'), ('Pickup', 'Free, Albion'), ('Delivery', '$15, Brisbane')]) + SP(18) + para('Only available to adults 18+, and ID may be checked on pickup or delivery. Any changes to your note or delivery, just reply to this email.', size=14.5, lh=22, mb=0), '36px 48px 40px 48px'),
  hours(SAND, 'While you&#x27;re here'.replace('&#x27;', "'")),
  signoff('Cheers to the season.')]))

# 8. COME IN FOR A GLASS (January)
EM['glass'] = dict(group='flows', kicker='After they buy · Mid January', title='Come in for a glass',
 blurb='Goes to box buyers who joined at checkout. It turns a Christmas gift into a night at the bar, with the regular nights to come back for.',
 subject='Now come and taste it here', pre='Thanks for choosing Ruby&#x27;s at Christmas.',
 html=shell('Now come and taste it here', "Thanks for choosing Ruby's at Christmas.", 'Wine shop &middot; Albion &middot; Brisbane', [
  full(img(IMG + 'long-table-wide.jpg', 'A long table of wine and friends inside Ruby&#x27;s', 600, F)),
  block(WINE, kick('Thanks for choosing us', SAND) + head('You gave the box. Now come and taste it here.', CREAM, 36) + para('Grab a seat indoors or out, pick from our rotating pours by the glass, and let the evening unfold however it wants to.', CREAM) + SP(4) + btn('Plan your visit', F, CREAM, WINE), '38px 48px 42px 48px'),
  block(CREAM, kick('Worth coming back for') + table([
    listrow(IMG + 'milkbar-sq.jpg', 'Ruby&#x27;s Milk Bar'.replace('&#x27;', "'"), 'Every Thursday from 12. New mums and babies welcome.', 'Thursdays', W),
    listrow(CDN + 'Pub_Quiz_Night.png?width=240', 'Quiz night', 'With The Weekly Fifty, every second Wednesday.', 'Monthly', W),
    listrow(IMG + 'maker-sq.jpg', 'Meet the maker nights', 'Free tastings with the people who make the wine.', 'Watch your inbox', W, last=True)]), '32px 48px 18px 48px'),
  hours(SAND),
  signoff('See you at the bar.')]))

# 9. SQUARE REGULARS
EM['regulars'] = dict(group='square', kicker='Your Square regulars · Sent once', title='A note from Tamara',
 blurb='One email to customers with 3 or more visits in the past year, the last within 6 months. It says who it&#x27;s from, what they&#x27;ll get, and makes leaving easy.'.replace('&#x27;', "'"),
 subject='A note from Ruby&#x27;s', pre='You&#x27;re one of our regulars, so we wanted to tell you first.',
 html=shell("A note from Ruby's", "You're one of our regulars, so we wanted to tell you first.", 'From the bar', [
  full(img(IMG + 'tee-back-wide.jpg', 'A Ruby&#x27;s T-shirt at the bar on Sandgate Road', 600)),
  block(CREAM, kick('For our regulars') + head('You&#x27;re one of the reasons we love this place.', WINE, 36) + para('You&#x27;ve been in to see us a few times this year, so we wanted you to hear it from us first: we&#x27;re starting a Ruby&#x27;s email.\n\nIt&#x27;s short, and it&#x27;s from us. What&#x27;s pouring, what&#x27;s on, new bottles and our gift boxes. No more than one a week.'.replace('&#x27;', "'")), '36px 48px 24px 48px'),
  block(CREAM, cols([(33, img(IMG + 'milkbar-sq.jpg', 'Ruby&#x27;s Milk Bar poster', 168, W, 'border-radius:8px;') + SP(8) + f'<p style="margin:0;font-family:{SANS};font-size:13px;line-height:19px;color:{WINE};"><b>Milk Bar</b><br>Thursdays from 12</p>'),
                     (34, img(IMG + 'maker-sq.jpg', 'A winemaker at work', 168, W, 'border-radius:8px;') + SP(8) + f'<p style="margin:0;font-family:{SANS};font-size:13px;line-height:19px;color:{WINE};"><b>Meet the maker</b><br>Free tastings</p>'),
                     (33, img(IMG + 'giftboxes-sq.jpg', 'Ruby&#x27;s gift boxes', 168, G, 'border-radius:8px;') + SP(8) + f'<p style="margin:0;font-family:{SANS};font-size:13px;line-height:19px;color:{WINE};"><b>Gift boxes</b><br>Custom orders close 6 Dec</p>')], 12), '0 48px 34px 48px'),
  block(WINE, cols([(30, img(IMG + 'finalist-sq.jpg', '2026 Awards finalist', 150, None, 'border-radius:8px;')), (70, kick('Thank you', SAND) + head('We made the finals.', CREAM, 28, 34, False, 8, 'left', 'h2') + para('Ruby&#x27;s is a 2026 Awards finalist, and that&#x27;s down to regulars like you.'.replace('&#x27;', "'"), CREAM, 15.5, 24, 0))], 20), '32px 48px'),
  block(SAND, head('Not for you? No worries.', WINE, 26, 32, False, 10, 'left', 'h2') + para('Tap unsubscribe at the bottom of this email and you won&#x27;t hear from us again. No hard feelings, and we&#x27;ll still save you a seat.'.replace('&#x27;', "'"), size=15.5, lh=25, mb=0), '32px 48px'),
  signoff('See you at the bar.', 'Tamara and the Ruby&#x27;s crew (and Ruby)')]))

os.makedirs(os.path.join(HERE, 'emails'), exist_ok=True)
man = {}
for k, v in EM.items():
    open(os.path.join(HERE, 'emails', k + '.html'), 'w').write(v['html'])
    man[k] = {x: v[x] for x in ('group', 'kicker', 'title', 'blurb', 'subject', 'pre')}
print(json.dumps(man))
