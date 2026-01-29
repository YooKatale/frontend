# PowerShell script to send test subscription emails
# Make sure your Next.js dev server is running: npm run dev

$emails = @(
    "arihotimothy89@gmail.com",
    "timothy.arihoz@protonmail.com",
    "yookatale256@gmail.com"
)

$apiUrl = "http://localhost:3000/api/mail"

Write-Host "Starting to send test emails..." -ForegroundColor Cyan
Write-Host "API URL: $apiUrl" -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$failCount = 0

for ($i = 0; $i -lt $emails.Length; $i++) {
    $email = $emails[$i]
    Write-Host "Sending subscription email to: $email"
    
    try {
        $body = @{
            email = $email
            type = "subscription"
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri $apiUrl -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
        
        $result = $response.Content | ConvertFrom-Json
        Write-Host "[SUCCESS] Sent to $email" -ForegroundColor Green
        Write-Host "   Message: $($result.message)" -ForegroundColor Green
        Write-Host ""
        $successCount++
    }
    catch {
        Write-Host "[FAILED] Could not send to $email" -ForegroundColor Red
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        $failCount++
    }
    
    if ($i -lt ($emails.Length - 1)) {
        Start-Sleep -Seconds 1
    }
}

Write-Host "Summary:" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "Successful: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
