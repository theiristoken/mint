import '@/styles/globals.css'
import { ThirdwebProvider, metamaskWallet } from '@thirdweb-dev/react';
import type { AppProps } from 'next/app'
import Head from 'next/head';
import Constants from "@/constants";
import { useEffect } from 'react';

const clientId = Constants.clientId;
const activeChain = Constants.activeChain;

export default function App({ Component, pageProps }: AppProps) {
  
  useEffect(()=>{
    const userAgent = navigator.userAgent;
    const versionString = userAgent.match(/OS ((\d+_?){2,3})\s/);
    if (versionString && versionString[1]){
      const version = Number(versionString[1].replace("_","."));
      if(version>=16) {
        document.body.style.fontFamily = 'Outfit';
      }
    } else {
      document.body.style.fontFamily = 'Cairo Play';
    }
  }, [])


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
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Cairo+Play:wght@300;600&family=Outfit:wght@300;600&display=swap" rel="stylesheet"/>
        <meta
          name="keywords"
          content="Nadir Hajarabi, crypto, cryptocurrency, digital asset, collateral, defi, blockchain, ico, token, worldcoin, iris scan, world id, metamask, orb, orb verification, eye scan, biometrics, proof of personhood"
        />
      </Head>
      
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
