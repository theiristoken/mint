import { VerifyReply } from "@/pages/api/verify";
import { ChainId, ConnectWallet, useAddress, useDisconnect, useNetworkMismatch, useSafe, useSwitchChain } from "@thirdweb-dev/react";
import { CredentialType, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useEffect, useState } from "react";



export default function Verifier() {
	const [ verified, setVerified ] =useState(false);
	const [ claimed, setClaimed ] = useState(false);
	const [ isTime, setIsTime ] = useState(false);
	const address = useAddress();
	const isMismatched = useNetworkMismatch();
  	const switchNetwork = useSwitchChain();
	const disconnect = useDisconnect();



	const formatAddress = (address:string) =>{
		return address.substring(0,6)+'...'+ address.substring(address.length-3)
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
		const res: Response = await fetch("/api/verify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(reqBody),
		})
		const data: VerifyReply = await res.json()
		if (res.status == 200) {
			console.log("Successful response from backend:\n", data); // Log the response from our backend for visibility
		} else {
			throw new Error(`Error code ${res.status} (${data.code}): ${data.detail}` ?? "Unknown error."); // Throw an error if verification fails
		}
	};

	const onClaim = async ()=>{

	}

	const switchChain = () => {
		switchNetwork(420);
	}

	return (
		<div>
			<div className="flex flex-row items-center justify-between w-96">
				<p className="flex flex-col items-center justify-center self-center text-lg">{address? formatAddress(address):"noaddress"}</p>
				<button onClick={disconnect}>
					<h1 className="py-4 self-center text-md font-bold hover:text-neutral-200">
					(Disconnect)
					</h1>
				</button>	
			</div>
			{!verified && <div className="flex flex-col items-center justify-center p-4 self-center">
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
			</div>	}

			{verified && <div className="flex flex-col justify-start items-start w-96">


			<div className="flex flex-col items-center justify-center p-4 self-center">
				<p className="flex flex-col items-center justify-center self-center text-lg">You are an iris Verified Individual (iVI).</p>
			</div>	

			{!isMismatched && <div className="flex flex-col items-center justify-center p-4 self-center">
				<button  
					onClick={switchChain}
					className="bg-neutral-200 py-2 px-8 rounded-lg mx-4 items-center hover:bg-white">
					<h1 className="font-bold text-black" >Switch to Optimism</h1>
				</button>
				<p className="flex flex-col items-center justify-center self-center text-md text-center mt-4">Get on the right chain to claim your TiTs.</p>
			</div>}	

			{!claimed && !isMismatched && <div className="flex flex-col items-center justify-center p-4 self-center">
				<button  className="bg-neutral-200 py-2 px-8 rounded-lg mx-4 items-center hover:bg-white">
					<h1 className="font-bold text-black" >Claim 1,000 TiTs</h1>
				</button>
				<p className="flex flex-col items-center justify-center self-center text-md text-center mt-4">TiTs are free, but you will have to pay for gas.</p>
			</div>}	
			{claimed && !isMismatched && <div className="flex flex-col items-center justify-center p-4 self-center">

				<h1 className="font-bold text-black" >You already claimed 1,000 TiTs.</h1>

			</div>}	


			</div>}
		</div>
	);
}