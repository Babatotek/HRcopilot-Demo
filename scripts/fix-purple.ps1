# Replace all violet/purple with blue across the entire src/demo and onboarding system
$files = Get-ChildItem -Recurse -Include "*.tsx","*.ts","*.css" -Path "src","pages","components","index.css" | Where-Object { $_.FullName -notmatch "node_modules" }

foreach ($file in $files) {
    $c = Get-Content $file.FullName -Raw -Encoding UTF8
    $original = $c

    # Tailwind violet → blue equivalents
    $c = $c -replace 'violet-50',  '[#e0f2fe]'
    $c = $c -replace 'violet-100', '[#bae6fd]'
    $c = $c -replace 'violet-200', '[#7dd3fc]'
    $c = $c -replace 'violet-300', '[#38bdf8]'
    $c = $c -replace 'violet-400', '[#0ea5e9]'
    $c = $c -replace 'violet-500', '[#0284c7]'
    $c = $c -replace 'violet-600', '[#0369a1]'
    $c = $c -replace 'violet-700', '[#075985]'
    $c = $c -replace 'violet-800', '[#0c4a6e]'
    $c = $c -replace 'violet-900', '[#082f49]'

    # Tailwind purple → blue equivalents
    $c = $c -replace 'purple-50',  '[#e0f2fe]'
    $c = $c -replace 'purple-100', '[#bae6fd]'
    $c = $c -replace 'purple-200', '[#7dd3fc]'
    $c = $c -replace 'purple-300', '[#38bdf8]'
    $c = $c -replace 'purple-400', '[#0ea5e9]'
    $c = $c -replace 'purple-500', '[#0284c7]'
    $c = $c -replace 'purple-600', '[#0369a1]'
    $c = $c -replace 'purple-700', '[#075985]'
    $c = $c -replace 'purple-800', '[#0c4a6e]'
    $c = $c -replace 'purple-900', '[#082f49]'

    # Tailwind indigo → blue equivalents
    $c = $c -replace 'indigo-50',  '[#eff6ff]'
    $c = $c -replace 'indigo-100', '[#dbeafe]'
    $c = $c -replace 'indigo-200', '[#bfdbfe]'
    $c = $c -replace 'indigo-300', '[#93c5fd]'
    $c = $c -replace 'indigo-400', '[#60a5fa]'
    $c = $c -replace 'indigo-500', '[#3b82f6]'
    $c = $c -replace 'indigo-600', '[#2563eb]'
    $c = $c -replace 'indigo-700', '[#1d4ed8]'
    $c = $c -replace 'indigo-800', '[#1e40af]'
    $c = $c -replace 'indigo-900', '[#1e3a8a]'

    # Hex purple/violet values → blue
    $c = $c -replace '#7c3aed', '#0369a1'
    $c = $c -replace '#6366f1', '#2563eb'
    $c = $c -replace '#8b5cf6', '#0ea5e9'
    $c = $c -replace '#a855f7', '#38bdf8'
    $c = $c -replace '#9333ea', '#0284c7'
    $c = $c -replace '#7e22ce', '#075985'
    $c = $c -replace '#4f46e5', '#1d4ed8'
    $c = $c -replace '#4338ca', '#1e40af'
    $c = $c -replace '#6d28d9', '#0369a1'
    $c = $c -replace '#5b21b6', '#075985'
    $c = $c -replace '#d630ff', '#0ea5e9'
    $c = $c -replace '#4c49d8', '#2563eb'
    $c = $c -replace '#1e4d8c', '#0047cc'
    $c = $c -replace '#0d0a1e', '#020d1a'
    $c = $c -replace '#130d2a', '#021020'
    $c = $c -replace '#0a0f1e', '#020d1a'

    # rgba purple/violet
    $c = $c -replace 'rgba\(139,92,246', 'rgba(14,165,233'
    $c = $c -replace 'rgba\(167,139,250', 'rgba(56,189,248'
    $c = $c -replace 'rgba\(99,102,241', 'rgba(37,99,235'
    $c = $c -replace 'rgba\(124,58,237', 'rgba(3,105,161'
    $c = $c -replace 'rgba\(13,8,28', 'rgba(2,13,26'
    $c = $c -replace 'rgba\(13, 8, 28', 'rgba(2, 13, 26'

    if ($c -ne $original) {
        Set-Content $file.FullName -Value $c -Encoding UTF8
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "Done"
