import '@/styles/globals.css'
import { ThirdwebProvider, metamaskWallet } from '@thirdweb-dev/react';
import type { AppProps } from 'next/app'
import Head from 'next/head';
import Constants from "@/constants";

const clientId = Constants.clientId;
const activeChain = Constants.activeChain;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider 
      clientId={clientId}
      activeChain={activeChain}
      supportedWallets={[metamaskWallet()]}
      >
      <Head>
        <title>The iris Token</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="An ERC-20 token for iris Verified Individuals."
        />
        <meta
          name="keywords"
          content="Nadir Hajarabi, crypto, cryptocurrency, digital asset, collateral, defi, blockchain, ico, token, worldcoin, iris scan, world id, metamask, orb, orb verification, eye scan, biometrics, proof of personhood"
        />
      </Head>
      
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
