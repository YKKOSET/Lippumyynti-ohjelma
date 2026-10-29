import CssBaseline from '@mui/material/CssBaseline'
import { useState } from 'react'
import Typography from '@mui/material/Typography'
import LippuCard from './MUI/LippuCard'
import Lippukortti from './components/Lippukortti'
import Hakupalkki from './components/Hakupalkki'
import './App.css'


function App() {

  const [haettuLippu, setHaettuLippu] = useState(null);

  const lippu3 =
  {
    "id": 1003,
    "koodi": "TESTI-003",
    "kuvaus": "Jo käytetty lippu",
    "hinta": 25,
    "kaytetty": true
  }

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

      <Typography sx={{textAlign: "left", ml: 3, mt: 2}}>Hae lippu sarjanumerolla:</Typography>
      <Hakupalkki onLoytyi={setHaettuLippu} />
      {haettuLippu && <Lippukortti lippu={haettuLippu} />}

      <Typography sx={{textAlign: "left", ml: 3, mt: 2}}>Toisen ryhmän sovelluksen lipulle tilanvaihto:</Typography>
      <Lippukortti lippu={lippu3} />

      <Typography sx={{textAlign: "left", ml: 3, mt: 3}}>Oman sovelluksemme lipulle tilanvaihto:</Typography>
      <LippuCard />

    </>
  )
}

export default App;
