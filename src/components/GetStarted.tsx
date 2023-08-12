import { ConnectWallet } from "@thirdweb-dev/react";

export default function GetStarted() {
	return (
		<div className="flex flex-col justify-start items-start w-full max-w-lg">
			<h1 className="flex flex-col items-center justify-center p-4 self-center text-2xl font-bold">
				It's time to grab TiTs!
			</h1>
			<div className="flex flex-row items-center justify-between py-2">
				<div className="bg-black py-2 px-4 rounded-full mx-4 w-10">
					<h1 className="font-bold text-white">1</h1>
				</div>
				<div>
					<h1 className="font-bold">Connect your wallet</h1>
					<p>You may use a compatible wallet such as 
						<a className="font-bold hover:text-neutral-200 text-slate-600 mx-1" href="https://metamask.io" target="_blank">Metamask</a>or 
						<a className="font-bold hover:text-neutral-200 text-slate-600 ml-1" href="https://rainbow.me" target="_blank">Rainbow</a>
					.</p>
				</div>
			</div>
			<div className="flex flex-row items-center justify-between py-2">
				<div className="bg-black py-2 px-4 rounded-full mx-4 w-10">
					<h1 className="font-bold text-white">2</h1>
				</div>
				<div>
					<h1 className="font-bold">Verify your iris</h1>
					<p>You may use a valid and accessible
						<a className="font-bold hover:text-neutral-200 text-slate-600 mx-1" href="https://worldcoin.org/find-orb" target="_blank">World ID Orb</a> 
						verification.</p>
				</div>
			</div>
			<div className="flex flex-row items-center justify-between py-2">
				<div className="bg-black py-2 px-4 rounded-full mx-4 w-10">
					<h1 className="font-bold text-white">3</h1>
				</div>
				<div>
					<h1 className="font-bold">Hold TiTs</h1>
					<p>If TiTs are still available, you may claim an allowance of 1,000 TiTs.</p>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center p-4 self-center">
				<ConnectWallet btnTitle="Get Started" className="self-center bg-black py-4 px-6 rounded-lg mx-4 items-center hover:bg-white hover:border-2 hover:border-black" style={{fontWeight:'bold'}}/>
			</div>
		</div>
	);
}