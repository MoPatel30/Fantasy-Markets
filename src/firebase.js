import firebase from "firebase"


const firebaseConfig = {

  };

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export {auth, provider}
