# Script para publicar mudanças do develop para main
# Uso: .\publicar.ps1

Write-Host "[INICIO] Publicando develop para main..." -ForegroundColor Green

# Verifica se estamos em um repositório git
if (!(Test-Path ".git")) {
    Write-Host "[ERRO] Não estamos em um repositório git!" -ForegroundColor Red
    exit 1
}

try {
    # 1. Fetch para garantir que temos as últimas mudanças
    Write-Host "[FETCH] Buscando últimas mudanças do remoto..." -ForegroundColor Yellow
    git fetch origin

    # 2. Vai para develop e atualiza
    Write-Host "[DEVELOP] Mudando para branch develop..." -ForegroundColor Yellow
    git checkout develop
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Erro ao mudar para develop!" -ForegroundColor Red
        exit 1
    }

    Write-Host "[DEVELOP] Atualizando develop..." -ForegroundColor Yellow
    git pull origin develop
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Erro ao atualizar develop!" -ForegroundColor Red
        exit 1
    }

    # 3. Vai para main e atualiza
    Write-Host "[MAIN] Mudando para branch main..." -ForegroundColor Yellow
    git checkout main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Erro ao mudar para main!" -ForegroundColor Red
        exit 1
    }

    Write-Host "[MAIN] Atualizando main..." -ForegroundColor Yellow
    git pull origin main
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[AVISO] Erro ao atualizar main (pode não existir no remoto ainda)" -ForegroundColor Yellow
    }

    # 4. Faz merge do develop em main (força se necessário)
    Write-Host "[MERGE] Fazendo merge do develop em main..." -ForegroundColor Yellow
    git merge develop --no-ff -m "Merge develop to main - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[AVISO] Conflitos detectados ou erro no merge. Forçando reset..." -ForegroundColor Yellow
        git merge --abort 2>$null
        git reset --hard develop
        Write-Host "[OK] Main resetado para coincidir com develop" -ForegroundColor Green
    }

    # 5. Push forçado para main
    Write-Host "[PUSH] Enviando mudanças para main (força)..." -ForegroundColor Yellow
    git push origin main --force-with-lease
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[AVISO] Erro no push com --force-with-lease, tentando --force..." -ForegroundColor Yellow
        git push origin main --force
    }

    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] Erro ao enviar para main!" -ForegroundColor Red
        exit 1
    }

    # 6. Volta para develop
    Write-Host "[DEVELOP] Voltando para develop..." -ForegroundColor Yellow
    git checkout develop

    Write-Host "[SUCESSO] Publicação concluída com sucesso!" -ForegroundColor Green
    Write-Host "[INFO] Se o GitHub Pages estiver configurado para main, o site será atualizado em alguns minutos." -ForegroundColor Cyan

} catch {
    Write-Host "[ERRO] Erro durante a execução: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "[CONCLUIDO] Pronto! Develop foi publicado em main." -ForegroundColor Green
