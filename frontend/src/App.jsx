import CssBaseline from '@mui/material/CssBaseline'
import { useState } from 'react'
import Typography from '@mui/material/Typography'
import LippuCard from './MUI/LippuCard'
import Hakupalkki from './components/Hakupalkki'
import TicketSales from './components/TicketSales'
import './App.css'


function App() {

  const [haettuLippu, setHaettuLippu] = useState(null);

  return (
    <>
      <CssBaseline />

      <Typography sx={{textAlign: "left", ml: 3, mt: 2}}>Hae lippu sarjanumerolla:</Typography>
      <Hakupalkki onLoytyi={setHaettuLippu} />
      {haettuLippu && <LippuCard lippu={haettuLippu} />}

      <TicketSales/>
    </>
  )
}

export default App;
