import CssBaseline from '@mui/material/CssBaseline'
import { useState } from 'react'
import Typography from '@mui/material/Typography'

import LippuCard from './MUI/LippuCard'
import Hakupalkki from './components/Hakupalkki'
import TicketSales from './components/TicketSales'
import Menuvalikko from './components/Menuvalikko'
import Lippukortti from './components/Lippukortti'
import Lippulistaus from './components/lippulistaus'

import './App.css'


function App() {

  const [haettuLippu, setHaettuLippu] = useState(null);

  return (
    <>
      <CssBaseline />

       <Menuvalikko />

    </>
  )
}

export default App;
