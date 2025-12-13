import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(); // Cela cherche i18n/request.ts par défaut

/** @type {import('next').NextConfig} */
const nextConfig = {
    // On autorise les images de partout pour ton Storage Supabase
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

export default withNextIntl(nextConfig);