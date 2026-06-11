/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@shadergradient/react', '@react-three/fiber', 'three', '@paper-design/shaders-react', '@paper-design/shaders'],
};
export default nextConfig;
