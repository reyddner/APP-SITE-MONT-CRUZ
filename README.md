# Mont Cruz Engenharia - Website

Website institucional da Mont Cruz Engenharia, desenvolvido com HTML, CSS e JavaScript no frontend e Node.js com Express no backend.

## Estrutura do Projeto

```
mont-cruz/
├── public/                 # Arquivos estáticos
│   ├── css/               # Estilos
│   ├── js/                # Scripts
│   ├── images/            # Imagens
│   │   └── optimized/     # Imagens otimizadas
│   ├── robots.txt         # Configuração para crawlers
│   └── sitemap.xml        # Sitemap para SEO
├── server/                # Backend
│   ├── config/           # Configurações
│   ├── controllers/      # Controladores
│   ├── middleware/       # Middlewares
│   ├── routes/          # Rotas da API
│   ├── tests/           # Testes automatizados
│   ├── .env.example     # Exemplo de variáveis de ambiente
│   └── index.js         # Entrada do servidor
├── *.html               # Páginas do site
├── install.ps1          # Script de instalação
└── README.md            # Documentação
```

## Endpoints da API

### Formulário de Contato

- **GET /api/csrf-token**
  - Retorna token CSRF para proteção contra ataques
  - Resposta: `{ csrfToken: string }`

- **POST /api/contact**
  - Envia mensagem de contato
  - Headers: 
    - `csrf-token`: Token CSRF
    - `Content-Type: application/json`
  - Payload:
    ```json
    {
        "name": "string",
        "email": "string",
        "phone": "string",
        "projectType": "string",
        "message": "string",
        "recaptchaToken": "string"
    }
    ```
  - Resposta: `{ message: string }` ou `{ error: string }`

## Segurança

- **Headers (Helmet)**
  - CSP: Content Security Policy
  - XSS Protection
  - Frame Options
  - HSTS
  - Referrer Policy

- **Rate Limiting**
  - 100 requisições por IP a cada 15 minutos

- **CSRF Protection**
  - Token CSRF em cookie HTTP-only
  - Validação em todas as requisições POST

- **Validação de Dados**
  - Sanitização de inputs
  - Validação de tipos e formatos
  - reCAPTCHA v3

## SEO

- Meta tags otimizadas
- Sitemap XML
- Robots.txt configurado
- Schema.org markup
- Google Analytics integrado

## Performance

- Compressão gzip/brotli
- Cache de arquivos estáticos
- Imagens otimizadas
- Lazy loading de imagens
- CSS/JS minificados

## Integrações

- **Google Maps**
  - Mapa interativo na página de contato
  - Tema escuro personalizado
  - Marcador da localização

- **Google Analytics**
  - Tracking de pageviews
  - Eventos de formulário
  - Conversões

- **reCAPTCHA v3**
  - Proteção contra bots
  - Score baseado em comportamento
  - Invisível para usuários

## Instalação

1. Clone o repositório
2. Execute o script de instalação:
   ```powershell
   .\install.ps1
   ```
3. Configure as variáveis de ambiente:
   - Copie `.env.example` para `.env`
   - Preencha as chaves de API necessárias

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Executar testes
npm test

# Executar testes com coverage
npm run test:coverage
```

## Testes

- **Unitários**: Funções e utilitários
- **Integração**: API endpoints
- **Cobertura**: >80% do código

## Produção

1. Configure as variáveis de ambiente
2. Configure HTTPS/SSL
3. Ajuste as políticas de segurança
4. Inicie o servidor:
   ```bash
   npm start
   ```

## Licença

Todos os direitos reservados 2025 Mont Cruz Engenharia
