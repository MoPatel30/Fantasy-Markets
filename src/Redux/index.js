import {createStore} from "redux"


const initialState = {
    username: "",
    userInfo: "not logged in",
}

const reducer = (state = initialState, action) => {
    if(action.type === "ADD_POST"){
        return Object.assign({}, state, {
            username: action.payload.username,
            userInfo: action.payload.userInfo
        })
    }

    return state
}


const store = createStore(reducer)

export default store