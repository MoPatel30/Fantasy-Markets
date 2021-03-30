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
  return (
    <div className = "App">
      { username ? (
        <Router>
          <div>
            <div id="blurry-filter"></div>
            <header>
            <div>
              <article id="title"><span className="parent" style={{color: "#DB1F48"}}>Fantasy</span><br/><span className="name" style={{color: "#004369"}}>Markets</span></article>
             
              <Link to="/profile"> 
                <a>
                  <img className="home-pro-pic" src={userInfo.photoURL} />
                </a>
              </Link>
              
            </div>

            <hr id="header-line" />

              <nav>
              <ul id = "folders">
                <li><Link to="/find">Find a Game</Link></li>
                <li><Link to="/games">My Games</Link></li>
                <li><Link to="/create">Create Game</Link></li>
              </ul>
              </nav>
  
              <Route path="/" />
              <Route path="/find"  component={FindGames} />
              <Route path="/games"  component={MyGames} />
              <Route path="/create"  component={CreateGame} />
              <Route path="/profile"  component={Profile} />

            </header>

            {/* <Investor /> */}
   
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

