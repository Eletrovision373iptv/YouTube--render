'use strict';

const express = require('express');
const fs = require('fs');
const { spawn, exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 3005;

// --- CONFIGURAÇÕES ---
const FFMPEG = 'ffmpeg';
const YT_DLP = 'yt-dlp'; // Precisa ter instalado: pip install yt-dlp
const JSON_FILE = path.join(__dirname, 'canais_youtube.json');

let canaisCache = [];
let usuariosOnline = {}; 

app.use(express.json());

// ============================================================
// LISTA DE CANAIS YOUTUBE LIVE (CONFIGURE AQUI!)
// ============================================================
const CANAIS_YOUTUBE = [
    {
        id: 'cnn_br',
        nome: 'CNN Brasil',
        url: 'https://www.youtube.com/@CNNBrasil/live',
        logo: 'https://yt3.googleusercontent.com/xV2hKPDdUT4g-RZJ8PWrZhDh3Z4snP8a0mZPnEqLQXIBEG8XdzJWWCVrVdWXCPFVLJWvBKxs=s160-c-k-c0x00ffffff-no-rj',
        categoria: 'Notícias'
    },
    {
        id: 'band_news',
        nome: 'BandNews TV',
        url: 'https://www.youtube.com/@BandNewsTV/live',
        logo: 'https://yt3.googleusercontent.com/P96z9Vfpu9k-_kGr_DLN8VVL7mxaHYM0aFVKNS_sNgHYBm_TQv8W1f7KNqNhDdxN0RqLx9Q=s160-c-k-c0x00ffffff-no-rj',
        categoria: 'Notícias'
    },
    {
        id: 'record_news',
        nome: 'Record News',
        url: 'https://www.youtube.com/@recordnews/live',
        logo: 'https://yt3.googleusercontent.com/FzfQCmE9pPmqcTDtLVL_9PxQrXFKcF-NpGBVKxWJKCGF-L7qE5RWR2VPNYxNKu7nwvXFJBhv=s160-c-k-c0x00ffffff-no-rj',
        categoria: 'Notícias'
    },
    {
        id: 'jovem_pan',
        nome: 'Jovem Pan News',
        url: 'https://www.youtube.com/@JovemPanNews/live',
        logo: 'https://yt3.googleusercontent.com/dCpPYEvMEikDlBg6YJJ_RBzxfG6T9pzLFPBGVLNjHGYc9VcUVHUNKM0qhZGhUmWEPxgb4rXW=s160-c-k-c0x00ffffff-no-rj',
        categoria: 'Notícias'
    },
    {
        id: 'tv_camara',
        nome: 'TV Câmara',
        url: 'https://www.youtube.com/@TVCamara/live',
        logo: 'https://yt3.googleusercontent.com/ytc/AIdro_kP5qP7XqN2KvBUTg9FGRqXCL-yHQDHGlKJt4wH=s160-c-k-c0x00ffffff-no-rj',
        categoria: 'Política'
    },
    {
        id: 'tv_senado',
        nome: 'TV Senado',
        url: 'https://www.youtube.com/@TVSenado/live',
        logo: 'https://yt3.googleusercontent.com/ytc/AIdro_llHcT3B7wFm89TiYMrLLJJL7i-KHLmOT9VTv5V=s160-c-k-c0x00ffffff-no-rj',
        categoria: 'Política'
    },
    {
        id: 'lofi_girl',
        nome: 'Lofi Girl',
        url: 'https://www.youtube.com/@LofiGirl/live',
        logo: 'https://yt3.googleusercontent.com/2H6lJJlQMdxppI2HtxGBKZM8m_PvNjDPj8wD9lH5bLm7PsT9W2F1VQF4H5Ub8Vvx7TqwKgk=s160-c-k-c0x00ffffff-no-rj',
        categoria: 'Música'
    },
    {
        id: 'chill_hop',
        nome: 'ChilledCow',
        url: 'https://www.youtube.com/@Chillhopmusic/live',
        logo: 'https://yt3.googleusercontent.com/VCEsVL1QfjHaYDmJwcYn1qN-0Qd8h_B8Lw-W_bOdUpMQxCLKBCQ_0lBfb0r8QsNfGfwx0J4=s160-c-k-c0x00ffffff-no-rj',
        categoria: 'Música'
    }
];

// Salvar lista inicial
function salvarListaInicial() {
    canaisCache = CANAIS_YOUTUBE;
    fs.writeFileSync(JSON_FILE, JSON.stringify(CANAIS_YOUTUBE, null, 2));
    console.log(`✅ Lista inicial salva: ${canaisCache.length} canais.`);
}

// Carregar lista
function carregarLista() {
    if (fs.existsSync(JSON_FILE)) {
        const data = fs.readFileSync(JSON_FILE, 'utf8');
        canaisCache = JSON.parse(data);
        console.log(`📂 Lista carregada: ${canaisCache.length} canais.`);
    } else {
        salvarListaInicial();
    }
}

carregarLista();

// ============================================================
// ADICIONAR NOVO CANAL
// ============================================================
app.post('/api/adicionar-canal', (req, res) => {
    const { nome, url, logo, categoria } = req.body;
    
    if (!nome || !url) {
        return res.status(400).json({ error: 'Nome e URL são obrigatórios!' });
    }
    
    const id = nome.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    const novoCanal = {
        id,
        nome,
        url,
        logo: logo || 'https://via.placeholder.com/150?text=' + encodeURIComponent(nome),
        categoria: categoria || 'Geral'
    };
    
    canaisCache.push(novoCanal);
    fs.writeFileSync(JSON_FILE, JSON.stringify(canaisCache, null, 2));
    
    res.json({ success: true, message: 'Canal adicionado!', canal: novoCanal });
});

// ============================================================
// REMOVER CANAL
// ============================================================
app.post('/api/remover-canal', (req, res) => {
    const { id } = req.body;
    
    canaisCache = canaisCache.filter(c => c.id !== id);
    fs.writeFileSync(JSON_FILE, JSON.stringify(canaisCache, null, 2));
    
    res.json({ success: true, message: 'Canal removido!' });
});

// ============================================================
// PAINEL DE CONTROLE
// ============================================================
app.get('/painelyoutube', (req, res) => {
    const host = req.headers.host;
    let html = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <title>YouTube Live Manager</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background: #0f0f0f; color: #eee; font-family: sans-serif; }
            .topo { background: #212121; padding: 15px; border-bottom: 3px solid #ff0000; margin-bottom: 20px; }
            .card { background: #282828; border: 1px solid #3f3f3f; }
            .card:hover { border-color: #ff0000; transform: translateY(-2px); transition: 0.3s; }
            .logo-img { height: 60px; object-fit: contain; width: 100%; background: #000; padding: 5px; border-radius: 5px; }
            .btn-watch { background: #ff0000; color: #fff; font-weight: bold; width: 100%; border:none; margin-bottom: 5px; font-size: 12px; }
            .btn-watch:hover { background: #cc0000; }
            .btn-copy { background: #3f3f3f; color: #fff; width: 100%; border:none; font-size: 11px; }
            .btn-copy:hover { background: #4f4f4f; }
            .btn-remove { background: #666; color: #fff; width: 100%; border:none; font-size: 11px; margin-top: 5px; }
            .online-badge { color: #0f0; font-size: 11px; font-weight: bold; margin-bottom: 5px; display: block; }
            .add-card { border: 2px dashed #ff0000; cursor: pointer; display: flex; align-items: center; justify-content: center; min-height: 300px; }
            .add-card:hover { background: #3f3f3f; }
            .modal-content { background: #282828; color: #fff; }
            .form-control { background: #3f3f3f; border: 1px solid #666; color: #fff; }
            .form-control:focus { background: #4f4f4f; border-color: #ff0000; color: #fff; }
        </style>
    </head>
    <body>
    <div class="topo">
        <div class="container d-flex justify-content-between align-items-center">
            <h4 class="m-0 text-white"><span style="color:#ff0000">▶</span> YOUTUBE LIVE</h4>
            <div>
                <button onclick="showAddModal()" class="btn btn-danger btn-sm fw-bold">➕ ADICIONAR CANAL</button>
                <a href="/baixar-m3u-youtube" class="btn btn-light btn-sm fw-bold">📥 BAIXAR M3U</a>
            </div>
        </div>
    </div>
    
    <div class="container pb-5">
        <div class="row g-2">
        ${canaisCache.map((ch) => {
            const link = `http://${host}/youtube/${ch.id}.ts`;
            return `
            <div class="col-6 col-md-4 col-lg-2">
                <div class="card p-2 text-center h-100">
                    <img src="${ch.logo}" class="logo-img mb-2" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=YT'">
                    <div class="card-body p-0">
                        <small class="d-block text-truncate text-white fw-bold mb-1">${ch.nome}</small>
                        <small class="d-block text-muted mb-1" style="font-size:10px">${ch.categoria}</small>
                        <span class="online-badge">● ${usuariosOnline[ch.id] || 0} ON</span>
                        <a href="${link}" target="_blank" class="btn btn-watch">▶ ASSISTIR</a>
                        <button onclick="copiar('${link}')" class="btn btn-copy">📋 COPIAR</button>
                        <button onclick="removerCanal('${ch.id}')" class="btn btn-remove">🗑️ REMOVER</button>
                    </div>
                </div>
            </div>`;
        }).join('')}
        
        <div class="col-6 col-md-4 col-lg-2">
            <div class="card add-card" onclick="showAddModal()">
                <div class="text-center">
                    <div style="font-size: 50px; color: #ff0000;">➕</div>
                    <div class="fw-bold">Adicionar Canal</div>
                </div>
            </div>
        </div>
        </div>
    </div>

    <!-- Modal Adicionar Canal -->
    <div class="modal fade" id="addModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">➕ Adicionar Canal YouTube</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label class="form-label">Nome do Canal *</label>
                        <input type="text" class="form-control" id="newNome" placeholder="Ex: CNN Brasil">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">URL da Live *</label>
                        <input type="text" class="form-control" id="newUrl" placeholder="https://www.youtube.com/@CNNBrasil/live">
                        <small class="text-muted">Pode ser: /live, /watch?v=ID, ou link curto</small>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Logo (URL)</label>
                        <input type="text" class="form-control" id="newLogo" placeholder="https://...">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Categoria</label>
                        <select class="form-control" id="newCategoria">
                            <option>Notícias</option>
                            <option>Música</option>
                            <option>Entretenimento</option>
                            <option>Política</option>
                            <option>Esportes</option>
                            <option>Geral</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" onclick="adicionarCanal()">Adicionar</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        const modal = new bootstrap.Modal(document.getElementById('addModal'));

        function showAddModal() {
            modal.show();
        }

        function adicionarCanal() {
            const nome = document.getElementById('newNome').value;
            const url = document.getElementById('newUrl').value;
            const logo = document.getElementById('newLogo').value;
            const categoria = document.getElementById('newCategoria').value;

            if (!nome || !url) {
                alert('Nome e URL são obrigatórios!');
                return;
            }

            fetch('/api/adicionar-canal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, url, logo, categoria })
            })
            .then(r => r.json())
            .then(d => {
                alert(d.message);
                location.reload();
            });
        }

        function removerCanal(id) {
            if (!confirm('Remover este canal?')) return;

            fetch('/api/remover-canal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            .then(r => r.json())
            .then(d => {
                alert(d.message);
                location.reload();
            });
        }

        function copiar(texto) {
            navigator.clipboard.writeText(texto);
            alert('Link Copiado!');
        }
    </script>
    </body></html>`;
    res.send(html);
});

// ============================================================
// ROTA DE M3U
// ============================================================
app.get('/baixar-m3u-youtube', (req, res) => {
    const host = req.headers.host;
    let m3u = "#EXTM3U\n";
    canaisCache.forEach((ch) => {
        const link = `http://${host}/youtube/${ch.id}.ts`;
        m3u += `#EXTINF:-1 tvg-id="${ch.id}" tvg-logo="${ch.logo}" group-title="${ch.categoria}",${ch.nome}\n${link}\n`;
    });
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=lista_youtube_live.m3u');
    res.send(m3u);
});

// ============================================================
// MOTOR DE STREAMING
// ============================================================
app.get('/youtube/:id', (req, res) => {
    const id = req.params.id.replace('.ts', '');
    const canal = canaisCache.find(c => c.id === id);

    if (!canal) return res.status(404).send("Canal OFF");

    usuariosOnline[id] = (usuariosOnline[id] || 0) + 1;

    console.log(`▶️ Play: ${canal.nome}`);

    // Primeiro, pegar o link direto com yt-dlp
    exec(`${YT_DLP} -f best -g "${canal.url}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Erro yt-dlp: ${error.message}`);
            if (usuariosOnline[id] > 0) usuariosOnline[id]--;
            return res.status(500).send("Erro ao obter stream");
        }

        const streamUrl = stdout.trim();
        
        res.writeHead(200, {
            'Content-Type': 'video/mp2t',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });

        const args = [
            '-hide_banner', '-loglevel', 'error',
            '-user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            '-reconnect', '1', '-reconnect_streamed', '1', '-reconnect_delay_max', '5',
            '-i', streamUrl,
            '-c', 'copy', '-map', '0', 
            '-f', 'mpegts', 'pipe:1'
        ];

        const ff = spawn(FFMPEG, args);
        ff.stdout.pipe(res);

        ff.stderr.on('data', d => {
            if(d.toString().includes('Error')) console.log(`⚠️ FFmpeg: ${d}`);
        });

        res.on('close', () => {
            if (usuariosOnline[id] > 0) usuariosOnline[id]--;
            try { ff.kill('SIGKILL'); } catch(e) {}
        });
    });
});

// ============================================================
// ROTA RAIZ
// ============================================================
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head><title>YouTube Live Server</title></head>
        <body style="background:#0f0f0f; color:#fff; font-family:sans-serif; text-align:center; padding-top:100px;">
            <h1>▶️ YouTube Live Server</h1>
            <p>Servidor rodando na porta ${PORT}</p>
            <a href="/painelyoutube" style="color:#ff0000; font-size:20px;">Ir para o Painel →</a>
        </body>
        </html>
    `);
});

app.listen(PORT, '0.0.0.0', () => { 
    console.log(`▶️ YOUTUBE LIVE NA PORTA ${PORT}`); 
    console.log(`🌐 Acesse: http://localhost:${PORT}/painelyoutube`);
});
