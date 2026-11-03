/* Autenticação com Supabase, compartilhada por login.html e agenda.html */
(function(){
 var C=window.AGENDA_CONFIG||{};
 var configured=!!(C.SUPABASE_URL&&C.SUPABASE_ANON_KEY&&window.supabase);
 var ref='';try{ref=new URL(C.SUPABASE_URL).hostname.split('.')[0]}catch(e){}
 var TOKEN_KEY='sb-'+ref+'-auth-token';
 var client=configured?window.supabase.createClient(C.SUPABASE_URL,C.SUPABASE_ANON_KEY,{
  auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:TOKEN_KEY}
 }):null;

 function hasStoredToken(){try{return !!localStorage.getItem(TOKEN_KEY)}catch(e){return false}}
 function reveal(){var g=document.getElementById('gate');if(g)g.remove()}

 /* Cada pessoa tem seus dados locais: ao trocar de usuário no mesmo aparelho,
    os dados do anterior são guardados (agenda-stash-ID) e os do novo são restaurados. */
 function adoptUser(uid){
  try{
   var prev=localStorage.getItem('agenda-uid');
   if(prev===uid)return;
   if(prev){
    var snap={};
    Object.keys(localStorage).forEach(function(k){
     if(k.indexOf('agenda-')===0&&k!=='agenda-uid'&&k.indexOf('agenda-stash-')!==0){snap[k]=localStorage.getItem(k);localStorage.removeItem(k)}
    });
    localStorage.setItem('agenda-stash-'+prev,JSON.stringify(snap));
    var mine=JSON.parse(localStorage.getItem('agenda-stash-'+uid)||'null');
    if(mine){Object.keys(mine).forEach(function(k){localStorage.setItem(k,mine[k])});localStorage.removeItem('agenda-stash-'+uid)}
   }
   localStorage.setItem('agenda-uid',uid);
  }catch(e){}
 }

 async function guard(){
  var s=null;
  if(client){try{var r=await client.auth.getSession();s=r.data&&r.data.session}catch(e){}}
  if(!s){
   /* sem internet e já logado antes: deixa abrir offline */
   if(!navigator.onLine&&hasStoredToken()){reveal();return null}
   location.replace('login.html');return null;
  }
  reveal();
  client.auth.onAuthStateChange(function(ev){if(ev==='SIGNED_OUT')location.replace('login.html')});
  return s;
 }

 async function signOut(){
  try{if(client)await client.auth.signOut()}catch(e){}
  location.replace('login.html');
 }

 window.agendaAuth={client:client,configured:configured,hasStoredToken:hasStoredToken,adoptUser:adoptUser,guard:guard,signOut:signOut,reveal:reveal};
})();
