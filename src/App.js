import React from 'react'
import "./App.css"
import PracticeCounter from "./PracticeCounter/PracticeCounter.jsx"
import Arrays from "./Arrays/Arrays"

// test
//test mola
// final mola test
// looks like everything works for now 1/27 2:51


function App({name}) {
  return (
    <div className = "App">
      <h1>Hello {name}</h1>
      <PracticeCounter />

      
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

