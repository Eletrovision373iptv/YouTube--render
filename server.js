const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 10000;

app.get('/live.m3u8', (req, res) => {
    // Comando para pegar o link m3u8 (itag 96) 
    // Tentamos usar o formato que gera esse link longo que você enviou
    const command = './yt-dlp -g -f 96 https://www.youtube.com/watch?v=ABVQXgr2LW4';
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro: ${error.message}`);
            // Se falhar, tenta o link de manifest que enviamos antes
            return res.redirect(`https://www.youtube.com/api/manifest/hls_variant/id/ABVQXgr2LW4/source/yt_live_broadcast/master.m3u8`);
        }
        
        // Se o yt-dlp conseguir o link longo, redireciona para ele
        const linkLongo = stdout.trim();
        res.redirect(302, linkLongo);
    });
});

app.get('/', (req, res) => {
    res.send('Servidor SBT Render Ativo!');
});

app.listen(port, () => console.log(`Rodando na porta ${port}`));
