/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'supabase.co', 'githubusercontent.com'], // Add domains for images from Supabase, GitHub, etc.
  },
}

module.exports = nextConfig
