#!/usr/bin/env bash
# Instala dependências do node
npm install
# Baixa a versão estável do yt-dlp
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp
# Dá permissão para o sistema rodar o arquivo
chmod a+rx yt-dlp
