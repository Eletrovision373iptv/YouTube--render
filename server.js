const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 8080;

app.get('/live.m3u8', (req, res) => {
    // Usando o link que você confirmou que funciona no PC
    // Adicionamos 'python3' antes para garantir que o Linux do Render execute
    const command = 'python3 ./yt-dlp -g https://www.youtube.com/watch?v=ABVQXgr2LW4';
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro: ${error.message}`);
            return res.status(500).send('Erro ao buscar live');
        }
        res.redirect(stdout.trim());
    });
});

// Página inicial para você saber que está online
app.get('/', (req, res) => {
    res.send('Servidor SBT Online no Render! Use /live.m3u8 no XCIPTV.');
});

app.listen(port, () => console.log(`Rodando na porta ${port}`));
