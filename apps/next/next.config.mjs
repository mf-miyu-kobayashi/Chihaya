/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // next/image で外部サイトの画像を表示するには、
    // 読み込みを許可するドメインをここに書く必要がある。
    // 絵札の画像はウィキメディアにあるものを使っている。
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
    ];
  },
};

export default nextConfig;
