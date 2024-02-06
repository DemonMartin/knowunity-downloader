/** @type {import('next').NextConfig} */
const nextConfig = {
    images: 
    {
        remotePatterns: [{
            hostname: '*.knowunity.com',
        }]
    },
};

export default nextConfig;
