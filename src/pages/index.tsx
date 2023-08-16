import React, {useEffect, useState} from 'react';
import Title from "@/components/Title";
import GetStarted from "@/components/GetStarted";
import {useAddress} from "@thirdweb-dev/react";
import {doc, getDoc, getFirestore} from 'firebase/firestore';
import Firebase from '@/firebase';
import Loader from '@/components/Loader';
import Constants from '@/constants';
import In from '@/components/In';
import EyeBall from '@/components/EyeBall';

export default function Home() {
	const address = useAddress();
	const [claims, setClaims] = useState(0);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ out, setOut ] = useState(false);
	const db = getFirestore(Firebase);
	const start = Constants.start;
	const now = Date.now();
	const [timeLeftStart, setTimeLeftStart] = useState(start-now);

	useEffect(()=>{
		if (address && start<now){
			getClaims();
		}
		setIsLoading(false);
	},[address, start])

	useEffect(()=>{
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
			<EyeBall/>
			{isLoading && <Loader/>}
			{!isLoading && claims>=1000 && <div className="flex flex-row items-center justify-center">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-5 h-5 stroke-amber-500 hover:fill-white mr-1">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
				</svg>
				<p className="my-2 text-md font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500  to-orange-500">{(1000000-claims).toLocaleString("US")} allowances left
				</p>
			</div>}
			{!isLoading && !address && <GetStarted time={timeLeftStart} out={out}/>}
			{!isLoading && address && <In time={timeLeftStart} out={out} address={address}/>}
		</div>
	);
}
