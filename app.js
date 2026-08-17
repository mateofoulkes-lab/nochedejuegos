import {joinRoom,selfId} from 'https://esm.run/trystero'

const APP_ID='noche-de-juegos-mateofoulkes-lab-v3'
const ROOM_ID='mesa-unica'
const VERSION='0.3.0'
const $=s=>document.querySelector(s)
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))
const rand=a=>a[Math.floor(Math.random()*a.length)]
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.remove('hidden');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.add('hidden'),2200)}

let myName=localStorage.getItem('ndj-name')||''
let room,actions={},peers={},isHost=false,hostId=null,hostSeen=false,claimTimer=null
let selectedGame=null,state=null,myPrivate=null
const used={chameleon:new Set(),spyfall:new Set()}

const gameNames={chameleon:'Camaleón',spyfall:'Spyfall',coup:'Golpe'}
const chameleonWords={
  Animales:['Pingüino','Jirafa','Elefante','Tiburón','Conejo','Pulpo','Cocodrilo','Panda','Flamenco','Murciélago','Canguro','Caracol','Medusa','Camello','Mapache'],
  Comidas:['Pizza','Empanada','Sushi','Hamburguesa','Taco','Milanesa','Helado','Ravioles','Paella','Choripán','Tiramisú','Pochoclo','Ñoquis','Croissant','Ceviche'],
  Lugares:['Playa','Hospital','Aeropuerto','Museo','Cementerio','Supermercado','Teatro','Camping','Biblioteca','Casino','Zoológico','Estación','Gimnasio','Iglesia','Parque'],
  Objetos:['Paraguas','Martillo','Cepillo','Tijera','Almohada','Valija','Linterna','Escoba','Sacacorchos','Brújula','Termómetro','Candado','Tostadora','Telescopio','Matafuegos'],
  Personajes:['Batman','Shrek','Drácula','Superman','Barbie','Pinocho','Tarzán','Godzilla','Sherlock Holmes','Mario','Homero Simpson','Cenicienta','Darth Vader','Frankenstein','Robin Hood'],
  Profesiones:['Médico','Bombero','Abogado','Panadero','Piloto','Astronauta','Dentista','Carpintero','Actor','Periodista','Veterinario','Electricista','Chef','Arquitecto','Profesor'],
  Películas:['Titanic','Matrix','Toy Story','Jurassic Park','El Padrino','Rocky','Avatar','Psicosis','Gladiador','Shrek','Alien','Volver al Futuro','El Exorcista','Terminator','Jumanji'],
  Música:['Guitarra','Piano','Batería','Violín','Trompeta','Acordeón','Saxofón','Arpa','Flauta','Bajo','Tambor','Ukelele','Órgano','Maraca','Banjo'],
  Acciones:['Dormir','Bailar','Nadar','Cocinar','Estornudar','Escalar','Mentir','Correr','Susurrar','Aplaudir','Roncar','Bostezar','Gatear','Silbar','Saltar'],
  Naturaleza:['Volcán','Cascada','Desierto','Glaciar','Bosque','Tormenta','Isla','Río','Montaña','Arcoíris','Pantano','Cueva','Acantilado','Oasis','Huracán'],
  Tecnología:['Robot','Dron','Impresora','Joystick','Router','Satélite','Teclado','Auriculares','Proyector','Pendrive','Smartwatch','Webcam','Microchip','Consola','GPS'],
  Argentina:['Mate','Obelisco','Asado','Tango','Fernet','Alfajor','Subte','Bombonera','Patagonia','Dulce de leche','Colectivo','Milanesa','Termo','Malvinas','Choripán']
}

