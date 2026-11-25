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
import Tapahtumalomake from './components/Tapahtumalomake';

import './App.css'

import { ThemeProvider, createTheme, darken } from '@mui/material/styles';

const teema = createTheme({
  palette: {
    primary: { main: '#BDC4A7', dark: '#4c4e43', light: '#cad0b9', contrastText: '#141313' },
    secondary: { main: '#2F2F2F', dark: '#131313', light: '#282828', contrastText: '#F3F9D2' },
    text: { primary: '#141313', secondary: '#F3F9D2', accent: '#93827F' },
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

    //tapahtumakortti ottaa määritykset täältä korttiin ja kortin sisällä olevaan painikkeeseen
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.text.primary,
          maxWidth: 200,
          minHeight: 140,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 5,
          border: `1px solid ${darken(theme.palette.primary.main, 0.15)}`,
          boxShadow: theme.shadows[4],
          '&:hover': {
            boxShadow: theme.shadows[8],
          },
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          flexGrow: 1, //estää hypähdyksen lisätietoja avattaessa
        },
      },
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          flexGrow: 1,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
        }),
      }, //koskee vain painikkeita joissa variant="contained" color="secondary"
      variants: [
        {
          props: { variant: 'contained', color: 'secondary' },
          style: ({ theme }) => ({
            marginTop: theme.spacing(2),
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            borderRadius: 2,
            padding: '3px 16px',
            '&:hover': {
              backgroundColor: theme.palette.secondary.dark,
            },
          }),
        },
      ],
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
              <Route path='/lisaatapahtuma' element={<Tapahtumalomake />} />
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
