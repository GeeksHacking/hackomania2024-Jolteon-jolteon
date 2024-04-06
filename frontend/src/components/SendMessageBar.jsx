import { useState } from "react";
export default function SendMessageBar() {
	const [newMessage, setNewMessage] = useState("");
	return (
		<>
			<div action="" className="fixed right-0 bottom-0 left-0 flex flex-row mx-4 mb-8 shadow-[0px_3px_27px_-1px_rgba(0,0,0,0.42)] rounded p-4">
<input type="text" placeholder="Type your message here" className="flex-1 outline-none border-none" />				
		<button type="submit">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
						/>
					</svg>
				</button>
			</div>
		</>
	);
}
