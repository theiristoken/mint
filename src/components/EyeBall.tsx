export default function EyeBall() {
	return (
		<div className="items-center flex flex-col">
			<div className="flex flex-col flex-wrap items-center justify-start bg-black p-4 w-96 rounded-3xl my-4">
				<section className="stage">
                <figure className="ball">
                    <span className="shadow"></span>
                    <span className="iris"></span>
                </figure>
				</section>
			</div>
		</div>
	);
}