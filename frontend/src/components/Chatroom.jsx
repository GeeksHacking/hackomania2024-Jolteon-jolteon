import Header from "./Header";
import MessagesContainer from "./MessagesContainer"
import SendMessageBar from "./SendMessageBar";
import { useState } from 'react'


export default function Chatroom(){

	const [newMessage, setNewMessage] = useState('')
	const [response, setResponse] = useState("")
  
	
	return(
		<div className="flex flex-col h-dvh">
			<Header/>
			<MessagesContainer/>
<SendMessageBar newMessage={newMessage} setNewMessage={setNewMessage} setResponse={setResponse} />
		</div>
			);
}
