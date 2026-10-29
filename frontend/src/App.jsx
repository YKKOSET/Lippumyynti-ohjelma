import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react'
import LippuCard from './MUI/LippuCard'
import heroImg from './assets/hero.png'
import Lippukortti from './components/Lippukortti'
import './App.css'


function App() {
  const lippu2 =
  {
    "id": 1002,
    "koodi": "TESTI-002",
    "kuvaus": "Käyttämätön lippu",
    "hinta": 25.0,
    "kaytetty": false
  }
  const lippu1 =
  {
    "id": 1001,
    "koodi": "TESTI-001",
    "kuvaus": "Käyttämätön lippu",
    "hinta": 25.0,
    "kaytetty": false
  }

  return (
    <>
      <CssBaseline />
      <Lippukortti lippu={lippu1} />
    </>
  )
}

export default App;
