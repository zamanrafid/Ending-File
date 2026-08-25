


/* Pointer/scroll effects below read layout (getBoundingClientRect) and write styles on
   every event. Coalescing to one call per frame and forcing passive prevents the
   browser from blocking the scroll thread and from recalculating layout ~120x/sec. */
(function(){
  var raf = window.requestAnimationFrame;
  if (!raf || !window.WeakMap) return;

  var COALESCE = { mousemove:1, pointermove:1 };
  var PASSIVE  = { mousemove:1, pointermove:1, scroll:1 };

  var addOrig = EventTarget.prototype.addEventListener;
  var remOrig = EventTarget.prototype.removeEventListener;
  var wrappers = new WeakMap();

  function wrapperFor(target, type, fn) {
    var byFn = wrappers.get(target);
    if (!byFn) { byFn = new WeakMap(); wrappers.set(target, byFn); }
    var byType = byFn.get(fn);
    if (!byType) { byType = {}; byFn.set(fn, byType); }
    return byType;
  }

  EventTarget.prototype.addEventListener = function(type, fn, opts) {
    if (typeof fn !== 'function' || !PASSIVE[type]) {
      return addOrig.call(this, type, fn, opts);
    }

    var o = (opts == null || typeof opts === 'boolean') ? { capture: !!opts } : Object.assign({}, opts);
    if (o.passive === undefined) o.passive = true;

    var handler = fn;
    if (COALESCE[type]) {
      // Leading edge: run immediately so cursor-tracking stays latency-free, then
      // ignore further events until the next frame. A trailing catch-up runs only
      // if newer events arrived, so the final resting position is never dropped.
      var target = this, pending = false, latest = null, ranWith = null;
      handler = function(e) {
        latest = e;
        if (pending) return;
        pending = true;
        ranWith = e;
        fn.call(target, e);
        raf(function(){
          pending = false;
          if (latest !== ranWith) { ranWith = latest; fn.call(target, latest); }
        });
      };
      wrapperFor(this, type, fn)[type] = handler;
    }
    return addOrig.call(this, type, handler, o);
  };

  EventTarget.prototype.removeEventListener = function(type, fn, opts) {
    if (typeof fn === 'function' && COALESCE[type]) {
      var byFn = wrappers.get(this);
      var byType = byFn && byFn.get(fn);
      if (byType && byType[type]) return remOrig.call(this, type, byType[type], opts);
    }
    return remOrig.call(this, type, fn, opts);
  };
})();

