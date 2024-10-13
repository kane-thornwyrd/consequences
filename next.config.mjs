/** @type {import('next').NextConfig} */
import pkg from './package.json' with { type: 'json' }

const nextConfig = {
  basePath: `/${pkg.name}`,
  output: "export",
  reactStrictMode: true,
};

export default nextConfig;
