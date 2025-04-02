require('dotenv').config();
const express = require('express');
const path = require('path');
const compression = require('compression');
const { 
    limiter, 
    csrfProtection, 
    securityHeaders, 
    cookieParser 
} = require('./middleware/security');
const contactRoutes = require('./routes/contact');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares de segurança
app.use(securityHeaders);
app.use(cookieParser);
app.use(limiter);

// Middlewares gerais
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public'), {
    maxAge: '1y',
    etag: true
}));

// Rotas da API
app.use('/api', contactRoutes);

// Rota para sitemap.xml
app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/sitemap.xml'));
});

// Rota para robots.txt
app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/robots.txt'));
});

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Erro interno do servidor' 
    });
});

// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
}

module.exports = app;
