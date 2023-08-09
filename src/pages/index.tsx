import { CredentialType, IDKitWidget } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import type { VerifyReply } from "./api/verify";
import React, { useState } from 'react';
import Head from 'next/head';
import Emoter from "@/components/Emoter";
import Title from "@/components/Title";
import History from "@/components/History";
import EyeBall from "@/components/EyeBall";
import GetStarted from "@/components/GetStarted";
import { useAddress, useContract, useTokenSupply } from "@thirdweb-dev/react";
import Verifier from "@/components/Verifier";
import SoldOut from "@/components/SoldOut";

export default function Home() {
	const address = useAddress();
	const tokenAdress = "0x0fA7E69b9344D6434Bd6b79c5950bb5234245a5F";
	const { contract: tokenContract } = useContract(tokenAdress);
	const { data: tokenSupply, isLoading, error } = useTokenSupply(tokenContract);

	return (
		<div className="flex flex-col justify-center items-center">

			<Title/>
			<EyeBall/>
			{isLoading && <p>Loading...</p>}
			{!isLoading && (Number(tokenSupply?.displayValue)==10**9) && <SoldOut/>}
			{!isLoading && !address && (Number(tokenSupply?.displayValue)<10**9) &&  <GetStarted/>}
			{!isLoading && address && <Verifier/>}
		</div>
	);
}
