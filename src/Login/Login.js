import React, {useState} from 'react'
import { connect } from 'react-redux'
import store from ".././Redux/index"
//  import {auth, provider} from "../firebaseSetup"
//  import firebase from "firebase"


export const Login = (props) => {
    // const [userInfo, updateUserInfo] = useState(null)


    const signIn = () => {
        // auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)
        //     .then(function() {
        //         auth
        //         .signInWithPopup(provider)
        //         .then((result) =>{
                    
        //             updateUserInfo(result.user.displayName, result)
    
        //         })
        //         .catch((error) => alert(error.message)) 
        //     })
        
        store.dispatch({
            type: "ADD_POST",
            payload: {
                username: "username",
                userInfo: "logged in"
            } 
        }) 
    }
    
    return (
        <div>

            <button onClick={signIn}>Google</button>
            <h1>{props.userInfo}</h1>
            
        </div>
    )
}


const mapStateToProps = (state) => ({
    username: state.username,
    userInfo: state.userInfo
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
