// npm install @fontsource/redaction

import CssBaseline from '@mui/material/CssBaseline'
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router';
import Typography from '@mui/material/Typography'

import TicketSales from './components/TicketSales'
import Menuvalikko from './components/Menuvalikko'
import Etusivu from './components/Etusivu';
import Tarkistus from './components/Tarkistus';
import Virhe from './components/Virhe';
import YksittainenTapahtuma from './components/YksittainenTapahtuma';

import './App.css'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

const teema = createTheme({
  palette: {
    primary: { main: '#BDC4A7', dark: '#4c4e43', light: '#cad0b9', contrastText: '#141313' },
    secondary: { main: '#2F2F2F', dark: '#131313', light: '#282828', contrastText: '#F3F9D2' },
    text: { primary: '#141313', secondary: '#F3F9D2', accent:'#93827F'},
  },
  typography: {

  },

  components: {
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiInputLabel-root': {
            color: theme.palette.text.primary,
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: theme.palette.text.primary,
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
      },
    },


  }
});


function App() {

  const [haettuLippu, setHaettuLippu] = useState(null);

  return (
    <>
      <ThemeProvider theme={teema}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Menuvalikko />} >
              <Route index element={<Etusivu />} />
              <Route path='myynti' element={<TicketSales />} />
              <Route path='/tarkistus' element={<Tarkistus />} />
              <Route path='tapahtumat/:id' element={<YksittainenTapahtuma />}/>
              <Route path='/virhe' element={<Virhe />} />
              <Route path='*' element={<Virhe virhe='Kyseistä sivua ei ole' />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>

    </>
  )
}

export default App;
