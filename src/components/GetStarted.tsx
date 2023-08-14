import { ConnectWallet } from "@thirdweb-dev/react";

export default function GetStarted({time, out}: {time: number, out: boolean}) {

	const formatTime = (num: number) =>{
		const d = Math.floor(num/(24*3600*1000));
		const h = Math.floor((num-d*24*3600*1000)/(3600*1000));
		const m = Math.floor((num-d*24*3600*1000-h*3600*1000)/(60*1000));
		const s = Math.floor((num-d*24*3600*1000-h*3600*1000-m*60*1000)/(1000));
		return (' in '+ h.toString().padStart(2, '0')+' :'+m.toString().padStart(2, '0')+' :'+s.toString().padStart(2, '0'));
	}

	return (
		<div className="flex flex-col justify-start items-start w-full max-w-lg">
			{!out && <div className="flex flex-col justify-center items-center self-center">
				<h1 className="my-2 font-bold text-lg md:text-xl text-center">It's GO time{time>0? " soon":""}.</h1>
				<h1 className="mb-6 text-4xl md:text-5xl font-bold text-center">
					Grab TiTs{time>0? formatTime(time):""}.
				</h1>	
			</div>}
			{out && <div className="flex flex-col justify-center items-center self-center">
				<h1 className="my-2 font-bold text-lg md:text-xl text-center">GO time is gone.</h1>
				<h1 className="mb-6 text-4xl md:text-5xl font-bold text-center">
					All TiTs grabbed.
				</h1>	
			</div>}
			
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
			
			<div className="flex flex-row items-center justify-between py-2 my-2">
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
			<div className="flex flex-row items-center justify-between py-2 my-2">
				<div className="bg-black py-2 px-4 rounded-full mx-4 w-10">
					<h1 className="font-bold text-white">3</h1>
				</div>
				<div>
					<h1 className="font-bold">Claim TiTs</h1>
					<p>If you make it in time, you may take hold of an allowance of TiTs.</p>
				</div>
			</div>
			<div className="flex flex-col items-center justify-center p-4 self-center">
				<ConnectWallet btnTitle="Connect Wallet" className="self-center bg-black py-4 px-6 rounded-lg mx-4 items-center hover:bg-white hover:border-2 hover:border-black" style={{fontWeight:'bold'}}/>
			</div>
		</div>
	);
}