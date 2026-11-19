import CssBaseline from '@mui/material/CssBaseline'
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router';
import Typography from '@mui/material/Typography'

import TicketSales from './components/TicketSales'
import Menuvalikko from './components/Menuvalikko'
import Etusivu from './components/Etusivu';
import Tarkistus from './components/Tarkistus';
import Virhe from './components/Virhe';

import './App.css'


function App() {

  const [haettuLippu, setHaettuLippu] = useState(null);

  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Menuvalikko />} >
            <Route index element={<Etusivu />} />
            <Route path='myynti' element={<TicketSales />} />
            <Route path='/tarkistus' element={<Tarkistus />} />
            <Route path='/virhe' element={<Virhe />} />
            <Route path='*' element={<Virhe virhe='Kyseistä sivua ei ole' />} />
          </Route>
        </Routes>
      </BrowserRouter>


    </>
  )
}

export default App;
