const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

app.get('/live.m3u8', (req, res) => {
    const videoId = 'ABVQXgr2LW4';
    
    // Usando uma instância do Invidious que entrega o stream direto (itag 96 = HLS/m3u8)
    // Esse link faz a ponte entre o YouTube e o seu XCIPTV
    const streamUrl = `https://invidious.projectsegfau.lt/latest_version?id=${videoId}&itag=96`;
    
    res.redirect(302, streamUrl);
});

app.get('/', (req, res) => {
    res.send('Servidor SBT Cloud Online! Link para o App: /live.m3u8');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
