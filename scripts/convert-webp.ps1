Add-Type -AssemblyName System.Drawing
$srcDir = 'C:\Users\User\Downloads\profiline-gm25-official-site\public\images\ai-webp'
$dstDir = 'C:\Users\User\Downloads\profiline-gm25-official-site\public\images\ai-jpg'
New-Item -ItemType Directory -Force -Path $dstDir | Out-Null
foreach ($f in (Get-ChildItem $srcDir -Filter '*.webp')) {
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $out = Join-Path $dstDir ($f.BaseName + '.jpg')
    $img.Save($out, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $img.Dispose()
    Write-Host "Done: $($f.Name)"
}
