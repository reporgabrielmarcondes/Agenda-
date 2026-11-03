#!/bin/sh
# Render (Static Site): gera public/config.js com as chaves públicas do Supabase.
set -e
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "ERRO: defina SUPABASE_URL e SUPABASE_ANON_KEY nas variáveis de ambiente do Render." >&2
  exit 1
fi
cat > public/config.js <<EOF
window.AGENDA_CONFIG={SUPABASE_URL:"$SUPABASE_URL",SUPABASE_ANON_KEY:"$SUPABASE_ANON_KEY"};
EOF
echo "config.js gerado."
