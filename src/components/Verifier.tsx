import Constants from "@/constants";
import { CredentialType, IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { useState } from "react";
import Claimer from "./Claimer";
import { SignedPayload20 } from "@thirdweb-dev/sdk";

export default function Verifier({time, out, address, _verified, _claimed, _minted, reserve_end, _sig, _amount}: {time: number, out: boolean, address:string, _verified: boolean, _claimed: boolean, _minted: boolean, reserve_end?:number, _sig?: SignedPayload20, _amount?: number}) {
	const [ verified, setVerified ] = useState(_verified);
	const [ errorShown, setErrorShown ] = useState(false);
	const [ errorDetail, setErrorDetail ] = useState("");
	const verifyEndpoint = Constants.verifyEndpoint;

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
			localStorage.setItem('ivi'+address, Date.now().toString());
			console.log(data);
		} else {
			setErrorShown(true);
			setErrorDetail("Oops! Your iris is not verified. Try again");
			throw new Error(`Error code ${res.status} (${data.code}): ${data.detail}` ?? "Unknown error.");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center my-4">
			{!verified && <div className="flex flex-col items-center justify-center">
				<p className="text-md text-center">Only iris Verified individuals (iVIs) can grab TiTs.</p>
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
							className="bg-neutral-200 py-2 px-8 rounded-lg m-4 items-center hover:bg-white" onClick={open}>
							<h1 className="font-bold text-black" >Verify iris with World ID</h1>
						</button>
					}
				</IDKitWidget>
				{errorShown && <div className="flex flex-col items-center justify-center px-2 self-center">
					<p className="my-2 text-md font-bold text-rose-500">{errorDetail}</p>
				</div>}
			</div>}

			{verified && 
			<div className="flex flex-col items-center justify-center">
				<div className="flex flex-row items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" className="w-6 h-6 stroke-cyan-500 hover:fill-white mr-1">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
					</svg>
					<p className="my-2 text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">You are an iris Verified Individual (iVI)
					</p>
				</div>
			</div>}

			{verified && <Claimer 
				time={time} 
				out={out} 
				address={address} 
				_claimed={_claimed} 
				_minted={_minted} 
				_amount={_amount} 
				reserve_end={reserve_end}
				_sig={_sig}
			/>}
		</div>
	);
}