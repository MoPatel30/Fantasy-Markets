import React from 'react'
import "./App.css"
import PracticeCounter from "./PracticeCounter/PracticeCounter.jsx"
import Arrays from "./Arrays/Arrays"

// test

function App({name}) {
  return (
    <div className = "App">
      <h1>Hello {name}</h1>
      <PracticeCounter />

      {
        /*
      <Arrays />
        */
      }
   
    </div>
  )
}

export default App


