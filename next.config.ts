import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';
const withNextIntl = createNextIntlPlugin(); // Cela cherche i18n/request.ts par défaut

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = { 
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          // Utilise un wildcard pour accepter ton projet Supabase
          hostname: '**.supabase.co', 
        },
      ],
    },
  };
  
  export default withNextIntl(nextConfig);