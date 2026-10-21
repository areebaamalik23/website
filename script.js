(function(){
'use strict';
var d=document,root=d.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
root.classList.add('js');
// Preloader: hidden on load, with a 2.5s safety timeout in case an image or CDN stalls.
var pre=d.getElementById('preloader');function hide(){pre.classList.add('done')}
addEventListener('load',function(){setTimeout(hide,500)});setTimeout(hide,2500);
// Image fallback chain: second photo URL (data-fb), then hide so the inline wireframe behind it shows
d.querySelectorAll('img').forEach(function(i){i.addEventListener('error',function(){var n=i.dataset.fb;if(n){i.dataset.fb='';i.src=n}else i.style.display='none'})});
// Navbar state, progress bar, back-to-top
var nav=d.getElementById('nav'),bar=d.getElementById('progress'),top=d.getElementById('totop');
function onScroll(){var y=scrollY,h=root.scrollHeight-innerHeight;nav.classList.toggle('solid',y>40);bar.style.width=(h>0?y/h*100:0)+'%';top.classList.toggle('show',y>600)}
addEventListener('scroll',onScroll,{passive:true});onScroll();
top.addEventListener('click',function(){scrollTo({top:0,behavior:reduce?'auto':'smooth'})});
// Close mobile menu after choosing a link
d.querySelectorAll('.nav-link').forEach(function(a){a.addEventListener('click',function(){var m=d.getElementById('menu');if(m.classList.contains('show')&&window.bootstrap)bootstrap.Collapse.getOrCreateInstance(m).hide()})});
// Active link on scroll
var links=[].slice.call(d.querySelectorAll('.nav-link'));
var spy=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id)})})},{rootMargin:'-45% 0px -50% 0px'});
links.forEach(function(a){var s=d.querySelector(a.getAttribute('href'));if(s)spy.observe(s)});
// Scroll reveal, staggered within the same row
var rv=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var sib=[].indexOf.call(e.target.parentNode.children,e.target);e.target.style.transitionDelay=Math.min(sib,4)*90+'ms';e.target.classList.add('in');rv.unobserve(e.target)}})},{threshold:.15});
d.querySelectorAll('.reveal').forEach(function(el){rv.observe(el)});
// Counters: run once when the stats enter view
function count(el){var to=+el.dataset.count;if(reduce){el.textContent=to;return}var t0=performance.now();(function step(t){var p=Math.min((t-t0)/1600,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step)})(t0)}
var co=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.querySelectorAll('[data-count]').forEach(count);co.unobserve(e.target)}})},{threshold:.4});
var st=d.querySelector('.stats');if(st)co.observe(st);
// Custom cursor: a dot that follows exactly and a ring that trails with easing. Never blocks clicks (pointer-events:none).
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce){
 var dot=d.querySelector('.cursor-dot'),ring=d.querySelector('.cursor-ring'),mx=0,my=0,rx=0,ry=0,started=false;
 addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;if(!started){started=true;rx=mx;ry=my;root.classList.add('cursor-on');loop()}});
 function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;dot.style.transform='translate('+mx+'px,'+my+'px)';ring.style.transform='translate('+rx+'px,'+ry+'px)';requestAnimationFrame(loop)}
 d.querySelectorAll('a,button,.svc,.proj').forEach(function(el){el.addEventListener('mouseenter',function(){ring.classList.add('hot')});el.addEventListener('mouseleave',function(){ring.classList.remove('hot')})});
 // Magnetic pull on main buttons
 d.querySelectorAll('.magnetic').forEach(function(b){b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+(e.clientX-r.left-r.width/2)*.2+'px,'+(e.clientY-r.top-r.height/2)*.3+'px)'});b.addEventListener('mouseleave',function(){b.style.transform=''})});
}
// Hero parallax: uses the independent `translate` property so it never fights the float animation
var pa=[['.photo.tall',.06],['.mock',-.1],['.code-chip',.12]].map(function(p){return[d.querySelector(p[0]),p[1]]});
if(!reduce){var tk=false;addEventListener('scroll',function(){if(tk||scrollY>innerHeight)return;tk=true;requestAnimationFrame(function(){pa.forEach(function(p){if(p[0])p[0].style.translate='0 '+(scrollY*p[1]).toFixed(1)+'px'});tk=false})},{passive:true})}
// Contact form: client-side validation only. Nothing is sent anywhere.
var f=d.getElementById('form'),status=d.getElementById('status');
f.addEventListener('submit',function(e){e.preventDefault();var ok=true;
 [].forEach.call(f.querySelectorAll('input,textarea'),function(i){var v=i.value.trim(),m='';
  if(!v)m='Please fill in this field.';else if(i.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))m='Enter a valid email address, like name@example.com.';else if(i.id==='message'&&v.length<10)m='Write at least 10 characters so we have something to work with.';
  i.classList.toggle('bad',!!m);i.nextElementSibling.textContent=m;i.setAttribute('aria-invalid',!!m);if(m)ok=false});
 status.className='show '+(ok?'ok':'fail');status.textContent=ok?'Thanks, your details look good. This site is not connected to an email service yet, so nothing has been sent. Please write to us directly.':'Please fix the highlighted fields and try again.';
 if(ok)f.reset()});
d.getElementById('year').textContent=new Date().getFullYear();
})();