const spyLocations={
  'Aeropuerto':['Piloto','Azafata','Pasajero','Seguridad','Mecánico','Controlador aéreo'],
  'Hospital':['Médico','Enfermero','Paciente','Cirujano','Visitante','Camillero'],
  'Restaurante':['Chef','Mozo','Cliente','Encargado','Lavaplatos','Crítico gastronómico'],
  'Playa':['Guardavidas','Turista','Vendedor','Surfista','Pescador','Fotógrafo'],
  'Teatro':['Actor','Director','Espectador','Iluminador','Acomodador','Tramoyista'],
  'Escuela':['Docente','Alumno','Director','Preceptor','Portero','Padre'],
  'Supermercado':['Cajero','Cliente','Repositor','Gerente','Seguridad','Proveedor'],
  'Hotel':['Recepcionista','Huésped','Botones','Gerente','Mucama','Conserje'],
  'Estadio':['Jugador','Árbitro','Hincha','Periodista','Seguridad','Entrenador'],
  'Museo':['Guía','Turista','Curador','Guardia','Restaurador','Estudiante'],
  'Camping':['Campista','Guardaparque','Excursionista','Cocinero','Guía','Fotógrafo'],
  'Banco':['Cajero','Cliente','Gerente','Seguridad','Contador','Auditor'],
  'Crucero':['Capitán','Pasajero','Camarero','Animador','Mecánico','Salvavidas'],
  'Comisaría':['Policía','Detenido','Abogado','Comisario','Testigo','Periodista'],
  'Peluquería':['Peluquero','Cliente','Aprendiz','Recepcionista','Repartidor','Dueño'],
  'Circo':['Payaso','Trapecista','Espectador','Domador','Vendedor','Presentador'],
  'Biblioteca':['Bibliotecario','Estudiante','Profesor','Visitante','Investigador','Guardia'],
  'Gimnasio':['Entrenador','Socio','Recepcionista','Personal trainer','Limpieza','Fisioterapeuta'],
  'Casamiento':['Novio','Novia','Invitado','Fotógrafo','Mozo','DJ'],
  'Funeral':['Familiar','Sacerdote','Empleado','Amigo','Florista','Chofer'],
  'Casino':['Crupier','Jugador','Seguridad','Cajero','Mozo','Gerente'],
  'Estación de tren':['Maquinista','Pasajero','Guarda','Vendedor','Policía','Inspector'],
  'Submarino':['Capitán','Marinero','Ingeniero','Científico','Médico','Cocinero'],
  'Nave espacial':['Astronauta','Comandante','Ingeniero','Científico','Médico','Turista espacial'],
  'Zoológico':['Cuidador','Veterinario','Visitante','Guía','Vendedor','Fotógrafo'],
  'Canal de TV':['Conductor','Camarógrafo','Productor','Invitado','Maquillador','Técnico'],
  'Obra en construcción':['Albañil','Arquitecto','Ingeniero','Inspector','Electricista','Capataz'],
  'Parque de diversiones':['Visitante','Operador','Vendedor','Seguridad','Mascota','Mecánico'],
  'Spa':['Masajista','Cliente','Recepcionista','Esteticista','Limpieza','Gerente'],
  'Fábrica':['Operario','Supervisor','Técnico','Ingeniero','Seguridad','Camionero'],
  'Iglesia':['Sacerdote','Fiel','Turista','Monaguillo','Músico','Sacristán'],
  'Cine':['Espectador','Proyeccionista','Vendedor','Acomodador','Gerente','Crítico'],
  'Bar':['Bartender','Cliente','Mozo','Músico','Seguridad','Dueño'],
  'Veterinaria':['Veterinario','Cliente','Asistente','Repartidor','Peluquero canino','Visitante'],
  'Universidad':['Profesor','Alumno','Decano','Investigador','Bibliotecario','Bedel'],
  'Tribunal':['Juez','Abogado','Acusado','Testigo','Periodista','Secretario'],
  'Granja':['Granjero','Veterinario','Visitante','Peón','Comprador','Camionero']
}

const spyQuestions=[
  '¿Venís seguido acá?','¿Qué ropa usarías acá?','¿A qué hora preferís venir?','¿Vendrías con chicos?','¿Qué ruido se escucha normalmente?','¿Qué olor esperás encontrar?','¿Pagarías por estar acá?','¿Qué sería raro traer a este lugar?','¿Qué parte del lugar evitarías?','¿Se trabaja o se viene por placer?','¿Hay que reservar?','¿Qué objeto sería útil tener encima?','¿Qué pasa si venís de noche?','¿Qué tipo de persona viene mucho acá?','¿Qué tan limpio suele estar?','¿Te quedarías varias horas?','¿Es mejor venir solo o acompañado?','¿Hay uniforme?','¿Qué sería lo peor que podría pasar acá?','¿Sacaría fotos alguien acá?','¿Se come normalmente acá?','¿Hay que hacer silencio?','¿Podrías dormir acá?','¿Qué edad tiene la gente que suele venir?','¿Hay que esperar mucho?','¿Te sentirías cómodo descalzo?','¿Hay mucha tecnología alrededor?','¿Suele haber filas?','¿Qué llevarías en una mochila?','¿Hay animales cerca normalmente?','¿Qué estación del año es mejor?','¿Es un buen lugar para una cita?','¿Qué cosa estaría prohibida?','¿Te gustaría trabajar acá?','¿Qué harías apenas llegás?','¿Qué harías antes de irte?','¿Hay mucha gente desconocida?','¿Qué tipo de calzado conviene?','¿Es común escuchar música?','¿Podrías venir vestido elegante?'
]

