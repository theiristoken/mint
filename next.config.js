/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_VERIFY_ENDPOINT: process.env.NEXT_PUBLIC_VERIFY_ENDPOINT,
    NEXT_PUBLIC_CLAIM_ENDPOINT: process.env.NEXT_PUBLIC_CLAIM_ENDPOINT,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
	  NEXT_PUBLIC_OKEN_ADDRESS: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
	  NEXT_PUBLIC_PUBLIC_WLD_APP_ID: process.env.NEXT_PUBLIC_PUBLIC_WLD_APP_ID,
	  NEXT_PUBLIC_PUBLIC_WLD_ACTION: process.env.NEXT_PUBLIC_PUBLIC_WLD_ACTION,
  }
}

module.exports = nextConfig
