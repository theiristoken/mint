export default function Ball() {
	return (
		<div className="items-center flex flex-col">
			<div className="flex flex-col flex-wrap items-center justify-start bg-black p-4 rounded-3xl my-4">
				<div className="stage h-64 w-64 md:w-72 md:h-72">
                <div className="ball">
                    <span className="shadow"></span>
                    <span className="iris"></span>
                </div>
				</div>
			</div>
		</div>
	);
}