const coupRoleInfo={
  Duque:'Toma 3 monedas. Bloquea ayuda extranjera.',
  Asesino:'Paga 3 para intentar eliminar una influencia.',
  Capitán:'Roba hasta 2 monedas. También bloquea robos.',
  Embajador:'Cambia cartas con el mazo. También bloquea robos.',
  Condesa:'Bloquea un asesinato.'
}
const coupDeckBase=['Duque','Duque','Duque','Asesino','Asesino','Asesino','Capitán','Capitán','Capitán','Embajador','Embajador','Embajador','Condesa','Condesa','Condesa']
let coupDeck=[]

if(myName)$('#nameInput').value=myName
$('#enterBtn').onclick=()=>{const n=$('#nameInput').value.trim();if(!n)return toast('Poné un nombre');myName=n;localStorage.setItem('ndj-name',n);start()}

function start(){
  $('#identity').classList.add('hidden');$('#main').classList.remove('hidden')
  room=joinRoom({appId:APP_ID},ROOM_ID);setupActions()
  room.onPeerJoin=id=>{peers[id]={id,name:'Conectando…'};renderAll();actions.hello.send({name:myName,host:isHost,game:selectedGame},{target:id});if(isHost){actions.snapshot.send(snapshot(),{target:id});sendPrivate(id)}}
  room.onPeerLeave=id=>{delete peers[id];if(id===hostId){hostId=null;hostSeen=false;isHost=false;scheduleClaim();toast('El admin salió. Reorganizando mesa…')}renderAll()}
  $('#netDot').classList.add('on');$('#netText').textContent='Mesa P2P activa';scheduleClaim();renderAll()
}

function setupActions(){
  for(const n of ['hello','host','snapshot','choose','private','cmd'])actions[n]=room.makeAction(n)
  actions.hello.onMessage=(d,{peerId})=>{peers[peerId]={id:peerId,name:d.name||'Jugador'};if(d.host)adoptHost(peerId);if(d.game&&!selectedGame)selectedGame=d.game;if(isHost){actions.hello.send({name:myName,host:true,game:selectedGame},{target:peerId});actions.snapshot.send(snapshot(),{target:peerId});sendPrivate(peerId)}renderAll()}
  actions.host.onMessage=(_d,{peerId})=>{if(isHost){actions.hello.send({name:myName,host:true,game:selectedGame},{target:peerId});return}adoptHost(peerId);renderAll()}
  actions.snapshot.onMessage=(d,{peerId})=>{if(hostId&&peerId!==hostId)return;adoptHost(peerId);selectedGame=d.game||null;state=d.state||null;if(!state)myPrivate=null;renderAll()}
  actions.choose.onMessage=(d,{peerId})=>{if(peerId!==hostId)return;selectedGame=d.game||null;state=null;myPrivate=null;renderAll()}
  actions.private.onMessage=(d,{peerId})=>{if(hostId&&peerId!==hostId)return;myPrivate=d;renderGame()}
  actions.cmd.onMessage=(d,{peerId})=>{if(isHost)handleCommand(peerId,d)}
}

function scheduleClaim(){clearTimeout(claimTimer);claimTimer=setTimeout(()=>{if(!hostSeen&&!hostId)becomeHost()},850)}
function becomeHost(){isHost=true;hostId=selfId;hostSeen=true;actions.host.send({});actions.hello.send({name:myName,host:true,game:selectedGame});toast('Sos el admin');renderAll()}
function adoptHost(id){if(isHost&&id!==selfId)return;hostId=id;hostSeen=true;isHost=id===selfId;clearTimeout(claimTimer)}
function allPlayers(){return [{id:selfId,name:myName},...Object.values(peers)].filter((p,i,a)=>a.findIndex(x=>x.id===p.id)===i)}
function playerName(id){return id===selfId?myName:(peers[id]?.name||'Jugador')}

