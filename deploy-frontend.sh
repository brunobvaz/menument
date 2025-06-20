#!/bin/bash

echo "🚀 Iniciando deploy do frontend..."

# Caminho do projeto
#cd /home/seu-usuario/menument-frontend || exit 1

# Atualiza com o último código do repositório
git pull origin main || exit 1

# Instala dependências (opcional)
npm install

# Faz o build
npm run build || exit 1

# Copia os ficheiros do build para o diretório do NGINX
sudo cp -r dist/* /var/www/menumentapp.com/ || exit 1

# Corrige permissões
sudo chown -R www-data:www-data /var/www/menumentapp.com || exit 1

# Reinicia o NGINX (não obrigatório, mas garante cache limpa)
sudo systemctl reload nginx

echo "✅ Deploy concluído com sucesso!"
