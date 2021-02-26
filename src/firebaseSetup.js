import firebase from "firebase"


const firebaseConfig = {
    apiKey: "AIzaSyBaKSWpNkKfHJw9pX7NEAMM0VrsBHpqxgw",
    authDomain: "playfantasymarket.firebaseapp.com",
    projectId: "playfantasymarket",
    storageBucket: "playfantasymarket.appspot.com",
    messagingSenderId: "186290164923",
    appId: "1:186290164923:web:2b9ecf8d280e3f671c459e",
    measurementId: "G-TTCEBDPLZP"
  };

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export {auth, provider}
