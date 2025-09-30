
#!/bin/bash

# Automate merging all branches into main
# Usage: ./merge-all-branches.sh

set -e  # Exit on any error

echo "🔄 Starting automated branch merge process..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Fetch latest changes
echo "📥 Fetching latest changes..."
git fetch --all --prune

# Switch to main branch
echo "🔄 Switching to main branch..."
git checkout main

# Pull latest changes
echo "⬇️ Pulling latest changes from main..."
git pull origin main

# Get list of all branches except main and current
BRANCHES=$(git branch -r | grep -v "origin/main" | grep -v "origin/HEAD" | sed 's|origin/||')

if [ -z "$BRANCHES" ]; then
    echo "✅ No other branches to merge"
    exit 0
fi

echo "📋 Branches to merge: $BRANCHES"

# Merge each branch
for branch in $BRANCHES; do
    echo "🔀 Merging branch: $branch"

    if git merge --no-ff origin/$branch --no-edit; then
        echo "✅ Successfully merged $branch"
    else
        echo "❌ Merge conflict in $branch"
        echo "🔧 Resolve conflicts manually, then run:"
        echo "   git add . && git commit -m 'Resolve merge conflicts'"
        echo "   git push origin main"
        exit 1
    fi
done

# Push merged changes
echo "⬆️ Pushing merged changes to main..."
git push origin main

echo "🎉 All branches successfully merged into main!"
echo "🚀 Deployment will trigger automatically if configured"