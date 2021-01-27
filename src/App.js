import React from 'react'
import "./App.css"
import PracticeCounter from "./PracticeCounter/PracticeCounter.jsx"
import Arrays from "./Arrays/Arrays"

//test


function App({name}) {
  return (
    <div className = "App">
      <h1 style = {{fontWeight: "900", color: "white"}}>Hello {name}</h1>

      <PracticeCounter />


      <Arrays />

      {
        //test
        /*
      <Arrays />
        */
      }
   
    </div>
  )
}

export default App


export function App2(){
  return(
    <div>
      <p>Hello</p>
    </div>
  )
}

