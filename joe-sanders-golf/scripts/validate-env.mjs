#!/usr/bin/env node
/* Simple environment validation for production readiness */
const requiredPublic = [
  'NEXT_PUBLIC_GA4_ID'
];
const requiredServer = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY'
];

const missing = [];

for (const key of requiredPublic) {
  if (!process.env[key]) missing.push(key);
}
for (const key of requiredServer) {
  if (!process.env[key]) missing.push(key);
}

if (missing.length) {
  console.error('\n[env:validate] Missing required environment variables:');
  for (const m of missing) console.error(' - ' + m);
  process.exit(1);
} else {
  console.log('[env:validate] All required environment variables present.');
}