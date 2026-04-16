$f = 'pages/Landing.tsx'
$c = Get-Content $f -Raw -Encoding UTF8

# Fix marquee background to deep navy
$c = $c -replace 'class="absolute bottom-0 left-0 right-0 bg-\[#0ea5e9\] text-white py-4 overflow-hidden flex whitespace-nowrap z-30"', 'className="absolute bottom-0 left-0 right-0 text-white py-4 overflow-hidden flex whitespace-nowrap z-30" style={{ background: "linear-gradient(90deg, #0d1f3c, #0a3060, #0d1f3c)" }}'

# Also fix className version (JSX)
$c = $c -replace 'className="absolute bottom-0 left-0 right-0 bg-\[#0ea5e9\] text-white py-4 overflow-hidden flex whitespace-nowrap z-30"', 'className="absolute bottom-0 left-0 right-0 text-white py-4 overflow-hidden flex whitespace-nowrap z-30" style={{ background: "linear-gradient(90deg, #0d1f3c, #0a3060, #0d1f3c)" }}'

# Fix teal dots
$c = $c -replace 'className="w-1\.5 h-1\.5 rounded-full bg-white/60 flex-shrink-0"', 'className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#14b8a6" }}'

Set-Content $f -Value $c -Encoding UTF8
Write-Host 'Done'
