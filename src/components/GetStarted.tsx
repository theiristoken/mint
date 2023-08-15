import { ConnectWallet } from "@thirdweb-dev/react";

export default function GetStarted({time, out}: {time: number, out: boolean}) {

	const formatTime = (num: number) =>{
		const d = Math.floor(num/(24*3600*1000));
		const h = Math.floor((num-d*24*3600*1000)/(3600*1000));
		const m = Math.floor((num-d*24*3600*1000-h*3600*1000)/(60*1000));
		const s = Math.floor((num-d*24*3600*1000-h*3600*1000-m*60*1000)/(1000));
		return (' in ' + d.toString().padStart(2, '0')+' :'+ h.toString().padStart(2, '0')+' :'+m.toString().padStart(2, '0')+' :'+s.toString().padStart(2, '0'));
	}

	const evaluate = (d:number)=>{
		const p = 10262.502185213996;
		const a = 3600*24;
		const value = 1000 + 10000000*(Math.log((d/a)+p)/((d/a)+p));
		return value.toLocaleString("US");
	};

	return (
		<div className="flex flex-col justify-start items-start">
			{!out && <div className="flex flex-col justify-center items-center self-center">
				<h1 className="my-2 font-bold text-lg md:text-xl text-center">It's GO time{time>0? " soon":""}.</h1>
				<h1 className="mt-4 mb-8 text-2xl md:text-4xl font-bold text-center">
					Grab TiTs{time>0? formatTime(time):""}.
				</h1>	
			</div>}
			{out && <div className="flex flex-col justify-center items-center self-center">
				<h1 className="my-2 font-bold text-lg md:text-xl text-center">GO time is gone.</h1>
				<h1 className="mb-6 text-4xl md:text-5xl font-bold text-center">
					All TiTs grabbed.
				</h1>	
			</div>}
			
			<div className="flex text-lg flex-row items-center justify-between py-2">
				<div className="p-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full mx-4 w-12 h-12">
					<p className="text-center text-xl font-bold text-transparent bg-clip-text bg-slate-900">
						1
					</p>
				</div>
				<div>
					<h1 className="font-bold">Connect your wallet</h1>
					<p>You may use a compatible wallet such as 
						<a className="font-bold hover:text-neutral-200 text-slate-600 mx-1" href="https://metamask.io" target="_blank">Metamask</a>or 
						<a className="font-bold hover:text-neutral-200 text-slate-600 ml-1" href="https://rainbow.me" target="_blank">Rainbow</a>
					.</p>
				</div>
			</div>
			
			<div className="flex text-lg flex-row items-center justify-between py-2 my-2">
				<div className="p-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full mx-4 w-12 h-12">
					<p className="text-center text-xl font-bold text-transparent bg-clip-text bg-slate-900">
						2
					</p>
				</div>
				<div>
					<h1 className="font-bold">Verify your iris</h1>
					<p>You may use a valid and accessible
						<a className="font-bold hover:text-neutral-200 text-slate-600 mx-1" href="https://worldcoin.org/find-orb" target="_blank">World ID Orb</a> 
						verification.</p>
				</div>
			</div>
			<div className="flex text-lg flex-row items-center justify-between py-2 my-2">
				<div className="p-2 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full mx-4 w-12 h-12">
					<p className="text-center text-xl font-bold text-transparent bg-clip-text bg-slate-900">
						3
					</p>
				</div>
				<div>
					<h1 className="font-bold">Claim TiTs</h1>
					<p>If you make it in time, you may take hold of  {time<=0?evaluate(-time):(10000).toLocaleString("US")} TiTs.</p>
				</div>
			</div>
			<div className="p-4 self-center">
				<ConnectWallet btnTitle="Connect Wallet" className=" bg-black py-4 px-6 rounded-lg mx-4 items-center hover:bg-white hover:border-2 hover:border-black" style={{fontWeight:'bold'}}/>
			</div>
		</div>
	);
}