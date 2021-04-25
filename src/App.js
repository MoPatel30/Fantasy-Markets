import React, {useEffect} from 'react'
import "./App.css"
import Login from "./Login/Login"
import {connect} from "react-redux"
import CreateGame from './CreateGame/CreateGame'
import Profile from "./Profile/Profile"
import FindGames from "./FindGames/FindGames"
import MyGames from "./MyGames/MyGames"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import Test from "./test/test"
import store from "./Redux/index"
import {auth, db} from "./firebase.js"



function App({ username, userInfo }) {

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) { 
        let name = user.email.split("@")   
        var docRef = db.collection("users").doc(name[0]);
        
        docRef.get().then((doc) => {
          store.dispatch({  
              type: "ADD_POST",
              payload: {
                  username: name[0],
                  email: user.email,
                  userInfo: user,
                  MyGames: doc.data().current_games,
                  PreviousGames: doc.data().previous_games
              } 
          }) 
        })
      }
    })
  }, [])

  return (
    <div className = "App">
      { username ? (
        <Router>
          <div>
            <div id="blurry-filter"></div>
            <header>
              <div>
                <article id="title"><span className="parent" style={{color: "white"}}>Fantasy </span><span className="name" style={{color: "#4089F6"}}>Markets</span><br/>
                  <span style={{color: "white"}}>Strategize, Invest, and take your portfolio <em>to the moon!</em></span>
                </article>
                
                <nav>
                  <ul id = "folders">
                    <li><Link to="/find" style={{color:"white"}}>Find a Game</Link></li>
                    <li><Link to="/games" style={{color:"white"}}>My Games</Link></li>
                    <li><Link to="/create" style={{color:"white"}}>Create Game</Link></li>
                  </ul>
                </nav>
                
                <Link to="/profile"> 
                  <a>
                    <img className="home-pro-pic" alt="profile pic" src={userInfo.photoURL} />
                  </a>
                </Link>    
              </div>

              <hr id="header-line" />
            </header>

            <Route path="/" />
            <Route path="/find"  component={FindGames} />
            <Route path="/games"  component={MyGames} />
            <Route path="/create"  component={CreateGame} />
            <Route path="/profile"  component={Profile} />      

          </div>
        </Router>
      ) : (
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

