import '@/styles/globals.css'
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import type { AppProps } from 'next/app'
import Head from 'next/head';


const activeChain = 420;
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={activeChain}>
      <Head>
        <title>The iris Token</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="An ERC-20 token for iris Verified Individuals."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Cairo+Play:wght@300;600&display=swap" rel="stylesheet"/>
        <meta
          name="keywords"
          content="Nadir Hajarabi, crypto, cryptocurrency, digital asset, collateral, defi, blockchain, ico, token, worldcoin, iris scan, world id, metamask, orb, orb verification, eye scan, biometrics, proof of personhood"
        />
        
      </Head>
      
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
