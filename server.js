const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

app.get('/live.m3u8', (req, res) => {
    const videoId = 'ABVQXgr2LW4';
    
    // Este é um link de "manifesto" que muitos players de IPTV 
    // conseguem ler para buscar os pedaços (chunks) do vídeo direto do Google.
    const googleVideoUrl = `https://www.youtube.com/api/manifest/hls_variant/id/${videoId}/source/yt_live_broadcast/master.m3u8`;
    
    res.redirect(302, googleVideoUrl);
});

app.get('/', (req, res) => {
    res.send('Servidor SBT Cloud Ativo! Tente o link /live.m3u8 no XCIPTV.');
});

app.listen(port, () => {
    console.log(`Rodando na porta ${port}`);
});