function renderAll(){
  const ps=allPlayers();$('#players').innerHTML=ps.map(p=>`<div class="player"><span>${esc(p.name)}${p.id===selfId?' <span class="muted">(vos)</span>':''}</span><span>${p.id===hostId?'👑 admin':'●'}</span></div>`).join('')
  $('#rolePill').textContent=isHost?'👑 Admin':'🎲 Jugador'
  $('#selector').classList.toggle('hidden',!!selectedGame||!isHost);$('#waiting').classList.toggle('hidden',!!selectedGame||isHost);$('#game').classList.toggle('hidden',!selectedGame)
  document.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>chooseGame(b.dataset.game));renderGame()
}
function chooseGame(g){if(!isHost)return;selectedGame=g;state=null;myPrivate=null;actions.choose.send({game:g});actions.snapshot.send(snapshot());renderAll()}
function snapshot(){return {version:VERSION,game:selectedGame,state:state?{started:state.started,round:state.round,starter:state.starter}:null}}
function sendPrivate(id){if(state?.privateById?.[id])actions.private.send(state.privateById[id],{target:id})}
function sendAllPrivate(){for(const [id,d] of Object.entries(state.privateById)){if(id===selfId)myPrivate=d;else actions.private.send(d,{target:id})}}
function nextUnique(kind,values,keyFn=x=>x){const pool=values.filter(x=>!used[kind].has(keyFn(x)));if(!pool.length){used[kind].clear();return rand(values)}const pick=rand(pool);used[kind].add(keyFn(pick));return pick}

function startRound(){
  if(!isHost)return;const ps=allPlayers();if(ps.length!==3)return toast('Esta versión está afinada para exactamente 3 jugadores')
  const privateById={},starter=rand(ps).name
  if(selectedGame==='chameleon'){
    const pairs=[];for(const [cat,words] of Object.entries(chameleonWords))for(const word of words)pairs.push({cat,word})
    const pick=nextUnique('chameleon',pairs,x=>`${x.cat}:${x.word}`),spy=rand(ps).id
    for(const p of ps)privateById[p.id]=p.id===spy?{game:'chameleon',spy:true,category:pick.cat,starter}:{game:'chameleon',spy:false,category:pick.cat,word:pick.word,starter}
  }
  if(selectedGame==='spyfall'){
    const loc=nextUnique('spyfall',Object.keys(spyLocations)),spy=rand(ps).id,roles=shuffle(spyLocations[loc])
    let r=0;for(const p of ps){if(p.id===spy)privateById[p.id]={game:'spyfall',spy:true,starter};else privateById[p.id]={game:'spyfall',spy:false,location:loc,role:roles[r++],starter}}
  }
  if(selectedGame==='coup'){
    coupDeck=shuffle(coupDeckBase.map((role,i)=>({id:`${Date.now()}-${i}-${Math.random()}`,role})))
    for(const p of ps)privateById[p.id]={game:'coup',cards:[drawCoup(),drawCoup()],starter,exchange:null}
  }
  state={started:true,round:(state?.round||0)+1,starter,privateById};sendAllPrivate();actions.snapshot.send(snapshot());renderAll();toast('Cartas repartidas')
}
function drawCoup(){return coupDeck.pop()}
function back(){if(!isHost)return;selectedGame=null;state=null;myPrivate=null;actions.choose.send({game:null});actions.snapshot.send(snapshot());renderAll()}
function sendCmd(d){if(isHost)handleCommand(selfId,d);else actions.cmd.send(d)}

function handleCommand(peerId,d){
  if(selectedGame!=='coup'||!state?.privateById?.[peerId])return
  const hand=state.privateById[peerId]
  if(d.type==='reveal'){
    const c=hand.cards.find(x=>x.id===d.cardId);if(c)c.dead=true
  }
  if(d.type==='prove'){
    const i=hand.cards.findIndex(x=>x.id===d.cardId);if(i<0||hand.cards[i].dead)return
    coupDeck.unshift(hand.cards[i]);coupDeck=shuffle(coupDeck);hand.cards[i]=drawCoup()
  }
  if(d.type==='ambassadorDraw'){
    if(hand.exchange)return
    const alive=hand.cards.filter(x=>!x.dead);const drawn=[drawCoup(),drawCoup()].filter(Boolean);hand.exchange={options:[...alive,...drawn],keepCount:alive.length,dead:hand.cards.filter(x=>x.dead)}
  }
  if(d.type==='ambassadorKeep'&&hand.exchange){
    const wanted=new Set(d.cardIds||[]),chosen=hand.exchange.options.filter(x=>wanted.has(x.id))
    if(chosen.length!==hand.exchange.keepCount)return
    for(const c of hand.exchange.options)if(!wanted.has(c.id))coupDeck.push(c)
    coupDeck=shuffle(coupDeck);hand.cards=[...hand.exchange.dead,...chosen];hand.exchange=null
  }
  sendPrivate(peerId);if(peerId===selfId)myPrivate=hand;renderGame()
}

