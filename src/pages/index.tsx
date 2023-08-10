import React, { useState } from 'react';
import Title from "@/components/Title";
import EyeBall from "@/components/EyeBall";
import GetStarted from "@/components/GetStarted";
import { ChainId, useAddress, useChainId, useContract, useTokenSupply } from "@thirdweb-dev/react";
import Verifier from "@/components/Verifier";
import SoldOut from "@/components/SoldOut";

export default function Home() {
	const address = useAddress();
	const tokenAddress = "0x32307adfFE088e383AFAa721b06436aDaBA47DBE";
	const { contract: tokenContract, isLoading: isLoadingContract } = useContract(tokenAddress, "token");
	const { data: tokenSupply, isLoading, error } = useTokenSupply(tokenContract);

	return (
		<div className="flex flex-col justify-center items-center">
			<Title/>
			<EyeBall/>
			<p>Hello Nadir</p>
			{/* {isLoadingContract && <p>{tokenAddress}</p>}
			{tokenSupply && <p>{tokenSupply.displayValue}</p>}
			{isLoading && <p>Loading...</p>} */}
			{!isLoading && (Number(tokenSupply?.displayValue)==10**9) && <SoldOut/>}
			{!isLoading && !address && (Number(tokenSupply?.displayValue)<10**9) &&  <GetStarted/>}
			{!isLoading && address && <Verifier/>}
		</div>
	);
}
