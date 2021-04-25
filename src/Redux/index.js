import {createStore} from "redux"


const initialState = {
    username: "",
    email: "",
    userInfo: "not logged in",
    MyGames: [],
    PreviousGames: []
}

const reducer = (state = initialState, action) => {
    if(action.type === "ADD_POST"){
        return Object.assign({}, state, {
            username: action.payload.username,
            email: action.payload.email,
            userInfo: action.payload.userInfo,
            MyGames: action.payload.MyGames,
            PreviousGames: action.payload.PreviousGames
        })
    }
    if(action.type === "UPDATE_GAMES"){
        return Object.assign({}, state, {
            MyGames: action.payload.MyGames
        })
    }
    return state
}


const store = createStore(reducer)

export default store