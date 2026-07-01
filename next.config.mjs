/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-813548e1748445df89bb392c16d942ec.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  /* config options here */
  allowedDevOrigins: [
    '192.168.1.8',
    '192.168.1.6',
    '192.168.1.7',
    '192.168.1.9',
    '192.168.1.10',
    '192.168.1.2',
    '192.168.1.3',
    '192.168.1.4',
    '192.168.1.5',
    'localhost',
    '127.0.0.1'
  ]
};

export default nextConfig;
