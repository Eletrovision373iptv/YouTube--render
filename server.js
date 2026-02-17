const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 10000;

app.get('/live.m3u8', (req, res) => {
    // Tentativa 1: Usar o yt-dlp com um User-Agent de navegador para tentar burlar o bloqueio
    // E usando o formato "95" ou "96" que são os padrões de HLS (m3u8) do YouTube
    const command = './yt-dlp -g -f "best[ext=mp4]" --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" https://www.youtube.com/watch?v=ABVQXgr2LW4';
    
    exec(command, (error, stdout) => {
        if (error) {
            // Se o yt-dlp falhar no Render (por causa do IP), vamos para o Plano B:
            // Redirecionar para um serviço que extrai o link em tempo real
            const videoId = 'ABVQXgr2LW4';
            const bypassUrl = `https://youtube-m3u8-fix.vercel.app/api/live?id=${videoId}`; 
            // Nota: Se esse serviço cair, o link para. 
            return res.redirect(bypassUrl);
        }
        
        // Se o yt-dlp conseguir (milagre), envia o link direto
        res.redirect(stdout.trim());
    });
});

app.get('/', (req, res) => {
    res.send('Servidor Ativo! Insira o link /live.m3u8 no XCIPTV');
});

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
