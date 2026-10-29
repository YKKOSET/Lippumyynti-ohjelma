import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react'
import Typography from '@mui/material/Typography';
import LippuCard from './MUI/LippuCard'
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

      <Typography sx={{textAlign: "left", ml: 3, mt: 2}}>Toisen ryhmän sovelluksen lipulle tilanvaihto:</Typography>
      <Lippukortti lippu={lippu1} />

      <Typography sx={{textAlign: "left", ml: 3, mt: 3}}>Oman sovelluksemme lipulle tilanvaihto:</Typography>
      <LippuCard />

    </>
  )
}

export default App;
