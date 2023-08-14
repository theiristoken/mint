import React, {useEffect, useState} from 'react';
import Title from "@/components/Title";
import GetStarted from "@/components/GetStarted";
import {useAddress} from "@thirdweb-dev/react";
import Minter from "@/components/Minter";
import {doc, getDoc, getFirestore} from 'firebase/firestore';
import Firebase from '@/firebase';
import Ball from '@/components/Ball';
import Loader from '@/components/Loader';
import Constants from '@/constants';

export default function Home() {
	const address = useAddress();
	const [claims, setClaims] = useState(0);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ out, setOut ] = useState(false);
	const db = getFirestore(Firebase);
	const start = Constants.testStart;
	const now = Date.now();
	const [timeLeftStart, setTimeLeftStart] = useState(start-now);

	useEffect(()=>{
		if (address && start<now){
			getClaims();
		}
		setIsLoading(false);
	},[address, start])

	useEffect(()=>{
		if (timeLeftStart<1000){
			setTimeLeftStart(0)
		  return;
		}
		const x = setInterval(()=>{
		  setTimeLeftStart(timeLeftStart-1000)
		}, 1000)
	
		return () => clearInterval(x);
	  }, [timeLeftStart])  

	const getClaims = async () => {
		const tallySnap = await getDoc(doc(db, "admin", "tally"));
		if (tallySnap.exists()){
			const mints = tallySnap.data().mints;
			const reserves = tallySnap.data().reserves;
			setClaims(mints+reserves);
			setOut(mints>=10**6);
		}
	}

	return (
		<div className="flex flex-col justify-center items-center">
			<Title/>
			<Ball/>
			{isLoading && <Loader/>}
			{!isLoading && claims>100 && <p>{(1000000-claims).toLocaleString("US")} allowances left</p>}
			{!isLoading && !address && <GetStarted time={timeLeftStart} out={out}/>}
			{!isLoading && address && <Minter time={timeLeftStart} out={out}/>}
		</div>
	);
}
