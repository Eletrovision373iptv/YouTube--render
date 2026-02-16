const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/live.m3u8', (req, res) => {
    // ID da live que você confirmou que funciona
    const videoId = 'ABVQXgr2LW4';
    
    // Este é um link de redirecionamento que o YouTube aceita melhor
    const redirectUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Tentamos enviar o player direto para a origem
    res.redirect(302, redirectUrl);
});

app.get('/', (req, res) => {
    res.send('Servidor Online! Tente abrir /live.m3u8');
});

app.listen(port, () => console.log(`Rodando na porta ${port}`));
