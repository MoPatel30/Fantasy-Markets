import React, { useEffect, useState } from 'react'
import { db } from "../firebase"
import {connect} from "react-redux"
import "./Profile.css"


function Profile({ email, userInfo }) {
    const [name, setName] = useState(userInfo.displayName)
    const [bio, setBio] = useState(`Hi, my name is ${userInfo.displayName}`)
    const [wins, setWins] = useState(0)
    const [totalGames, setTotalGames] = useState(0)

    useEffect(() => {
        var docRef = db.collection("users").doc(email);

        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setName(doc.data().name)
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
        <div style = {{border: "1px solid black", width: "fit-content", padding: "2rem"}}>
            <h3>{name}</h3>
            <img className="profile-pic" src={userInfo.photoURL} alt="Profile Pic" />
            <h3>Bio: {bio}</h3>
            <h3>Wins: {wins}</h3>
            <h3>Games Played: {totalGames}</h3>    
        </div>
    )
}


const mapStateToProps = (state) => ({
    username: state.username,
    email: state.email,
    userInfo: state.userInfo
  })
  
  export default connect(mapStateToProps)(Profile)
  