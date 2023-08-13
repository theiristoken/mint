export default function Loader() {
	return (
		<div className="flex flex-row items-center justify-center mt-4">
			<span className="animate-spin h-6 w-4 mx-4 rounded-full bg-gradient-to-b from-red-400 to-green-400"></span>
			<span className="animate-spin h-6 w-4 mx-4 rounded-full bg-gradient-to-t from-orange-400 to-blue-400"></span>
			<span className="animate-spin h-6 w-4 mx-4 rounded-full bg-gradient-to-b from-yellow-400 to-violet-400"></span>
		</div>
	);
}