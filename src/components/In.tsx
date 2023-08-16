import { SignedPayload20, useDisconnect } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import Firebase from "@/firebase";
import { User, getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, getFirestore } from "firebase/firestore";
import Loader from "./Loader";
import Verifier from "./Verifier";

export default function In({time, out, address}: {time: number, out: boolean, address: string}) {
	const [user, setUser] = useState<User| null>(null);
	const [ verified, setVerified ] = useState(false);
	const [ claimed, setClaimed ] = useState(false);
	const [ minted, setMinted ] = useState(false);
	const [ amount, setAmount ] = useState<number>();
	const [ reserveEnd, setReserveEnd ] = useState<number>();
	const [ sig, setSig ] = useState<SignedPayload20>();
	const [ isLoading, setIsLoading ] = useState(false);
	const disconnect = useDisconnect();
    const auth = getAuth(Firebase);
	const db = getFirestore(Firebase);
	
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

	useEffect(()=>{
		console.log("in",verified);
	}, [verified])

	useEffect(()=>{
		if(user && address) {
			fetchWalletInfo(address);
		}
	}, [user, address])

	const formatAddress = (address:string) => {
		return address.substring(0,6)+'...'+ address.substring(address.length-3)
	}

	const fetchWalletInfo = async (address:string) => {
		setIsLoading(true);
		const localMinted = localStorage.getItem('minted'+address);
		const localClaimed = localStorage.getItem('claimed'+address);
		const localVerified = localStorage.getItem('verified'+address);
		console.log(localMinted, localVerified, localClaimed)
		const preCondition = localMinted && localVerified && localClaimed;
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
				const reserved = walletSnap.data().reserved;
				if(reserved){
					const signature = walletSnap.data().signature;
					const amount = walletSnap.data().amount;
					const reserveEnd = walletSnap.data().reserve_end;
					setSig(signature);
					setAmount(amount);
					setReserveEnd(reserveEnd);
					setClaimed(reserveEnd>Date.now());
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


	return (
		<div className="flex flex-col text-lg items-center justify-center px-4 md:px-10">
			<div className="flex flex-row items-center justify-between">
				<p className="text-lg mx-6 opacity-70 font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-900 to-pink-500 tracking-wide">{formatAddress(address)}
					</p>
				<button onClick={disconnect}>
					
					<h1 className="text-sm mx-6 font-bold hover:text-neutral-200 flex flex-row">Disconnect
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 hover:fill-white ml-1">
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
					</svg>


					</h1>
				</button>	
			</div>
			{isLoading  && <Loader/>}
			{!isLoading && <Verifier 
				time={time} 
				out={out} 
				address={address} 
				_verified={verified}
				_claimed={claimed} 
				_minted={minted} 
				_amount={amount} 
				reserve_end={reserveEnd}
				_sig={sig}/>}
		</div>
	);
}