function secretBox(inner){return `<div id="secretBox" class="secret secretHidden"><div class="secretContent">${inner}</div></div><button id="holdBtn" class="hold secondary">👁️ Mantené apretado para ver</button>`}
function wireSecret(){const b=$('#secretBox'),h=$('#holdBtn');if(!b||!h)return;const show=e=>{e.preventDefault();b.classList.remove('secretHidden')},hide=e=>{e.preventDefault();b.classList.add('secretHidden')};['pointerdown','touchstart'].forEach(x=>h.addEventListener(x,show,{passive:false}));['pointerup','pointercancel','pointerleave','touchend'].forEach(x=>h.addEventListener(x,hide,{passive:false}))}
function adminButtons(){return isHost?`<div class="adminActions"><button id="again">🔄 ${state?'Jugar de nuevo':'Repartir cartas'}</button><button id="back" class="secondary">← Elegir otro juego</button></div>`:''}
function wireAdmin(){if($('#again'))$('#again').onclick=startRound;if($('#back'))$('#back').onclick=back}

function renderGame(){
  if(!selectedGame)return;const g=$('#game');let html=`<div class="bigTitle">${esc(gameNames[selectedGame])}</div>`
  if(!state){html+=introFor(selectedGame)+adminButtons();g.innerHTML=html;wireAdmin();return}
  html+=`<div class="starter">🎬 Empieza ${esc(state.starter||'alguien')}</div>`
  if(!myPrivate){html+=`<div class="how">Esperando tu carta privada…</div>`+adminButtons();g.innerHTML=html;wireAdmin();return}
  if(selectedGame==='chameleon')html+=renderChameleon()
  if(selectedGame==='spyfall')html+=renderSpyfall()
  if(selectedGame==='coup')html+=renderCoup()
  html+=adminButtons();g.innerHTML=html;wireSecret();wireAdmin();wireGameSpecific()
}

function introFor(game){
  if(game==='chameleon')return `<div class="how"><b>Para 3:</b> dos reciben la misma palabra y uno es el Camaleón. Cada uno dice una pista corta. Después discutan y señalen con el dedo a quién acusan. Si encuentran al Camaleón, déjenlo intentar adivinar la palabra. El teléfono no vuelve a intervenir.</div>`
  if(game==='spyfall')return `<div class="how"><b>Para 3:</b> dos conocen el lugar y reciben un rol; uno es el espía. ${esc('Empieza el jugador indicado haciendo una pregunta a otro. Quien responde pregunta después a cualquiera. Acusen hablando. Si el espía se anima, puede decir el lugar en voz alta.')}</div><div class="warning">Con sólo 3 conviene hacer preguntas cortas y no demasiado obvias. Una ronda de 5–8 minutos suele rendir bien.</div>`
  return `<div class="how"><b>Preparación física:</b> cada uno toma 2 monedas. El teléfono hace de mazo y muestra tus dos influencias. Casi todo se resuelve hablando y moviendo monedas. Sólo tocás el celular cuando una carta cambia.</div>${coupReference()}`
}

function renderChameleon(){
  const d=myPrivate
  const content=d.spy?`<div class="medium">Categoría: ${esc(d.category)}</div><div class="big">🦎 SOS EL CAMALEÓN</div><p>Escuchá las pistas y mezclate.</p>`:`<div class="medium">Categoría: ${esc(d.category)}</div><div class="big">${esc(d.word)}</div><p>No regales demasiado la palabra.</p>`
  return secretBox(content)+`<div class="how">📱 Mirá tu carta, escondela y dejá el teléfono. Cada uno da <b>una pista</b>. Después discutan y acusen señalando con el dedo. No hay votación digital.</div>`
}

