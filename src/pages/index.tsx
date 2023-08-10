import React, { useEffect, useState } from 'react';
import Title from "@/components/Title";
import EyeBall from "@/components/EyeBall";
import GetStarted from "@/components/GetStarted";
import { ChainId, useAddress, useChainId, useContract, useTokenSupply } from "@thirdweb-dev/react";
import Verifier from "@/components/Verifier";
import SoldOut from "@/components/SoldOut";
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import Firebase from '@/firebase';

export default function Home() {
	const address = useAddress();
	const tokenAddress = "0x32307adfFE088e383AFAa721b06436aDaBA47DBE";
	const { contract: tokenContract, isLoading: isLoadingContract } = useContract(tokenAddress, "token");
	//const { data: tokenSupply, isLoading, error } = useTokenSupply(tokenContract);
	const [claims, setClaims] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(true);
	const db = getFirestore(Firebase);

	useEffect(()=>{
		const unsub = onSnapshot(doc(db, "admin", "tally"), (doc) => {
			if (doc.exists()){
				const claims = doc.data().claims;
				console.log('got claims', claims)
				setClaims(claims);
			} 
			setIsLoading(false);
		});
		return unsub
	},[])

	return (
		<div className="flex flex-col justify-center items-center">
			<Title/>
			<EyeBall/>
			{isLoading && <p>Loading...</p>}
			{!isLoading && <p>{(1000000-claims).toLocaleString()} allowances left</p>}
			{!isLoading && claims>=10**6 && <SoldOut/>}
			{(!isLoading && !address && claims<10**6) && <GetStarted/>}
			{!isLoading && address && claims<10**6 && <Verifier/>}
		</div>
	);
}
