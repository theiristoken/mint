import { useState } from "react";
import Links from "./Links";

export default function Title() {
	const [showModal, setShowModal] = useState(false);
	const toggleInfo = () => {
		setShowModal(!showModal)
	}

	return (
		<div>
			<div className="flex flex-row items-center justify-center my-4">
				<p className="text-5xl md:text-6xl font-bold mr-3">The iris Token</p>
				<button onClick={toggleInfo} className="ml-3 text-black px-4 py-1 border-4 border-neutral-200 rounded-full font-bold text-2xl sm:text-3xl md:text-4xl bg-neutral-300 hover:bg-slate-300 hover:text-white">?</button>
			</div>
			{showModal && 
				<div className="flex flex-col items-center justify-center mt-4 px-8">
				<p className="text-lg mb-5 text-center">
				<span className="italic">The iris Token</span> (TiT) is a cryptocurrency that belongs to <span className="italic">iris Verified Individuals</span> (iVI).</p>
				<p className="text-lg mb-5 text-center">
				The  <span className="italic">Genesis Offering</span> (GO) awards the earliest 1 million iVIs with allowances of TiTs.</p>

				<p className="text-lg mb-5 text-center">
				The  <span className="italic">Genesis Offering Director</span> (GOD) is <a className="font-bold mx-0 hover:text-neutral-200 text-slate-600" href="https://hajarabi.com" target="_blank">
				Nadir Hajarabi
					</a>.
				</p>
			</div>
			}
			<Links/>
		</div>
	);
}