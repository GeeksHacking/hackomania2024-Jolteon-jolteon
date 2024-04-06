import Header from "./Header";
import MessagesContainer from "./MessagesContainer";
import SendMessageBar from "./SendMessageBar";
import { useEffect, useState } from "react";

export default function Chatroom() {
	const [newMessage, setNewMessage] = useState("");
	const [messagesArr, setMessagesArr] = useState([])


	useEffect(() =>
			{
				console.log(messagesArr)
			},[messagesArr]);

	return (
		<div className="flex flex-col h-dvh">
			<Header />
			<MessagesContainer messagesArr={messagesArr} />
			<SendMessageBar
				newMessage={newMessage}
				setNewMessage={setNewMessage}
		setMessagesArr={setMessagesArr}
			/>
		</div>
	);
}
