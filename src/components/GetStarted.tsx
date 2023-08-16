import { ConnectWallet } from "@thirdweb-dev/react";

export default function GetStarted({time, out}: {time: number, out: boolean}) {

	const formatTime = (num: number) =>{
		const h = Math.floor((num)/(3600*1000));
		const m = Math.floor((num-h*3600*1000)/(60*1000));
		const s = Math.floor((num-h*3600*1000-m*60*1000)/(1000));
		return (' in ' + h.toString().padStart(2, '0')+' :'+m.toString().padStart(2, '0')+' :'+s.toString().padStart(2, '0'));
	}

	const evaluate = (d:number)=>{
		const p = 10262.502185213996;
		const a = 3600*24;
		const value = 1000 + 10000000*(Math.log((d/a)+p)/((d/a)+p));
		return value.toLocaleString("US");
	};

	return (
		<div className="flex flex-col justify-center items-center">
			{!out && <div className="flex flex-col justify-center items-center">
				<h1 className="my-2 font-bold text-xl md:text-2xl text-center">It's GO time{time>0? " soon":""}.</h1>
				<h1 className="mt-4 mb-8 text-3xl md:text-4xl font-bold text-center">
					Grab TiTs{time>0? formatTime(time):""}.
				</h1>	
			</div>}
			{out && <div className="flex flex-col justify-center items-center">
				<h1 className="my-2 font-bold text-lg md:text-xl text-center">GO time is over.</h1>
				<h1 className="mb-6 text-4xl md:text-5xl font-bold text-center">
					All TiTs grabbed.
				</h1>	
			</div>}
			
			<div className="p-4 m-4 rounded-lg flex bg-gradient-to-r from-slate-100 to-slate-200 text-lg text-center">
				<div>
					<h1 className="font-bold">Connect your wallet</h1>
					<p>You may use a compatible cryptocurrency wallet such as 
						<a className="font-bold hover:text-neutral-200 text-slate-600 mx-1" href="https://metamask.io" target="_blank">Metamask</a>or 
						<a className="font-bold hover:text-neutral-200 text-slate-600 ml-1" href="https://rainbow.me" target="_blank">Rainbow</a>
					.</p>
				</div>
			</div>

			<div className="p-4 m-4 rounded-lg flex bg-gradient-to-r from-slate-100 to-slate-200 text-lg text-center">
				<div>
					<h1 className="font-bold">Verify your iris</h1>
					<p>You may use the iris uniqueness attestation provided by a
						<a className="font-bold hover:text-neutral-200 text-slate-600" href="https://worldcoin.org/find-orb" target="_blank"> World ID Orb</a> 
						.</p>
				</div>
			</div>
			<div className="p-4 m-4 rounded-lg flex bg-gradient-to-r from-slate-100 to-slate-200 text-lg text-center">
				<div>
					<h1 className="font-bold">Claim your allowance</h1>
					<p>If you make it in time, you may take hold of  {time<=0?evaluate(-time):(10000).toLocaleString("US")} TiTs.</p>
				</div>
			</div>
			
			<div className="my-4 self-center">
				<ConnectWallet btnTitle="Get Started" className="hover:bg-white rounded-lg" style={{fontWeight:'bold', fontSize:'large'}}/>
			</div>
		</div>
	);
}