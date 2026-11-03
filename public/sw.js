/* Service worker da Agenda: guarda o app, fontes e ícones para uso offline */
const V="agenda-v3";
const CORE=['agenda.html','login.html','index.html','auth.js','config.js','supabase.js','manifest.webmanifest','icon-192.png','icon-512.png'];
const CDN=/^(fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com)$/;

self.addEventListener('install',e=>{
 e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
 e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k!==V)await caches.delete(k);
  await self.clients.claim();
  /* guarda a página que já está aberta, para abrir offline logo na primeira vez */
  const c=await caches.open(V);
  for(const cl of await self.clients.matchAll())try{await c.add(cl.url.split('#')[0])}catch(x){}
 })());
});

self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET')return;
 const u=new URL(r.url);
 if(u.origin===location.origin){
  /* arquivos do app: rede primeiro, cache como reserva (chamadas ao Supabase passam direto) */
  e.respondWith(fetch(r).then(x=>{
   if(x.ok){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}
   return x;
  }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==='navigate'?caches.match('agenda.html'):undefined))));
 }else if(CDN.test(u.hostname)){
  /* fontes e ícones: cache primeiro, atualiza em segundo plano */
  e.respondWith(caches.open(V).then(async c=>{
   const m=await c.match(r);
   const n=fetch(r).then(x=>{if(x.ok)c.put(r,x.clone());return x}).catch(()=>m);
   return m||n;
  }));
 }
});

self.addEventListener('notificationclick',e=>{
 e.notification.close();
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{
  for(const c of l)if('focus' in c)return c.focus();
  return self.clients.openWindow(self.registration.scope+'agenda.html');
 }));
});