/* Ruby's Email Studio: email sections, layouts and the renderer.
   Every section renders twice from the same data: mode 'edit' (annotated for the editor)
   and mode 'export' (clean email HTML for Shopify Email "Code your own"). */
(function(){
var CDN='https://cdn.shopify.com/s/files/1/0836/3622/4220/files/';
var SITE='https://rubyswineshop.com.au';
var C={wine:'#470606',terra:'#BA5B3E',cream:'#F2EBD7',sand:'#E5D9C2',stone:'#B8A88A'};
var SERIF="'Playfair',Georgia,'Times New Roman',serif", SANS="'DM Sans',Helvetica,Arial,sans-serif";

var PICS=[
 {f:'MikaylaADAMS_RubysWineShop_7.jpg',l:'Shopfront at dusk'},
 {f:'4x3_MikaylaADAMS_RubysWineShop_8.jpg',l:'The bar on a busy night'},
 {f:'RubysAperoApril_012.jpg',l:'Snack board and a glass of red'},
 {f:'RubysAperoApril_0118.jpg',l:'A bottle to take home'},
 {f:'4x3_MikaylaADAMS_RubysWineShop_11.jpg',l:'Ruby under the chair'},
 {f:'Pub_Quiz_Night.png',l:'Quiz night poster'},
 {f:'gift-boxes-banner-v2.jpg',l:'Christmas gift boxes banner'},
 {f:'rubys-cheers-hands.png',l:'Cheers illustration'}
];
var LINKS=[[SITE+'/','Home page'],[SITE+'/pages/whats-on','What\'s on'],[SITE+'/pages/gift-boxes','Gift boxes'],[SITE+'/pages/gift-cards','Gift cards'],[SITE+'/pages/find-us','Find us'],[SITE+'/pages/about','About'],[SITE+'/collections/merch','Merch'],['https://www.instagram.com/rubys_wine_shop','Instagram'],['https://olivethyme.com.au/menu/','Olive Thyme menu']];

var THEMES={
 cream:{n:'Cream',bg:C.cream,ink:C.wine,acc:C.terra,rule:C.stone,bb:C.terra,bf:C.cream},
 sand:{n:'Sand',bg:C.sand,ink:C.wine,acc:C.terra,rule:C.stone,bb:C.wine,bf:C.cream},
 wine:{n:'Wine',bg:C.wine,ink:C.cream,acc:C.sand,kick:C.sand,rule:C.stone,bb:C.cream,bf:C.wine},
 terra:{n:'Terracotta',bg:C.terra,ink:C.cream,acc:C.wine,kick:C.wine,rule:C.sand,bb:C.wine,bf:C.cream}
};

function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/\{\{/g,'&#123;&#123;').replace(/\{%/g,'&#123;%');}
function url(u){u=String(u||'').trim();if(!u)return '';if(!/^(https?:|mailto:)/i.test(u))u='https://'+u;return u.replace(/"/g,'%22');}
function imgUrl(src,shape,w){src=String(src||'').trim();w=w||1200;if(src.indexOf('cdn.shopify.com')>-1||src.indexOf('/cdn/shop/')>-1){src=src.replace(/[?#].*$/,'');if(shape==='wide')return src+'?width='+w+'&height='+Math.round(w*2/3)+'&crop=center';if(shape==='square')return src+'?width='+w+'&height='+w+'&crop=center';if(shape==='tall')return src+'?width='+w+'&height='+Math.round(w*5/4)+'&crop=center';return src+'?width='+w;}return src;}
function get(o,path){return String(path).split('.').reduce(function(a,k){return a==null?a:a[k];},o);}

/* Field helpers bound to a section and a mode */
function H(s,mode){
 var E=mode==='edit';
 function attr(key,ph,single){return E?' data-f="'+s.id+':'+key+'" data-ph="'+esc(ph||'')+'"'+(single?' data-single="1"':''):'';}
 return {
  E:E,
  /* one line of text */
  line:function(key,tag,style,ph){var v=get(s,key);if(!E&&!String(v||'').trim())return '';return '<'+tag+' style="'+style+'"'+attr(key,ph,true)+'>'+esc(v)+'</'+tag+'>';},
  /* paragraphs: blank line = new paragraph */
  para:function(key,style,ph,gap){var v=String(get(s,key)||'');gap=gap==null?14:gap;
   if(E)return '<div style="'+style+'white-space:pre-wrap;"'+attr(key,ph,false)+'>'+esc(v)+'</div>';
   v=v.trim();if(!v)return '';var ps=v.split(/\n\s*\n/);return ps.map(function(p,i){return '<p style="margin:0 0 '+(i<ps.length-1?gap:0)+'px 0;'+style+'">'+esc(p).replace(/\n/g,'<br>')+'</p>';}).join('');},
  img:function(key,shape,w,alt,style){var v=get(s,key);var lk=get(s,key+'_link'),al=get(s,key+'_alt');if(al)alt=al;
   if(!v)return E?'<div data-img="'+s.id+':'+key+'" style="background:'+C.sand+';color:'+C.wine+';font-family:'+SANS+';font-size:14px;text-align:center;padding:60px 10px;cursor:pointer;">Choose a photo</div>':'';
   var im='<img src="'+esc(imgUrl(v,shape,w>300?1200:600))+'" width="'+w+'" alt="'+esc(alt||'')+'" style="display:block;width:100%;max-width:'+w+'px;height:auto;border:0;'+(style||'')+'"'+(E?' data-img="'+s.id+':'+key+'"':'')+'>';
   return (!E&&url(lk))?'<a href="'+url(lk)+'" target="_blank" style="text-decoration:none;">'+im+'</a>':im;},
  btn:function(lk,uk,bg,fg,align){var l=get(s,lk),u=get(s,uk);if(!E&&(!String(l||'').trim()||!url(u)))return '';if(E&&!String(l||'').trim())return '';
   var a='<a href="'+(E?'#':url(u))+'" target="_blank" style="display:inline-block;padding:15px 32px;font-family:'+SANS+';font-size:15px;font-weight:700;color:'+fg+';text-decoration:none;"'+attr(lk,'Button words',true)+(E?' data-btn="'+s.id+':'+uk+'"':'')+'>'+esc(l)+'</a>';
   return '<table role="presentation" cellpadding="0" cellspacing="0" border="0"'+(align==='center'?' align="center" style="margin:0 auto;"':'')+'><tr><td bgcolor="'+bg+'" style="background:'+bg+';border-radius:999px;">'+a+'</td></tr></table>';}
 };
}
function T(s){return THEMES[s.bg]||THEMES.cream;}
function wrap(s,t,inner,pad){return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="'+t.bg+'" style="background:'+t.bg+';"><tr><td class="px" style="padding:'+(pad||'40px 48px')+';">'+inner+'</td></tr></table>';}
function kick(h,t,key){return h.line(key,'p','margin:0 0 10px 0;font-family:'+SANS+';font-size:11px;letter-spacing:3px;text-transform:uppercase;color:'+(t.kick||t.acc)+';','Small label');}

var SECTIONS={
 hero:{n:'Big photo',cat:'Photos',bg:false,d:{img:CDN+'MikaylaADAMS_RubysWineShop_7.jpg',shape:'wide',img_alt:'Ruby\'s Wine Shop at dusk',img_link:SITE+'/'},
  r:function(s,h){return h.img('img',s.shape,600,'');}},
 photoHead:{n:'Photo with headline',cat:'Openers',d:{bg:'cream',img:CDN+'4x3_MikaylaADAMS_RubysWineShop_8.jpg',shape:'wide',img_alt:'A busy night at Ruby\'s',img_link:'',kicker:'Ruby\'s Weekly',title:'This week at Ruby\'s',body:'',btn:'',link:SITE+'/pages/find-us'},
  r:function(s,h,t){return h.img('img',s.shape,600,'')+wrap(s,t,kick(h,t,'kicker')+h.line('title','h1','margin:0 0 16px 0;font-family:'+SERIF+';font-weight:700;font-size:40px;line-height:46px;color:'+t.ink+';','Headline')+h.para('body','font-family:'+SANS+';font-size:16px;line-height:26px;color:'+t.ink+';','Your words. Leave a blank line for a new paragraph')+(h.btn('btn','link',t.bb,t.bf)?'<div style="padding-top:24px;">'+h.btn('btn','link',t.bb,t.bf)+'</div>':''),'36px 48px 40px 48px').replace('<h1 ','<h1 class="h1" ');}},
 letter:{n:'Headline',cat:'Openers',d:{bg:'cream',align:'left',kicker:'',title:'Headline goes here',body:'',btn:'',link:SITE+'/'},
  r:function(s,h,t){var al=s.align==='center'?'center':'left';return wrap(s,t,'<div style="text-align:'+al+';">'+kick(h,t,'kicker')+h.line('title','h1','margin:0 0 16px 0;font-family:'+SERIF+';font-weight:700;font-size:40px;line-height:46px;color:'+t.ink+';','Headline').replace('<h1 ','<h1 class="h1" ')+h.para('body','font-family:'+SANS+';font-size:16px;line-height:26px;color:'+t.ink+';','Your words')+'</div>'+(h.btn('btn','link',t.bb,t.bf,al)?'<div style="padding-top:24px;">'+h.btn('btn','link',t.bb,t.bf,al)+'</div>':''));}},
 date:{n:'Date callout',cat:'Openers',d:{bg:'wine',label:'Last orders',big:'Sun 13 Dec',body:'',btn:'',link:SITE+'/'},
  r:function(s,h,t){return wrap(s,t,'<div style="text-align:center;">'+h.line('label','p','margin:0 0 6px 0;font-family:'+SANS+';font-size:12px;letter-spacing:4px;text-transform:uppercase;color:'+(t.kick||t.acc)+';','Small label')+h.line('big','p','margin:0;font-family:'+SERIF+';font-weight:700;font-size:96px;line-height:96px;letter-spacing:-2px;color:'+t.ink+';','Sun 13 Dec').replace('<p ','<p class="big" ')+'<div style="height:16px;line-height:16px;font-size:0;">&nbsp;</div>'+h.para('body','font-family:'+SANS+';font-size:16px;line-height:26px;color:'+t.ink+';','What closes, what to do next')+'</div>'+(h.btn('btn','link',t.bb,t.bf,'center')?'<div style="padding-top:24px;">'+h.btn('btn','link',t.bb,t.bf,'center')+'</div>':''),'48px 48px 52px 48px');}},
 text:{n:'Words',cat:'Stories',d:{bg:'cream',title:'',body:'Your words here.',btn:'',link:SITE+'/'},
  r:function(s,h,t){return wrap(s,t,h.line('title','h2','margin:0 0 14px 0;font-family:'+SERIF+';font-weight:700;font-size:28px;line-height:34px;color:'+t.ink+';','Heading (optional)')+h.para('body','font-family:'+SANS+';font-size:16px;line-height:26px;color:'+t.ink+';','Your words')+(h.btn('btn','link',t.bb,t.bf)?'<div style="padding-top:22px;">'+h.btn('btn','link',t.bb,t.bf)+'</div>':''),'28px 48px 28px 48px');}},
 lineup:{n:'Numbered list',cat:'Wine and gifts',d:{bg:'cream',kicker:'By the glass',title:'Open this week',items:[{name:'',note:'',price:''},{name:'',note:'',price:''},{name:'',note:'',price:''}],btn:'',link:SITE+'/pages/find-us'},
  r:function(s,h,t){var rows=(s.items||[]).map(function(it,i,a){var k='items.'+i+'.';if(!h.E&&!String(it.name||'').trim()&&!String(it.note||'').trim())return '';var last=i===a.length-1;
   return '<tr><td width="52" valign="top" style="font-family:'+SERIF+';font-style:italic;font-size:30px;line-height:30px;color:'+t.acc+';padding:'+(i?'20':'2')+'px 0 20px 0;">0'+(i+1)+'</td><td valign="top" style="padding:'+(i?'20':'0')+'px 0 20px 0;'+(last?'':'border-bottom:1px solid '+t.rule+';')+'"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top">'+h.line(k+'name','div','font-family:'+SANS+';font-size:16px;line-height:23px;font-weight:700;color:'+t.ink+';','Wine or item name')+'</td><td align="right" valign="top" style="padding-left:12px;white-space:nowrap;">'+h.line(k+'price','div','font-family:'+SERIF+';font-size:18px;line-height:23px;font-weight:700;color:'+t.acc+';','Price')+'</td></tr></table>'+h.line(k+'note','div','font-family:'+SANS+';font-size:15px;line-height:23px;color:'+t.ink+';','One line about it')+'</td></tr>';}).join('');
   return wrap(s,t,kick(h,t,'kicker')+h.line('title','h2','margin:0 0 22px 0;font-family:'+SERIF+';font-weight:700;font-size:30px;line-height:36px;color:'+t.ink+';','Heading')+'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">'+rows+'</table>'+(h.btn('btn','link',t.bb,t.bf)?'<div style="padding-top:22px;">'+h.btn('btn','link',t.bb,t.bf)+'</div>':''));}},
 twoUp:{n:'Two side by side',cat:'Wine and gifts',d:{bg:'sand',kicker:'',title:'Two to try',items:[{img:CDN+'RubysAperoApril_0118.jpg',name:'',note:'',price:'',btn:'',link:SITE+'/'},{img:CDN+'RubysAperoApril_012.jpg',name:'',note:'',price:'',btn:'',link:SITE+'/'}]},
  r:function(s,h,t){var cells=(s.items||[]).slice(0,2).map(function(it,i){var k='items.'+i+'.';return '<td class="col'+(i===0?' colpad':'')+'" width="50%" valign="top" style="width:50%;padding:0 '+(i===0?'10px':'0')+' 0 '+(i===1?'10px':'0')+';">'+h.img(k+'img','square',252,it.name,'border-radius:6px;')+'<div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td valign="top">'+h.line(k+'name','div','font-family:'+SERIF+';font-size:20px;line-height:25px;font-weight:700;color:'+t.ink+';','Name')+'</td><td align="right" valign="top" style="padding-left:8px;white-space:nowrap;">'+h.line(k+'price','div','font-family:'+SERIF+';font-size:18px;line-height:25px;font-weight:700;color:'+t.acc+';','Price')+'</td></tr></table>'+h.line(k+'note','div','margin-top:4px;font-family:'+SANS+';font-size:14px;line-height:21px;color:'+t.ink+';','One line about it')+(h.btn(k+'btn',k+'link',t.bb,t.bf)?'<div style="padding-top:14px;">'+h.btn(k+'btn',k+'link',t.bb,t.bf)+'</div>':'')+'</td>';}).join('');
   return wrap(s,t,kick(h,t,'kicker')+h.line('title','h2','margin:0 0 22px 0;font-family:'+SERIF+';font-weight:700;font-size:30px;line-height:36px;color:'+t.ink+';','Heading')+'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>'+cells+'</tr></table>');}},
 rows:{n:'Photo rows',cat:'Wine and gifts',d:{bg:'cream',kicker:'',title:'',items:[{img:CDN+'RubysAperoApril_0118.jpg',name:'',note:'',price:''},{img:CDN+'RubysAperoApril_012.jpg',name:'',note:'',price:''}],btn:'',link:SITE+'/'},
  r:function(s,h,t){var rows=(s.items||[]).map(function(it,i,a){var k='items.'+i+'.';if(!h.E&&!String(it.name||'').trim()&&!it.img)return '';return '<tr><td width="150" valign="top" style="width:150px;padding:'+(i?'18':'0')+'px 0 18px 0;'+(i<a.length-1?'border-bottom:1px solid '+t.rule+';':'')+'">'+h.img(k+'img','square',150,it.name,'border-radius:6px;')+'</td><td valign="middle" style="padding:'+(i?'18':'0')+'px 0 18px 20px;'+(i<a.length-1?'border-bottom:1px solid '+t.rule+';':'')+'">'+h.line(k+'name','div','font-family:'+SERIF+';font-size:21px;line-height:26px;font-weight:700;color:'+t.ink+';','Name')+h.line(k+'note','div','margin-top:4px;font-family:'+SANS+';font-size:14.5px;line-height:22px;color:'+t.ink+';','One line about it')+h.line(k+'price','div','margin-top:8px;font-family:'+SERIF+';font-size:18px;line-height:22px;font-weight:700;color:'+t.acc+';','Price')+'</td></tr>';}).join('');
   return wrap(s,t,kick(h,t,'kicker')+h.line('title','h2','margin:0 0 22px 0;font-family:'+SERIF+';font-weight:700;font-size:30px;line-height:36px;color:'+t.ink+';','Heading (optional)')+'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">'+rows+'</table>'+(h.btn('btn','link',t.bb,t.bf)?'<div style="padding-top:22px;">'+h.btn('btn','link',t.bb,t.bf)+'</div>':''));}},
 event:{n:'Event',cat:'Events',d:{bg:'wine',kicker:'What\'s on',title:'Quiz night with The Weekly Fifty',when:'Every second Wednesday of the month',body:'',btn:'See what\'s on',link:SITE+'/pages/whats-on'},
  r:function(s,h,t){return wrap(s,t,kick(h,t,'kicker')+h.line('title','p','margin:0 0 8px 0;font-family:'+SERIF+';font-size:34px;line-height:40px;font-weight:700;color:'+t.ink+';','Event name')+h.line('when','p','margin:0 0 16px 0;font-family:'+SERIF+';font-style:italic;font-size:20px;line-height:28px;color:'+(s.bg==='wine'?C.sand:s.bg==='terra'?C.cream:C.terra)+';','Day, date and time')+h.para('body','font-family:'+SANS+';font-size:15.5px;line-height:25px;color:'+t.ink+';','What it is and why they should come')+(h.btn('btn','link',t.bb,t.bf)?'<div style="padding-top:24px;">'+h.btn('btn','link',t.bb,t.bf)+'</div>':''),'44px 48px 46px 48px');}},
 eventPhoto:{n:'Event with photo',cat:'Events',d:{bg:'sand',img:CDN+'Pub_Quiz_Night.png',shape:'wide',kicker:'Save the date',title:'',when:'',body:'',btn:'',link:SITE+'/pages/whats-on'},
  r:function(s,h,t){return h.img('img',s.shape,600,s.title)+wrap(s,t,kick(h,t,'kicker')+h.line('title','p','margin:0 0 6px 0;font-family:'+SERIF+';font-size:30px;line-height:36px;font-weight:700;color:'+t.ink+';','Event name')+h.line('when','p','margin:0 0 14px 0;font-family:'+SERIF+';font-style:italic;font-size:19px;line-height:27px;color:'+t.acc+';','Day, date and time')+h.para('body','font-family:'+SANS+';font-size:15.5px;line-height:25px;color:'+t.ink+';','What it is and why they should come')+(h.btn('btn','link',t.bb,t.bf)?'<div style="padding-top:22px;">'+h.btn('btn','link',t.bb,t.bf)+'</div>':''),'32px 48px 40px 48px');}},
 story:{n:'Photo and story',cat:'Stories',d:{bg:'sand',flip:false,img:CDN+'4x3_MikaylaADAMS_RubysWineShop_11.jpg',kicker:'From Ruby',title:'',body:'',btn:'',link:SITE+'/'},
  r:function(s,h,t){var im='<td class="col" width="270" valign="top" style="width:270px;padding:0;">'+h.img('img','tall',270,s.title||s.kicker)+'</td>',tx='<td class="col px" valign="middle" style="padding:30px 34px;">'+kick(h,t,'kicker')+h.line('title','p','margin:0 0 12px 0;font-family:'+SERIF+';font-size:28px;line-height:33px;font-weight:700;color:'+t.ink+';','Heading')+h.para('body','font-family:'+SANS+';font-size:15px;line-height:23px;color:'+t.ink+';','The story')+(h.btn('btn','link',t.bb,t.bf)?'<div style="padding-top:18px;">'+h.btn('btn','link',t.bb,t.bf)+'</div>':'')+'</td>';
   return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="'+t.bg+'" style="background:'+t.bg+';"><tr>'+(s.flip?tx+im:im+tx)+'</tr></table>';}},
 quote:{n:'Big quote',cat:'Stories',d:{bg:'cream',quote:'',by:''},
  r:function(s,h,t){return wrap(s,t,'<div style="text-align:center;"><div style="font-family:'+SERIF+';font-size:64px;line-height:40px;color:'+t.acc+';">&ldquo;</div>'+h.line('quote','p','margin:0 0 14px 0;font-family:'+SERIF+';font-style:italic;font-size:26px;line-height:36px;color:'+t.ink+';','A line worth saying big').replace(' data-single="1"','')+h.line('by','p','margin:0;font-family:'+SANS+';font-size:12px;letter-spacing:3px;text-transform:uppercase;color:'+(t.kick||t.acc)+';','Who said it')+'</div>','44px 56px 44px 56px');}},
 photoPair:{n:'Two photos',cat:'Photos',bg:true,d:{bg:'cream',a:CDN+'RubysAperoApril_012.jpg',b:CDN+'4x3_MikaylaADAMS_RubysWineShop_11.jpg',caption:''},
  r:function(s,h,t){return wrap(s,t,'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="col colpad" width="50%" valign="top" style="width:50%;padding-right:6px;">'+h.img('a','tall',249,'')+'</td><td class="col" width="50%" valign="top" style="width:50%;padding-left:6px;">'+h.img('b','tall',249,'')+'</td></tr></table>'+h.line('caption','p','margin:12px 0 0 0;font-family:'+SANS+';font-size:13px;line-height:20px;color:'+t.ink+';','Caption (optional)'),'8px 48px 8px 48px');}},
 visit:{n:'Visit us',cat:'Practical',d:{bg:'cream',title:'Come say hi',body:'Walk-ins only, indoor and outdoor seating. Build a DIY board from our rotating cheeses, dips, charcuterie and olives.',address:'3/297 Sandgate Road, Albion',hours:'Mon and Wed 4 to 9pm\nThu 12 to 9pm\nFri and Sat 12 till late\nSun 12 to 8pm',btn:'Opening hours and directions',link:SITE+'/pages/find-us'},
  r:function(s,h,t){return wrap(s,t,h.line('title','h2','margin:0 0 12px 0;font-family:'+SERIF+';font-weight:700;font-size:28px;line-height:34px;color:'+t.ink+';','Heading')+h.para('body','font-family:'+SANS+';font-size:15.5px;line-height:25px;color:'+t.ink+';','A line about visiting')+'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;"><tr><td class="col colpad" width="50%" valign="top" style="width:50%;padding-right:12px;border-top:1px solid '+t.rule+';padding-top:14px;"><p style="margin:0 0 6px 0;font-family:'+SANS+';font-size:11px;letter-spacing:3px;text-transform:uppercase;color:'+(t.kick||t.acc)+';">Find us</p>'+h.line('address','div','font-family:'+SANS+';font-size:15px;line-height:23px;font-weight:700;color:'+t.ink+';','Address')+'</td><td class="col" width="50%" valign="top" style="width:50%;padding-left:12px;border-top:1px solid '+t.rule+';padding-top:14px;"><p style="margin:0 0 6px 0;font-family:'+SANS+';font-size:11px;letter-spacing:3px;text-transform:uppercase;color:'+(t.kick||t.acc)+';">Opening hours</p>'+h.para('hours','font-family:'+SANS+';font-size:15px;line-height:23px;color:'+t.ink+';','Hours',0)+'</td></tr></table>'+(h.btn('btn','link',t.bb,t.bf)?'<div style="padding-top:24px;">'+h.btn('btn','link',t.bb,t.bf)+'</div>':''));}},
 button:{n:'Button',cat:'Practical',d:{bg:'cream',btn:'Come in this week',link:SITE+'/pages/find-us'},
  r:function(s,h,t){var b=h.btn('btn','link',t.bb,t.bf,'center');return b?wrap(s,t,b,'20px 48px 28px 48px'):'';}},
 cheers:{n:'Cheers divider',cat:'Practical',bg:false,d:{bg:'cream'},
  r:function(s,h,t){return wrap(s,t,'<img src="'+CDN+'rubys-cheers-hands.png?width=300" width="120" alt="" style="display:block;margin:0 auto;width:120px;height:auto;border:0;">','16px 48px 16px 48px');}},
 signoff:{n:'Sign-off',cat:'Practical',d:{bg:'cream',line:'See you at the bar.',from:'The Ruby\'s crew (and Ruby)'},
  r:function(s,h,t){return wrap(s,t,h.line('line','p','margin:0 0 4px 0;font-family:'+SERIF+';font-style:italic;font-size:21px;line-height:29px;color:'+t.ink+';','Last line')+h.line('from','p','margin:0;font-family:'+SANS+';font-size:14px;line-height:20px;color:'+t.acc+';','From'),'36px 48px 44px 48px');}}
};
var CATS=['Openers','Wine and gifts','Events','Stories','Photos','Practical'];

var uid=0;
function clone(o){return JSON.parse(JSON.stringify(o));}
function make(type,over){var s=clone(SECTIONS[type].d);s.type=type;s.id='s'+Date.now().toString(36)+(++uid);if(over)for(var k in over)s[k]=over[k];return s;}

function renderSection(s,mode){var def=SECTIONS[s.type];if(!def)return '';return def.r(s,H(s,mode),T(s));}
function renderEmail(doc,mode){
 var E=mode==='edit';
 var secs=doc.sections.map(function(s){var inner=renderSection(s,mode);if(!E&&!inner)return '';return '<tr'+(E?' data-sec="'+s.id+'"':'')+'><td style="padding:0;">'+inner+'</td></tr>';}).join('\n');
 var eb=E?'<span data-f="doc:eyebrow" data-single="1" data-ph="Line under the logo">'+esc(doc.eyebrow)+'</span>':esc(doc.eyebrow);
 return '<!DOCTYPE html>\n<html lang="en-AU">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>'+esc(doc.subject||'Ruby\'s Wine Shop')+'</title>\n<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700&family=Playfair:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">\n<style>\nbody{margin:0;padding:0;background:'+C.sand+';}\na{color:'+C.terra+';}\n@media (max-width:599px){.w{width:100%!important}.px{padding-left:24px!important;padding-right:24px!important}.h1{font-size:32px!important;line-height:38px!important}.big{font-size:68px!important;line-height:70px!important}.col{display:block!important;width:100%!important;box-sizing:border-box!important}.colpad{padding:0 0 18px 0!important}}\n</style>\n</head>\n<body style="margin:0;padding:0;background:'+C.sand+';">\n'
 +(!E&&doc.pre?'<div style="display:none;max-height:0;overflow:hidden;">'+esc(doc.pre)+'</div>\n':'')
 +'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:'+C.sand+';"><tr><td align="center" style="padding:24px 0;">\n<table role="presentation" class="w" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:'+C.cream+';">\n'
 +'<tr><td align="center" style="padding:32px 40px 6px 40px;">'+(E?'':'<a href="'+SITE+'/" target="_blank">')+'<img src="'+CDN+'rubys-logo.png?width=300" width="130" height="130" alt="Ruby\'s Wine Shop" style="display:block;width:130px;height:130px;border:0;">'+(E?'':'</a>')+'</td></tr>\n'
 +'<tr><td align="center" style="padding:0 40px 26px 40px;font-family:'+SANS+';font-size:11px;letter-spacing:3px;text-transform:uppercase;color:'+C.wine+';">'+eb+'</td></tr>\n'
 +secs
 +'\n<tr><td align="center" style="background:'+C.sand+';padding:28px 40px;font-family:'+SANS+';font-size:12px;line-height:20px;color:'+C.wine+';">Ruby\'s Wine Shop &middot; 3/297 Sandgate Road, Albion QLD 4010<br><a href="mailto:info@rubyswineshop.com.au" style="color:'+C.wine+';">info@rubyswineshop.com.au</a> &middot; <a href="https://www.instagram.com/rubys_wine_shop" target="_blank" style="color:'+C.wine+';">Instagram</a><br>You\'re getting this because you joined Ruby\'s list. <a href="'+(E?'#':'{{ unsubscribe_url }}')+'" style="color:'+C.wine+';">Unsubscribe</a></td></tr>\n'
 +'</table>\n</td></tr></table>\n'+(E?'':'{{ open_tracking_block }}\n')+'</body>\n</html>';
}

/* Five starting templates. Real Ruby's facts only; grey hints mark what Tamara fills in each time. */
var LAYOUTS={
 weekly:{n:'Ruby\'s Weekly',desc:'Your Friday email: pours by the glass, what\'s on, and a bottle from the shelf.',f:function(){return {subject:'This week at Ruby\'s',pre:'What\'s open by the glass, and what\'s on this week.',eyebrow:'Ruby\'s Weekly',sections:[
  make('photoHead',{img:CDN+'4x3_MikaylaADAMS_RubysWineShop_8.jpg',shape:'wide',img_alt:'A busy night at the bar at Ruby\'s',img_link:SITE+'/pages/find-us',kicker:'',title:'This week at Ruby\'s',body:''}),
  make('lineup',{kicker:'By the glass',title:'Open this week',items:[{name:'Our house-made Pet Nat',note:'',price:''},{name:'',note:'',price:''},{name:'',note:'',price:''}],btn:'Come in for a glass',link:SITE+'/pages/find-us'}),
  make('event',{bg:'wine',kicker:'What\'s on',title:'Quiz night with The Weekly Fifty',when:'Every second Wednesday of the month',body:'Hosted by The Weekly Fifty crew. Spots go fast, so book early.',btn:'See what\'s on',link:SITE+'/pages/whats-on'}),
  make('story',{bg:'sand',img:CDN+'RubysAperoApril_0118.jpg',img_alt:'A bottle to take home from Ruby\'s',kicker:'On the shelf',title:'',body:'',btn:'',link:SITE+'/pages/find-us'}),
  make('signoff',{line:'See you at the bar.'})]};}},

 quiz:{n:'Quiz night: subscribers first',desc:'Send this 48 hours before the booking link goes on Instagram.',f:function(){return {subject:'Quiz night: you get first dibs',pre:'Subscribers get the booking link 48 hours before Instagram.',eyebrow:'Subscribers first',sections:[
  make('hero',{img:CDN+'Pub_Quiz_Night.png',shape:'original',img_alt:'Ruby\'s quiz night with The Weekly Fifty',img_link:SITE+'/pages/whats-on'}),
  make('letter',{bg:'terra',align:'center',kicker:'Ruby\'s quiz night',title:'Bookings are open. For you, first.',body:'You\'re on the list, so you get the link 48 hours before it goes on Instagram.',btn:'Book your team in',link:SITE+'/pages/whats-on'}),
  make('date',{bg:'wine',label:'Next quiz',big:'',body:'Hosted by The Weekly Fifty crew, every second Wednesday of the month.',btn:'',link:SITE+'/pages/whats-on'}),
  make('text',{bg:'cream',title:'Missed out?',body:'Join the waitlist on our What\'s on page and we\'ll email you if a table opens up. There are walk-in spots outside too, and if we can squeeze you in on the night, we will.',btn:'Join the waitlist',link:SITE+'/pages/whats-on'}),
  make('signoff',{line:'Sharpen your pencils.'})]};}},

 gift:{n:'Christmas gift boxes',desc:'Your three boxes with prices, order cut-offs and delivery.',f:function(){return {subject:'Three boxes, hand-picked',pre:'Ruby Custom orders close Sunday 6 December.',eyebrow:'Christmas at Ruby\'s',sections:[
  make('hero',{img:CDN+'gift-boxes-banner-v2.jpg',shape:'original',img_alt:'Ruby\'s Christmas gift boxes',img_link:SITE+'/pages/gift-boxes'}),
  make('letter',{bg:'cream',kicker:'',title:'Hand-picked by us, not an algorithm.',body:'Three bottles in every box from the independent winemakers we pour all year, with tasting cards, beautifully packaged and ready to give.'}),
  make('lineup',{bg:'sand',kicker:'Christmas 2026',title:'Pick the box that suits them',items:[{name:'Introduction Collection',note:'A sparkling, a white and a red. Fun and easy drinking.',price:'$160'},{name:'Explorer\'s Collection',note:'Three standout bottles you won\'t find in an average bottle shop, with a personal note.',price:'$260'},{name:'The Ruby Custom',note:'Three premium bottles, fully bespoke. Tell us about them and we\'ll build it.',price:'From $380'}],btn:'Choose your box',link:SITE+'/pages/gift-boxes'}),
  make('date',{bg:'wine',label:'Ruby Custom orders close',big:'Sun 6 Dec',body:'Explorer\'s and Introduction close Sunday 13 December. Pickup or Brisbane delivery from Wednesday 2 December.',btn:'Request a custom box',link:SITE+'/pages/gift-boxes'}),
  make('visit',{bg:'cream',title:'Getting it to them',body:'Free pickup from Ruby\'s in Albion, or $15 local delivery across Brisbane metro. Free delivery on orders over $800 (minimum 5 boxes). Only available to adults 18+.',btn:'',link:SITE+'/pages/gift-boxes'}),
  make('cheers'),
  make('signoff',{line:'Cheers to the season.'})]};}},

 shelf:{n:'On the shelf',desc:'Bottles to take home: new arrivals and what you\'re loving.',f:function(){return {subject:'New on the shelf at Ruby\'s',pre:'A few bottles worth taking home this week.',eyebrow:'On the shelf',sections:[
  make('photoHead',{bg:'wine',img:CDN+'RubysAperoApril_0118.jpg',shape:'square',img_alt:'A bottle to take home from Ruby\'s',img_link:SITE+'/pages/find-us',kicker:'Take one home',title:'New on the shelf',body:'Our shelf is always growing, with unique and classic wines from all over the world. Here\'s what\'s just landed.'}),
  make('lineup',{bg:'cream',kicker:'Just landed',title:'Three to take home',items:[{name:'',note:'',price:''},{name:'',note:'',price:''},{name:'',note:'',price:''}],btn:'',link:SITE+'/pages/find-us'}),
  make('quote',{bg:'terra',quote:'We care about community and where the wine has come from.',by:'Minimal intervention, independent winemakers'}),
  make('text',{bg:'sand',title:'Always on the shelf',body:'Hard-to-find drops from Switzerland, skin-contact Georgian beauties, and a great selection from our own backyard in QLD. Plus a growing vermouth selection by the glass.',btn:'Come and browse',link:SITE+'/pages/find-us'}),
  make('photoPair',{bg:'sand',a:CDN+'RubysAperoApril_012.jpg',a_alt:'A Ruby\'s snack board with a glass of red',b:CDN+'MikaylaADAMS_RubysWineShop_7.jpg',b_alt:'Ruby\'s Wine Shop at dusk',caption:'Open it here with a board, or take it home.'}),
  make('signoff',{line:'See you at the shelf.'})]};}},

 night:{n:'Make a night of it',desc:'Snacks, dinner to your seat from Olive Thyme, and your hours.',f:function(){return {subject:'Make a night of it at Ruby\'s',pre:'Wine, a DIY board, and dinner delivered to your seat.',eyebrow:'Wine shop · Albion · Brisbane',sections:[
  make('hero',{img:CDN+'RubysAperoApril_012.jpg',shape:'wide',img_alt:'A Ruby\'s snack board with olives, cheese and charcuterie beside a glass of red',img_link:SITE+'/pages/about'}),
  make('letter',{bg:'sand',align:'center',kicker:'Spontaneous evenings',title:'Make a night of it.',body:'Grab a seat, indoors or out, pick from 8 to 10 rotating pours, and let the evening unfold however it wants to.',btn:'',link:SITE+'/'}),
  make('lineup',{bg:'cream',kicker:'Hungry?',title:'Two ways to eat',items:[{name:'Build a DIY board',note:'From our rotating cheeses, dips, charcuterie and olives.',price:''},{name:'Dinner to your seat',note:'Scan the QR code and Olive Thyme next door delivers straight to you.',price:''}],btn:'See Olive Thyme\'s menu',link:'https://olivethyme.com.au/menu/'}),
  make('story',{bg:'wine',flip:true,img:CDN+'4x3_MikaylaADAMS_RubysWineShop_11.jpg',img_alt:'Ruby the border collie under a chair',kicker:'Meet the boss',title:'Say hi to Ruby',body:'Our founder\'s border collie, and the reason the bar has a name. She greets every visitor like an old friend.',btn:'',link:SITE+'/pages/about'}),
  make('visit',{bg:'cream'}),
  make('signoff',{line:'No pretension, just great wine and good people.'})]};}},

 simple:{n:'Simple email',desc:'One photo, a headline, a few lines and a button. For news, closures or anything quick.',f:function(){return {subject:'',pre:'',eyebrow:'Wine shop · Albion · Brisbane',sections:[
  make('photoHead',{bg:'cream',img:CDN+'MikaylaADAMS_RubysWineShop_7.jpg',shape:'wide',img_alt:'Ruby\'s Wine Shop at dusk',img_link:SITE+'/',kicker:'',title:'',body:'',btn:'Find out more',link:SITE+'/'}),
  make('signoff')]};}}
};

window.RS={CDN:CDN,SITE:SITE,C:C,PICS:PICS,LINKS:LINKS,THEMES:THEMES,SECTIONS:SECTIONS,CATS:CATS,LAYOUTS:LAYOUTS,make:make,renderEmail:renderEmail,renderSection:renderSection,get:get,imgUrl:imgUrl};
})();
