# Windows 本机实测：winget 安装 zoxide，按 Windows 教程逐步验证，输出 JSON 原始记录。
# 不改用户的 $PROFILE：用临时 profile 文件和临时 _ZO_DATA_DIR；结束后卸载 zoxide，恢复原状。
# PowerShell 只在绘制提示符时记录目录，脚本里每次 cd 之后手动调用一次 prompt 函数，模拟按回车后重绘提示符。
param([string]$Output = "$env:TEMP\zo-evidence-20261108\windows-results.json")

$ErrorActionPreference = 'Continue'
$root = Join-Path $env:TEMP 'zo-evidence-20261108'
Remove-Item -Recurse -Force $root -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Force $root | Out-Null
$records = [System.Collections.Generic.List[object]]::new()
$userHome = $env:USERPROFILE

function Hide-User([string]$text) {
  if ($null -eq $text) { return '' }
  return $text.Replace($userHome, 'C:\Users\YourName')
}

# 在全新的 pwsh 进程里跑一段脚本，记录退出码和输出
function Invoke-Fresh([string]$label, [string]$script) {
  $file = Join-Path $root ("step-" + ($records.Count + 1) + '.ps1')
  Set-Content -Path $file -Value $script -Encoding utf8
  $out = & pwsh -NoLogo -NoProfile -File $file 2>&1 | Out-String
  $code = $LASTEXITCODE
  $records.Add([ordered]@{ label = $label; command = (Hide-User $script); exit = $code; output = (Hide-User $out.TrimEnd()) })
}

# 新进程需要读到 winget 刚写入的用户 PATH
$pathFix = '$env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")'

$os = Get-CimInstance Win32_OperatingSystem
$records.Add([ordered]@{ label = 'environment'; command = 'Get-CimInstance Win32_OperatingSystem; $PSVersionTable'; exit = 0; output = (
  "$($os.Caption) $($os.Version) build $($os.BuildNumber) (DisplayVersion $((Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion').DisplayVersion))`n" +
  "PowerShell $($PSVersionTable.PSVersion)`nwinget $(winget --version)`nCPU $((Get-CimInstance Win32_Processor).Name.Trim())") })

Invoke-Fresh 'before install: zoxide on PATH?' "$pathFix`nGet-Command zoxide -ErrorAction SilentlyContinue; 'found=' + [bool](Get-Command zoxide -ErrorAction SilentlyContinue)"

$install = winget install --id ajeetdsouza.zoxide -e --disable-interactivity 2>&1 | Out-String
$records.Add([ordered]@{ label = 'install'; command = 'winget install --id ajeetdsouza.zoxide -e'; exit = $LASTEXITCODE; output = (($install -split "`n" | Where-Object { $_ -match '\S' -and $_ -notmatch '^[\s\-\\|/]+$' -and $_ -notmatch '[█▒]' }) -join "`n") })

Invoke-Fresh 'new window: version and location' "$pathFix`nzoxide --version`n(Get-Command zoxide).Source"
Invoke-Fresh 'new window before init: z' "$pathFix`ntry { Get-Command z -ErrorAction Stop } catch { `$_.Exception.Message; exit 1 }"

# 临时 profile，内容就是教程里的那一行
$profileFile = Join-Path $root 'Microsoft.PowerShell_profile.ps1'
Set-Content -Path $profileFile -Value 'Invoke-Expression (& { (zoxide init powershell | Out-String) })' -Encoding utf8
$dataDir = Join-Path $root 'data'
New-Item -ItemType Directory -Force $dataDir | Out-Null
$demo = Join-Path $root 'zo-demo'
'projects\web-app\src', 'projects\api-server', 'notes\2026' | ForEach-Object { New-Item -ItemType Directory -Force (Join-Path $demo $_) | Out-Null }

$session = @"
$pathFix
`$env:_ZO_DATA_DIR = '$dataDir'
. '$profileFile'
function Visit(`$p) { Set-Location `$p; `$null = & `$function:prompt }   # 模拟回车后重绘提示符
'--- Get-Command z, zi'
Get-Command z, zi | Format-Table CommandType, Name, Definition -AutoSize | Out-String -Width 200
'--- database before visits'
zoxide query -ls
Visit '$demo\projects\web-app\src'
Visit '$demo'
Visit '$demo\projects\web-app\src'
Visit '$demo\notes\2026'
Visit '$demo\projects\api-server'
'--- zoxide query -ls'
zoxide query -ls | Where-Object { `$_ -like '*zo-demo\*\*' }
Set-Location '$demo'
'--- z web'
z web 2>&1 | Out-String
'--- z web src'
z web src; (Get-Location).Path
Set-Location '$demo'
'--- z proj api'
z proj api; (Get-Location).Path
'--- zi (fzf on PATH: ' + [bool](Get-Command fzf -ErrorAction SilentlyContinue) + ')'
"@
Invoke-Fresh 'session with the profile line (prompt drawn after each visit)' $session

# 不画提示符的脚本里 cd 不会被记录
$dataDir2 = Join-Path $root 'data-script'
New-Item -ItemType Directory -Force $dataDir2 | Out-Null
Invoke-Fresh 'cd inside a script, no prompt drawn' "$pathFix`n`$env:_ZO_DATA_DIR = '$dataDir2'`n. '$profileFile'`nSet-Location '$demo\projects\api-server'`nSet-Location '$demo'`n'entries=' + @(zoxide query -l).Count`nzoxide query api 2>&1 | Out-String"

# --cmd cd
Invoke-Fresh '--cmd cd variant' "$pathFix`n`$env:_ZO_DATA_DIR = '$dataDir'`nInvoke-Expression (& { (zoxide init powershell --cmd cd | Out-String) })`nGet-Command cd, cdi | Format-Table CommandType, Name, Definition -AutoSize | Out-String -Width 200`nSet-Location '$demo'`ncd api; (Get-Location).Path"

# 恢复原状：本机原来没有 zoxide
$remove = winget uninstall --id ajeetdsouza.zoxide -e --disable-interactivity 2>&1 | Out-String
$records.Add([ordered]@{ label = 'cleanup: uninstall'; command = 'winget uninstall --id ajeetdsouza.zoxide -e'; exit = $LASTEXITCODE; output = (($remove -split "`n" | Where-Object { $_ -match '\S' -and $_ -notmatch '^[\s\-\\|/]+$' -and $_ -notmatch '[█▒]' }) -join "`n") })

$report = [ordered]@{
  platform = 'windows'
  executed_at_utc = (Get-Date).ToUniversalTime().ToString('o')
  method = 'Local Windows machine. Each step runs in a fresh pwsh -NoProfile process with the user PATH re-read, as a new window would. The init line lives in a temporary profile file that each session dot-sources. PowerShell records directories from its prompt function, so the session calls the prompt function after each Set-Location, which is what pressing Enter in a window does. User home is shown as C:\Users\YourName.'
  commands = $records
}
$report | ConvertTo-Json -Depth 5 | Set-Content -Path $Output -Encoding utf8
Get-Content $Output
