export default function Forms() {
	return (
		<form className="rounded-md bg-[#F9F2F2] flex-initial w-[90%] mx-auto flex flex-col justify-center">
		<div className="flex flex-col bg-white mt-4">
			<label htmlFor="user-name" className="text-sm font-medium">Company Name</label>
			<input type="text" name="" id="user-name" placeholder="Company Name" />
		</div>


			<button type="submit">Submit</button>

		</form>
	);
}
