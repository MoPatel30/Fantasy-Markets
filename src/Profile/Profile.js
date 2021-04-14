import React, { useEffect, useState } from 'react'
import { db } from "../firebase"
import {connect} from "react-redux"
import "./Profile.css"
import store from '../Redux/index'


function Profile({ email, userInfo }) {
    const username = store.getState().username
    const [name, setName] = useState(username)
    const [bio, setBio] = useState(`Hi, my name is ${userInfo.displayName}`)
    const [wins, setWins] = useState(0)
    const [totalGames, setTotalGames] = useState(0)
    const [currentGames, setCurrentGames] = useState(0)
    const[tempBio, setTempBio] = useState("")
    const [editBio, setEditBio] = useState(false)

    function changeBio(){
        setEditBio(!editBio);
    }

    function saveBio(){
        setEditBio(!editBio);
        setBio(tempBio)

    }

    useEffect(() => {
        var docRef = db.collection("users").doc(username);

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setName(doc.data().display_name)
                setBio(doc.data().bio)
                setWins(doc.data().wins)
                setTotalGames(doc.data().previous_games.length)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error)
        })

    }, [])

    return (
        <div className="profile">
            <h3>{name}</h3>
            <img className="profile-pic" src={userInfo.photoURL} alt="Profile Pic" /> 

            {editBio ? (
                <div> 
                    <textarea
                        type="text" 
                        defaultValue={bio}
                        onChange={(e) => setTempBio(e.target.value)}
                    />

                    <button onClick={saveBio}>OK</button>
                    <button onClick={changeBio}>X</button>
                </div>
            ) 
            : (
                <div className="bio-section">
                    <h3>{bio}</h3> 
                    <button onClick={changeBio}>Edit</button>
                </div>
            )}      

            <div className = "stats">
                <div className="box"><span>Wins: <h1>{wins}</h1></span></div>
                <div className="box" ><span>Games Played: <h1>{totalGames}</h1></span></div>  
                <div className="box" ><span>Current Games: <h1>{currentGames}</h1></span></div>    
            </div>
        </div>
    )
}


const mapStateToProps = (state) => ({
    username: state.username,
    email: state.email,
    userInfo: state.userInfo
  })
  
  export default connect(mapStateToProps)(Profile)
  