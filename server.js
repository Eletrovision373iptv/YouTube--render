const express = require('express');
const fetch = require('node-fetch'); // Adicione esta linha se possível, ou use o código abaixo
const app = express();
const port = process.env.PORT || 10000;

app.get('/live.m3u8', async (req, res) => {
    const videoId = 'ABVQXgr2LW4';
    
    // Lista de instâncias do Invidious que costumam funcionar
    // Vamos redirecionar para uma que extrai o m3u8 direto
    const invidiousUrl = `https://invidious.projectsegfau.lt/latest_version?id=${videoId}&itag=96`;
    
    // Redireciona o XCIPTV direto para o fluxo de vídeo
    res.redirect(invidiousUrl);
});

app.get('/', (req, res) => {
    res.send('Servidor SBT Cloud Ativo! Use /live.m3u8 no seu App.');
});

app.listen(port, () => console.log(`Rodando na porta ${port}`));
