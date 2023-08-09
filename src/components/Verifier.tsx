import { VerifyReply } from "@/pages/api/verify";
import { ChainId, ConnectWallet, useAddress, useContract, useDisconnect, useNetworkMismatch, useSafe, useSwitchChain } from "@thirdweb-dev/react";
import { CredentialType, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useEffect, useState } from "react";
import { HttpsCallableResult, getFunctions, httpsCallable } from 'firebase/functions';
import Firebase from "@/firebase";
import { User, getAuth, onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';
import { VerifyResponse } from "../../functions/src";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";



export default function Verifier() {
	const [user, setUser] = useState<User| null>(null);
	const [ verified, setVerified ] = useState(false);
	const [ minted, setMinted ] = useState(false);
	const [ isLoading, setIsLoading ] = useState(false);
	const address = useAddress();
	const isMismatched = useNetworkMismatch();
  	const switchNetwork = useSwitchChain();
	const disconnect = useDisconnect();
	const functions = getFunctions(Firebase);
    const auth = getAuth(Firebase);
	const db = getFirestore(Firebase);
	const tokenAddress = process.env.TOKEN_ADDRESS;
	const { contract: tokenContract, isLoading: isLoadingToken } = useContract(tokenAddress);

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
			signInAnonymously(auth)
			.then((credential) => {
				console.log('authenticated anonymously',credential.user.uid);
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage)
			});
		}
	}, [address])

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
		const q = query(collection(db, "ivis"), where("wallet", "==", address));
		const walletSnap = await getDocs(q);
		if (!walletSnap.empty){
			const minted = walletSnap.docs[0].data().minted;
			setMinted(minted);
			setVerified(true);
		}
		setIsLoading(false);
	}

	const onSuccess = () => {
        setVerified(true);
	};

	const handleProof = async (result: ISuccessResult) => {
		console.log("Proof received from IDKit:\n", JSON.stringify(result)); // Log the proof from IDKit to the console for visibility
		const reqBody = {
			merkle_root: result.merkle_root,
			nullifier_hash: result.nullifier_hash,
			proof: result.proof,
			credential_type: result.credential_type,
			action: process.env.NEXT_PUBLIC_WLD_ACTION_NAME,
			signal: address?? "noaddress",
		};
		console.log("Sending proof to backend for verification:\n", JSON.stringify(reqBody)) // Log the proof being sent to our backend for visibility
		const verify = httpsCallable(functions, 'verify');
		verify.call(reqBody)
        .then((result) => {
			console.log(result.data);
        }).catch((error) => {
			const code = error.code;
			const message = error.message;
			const details = error.details;
			console.log('error', code, message, details)
		});
	};

	const onClaim = async ()=>{
		const claim = httpsCallable(functions, 'claim');
		claim.call(address)
        .then(async (result) => {
			console.log(result.data);
			const signature = JSON.parse(JSON.stringify(result.data)).signature;
			tokenContract?.erc20.signature.mint(signature)
			.then((tx)=>{
				console.log('minted TiTs');
				console.log(tx);
			}).catch((e)=>{
				console.log(e);
			});
        }).catch((error) => {
			const code = error.code;
			const message = error.message;
			const details = error.details;
			console.log('error', code, message, details)
		});
	}

	const switchChain = () => {
		switchNetwork(420);
	}

	return (
		<div>
			{address && <div className="flex flex-row items-center justify-between w-96">
				<p className="flex flex-col items-center justify-center self-center text-lg">{formatAddress(address)}</p>
				<button onClick={disconnect}>
					<h1 className="py-4 self-center text-md font-bold hover:text-neutral-200">
					(Disconnect)
					</h1>
				</button>	
			</div>}
			{isLoading && <p>Loading...</p>}
			{!verified && !isLoading && <div className="flex flex-col items-center justify-center p-4 self-center">
				<IDKitWidget
						action={process.env.NEXT_PUBLIC_WLD_ACTION_NAME!}
						app_id={process.env.NEXT_PUBLIC_WLD_APP_ID!}
						onSuccess={onSuccess}
						handleVerify={handleProof}
						credential_types={[CredentialType.Orb]}
						autoClose
						signal={address?? "noaddress"}
					>
						{({ open }) =>
							<button  className="bg-neutral-200 py-2 px-8 rounded-lg mx-4 items-center hover:bg-white " onClick={open}>
								<h1 className="font-bold text-black" >Verify iris with World ID</h1>
							</button>
						}
				</IDKitWidget>
			</div>}

			{verified && !isLoading && <div className="flex flex-col justify-start items-start w-96">


			<div className="flex flex-col items-center justify-center p-4 self-center">
				<p className="flex flex-col items-center justify-center self-center text-lg">You are an iris Verified Individual (iVI).</p>
			</div>	

			{!isMismatched && <div className="flex flex-col items-center justify-center p-4 self-center">
				<button  
					disabled={!isMismatched}
					onClick={switchChain}
					className="bg-neutral-200 py-2 px-8 rounded-lg mx-4 items-center hover:bg-white">
					<h1 className="font-bold text-black" >Switch to Optimism</h1>
				</button>
				<p className="flex flex-col items-center justify-center self-center text-md text-center mt-4">Get on the right chain to claim your TiTs.</p>
			</div>}	

			{!minted && !isMismatched && <div className="flex flex-col items-center justify-center p-4 self-center">
				<button 
					disabled={isLoadingToken || isMismatched || minted}
					onClick={onClaim} 
					className="bg-neutral-200 py-2 px-8 rounded-lg mx-4 items-center hover:bg-white">
					<h1 className="font-bold text-black" >Claim 1,000 TiTs</h1>
				</button>
				<p className="flex flex-col items-center justify-center self-center text-md text-center mt-4">TiTs are free, but you will have to pay for gas.</p>
			</div>}	
			{minted && !isMismatched && <div className="flex flex-col items-center justify-center p-4 self-center">

				<h1 className="font-bold text-black" >You already claimed 1,000 TiTs.</h1>

			</div>}	


			</div>}
		</div>
	);
}