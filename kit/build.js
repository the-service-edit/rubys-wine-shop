// Builds the kit emails from the Email Studio renderer. Run: node kit/build.js > kit/emails.json
global.window = {};
require('../studio/sections.js');
const R = window.RS, C = R.CDN, S = R.SITE, m = R.make;

const E = {
 event: { group: 'templates', kicker: 'Template · Event', title: 'One event, one button', blurb: 'For quiz nights, tastings, producer nights or anything on the calendar. Swap the photo, the name, the date and two lines.',
  doc: { subject: 'Quiz night at Ruby\'s', pre: 'Grab your team. Here\'s when.', eyebrow: 'What\'s on at Ruby\'s', sections: [
   m('eventPhoto', { bg: 'sand', img: C + 'Pub_Quiz_Night.png', shape: 'original', img_alt: 'Ruby\'s quiz night with The Weekly Fifty', kicker: 'What\'s on', title: 'Quiz night with The Weekly Fifty', when: 'Every second Wednesday of the month', body: 'Grab your team, grab a glass, and find out who really knows their stuff.\n\nYour two lines about this one go here: the theme, the prize, anything new.', btn: 'See what\'s on', link: S + '/pages/whats-on' }),
   m('visit', { bg: 'cream' }), m('signoff', { line: 'See you there.' })] } },

 spotlight: { group: 'templates', kicker: 'Template · Product spotlight', title: 'One bottle, told well', blurb: 'For a new arrival, a favourite or your own Pet Nat. One photo, why you love it, and where to get it.',
  doc: { subject: 'One bottle we can\'t stop pouring', pre: 'Why we love it, and where to get it.', eyebrow: 'On the shelf', sections: [
   m('photoHead', { bg: 'wine', img: C + 'RubysAperoApril_0118.jpg', shape: 'square', img_alt: 'A bottle to take home from Ruby\'s', img_link: S + '/pages/find-us', kicker: 'This week\'s pick', title: 'Our house-made Pet Nat', body: 'Your words on why you love it: how it tastes right now, who made it, what to drink it with.', btn: 'Come in for a bottle', link: S + '/pages/find-us' }),
   m('quote', { bg: 'cream', quote: 'We care about community and where the wine has come from.', by: 'Minimal intervention, independent winemakers' }),
   m('signoff', { line: 'See you at the shelf.' })] } },

 whatson: { group: 'templates', kicker: 'Template · What\'s on', title: 'The round-up', blurb: 'Weekly or fortnightly: what\'s pouring, what\'s on, and one thing to take home. Same blocks every time, so it takes minutes.',
  doc: (function(){var d=R.LAYOUTS.weekly.f();d.sections[1].items=[{name:'Our house-made Pet Nat',note:'One line on how it tastes right now.',price:''},{name:'Your second pour',note:'One line about it.',price:''},{name:'Your third pour',note:'One line about it.',price:''}];d.sections[3].title='New on the shelf';d.sections[3].body='One bottle worth taking home this week, and why.';return d;})() },

 giftdrop: { group: 'templates', kicker: 'Template · Gift box drop', title: 'Boxes, prices, cut-offs', blurb: 'For Christmas now and every gifting moment after it: Mother\'s Day, end of financial year, corporate thank-yous.',
  doc: R.LAYOUTS.gift.f() },

 welcome2: { group: 'flows', kicker: 'Welcome · Email 2 · 3 days later', title: 'Take a bottle home', blurb: 'Sends three days after the welcome email, which you\'ve already seen, to everyone who joins. It points new subscribers to the shelf, the boxes and gift cards.',
  doc: { subject: 'Take a bit of Ruby\'s home', pre: 'The shelf, the boxes and a gift for the friend who\'d love it here.', eyebrow: 'Welcome to Ruby\'s', sections: [
   m('photoHead', { bg: 'cream', img: C + 'RubysAperoApril_0118.jpg', shape: 'wide', img_alt: 'A bottle to take home from Ruby\'s', img_link: S + '/pages/find-us', kicker: 'Glad you\'re here', title: 'Take a bit of Ruby\'s home.', body: 'Everything we pour by the glass, you can take home. Our shelf is always growing, with unique and classic wines from all over the world.' }),
   m('text', { bg: 'sand', title: 'Always on the shelf', body: 'Hard-to-find drops from Switzerland, skin-contact Georgian beauties, and a great selection from our own backyard in QLD.', btn: 'Come and browse', link: S + '/pages/find-us' }),
   m('lineup', { bg: 'cream', kicker: 'For someone else', title: 'Gifts they\'ll actually open', items: [{ name: 'Introduction Collection', note: 'A sparkling, a white and a red. Fun and easy drinking.', price: '$160' }, { name: 'Explorer\'s Collection', note: 'Three standout bottles, with a personal note.', price: '$260' }, { name: 'Gift cards', note: 'For the friend who\'d love it here.', price: '' }], btn: 'See the gift boxes', link: S + '/pages/gift-boxes' }),
   m('signoff', { line: 'See you at the bar.' })] } },

 reminder: { group: 'flows', kicker: 'Gift box reminder · A few hours later', title: 'Still deciding?', blurb: 'For anyone who starts a box order and doesn\'t finish it. Shopify fills in their box and links them straight back to checkout.',
  doc: { subject: 'Your box is still waiting', pre: 'Pick up where you left off.', eyebrow: 'Christmas at Ruby\'s', sections: [
   m('letter', { bg: 'cream', align: 'center', kicker: 'Still deciding?', title: 'Your box is still waiting.', body: 'You were halfway through choosing a gift box. It\'s saved, so you can pick up right where you left off.', btn: 'Finish your order', link: S + '/pages/gift-boxes' }),
   m('lineup', { bg: 'sand', kicker: 'In your cart', title: 'Your box', items: [{ name: 'Introduction Collection', note: 'A sparkling, a white and a red, with tasting cards. Shopify fills in their actual box.', price: '$160' }] }),
   m('date', { bg: 'wine', label: 'Orders close', big: 'Sun 13 Dec', body: 'Pickup or Brisbane delivery from Wednesday 2 December.', btn: 'Finish your order', link: S + '/pages/gift-boxes' }),
   m('signoff', { line: 'Any questions, just reply.' })] } },

 thanks: { group: 'flows', kicker: 'After they buy · Straight away', title: 'Thank you', blurb: 'A warm thank-you to every box buyer, with pickup and delivery details, so they never have to ask.',
  doc: { subject: 'Thank you from Ruby\'s', pre: 'Your box is in good hands. Here\'s what happens next.', eyebrow: 'Thank you', sections: [
   m('photoHead', { bg: 'cream', img: C + 'gift-boxes-banner-v2.jpg', shape: 'original', img_alt: 'Ruby\'s Christmas gift boxes', kicker: 'Order confirmed', title: 'Thank you. It\'s in good hands.', body: 'Every box is hand-picked and packed by us, with tasting cards and your personal note.' }),
   m('visit', { bg: 'sand', title: 'What happens next', body: 'Boxes are ready for pickup or Brisbane delivery from Wednesday 2 December. Only available to adults 18+, and ID may be checked on pickup or delivery.', address: '3/297 Sandgate Road, Albion', btn: 'Opening hours and directions', link: S + '/pages/find-us' }),
   m('signoff', { line: 'Cheers to the season.' })] } },

 glass: { group: 'flows', kicker: 'After they buy · Mid January', title: 'Come in for a glass', blurb: 'Goes to box buyers who joined at checkout. It turns a Christmas gift into a visit to the bar.',
  doc: { subject: 'Come in for a glass', pre: 'Thanks for choosing Ruby\'s at Christmas.', eyebrow: 'Wine shop · Albion · Brisbane', sections: [
   m('hero', { img: C + '4x3_MikaylaADAMS_RubysWineShop_8.jpg', shape: 'wide', img_alt: 'A busy night at the bar at Ruby\'s', img_link: S + '/pages/find-us' }),
   m('letter', { bg: 'sand', align: 'center', kicker: 'Thanks for choosing us', title: 'Now come and taste it here.', body: 'You picked a box from us at Christmas. Come in, grab a seat indoors or out, and try what\'s open by the glass right now.', btn: 'Plan your visit', link: S + '/pages/find-us' }),
   m('visit', { bg: 'cream' }), m('signoff', { line: 'See you at the bar.' })] } },

 regulars: { group: 'square', kicker: 'Your Square regulars · Sent once', title: 'From Tamara', blurb: 'One email to customers with 3 or more visits in the past year, the last within 6 months. It says who it\'s from, what they\'ll get, and makes leaving easy.',
  doc: { subject: 'A note from Ruby\'s', pre: 'You\'re one of our regulars, so we wanted to tell you first.', eyebrow: 'From the bar', sections: [
   m('photoHead', { bg: 'cream', img: C + 'MikaylaADAMS_RubysWineShop_7.jpg', shape: 'wide', img_alt: 'Ruby\'s Wine Shop at dusk', kicker: 'For our regulars', title: 'You\'re one of the reasons we love this place.', body: 'You\'ve been in to see us a few times this year, so we wanted you to hear it from us first: we\'re starting a Ruby\'s email.\n\nIt\'s short and it\'s from us: what\'s pouring, what\'s on, new bottles and our gift boxes. No more than one a week.' }),
   m('lineup', { bg: 'sand', kicker: 'Coming up', title: 'What you\'ll hear about first', items: [{ name: 'What\'s on at the bar', note: 'Quiz nights and events, as soon as they\'re announced.', price: '' }, { name: 'New on the shelf', note: 'Bottles worth taking home, as they land.', price: '' }, { name: 'Christmas gift boxes', note: 'Ruby Custom orders close Sunday 6 December.', price: '' }], btn: 'See the gift boxes', link: S + '/pages/gift-boxes' }),
   m('text', { bg: 'cream', title: 'Not for you? No worries.', body: 'Tap unsubscribe at the bottom of this email and you won\'t hear from us again. No hard feelings, and we\'ll still save you a seat.' }),
   m('signoff', { line: 'See you at the bar.', from: 'Tamara and the Ruby\'s crew (and Ruby)' })] } }
};

const out = {};
for (const [k, v] of Object.entries(E)) {
 let h = R.renderEmail(v.doc, 'export')
  .replace(/\{\{\s*unsubscribe_url\s*\}\}/g, '#').replace(/\{\{\s*open_tracking_block\s*\}\}/g, '')
  .replace('<head>', '<head>\n<base target="_blank">\n<meta name="robots" content="noindex, nofollow">');
 out[k] = { group: v.group, kicker: v.kicker, title: v.title, blurb: v.blurb, subject: v.doc.subject, pre: v.doc.pre, html: h };
}
process.stdout.write(JSON.stringify(out));
