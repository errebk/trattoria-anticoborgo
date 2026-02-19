$images = @{
    "dish1.png" = "1612874742237-6526221588e3?q=80&w=2000&auto=format&fit=crop"
    "dish2.png" = "1574868291636-2200ca1dd066?q=80&w=2000&auto=format&fit=crop"
    "dish3.png" = "1627909930722-19e48b301c51?q=80&w=2000&auto=format&fit=crop"
    "dish4.png" = "1473093295043-cdd812d0e601?q=80&w=2000&auto=format&fit=crop"
    "dish5.png" = "1587740967185-9a885f5431f9?q=80&w=2000&auto=format&fit=crop"
    "dish6.png" = "1608877907149-a27db7399160?q=80&w=2000&auto=format&fit=crop"
    "dish7.png" = "1546241072-48010ad2862c?q=80&w=2000&auto=format&fit=crop"
    "dish8.png" = "1544025162-d76690b67f11?q=80&w=2000&auto=format&fit=crop"
    "dish9.png" = "1600891964092-4316c288032e?q=80&w=2000&auto=format&fit=crop"
    "dish10.png" = "1565557623262-b51c2513a641?q=80&w=2000&auto=format&fit=crop"
    "trattoria_interior.png" = "1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
    "pasta_dish.png" = "1551183053-bf91b1d81161?q=80&w=2000&auto=format&fit=crop"
}

$baseUrl = "https://images.unsplash.com/photo-"

# Ensure directory exists
New-Item -ItemType Directory -Force -Path "images"

foreach ($key in $images.Keys) {
    $url = $baseUrl + $images[$key]
    $output = "images/$key"
    Write-Host "Downloading $key..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $output
    } catch {
        Write-Error "Failed to download $key"
    }
}