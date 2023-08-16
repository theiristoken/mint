export default function EyeBall() {
	return (
		<div className="items-center flex flex-col">
			<div className="flex flex-col flex-wrap items-center justify-start bg-black p-4 rounded-3xl my-4">
				<div className="rounded-full ball h-64 w-64 md:w-72 md:h-72 m-4 justify-center items-center flex">
					<div className="absolute iris z-10 animate-ifocus rounded-full h-24 w-24 md:w-28 md:h-28 m-4 justify-center items-center flex">
						<div className="bg-black rounded-full h-9 w-9 md:w-11 md:h-11">
						</div>
						<div className="absolute top-2 left-2 bg-white/30 rounded-full h-6 w-6 md:w-9 md:h-9 m-3">
						</div>
					</div>
					<div className="bg-white opacity-50 shadow-amber-200 shadow-lg rounded-full animate-spin h-64 w-64 md:w-72 md:h-72">
						
					</div>
				</div>
			</div>
		</div>
	);
}