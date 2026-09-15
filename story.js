'use strict';
(() => {
 const formEndpoint='https://script.google.com/macros/s/AKfycbypTqKLgla9IJWxBsnlmJt8q1g3eeq3QPBKT_bsZ34-WAj2JCDvUFKD731Lv1gD9txjkQ/exec';
 async function sendToSheet(payload){
  await fetch(formEndpoint,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
 }
 document.getElementById('dateTitle').textContent='봄날, 우리 만나요.';
 const announcement=document.querySelector('.announcement');
 const album=document.querySelector('.album');
 const musicCard=announcement.querySelector('.music-card');
 announcement.after(album);
 album.after(musicCard);
 musicCard.classList.add('standalone-music');
 const albumOrder=[2,3,4,0,1,5,6,7,8,10,11,9];
 const galleryGrid=document.querySelector('.gallery-grid');
 const galleryButtons=[...galleryGrid.querySelectorAll('[data-photo]')];
 const galleryScroll=document.querySelector('.gallery-scroll');
 const galleryFigures=[...galleryScroll.querySelectorAll('figure')];
 albumOrder.forEach((sourceIndex,displayIndex)=>{
  const button=galleryButtons[sourceIndex];
  button.dataset.photo=String(displayIndex);
  galleryGrid.append(button);
  const figure=galleryFigures[sourceIndex];
  figure.id=`photo-${displayIndex}`;
  galleryScroll.append(figure);
 });
 const shuttle=document.createElement('div');
 shuttle.className='shuttle-info';
 shuttle.innerHTML='<dt>셔틀 안내</dt><dd>8호선 문정역에 내리시면 셔틀버스 및 안내 기사들이 ‘루이비스컨벤션웨딩홀’ 이름표를 들고 서 있습니다. 걸어서 이동 가능하지만, 셔틀을 타고 편하게 오세요.</dd>';
 document.querySelector('.event-summary').append(shuttle);
 const adultInfo=document.querySelector('.adult-info');
 const reception=document.querySelector('.reception');
 const afterParty=document.querySelector('.after-party');
 if(reception&&afterParty)adultInfo.after(reception,afterParty);
 const calendar=document.getElementById('calendarDialog');
 const gallery=document.getElementById('galleryDialog');
 let returnFocus=null;
 function show(dialog){returnFocus=document.activeElement;dialog.showModal()}
 [calendar,gallery].forEach(dialog=>{
  dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
  dialog.addEventListener('close',()=>returnFocus?.focus({preventScroll:true}));
 });
 document.getElementById('calendarOpen').addEventListener('click',()=>show(calendar));
 document.querySelectorAll('[data-copy-text]').forEach(button=>button.addEventListener('click',async()=>{
  const original=button.textContent;
  try{await navigator.clipboard.writeText(button.dataset.copyText);button.textContent='복사되었습니다.'}
  catch{button.textContent='주소를 길게 눌러 복사해 주세요.'}
  setTimeout(()=>{button.textContent=original},1800);
 }));
 document.querySelectorAll('[data-photo]').forEach(button=>button.addEventListener('click',()=>{
  show(gallery);const item=document.getElementById('photo-'+button.dataset.photo);const scroller=gallery.querySelector('.gallery-scroll');
  requestAnimationFrame(()=>scroller.scrollTo({top:item.offsetTop-scroller.offsetTop,behavior:'instant'}));
 }));
 // Prepare the file in advance so native sharing stays inside the tap gesture.
 let calendarFile=null;
 fetch('wedding-demo.ics').then(r=>{if(!r.ok)throw Error('calendar');return r.blob()}).then(blob=>{calendarFile=new File([blob],'진환-수정-결혼식.ics',{type:'text/calendar'})}).catch(()=>{});
 document.getElementById('otherCalendar').addEventListener('click',async()=>{
  const help=document.getElementById('calendarHelp');
  if(calendarFile&&navigator.canShare?.({files:[calendarFile]})){
   try{await navigator.share({files:[calendarFile],title:'진환 & 수정 결혼식'});return}catch(error){if(error.name==='AbortError')return}
  }
  help.textContent='이 기기에서는 앱 선택이 지원되지 않아요. 일정 파일을 다운로드한 뒤 원하는 캘린더 앱에서 열어 주세요.';
  calendar.querySelector('.ics-download').focus();
 });
 const cheerForm=document.getElementById('cheerForm');
 const cheerName=document.getElementById('cheerName');
 const cheerText=document.getElementById('cheerText');
 const cheerCount=document.getElementById('cheerCount');
 const cheerList=document.getElementById('cheerList');
 const cheerCarousel=document.querySelector('.cheer-carousel');
 const cheerEmpty=document.getElementById('cheerEmpty');
 const cheerPagination=document.getElementById('cheerPagination');
 const cheerPrev=document.getElementById('cheerPrev');
 const cheerNext=document.getElementById('cheerNext');
 const cheerPage=document.getElementById('cheerPage');
 const messages=[
  {body:'두 분의 새로운 시작을 진심으로 축하드립니다. 늘 웃음 가득한 날들 되세요.',date:'2026. 09. 14.'},
  {body:'봄날처럼 따뜻하고 아름다운 결혼식이 되기를 바랍니다.',date:'2026. 09. 14.'},
  {body:'서로의 가장 좋은 친구가 되어 오래오래 행복하세요.',date:'2026. 09. 14.'},
  {body:'두 분의 앞날을 축복합니다. 행복한 추억 많이 만들어 가세요!',date:'2026. 09. 14.'},
  {body:'결혼을 진심으로 축하드려요. 사랑 가득한 가정 이루시길 바랍니다.',date:'2026. 09. 14.'}
 ];let currentPage=0;
 function renderCheers(){
  const pages=[];for(let i=0;i<messages.length;i+=10)pages.push(messages.slice(i,i+10));
  const maxPage=Math.max(0,pages.length-1);currentPage=Math.min(currentPage,maxPage);
  cheerList.replaceChildren();
  pages.forEach(page=>{const pageElement=document.createElement('div');pageElement.className='cheer-page';page.forEach(message=>{const item=document.createElement('article');const meta=document.createElement('p');const body=document.createElement('p');meta.textContent=`${message.name||'익명'} · ${message.date}`;body.textContent=message.body;item.append(meta,body);pageElement.append(item)});cheerList.append(pageElement)});
  cheerList.style.transform=`translateX(-${currentPage*cheerCarousel.clientWidth}px)`;cheerEmpty.hidden=messages.length>0;
  cheerPagination.hidden=messages.length<=10;cheerPage.textContent=`${currentPage+1} / ${Math.max(1,pages.length)}`;
  cheerPrev.disabled=currentPage===0;cheerNext.disabled=currentPage===maxPage;
 }
 function moveCheerPage(direction){currentPage+=direction;renderCheers()}
 renderCheers();
 cheerPrev.addEventListener('click',()=>moveCheerPage(-1));cheerNext.addEventListener('click',()=>moveCheerPage(1));
 window.addEventListener('resize',()=>{if(messages.length)renderCheers()},{passive:true});
 cheerText.addEventListener('input',()=>{cheerCount.textContent=`${cheerText.value.length} / 300`});
 cheerText.addEventListener('focus',()=>setTimeout(()=>cheerText.scrollIntoView({block:'center',behavior:'smooth'}),150));
 cheerForm.addEventListener('submit',async event=>{
  event.preventDefault();
  const message=cheerText.value.trim();const name=cheerName.value.trim()||'익명';
  if(!message){cheerText.focus();return}
  const button=cheerForm.querySelector('button[type="submit"]');const original=button.textContent;button.disabled=true;button.textContent='전달 중…';
  try{await sendToSheet({type:'cheer',name,message});messages.unshift({name,body:message,date:new Intl.DateTimeFormat('ko-KR',{dateStyle:'short',timeStyle:'short'}).format(new Date())});currentPage=0;renderCheers();cheerForm.reset();cheerCount.textContent='0 / 300';cheerText.blur();button.textContent='전달되었습니다.'}
  catch{button.textContent='다시 시도해 주세요.'}
  setTimeout(()=>{button.disabled=false;button.textContent=original},1800);
 });
 const afterPartyForm=document.getElementById('afterPartyForm');
 if(afterPartyForm){
 const partyContact=document.getElementById('partyContact');
 partyContact.addEventListener('input',()=>{const digits=partyContact.value.replace(/\D/g,'').slice(0,11);partyContact.value=digits.length<4?digits:digits.length<8?`${digits.slice(0,3)}-${digits.slice(3)}`:`${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`});
 afterPartyForm.addEventListener('submit',async event=>{
  event.preventDefault();
  const status=document.getElementById('afterPartyStatus');
  const name=document.getElementById('partyName').value.trim();const contact=document.getElementById('partyContact').value.trim();
  if(!name||!contact)return;
  const button=afterPartyForm.querySelector('button[type="submit"]');const original=button.textContent;button.disabled=true;button.textContent='전달 중…';
  try{await sendToSheet({type:'afterParty',name,contact});status.hidden=false;status.textContent='참가 의사를 전달했습니다. 감사합니다.';afterPartyForm.reset();button.textContent='전달되었습니다.'}
  catch{status.hidden=false;status.textContent='전달하지 못했습니다. 다시 시도해 주세요.';button.textContent='다시 시도해 주세요.'}
  setTimeout(()=>{button.disabled=false;button.textContent=original},1800);
 });
 }
})();
