import React, {useState, useEffect} from 'react'
import "./App.css"
//import Portfolio from "./Portfolio/Portfolio"
import Investor from "./Investors/Investor"
import GameSession from './GameSession/GameSession'
import Login from "./Login/Login"
import {connect} from "react-redux"
import CreateGame from './CreateGame/CreateGame'
import Profile from "./Profile/Profile"
import FindGames from "./FindGames/FindGames"
import MyGames from "./MyGames/MyGames"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Test from "./test/test"


function App({ username, userInfo }) {
  const [games, setGames] = useState([])
  const [showProfile, setShowProfile] = useState(false)
  const [showFindGames, setShowFindGames] = useState(false)
  const [showMyGames, setMyFindGames] = useState(false)

  function createNewGameSession(){
    setGames([...games, {name: "Crypto 101", playerCount: 4, duration: "14 days", amount: 10000, players: ["Mo Patel", "Mo Larya", "Kevin", "Brandon"]}])
  }

  function setProfileVisibility(){
    setShowProfile(!showProfile)
  }

  function setMyGamesVisibility(){
    setShowProfile(!showMyGames)
  }

  function setFindGamesVisibility(){
    setShowFindGames(!showFindGames)
  }

  useEffect(() => {

  }, [games])

  return (
    // <div>
    //   <Test />
    // </div>

    <div className = "App">
      { username ? (
        <Router>
          <div>
            <div id="blurry-filter"></div>
            <header>
            <div>
              <article id="title"><span className="parent">Fantasy</span><br/><span className="name">Markets</span></article>
             
              <Link to="/profile"> 
                <a>
                  <img className="home-pro-pic" src={userInfo.photoURL} />
                </a>
              </Link>
              
            </div>

              <nav>
              <ul id = "folders">
                <li><Link to="/find">Find a Game</Link></li>
                <li><Link to="/games">My Games</Link></li>
                <li><Link to="/create">Create Game</Link></li>
                {/* <li>
                  <a onClick = {setFindGamesVisibility} className = "link" href="#games" style = {{color: "white"}}><strong>Find a Game</strong></a>
                </li>
                <li>
                  <a className = "link" href="create" style = {{color: "white"}}><strong>Create a Game</strong></a>
                  </li>
                <li>
                  <a className = "link" href="mygames" style = {{color: "white"}}><strong>My Games</strong></a>
                </li>
                <li>
                  <a onClick = {setProfileVisibility} className = "link" href="profile" style = {{color: "white"}}><strong>Profile</strong></a>
                </li> */}
              </ul>
              </nav>
  
              <Route path="/" />
              <Route path="/find"  component={FindGames} />
              <Route path="/games"  component={MyGames} />
              <Route path="/create"  component={CreateGame} />
              <Route path="/profile"  component={Profile} />

            </header>

            {showProfile ? (
              <Profile />
            ): (
              <p></p>
            )
            }

            {showFindGames ? (
              <FindGames />
            ): (
              <p></p>
            )
            }

            {showMyGames ? (
              <MyGames />
            ): (
              <p></p>
            )
            }

            {/* <Investor /> */}

         
            {games.map(gameInfo => (
              <div>
                <GameSession gameInfo = {gameInfo} />
              </div>
            ))
            }
        </div>
        </Router>
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