!function(){function e(){document.querySelectorAll('link[rel="preload"][as="style"]').forEach(function(e){e.rel="stylesheet"})}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",e):e(),setTimeout(e,300),setTimeout(e,1500),window.addEventListener("load",e)}();

"scrollRestoration" in history&&(history.scrollRestoration="manual");function endBodyReveal(){document.body.style.animation="none",document.body.style.transform="none",document.body.style.filter="none",document.body.style.opacity="1"}document.getElementById("year").textContent=(new Date).getFullYear(),document.body.addEventListener("animationend",function e(t){t.target===document.body&&(endBodyReveal(),document.body.removeEventListener("animationend",e))}),setTimeout(endBodyReveal,600),document.querySelectorAll("#navLinks a").forEach((e,t)=>e.style.setProperty("--ni",t));const navbar=document.getElementById("navbar");window.addEventListener("scroll",()=>{navbar.classList.toggle("scrolled",window.scrollY>30)});const menuDotBtn=document.getElementById("menuDotBtn"),navLinks=document.getElementById("navLinks"),navbarEl=document.getElementById("navbar");navbarEl&&(navbarEl.addEventListener("animationend",()=>{navbarEl.style.transform="none"}),setTimeout(()=>{navbarEl.style.transform="none"},2200));const menuDotIcon=document.getElementById("menuDotIcon");function closeMenu(){navLinks.classList.remove("open"),menuDotBtn.classList.remove("open"),menuDotBtn.setAttribute("aria-expanded","false"),document.body.classList.remove("menu-open"),menuDotIcon&&(menuDotIcon.classList.remove("fa-xmark"),menuDotIcon.classList.add("fa-bars"))}function openMenu(){navLinks.classList.add("open"),menuDotBtn.classList.add("open"),menuDotBtn.setAttribute("aria-expanded","true"),document.body.classList.add("menu-open"),menuDotIcon&&(menuDotIcon.classList.remove("fa-bars"),menuDotIcon.classList.add("fa-xmark"))}menuDotBtn.addEventListener("click",()=>{navLinks.classList.contains("open")?closeMenu():openMenu()}),navLinks.querySelectorAll("a").forEach(e=>e.addEventListener("click",closeMenu)),navLinks.addEventListener("click",e=>{e.target===navLinks&&closeMenu()}),document.addEventListener("keydown",e=>{"Escape"===e.key&&closeMenu()}),document.addEventListener("click",e=>{navLinks.classList.contains("open")&&(navLinks.contains(e.target)||menuDotBtn.contains(e.target)||closeMenu())});const sectionIds=["home","about","skills","services","portfolio","why","faq","contact"],railLabels={home:"Home",about:"About",skills:"Skills",services:"Services",portfolio:"Portfolio",why:"Why Me",faq:"FAQ",contact:"Contact"},rail=document.getElementById("rail");sectionIds.forEach(e=>{const t=document.createElement("div");t.className="rail-dot",t.dataset.target=e,t.innerHTML='<span class="rail-label">'+railLabels[e]+"</span>",t.addEventListener("click",()=>(window.goToSection||fxScrollToId)("#"+e)),rail.appendChild(t)});const navPill=document.getElementById("navPill"),railDots=rail.querySelectorAll(".rail-dot"),navA=document.querySelectorAll("#navLinks a"),io=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){const t=e.target.id;railDots.forEach(e=>e.classList.toggle("active",e.dataset.target===t)),navA.forEach(e=>e.classList.toggle("active",e.dataset.nav===t)),movePill()}})},{rootMargin:"-45% 0px -45% 0px"});sectionIds.forEach(e=>{const t=document.getElementById(e);t&&io.observe(t)});function movePill(){const e=document.querySelector("#navLinks a.active");e&&navPill&&(navPill.style.width=e.offsetWidth+"px",navPill.style.transform="translateX("+e.offsetLeft+"px)",navPill.classList.add("active-pill"))}window.addEventListener("resize",movePill),navA.forEach(e=>e.addEventListener("mouseenter",()=>{navPill.style.width=e.offsetWidth+"px",navPill.style.transform="translateX("+e.offsetLeft+"px)",navPill.classList.add("active-pill")})),document.getElementById("navLinks").addEventListener("mouseleave",movePill),setTimeout(movePill,500);const revealEls=document.querySelectorAll(".reveal, .reveal-left, .reveal-scale"),__revPend=new Set(),__revealIn=function(el){el.classList.add("in")},revealIO=new IntersectionObserver(e=>{e.forEach(en=>{(en.isIntersecting||en.boundingClientRect.top<0)&&(__revealIn(en.target),revealIO.unobserve(en.target),__revPend.delete(en.target))})},{rootMargin:"0px 0px 28% 0px",threshold:0});revealEls.forEach(e=>{__revPend.add(e),revealIO.observe(e)});
function __revealSweep(){for(var vh=window.innerHeight,l=document.querySelectorAll(".reveal:not(.in), .reveal-left:not(.in), .reveal-scale:not(.in)"),k=0;k<l.length;k++){var r=l[k].getBoundingClientRect();(r.top<vh-10||r.bottom<=0)&&l[k].classList.add("in")}}
window.addEventListener("scroll",function(){window.__revQ||(window.__revQ=!0,requestAnimationFrame(function(){window.__revQ=!1,__revealSweep()}))},{passive:!0}),window.addEventListener("resize",function(){setTimeout(__revealSweep,120)}),(function(){var t=setInterval(function(){__revealSweep();document.querySelector('.reveal:not(.in), .reveal-left:not(.in), .reveal-scale:not(.in)')||clearInterval(t)},1200)})(),setTimeout(__revealSweep,700),window.addEventListener("load",__revealSweep);const scrollProgress=document.getElementById("scrollProgress"),toTopProgress=document.getElementById("toTopProgress"),RING_CIRC=132;function updateProgress(){const e=document.documentElement,t=e.scrollTop/(e.scrollHeight-e.clientHeight)*100;scrollProgress.style.width=t+"%",toTopProgress&&(toTopProgress.style.strokeDashoffset=132-132*t/100)}window.addEventListener("scroll",updateProgress,{passive:!0}),updateProgress(),function(){const e=document.querySelector(".hero-visual"),t=document.querySelector(".hero");if(!e||!t)return;let n=!1;function s(){n||(n=!0,requestAnimationFrame(()=>{const s=window.scrollY||window.pageYOffset,i=t.offsetHeight||1,o=Math.min(1,Math.max(0,s/i));e.style.setProperty("--scroll-y",s.toFixed(1)),e.style.setProperty("--scroll-prog",o.toFixed(3)),e.classList.add("parallax-1"),e.classList.toggle("scrolled-away",o>.55);const a=document.querySelector(".hero-content");a&&(a.style.transform="translateY("+(.06*-s).toFixed(1)+"px)"),n=!1}))}window.addEventListener("scroll",s,{passive:!0}),s()}();const cursorGlow=document.getElementById("cursorGlow");let glowTimeout;window.addEventListener("mousemove",e=>{cursorGlow.style.setProperty("--cx",e.clientX+"px"),cursorGlow.style.setProperty("--cy",e.clientY+"px"),cursorGlow.classList.add("active"),clearTimeout(glowTimeout),glowTimeout=setTimeout(()=>cursorGlow.classList.remove("active"),1400)}),function(){const e=document.getElementById("heroHeadline"),t=e.querySelector(".grad");let n=0;if(t){const e=t.textContent;t.textContent="";const s=document.createElement("span");s.className="rw";const i=document.createElement("span");i.className="grad-word",i.textContent=e,i.style.setProperty("--wi",n++),s.appendChild(i),t.appendChild(s)}const s=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),i=[];let o;for(;o=s.nextNode();)i.push(o);i.forEach(e=>{if(e.parentElement&&e.parentElement.closest(".grad"))return;const t=e.textContent.split(/(\s+)/),s=document.createDocumentFragment();t.forEach(e=>{if(""===e.trim())return void s.appendChild(document.createTextNode(e));const t=document.createElement("span");t.className="rw";const i=document.createElement("span");i.textContent=e,i.style.setProperty("--wi",n++),t.appendChild(i),s.appendChild(t)}),e.parentNode.replaceChild(s,e)})}(),function(){var e=["Full-Stack Developer","AI Automation Expert","Digital Marketing Specialist","Creative Designer"],t=document.getElementById("roleCycle"),n=0,r;if(!t)return;if(t.children.length){r=[].slice.call(t.children)}else{r=e.map(function(s){var i=document.createElement("span");return i.textContent=s,t.appendChild(i),i})}if(!r.length)return;[].forEach.call(r,function(s){s.classList.remove("active")});r[0].classList.add("active");setInterval(function(){r[n].classList.remove("active");n=(n+1)%r.length;r[n].classList.add("active")},2600)}(),function(){const e=document.getElementById("particles"),t=window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=window.matchMedia("(hover:none), (pointer:coarse)").matches;if(t||n||window.innerWidth<700)return void e.remove();const s=e.getContext("2d");if(!s)return void e.remove();let i,o,a;const r=["31,92,82","190,132,56","62,133,121"],c={x:-9999,y:-9999,active:!1};function d(){i=e.width=e.offsetWidth*devicePixelRatio,o=e.height=e.offsetHeight*devicePixelRatio,e.style.width=e.offsetWidth+"px",e.style.height=e.offsetHeight+"px"}e.addEventListener("mousemove",t=>{const n=e.getBoundingClientRect();c.x=t.clientX-n.left,c.y=t.clientY-n.top,c.active=!0}),e.addEventListener("mouseleave",()=>c.active=!1),e.style.pointerEvents="auto",window.addEventListener("resize",d),function(){d();const t=Math.min(70,Math.floor(e.offsetWidth*e.offsetHeight/16e3));a=Array.from({length:t},()=>({x:Math.random()*i,y:Math.random()*o,r:(1.6*Math.random()+.7)*devicePixelRatio,vx:.24*(Math.random()-.5)*devicePixelRatio,vy:.24*(Math.random()-.5)*devicePixelRatio,c:r[Math.floor(Math.random()*r.length)],a:.5*Math.random()+.35,p:Math.random()*Math.PI*2}))}(),function e(){s.clearRect(0,0,i,o);const t=c.x*devicePixelRatio,n=c.y*devicePixelRatio,r=130*devicePixelRatio;for(let e=0;e<a.length;e++){for(let t=e+1;t<a.length;t++){const n=a[e],i=a[t],o=n.x-i.x,c=n.y-i.y,d=Math.sqrt(o*o+c*c);if(d<r){const e=.18*(1-d/r);s.beginPath(),s.moveTo(n.x,n.y),s.lineTo(i.x,i.y),s.strokeStyle="rgba(190,132,56,"+e.toFixed(3)+")",s.lineWidth=.7*devicePixelRatio,s.stroke()}}if(c.active){const i=a[e],o=i.x-t,c=i.y-n,d=Math.sqrt(o*o+c*c);if(d<1.3*r){const e=.35*(1-d/(1.3*r));s.beginPath(),s.moveTo(i.x,i.y),s.lineTo(t,n),s.strokeStyle="rgba(31,92,82,"+e.toFixed(3)+")",s.lineWidth=.8*devicePixelRatio,s.stroke();const a=.35*(1-d/(1.3*r));i.vx+=o/(d||1)*a*.02,i.vy+=c/(d||1)*a*.02}}}a.forEach(e=>{e.vx*=.985,e.vy*=.985,e.x+=e.vx,e.y+=e.vy,e.p+=.02,e.x<0&&(e.x=i),e.x>i&&(e.x=0),e.y<0&&(e.y=o),e.y>o&&(e.y=0);const t=e.a*(.6+.4*Math.sin(e.p));s.beginPath(),s.arc(e.x,e.y,e.r,0,2*Math.PI),s.fillStyle="rgba("+e.c+","+t.toFixed(2)+")",s.fill()}),requestAnimationFrame(e)}()}(),document.querySelectorAll(".btn").forEach(e=>{e.addEventListener("click",function(e){const t=this.getBoundingClientRect(),n=document.createElement("span");n.className="ripple-span";const s=Math.max(t.width,t.height);n.style.width=n.style.height=s+"px",n.style.left=e.clientX-t.left-s/2+"px",n.style.top=e.clientY-t.top-s/2+"px",this.style.position="relative",this.style.overflow="hidden",this.appendChild(n),setTimeout(()=>n.remove(),650)})}),function(){if(!window.matchMedia("(hover:hover) and (pointer:fine)").matches)return;document.documentElement.classList.add("custom-cursor");const e=document.getElementById("cursorDot"),t=document.getElementById("cursorRing");let n=window.innerWidth/2,s=window.innerHeight/2,i=n,o=s,a=!1;window.addEventListener("mousemove",i=>{n=i.clientX,s=i.clientY,e.style.transform="translate("+n+"px,"+s+"px) translate(-50%,-50%)",a||(a=!0,e.classList.add("active"),t.classList.add("active"))}),function e(){i+=.2*(n-i),o+=.2*(s-o),t.style.transform="translate("+i+"px,"+o+"px) translate(-50%,-50%)",requestAnimationFrame(e)}(),document.addEventListener("mousedown",e=>{t.classList.add("clicking");const n=document.createElement("div");n.className="cursor-click-fx",n.style.left=e.clientX+"px",n.style.top=e.clientY+"px",document.body.appendChild(n),n.addEventListener("animationend",()=>n.remove())}),document.addEventListener("mouseup",()=>t.classList.remove("clicking"));const r="a, button, .btn, [class*='-card'], .pfp-circle, .skill-chip, input, textarea, select, .filter-btn, .mm-tile, .lightbox-close, .lb-nav-btn, .social-link, .nav-link, .tag, [role='button'], summary, label";document.addEventListener("mouseover",n=>{n.target.closest(r)&&(t.classList.add("hovering"),e.classList.add("hovering"))}),document.addEventListener("mouseout",n=>{n.target.closest(r)&&(t.classList.remove("hovering"),e.classList.remove("hovering"))}),document.addEventListener("mouseleave",()=>{e.classList.remove("active"),t.classList.remove("active"),a=!1})}(),document.addEventListener("mousemove",e=>{const t=e.target.closest?e.target.closest(".spot"):null;if(!t)return;const n=t.getBoundingClientRect();t.style.setProperty("--mx",e.clientX-n.left+"px"),t.style.setProperty("--my",e.clientY-n.top+"px")});const SKILLS=[{cat:"Full-Stack Development",icon:"fa-code",items:[["Frontend Development",96],["Responsive Web Development",97],["HTML5 & CSS3",98],["JavaScript (ES6+)",95],["TypeScript",91],["React.js Development",94],["Next.js Development",93],["Node.js & Backend Development",91],["REST API & API Integration",95],["Database Management",90],["Authentication & Security",89],["Performance & SEO Optimization",94]]},{cat:"AI Automation",icon:"fa-robot",items:[["n8n Workflow Automation",97],["AI Agent Development",94],["Prompt Engineering & AI Systems",95],["API & Third-Party App Integrations",96],["AI Chatbot & Assistant Development",92],["Business Process Automation",95],["AI-Powered Data Processing",91],["Zapier & Make Automation",90]]},{cat:"Creative Design",icon:"fa-palette",items:[["Brand Identity Design",98],["Logo Design",96],["Graphic Design",98],["Social Media Design",97],["Print & Marketing Materials",93],["Business Card Design",94],["Resume Design",90],["Book Cover Design",92]]},{cat:"Digital Marketing",icon:"fa-chart-line",items:[["Search Engine Optimization (SEO)",98],["Social Media Management",97],["Meta Ads (Facebook & Instagram Ads)",96],["Google Ads (PPC)",95],["Digital Marketing Strategy",94],["Content Marketing",93],["Keyword Research",92],["Google Analytics (GA4)",91]]}],tabsEl=document.getElementById("skillsGrid");function animateRing(e,t,n){const s=performance.now();requestAnimationFrame(function i(o){const a=Math.min((o-s)/n,1),r=1-Math.pow(1-a,3);e.style.setProperty("--pct",(r*t).toFixed(1)),a<1&&requestAnimationFrame(i)})}const TOOLKIT_PICKS=[["Full-Stack Development","HTML5 & CSS3","fa-brands fa-html5"],["Full-Stack Development","JavaScript (ES6+)","fa-brands fa-js"],["Full-Stack Development","React.js Development","fa-brands fa-react"],["AI Automation","n8n Workflow Automation","fa-solid fa-robot"],["Creative Design","Graphic Design","fa-solid fa-palette"],["Digital Marketing","Search Engine Optimization (SEO)","fa-solid fa-magnifying-glass-chart"]];const HORIZON_PICKS=[["Creative Design","Resume Design","fa-solid fa-id-card-clip"],["Digital Marketing","Google Analytics (GA4)","fa-solid fa-chart-pie"],["AI Automation","AI-Powered Data Processing","fa-solid fa-microchip"]];const skillClsByCat={"Creative Design":"c-design","Digital Marketing":"c-market","Full-Stack Development":"c-web","AI Automation":"c-ai"};function findSkill(catName,itemName){const cat=SKILLS.find(c=>c.cat===catName);if(!cat)return null;const it=cat.items.find(([n])=>n===itemName);return it?{name:itemName,pct:it[1],cat:catName}:null}const toolkitGrid=document.getElementById("toolkitGrid");TOOLKIT_PICKS.forEach(([catName,itemName,icon],i)=>{const sk=findSkill(catName,itemName);if(!sk)return;const level=sk.pct>=93?"Expert":"Advanced";const el=document.createElement("div");el.className="toolkit-item";el.style.setProperty("--i",i);el.innerHTML=`<div class="toolkit-ic ${skillClsByCat[catName]}"><i class="${icon}"></i></div><div class="toolkit-name">${sk.name}</div><div class="toolkit-meta"><span class="toolkit-level ${skillClsByCat[catName]}">${level}</span><span class="toolkit-pct">${sk.pct}%</span></div>`;toolkitGrid.appendChild(el)});const horizonList=document.getElementById("horizonList");HORIZON_PICKS.forEach(([catName,itemName,icon],i)=>{const sk=findSkill(catName,itemName);if(!sk)return;const el=document.createElement("div");el.className="horizon-item";el.style.setProperty("--i",i);el.innerHTML=`<div class="horizon-ic ${skillClsByCat[catName]}"><i class="${icon}"></i></div><div class="horizon-body"><div class="horizon-top"><span class="horizon-name">${sk.name}</span><span class="horizon-pct">${sk.pct}%</span></div><div class="horizon-track"><div class="horizon-fill ${skillClsByCat[catName]}" data-pct="${sk.pct}"></div></div></div>`;horizonList.appendChild(el)});function animateHorizons(){document.querySelectorAll(".horizon-fill").forEach(f=>{f.style.width=f.dataset.pct+"%"})}const horizonCardEl=document.querySelector(".horizon-card");if(horizonCardEl){const hio=new IntersectionObserver(es=>{es.forEach(e=>{e.isIntersecting&&(animateHorizons(),hio.unobserve(e.target))})},{threshold:.2});hio.observe(horizonCardEl)}document.querySelectorAll(".toolkit-card,.horizon-card").forEach(c=>revealIO.observe(c));(function(){const statsRow=document.getElementById("skillsStatsRow");if(!statsRow)return;const allItems=SKILLS.flatMap(c=>c.items);const totalSkills=allItems.length;const totalCats=SKILLS.length;const avgPct=Math.round(allItems.reduce((a,[,p])=>a+p,0)/totalSkills);const expertCount=allItems.filter(([,p])=>p>=93).length;const stats=[["fa-solid fa-layer-group",totalCats,"Skill Categories",!0],["fa-solid fa-list-check",totalSkills+"+","Skills Tracked",!1],["fa-solid fa-gauge-high",avgPct+"%","Avg. Proficiency",!1],["fa-solid fa-medal",expertCount,"Expert-Level Skills",!1]];statsRow.innerHTML=stats.map(([ic,num,lbl,clickable])=>`<div class="pf-stat-pill${clickable?" clickable":""}"${clickable?' id="skillCatStatPill" role="button" tabindex="0"':""}><div class="psp-ic"><i class="${ic}"></i></div><div><div class="psp-num">${num}</div><div class="psp-lbl">${lbl}</div></div>${clickable?'<span class="psp-hint">View all <i class="fa-solid fa-arrow-right"></i></span>':""}</div>`).join("");revealIO.observe(statsRow);const catIcons={"Creative Design":"fa-palette","Digital Marketing":"fa-chart-line","Full-Stack Development":"fa-code","AI Automation":"fa-robot"};const skillsDetailOverlay=document.getElementById("skillsDetailOverlay"),skillsDetailBody=document.getElementById("skillsDetailBody"),skillsDetailClose=document.getElementById("skillsDetailClose"),skillsDetailBackdrop=document.getElementById("skillsDetailBackdrop");let skillsDetailLastFocus=null,skillsDetailBuilt=!1;function buildSkillsDetail(){if(skillsDetailBuilt)return;skillsDetailBuilt=!0;skillsDetailBody.innerHTML=SKILLS.map(cat=>{const cls=skillClsByCat[cat.cat]||"c-web",avg=Math.round(cat.items.reduce((a,[,p])=>a+p,0)/cat.items.length),itemsHtml=cat.items.map(([name,pct])=>`<div class="sdb-item"><div class="sdb-item-top"><span class="sdb-item-name">${name}</span><span class="sdb-item-pct">${pct}%</span></div><div class="sdb-item-track"><div class="sdb-item-fill ${cls}" data-pct="${pct}"></div></div></div>`).join("");return `<div class="sdb-cat"><div class="sdb-cat-head"><div class="sdb-cat-ic ${cls}"><i class="fa-solid ${catIcons[cat.cat]||"fa-star"}"></i></div><div class="sdb-cat-title">${cat.cat}</div><span class="sdb-cat-avg">${avg}% avg &middot; ${cat.items.length} skills</span></div><div class="sdb-items">${itemsHtml}</div></div>`}).join("")}function openSkillsDetail(){buildSkillsDetail();skillsDetailLastFocus=document.activeElement;skillsDetailOverlay.classList.add("open");skillsDetailOverlay.setAttribute("aria-hidden","false");document.body.classList.add("skills-detail-lock");document.documentElement.classList.add("skills-detail-lock");requestAnimationFrame(()=>{setTimeout(()=>{skillsDetailBody.querySelectorAll(".sdb-item-fill").forEach(f=>{f.style.width=f.dataset.pct+"%"})},80)});skillsDetailClose.focus()}function closeSkillsDetail(){skillsDetailOverlay.classList.remove("open");skillsDetailOverlay.setAttribute("aria-hidden","true");document.body.classList.remove("skills-detail-lock");document.documentElement.classList.remove("skills-detail-lock");skillsDetailLastFocus&&skillsDetailLastFocus.focus&&skillsDetailLastFocus.focus()}const skillCatStatPill=document.getElementById("skillCatStatPill");if(skillCatStatPill){skillCatStatPill.addEventListener("click",openSkillsDetail);skillCatStatPill.addEventListener("keydown",e=>{("Enter"===e.key||" "===e.key)&&(e.preventDefault(),openSkillsDetail())})}skillsDetailClose&&skillsDetailClose.addEventListener("click",closeSkillsDetail);skillsDetailBackdrop&&skillsDetailBackdrop.addEventListener("click",closeSkillsDetail);document.addEventListener("keydown",e=>{"Escape"===e.key&&skillsDetailOverlay&&skillsDetailOverlay.classList.contains("open")&&closeSkillsDetail()});})();function triggerSkillCard(card){if(card.dataset.skillAnimated)return;card.dataset.skillAnimated="1";card.querySelectorAll(".skill-ring").forEach((e,t)=>{setTimeout(()=>animateRing(e,+e.dataset.target,1100),40*t)}),card.querySelectorAll(".chip-bar-fill").forEach((e,t)=>{setTimeout(()=>e.style.transform="scaleX("+ +e.dataset.pct/100+")",200+60*t)})}const skillRingIO=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(triggerSkillCard(e.target),skillRingIO.unobserve(e.target))})},{threshold:.15,rootMargin:"50px"});document.querySelectorAll(".skill-card").forEach(e=>skillRingIO.observe(e));function healSkillCards(){document.querySelectorAll(".skill-card").forEach(e=>{if(e.dataset.skillAnimated)return;const r=e.getBoundingClientRect();r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0&&(triggerSkillCard(e),skillRingIO.unobserve(e))})}let skillHealTicking=!1,skillHealDone=!1;function requestSkillHeal(){skillHealDone||(healSkillCards(),document.querySelector(".skill-card:not([data-skill-animated])")||(skillHealDone=!0,window.removeEventListener("scroll",onSkillScroll),window.removeEventListener("resize",onSkillScroll),window.removeEventListener("orientationchange",onSkillScroll)))}function onSkillScroll(){skillHealTicking||skillHealDone||(skillHealTicking=!0,requestAnimationFrame(()=>{skillHealTicking=!1,requestSkillHeal()}))}requestSkillHeal(),setTimeout(requestSkillHeal,60),setTimeout(requestSkillHeal,420),window.addEventListener("load",requestSkillHeal),window.addEventListener("scroll",onSkillScroll,{passive:!0}),window.addEventListener("resize",onSkillScroll,{passive:!0}),window.addEventListener("orientationchange",onSkillScroll);const SERVICES=[{icon:"fa-code",title:"Web Development & CMS",cat:"Development",catCls:"svcat-development",icCls:"sv-ic-blue",desc:"Fast, SEO-optimized websites — from hand-coded builds to React frontends and e-commerce stores engineered to convert.",tags:["Website","React","SEO"],detail:"I build websites from A to Z — frontend and backend, custom code or WordPress, plus e-commerce, so your site loads fast, ranks well and works perfectly on every device.",points:["Custom responsive website development","WordPress & CMS builds (Elementor, custom themes)","WooCommerce & e-commerce stores","Business, portfolio & landing pages","Frontend development with HTML, CSS & JavaScript","Backend with Node.js & PHP","Speed & SEO-friendly development","Website maintenance & updates"],process:["Discovery — goals, pages, content & tech fit","Build — design to code, fast and responsive","Deliver — live launch, SEO-ready & handed over"],outcome:"A fast, mobile-ready website that looks premium and ranks on Google.",who:"Businesses, agencies and creators that need a fast, responsive, SEO-ready website — built from scratch, on WordPress, or with a shop attached.",page:{overview:"Your website is your hardest-working salesperson, so it needs to be fast, mobile-perfect and easy for Google to understand. I build end-to-end web development — from custom HTML/CSS/JavaScript and React frontends to WordPress, WooCommerce and PHP backends — every page engineered for speed, responsiveness and search visibility, and delivered with the SEO already built in.",included:["Custom website development (HTML5, CSS3, JavaScript)","Frontend development with React","WordPress development and custom theme building","Elementor and page-builder builds","WooCommerce e-commerce store setup","Business, portfolio, landing and blog pages","Responsive design for every device","Page speed optimization and technical SEO","Contact forms, maps and third-party integrations","SEO-friendly structure, sitemaps and meta setup","Website maintenance and ongoing support"],process:["Discovery — goals, audience, pages and tech fit","Design and development — build, test on all devices","Launch — speed tuning, SEO setup and handover"],benefits:["Google-ready websites designed to rank","Loads fast on mobile and desktop","Built for conversion, not just looks","Fully responsive on every device","Easy to update via a clean dashboard","Everything under one roof with your brand, SEO and marketing"]}},{icon:"fa-robot",title:"AI Automation & n8n",cat:"Automation",catCls:"svcat-development",icCls:"sv-ic-indigo",desc:"Custom n8n workflows and AI agents that link your tools, erase the busywork, and keep your business running while you sleep.",tags:["n8n","AI Agents","Integrations"],detail:"I design and build custom n8n workflows and AI-powered automations that connect your apps, APIs and data sources into one seamless system, so repetitive manual work disappears and your team can focus on what actually matters.",points:["Custom n8n workflow design & build","AI agent & chatbot development","API & third-party app integrations","Business process automation","Prompt engineering & AI system design","Workflow monitoring & optimization"],process:["Discovery — map the manual process & tools involved","Build — design the n8n workflow or AI agent","Deploy — test, automate & hand over with documentation"],outcome:"Hours of manual work replaced by a workflow that just runs.",who:"Businesses and founders drowning in repetitive tasks who want their tools talking to each other and AI doing the busywork.",page:{overview:"Most businesses waste hours a week on manual, repetitive tasks that software could handle. I design and build custom n8n workflows and AI agents that connect your apps, automate data flow between tools, and let AI handle chatbots, replies and decision-making, so your systems run themselves instead of relying on someone remembering to do it.",included:["Custom n8n workflow design and development","AI agent and chatbot development","API and third-party app integrations (CRM, email, sheets, etc.)","Business process automation and optimization","Prompt engineering and AI system design","Zapier and Make.com automation as an alternative or supplement","Workflow monitoring, error handling and maintenance","Documentation so your team can manage it going forward"],process:["Discovery — map the manual process and the tools involved","Build — design and test the n8n workflow or AI agent","Deploy — automate, monitor and hand over with documentation"],benefits:["Hours of manual work saved every week","Fewer human errors in repetitive processes","Tools and apps that finally talk to each other","AI handling responses, sorting and decisions 24/7","A system that scales without hiring more hands","Full documentation so it is never a black box"]}},{icon:"fa-swatchbook",title:"Brand Identity & Logo Design",cat:"Design",catCls:"svcat-design",icCls:"sv-ic-magenta",desc:"Logo suites and complete visual identity systems that make your brand instantly recognizable, everywhere it shows up.",tags:["Logo","Brand Guide","Visual Identity"],detail:"I build identities from the ground up — researching your market and audience, defining a clear brand voice, and designing a flexible system that stays recognizable across every touchpoint, from your logo to your social feed.",points:["Logo suites — primary, secondary & monogram","Brand colour systems & typography pairing","Full brand guidelines & usage rules","Business card & stationery design","Brand voice & messaging notes"],process:["Discovery — goals, audience & competitor research","Design — logo suite, colour, type & system","Handoff — a usable brand book your team can apply"],outcome:"A confident, cohesive identity that makes you look established from day one.",who:"Startups, founders and small businesses building a brand from scratch or refreshing a tired, inconsistent identity.",page:{overview:"A strong brand identity is the foundation of how customers recognise and trust your business. I design complete visual identity systems from logo suites and colour palettes to typography and brand guidelines, so your brand looks consistent and professional across every platform, from your website and social media to packaging and print.",included:["Primary, secondary and monogram logo suites","Brand colour system with hex, RGB and CMYK values","Typography pairing and font guidelines","Full brand guidelines and usage rules","Business card, letterhead and stationery design","Brand voice and messaging notes","Logo animation and motion variants","Organised brand asset kit with source files"],process:["Discovery — understand your goals, audience and competitors","Design — build the logo suite, colour, type and full system","Handoff — deliver a usable brand book your team can apply"],benefits:["Instant brand recognition and trust","A consistent look across every channel","Assets your team can reuse without guesswork","A premium, established appearance from day one","A scalable identity that grows with your business","Stronger customer trust and recall"]}},{icon:"fa-images",title:"Graphic & Social Media Design",cat:"Design",catCls:"svcat-design",icCls:"sv-ic-indigo",desc:"Social content and graphic design engineered to stop the scroll and turn your feed into a growth engine.",tags:["Social Media","Posters","Banners"],detail:"From daily social posts to full campaign visuals, every asset is built on a consistent template system so your brand looks unified at any size — and your feed feels intentional instead of random.",points:["Scroll-stopping social creatives","Posters, banners & ad visuals","Carousel & story templates","Unified visual systems across platforms","Highlight & story covers"],process:["Audit your visuals & define a signature look","Build reusable templates & asset kits","Roll out across platforms with a content rhythm"],outcome:"A feed that stops the scroll, plus a toolkit your team can reuse.",who:"Creators, coaches and brands that need a consistent, scroll-stopping social media presence across Instagram, Facebook and LinkedIn.",page:{overview:"Social media is where most customers meet your brand first, so your visuals need to stop the scroll and stay on-brand. I create scroll-stopping social media graphics, ad creatives and reusable template systems that keep your feed consistent and intentional across Instagram, Facebook, LinkedIn and beyond.",included:["Social media posts, stories and covers","Ad creatives for Meta and Google","Posters, banners and flyer design","Carousel and story templates","Highlight and story covers","Unified visual systems across platforms","Email and newsletter graphics","Branded template kits for your team"],process:["Audit your current visuals and define a signature look","Build reusable templates and asset kits","Roll out across platforms with a steady content rhythm"],benefits:["Higher engagement on social posts","A feed that looks intentional and premium","Reusable templates that save time","Consistent branding at every size","More saves, shares and profile visits","On-brand visuals without hiring help"]}},{icon:"fa-print",title:"Print & Marketing Materials",cat:"Design",catCls:"svcat-design",icCls:"sv-ic-pink",desc:"Business cards, resumes, and book covers, each designed with the precision of a flagship brand.",tags:["Business Card","Resume","Book Cover"],detail:"Print gets the same precision as digital — correct colour profiles, safe margins and press-ready files, so what you approve is exactly what gets printed.",points:["Business cards, resumes & letterheads","Book covers & brochures","Flyers & print-ready artwork","CMYK & bleed-checked final files","Menu, brochure & packaging layout"],process:["Brief & specs — size, stock, finish","Design with print-safe margins & CMYK","Press-ready handoff with bleed & crop marks"],outcome:"Print-ready files that print perfectly the first time.",who:"Authors, businesses and agencies needing flawless, press-ready print and marketing collateral — from business cards to book covers.",page:{overview:"Print still matters for first impressions, from business cards at a meeting to book covers on a shelf. I design print and marketing materials with the same precision as digital, using correct colour profiles, safe margins and press-ready files, so what you approve is exactly what gets printed.",included:["Business cards, resumes and letterheads","Book covers and brochure layout","Flyers and print-ready artwork","CMYK and bleed-checked final files","Menu, brochure and packaging layout","Trade show and signage graphics","Editable source files and print specs","Large-format and signage graphics"],process:["Brief and specs — size, stock and finish","Design with print-safe margins and CMYK","Press-ready handoff with bleed and crop marks"],benefits:["Files that print perfectly the first time","A polished, professional first impression","Correct colours across digital and print","Ready-to-send artwork for any printer","Fewer reprints and costly mistakes","Brand consistency from screen to print"]}},{icon:"fa-pen-nib",title:"Thumbnail & Book Cover Design",cat:"Design",catCls:"svcat-design",icCls:"sv-ic-purple",desc:"Thumbnails and book covers built to win the split-second decision — click, or scroll straight past.",tags:["Thumbnail","Book Cover","Poster"],detail:"First impressions happen in a split second. I design YouTube thumbnails that earn clicks and book covers that sell — bold typography, punchy visuals and composition built for tiny mobile screens.",points:["YouTube thumbnail design","Book cover front & full wrap","Kindle Direct Publishing ready files","Poster & flyer design","Social media ad creatives"],process:["Brief — brand, audience & platform specs","Design — bold composition & readable type","Handoff — JPG, PNG & print-ready files"],outcome:"Visuals that stop the scroll and earn the click.",who:"Creators, authors and businesses that need standout YouTube thumbnails, book covers and promotional graphics.",page:{overview:"Your thumbnail or book cover is often the first thing people see — it needs to earn that split-second decision to click or pick up. I design YouTube thumbnails optimised for mobile feeds and book covers that look professional at thumbnail size, using bold typography, punchy visuals and tested composition.",included:["YouTube thumbnail design (custom per video)","Book cover front, spine and full wrap","Kindle Direct Publishing (KDP) ready files","Poster and flyer design","Social media ad creatives","E-book and print cover versions","Source files for future edits","A/B tested thumbnail variants"],process:["Brief — understand your brand, audience and platform specs","Design — bold composition and readable type","Handoff — deliver JPG, PNG and print-ready files"],benefits:["Higher click-through rates on YouTube","Book covers that sell at first glance","Optimised for mobile and thumbnail sizes","Print-ready files with correct specs","A consistent visual style across platforms","Faster turnaround with template-based workflow"]}},{icon:"fa-magnifying-glass-chart",title:"SEO (Audit, Keywords & Technical)",cat:"Marketing",catCls:"svcat-marketing",icCls:"sv-ic-cyan",desc:"Full SEO audits and keyword strategy that get your business found — and ranked — where people are already searching.",tags:["Audit","Keywords","On-Page"],detail:"A clear, actionable SEO plan — I find what your audience actually searches for, fix the technical issues holding your rankings back, and set up tracking so you can prove it is working.",points:["Technical & on-page SEO audits","Keyword & competitor research","Google Search Console setup","Ranking & organic traffic growth","Internal linking & site structure"],process:["Audit — technical, on-page & backlinks","Research — keywords & search intent","Implement & grow with ongoing tracking"],outcome:"Higher rankings and steady, compounding organic traffic.",who:"Businesses that want to rank on Google and win consistent, free organic traffic through technical and on-page SEO.",page:{overview:"Good SEO is how customers find you on Google without paying for every click. I run full SEO audits, deep keyword research and technical optimisation, fixing the issues that hold your rankings back and building a strategy that grows steady, compounding organic traffic.",included:["Technical and on-page SEO audits","Keyword and competitor research","Google Search Console and analytics setup","Internal linking and site structure","Local SEO and schema markup","Ranking and organic traffic reporting","Core Web Vitals and page-speed optimisation","Monthly SEO reporting and roadmap"],process:["Audit — technical, on-page and backlink review","Research — keywords and search intent","Implement and grow with ongoing tracking"],benefits:["Higher Google rankings for target keywords","Steady, compounding organic traffic","More qualified visitors from search","A clear, measurable SEO roadmap","Lower customer-acquisition cost over time","Topical authority in your niche"]}},{icon:"fa-bullhorn",title:"Digital Marketing & Social Media",cat:"Marketing",catCls:"svcat-marketing",icCls:"sv-ic-blue",desc:"Data-driven ad campaigns and social strategy built around real business outcomes, not vanity metrics.",tags:["Strategy","Meta Ads","Analytics"],detail:"Campaigns tied to real outcomes — from ad creative to reporting, every decision is backed by the numbers that matter to your business, not vanity metrics.",points:["Meta & Google ad campaigns","Content & social strategy","Analytics, reporting & insights","Conversion-focused funnels","A/B testing & creative iteration"],process:["Strategy & precise audience targeting","Creative, launch & continuous testing","Measure, report & optimise"],outcome:"Campaigns that spend smart and actually convert.",who:"Brands ready to run paid ads and grow qualified leads with data-driven Meta and Google marketing.",page:{overview:"Effective marketing is about outcomes, not vanity metrics. I plan and run data-informed campaigns from Meta and Google ads to organic social strategy, backed by analytics and continuous testing, so every decision moves your real business goals forward.",included:["Meta and Google ad campaign management","Content and social media strategy","Analytics, reporting and insights","Conversion-focused funnel building","A/B testing and creative iteration","Audience targeting and retargeting","Landing page and ad-creative testing","Monthly performance dashboards"],process:["Strategy and precise audience targeting","Creative, launch and continuous testing","Measure, report and optimise"],benefits:["Ad spend that works harder","Campaigns tied to real results","Clear reporting you can trust","Steady growth in leads and sales","Better return on ad spend (ROAS)","Predictable, scalable lead generation"]}},{icon:"fa-file-lines",title:"Content Marketing & Competitor Analysis",cat:"Marketing",catCls:"svcat-marketing",icCls:"sv-ic-pink",desc:"Content strategy and competitor research that find the gaps your brand can own — then help you own them.",tags:["Content","Research","Strategy"],detail:"I map the gap between you and your competitors, then build a content plan that claims the topics they are missing — so you own the conversation in your niche.",points:["Content strategy & calendars","Competitor gap analysis","Blog & email content","Performance review & iteration","Repurposing & distribution plan"],process:["Competitor & content gap analysis","Content strategy & calendar","Create, publish & iterate on the data"],outcome:"A content engine that builds lasting authority.",who:"Founders and marketers who want to own their niche with strategic, SEO-driven content and competitor analysis.",page:{overview:"Content is how brands build authority over time, but only if it targets the right gaps. I map the space between you and your competitors, then build a content strategy and calendar that claims the topics they are missing, so you own the conversation in your niche.",included:["Content strategy and editorial calendars","Competitor and content gap analysis","Blog, email and social content","Repurposing and distribution planning","Performance review and iteration","Thought-leadership positioning","SEO blog writing and optimisation","Newsletter and email sequences"],process:["Competitor and content gap analysis","Content strategy and calendar","Create, publish and iterate on the data"],benefits:["Authority that compounds over time","Content that targets real demand","A repeatable content engine","A clearer edge over competitors","Evergreen traffic that keeps growing","A clear edge over competing brands"]}}],svColors=["sv-ic-blue","sv-ic-purple","sv-ic-pink","sv-ic-purple","sv-ic-cyan","sv-ic-cyan","sv-ic-blue","sv-ic-pink"],servicesGrid=document.getElementById("servicesGrid");SERVICES.forEach((e,t)=>{const n=String(t+1).padStart(2,"0"),s=e.tags.map(e=>'<span class="sv-tag">'+e+"</span>").join(""),i=document.createElement("div");i.className="card service-card glow-border tilt spot reveal-scale",i.style.setProperty("--i",t),i.innerHTML=`<div class="spot-glow"></div><div class="sheen"></div><div class="sv-idx">${n}</div><div class="sc-head"><div class="ic-wrap"><div class="ic-ring"></div><div class="ic ${e.icCls}"><i class="fa-solid ${e.icon}"></i></div></div><div class="sv-cat ${e.catCls}"><span class="sv-cat-dot"></span>${e.cat}</div></div><h3>${e.title}</h3><p>${e.desc}</p><div class="sv-tags">${s}</div><button type="button" class="learn service-learn" data-service="${e.title}">View Details <i class="fa-solid fa-arrow-right"></i></button>`,i.addEventListener("click",()=>openService(t)),i.querySelector(".service-learn").addEventListener("click",e=>{e.stopPropagation(),openService(t)}),servicesGrid.appendChild(i),revealIO.observe(i)});(function(){const statsRow=document.getElementById("servicesStatsRow");if(!statsRow)return;const totalServices=SERVICES.length;const totalCats=new Set(SERVICES.map(s=>s.cat)).size;const totalPoints=SERVICES.reduce((a,s)=>a+(s.points?s.points.length:0),0);const stats=[["fa-solid fa-diagram-project",totalCats,"Core Disciplines"],["fa-solid fa-list-check",totalServices,"Services Offered"],["fa-solid fa-bullseye",totalPoints+"+","Specific Capabilities"],["fa-solid fa-user-check","100%","Personally Delivered"]];statsRow.innerHTML=stats.map(([ic,num,lbl])=>`<div class="pf-stat-pill"><div class="psp-ic"><i class="${ic}"></i></div><div><div class="psp-num">${num}</div><div class="psp-lbl">${lbl}</div></div></div>`).join("");revealIO.observe(statsRow)})();const sd=document.getElementById("serviceDetail");sd.parentElement!==document.documentElement&&document.documentElement.appendChild(sd);const sdPanel=sd.querySelector(".sd-panel"),sdContent=document.getElementById("sdContent"),sdBack=document.getElementById("sdBack"),sdClose=document.getElementById("sdClose");let sdLastFocus=null;function openService(e){const t=SERVICES[e],n=t.page||{},s=(n.included||[]).map(e=>'<li><i class="fa-solid fa-circle-check"></i><span>'+e+"</span></li>").join(""),i=(n.process||[]).map(e=>"<li>"+e+"</li>").join(""),o=(n.benefits||[]).map(e=>'<li><i class="fa-solid fa-star"></i><span>'+e+"</span></li>").join(""),a=t.who||"";sdContent.innerHTML='<div class="sd-head"><div class="sd-ico '+t.icCls+'"><i class="fa-solid '+t.icon+'"></i></div><div class="sd-head-text"><div class="sd-cat '+t.catCls+'">'+t.cat+'</div><h2 class="sd-title">'+t.title+'</h2><p class="sd-overview">'+(n.overview||"")+"</p></div></div>"+(a?'<div class="sd-perfect"><div class="sp-ic"><i class="fa-solid fa-bullseye"></i></div><div><div class="sp-label">Perfect for</div><div class="sp-text">'+a+"</div></div></div>":"")+'<div class="sd-grid"><section class="sd-section sd-sec-included"><h3>What is included</h3><ul class="sd-list">'+s+'</ul></section><section class="sd-section sd-sec-steps"><h3>How I work</h3><ol class="sd-steps">'+i+'</ol></section><section class="sd-section sd-sec-benefits"><h3>Benefits you get</h3><ul class="sd-list sd-benefits">'+o+'</ul></section></div><div class="sd-cta"><button type="button" class="btn primary" id="sdSend"><i class="fa-solid fa-paper-plane"></i> Send Message</button><a class="btn ghost" href="mailto:hello.rafidzaman@gmail.com?subject='+encodeURIComponent(t.title)+'"><i class="fa-solid fa-envelope"></i> Email me</a></div>',sdContent.querySelector("#sdSend").addEventListener("click",()=>{closeService();const e=document.getElementById("fSubject");e&&(e.value=t.title,e.dispatchEvent(new Event("input")));const n=document.getElementById("contact"),s=(document.getElementById("navbar")||{offsetHeight:0}).offsetHeight,i=Math.max(0,window.scrollY+n.getBoundingClientRect().top-s-14);window.__fxScrollTo?window.__fxScrollTo(i):window.scrollTo({top:i,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}),setTimeout(()=>{const e=document.getElementById("fName");e&&e.focus({preventScroll:!0})},700)}),sdLastFocus=document.activeElement,sd.classList.add("open"),sd.setAttribute("aria-hidden","false"),sdPanel.scrollTop=0,document.body.classList.add("sd-lock"),document.documentElement.classList.add("sd-lock"),sdBack.focus()}function closeService(){sd.classList.remove("open"),sd.setAttribute("aria-hidden","true"),document.body.classList.remove("sd-lock"),document.documentElement.classList.remove("sd-lock"),sdLastFocus&&sdLastFocus.focus&&sdLastFocus.focus()}sdBack.addEventListener("click",closeService),sdClose&&sdClose.addEventListener("click",closeService),document.addEventListener("keydown",e=>{"Escape"===e.key&&sd.classList.contains("open")&&closeService()});const CATEGORIES=[{key:"web",emoji:"💻",icon:"fa-code",title:"Web Development",desc:"Fast, responsive, SEO-ready websites coded from scratch with modern frontend tech and a clean, conversion-focused structure.",items:["TURIN — Fashion Store","KIK — Sneakers & Shoes Store","LuxeEstate — Real Estate Platform","Harbour & Ember — Restaurant Website"]},{key:"ai",emoji:"🤖",icon:"fa-robot",title:"AI Automation & n8n",desc:"End-to-end AI-powered workflow automation — custom n8n builds, AI agents, and API integrations that eliminate manual work and connect every tool in your stack into one seamless system.",items:["Custom AI Agent Workflow","AI Agent Workflow","API Integration & Webhook Setup","Webhook Automation"]},{key:"branding",emoji:"🎨",icon:"fa-swatchbook",title:"Branding",desc:"A brand that looks like it belongs in the room before it even speaks. Logo suites, colour systems, typography pairing, and a guideline book detailed enough for any vendor to get it right, every time.",items:["Logo Design","Brand Identity","Business Card Design","Stationery Design","Brand Guidelines"]},{key:"graphic",emoji:"🖼️",icon:"fa-images",title:"Graphic Design",desc:"Design that earns the scroll and the share: social posts, YouTube thumbnails, book covers, flyers, and brochures, all built on one template system so a feed or a folder never looks thrown together.",items:["Social Media Design","Book Cover Design","Thumbnail Design","Flyer Design","Brochure Design","Banner Design","Resume Design","Poster Design","Print Design"]},{key:"seo",emoji:"🔍",icon:"fa-magnifying-glass-chart",title:"SEO",desc:"Rankings built on evidence, not guesswork. Full technical and on-page audits, keyword and competitor research, and a Search Console setup that turns invisible pages into ones people actually find.",items:["SEO Audit","Keyword Research","On-Page SEO","Technical SEO","Google Search Console","Google Analytics","Ranking Improvements"]},{key:"marketing",emoji:"📢",icon:"fa-bullhorn",title:"Digital Marketing",desc:"Every bit of ad spend tracked back to a real result. Google and Meta campaigns, content strategy, and reporting, all built around one question: what is the budget actually earning back.",items:["Google Ads","Meta Ads","Social Media Marketing","Content Marketing","Email Marketing","Analytics & Reporting","Campaign Performance"]}],catGrid=document.getElementById("catGrid"),catStage=document.getElementById("pfCategoryStage"),detailStage=document.getElementById("pfDetailStage"),subGrid=document.getElementById("subGrid"),pfDetailEmoji=document.getElementById("pfDetailEmoji"),pfDetailTitle=document.getElementById("pfDetailTitle"),pfDetailCount=document.getElementById("pfDetailCount"),pfDetailDesc=document.getElementById("pfDetailDesc"),pfBackBtn=document.getElementById("pfBackBtn"),pfStatsRow=document.getElementById("pfStatsRow"),pfDetailProgressFill=document.getElementById("pfDetailProgressFill"),pfDetailProgressTxt=document.getElementById("pfDetailProgressTxt");const ITEMS_STORAGE_KEY="rz_portfolio_items_v1";function loadStoredExtraItems(){try{const e=localStorage.getItem(ITEMS_STORAGE_KEY);if(!e)return{};const t=JSON.parse(e);if(t&&"object"==typeof t)return t}catch(e){}return{}}function saveExtraItemsToStorage(){try{return!!localStorage.setItem(ITEMS_STORAGE_KEY,JSON.stringify(extraItems))}catch(e){return!1}}const extraItems=loadStoredExtraItems();Object.keys(extraItems).forEach(function(catKey){const cat=CATEGORIES.find(function(c){return c.key===catKey});if(!cat)return;const titles=extraItems[catKey];Array.isArray(titles)&&titles.forEach(function(title){-1===cat.items.indexOf(title)&&cat.items.push(title)})});let currentCatIdx=0,savedCategoryScrollPos=0,catTransitionTimer=null;const MEDIA_STORAGE_KEY="rz_portfolio_media_v1";function loadStoredMedia(){try{const e=localStorage.getItem(MEDIA_STORAGE_KEY);if(!e)return{};const t=JSON.parse(e);if(t&&"object"==typeof t)return t}catch(e){}return{}}function saveMediaToStorage(){try{return localStorage.setItem(MEDIA_STORAGE_KEY,JSON.stringify(subImages)),!0}catch(e){return!1}}const LINKS_STORAGE_KEY="rz_portfolio_links_v1";function loadStoredLinks(){try{const e=localStorage.getItem(LINKS_STORAGE_KEY);if(!e)return{};const t=JSON.parse(e);if(t&&"object"==typeof t)return t}catch(e){}return{}}function saveLinksToStorage(){try{return localStorage.setItem(LINKS_STORAGE_KEY,JSON.stringify(subLinks)),!0}catch(e){return!1}}const subLinks=Object.assign({"web:0":"https://turin.fashionstore.workers.dev/","web:1":"https://website.kik-shoes.workers.dev/","web:2":"https://real-estate.luxee.workers.dev/","web:3":"https://harbour.emberrestaurant.workers.dev/"},loadStoredLinks());const storedMedia=loadStoredMedia(),subImages={"ai:0":["https://i.ibb.co.com/KzyV233x/custom-ai-agent-workflow-demo-jpg.png"],"ai:1":["https://i.ibb.co.com/dsbRdRr6/Chat-GPT-Image-Aug-19-2026-02-20-11-PM.png"],"ai:2":["https://i.ibb.co.com/5xnCfFv7/api-integration-and-webhook-setup-jpg.png"],"ai:3":["https://i.ibb.co.com/Dgf6R1jk/Chat-GPT-Image-Aug-19-2026-02-17-15-PM.png"],"web:0":["https://s.wordpress.com/mshots/v1/https%3A%2F%2Fturin.fashionstore.workers.dev%2F?w=1400"],"web:1":["https://s.wordpress.com/mshots/v1/https%3A%2F%2Fwebsite.kik-shoes.workers.dev%2F?w=1400"],"web:2":["https://s.wordpress.com/mshots/v1/https%3A%2F%2Freal-estate.luxee.workers.dev%2F?w=1400"],"web:3":["https://s.wordpress.com/mshots/v1/https%3A%2F%2Fharbour.emberrestaurant.workers.dev%2F?w=1400"],"branding:0":["https://wsrv.nl/?url=i.ibb.co.com%2FG3tRCBjg%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FDHN316dD%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F5W9z20sZ%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FtMkKjPcT%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fx8KVf5tr%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FfdZC0vSV%2F6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FVYynLMmh%2F7.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FYFBsYdGH%2F8.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FXfVFVtFn%2F9.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F60GLfwsp%2F10.png&w=1200&q=80&output=webp"],"branding:1":["https://wsrv.nl/?url=i.ibb.co.com%2FGvtyf50k%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FLzwtJkWq%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FV0BtVtLh%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FTD6Kd4zx%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Frf0qh3tJ%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FkV9Q9whQ%2F6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FFq827JQX%2F7.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F9k8ZFFj0%2F8.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FxqtLMncn%2F9.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F50yPtzm%2F10.png&w=1200&q=80&output=webp"],"branding:2":["https://wsrv.nl/?url=i.ibb.co.com%2F4ZvLH6Jm%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FMyFz6PTq%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F4RHhPL4S%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FNd17hH5v%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FKzD53PJQ%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FvxRFvNkM%2F6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FxqC93s0m%2F7.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FZ6Bzh5sz%2F8.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F0pMqVVMf%2F9.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FSXDhp1vq%2F10.png&w=1200&q=80&output=webp"],"branding:3":["https://wsrv.nl/?url=i.ibb.co.com%2F8FVwQYK%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FJbqDpvs%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FZpwxV85p%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F2Ygr6XDc%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FTqgQd4TB%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FwFv6vc4X%2F6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FMDWPsNGz%2F7.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F359TRCJb%2F8.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F39y3k09x%2F9.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FCKgkTk6V%2F10.png&w=1200&q=80&output=webp"],"branding:4":["https://wsrv.nl/?url=i.ibb.co.com%2FVYx2bdrc%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fs96LjR5H%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FG3CWS7X4%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fvbwbt7h%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FhJR6K90T%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FSD5YnZWC%2F6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FzVmgH7zB%2F7.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fh1HG34qV%2F8.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F21Rh77VH%2F9.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FZ6GqF5Rv%2F10.png&w=1200&q=80&output=webp"],"graphic:0":["https://wsrv.nl/?url=i.ibb.co.com%2FDf6wLmYQ%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FVc2bmCy6%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FzWPnBtpr%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FKx9ByvR5%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FtTJgN71c%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fspjgd8Bs%2F6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fd4MY3Fzb%2F7.png&w=1200&q=80&output=webp"],"graphic:1":["https://wsrv.nl/?url=i.ibb.co.com%2FFPQZh11%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FXZfjDhNM%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fm5zGxyD5%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fv455v24H%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FG4XGVhhf%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FxSY7HW0k%2F6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FnNdNpMFN%2F7.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F7Ts9BSp%2F8.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fjv4zRbxW%2F9.png&w=1200&q=80&output=webp"],"graphic:2":["https://wsrv.nl/?url=i.ibb.co.com%2F2YK6xXQg%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FJj81Z2Xt%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FVcK8v7vC%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FRRcXLBj%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F5hNDsBC6%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FS7GDdKpc%2F6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F7ttH8L4c%2F7.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fd4mq0zPx%2F8.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Ftwz3qY9k%2F9.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FbMvvS4R5%2F10.png&w=1200&q=80&output=webp"],"graphic:3":["https://wsrv.nl/?url=i.ibb.co.com%2FRThBgRFL%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FNny2cpSt%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FrKbbSvg6%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FdsNHHP3r%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fy967wDk%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F21FpzvY6%2F6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FWWsbX5qF%2F7.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FcSBwdMJz%2F8.png&w=1200&q=80&output=webp"],"graphic:4":["https://wsrv.nl/?url=i.ibb.co.com%2FgMw6PgDP%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FG4W1XGH3%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FLDjnhRTv%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F0pLYj9LH%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FPZnRhfrf%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F7tF2Gnfd%2F6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FtTkmYbV6%2F7.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FQ3w2n25y%2F8.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FPv6RHgWH%2F9.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FjPPVSrxB%2F10.png&w=1200&q=80&output=webp"],"graphic:5":["https://wsrv.nl/?url=i.ibb.co.com%2FGvs0rrcV%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fn8jKVVV4%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Frn88FW3%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FPGVwbyV0%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FrKmMkhcG%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FrKxGGznt%2F6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FKcy874p6%2F7.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FVpSV4T2h%2F8.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F4wLB3j0W%2F9.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FwhfRpC63%2F10.png&w=1200&q=80&output=webp"],"graphic:6":["https://wsrv.nl/?url=i.ibb.co.com%2Fd4JTbnxq%2FUntitled-1200-x-900-px-4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F0jdHPz5z%2FUntitled-1200-x-900-px-5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F1tcX3jp7%2FUntitled-1200-x-900-px-6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FvxNqq9Sb%2FUntitled-1200-x-900-px-7.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FbjPMYPSz%2FUntitled-1200-x-900-px-8.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FcSVMsg3W%2FUntitled-1200-x-900-px-9.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FWpyg4wdc%2FUntitled-1200-x-900-px-12.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FPsNVKfyD%2FUntitled-1200-x-900-px-13.png&w=1200&q=80&output=webp"],"graphic:7":["https://wsrv.nl/?url=i.ibb.co.com%2FqYgysZjJ%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F4ZrsNDJJ%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FTBMJvdvV%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FXx01RhLn%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F6RYw684F%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fzh64PzvK%2F6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FqFmYN2pw%2F7.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FGvzS6tKy%2F8.png&w=1200&q=80&output=webp"],"graphic:8":["https://wsrv.nl/?url=i.ibb.co.com%2FYT2nVR0K%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FwZcHSTM0%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FZpfzn1Sd%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fyct7c2PD%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F5h3rFSRJ%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FBHL9H6bs%2F6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F4njSXwCZ%2F7.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FcSgNY5mH%2F8.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F0RH5PkB0%2F9.png&w=1200&q=80&output=webp"],"seo:0":["https://wsrv.nl/?url=i.ibb.co.com%2FGfdcRr4c%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F5xwQqRDP%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FspfX198n%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F6J7xwmkk%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FWXQ3hTQ%2F5.png&w=1200&q=80&output=webp"],"seo:1":["https://wsrv.nl/?url=i.ibb.co.com%2F3yZvgXkN%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FBHxKwjpp%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FhJcZPZfm%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FB2hjrjv6%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FTDwRKRQx%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FnNDZm5S5%2F6.png&w=1200&q=80&output=webp"],"seo:2":["https://wsrv.nl/?url=i.ibb.co.com%2FN2dHRxS3%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FMD8nY6LC%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FccYrQwLZ%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FZ1TWCsmb%2F4.png&w=1200&q=80&output=webp"],"seo:3":["https://wsrv.nl/?url=i.ibb.co.com%2FB2PRcYVr%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F99pB7drM%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FQFfs4MDs%2F3.png&w=1200&q=80&output=webp"],"seo:4":["https://wsrv.nl/?url=i.ibb.co.com%2FQ7xzqTzT%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F7dzmBjpc%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F5W3GHR2Z%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FvvV8VDPM%2F4.png&w=1200&q=80&output=webp"],"seo:5":["https://wsrv.nl/?url=i.ibb.co.com%2FyFrk5J8b%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FzTvF65DQ%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F0VJLcPXG%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FRTzJxjvd%2F4.png&w=1200&q=80&output=webp"],"seo:6":["https://wsrv.nl/?url=i.ibb.co.com%2FY7HwHfcq%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FDPySntYT%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FPGTBZj4W%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FcSbmCtn0%2F4.png&w=1200&q=80&output=webp"],"marketing:0":["https://wsrv.nl/?url=i.ibb.co.com%2FZ6RWQqDv%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FYF42vMtR%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FmkYRpPy%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fv4Z5rdtK%2F5.png&w=1200&q=80&output=webp"],"marketing:1":["https://wsrv.nl/?url=i.ibb.co.com%2Fn8R2nD2Q%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FKcKtY6g3%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fkskvk1Z5%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FSw0SzH9g%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FFL5JXxMV%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FC5JD9Tks%2F6.png&w=1200&q=80&output=webp"],"marketing:2":["https://wsrv.nl/?url=i.ibb.co.com%2FZzTJbsQp%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F2YkJ7YYz%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fk2WCxzP4%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F7xSnkzT7%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FGfzjTLwB%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FJW6kdhJB%2F6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FB2ShgND2%2F7.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FNnQtrFT4%2F8.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FDgTKTK4L%2F9.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FjvrTSDG9%2F10.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FwhQ6v4FK%2F11.png&w=1200&q=80&output=webp"],"marketing:3":["https://wsrv.nl/?url=i.ibb.co.com%2Fym3ZCpzM%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FHp4mCNj8%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FgLBBqxWg%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FDf3bxtDX%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2Fb5MgGWBH%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FyKGF3Gt%2F6.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FTd5YnRC%2F7.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FvxJP7yym%2F8.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FvvH84zZH%2F9.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FBHcXy676%2F10.png&w=1200&q=80&output=webp"],"marketing:4":["https://wsrv.nl/?url=i.ibb.co.com%2FLdpwwQDM%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FG42rM1Nw%2F2.jpg&w=1200&q=80&output=webp"],"marketing:5":["https://wsrv.nl/?url=i.ibb.co.com%2FJWs0RTFt%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FfYHFJCLZ%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FDDjFyRDx%2F3.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F4gF2Kbvn%2F4.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FBKdyRqGT%2F5.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2F39f16j9Q%2F6.png&w=1200&q=80&output=webp"],"marketing:6":["https://wsrv.nl/?url=i.ibb.co.com%2F27WpFsK6%2F1.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FJFWrgpyS%2F2.png&w=1200&q=80&output=webp","https://wsrv.nl/?url=i.ibb.co.com%2FgZXvpqj8%2F3.png&w=1200&q=80&output=webp"]};const RECENCY_STORAGE_KEY="rz_portfolio_recency_v1";function loadStoredRecency(){try{const e=localStorage.getItem(RECENCY_STORAGE_KEY);if(!e)return{};const t=JSON.parse(e);if(t&&"object"==typeof t)return t}catch(e){}return{}}function saveRecencyToStorage(){try{return!!localStorage.setItem(RECENCY_STORAGE_KEY,JSON.stringify(recencyOrder))}catch(e){return!1}}const recencyOrder=loadStoredRecency();function getCategoryOrder(catKey){const cat=CATEGORIES.find(c=>c.key===catKey);if(!cat)return[];const defaultOrder=cat.items.map((e,i)=>i);const stored=recencyOrder[catKey];if(!Array.isArray(stored)||!stored.length)return defaultOrder;const validStored=stored.filter(i=>i>=0&&i<cat.items.length);const missing=defaultOrder.filter(i=>-1===validStored.indexOf(i));return validStored.concat(missing)}function bumpToFront(catKey,idx){const order=getCategoryOrder(catKey).filter(i=>i!==idx);order.unshift(idx),recencyOrder[catKey]=order,saveRecencyToStorage()}function isDirectVideoUrl(u){return "string"==typeof u && /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(u)}function optimizeImg(u,w,q){if("string"!=typeof u||!u)return u;if(/wsrv\.nl|s\.wordpress\.com|ytimg\.com|img\.youtube\.com|vumbnail\.com|data:/.test(u))return u;return"https://wsrv.nl/?url="+encodeURIComponent(u.replace(/^https?:\/\//,""))+"&w="+(w||480)+"&q="+(q||75)+"&output=webp"}function getThumbSrc(e){if("string"==typeof e&&0===e.indexOf("yt::")){return"https://img.youtube.com/vi/"+e.slice(4).split(/[?&]/)[0]+"/mqdefault.jpg"}if("string"==typeof e&&0===e.indexOf("vi::")){return"https://vumbnail.com/"+e.slice(4).split(/[?&]/)[0]+".jpg"}if(isDirectVideoUrl(e)){var __m=e.match(/^(https?:\/\/res\.cloudinary\.com\/[^\/]+\/video\/upload\/)(.+)\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i);if(__m){return __m[1]+"so_0/"+__m[2]+".jpg"}return e}return e}function attachVideoPreview(el,src){if(!el||!window.matchMedia("(hover:hover) and (pointer:fine)").matches)return;let vid=null,timer=null,hoverActive=!1;function ensureVideo(){if(vid)return vid;vid=document.createElement("video"),vid.src=src,vid.muted=!0,vid.loop=!0,vid.playsInline=!0,vid.preload="auto",vid.className="sub-thumb-preview-video";const posterImg=el.querySelector("img");posterImg&&posterImg.getAttribute("src")&&(vid.poster=posterImg.getAttribute("src")),vid.addEventListener("playing",()=>{hoverActive&&el.classList.add("previewing")}),el.appendChild(vid)}function playFromStart(){if(!vid)return;const start=()=>{try{vid.currentTime=0}catch(e){}vid.play().catch(()=>{})};vid.readyState>=1?start():vid.addEventListener("loadedmetadata",start,{once:!0})}el.addEventListener("mouseenter",()=>{hoverActive=!0,clearTimeout(timer),timer=setTimeout(()=>{ensureVideo(),vid.paused?playFromStart():(()=>{try{vid.currentTime=0}catch(e){}})(),vid.readyState>=3&&el.classList.add("previewing")},160)}),el.addEventListener("mouseleave",()=>{hoverActive=!1,clearTimeout(timer),el.classList.remove("previewing"),vid&&(vid.pause(),vid.readyState>=1&&(vid.currentTime=0))})}window.__thumbErr=function(img){var rest=img.getAttribute("data-fallback");if(rest){var parts=rest.split("|||"),next=parts.shift();img.setAttribute("data-fallback",parts.join("|||"));img.src=next;return}img.onerror=null;img.removeAttribute("src");var thumb=img.closest(".sub-thumb");thumb&&thumb.classList.remove("has-img")};function renderSubGrid(e){const t=CATEGORIES[e];subGrid.innerHTML="";const frag=document.createDocumentFragment(),cards=[];const __subOrder=("function"==typeof getCategoryOrder?getCategoryOrder(t.key):t.items.map((x,i)=>i));__subOrder.forEach((n,__pos)=>{const e=t.items[n];const latest=0===__pos?1:0,s=t.key+":"+n,i=subImages[s],o=Array.isArray(i)?i:i?[i]:[],linkUrl=subLinks[s]||"",__mshot=linkUrl?"https://s.wordpress.com/mshots/v1/"+encodeURIComponent(linkUrl)+"?w=1400":"",__primary=o.length?getThumbSrc(o[0]):"",__optPrimary=__primary?optimizeImg(__primary,latest?1400:440,70):"",__chain=[],a=(()=>{if(__optPrimary)__chain.push(__optPrimary);if(__primary&&__primary!==__optPrimary)__chain.push(__primary);if(__mshot&&-1===__chain.indexOf(__mshot))__chain.push(__mshot);return __chain.length?__chain.shift():""})(),__fallbackAttr=__chain.join("|||"),visitBtn=linkUrl?'<a class="sub-visit-btn" href="'+linkUrl+'" target="_blank" rel="noopener" title="Visit live website"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Live Site</a>':"",r=o.length>1?`<div class="sub-cat-chip" style="left:auto;right:14px;"><i class="fa-solid fa-layer-group" style="font-size:9px;margin-right:4px;"></i>${o.length}</div>`:"",vid=o.length>0&&"string"==typeof o[0]&&(isDirectVideoUrl(o[0])||0===o[0].indexOf("yt::")||0===o[0].indexOf("vi::")),playBtn=vid?'<div class="sub-play-btn" aria-hidden="true"><i class="fa-solid fa-play"></i></div>':"",c=document.createElement("div");c.className="sub-card spot reveal-scale"+(latest?" latest":""),c.style.setProperty("--i",__pos),c.innerHTML=`\n      <div class="spot-glow"></div><div class="sheen"></div>\n      <div class="sub-thumb${a?" has-img":""}${vid?" is-video":""}" data-key="${s}">\n        <div class="sub-cat-chip"><i class="fa-solid ${t.icon}"></i></div>\n        ${latest?'<span class="sub-live-badge"><i class="fa-solid fa-circle"></i> Previous Project</span>':""}\n        ${r}\n        ${playBtn}\n        ${visitBtn}\n        <img alt="${e}" loading="${n<5?'eager':'lazy'}" ${n<3?'fetchpriority="high"':'fetchpriority="low"'} decoding="async" ${a?'src="'+a+'"':""} ${__fallbackAttr?'data-fallback="'+__fallbackAttr.replace(/"/g,'&quot;')+'"':""} onerror="window.__thumbErr(this)">\n        <div class="sub-thumb-scrim"></div>\n        <div class="sub-view-hint"><span>View Project</span></div>\n        <div class="sph"><i class="fa-solid ${t.icon}"></i><span>Click camera to<br>add photo or video</span></div>\n      </div>\n      <div class="sub-body">\n        ${latest?'<span class="slive-tag"><i class="fa-solid fa-circle"></i> Previous Project</span>':""}<span class="sname">${e}</span>\n        <i class="fa-solid fa-arrow-up-right-from-square sarrow"></i>\n      </div>`,frag.appendChild(c),vid&&isDirectVideoUrl(o[0])&&attachVideoPreview(c.querySelector(".sub-thumb"),o[0]),cards.push(c)}),subGrid.appendChild(frag),cards.forEach(e=>revealIO.observe(e))}function forceRevealAll(){document.querySelectorAll(".reveal,.reveal-left,.reveal-scale,.reveal-up").forEach(e=>{e.classList.contains("in")||(e.classList.add("in"),revealIO.unobserve(e))}),document.querySelectorAll(".section-sub,.word-reveal,.img-reveal").forEach(e=>e.classList.add("in"))}function openCategory(e,t){t=t||{},catTransitionTimer&&(clearTimeout(catTransitionTimer),catTransitionTimer=null),currentCatIdx=e,document.body.classList.contains("project-view")||(savedCategoryScrollPos=window.scrollY);const n=CATEGORIES[e];detailStage.dataset.cat=n.key,pfDetailEmoji.textContent=n.emoji,pfDetailTitle.textContent=n.title,pfDetailCount.textContent=n.items.length+" services in this category",pfDetailDesc.textContent=n.desc,renderSubGrid(e),setTimeout(function(){"function"==typeof prefetchCategoryFull&&prefetchCategoryFull(n.key)},1200);const s=Math.round((e+1)/CATEGORIES.length*100);pfDetailProgressTxt.textContent=e+1+" of "+CATEGORIES.length+" categories",pfDetailProgressFill.style.transform="scaleX(0)",requestAnimationFrame(()=>{pfDetailProgressFill.style.transform="scaleX("+s/100+")"}),forceRevealAll(),document.body.classList.add("project-view"),catStage.classList.remove("hidden"),detailStage.classList.remove("leaving"),catStage.classList.add("leaving"),catTransitionTimer=setTimeout(()=>{catTransitionTimer=null,catStage.classList.add("hidden"),catStage.classList.remove("leaving"),detailStage.classList.remove("hidden"),requestAnimationFrame(()=>detailStage.classList.remove("leaving")),window.scrollTo({top:0,behavior:"instant"in window?"instant":"auto"}),window.__fxSyncScroll&&window.__fxSyncScroll(0),window.__fxLockScroll&&window.__fxLockScroll(600),window.__healReveals&&window.__healReveals()},320),t.silent||updateURL(n.key,void 0,!t.replace)}function closeCategory(e){e=e||{},catTransitionTimer&&(clearTimeout(catTransitionTimer),catTransitionTimer=null),catStage.classList.remove("hidden"),detailStage.classList.remove("hidden"),catStage.classList.remove("leaving"),detailStage.classList.add("leaving");const t=document.getElementById("pfFloatBack");t&&t.classList.remove("show");catTransitionTimer=setTimeout(()=>{catTransitionTimer=null,detailStage.classList.add("hidden"),detailStage.classList.remove("leaving"),document.body.classList.remove("project-view"),requestAnimationFrame(()=>{const e=document.getElementById("portfolio"),o=e?e.offsetTop-80:0,n=savedCategoryScrollPos>o?savedCategoryScrollPos:o;window.scrollTo({top:n,behavior:"instant"}),window.__fxSyncScroll&&window.__fxSyncScroll(n),window.__fxLockScroll&&window.__fxLockScroll(600),window.__healReveals&&window.__healReveals()})},320),e.silent||updateURL(void 0,void 0,!e.replace)}window.__healReveals=function(){document.querySelectorAll(".reveal:not(.in),.reveal-left:not(.in),.reveal-scale:not(.in)").forEach(function(e){var r=e.getBoundingClientRect();r.width>0&&r.height>0&&r.top<innerHeight&&r.bottom>0&&e.classList.add("in")})},[0,60,300,800,1600,3200].forEach(function(t){setTimeout(window.__healReveals,t)}),window.addEventListener("load",function(){window.__healReveals(),setTimeout(window.__healReveals,300)}),document.fonts&&document.fonts.ready&&document.fonts.ready.then(function(){window.__healReveals()}),window.addEventListener("popstate",function(){setTimeout(window.__healReveals,60),setTimeout(window.__healReveals,420)}),window.addEventListener("pageshow",function(){setTimeout(window.__healReveals,60)});function goToSection(e){if(e)if(document.body.classList.contains("project-view"))closeCategory(),"#portfolio"!==e&&setTimeout(()=>{window.fxScrollToId&&window.fxScrollToId(e)},420);else if(window.fxScrollToId)window.fxScrollToId(e);else{const t=document.querySelector(e);t&&t.scrollIntoView({behavior:"smooth"})}}Object.keys(storedMedia).forEach(e=>{const t=storedMedia[e],saved=Array.isArray(t)?t:t&&"string"==typeof t?[t]:[];if(!saved.length)return;const base=Array.isArray(subImages[e])?subImages[e]:subImages[e]?[subImages[e]]:[],merged=base.slice();saved.forEach(u=>{merged.indexOf(u)===-1&&merged.push(u)});subImages[e]=merged});const __prefetched=new Set();function prefetchImg(u,pri){if(!u||"string"!=typeof u||0===u.indexOf("yt::")||0===u.indexOf("vi::")||__prefetched.has(u))return;__prefetched.add(u);const im=new Image;im.decoding="async",im.fetchPriority=pri||"low",im.src=u}const __ric=window.requestIdleCallback||function(cb){return setTimeout(cb,16)};function prefetchThumbsAll(){let e=0;Object.keys(subImages).forEach(t=>{const n=subImages[t],s=Array.isArray(n)?n:n?[n]:[];s.length&&(e++,__ric(()=>prefetchImg(optimizeImg(getThumbSrc(s[0]),440,70)),{timeout:50+8*e}))})}function prefetchCategoryFull(e){const t=CATEGORIES.find(t=>t.key===e);if(!t)return;const __nc=navigator.connection||navigator.mozConnection||navigator.webkitConnection;if(__nc&&(__nc.saveData||/2g/i.test(__nc.effectiveType||"")))return;t.items.forEach((n,s)=>{const i=e+":"+s,o=subImages[i],a=Array.isArray(o)?o:o?[o]:[];a.forEach((e,t)=>{if(t>0)return;/* fetch every project's hero image right away (still
        low fetchPriority so it never competes with what's on
        screen) instead of the old growing multi-second delay -
        that's what made opening a project feel slow. */
      prefetchImg(optimizeImg(getThumbSrc(e),880,80))})})}function prefetchAllCategoriesFull(){CATEGORIES.forEach((e,t)=>{__ric(()=>prefetchCategoryFull(e.key),{timeout:300+120*t})})}window.addEventListener("load",()=>{const nc=navigator.connection||navigator.mozConnection||navigator.webkitConnection;if(nc&&(nc.saveData||/^(slow-)?2g$/i.test(nc.effectiveType||"")))return;setTimeout(()=>{__ric(prefetchThumbsAll,{timeout:3000})},2500)}),function(){const e=CATEGORIES.reduce((e,t)=>e+t.items.length,0);[{ic:"fa-layer-group",num:CATEGORIES.length,lbl:"Categories"},{ic:"fa-briefcase",num:e,lbl:"Total Services"},{ic:"fa-swatchbook",num:120,lbl:"Projects Delivered"},{ic:"fa-circle-check",num:"Open",lbl:"Availability"}].forEach((e,t)=>{const n=document.createElement("div");n.className="pf-stat-pill spot reveal-scale",n.style.setProperty("--i",t),n.innerHTML=`<div class="spot-glow"></div><div class="psp-ic"><i class="fa-solid ${e.ic}"></i></div>\n      <div><div class="psp-num">${e.num}</div><div class="psp-lbl">${e.lbl}</div></div>`,pfStatsRow.appendChild(n),revealIO.observe(n)})}(),CATEGORIES.forEach((e,t)=>{const n=e.items.slice(0,3).map(e=>`<span>${e}</span>`).join(""),s=document.createElement("div");s.className="cat-card spot reveal-scale",s.style.setProperty("--i",t),s.dataset.cat=e.key,s.innerHTML=`\n    <div class="spot-glow"></div>\n    <div class="cat-index-num">0${t+1}</div>\n    <div class="cat-top">\n      <div class="cat-emoji-badge"><span class="cat-emoji-glyph">${e.emoji}</span></div>\n      <div class="cat-count-pill"><i class="fa-solid fa-layer-group" style="font-size:9px;margin-right:4px;"></i>${e.items.length} services</div>\n    </div>\n    <h3>${e.title}</h3>\n    <div class="cat-sub-preview">${e.desc}</div>\n    <div class="cat-tag-row">${n}${e.items.length>3?"<span>+"+(e.items.length-3)+" more</span>":""}</div>\n    <div class="cat-explore">View Project <i class="fa-solid fa-arrow-right"></i></div>\n    <div class="cat-progress-row">${Array.from({length:e.items.length},()=>"<span></span>").join("")}</div>`,s.addEventListener("click",()=>openCategory(t)),catGrid.appendChild(s),revealIO.observe(s)}),pfBackBtn.addEventListener("click",()=>closeCategory()),window.goToSection=goToSection,document.addEventListener("keydown",e=>{const t=document.getElementById("lightbox");"Escape"!==e.key||detailStage.classList.contains("hidden")||t&&t.classList.contains("open")||closeCategory()});const pfFloatBack=document.getElementById("pfFloatBack"),pfDetailHead=document.querySelector(".pf-detail-head");function updatePfFloatBack(){if(!pfFloatBack||detailStage.classList.contains("hidden")||!pfDetailHead)return void(pfFloatBack&&pfFloatBack.classList.remove("show"));const e=pfDetailHead.getBoundingClientRect();pfFloatBack.classList.toggle("show",e.bottom<60)}pfFloatBack&&(window.addEventListener("scroll",updatePfFloatBack,{passive:!0}),pfFloatBack.addEventListener("click",closeCategory));const pfSubInput=null;let activeSubKey=null;!function(){const e=document.getElementById("mmOverlay"),t=document.getElementById("mmBackdrop"),n=document.getElementById("mmCloseBtn"),s=document.getElementById("mmCancelBtn"),i=document.getElementById("mmSaveBtn"),o=document.getElementById("mmCopyCodeBtn"),a=document.getElementById("mmEmoji"),r=document.getElementById("mmTitle"),c=document.getElementById("mmGrid"),d=document.getElementById("mmEmpty"),l=document.getElementById("mmCount"),p=document.getElementById("mmAddPhotoBtn"),m=document.getElementById("mmAddVideoBtn"),g=document.getElementById("mmPhotoRow"),u=document.getElementById("mmPhotoUrlInput"),h=document.getElementById("mmPhotoConfirmBtn"),v=document.getElementById("mmPhotoCancelBtn"),f=document.getElementById("mmVideoRow"),y=document.getElementById("mmVideoUrlInput"),w=document.getElementById("mmVideoConfirmBtn"),b=document.getElementById("mmVideoCancelBtn"),linkInput=document.getElementById("mmLinkInput");let E=null,k=[];function L(e){e.style.borderColor="#ef4444",setTimeout(()=>{e.style.borderColor=""},1200)}let C=-1;function S(){c.innerHTML="";const e=k.length>0;c.classList.toggle("hidden",!e),d.classList.toggle("show",!e),l.textContent=k.length+(1===k.length?" item":" items"),k.forEach((e,t)=>{const n="string"==typeof e&&(0===e.indexOf("yt::")||0===e.indexOf("vi::")||isDirectVideoUrl(e)),s=optimizeImg(getThumbSrc(e),200,65),i=document.createElement("div");i.className="mm-tile",i.draggable=!0,i.dataset.idx=t,i.innerHTML=`<img src="${s}" alt="Media ${t+1}" loading="lazy" decoding="async">\n        ${n?'<div class="mm-tile-badge"><i class="fa-solid fa-play"></i> Video</div>':""}\n        <button type="button" class="mm-tile-remove" data-idx="${t}" aria-label="Remove"><i class="fa-solid fa-xmark"></i></button>`,i.addEventListener("dragstart",e=>{C=t,i.classList.add("mm-tile-dragging"),e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain","")}),i.addEventListener("dragend",()=>{i.classList.remove("mm-tile-dragging"),c.classList.remove("mm-grid-drag-over"),C=-1}),c.appendChild(i)})}function x(){e.classList.remove("open"),e.setAttribute("aria-hidden","true"),E=null}function I(){const e=u.value.trim();var t;(t=e)&&(t=t.trim(),/^https?:\/\/\S+\.(png|jpe?g|webp|gif|avif|svg)(\?\S*)?$/i.test(t)||/^https?:\/\/\S+/i.test(t))?(k.push(e),u.value="",g.classList.add("hidden"),S()):L(u)}function B(){const e=y.value,t=function(e){if(!e)return null;if(e=e.trim(),/^[\w-]{11}$/.test(e))return e;const t=[/[?&]v=([\w-]{11})/,/youtu\.be\/([\w-]{11})/,/embed\/([\w-]{11})/,/shorts\/([\w-]{11})/];for(const n of t){const t=e.match(n);if(t)return t[1]}return null}(e);if(t)return k.push("yt::"+t),y.value="",f.classList.add("hidden"),void S();const n=function(e){if(!e)return null;if(e=e.trim(),/^\d{6}$/.test(e))return e;const t=[/vimeo\.com\/(?:video\/)?(\d{6})/,/player\.vimeo\.com\/video\/(\d{6})/];for(const n of t){const t=e.match(n);if(t)return t[1]}return null}(e);if(n)return k.push("vi::"+n),y.value="",f.classList.add("hidden"),void S();if(isDirectVideoUrl(e))return k.push(e),y.value="",f.classList.add("hidden"),void S();L(y)}c.addEventListener("dragover",e=>{e.preventDefault(),e.dataTransfer.dropEffect="move",c.classList.add("mm-grid-drag-over")}),c.addEventListener("dragleave",()=>{c.classList.remove("mm-grid-drag-over")}),c.addEventListener("drop",e=>{if(e.preventDefault(),c.classList.remove("mm-grid-drag-over"),-1===C)return;const t=e.target.closest(".mm-tile"),n=t?+t.dataset.idx:k.length-1;if(n===C)return;const[s]=k.splice(C,1);k.splice(n,0,s),C=-1,S()}),window.openManageModal=function(t){const[n,s]=t.split(":"),o=CATEGORIES.find(e=>e.key===n);if(!o)return;const c=o.items[+s];E=t;const d=subImages[t];k=Array.isArray(d)?d.slice():d?[d]:[],a.textContent=o.emoji,r.textContent=c,g.classList.add("hidden"),u.value="",f.classList.add("hidden"),y.value="",linkInput.value=subLinks[t]||"",i.classList.remove("saved"),i.innerHTML='<i class="fa-solid fa-floppy-disk"></i> Save',S(),e.classList.add("open"),e.setAttribute("aria-hidden","false")},n.addEventListener("click",x),t.addEventListener("click",x),s.addEventListener("click",x),document.addEventListener("keydown",t=>{"Escape"===t.key&&e.classList.contains("open")&&x()}),c.addEventListener("click",e=>{const t=e.target.closest(".mm-tile-remove");if(!t)return;const n=+t.dataset.idx;k.splice(n,1),S()}),p.addEventListener("click",()=>{f.classList.add("hidden"),g.classList.remove("hidden"),u.focus()}),v.addEventListener("click",()=>{g.classList.add("hidden"),u.value=""}),h.addEventListener("click",I),u.addEventListener("keydown",e=>{"Enter"===e.key&&(e.preventDefault(),I())}),m.addEventListener("click",()=>{g.classList.add("hidden"),f.classList.remove("hidden"),y.focus()}),b.addEventListener("click",()=>{f.classList.add("hidden"),y.value=""}),w.addEventListener("click",B),y.addEventListener("keydown",e=>{"Enter"===e.key&&(e.preventDefault(),B())}),i.addEventListener("click",()=>{if(!E)return;const linkVal=linkInput.value.trim();if(0===k.length&&linkVal){k.push("https://s.wordpress.com/mshots/v1/"+encodeURIComponent(linkVal)+"?w=1400")}subImages[E]=k.slice();linkVal?subLinks[E]=linkVal:delete subLinks[E];const[__bumpCat,__bumpIdxRaw]=E.split(":"),__bumpIdx=parseInt(__bumpIdxRaw,10);"function"==typeof bumpToFront&&!isNaN(__bumpIdx)&&k.length>0&&bumpToFront(__bumpCat,__bumpIdx);const e=saveMediaToStorage(),e2=saveLinksToStorage();renderSubGrid(currentCatIdx),window.__lwRefreshCategory&&window.__lwRefreshCategory(E.split(":")[0]),window.__showToast&&window.__showToast(e&&e2?"Saved for preview in this browser!":"Saved for this session (storage unavailable)"),i.classList.add("saved"),i.innerHTML='<i class="fa-solid fa-check"></i> Saved',setTimeout(x,650)}),o.addEventListener("click",async()=>{const e=`const subImages = {\n${Object.keys(subImages).map(e=>{const t=subImages[e];return`  '${e}': [${(Array.isArray(t)?t:[t]).map(e=>`'${String(e).replace(/'/g,"\\'")}'`).join(", ")}]`}).join(",\n")}\n};\n\nconst subLinks = {\n${Object.keys(subLinks).map(e=>`  '${e}': '${String(subLinks[e]).replace(/'/g,"\\'")}'`).join(",\n")}\n};`;try{await navigator.clipboard.writeText(e),window.__showToast&&window.__showToast('Code copied! Paste it over "const subImages" and "const subLinks" in index.html and re-upload.')}catch(t){prompt('Copy this code and paste it over "const subImages = {...}" and "const subLinks = {...}" in your index.html file:',e)}})}();let scrollPos=0;function lockScroll(){scrollPos=window.scrollY,document.body.style.position="fixed",document.body.style.top="-"+scrollPos+"px",document.body.style.left="0",document.body.style.right="0",document.body.style.overflow="hidden"}function unlockScroll(){document.body.style.position="",document.body.style.top="",document.body.style.left="",document.body.style.right="",document.body.style.overflow="",window.scrollTo(0,scrollPos),window.__fxSyncScroll&&window.__fxSyncScroll(scrollPos),window.__fxLockScroll&&window.__fxLockScroll(600),window.__healReveals&&window.__healReveals(),setTimeout(function(){window.__healReveals&&window.__healReveals()},350)}function updateURL(e,t,n){const s=new URLSearchParams;e&&s.set("cat",e),null!=t&&s.set("item",t);const i=s.toString(),o=i?window.location.pathname+"?"+i:window.location.pathname;n?window.history.pushState({cat:e,item:t},"",o):window.history.replaceState({cat:e,item:t},"",o)}function getShareURL(){return window.location.href}async function copyCurrentURL(){const e=document.activeElement;try{if(await navigator.clipboard.writeText(getShareURL()),e){e.classList.add("copied");const t=e.innerHTML;e.innerHTML='<i class="fa-solid fa-check"></i> Copied!',setTimeout(()=>{e.innerHTML=t,e.classList.remove("copied")},2e3)}}catch{prompt("Copy this link:",getShareURL())}}async function shareCurrent(){const e=getShareURL();if(navigator.share)try{await navigator.share({url:e})}catch{}else copyCurrentURL()}document.getElementById("catShareBtn").addEventListener("click",shareCurrent),document.getElementById("catCopyBtn").addEventListener("click",copyCurrentURL),function(){const e=document.getElementById("lightbox"),t=document.getElementById("lightboxBackdrop"),n=document.getElementById("lightboxClose"),s=document.getElementById("lbImg"),i=document.getElementById("lbMedia"),o=document.getElementById("lbCat"),a=document.getElementById("lbTitle"),r=document.getElementById("lbDesc"),c=document.getElementById("lbTools"),d=document.getElementById("lbPrev"),l=document.getElementById("lbNext"),p=(document.getElementById("lbVideo"),document.getElementById("lbVideoIframe")),nv=document.getElementById("lbVideoNative");let m=0,g=0;const __lbPreloaded=new Set;function __lbCanPreloadHeavy(){const e=navigator.connection||navigator.webkitConnection||navigator.mozConnection;return!e||!(e.saveData||e.effectiveType&&/2g/.test(e.effectiveType))}function preloadMedia(e){if(!e||"string"!=typeof e||0===e.indexOf("yt::")||0===e.indexOf("vi::")||__lbPreloaded.has(e))return;__lbPreloaded.add(e);if(isDirectVideoUrl(e)){const t=new Image;if(t.decoding="async",t.src=optimizeImg(getThumbSrc(e),1400,82),__lbCanPreloadHeavy()){const t=document.createElement("video");t.preload="auto",t.muted=!0,t.playsInline=!0,t.style.cssText="position:absolute;width:0;height:0;opacity:0;pointer-events:none",t.src=e,document.body.appendChild(t),t.load(),t.addEventListener("loadeddata",()=>t.remove(),{once:!0}),setTimeout(()=>t.isConnected&&t.remove(),2e4)}}else{const t=new Image;t.decoding="async",t.src=optimizeImg(e,1400,82)}}function u(e){const t=CATEGORIES[currentCatIdx];m=(e+t.items.length)%t.items.length;const n=t.items[m],d=t.key+":"+m;o.textContent=t.title,a.textContent=n;const l=subImages[d],u=Array.isArray(l)?l:l?[l]:[];if(i.classList.remove("has-img","has-video"),p.src="",p.style.display="none",nv.pause&&nv.pause(),nv.removeAttribute("src"),nv.load&&nv.load(),nv.style.display="none",u.length>0){g=Math.min(g,u.length-1);const e=u[g];isDirectVideoUrl(e)?(i.style.setProperty("--lb-video-ratio","16/9"),nv.onloadedmetadata=function(){nv.videoWidth&&nv.videoHeight&&i.style.setProperty("--lb-video-ratio",nv.videoWidth+"/"+nv.videoHeight)},nv.src=e,nv.poster=optimizeImg(getThumbSrc(e),1400,82),nv.style.display="block",i.classList.add("has-video"),r.textContent="Video preview. Part of the "+t.title+" service line."):"string"==typeof e&&e.startsWith("yt::")?(i.style.setProperty("--lb-video-ratio","16/9"),p.src="https://www.youtube.com/embed/"+e.slice(4)+"?autoplay=1&rel=0",p.style.display="block",i.classList.add("has-video"),r.textContent="Video preview. Part of the "+t.title+" service line."):"string"==typeof e&&e.startsWith("vi::")?(i.style.setProperty("--lb-video-ratio","16/9"),p.src="https://player.vimeo.com/video/"+e.slice(4)+"?autoplay=1",p.style.display="block",i.classList.add("has-video"),r.textContent="Video preview. Part of the "+t.title+" service line."):(i.style.removeProperty("--lb-video-ratio"),s.src=optimizeImg(e,1400,82),s.alt=t.title+" project preview",i.classList.add("has-img"),u.length>1?r.textContent=g+1+" of "+u.length+". Part of the "+t.title+" service line.":r.textContent="Part of the "+t.title+" service line.")}else g=0,s.src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3C/svg%3E",r.textContent="Part of the "+t.title+" service line.";const linkUrl=subLinks[d];c.innerHTML=linkUrl?'<a class="lb-visit-btn" href="'+linkUrl+'" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Website</a>':"";const y=t.items.length,w=(m+1)%y,b=(m-1+y)%y,E=subImages[t.key+":"+w],k=subImages[t.key+":"+b];if(preloadMedia(Array.isArray(E)?E[0]:E),preloadMedia(Array.isArray(k)?k[0]:k),u.length>1){const e=Math.min(g,u.length-1);preloadMedia(u[(e+1)%u.length]),preloadMedia(u[(e-1+u.length)%u.length])}}function h(t){t=t||{},e.classList.remove("open"),e.setAttribute("aria-hidden","true"),p.src="",p.style.display="none",nv.pause&&nv.pause(),nv.removeAttribute("src"),nv.style.display="none",unlockScroll(),t.silent||updateURL(detailStage.classList.contains("hidden")?null:CATEGORIES[currentCatIdx].key)}function v(){const e=CATEGORIES[currentCatIdx],t=e.key+":"+m,n=subImages[t];(Array.isArray(n)?n:n?[n]:[]).length>1&&g>0?(g--,u(m)):(g=0,u(m-1)),updateURL(e.key,m)}function f(){const e=CATEGORIES[currentCatIdx],t=e.key+":"+m,n=subImages[t],s=Array.isArray(n)?n:n?[n]:[];s.length>1&&g<s.length-1?(g++,u(m)):(g=0,u(m+1)),updateURL(e.key,m)}window.__lbForceClose=()=>{e.classList.contains("open")&&h({silent:!0})},subGrid.addEventListener("click",e=>{if(e.target.closest(".sub-visit-btn"))return;const t=e.target.closest(".sub-upload-btn");if(t)return e.preventDefault(),e.stopPropagation(),activeSubKey=t.dataset.key,void(window.openManageModal&&window.openManageModal(activeSubKey));const n=e.target.closest(".sub-card");if(!n)return;e.preventDefault();const s=n.querySelector(".sub-thumb").dataset.key,i=parseInt(s.split(":")[1],10);window.openPhotoViewer&&!isNaN(i)&&window.openPhotoViewer(i)}),n.addEventListener("click",h),t.addEventListener("click",h),d.addEventListener("click",v),l.addEventListener("click",f),document.getElementById("lbShareBtn").addEventListener("click",shareCurrent),document.getElementById("lbCopyBtn").addEventListener("click",copyCurrentURL),document.addEventListener("keydown",t=>{e.classList.contains("open")&&("Escape"===t.key&&h(),"ArrowLeft"===t.key&&v(),"ArrowRight"===t.key&&f())}),window.openPhotoViewer=function(t,n){n=n||{},g=0,u(t),e.classList.add("open"),e.setAttribute("aria-hidden","false"),lockScroll();const s=CATEGORIES[currentCatIdx];n.silent||updateURL(s.key,m,!0)}}();const WHY=[["fa-lightbulb","Strategy Before Screens","Every project starts with your goals and your audience, not a trending template. I ask the questions most people skip, so what gets built actually moves your business forward."],["fa-medal","Craft You Can Trust","Nothing reaches you half-finished. I test, review, and refine every deliverable myself, so what you get on day one is already client-ready."],["fa-bullseye","One Brand, Every Touchpoint","Your website, your posts, your ads should feel like the same person made them — because they did. Consistency is what makes a brand memorable."],["fa-comments","Real Updates, Real Answers","No vanishing acts, no vague timelines. You'll always know exactly where your project stands, and you're talking directly to me, not a support queue."],["fa-clock","Deadlines I Actually Keep","I build revision time into every timeline upfront, so a deadline isn't a hopeful guess — it's a date you can plan around."],["fa-sliders","Built Around You, Not a Template","No drag-and-drop themes, no recycled designs. Every site, automation, and campaign is shaped around your brand's specific goals from the ground up."],["fa-handshake","A Partner, Not a One-Off Vendor","Most clients return for their next project, and the one after. Get the foundation right once, and everything you build on it after gets easier."],["fa-magnifying-glass","Obsessed With the Small Stuff","Typos, broken links, a pixel out of place — I catch what others miss, because everything gets checked twice before it ever ships."]],whyColors=["wi-blue","wi-purple","wi-cyan","wi-pink","wi-blue","wi-purple","wi-cyan","wi-pink"],whyGrid=document.getElementById("whyGrid"),WHY_HERO=[["fa-briefcase","3+","Years Experience"],["fa-circle-check","120+","Projects Delivered"],["fa-layer-group","9","Core Services"],["fa-bolt","<24h","Response Time"]];const whyHero=document.createElement("div");whyHero.className="card why-card why-hero glow-border tilt spot reveal-scale",whyHero.style.setProperty("--i",0),whyHero.innerHTML=`<div class="spot-glow"></div><div class="sheen"></div><div class="why-hero-left"><div class="why-hero-eyebrow"><span class="why-hero-eyebrow-ic"><i class="fa-solid fa-compass"></i></span>The Short Version<span class="why-hero-pulse" title="Currently accepting new projects"></span></div><h4 class="why-hero-title">Websites, automation, design &amp; growth — <em>one partner, one voice</em>.</h4><p class="why-hero-desc">Every website, automation, design, and campaign comes from the same person, with the same care — so everything you publish feels like it truly belongs to your brand.</p><a href="#services" class="why-hero-cta magnetic">See what's included <i class="fa-solid fa-arrow-right"></i></a></div><div class="why-hero-stats">${WHY_HERO.map(([e,t,n])=>`<div class="why-hero-stat"><div class="why-hero-stat-ic"><i class="fa-solid ${e}"></i></div><div class="why-hero-stat-num">${t}</div><div class="why-hero-stat-lbl">${n}</div></div>`).join("")}</div>`,whyGrid.appendChild(whyHero),revealIO.observe(whyHero),WHY.forEach(([e,t,n],s)=>{const i=document.createElement("div");i.className="card why-card glow-border tilt spot reveal-scale",i.style.setProperty("--i",s+1),i.setAttribute("data-wc",s),i.innerHTML=`<div class="spot-glow"></div><div class="sheen"></div><div class="why-idx">0${s+1}</div><div class="why-ic ${whyColors[s]}"><i class="fa-solid ${e}"></i></div><h4>${t}</h4><p>${n}</p>`,whyGrid.appendChild(i),revealIO.observe(i)});const form=document.getElementById("contactForm"),success=document.getElementById("formSuccess"),ffFields=document.querySelectorAll("#contactForm .field.ff");function validateFF(e){const t=e.querySelector("input, textarea");let n=t.value.trim().length>0;return n&&"email"===t.type&&(n=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.value.trim())),e.classList.toggle("valid",n),n}ffFields.forEach(e=>{const t=e.querySelector("input, textarea");t.addEventListener("input",()=>{e.classList.remove("invalid"),validateFF(e)}),t.addEventListener("blur",()=>{t.value.trim().length>0&&!validateFF(e)&&e.classList.add("invalid")})});const CONTACT_EMAIL="hello.rafidzaman@gmail.com";!function(){var cur=document.getElementById("fCurrency"),ic=document.getElementById("budgetCurIc");if(!cur||!ic)return;function paint(){var o=cur.selectedOptions&&cur.selectedOptions[0];if(!o)return;ic.textContent="";var f=o.getAttribute("data-icon");if(f){var i=document.createElement("i");i.className="fa-solid "+f;i.setAttribute("aria-hidden","true");ic.appendChild(i)}else{ic.textContent=o.getAttribute("data-sym")||"$"}}cur.addEventListener("change",paint),paint()}();!function(){var e=[];function t(e){var t=document.createElement("div");return t.textContent=e,t.innerHTML}function n(e,n){var s=e.toLowerCase().indexOf(n.toLowerCase());return-1===s?t(e):t(e.substring(0,s))+'<span class="highlight">'+t(e.substring(s,s+n.length))+"</span>"+t(e.substring(s+n.length))}SKILLS.forEach(function(t){t.items.forEach(function(n){e.push({group:"Skills",groupLabel:t.cat,label:n[0],desc:"",section:"skills",icon:t.icon})})}),SERVICES.forEach(function(t){e.push({group:"Services",groupLabel:t.cat,label:t.title,desc:t.desc,section:"services",icon:t.icon}),t.tags.forEach(function(n){e.push({group:"Services",groupLabel:t.cat,label:n,desc:"Tag — "+t.title,section:"services",icon:t.icon})})}),CATEGORIES.forEach(function(t){e.push({group:"Portfolio",groupLabel:"Category",label:t.title,desc:t.desc,section:"portfolio",icon:t.icon,catKey:t.key,itemIdx:-1}),t.items.forEach(function(n,j){e.push({group:"Portfolio",groupLabel:t.title,label:n,desc:"",section:"portfolio",icon:t.icon,catKey:t.key,itemIdx:j})})}),WHY.forEach(function(t){e.push({group:"Why Me",groupLabel:"",label:t[1],desc:t[2],section:"why",icon:t[0]})}),document.querySelectorAll("#tsPanels .ts-chip").forEach(function(ch){var pn=ch.closest(".ts-panel"),pnName=pn?pn.getAttribute("data-panel"):"";e.push({group:"Tech Stack",groupLabel:"Tools &amp; Technologies",label:ch.querySelector(".ts-name").textContent.trim(),desc:"Tech Stack — "+pnName.charAt(0).toUpperCase()+pnName.slice(1),section:"techstack",icon:"fa-toolbox"})});var s=document.getElementById("navSearchInput"),i=document.getElementById("searchOverlay"),o=document.getElementById("searchInput"),a=document.getElementById("searchResults"),r=document.getElementById("searchHint"),c=document.getElementById("searchEmpty"),d=document.getElementById("searchQuery"),l=document.getElementById("searchClear"),p=document.getElementById("searchClose"),m=document.getElementById("searchBackdrop"),g=!1;function u(){g=!0,i.classList.add("open"),i.setAttribute("aria-hidden","false"),document.body.classList.add("search-lock"),setTimeout(function(){o.focus()},100)}function h(){g=!1,i.classList.remove("open"),i.setAttribute("aria-hidden","true"),document.body.classList.remove("search-lock"),o.value="",s.value="",a.innerHTML="",r.hidden=!1,c.hidden=!0,l.classList.remove("show")}function v(s){var i=s.trim();if(!i)return a.innerHTML="",r.hidden=!1,c.hidden=!0,void l.classList.remove("show");l.classList.add("show"),r.hidden=!0,c.hidden=!0;var o=i.toLowerCase(),p=e.filter(function(e){return-1!==e.label.toLowerCase().indexOf(o)||-1!==e.desc.toLowerCase().indexOf(o)||-1!==e.groupLabel.toLowerCase().indexOf(o)});if(0===p.length)return a.innerHTML="",d.textContent=t(i),void(c.hidden=!1);var m={};p.forEach(function(e){m[e.group]||(m[e.group]=[]),m[e.group].push(e)});var g="";["Skills","Tech Stack","Services","Portfolio","Why Me"].forEach(function(e){m[e]&&(g+='<div class="search-group"><div class="search-group-title">'+t(e)+"</div>",m[e].forEach(function(e){var s=0===e.icon.indexOf("fa-")?'<i class="fa-solid '+t(e.icon)+'"></i>':'<i class="fa-solid fa-tag"></i>',o=e.desc?n(e.desc,i):"";g+='<a class="search-item" data-section="'+t(e.section)+'" data-cat="'+t(e.catKey||"")+'" data-item="'+(e.itemIdx>-1?e.itemIdx:"")+'" href="#'+t(e.section)+'">',g+='<div class="search-item-ic">'+s+"</div>",g+='<div class="search-item-info"><div class="search-item-title">'+n(e.label,i)+"</div>",o&&(g+='<div class="search-item-desc">'+o+"</div>"),g+='</div><span class="search-item-action">Go to '+t(e.section)+"</span></a>"}),g+="</div>")}),a.innerHTML=g,a.querySelectorAll(".search-item").forEach(function(e){e.addEventListener("click",function(t){t.preventDefault();var n=e.dataset.section,catKey=e.dataset.cat,itemIdxRaw=e.dataset.item,itemIdx=""===itemIdxRaw?-1:parseInt(itemIdxRaw,10);h();setTimeout(function(){if(catKey&&"function"==typeof updateURL&&"function"==typeof syncFromURL){updateURL(catKey,itemIdx>-1?itemIdx:void 0,!0),syncFromURL({replace:!0})}else if(window.goToSection)window.goToSection("#"+n);else{var s=document.getElementById(n);if(!s)return;var navH=(document.getElementById("navbar")||{offsetHeight:0}).offsetHeight,top=Math.max(0,window.scrollY+s.getBoundingClientRect().top-navH-14);window.__fxScrollTo?window.__fxScrollTo(top):window.scrollTo({top:top,behavior:"smooth"})}},70)})})}s.addEventListener("focus",function(e){u(),s.blur()}),document.querySelector(".nav-search-wrap").addEventListener("click",function(){u()}),p.addEventListener("click",h),m.addEventListener("click",h),document.addEventListener("keydown",function(e){"Escape"===e.key&&g&&h(),(e.ctrlKey||e.metaKey)&&"k"===e.key&&(e.preventDefault(),g?h():u())}),l.addEventListener("click",function(){o.value="",o.focus(),v("")}),o.addEventListener("input",function(){v(this.value)}),o.addEventListener("keydown",function(e){if("Enter"===e.key){var t=a.querySelector(".search-item");t&&t.click()}})}(),form.addEventListener("submit",e=>{e.preventDefault();let t=!0;if(ffFields.forEach(e=>{validateFF(e)||(e.classList.add("invalid"),t=!1)}),!t)return;const n=form.querySelector('button[type="submit"]'),s=n.innerHTML,i=document.getElementById("fName").value.trim(),o=document.getElementById("fEmail").value.trim(),a=document.getElementById("fSubject").value.trim(),__bEl=document.getElementById("fBudget"),__curSel=document.getElementById("fCurrency"),__bl=(()=>{if(!__bEl||!__bEl.value.trim())return "";const __a=__bEl.value.trim(),__op=__curSel&&__curSel.selectedOptions?__curSel.selectedOptions[0]:null,__sy=__op?__op.getAttribute("data-sym")||"":"",__cd=__curSel?__curSel.value:"";return "Budget: "+(/^[\d.,]/.test(__a)?__sy+__a:__a)+(__cd?" "+__cd:"")+"\n\n"})(),r="Name: "+i+"\nEmail: "+o+"\n"+(__bl||"\n")+document.getElementById("fMessage").value.trim();n.disabled=!0,n.classList.add("is-loading"),n.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Opening mail...',success.classList.add("show"),window.__openCompose=window.__openCompose||function(e,t,n){var s="mailto:"+e+"?subject="+encodeURIComponent(t)+"&body="+encodeURIComponent(n);window.location.href=s},window.__openCompose(CONTACT_EMAIL,a,r),setTimeout(()=>{form.reset(),ffFields.forEach(e=>e.classList.remove("valid","invalid")),n.disabled=!1,n.classList.remove("is-loading"),n.innerHTML=s},1200),setTimeout(()=>success.classList.remove("show"),7e3)}),function(){const e=document.querySelector(".stat-tile-num[data-auto-year]");if(e){const t=2023,n=(new Date).getFullYear()-t;e.dataset.count=n,e.textContent=n+(e.dataset.suffix||"+")}const t=document.querySelectorAll(".stat-tile .stat-tile-num"),n=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){const t=+e.target.dataset.count,s=e.target.dataset.suffix||"+";let i=0;const o=()=>{i+=t/40,i<t?(e.target.textContent=Math.floor(i)+s,requestAnimationFrame(o)):e.target.textContent=t+s};o(),n.unobserve(e.target)}})},{threshold:.5});t.forEach(e=>n.observe(e))}();const toTop=document.getElementById("toTop");function syncFromURL(e){e=e||{};const t=new URLSearchParams(window.location.search),n=t.get("cat"),s=t.get("item");if(!n)return window.__lbForceClose&&window.__lbForceClose(),void(detailStage.classList.contains("hidden")||closeCategory({silent:!0}));const i=CATEGORIES.findIndex(e=>e.key===n);if(-1===i)return;const o=()=>{(detailStage.classList.contains("hidden")||i!==currentCatIdx)&&openCategory(i,e),null!=s?setTimeout(()=>{const e=subGrid.querySelectorAll(".sub-card"),t=parseInt(s,10);!isNaN(t)&&e[t]&&window.openPhotoViewer&&window.openPhotoViewer(t,{silent:!0})},e.replace?400:0):window.__lbForceClose&&window.__lbForceClose()};e.replace&&!detailStage.classList.contains("hidden")?(closeCategory({silent:!0}),setTimeout(o,300)):o()}window.addEventListener("scroll",()=>{toTop.classList.toggle("show",window.scrollY>500)}),toTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"})),function(){const e=document.querySelectorAll(".ambient-blob, .about-blob");if(!e.length)return;let t=!1;window.addEventListener("scroll",()=>{t||(requestAnimationFrame(()=>{const n=window.scrollY;e.forEach((e,t)=>{const s=t%3==0?.03:t%3==1?-.02:.04;e.style.transform="translateY("+n*s+"px)"}),t=!1}),t=!0)})}(),function(){const e=document.querySelectorAll(".pf-stat-pill .psp-num");if(!e.length)return;const t=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){const n=e.target,s=n.textContent.trim().match(/^(\d+)(.*)/);if(s){const e=parseInt(s[1]),t=s[2]||"";let i=0;const o=900,a=performance.now(),r=s=>{const c=Math.min((s-a)/o,1),d=1-Math.pow(1-c,3);i=Math.round(d*e),n.textContent=i+t,c<1&&requestAnimationFrame(r)};requestAnimationFrame(r)}t.unobserve(n)}})},{threshold:.5});e.forEach(e=>t.observe(e))}(),function(){const e=document.querySelectorAll(".why-hero-stat-num");if(!e.length)return;const t=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){const n=e.target,s=n.textContent.trim().match(/^(\d+)(.*)/);if(s){const e=parseInt(s[1]),t=s[2]||"";let i=0;const o=1100,a=performance.now(),r=s=>{const c=Math.min((s-a)/o,1),d=1-Math.pow(1-c,3);i=Math.round(d*e),n.textContent=i+t,c<1&&requestAnimationFrame(r)};requestAnimationFrame(r)}t.unobserve(n)}})},{threshold:.5});e.forEach(e=>t.observe(e))}(),function(){const e=document.querySelectorAll(".section-sub");if(!e.length)return;const t=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add("in"),t.unobserve(e.target))})},{threshold:.3});e.forEach(e=>t.observe(e))}(),function(){const e=document.querySelectorAll(".float-glass");if(!e.length)return;let t=!1;window.addEventListener("scroll",()=>{t||(requestAnimationFrame(()=>{const n=window.scrollY;e.forEach((e,t)=>{const s=t%3==0?.04:t%3==1?-.03:.05;e.style.transform="translateY("+n*s+"px) rotate("+.02*n+"deg)"}),t=!1}),t=!0)},{passive:!0})}(),function(){const e=document.getElementById("globalParticles");if(!e)return;const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches,n=window.matchMedia("(hover:none), (pointer:coarse)").matches;if(t||n||window.innerWidth<900)return void e.remove();const s=e.getContext("2d");if(!s)return void e.remove();let i,o,a=[];const r=["31,92,82","190,132,56","62,133,121","168,118,58","176,129,84"];function c(){i=e.width=window.innerWidth,o=e.height=window.innerHeight}window.addEventListener("resize",c),function(){c();const e=Math.min(40,Math.floor(i*o/3e4));a=Array.from({length:e},()=>({x:Math.random()*i,y:Math.random()*o,r:1.8*Math.random()+.5,vx:.15*(Math.random()-.5),vy:.15*(Math.random()-.5),c:r[Math.floor(Math.random()*r.length)],a:.4*Math.random()+.15,p:Math.random()*Math.PI*2}))}(),function e(){s.clearRect(0,0,i,o);for(let e=0;e<a.length;e++)for(let t=e+1;t<a.length;t++){const n=a[e],i=a[t],o=n.x-i.x,r=n.y-i.y,c=Math.sqrt(o*o+r*r);if(c<160){const e=.08*(1-c/160);s.beginPath(),s.moveTo(n.x,n.y),s.lineTo(i.x,i.y),s.strokeStyle="rgba("+n.c+","+e.toFixed(3)+")",s.lineWidth=.5,s.stroke()}}a.forEach(e=>{e.vx*=.998,e.vy*=.998,e.x+=e.vx,e.y+=e.vy,e.p+=.015,e.x<0&&(e.x=i),e.x>i&&(e.x=0),e.y<0&&(e.y=o),e.y>o&&(e.y=0);const t=e.a*(.5+.5*Math.sin(e.p));s.beginPath(),s.arc(e.x,e.y,e.r,0,2*Math.PI),s.fillStyle="rgba("+e.c+","+t.toFixed(2)+")",s.fill()}),requestAnimationFrame(e)}()}(),function(){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;const e=document.querySelectorAll(".magnetic");if(!e.length)return;e.forEach(e=>{let t=null;e.addEventListener("mousemove",n=>{const s=e.getBoundingClientRect();let i=.35*(n.clientX-(s.left+s.width/2)),o=.35*(n.clientY-(s.top+s.height/2));i=Math.max(-14,Math.min(14,i)),o=Math.max(-14,Math.min(14,o)),t&&cancelAnimationFrame(t),t=requestAnimationFrame(()=>{e.style.transition="transform .15s ease-out",e.style.transform="translate("+i+"px,"+o+"px)"})},{passive:!0}),e.addEventListener("mouseleave",()=>{t&&cancelAnimationFrame(t),e.style.transition="transform .6s var(--ease-spring)",e.style.transform="translate(0,0)"},{passive:!0})})}(),document.querySelectorAll(".btn").forEach(e=>{e.addEventListener("mousedown",()=>{e.style.transform="scale(0.95)"}),e.addEventListener("mouseup",()=>{e.style.transform="scale(1)"}),e.addEventListener("mouseleave",()=>{e.style.transform=""})}),function(){if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;function e(e){e.dataset.tiltBound||(e.dataset.tiltBound="1",e.addEventListener("mousemove",t=>{if(e.classList.contains("open"))return;const n=e.getBoundingClientRect(),s=(t.clientX-n.left)/n.width-.5,i=(t.clientY-n.top)/n.height-.5;e.style.transform="perspective(900px) rotateY("+8*s+"deg) rotateX("+-8*i+"deg) translateY(-6px)"}),e.addEventListener("mouseleave",()=>{e.classList.contains("open")||(e.style.transform="perspective(900px) rotateY(0) rotateX(0) translateY(0)",e.style.transition="transform .6s var(--ease-spring)",setTimeout(()=>{e.style.transition=""},600))}))}document.querySelectorAll(".tilt").forEach(e);new MutationObserver(()=>{document.querySelectorAll(".tilt:not([data-tilt-bound])").forEach(e)}).observe(document.body,{childList:!0,subtree:!0})}(),document.querySelectorAll(".lightbox-panel").forEach(e=>{e.style.scrollBehavior="smooth",e.style.scrollbarWidth="thin",e.style.scrollbarColor="rgba(190,132,56,0.3) transparent"}),function(){const e=window.matchMedia("(prefers-reduced-motion: reduce)").matches,t=document.getElementById("page");if(t&&requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add("ready"))),!e){document.querySelectorAll(".section-title").forEach(e=>{if(e.querySelector(".word-reveal"))return;if(e.querySelector("span"))return;const t=document.createDocumentFragment();let n=0;e.textContent.split(/(\s+)/).forEach(e=>{if(""===e.trim())return void t.appendChild(document.createTextNode(e));const s=document.createElement("span");s.className="word-reveal";const i=document.createElement("span");i.textContent=e,i.style.setProperty("--wi",n++),s.appendChild(i),t.appendChild(s)}),e.innerHTML="",e.appendChild(t)});const s=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add("in"),s.unobserve(e.target))})},{threshold:.25});document.querySelectorAll(".word-reveal").forEach(e=>s.observe(e.parentElement||e))}if(!e){document.querySelectorAll(".pfp-circle img, .sub-thumb.has-img img").forEach(e=>{e.classList.add("img-reveal")});const i=new IntersectionObserver(e=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add("in"),i.unobserve(e.target))})},{threshold:.1});document.querySelectorAll(".img-reveal").forEach(e=>i.observe(e))}if(window.matchMedia("(hover:hover) and (pointer:fine)").matches&&!e){const o=document.querySelector(".hero"),a=[{el:document.querySelector(".hero-bg"),depth:14},{el:document.querySelector(".hero-mesh"),depth:26},{el:document.querySelector(".hero-grid"),depth:8}].filter(e=>e.el);a.forEach(e=>e.el.classList.add("hero-parallax"));let r=null,c=0,d=0,l=0,p=0;function n(){l+=.08*(c-l),p+=.08*(d-p),a.forEach(e=>{e.el.style.transform="translate3d("+(l*e.depth).toFixed(2)+"px,"+(p*e.depth).toFixed(2)+"px,0)"}),r=Math.abs(c-l)>.001||Math.abs(d-p)>.001?requestAnimationFrame(n):null}o&&o.addEventListener("mousemove",e=>{const t=o.getBoundingClientRect();c=(e.clientX-t.left)/t.width-.5,d=(e.clientY-t.top)/t.height-.5,r||(r=requestAnimationFrame(n))}),o&&o.addEventListener("mouseleave",()=>{c=0,d=0,r||(r=requestAnimationFrame(n))})}window.fxScrollToId=function(e){if(!e||e.length<2)return;const t=document.getElementById(e.slice(1))||document.querySelector(e);if(!t)return;const n=(document.getElementById("navbar")||{offsetHeight:0}).offsetHeight,s=Math.max(0,window.scrollY+t.getBoundingClientRect().top-n-14);window.__fxScrollTo?window.__fxScrollTo(s):window.scrollTo({top:s,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})},document.querySelectorAll('a[href^="#"]').forEach(e=>{e.addEventListener("click",t=>{const n=e.getAttribute("href");!n||"#"!==n.charAt(0)||n.length<2||document.querySelector(n)&&(t.preventDefault(),window.goToSection?window.goToSection(n):window.fxScrollToId(n))})})}(),function(){const e=window.matchMedia("(prefers-reduced-motion: reduce)").matches,t=window.matchMedia("(hover:none), (pointer:coarse)").matches,n=document.getElementById("preloader"),s=document.getElementById("pageReveal");let i=!1;function o(){i||(i=!0,n&&n.classList.add("hide"),s&&requestAnimationFrame(()=>s.classList.add("done")))}if(n?setTimeout(o,60):o(),e)return;if(t||"ontouchstart"in window||navigator.maxTouchPoints>0)return;let a=window.scrollY||0,r=a,c=null,d=!1;const l=120;function p(){const e=a-r;if(Math.abs(e)<.4)return r=a,window.scrollTo(0,r),d=!1,void(c=null);let t=.085*e;t>l?t=l:t<-120&&(t=-120),r+=t,window.scrollTo(0,r),c=requestAnimationFrame(p)}function m(){d||(d=!0,c=requestAnimationFrame(p))}window.__fxSyncScroll=function(e){c&&(cancelAnimationFrame(c),c=null),d=!1,null!=e?(a=e,r=e):(a=window.scrollY,r=window.scrollY)};window.__fxLockScroll=function(e){window.__fxScrollLock=!0,c&&(cancelAnimationFrame(c),c=null),d=!1,clearTimeout(window.__fxLockTimer),window.__fxLockTimer=setTimeout(()=>{window.__fxScrollLock=!1,a=window.scrollY,r=window.scrollY},e||700)};t||window.addEventListener("wheel",e=>{if(window.__fxScrollLock)return;const t=e.target;if(t&&t.closest&&t.closest(".lightbox.open, .lightbox-panel, [data-fx-native-scroll], .service-detail.open .sd-panel"))return;if(document.body.classList.contains("menu-open"))return;if(document.body.classList.contains("project-view"))return;e.preventDefault(),a+=e.deltaY*(1===e.deltaMode?24:1);const n=document.documentElement.scrollHeight-window.innerHeight;a=Math.max(0,Math.min(n,a)),m()},{passive:!1}),window.addEventListener("touchmove",()=>{a=window.scrollY,r=window.scrollY},{passive:!0}),window.addEventListener("touchstart",()=>{a=window.scrollY,r=window.scrollY},{passive:!0}),window.addEventListener("scroll",()=>{d||(a=window.scrollY,r=window.scrollY)},{passive:!0}),window.addEventListener("keydown",e=>{["PageDown","PageUp","Home","End","ArrowDown","ArrowUp","Space"].includes(e.code)&&(a=window.scrollY,r=window.scrollY)}),document.documentElement.classList.add("fx-smooth");const g=Element.prototype.scrollIntoView;Element.prototype.scrollIntoView=function(e){const t=e&&("smooth"===e||"smooth"===e.behavior),n=this.closest&&this.closest(".lightbox.open, .lightbox-panel, [data-fx-native-scroll]");if(t&&window.__fxScrollTo&&!n){const e=window.scrollY+this.getBoundingClientRect().top-10;return void window.__fxScrollTo(e)}return g.apply(this,arguments)},t||(window.__fxScrollTo=e=>{a=Math.max(0,Math.min(document.documentElement.scrollHeight-window.innerHeight,e)),m()});if(window.matchMedia("(hover:hover) and (pointer:fine)").matches&&!t){const h=document.querySelector(".bg-orbs"),v=document.createElement("div");v.className="fx-mesh-wrap";const f=document.querySelector(".fx-mesh");f&&f.parentNode&&(f.parentNode.insertBefore(v,f),v.appendChild(f));let y=0,w=0,b=0,E=0,k=null;function u(){b+=.05*(y-b),E+=.05*(w-E),v&&(v.style.transform="translate3d("+-22*b+"px,"+-22*E+"px,0)"),h&&(h.style.transform="translate3d("+14*b+"px,"+14*E+"px,0)"),k=Math.abs(y-b)>.001||Math.abs(w-E)>.001?requestAnimationFrame(u):null}window.addEventListener("mousemove",e=>{y=e.clientX/window.innerWidth-.5,w=e.clientY/window.innerHeight-.5,k||(k=requestAnimationFrame(u))},{passive:!0})}window.addEventListener("beforeunload",()=>{document.body.style.transition="opacity .4s ease",document.body.style.opacity="0"})}(),syncFromURL({replace:!0,silent:!0}),window.addEventListener("popstate",()=>syncFromURL({silent:!0})),window.addEventListener("pageshow",function(ev){if(ev.persisted||(window.performance&&performance.getEntriesByType&&(function(){var e=performance.getEntriesByType("navigation");return e&&e[0]&&"back_forward"===e[0].type})())){"fixed"===document.body.style.position&&unlockScroll();var b=document.body;b.classList.add("bfcache-repaint");void b.offsetHeight;requestAnimationFrame(function(){b.classList.remove("bfcache-repaint")});syncFromURL({silent:!0})}}),function(){var e,t=document.getElementById("lightbox"),n=document.getElementById("lbMedia"),s=document.getElementById("lbImg"),i=document.getElementById("lbTitle"),o=document.getElementById("lbPh"),a=document.getElementById("toastContainer"),r=document.getElementById("shareOverlay"),c=!1;function d(t){if(a){clearTimeout(e);var n=a.querySelector(".toast-text");n&&(n.textContent=t),a.classList.add("show"),e=setTimeout(function(){a.classList.remove("show")},3e3)}}function l(e,t){var n=document.getElementById(e);if(n){var s=n.cloneNode(!0);n.parentNode.replaceChild(s,n),s.addEventListener("click",t)}}function p(e){e&&e.preventDefault(),navigator.share?navigator.share({title:document.title,url:window.location.href}).catch(function(){}):r&&r.classList.add("open")}function m(e){e&&e.preventDefault();var t=window.location.href;navigator.clipboard.writeText(t).catch(function(){var e=document.createElement("textarea");e.value=t,document.body.appendChild(e),e.select(),document.execCommand("copy"),document.body.removeChild(e)}).then(function(){var e=document.activeElement;if(e&&e.classList.contains("copy-btn")){e.classList.add("copied");var t=e.innerHTML;e.innerHTML='<i class="fa-solid fa-check"></i> Copied!',setTimeout(function(){e.innerHTML=t,e.classList.remove("copied")},2e3)}d("Project link copied successfully!")})}if(window.__showToast=d,r&&(r.querySelector(".share-backdrop").addEventListener("click",function(){r.classList.remove("open")}),r.querySelector(".share-close").addEventListener("click",function(){r.classList.remove("open")}),r.querySelectorAll(".share-opt").forEach(function(e){e.addEventListener("click",function(){var e=this.dataset.action,t=window.location.href;function n(){r.classList.remove("open")}"copy"===e?navigator.clipboard.writeText(t).catch(function(){var e=document.createElement("textarea");e.value=t,document.body.appendChild(e),e.select(),document.execCommand("copy"),document.body.removeChild(e)}).then(function(){d("Project link copied successfully!"),n()}):"whatsapp"===e?(window.open("https://wa.me/?text="+encodeURIComponent(t),"_blank"),n()):"telegram"===e?(window.open("https://t.me/share/url?url="+encodeURIComponent(t),"_blank"),n()):"twitter"===e?(window.open("https://twitter.com/intent/tweet?url="+encodeURIComponent(t),"_blank"),n()):"email"===e&&(window.location.href="mailto:?subject=Project%20from%20Rafid%20Zaman&body="+encodeURIComponent(t),n())})})),["catShareBtn","lbShareBtn"].forEach(function(e){l(e,p)}),["catCopyBtn","lbCopyBtn"].forEach(function(e){l(e,m)}),window.shareCurrent=p,window.copyCurrentURL=m,t&&n&&s){var g=document.createElement("div");g.className="lb-zoom-hint",g.innerHTML='<i class="fa-solid fa-magnifying-glass-plus"></i> Zoom',n.appendChild(g);var u=document.createElement("div");u.className="lb-counter",u.id="lbCounter",u.textContent="1 / 1",n.appendChild(u);var h=document.createElement("div");h.className="lb-swipe-hint",h.innerHTML='<i class="fa-solid fa-hand-pointer"></i> Swipe',n.appendChild(h),setTimeout(function(){h.classList.add("show")},1500),setTimeout(function(){h.classList.remove("show")},5e3);var v=document.createElement("div");v.className="lb-loading",v.id="lbLoading",v.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i>',n.appendChild(v);var f=function(){try{var e=CATEGORIES[currentCatIdx];if(!e)return;var t=i.textContent,n=e.items.indexOf(t);if(-1===n)return;var o=e.key+":"+n,a=subImages[o],r=Array.isArray(a)?a:a?[a]:[],c=r.length||1,d=s.src,l=document.getElementById("lbVideoIframe"),p=1;if(r.length>1&&d)for(var m=0;m<r.length;m++)if("string"==typeof r[m]&&(r[m].startsWith("yt::")||r[m].startsWith("vi::"))){if(l&&l.src&&-1!==l.src.indexOf(r[m].slice(4))){p=m+1;break}}else if(-1!==d.indexOf(r[m])){p=m+1;break}u.textContent=p+" / "+c}catch(e){u.textContent="1 / 1"}};new MutationObserver(function(){t.classList.contains("open")&&setTimeout(f,50)}).observe(t,{attributes:!0,attributeFilter:["class"]}),i&&new MutationObserver(f).observe(i,{childList:!0}),s.addEventListener("load",function(){v&&v.classList.remove("show"),o&&(o.style.display="none")}),s.addEventListener("error",function(){v&&v.classList.remove("show"),o&&(o.style.display="flex",o.innerHTML='<i class="fa-solid fa-triangle-exclamation"></i><span style=font-size:14px;margin-top:8px;opacity:.7>Image could not be loaded</span>')}),new MutationObserver(function(){s.src&&s.src!==window.location.href&&(v&&v.classList.add("show"),o&&(o.style.display="none",o.innerHTML='<i class="fa-solid fa-image"></i>'),c=!1,s.style.transformOrigin="center center",s.style.transform="",s.style.cursor="",g.innerHTML='<i class="fa-solid fa-magnifying-glass-plus"></i> Zoom',v&&v.classList.remove("show"),o&&(o.style.display=""))}).observe(s,{attributes:!0,attributeFilter:["src"]}),n.addEventListener("click",function(e){if(!e.target.closest(".lightbox-close,.lb-counter,.lb-zoom-hint,button")&&n.classList.contains("has-img")&&s.complete&&0!==s.naturalWidth)if(c=!c){var t=n.getBoundingClientRect(),i=((e.clientX-t.left)/t.width*100).toFixed(1),o=((e.clientY-t.top)/t.height*100).toFixed(1);s.style.transformOrigin=i+"% "+o+"%",s.style.transform="scale(2.2)",s.style.cursor="grab",g.innerHTML='<i class="fa-solid fa-magnifying-glass-minus"></i> Pan'}else s.style.transformOrigin="center center",s.style.transform="",s.style.cursor="",g.innerHTML='<i class="fa-solid fa-magnifying-glass-plus"></i> Zoom'}),n.addEventListener("mousemove",function(e){if(c){var t=n.getBoundingClientRect();s.style.transformOrigin=((e.clientX-t.left)/t.width*100).toFixed(1)+"% "+((e.clientY-t.top)/t.height*100).toFixed(1)+"%"}});var y=0,w=0,b=0,E=0,k=!1;n.addEventListener("touchstart",function(e){c||(y=e.touches[0].clientX,w=e.touches[0].clientY,b=y,E=w,k=!0)},{passive:!0}),n.addEventListener("touchmove",function(e){k&&!c&&(b=e.touches[0].clientX,E=e.touches[0].clientY)},{passive:!0}),n.addEventListener("touchend",function(){if(k&&!c){k=!1;var e=b-y,t=E-w;if(Math.abs(e)>50&&Math.abs(e)>1.5*Math.abs(t)){var n=e>0?document.getElementById("lbPrev"):document.getElementById("lbNext");n&&n.click()}}},{passive:!0})}}();

(function () {
  "use strict";
  try {
    var lb = document.getElementById("lightbox");
    var m = document.getElementById("lbMedia");
    var ph = document.getElementById("lbPh");
    if (!m) return;
    function apply() {
      if (!lb.classList.contains("open")) return;   // stay neutral when closed
      var empty = !(m.classList.contains("has-img") || m.classList.contains("has-video"));
      m.classList.toggle("no-media", empty);
      lb.classList.toggle("no-media-state", empty);
      var d = document.getElementById("lbDesc");
      if (empty && d) {
        var t = document.getElementById("lbTitle");
        var name = t ? t.textContent.trim() : "Project";
        if (!/coming soon/i.test(d.textContent)) {
          d.textContent = name + " \u2014 the finished preview is coming soon. This space is reserved for the final piece.";
        }
      }
    }
    /* observe open state so it applies on every open/nav */
    new MutationObserver(apply).observe(lb, { attributes: true, attributeFilter: ["class"] });
    new MutationObserver(apply).observe(m, { attributes: true, attributeFilter: ["class"] });
    apply();
  } catch (e) { /* never block the page */ }
})();

(function(){
  "use strict";
  try{
    document.querySelectorAll(".faq-item").forEach(function(item){
      var btn=item.querySelector(".faq-q"), panel=item.querySelector(".faq-a");
      if(!btn||!panel) return;
      btn.addEventListener("click", function(){
        var isOpen=item.classList.contains("open");
        document.querySelectorAll(".faq-item.open").forEach(function(other){
          if(other!==item){
            other.classList.remove("open");
            other.querySelector(".faq-q").setAttribute("aria-expanded","false");
            other.querySelector(".faq-a").style.maxHeight=null;
          }
        });
        if(isOpen){
          item.classList.remove("open");
          btn.setAttribute("aria-expanded","false");
          panel.style.maxHeight=null;
        }else{
          item.classList.add("open");
          btn.setAttribute("aria-expanded","true");
          panel.style.maxHeight=panel.scrollHeight+"px";
        }
      });
    });
    var faqRt;
    window.addEventListener("resize", function(){
      clearTimeout(faqRt);
      faqRt=setTimeout(function(){
        document.querySelectorAll(".faq-item.open .faq-a").forEach(function(p){ p.style.maxHeight=p.scrollHeight+"px"; });
      },150);
    });
  }catch(e){ /* never block the page */ }
})();

(function(){
  "use strict";

  /* ------------------------------------------------------------------
     Latest Work: one cinematic stage, three switchable category pools
     (Design / Graphic Design / Web Development). Add items to whichever
     array matches the work:
       type: "image" or "video"
       src : the file path / URL to the photo or video
       link: OPTIONAL - a project/website URL. When set, a "Visit
             Website" button appears on that slide.
     Newest item first is fine - each category loops through its own list.
     RULE: keep each category to a MAX of 5 items here. This section is a
     quick "recent highlights" preview, not the full archive - anything
     beyond 5 belongs only in the Portfolio section further down the page. */
  /* Latest Work now pulls straight from the Portfolio section below -
     whatever photo/video you add to a Portfolio item (via the camera
     icon ? Manage Media) automatically shows up here too, newest-set
     items first in each category, capped at 5. No need to maintain
     two separate lists - Portfolio is the single source of truth. */
  function buildLatestFromPortfolio(catKey, max){
    var cat = (typeof CATEGORIES !== "undefined") ? CATEGORIES.find(function(c){ return c.key === catKey; }) : null;
    if(!cat) return [];
    var out = [];
    var order = (typeof getCategoryOrder === "function") ? getCategoryOrder(catKey) : cat.items.map(function(name, i){ return i; });
    order.forEach(function(idx){
      if(out.length >= max) return;
      var mkey = catKey + ":" + idx;
      var raw = (typeof subImages !== "undefined") ? subImages[mkey] : null;
      var imgs = Array.isArray(raw) ? raw : (raw ? [raw] : []);
      if(!imgs.length) return;
      var first = imgs[0];
      if(typeof first !== "string") return;
      var entry;
      if(typeof isDirectVideoUrl === "function" && isDirectVideoUrl(first)){
        entry = { type: "video", src: first };
      } else if(first.indexOf("yt::") === 0 || first.indexOf("vi::") === 0){
        return; /* Latest Work only supports direct image/video files, not embeds */
      } else {
        entry = { type: "image", src: first };
      }
      var linkUrl = (typeof subLinks !== "undefined") ? subLinks[mkey] : null;
      if(linkUrl) entry.link = linkUrl;
      out.push(entry);
    });
    return out;
  }
  var LATEST_WORK_WEB = buildLatestFromPortfolio("web", 5);
  var LATEST_WORK_AI = buildLatestFromPortfolio("ai", 5);
  var LATEST_WORK_GRAPHIC = buildLatestFromPortfolio("graphic", 5);
  var CATS = {
    web:     { label: "Web Development", icon: "fa-code",   items: LATEST_WORK_WEB,     clr: "rgba(59,108,171,0.92)", shadow: "rgba(59,108,171,0.5)" },
    ai:      { label: "AI Automation",   icon: "fa-robot",  items: LATEST_WORK_AI,      clr: "rgba(31,92,82,0.92)",   shadow: "rgba(31,92,82,0.5)" },
    graphic: { label: "Graphic Design",  icon: "fa-images", items: LATEST_WORK_GRAPHIC, clr: "rgba(190,132,56,0.92)", shadow: "rgba(190,132,56,0.5)" }
  };
  var CAT_ORDER = ["web", "ai", "graphic"];

  var IMAGE_DURATION = 2500;
  var VIDEO_MAX_DURATION = 12000;

  var stage = document.getElementById("lwStage");
  var empty = document.getElementById("lwEmpty");
  var thumbsWrap = document.getElementById("lwThumbs");
  var progressFill = document.getElementById("lwProgressFill");
  var prevBtn = document.getElementById("lwPrevBtn");
  var nextBtn = document.getElementById("lwNextBtn");
  var tabsWrap = document.getElementById("lwTabs");
  var tabIndicator = document.getElementById("lwTabIndicator");
  var stageBadge = document.getElementById("lwStageBadge");
  if(!stage) return;

  /* Preconnect to every CDN host used above, once, before anything
     starts fetching - removes the DNS/TLS wait on the very first
     image/video across every category. */
  (function(){
    var seen = {};
    CAT_ORDER.forEach(function(cat){
      CATS[cat].items.forEach(function(item){
        var m = item.src.match(/^https?:\/\/[^\/]+/);
        if(!m || seen[m[0]]) return;
        seen[m[0]] = true;
        ["preconnect", "dns-prefetch"].forEach(function(rel){
          var link = document.createElement("link");
          link.rel = rel;
          link.href = m[0];
          document.head.appendChild(link);
        });
      });
    });
  })();

  var anyItems = CAT_ORDER.some(function(cat){ return CATS[cat].items.length > 0; });
  if(!anyItems){
    if(empty) empty.classList.add("show");
    stage.style.display = "none";
    if(thumbsWrap) thumbsWrap.style.display = "none";
    if(tabsWrap) tabsWrap.style.display = "none";
    return;
  }

  /* Build each category's slide/thumb elements once, up front, into
     that category's own (initially hidden) slides container - so
     switching tabs is an instant show/hide instead of a rebuild, and
     everything not currently active keeps quietly preloading. */
  CAT_ORDER.forEach(function(cat){
    var state = CATS[cat];
    var slidesWrap = document.getElementById("lwSlides" + cat.charAt(0).toUpperCase() + cat.slice(1));
    state.slidesWrap = slidesWrap;
    state.current = 0;
    state.broken = {};
    state.preloaded = {};
    state.timer = null;

    state.slideEls = state.items.map(function(item, idx){
      var el = document.createElement("div");
      el.className = "lw-slide" + (idx === 0 ? " active" : "");
      var media;
      if(item.type === "video"){
        media = document.createElement("video");
        media.src = item.src;
        media.muted = true;
        media.loop = true;
        media.playsInline = true;
        /* Start every video at "metadata" so a full mp4 never
           downloads on page load - the first video lives in a
           hidden tab and would waste mobile bandwidth. preloadAround()
           bumps it to "auto" the moment it's about to be shown. */
        media.preload = "metadata";
        var __cldPoster = item.src.match(/^(https?:\/\/res\.cloudinary\.com\/[^\/]+\/video\/upload\/)(.+)\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i);
        if(__cldPoster){ media.poster = __cldPoster[1] + "so_0/" + __cldPoster[2] + ".jpg"; }
      } else {
        media = document.createElement("img");
        media.src = optimizeImg(item.src, 1400, 82);
        media.alt = state.label + " — latest work";
        media.loading = idx === 0 ? "eager" : "lazy";
        media.decoding = "async";
      }
      if(idx === 0 && cat === CAT_ORDER[0]) media.setAttribute("fetchpriority", "high");
      media.addEventListener("error", function(){ handleBroken(cat, idx); });
      el.appendChild(media);
      if(item.link){
        var linkBtn = document.createElement("a");
        linkBtn.className = "lw-visit-btn";
        linkBtn.href = item.link;
        linkBtn.target = "_blank";
        linkBtn.rel = "noopener";
        linkBtn.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Website';
        /* Stop this click from being read as a swipe/drag on touch devices */
        linkBtn.addEventListener("click", function(e){ e.stopPropagation(); });
        el.appendChild(linkBtn);
      }
      if(slidesWrap) slidesWrap.appendChild(el);
      return el;
    });

    state.thumbEls = state.items.map(function(item, idx){
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lw-thumb" + (idx === 0 ? " active" : "");
      btn.setAttribute("aria-label", state.label + " item " + (idx + 1));
      var media;
      if(item.type === "video"){
        media = document.createElement("video");
        media.src = item.src;
        media.muted = true;
        media.playsInline = true;
        media.preload = "metadata";
        var __cldThumbPoster = item.src.match(/^(https?:\/\/res\.cloudinary\.com\/[^\/]+\/video\/upload\/)(.+)\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i);
        if(__cldThumbPoster){ media.poster = __cldThumbPoster[1] + "so_0/" + __cldThumbPoster[2] + ".jpg"; }
        var playIcon = document.createElement("span");
        playIcon.className = "lw-thumb-play";
        playIcon.innerHTML = '<i class="fa-solid fa-play"></i>';
        btn.appendChild(media);
        btn.appendChild(playIcon);
      } else {
        media = document.createElement("img");
        media.src = optimizeImg(item.src, 240, 70);
        media.alt = "";
        media.loading = "lazy";
        media.decoding = "async";
        btn.appendChild(media);
      }
      btn.addEventListener("click", function(){
        goTo(activeCat, idx); resetTimer();
      });
      return btn;
    });

    if(!state.items.length && slidesWrap){
      slidesWrap.style.display = "none";
    }
  });

  /* Live sync: whenever a photo/video is added or removed anywhere in
     Portfolio (via the "Manage Media" modal), the Portfolio script calls
     window.__lwRefreshCategory(catKey) so this section rebuilds that
     category's slides/thumbs immediately - no page reload needed. */
  function buildSlideEl(state, cat, item, idx){
    var el = document.createElement("div");
    el.className = "lw-slide" + (idx === 0 ? " active" : "");
    var media;
    if(item.type === "video"){
      media = document.createElement("video");
      media.src = item.src;
      media.muted = true;
      media.loop = true;
      media.playsInline = true;
      media.preload = "metadata";
      var __cldPoster = item.src.match(/^(https?:\/\/res\.cloudinary\.com\/[^\/]+\/video\/upload\/)(.+)\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i);
      if(__cldPoster){ media.poster = __cldPoster[1] + "so_0/" + __cldPoster[2] + ".jpg"; }
    } else {
      media = document.createElement("img");
      media.src = optimizeImg(item.src, 1400, 82);
      media.alt = state.label + " — latest work";
      media.loading = idx === 0 ? "eager" : "lazy";
      media.decoding = "async";
    }
    media.addEventListener("error", function(){ handleBroken(cat, idx); });
    el.appendChild(media);
    if(item.link){
      var linkBtn = document.createElement("a");
      linkBtn.className = "lw-visit-btn";
      linkBtn.href = item.link;
      linkBtn.target = "_blank";
      linkBtn.rel = "noopener";
      linkBtn.innerHTML = '<i class="fa-solid fa-arrow-up-right-from-square"></i> Visit Website';
      linkBtn.addEventListener("click", function(e){ e.stopPropagation(); });
      el.appendChild(linkBtn);
    }
    if(state.slidesWrap) state.slidesWrap.appendChild(el);
    return el;
  }
  function buildThumbEl(state, cat, item, idx){
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lw-thumb" + (idx === 0 ? " active" : "");
    btn.setAttribute("aria-label", state.label + " item " + (idx + 1));
    var media;
    if(item.type === "video"){
      media = document.createElement("video");
      media.src = item.src;
      media.muted = true;
      media.playsInline = true;
      media.preload = "metadata";
      var __cldThumbPoster = item.src.match(/^(https?:\/\/res\.cloudinary\.com\/[^\/]+\/video\/upload\/)(.+)\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i);
      if(__cldThumbPoster){ media.poster = __cldThumbPoster[1] + "so_0/" + __cldThumbPoster[2] + ".jpg"; }
      var playIcon = document.createElement("span");
      playIcon.className = "lw-thumb-play";
      playIcon.innerHTML = '<i class="fa-solid fa-play"></i>';
      btn.appendChild(media);
      btn.appendChild(playIcon);
    } else {
      media = document.createElement("img");
      media.src = optimizeImg(item.src, 240, 70);
      media.alt = "";
      media.loading = "lazy";
      media.decoding = "async";
      btn.appendChild(media);
    }
    btn.addEventListener("click", function(){ goTo(activeCat, idx); resetTimer(); });
    return btn;
  }
  function rebuildCategory(cat){
    var state = CATS[cat];
    if(!state) return;
    var newItems = buildLatestFromPortfolio(cat, 5);
    var changed = newItems.length !== state.items.length;
    if(!changed){
      for(var i = 0; i < newItems.length; i++){
        if(newItems[i].src !== state.items[i].src || newItems[i].type !== state.items[i].type || newItems[i].link !== state.items[i].link){
          changed = true; break;
        }
      }
    }
    if(!changed) return;

    var wasActive = (cat === activeCat);
    if(wasActive){ stopTimer(); pauseAllVideos(); }

    state.items = newItems;
    state.current = 0;
    state.broken = {};
    state.preloaded = {};
    if(state.slidesWrap) state.slidesWrap.innerHTML = "";

    state.slideEls = state.items.map(function(item, idx){ return buildSlideEl(state, cat, item, idx); });
    state.thumbEls = state.items.map(function(item, idx){ return buildThumbEl(state, cat, item, idx); });

    if(state.slidesWrap) state.slidesWrap.style.display = state.items.length ? "" : "none";

    var countEl = document.getElementById("lwCount" + cat.charAt(0).toUpperCase() + cat.slice(1));
    if(countEl) countEl.textContent = state.items.length ? String(state.items.length) : "";

    var anyItemsNow = CAT_ORDER.some(function(c){ return CATS[c].items.length > 0; });
    if(anyItemsNow && stage.style.display === "none"){
      stage.style.display = "";
      if(thumbsWrap) thumbsWrap.style.display = "";
      if(tabsWrap) tabsWrap.style.display = "";
      if(empty) empty.classList.remove("show");
    }

    if(wasActive) activateCategory(cat, { force: true });
  }
  window.__lwRefreshCategory = function(catKey){
    if(CAT_ORDER.indexOf(catKey) === -1) return;
    rebuildCategory(catKey);
  };

  /* ---- helpers, scoped by category ---- */

  function nextValidIndex(cat, fromIdx){
    var state = CATS[cat];
    var n = state.items.length;
    for(var i = 1; i <= n; i++){
      var idx = (fromIdx + i) % n;
      if(!state.broken[idx]) return idx;
    }
    return fromIdx;
  }
  function prevValidIndex(cat, fromIdx){
    var state = CATS[cat];
    var n = state.items.length;
    for(var i = 1; i <= n; i++){
      var idx = ((fromIdx - i) % n + n) % n;
      if(!state.broken[idx]) return idx;
    }
    return fromIdx;
  }

  function preloadSlide(cat, idx, done){
    var state = CATS[cat];
    function finish(){ if(done) done(); }
    if(idx == null || idx < 0 || idx >= state.items.length){ finish(); return; }
    if(state.preloaded[idx]){ finish(); return; }
    state.preloaded[idx] = true;
    var item = state.items[idx];
    var el = state.slideEls[idx];
    var media = el && el.querySelector("img, video");
    if(!media){ finish(); return; }
    if(item.type === "video"){
      if(media.preload === "auto"){ finish(); return; }
      media.preload = "auto";
      var settled = false;
      var onReady = function(){
        if(settled) return;
        settled = true;
        media.removeEventListener("loadedmetadata", onReady);
        media.removeEventListener("error", onReady);
        finish();
      };
      media.addEventListener("loadedmetadata", onReady);
      media.addEventListener("error", onReady);
      media.load();
      /* Safety net: a stalled/slow network must never freeze the rest
         of the background queue - move on after 8s regardless. */
      setTimeout(onReady, 8000);
    } else if(media.loading === "lazy"){
      var img = new Image();
      img.decoding = "async";
      img.setAttribute("fetchpriority", "low");
      var optimizedSrc = optimizeImg(item.src, 1400, 82);
      var onImgDone = function(){ media.loading = "eager"; media.src = optimizedSrc; finish(); };
      img.onload = onImgDone;
      img.onerror = onImgDone;
      img.src = optimizedSrc;
    } else {
      finish();
    }
  }

  function preloadAround(cat, idx){
    preloadSlide(cat, idx);
    preloadSlide(cat, nextValidIndex(cat, idx));
    preloadSlide(cat, prevValidIndex(cat, idx));
    preloadSlide(cat, nextValidIndex(cat, nextValidIndex(cat, idx)));
  }

  function handleBroken(cat, idx){
    var state = CATS[cat];
    if(state.broken[idx]) return;
    state.broken[idx] = true;
    state.slideEls[idx].classList.add("broken");
    if(Object.keys(state.broken).length >= state.items.length && cat === activeCat){
      stopTimer();
      if(empty) empty.classList.add("show");
    }
    if(cat === activeCat && idx === state.current){
      stopTimer();
      next();
    }
  }

  /* Sound is fully automatic: whichever video is on screen right now
     plays with sound on its own, and goes silent the instant the
     slide changes or the stage scrolls off-screen - since only one
     category is ever visible at a time, there's never more than one
     audio source. Browsers only allow unmuted autoplay after the
     visitor has interacted with the page in some way; until then this
     falls back to muted automatically. */
  function activeVideoEl(){
    var state = CATS[activeCat];
    var el = state.slideEls[state.current];
    return el ? el.querySelector("video") : null;
  }
  function playCurrentVideo(){
    var vid = activeVideoEl();
    if(!vid) return;
    vid.currentTime = 0;
    vid.muted = !soundUnlocked;
    var p = vid.play();
    if(p && p.catch){
      p.catch(function(){
        vid.muted = true;
        vid.play().catch(function(){});
      });
    }
  }
  function pauseAllVideos(){
    CAT_ORDER.forEach(function(cat){
      CATS[cat].slideEls.forEach(function(el){
        var vid = el.querySelector("video");
        if(vid){ vid.pause(); vid.muted = true; }
      });
    });
  }

  var soundUnlocked = false;
  function unlockSoundOnFirstInteraction(){
    if(soundUnlocked) return;
    soundUnlocked = true;
    var vid = activeVideoEl();
    if(vid && vid.muted){
      vid.muted = false;
      var p = vid.play();
      if(p && p.catch){ p.catch(function(){ vid.muted = true; }); }
    }
    ["pointerdown", "keydown", "touchstart"].forEach(function(evt){
      stage.removeEventListener(evt, unlockSoundOnFirstInteraction);
    });
  }
  ["pointerdown", "keydown", "touchstart"].forEach(function(evt){
    stage.addEventListener(evt, unlockSoundOnFirstInteraction, { passive: true });
  });

  function goTo(cat, idx){
    var state = CATS[cat];
    if(state.broken[idx]) idx = nextValidIndex(cat, idx);
    if(cat === activeCat){
      state.slideEls[state.current].classList.remove("active");
      if(state.thumbEls[state.current]) state.thumbEls[state.current].classList.remove("active");
      pauseAllVideos();
      state.current = idx;
      state.slideEls[state.current].classList.add("active");
      if(state.thumbEls[state.current]) state.thumbEls[state.current].classList.add("active");
      playCurrentVideo();
      preloadAround(cat, state.current);
    } else {
      state.current = idx;
    }
  }
  function next(){ goTo(activeCat, nextValidIndex(activeCat, CATS[activeCat].current)); }
  function prev(){ goTo(activeCat, prevValidIndex(activeCat, CATS[activeCat].current)); }

  function currentDuration(){
    var state = CATS[activeCat];
    var item = state.items[state.current];
    if(item.type === "video"){
      var vid = activeVideoEl();
      if(vid && vid.duration && isFinite(vid.duration)){
        return Math.min(vid.duration * 1000, VIDEO_MAX_DURATION);
      }
      return VIDEO_MAX_DURATION;
    }
    return IMAGE_DURATION;
  }

  /* Live progress bar — fills up over the current slide's display
     time so visitors can see how long until it auto-advances. */
  function paintProgress(duration){
    if(!progressFill) return;
    progressFill.style.transition = "none";
    progressFill.style.width = "0%";
    void progressFill.offsetWidth; /* force reflow so the transition below restarts */
    progressFill.style.transition = "width " + duration + "ms linear";
    progressFill.style.width = "100%";
  }
  function freezeProgress(){
    if(!progressFill) return;
    var w = getComputedStyle(progressFill).width;
    progressFill.style.transition = "none";
    progressFill.style.width = w;
  }

  var timer = null;
  function startTimer(){
    stopTimer();
    if(!CATS[activeCat].items.length) return;
    var duration = currentDuration();
    paintProgress(duration);
    timer = setTimeout(function(){ next(); resetTimer(); }, duration);
  }
  function stopTimer(){
    if(timer){ clearTimeout(timer); timer = null; }
    freezeProgress();
  }
  function resetTimer(){ startTimer(); }

  /* ---- category / tab switching ---- */
  var activeCat = CAT_ORDER.find(function(c){ return CATS[c].items.length > 0; }) || CAT_ORDER[0];

  function moveIndicatorTo(tabEl, cat){
    if(!tabIndicator || !tabEl) return;
    tabIndicator.style.transform = "translateX(" + tabEl.offsetLeft + "px)";
    tabIndicator.style.width = tabEl.offsetWidth + "px";
    tabIndicator.style.setProperty("--cat-clr", CATS[cat].clr);
    tabIndicator.style.background = CATS[cat].clr;
    tabIndicator.style.boxShadow = "0 10px 24px -8px " + CATS[cat].shadow;
  }

  function activateCategory(cat, opts){
    opts = opts || {};
    if(cat === activeCat && !opts.force) return;
    var prevCat = activeCat;
    if(prevCat !== cat){
      stopTimer();
      pauseAllVideos();
      if(CATS[prevCat].slidesWrap) CATS[prevCat].slidesWrap.hidden = true;
    }
    activeCat = cat;
    var state = CATS[cat];
    if(state.slidesWrap) state.slidesWrap.hidden = false;

    /* CSS custom properties drive the tinted progress bar / nav-button
       hover / thumb active-border for whichever category is live. */
    stage.style.setProperty("--cat-clr", state.clr);
    stage.style.setProperty("--cat-shadow", state.shadow);
    if(thumbsWrap){
      thumbsWrap.style.setProperty("--cat-clr", state.clr);
      thumbsWrap.style.setProperty("--cat-shadow", state.shadow);
    }
    if(stageBadge){
      stageBadge.innerHTML = '<i class="fa-solid ' + state.icon + '"></i> ' + state.label;
    }
    if(empty) empty.classList.toggle("show", state.items.length === 0);
    stage.classList.toggle("is-empty", state.items.length === 0);

    /* Swap the thumbnail rail to this category's own thumbs */
    if(thumbsWrap){
      thumbsWrap.innerHTML = "";
      state.thumbEls.forEach(function(el){ thumbsWrap.appendChild(el); });
    }

    if(tabsWrap){
      tabsWrap.querySelectorAll(".lw-tab").forEach(function(btn){
        var isActive = btn.getAttribute("data-cat") === cat;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
        if(isActive) moveIndicatorTo(btn, cat);
      });
    }

    if(state.items.length){
      preloadAround(cat, state.current);
      playCurrentVideo();
      resetTimer();
      /* background-fill the rest of this category's items, one at a
         time, once the visitor lands here - same idle-queue approach
         as the initial warm-up below. */
      queueBackgroundPreload(cat);
    }
  }

  /* Prev / next arrow buttons */
  if(prevBtn) prevBtn.addEventListener("click", function(e){ e.stopPropagation(); prev(); resetTimer(); });
  if(nextBtn) nextBtn.addEventListener("click", function(e){ e.stopPropagation(); next(); resetTimer(); });

  /* Keyboard navigation when the stage has focus */
  stage.addEventListener("keydown", function(e){
    if(e.key === "ArrowLeft"){ prev(); resetTimer(); e.preventDefault(); }
    else if(e.key === "ArrowRight"){ next(); resetTimer(); e.preventDefault(); }
  });

  /* Touch: a horizontal swipe changes slides */
  var touchStartX = 0, touchStartY = 0, isSwiping = false;
  var SWIPE_THRESHOLD = 28;
  stage.addEventListener("touchstart", function(e){
    var t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    isSwiping = false;
  }, { passive: true });
  stage.addEventListener("touchmove", function(e){
    var t = e.touches[0];
    var dx = t.clientX - touchStartX;
    var dy = t.clientY - touchStartY;
    if(!isSwiping && Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)){
      isSwiping = true;
    }
  }, { passive: true });
  stage.addEventListener("touchend", function(e){
    if(isSwiping){
      var t = e.changedTouches && e.changedTouches[0];
      var dx = t ? t.clientX - touchStartX : 0;
      if(dx <= -SWIPE_THRESHOLD){ next(); resetTimer(); }
      else if(dx >= SWIPE_THRESHOLD){ prev(); resetTimer(); }
      isSwiping = false;
      e.preventDefault();
    }
  });
  stage.addEventListener("touchcancel", function(){ isSwiping = false; });

  /* Tab clicks */
  if(tabsWrap){
    tabsWrap.querySelectorAll(".lw-tab").forEach(function(btn){
      btn.addEventListener("click", function(){
        activateCategory(btn.getAttribute("data-cat"));
      });
    });
  }

  /* Item counts on each tab */
  CAT_ORDER.forEach(function(cat){
    var countEl = document.getElementById("lwCount" + cat.charAt(0).toUpperCase() + cat.slice(1));
    if(countEl) countEl.textContent = CATS[cat].items.length ? String(CATS[cat].items.length) : "";
  });

  /* Background-fetch the rest of a category's items, one at a time,
     closest-to-current first — mirrors the original single-column
     warm-up so Next/Prev never stalls on a cold fetch. */
  var idleQueue = window.requestIdleCallback || function(fn){ return setTimeout(fn, 200); };
  var queuedCats = {};
  function queueBackgroundPreload(cat){
    if(queuedCats[cat]) return;
    queuedCats[cat] = true;
    idleQueue(function(){
      var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if(conn && (conn.saveData || /2g/.test(conn.effectiveType || ""))){
        /* Visitor has asked for less data, or is on a very slow link -
           respect that; the preloadAround() warm-up already keeps
           normal navigation responsive. */
        return;
      }
      var state = CATS[cat];
      var order = [];
      for(var d = 1; d <= state.items.length; d++){
        var i = (state.current + d) % state.items.length;
        if(order.indexOf(i) === -1) order.push(i);
      }
      var qi = 0;
      function step(){
        while(qi < order.length && state.preloaded[order[qi]]) qi++;
        if(qi >= order.length) return;
        preloadSlide(cat, order[qi++], step);
      }
      step();
    }, { timeout: 3000 });
  }

  /* Pause auto-rotation and video playback while the slideshow is
     scrolled off-screen, and resume automatically when it's back in
     view - kinder to data usage and battery. */
  if(window.IntersectionObserver){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          playCurrentVideo();
          resetTimer();
        } else {
          stopTimer();
          pauseAllVideos();
        }
      });
    }, { threshold: 0.25 });
    io.observe(stage);
  }

  /* Kick things off on the first category with content */
  activateCategory(activeCat, { force: true });
  window.addEventListener("resize", function(){
    var activeBtn = tabsWrap && tabsWrap.querySelector('.lw-tab[data-cat="' + activeCat + '"]');
    if(activeBtn) moveIndicatorTo(activeBtn, activeCat);
  });
})();

