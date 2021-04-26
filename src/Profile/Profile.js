import React, { useEffect, useState } from 'react'
import { db } from "../firebase"
import {connect} from "react-redux"
import "./Profile.css"
import store from '../Redux/index'
import GameModal from "../GameModal/GameModal"
import IconButton from '@material-ui/core/IconButton';
//import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import Select from "react-select";


function Profile({ email, userInfo }) {
    const username = store.getState().username
    const [name, setName] = useState(username)
    const [bio, setBio] = useState(`Hi, my name is ${userInfo.displayName}`)
    const [wins, setWins] = useState(0)
    const [totalGames, setTotalGames] = useState(0)
    const [currentGames, setCurrentGames] = useState(store.getState().MyGames.length)
    const [userPreviousGames, setUserPreviousGames] = useState(store.getState().PreviousGames)
    const[tempBio, setTempBio] = useState("")
    const [editBio, setEditBio] = useState(false)
    const [games, setGames] = useState([])
    const [previousGames, setPreviousGames] = useState([])
    const [open, setOpen] = useState(false);
    const [modalGameInfo, setModalGameInfo] = useState(null)

    function changeBio(){
        setEditBio(!editBio)
    }

    const handleClickOpen = (instance) => {
        setOpen(true)
        setModalGameInfo(instance)
    }

    const handleClose = () => {
        setOpen(false)
    }
      

    function saveBio(){
        setEditBio(!editBio)
        setBio(tempBio)

        if(tempBio.length > 140){
            alert("New bio is too long. Please shorten it.")
        }
        else{
            var docRef = db.collection("users").doc(username)
            docRef.update({bio: tempBio})
        }
    }

    useEffect(() => {
        var docRef = db.collection("users").doc(username);

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setName(doc.data().display_name)
                setBio(doc.data().bio)
                setWins(doc.data().wins)
                setUserPreviousGames(doc.data().previous_games)
                setTotalGames(doc.data().previous_games.length)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error)
        })

        db.collection('previous_games').onSnapshot(snapshot => {          
            setGames(snapshot.docs.map(doc => doc))  
        })

    }, [])

    useEffect(() => {
        for(let i = 0; i < games.length; i++){
            if(userPreviousGames.indexOf(games[i].id) !== -1){
                setPreviousGames([...previousGames, games[i]])
            }
        }
    }, [games])

    return (
        <div className="profile">
            <h3>{name}</h3>
            <img className="profile-pic" src={userInfo.photoURL} alt="Profile Pic" /> 

            {editBio ? (
                <div className = "bio-size"> 
                    <textarea
                        type="text" 
                        maxLength="140"
                        rows = "4"
                        cols = "50"
                        defaultValue={bio}
                        onChange={(e) => setTempBio(e.target.value)}
                    />

                    <button className = "BTN"onClick={saveBio}>OK</button>
                    <button className = "BTN" onClick={changeBio}>X</button>
                </div>
            ) 
            : (
                <div className="bio-section">
                    <h3>{bio}</h3> 
                    <button onClick={changeBio}>Edit</button>
                </div>
            )}      

            <div className = "stats">
                <div className="box"><span> <u>Wins</u> <h1>{wins}</h1></span></div>
                <div className="box" ><span> <u>Games Played</u> <h1>{totalGames}</h1></span></div>  
                <div className="box" ><span> <u>Current Games</u> <h1>{currentGames}</h1></span></div>    
            </div>

            {previousGames.length === 0 ? (
                    <p style={{color: "white"}}>Looks like you haven't completed a game yet. Head over to "Find a Game" to join a game session or "Create a Game" to create a new game session!</p>
                ) : (
                previousGames.map((instance) => (
                    <div>
                        <div onClick={() => handleClickOpen(instance)} className="flip-card">                   
                            <div id="spanner">
                                <h2><u>{instance.data().name}</u></h2>
                                <h3>Created By: {instance.data().creator}</h3>
                                <br />
                                <hr style={{width: "100%"}} />
                            </div>
                            <br />
                            <div id="Midspanner">                                 
                                <h3>{instance.data().player_count} / {instance.data().max_players} <br /> Players</h3>
                            </div>
                            <br />
                            <hr style={{width: "100%"}} />
                            <br />
                            <div id="non-spanner">
                                <h3>Starting Amount: {instance.data().starting_amount} USD</h3>
                                <h3>Start date: {String(new Date(instance.data().start_date)).substring(0,16)}</h3>
                            </div>

                            <div id="spanner">                                 
                                <h3>Players: {instance.data().players.length} / {instance.data().max_players}</h3>
                            </div>     
                        </div>
                    </div>      
                )))
                } 
            <Dialog style = {{maxWidth: "100%"}} fullScreen open = {open}>
                <Toolbar style = {{maxWidth: "90%"}}> 
                    <IconButton edge="start" color="black" onClick={handleClose} aria-label="close">
                        <p> Close </p>
                    </IconButton>
                </Toolbar>
                <GameModal gameInfo={modalGameInfo} />
            </Dialog> 
        </div>
    )
}


const mapStateToProps = (state) => ({
    username: state.username,
    email: state.email,
    userInfo: state.userInfo
  })
  
  export default connect(mapStateToProps)(Profile)
  