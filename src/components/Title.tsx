import { useState } from "react";
import Links from "./Links";

export default function Title() {
	const [showModal, setShowModal] = useState(false);
	const toggleInfo = () => {
		setShowModal(!showModal)
	}

	return (
		<div>
			<div className="flex flex-row items-center justify-center my-6">
				<p className="text-4xl md:text-5xl font-bold">The iris Token</p>
				<button onClick={toggleInfo} className="ml-3 text-black px-4 py-1 border-4 rounded-full font-bold text-2xl sm:text-3xl md:text-4xl bg-slate-300 hover:bg-slate-600 hover:text-white">?</button>
			</div>
			{showModal && 
				<div className="flex flex-col items-center justify-center mt-4 px-8">
				<p className="text-lg mb-5 text-center">
				The iris Token (TiT) is a 100% decentralised fungible token initially distributed to iris Verified Individuals (iVI).</p>
				<p className="text-lg mb-5 text-center">
				1 million allowances of 1,000 TiTs are up for grabs. First iVIs come, first iVIs served.</p>

				<p className="flex flex-row text-lg mb-5 text-center">
				The Genesis Offering Director is <a className="font-bold mx-1 hover:text-neutral-200 text-slate-600" href="https://hajarabi.com" target="_blank">
					Nadir Hajarabi.
					</a>
				</p>
			</div>
			}
			<Links/>
		</div>
	);
}