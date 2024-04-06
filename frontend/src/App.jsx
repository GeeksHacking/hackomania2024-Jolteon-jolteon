import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import 'normalize.css'
import './App.css'
import Chatroom from './components/Chatroom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
		<Chatroom/>
    </>
  )
}

export default App
