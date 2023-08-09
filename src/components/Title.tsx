import { useState } from "react";

export default function Title() {
	const [showModal, setShowModal] = useState(false);
	const toggleInfo = () => {
		setShowModal(!showModal)
	}

	return (
		<div>
			<div className="flex flex-row items-center justify-center my-8">
				{/* <img width={50} height={50} src="logo.png" className="mx-3"/> */}
				<p className="text-xl sm:text-4xl md:text-5xl font-bold">The iris Token</p>
				<button onClick={toggleInfo} className="mx-3 text-black px-4 py-1 border-4 rounded-full font-bold text-2xl sm:text-3xl md:text-4xl bg-slate-300 hover:bg-slate-600 hover:text-white">?</button>
			</div>
			{showModal && 
				<div className="flex flex-col items-center justify-center m-8">
				<p className="text-lg mb-5 text-center">
				The iris Token (TiT) is an ERC-20 token distributed to iris Verified Individuals (iVI).</p>
				<p className="text-lg mb-5 text-center">
				1,000 TiTs are distributed to 1,000,000 iVIs, on a first come first served basis.</p>
				<p className="text-lg mb-5 text-center">
				The total maximum supply of TiTs is 1,000,000,000 TiTs.</p>
				<p className="text-lg mb-5 text-center">
				No one can mint more TiTs. Ever.</p>
				
				<p className="flex flex-row text-lg mb-5 text-center">
				Created by <a className="font-bold hover:text-slate-300" href="https://hajarabi.com" target="_blank">&nbsp;Nadir Hajarabi</a>.</p>
			</div>
			}
		</div>
	);
}