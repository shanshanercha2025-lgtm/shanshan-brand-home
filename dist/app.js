document.documentElement.classList.add('js');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const cards = Array.from(document.querySelectorAll('.deck-card'));
const poses = [
  {x:0,y:0,r:-5}, {x:-19,y:1,r:-18}, {x:19,y:3,r:14}, {x:-4,y:6,r:7}, {x:13,y:5,r:23}
];
let current = 0, busy = false;
function arrangeDeck() {
  cards.forEach((card,i)=>{
    const rank = (i-current+cards.length)%cards.length, p=poses[rank];
    card.style.zIndex=String(cards.length-rank);
    card.style.transform=`translate(${p.x}%, ${p.y}%) rotate(${p.r}deg)`;
    card.style.opacity='1';
    card.setAttribute('aria-hidden',String(rank!==0));
  });
  document.querySelector('#deckTitle').textContent=cards[current].dataset.title;
  document.querySelector('#deckNote').textContent=cards[current].dataset.note;
  document.querySelector('#deckIndex').textContent=String(current+1).padStart(2,'0');
}
function nextCard(){
  if(busy)return;
  busy=true;
  const departing=cards[current];
  departing.style.transform='translate(95%, -14%) rotate(29deg)';
  departing.style.opacity='0';
  setTimeout(()=>{
    current=(current+1)%cards.length;
    departing.style.transition='none';
    arrangeDeck();
    departing.getBoundingClientRect();
    departing.style.transition='';
    busy=false;
  },reducedMotion.matches?0:500);
}
arrangeDeck();
document.querySelector('#deckTotal').textContent=String(cards.length).padStart(2,'0');
document.querySelector('#deckNext').addEventListener('click',nextCard);
document.querySelector('#deck').addEventListener('click',nextCard);

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const wildSection=document.querySelector('.wild-section'),wildImage=document.querySelector('.wild-image'),wildType=document.querySelector('.wild-type');
let ticking=false;
function updateScroll(){
  if(!reducedMotion.matches){
    const rect=wildSection.getBoundingClientRect(),vh=window.innerHeight;
    if(rect.top<vh&&rect.bottom>0){
      const progress=Math.max(0,Math.min(1,(vh-rect.top)/(rect.height+vh)));
      wildImage.style.transform=`rotate(${(progress-.5)*-8}deg) scale(${.96+progress*.12})`;
      wildType.style.transform=`translateX(${-8+progress*12}%)`;
    }
  }
  ticking=false;
}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}},{passive:true});
updateScroll();
const menuToggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.header nav');
function closeMenu(){menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','展开导航');nav.classList.remove('open');}
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'收起导航':'展开导航');nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const teaData={
  osmanthusGift:{title:'桂花茶 · 扎染礼盒',image:'osmanthus-gift',gift:true,description:'金黄桂花点缀茶饼，蓝白扎染布与蓝金茶管相伴。展开礼盒，茶香与手作的细节一起映入眼帘，也把一份心意交到喜欢的人手里。',tags:['桂花茶','蓝白扎染','茶礼心意']},
  newYearGift:{title:'马上 HAPPY · 新年茶礼',image:'new-year-gift',gift:true,poster:true,description:'新年开运的红色纹样，装进一盒糯米普洱挂耳茶。以「马上 HAPPY」的祝福，为团聚、拜访和新一年的开始添一份暖意。',tags:['糯米普洱','新派挂耳茶','新年茶礼']},
  goldenGift:{title:'滇红大金针 · 罐装茶礼',image:'golden-black-gift',gift:true,poster:true,description:'特级滇红大金针，以红色茶罐呈现。让云南临沧的红茶，成为一份可以慢慢品味的心意。',tags:['滇红大金针','罐装茶礼','云南临沧']},
  blueGift:{title:'蓝染成礼 · 随行茶礼',image:'blue-gift',gift:true,description:'蓝白纹样的茶礼，搭配一只随行杯。从日常的一杯茶，到送给惦记之人的一份礼物，把山野的心意带在身边。',tags:['蓝白纹样','茶与随行杯','日常茶礼']},
  puer:{title:'糯米普洱挂耳茶',image:'puer',description:'温润的普洱，遇见亲切的糯香。把茶袋挂在杯沿，注入热水，就有了忙碌之间的一点暖。',tags:['糯米普洱','挂耳冲泡','日常随行']},
  moonlight:{title:'月光白茶小方片',image:'moonlight',description:'花香蜜韵，藏进轻巧的小方片。想喝茶的时候，取一片、放进杯里，让一段清闲慢慢舒展。',tags:['月光白茶','小方片','花香蜜韵']},
  spring:{title:'一罐春山',image:'spring',description:'一抹蓝白，一罐春意。把山野的清新收好，也把每一天的小小期待，放进喜欢的杯子。',tags:['蓝白茶罐','春日茶事','一杯清闲']}
};
const dialog=document.querySelector('#teaDialog');
let lastFocus;
document.querySelectorAll('[data-tea]').forEach(button=>button.addEventListener('click',()=>{
  const data=teaData[button.dataset.tea];lastFocus=button;
  document.querySelector('#dialogTitle').textContent=data.title;
  document.querySelector('#dialogEyebrow').textContent=data.gift?'山山而茶 / TEA AS A GIFT':'山山而茶 / OUR TEA';
  dialog.classList.toggle('gift-dialog',Boolean(data.gift));
  dialog.classList.toggle('poster-dialog',Boolean(data.poster));
  document.querySelector('#dialogDescription').textContent=data.description;
  const img=document.querySelector('#dialogImage');img.src=`assets/${data.image}.jpg`;img.alt=data.title;
  document.querySelector('#dialogTags').replaceChildren(...data.tags.map(t=>{const span=document.createElement('span');span.textContent=t;return span;}));
  dialog.showModal();document.body.style.overflow='hidden';
}));
function closeDialog(){dialog.close();}
document.querySelector('.dialog-close').addEventListener('click',closeDialog);
document.querySelector('.dialog-done').addEventListener('click',closeDialog);
dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)closeDialog();}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';lastFocus?.focus();});
document.querySelector('#copyBrand').addEventListener('click',async()=>{
  const status=document.querySelector('#copyStatus');
  try{await navigator.clipboard.writeText('山山而茶');status.textContent='已复制，去搜索认识我们。';}
  catch{status.textContent='搜索品牌名：山山而茶';}
});
function updateTime(){const time=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());document.querySelector('.local-time').textContent=time;}
updateTime();setInterval(updateTime,60000);
document.querySelector('#year').textContent=new Intl.DateTimeFormat('en',{year:'numeric',timeZone:'Asia/Shanghai'}).format(new Date());
