import React from 'react'
import "./App.css"
import PracticeCounter from "./PracticeCounter/PracticeCounter.jsx"
import Arrays from "./Arrays/Arrays"



function App({name}) {
  return (
    <div className = "App">
      <h1>Hello {name}</h1>
      <PracticeCounter />

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


