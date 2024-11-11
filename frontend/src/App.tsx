import { useState } from 'react'
import './App.css'
import Layout from "@/layout"



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Layout>Click me</Layout>
    </>
  )
}

export default App
