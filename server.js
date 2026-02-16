const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 8080;

app.get('/live.m3u8', (req, res) => {
    // Comando usando o yt-dlp que baixamos no build
    const command = './yt-dlp -g https://www.youtube.com/@SBTonline/live';
    
    exec(command, (error, stdout) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Erro ao buscar live');
        }
        res.redirect(stdout.trim());
    });
});

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
