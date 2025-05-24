import { useState } from 'react'
import './App.css'
import MessagingInterface from './components/MessagingInterface'

function App() {
  const [count, setCount] = useState(0)

  return (
      <MessagingInterface />
  )
}

export default App
