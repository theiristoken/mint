import { SignedPayload20, useContract, useNetworkMismatch, useSwitchChain, useTokenBalance } from "@thirdweb-dev/react";
import { useState } from "react";
import Constants from "@/constants";
import Loader from "./Loader";
import Out from "./Out";

export default function Claimer({time, out, address, _claimed, _minted, reserve_end, _sig, _amount}: {time: number, out: boolean, address:string, _claimed: boolean, _minted: boolean, reserve_end?:number, _sig?: SignedPayload20, _amount?: number}) {
	const [ claimed, setClaimed ] = useState(_claimed);
	const [ minted, setMinted ] = useState(_minted);
	const [ newMint, setNewMint ] = useState(false);
	const [ amount, setAmount ] = useState(_amount);
	const [ reserveEnd, setReserveEnd ] = useState(reserve_end);
	const [ sig, setSig ] = useState(_sig);
	const [ isClaiming, setIsClaiming ] = useState(false);
	const [ isMinting, setIsMinting ] = useState(false);
	const [ errorShown, setErrorShown ] = useState(false);
	const [ errorDetail, setErrorDetail ] = useState("");
	const isMismatched = useNetworkMismatch();
  	const switchNetwork = useSwitchChain();
	const claimEndpoint = Constants.claimEndpoint;
	const activeChain = Constants.activeChain;
	const tokenAddress = Constants.tokenAddress;
	const { contract: tokenContract, isLoading: isLoadingToken } = useContract(tokenAddress);
	const { data: tokenData, isLoading: isLoadingBalance } = useTokenBalance(tokenContract, address);

	const formatDate = (num: number) =>{
		const date = new Date(num);
		return date.toLocaleDateString()+" "+date.toLocaleTimeString();
	}

	const evaluate = (d:number)=>{
		const p = 10262.502185213996;
		const a = 3600*24;
		const value = 1000 + 10000000*(Math.log((d/a)+p)/((d/a)+p));
		return value.toLocaleString("US");
	};

	const formatError = (str:string) => {
		const words = str.split(" ");
		for (let i = 0; i < words.length; i++) {
			words[i] = words[i][0].toUpperCase() + words[i].substring(1);
		}
		return words.join(" ");
	}

	const onClaim = async ()=>{
		setIsClaiming(true);
		setErrorShown(false);
		const res: Response = await fetch(claimEndpoint, {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({address: address}),
		})
		console.log(res);
		const data = await res.json();
		if(res.status == 200 || res.status == 201){
			const signature = data.signature;
			console.log("from server",signature);
			setSig(data.signature);
			setAmount(data.amount);
			console.log("quantity", amount);
			setIsClaiming(false);
			setClaimed(true);
			setReserveEnd(data.reserveEnd)
			localStorage.setItem('claimed'+address, Date.now().toString());
		} else {
			setIsClaiming(false);
			setErrorShown(true);
			setErrorDetail(data.detail);
			throw new Error(`Error code ${res.status} (${data.code}): ${data.detail}` ?? "Unknown error.");
		}
	}

	const onMint = async (sig: SignedPayload20)=>{
		setIsMinting(true);
		setErrorShown(false);
		if(!sig){
			setIsMinting(false);
			return;
		}

		tokenContract?.erc20.signature.mint(sig)
			.then((tx)=>{
				localStorage.setItem('minted'+address, Date.now().toString());
				setMinted(true);
				setNewMint(true);
				console.log('minted TiTs', tx);
				setIsMinting(false);
			}).catch((e)=>{
				console.log("lk");
				console.log(e,sig);
				setErrorShown(true);
				setErrorDetail(e.reason?formatError(e.reason):"");
				setIsMinting(false);
			});
	}

	return (
		<div className="flex flex-col items-center justify-center my-4">
			{(isLoadingToken || isClaiming || isMinting || isLoadingBalance) && <Loader/>}

			{!claimed && !minted && !out && !isClaiming && !isMinting && !isLoadingToken &&
			<div className="flex flex-col items-center justify-center">
				<p className="text-md text-center my-2">You can currently reserve an allowance of <span className="font-bold"> {time>=0?(10000).toLocaleString("US"):evaluate(-time)} </span>TiTs.</p>
				<button 
					disabled={isLoadingToken || isMismatched || minted || isClaiming || isMinting}
					onClick={onClaim} 
					className="bg-neutral-200 py-2 px-8 rounded-lg m-4 items-center hover:bg-white">
					<h1 className="font-bold text-black">Claim TiT Allowance</h1>
				</button>
			</div>}
			{!claimed && !minted && out && <Out/>}

			{claimed && !minted && !isClaiming && !isMinting && !isLoadingToken &&
			<div className="flex flex-col items-center justify-center">
				
				{isMismatched && <div className="flex flex-col items-center justify-center">
					<button  
						disabled={!isMismatched}
						onClick={()=>switchNetwork(activeChain)}
						className="bg-neutral-200 py-2 px-8 rounded-lg mx-4 items-center hover:bg-white">
						<h1 className="font-bold text-black" >Switch to Optimism</h1>
					</button>
					<p className="text-md font-bold text-rose-500 my-2">TiTs live on the Optimism</p>
				</div>}	

				{!isMismatched && amount && sig && reserveEnd && <div className="flex flex-col items-center justify-center">
					<p className="my-2 text-md text-center">You reserved an allowance of <span className="font-bold"> {amount.toLocaleString()} </span>TiTs.</p>
					{time<0 && <p className="text-md text-center my-2">You can mint it for free before <span className="italic font-bold">{formatDate(reserveEnd)}</span>.</p>}
					{time>0 && <p className="text-md text-center my-2">You can mint it for free between 
						<span className="italic font-bold"> {formatDate(Constants.start)} </span> 
						 and
						<span className="italic font-bold"> {formatDate(reserveEnd)}</span>.
					</p>}
					<button 
						disabled={isLoadingToken || isMismatched || minted || isClaiming || isMinting || time>0}
						onClick={()=>onMint(sig)} 
						className="bg-neutral-200 py-2 px-8 rounded-lg m-4 items-center hover:bg-white disabled:opacity-30">
						<h1 className="font-bold text-black">Grab TiT Allowance</h1>
					</button>
					<a className="font-bold hover:text-neutral-200 text-slate-600 " href="https://twitter.com/theiristoken" target="_blank">Need gas money?</a>
				</div>}	
			</div>}

			{claimed && minted &&
			<div className="flex flex-col items-center justify-center">
				{!newMint && !isMismatched && !isLoadingBalance && <div className="flex flex-col items-center justify-center">
					<div className="flex flex-row items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" className="w-6 h-6 stroke-pink-500 hover:fill-white mr-1">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
						</svg>
						<p className="my-2 text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
							You currently hold {Number(tokenData?.displayValue).toLocaleString("US")} TiTs.
						</p>
					</div>
					<a target="_blank" 
						className="twitter-share-button flex flex-row font-bold mt-4 hover:text-neutral-200 text-slate-600"
						href={`https://twitter.com/intent/tweet?text=I%20hold%20${Number(tokenData?.displayValue).toLocaleString("US")}%20TiTs&via=theiristoken`}
						data-size="large">
							Share the news on X
					</a>
				</div>}	

				{newMint && !isMismatched && !isLoadingBalance && <div className="flex flex-col items-center justify-center">
					<div className="flex flex-row items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" className="w-6 h-6 stroke-pink-500 hover:fill-white mr-1">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
						</svg>
						<p className="my-2 text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
							You claimed {amount?.toLocaleString("US")} TiTs.
						</p>
					</div>
					<a target="_blank" 
					className="twitter-share-button flex flex-row font-bold mt-4 hover:text-neutral-200 text-slate-600"
                    href="https://twitter.com/intent/tweet?text=Super!%20I%20Just%20grabbed%20TiTs&via=theiristoken"
                    data-size="large">
						Share the news on X
					</a>
				</div>}	

			</div>}

			{errorShown && <div className="flex flex-col items-center justify-center">
				<p className="my-2 text-md font-bold text-rose-500">{errorDetail}</p>
			</div>}

		</div>
	);
}