import React, {useState, useEffect} from 'react'
import "./Login.css"
import { connect } from 'react-redux'
import store from ".././Redux/index"
import {auth, provider, db} from "../firebase.js"
import firebase from "firebase"


export const Login = (props) => {
    const [userInfo, updateUserInfo] = useState(null)

    const signIn = () => {
        auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(function() {
                auth
                .signInWithPopup(provider)
                .then((result) =>{
                    console.log(result)  
                    updateUserInfo(result.user.displayName, result)

                    let username = result.user.email.split("@")[0]
                    console.log(username)
                    
                    var docRef = db.collection("users").doc(username);
                    // check if user credentials already exist. add new user data if they don't.
                    docRef.get().then((doc) => {
                        if (doc.exists) {
                            store.dispatch({     // store user info in global state 
                                type: "ADD_POST",
                                payload: {
                                    username: username,
                                    email: result.user.email,
                                    userInfo: result.user,
                                    MyGames: doc.data().current_games,
                                    PreviousGames: doc.data().previous_games           
                                } 
                            }) 
                            console.log("Document data:", doc.data());
                        } else {
                            // doc.data() will be undefined in this case
                            console.log("No such document!");
                            db.collection("users").doc(username).set({
                                display_name: username,
                                bio: `Hi, my name is ${result.user.displayName}!`,
                                lastCreatedSession: new Date().getTime - 90000000,
                                wins: 0,
                                current_games: [],
                                previous_games: [],
                                games_won: []
                            })
                            .then(() => {
                                console.log("Document successfully written!")
                            })
                            .catch((error) => {
                                console.error("Error writing document: ", error)
                            })
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error)
                    })

                })
                .catch((error) => alert(error.message)) 
            })
    }

    
    return (
        <div className="background">

            <div className="body">
                <h1 className="header">Fantasy Markets</h1>

                <h4 className="slogan">Strategize, Invest, and take your portfolio <em>to the moon!</em></h4>

                <button className="google" onClick={signIn}>Google</button>   
            </div>
         
        </div>
    )
}


const mapStateToProps = (state) => ({
    username: state.username,
    userInfo: state.userInfo
})

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
