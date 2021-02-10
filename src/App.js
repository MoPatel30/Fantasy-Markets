import React from 'react'
import "./App.css"
import Stocks from "./Stocks/Stocks"
import Crypto, {CreatePortfolio} from "./Crypto/Crypto"


function App() {
  return (
    <div className = "App">
      <h1>Fantasy Markets</h1>

      <CreatePortfolio />

    </div>
  )
}

export default App

