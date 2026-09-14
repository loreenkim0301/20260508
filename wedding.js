'use strict';
const opening=document.getElementById('opening');
const invitation=document.getElementById('invitation');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let timers=[];
function later(fn,ms){timers.push(setTimeout(fn,ms));}
function clearTimers(){timers.forEach(clearTimeout);timers=[];}
let mainMusicAttempted=false;
function enterMain(){document.body.classList.add('arrived');if(!mainMusicAttempted){mainMusicAttempted=true;startMainMusic();}}
function finishOpening(focus=false){clearTimers();window.scrollTo({top:0,behavior:'instant'});opening.hidden=true;opening.setAttribute('aria-hidden','true');invitation.inert=false;document.body.classList.remove('intro-running');enterMain();if(focus)document.querySelector('.monogram').focus({preventScroll:true});}
function startOpening(){clearTimers();mainMusicAttempted=false;audio.pause();if(reduced.matches){finishOpening();return}window.scrollTo({top:0,behavior:'instant'});opening.hidden=false;opening.removeAttribute('aria-hidden');opening.className='opening';invitation.inert=true;document.body.classList.remove('arrived');document.body.classList.add('intro-running');later(()=>opening.classList.add('zooming'),210);later(()=>opening.classList.add('unsealing'),648);later(()=>opening.classList.add('unfolding','card-rising'),816);later(()=>opening.classList.add('card-fading'),7040);later(()=>{opening.classList.add('dissolving');enterMain()},7440);later(()=>finishOpening(),9240);}
function advanceOpening(){if(opening.hidden||opening.classList.contains('dissolving'))return;if(!opening.classList.contains('card-rising')){opening.classList.add('unsealing','unfolding','card-rising');return}clearTimers();opening.classList.add('card-fading','dissolving');enterMain();later(()=>finishOpening(),1100);}
document.getElementById('replay').addEventListener('click',()=>startOpening());document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!opening.hidden)finishOpening(true)});
opening.addEventListener('click',event=>{if(!event.target.closest('button,a,input'))advanceOpening()});
const audio=document.getElementById('audio');const music=document.getElementById('music');const record=document.getElementById('record');let loading=false;
function updateCountdown(){const target=Date.UTC(2027,4,8);const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const value=type=>Number(parts.find(part=>part.type===type).value);const today=Date.UTC(value('year'),value('month')-1,value('day'));const days=Math.round((target-today)/86400000);const label=days===0?'D-DAY':days>0?`D-${days}`:`D+${Math.abs(days)}`;document.getElementById('countdown').textContent=label;}
updateCountdown();
function syncMusic(){const on=!audio.paused;document.body.classList.toggle('is-playing',on);[music,record].forEach(b=>{b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',on?'음악 일시정지':'Love, on the Swing 재생')});document.getElementById('musicLabel').textContent=on?'음악 끄기':'음악 켜기';document.querySelector('.record-icon').textContent=on?'Ⅱ':'▷';document.querySelector('.record-label').textContent=on?'정지':'재생';document.getElementById('musicStatus').textContent='음악을 종료하시려면 정지를 눌러 주세요.'}
async function startMainMusic(){try{await audio.play()}catch{document.getElementById('musicLabel').textContent='음악 재생';document.getElementById('musicStatus').textContent='음악을 종료하시려면 정지를 눌러 주세요.'}}
async function toggleMusic(){if(loading)return;if(audio.paused){loading=true;music.classList.add('is-loading');try{await audio.play()}catch{document.getElementById('musicStatus').textContent='재생하지 못했어요. 다시 눌러 주세요.'}finally{loading=false;music.classList.remove('is-loading')}}else audio.pause()}
music.addEventListener('click',toggleMusic);record.addEventListener('click',toggleMusic);audio.addEventListener('play',syncMusic);audio.addEventListener('pause',syncMusic);reduced.addEventListener('change',()=>{if(reduced.matches)finishOpening()});
// Keep the invitation available if an image is slow or cannot load.
if(document.readyState==='complete')startOpening();else{let started=false;const begin=()=>{if(!started){started=true;startOpening()}};window.addEventListener('load',begin,{once:true});setTimeout(begin,1600)}
window.addEventListener('pageshow',event=>{if(event.persisted)startOpening()});
