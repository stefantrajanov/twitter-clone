import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.API_URL}/api/:path*`
            }
        ];
    }
};

export default nextConfig;
