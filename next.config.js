/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    VERIFY_ENDPOINT: process.env.VERIFY_ENDPOINT,
    CLAIM_ENDPOINT: process.env.CLAIM_ENDPOINT,
    CHAIN_ID: process.env.CHAIN_ID,
	  TOKEN_ADDRESS: process.env.TOKEN_ADDRESS,
	  PUBLIC_WLD_APP_ID: process.env.PUBLIC_WLD_APP_ID,
	  PUBLIC_WLD_ACTION: process.env.PUBLIC_WLD_ACTION,
  }
}

module.exports = nextConfig
