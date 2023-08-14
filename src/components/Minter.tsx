import { SignedPayload20, useAddress, useContract, useDisconnect, useNetworkMismatch, useSwitchChain, useTokenBalance } from "@thirdweb-dev/react";
import { CredentialType, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useEffect, useState } from "react";
import Firebase from "@/firebase";
import Constants from "@/constants";
import { User, getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Loader from "./Loader";
import Out from "./Out";

export default function Minter({time, out}: {time: number, out: boolean}) {
	const [user, setUser] = useState<User| null>(null);
	const [ verified, setVerified ] = useState(false);
	const [ claimed, setClaimed ] = useState(false);
	const [ minted, setMinted ] = useState(false);
	const [ newMint, setNewMint ] = useState(false);
	const [ amount, setAmount ] = useState<number>();
	const [ mintEnd, setMintEnd ] = useState<number>();
	const [ sig, setSig ] = useState<SignedPayload20>();
	const [ isLoading, setIsLoading ] = useState(false);
	const [ isClaiming, setIsClaiming ] = useState(false);
	const [ isMinting, setIsMinting ] = useState(false);
	const [ errorShown, setErrorShown ] = useState(false);
	const [ errorDetail, setErrorDetail ] = useState("");
	const address = useAddress();
	const isMismatched = useNetworkMismatch();
  	const switchNetwork = useSwitchChain();
	const disconnect = useDisconnect();
    const auth = getAuth(Firebase);
	const db = getFirestore(Firebase);
	const verifyEndpoint = Constants.verifyEndpoint;
	const claimEndpoint = Constants.claimEndpoint;
	const activeChain = Constants.activeChain;
	const tokenAddress = Constants.tokenAddress;
	const { contract: tokenContract, isLoading: isLoadingToken } = useContract(tokenAddress);
	const { data: tokenData, isLoading: isLoadingBalance } = useTokenBalance(tokenContract, address);

	useEffect(() => {
		const unsubscribeAuth = onAuthStateChanged(auth, async authenticatedUser => {
			try {
			(authenticatedUser ? setUser(authenticatedUser) : setUser(null));
			} catch (error) {
			console.log(error);
			}
		});
		return unsubscribeAuth;
	}, []);

	useEffect(()=>{
		if(address) {
			signInAnonymously(auth);
		}
	}, [address])

	const formatTime = (num: number) =>{
		const d = Math.floor(num/(24*3600*1000));
		const h = Math.floor((num-d*24*3600*1000)/(3600*1000));
		const m = Math.floor((num-d*24*3600*1000-h*3600*1000)/(60*1000));
		const s = Math.floor((num-d*24*3600*1000-h*3600*1000-m*60*1000)/(1000));
		return (' in '+ h.toString().padStart(2, '0')+' :'+m.toString().padStart(2, '0')+' :'+s.toString().padStart(2, '0'));
	}

	const formatDate = (num: number) =>{
		const date = new Date(num);
		return date.toDateString()+" "+date.toLocaleTimeString();
	}

	const evaluate = (d:number)=>{
		const p = 10262.502185213996;
		const a = 3600*24;
		const value = 1000 + 10000000*(Math.log((d/a)+p)/((d/a)+p));
		return value;
	};

	useEffect(()=>{
		if(user && address) {
			fetchWalletInfo(address);
		}
	}, [user, address])

	const formatAddress = (address:string) => {
		return address.substring(0,6)+'...'+ address.substring(address.length-3)
	}

	const formatError = (str:string) => {
		const words = str.split(" ");
		for (let i = 0; i < words.length; i++) {
			words[i] = words[i][0].toUpperCase() + words[i].substring(1);
		}
		return words.join(" ");
	}

	const fetchWalletInfo = async (address:string) => {
		setIsLoading(true);
		const localMinted = localStorage.getItem('minted');
		const localClaimed = localStorage.getItem('claimed');
		const localVerfied = localStorage.getItem('ivi');
		const preCondition = localMinted && localVerfied && localClaimed && 
		localMinted==address && localVerfied==address && localClaimed==address;
		if (preCondition){
			setMinted(true);
			setClaimed(true);
			setVerified(true);
		} else {
			const walletRef = doc(db, "ivis", address);
			const walletSnap = await getDoc(walletRef);
			if (walletSnap.exists()){
				setVerified(true);
				const minted = walletSnap.data().minted;
				setMinted(minted);
				const signature = walletSnap.data().signature;
				if(signature){
					const sig = JSON.parse(walletSnap.data().signature);
					const amount = sig.payload.quantity;
					const mintEnd = Number(sig.payload.mintEndTime.hex);
					setSig(sig);
					setAmount(Number(amount));
					setMintEnd(mintEnd);
					setClaimed(mintEnd>Date.now());
				} else {
					setClaimed(false);
				}

			} else {
				setMinted(false);
				setClaimed(false);
				setVerified(false);
			}
		}
		setIsLoading(false);
	}

	const handleProof = async (result: ISuccessResult) => {
		setErrorShown(false);
		if(!verifyEndpoint){
			return;
		}
		console.log("Proof received from IDKit:\n", JSON.stringify(result));
		const reqBody = {
			merkle_root: result.merkle_root,
			nullifier_hash: result.nullifier_hash,
			proof: result.proof,
			credential_type: result.credential_type,
			action: Constants.wldAction,
			signal: address?? "noaddress",
		};
		console.log("Sending proof to backend for verification:\n", JSON.stringify(reqBody));
		const res: Response = await fetch(verifyEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(reqBody),
		})
		const data = await res.json();
		if(res.status == 200 || res.status == 201){
			setVerified(true);
			localStorage.setItem('ivi', address?? "noaddress");
			console.log(data);
		} else {
			setErrorShown(true);
			setErrorDetail("Oops! Your iris is not verified. Try again");
			throw new Error(`Error code ${res.status} (${data.code}): ${data.detail}` ?? "Unknown error.");
		}
	};

	const onClaim = async ()=>{
		setIsClaiming(true);
		setErrorShown(false);
		if(!claimEndpoint){
			return;
		}
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
			setSig(signature);
			setAmount(Number(signature.payload.quantity));
			console.log(signature, Number(signature.payload.quantity));
			setIsClaiming(false);
			
		} else {
			setIsClaiming(false);
			setErrorShown(true);
			setErrorDetail(data.detail);
			throw new Error(`Error code ${res.status} (${data.code}): ${data.detail}` ?? "Unknown error.");
		}
	}

	const onMint = async (signature: SignedPayload20)=>{
		setIsMinting(true);
		setErrorShown(false);
		tokenContract?.erc20.signature.mint(signature)
			.then((tx)=>{
				localStorage.setItem('minted', address?? "noaddress");
				setMinted(true);
				setNewMint(true);
				console.log('minted TiTs', tx);
				setIsMinting(false);
			}).catch((e)=>{
				console.log(e);
				setErrorShown(true);
				setErrorDetail(formatError(e.reason));
				setIsMinting(false);
			});
	}

	return (
		<div className="flex flex-col items-center justify-center w-80 md:w-96">
			{address && <div className="flex flex-row items-center justify-between w-full">
				<p className="flex flex-col items-center justify-center self-center text-lg">{formatAddress(address)}</p>
				<button onClick={disconnect}>
					<h1 className="py-4 self-center text-md font-bold hover:text-neutral-200">
					(Disconnect)
					</h1>
				</button>	
			</div>}
			{(isLoading || isLoadingToken) && <Loader/>}

			{!verified && !isLoading && !isLoadingToken && address && 
			<div className="flex flex-col items-center justify-center p-4 self-center">
				<p className="text-md text-center mt-2">Only iris Verified individuals (iVIs) can claim TiTs.</p>
				<IDKitWidget
					action={Constants.wldAction}
					app_id={Constants.wldAppId}
					onSuccess={()=>console.log("w")}
					handleVerify={handleProof}
					credential_types={[CredentialType.Orb]}
					autoClose
					signal={address}
				>
					{({ open }) =>
						<button 
							className="bg-neutral-200 py-2 px-8 rounded-lg m-4 items-center hover:bg-white " onClick={open}>
							<h1 className="font-bold text-black" >Verify iris with World ID</h1>
						</button>
					}
				</IDKitWidget>
			</div>}

			{verified && !isLoading && !isLoadingToken && 
			<div className="flex flex-col justify-start items-start">

				<div className="flex flex-row items-center justify-center px-2 self-center">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" className="w-6 h-6 stroke-cyan-500 hover:fill-white mr-1">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
					</svg>
					<p className="flex flex-col items-center justify-center self-center text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">You are an iris Verified Individual (iVI)
					</p>
					
				</div>
				
				{isMismatched && <div className="flex flex-col items-center justify-center p-4 self-center">
					<button  
						disabled={!isMismatched}
						onClick={()=>switchNetwork(activeChain)}
						className="bg-neutral-200 py-2 px-8 rounded-lg mx-4 items-center hover:bg-white">
						<h1 className="font-bold text-black" >Switch to Optimism</h1>
					</button>
					<p className="flex flex-col items-center justify-center self-center text-md font-bold text-rose-500 mt-2">TiTs are on the Optimism chain.</p>
				</div>}	

				{!minted && !claimed && time<0 && !out && !isMismatched && !isClaiming && <div className="flex flex-col items-center justify-center p-4 self-center">
					<p className="flex flex-col items-center justify-center self-center text-md text-center mt-4">You may claim {evaluate(Date.now())}.</p>
					<button 
						disabled={isLoadingToken || isMismatched || minted || isClaiming || time>=0}
						onClick={onClaim} 
						className="bg-neutral-200 py-2 px-8 rounded-lg mx-4 items-center hover:bg-white">
						<h1 className="font-bold text-black" >Claim TiTs</h1>
					</button>
				</div>}	

				{!minted && !claimed && time>=0 && !out && !isMismatched && !isClaiming && <div className="flex flex-col items-center justify-center p-4 self-center">
					<h1>Come back for TiTs {formatTime(time)}</h1>
				</div>}	

				{!minted && claimed && !out && mintEnd && sig && amount && !isMismatched && !isClaiming && <div className="flex flex-col items-center justify-center p-4 self-center">
					<p className="text-md text-center mt-2">You secured your spot for an allowance of {amount.toLocaleString()} TiTs.</p>
					<p className="text-md text-center my-4">You may mint it before <span className="italic">{formatDate(mintEnd)}</span>.</p>
					<button 
						disabled={isLoadingToken || isMismatched || minted || isClaiming}
						onClick={()=>onMint(sig)} 
						className="bg-neutral-200 py-2 px-8 rounded-lg m-4 items-center hover:bg-white">
						<h1 className="font-bold text-black">Mint {amount?.toLocaleString("US")} TiTs</h1>
					</button>
					<p className="flex flex-col items-center justify-center self-center text-md text-center mt-4">TiTs are free, but network gas isn't.</p>
					<a className="font-bold hover:text-neutral-200 text-slate-600 " href="https://twitter.com/theiristoken" target="_blank">Need gas money?</a>
				</div>}	

				{!isMismatched && (isClaiming || isMinting) && <div className="flex flex-col items-center justify-center p-4 self-center">
					<Loader/>
				</div>}	
				
				{minted && claimed && !newMint && !isMismatched && <div className="flex flex-col items-center justify-center p-4 self-center">
				<div className="flex flex-row items-center justify-center px-2 self-center">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" className="w-6 h-6 stroke-pink-500 hover:fill-white mr-1">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
					</svg>
					<p className="flex flex-col items-center justify-center self-center text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
						You currently hold {Number(tokenData?.displayValue).toLocaleString("US")} TiTs.
					</p>
					
				</div>
					
					{!isLoadingBalance && <a target="_blank" 
					className="twitter-share-button flex flex-row font-bold mt-4 hover:text-neutral-200 text-slate-600"
                    href={`https://twitter.com/intent/tweet?text=I%20hold%20${Number(tokenData?.displayValue).toLocaleString("US")}%20TiTs&via=theiristoken`}
                    data-size="large">
						Share the news on X
					</a>}
					{isLoadingBalance && <Loader/>}
				</div>}	

				{minted && claimed && newMint && !isMismatched && <div className="flex flex-col items-center justify-center p-4 self-center">
					<div className="flex flex-row items-center justify-center px-2 self-center">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" className="w-6 h-6 stroke-pink-500 hover:fill-white mr-1">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
						</svg>
						<p className="flex flex-col items-center justify-center self-center text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
							You claimed {amount?.toLocaleString("US")} TiTs.
						</p>
					</div>
					<a target="_blank" 
					className="twitter-share-button flex flex-row font-bold mt-4 hover:text-neutral-200 text-slate-600"
                    href="https://twitter.com/intent/tweet?text=Yay!%20Just%20grabbed%20TiTs&via=theiristoken"
                    data-size="large">
						Share the news on X
					</a>
				</div>}	

				{out && !minted && <Out/>}

			</div>}


			{errorShown && !isLoading && !isLoadingToken && !isClaiming && <div className="flex flex-col items-center justify-center px-2 self-center">
				<p className="flex flex-col items-center justify-center self-center text-md font-bold text-rose-500">{errorDetail}</p>
			</div>}

		</div>
	);
}