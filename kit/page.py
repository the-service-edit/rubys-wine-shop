# Builds kit/index.html from kit/emails/*.html plus the three showcase emails in /index.html.
# Run after kit/emails.py: python3 kit/page.py
import json, re, os, html, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
man = json.loads(subprocess.check_output(['python3', os.path.join(HERE, 'emails.py')]))
src = open(os.path.join(ROOT, 'index.html')).read()
ex = {m.group(1): m.group(2) for m in re.finditer(r'<div class="k">([^<]*)</div><h2>[^<]*</h2><p>[^<]*</p>.*?srcdoc="([^"]*)"', src, re.S)}

def card(k, t, b, srcdoc_esc):
    return (f'<div class="card"><div class="k">{html.escape(k)}</div><h3>{html.escape(t)}</h3><p>{html.escape(b)}</p>'
            f'<div class="phone"><iframe loading="lazy" title="{html.escape(t)}" srcdoc="{srcdoc_esc}"></iframe><div class="hint">Scroll to see the whole email</div></div></div>')
def mine(key):
    v = man[key]; h = open(os.path.join(HERE, 'emails', key + '.html')).read()
    return card(html.unescape(v['kicker']), html.unescape(v['title']), html.unescape(v['blurb']), html.escape(h, quote=True))
def old(label, k, t, b): return card(k, t, b, ex[label])

sections = [
 ('01 · Your templates', 'Four templates. You fill in the blanks.', "Each one is shown with something you've actually run or sell: Meet the Maker, your Pet Nat, the Milk Bar and your gift boxes. Next time you swap in the new photo, date and two lines, and the design stays put.",
  [mine('event'), mine('spotlight'), mine('whatson'), mine('giftdrop')]),
 ('02 · The emails that run on their own', 'Five emails, set up once.', 'These send themselves when someone joins or buys. You never have to remember them.',
  [mine('welcome1'), mine('welcome2'), mine('reminder'), mine('thanks'), mine('glass')]),
 ('03 · Your Square regulars', 'One email, sent once.', "For customers with 3 or more visits in the past year, the last within 6 months. It says who it's from and what they'll get, and makes leaving easy.", [mine('regulars')]),
 ('04 · Your Christmas emails', 'Written by me, sent by you.', 'Your first two sends are real ones, built around your actual cut-offs. I write them, you send them from your templates, so you learn on emails that sell boxes.',
  [mine('christmas'), mine('lastorders')]),
]
body = ''.join(f'<section class="s"><div class="wrap"><div class="num">{n}</div><h2>{h}</h2><p class="lede">{html.escape(l)}</p><div class="grid">{"".join(c)}</div></div></section>\n' for n, h, l, c in sections)
tpl = open(os.path.join(HERE, 'shell.html')).read()
open(os.path.join(HERE, 'index.html'), 'w').write(tpl.replace('{{SECTIONS}}', body))
print('ok', len(body))
