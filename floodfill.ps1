Add-Type -AssemblyName System.Drawing

$rawPath = 'C:\Users\salahattin.acikgoz\.gemini\antigravity\scratch\salahattin-portfolio\bmo_raw.png'
$finalPath = 'C:\Users\salahattin.acikgoz\.gemini\antigravity\scratch\salahattin-portfolio\bmo.png'

$bmp = [System.Drawing.Bitmap]::FromFile($rawPath)
$w = $bmp.Width
$h = $bmp.Height

$visited = New-Object 'bool[,]' $w, $h
$queue = [System.Collections.Generic.Queue[System.Drawing.Point]]::new()

for ($x = 0; $x -lt $w; $x++) {
    $queue.Enqueue([System.Drawing.Point]::new($x, 0))
    $queue.Enqueue([System.Drawing.Point]::new($x, $h - 1))
}
for ($y = 0; $y -lt $h; $y++) {
    $queue.Enqueue([System.Drawing.Point]::new(0, $y))
    $queue.Enqueue([System.Drawing.Point]::new($w - 1, $y))
}

while ($queue.Count -gt 0) {
    $pt = $queue.Dequeue()
    $px = $pt.X
    $py = $pt.Y

    if ($px -lt 0 -or $px -ge $w -or $py -lt 0 -or $py -ge $h) { continue }
    if ($visited[$px, $py]) { continue }

    $visited[$px, $py] = $true
    $c = $bmp.GetPixel($px, $py)

    # If pixel is dark background, remove it
    if ($c.R -lt 40 -and $c.G -lt 40 -and $c.B -lt 40) {
        $bmp.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))

        $queue.Enqueue([System.Drawing.Point]::new($px + 1, $py))
        $queue.Enqueue([System.Drawing.Point]::new($px - 1, $py))
        $queue.Enqueue([System.Drawing.Point]::new($px, $py + 1))
        $queue.Enqueue([System.Drawing.Point]::new($px, $py - 1))
    }
}

$bmp.Save($finalPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
