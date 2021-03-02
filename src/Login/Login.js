import React, {useState} from 'react'
import "./Login.css"
import { connect } from 'react-redux'
import store from ".././Redux/index"
import {auth, provider} from "../firebase.js"
import firebase from "firebase"


export const Login = (props) => {
    const [userInfo, updateUserInfo] = useState(null)
    const [name, setName] = useState(store.getState().username)

    const signIn = () => {
        auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(function() {
                auth
                .signInWithPopup(provider)
                .then((result) =>{
                    console.log(result)  
                    updateUserInfo(result.user.displayName, result)
                    store.dispatch({
                        type: "ADD_POST",
                        payload: {
                            username: result.user.displayName,
                            userInfo: result.user,
                        } 
                    }) 
                    setName(result.user.displayName)
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
