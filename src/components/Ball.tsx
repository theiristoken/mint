export default function Ball() {
	return (
		<div className="items-center flex flex-col">
			<div className="flex flex-col flex-wrap items-center justify-start bg-black p-4 rounded-3xl my-4">
				<section className="stage w-56 h-56 md:w-72 md:h-72">
                <figure className="ball">
                    <span className="shadow"></span>
                    <span className="iris"></span>
                </figure>
				</section>
			</div>
		</div>
	);
}