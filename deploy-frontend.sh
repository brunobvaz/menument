#!/bin/bash

echo "🚀 Iniciando deploy do frontend..."

# Atualiza o código do repositório
git pull origin main || exit 1

# Instala dependências
npm install

# Faz o build
npm run build || exit 1

# Remove os ficheiros antigos
sudo rm -rf /var/www/menument/*

# Copia os novos ficheiros
sudo cp -r dist/* /var/www/menument/ || exit 1

# Corrige permissões
sudo chown -R www-data:www-data /var/www/menument || exit 1

# Reinicia o NGINX (opcional)
sudo systemctl reload nginx

echo "✅ Deploy concluído com sucesso!"

