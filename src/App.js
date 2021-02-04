import React from 'react'
import "./App.css"
import PracticeCounter from "./PracticeCounter/PracticeCounter.jsx"
import Stocks from "./Stocks/Stocks"
import Crypto from "./Crypto/Crypto"


function App() {
  return (
    <div className = "App">
    
      <PracticeCounter />

      <Stocks />
      <Crypto />

    </div>
  )
}

export default App

