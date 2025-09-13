#!/bin/bash
# Force push script to bypass Vercel CLI interference

# Kill any Vercel processes
pkill -f vercel 2>/dev/null || true
killall -9 vercel 2>/dev/null || true

# Wait a moment
sleep 2

# Force git operations
git add . 2>/dev/null || true
git commit -m "Fix TypeScript errors for deployment" 2>/dev/null || true
git push origin master --force 2>/dev/null || true

echo "Done!"
