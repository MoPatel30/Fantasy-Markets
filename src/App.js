import React from 'react'
import "./App.css"
import PracticeCounter from "./PracticeCounter/PracticeCounter.jsx"



function App({name}) {
  return (
    <div className = "App">
      <h1>Hello {name}</h1>
      <PracticeCounter />
    </div>
  )
}

export default App


