import React, { useEffect, useState } from 'react';
import Title from "@/components/Title";
import GetStarted from "@/components/GetStarted";
import { useAddress } from "@thirdweb-dev/react";
import Minter from "@/components/Minter";
import SoldOut from "@/components/SoldOut";
import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore';
import Firebase from '@/firebase';
import Ball from '@/components/Ball';
import Loader from '@/components/Loader';

export default function Home() {
	const address = useAddress();
	const [claims, setClaims] = useState(0);
	const db = getFirestore(Firebase);
	const [ isLoading, setIsLoading ] = useState(true);

	useEffect(()=>{
		if (address){
			getClaims();
		}
		setIsLoading(false);
	},[address])

	const getClaims = async () => {
		const tallySnap = await getDoc(doc(db, "admin", "tally"));
		if (tallySnap.exists()){
			const claims = tallySnap.data().claims;
			setClaims(claims);
		}
	}


	return (
		<div className="flex flex-col justify-center items-center">
			<Title/>
			<Ball/>
			<Loader/>
			{isLoading && <Loader/>}
			{!isLoading && claims>100 && <p>{(1000000-claims).toLocaleString("US")} allowances left</p>}
			{!isLoading && claims>=10**6 && <SoldOut/>}
			{!isLoading && !address && claims<10**6 && <GetStarted/>}
			{!isLoading && address && claims<10**6 && <Minter/>}
		</div>
	);
}
