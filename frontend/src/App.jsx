import CssBaseline from '@mui/material/CssBaseline';
import { useState } from 'react'
import LippuCard from './MUI/LippuCard'
import CssBaseline from '@mui/material/CssBaseline';
import heroImg from './assets/hero.png'
import Lippukortti from './components/Lippukortti'
import './App.css'


function App() {
  const lippu1 = [
    {
      "esityskerta": {
        "alkuaika": "2028-10-01T16:00:00.000Z",
        "maxOsallistujat": 100,
        "paikka": {
          "id": 1,
          "nimi": "Esimerkkipaikka",
          "katuosoite": "Esimerkkikatu 1",
          "postinumero": {
            "postinumero": "00100",
            "postitoimipaikka": "Helsinki"
          }
        }
      },
      "lipputyyppi": {
        "id_": 4,
        "nimi_": "Normaalihintainen"
      },
      "hinta": 20.00,
      "kaytetty": false,
      "id": "c0b0c641-1ffa-4e60-b269-d717ab1c174f"
    }
  ]
  const lippu2 = [
    {
      "esityskerta": {
        "alkuaika": "2028-10-01T16:00:00.000Z",
        "maxOsallistujat": 100,
        "paikka": {
          "id": 1,
          "nimi": "Esimerkkipaikka",
          "katuosoite": "Esimerkkikatu 1",
          "postinumero": {
            "postinumero": "00100",
            "postitoimipaikka": "Helsinki"
          }
        }
      },
      "lipputyyppi": {
        "id_": 3,
        "nimi_": "Eläkeläinen"
      },
      "hinta": 10.00,
      "kaytetty": false,
      "id": "56bc99fb-3b56-40cd-a74e-341a2e3a0baf"
    }
  ]

  return (
    <>
      <CssBaseline />
      <Lippukortti lippu={lippu1} />
    </>
  )
}

export default App;
