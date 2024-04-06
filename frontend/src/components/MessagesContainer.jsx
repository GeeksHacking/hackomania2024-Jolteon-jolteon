import { useRef, useEffect } from "react";
import Forms from "./Forms";

export default function MessagesContainer(props) {
	let { messagesArr } = props;
	const messagesContainerRef = useRef(null);

	const scrollToBottom = () => {
		if (messagesContainerRef.current) {
			messagesContainerRef.current.scrollTop =
				messagesContainerRef.current.scrollHeight;
		}
	};

	useEffect(() =>
			{
				scrollToBottom();
			},[messagesArr]);

	

	return (
		<div
			ref={messagesContainerRef}
			className=" w-full h-[80%] flex-grow-0 flex flex-col overflow-y-scroll scroll-smooth"
		>
			{messagesArr.map((message, index) =>
				message.type === "iframe" ? (
					<iframe
						key={index}
						src="https://eadviser.gobusiness.gov.sg/govassist?src=home_quicklinks"
						title="Medium Article"

						className="m-4 self-start rounded"
					/>
				) : (
					<div
						key={index}
						className={`m-4 ${
							message.sender === "user"
								? "bg-[#FFCE4F] rounded-bl-3xl self-end"
								: "bg-[#FFFFFF] rounded-br-3xl self-start"
						} p-4 rounded-t-3xl shadow-[0px_3px_27px_-1px_rgba(0,0,0,0.42)]`}
					>
						{message.message}
					</div>
				)
			)}
		<Forms/>

		</div>
	);
}