/* --- Media protection: deter casual downloading of photos & videos ---
   Note: no client-side script can make images/videos 100% undownloadable
   (a screenshot always works), but this blocks the common, easy routes:
   right-click "Save as", drag-and-drop, the video download button, and
   the usual save/view-source keyboard shortcuts. */
(function(){
  function isProtectedTarget(t){
    if(!t || !t.closest) return false;
    if(t.closest('.lw-visit-btn')) return false;
    return !!t.closest('img, video, .sub-thumb, .lw-slide, .lightbox-media, .pfp-circle, .mm-tile');
  }

  // Block the right-click "Save image/video as..." menu on media
  document.addEventListener('contextmenu', function(e){
    if(isProtectedTarget(e.target)) e.preventDefault();
  }, false);

  // Block dragging an image/video out of the page (another way to save it)
  document.addEventListener('dragstart', function(e){
    var t = e.target;
    if(t && (t.tagName === 'IMG' || t.tagName === 'VIDEO')) e.preventDefault();
  }, false);

  // Block common save / view-source shortcuts (Ctrl/Cmd+S, Ctrl/Cmd+U)
  document.addEventListener('keydown', function(e){
    var k = (e.key || '').toLowerCase();
    if((e.ctrlKey || e.metaKey) && (k === 's' || k === 'u')) e.preventDefault();
  }, false);

  // Remove the native "download" option from any <video> element's
  // controls, disable Picture-in-Picture pop-out, and block its own
  // right-click menu. Runs for every video already on the page and
  // watches for ones added later (lightbox, latest-work slideshow,
  // hover previews, etc. are all created dynamically by this site).
  function lockDownVideo(v){
    v.setAttribute('controlsList', 'nodownload noremoteplayback'); // keep fullscreen, drop download
    v.setAttribute('disablePictureInPicture', '');
    v.oncontextmenu = function(){ return false; };
  }
  document.querySelectorAll('video').forEach(lockDownVideo);
  new MutationObserver(function(mutations){
    mutations.forEach(function(m){
      (m.addedNodes || []).forEach(function(node){
        if(node.nodeType !== 1) return;
        if(node.tagName === 'VIDEO') lockDownVideo(node);
        if(node.querySelectorAll) node.querySelectorAll('video').forEach(lockDownVideo);
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
})();


/* ===== Tech Stack tabs ===== */
(function(){
  var tabs = document.querySelectorAll('#tsTabs .ts-tab');
  var panels = document.querySelectorAll('#tsPanels .ts-panel');
  if(!tabs.length || !panels.length) return;
  panels.forEach(function(panel){
    panel.querySelectorAll('.ts-chip').forEach(function(chip){
      if(!chip.querySelector('.ts-sheen')){
        var s = document.createElement('span');
        s.className = 'ts-sheen';
        s.setAttribute('aria-hidden','true');
        chip.appendChild(s);
      }
    });
  });
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      var target = tab.getAttribute('data-tab');
      tabs.forEach(function(t){ t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('active'); tab.setAttribute('aria-selected','true');
      panels.forEach(function(p){
        p.classList.toggle('active', p.getAttribute('data-panel') === target);
      });
    });
  });
})();

