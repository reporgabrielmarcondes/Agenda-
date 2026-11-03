# Agenda (PWA) · Render + Supabase

App estático (HTML/JS) com login via Supabase Auth, instalável e com uso offline.

## 1. Supabase
1. Crie um projeto em supabase.com.
2. **Project Settings → API**: copie a *Project URL* e a chave *anon public*.
3. **Authentication → URL Configuration**:
   - *Site URL*: `https://SEU-APP.onrender.com`
   - *Redirect URLs*: adicione `https://SEU-APP.onrender.com/login.html`
4. **Authentication → Providers → Email**: deixe habilitado. Se quiser entrar logo após criar a conta, desligue "Confirm email".

## 2. Render
1. Suba esta pasta para um repositório no GitHub.
2. No Render: **New → Blueprint** e escolha o repositório (ele lê o `render.yaml`).
   Ou **New → Static Site** com: Build Command `sh build.sh`, Publish Directory `public`.
3. Em **Environment**, defina:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Deploy. O `build.sh` gera o `public/config.js` com essas chaves.

## Teste local
Preencha `public/config.js` e rode `python3 -m http.server -d public 8000` → http://localhost:8000

## Como funciona
- `login.html`: entrar, criar conta, recuperar e redefinir senha.
- `agenda.html`: só abre com sessão ativa; sem login vai para `login.html`. Botão **Sair da conta** em Perfil.
- `supabase.js` fica local (sem CDN), então o login também funciona offline com sessão já salva.
- `sw.js`: cache offline (versão `agenda-v3`; aumente o número ao publicar mudanças grandes).

## Importante
Os dados da agenda (compromissos, notas, tags) continuam no `localStorage` de cada aparelho.
Ao trocar de usuário no mesmo aparelho, os dados do anterior ficam guardados e são restaurados quando ele voltar.
Para ter os dados sincronizados entre aparelhos, o próximo passo é gravá-los numa tabela do Supabase com RLS.
A chave `anon` é pública por design; nunca coloque a `service_role` no app.
