import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    'firebase',
    '@firebase/app',
    '@firebase/firestore',
    '@firebase/util',
    '@grpc/grpc-js',
    '@grpc/proto-loader',
    'protobufjs',
  ],
};

export default nextConfig;
