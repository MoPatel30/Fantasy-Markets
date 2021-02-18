import React, {useState, useEffect} from 'react'
import "./App.css"
import Stocks from "./Stocks/Stocks"
import Portfolio from "./Portfolio/Portfolio"
import Investor from "./Investors/Investor"
import GameSession from './GameSession/GameSession'


function App() {
  const [games, setGames] = useState([])

  function createNewGameSession(){
    setGames([...games, {name: "Crypto 101", playerCount: 4, duration: "14 days", amount: 10000, players: ["Mo Patel", "Mo Larya", "Kevin", "Brandon"]}])
  }

  useEffect(() => {

  }, [games])

  return (
    <div className = "App">
      <header>
        <h1>
          <em className = "name">Fantasy Markets</em>
        </h1>
      </header>

      <button type = "submit" onClick = {createNewGameSession}>Create Game</button>
      
      <Investor />

      {games.map(gameInfo => (
          <div>
            <GameSession gameInfo = {gameInfo} />
          </div>
      ))
      }

    </div>
  )
}

export default App