function renderSpyfall(){
  const d=myPrivate
  const content=d.spy?`<div class="big">🕵️ SOS EL ESPÍA</div><p>No conocés el lugar. Respondé sin regalarte e intentá descubrirlo.</p>`:`<div class="medium">Lugar</div><div class="big">${esc(d.location)}</div><div class="medium" style="margin-top:14px">Tu rol: ${esc(d.role)}</div>`
  return secretBox(content)+`<div class="how">📱 Después de mirar la carta, teléfono abajo. Las preguntas y acusaciones son habladas.</div><button id="questionBtn" class="ghost" style="width:100%;margin-top:10px">💬 Estoy trabado: dame una pregunta</button><div id="questionBox"></div>`
}

function coupReference(){return `<div class="reference"><div class="refrow"><b>Acciones libres:</b> Ingreso +1 · Ayuda extranjera +2 · Golpe cuesta 7 (con 10+ es obligatorio).</div><div class="refrow"><b>👑 Duque:</b> +3 monedas · bloquea ayuda extranjera.</div><div class="refrow"><b>🗡️ Asesino:</b> paga 3 · objetivo pierde influencia. Condesa puede bloquear.</div><div class="refrow"><b>🏴‍☠️ Capitán:</b> roba hasta 2 · Capitán/Embajador pueden bloquear.</div><div class="refrow"><b>🔄 Embajador:</b> cambia cartas con el mazo · bloquea robo.</div><div class="refrow"><b>🛡️ Condesa:</b> bloquea asesinato.</div><div class="refrow"><b>Desafíos:</b> cualquiera puede desafiar una afirmación de rol. Si era mentira, el mentiroso pierde influencia. Si era verdad, pierde el desafiante y quien probó el rol roba reemplazo.</div></div>`}

function renderCoup(){
  const d=myPrivate
  if(d.exchange)return renderExchange(d)
  const cards=(d.cards||[]).map(c=>`<div class="rolecard ${c.dead?'dead':''}"><div><div class="role">${esc(c.role)}</div><div class="tiny">${esc(coupRoleInfo[c.role])}</div></div>${c.dead?'<div class="dangerText"><b>REVELADA</b></div>':`<div class="miniActions"><button class="ghost revealBtn" data-id="${esc(c.id)}">Revelé/perdí</button><button class="ghost proveBtn" data-id="${esc(c.id)}">La probé</button></div>`}</div>`).join('')
  return secretBox(`<div class="medium">Tus influencias</div><div class="cards">${cards}</div>`)+`<div class="how"><b>La mesa manda:</b> monedas, acciones, bloqueos y desafíos se dicen en voz alta. Usá <b>Revelé/perdí</b> sólo cuando una influencia muere. Usá <b>La probé</b> si ganaste un desafío mostrando ese rol: la app la devuelve al mazo y te da una nueva.</div><button id="ambBtn" class="ghost" style="width:100%;margin-top:10px">🔄 Usé Embajador: sacar 2 cartas</button>${coupReference()}`
}

function renderExchange(d){
  const ex=d.exchange;const opts=ex.options.map(c=>`<label class="refrow" style="display:block"><input class="keepCard" type="checkbox" value="${esc(c.id)}" style="width:auto;margin-right:8px"> <b>${esc(c.role)}</b> — ${esc(coupRoleInfo[c.role])}</label>`).join('')
  return `<div class="how"><b>Embajador:</b> elegí exactamente ${ex.keepCount} carta${ex.keepCount===1?'':'s'} para conservar. Las otras vuelven al mazo.</div><div class="reference">${opts}</div><button id="keepBtn" style="width:100%;margin-top:10px">Confirmar cambio</button>`
}

function wireGameSpecific(){
  if($('#questionBtn'))$('#questionBtn').onclick=()=>{$('#questionBox').innerHTML=`<div class="question">${esc(rand(spyQuestions))}</div>`}
  document.querySelectorAll('.revealBtn').forEach(b=>b.onclick=()=>sendCmd({type:'reveal',cardId:b.dataset.id}))
  document.querySelectorAll('.proveBtn').forEach(b=>b.onclick=()=>sendCmd({type:'prove',cardId:b.dataset.id}))
  if($('#ambBtn'))$('#ambBtn').onclick=()=>sendCmd({type:'ambassadorDraw'})
  if($('#keepBtn'))$('#keepBtn').onclick=()=>{const ids=[...document.querySelectorAll('.keepCard:checked')].map(x=>x.value);sendCmd({type:'ambassadorKeep',cardIds:ids})}
}

renderAll()
