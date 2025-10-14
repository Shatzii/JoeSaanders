#!/bin/bash

# Uncle Joe's Golf - Demo Accounts Setup Script
# This script creates demo admin and user accounts for testing

echo "👤 Setting up demo accounts for Uncle Joe's Golf..."
echo "=================================================="

# Load environment variables from .env.local
if [ -f "../.env.local" ]; then
    export $(grep -v '^#' ../.env.local | xargs)
fi

# Check if required environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Missing Supabase configuration. Please set:"
    echo "   NEXT_PUBLIC_SUPABASE_URL"
    echo "   SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

# Create demo accounts using Supabase Admin API
echo "📝 Creating demo accounts..."

# Demo Admin Account
echo "Creating admin account: admin@stonesgolf.com"
curl -X POST "${NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users" \
  -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@stonesgolf.com",
    "password": "AdminPass123!",
    "email_confirm": true,
    "user_metadata": {
      "full_name": "Joe Sanders Admin",
      "role": "admin"
    }
  }' 2>/dev/null || echo "Admin account may already exist"

# Demo User Accounts
echo "Creating user accounts..."

USERS=(
  "golfer1@stonesgolf.com:GolferPass123!:John Smith"
  "golfer2@stonesgolf.com:GolferPass123!:Sarah Johnson"
  "golfer3@stonesgolf.com:GolferPass123!:Mike Wilson"
  "golfer4@stonesgolf.com:GolferPass123!:Emily Davis"
  "golfer5@stonesgolf.com:GolferPass123!:David Brown"
)

for user in "${USERS[@]}"; do
    IFS=':' read -r email password name <<< "$user"
    echo "Creating user account: $email ($name)"

    curl -X POST "${NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users" \
      -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
      -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$email\",
        \"password\": \"$password\",
        \"email_confirm\": true,
        \"user_metadata\": {
          \"full_name\": \"$name\",
          \"role\": \"user\"
        }
      }" 2>/dev/null || echo "User account may already exist"
done

echo ""
echo "✅ Demo accounts created successfully!"
echo ""
echo "📋 Demo Account Credentials:"
echo "=============================="
echo "ADMIN ACCOUNT:"
echo "  Email: admin@stonesgolf.com"
echo "  Password: AdminPass123!"
echo "  Role: Administrator"
echo ""
echo "USER ACCOUNTS:"
echo "  golfer1@stonesgolf.com - John Smith"
echo "  golfer2@stonesgolf.com - Sarah Johnson"
echo "  golfer3@stonesgolf.com - Mike Wilson"
echo "  golfer4@stonesgolf.com - Emily Davis"
echo "  golfer5@stonesgolf.com - David Brown"
echo ""
echo "  Password for all users: GolferPass123!"
echo ""
echo "🔐 Security Notes:"
echo "  - Change these passwords in production"
echo "  - Use strong, unique passwords"
echo "  - Consider implementing password policies"
echo ""
echo "🎯 Next Steps:"
echo "  1. Test login functionality with these accounts"
echo "  2. Verify admin features work correctly"
echo "  3. Test user permissions and access levels"
echo "  4. Remove or disable demo accounts in production"