import { ConnectWallet } from "@thirdweb-dev/react";

export default function GetStarted() {
	return (
		<div className="flex flex-col justify-start items-start w-96">
			<h1 className="flex flex-col items-center justify-center p-4 self-center text-2xl font-bold">
				Grab your TiTs
			</h1>
			<div className="flex flex-row items-center justify-between py-2">
				<div className="bg-black py-2 px-4 rounded-full mr-6 w-10">
					<h1 className="font-bold text-white">1</h1>
				</div>
				<div>
					<h1 className="font-bold">Connect your wallet</h1>
					<p>You need a compatible wallet such as 
						<a className="font-bold hover:text-neutral-200 text-slate-600 mx-1" href="https://metamask.io" target="_blank">Metamask</a>or 
						<a className="font-bold hover:text-neutral-200 text-slate-600 ml-1" href="https://rainbow.me" target="_blank">Rainbow</a>
					.</p>
				</div>
			</div>
			<div className="flex flex-row items-center justify-between py-2">
				<div className="bg-black py-2 px-4 rounded-full mr-6 w-10">
					<h1 className="font-bold text-white">2</h1>
				</div>
				<div>
					<h1 className="font-bold">Verify your iris</h1>
					<p>You need a valid
						<a className="font-bold hover:text-neutral-200 text-slate-600 mx-1" href="https://worldcoin.org/find-orb" target="_blank">World ID Orb</a> 
						verification and access to the 
						<a className="font-bold hover:text-neutral-200 text-slate-600 ml-1" href="https://worldcoin.org/world-app" target="_blank">World App</a>
						.</p>
				</div>
			</div>
			<div className="flex flex-row items-center justify-between py-2">
				<div className="bg-black py-2 px-4 rounded-full mr-6 w-10">
					<h1 className="font-bold text-white">3</h1>
				</div>
				<div>
					<h1 className="font-bold">Claim your TiTs</h1>
					<p>Once verified, your wallet is allowed to mint your 1,000 TiT allowance.</p>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center p-4 self-center">
			<ConnectWallet btnTitle="Get Started" className="self-center bg-black py-4 px-6 rounded-lg mx-4 items-center hover:bg-white hover:border-2 hover:border-black" style={{fontWeight:'bold'}}/>
			</div>
		</div>
	);
}