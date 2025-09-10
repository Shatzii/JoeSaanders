#!/bin/bash

# Tournament images
declare -a tournaments=(
    "stones-2025:Stones Golf Championship:T-5th"
    "uncle-joe-2025:Uncle Joe Classic:2nd Place"
    "pga-qualifying-2025:PGA Tour Qualifying:T-12th"
    "korn-ferry-2025:Korn Ferry Tour Championship:T-8th"
    "spring-classic-2025:Spring Classic Invitational:1st Place"
    "mini-tour-2025:Mini-Tour Championship:T-3rd"
    "winter-series-2025:Winter Series Finale:T-15th"
    "season-opener-2025:Season Opener Classic:T-22nd"
)

# Sponsor images
declare -a sponsors=(
    "stones-golf:Stones Golf:Gold"
    "titleist:Titleist:Silver"
    "callaway:Callaway:Silver"
)

# Merch images
declare -a merch=(
    "cap:Official Uncle Joe Cap"
    "polo:Stones Golf Polo"
    "towel:Uncle Joe Towel"
)

# Create tournament images
for tournament in "${tournaments[@]}"; do
    IFS=':' read -r filename title result <<< "$tournament"
    cat > "public/images/tournament-$filename.svg" << SVG_EOF
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#0a0a0a"/>
  <rect x="0" y="500" width="800" height="100" fill="#d4af37"/>
  <text x="400" y="280" text-anchor="middle" fill="#d4af37" font-family="Arial" font-size="36" font-weight="bold">$title</text>
  <text x="400" y="320" text-anchor="middle" fill="#fafafa" font-family="Arial" font-size="24">$result</text>
  <text x="400" y="550" text-anchor="middle" fill="#0a0a0a" font-family="Arial" font-size="18">Tournament Photo</text>
</svg>
SVG_EOF
done

# Create sponsor images
for sponsor in "${sponsors[@]}"; do
    IFS=':' read -r filename name tier <<< "$sponsor"
    cat > "public/images/sponsor-$filename.svg" << SVG_EOF
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="100" fill="#0a0a0a" stroke="#d4af37" stroke-width="2"/>
  <text x="100" y="40" text-anchor="middle" fill="#d4af37" font-family="Arial" font-size="18" font-weight="bold">$name</text>
  <text x="100" y="65" text-anchor="middle" fill="#fafafa" font-family="Arial" font-size="14">$tier Partner</text>
</svg>
SVG_EOF
done

# Create merch images
for item in "${merch[@]}"; do
    IFS=':' read -r filename name <<< "$item"
    cat > "public/images/merch-$filename.svg" << SVG_EOF
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#0a0a0a"/>
  <rect x="0" y="350" width="400" height="50" fill="#d4af37"/>
  <text x="200" y="200" text-anchor="middle" fill="#d4af37" font-family="Arial" font-size="24" font-weight="bold">$name</text>
  <text x="200" y="375" text-anchor="middle" fill="#0a0a0a" font-family="Arial" font-size="16">Official Merchandise</text>
</svg>
SVG_EOF
done

echo "All placeholder images created successfully!"
