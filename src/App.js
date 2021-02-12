import React from 'react'
import "./App.css"
import Stocks from "./Stocks/Stocks"
import Portfolio from "./Portfolio/Portfolio"
import Investor from "./Investors/Investor"


function App() {
  return (
    <div className = "App">
      <header>
        <h1>
          <em className = "name">Fantasy Markets</em>
        </h1>
      </header>

      <Investor />

    </div>
  )
}

export default App

