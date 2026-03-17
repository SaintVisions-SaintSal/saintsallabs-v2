/** @type {import('next').NextConfig} */
const nextConfig = {
  // Headers for SSE streaming and CORS on API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, x-sal-key, stripe-signature' },
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
        ],
      },
    ];
  },

  // Image domains for AI-generated content
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'oaidalleapiprodscus.blob.core.windows.net' },
      { protocol: 'https', hostname: 'euxrlpuegeiggedqbkiv.supabase.co' },
      { protocol: 'https', hostname: 'saintsallabs-api.onrender.com' },
    ],
  },
};

export default nextConfig;
