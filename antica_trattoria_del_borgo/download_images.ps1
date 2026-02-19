$images = @{
    "dish1.png" = "https://images.unsplash.com/photo-1612874742237-6526221588e3?q=80&w=2000&auto=format&fit=crop"
    "dish2.png" = "https://loremflickr.com/2000/1333/pasta,amatriciana"
    "dish3.png" = "https://loremflickr.com/2000/1333/pasta,cheese,pepper"
    "dish4.png" = "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=2000&auto=format&fit=crop"
    "dish5.png" = "https://loremflickr.com/2000/1333/ravioli,pasta"
    "dish6.png" = "https://loremflickr.com/2000/1333/braised,beef"
    "dish7.png" = "https://images.unsplash.com/photo-1546241072-48010ad2862c?q=80&w=2000&auto=format&fit=crop"
    "dish8.png" = "https://loremflickr.com/2000/1333/meat,ossobuco"
    "dish9.png" = "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2000&auto=format&fit=crop"
    "dish10.png" = "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=2000&auto=format&fit=crop"
    "trattoria_interior.png" = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
    "pasta_dish.png" = "https://loremflickr.com/2000/1333/pasta,dish"
}

# Ensure directory exists
New-Item -ItemType Directory -Force -Path "images"

foreach ($key in $images.Keys) {
    $url = $images[$key]
    $output = "images/$key"
    
    if (Test-Path $output) {
        Write-Host "Skipping $key (already exists)"
        continue
    }

    Write-Host "Downloading $key from $url..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -UserAgent "Mozilla/5.0"
    } catch {
        Write-Error "Failed to download $key from $url. Error: $_"
    }
}