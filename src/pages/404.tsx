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
		if (address){
			getClaims();
		}
		setTimeout(()=>setIsLoading(false), 500)
	},[address])

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
			<div className="flex flex-col items-center justify-center px-2 self-center my-48">
				<p className="my-2 text-md font-bold text-rose-500">Page Not Found</p>
			</div>
		</div>
	);
}
