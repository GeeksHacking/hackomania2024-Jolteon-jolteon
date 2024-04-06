import SendMessageBar from "./SendMessageBar";
import { useState } from 'react'


export default function Chatroom(){

	const [newMessage, setNewMessage] = useState('')
	const [response, setResponse] = useState("")
  
	
	return(
		<>
<SendMessageBar newMessage={newMessage} setNewMessage={setNewMessage} setResponse={setResponse} />
		</>
			);
}
