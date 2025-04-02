# Instalar dependências do frontend
Write-Host "Instalando dependências do frontend..."
npm install

# Instalar dependências do backend
Write-Host "Instalando dependências do backend..."
Set-Location server
npm install
Set-Location ..

# Criar arquivo .env a partir do exemplo
Write-Host "Configurando arquivo .env..."
Copy-Item "server\.env.example" "server\.env"

Write-Host "Instalação concluída!"
Write-Host ""
Write-Host "Para iniciar o projeto:"
Write-Host "1. Configure as chaves de API no arquivo server/.env"
Write-Host "2. Inicie o backend: cd server && npm start"
Write-Host "3. Em outro terminal, inicie o frontend: npm start"
