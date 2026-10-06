$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root 'backend'
$frontend = Join-Path $root 'frontend'

Write-Host 'Install backend PHP dependencies via Composer:'
Write-Host "composer install --working-dir \"$backend\""

Write-Host ''
Write-Host 'Install frontend Node dependencies:'
Write-Host "npm install --prefix \"$frontend\""

Write-Host ''
Write-Host 'Then start the backend and frontend:'
Write-Host "php artisan serve --host=0.0.0.0 --port=8000 --working-dir \"$backend\""
Write-Host "npm run dev --prefix \"$frontend\""
