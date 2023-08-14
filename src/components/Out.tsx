export default function Out() {
	return (
		<div className="flex flex-col justify-center items-center">
			<h1 className="my-2">
				TiT faucet is now closed.
			</h1>
			<p className="flex flex-col items-center">You may use exchanges to get TiTs.</p>
			<a target="_blank" 
			className="twitter-share-button flex flex-row font-bold mt-4 hover:text-neutral-200 text-slate-600"
			href="https://twitter.com/intent/tweet?text=Dang!%20TiTs%20are%20gone&via=theiristoken"
			data-size="large">
				Share the news on X
			</a>
		</div>
	);
}