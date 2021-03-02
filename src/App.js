import React, {useState, useEffect} from 'react'
import "./App.css"
import Stocks from "./Stocks/Stocks"
import Portfolio from "./Portfolio/Portfolio"
import Investor from "./Investors/Investor"
import GameSession from './GameSession/GameSession'
import Login from "./Login/Login"
import {connect} from "react-redux"


function App({ username }) {
  const [games, setGames] = useState([])

  function createNewGameSession(){
    setGames([...games, {name: "Crypto 101", playerCount: 4, duration: "14 days", amount: 10000, players: ["Mo Patel", "Mo Larya", "Kevin", "Brandon"]}])
  }

  useEffect(() => {

  }, [games])

  return (
    <div className = "App">
      { username ? (
          <div>
            <header>
              <h1>
                <em className = "name">Fantasy Markets</em>
              </h1>

              <ul className = "link-style">
                <li>
                  <a className = "link" href="#game" style = {{color: "white"}}><strong>Find a Game</strong></a>
                </li>
                <li>
                  <a className = "link" href="#mygames" style = {{color: "white"}}><strong>Create a Game</strong></a>
                  </li>
                <li>
                  <a className = "link" href="#league" style = {{color: "white"}}><strong>My Games</strong></a>
                </li>
                <li>
                  <a className = "link" href="#profile" style = {{color: "white"}}><strong>Profile</strong></a>
                </li>
              </ul>

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
      ):(
        <div>
          <Login />
        </div>
      )
      }
    </div>
  )
}

const mapStateToProps = (state) => ({
  username: state.username,
  userInfo: state.userInfo
})

export default connect(mapStateToProps)(App)

